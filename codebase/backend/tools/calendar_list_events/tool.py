from __future__ import annotations

import asyncio
from typing import Any

from mcp_bridge.google_calendar_client import call
from tools._calendar_format import format_event_list
from tools._shared import err


def calendar_list_events(
    time_min: str = "",
    time_max: str = "",
    query: str = "",
    calendar_id: str = "",
    max_results: int = 20,
) -> dict[str, Any]:
    """List events on the student's Google Calendar in a time range, optionally filtered by text query."""
    try:
        args: dict[str, Any] = {"pageSize": max_results, "orderBy": "startTime"}
        # Google's list_events wants these omitted entirely unless the user
        # asked for a specific timeframe — it picks a sensible window itself.
        if time_min:
            args["startTime"] = time_min
        if time_max:
            args["endTime"] = time_max
        if query:
            args["fullText"] = query
        if calendar_id:
            args["calendarId"] = calendar_id
        result = asyncio.run(call("list_events", args))
        payload = format_event_list(result.get("events", []) or [])
        return {"tool": "calendar_list_events", "text": payload["text"], "events": payload["events"]}
    except Exception as exc:
        return err("calendar_list_events", exc)
