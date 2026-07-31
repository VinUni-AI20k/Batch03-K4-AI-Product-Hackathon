"""
mindmap_agent.py
-----------------
LangGraph agent sinh cấu trúc MINDMAP (node cha - con) từ 1 block outline.

Luồng: parse_input -> generate_mindmap -> format_output -> END
"""

import json
import logging
import os

from langgraph.graph import StateGraph, END
from app.state import BaseAgentState
from app.schemas import MindmapOutput, MindmapNode

logger = logging.getLogger("mindmap-agent")


def parse_input(state: BaseAgentState) -> BaseAgentState:
    state["parsed_context"] = (state.get("raw_content") or "").strip()
    return state


def _build_prompt(content: str) -> str:
    return f"""Bạn là một GIÁO VIÊN AI kiêm chuyên gia trực quan hoá kiến thức, đang PHÂN RÃ nội dung
sau đây thành một SƠ ĐỒ TƯ DUY (mindmap) phân cấp để học viên dễ ôn tập:

{content[:4000]}

QUY TRÌNH PHÂN RÃ (bắt buộc làm theo đúng thứ tự):
1. Đọc toàn bộ nội dung, xác định CHỦ ĐỀ TRUNG TÂM -> đặt vào "root_label" (ngắn gọn, bám sát
   nội dung, không phải câu chung chung kiểu "Tổng quan").
2. Nhóm nội dung thành các NHÁNH CHÍNH (top-level, "parent_id": null) — mỗi nhánh là 1 mảng ý
   lớn, độc lập tương đối với các nhánh khác (vd: định nghĩa, quy trình, số liệu, vai trò các
   bên...). Ưu tiên 3-6 nhánh chính, tránh dồn hết vào 1 nhánh hoặc tách vụn quá nhiều nhánh chỉ
   có 1 ý.
3. Với mỗi nhánh chính, tiếp tục PHÂN RÃ thành các Ý CON trực tiếp ("parent_id" = id nhánh cha):
   mỗi ý con là 1 chi tiết/số liệu/mốc thời gian/điều kiện cụ thể thuộc nhánh đó.
4. CHỈ khi 1 ý con thực sự có nhiều chi tiết nhỏ hơn bên trong (vd 1 bước có nhiều điều kiện con)
   mới tạo thêm CẤP CHÁU (parent_id trỏ tới ý con đó). Không lạm dụng — tối đa 3 CẤP tính từ
   root (nhánh chính -> ý con -> ý cháu), ưu tiên dừng ở 2 cấp nếu nội dung không đủ chi tiết.
5. Mỗi node có "id" duy nhất phản ánh đúng vị trí trong cây (vd nhánh "n1", ý con "n1-1", ý cháu
   "n1-1-1"), "label" ngắn gọn (dưới ~12 từ) bằng tiếng Việt, lấy đúng ý từ nội dung gốc, KHÔNG
   bịa thêm số liệu/sự kiện không có trong nội dung, KHÔNG copy nguyên câu dài.
6. Đảm bảo cây mindmap phản ánh đúng QUAN HỆ CHA-CON thực sự về mặt logic (ý con phải là một
   phần/chi tiết/hệ quả của ý cha), không gộp bừa các ý không liên quan vào cùng 1 nhánh.

CHỈ trả về DUY NHẤT một JSON hợp lệ (không markdown formatting ```, không giải thích thêm),
đúng cấu trúc:
{{
  "root_label": "...",
  "nodes": [
    {{"id": "n1", "label": "...", "parent_id": null}},
    {{"id": "n1-1", "label": "...", "parent_id": "n1"}},
    {{"id": "n1-1-1", "label": "...", "parent_id": "n1-1"}}
  ]
}}
"""


def _call_llm(content: str) -> dict | None:
    api_key = os.getenv("API_KEY", "")
    if not api_key:
        logger.warning("Không có API_KEY -> bỏ qua gọi LLM, dùng fallback cho mindmap")
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
            messages=[{"role": "user", "content": _build_prompt(content)}],
            temperature=0.4,
        )
        raw_text = completion.choices[0].message.content.strip()

        json_str = raw_text
        if json_str.startswith("```json"):
            json_str = json_str[7:]
        if json_str.startswith("```"):
            json_str = json_str[3:]
        if json_str.endswith("```"):
            json_str = json_str[:-3]

        return json.loads(json_str.strip())
    except Exception as e:
        logger.error(f"Lỗi khi gọi LLM sinh mindmap: {e}", exc_info=True)
        return None


def _fallback_draft(content: str) -> dict:
    """Không gọi được LLM: tách nội dung theo dòng để dựng nhánh đơn giản."""
    lines = [line.strip(" -*\t") for line in content.splitlines() if line.strip()]
    if not lines:
        lines = ["Không có nội dung"]

    root_label = lines[0][:80]
    body_lines = lines[1:] or lines

    nodes = []
    for i, line in enumerate(body_lines[:6], start=1):
        branch_id = f"n{i}"
        nodes.append({"id": branch_id, "label": line[:80], "parent_id": None})

    if not nodes:
        nodes.append({"id": "n1", "label": root_label, "parent_id": None})

    return {"root_label": root_label, "nodes": nodes}


def generate_mindmap(state: BaseAgentState) -> BaseAgentState:
    content = state.get("parsed_context") or ""
    state["draft_output"] = _call_llm(content) or _fallback_draft(content)
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
