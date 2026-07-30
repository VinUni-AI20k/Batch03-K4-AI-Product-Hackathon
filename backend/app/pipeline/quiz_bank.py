"""Quyết định AI trung tâm của prototype: sinh MCQ từ nội dung bài giảng đã
lọc (chỉ lời giảng viên), gắn section_id + segment_id để trích dẫn được.

Đây là lời gọi AI thật duy nhất bắt buộc cho CP3 — không hardcode."""
from app.core.llm_client_openai import call_json
from app.pipeline.outline import Section
from app.prompts.quiz_bank_prompt import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE


class QuizGenerationError(Exception):
    pass


def _validate(questions: list[dict], sections: list[Section]) -> tuple[list[dict], list[str]]:
    """Split raw model output into (valid, drop_reasons) — every drop is a concrete
    grounding/format violation, never a silent guess."""
    valid_section_ids = {s.section_id for s in sections}
    valid_segment_ids = {seg.segment_id for s in sections for seg in s.segments}

    checked, reasons = [], []
    for q in questions:
        if not isinstance(q.get("options"), list) or len(q.get("options", [])) != 4:
            reasons.append(f"malformed_options: {q.get('question', '?')[:50]}")
            continue
        if q.get("section_id") not in valid_section_ids:
            reasons.append(f"hallucinated_section({q.get('section_id')}): {q.get('question', '?')[:50]}")
            continue
        if q.get("segment_id") not in valid_segment_ids:
            reasons.append(f"hallucinated_citation({q.get('segment_id')}): {q.get('question', '?')[:50]}")
            continue
        if not isinstance(q.get("correct_index"), int) or not (0 <= q["correct_index"] < 4):
            reasons.append(f"invalid_correct_index: {q.get('question', '?')[:50]}")
            continue
        checked.append(q)
    return checked, reasons


def call_llm_for_quiz(sections: list[Section], n_questions: int = 20) -> list[dict]:
    """Raw model call, no validation — used directly by eval to measure hallucination rate."""
    content = "\n\n".join(
        f"## {s.title} (section_id: {s.section_id})\n{s.as_text()}" for s in sections
    )
    user_prompt = USER_PROMPT_TEMPLATE.format(n_questions=n_questions, content=content)
    try:
        result = call_json(SYSTEM_PROMPT, user_prompt)
    except Exception as exc:  # noqa: BLE001 — surface as a domain error, no silent fallback
        raise QuizGenerationError(f"AI call failed: {exc}") from exc
    questions = result.get("questions")
    if not isinstance(questions, list):
        raise QuizGenerationError("Model trả về JSON không có 'questions' hợp lệ")
    return questions


def generate_quiz(sections: list[Section], n_questions: int = 20) -> list[dict]:
    raw = call_llm_for_quiz(sections, n_questions)
    checked, _reasons = _validate(raw, sections)
    if not checked:
        raise QuizGenerationError("Toàn bộ câu hỏi bị loại vì không trace được về section/segment thật")
    return checked


def generate_quiz_with_diagnostics(sections: list[Section], n_questions: int = 20) -> dict:
    """Same call, but returns raw vs validated counts + drop reasons — for eval/golden set only."""
    if not sections:
        return {"raw": [], "valid": [], "drop_reasons": [], "error": "no_sections_provided"}
    try:
        raw = call_llm_for_quiz(sections, n_questions)
    except QuizGenerationError as exc:
        return {"raw": [], "valid": [], "drop_reasons": [], "error": str(exc)}
    valid, reasons = _validate(raw, sections)
    return {"raw": raw, "valid": valid, "drop_reasons": reasons, "error": None}
