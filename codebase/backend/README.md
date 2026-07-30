# StudyPulse backend agent

A real tool-calling agent (system prompt + `tools.yaml` + a tool-execution
loop, in the style of `example/Day04-.../starter_v0`) wired to the MCP
integrations in `codebase/mcp/`: **Gmail** (`gmail_mcp_client`), **Discord**
(`discord_mcp`), and **Google Calendar** (`google_calendar_mcp`). Outlook is
intentionally not wired up yet.

`studypulse/` (moved here unchanged) is a separate LangGraph pipeline with a
mocked LLM/extraction step — a different, not-yet-real batch-ingestion
design, kept for reference/future work. This agent is the interactive
tool-calling path.

## How the 3 MCPs are reached

- **Gmail**: `tools/gmail_search`, `tools/gmail_read_thread` import
  `GmailMcpClient` from `codebase/mcp/gmail_mcp_client` directly (it talks to
  Google's hosted Gmail MCP over HTTP+OAuth — no local server to run).
- **Discord** and **Google Calendar**: both ship as MCP *servers only* — run
  each as its own process, and this agent connects to them over
  streamable-HTTP (`mcp_bridge/http_mcp_client.py`), exactly as their own
  READMEs describe ("run both at once, your agent connects to each
  separately").

## Setup

```bash
cd codebase/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
test -f .env || cp .env.example .env
```

Fill in `OPENAI_API_KEY` in `codebase/backend/.env`. Discord/Calendar/Gmail
credentials go in `codebase/mcp/.env` (see `codebase/mcp/discord_mcp/README.md`,
`codebase/mcp/google_calendar_mcp/README.md`, `codebase/mcp/gmail_mcp_client/README.md`
for how to obtain each).

In two other terminals (same `codebase/mcp/.venv`), start the servers this
agent needs:

```bash
cd codebase/mcp && source .venv/bin/activate
python -m discord_mcp            # http://localhost:8085/mcp
```

```bash
cd codebase/mcp && source .venv/bin/activate
python -m google_calendar_mcp    # http://localhost:8086/mcp
```

Gmail needs no local server — `gmail_search`/`gmail_read_thread` will prompt
for OAuth in the browser on first use if `GMAIL_MCP_ACCESS_TOKEN` isn't set.

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
