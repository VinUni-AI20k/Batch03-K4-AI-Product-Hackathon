from __future__ import annotations

import asyncio
from typing import Any

from mcp_bridge.http_mcp_client import call_tool_text
from tools._shared import GOOGLE_CALENDAR_MCP_URL, err


def calendar_create_event(
    summary: str = "",
    start: str = "",
    end: str = "",
    description: str = "",
    location: str = "",
    timezone: str = "",
    calendar_id: str = "",
    confirmed: bool = False,
) -> dict[str, Any]:
    """Add an event to the student's Google Calendar. This writes real data —
    only call with confirmed=True after the user has explicitly confirmed
    (via clarify, response_type=yes_no) exactly what will be added."""
    if not confirmed:
        return {
            "tool": "calendar_create_event",
            "status": "needs_confirmation",
            "message": "Restate the event (summary/start/end) and get explicit yes/no confirmation via clarify before calling this again with confirmed=true.",
        }
    try:
        args: dict[str, Any] = {"summary": summary, "start": start, "end": end}
        if description:
            args["description"] = description
        if location:
            args["location"] = location
        if timezone:
            args["timezone"] = timezone
        if calendar_id:
            args["calendar_id"] = calendar_id
        text = asyncio.run(call_tool_text(GOOGLE_CALENDAR_MCP_URL, "create_event", args))
        return {"tool": "calendar_create_event", "status": "created", "text": text}
    except Exception as exc:
        return err("calendar_create_event", exc)
