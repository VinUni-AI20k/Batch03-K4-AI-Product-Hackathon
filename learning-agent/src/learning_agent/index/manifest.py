"""Manifest hash theo file nguồn — trái tim của cơ chế incremental update.

Pattern Khoj/LlamaIndex: lưu sha256 từng file nguồn; lần sync sau so hash
-> chỉ file mới/đổi mới chạy lại trích xuất + re-embed; file xoá thì gỡ index.
"""
from __future__ import annotations

import hashlib
import sqlite3
from dataclasses import dataclass
from pathlib import Path


def file_hash(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return "sha256:" + h.hexdigest()


@dataclass
class Changes:
    added: list[Path]
    modified: list[Path]
    deleted: list[str]  # đường dẫn tương đối đã biến mất


class Manifest:
    def __init__(self, db_path: Path):
        db_path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(db_path)
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS files (rel_path TEXT PRIMARY KEY, hash TEXT, note_path TEXT)"
        )

    def diff(self, source_dir: Path, exts: set[str]) -> Changes:
        current = {
            str(p.relative_to(source_dir)): p
            for p in source_dir.rglob("*")
            if p.is_file() and p.suffix.lower() in exts
        }
        known = dict(self.conn.execute("SELECT rel_path, hash FROM files"))
        added, modified = [], []
        for rel, p in current.items():
            h = file_hash(p)
            if rel not in known:
                added.append(p)
            elif known[rel] != h:
                modified.append(p)
        deleted = [rel for rel in known if rel not in current]
        return Changes(added=added, modified=modified, deleted=deleted)

    def record(self, source_dir: Path, path: Path, note_path: str) -> None:
        self.conn.execute(
            "INSERT OR REPLACE INTO files VALUES (?, ?, ?)",
            (str(path.relative_to(source_dir)), file_hash(path), note_path),
        )
        self.conn.commit()

    def count(self) -> int:
        return self.conn.execute("SELECT COUNT(*) FROM files").fetchone()[0]

    def note_for(self, rel_path: str) -> str | None:
        row = self.conn.execute(
            "SELECT note_path FROM files WHERE rel_path=?", (rel_path,)
        ).fetchone()
        return row[0] if row else None

    def forget(self, rel_path: str) -> None:
        self.conn.execute("DELETE FROM files WHERE rel_path=?", (rel_path,))
        self.conn.commit()
