from __future__ import annotations

import os
from typing import Any

# Registers codebase/mcp/gmail_mcp_client on sys.path before any tool module
# tries `import gmail_mcp_client`.
from mcp_bridge import mcp_paths  # noqa: F401

TIMEOUT = 30

DISCORD_MCP_URL = os.environ.get("DISCORD_MCP_URL", "http://localhost:8085/mcp")
GOOGLE_CALENDAR_MCP_URL = os.environ.get("GOOGLE_CALENDAR_MCP_URL", "http://localhost:8086/mcp")


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
