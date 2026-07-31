"""LangGraph tool agent for grounded questions over local lesson slides."""

from __future__ import annotations

import json
import os
import re
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from langchain.messages import AIMessage, SystemMessage
from langchain.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, MessagesState, StateGraph
from slide_store import SlideStore
from config import get_openai_model, get_openai_api_key
from prompts import LESSON_AGENT_SYSTEM_PROMPT

CITATION_PATTERN = re.compile(r"\[([^,\[\]]+\.pdf),\s*tr\.\s*(\d+)\]", re.IGNORECASE)


def build_tools(store: SlideStore):
    @tool
    def list_lessons() -> list[dict]:
        """Liệt kê các bài học PDF đang có và lesson_id dùng cho các tool khác."""
        return store.list_lessons()

    @tool
    def search_slide_pages(lesson_id: str, query: str, limit: int = 4) -> list[dict]:
        """Tìm các trang liên quan nhất trong một bài học trước khi trả lời."""
        return store.search(lesson_id, query, limit)

    @tool
    def read_slide_pages(lesson_id: str, page_numbers: list[int]) -> list[dict]:
        """Đọc đầy đủ tối đa 6 trang cụ thể sau khi đã tìm kiếm."""
        return store.read_pages(lesson_id, page_numbers)

    return [list_lessons, search_slide_pages, read_slide_pages]


def build_graph(store: SlideStore, model: Any | None = None):
    """Build the explicit model → tools → model LangGraph loop."""
    from langgraph.prebuilt import ToolNode, tools_condition
    tools = build_tools(store)
    chat_model = model or ChatOpenAI(
        model=get_openai_model(),
        reasoning_effort="low",
        use_responses_api=True,
        timeout=60,
        max_retries=1,
    )
    model_with_tools = chat_model.bind_tools(tools)

    def call_model(state: MessagesState):
        messages = list(state["messages"])
        
        # Scan for images in ToolMessages
        images = []
        for i, msg in enumerate(messages):
            if getattr(msg, "type", "") == "tool":
                try:
                    content = json.loads(msg.content)
                    has_image = False
                    if isinstance(content, list):
                        for item in content:
                            if isinstance(item, dict) and "base64_image" in item:
                                images.append(item["base64_image"])
                                del item["base64_image"]
                                has_image = True
                    if has_image:
                        # Remove base64 from raw text to save tokens
                        messages[i].content = json.dumps(content, ensure_ascii=False)
                except Exception:
                    pass

        # If images found, inject a HumanMessage for Vision
        if images:
            from langchain.messages import HumanMessage
            content_blocks = [{"type": "text", "text": "Đây là hình ảnh của các trang slide bạn vừa truy xuất. Hãy quan sát kỹ để trả lời:"}]
            for b64 in images:
                content_blocks.append({
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{b64}"}
                })
            messages.append(HumanMessage(content=content_blocks))

        response = model_with_tools.invoke(
            [SystemMessage(content=LESSON_AGENT_SYSTEM_PROMPT), *messages]
        )
        return {"messages": [response]}

    builder = StateGraph(MessagesState)
    builder.add_node("model", call_model)
    builder.add_node("tools", ToolNode(tools, handle_tool_errors=True))
    builder.add_edge(START, "model")
    builder.add_conditional_edges("model", tools_condition, {"tools": "tools", "__end__": END})
    builder.add_edge("tools", "model")
    return builder.compile()


def _message_text(message: AIMessage) -> str:
    if isinstance(message.content, str):
        return message.content
    parts = []
    for block in message.content:
        if isinstance(block, str):
            parts.append(block)
        elif isinstance(block, dict) and block.get("type") in {"text", "output_text"}:
            parts.append(str(block.get("text", "")))
    return "\n".join(part for part in parts if part).strip()


def answer_question(
    store: SlideStore,
    lesson_id: str,
    question: str,
    trace_dir: Path,
    graph=None,
) -> dict:
    question = " ".join(question.split())
    if not 3 <= len(question) <= 800:
        raise ValueError("Câu hỏi phải dài từ 3 đến 800 ký tự")
    lesson_ids = {lesson["id"] for lesson in store.list_lessons() if lesson["available"]}
    if lesson_id not in lesson_ids:
        raise ValueError("Bài học không tồn tại hoặc chưa có file PDF")
    if not get_openai_api_key() and graph is None:
        raise RuntimeError("Thiếu OPENAI_API_KEY trong .env")

    started = datetime.now(UTC)
    agent = graph or build_graph(store)
    result = agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": (
                        f"LESSON_ID ĐÃ CHỌN: {lesson_id}\nCÂU HỎI CỦA HỌC VIÊN: {question}"
                    ),
                }
            ]
        },
        config={"recursion_limit": 10},
    )
    messages = result["messages"]
    final_message = next(
        (
            message
            for message in reversed(messages)
            if isinstance(message, AIMessage) and not message.tool_calls
        ),
        None,
    )
    if final_message is None:
        raise RuntimeError("Agent chưa tạo được câu trả lời cuối")
    answer = _message_text(final_message)
    if not answer:
        raise RuntimeError("Agent trả về nội dung rỗng")

    tool_calls = [
        {"name": call["name"], "args": call.get("args", {})}
        for message in messages
        if isinstance(message, AIMessage)
        for call in message.tool_calls
    ]
    if not any(call["name"] == "search_slide_pages" for call in tool_calls):
        raise RuntimeError("Agent chưa truy xuất slide trước khi trả lời")
    citations = [
        {"filename": filename.strip(), "page": int(page)}
        for filename, page in dict.fromkeys(CITATION_PATTERN.findall(answer))
    ]

    trace = {
        "timestamp_utc": started.isoformat(),
        "mode": "lesson_qa_langgraph",
        "model": get_openai_model(),
        "lesson_id": lesson_id,
        "question": question,
        "tool_calls": tool_calls,
        "answer": answer,
        "citations": citations,
    }
    trace_dir.mkdir(parents=True, exist_ok=True)
    trace_id = started.strftime("%Y%m%dT%H%M%S%fZ")
    (trace_dir / f"qa-{trace_id}.json").write_text(
        json.dumps(trace, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return {
        "status": "OK",
        "answer": answer,
        "citations": citations,
        "tools_used": [call["name"] for call in tool_calls],
        "trace_id": f"qa-{trace_id}",
        "ai_generated": True,
    }
