from __future__ import annotations

from typing import Any


def ask_for_missing_info(question: str = "", response_type: str = "text") -> dict[str, Any]:
    return {
        "tool": "ask_for_missing_info",
        "question": question,
        "response_type": "text",
        "options": [],
        "awaiting_user": True,
    }
