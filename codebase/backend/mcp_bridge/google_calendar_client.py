"""Bridge to Google's hosted Calendar MCP server (calendarmcp.googleapis.com).

Replaces the hand-written local google_calendar_mcp server that used to run on
port 8086 and call the Calendar REST API through googleapiclient. Google now
publishes Calendar as a first-party MCP server, so the tools in
backend/tools/calendar_* talk to that instead — one less process to run, and
tool behaviour (time parsing, Meet link creation, recurrence) is Google's
responsibility rather than ours.

Reference: https://developers.google.com/workspace/calendar/api/v3/reference/mcp

Two things about this server shape the code here:

1. It is stateless and authenticates per tool call with a normal OAuth bearer
   token — `initialize` and `tools/list` answer unauthenticated, but
   `tools/call` returns 401 with a `WWW-Authenticate: Bearer` header unless the
   Authorization header is set. The token is the same unified Google
   connection token the FE's "Quản lý kết nối" > Gmail flow already writes
   (see google_connection.py), so there is no separate consent screen.
2. Every tool declares an `outputSchema`, so results come back as structured
   `Event` objects in `structuredContent` — see call_tool_structured.

Setup beyond the normal OAuth client: this is a Developer Preview feature, so
the Cloud project must be enrolled in the Google Workspace Developer Preview
Program (https://developers.google.com/workspace/preview) and have BOTH
`calendar-json.googleapis.com` and `calendarmcp.googleapis.com` enabled.
"""

from __future__ import annotations

import os
from typing import Any

import google_connection
from mcp_bridge.http_mcp_client import call_tool_structured

GOOGLE_CALENDAR_MCP_URL = os.environ.get(
    "GOOGLE_CALENDAR_MCP_URL", "https://calendarmcp.googleapis.com/mcp/v1"
)


class CalendarNotConnectedError(RuntimeError):
    """No usable Google token — the user has not completed (or has revoked) the
    "Quản lý kết nối" > Gmail OAuth flow."""


def _auth_headers() -> dict[str, str]:
    creds = google_connection.load_credentials()
    if creds is None or not creds.token:
        raise CalendarNotConnectedError(
            "Chưa kết nối Google. Vào FE > \"Quản lý kết nối\" > Gmail để cấp quyền "
            "Google Calendar trước khi dùng các tool calendar."
        )
    return {"Authorization": f"Bearer {creds.token}"}


async def call(name: str, arguments: dict[str, Any]) -> dict[str, Any]:
    """Call a tool on Google's Calendar MCP server, returning its structured result."""
    return await call_tool_structured(GOOGLE_CALENDAR_MCP_URL, name, arguments, _auth_headers())
