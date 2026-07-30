from __future__ import annotations

from typing import Any


def confirm_action(question: str = "", response_type: str = "yes_no") -> dict[str, Any]:
    return {
        "tool": "confirm_action",
        "question": question,
        "response_type": "yes_no",
        "options": [],
        "awaiting_user": True,
    }
