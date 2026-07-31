"""Grounded retest quiz generation in one LLM call."""

from __future__ import annotations

import json
import logging
from collections.abc import Mapping, Sequence
from typing import Any

from app.core.llm_provider import generate_json
from app.core.schemas import RetestQuestion, RetestScope
from app.prompts.retest_quiz_prompt import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE

LOGGER = logging.getLogger(__name__)


def _value(item: Any, key: str, default: Any = None) -> Any:
    if isinstance(item, Mapping):
        return item.get(key, default)
    return getattr(item, key, default)


def resolve_outline_sections_in_scope(outline: Sequence[Any], scope: RetestScope) -> list[Any]:
    if scope.mode == "whole":
        return list(outline)
    section_ids = list(scope.section_ids)
    if not section_ids:
        raise ValueError("Retest scope selected requires at least one sectionId")
    by_id = {_value(section, "id", _value(section, "section_id")): section for section in outline}
    selected = [by_id[section_id] for section_id in section_ids if section_id in by_id]
    if not selected:
        raise ValueError(
            "Retest scope selected does not match any outline section: " + ", ".join(section_ids)
        )
    return selected


def allocate_requested_counts(num_questions: int, sections: Sequence[Any]) -> list[dict[str, Any]]:
    if num_questions < 1:
        raise ValueError("numQuestions must be at least 1")
    if not sections:
        raise ValueError("Retest scope contains no outline sections")
    section_count = len(sections)
    if num_questions < section_count:
        return [
            {"outline_section_id": _value(section, "id", _value(section, "section_id")), "count": 1}
            for section in sections[:num_questions]
        ]
    base, remainder = divmod(num_questions, section_count)
    return [
        {
            "outline_section_id": _value(section, "id", _value(section, "section_id")),
            "count": base + (1 if index < remainder else 0),
        }
        for index, section in enumerate(sections)
    ]


def _normalize_options(raw_options: Any) -> list[str]:
    if not isinstance(raw_options, list):
        return []
    return [item.get("text", "") if isinstance(item, Mapping) else str(item) for item in raw_options]


def generate_retest_quiz(
    outline: Sequence[Any],
    filtered_transcript: Sequence[Any],
    scope: RetestScope,
    num_questions: int,
    avoid_similar_to: Sequence[str] | None = None,
    weight_by_section_id: Mapping[str, float] | None = None,
) -> list[RetestQuestion]:
    """Generate grounded retest questions in one LLM request."""
    del weight_by_section_id  # Reserved for a later weighted allocation pass.
    sections = resolve_outline_sections_in_scope(outline, scope)
    requested_counts = allocate_requested_counts(num_questions, sections)
    transcript_rows = [
        {"id": _value(item, "id", _value(item, "segment_id")), "text": _value(item, "text", "")}
        for item in filtered_transcript
    ]
    valid_transcript_ids = {row["id"] for row in transcript_rows if row["id"]}
    section_rows = [
        {
            "id": _value(section, "id", _value(section, "section_id")),
            "title": _value(section, "title", ""),
            "summary": _value(section, "summary", _value(section, "key_points", [])),
            "slide_ref": _value(section, "slide_ref", None),
        }
        for section in sections
    ]
    prompt = USER_PROMPT_TEMPLATE.format(
        requested_counts=json.dumps(requested_counts, ensure_ascii=False),
        outline_sections=json.dumps(section_rows, ensure_ascii=False),
        filtered_transcript=json.dumps(transcript_rows, ensure_ascii=False),
        avoid_similar_to=json.dumps(list(avoid_similar_to or []), ensure_ascii=False),
    )
    # No fallback to fake questions here: a failed AI call must surface as an
    # error (the API layer turns this into a 502), never silently swap in
    # generic placeholder questions — the CP3 rule this whole prototype
    # follows is "real AI call or a clear failure, not a disguised mock".
    #
    # max_tokens matters here: each question carries question+4 options+
    # explanation+misconception_tag+source_refs. The default max_tokens=1000
    # truncates mid-JSON past ~3-4 questions (same failure mode already fixed
    # once in quiz_bank.py and once in classify.py — this was the third,
    # unfixed copy of it, and the actual cause of "câu hỏi lỗi" here).
    max_tokens = min(6000, max(1500, num_questions * 250))
    response = generate_json(SYSTEM_PROMPT, prompt, max_tokens=max_tokens)
    raw_questions = response.get("questions", []) if isinstance(response, Mapping) else []
    if not isinstance(raw_questions, list):
        raise ValueError("Retest LLM response must contain a questions list")

    section_ids = {row["id"] for row in section_rows}
    normalized: list[RetestQuestion] = []
    for index, raw in enumerate(raw_questions, start=1):
        if not isinstance(raw, Mapping):
            LOGGER.warning("invalid retest question at index=%s", index)
            continue
        # Always assign the id ourselves — trusting the model's own "id" risks
        # duplicates across questions (seen in practice), which breaks the
        # frontend's answer map (answers keyed by question id) and citation
        # matching for wrong-answer review.
        question_id = f"rq{index}"
        section_id = raw.get("outline_section_id") or raw.get("section_id")
        options = _normalize_options(raw.get("options"))
        correct_index = raw.get("correct_index")
        if section_id not in section_ids or len(options) != 4 or not isinstance(correct_index, int) or not 0 <= correct_index < 4:
            LOGGER.warning("invalid retest question id=%s", question_id)
            continue
        raw_refs = raw.get("source_refs", [])
        refs = raw_refs if isinstance(raw_refs, list) else []
        valid_refs = []
        for ref in refs:
            if ref in valid_transcript_ids:
                valid_refs.append(ref)
            else:
                LOGGER.warning("invalid source_ref=%s question_id=%s", ref, question_id)
        slide_ref = raw.get("slide_ref") or None
        if not valid_refs and not slide_ref:
            LOGGER.warning("ungrounded question question_id=%s", question_id)
        normalized.append(RetestQuestion(
            id=question_id,
            question=str(raw.get("question", "")),
            options=options,
            correct_index=correct_index,
            outline_section_id=section_id,
            explanation=str(raw.get("explanation", "")),
            source_refs=valid_refs,
            slide_ref=slide_ref,
        ))
    if abs(len(normalized) - num_questions) > 1:
        LOGGER.warning("retest question count mismatch requested=%s returned=%s", num_questions, len(normalized))
    return normalized
