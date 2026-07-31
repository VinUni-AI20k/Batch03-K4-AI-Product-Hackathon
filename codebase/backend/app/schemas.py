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
# GROUNDING: 1 phần tử văn bản THỰC TẾ trích từ slide gốc (PDF) người dùng upload,
# dùng để agent "khoanh" đúng vị trí trên ảnh slide gốc khi thuyết trình tới đoạn đó.
# ----------------------------------------------------------------------
class SlideElement(BaseModel):
    id: str
    text: str
    bbox: List[float]           # [left, top, right, bottom] theo toạ độ gốc của trang PDF (points)
    label: str = "text"


# ----------------------------------------------------------------------
# INPUT CHUNG (giống hệt 1 phần tử trong outline_data ở file FastAPI gốc)
# ----------------------------------------------------------------------
class OutlineBlockInput(BaseModel):
    index: int
    type: Literal["quiz", "slide", "animation", "mindmap"]
    content: str = Field(..., description="Nội dung thô của block, lấy từ outline JSON")

    # Grounding vào slide gốc (chỉ có ở block type="slide"): ảnh + toạ độ các phần tử của
    # ĐÚNG trang PDF gốc mà người dùng đã upload. html/markdown lúc upload chỉ để hỗ trợ dựng
    # các trường này — nội dung hiển thị cho học viên PHẢI là ảnh slide gốc, không vẽ lại.
    page_no: Optional[int] = None
    page_width: Optional[float] = None
    page_height: Optional[float] = None
    bg_image: Optional[str] = None              # base64 PNG render của đúng trang gốc
    elements: Optional[List[SlideElement]] = None


# ----------------------------------------------------------------------
# OUTPUT: UPLOAD SLIDE (POST /api/upload-slide)
# outline trả về đúng list OutlineBlockInput, để FE dùng thẳng từng phần tử
# làm input cho /api/generate/{quiz,slide,animation,mindmap}
# ----------------------------------------------------------------------
class UploadSlideResponse(BaseModel):
    status: Literal["success", "error"]
    markdown: str = ""
    outline: List[OutlineBlockInput] = []
    html: str = ""
    html_file_path: str = ""
    message: Optional[str] = None


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
    question_format: Literal["multiple_choice"] = "multiple_choice"
    options: List[QuizOption]
    correct_answer: str    # key ("A"/"B"/"C"/"D") — FE tự so khớp trực tiếp, không cần gọi API
    explanation: str


# ----------------------------------------------------------------------
# OUTPUT: SLIDE
# Slide hiển thị cho học viên PHẢI là ảnh slide gốc (bg_image) người dùng đã upload, không phải
# nội dung do AI vẽ lại. AI chỉ sinh kịch bản thuyết trình (narration); mỗi đoạn narration trỏ
# tới đúng phần tử (SlideElement) trên ảnh gốc để FE khoanh/highlight đúng vị trí khi đang nói.
# ----------------------------------------------------------------------
class NarrationSegment(BaseModel):
    text: str
    focus_element_id: Optional[str] = None    # id của SlideElement đang được nói tới (None nếu là lời mở đầu/chuyển ý chung)
    focus_bbox: Optional[List[float]] = None  # bbox gốc (echo lại đúng từ SlideElement, không do LLM tự sinh) để FE khoanh trực tiếp


class SlideOutput(BaseModel):
    index: int
    type: Literal["slide"] = "slide"
    title: str
    summary: str
    narration: List[NarrationSegment] = []

    # Grounding vào slide gốc, copy lại từ OutlineBlockInput để FE không cần tra cứu thêm
    page_no: Optional[int] = None
    page_width: Optional[float] = None
    page_height: Optional[float] = None
    bg_image: Optional[str] = None
    elements: List[SlideElement] = []


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
    # Đoạn HTML tự chứa (Tailwind class + <style> @keyframes riêng) do LLM sinh ra để FE render
    # trực tiếp trong <iframe srcDoc>, giúp minh hoạ trực quan hơn danh sách "steps" thuần text.
    # Có thể null nếu LLM không sinh được / đang dùng fallback -> FE tự vẽ lại từ "steps".
    html: Optional[str] = None


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


# ----------------------------------------------------------------------
# DEBATE MODE: nhiều agent (bạn học ảo, note taker, giáo viên) lần lượt phát
# biểu quanh 1 chủ đề do người dùng đặt ra. FE giữ toàn bộ transcript và gọi
# API này 1 lượt/1 agent (stateless, giống các endpoint generate/* khác) —
# nhờ vậy người dùng có thể chen tin nhắn mới vào transcript bất kỳ lúc nào
# (human-in-the-loop) mà không cần backend lưu session.
# ----------------------------------------------------------------------
class DebateMessage(BaseModel):
    speaker_id: str
    speaker_name: str
    role: Literal["user", "agent"]
    text: str


class DebateTurnRequest(BaseModel):
    topic: str
    history: List[DebateMessage] = []
    next_speaker: Literal[
        "curious_mind", "logic_master", "bright_spark", "note_taker", "ai_teacher"
    ]


class DebateTurnResponse(BaseModel):
    speaker_id: str
    speaker_name: str
    avatar: str
    text: str