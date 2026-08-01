"""Note: một file markdown có frontmatter + wikilink, tương thích Obsidian.

Tham khảo entity model của basic-memory nhưng tối giản: chỉ frontmatter,
wikilinks và sections theo heading — đủ cho ghi chú bài học/khái niệm.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import frontmatter

WIKILINK_RE = re.compile(r"\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]")


@dataclass
class Note:
    path: Path
    meta: dict[str, Any] = field(default_factory=dict)
    body: str = ""

    @property
    def name(self) -> str:
        return self.path.stem

    @property
    def wikilinks(self) -> list[str]:
        """Tên các note được [[link]] tới trong body (bỏ phần #heading và |alias)."""
        return [m.strip() for m in WIKILINK_RE.findall(self.body)]

    def sections(self) -> list[tuple[str, str]]:
        """Chia body theo heading cấp 2 -> [(heading, nội dung)]. Phần trước heading đầu có heading ''. """
        parts: list[tuple[str, str]] = []
        current_head, current_lines = "", []
        for line in self.body.splitlines():
            if line.startswith("## "):
                if current_head or current_lines:
                    parts.append((current_head, "\n".join(current_lines).strip()))
                current_head, current_lines = line[3:].strip(), []
            else:
                current_lines.append(line)
        if current_head or current_lines:
            parts.append((current_head, "\n".join(current_lines).strip()))
        return parts

    @classmethod
    def load(cls, path: Path) -> "Note":
        post = frontmatter.load(path)
        return cls(path=path, meta=dict(post.metadata), body=post.content)

    def save(self) -> None:
        post = frontmatter.Post(self.body, **self.meta)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(frontmatter.dumps(post) + "\n", encoding="utf-8")
