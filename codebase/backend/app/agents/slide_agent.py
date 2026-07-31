"""
slide_agent.py
--------------
LangGraph agent xử lý block type="slide".

QUAN TRỌNG: slide hiển thị cho học viên PHẢI là ẢNH SLIDE GỐC mà người dùng đã upload
(OutlineBlockInput.bg_image + page_no/page_width/page_height), KHÔNG được vẽ lại nội dung.
markdown/html trích ra lúc upload (OutlineBlockInput.elements — text + bbox của từng phần tử
trên đúng trang gốc) chỉ đóng vai trò hỗ trợ: agent dùng nó để biết đoạn narration nào tương
ứng với phần tử nào trên ảnh gốc, để trả về toạ độ (focus_bbox) cho FE khoanh đúng vị trí khi
đang thuyết trình tới đoạn đó.

Agent KHÔNG tự sinh ra nội dung/bullet mới để hiển thị — chỉ sinh kịch bản lời thuyết trình
(narration) bám theo nội dung gốc.

Luồng: parse_input -> generate_slide -> format_output -> END
"""

import json
import logging
import os
import re
import time
from typing import Generator

from langgraph.graph import StateGraph, END
from app.state import BaseAgentState
from app.schemas import OutlineBlockInput, SlideOutput, SlideElement, NarrationSegment

logger = logging.getLogger("slide-agent")


def parse_input(state: BaseAgentState) -> BaseAgentState:
    state["parsed_context"] = (state.get("raw_content") or "").strip()
    return state


def _build_prompt(content: str, elements: list[dict]) -> str:
    if elements:
        elements_desc = "\n".join(
            f'- id="{e["id"]}": "{e["text"][:200]}"' for e in elements
        )
        grounding = f"""
Đây là danh sách CÁC PHẦN TỬ VĂN BẢN THỰC TẾ trích từ đúng trang slide gốc mà người dùng đã
upload, mỗi phần tử có 1 "id" cố định:
{elements_desc}

Khi viết narration: đoạn nào đang nói về nội dung của phần tử nào thì PHẢI gắn
"focus_element_id" đúng bằng id của phần tử đó — để hệ thống khoanh đúng vị trí đó trên ảnh
slide gốc trong lúc thuyết trình tới đoạn này. CHỈ được dùng id có trong danh sách trên, tuyệt
đối không tự bịa id mới. Nếu đoạn là lời mở đầu/chuyển ý chung không ứng với riêng phần tử nào,
để "focus_element_id": null.
"""
    else:
        grounding = """
Không có dữ liệu vị trí của slide gốc, nên để "focus_element_id": null cho mọi đoạn.
"""

    return f"""Bạn là một GIẢNG VIÊN AI đang thuyết trình trực tiếp slide này cho học viên. Đây
KHÔNG PHẢI là đọc lại nguyên văn slide — bạn phải GIẢNG GIẢI: diễn đạt lại bằng lời nói tự
nhiên, giải thích Ý NGHĨA/TẠI SAO, liên hệ ví dụ thực tế, nhấn mạnh điểm quan trọng, kết nối
các ý với nhau — miễn là không bịa thêm sự kiện/số liệu nào không có trong slide gốc.

Nội dung trích từ slide gốc (đây là NGUỒN THAM KHẢO để giảng giải, KHÔNG phải kịch bản để đọc
nguyên văn):
{content[:4000]}
{grounding}
ĐỘ DÀI BẮT BUỘC: toàn bộ "narration" của slide này phải đủ dài để đọc trong khoảng 15 GIÂY —
tương đương khoảng 60-90 TỪ tiếng Việt, viết thành nhiều câu ngắn nối tiếp nhau. TUYỆT ĐỐI
KHÔNG được chỉ liệt kê/copy lại nguyên văn các dòng trong slide — phải diễn giải như đang
giảng bài thật sự cho học viên hiểu sâu hơn, không chỉ đọc chữ trên slide.

Nhiệm vụ:
1. "title": tiêu đề ngắn gọn của slide (chỉ để tham khảo, không hiển thị đè lên ảnh gốc).
2. "summary": tóm tắt nội dung slide trong 1-2 câu.
3. "narration": kịch bản LỜI THUYẾT TRÌNH tự nhiên bằng tiếng Việt (xem ĐỘ DÀI BẮT BUỘC ở
   trên), chia thành nhiều câu/đoạn ngắn nối tiếp nhau giảng giải hết nội dung slide. Mỗi đoạn
   gồm "text" (câu/đoạn sẽ đọc) và "focus_element_id" (xem hướng dẫn ở trên).

CHỈ trả về DUY NHẤT một JSON hợp lệ (không markdown formatting ```, không giải thích thêm),
đúng cấu trúc:
{{
  "title": "...",
  "summary": "...",
  "narration": [
    {{"text": "...", "focus_element_id": "e1"}}
  ]
}}
"""


def _call_llm(content: str, elements: list[dict]) -> dict | None:
    api_key = os.getenv("API_KEY", "")
    if not api_key:
        logger.warning("Không có API_KEY -> bỏ qua gọi LLM, dùng fallback theo elements/dòng")
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
            messages=[{"role": "user", "content": _build_prompt(content, elements)}],
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
        logger.error(f"Lỗi khi gọi LLM sinh narration cho slide: {e}", exc_info=True)
        return None


def _fallback_draft(content: str, elements: list[dict]) -> dict:
    """Không gọi được LLM: dựng narration trực tiếp từ elements gốc (nếu có), mỗi phần tử 1 đoạn."""
    if elements:
        narration = [
            {"text": e["text"], "focus_element_id": e["id"]}
            for e in elements
            if e.get("text")
        ]
        title = elements[0]["text"].splitlines()[0][:80] if elements else "Slide"
        summary = " ".join(e["text"] for e in elements[:2])[:200]
        return {"title": title, "summary": summary, "narration": narration}

    lines = [line.strip() for line in content.splitlines() if line.strip()]
    title = lines[0] if lines else "Slide"
    narration = [{"text": line, "focus_element_id": None} for line in lines[:8]]
    return {
        "title": title,
        "summary": " ".join(lines[:2])[:200],
        "narration": narration,
    }


def generate_slide(state: BaseAgentState) -> BaseAgentState:
    content = state.get("parsed_context") or ""
    block: OutlineBlockInput = state["input_block"]
    elements = [e.model_dump() for e in (block.elements or [])]

    draft = _call_llm(content, elements) or _fallback_draft(content, elements)
    state["draft_output"] = draft
    return state


def format_output(state: BaseAgentState) -> BaseAgentState:
    draft = state["draft_output"]
    block: OutlineBlockInput = state["input_block"]

    elements = block.elements or []
    elements_by_id = {e.id: e for e in elements}

    narration = []
    for seg in draft.get("narration", []):
        focus_id = seg.get("focus_element_id")
        focus_bbox = None
        if focus_id in elements_by_id:
            focus_bbox = elements_by_id[focus_id].bbox
        else:
            focus_id = None
        narration.append(
            NarrationSegment(text=seg.get("text", ""), focus_element_id=focus_id, focus_bbox=focus_bbox)
        )

    output = SlideOutput(
        index=state["index"],
        title=draft.get("title", "Slide"),
        summary=draft.get("summary", ""),
        narration=narration,
        page_no=block.page_no,
        page_width=block.page_width,
        page_height=block.page_height,
        bg_image=block.bg_image,
        elements=elements,
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


def run_slide_agent(block: OutlineBlockInput) -> SlideOutput:
    initial_state: BaseAgentState = {
        "index": block.index,
        "raw_content": block.content,
        "input_block": block,
    }
    result_state = slide_graph.invoke(initial_state)
    return result_state["final_output"]


# ----------------------------------------------------------------------
# STREAMING NARRATION
# ----------------------------------------------------------------------
# Thay vì trả về nguyên khối narration đã cấu trúc sẵn (run_slide_agent ở trên), luồng này
# sinh lời thuyết trình DẠNG STREAM (giống ChatGPT gõ chữ dần) để FE hiển thị real-time.
#
# Để FE biết CHÍNH XÁC thời điểm nào trong lúc đang gõ chữ cần khoanh vùng nào trên ảnh slide
# gốc, LLM được yêu cầu chèn marker "[[focus:ID]]" ngay trước đoạn text nói về phần tử ID đó
# (ID lấy từ danh sách elements gốc). Server bóc tách marker khỏi text khi stream, phát ra 2
# loại event JSON (mỗi dòng 1 event - NDJSON):
#   {"type": "focus", "focus_element_id": "...", "focus_bbox": [...]}  -> đổi vùng khoanh
#   {"type": "text", "text": "..."}                                    -> chữ để gõ dần
#   {"type": "done"}                                                   -> kết thúc
FOCUS_MARKER_RE = re.compile(r"\[\[focus:([\w\-]+|none)\]\]")
_TAIL_HOLD = 24  # giữ lại vài ký tự cuối buffer, phòng marker bị cắt giữa 2 chunk stream


def _build_stream_prompt(content: str, elements: list[dict]) -> str:
    if elements:
        elements_desc = "\n".join(
            f'- id="{e["id"]}": "{e["text"][:200]}"' for e in elements
        )
        grounding = f"""
Đây là danh sách CÁC PHẦN TỬ VĂN BẢN THỰC TẾ trích từ đúng trang slide gốc mà người dùng đã
upload, mỗi phần tử có 1 "id" cố định:
{elements_desc}

Trước MỖI câu/đoạn trong lời thuyết trình, PHẢI chèn 1 marker "[[focus:ID]]" ngay trước phần
nội dung nói về phần tử đó — CHỈ dùng id có trong danh sách trên, tuyệt đối không tự bịa id
mới. Nếu là lời mở đầu/chuyển ý chung không ứng với riêng phần tử nào, dùng "[[focus:none]]".
Luôn bắt đầu bằng 1 marker.
"""
    else:
        grounding = """
Không có dữ liệu vị trí của slide gốc. Trước MỖI câu, chèn marker "[[focus:none]]".
"""

    return f"""Bạn là một GIẢNG VIÊN AI đang thuyết trình trực tiếp slide này cho học viên. Đây
KHÔNG PHẢI là đọc lại nguyên văn slide — bạn phải GIẢNG GIẢI: diễn đạt lại bằng lời nói tự
nhiên, giải thích Ý NGHĨA/TẠI SAO, liên hệ ví dụ thực tế, nhấn mạnh điểm quan trọng, kết nối
các ý với nhau — miễn là không bịa thêm sự kiện/số liệu nào không có trong slide gốc.

Nội dung trích từ slide gốc (đây là NGUỒN THAM KHẢO để giảng giải, KHÔNG phải kịch bản để đọc
nguyên văn):
{content[:4000]}
{grounding}
ĐỘ DÀI BẮT BUỘC: toàn bộ lời thuyết trình phải đủ dài để đọc trong khoảng 15 GIÂY — tương
đương khoảng 60-90 TỪ tiếng Việt, gồm nhiều câu ngắn nối tiếp nhau. TUYỆT ĐỐI KHÔNG được chỉ
liệt kê/copy lại nguyên văn các dòng trong slide — phải diễn giải như đang giảng bài thật sự,
giúp học viên hiểu sâu hơn chứ không chỉ nghe đọc lại chữ trên slide.

Viết liền mạch lời thuyết trình bằng tiếng Việt (KHÔNG dùng markdown, KHÔNG tiêu đề, KHÔNG
liệt kê dạng JSON — chỉ là văn nói tự nhiên xen kẽ marker như hướng dẫn trên).

Ví dụ định dạng (chỉ để tham khảo cách chèn marker và mức độ giảng giải, không phải nội dung
thật):
[[focus:none]] Bây giờ chúng ta sẽ tìm hiểu một điểm rất quan trọng của slide này. [[focus:e3-2]]
Tài liệu chỉ ra rằng... — điều này có nghĩa là trên thực tế, khi áp dụng vào công việc, bạn cần
lưu ý rằng... [[focus:e3-3]] Ngoài ra, điểm đáng chú ý ở đây là...

CHỈ trả về đúng lời thuyết trình xen kẽ marker như trên, không thêm giải thích gì khác.
"""


def _drain_buffer(
    buffer: str, processed_upto: int, elements_by_id: dict, final: bool
) -> tuple[int, list[dict]]:
    """Bóc các marker "[[focus:ID]]" đã hoàn chỉnh trong buffer[processed_upto:], phát ra event
    text/focus tương ứng. Trả về (vị trí đã xử lý xong, danh sách event)."""
    events: list[dict] = []
    cursor = processed_upto
    while True:
        m = FOCUS_MARKER_RE.search(buffer, cursor)
        if not m:
            break
        if m.start() > cursor:
            events.append({"type": "text", "text": buffer[cursor:m.start()]})
        focus_id = m.group(1)
        if focus_id == "none":
            events.append({"type": "focus", "focus_element_id": None, "focus_bbox": None})
        else:
            el = elements_by_id.get(focus_id)
            events.append({
                "type": "focus",
                "focus_element_id": focus_id if el else None,
                "focus_bbox": el["bbox"] if el else None,
            })
        cursor = m.end()

    if final:
        if len(buffer) > cursor:
            events.append({"type": "text", "text": buffer[cursor:]})
        cursor = len(buffer)
    else:
        # Giữ lại _TAIL_HOLD ký tự cuối vì có thể là phần đầu 1 marker chưa nhận đủ ("[[foc...")
        safe_len = max(cursor, len(buffer) - _TAIL_HOLD)
        if safe_len > cursor:
            events.append({"type": "text", "text": buffer[cursor:safe_len]})
            cursor = safe_len

    return cursor, events


def _fallback_stream(content: str, elements: list[dict]) -> Generator[dict, None, None]:
    """Không có API_KEY hoặc lỗi gọi LLM: giả lập streaming từ elements gốc / dòng nội dung,
    phát dần từng từ để FE vẫn có trải nghiệm gõ chữ + khoanh vùng nhất quán với production."""
    if elements:
        parts = [(e["id"], e.get("text", "")) for e in elements if e.get("text")]
    else:
        lines = [line.strip() for line in content.splitlines() if line.strip()]
        parts = [(None, line) for line in lines[:8]]

    elements_by_id = {e["id"]: e for e in elements}
    for focus_id, text in parts:
        el = elements_by_id.get(focus_id) if focus_id else None
        yield {
            "type": "focus",
            "focus_element_id": focus_id if el else None,
            "focus_bbox": el["bbox"] if el else None,
        }
        time.sleep(0.15)
        words = text.split(" ")
        for i, w in enumerate(words):
            piece = w + (" " if i < len(words) - 1 else "")
            yield {"type": "text", "text": piece}
            time.sleep(0.04)
    yield {"type": "done"}


def stream_slide_narration(block: OutlineBlockInput) -> Generator[dict, None, None]:
    """Sinh lời thuyết trình dạng stream cho 1 block type="slide", xen kẽ event focus/text."""
    content = (block.content or "").strip()
    elements = [e.model_dump() for e in (block.elements or [])]
    elements_by_id = {e["id"]: e for e in elements}

    api_key = os.getenv("API_KEY", "")
    if not api_key:
        logger.warning("Không có API_KEY -> dùng fallback stream")
        yield from _fallback_stream(content, elements)
        return

    try:
        from openai import OpenAI

        client_kwargs = {"api_key": api_key}
        base_url = os.getenv("BASE_URL", "")
        if base_url:
            client_kwargs["base_url"] = base_url
        client = OpenAI(**client_kwargs)

        completion_stream = client.chat.completions.create(
            model=os.getenv("MODEL_NAME", "") or "gpt-4o-mini",
            messages=[{"role": "user", "content": _build_stream_prompt(content, elements)}],
            temperature=0.4,
            stream=True,
        )

        buffer = ""
        processed_upto = 0
        got_any_chunk = False
        for chunk in completion_stream:
            delta = chunk.choices[0].delta.content or ""
            if not delta:
                continue
            got_any_chunk = True
            buffer += delta
            processed_upto, events = _drain_buffer(buffer, processed_upto, elements_by_id, final=False)
            for ev in events:
                yield ev

        if not got_any_chunk:
            raise RuntimeError("LLM stream không trả về nội dung nào")

        _, events = _drain_buffer(buffer, processed_upto, elements_by_id, final=True)
        for ev in events:
            yield ev
        yield {"type": "done"}
    except Exception as e:
        logger.error(f"Lỗi khi stream narration cho slide: {e}", exc_info=True)
        yield from _fallback_stream(content, elements)
