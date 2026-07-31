"""
slide_agent.py
--------------
LangGraph agent sinh lại nội dung SLIDE (viết mạch lạc hơn, chia bullet) từ 1 block outline.

Luồng: parse_input -> generate_slide -> format_output -> END
(Slide không cần retry validate phức tạp như quiz, nhưng team có thể thêm nếu muốn)
"""

from langgraph.graph import StateGraph, END
from state import BaseAgentState
from schemas import SlideOutput, SlideBullet


def parse_input(state: BaseAgentState) -> BaseAgentState:
    """
    TODO (team điền): làm sạch raw_content trước khi đưa vào prompt.
    """
    state["parsed_context"] = state["raw_content"]
    return state


def generate_slide(state: BaseAgentState) -> BaseAgentState:
    """
    TODO (team điền):
    - Gọi LLM để: đặt tiêu đề, tách nội dung thành các bullet, viết summary ngắn
    - Lưu dict kết quả vào state["draft_output"]

    ---- MOCK OUTPUT ----
    """
    state["draft_output"] = {
        "title": "Thông tin liên hệ - Phạm Minh Hiếu",
        "bullets": [
            {"heading": "Vai trò", "text": "Fullstack Developer"},
            {"heading": "Liên hệ", "text": "SĐT: +84 916561440, Email: minhhieu.dev.j@gmail.com"},
            {"heading": "Địa chỉ", "text": "TP. Hồ Chí Minh, Việt Nam"},
        ],
        "summary": "Slide giới thiệu thông tin cá nhân và liên hệ của Phạm Minh Hiếu.",
    }
    return state


def format_output(state: BaseAgentState) -> BaseAgentState:
    draft = state["draft_output"]
    bullets = [SlideBullet(**b) for b in draft.get("bullets", [])]
    output = SlideOutput(
        index=state["index"],
        title=draft["title"],
        bullets=bullets,
        summary=draft.get("summary", ""),
    )
    state["final_output"] = output
    return state


def build_slide_graph():
    graph = StateGraph(BaseAgentState)
    graph.add_node("parse_input", parse_input)
    graph.add_node("generate_slide", generate_slide)
    graph.add_node("format_output", format_output)

    graph.set_entry_point("parse_input")
    graph.add_edge("parse_input", "generate_slide")
    graph.add_edge("generate_slide", "format_output")
    graph.add_edge("format_output", END)

    return graph.compile()


slide_graph = build_slide_graph()


def run_slide_agent(index: int, content: str) -> SlideOutput:
    initial_state: BaseAgentState = {"index": index, "raw_content": content}
    result_state = slide_graph.invoke(initial_state)
    return result_state["final_output"]