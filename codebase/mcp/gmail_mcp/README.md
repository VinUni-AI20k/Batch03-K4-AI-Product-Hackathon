# gmail-mcp (Python)

A local MCP server for Gmail, built the same way as
[`../google_calendar_mcp`](../google_calendar_mcp/README.md) and
[`../discord_mcp`](../discord_mcp/README.md): `FastMCP` decorator-based
tools, served over streamable-http, calling the real Gmail API
(`gmail.googleapis.com`) on demand.

This replaces the earlier `gmail_mcp_client` package's approach of talking to
a hosted `gmailmcp.googleapis.com` MCP endpoint — that endpoint returned
`403 Forbidden` even with a valid, correctly-scoped OAuth token, so this
server calls Gmail's real, public, documented REST API directly instead.

## Auth

This server does **not** run its own OAuth flow. It reads the same token file
the backend's unified Google connection writes
(`codebase/backend/credentials/token.json`, via "Quản lý kết nối" > Gmail in
the FE — see `codebase/backend/google_connection.py`), refreshing it in
place when expired. Connect Gmail once through the app before starting this
server (or before calling its tools — the server itself starts fine either
way, tool calls just fail until the token exists).

Point `GOOGLE_CALENDAR_TOKEN_FILE` (in `codebase/mcp/.env`, shared with
`google_calendar_mcp`) at that file — see `codebase/mcp/.env.example`.

## Setup

```bash
cd mcp
source .venv/bin/activate   # same venv as discord_mcp / google_calendar_mcp
pip install -r requirements.txt
```

`.env` (shared with discord_mcp / google_calendar_mcp):

```bash
GMAIL_LOCAL_MCP_HOST=0.0.0.0
GMAIL_LOCAL_MCP_PORT=8087
```

## Run

```bash
python -m gmail_mcp
```

Serves MCP over streamable-http at:

```
http://localhost:8087/mcp
```

The backend calls this server via `GMAIL_MCP_URL` (`codebase/backend/.env.example`).

## Available tools

| Tool | Description |
|---|---|
| `search_threads` | Search threads using Gmail search syntax (e.g. `is:unread newer_than:7d`) |
| `get_thread` | Full content (all messages) of one thread by `thread_id` |

Read-only scopes only (`gmail.readonly`, `gmail.compose` — compose is
requested for scope parity with the unified connection but no send/write
tool is exposed here).
