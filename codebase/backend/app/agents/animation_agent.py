"""
animation_agent.py
-------------------
LangGraph agent sinh mô tả các bước animation/timeline từ 1 block outline.

Luồng: parse_input -> generate_animation -> format_output -> END
"""

import json
import logging
import os

from langgraph.graph import StateGraph, END
from app.state import BaseAgentState
from app.schemas import AnimationOutput, AnimationStep

logger = logging.getLogger("animation-agent")


def parse_input(state: BaseAgentState) -> BaseAgentState:
    state["parsed_context"] = (state.get("raw_content") or "").strip()
    return state


def _build_prompt(content: str) -> str:
    return f"""Bạn là một GIÁO VIÊN AI kiêm THIẾT KẾ UI, đang dựng một đoạn ANIMATION MINH HOẠ
trực quan để giảng cho học viên, dựa trên nội dung sau đây:

{content[:4000]}

Nhiệm vụ:
1. Chọn "animation_type" phù hợp nhất với nội dung, chỉ được chọn 1 trong 3 giá trị:
   - "timeline": các mốc/bước diễn ra theo trình tự thời gian.
   - "flow": quy trình/luồng xử lý nối tiếp nhau (không nhất thiết gắn mốc thời gian).
   - "comparison": so sánh giữa các đối tượng/khái niệm.
2. "title": tiêu đề ngắn gọn cho animation.
3. "steps": danh sách các bước theo đúng thứ tự, mỗi bước gồm:
   - "order": số thứ tự bắt đầu từ 1.
   - "label": nhãn ngắn gọn của bước.
   - "description": mô tả chi tiết bước đó bằng tiếng Việt, bám sát nội dung gốc, không bịa
     thêm số liệu/sự kiện không có trong nội dung.
   - "duration_ms": thời lượng hiển thị gợi ý cho bước này (mili giây), mặc định 1500 nếu
     không có lý do để khác.
4. "html": MỘT ĐOẠN HTML TỰ CHỨA (không phải toàn bộ trang <html>, chỉ phần bên trong <body>)
   để render trực tiếp animation này, dựng theo đúng nội dung "steps" ở trên. Yêu cầu bắt buộc:
   - Dùng class Tailwind CSS cho layout/màu sắc/spacing (Tailwind đã được nạp sẵn ở trang bao
     ngoài, không cần <link>/<script> CDN nào).
   - Animation CHUYỂN ĐỘNG THẬT SỰ (không chỉ tĩnh): dùng 1 thẻ <style> chứa @keyframes +
     class animation, ví dụ mỗi step xuất hiện nối tiếp nhau (fade-in/slide-in) với
     animation-delay tăng dần theo "order", hoặc với "timeline" vẽ 1 đường timeline có chấm
     tròn sáng dần từng mốc; với "flow" vẽ các khối nối bằng mũi tên; với "comparison" vẽ 2+
     cột song song.
   - Toàn bộ text hiển thị PHẢI lấy đúng từ "label"/"description" của "steps", không bịa thêm.
   - Nền trong suốt hoặc trắng, không dùng màu chữ trắng trên nền trắng.
   - Không dùng <script> chứa logic phức tạp/network call — chỉ HTML + Tailwind class + 1
     <style> khối @keyframes thuần CSS.

CHỈ trả về DUY NHẤT một JSON hợp lệ (không markdown formatting ```, không giải thích thêm),
đúng cấu trúc:
{{
  "animation_type": "timeline",
  "title": "...",
  "steps": [
    {{"order": 1, "label": "...", "description": "...", "duration_ms": 1500}}
  ],
  "html": "<div class=\\"...\\">...</div><style>@keyframes ...</style>"
}}
"""


def _call_llm(content: str) -> dict | None:
    api_key = os.getenv("API_KEY", "")
    if not api_key:
        logger.warning("Không có API_KEY -> bỏ qua gọi LLM, dùng fallback cho animation")
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
        logger.error(f"Lỗi khi gọi LLM sinh animation: {e}", exc_info=True)
        return None


def _fallback_draft(content: str) -> dict:
    """Không gọi được LLM: tách nội dung theo dòng/câu để dựng steps đơn giản."""
    lines = [line.strip() for line in content.replace("->", "\n").splitlines() if line.strip()]
    if not lines:
        lines = ["Không có nội dung"]

    steps = [
        {"order": i, "label": line[:40], "description": line, "duration_ms": 1500}
        for i, line in enumerate(lines[:8], start=1)
    ]
    title = lines[0][:80] if lines else "Animation"
    return {"animation_type": "timeline", "title": title, "steps": steps}


def generate_animation(state: BaseAgentState) -> BaseAgentState:
    content = state.get("parsed_context") or ""
    state["draft_output"] = _call_llm(content) or _fallback_draft(content)
    return state


def format_output(state: BaseAgentState) -> BaseAgentState:
    draft = state["draft_output"]
    steps = [AnimationStep(**s) for s in draft.get("steps", [])]
    output = AnimationOutput(
        index=state["index"],
        animation_type=draft.get("animation_type", "timeline"),
        title=draft.get("title", "Animation"),
        steps=steps,
        html=draft.get("html"),
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
