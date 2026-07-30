import asyncio
from typing import Any

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import Resource, build
from googleapiclient.errors import HttpError

from . import config

SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.compose",
]

_service: Resource | None = None


def _load_credentials() -> Credentials:
    if not config.GOOGLE_TOKEN_FILE.exists():
        raise RuntimeError(
            f"Chưa có Gmail token tại {config.GOOGLE_TOKEN_FILE}. Kết nối Gmail trong "
            "\"Quản lý kết nối\" của backend trước — server này chỉ đọc token đã có sẵn, "
            "không tự chạy OAuth."
        )
    creds = Credentials.from_authorized_user_file(str(config.GOOGLE_TOKEN_FILE), SCOPES)
    if creds.valid:
        return creds
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        config.GOOGLE_TOKEN_FILE.write_text(creds.to_json())
        return creds
    raise RuntimeError("Gmail token không còn hợp lệ — kết nối lại Gmail trong \"Quản lý kết nối\".")


def get_service() -> Resource:
    """Build (or reuse) the Gmail API client. Synchronous/blocking — call via
    asyncio.to_thread from async code."""
    global _service
    if _service is None:
        creds = _load_credentials()
        _service = build("gmail", "v1", credentials=creds, static_discovery=True)
    return _service


async def execute(request: Any) -> Any:
    """Run a blocking googleapiclient request off the event loop."""
    try:
        return await asyncio.to_thread(request.execute)
    except HttpError as e:
        reason = e.reason if hasattr(e, "reason") else str(e)
        raise ValueError(f"Gmail API error ({e.status_code}): {reason}") from e
