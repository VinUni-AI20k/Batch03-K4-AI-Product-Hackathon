"""In-memory 'derived timeline' — the frontend Dashboard has no persistent
backend store of extracted items, so this module builds ephemeral cards from
what a chat turn's real tool calls (Gmail/Discord/Calendar) actually
returned. Resets when the server restarts; single-process only. That's an
accepted limitation for this pass (see plan's Known Gaps), not an oversight.

Cards are shaped exactly like codebase/FE/src/data.js's `initialEvents`
entries so the existing frontend components need no schema changes.
"""

from __future__ import annotations

import json
import re
import uuid
from typing import Any

RELEVANT_TOOLS = {"gmail_search", "gmail_read_thread", "discord_read_messages", "calendar_list_events"}

_VALID_TYPES = {"deadline", "class", "announcement", "review"}
_VALID_PRIORITIES = {"Khẩn cấp", "Sắp tới", "Bình thường", "Cần kiểm tra"}
_SOURCE_ICON = {"Gmail": "mail", "Discord": "forum", "Google Calendar": "calendar_month"}
_SOURCE_ACTION = {"Gmail": "Mở email gốc", "Discord": "Đi tới Discord", "Google Calendar": "Mở lịch gốc"}

_EXTRACTION_INSTRUCTIONS = """\
Bạn là bộ trích xuất dữ liệu cho StudyPulse. Nội dung người dùng gửi bên dưới là \
kết quả THẬT trả về từ các tool đã gọi (email Gmail / tin nhắn Discord / sự kiện Google Calendar). \
Nhiệm vụ: trích ra danh sách các mục đáng chú ý (deadline, lịch học, thông báo, sự kiện) \
CHỈ nếu có bằng chứng rõ ràng trong văn bản. KHÔNG bịa thêm mục nào không có trong văn bản. \
Nếu không có mục nào đáng chú ý, trả về {"items": []}.

Trả về DUY NHẤT một JSON object theo đúng schema sau, không thêm giải thích, không markdown:
{
  "items": [
    {
      "type": "deadline | class | announcement | review",
      "title": "string ngắn gọn",
      "course": "string, để trống nếu không rõ môn học/ngữ cảnh",
      "date": "'DD/MM' hoặc 'Hôm nay'/'Ngày mai'/'Chờ xác nhận' nếu không có ngày cụ thể",
      "time": "'HH:MM' hoặc '—' nếu không rõ giờ",
      "due_date_iso": "'YYYY-MM-DD' NẾU có ngày cụ thể xác định được từ văn bản, ngược lại chuỗi rỗng \"\" — không suy đoán",
      "due_time_iso": "'HH:MM' 24h NẾU có giờ cụ thể, ngược lại chuỗi rỗng \"\"",
      "source": "Gmail | Discord | Google Calendar",
      "priority": "Khẩn cấp | Sắp tới | Bình thường | Cần kiểm tra",
      "confidence": "số nguyên 0-100",
      "detail": "1-2 câu tóm tắt, nêu rõ vì sao (trích dẫn ngắn nếu cần)",
      "verified": "false nếu confidence < 85 hoặc thông tin còn mơ hồ, ngược lại true"
    }
  ]
}
"""


def _source_for_tool(tool_name: str) -> str:
    if tool_name.startswith("gmail_"):
        return "Gmail"
    if tool_name.startswith("discord_"):
        return "Discord"
    if tool_name.startswith("calendar_"):
        return "Google Calendar"
    return "Gmail"


def _build_prompt_text(tool_events: list[dict[str, Any]]) -> str:
    blocks: list[str] = []
    for event in tool_events:
        name = event.get("tool", "")
        if name not in RELEVANT_TOOLS:
            continue
        result = event.get("result")
        if isinstance(result, dict) and result.get("error"):
            continue
        text = json.dumps(result, ensure_ascii=False, default=str)
        if len(text) > 6000:
            text = text[:6000] + "...<truncated>"
        blocks.append(f"### Tool: {name}\n{text}")
    return "\n\n".join(blocks)


def _parse_json_block(raw: str) -> dict[str, Any]:
    cleaned = raw.strip()
    fence_match = re.search(r"```(?:json)?\s*(.*?)```", cleaned, re.DOTALL)
    if fence_match:
        cleaned = fence_match.group(1).strip()
    return json.loads(cleaned)


def _clamp_item(raw_item: dict[str, Any]) -> dict[str, Any] | None:
    title = str(raw_item.get("title") or "").strip()
    if not title:
        return None

    item_type = raw_item.get("type") if raw_item.get("type") in _VALID_TYPES else "announcement"
    source = raw_item.get("source") if raw_item.get("source") in _SOURCE_ICON else "Gmail"
    priority = raw_item.get("priority") if raw_item.get("priority") in _VALID_PRIORITIES else "Bình thường"
    try:
        confidence = max(0, min(100, int(raw_item.get("confidence", 0))))
    except (TypeError, ValueError):
        confidence = 0

    return {
        "id": uuid.uuid4().hex,
        "type": item_type,
        "title": title[:200],
        "course": str(raw_item.get("course") or "").strip(),
        "date": str(raw_item.get("date") or "Chờ xác nhận").strip(),
        "time": str(raw_item.get("time") or "—").strip(),
        "source": source,
        "sourceIcon": _SOURCE_ICON[source],
        "priority": priority,
        "confidence": confidence,
        "detail": str(raw_item.get("detail") or "").strip()[:500],
        "action": _SOURCE_ACTION[source],
        "verified": bool(raw_item.get("verified", confidence >= 85)),
        # Machine-parseable date, kept separate from the display "date" string
        # above ("Hôm nay", "Chờ xác nhận"...) so calendar_create_event has
        # something real to work with. Empty when the source text had no
        # concrete date — never guessed.
        "due_date_iso": str(raw_item.get("due_date_iso") or "").strip(),
        "due_time_iso": str(raw_item.get("due_time_iso") or "").strip(),
    }


def derive_from_tool_events(tool_events: list[dict[str, Any]], provider: Any) -> list[dict[str, Any]]:
    """Best-effort structured extraction over this turn's real tool output.
    Any failure (parse error, provider error, empty input) yields no items —
    this must never break the chat response it's attached to."""
    prompt_text = _build_prompt_text(tool_events)
    if not prompt_text:
        return []

    try:
        response = provider.complete(
            [
                {"role": "system", "content": _EXTRACTION_INSTRUCTIONS},
                {"role": "user", "content": prompt_text},
            ],
            None,
            temperature=0.0,
        )
        parsed = _parse_json_block(response.text or "")
        raw_items = parsed.get("items", [])
        if not isinstance(raw_items, list):
            return []
    except Exception:
        return []

    items = []
    for raw_item in raw_items:
        if not isinstance(raw_item, dict):
            continue
        clamped = _clamp_item(raw_item)
        if clamped:
            items.append(clamped)
    return items


class TimelineStore:
    """Plain in-memory list — single hackathon-demo process, no locking."""

    def __init__(self) -> None:
        self._items: list[dict[str, Any]] = []

    def _dedupe_key(self, item: dict[str, Any]) -> tuple:
        return (item["title"], item["date"], item["time"], item["source"])

    def upsert(self, items: list[dict[str, Any]]) -> None:
        existing_keys = {self._dedupe_key(existing) for existing in self._items}
        for item in items:
            if self._dedupe_key(item) not in existing_keys:
                self._items.append(item)
                existing_keys.add(self._dedupe_key(item))

    def list_items(self) -> list[dict[str, Any]]:
        return list(self._items)

    def get(self, item_id: str) -> dict[str, Any] | None:
        return next((item for item in self._items if item["id"] == item_id), None)

    def update(self, item_id: str, patch: dict[str, Any]) -> dict[str, Any] | None:
        item = self.get(item_id)
        if item is None:
            return None
        item.update(patch)
        return item

    def remove(self, item_id: str) -> bool:
        item = self.get(item_id)
        if item is None:
            return False
        self._items.remove(item)
        return True


timeline_store = TimelineStore()
