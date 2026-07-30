"""Bước cấu trúc hoá: nội dung thô (slide md + transcript) -> ghi chú bài học chuẩn vault.

1 lần gọi LLM (model rẻ) mỗi bài. Nếu không có LLM key -> fallback giữ nguyên
markdown thô (pipeline vẫn chạy end-to-end được).
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from openai import OpenAI

STRUCTURE_PROMPT = """Bạn là biên tập viên giáo trình. Từ nội dung bài giảng dưới đây \
(slide đã trích xuất + lời giảng có timestamp), hãy viết lại thành ghi chú bài học markdown tiếng Việt:

- Mỗi slide/chủ đề là một section `## Slide N — <tiêu đề>`; GIỮ NGUYÊN các anchor \
`<!-- src: ... -->` và timestamp `[mm:ss]` nếu có (dùng để trích nguồn).
- Hợp nhất text slide với lời giảng của đúng slide đó, viết gọn, đúng nội dung, không bịa.
- Khái niệm quan trọng bọc wikilink: [[tên-khái-niệm]] (kebab-case, tiếng Việt không dấu hoặc thuật ngữ Anh).
- Cuối bài thêm section `## Khái niệm chính` liệt kê các [[khái niệm]] kèm định nghĩa 1 câu.
Chỉ trả về markdown, không giải thích."""


def structure_lesson(
    raw_markdown: str,
    client: OpenAI | None,
    model: str,
) -> str:
    if client is None:
        return raw_markdown
    try:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": STRUCTURE_PROMPT},
                {"role": "user", "content": raw_markdown[:120_000]},
            ],
        )
        return resp.choices[0].message.content or raw_markdown
    except Exception as e:  # LLM lỗi/key sai -> vẫn giữ pipeline chạy với markdown thô
        print(f"⚠️ Bước cấu trúc hoá LLM lỗi ({e}) — giữ markdown thô.")
        return raw_markdown


def lesson_meta(source: Path, source_dir: Path, source_hash: str) -> dict:
    """Suy metadata từ vị trí file trong source_mirror: <course>/<module>/<file>."""
    rel = source.relative_to(source_dir)
    parts = rel.parts
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    return {
        "type": "lesson-note",
        "course": parts[0] if len(parts) > 1 else "unsorted",
        "module": parts[1] if len(parts) > 2 else "",
        "lesson": source.stem,
        "source_file": str(rel),
        "source_hash": source_hash,
        "generated": now,
        "lang": "vi",
        "maps": [f"[[MOC - {parts[0]}]]"] if len(parts) > 1 else [],
    }


def note_rel_path(source: Path, source_dir: Path) -> str:
    rel = source.relative_to(source_dir)
    return str(rel.with_suffix(".md"))
