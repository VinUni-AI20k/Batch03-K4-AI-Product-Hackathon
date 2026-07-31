import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from agent import AIQAAgent

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Agent QA - Cộng đồng AI Thực Chiến Vingroup - VinUni",
    description="Hệ thống hỏi đáp thực chiến tích hợp dữ liệu cào từ Facebook Group & VLearn với 4 lớp Guardrail",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI QA Agent
qa_agent = AIQAAgent()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    question: str
    answer: str
    guardrails_triggered: List[str]
    confidence_score: float
    citations: List[Dict[str, Any]]

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Câu hỏi không được để trống")
    try:
        result = qa_agent.ask(request.message)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/kb/stats")
async def get_kb_statistics():
    return qa_agent.get_kb_stats()

@app.get("/api/kb/search")
async def search_kb(q: Optional[str] = ""):
    if not q:
        return {"results": qa_agent.fb_kb}
    results = qa_agent._retrieve_relevant_docs(q, top_k=10)
    return {"results": results}

# Serve React Frontend Build if available, fallback to static UI
frontend_dist_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend", "dist")
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

if os.path.exists(os.path.join(frontend_dist_dir, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_dir, "assets")), name="react-assets")

if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/style.css")
async def get_style():
    style_path = os.path.join(static_dir, "style.css")
    if os.path.exists(style_path):
        return FileResponse(style_path)
    raise HTTPException(status_code=404, detail="style.css not found")

@app.get("/script.js")
async def get_script():
    script_path = os.path.join(static_dir, "script.js")
    if os.path.exists(script_path):
        return FileResponse(script_path)
    raise HTTPException(status_code=404, detail="script.js not found")

@app.get("/{full_path:path}")
async def serve_spa_or_root(full_path: str):
    # Do not intercept API calls
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API route not found")
        
    react_index = os.path.join(frontend_dist_dir, "index.html")
    if os.path.exists(react_index):
        return FileResponse(react_index)
        
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
        
    return {"message": "AI Agent QA Backend is running on port 8000."}

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("APP_HOST", "0.0.0.0")
    port = int(os.getenv("APP_PORT", "8000"))
    print("Khoi dong AI Agent QA - Khoa hoc Cong dong AI Thuc Chien Vingroup - VinUni...")
    print("Truy cap Frontend & Backend tai cung Port 8000: http://localhost:8000")
    uvicorn.run("main:app", host=host, port=port, reload=True)
