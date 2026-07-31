"""
schemas.py
----------
Định nghĩa các model Pydantic dùng chung cho toàn bộ hệ thống agent.

Input chung (từ FE gửi lên, đúng format outline hiện tại):
    {
        "index": 4,
        "type": "quiz" | "slide" | "animation" | "mindmap",
        "content": "..."
    }

Mỗi type sẽ có 1 API riêng, nhưng đều nhận chung 1 input schema (OutlineBlockInput)
và trả về 1 output schema RIÊNG cho từng type (vì cấu trúc nội dung sinh ra khác nhau).
"""

from typing import List, Optional, Literal
from pydantic import BaseModel, Field


# ----------------------------------------------------------------------
# INPUT CHUNG (giống hệt 1 phần tử trong outline_data ở file FastAPI gốc)
# ----------------------------------------------------------------------
class OutlineBlockInput(BaseModel):
    index: int
    type: Literal["quiz", "slide", "animation", "mindmap"]
    content: str = Field(..., description="Nội dung thô của block, lấy từ outline JSON")


# ----------------------------------------------------------------------
# OUTPUT: QUIZ
# ----------------------------------------------------------------------
class QuizOption(BaseModel):
    key: str          # "A", "B", "C", "D"
    text: str


class QuizOutput(BaseModel):
    index: int
    type: Literal["quiz"] = "quiz"
    question: str
    question_format: Literal["multiple_choice", "true_false", "short_answer"]
    options: Optional[List[QuizOption]] = None   # None nếu là short_answer
    correct_answer: str                          # key ("A"/"B"...) hoặc text nếu short_answer
    explanation: str


# ----------------------------------------------------------------------
# OUTPUT: SLIDE
# ----------------------------------------------------------------------
class SlideBullet(BaseModel):
    heading: Optional[str] = None
    text: str


class SlideOutput(BaseModel):
    index: int
    type: Literal["slide"] = "slide"
    title: str
    bullets: List[SlideBullet]
    summary: str


# ----------------------------------------------------------------------
# OUTPUT: ANIMATION (mô tả các bước để FE dựng animation/timeline)
# ----------------------------------------------------------------------
class AnimationStep(BaseModel):
    order: int
    label: str
    description: str
    duration_ms: Optional[int] = 1500   # gợi ý thời lượng hiển thị mỗi bước


class AnimationOutput(BaseModel):
    index: int
    type: Literal["animation"] = "animation"
    animation_type: Literal["timeline", "flow", "comparison"] = "timeline"
    title: str
    steps: List[AnimationStep]


# ----------------------------------------------------------------------
# OUTPUT: MINDMAP
# ----------------------------------------------------------------------
class MindmapNode(BaseModel):
    id: str
    label: str
    parent_id: Optional[str] = None   # None = node gốc


class MindmapOutput(BaseModel):
    index: int
    type: Literal["mindmap"] = "mindmap"
    root_label: str
    nodes: List[MindmapNode]