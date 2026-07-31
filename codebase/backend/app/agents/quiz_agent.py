"""
quiz_agent.py
-------------
LangGraph agent sinh nội dung QUIZ từ 1 block outline.

Luồng xử lý (graph):
    parse_input -> generate_quiz -> validate_quiz -> format_output -> END
                         ^________________|
                     (retry nếu validate fail, tối đa MAX_RETRY lần)

Team chỉ cần điền phần TODO trong từng hàm node, KHÔNG cần đổi cấu trúc graph
trừ khi thực sự cần thêm bước xử lý.
"""

from langgraph.graph import StateGraph, END
from state import BaseAgentState
from schemas import QuizOutput, QuizOption

MAX_RETRY = 2


# ----------------------------------------------------------------------
# NODE 1: parse_input
# ----------------------------------------------------------------------
def parse_input(state: BaseAgentState) -> BaseAgentState:
    """
    TODO (team điền):
    - Làm sạch raw_content (bỏ ký tự thừa, chuẩn hoá xuống dòng...)
    - Có thể tách phần "content chính" ra khỏi phần "Gợi ý: ..." nếu cần
    - Lưu kết quả vào state["parsed_context"]
    """
    state["parsed_context"] = state["raw_content"]  # placeholder: chưa xử lý gì
    state["retry_count"] = 0
    return state


# ----------------------------------------------------------------------
# NODE 2: generate_quiz  (gọi LLM ở đây)
# ----------------------------------------------------------------------
def generate_quiz(state: BaseAgentState) -> BaseAgentState:
    """
    TODO (team điền):
    - Gọi LLM (OpenAI / Anthropic / model nội bộ...) với prompt phù hợp,
      dựa trên state["parsed_context"]
    - Parse kết quả trả về thành dict giống cấu trúc QuizOutput (chưa cần validate)
    - Lưu vào state["draft_output"]

    ---- MOCK OUTPUT (xoá khi đã có logic thật) ----
    """
    state["draft_output"] = {
        "question": "Theo nội dung trên, vai trò công việc của Phạm Minh Hiếu là gì?",
        "question_format": "multiple_choice",
        "options": [
            {"key": "A", "text": "Data Scientist"},
            {"key": "B", "text": "Fullstack Developer"},
            {"key": "C", "text": "UI/UX Designer"},
            {"key": "D", "text": "Project Manager"},
        ],
        "correct_answer": "B",
        "explanation": "Nội dung ghi rõ vai trò là 'Fullstack developer'.",
    }
    return state


# ----------------------------------------------------------------------
# NODE 3: validate_quiz
# ----------------------------------------------------------------------
def validate_quiz(state: BaseAgentState) -> BaseAgentState:
    """
    TODO (team điền):
    - Kiểm tra draft_output có đủ field bắt buộc không
    - Kiểm tra correct_answer có nằm trong options không (nếu multiple_choice)
    - Nếu không đạt: is_valid = False (để graph tự động quay lại generate_quiz)
    """
    draft = state.get("draft_output") or {}
    is_valid = bool(draft.get("question")) and bool(draft.get("correct_answer"))
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
    options = [QuizOption(**o) for o in draft.get("options", [])] if draft.get("options") else None

    output = QuizOutput(
        index=state["index"],
        question=draft["question"],
        question_format=draft["question_format"],
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