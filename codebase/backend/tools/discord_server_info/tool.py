from __future__ import annotations

import asyncio
from typing import Any

from mcp_bridge.http_mcp_client import call_tool_text
from tools._shared import DISCORD_MCP_URL, err


def discord_server_info(guild_id: str = "") -> dict[str, Any]:
    """Get details (name, member count, channel count, owner, created date) of a Discord server
    the bot has been invited into. Leave guild_id empty if the bot is only in one server;
    otherwise call discord_list_guilds first to find the right guild_id."""
    try:
        args: dict[str, Any] = {}
        if guild_id:
            args["guild_id"] = guild_id
        text = asyncio.run(call_tool_text(DISCORD_MCP_URL, "get_server_info", args))
        return {"tool": "discord_server_info", "text": text}
    except Exception as exc:
        return err("discord_server_info", exc)
