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

from fastapi.responses import StreamingResponse
import requests
import json
from langchain_core.messages import AIMessage

@app.post("/chat")
def chat_with_slide(
    request: ChatRequest, 
    user_id: str = Header(None),
    db: Session = Depends(get_db)
):
    if not user_id:
        raise HTTPException(status_code=401, detail="Missing user_id in headers")

    # Cấu hình memory bằng user_id + lecture_id làm thread_id để refresh memory khi đổi slide/ngày
    thread_id = f"{user_id}_{request.lecture_id}"
    config = {"configurable": {"thread_id": thread_id}}
    
    try:
        # Chạy luồng LangGraph đồng bộ (chỉ đánh giá và truy xuất ngữ cảnh)
        state = graph_app.invoke(
            {"messages": [HumanMessage(content=request.question)], "lecture_id": request.lecture_id},
            config=config
        )
        
        # Nếu câu hỏi không liên quan, trả về câu từ chối luôn
        if not state.get("is_relevant", True):
            final_message = state["messages"][-1].content
            def generate_rejection():
                yield f"data: {json.dumps({'answer': final_message})}\n\n"
            return StreamingResponse(generate_rejection(), media_type="text/event-stream")
            
        # Nếu liên quan, lấy ngữ cảnh và gọi API FPTCloud dạng stream
        context = state.get("context", "")
        lecture_id = state.get("lecture_id", request.lecture_id)
        
        sys_prompt = f"""Bạn là VLearn Tutor, trợ lý AI giải đáp thắc mắc về bài giảng.
Bạn đang hỗ trợ học viên trong bài học {lecture_id}.

[CÁC ĐOẠN NỘI DUNG LIÊN QUAN TRONG BÀI GIẢNG]:
{context}

Nhiệm vụ của bạn:
1. CHỈ TRẢ LỜI các câu hỏi tập trung vào kiến thức của bài học và lĩnh vực chuyên môn.
2. KHÔNG ĐƯỢC trả lời những vấn đề không liên quan đến đề tài. Nếu học viên hỏi ngoài lề, hãy lịch sự từ chối và hướng họ quay lại với nội dung bài học.
3. Dựa vào các nội dung trên và lịch sử hội thoại, hãy trả lời ngắn gọn, súc tích, dễ hiểu. KHÔNG bịa đặt thông tin nếu không có trong ngữ cảnh.
4. Nếu câu hỏi không rõ ràng về bài giảng, hãy hỏi lại học viên để làm rõ ý và hướng họ về việc hỏi đáp kiến thức bài học."""
        
        formatted_msgs = [{"role": "system", "content": sys_prompt}]
        for msg in state["messages"]:
            role = "user"
            if msg.type == "ai":
                role = "assistant"
            # Bỏ qua system prompt cũ nếu có trong state
            if msg.type != "system":
                formatted_msgs.append({"role": role, "content": msg.content})
                
        def generate():
            url = "https://mkp-api.fptcloud.com/chat/completions"
            token = "sk-H_YuLOl4y2dueOyIMJUFcq4X0FFF8MZg4-5u1QHlswQ="
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            }
            data = {
                "model": "GLM-5.2",
                "messages": formatted_msgs,
                "stream": True,
                "temperature": 0.1
            }
            
            response = requests.post(url, headers=headers, json=data, stream=True)
            if not response.ok:
                yield f"data: {json.dumps({'answer': f'Lỗi gọi API: {response.text}'})}\n\n"
                return
                
            full_answer = ""
            for line in response.iter_lines():
                if line:
                    line_text = line.decode('utf-8')
                    if line_text.startswith('data: '):
                        line_text = line_text[6:]
                    if line_text == "[DONE]":
                        break
                    try:
                        chunk_data = json.loads(line_text)
                        choices = chunk_data.get("choices", [])
                        if choices:
                            delta = choices[0]["delta"]
                            content = delta.get("content", "")
                            reasoning = delta.get("reasoning_content", "")
                            if content or reasoning:
                                if content:
                                    full_answer += content
                                yield f"data: {json.dumps({'answer': content, 'reasoning': reasoning})}\n\n"
                    except json.JSONDecodeError:
                        pass
                        
            # Sau khi stream xong, lưu câu trả lời vào memory để nhớ cho lần sau
            graph_app.update_state(config, {"messages": [AIMessage(content=full_answer)]})
            
        return StreamingResponse(generate(), media_type="text/event-stream")

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
    if lecture_id == "day01":
        real_lecture_id = "d1-ai-llm-foundation"
    elif lecture_id == "day02":
        real_lecture_id = "d2-xac-dinh-bai-toan"
    else:
        real_lecture_id = lecture_id
        
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

