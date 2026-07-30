"""Unified Google OAuth connection shared by google_calendar_mcp and
gmail_mcp. One consent screen grants both Gmail and Calendar scopes; the
resulting token is written to codebase/backend/credentials/token.json.
Both are separate local MCP server processes that read this same file
directly (point their GOOGLE_CALENDAR_TOKEN_FILE / GOOGLE_CLIENT_SECRETS_FILE
env vars at this directory — see codebase/mcp/.env.example) instead of
running their own separate OAuth handshakes.

Setup: create an OAuth client (Application type: Web application) in Google
Cloud Console with redirect URI matching GOOGLE_OAUTH_REDIRECT_URI (default
http://localhost:8000/api/v1/connections/google/callback), download its JSON,
and save it at the path CLIENT_SECRETS_FILE resolves to below.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import httpx
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow

_CREDENTIALS_DIR = Path(__file__).resolve().parent / "credentials"

SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.compose",
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
]


def client_secrets_path() -> Path:
    return Path(os.environ.get("GOOGLE_OAUTH_CLIENT_SECRETS_FILE", str(_CREDENTIALS_DIR / "client_secret.json")))


def token_path() -> Path:
    return Path(os.environ.get("GOOGLE_CALENDAR_TOKEN_FILE", str(_CREDENTIALS_DIR / "token.json")))


def redirect_uri() -> str:
    return os.environ.get("GOOGLE_OAUTH_REDIRECT_URI", "http://localhost:8000/api/v1/connections/google/callback")


class GoogleConnectionError(RuntimeError):
    pass


def _build_flow() -> Flow:
    secrets_path = client_secrets_path()
    if not secrets_path.exists():
        raise GoogleConnectionError(
            f"Missing Google OAuth client secrets at {secrets_path}. Create a Web application "
            f"OAuth client in Google Cloud Console (redirect URI {redirect_uri()}), download its "
            "JSON and save it at that path."
        )
    return Flow.from_client_secrets_file(str(secrets_path), scopes=SCOPES, redirect_uri=redirect_uri())


# Flow.authorization_url() auto-generates a PKCE code_verifier that lives only
# on that Flow instance. The callback arrives as a separate HTTP request, so
# the flow that issued the auth URL must be kept around to complete the
# exchange with the matching verifier — a fresh Flow() here has no verifier
# and Google rejects the token exchange. Single global is fine: this backend
# runs as one uvicorn process for one operator, same assumption the rest of
# this codebase's token storage already makes.
_pending_flow: Flow | None = None


def get_authorization_url() -> str:
    global _pending_flow
    flow = _build_flow()
    auth_url, _state = flow.authorization_url(access_type="offline", include_granted_scopes="true", prompt="consent")
    _pending_flow = flow
    return auth_url


def exchange_code(code: str) -> None:
    global _pending_flow
    flow = _pending_flow or _build_flow()
    flow.fetch_token(code=code)
    _pending_flow = None
    _save(flow.credentials)


def _save(creds: Credentials) -> None:
    token_path().parent.mkdir(parents=True, exist_ok=True)
    token_path().write_text(creds.to_json(), encoding="utf-8")


def load_credentials() -> Credentials | None:
    """Return valid credentials for the shared Google connection, refreshing
    the stored token if needed. None if never connected."""
    path = token_path()
    if not path.exists():
        return None
    creds = Credentials.from_authorized_user_file(str(path), SCOPES)
    if creds.valid:
        return creds
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        _save(creds)
        return creds
    return None


def disconnect() -> None:
    token_path().unlink(missing_ok=True)


def get_status() -> dict[str, Any]:
    creds = load_credentials()
    if creds is None:
        return {"connected": False, "email": None, "scopes": []}
    email = None
    try:
        response = httpx.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {creds.token}"},
            timeout=5.0,
        )
        if response.status_code == 200:
            email = response.json().get("email")
    except httpx.HTTPError:
        pass
    return {"connected": True, "email": email, "scopes": list(creds.scopes or [])}
