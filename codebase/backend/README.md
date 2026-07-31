# StudyPulse backend agent

A real tool-calling agent (system prompt + `tools.yaml` + a tool-execution
loop, in the style of `example/Day04-.../starter_v0`) wired to the MCP
integrations in `codebase/mcp/`: **Gmail** (`gmail_mcp`) and **Discord**
(`discord_mcp`), plus **Google Calendar** via Google's own hosted MCP server.
Outlook is intentionally not wired up yet.

`studypulse/` (moved here unchanged) is a separate LangGraph pipeline with a
mocked LLM/extraction step — a different, not-yet-real batch-ingestion
design, kept for reference/future work. This agent is the interactive
tool-calling path.

## How the 3 MCPs are reached

- **Gmail** and **Discord**: local MCP servers (`gmail_mcp`, `discord_mcp`). Run each as its own process; this agent connects over streamable-HTTP (`mcp_bridge/http_mcp_client.py`).
- **Google Calendar**: Google's first-party hosted MCP server at `calendarmcp.googleapis.com/mcp/v1` — nothing to run locally. Auth is a bearer token from the unified Google connection (`google_connection.py`), attached per call by `mcp_bridge/google_calendar_client.py`. Requires Developer Preview enrollment and both `calendar-json` + `calendarmcp` APIs enabled — see [the MCP reference](https://developers.google.com/workspace/calendar/api/v3/reference/mcp).

## Setup

```bash
cd codebase/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
test -f .env || cp .env.example .env
```

Fill in `OPENAI_API_KEY` in `codebase/backend/.env`. Discord/Gmail
credentials go in `codebase/mcp/.env` (see `codebase/mcp/discord_mcp/README.md`
and `codebase/mcp/gmail_mcp/README.md` for how to obtain each). Google Calendar
needs no credentials of its own — it reuses the unified Google connection token
from the FE's "Quản lý kết nối" > Gmail flow.

In two other terminals (same `codebase/mcp/.venv`), start the servers this
agent needs:

```bash
cd codebase/mcp && source .venv/bin/activate
python -m discord_mcp            # http://localhost:8085/mcp
```

```bash
cd codebase/mcp && source .venv/bin/activate
python -m gmail_mcp              # http://localhost:8087/mcp
```

## Run

```bash
cd codebase/backend
python chat.py --provider openai --version v0
```

Type a request; each turn is logged to `transcripts/<version>_<provider>_<timestamp>.transcript.json`
with every tool call/result. `/exit` to stop.

Tools with no server/credentials configured yet fail closed with a plain
`{"tool": ..., "error": ..., "message": ...}` dict instead of crashing the
loop, so you can develop against a partially-configured environment.
