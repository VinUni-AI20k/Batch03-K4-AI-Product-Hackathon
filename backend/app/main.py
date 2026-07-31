from fastapi import FastAPI, File, Form, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_diagnosis import router as diagnosis_router
from app.api.routes_chat import router as chat_router
from app.api.routes_llm import router as llm_router
from app.api.routes_reteach import router as reteach_router
from app.api.routes_retest_quiz import router as retest_quiz_router
from app.api.routes_saved_retest import router as saved_retest_router
from app.api.routes_session import router as session_router
from app.core.config import TRANSCRIPT_DIR
from app.core.schemas import AlignmentItem, ClassifiedSegment, OutlineSection, Slide, TranscriptSegment
from app.core.session_store import get_session, save_session
from app.core.database import initialize_database
from app.pipeline.outline import Segment, Section, outline_json, parse_transcript
from app.pipeline.align import align_sections
from app.pipeline.classify import classify_with_llm
from app.pipeline.quiz_bank import QuizGenerationError, generate_quiz
from app.utils.pdf_extract import extract_pdf_pages, parse_slide_outline
from app.api.routes_reteach import router as reteach_router
from app.api.routes_upload import router as upload_router

app = FastAPI(title="IllumiMATE API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(reteach_router)
app.include_router(upload_router) 
app.include_router(retest_quiz_router)
app.include_router(saved_retest_router)
app.include_router(diagnosis_router)
app.include_router(chat_router)
app.include_router(llm_router)
app.include_router(session_router)


def _load_sections(transcript_file: str):
    path = TRANSCRIPT_DIR / transcript_file
    if not path.is_file():
        raise HTTPException(status_code=404, detail=f"Transcript not found: {transcript_file}")
    sections = parse_transcript(path.read_text(encoding="utf-8"))
    if not sections:
        raise HTTPException(status_code=422, detail="Could not extract transcript sections")
    return sections


def _load_transcript_segments(transcript_file: str = "transcript-01-clean.md"):
    return [
        segment
        for section in _load_sections(transcript_file)
        for segment in section.segments
    ]


def _pdf_alignment(sections, transcript_text: str):
    transcript_sections = parse_transcript(transcript_text)
    transcript_segments = [
        segment
        for section in transcript_sections
        for segment in section.segments
    ]
    if not transcript_segments:
        raise HTTPException(
            status_code=422,
            detail="Could not extract transcript segments. Use Markdown with [Txx-NNN] segment markers.",
        )
    try:
        # Uploads must use the same validated classifier/provider path as the
        # offline preparation CLI. Do not silently substitute the demo heuristic here:
        # its labels are not suitable for downstream quiz/reteach decisions.
        classified = classify_with_llm([
            {"segment_id": segment.segment_id, "text": segment.text}
            for segment in transcript_segments
        ])
    except (ValueError, RuntimeError) as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Transcript classification failed: {exc}",
        ) from exc
    return transcript_segments, classified, align_sections(sections, transcript_segments)


def _pdf_slide_context(pdf_bytes: bytes, sections) -> list[dict[str, object]]:
    pages = extract_pdf_pages(pdf_bytes)
    result = []
    for section in sections:
        if not section.slide_ids:
            continue
        slide_id = section.slide_ids[0]
        page_number = int(slide_id[1:])
        result.append({
            "id": slide_id,
            "title": section.title,
            "text": pages[page_number - 1] if page_number <= len(pages) else "",
        })
    return result


def _require_session(session_id: str):
    session = get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


def _persist_pdf_context(session_id: str, pdf_bytes: bytes, sections, transcript_text: str) -> None:
    session = _require_session(session_id)
    transcript_segments, classified, alignment = _pdf_alignment(sections, transcript_text)
    pages = extract_pdf_pages(pdf_bytes)
    slides = [
        Slide(
            slide_id=f"P{index:02d}", page_number=index,
            title=section.title,
            text=pages[index - 1] if index <= len(pages) else "",
            segment_ids=next(
                (item["related_segment_ids"] for item in alignment
                 if item["section_id"] == section.section_id), []
            ),
        )
        for index, section in enumerate(sections, start=1)
    ]
    segment_slide = {
        segment_id: f"P{index:02d}"
        for index, item in enumerate(alignment, start=1)
        for segment_id in item["related_segment_ids"]
    }
    session.raw_transcript = [
        TranscriptSegment(
            segment_id=item.segment_id, text=item.text,
            slide_id=segment_slide.get(item.segment_id),
        )
        for item in transcript_segments
    ]
    session.classified_transcript = [
        ClassifiedSegment(
            segment_id=item["segment_id"],
            text=next((segment.text for segment in transcript_segments
                       if segment.segment_id == item["segment_id"]), ""),
            label=item["label"],
        )
        for item in classified
    ]
    session.outline = [OutlineSection(**item) for item in outline_json(sections)]
    session.slides = slides
    session.alignment = [AlignmentItem(**item) for item in alignment]
    session.source = "slide_pdf"
    save_session(session)


def _session_sections(session):
    transcript_by_id = {item.segment_id: item for item in (session.raw_transcript or [])}
    matches_by_section = {
        item.section_id: item.related_segment_ids for item in (session.alignment or [])
    }
    return [
        Section(
            section_id=item.section_id,
            title=item.title,
            slide_ids=item.slide_ids,
            segments=[
                Segment(segment_id=segment_id, text=transcript_by_id[segment_id].text)
                for segment_id in matches_by_section.get(item.section_id, [])
                if segment_id in transcript_by_id
            ],
        )
        for item in (session.outline or [])
    ]


@app.get("/api/outline", deprecated=True)
def get_outline(transcript_file: str = "transcript-01-clean.md"):
    return {"outline": outline_json(_load_sections(transcript_file)), "source": "transcript"}


@app.post("/api/outline/pdf")
async def get_outline_from_pdf(
    file: UploadFile = File(...), session_id: str = Form(...)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=415, detail="Only PDF slide files are supported")
    pdf_bytes = await file.read()
    sections = parse_slide_outline(pdf_bytes)
    if not sections:
        raise HTTPException(status_code=422, detail="Could not extract text from PDF slides")
    return {
        "outline": outline_json(sections),
        "alignment": [],
        "slides": [],
        "source": "slide_pdf",
    }


@app.post("/api/knowledge/upload")
async def upload_knowledge(
    slides: UploadFile | None = File(None),
    transcript: UploadFile | None = File(None),
    session_id: str = Form(...),
):
    """Persist whatever the user actually uploaded before quiz generation.

    Accepts a PDF slide, a transcript, or both:
    - Both -> full pipeline (classify + align the given transcript against the slides).
    - PDF only -> slides drive the outline; alignment falls back to the bundled
      demo transcript (transcript-01-clean.md) so grounding still works.
    - Transcript only -> the transcript itself becomes the outline source (its
      sections/segments are used directly, no slide alignment needed).
    """
    if slides is None and transcript is None:
        raise HTTPException(status_code=400, detail="Upload at least a PDF slide or a transcript file")
    if slides is not None and (not slides.filename or not slides.filename.lower().endswith(".pdf")):
        raise HTTPException(status_code=415, detail="Slides must be a PDF file")
    if transcript is not None and (
        not transcript.filename or not transcript.filename.lower().endswith((".md", ".txt", ".vtt", ".srt"))
    ):
        raise HTTPException(status_code=415, detail="Transcript must be .md, .txt, .vtt, or .srt")

    session = _require_session(session_id)

    if transcript is not None:
        transcript_bytes = await transcript.read()
        try:
            transcript_text = transcript_bytes.decode("utf-8-sig")
        except UnicodeDecodeError as exc:
            raise HTTPException(status_code=415, detail="Transcript must be UTF-8 text") from exc
    else:
        transcript_text = None

    if slides is not None:
        pdf_bytes = await slides.read()
        sections = parse_slide_outline(pdf_bytes)
        if not sections:
            raise HTTPException(status_code=422, detail="Could not extract text from PDF slides")
        # No transcript of their own -> ground against the bundled demo transcript
        # rather than failing the whole upload.
        effective_transcript_text = transcript_text or (TRANSCRIPT_DIR / "transcript-01-clean.md").read_text(encoding="utf-8")
        _persist_pdf_context(session_id, pdf_bytes, sections, effective_transcript_text)
        source = "uploaded_slides_and_transcript" if transcript is not None else "uploaded_slides_only"
    else:
        # Transcript-only: its own sections/segments ARE the outline, no PDF/alignment needed.
        transcript_sections = parse_transcript(transcript_text)
        if not transcript_sections:
            raise HTTPException(
                status_code=422,
                detail="Could not extract sections from the transcript. Use Markdown with [Txx-NNN] segment markers.",
            )
        session.raw_transcript = [
            TranscriptSegment(segment_id=seg.segment_id, text=seg.text)
            for section in transcript_sections for seg in section.segments
        ]
        session.outline = [OutlineSection(**item) for item in outline_json(transcript_sections)]
        session.slides = []
        session.alignment = [
            AlignmentItem(
                section_id=section.section_id,
                related_segment_ids=[seg.segment_id for seg in section.segments],
                matched=True,
                method="direct_transcript",
            )
            for section in transcript_sections
        ]
        session.source = "uploaded_transcript_only"
        save_session(session)
        source = "uploaded_transcript_only"

    session = _require_session(session_id)
    return {
        "session_id": session_id,
        "outline": session.outline or [],
        "alignment": session.alignment or [],
        "slides": session.slides or [],
        "source": source,
    }


@app.post("/api/quiz/generate")
def post_generate_quiz(session_id: str = Query(...), n_questions: int = 20):
    session = _require_session(session_id)
    if not session.outline:
        raise HTTPException(status_code=422, detail="Session has no uploaded learning context")
    sections = _session_sections(session)
    try:
        questions = generate_quiz(sections, n_questions=n_questions)
    except QuizGenerationError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {"outline": session.outline, "questions": questions}


@app.post("/api/quiz/generate/pdf")
async def post_generate_quiz_from_pdf(session_id: str = Query(...), n_questions: int = 20):
    session = _require_session(session_id)
    if not session.outline:
        raise HTTPException(status_code=422, detail="Session has no uploaded learning context")
    sections = _session_sections(session)
    try:
        questions = generate_quiz(sections, n_questions=n_questions)
    except QuizGenerationError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {
        "outline": session.outline,
        "questions": questions,
        "alignment": session.alignment or [],
        "source": "slide_pdf",
    }


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.on_event("startup")
def initialize_sqlite() -> None:
    initialize_database()
