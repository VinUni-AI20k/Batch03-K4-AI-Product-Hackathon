"""Generic streamable-HTTP MCP client for locally-run servers (discord_mcp,
google_calendar_mcp). Both servers are unauthenticated on localhost and do
plain per-call request/response (no persistent session state to preserve),
so a fresh connection per tool call is the simplest correct approach.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client


@asynccontextmanager
async def connect(url: str) -> AsyncIterator[ClientSession]:
    async with streamable_http_client(url) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            yield session


async def call_tool_text(url: str, name: str, arguments: dict[str, Any]) -> str:
    """Call a tool on the server at `url` and return its concatenated text content.

    Raises on transport failure or if the tool itself reports an error, so
    callers can funnel exceptions through the same `err()` helper other tools use.
    """
    async with connect(url) as session:
        result = await session.call_tool(name, arguments)
        text = "\n".join(block.text for block in result.content if hasattr(block, "text"))
        if result.isError:
            raise RuntimeError(f"MCP tool '{name}' at {url} returned an error: {text}")
        return text
