"""Text extraction helpers for slide PDFs.

PDF pages are converted into the same ``Section`` representation used by the
quiz pipeline, but citations use page/slide IDs (``P01-S01``) instead of
transcript IDs.
"""

from __future__ import annotations

import io
import re

from pypdf import PdfReader

from app.pipeline.outline import Section, Segment


def extract_pdf_pages(pdf_bytes: bytes) -> list[str]:
    reader = PdfReader(io.BytesIO(pdf_bytes))
    return [(page.extract_text() or "").replace("\x00", "").strip() for page in reader.pages]


def parse_slide_outline(pdf_bytes: bytes) -> list[Section]:
    """Create a deterministic outline from headings/bullets on each PDF page."""
    sections: list[Section] = []
    for page_number, text in enumerate(extract_pdf_pages(pdf_bytes), start=1):
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        if not lines:
            continue
        # A slide title is normally the first short line; fall back to page title.
        title = lines[0][:120]
        body = lines[1:] or lines[:1]
        slide_id = f"P{page_number:02d}"
        section = Section(
            section_id=f"S{len(sections) + 1}",
            title=title,
            slide_ids=[slide_id],
        )
        for item_number, line in enumerate(body, start=1):
            clean = re.sub(r"^[\-•*\d.)]+\s*", "", line).strip()
            if clean:
                section.segments.append(
                    Segment(f"P{page_number:02d}-S{item_number:02d}", clean, slide_id)
                )
        if section.segments:
            sections.append(section)
    return sections
