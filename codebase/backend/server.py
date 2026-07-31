import sys
import os
import json
import datetime
from pathlib import Path

# Đảm bảo thư mục codebase/backend đứng vị trí đầu tiên trong sys.path,
# loại bỏ root dir / CWD khỏi sys.path để tránh import nhầm folder tools/agents/api ở root repo
BACKEND_DIR = Path(__file__).resolve().parent
ROOT_DIR = BACKEND_DIR.parent.parent

if str(BACKEND_DIR) in sys.path:
    sys.path.remove(str(BACKEND_DIR))
sys.path.insert(0, str(BACKEND_DIR))

for p in ["", ".", str(ROOT_DIR), str(BACKEND_DIR.parent)]:
    if p in sys.path:
        sys.path.remove(p)

from pydantic import BaseModel
from typing import Optional

from fastapi import FastAPI, HTTPException
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

# Khởi tạo Page-Aware RAG Agent (Tự động nhận diện LLM Provider từ .env)
rag_agent = PageAwareRAGAgent()

class LoginRequest(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    query: str
    page_number: Optional[int] = 1
    slide_file: Optional[str] = None
    student_email: Optional[str] = "unknown_student"
    student_name: Optional[str] = "Unknown"

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

@app.post("/api/login")
async def login_endpoint(req: LoginRequest):
    users_file = BACKEND_DIR / "users.json"
    if not users_file.exists():
        raise HTTPException(status_code=500, detail="Không tìm thấy cơ sở dữ liệu người dùng")
    
    with open(users_file, "r", encoding="utf-8") as f:
        users = json.load(f)
    
    for user in users:
        if user["email"].strip().lower() == req.email.strip().lower() and user["password"] == req.password:
            user_data = user.copy()
            user_data.pop("password", None)
            return {"status": "success", "user": user_data}
            
    raise HTTPException(status_code=400, detail="Email hoặc mật khẩu không chính xác")

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    slide_path = resolve_slide_path(req.slide_file)
    
    # Kiểm tra xem có phải yêu cầu tóm tắt trang không
    query_lower = req.query.lower()
    if "tóm tắt" in query_lower and ("trang" in query_lower or "slide" in query_lower):
        answer = rag_agent.summarize_page(slide_path=slide_path, page_number=req.page_number)
    else:
        answer = rag_agent.ask_question(slide_path=slide_path, query=req.query, page_number=req.page_number)

    # Ghi log cuộc trò chuyện
    try:
        log_entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "student_email": req.student_email,
            "student_name": req.student_name,
            "query": req.query,
            "answer": answer,
            "page_number": req.page_number,
            "slide_file": req.slide_file
        }
        logs_file = BACKEND_DIR / "chat_logs.json"
        logs_list = []
        if logs_file.exists():
            with open(logs_file, "r", encoding="utf-8") as f:
                try:
                    logs_list = json.load(f)
                except Exception:
                    logs_list = []
        logs_list.append(log_entry)
        with open(logs_file, "w", encoding="utf-8") as f:
            json.dump(logs_list, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Lỗi khi ghi chat log: {e}")

    return {"answer": answer, "page_number": req.page_number}

@app.post("/api/summarize-page")
async def summarize_page_endpoint(req: SummarizeRequest):
    slide_path = resolve_slide_path(req.slide_file)
    answer = rag_agent.summarize_page(slide_path=slide_path, page_number=req.page_number)
    return {"answer": answer, "page_number": req.page_number}


# Mount thư mục codebase làm static files cho Frontend
VLEARN_DIR = ROOT_DIR / "codebase" if (ROOT_DIR / "codebase").exists() else ROOT_DIR / "vlearn"
DATA_DIR = ROOT_DIR / "data"

if DATA_DIR.exists():
    app.mount("/data", StaticFiles(directory=str(DATA_DIR)), name="data")
if VLEARN_DIR.exists():
    app.mount("/", StaticFiles(directory=str(VLEARN_DIR), html=True), name="vlearn_frontend")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    print(f"[VLearn Backend] Dang khoi chay tai http://localhost:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)

