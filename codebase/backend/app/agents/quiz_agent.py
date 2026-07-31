"""
quiz_agent.py
-------------
LangGraph agent sinh nội dung QUIZ TRẮC NGHIỆM (multiple_choice) từ 1 block outline.
Đáp án đúng được sinh kèm ngay trong câu hỏi, nên việc chấm điểm được FE tự so khớp trực
tiếp với "correct_answer" — không cần gọi thêm API/LLM nào sau khi người dùng trả lời.

Luồng xử lý (graph):
    parse_input -> generate_quiz -> validate_quiz -> format_output -> END
                         ^________________|
                     (retry nếu validate fail, tối đa MAX_RETRY lần)
"""

import json
import logging
import os

from langgraph.graph import StateGraph, END
from app.state import BaseAgentState
from app.schemas import QuizOutput, QuizOption

logger = logging.getLogger("quiz-agent")

MAX_RETRY = 2


# ----------------------------------------------------------------------
# NODE 1: parse_input
# ----------------------------------------------------------------------
def parse_input(state: BaseAgentState) -> BaseAgentState:
    state["parsed_context"] = (state.get("raw_content") or "").strip()
    state["retry_count"] = 0
    return state


# ----------------------------------------------------------------------
# NODE 2: generate_quiz  (gọi LLM ở đây)
# ----------------------------------------------------------------------
def _build_quiz_prompt(content: str) -> str:
    return f"""Bạn là một GIÁO VIÊN AI đang soạn MỘT CÂU HỎI TRẮC NGHIỆM ôn tập dựa trên nội dung
sau đây:

{content[:4000]}

Nhiệm vụ:
1. "question": câu hỏi bằng tiếng Việt, bám sát 1 chi tiết cụ thể trong nội dung (số liệu, định
   nghĩa, mốc thời gian, điều kiện...), không bịa thêm số liệu/sự kiện không có trong nội dung.
2. "options": đúng 4 đáp án, mỗi đáp án là object {{"key": "A", "text": "..."}} với key lần lượt
   A/B/C/D, chỉ có DUY NHẤT 1 đáp án đúng, 3 đáp án còn lại là phương án gây nhiễu hợp lý (không
   quá dễ loại trừ).
3. "correct_answer": đúng bằng 1 trong các "key" của options (vd "B").
4. "explanation": giải thích ngắn gọn tại sao đáp án đó đúng, bám sát nội dung gốc.

CHỈ trả về DUY NHẤT một JSON hợp lệ (không markdown formatting ```, không giải thích thêm),
đúng cấu trúc:
{{
  "question": "...",
  "question_format": "multiple_choice",
  "options": [
    {{"key": "A", "text": "..."}},
    {{"key": "B", "text": "..."}},
    {{"key": "C", "text": "..."}},
    {{"key": "D", "text": "..."}}
  ],
  "correct_answer": "B",
  "explanation": "..."
}}
"""


def _call_llm(content: str) -> dict | None:
    api_key = os.getenv("API_KEY", "")
    if not api_key:
        logger.warning("Không có API_KEY -> bỏ qua gọi LLM, dùng fallback cho quiz")
        return None

    try:
        from openai import OpenAI

        client_kwargs = {"api_key": api_key}
        base_url = os.getenv("BASE_URL", "")
        if base_url:
            client_kwargs["base_url"] = base_url
        client = OpenAI(**client_kwargs)

        completion = client.chat.completions.create(
            model=os.getenv("MODEL_NAME", "") or "gpt-4o-mini",
            messages=[{"role": "user", "content": _build_quiz_prompt(content)}],
            temperature=0.4,
        )
        raw_text = (completion.choices[0].message.content or "").strip()

        json_str = raw_text
        if json_str.startswith("```json"):
            json_str = json_str[7:]
        if json_str.startswith("```"):
            json_str = json_str[3:]
        if json_str.endswith("```"):
            json_str = json_str[:-3]

        return json.loads(json_str.strip())
    except Exception as e:
        logger.error(f"Lỗi khi gọi LLM sinh quiz: {e}", exc_info=True)
        return None


def _fallback_draft(content: str) -> dict:
    """Không gọi được LLM: dựng 1 câu hỏi trắc nghiệm placeholder từ dòng đầu tiên của nội dung."""
    lines = [line.strip() for line in (content or "").splitlines() if line.strip()]
    first_line = lines[0] if lines else "nội dung trên"

    return {
        "question": f"Nội dung sau đây nói về điều gì: \"{first_line[:100]}\"?",
        "question_format": "multiple_choice",
        "options": [
            {"key": "A", "text": first_line[:60] or "Không xác định"},
            {"key": "B", "text": "Không liên quan đến nội dung đã học"},
            {"key": "C", "text": "Chưa đủ dữ liệu để xác định"},
            {"key": "D", "text": "Một chủ đề khác ngoài tài liệu"},
        ],
        "correct_answer": "A",
        "explanation": "Không thể gọi LLM để sinh câu hỏi chi tiết, dùng câu hỏi mặc định.",
    }


def generate_quiz(state: BaseAgentState) -> BaseAgentState:
    content = state.get("parsed_context") or ""
    state["draft_output"] = _call_llm(content) or _fallback_draft(content)
    return state


# ----------------------------------------------------------------------
# NODE 3: validate_quiz
# ----------------------------------------------------------------------
def validate_quiz(state: BaseAgentState) -> BaseAgentState:
    draft = state.get("draft_output") or {}

    question = draft.get("question")
    correct_answer = draft.get("correct_answer")
    options = draft.get("options") or []
    keys = {o.get("key") for o in options}

    is_valid = bool(question) and bool(options) and correct_answer in keys
    state["is_valid"] = is_valid
    return state


def should_retry(state: BaseAgentState) -> str:
    """Điều kiện rẽ nhánh: retry generate hay đi tiếp sang format_output."""
    if state.get("is_valid"):
        return "format_output"
    if state.get("retry_count", 0) >= MAX_RETRY:
        return "format_output"  # hết lượt retry, vẫn đi tiếp (chấp nhận output tạm)
    state["retry_count"] = state.get("retry_count", 0) + 1
    return "generate_quiz"


# ----------------------------------------------------------------------
# NODE 4: format_output
# ----------------------------------------------------------------------
def format_output(state: BaseAgentState) -> BaseAgentState:
    """Map draft_output -> QuizOutput chuẩn để trả về API."""
    draft = state["draft_output"]
    options = [QuizOption(**o) for o in draft.get("options", [])]

    output = QuizOutput(
        index=state["index"],
        question=draft["question"],
        question_format="multiple_choice",
        options=options,
        correct_answer=draft["correct_answer"],
        explanation=draft.get("explanation", ""),
    )
    state["final_output"] = output
    return state


# ----------------------------------------------------------------------
# BUILD GRAPH
# ----------------------------------------------------------------------
def build_quiz_graph():
    graph = StateGraph(BaseAgentState)

    graph.add_node("parse_input", parse_input)
    graph.add_node("generate_quiz", generate_quiz)
    graph.add_node("validate_quiz", validate_quiz)
    graph.add_node("format_output", format_output)

    graph.set_entry_point("parse_input")
    graph.add_edge("parse_input", "generate_quiz")
    graph.add_edge("generate_quiz", "validate_quiz")
    graph.add_conditional_edges(
        "validate_quiz",
        should_retry,
        {"generate_quiz": "generate_quiz", "format_output": "format_output"},
    )
    graph.add_edge("format_output", END)

    return graph.compile()


quiz_graph = build_quiz_graph()


def run_quiz_agent(index: int, content: str) -> QuizOutput:
    initial_state: BaseAgentState = {"index": index, "raw_content": content}
    result_state = quiz_graph.invoke(initial_state)
    return result_state["final_output"]
