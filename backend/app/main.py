from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import TRANSCRIPT_DIR
from app.pipeline.outline import outline_json, parse_transcript
from app.pipeline.quiz_bank import QuizGenerationError, generate_quiz

app = FastAPI(title="Self Study Buddy — backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _load_sections(transcript_file: str):
    path = TRANSCRIPT_DIR / transcript_file
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Transcript not found: {transcript_file}")
    text = path.read_text(encoding="utf-8")
    sections = parse_transcript(text)
    if not sections:
        raise HTTPException(status_code=422, detail="Không trích xuất được section nào từ transcript")
    return sections


@app.get("/api/outline")
def get_outline(transcript_file: str = "transcript-01-clean.md"):
    sections = _load_sections(transcript_file)
    return {"outline": outline_json(sections)}


@app.post("/api/quiz/generate")
def post_generate_quiz(transcript_file: str = "transcript-01-clean.md", n_questions: int = 20):
    sections = _load_sections(transcript_file)
    try:
        questions = generate_quiz(sections, n_questions=n_questions)
    except QuizGenerationError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {"outline": outline_json(sections), "questions": questions}


@app.get("/api/health")
def health():
    return {"status": "ok"}
