"""Session log + tìm kiếm toàn văn — tầng memory thứ 3 kiểu Vlearn Agent (FTS5 session search).

Mọi lượt hội thoại được ghi vào SQLite FTS5; agent dùng tool search_sessions để
nhớ lại các cuộc trò chuyện cũ ("hôm trước mình hỏi gì về RAG?"). Kết quả
scope theo user_id — học viên không đọc được hội thoại của người khác.
"""
from __future__ import annotations

import re
import sqlite3
import threading
from datetime import datetime, timezone
from pathlib import Path


class SessionLog:
    def __init__(self, db_path: Path):
        db_path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self._lock = threading.Lock()
        self.conn.execute(
            "CREATE VIRTUAL TABLE IF NOT EXISTS turns USING fts5("
            "user_id, role, content, ts, platform, "
            "tokenize='unicode61 remove_diacritics 2')"
        )

    def log(self, user_id: str, role: str, content: str, platform: str = "") -> None:
        if not content.strip():
            return
        with self._lock:
            self.conn.execute(
                "INSERT INTO turns VALUES (?, ?, ?, ?, ?)",
                (user_id, role, content[:4000],
                 datetime.now(timezone.utc).isoformat(timespec="seconds"), platform),
            )
            self.conn.commit()

    def search(self, query: str, user_id: str, limit: int = 6) -> str:
        # bỏ ký tự đặc biệt của cú pháp FTS5 để query người dùng không gây lỗi
        clean = re.sub(r'["\'\^\*\(\)\-:]', " ", query).strip()
        if not clean:
            return "Truy vấn trống."
        with self._lock:
            try:
                rows = self.conn.execute(
                    "SELECT ts, role, snippet(turns, 2, '«', '»', ' … ', 16) "
                    "FROM turns WHERE turns MATCH ? AND user_id = ? "
                    "ORDER BY rank LIMIT ?",
                    (f"content: {clean}", user_id, limit),
                ).fetchall()
            except sqlite3.OperationalError:
                return "Không tìm được (truy vấn không hợp lệ)."
        matched = "\n".join(
            f"- [{ts[:16].replace('T', ' ')}] ({'học viên' if role == 'user' else 'agent'}): {snip}"
            for ts, role, snip in rows
        )
        # luôn kèm các trao đổi gần nhất — đủ ngữ cảnh cho câu "hôm trước mình hỏi gì"
        recent = self.recent(user_id, header="Các trao đổi GẦN NHẤT (mới ở cuối):")
        if not rows:
            return "Không khớp từ khoá.\n\n" + recent
        return "Khớp từ khoá:\n" + matched + "\n\n" + recent

    def recent(self, user_id: str, limit: int = 8, header: str = "Các trao đổi gần nhất:") -> str:
        with self._lock:
            rows = self.conn.execute(
                "SELECT ts, role, substr(content, 1, 160) FROM turns "
                "WHERE user_id = ? ORDER BY ts DESC LIMIT ?",
                (user_id, limit),
            ).fetchall()
        if not rows:
            return "Chưa có hội thoại nào được ghi lại với học viên này."
        lines = [
            f"- [{ts[:16].replace('T', ' ')}] ({'học viên' if role == 'user' else 'agent'}): {c}"
            for ts, role, c in reversed(rows)
        ]
        return header + "\n" + "\n".join(lines)
