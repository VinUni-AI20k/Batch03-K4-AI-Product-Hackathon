import os
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from core import db
from core.deep_explain import explain_highlight, explain_node, explain_question, generate_quiz
from core.ingest import ingest_document
from core.tree_summary import find_node, get_or_create_tree

RAW_PDF_DIR = os.path.join(os.path.dirname(__file__), "data", "raw_pdfs")
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

app = FastAPI()
db.init_db()

# Demo-only: the frontend (Vite dev server, a different port) needs to call this
# API from the browser, which the browser blocks by default without CORS headers.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
def read_root():
    # Not "/" -- that path must fall through to the StaticFiles mount at the
    # bottom of this file so it serves the built frontend's index.html.
    return {"status": "ok"}


# --- Session (onboarding survey -> background string) ----------------------

BACKGROUND_TEMPLATE = """Vai trò: {role}.
Mục tiêu học: {goal}.
Mức độ hiểu biết theo chủ đề:
- AI Agent: {level_ai_agent}.
- Product AI: {level_product_ai}.
- LLM: {level_llm}.
- Transformer: {level_transformer}.
- AI Production: {level_ai_production}.
- Production Evaluation: {level_production_eval}."""


class SessionRequest(BaseModel):
    role: str
    goal: str
    level_ai_agent: str
    level_product_ai: str
    level_llm: str
    level_transformer: str
    level_ai_production: str
    level_production_eval: str


@app.post("/session")
def create_session(payload: SessionRequest):
    background = BACKGROUND_TEMPLATE.format(**payload.model_dump())
    session_id = db.create_session(background)
    return {"session_id": session_id}


# --- PDF list (for the sidebar) -----------------------------------------------

@app.get("/pdfs")
def list_pdfs():
    filenames = sorted(f for f in os.listdir(RAW_PDF_DIR) if f.lower().endswith(".pdf"))
    return [{"filename": f, "label": os.path.splitext(f)[0]} for f in filenames]


# --- Ingest ------------------------------------------------------------------

class IngestRequest(BaseModel):
    pdf_filename: str


@app.post("/ingest")
def ingest(payload: IngestRequest):
    pdf_path = os.path.join(RAW_PDF_DIR, payload.pdf_filename)
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail=f"PDF not found: {pdf_path}")
    document_id, validated = ingest_document(pdf_path)
    total_pages = db.count_pages(document_id)
    return {"document_id": document_id, "total_pages": total_pages, "validated": validated}


# --- Raw PDF (for the frontend viewer) ---------------------------------------

@app.get("/pdf/{document_id}")
def get_pdf(document_id: str):
    pdf_path = db.get_source_pdf_path(document_id)
    if pdf_path is None or not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found for this document_id")
    return FileResponse(pdf_path, media_type="application/pdf")


# --- Summary tree --------------------------------------------------------------

@app.get("/summary/{document_id}")
def get_summary(document_id: str, refresh: bool = False):
    tree = get_or_create_tree(document_id, force_refresh=refresh)
    return {"tree": tree}


# --- Explain (node or highlight) --------------------------------------------

class ExplainRequest(BaseModel):
    document_id: str
    session_id: str
    mode: str
    node_id: Optional[str] = None
    page_number: Optional[int] = None
    selected_text: Optional[str] = None
    user_question: Optional[str] = None
    chat_history: Optional[list[dict]] = None


@app.post("/explain")
def explain(payload: ExplainRequest):
    background = db.get_session_background(payload.session_id)
    if background is None:
        raise HTTPException(status_code=404, detail="Unknown session_id")

    if payload.mode == "node":
        if not payload.node_id:
            raise HTTPException(status_code=400, detail="node_id required for mode=node")
        tree = get_or_create_tree(payload.document_id)
        node = find_node(tree, payload.node_id)
        if node is None:
            raise HTTPException(status_code=404, detail="node_id not found in tree")
        explanation, related_pages = explain_node(
            payload.document_id, node, payload.session_id, background, payload.user_question
        )
    elif payload.mode == "highlight":
        if payload.page_number is None or not payload.selected_text:
            raise HTTPException(
                status_code=400, detail="page_number and selected_text required for mode=highlight"
            )
        explanation, related_pages = explain_highlight(
            payload.document_id,
            payload.page_number,
            payload.selected_text,
            payload.session_id,
            background,
            payload.user_question,
        )
    elif payload.mode == "question":
        if payload.page_number is None or not payload.user_question:
            raise HTTPException(
                status_code=400, detail="page_number and user_question required for mode=question"
            )
        explanation, related_pages = explain_question(
            payload.document_id, payload.page_number, background, payload.user_question, payload.chat_history
        )
    else:
        raise HTTPException(status_code=400, detail="mode must be 'node', 'highlight', or 'question'")

    return {"explanation": explanation, "related_pages": related_pages}


# --- Quiz (whole-document multiple choice) ------------------------------------

class QuizRequest(BaseModel):
    document_id: str
    session_id: str
    user_request: str = ""
    num_questions: int = 5


@app.post("/quiz")
def create_quiz_endpoint(payload: QuizRequest):
    background = db.get_session_background(payload.session_id)
    if background is None:
        raise HTTPException(status_code=404, detail="Unknown session_id")
    quiz_id, questions = generate_quiz(
        payload.document_id, payload.session_id, payload.user_request, background, payload.num_questions
    )
    return {"quiz_id": quiz_id, "questions": questions}


# --- Frontend (production build only) -----------------------------------------
#
# Local dev serves the frontend separately via `npm run dev` (Vite on :5173),
# so FRONTEND_DIST won't exist yet -- mounting StaticFiles on a missing
# directory raises at startup, hence the guard. In production, `npm run
# build` runs first (see DEPLOY.md) and this becomes the only way the
# frontend is served, single-origin with the API above -- must be declared
# last so it only catches paths none of the API routes matched.
if os.path.isdir(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
