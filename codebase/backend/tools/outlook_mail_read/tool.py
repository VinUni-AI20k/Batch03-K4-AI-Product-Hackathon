from __future__ import annotations

import asyncio
from typing import Any

from mcp_bridge.outlook_client import call_tool_text
from tools._shared import err


def outlook_mail_read(message_id: str = "") -> dict[str, Any]:
    """Read the full content of one Outlook message by message_id, from outlook_mail_search."""
    if not message_id:
        return err("outlook_mail_read", ValueError("message_id cannot be empty"))
    try:
        args = {"operation": "get_message", "message_id": message_id, "output": "raw"}
        text = asyncio.run(call_tool_text("mail", args))
        return {"tool": "outlook_mail_read", "message_id": message_id, "text": text}
    except Exception as exc:
        return err("outlook_mail_read", exc)
