# google-calendar-mcp (Python)

A local MCP server for Google Calendar, built the same way as
[`../discord_mcp`](../discord_mcp/README.md): `FastMCP` decorator-based tools,
served over streamable-http, calling the Calendar API on demand (no
long-running sync/watch — just request/response per tool call).

Auth is normally handled once, centrally, by the unified Google connection in
`codebase/backend/google_connection.py` (the "Quản lý kết nối" > Gmail button
in the FE) — it requests both Gmail and Calendar scopes in one consent
screen and writes the token this server reads. See that module's docstring
and `codebase/mcp/.env.example` (`GOOGLE_CLIENT_SECRETS_FILE` /
`GOOGLE_CALENDAR_TOKEN_FILE`) for how this server points at those shared
files. The steps below are for the one-time Google Cloud Console setup, or
for running this server standalone without the backend.

## Setup

### 1) Google Cloud Console (one-time, manual)

1. https://console.cloud.google.com/ → create or select a project.
2. **APIs & Services → Library** → search "Google Calendar API" → Enable
   (also enable "Gmail API" if you want the unified connection to cover
   Gmail too).
3. **APIs & Services → OAuth consent screen** → User Type "External" → fill
   in app name/support email → under "Test users" add your own Google
   account email. (Testing mode is fine — you don't need to publish the app,
   this is just for your own account.)
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   → Application type **Web application** → add
   `http://localhost:8000/api/v1/connections/google/callback` under
   Authorized redirect URIs (this is what the backend's OAuth flow uses) →
   Create → **Download JSON**.
5. Save that file as `codebase/backend/credentials/client_secret.json`
   (gitignored). If you're running this server standalone (no backend), you
   can instead save it at `mcp/google_calendar_mcp/credentials/client_secret.json`
   and use a **Desktop app** client type — `run_local_server` below handles
   that flow itself.

### 2) Python deps + env

```bash
cd mcp
source .venv/bin/activate   # same venv as discord_mcp
pip install -r requirements.txt
```

`.env` (shared with discord_mcp) already has sane defaults:

```bash
GOOGLE_CALENDAR_ID=primary
GOOGLE_CALENDAR_DEFAULT_TZ=Asia/Ho_Chi_Minh
GOOGLE_CALENDAR_MCP_HOST=0.0.0.0
GOOGLE_CALENDAR_MCP_PORT=8086
```

`GOOGLE_CALENDAR_ID=primary` means "your main calendar" — override with a
specific calendar ID (see `list_calendars`) if you want events to land
somewhere else, e.g. a shared "Team Timeline" calendar.

## Run

```bash
python -m google_calendar_mcp
```

First run: no cached token yet, so a browser window opens asking you to sign
in and grant access. Approve it, and a `token.json` is cached in
`credentials/` (also gitignored) — subsequent runs won't prompt again unless
the token is revoked.

Serves MCP over streamable-http at:

```
http://localhost:8086/mcp
```

(Different port from `discord_mcp`'s `8085` — run both at once, your agent
connects to each separately.)

## Available tools

| Tool | Description |
|---|---|
| `list_calendars` | List calendars on this account (find IDs for `calendar_id`) |
| `list_events` | List events in a time range / matching a text query |
| `get_event` | Full details of one event |
| `create_event` | Create an event — a timeline milestone/checkpoint |
| `update_event` | Patch fields on an existing event |
| `delete_event` | Delete an event |

`start`/`end` on `create_event`/`update_event` accept either:
- `"2026-08-01"` → all-day event
- `"2026-08-01T09:00:00+07:00"` → timed event with explicit UTC offset
- `"2026-08-01T09:00:00"` (no offset) → timed event interpreted in
  `timezone` (IANA name, e.g. `Asia/Ho_Chi_Minh`) or `GOOGLE_CALENDAR_DEFAULT_TZ`
  if `timezone` isn't passed.

## Building out a timeline

There's no bulk-create tool on purpose — for a project timeline (e.g. CP1,
CP2, spec deadline, demo), have the agent call `create_event` once per
milestone. Keeps each call simple and lets the agent report per-milestone
success/failure instead of one opaque batch result.
