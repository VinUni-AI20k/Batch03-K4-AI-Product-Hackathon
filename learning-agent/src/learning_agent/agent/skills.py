"""Skills theo chuẩn agentskills.io  : skills/<name>/SKILL.md
với YAML frontmatter (name khớp tên thư mục, description chứa trigger).

Progressive disclosure 3 tầng: catalog (name+description) nạp vào system prompt
→ agent gọi load_skill đọc toàn văn → file tham chiếu chỉ đọc khi skill yêu cầu.
"""
from __future__ import annotations

from pathlib import Path

import frontmatter


class SkillSet:
    def __init__(self, skills_dir: Path):
        self.dir = Path(skills_dir)

    def _skill_files(self) -> dict[str, Path]:
        found: dict[str, Path] = {}
        if not self.dir.exists():
            return found
        for p in sorted(self.dir.glob("*/SKILL.md")):
            found[p.parent.name] = p
        for p in sorted(self.dir.glob("*.md")):  # tương thích file .md trơn
            found.setdefault(p.stem, p)
        return found

    def catalog(self) -> str:
        lines = []
        for name, path in self._skill_files().items():
            post = frontmatter.load(path)
            desc = str(post.metadata.get("description", "")).strip()
            if not desc:  # file trơn: lấy dòng đầu
                first = post.content.strip().splitlines()
                desc = first[0].lstrip("# ").strip() if first else ""
            lines.append(f"- {name}: {' '.join(desc.split())}")
        return "\n".join(lines) or "(chưa có skill nào)"

    def load(self, name: str) -> str:
        path = self._skill_files().get(name)
        if path is None:
            return f"Không có skill '{name}'. Danh sách:\n{self.catalog()}"
        return path.read_text(encoding="utf-8")

    def tool_schema(self) -> dict:
        return {
            "type": "function",
            "function": {
                "name": "load_skill",
                "description": "Đọc toàn văn hướng dẫn của một skill trước khi thực hiện task tương ứng.",
                "parameters": {
                    "type": "object",
                    "properties": {"name": {"type": "string"}},
                    "required": ["name"],
                },
            },
        }
