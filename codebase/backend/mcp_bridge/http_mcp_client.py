"""Generic streamable-HTTP MCP client.

Used for the locally-run servers (discord_mcp, gmail_mcp) — unauthenticated on
localhost — and for Google's hosted Calendar MCP server
(calendarmcp.googleapis.com), which needs an OAuth bearer token per call. All
of them do plain per-call request/response with no persistent session state to
preserve, so a fresh connection per tool call is the simplest correct approach.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

import httpx
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

TIMEOUT = 30


@asynccontextmanager
async def connect(url: str, headers: dict[str, str] | None = None) -> AsyncIterator[ClientSession]:
    async with httpx.AsyncClient(headers=headers or {}, timeout=TIMEOUT) as http_client:
        async with streamable_http_client(url, http_client=http_client) as (read, write, _):
            async with ClientSession(read, write) as session:
                await session.initialize()
                yield session


async def call_tool_text(
    url: str,
    name: str,
    arguments: dict[str, Any],
    headers: dict[str, str] | None = None,
) -> str:
    """Call a tool on the server at `url` and return its concatenated text content.

    Raises on transport failure or if the tool itself reports an error, so
    callers can funnel exceptions through the same `err()` helper other tools use.
    """
    async with connect(url, headers) as session:
        result = await session.call_tool(name, arguments)
        text = "\n".join(block.text for block in result.content if hasattr(block, "text"))
        if result.isError:
            raise RuntimeError(f"MCP tool '{name}' at {url} returned an error: {text}")
        return text


async def call_tool_structured(
    url: str,
    name: str,
    arguments: dict[str, Any],
    headers: dict[str, str] | None = None,
) -> dict[str, Any]:
    """Call a tool and return its `structuredContent` (the object matching the
    tool's declared outputSchema). Google's Calendar MCP tools all declare one,
    so callers get real Event objects instead of re-parsing formatted text.

    Falls back to `{}` if the server returned only text content.
    """
    async with connect(url, headers) as session:
        result = await session.call_tool(name, arguments)
        if result.isError:
            text = "\n".join(block.text for block in result.content if hasattr(block, "text"))
            raise RuntimeError(f"MCP tool '{name}' at {url} returned an error: {text}")
        return result.structuredContent or {}
