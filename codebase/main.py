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

try:
    from pymongo import MongoClient
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "ai_hackathon_kb")
    _mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    mongo_db = _mongo_client[MONGO_DB_NAME]
except Exception:
    mongo_db = None

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    question: str
    answer: str
    guardrails_triggered: List[str]
    confidence_score: float
    citations: List[Dict[str, Any]]
    tool_calls: List[Dict[str, Any]] = []

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

class GoogleAuthRequest(BaseModel):
    email: str
    name: str
    picture: Optional[str] = "https://lh3.googleusercontent.com/a/default-user=s96-c"
    google_id: Optional[str] = ""

@app.post("/api/auth/google")
async def google_login(request: GoogleAuthRequest):
    if not request.email or "@" not in request.email:
        raise HTTPException(status_code=400, detail="Email Google không hợp lệ")
    try:
        if mongo_db is not None:
            from datetime import datetime
            now_str = datetime.utcnow().isoformat() + "Z"
            existing = mongo_db["users"].find_one({"email": request.email})
            if existing:
                mongo_db["users"].update_one(
                    {"email": request.email},
                    {"$set": {"last_login": now_str, "name": request.name, "picture": request.picture}}
                )
            else:
                new_user = {
                    "email": request.email,
                    "name": request.name,
                    "picture": request.picture or "https://lh3.googleusercontent.com/a/default-user=s96-c",
                    "google_id": request.google_id or "google_personal_" + request.email.split("@")[0],
                    "role": "student",
                    "status": "active",
                    "auth_provider": "google",
                    "created_at": now_str,
                    "last_login": now_str
                }
                mongo_db["users"].insert_one(new_user)
        return {
            "success": True,
            "user": {
                "email": request.email,
                "name": request.name,
                "picture": request.picture or "https://lh3.googleusercontent.com/a/default-user=s96-c",
                "role": "student"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/users")
async def get_all_users():
    if mongo_db is None:
        return {"users": [], "count": 0}
    users = list(mongo_db["users"].find({}, {"_id": 0}))
    return {"users": users, "count": len(users)}

import uuid

class TicketRequest(BaseModel):
    user_email: str
    question: str
    reason: str = ""

class TicketResponseUpdate(BaseModel):
    response: str
    status: str = "resolved"

class ReportRequest(BaseModel):
    user_email: str
    question: str
    answer: str
    reason: str = ""

@app.post("/api/tickets")
async def create_ticket(request: TicketRequest):
    if mongo_db is None:
        raise HTTPException(status_code=500, detail="DB not connected")
    ticket_id = str(uuid.uuid4())[:8]
    from datetime import datetime
    now_str = datetime.utcnow().isoformat() + "Z"
    new_ticket = {
        "id": ticket_id,
        "user_email": request.user_email,
        "question": request.question,
        "reason": request.reason,
        "status": "pending",
        "response": "",
        "created_at": now_str,
        "updated_at": now_str
    }
    mongo_db["tickets"].insert_one(new_ticket)
    return {"success": True, "ticket_id": ticket_id}

@app.get("/api/tickets")
async def get_all_tickets():
    if mongo_db is None:
        return {"tickets": []}
    tickets = list(mongo_db["tickets"].find({}, {"_id": 0}).sort("created_at", -1))
    return {"tickets": tickets}

@app.get("/api/tickets/user/{email}")
async def get_user_tickets(email: str):
    if mongo_db is None:
        return {"tickets": []}
    tickets = list(mongo_db["tickets"].find({"user_email": email}, {"_id": 0}).sort("created_at", -1))
    return {"tickets": tickets}

@app.put("/api/tickets/{ticket_id}")
async def update_ticket(ticket_id: str, update: TicketResponseUpdate):
    if mongo_db is None:
        raise HTTPException(status_code=500, detail="DB not connected")
    from datetime import datetime
    now_str = datetime.utcnow().isoformat() + "Z"
    result = mongo_db["tickets"].update_one(
        {"id": ticket_id},
        {"$set": {
            "response": update.response,
            "status": update.status,
            "updated_at": now_str
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return {"success": True}

@app.post("/api/reports")
async def create_report(request: ReportRequest):
    if mongo_db is None:
        raise HTTPException(status_code=500, detail="DB not connected")
    from datetime import datetime
    now_str = datetime.utcnow().isoformat() + "Z"
    new_report = {
        "user_email": request.user_email,
        "question": request.question,
        "answer": request.answer,
        "reason": request.reason,
        "created_at": now_str
    }
    mongo_db["reports"].insert_one(new_report)
    return {"success": True}

@app.get("/api/docs/{file_path:path}")
async def serve_docs(file_path: str):
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    full_path = os.path.join(base_dir, file_path)
    if os.path.exists(full_path) and os.path.isfile(full_path):
        return FileResponse(full_path)
    raise HTTPException(status_code=404, detail="File not found")

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
