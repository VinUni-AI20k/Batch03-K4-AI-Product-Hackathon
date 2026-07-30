"""Phần dùng chung cho mọi channel adapter (Discord, Telegram).

Pattern Vlearn Agent: 1 gateway nhiều platform, allowlist theo user id,
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


def md_to_telegram_html(text: str) -> str:
    """Chuyển Markdown LLM sinh (**đậm**, *nghiêng*, `code`, # heading, [text](url))
    sang HTML của Telegram. Escape < > & trước để không vỡ parse."""
    import html
    import re

    # tách code block ``` ``` ra giữ nguyên (không format bên trong)
    blocks: list[str] = []
    def _stash(m):
        blocks.append(m.group(1))
        return f"\x00{len(blocks)-1}\x00"
    text = re.sub(r"```[a-zA-Z0-9]*\n?(.*?)```", _stash, text, flags=re.DOTALL)

    text = html.escape(text, quote=False)                       # < > & an toàn
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)        # `code`
    text = re.sub(r"^#{1,6}\s*(.+)$", r"<b>\1</b>", text, flags=re.MULTILINE)  # heading -> đậm
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)          # **đậm**
    text = re.sub(r"(?<!\w)_(.+?)_(?!\w)", r"<i>\1</i>", text)   # _nghiêng_
    text = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", r'<a href="\2">\1</a>', text)  # [text](url)

    for i, b in enumerate(blocks):                              # trả lại code block
        text = text.replace(f"\x00{i}\x00", f"<pre>{html.escape(b, quote=False)}</pre>")
    return text


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


class PendingUploads:
    """File user gửi đang CHỜ xác nhận có nạp thành kiến thức không.
    Trong lúc chờ, text file được inject vào context để agent tra cứu được ngay
    (trường hợp user chỉ muốn hỏi chứ không cần học)."""

    def __init__(self):
        self._pending: dict = {}  # user_id -> Upload

    def set(self, user_id: str, upload) -> None:
        self._pending[user_id] = upload

    def get(self, user_id: str):
        return self._pending.get(user_id)

    def clear(self, user_id: str) -> None:
        self._pending.pop(user_id, None)

    def context(self, user_id: str) -> str:
        """Text file đang chờ, để inject vào system prompt cho agent tra cứu."""
        up = self._pending.get(user_id)
        if not up:
            return ""
        return (f"\n\n[TÀI LIỆU HỌC VIÊN VỪA GỬI — '{up.name}', dùng để trả lời câu hỏi "
                f"về file này; CHƯA nạp vào kiến thức lâu dài]:\n{up.text[:8000]}")

    @staticmethod
    def interpret(text: str) -> str | None:
        """Phân loại câu trả lời cho câu hỏi 'có nạp không'. None = coi như câu hỏi thường."""
        t = text.lower().strip()
        if len(t) > 45:  # câu dài -> là câu hỏi về file, không phải yes/no
            return None
        if any(k in t for k in ("cả 2", "cả hai", "giữ cả", "both", "cả 2 bản")):
            return "both"
        if any(t == k or t.startswith(k) for k in ("nạp", "lưu", "học", "có", "ok", "oke", "đồng ý", "yes", "ừ", "uh")):
            return "commit"
        if any(k in t for k in ("không", "khỏi", "chỉ hỏi", "chỉ đọc", "chỉ tra", "thôi", "bỏ", "no", "khong")):
            return "skip"
        return None
