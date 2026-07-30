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


async def _read_async(thread_id: str) -> Any:
    from gmail_mcp_client.client import GmailMcpClient
    from gmail_mcp_client.config import load_mcp_env

    load_mcp_env()
    client = GmailMcpClient()
    async with client.connect() as gmail:
        result = await gmail.read_thread(thread_id)
        return _to_plain(result)


def gmail_read_thread(thread_id: str = "") -> dict[str, Any]:
    """Read the full content of one Gmail thread found via gmail_search."""
    try:
        data = asyncio.run(_read_async(thread_id))
        return {"tool": "gmail_read_thread", "thread_id": thread_id, "result": data}
    except Exception as exc:
        return err("gmail_read_thread", exc)
