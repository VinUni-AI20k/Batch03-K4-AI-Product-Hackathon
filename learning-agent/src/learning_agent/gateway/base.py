"""Phần dùng chung cho mọi channel adapter (Discord, Telegram).

Pattern Hermes: 1 gateway nhiều platform, allowlist theo user id,
"home chat" (/sethome) là nơi cron giao kết quả.
"""
from __future__ import annotations

import json
import os
from pathlib import Path


def split_message(text: str, max_len: int) -> list[str]:
    """Cắt theo đoạn, không vượt giới hạn ký tự của platform (Discord 2000, Telegram 4096)."""
    if len(text) <= max_len:
        return [text]
    chunks, current = [], ""
    for para in text.split("\n\n"):
        candidate = f"{current}\n\n{para}" if current else para
        if len(candidate) <= max_len:
            current = candidate
        else:
            if current:
                chunks.append(current)
            while len(para) > max_len:
                chunks.append(para[:max_len])
                para = para[max_len:]
            current = para
    if current:
        chunks.append(current)
    return chunks


def allowed_users(env_key: str) -> set[str]:
    """Allowlist user id từ env (vd TELEGRAM_ALLOWED_USERS=123,456). Rỗng = cho tất cả (dev mode)."""
    return {x.strip() for x in os.environ.get(env_key, "").split(",") if x.strip()}


class HomeStore:
    """Lưu 'home chat' của từng platform — nơi scheduler giao báo cáo (lệnh /sethome)."""

    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.data: dict[str, str] = {}
        if path.exists():
            self.data = json.loads(path.read_text(encoding="utf-8"))

    def set(self, platform: str, chat_id: str) -> None:
        self.data[platform] = chat_id
        self.path.write_text(json.dumps(self.data), encoding="utf-8")

    def get(self, platform: str) -> str | None:
        return self.data.get(platform)
