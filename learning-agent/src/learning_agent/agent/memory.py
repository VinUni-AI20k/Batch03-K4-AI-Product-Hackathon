"""Memory theo từng học viên — pattern Hermes/Letta nhưng lưu ngay trong vault.

vault/students/<discord_user_id>.md : agent đọc vào context mỗi lượt,
và tự cập nhật qua tool update_student_memory (điểm yếu, đã hỏi gì, tiến độ).
"""
from __future__ import annotations

from datetime import datetime, timezone

from ..vault import Note, Vault


class StudentMemory:
    def __init__(self, vault: Vault):
        self.vault = vault

    def _path(self, user_id: str):
        return self.vault.path / "students" / f"{user_id}.md"

    def read(self, user_id: str, display_name: str = "") -> str:
        p = self._path(user_id)
        if not p.exists():
            return f"(Học viên mới: {display_name or user_id} — chưa có hồ sơ.)"
        return Note.load(p).body

    def append(self, user_id: str, fact: str, display_name: str = "") -> str:
        p = self._path(user_id)
        today = datetime.now(timezone.utc).date().isoformat()
        if p.exists():
            note = Note.load(p)
        else:
            note = Note(
                path=p,
                meta={"type": "student", "discord_id": user_id, "name": display_name},
                body=f"# Hồ sơ học tập — {display_name or user_id}\n",
            )
        note.body = note.body.rstrip() + f"\n- [{today}] {fact.strip()}"
        note.save()
        return "Đã ghi nhớ."

    def tool_schema(self) -> dict:
        return {
            "type": "function",
            "function": {
                "name": "update_student_memory",
                "description": "Ghi nhớ điều quan trọng về học viên này (điểm yếu, chủ đề đang học, mục tiêu) để các buổi sau hỗ trợ tốt hơn.",
                "parameters": {
                    "type": "object",
                    "properties": {"fact": {"type": "string"}},
                    "required": ["fact"],
                },
            },
        }
