"""Align D's weak sections with grounded transcript segments."""

from __future__ import annotations

import re
import unicodedata

from app.core.schemas import AlignmentItem, ClassifiedSegment, WeaknessAnalysis


TOKEN_RE = re.compile(r"[a-zA-Z0-9_]+")
SEGMENT_NUMBER_RE = re.compile(r"(\d+)$")
STOP_WORDS = {
    "cau", "cho", "cua", "co", "khong", "la", "phan", "sai", "section",
    "thuoc", "trong", "tu", "va", "ve", "nguoi", "hoc", "danh", "gia",
}
IMPORTANT_TERMS = {"inner", "left", "right", "full", "join", "null", "key"}


def _tokens(text: str) -> set[str]:
    normalized = unicodedata.normalize("NFKD", text.lower())
    ascii_text = "".join(ch for ch in normalized if not unicodedata.combining(ch))
    return {
        token for token in TOKEN_RE.findall(ascii_text)
        if len(token) > 2 and token not in STOP_WORDS
    }


def _segment_number(segment_id: str) -> int | None:
    match = SEGMENT_NUMBER_RE.search(segment_id)
    return int(match.group(1)) if match else None


def align_weak_sections(
    weakness: WeaknessAnalysis,
    transcript: list[ClassifiedSegment],
    *,
    max_segments_per_section: int = 3,
) -> list[AlignmentItem]:
    """Map each selected weak section to real teaching-content IDs.

    The strongest lexical match is the anchor. Immediately consecutive
    relevant segments are included to preserve explanation context.
    """
    if max_segments_per_section < 1:
        raise ValueError("max_segments_per_section must be positive")

    teaching = [item for item in transcript if item.label.value == "TEACHING_CONTENT"]
    if not teaching:
        raise ValueError("Transcript contains no TEACHING_CONTENT segment")
    reasons = {item.section_id: item.reason for item in weakness.weakness_ranking}

    result: list[AlignmentItem] = []
    for section_id in weakness.sections_to_reteach:
        reason = reasons.get(section_id, "")
        query_tokens = _tokens(reason)
        scored: list[tuple[int, int]] = []
        for index, segment in enumerate(teaching):
            overlap = query_tokens & _tokens(segment.text)
            score = sum(2 if token in IMPORTANT_TERMS else 1 for token in overlap)
            if score:
                scored.append((score, index))
        if not scored:
            raise ValueError(f"No grounded transcript segment found for {section_id}")

        scored.sort(key=lambda row: (-row[0], row[1]))
        anchor_index = scored[0][1]
        selected = [teaching[anchor_index].segment_id]
        previous_number = _segment_number(selected[0])
        for segment in teaching[anchor_index + 1 :]:
            if len(selected) >= max_segments_per_section:
                break
            number = _segment_number(segment.segment_id)
            if previous_number is None or number != previous_number + 1:
                break
            if not (query_tokens & _tokens(segment.text)):
                break
            selected.append(segment.segment_id)
            previous_number = number

        result.append(
            AlignmentItem(section_id=section_id, related_segment_ids=selected)
        )
    validate_alignment(result, transcript)
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
