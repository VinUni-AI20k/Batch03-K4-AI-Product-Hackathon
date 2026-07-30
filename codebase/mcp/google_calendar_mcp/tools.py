import json
import re
import uuid
from datetime import datetime, timezone
from typing import Optional

from . import calendar_client, config
from .server import mcp

DEFAULT_MAX_RESULTS = 25
MAX_MAX_RESULTS = 100

_OFFSET_RE = re.compile(r"(Z|[+-]\d{2}:\d{2})$")
_DATE_ONLY_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def _resolve_calendar_id(calendar_id: Optional[str]) -> str:
    return calendar_id or config.GOOGLE_CALENDAR_ID


def _parse_max_results(raw: Optional[str]) -> int:
    if raw is None or raw == "":
        return DEFAULT_MAX_RESULTS
    try:
        value = int(raw)
    except ValueError:
        raise ValueError("maxResults must be an integer between 1 and 100")
    if value < 1 or value > MAX_MAX_RESULTS:
        raise ValueError("maxResults must be between 1 and 100")
    return value


def _event_time(value: str, tz: Optional[str]) -> dict:
    """Build a Calendar API EventDateTime from a plain string.

    "YYYY-MM-DD" -> all-day event. Anything else is treated as an ISO 8601
    dateTime; if it has no UTC offset/Z suffix, `timeZone` is attached so the
    API knows how to interpret it.
    """
    value = value.strip()
    if not value:
        raise ValueError("start/end cannot be empty")
    if _DATE_ONLY_RE.fullmatch(value):
        return {"date": value}
    body: dict = {"dateTime": value}
    if not _OFFSET_RE.search(value):
        body["timeZone"] = tz or config.GOOGLE_CALENDAR_DEFAULT_TZ
    return body


def _format_event_time(event_time: dict) -> str:
    if "date" in event_time:
        return event_time["date"]
    return event_time.get("dateTime", "?")


def _meet_link(event: dict) -> Optional[str]:
    if event.get("hangoutLink"):
        return event["hangoutLink"]
    for entry_point in event.get("conferenceData", {}).get("entryPoints", []):
        if entry_point.get("entryPointType") == "video":
            return entry_point.get("uri")
    return None


def _attachment(document_url: str, document_title: Optional[str]) -> dict:
    return {"fileUrl": document_url, "title": document_title or document_url}


def _format_event(event: dict) -> str:
    start = _format_event_time(event.get("start", {}))
    end = _format_event_time(event.get("end", {}))
    summary = event.get("summary", "(no title)")
    lines = [f"- (ID: {event['id']}) **{summary}** `{start}` -> `{end}`"]
    if event.get("location"):
        lines.append(f"  Location: {event['location']}")
    if event.get("description"):
        lines.append(f"  Description: {event['description']}")
    meet_link = _meet_link(event)
    if meet_link:
        lines.append(f"  Google Meet: {meet_link}")
    for attachment in event.get("attachments", []):
        lines.append(f"  Attachment: {attachment.get('title', '(untitled)')} — {attachment.get('fileUrl', '?')}")
    lines.append(f"  Link: {event.get('htmlLink', 'n/a')}")
    return "\n".join(lines)


def _event_summary(event: dict) -> dict:
    """Structured shape for FE rendering (e.g. a meeting card) — a superset of
    what _format_event turns into text, kept in sync with it field-for-field."""
    return {
        "id": event.get("id", ""),
        "summary": event.get("summary", "(no title)"),
        "start": _format_event_time(event.get("start", {})),
        "end": _format_event_time(event.get("end", {})),
        "location": event.get("location", ""),
        "description": event.get("description", ""),
        "meet_link": _meet_link(event),
        "html_link": event.get("htmlLink", ""),
        "attachments": [
            {"title": a.get("title", ""), "url": a.get("fileUrl", "")} for a in event.get("attachments", [])
        ],
    }


@mcp.tool(name="list_calendars", description="List calendars accessible to this Google account")
async def list_calendars() -> str:
    service = calendar_client.get_service()
    result = await calendar_client.execute(service.calendarList().list())
    items = result.get("items", [])
    if not items:
        return "No calendars found."
    lines = [f"**Found {len(items)} calendar(s):**"]
    for cal in items:
        primary = " (primary)" if cal.get("primary") else ""
        lines.append(f"- {cal['summary']}{primary} — id: `{cal['id']}`")
    return "\n".join(lines)


@mcp.tool(
    name="list_events",
    description="List events on a calendar, optionally within a time range or matching a text query. "
    "timeMin/timeMax default to the current time onward if omitted.",
)
async def list_events(
    calendar_id: Optional[str] = None,
    time_min: Optional[str] = None,
    time_max: Optional[str] = None,
    query: Optional[str] = None,
    max_results: Optional[str] = None,
) -> str:
    cal_id = _resolve_calendar_id(calendar_id)
    limit = _parse_max_results(max_results)
    service = calendar_client.get_service()
    request = service.events().list(
        calendarId=cal_id,
        timeMin=time_min or datetime.now(timezone.utc).isoformat(),
        timeMax=time_max,
        q=query,
        maxResults=limit,
        singleEvents=True,
        orderBy="startTime",
    )
    result = await calendar_client.execute(request)
    events = result.get("items", [])
    if not events:
        return json.dumps({"text": "No events found.", "events": []})
    lines = [f"**Found {len(events)} event(s):**"]
    lines.extend(_format_event(e) for e in events)
    return json.dumps({"text": "\n".join(lines), "events": [_event_summary(e) for e in events]})


@mcp.tool(name="get_event", description="Get full details of a specific calendar event")
async def get_event(event_id: str, calendar_id: Optional[str] = None) -> str:
    if not event_id:
        raise ValueError("eventId cannot be empty")
    cal_id = _resolve_calendar_id(calendar_id)
    service = calendar_client.get_service()
    event = await calendar_client.execute(service.events().get(calendarId=cal_id, eventId=event_id))
    return _format_event(event)


@mcp.tool(
    name="create_event",
    description="Create a calendar event (a timeline milestone/checkpoint). "
    "start/end accept 'YYYY-MM-DD' for an all-day event, or an ISO 8601 datetime "
    "(e.g. '2026-08-01T09:00:00+07:00'); if the datetime has no UTC offset, "
    "'timezone' (IANA name, e.g. 'Asia/Ho_Chi_Minh') is used instead. Set "
    "add_meet_link=true to attach a real, freshly-generated Google Meet link — "
    "never write a meet.google.com URL into location/description yourself, it "
    "won't be a working link to an actual meeting. Pass document_url to attach "
    "a file (e.g. a Google Doc/Drive link) the user gave you as an event attachment.",
)
async def create_event(
    summary: str,
    start: str,
    end: str,
    calendar_id: Optional[str] = None,
    description: Optional[str] = None,
    location: Optional[str] = None,
    timezone: Optional[str] = None,
    add_meet_link: bool = False,
    document_url: Optional[str] = None,
    document_title: Optional[str] = None,
) -> str:
    if not summary:
        raise ValueError("summary cannot be empty")
    if not start:
        raise ValueError("start cannot be empty")
    if not end:
        raise ValueError("end cannot be empty")

    cal_id = _resolve_calendar_id(calendar_id)
    body = {
        "summary": summary,
        "start": _event_time(start, timezone),
        "end": _event_time(end, timezone),
    }
    if description:
        body["description"] = description
    if location:
        body["location"] = location
    if add_meet_link:
        body["conferenceData"] = {
            "createRequest": {
                "requestId": uuid.uuid4().hex,
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
            }
        }
    if document_url:
        body["attachments"] = [_attachment(document_url, document_title)]

    service = calendar_client.get_service()
    request = service.events().insert(
        calendarId=cal_id,
        body=body,
        conferenceDataVersion=1 if add_meet_link else 0,
        supportsAttachments=bool(document_url),
    )
    event = await calendar_client.execute(request)
    return f"Event created successfully.\n{_format_event(event)}"


@mcp.tool(
    name="update_event",
    description="Update fields on an existing calendar event. Only provided fields are changed; "
    "start/end follow the same format as create_event. Set add_meet_link=true to attach a "
    "real, freshly-generated Google Meet link — never write a meet.google.com URL into "
    "location/description yourself. Pass document_url to attach a file (e.g. a Google "
    "Doc/Drive link) the user gave you as an event attachment.",
)
async def update_event(
    event_id: str,
    calendar_id: Optional[str] = None,
    summary: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None,
    description: Optional[str] = None,
    location: Optional[str] = None,
    timezone: Optional[str] = None,
    add_meet_link: bool = False,
    document_url: Optional[str] = None,
    document_title: Optional[str] = None,
) -> str:
    if not event_id:
        raise ValueError("eventId cannot be empty")
    if not any([summary, start, end, description, location, add_meet_link, document_url]):
        raise ValueError("provide at least one field to update")

    cal_id = _resolve_calendar_id(calendar_id)
    body: dict = {}
    if summary:
        body["summary"] = summary
    if start:
        body["start"] = _event_time(start, timezone)
    if end:
        body["end"] = _event_time(end, timezone)
    if description is not None:
        body["description"] = description
    if location is not None:
        body["location"] = location
    if add_meet_link:
        body["conferenceData"] = {
            "createRequest": {
                "requestId": uuid.uuid4().hex,
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
            }
        }
    if document_url:
        body["attachments"] = [_attachment(document_url, document_title)]

    service = calendar_client.get_service()
    event = await calendar_client.execute(
        service.events().patch(
            calendarId=cal_id,
            eventId=event_id,
            body=body,
            conferenceDataVersion=1 if add_meet_link else 0,
            supportsAttachments=bool(document_url),
        )
    )
    return f"Event updated successfully.\n{_format_event(event)}"


@mcp.tool(name="delete_event", description="Delete a calendar event")
async def delete_event(event_id: str, calendar_id: Optional[str] = None) -> str:
    if not event_id:
        raise ValueError("eventId cannot be empty")
    cal_id = _resolve_calendar_id(calendar_id)
    service = calendar_client.get_service()
    await calendar_client.execute(service.events().delete(calendarId=cal_id, eventId=event_id))
    return "Event deleted successfully"
