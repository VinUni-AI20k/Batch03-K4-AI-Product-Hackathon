import os
import google.generativeai as genai
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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
        try:
            state = graph_app.invoke(
                {"messages": [HumanMessage(content=request.question)], "lecture_id": request.lecture_id},
                config=config
            )
        except Exception as e:
            if "Server disconnected without sending a response" in str(e):
                print("Retrying due to server disconnect...")
                state = graph_app.invoke(
                    {"messages": [HumanMessage(content=request.question)], "lecture_id": request.lecture_id},
                    config=config
                )
            else:
                raise e
        
        # Lấy nội dung tin nhắn cuối cùng (có thể từ evaluate hoặc generate)
        final_message = state["messages"][-1].content
        
        return ChatResponse(answer=final_message)
    except Exception as e:
        print(f"Error in graph: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Mount static files for PDFs
slides_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "vlearn-pack", "slides")

@app.get("/debug_slides")
def debug_slides():
    return {
        "dir": slides_dir,
        "exists": os.path.exists(slides_dir),
        "files": os.listdir(slides_dir) if os.path.exists(slides_dir) else []
    }

app.mount("/static_slides", StaticFiles(directory=slides_dir), name="static_slides")

@app.get("/slides/{lecture_id}/{slide_no}")
def get_slide(lecture_id: str, slide_no: int, db: Session = Depends(get_db)):
    slide = db.query(Slide).filter(
        Slide.lecture_id == lecture_id,
        Slide.slide_no == slide_no
    ).first()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    return {"title": slide.title, "content_text": slide.content_text}

from pydantic import BaseModel
from typing import List
import random
from .models import Concept, Question

class QuizGenerateRequest(BaseModel):
    lecture_id: str
    concept_ids: List[str]
    difficulty: str
    num_questions: int

@app.get("/concepts/{lecture_id}")
def get_concepts(lecture_id: str, db: Session = Depends(get_db)):
    real_lecture_id = "d1-ai-llm-foundation" if lecture_id == "day01" else lecture_id
    concepts = db.query(Concept).filter(Concept.lecture_id == real_lecture_id).all()
    return [{"id": c.concept_id, "name": c.name, "elo": 1500, "slides": [1]} for c in concepts]

@app.post("/quiz/generate")
def generate_quiz(req: QuizGenerateRequest, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.concept_id.in_(req.concept_ids)).all()
    
    if len(questions) > req.num_questions:
        selected = random.sample(questions, req.num_questions)
    else:
        selected = questions
        
    result = []
    for q in selected:
        c = db.query(Concept).filter(Concept.concept_id == q.concept_id).first()
        result.append({
            "c": {"id": c.concept_id, "name": c.name, "elo": 1500, "slides": [q.source_slide]},
            "item": {
                "q": q.stem,
                "opts": q.options,
                "ans": q.answer_idx,
                "explanation": q.explanation
            }
        })
    return result

