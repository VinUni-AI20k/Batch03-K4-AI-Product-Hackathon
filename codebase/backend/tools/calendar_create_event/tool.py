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
    add_meet_link: bool = False,
    document_url: str = "",
    document_title: str = "",
    confirmed: bool = False,
) -> dict[str, Any]:
    """Add an event to the student's Google Calendar. This writes real data —
    only call with confirmed=True after the user has explicitly confirmed
    (via clarify, response_type=yes_no) exactly what will be added. Set
    add_meet_link=True to attach a real, freshly-generated Google Meet link —
    never write a meet.google.com URL into location/description yourself,
    it will not be a working link to an actual meeting. Pass document_url to
    attach a file (e.g. a Google Doc/Drive link) the user gave you — never a
    document you merely found in an email/Discord message without the user
    directly asking for that specific link to be attached."""
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
        if add_meet_link:
            args["add_meet_link"] = True
        if document_url:
            args["document_url"] = document_url
        if document_title:
            args["document_title"] = document_title
        text = asyncio.run(call_tool_text(GOOGLE_CALENDAR_MCP_URL, "create_event", args))
        return {"tool": "calendar_create_event", "status": "created", "text": text}
    except Exception as exc:
        return err("calendar_create_event", exc)
