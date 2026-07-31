from __future__ import annotations

import os
from typing import Any

TIMEOUT = 30

DISCORD_MCP_URL = os.environ.get("DISCORD_MCP_URL", "http://localhost:8085/mcp")
GMAIL_MCP_URL = os.environ.get("GMAIL_MCP_URL", "http://localhost:8087/mcp")
# Google Calendar is not a local server — it's Google's hosted MCP endpoint.
# See mcp_bridge/google_calendar_client.py for its URL and auth.


def _innermost(exc: BaseException) -> BaseException:
    """Unwrap anyio/asyncio TaskGroup ExceptionGroups down to the real cause
    (e.g. httpx.ConnectError instead of an opaque "unhandled errors in a
    TaskGroup") so tool error messages stay debuggable."""
    sub_exceptions = getattr(exc, "exceptions", None)
    while sub_exceptions:
        exc = sub_exceptions[0]
        sub_exceptions = getattr(exc, "exceptions", None)
    return exc


def err(tool: str, exc: Exception) -> dict[str, Any]:
    real_exc = _innermost(exc)
    return {"tool": tool, "error": type(real_exc).__name__, "message": str(real_exc)}
