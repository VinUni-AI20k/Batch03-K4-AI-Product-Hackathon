from __future__ import annotations

import asyncio
from typing import Any

from mcp_bridge.outlook_client import call_tool_text
from tools._shared import err


def outlook_calendar_list_events(
    time_min: str = "",
    time_max: str = "",
    query: str = "",
    max_results: int = 20,
) -> dict[str, Any]:
    """List or search events on the student's Outlook Calendar. Read-only —
    use to check for conflicts alongside calendar_list_events (Google)."""
    try:
        args: dict[str, Any] = {"max_results": max_results}
        if time_min:
            args["start_datetime"] = time_min
        if time_max:
            args["end_datetime"] = time_max
        if query:
            args["operation"] = "search_events"
            args["query"] = query
        else:
            args["operation"] = "list_events"
            if not time_min and not time_max:
                args["date"] = "this_week"
        text = asyncio.run(call_tool_text("calendar", args))
        return {"tool": "outlook_calendar_list_events", "text": text}
    except Exception as exc:
        return err("outlook_calendar_list_events", exc)
