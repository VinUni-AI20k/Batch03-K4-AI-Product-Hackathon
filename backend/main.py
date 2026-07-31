import os
import google.generativeai as genai
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from dotenv import load_dotenv

from .database import get_db, Base, engine
from .models import Slide, SlideEmbedding
from .schemas import ChatRequest, ChatResponse

load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_question_embedding(question: str):
    result = genai.embed_content(
        model="models/gemini-embedding-2",
        content=question,
        task_type="retrieval_query"
    )
    return result['embedding']

from .graph import app as graph_app
from langchain_core.messages import HumanMessage

@app.post("/chat", response_model=ChatResponse)
def chat_with_slide(
    request: ChatRequest, 
    user_id: str = Header(None),
    db: Session = Depends(get_db)
):
    if not user_id:
        raise HTTPException(status_code=401, detail="Missing user_id in headers")

    # Cấu hình memory bằng user_id làm thread_id để chat nhớ được hội thoại
    config = {"configurable": {"thread_id": user_id}}
    
    try:
        # Chạy luồng LangGraph đồng bộ
        state = graph_app.invoke(
            {"messages": [HumanMessage(content=request.question)], "lecture_id": request.lecture_id},
            config=config
        )
        
        # Lấy nội dung tin nhắn cuối cùng (có thể từ evaluate hoặc generate)
        final_message = state["messages"][-1].content
        
        return ChatResponse(answer=final_message)
    except Exception as e:
        print(f"Error in graph: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/slides/{lecture_id}/{slide_no}")
def get_slide(lecture_id: str, slide_no: int, db: Session = Depends(get_db)):
    slide = db.query(Slide).filter(
        Slide.lecture_id == lecture_id,
        Slide.slide_no == slide_no
    ).first()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    return {"title": slide.title, "content_text": slide.content_text}

