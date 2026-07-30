"""Vault engine tự build, kiểu Obsidian: thư mục markdown là source of truth.

Nguyên tắc (từ basic-memory / Khoj):
- courses/  : ghi chú máy sinh từ pipeline — regenerate an toàn, được phép ghi đè
- concepts/ : ghi chú khái niệm do agent/người viết — KHÔNG bao giờ ghi đè, chỉ append/edit
- mocs/     : Map of Content, sinh lại từ frontmatter
- students/ : memory theo từng học viên (key = Discord user ID)
- sources/  : file gốc (PDF/PPTX) để wikilink trích nguồn
Index (Chroma/SQLite) luôn là phái sinh — xoá đi rebuild lại được từ vault.
"""
from __future__ import annotations

import subprocess
from pathlib import Path
from typing import Iterator

from .note import Note

MACHINE_DIRS = {"courses", "mocs"}   # regenerate được
HUMAN_DIRS = {"concepts", "students"}  # không ghi đè


class Vault:
    def __init__(self, path: Path, git_autocommit: bool = False):
        self.path = Path(path)
        self.git_autocommit = git_autocommit
        for d in ("courses", "concepts", "mocs", "sources", "students"):
            (self.path / d).mkdir(parents=True, exist_ok=True)

    # ---------- đọc ----------
    def notes(self, subdir: str | None = None) -> Iterator[Note]:
        base = self.path / subdir if subdir else self.path
        for p in sorted(base.rglob("*.md")):
            yield Note.load(p)

    def find(self, name: str) -> Note | None:
        """Tìm note theo tên file (cách wikilink resolve trong Obsidian)."""
        for p in self.path.rglob(f"{name}.md"):
            return Note.load(p)
        return None

    def backlinks(self, name: str) -> list[Note]:
        return [n for n in self.notes() if name in n.wikilinks]

    # ---------- ghi ----------
    def write_lesson_note(self, rel_path: str, meta: dict, body: str) -> Note:
        """Ghi/ghi đè ghi chú bài học (máy sinh). rel_path ví dụ: 'AI20K/03-rag/03-2-chunking.md'"""
        note = Note(path=self.path / "courses" / rel_path, meta=meta, body=body)
        note.save()
        return note

    def append_concept(self, name: str, text: str, meta: dict | None = None) -> Note:
        """Thêm nội dung vào note khái niệm; tạo mới nếu chưa có. Không bao giờ ghi đè."""
        existing = self.find(name)
        if existing and existing.path.is_relative_to(self.path / "concepts"):
            existing.body = existing.body.rstrip() + "\n\n" + text.strip() + "\n"
            existing.save()
            return existing
        note = Note(
            path=self.path / "concepts" / f"{name}.md",
            meta={"type": "concept", **(meta or {})},
            body=text.strip() + "\n",
        )
        note.save()
        return note

    def regenerate_moc(self, moc_name: str, match_map: str) -> Note:
        """Sinh lại MOC từ frontmatter: liệt kê mọi note có `maps` chứa moc này."""
        lines = [f"# {moc_name}", ""]
        for n in self.notes("courses"):
            maps = n.meta.get("maps") or []
            if any(match_map in str(m) for m in maps):
                lines.append(f"- [[{n.name}]] — {n.meta.get('lesson', '')}")
        note = Note(
            path=self.path / "mocs" / f"{moc_name}.md",
            meta={"type": "moc"},
            body="\n".join(lines) + "\n",
        )
        note.save()
        return note

    # ---------- git ----------
    def commit(self, message: str) -> None:
        if not self.git_autocommit:
            return
        if not (self.path / ".git").exists():
            subprocess.run(["git", "init", "-q"], cwd=self.path, check=False)
        subprocess.run(["git", "add", "-A"], cwd=self.path, check=False)
        subprocess.run(
            ["git", "commit", "-q", "-m", message], cwd=self.path, check=False
        )
