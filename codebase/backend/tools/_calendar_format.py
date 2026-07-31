"""Formatting helpers for Google Calendar MCP `Event` objects.

Google's hosted Calendar MCP server returns structured Events (see
mcp_bridge/google_calendar_client.py); this module turns them into the two
shapes the rest of the app already expects:

- `format_event()` -> markdown lines for the LLM to read.
- `event_summary()` -> the flat dict the FE's MeetingCard renders (keys
  summary/start/end/location/meet_link/html_link/attachments). Keep the two in
  sync field-for-field.

Note on start/end: Google returns a `DateOrDateTime` — `{"date": ...}` for
all-day events, `{"dateTime": ...}` otherwise. The FE's formatEventRange()
distinguishes the two by testing whether the string is date-only, so all-day
events are flattened to bare "YYYY-MM-DD" rather than the full midnight-UTC
timestamp Google sends.
"""

from __future__ import annotations

from typing import Any, Optional


def format_event_time(event_time: dict[str, Any]) -> str:
    """Flatten a DateOrDateTime to a single string. All-day events lose the
    time component so the FE renders them as "Cả ngày"."""
    date = event_time.get("date")
    if date:
        return date[:10]
    return event_time.get("dateTime", "?")


def format_event(event: dict[str, Any]) -> str:
    start = format_event_time(event.get("start", {}))
    end = format_event_time(event.get("end", {}))
    summary = event.get("summary") or "(no title)"
    lines = [f"- (ID: {event.get('id', '?')}) **{summary}** `{start}` -> `{end}`"]
    if event.get("location"):
        lines.append(f"  Location: {event['location']}")
    if event.get("description"):
        lines.append(f"  Description: {event['description']}")
    if event.get("conferenceUrl"):
        lines.append(f"  Google Meet: {event['conferenceUrl']}")
    for attachment in event.get("attachments", []) or []:
        lines.append(f"  Attachment: {attachment.get('title') or '(untitled)'} — {attachment.get('fileUrl', '?')}")
    attendees = [a.get("email", "") for a in event.get("attendees", []) or [] if a.get("email")]
    if attendees:
        lines.append(f"  Attendees: {', '.join(attendees)}")
    lines.append(f"  Link: {event.get('htmlLink') or 'n/a'}")
    return "\n".join(lines)


def event_summary(event: dict[str, Any]) -> dict[str, Any]:
    """Structured shape for FE rendering (the meeting card) — a superset of
    what format_event turns into text, kept in sync with it field-for-field."""
    return {
        "id": event.get("id", ""),
        "summary": event.get("summary") or "(no title)",
        "start": format_event_time(event.get("start", {})),
        "end": format_event_time(event.get("end", {})),
        "location": event.get("location", ""),
        "description": event.get("description", ""),
        "meet_link": event.get("conferenceUrl") or None,
        "html_link": event.get("htmlLink", ""),
        "attachments": [
            {"title": a.get("title", ""), "url": a.get("fileUrl", "")}
            for a in event.get("attachments", []) or []
        ],
    }


def format_event_list(events: list[dict[str, Any]]) -> dict[str, Any]:
    """Build the {text, events} envelope calendar_list_events returns."""
    if not events:
        return {"text": "No events found.", "events": []}
    lines = [f"**Found {len(events)} event(s):**"]
    lines.extend(format_event(e) for e in events)
    return {"text": "\n".join(lines), "events": [event_summary(e) for e in events]}


def attachments_arg(document_url: str, document_title: Optional[str]) -> list[dict[str, str]]:
    return [{"fileUrl": document_url, "title": document_title or document_url}]
