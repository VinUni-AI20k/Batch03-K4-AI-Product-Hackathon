from __future__ import annotations

import asyncio
from typing import Any

from tools._shared import err


def _to_plain(value: Any) -> Any:
    if hasattr(value, "model_dump"):
        return value.model_dump(mode="json")
    if hasattr(value, "__dict__"):
        return value.__dict__
    return value


async def _search_async(query: str, max_results: int) -> Any:
    from gmail_mcp_client.client import GmailMcpClient
    from gmail_mcp_client.config import load_mcp_env

    load_mcp_env()
    client = GmailMcpClient()
    async with client.connect() as gmail:
        result = await gmail.search(query, maxResults=max_results)
        return _to_plain(result)


def gmail_search(query: str = "", max_results: int = 10) -> dict[str, Any]:
    """Search Gmail threads. `query` uses Gmail search syntax, e.g. `is:unread newer_than:7d`."""
    try:
        data = asyncio.run(_search_async(query, max_results))
        return {"tool": "gmail_search", "query": query, "result": data}
    except Exception as exc:
        return err("gmail_search", exc)
