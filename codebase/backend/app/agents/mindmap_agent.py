"""
mindmap_agent.py
-----------------
LangGraph agent sinh cấu trúc MINDMAP (node cha - con) từ 1 block outline.

Luồng: parse_input -> generate_mindmap -> format_output -> END
"""

from langgraph.graph import StateGraph, END
from state import BaseAgentState
from schemas import MindmapOutput, MindmapNode


def parse_input(state: BaseAgentState) -> BaseAgentState:
    """
    TODO (team điền): tiền xử lý raw_content nếu cần (vd tách theo dấu ";", "-").
    """
    state["parsed_context"] = state["raw_content"]
    return state


def generate_mindmap(state: BaseAgentState) -> BaseAgentState:
    """
    TODO (team điền):
    - Gọi LLM để xác định root_label và các node con (có thể nhiều cấp qua parent_id)
    - Lưu vào state["draft_output"]

    ---- MOCK OUTPUT ----
    """
    state["draft_output"] = {
        "root_label": "Hồ sơ Phạm Minh Hiếu",
        "nodes": [
            {"id": "n1", "label": "Vai trò: Fullstack Developer", "parent_id": None},
            {"id": "n2", "label": "Liên hệ", "parent_id": None},
            {"id": "n2-1", "label": "SĐT: +84 916561440", "parent_id": "n2"},
            {"id": "n2-2", "label": "Email: minhhieu.dev.j@gmail.com", "parent_id": "n2"},
            {"id": "n3", "label": "Địa chỉ: TP. Hồ Chí Minh", "parent_id": None},
        ],
    }
    return state


def format_output(state: BaseAgentState) -> BaseAgentState:
    draft = state["draft_output"]
    nodes = [MindmapNode(**n) for n in draft.get("nodes", [])]
    output = MindmapOutput(
        index=state["index"],
        root_label=draft["root_label"],
        nodes=nodes,
    )
    state["final_output"] = output
    return state


def build_mindmap_graph():
    graph = StateGraph(BaseAgentState)
    graph.add_node("parse_input", parse_input)
    graph.add_node("generate_mindmap", generate_mindmap)
    graph.add_node("format_output", format_output)

    graph.set_entry_point("parse_input")
    graph.add_edge("parse_input", "generate_mindmap")
    graph.add_edge("generate_mindmap", "format_output")
    graph.add_edge("format_output", END)

    return graph.compile()


mindmap_graph = build_mindmap_graph()


def run_mindmap_agent(index: int, content: str) -> MindmapOutput:
    initial_state: BaseAgentState = {"index": index, "raw_content": content}
    result_state = mindmap_graph.invoke(initial_state)
    return result_state["final_output"]