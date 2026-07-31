"""
data_loader.py — Parse 6 transcript .md files thành list of chunks.
Mỗi chunk = 1 đoạn [Txx-NNN] với metadata.
"""

import re
import os
from pathlib import Path
from typing import List, Dict, Optional

# Ánh xạ file → tên buổi
TRANSCRIPT_META = {
    "transcript-01-clean.md": {
        "label": "Day 2 sáng — Xác định bài toán kinh doanh cho AI",
        "day": "Day 2",
    },
    "transcript-02-clean.md": {
        "label": "Day 2 — Chỉ số thành công & mức tự động hoá",
        "day": "Day 2",
    },
    "transcript-03-clean.md": {
        "label": "Day 2 chiều — Soi bài toán & tự động hoá",
        "day": "Day 2",
    },
    "transcript-04-clean.md": {
        "label": "Day 1 — Foundation: cách LLM hoạt động",
        "day": "Day 1",
    },
    "transcript-05-clean.md": {
        "label": "Bài toán · đánh giá · dữ liệu",
        "day": "—",
    },
    "transcript-06-clean.md": {
        "label": "Foundation: Transformer & Attention",
        "day": "—",
    },
}

# Regex bắt mã đoạn [Txx-NNN]
CHUNK_PATTERN = re.compile(
    r"\*\*\[(?P<code>T\d{2}-\d{3})\]\*\*\s*(?P<text>.+?)(?=\n\*\*\[T\d{2}-\d{3}\]\*\*|\n## |\Z)",
    re.DOTALL,
)


def load_transcripts(data_dir: Optional[str] = None) -> List[Dict]:
    """
    Load tất cả transcript files, trả về list of chunks.

    Mỗi chunk:
        {
            "id": "T01-001",
            "text": "nội dung đoạn...",
            "source_file": "transcript-01-clean.md",
            "source_label": "Day 2 sáng — Xác định bài toán kinh doanh cho AI",
            "day": "Day 2",
        }
    """
    if data_dir is None:
        # Tìm thư mục data relative to project root
        project_root = Path(__file__).resolve().parent.parent
        data_dir = project_root / "data" / "vlearn-pack" / "transcript"

    data_dir = Path(data_dir)
    chunks = []

    for filename, meta in TRANSCRIPT_META.items():
        filepath = data_dir / filename
        if not filepath.exists():
            print(f"⚠️  Không tìm thấy file: {filepath}")
            continue

        content = filepath.read_text(encoding="utf-8")

        for match in CHUNK_PATTERN.finditer(content):
            code = match.group("code")
            text = match.group("text").strip()

            # Bỏ các đoạn quá ngắn (< 20 ký tự) — thường là heading artifact
            if len(text) < 20:
                continue

            chunks.append(
                {
                    "id": code,
                    "text": text,
                    "source_file": filename,
                    "source_label": meta["label"],
                    "day": meta["day"],
                }
            )

    return chunks


def get_transcript_options() -> List[Dict]:
    """Trả về danh sách buổi học để hiển thị trong dropdown."""
    options = [{"value": "all", "label": "🔍 Tất cả buổi học"}]
    for filename, meta in TRANSCRIPT_META.items():
        options.append(
            {
                "value": filename,
                "label": f"📖 {meta['label']}",
            }
        )
    return options


if __name__ == "__main__":
    chunks = load_transcripts()
    print(f"✅ Loaded {len(chunks)} chunks từ {len(TRANSCRIPT_META)} transcript files")
    for c in chunks[:3]:
        print(f"  [{c['id']}] {c['text'][:80]}...")
