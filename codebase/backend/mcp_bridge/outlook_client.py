"""stdio MCP client for outlook_mcp's Dockerized Go server (outlook-local-mcp).

Unlike discord_mcp/gmail_mcp (streamable-HTTP servers —
see http_mcp_client.py), outlook-local-mcp only speaks MCP over stdio, no
HTTP mode exists in the binary (see codebase/mcp/outlook_mcp/README.md).

Everything here goes through ONE persistent container, kept open for as
long as this backend process runs (see the shared-session section below) —
NOT a fresh `docker run` per call the way http_mcp_client.call_tool_text
does for the HTTP servers. Two things were tried and confirmed NOT to work
for this server, in order:

1. Fresh container per call, relying on the named volume's cached token.
   Breaks the sign-in itself: device-code auth runs as a background
   goroutine *inside the one container process* that requested the code
   (see the Go server's handleDeviceCodeAuth) — closing that container right
   after its quick first response (the device-code text) kills the
   goroutine before it can finish, so the volume never actually gets a
   token no matter how many times the user completes the browser step.
2. Fixing (1) so the volume genuinely has a valid, persisted, correctly-
   encrypted token (confirmed via `docker run ... alpine ls` — the file is
   there, right size, right place) still doesn't help: a brand new
   container spawned afterward hangs for the full Graph request timeout
   (~30s) and falls back to ANOTHER fresh device-code prompt instead of
   silently reusing it. Root cause not fully isolated (likely something in
   how DeviceCodeCredential.GetToken() handles a persisted-but-cross-process
   cache) — but empirically, a single container that authenticates once and
   is simply never closed keeps working fine for as long as it's kept open.

So: exactly one container, opened lazily on first use and kept open for the
life of this backend process, reused by every caller — both
outlook_connection.py's sign-in flow and every chat tool call. If the user
restarts the backend, one fresh sign-in is needed again; within one run,
sign in once and every subsequent call (chat-triggered or not) reuses it.
"""

from __future__ import annotations

import asyncio
import os
import threading
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import timedelta
from typing import Any, Callable, Coroutine

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

CALL_TIMEOUT = timedelta(seconds=60)


def _docker_run_args() -> list[str]:
    image = os.environ.get("OUTLOOK_MCP_IMAGE", "outlook-local-mcp:local")
    volume = os.environ.get("OUTLOOK_MCP_VOLUME", "outlook-mcp-auth")
    return [
        "run",
        "--rm",
        "-i",
        # Belt-and-suspenders: even though the shared session below avoids
        # depending on cross-container cache reuse, these still make the
        # cache land inside the mounted volume with a stable encryption key
        # (see internal/auth/filecache.go deriveMachineKey) rather than the
        # container's throwaway filesystem — harmless, and needed if this
        # image is ever run outside the shared-session pattern (e.g. the
        # plain codebase/mcp/outlook_mcp/README.md usage example).
        "--hostname",
        "outlook-local-mcp",
        "-e",
        "HOME=/data/auth",
        "-v",
        f"{volume}:/data/auth",
        "-e",
        f"OUTLOOK_MCP_CLIENT_ID={os.environ.get('OUTLOOK_MCP_CLIENT_ID', 'd3590ed6-52b3-4102-aeff-aad2292ab01c')}",
        "-e",
        f"OUTLOOK_MCP_TENANT_ID={os.environ.get('OUTLOOK_MCP_TENANT_ID', 'common')}",
        "-e",
        f"OUTLOOK_MCP_MAIL_ENABLED={os.environ.get('OUTLOOK_MCP_MAIL_ENABLED', 'true')}",
        "-e",
        f"OUTLOOK_MCP_MAIL_MANAGE_ENABLED={os.environ.get('OUTLOOK_MCP_MAIL_MANAGE_ENABLED', 'false')}",
        "-e",
        "OUTLOOK_MCP_READ_ONLY=true",
        "-e",
        f"OUTLOOK_MCP_DEFAULT_TIMEZONE={os.environ.get('OUTLOOK_MCP_DEFAULT_TIMEZONE', 'Asia/Ho_Chi_Minh')}",
        "-e",
        f"OUTLOOK_MCP_LOG_LEVEL={os.environ.get('OUTLOOK_MCP_LOG_LEVEL', 'warn')}",
        image,
    ]


@asynccontextmanager
async def open_session() -> AsyncIterator[ClientSession]:
    """Open one docker-run container as a raw MCP session. Low-level — most
    callers want call_tool_text (chat tools) or run_on_shared_session
    (outlook_connection.py's sign-in flow), both of which reuse the one
    shared, kept-open session rather than spawning a new container."""
    params = StdioServerParameters(command="docker", args=_docker_run_args())
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            yield session


async def call_tool(session: ClientSession, name: str, arguments: dict[str, Any]) -> str:
    """Call a domain tool on an already-open session and return its text
    content, raising on transport/tool error."""
    result = await session.call_tool(name, arguments, read_timeout_seconds=CALL_TIMEOUT)
    text = "\n".join(block.text for block in result.content if hasattr(block, "text"))
    if result.isError:
        raise RuntimeError(f"Outlook MCP tool '{name}' returned an error: {text}")
    return text


# --- Shared persistent session -------------------------------------------

_shared_lock = threading.Lock()
_shared_loop: asyncio.AbstractEventLoop | None = None
_shared_session_cm: Any = None
_shared_session: ClientSession | None = None


def _ensure_shared_loop() -> asyncio.AbstractEventLoop:
    global _shared_loop
    with _shared_lock:
        if _shared_loop is None:
            loop = asyncio.new_event_loop()
            threading.Thread(target=loop.run_forever, daemon=True).start()
            _shared_loop = loop
        return _shared_loop


async def _open_shared_session() -> ClientSession:
    global _shared_session_cm, _shared_session
    cm = open_session()
    session = await cm.__aenter__()
    _shared_session_cm = cm
    _shared_session = session
    return session


async def _close_shared_session() -> None:
    global _shared_session_cm, _shared_session
    cm, _shared_session_cm = _shared_session_cm, None
    _shared_session = None
    if cm is not None:
        try:
            await cm.__aexit__(None, None, None)
        except Exception:
            pass


async def _get_shared_session() -> ClientSession:
    """Return the one persistent MCP session, opening it (spawning the one
    container) if not already open. MUST only be awaited from a coroutine
    running on the shared background loop — see run_on_shared_session."""
    if _shared_session is None:
        await _open_shared_session()
    return _shared_session


def schedule(coro: Coroutine[Any, Any, Any]) -> None:
    """Fire-and-forget: schedule an arbitrary coroutine on the shared
    background loop and return immediately without waiting on it. Use this
    for a long-running task like outlook_connection.py's sign-in poll loop,
    which needs to keep running on the shared loop independently of
    whoever kicked it off — as opposed to one quick call against the
    session (run_on_shared_session) or one that must block for a result
    (run_sync). Deliberately does NOT wrap the result with
    asyncio.wrap_future — that requires a "current event loop" in the
    calling thread, which a FastAPI sync endpoint's worker thread doesn't
    have, and nothing here needs to await this anyway."""
    loop = _ensure_shared_loop()
    asyncio.run_coroutine_threadsafe(coro, loop)


def run_sync(coro: Coroutine[Any, Any, Any], timeout: float | None = None) -> Any:
    """Run a coroutine on the shared background loop and block the calling
    (non-async) thread for its result — for plain sync call sites like
    outlook_connection.disconnect(), as opposed to schedule()'s
    asyncio-awaitable return which only works from inside a running loop."""
    loop = _ensure_shared_loop()
    return asyncio.run_coroutine_threadsafe(coro, loop).result(timeout=timeout)


async def get_shared_session() -> ClientSession:
    """Return the one persistent MCP session, opening it (spawning the one
    container) if not already open. Only await this from a coroutine
    already running on the shared background loop (e.g. one scheduled via
    schedule()) — from anywhere else, use run_on_shared_session instead."""
    return await _get_shared_session()


async def close_shared_session() -> None:
    """Force-close the shared session so the next use reopens a fresh one —
    e.g. after a call fails and the container may have died."""
    await _close_shared_session()


async def run_on_shared_session(coro_fn: Callable[[ClientSession], Coroutine[Any, Any, Any]]) -> Any:
    """Run `coro_fn(session)` on the shared background loop against the one
    persistent session (opening it first if needed), and await the result
    from the caller's own loop/thread. `coro_fn` must not stash the session
    for later use outside this call — it can be closed/reopened between
    calls (e.g. on retry). Awaits the underlying concurrent.futures.Future
    via run_in_executor rather than asyncio.wrap_future, so this works
    regardless of whether the calling thread has a "current event loop" set
    (wrap_future requires one; a bare thread pool worker doesn't have one)."""
    loop = _ensure_shared_loop()

    async def runner() -> Any:
        session = await _get_shared_session()
        return await coro_fn(session)

    future = asyncio.run_coroutine_threadsafe(runner(), loop)
    return await asyncio.get_running_loop().run_in_executor(None, future.result)


def _reset_shared_session(_session: ClientSession) -> Coroutine[Any, Any, None]:
    return _close_shared_session()


async def call_tool_text(name: str, arguments: dict[str, Any]) -> str:
    """Call a domain tool ("mail", "calendar", "system") using the one
    persistent shared session, opening it if needed. Retries once against a
    freshly (re)opened session if the call fails — e.g. the container died —
    since that's cheaper than diagnosing every possible transport failure."""

    async def attempt(session: ClientSession) -> str:
        return await call_tool(session, name, arguments)

    try:
        return await run_on_shared_session(attempt)
    except Exception:
        await run_on_shared_session(_reset_shared_session)
        return await run_on_shared_session(attempt)
