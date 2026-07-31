from __future__ import annotations

import os
from typing import Any

import requests

from tools._shared import TIMEOUT


TELEGRAM_TEXT_LIMIT = 4000


def _chunks(text: str) -> list[str]:
    content = (text or "").strip()
    return [content[index:index + TELEGRAM_TEXT_LIMIT] for index in range(0, len(content), TELEGRAM_TEXT_LIMIT)]


def send_telegram(text: str = "", confirmed: bool = False) -> dict[str, Any]:
    if not confirmed:
        return {
            "tool": "send_telegram",
            "status": "needs_confirmation",
            "message": "The model must mark a direct user send request with confirmed=true.",
        }
    chunks = _chunks(text)
    if not chunks:
        return {
            "tool": "send_telegram",
            "status": "missing_content",
            "error": "missing_content",
            "message": "Nothing was sent because the Telegram message is empty.",
        }
    try:
        token = os.getenv("TELEGRAM_BOT_TOKEN")
        chat_id = os.getenv("TELEGRAM_CHAT_ID")
        if not token or not chat_id:
            raise RuntimeError("Missing TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID env var")
        message_ids: list[int] = []
        for chunk in chunks:
            response = requests.post(
                f"https://api.telegram.org/bot{token}/sendMessage",
                json={"chat_id": chat_id, "text": chunk},
                timeout=TIMEOUT,
            )
            response.raise_for_status()
            payload = response.json()
            message_id = payload.get("result", {}).get("message_id")
            if isinstance(message_id, int):
                message_ids.append(message_id)
        return {
            "tool": "send_telegram",
            "status": "sent",
            "action_completed": True,
            "messages_sent": len(chunks),
            "message_ids": message_ids,
            "message": "Đã gửi nội dung lên Telegram.",
        }
    except Exception as exc:
        # Do not expose the request URL: Telegram embeds the bot token in it.
        return {
            "tool": "send_telegram",
            "status": "error",
            "error": type(exc).__name__,
            "message": "Telegram API request failed; no secret was logged.",
        }
