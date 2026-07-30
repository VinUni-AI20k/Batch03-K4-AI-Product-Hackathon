from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml

from .clarify.tool import ask_user
from .current_time.tool import get_current_time
from .format.tool import render_digest
from .gmail_search.tool import gmail_search
from .gmail_read_thread.tool import gmail_read_thread
from .discord_find_channel.tool import discord_find_channel
from .discord_read_messages.tool import discord_read_messages
from .calendar_list_events.tool import calendar_list_events
from .calendar_create_event.tool import calendar_create_event

# Tool names here MUST stay in sync with artifacts/tools.yaml. If a tool is
# renamed, update both this dict and the matching entry in tools.yaml.
TOOL_FUNCTIONS = {
    "clarify": ask_user,
    "current_time": get_current_time,
    "format": render_digest,
    "gmail_search": gmail_search,
    "gmail_read_thread": gmail_read_thread,
    "discord_find_channel": discord_find_channel,
    "discord_read_messages": discord_read_messages,
    "calendar_list_events": calendar_list_events,
    "calendar_create_event": calendar_create_event,
}


def load_tool_declarations(path: Path) -> list[dict[str, Any]]:
    return yaml.safe_load(Path(path).read_text(encoding="utf-8"))["tools"]


def to_openai_tools(declarations: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [
        {
            "type": "function",
            "function": {
                "name": item["name"],
                "description": item.get("description", ""),
                "parameters": item.get("parameters", {"type": "object", "properties": {}}),
            },
        }
        for item in declarations
    ]
