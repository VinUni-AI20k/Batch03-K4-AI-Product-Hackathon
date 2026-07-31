"""PDF ingestion: split an uploaded file into one text chunk per page."""

import re
from pathlib import Path
from typing import List

from pypdf import PdfReader

_WS = re.compile(r"[ \t ]+")
_BLANK_LINES = re.compile(r"\n{3,}")


def normalize(text: str) -> str:
    """Collapse the ragged whitespace pypdf produces without losing structure."""
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines = [_WS.sub(" ", line).strip() for line in text.split("\n")]
    return _BLANK_LINES.sub("\n\n", "\n".join(lines)).strip()


def extract_pages(pdf_path: Path) -> List[dict]:
    """Return one record per page: {"page": 1-based number, "text": str}."""
    reader = PdfReader(str(pdf_path))
    pages: List[dict] = []
    for index, page in enumerate(reader.pages):
        try:
            raw = page.extract_text() or ""
        except Exception:  # a single malformed page must not fail the upload
            raw = ""
        text = normalize(raw)
        pages.append({"page": index + 1, "text": text, "char_count": len(text)})
    return pages


def page_count(pdf_path: Path) -> int:
    return len(PdfReader(str(pdf_path)).pages)


def is_probably_scanned(pages: List[dict]) -> bool:
    """True when the PDF carries almost no extractable text (image-only scan)."""
    if not pages:
        return True
    total = sum(p["char_count"] for p in pages)
    return total < 40 * len(pages)
