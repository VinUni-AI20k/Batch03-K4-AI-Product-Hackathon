from __future__ import annotations

import asyncio
from typing import Any

from mcp_bridge.http_mcp_client import call_tool_text
from tools._shared import DISCORD_MCP_URL, err


def discord_list_guilds() -> dict[str, Any]:
    """List every Discord server (guild) the bot has been invited into and can currently see.
    Call this first if the user asks about "the Discord server"/a server by name and you don't
    already know its guild_id, or if there's more than one and a tool call asks you to disambiguate."""
    try:
        text = asyncio.run(call_tool_text(DISCORD_MCP_URL, "list_guilds", {}))
        return {"tool": "discord_list_guilds", "text": text}
    except Exception as exc:
        return err("discord_list_guilds", exc)
