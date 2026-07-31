"""Outlook connection status and sign-in for the "Quản lý kết nối" UI.

Unlike the unified Google connection, there's no OAuth handshake this
backend drives directly — outlook-local-mcp's Docker container owns its own
account registry and device-code sign-in (see codebase/mcp/outlook_mcp/README.md).

get_status() is a passive, no-Graph-call read of that registry (`system.status`)
for the connections panel's dot/label. It's best-effort: if Docker/the image
isn't available, it reports disconnected rather than raising.

start_connect()/get_connect_status() are the real sign-in trigger, wired to
the panel's "Connect" button. They drive mcp_bridge.outlook_client's one
shared, kept-open container (see that module's docstring for why a fresh
container per call doesn't work for this server, for the sign-in *or* for
ordinary tool calls) — start_connect() schedules a poll loop on that same
shared session and returns quickly with either "already connected" or the
device-code text to show the user; the FE polls get_connect_status() for
the rest of the wait.
"""

from __future__ import annotations

import asyncio
import json
import threading
import time
from typing import Any

from mcp import ClientSession

from mcp_bridge.outlook_client import call_tool_text, close_shared_session, get_shared_session, run_sync, schedule
from studypulse.mail_ingest import trigger_ingestion_async

# The exact prefix of the message outlook-local-mcp's device-code fallback
# returns as normal (non-error) tool text when no cached token is valid yet
# (see internal/auth/middleware.go's presentDeviceCode) — used to tell "still
# needs sign-in" apart from a real calendar list in the same text field.
DEVICE_CODE_MARKER = "To sign in, use a web browser"

# While the background auth goroutine (inside the container we're holding
# open) hasn't finished yet, every retry deliberately comes back as an MCP
# *error* result containing this substring (see internal/auth/middleware.go's
# pendingAuthMessage / "still in progress" — asserted verbatim by the
# vendored project's own tests). That's expected mid-wait, not a real
# failure — only an error NOT containing this substring means something
# actually went wrong.
STILL_IN_PROGRESS_MARKER = "still in progress"

POLL_INTERVAL_SECONDS = 5
MAX_WAIT_SECONDS = 15 * 60  # matches the device code's own ~15 min expiry
STARTUP_WAIT_SECONDS = 10  # how long start_connect() blocks for the initial response

_state_lock = threading.Lock()
_state: dict[str, Any] = {"status": "idle", "message": ""}


def get_status() -> dict[str, Any]:
    try:
        raw = asyncio.run(call_tool_text("system", {"operation": "status", "output": "summary"}))
        payload = json.loads(raw)
    except Exception:
        return {"connected": False, "accounts": []}
    accounts = payload.get("accounts", [])
    connected = any(account.get("authenticated") for account in accounts)
    return {"connected": connected, "accounts": accounts}


def _set_state(status: str, message: str = "") -> None:
    with _state_lock:
        _state["status"] = status
        _state["message"] = message


def get_connect_status() -> dict[str, Any]:
    with _state_lock:
        return dict(_state)


async def _probe(session: ClientSession) -> tuple[bool, str]:
    """One calendar probe against the shared session. Returns (still_waiting,
    text) — still_waiting is True both for the initial device-code prompt
    and for the "still in progress" retries; only a genuinely different
    error raises."""
    result = await session.call_tool("calendar", {"operation": "list_calendars"})
    text = "\n".join(block.text for block in result.content if hasattr(block, "text"))
    if not result.isError:
        return text.startswith(DEVICE_CODE_MARKER), text
    if STILL_IN_PROGRESS_MARKER in text:
        return True, text
    raise RuntimeError(f"Outlook MCP tool 'calendar' returned an error: {text}")


async def _connect_flow() -> None:
    """Runs on mcp_bridge.outlook_client's shared background loop (scheduled
    by start_connect() via schedule()) — safe to call get_shared_session()
    directly since we're already on the right loop."""
    try:
        session = await get_shared_session()
        waiting, text = await _probe(session)
        if not waiting:
            _set_state("connected", "Outlook đã kết nối.")
            trigger_ingestion_async("outlook")
            return

        _set_state("pending", text)
        waited = 0
        while waited < MAX_WAIT_SECONDS:
            await asyncio.sleep(POLL_INTERVAL_SECONDS)
            waited += POLL_INTERVAL_SECONDS
            waiting, _ = await _probe(session)
            if not waiting:
                _set_state("connected", "Đã đăng nhập Outlook thành công.")
                trigger_ingestion_async("outlook")
                return
        _set_state("timeout", "Hết thời gian chờ đăng nhập Outlook — bấm Kết nối để thử lại.")
    except Exception as exc:
        _set_state("failed", str(exc))


def start_connect() -> dict[str, Any]:
    """Trigger (or check on) an Outlook sign-in. Returns quickly once the
    initial response is known — either already connected, or the device-code
    text to show the user — without waiting for the full sign-in wait.

    A prior "connected" result is trusted as-is rather than re-verified,
    deliberately: re-checking would mean an extra round-trip through the
    shared session just to ask, and the actual mail/calendar tool calls will
    surface it plainly if the token has since gone stale (same as any other
    Outlook tool call)."""
    with _state_lock:
        if _state["status"] in ("starting", "pending", "connected"):
            return dict(_state)
        _state["status"] = "starting"
        _state["message"] = ""

    schedule(_connect_flow())

    for _ in range(int(STARTUP_WAIT_SECONDS / 0.5)):
        time.sleep(0.5)
        with _state_lock:
            if _state["status"] != "starting":
                return dict(_state)
    return get_connect_status()


async def _logout_default_account_safe() -> None:
    # Best-effort: clears the cached tokens for the "default" account so a
    # future connect actually re-prompts instead of silently reusing
    # whatever the still-open container remembers. Doesn't revoke the OAuth
    # grant with Microsoft (see account.logout's own docs) — only local state.
    try:
        session = await get_shared_session()
        await session.call_tool("account", {"operation": "logout", "label": "default"})
    except Exception:
        pass  # no session open, or nothing to log out — fine, we're closing it anyway


def disconnect() -> None:
    """Clear the Outlook sign-in: log the account out server-side (clears
    its cached tokens) and close our held-open container so the next
    "Connect" click starts a genuinely fresh session."""
    try:
        run_sync(_logout_default_account_safe(), timeout=15)
    finally:
        run_sync(close_shared_session(), timeout=15)
        _set_state("idle", "")
