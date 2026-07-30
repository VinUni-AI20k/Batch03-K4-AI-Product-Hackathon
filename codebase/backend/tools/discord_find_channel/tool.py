from __future__ import annotations

import asyncio
from typing import Any

from mcp_bridge.http_mcp_client import call_tool_text
from tools._shared import DISCORD_MCP_URL, err


def discord_find_channel(name: str = "", guild_id: str = "") -> dict[str, Any]:
    """Find a Discord channel's ID by (partial) name. Needed before discord_read_messages."""
    try:
        args: dict[str, Any] = {"name": name}
        if guild_id:
            args["guild_id"] = guild_id
        text = asyncio.run(call_tool_text(DISCORD_MCP_URL, "find_channel", args))
        return {"tool": "discord_find_channel", "name": name, "text": text}
    except Exception as exc:
        return err("discord_find_channel", exc)
