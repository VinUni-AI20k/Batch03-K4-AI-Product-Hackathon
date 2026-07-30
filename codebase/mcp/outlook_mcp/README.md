# outlook_mcp (Python client, Dockerized Go server)

Unlike `discord_mcp` and `google_calendar_mcp`, this isn't a Python MCP
*server* — it's a thin Python MCP *client* wrapping the existing
[outlook-local-mcp](https://github.com/desek/outlook-local-mcp) Go server
(vendored for reference at `../../example/outlook-local-mcp`), run inside
Docker.

## Why a client, not a server

`outlook-local-mcp` only speaks MCP over stdio (`server.ServeStdio(s)` — no
HTTP/SSE mode exists in the binary, confirmed by reading `cmd/outlook-local-mcp/main.go`).
That's not a Claude-Desktop-specific limitation — stdio MCP is just JSON-RPC
over stdin/stdout, and *any* MCP client can drive it, including a Python one.
Claude Desktop happens to be one such client (its config spawns
`docker run -i --rm ... outlook-local-mcp`); `client.py` here does the same
thing, just from our own agent's Python process instead of a GUI app.

Reusing the Go binary as-is (rather than reimplementing mail/calendar tools
in Python like the other two servers) means zero risk of drifting from a
mature, tested implementation — we're just changing who's on the other end
of stdin/stdout.

## Setup

### 1) Build the image

```bash
cd example/outlook-local-mcp
docker build -t outlook-local-mcp:local .
```

This compiles from source inside Docker (Go toolchain included in the build
stage) — no local Go install needed. Takes a couple minutes the first time.

(Alternative: `docker pull ghcr.io/desek/outlook-local-mcp:latest` and set
`OUTLOOK_MCP_IMAGE=ghcr.io/desek/outlook-local-mcp:latest` in `.env` instead —
simpler if you trust the published image and have network access, skips
the local build.)

### 2) No Azure app registration needed

Unlike Google Calendar, this defaults to Microsoft's own well-known
"Outlook Desktop" public client ID (`d3590ed6-...`), tenant `common`. That
combination forces **device-code auth**: the container prints a URL
(`https://microsoft.com/devicelogin`) and a short code to its stderr, and
polls Microsoft until you finish signing in in a browser — no redirect URI,
no app to register, works for personal or work/school Microsoft accounts.

### 3) Config (`.env`, shared with the other servers)

Defaults already match the agreed scope (calendar read/write always on —
it's baked into the binary and can't be disabled; mail read-only tools on;
no drafts; mail send is never available in this project regardless of
config):

```bash
OUTLOOK_MCP_IMAGE=outlook-local-mcp:local
OUTLOOK_MCP_VOLUME=outlook-mcp-auth
OUTLOOK_MCP_CLIENT_ID=d3590ed6-52b3-4102-aeff-aad2292ab01c
OUTLOOK_MCP_TENANT_ID=common
OUTLOOK_MCP_MAIL_ENABLED=true
OUTLOOK_MCP_MAIL_MANAGE_ENABLED=false
OUTLOOK_MCP_READ_ONLY=false
OUTLOOK_MCP_DEFAULT_TIMEZONE=Asia/Ho_Chi_Minh
OUTLOOK_MCP_LOG_LEVEL=warn
```

The token cache lives in the named Docker volume `outlook-mcp-auth` (created
automatically), not a host path — it survives across runs without any host
directory bookkeeping.

## Usage from Python

```python
import asyncio
from outlook_mcp.client import OutlookMCPClient

async def main():
    async with OutlookMCPClient() as outlook:
        for tool in await outlook.list_tools():
            print(tool.name, "-", tool.description)

        # First call on a fresh volume blocks on device-code auth: watch this
        # process's stderr for the URL + code, sign in in a browser, then it
        # continues automatically. Subsequent calls are silent (cached token).
        result = await outlook.call_tool("calendar", {"operation": "list_events", "date": "today"})
        print(result)

asyncio.run(main())
```

`OutlookMCPClient` spawns one `docker run -i --rm ...` subprocess per
`async with` block and holds it open for the duration — reuse the same
instance for every tool call in a session rather than opening a new one per
call (each spawn is a fresh container + a fresh, if silent, auth check).

## Tool shape

This server exposes **aggregate domain tools** dispatched by an `operation`
verb, not one tool per operation (a different pattern from `discord_mcp` /
`google_calendar_mcp`):

```python
await outlook.call_tool("calendar", {"operation": "list_events", "date": "today"})
await outlook.call_tool("mail", {"operation": "list_folders"})
await outlook.call_tool("system", {"operation": "about"})
```

Call any domain with `{"operation": "help"}` to list its verbs and
parameters, e.g. `await outlook.call_tool("calendar", {"operation": "help"})`.
