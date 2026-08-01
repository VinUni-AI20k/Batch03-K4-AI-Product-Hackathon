"""Memory theo từng học viên — thiết kế Vlearn Agent/Letta nhưng lưu ngay trong vault.

vault/students/<discord_user_id>.md : agent đọc vào context mỗi lượt,
và tự cập nhật qua tool update_student_memory (điểm yếu, đã hỏi gì, tiến độ).
"""
from __future__ import annotations

from datetime import datetime, timezone

from ..vault import Note, Vault


MAX_CHARS = 3000  # khớp cỡ MEMORY.md — đủ ~40-60 dòng gần nhất, tránh phình context vô hạn


class StudentMemory:
    def __init__(self, vault: Vault):
        self.vault = vault

    def _path(self, user_id: str):
        return self.vault.path / "students" / f"{user_id}.md"

    def read(self, user_id: str, display_name: str = "") -> str:
        """File trên đĩa KHÔNG giới hạn (xem đủ trong Obsidian) — nhưng phần bơm vào
        prompt phải cap, và phải giữ dòng MỚI NHẤT (không phải cũ nhất) vì fact quan
        trọng nhất để cá nhân hoá luôn là cái vừa ghi, không phải cái ghi đầu tiên."""
        p = self._path(user_id)
        if not p.exists():
            return f"(Học viên mới: {display_name or user_id} — chưa có hồ sơ.)"
        body = Note.load(p).body
        if len(body) <= MAX_CHARS:
            return body
        lines = body.splitlines()
        header = lines[0] if lines and lines[0].startswith("#") else ""
        bullets = [l for l in lines if l.startswith("- ")]
        kept: list[str] = []
        total = len(header) + 1
        for line in reversed(bullets):  # từ mới nhất lùi về cũ, dừng khi chạm ngưỡng
            if total + len(line) + 1 > MAX_CHARS:
                break
            kept.append(line)
            total += len(line) + 1
        kept.reverse()
        omitted = len(bullets) - len(kept)
        note = (f"\n(… {omitted} ghi chú cũ hơn đã ẩn bớt cho gọn — xem đủ trong "
                f"vault/students/{user_id}.md)") if omitted > 0 else ""
        return header + "\n" + "\n".join(kept) + note

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
