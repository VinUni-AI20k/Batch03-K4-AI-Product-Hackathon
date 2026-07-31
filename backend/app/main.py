from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_diagnosis import router as diagnosis_router
from app.api.routes_reteach import router as reteach_router
from app.api.routes_session import router as session_router
from app.core.config import TRANSCRIPT_DIR
from app.core.database import initialize_database
from app.pipeline.outline import outline_json, parse_transcript
from app.pipeline.quiz_bank import QuizGenerationError, generate_quiz
from app.utils.pdf_extract import parse_slide_outline

app = FastAPI(title="IllumiMATE API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(reteach_router)
app.include_router(diagnosis_router)
app.include_router(session_router)


def _load_sections(transcript_file: str):
    path = TRANSCRIPT_DIR / transcript_file
    if not path.is_file():
        raise HTTPException(status_code=404, detail=f"Transcript not found: {transcript_file}")
    sections = parse_transcript(path.read_text(encoding="utf-8"))
    if not sections:
        raise HTTPException(status_code=422, detail="Could not extract transcript sections")
    return sections


@app.get("/api/outline")
def get_outline(transcript_file: str = "transcript-01-clean.md"):
    return {"outline": outline_json(_load_sections(transcript_file)), "source": "transcript"}


@app.post("/api/outline/pdf")
async def get_outline_from_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=415, detail="Only PDF slide files are supported")
    sections = parse_slide_outline(await file.read())
    if not sections:
        raise HTTPException(status_code=422, detail="Could not extract text from PDF slides")
    return {"outline": outline_json(sections), "source": "slide_pdf"}


@app.post("/api/quiz/generate")
def post_generate_quiz(transcript_file: str = "transcript-01-clean.md", n_questions: int = 20):
    sections = _load_sections(transcript_file)
    try:
        questions = generate_quiz(sections, n_questions=n_questions)
    except QuizGenerationError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {"outline": outline_json(sections), "questions": questions}


@app.post("/api/quiz/generate/pdf")
async def post_generate_quiz_from_pdf(file: UploadFile = File(...), n_questions: int = 20):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=415, detail="Only PDF slide files are supported")
    sections = parse_slide_outline(await file.read())
    if not sections:
        raise HTTPException(status_code=422, detail="Could not extract text from PDF slides")
    try:
        questions = generate_quiz(sections, n_questions=n_questions)
    except QuizGenerationError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {"outline": outline_json(sections), "questions": questions, "source": "slide_pdf"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.on_event("startup")
def initialize_sqlite() -> None:
    initialize_database()
