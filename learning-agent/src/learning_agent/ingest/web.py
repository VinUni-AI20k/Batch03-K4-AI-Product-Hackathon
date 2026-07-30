"""HTML -> markdown. Ưu tiên Docling (giữ cấu trúc bảng/heading); nếu chưa cài
[ingest] thì fallback bằng HTMLParser của thư viện chuẩn (bỏ tag, giữ text)."""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path


class _TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts: list[str] = []
        self._skip = 0
    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self._skip += 1
        elif tag in ("h1", "h2", "h3", "h4", "p", "br", "li", "tr", "div"):
            self.parts.append("\n")
    def handle_endtag(self, tag):
        if tag in ("script", "style") and self._skip:
            self._skip -= 1
    def handle_data(self, data):
        if not self._skip and data.strip():
            self.parts.append(data.strip())


def extract_html(path: Path) -> str:
    try:
        from docling.document_converter import DocumentConverter
        return DocumentConverter().convert(str(path)).document.export_to_markdown()
    except ImportError:
        p = _TextExtractor()
        p.feed(path.read_text(encoding="utf-8", errors="replace"))
        text = " ".join(p.parts)
        # gộp khoảng trắng thừa, giữ ngắt đoạn
        lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
        return "\n\n".join(lines)
