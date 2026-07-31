from __future__ import annotations

import asyncio
import re
from datetime import date, timedelta
from typing import Any

from mcp_bridge.google_calendar_client import call
from tools._calendar_format import attachments_arg, format_event
from tools._shared import err

_DATE_ONLY_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def _all_day_range(start: str, end: str) -> tuple[str, str]:
    """Widen a bare "YYYY-MM-DD" pair into the ISO 8601 timestamps Google wants
    alongside allDay=True.

    Google treats an all-day `endTime` as EXCLUSIVE, so a single-day event
    spanning 2026-08-01 ends on 2026-08-02. Callers here routinely pass
    start == end for a one-day deadline (see server.py's confirm_calendar,
    which has no end date to work with), which would otherwise describe an
    empty range and be rejected — so bump the end to the next day.
    """
    if end <= start:
        end = (date.fromisoformat(start) + timedelta(days=1)).isoformat()
    return f"{start}T00:00:00", f"{end}T00:00:00"


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
        start, end = start.strip(), end.strip()
        args: dict[str, Any] = {"summary": summary, "startTime": start, "endTime": end}
        # Google takes ISO 8601 timestamps plus an explicit allDay flag, where
        # this tool's contract accepts a bare "YYYY-MM-DD" to mean all-day.
        if _DATE_ONLY_RE.fullmatch(start) and _DATE_ONLY_RE.fullmatch(end):
            args["allDay"] = True
            args["startTime"], args["endTime"] = _all_day_range(start, end)
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
