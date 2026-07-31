"""
main.py
-------
Expose 4 API riêng biệt, mỗi API tương ứng 1 type trong outline (quiz / slide / animation / mindmap).

FE gửi lên đúng 1 block outline (OutlineBlockInput), route tương ứng sẽ:
    1. Validate type khớp với endpoint
    2. Chạy LangGraph agent tương ứng
    3. Trả về output đã format theo schema riêng của type đó

Chạy thử:
    pip install fastapi uvicorn langgraph pydantic
    uvicorn main:app --reload --port 8001

Test nhanh (sau khi chạy server):
    curl -X POST http://localhost:8001/api/generate/quiz -H "Content-Type: application/json" -d '{
        "index": 4, "type": "quiz",
        "content": "Câu hỏi ôn tập: ... Phạm Minh Hiếu ... Fullstack developer ..."
    }'
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    OutlineBlockInput,
    QuizOutput,
    SlideOutput,
    AnimationOutput,
    MindmapOutput,
)
from agents.quiz_agent import run_quiz_agent
from agents.slide_agent import run_slide_agent
from agents.animation_agent import run_animation_agent
from agents.mindmap_agent import run_mindmap_agent

app = FastAPI(
    title="Study Content Generation Agents (LangGraph)",
    description="Mỗi API nhận 1 block outline và sinh nội dung học tập tương ứng theo type",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _check_type(block: OutlineBlockInput, expected: str):
    if block.type != expected:
        raise HTTPException(
            status_code=400,
            detail=f"Endpoint này chỉ nhận type='{expected}', nhưng nhận được type='{block.type}'",
        )


@app.post("/api/generate/quiz", response_model=QuizOutput)
def generate_quiz(block: OutlineBlockInput):
    _check_type(block, "quiz")
    return run_quiz_agent(index=block.index, content=block.content)


@app.post("/api/generate/slide", response_model=SlideOutput)
def generate_slide(block: OutlineBlockInput):
    _check_type(block, "slide")
    return run_slide_agent(index=block.index, content=block.content)


@app.post("/api/generate/animation", response_model=AnimationOutput)
def generate_animation(block: OutlineBlockInput):
    _check_type(block, "animation")
    return run_animation_agent(index=block.index, content=block.content)


@app.post("/api/generate/mindmap", response_model=MindmapOutput)
def generate_mindmap(block: OutlineBlockInput):
    _check_type(block, "mindmap")
    return run_mindmap_agent(index=block.index, content=block.content)


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}