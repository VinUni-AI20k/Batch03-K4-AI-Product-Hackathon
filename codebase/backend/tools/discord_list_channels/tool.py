from __future__ import annotations

import asyncio
from typing import Any

from mcp_bridge.http_mcp_client import call_tool_text
from tools._shared import DISCORD_MCP_URL, err


def discord_list_channels(guild_id: str = "") -> dict[str, Any]:
    """List every channel in a Discord server, grouped by category. Use this when the user asks
    broadly about a SERVER ("có gì mới trên X") rather than naming one specific channel — pick
    the relevant channel(s) from this list, then call discord_read_messages on each, instead of
    guessing a channel name for discord_find_channel."""
    try:
        args: dict[str, Any] = {}
        if guild_id:
            args["guild_id"] = guild_id
        text = asyncio.run(call_tool_text(DISCORD_MCP_URL, "list_channels", args))
        return {"tool": "discord_list_channels", "text": text}
    except Exception as exc:
        return err("discord_list_channels", exc)
