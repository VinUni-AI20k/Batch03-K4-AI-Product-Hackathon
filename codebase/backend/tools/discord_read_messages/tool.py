from __future__ import annotations

import asyncio
from typing import Any

from mcp_bridge.http_mcp_client import call_tool_text
from tools._shared import DISCORD_MCP_URL, err


def discord_read_messages(channel_id: str = "", count: int = 50) -> dict[str, Any]:
    """Read recent message history from a Discord channel (read-only). Get channel_id from discord_find_channel first."""
    try:
        args = {"channel_id": channel_id, "count": str(count)}
        text = asyncio.run(call_tool_text(DISCORD_MCP_URL, "read_messages", args))
        return {"tool": "discord_read_messages", "channel_id": channel_id, "text": text}
    except Exception as exc:
        return err("discord_read_messages", exc)
