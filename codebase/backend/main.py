import os
os.environ["USE_TF"] = "0"
os.environ["USE_TORCH"] = "1"

import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from qdrant_client import QdrantClient
except Exception:  # pragma: no cover - optional dependency
    QdrantClient = None

try:
    from sentence_transformers import SentenceTransformer
except Exception:  # pragma: no cover - optional dependency
    SentenceTransformer = None

from llm_caller import generate_answer


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
SLIDE_DB_PATH = DATA_DIR / "slide_db.json"
QDRANT_PATH = DATA_DIR / "qdrant_db"

app = FastAPI(title="VLearn Tutor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

slide_db = {}
if SLIDE_DB_PATH.exists():
    try:
        slide_db = json.loads(SLIDE_DB_PATH.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"Warning: could not load slide database: {exc}")

try:
    from dotenv import load_dotenv

    load_dotenv(BASE_DIR / ".env")

    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")

    if qdrant_url and qdrant_api_key and QdrantClient:
        print("Connecting to Qdrant Cloud...")
        qdrant = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
    elif QdrantClient:
        print("Connecting to Local Qdrant...")
        qdrant = QdrantClient(path=str(QDRANT_PATH))
    else:
        qdrant = None

    encoder = SentenceTransformer("all-MiniLM-L6-v2") if SentenceTransformer else None
except Exception as exc:
    print(f"Warning: Qdrant initialization failed: {exc}")
    qdrant = None
    encoder = None


class ChatRequest(BaseModel):
    message: str


@app.get("/health")
def health():
    return {"status": "ok", "message": "Backend is running"}


@app.post("/chat")
def chat(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        result = generate_answer(request.message, enable_search=False)
    except Exception as exc:
        result = {"answer": f"Sorry, I could not process your request right now: {exc}"}

    if not isinstance(result, dict):
        result = {"answer": str(result)}

    if not result.get("answer"):
        result["answer"] = result.get("error") or "No response from server."

    result.setdefault("follow_up", [])
    result.setdefault("citations", [])
    result.setdefault("external_links", [])

    return result