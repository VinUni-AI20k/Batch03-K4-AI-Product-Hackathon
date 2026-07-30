import sys
import os
from pathlib import Path
from pydantic import BaseModel
from typing import Optional

# Thêm thư mục gốc vào sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from agents import PageAwareRAGAgent
from config.settings import DEFAULT_PROVIDER, DEFAULT_OPENAI_MODEL, SLIDES_DIR

app = FastAPI(title="VLearn Page-Aware AI Tutor Backend API")

# Enable CORS for local web development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khởi tạo Page-Aware RAG Agent
rag_agent = PageAwareRAGAgent(provider=DEFAULT_PROVIDER, model_name=DEFAULT_OPENAI_MODEL)

class ChatRequest(BaseModel):
    query: str
    page_number: Optional[int] = 1
    slide_file: Optional[str] = None

class SummarizeRequest(BaseModel):
    page_number: int
    slide_file: Optional[str] = None

def resolve_slide_path(slide_file_input: Optional[str]) -> str:
    if not slide_file_input:
        return str(SLIDES_DIR / "d1-slide-hackathon.pdf")
    
    filename = Path(slide_file_input).name
    candidate = SLIDES_DIR / filename
    if candidate.exists():
        return str(candidate.resolve())
        
    cleaned = slide_file_input.replace("../", "").lstrip("/")
    candidate_root = ROOT_DIR / cleaned
    if candidate_root.exists():
        return str(candidate_root.resolve())

    return str(SLIDES_DIR / "d1-slide-hackathon.pdf")

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    slide_path = resolve_slide_path(req.slide_file)
    
    # Kiểm tra xem có phải yêu cầu tóm tắt trang không
    query_lower = req.query.lower()
    if "tóm tắt" in query_lower and ("trang" in query_lower or "slide" in query_lower):
        answer = rag_agent.summarize_page(slide_path=slide_path, page_number=req.page_number)
    else:
        answer = rag_agent.ask_question(slide_path=slide_path, query=req.query, page_number=req.page_number)

    return {"answer": answer, "page_number": req.page_number}

@app.post("/api/summarize-page")
async def summarize_page_endpoint(req: SummarizeRequest):
    slide_path = resolve_slide_path(req.slide_file)
    answer = rag_agent.summarize_page(slide_path=slide_path, page_number=req.page_number)
    return {"answer": answer, "page_number": req.page_number}


# Mount thư mục vlearn làm static files cho Frontend HTML
VLEARN_DIR = ROOT_DIR / "vlearn"
DATA_DIR = ROOT_DIR / "data"

app.mount("/data", StaticFiles(directory=str(DATA_DIR)), name="data")
app.mount("/", StaticFiles(directory=str(VLEARN_DIR), html=True), name="vlearn_frontend")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    print(f"🚀 VLearn Backend đang khởi chạy tại http://localhost:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)

