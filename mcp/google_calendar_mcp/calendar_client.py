import asyncio
from typing import Any

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import Resource, build
from googleapiclient.errors import HttpError

from . import config

# Full calendar access (read/write events, list/manage calendars). Narrow to
# https://www.googleapis.com/auth/calendar.events if calendar-list/settings
# management is never needed.
SCOPES = ["https://www.googleapis.com/auth/calendar"]

_service: Resource | None = None


def _load_credentials() -> Credentials:
    creds: Credentials | None = None
    if config.GOOGLE_CALENDAR_TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(config.GOOGLE_CALENDAR_TOKEN_FILE), SCOPES)

    if creds and creds.valid:
        return creds

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        # First run (or revoked/invalid token): opens a browser for the user
        # to grant consent, then blocks until that completes.
        flow = InstalledAppFlow.from_client_secrets_file(str(config.GOOGLE_CLIENT_SECRETS_FILE), SCOPES)
        creds = flow.run_local_server(port=0)

    config.GOOGLE_CALENDAR_TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
    config.GOOGLE_CALENDAR_TOKEN_FILE.write_text(creds.to_json())
    return creds


def get_service() -> Resource:
    """Build (or reuse) the Calendar API client. Synchronous/blocking — call
    via asyncio.to_thread from async code."""
    global _service
    if _service is None:
        creds = _load_credentials()
        _service = build("calendar", "v3", credentials=creds, static_discovery=True)
    return _service


async def execute(request: Any) -> Any:
    """Run a blocking googleapiclient request off the event loop."""
    try:
        return await asyncio.to_thread(request.execute)
    except HttpError as e:
        reason = e.reason if hasattr(e, "reason") else str(e)
        raise ValueError(f"Google Calendar API error ({e.status_code}): {reason}") from e
