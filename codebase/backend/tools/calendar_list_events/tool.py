from __future__ import annotations

import asyncio
import json
from typing import Any

from mcp_bridge.http_mcp_client import call_tool_text
from tools._shared import GOOGLE_CALENDAR_MCP_URL, err


def calendar_list_events(
    time_min: str = "",
    time_max: str = "",
    query: str = "",
    calendar_id: str = "",
    max_results: int = 20,
) -> dict[str, Any]:
    """List events on the student's Google Calendar in a time range, optionally filtered by text query."""
    try:
        args: dict[str, Any] = {"max_results": str(max_results)}
        if time_min:
            args["time_min"] = time_min
        if time_max:
            args["time_max"] = time_max
        if query:
            args["query"] = query
        if calendar_id:
            args["calendar_id"] = calendar_id
        raw = asyncio.run(call_tool_text(GOOGLE_CALENDAR_MCP_URL, "list_events", args))
        try:
            payload = json.loads(raw)
            text, events = payload["text"], payload.get("events", [])
        except (json.JSONDecodeError, KeyError, TypeError):
            # Defensive fallback if the MCP server ever returns plain text.
            text, events = raw, []
        return {"tool": "calendar_list_events", "text": text, "events": events}
    except Exception as exc:
        return err("calendar_list_events", exc)
