from __future__ import annotations

import asyncio
import re
from typing import Any

from mcp_bridge.google_calendar_client import call
from tools._calendar_format import attachments_arg, format_event
from tools._shared import err

_DATE_ONLY_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


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
        args: dict[str, Any] = {"summary": summary, "startTime": start, "endTime": end}
        # Google takes ISO 8601 timestamps plus an explicit allDay flag, where
        # this tool's contract accepts a bare "YYYY-MM-DD" to mean all-day.
        # Widen those to midnight timestamps so both ends stay valid ISO 8601.
        if _DATE_ONLY_RE.fullmatch(start.strip()) and _DATE_ONLY_RE.fullmatch(end.strip()):
            args["allDay"] = True
            args["startTime"] = f"{start.strip()}T00:00:00"
            args["endTime"] = f"{end.strip()}T00:00:00"
        if description:
            args["description"] = description
        if location:
            args["location"] = location
        if timezone:
            args["timeZone"] = timezone
        if calendar_id:
            args["calendarId"] = calendar_id
        if add_meet_link:
            args["addGoogleMeetUrl"] = True
        if document_url:
            args["attachments"] = attachments_arg(document_url, document_title)
        event = asyncio.run(call("create_event", args))
        return {
            "tool": "calendar_create_event",
            "status": "created",
            "text": f"Event created successfully.\n{format_event(event)}",
        }
    except Exception as exc:
        return err("calendar_create_event", exc)
