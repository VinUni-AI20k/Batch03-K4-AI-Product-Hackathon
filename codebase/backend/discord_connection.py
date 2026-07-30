"""Discord connection status/disconnect for the "Quản lý kết nối" UI.

Unlike the unified Google connection, Discord access is one shared bot
identity (DISCORD_TOKEN) invited into servers by whoever administers them —
there's no per-user OAuth grant here, and connecting isn't something this
backend can do on the user's behalf (Discord requires "Manage Server" on the
inviting account). A single bot can also be a member of more than one
server at once, so status/disconnect are list-based, not single-guild —
there is no static "the" guild id anywhere; discord_bot.resolve_guild()
resolves the default dynamically from whichever guilds the bot is actually
in when no guild_id is given.

What this module owns:
  - a real invite URL (DISCORD_CLIENT_ID), for the FE to open
  - status: every guild the bot is actually currently a member of
  - disconnect(guild_id): make the bot leave one specific guild, so the FE's
    per-server "Hủy kết nối" button does something real

leave_guild/list_my_guilds are deliberately NOT registered in
tools.yaml/TOOL_FUNCTIONS — they're called directly here, never exposed to
the chat agent.
"""

from __future__ import annotations

import asyncio
import json
import os
from typing import Any

from mcp_bridge.http_mcp_client import call_tool_text
from tools._shared import DISCORD_MCP_URL, _innermost

# Read-only invite: View Channels (0x400) + Read Message History (0x10000).
READ_ONLY_PERMISSIONS = 66560


def client_id() -> str:
    return os.environ.get("DISCORD_CLIENT_ID", "").strip()


def get_invite_url() -> str | None:
    cid = client_id()
    if not cid:
        return None
    return (
        f"https://discord.com/oauth2/authorize?client_id={cid}"
        f"&permissions={READ_ONLY_PERMISSIONS}&integration_type=0&scope=bot"
    )


def get_status() -> dict[str, Any]:
    try:
        raw = asyncio.run(call_tool_text(DISCORD_MCP_URL, "list_my_guilds", {}))
        guilds = json.loads(raw)
    except Exception:
        return {"connected": False, "guilds": []}
    return {"connected": len(guilds) > 0, "guilds": guilds}


def disconnect(guild_id: str) -> None:
    if not guild_id:
        raise ValueError("guild_id is required.")
    try:
        asyncio.run(call_tool_text(DISCORD_MCP_URL, "leave_guild", {"guild_id": guild_id}))
    except Exception as exc:
        raise RuntimeError(str(_innermost(exc))) from exc
