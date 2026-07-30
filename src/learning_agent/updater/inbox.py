"""Nhận file học tập gửi trực tiếp qua chat (Discord/Telegram) — pattern Hermes:
attachment tải về thư mục nguồn, rồi chạy sync để vào vault + index như file từ folder."""
from __future__ import annotations

import re
from pathlib import Path

from .. import ingest
from ..index import LessonIndex
from ..vault import Vault
from .sync import sync_once


def ingest_upload(cfg, vault: Vault, index: LessonIndex, data: bytes, filename: str) -> str:
    """Lưu file người dùng gửi vào source_mirror/inbox/ rồi sync. Trả về message cho user."""
    safe = re.sub(r"[^\w.\-() ]", "_", filename).strip() or "file"
    ext = Path(safe).suffix.lower()
    if ext not in ingest.SUPPORTED_EXTS:
        return (
            f"⚠️ Chưa hỗ trợ định dạng `{ext or 'không rõ'}`. "
            f"Mình nhận: {', '.join(sorted(ingest.SUPPORTED_EXTS))}"
        )
    dest = cfg.path("sources", "dir") / "inbox" / safe
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    try:
        stats = sync_once(cfg, vault, index, verbose=False)
    except RuntimeError as e:  # thiếu dependency ingest (docling/faster-whisper...)
        dest.unlink(missing_ok=True)
        return f"⚠️ Không xử lý được `{safe}`: {e}"
    return (
        f"✅ Đã nạp `{safe}` vào tài liệu học tập "
        f"({stats['ingested']} bài, {stats['chunks']} đoạn được index). "
        f"Bạn hỏi mình về nội dung này được rồi!"
    )
