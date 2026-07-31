"""Align C's weakness results with grounded transcript segments."""

from __future__ import annotations

import re
import unicodedata

from app.core.schemas import AlignmentItem, ClassifiedSegment, OutlineSection
from app.pipeline.weakness import WeaknessResultInput, validate_weakness_results


TOKEN_RE = re.compile(r"[a-zA-Z0-9_]+")
STOP_WORDS = {
    "cau", "cho", "cua", "co", "khong", "la", "phan", "section", "trong",
    "tu", "va", "ve", "nguoi", "hoc", "danh", "gia", "rule", "based",
}
IMPORTANT_TERMS = {"inner", "left", "right", "full", "join", "null", "key"}


def _tokens(text: str) -> set[str]:
    normalized = unicodedata.normalize("NFKD", text.lower())
    ascii_text = "".join(ch for ch in normalized if not unicodedata.combining(ch))
    return {
        token for token in TOKEN_RE.findall(ascii_text)
        if len(token) > 2 and token not in STOP_WORDS
    }


def align_weak_sections(
    weaknesses: list[WeaknessResultInput],
    outline: list[OutlineSection],
    transcript: list[ClassifiedSegment],
    *,
    max_segments_per_section: int = 3,
) -> list[AlignmentItem]:
    """Find real transcript evidence for each weakness selected by C.

    Outline title and key points provide the subject vocabulary, so alignment
    does not depend on the learner writing an optional open answer.
    """
    if max_segments_per_section < 1:
        raise ValueError("max_segments_per_section must be positive")

    outline_by_id = {section.section_id: section for section in outline}
    validate_weakness_results(weaknesses, set(outline_by_id))
    teaching = [item for item in transcript if item.label.value == "TEACHING_CONTENT"]
    if not teaching:
        raise ValueError("Transcript contains no TEACHING_CONTENT segment")

    result: list[AlignmentItem] = []
    for weakness in weaknesses:
        section = outline_by_id[weakness.outline_section_id]
        query = " ".join([section.title, *section.key_points, weakness.reasoning])
        query_tokens = _tokens(query)
        scored: list[tuple[int, int, str]] = []
        for order, segment in enumerate(teaching):
            overlap = query_tokens & _tokens(segment.text)
            score = sum(2 if token in IMPORTANT_TERMS else 1 for token in overlap)
            if score > 0:
                scored.append((score, order, segment.segment_id))

        scored.sort(key=lambda row: (-row[0], row[1]))
        segment_ids = [row[2] for row in scored[:max_segments_per_section]]
        if not segment_ids:
            raise ValueError(
                f"No grounded transcript segment found for {weakness.outline_section_id}"
            )
        result.append(
            AlignmentItem(
                section_id=weakness.outline_section_id,
                related_segment_ids=segment_ids,
            )
        )
    return result


def validate_alignment(
    alignment: list[AlignmentItem], transcript: list[ClassifiedSegment]
) -> None:
    valid_ids = {segment.segment_id for segment in transcript}
    invalid = {
        segment_id
        for item in alignment
        for segment_id in item.related_segment_ids
        if segment_id not in valid_ids
    }
    if invalid:
        raise ValueError(f"Unknown transcript segment IDs: {sorted(invalid)}")
