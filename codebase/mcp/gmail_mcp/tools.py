import base64
import html
import json
import re
from typing import Optional

from . import gmail_client
from .server import mcp

_TAG_RE = re.compile(r"<(script|style)[^>]*>.*?</\1>|<[^>]+>", re.IGNORECASE | re.DOTALL)
_BLANK_LINES_RE = re.compile(r"\n\s*\n+")


def _html_to_text(raw_html: str) -> str:
    text = _TAG_RE.sub("\n", raw_html)
    text = html.unescape(text)
    return _BLANK_LINES_RE.sub("\n\n", text).strip()

DEFAULT_MAX_RESULTS = 10
MAX_MAX_RESULTS = 50


def _parse_max_results(raw: Optional[str]) -> int:
    if raw is None or raw == "":
        return DEFAULT_MAX_RESULTS
    try:
        value = int(raw)
    except ValueError:
        raise ValueError("max_results must be an integer between 1 and 50")
    if value < 1 or value > MAX_MAX_RESULTS:
        raise ValueError("max_results must be between 1 and 50")
    return value


def _header(headers: list[dict], name: str) -> str:
    for h in headers:
        if h.get("name", "").lower() == name.lower():
            return h.get("value", "")
    return ""


def _decode_part(data: str) -> str:
    return base64.urlsafe_b64decode(data + "=" * (-len(data) % 4)).decode("utf-8", errors="replace")


def _extract_body(payload: dict) -> str:
    """Depth-first search for the first text/plain part, falling back to text/html."""
    mime = payload.get("mimeType", "")
    body = payload.get("body", {})
    if mime == "text/plain" and body.get("data"):
        return _decode_part(body["data"])
    for part in payload.get("parts", []) or []:
        text = _extract_body(part)
        if text:
            return text
    if mime == "text/html" and body.get("data"):
        return _html_to_text(_decode_part(body["data"]))
    return ""


def _format_thread_summary(thread: dict) -> str:
    messages = thread.get("messages", [])
    headers = messages[-1].get("payload", {}).get("headers", []) if messages else []
    subject = _header(headers, "Subject") or "(no subject)"
    sender = _header(headers, "From") or "?"
    date = _header(headers, "Date") or "?"
    snippet = thread.get("snippet", "")
    return f"- (thread_id: {thread['id']}) **{subject}** from {sender} · {date}\n  {snippet}"


def _thread_summary_json(thread: dict) -> dict:
    """Structured summary for ingestion callers — unlike
    _format_thread_summary, surfaces labelIds/internalDate, which the Gmail
    API already returns on every message regardless of `format`, but which
    the text summary never exposed."""
    messages = thread.get("messages", [])
    last = messages[-1] if messages else {}
    headers = last.get("payload", {}).get("headers", [])
    return {
        "thread_id": thread.get("id", ""),
        "message_id": last.get("id", ""),
        "subject": _header(headers, "Subject") or "(no subject)",
        "from": _header(headers, "From") or "?",
        "date": _header(headers, "Date") or "?",
        "internal_date": last.get("internalDate", ""),  # epoch ms, string
        "is_unread": "UNREAD" in (last.get("labelIds") or []),
        "label_ids": last.get("labelIds") or [],
        "snippet": thread.get("snippet", ""),
    }


@mcp.tool(
    name="search_threads",
    description=(
        "Search Gmail threads using Gmail search syntax (e.g. 'is:unread newer_than:7d', 'from:...'). "
        "output='text' (default) returns a formatted listing for chat; output='json' returns structured "
        "records (thread_id, is_unread, internal_date, label_ids, ...) for ingestion callers."
    ),
)
async def search_threads(query: str = "", max_results: Optional[str] = None, output: str = "text") -> str:
    if output not in ("text", "json"):
        raise ValueError("output must be 'text' or 'json'")

    limit = _parse_max_results(max_results)
    service = gmail_client.get_service()
    result = await gmail_client.execute(
        service.users().threads().list(userId="me", q=query or None, maxResults=limit)
    )
    thread_stubs = result.get("threads", [])
    if not thread_stubs:
        return "No threads found." if output == "text" else "[]"

    threads = []
    for stub in thread_stubs:
        thread = await gmail_client.execute(
            service.users()
            .threads()
            .get(userId="me", id=stub["id"], format="metadata", metadataHeaders=["Subject", "From", "Date"])
        )
        threads.append(thread)

    if output == "json":
        return json.dumps([_thread_summary_json(t) for t in threads], ensure_ascii=False)

    lines = [f"**Found {len(threads)} thread(s):**"]
    lines.extend(_format_thread_summary(t) for t in threads)
    return "\n".join(lines)


@mcp.tool(
    name="get_thread",
    description="Read the full content (all messages) of one Gmail thread by thread_id, from search_threads.",
)
async def get_thread(thread_id: str) -> str:
    if not thread_id:
        raise ValueError("thread_id cannot be empty")
    service = gmail_client.get_service()
    thread = await gmail_client.execute(service.users().threads().get(userId="me", id=thread_id, format="full"))
    messages = thread.get("messages", [])
    if not messages:
        return "Thread has no messages."
    parts = [f"**Thread {thread_id} — {len(messages)} message(s):**"]
    for msg in messages:
        headers = msg.get("payload", {}).get("headers", [])
        subject = _header(headers, "Subject") or "(no subject)"
        sender = _header(headers, "From") or "?"
        date = _header(headers, "Date") or "?"
        body = _extract_body(msg.get("payload", {})) or "(no readable body)"
        parts.append(f"---\nFrom: {sender}\nDate: {date}\nSubject: {subject}\n\n{body.strip()}")
    return "\n".join(parts)
