from __future__ import annotations

import asyncio
from typing import Any

from mcp_bridge.outlook_client import call_tool_text
from tools._shared import err


def outlook_mail_search(query: str = "", max_results: int = 10) -> dict[str, Any]:
    """Search Outlook mail using KQL (e.g. 'subject:"deadline"', 'from:...'), or
    list recent messages across all folders if query is empty. Read-only."""
    try:
        if query:
            args: dict[str, Any] = {"operation": "search_messages", "query": query, "max_results": max_results}
        else:
            args = {"operation": "list_messages", "max_results": max_results}
        text = asyncio.run(call_tool_text("mail", args))
        return {"tool": "outlook_mail_search", "query": query, "text": text}
    except Exception as exc:
        return err("outlook_mail_search", exc)
