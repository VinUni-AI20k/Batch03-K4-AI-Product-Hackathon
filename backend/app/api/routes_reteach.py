"""Endpoints for Phase 3 adaptive re-teaching."""

import json
import re

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field

from app.core.config import TRANSCRIPT_DIR
from app.core.session_store import get_session, save_session
from app.core.schemas import (
    CheckJudgementResponse, Citation, JudgeAnswerRequest, Level, OutlineSection,
    ReteachContent, ReteachRequest, SelfCheckGrade, SelfCheckGradeRequest, Slide,
    StudyNote, Style,
    TranscriptSegment, WeakSection,
)
from app.pipeline.outline import parse_transcript
from app.pipeline.align import align_sections
from app.pipeline.rewrite import CheckSessionNotFound, generate_study_note, judge_answer
from app.prompts.self_check_prompt import SELF_CHECK_PROMPT
from app.utils.pdf_extract import extract_pdf_pages, parse_slide_outline

router = APIRouter(prefix="/api/reteach", tags=["reteach"])


class StudyNoteRequest(BaseModel):
    session_id: str = Field(..., min_length=1)
    weak_sections: list[WeakSection] = Field(..., min_length=1)
    level: Level = Level.INTERMEDIATE
    style: Style = Style.BOTH
    time_budget_minutes: int = Field(default=15, gt=0)
    active_mode: bool = False


def _pdf_rewrite_sources(pdf_bytes: bytes):
    page_text = extract_pdf_pages(pdf_bytes)
    parsed_sections = parse_slide_outline(pdf_bytes)
    transcript_sections = parse_transcript(
        (TRANSCRIPT_DIR / "transcript-01-clean.md").read_text(encoding="utf-8")
    )
    transcript_by_id = {
        item.segment_id: item
        for section in transcript_sections
        for item in section.segments
    }
    alignment = align_sections(parsed_sections, list(transcript_by_id.values()))
    matched = {item["section_id"]: item["related_segment_ids"] for item in alignment}
    outline: list[OutlineSection] = []
    slides: list[Slide] = []
    transcript: list[TranscriptSegment] = []
    for section in parsed_sections:
        slide_id = section.slide_ids[0] if section.slide_ids else None
        if slide_id is None:
            continue
        page = int(slide_id[1:])
        outline.append(OutlineSection(
            section_id=section.section_id, title=section.title,
            key_points=section.key_points, slide_ids=[slide_id],
        ))
        slides.append(Slide(
            slide_id=slide_id, page_number=page, title=section.title,
            text=page_text[page - 1], segment_ids=[],
        ))
        for segment_id in matched.get(section.section_id, []):
            source = transcript_by_id.get(segment_id)
            if source is not None:
                transcript.append(TranscriptSegment(
                    segment_id=source.segment_id, text=source.text, slide_id=slide_id,
                ))
    return outline, slides, transcript


def _generate_note(
    payload: StudyNoteRequest,
    sources: tuple[list[OutlineSection], list[Slide], list[TranscriptSegment]],
) -> StudyNote:
    outline, slides, transcript_segments = sources
    try:
        study_note = generate_study_note(
            payload.weak_sections, outline, slides, transcript_segments,
            payload.level, payload.style, payload.time_budget_minutes,
            active_mode=payload.active_mode,
            session_id=payload.session_id,
        )
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except Exception as error:  # noqa: BLE001 - present provider failures safely
        raise HTTPException(status_code=502, detail="Grounded rewrite generation failed") from error
    session = get_session(payload.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    session.study_note = study_note
    save_session(session)
    return study_note


def _session_rewrite_sources(session_id: str):
    session = get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    if not session.outline or not session.raw_transcript:
        raise HTTPException(status_code=422, detail="Session has no uploaded learning context")
    return session.outline, session.slides or [], session.raw_transcript


@router.post("/study-note", response_model=StudyNote)
def generate_study_note_from_transcript(payload: StudyNoteRequest) -> StudyNote:
    """Generate a grounded note from context retained by the learning session."""
    return _generate_note(payload, _session_rewrite_sources(payload.session_id))


@router.post("/study-note/pdf", response_model=StudyNote, deprecated=True)
async def generate_study_note_from_pdf(
    payload_json: str = Form(...), file: UploadFile = File(...)
) -> StudyNote:
    """Generate a grounded note from the PDF currently uploaded in the UI."""
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=415, detail="Only PDF slide files are supported")
    try:
        payload = StudyNoteRequest.model_validate_json(payload_json)
    except ValueError as error:
        raise HTTPException(status_code=422, detail="Invalid study-note request") from error
    return _generate_note(payload, _pdf_rewrite_sources(await file.read()))


@router.post("/content", response_model=ReteachContent, deprecated=True)
def generate_static_reteach(payload: ReteachRequest) -> ReteachContent:
    """Return one deterministic markdown stream grounded in transcript segments.

    This intentionally does not call an LLM: level/style/time only control the
    framing and amount of source material, while every factual statement comes
    directly from the selected transcript sections.
    """
    path = TRANSCRIPT_DIR / payload.transcript_file
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Transcript not found")
    sections = parse_transcript(path.read_text(encoding="utf-8"))
    selected = [section for section in sections if section.section_id in payload.sections]
    if not selected:
        raise HTTPException(status_code=422, detail="No requested sections found")

    depth = "Tập trung vào trực giác và ví dụ." if payload.style == "intuitive" else (
        "Tập trung vào công thức, cơ chế và lý do." if payload.style == "mathematical"
        else "Kết hợp trực giác, ví dụ và cơ chế kỹ thuật."
    )
    lines = [
        "# Bài ôn tập cá nhân hoá",
        f"> Mức độ: **{payload.level.value}** · Phong cách: **{payload.style.value}** · Thời gian: **{payload.time_available_minutes} phút**",
        "",
        depth,
        "",
    ]
    citations: list[str] = []
    for section in selected:
        lines.extend([f"## {section.title}", ""])
        for segment in section.segments:
            lines.extend([f"{segment.text} ([{segment.segment_id}])", ""])
            citations.append(segment.segment_id)
        lines.extend(["---", ""])
    lines.extend(["## Nguồn tham chiếu", ""])
    lines.extend(f"- `[{citation}]`" for citation in dict.fromkeys(citations))
    return ReteachContent(
        markdown="\n".join(lines).strip(),
        citations=[
            Citation(id=citation, type="transcript", valid=True)
            for citation in dict.fromkeys(citations)
        ],
        level=payload.level,
        style=payload.style,
        time_available_minutes=payload.time_available_minutes,
    )


@router.post("/self-check/grade", response_model=SelfCheckGrade)
def grade_self_check(payload: SelfCheckGradeRequest) -> SelfCheckGrade:
    """Grade a mandatory written self-check using the section's grounded context."""
    try:
        from app.core.llm_provider import generate_text

        response = generate_text(
            "Bạn là giám khảo bài tự kiểm tra. Trả về đúng JSON theo rubric trong yêu cầu.",
            SELF_CHECK_PROMPT.format(**payload.model_dump()),
            temperature=0.1,
        )
        match = re.search(r"\{.*\}", response, re.DOTALL)
        if not match:
            raise ValueError("LLM did not return JSON")
        return SelfCheckGrade.model_validate(json.loads(match.group()))
    except (ValueError, json.JSONDecodeError) as error:
        raise HTTPException(status_code=502, detail="LLM returned an invalid self-check grade.") from error
    except Exception as error:
        raise HTTPException(status_code=503, detail="Self-check grading is temporarily unavailable.") from error


@router.post("/self-check/judge", response_model=CheckJudgementResponse)
def judge_active_mode_answer(payload: JudgeAnswerRequest) -> CheckJudgementResponse:
    """Grade an active-mode answer against the rubric retained for its session."""
    try:
        judgement = judge_answer(
            payload.session_id,
            payload.section_id,
            payload.learner_answer,
        )
        return CheckJudgementResponse(
            section_id=judgement.section_id,
            verdict=judgement.verdict,
            feedback_markdown=judgement.feedback_markdown,
            missed_points=[
                {"point": point.point, "citation": point.citation}
                for point in judgement.missed_points
            ],
        )
    except CheckSessionNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=502, detail="LLM returned an invalid active-mode judgement.") from error
    except Exception as error:  # noqa: BLE001 - do not expose provider details
        raise HTTPException(status_code=503, detail="Active-mode judging is temporarily unavailable.") from error
