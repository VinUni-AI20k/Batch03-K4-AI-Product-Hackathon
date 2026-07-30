from __future__ import annotations

import asyncio
from typing import Any

from mcp_bridge.http_mcp_client import call_tool_text
from tools._shared import GMAIL_MCP_URL, err


def gmail_read_thread(thread_id: str = "") -> dict[str, Any]:
    """Read the full content of one Gmail thread found via gmail_search."""
    try:
        text = asyncio.run(call_tool_text(GMAIL_MCP_URL, "get_thread", {"thread_id": thread_id}))
        return {"tool": "gmail_read_thread", "thread_id": thread_id, "text": text}
    except Exception as exc:
        return err("gmail_read_thread", exc)
