"""Context assembly and citation verification.

Two jobs, both in service of the hard constraint that the assistant may only
use content from the uploaded PDF:

1. `build_context` decides which pages the model is allowed to see.
2. `quote_is_grounded` checks, after generation, that every quote the model
   cited really occurs on the page it claims. Unverifiable citations are
   flagged rather than silently trusted.
"""

import re
import unicodedata
from difflib import SequenceMatcher
from typing import List, Optional, Sequence, Tuple

from config import FULL_DOC_CHAR_BUDGET, TOP_K_PAGES
from schemas import Highlight
from store import Document

_WS = re.compile(r"\s+")


def _normalize(text: str) -> str:
    text = unicodedata.normalize("NFKC", text).lower()
    text = text.replace("’", "'").replace("“", '"').replace("”", '"')
    text = text.replace("–", "-").replace("—", "-")
    return _WS.sub(" ", text).strip()


def quote_is_grounded(quote: str, page_text: str, threshold: float = 0.82) -> bool:
    """True when `quote` occurs on the page verbatim or near-verbatim.

    Near-verbatim matters because PDF extraction introduces stray spaces and
    ligature differences that a model reproducing the sentence will not copy.
    """
    needle = _normalize(quote)
    haystack = _normalize(page_text)
    if not needle or not haystack:
        return False
    if needle in haystack:
        return True
    if len(needle) < 12:  # too short to verify meaningfully
        return False

    matcher = SequenceMatcher(None, needle, haystack, autojunk=False)
    match = matcher.find_longest_match(0, len(needle), 0, len(haystack))
    return match.size >= threshold * len(needle)


def select_pages(
    doc: Document,
    question: str,
    current_page: Optional[int],
    highlights: Sequence[Highlight],
    screenshot_pages: Sequence[int] = (),
) -> Tuple[List[int], str]:
    """Choose which pages go into the prompt. Returns (page numbers, strategy)."""
    all_pages = [p["page"] for p in doc.pages]

    if doc.total_chars <= FULL_DOC_CHAR_BUDGET:
        return all_pages, "full-document"

    selected: List[int] = []

    def add(page: Optional[int]) -> None:
        if page and 1 <= page <= doc.page_count and page not in selected:
            selected.append(page)

    # Pages the learner is literally pointing at come first, with neighbours
    # so a passage that runs across a page break stays intact.
    # A crop is the strongest signal of all: the slide it came from must be
    # present in full, and its neighbours often continue the same diagram.
    for page in screenshot_pages:
        add(page)
        add(page - 1)
        add(page + 1)
    for highlight in highlights:
        add(highlight.page)
    if current_page:
        add(current_page)
        add(current_page - 1)
        add(current_page + 1)

    query = " ".join([question] + [h.text for h in highlights])
    for page, _score in doc.index.search(query, top_k=TOP_K_PAGES):
        add(page)

    if not selected:
        selected = all_pages[:TOP_K_PAGES]

    selected.sort()
    return selected, "retrieval"


def build_context(doc: Document, pages: Sequence[int]) -> str:
    """Render the allowed pages as a delimited block for the prompt."""
    blocks = []
    for page in pages:
        text = doc.page_text(page).strip()
        if not text:
            text = "(no extractable text on this page)"
        blocks.append(f"<page number=\"{page}\">\n{text}\n</page>")
    return "\n\n".join(blocks)


def build_focus_block(doc: Document, pages: Sequence[int]) -> str:
    """Full text of the slides a crop was taken from, repeated for emphasis.

    These pages are already inside the main context, but a crop is a narrow
    pointer at a wide slide — restating the whole slide separately is what stops
    the model from describing the cropped pixels in isolation.
    """
    blocks = []
    for page in sorted(set(pages)):
        text = doc.page_text(page).strip()
        if not text:
            text = "(this page has no extractable text — read the attached crop instead)"
        blocks.append(f"<slide_in_focus page=\"{page}\">\n{text}\n</slide_in_focus>")
    return "\n\n".join(blocks)


def render_highlights(highlights: Sequence[Highlight]) -> str:
    if not highlights:
        return ""
    lines = [
        f"{i}. (page {h.page}) \"{h.text.strip()}\""
        for i, h in enumerate(highlights, start=1)
    ]
    return "\n".join(lines)
