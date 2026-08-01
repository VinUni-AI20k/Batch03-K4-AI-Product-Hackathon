"""Đánh giá ngầm (implicit assessment) — mô hình mức nắm vững theo chủ đề.

Mỗi lần học viên trả lời quiz/vấn đáp/giải bài (đúng hay sai) agent gọi log_assessment;
dữ liệu tích luỹ thành mastery score theo topic (EMA — lần gần nhất nặng hơn),
được bơm vào system prompt mỗi lượt để agent: chọn độ khó quiz, gài ôn chủ đề yếu,
và lên lộ trình học phù hợp (skill lo-trinh-on-tap).

Lưu data/mastery/<user_id>.json — tách khỏi vault (dữ liệu máy, không phải ghi chú).
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

_ALPHA = 0.3  # EMA: kết quả mới chiếm 30% — đủ nhạy nhưng không giật cục


def _slug(topic: str) -> str:
    s = re.sub(r"\s+", "-", topic.strip().lower())
    return re.sub(r"[^0-9a-zA-ZÀ-ỹ\-]", "", s)[:60] or "khac"


class Mastery:
    def __init__(self, root: Path):
        self.dir = Path(root) / "data" / "mastery"

    def _path(self, user_id: str) -> Path:
        safe = re.sub(r"[^0-9A-Za-z_\-]", "_", str(user_id))
        return self.dir / f"{safe}.json"

    def _load(self, user_id: str) -> dict:
        p = self._path(user_id)
        if p.exists():
            try:
                return json.loads(p.read_text(encoding="utf-8"))
            except Exception:
                return {}
        return {}

    def log(self, user_id: str, topic: str, correct: bool, note: str = "") -> str:
        data = self._load(user_id)
        key = _slug(topic)
        t = data.get(key) or {"topic": topic.strip(), "attempts": 0, "correct": 0, "level": 0.5}
        t["attempts"] += 1
        t["correct"] += 1 if correct else 0
        t["level"] = round((1 - _ALPHA) * float(t.get("level", 0.5)) + _ALPHA * (1.0 if correct else 0.0), 3)
        t["last"] = datetime.now(timezone.utc).date().isoformat()
        if note.strip():
            t["note"] = note.strip()[:200]
        data[key] = t
        self.dir.mkdir(parents=True, exist_ok=True)
        self._path(user_id).write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        pct = int(t["level"] * 100)
        return (f"Đã ghi nhận: {t['topic']} — {'✅ đúng' if correct else '❌ sai'} "
                f"(nắm vững ~{pct}%, {t['correct']}/{t['attempts']} đúng).")

    def summary(self, user_id: str, max_topics: int = 12) -> str:
        """Chuỗi ngắn bơm vào system prompt: topic yếu trước (để agent ưu tiên ôn)."""
        data = self._load(user_id)
        if not data:
            return "(chưa có dữ liệu — hãy ghi qua log_assessment mỗi khi học viên trả lời đúng/sai)"
        rows = sorted(data.values(), key=lambda t: (t.get("level", 0.5), -t.get("attempts", 0)))
        lines = []
        for t in rows[:max_topics]:
            pct = int(float(t.get("level", 0.5)) * 100)
            flag = "🔴 yếu" if pct < 40 else ("🟡 trung bình" if pct < 70 else "🟢 vững")
            note = f" — lưu ý: {t['note']}" if t.get("note") else ""
            lines.append(f"- {t.get('topic')}: {flag} {pct}% ({t.get('correct',0)}/{t.get('attempts',0)} đúng, lần cuối {t.get('last','?')}){note}")
        return "\n".join(lines)

    def weak_topics(self, user_id: str, threshold: float = 0.5) -> list[str]:
        data = self._load(user_id)
        rows = [t for t in data.values() if float(t.get("level", 0.5)) < threshold]
        rows.sort(key=lambda t: t.get("level", 0.5))
        return [t.get("topic", "") for t in rows]

    def tool_schema(self) -> dict:
        return {
            "type": "function",
            "function": {
                "name": "log_assessment",
                "description": (
                    "ĐÁNH GIÁ NGẦM — gọi NGAY mỗi khi học viên: trả lời quiz/vấn đáp (đúng HAY sai), "
                    "giải bài tập, hoặc bộc lộ hiểu nhầm về một chủ đề. Dữ liệu tích luỹ thành mức nắm vững "
                    "theo chủ đề, dùng để chọn độ khó quiz + lên lộ trình ôn tập. Gọi ngầm, không cần xin phép."),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "topic": {"type": "string", "description": "Chủ đề/khái niệm ngắn gọn, vd 'gradient descent', 'xử lý xung đột nhóm'"},
                        "correct": {"type": "boolean", "description": "true = trả lời đúng/hiểu; false = sai/hiểu nhầm"},
                        "note": {"type": "string", "description": "Tuỳ chọn: lỗi cụ thể, vd 'nhầm learning rate với momentum'"},
                    },
                    "required": ["topic", "correct"],
                },
            },
        }
