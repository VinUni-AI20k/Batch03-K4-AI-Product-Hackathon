"""
animation_agent.py
-------------------
LangGraph agent sinh mô tả các bước animation/timeline từ 1 block outline.

Luồng: parse_input -> generate_animation -> format_output -> END
"""

from langgraph.graph import StateGraph, END
from state import BaseAgentState
from schemas import AnimationOutput, AnimationStep


def parse_input(state: BaseAgentState) -> BaseAgentState:
    """
    TODO (team điền): tách các mốc/bước từ raw_content (vd tách theo "->" hoặc theo câu).
    """
    state["parsed_context"] = state["raw_content"]
    return state


def generate_animation(state: BaseAgentState) -> BaseAgentState:
    """
    TODO (team điền):
    - Gọi LLM để xác định animation_type phù hợp (timeline / flow / comparison)
    - Tách thành danh sách các step có order, label, description
    - Lưu vào state["draft_output"]

    ---- MOCK OUTPUT ----
    """
    state["draft_output"] = {
        "animation_type": "timeline",
        "title": "Timeline: Quá trình liên hệ ứng viên",
        "steps": [
            {"order": 1, "label": "Xem hồ sơ", "description": "Nhà tuyển dụng xem thông tin CV.", "duration_ms": 1500},
            {"order": 2, "label": "Gọi điện", "description": "Liên hệ qua SĐT +84 916561440.", "duration_ms": 1500},
            {"order": 3, "label": "Gửi email", "description": "Trao đổi chi tiết qua email.", "duration_ms": 1500},
        ],
    }
    return state


def format_output(state: BaseAgentState) -> BaseAgentState:
    draft = state["draft_output"]
    steps = [AnimationStep(**s) for s in draft.get("steps", [])]
    output = AnimationOutput(
        index=state["index"],
        animation_type=draft.get("animation_type", "timeline"),
        title=draft["title"],
        steps=steps,
    )
    state["final_output"] = output
    return state


def build_animation_graph():
    graph = StateGraph(BaseAgentState)
    graph.add_node("parse_input", parse_input)
    graph.add_node("generate_animation", generate_animation)
    graph.add_node("format_output", format_output)

    graph.set_entry_point("parse_input")
    graph.add_edge("parse_input", "generate_animation")
    graph.add_edge("generate_animation", "format_output")
    graph.add_edge("format_output", END)

    return graph.compile()


animation_graph = build_animation_graph()


def run_animation_agent(index: int, content: str) -> AnimationOutput:
    initial_state: BaseAgentState = {"index": index, "raw_content": content}
    result_state = animation_graph.invoke(initial_state)
    return result_state["final_output"]