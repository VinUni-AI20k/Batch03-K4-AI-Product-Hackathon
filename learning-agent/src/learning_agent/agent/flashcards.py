"""Flashcard bền vững + spaced repetition (SM-2 rút gọn).

Một tool dispatcher duy nhất `flashcards(action, ...)` để không phình danh sách tool:
- save : lưu thẻ mới theo chủ đề (từ skill the-ghi-nho / tao-goi-hoc-lieu)
- due  : lấy thẻ ĐẾN HẠN ôn hôm nay (xáo trộn, giới hạn 10)
- grade: chấm 1 thẻ sau khi học viên trả lời -> cập nhật lịch ôn:
         đúng: interval 1 -> 3 -> 7 -> 16 -> 35 ngày (x2.2, trần 90); sai: về 1 ngày.

Lưu data/flashcards/<user_id>.json (dữ liệu máy — không rác vault).
Ôn định kỳ: học viên bảo "mỗi tối 21h ôn thẻ" -> schedule_task sẵn có với prompt
"ôn flashcard đến hạn" (scheduler gọi agent -> agent gọi flashcards due).
"""
from __future__ import annotations

import json
import random
import re
from datetime import date, timedelta
from pathlib import Path

MAX_DUE = 10
MAX_CARDS = 500  # trần mỗi học viên — chống spam


class FlashcardStore:
    def __init__(self, root: Path):
        self.dir = Path(root) / "data" / "flashcards"

    def _path(self, user_id: str) -> Path:
        safe = re.sub(r"[^0-9A-Za-z_\-]", "_", str(user_id))
        return self.dir / f"{safe}.json"

    def _load(self, user_id: str) -> list[dict]:
        p = self._path(user_id)
        if p.exists():
            try:
                return json.loads(p.read_text(encoding="utf-8"))
            except Exception:
                return []
        return []

    def _save(self, user_id: str, cards: list[dict]) -> None:
        self.dir.mkdir(parents=True, exist_ok=True)
        self._path(user_id).write_text(
            json.dumps(cards, ensure_ascii=False, indent=1), encoding="utf-8")

    # ---------- actions ----------
    def add(self, user_id: str, new_cards: list[dict]) -> str:
        cards = self._load(user_id)
        if len(cards) >= MAX_CARDS:
            return f"⚠️ Đã đạt trần {MAX_CARDS} thẻ — xoá bớt thẻ cũ trước."
        today = date.today().isoformat()
        added = 0
        existing_q = {c["q"].strip().lower() for c in cards}
        next_id = (max((c["id"] for c in cards), default=0)) + 1
        for nc in new_cards[: MAX_CARDS - len(cards)]:
            q, a = (nc.get("q") or "").strip(), (nc.get("a") or "").strip()
            if not q or not a or q.lower() in existing_q:
                continue
            cards.append({"id": next_id, "q": q, "a": a,
                          "topic": (nc.get("topic") or "").strip() or "khác",
                          "interval": 1, "due": today, "reps": 0, "lapses": 0})
            existing_q.add(q.lower())
            next_id += 1
            added += 1
        self._save(user_id, cards)
        return f"✅ Đã lưu {added} thẻ (tổng {len(cards)}). Thẻ mới đến hạn ôn NGAY hôm nay — hỏi học viên có muốn ôn luôn không."

    def due(self, user_id: str) -> str:
        cards = self._load(user_id)
        today = date.today().isoformat()
        dues = [c for c in cards if c.get("due", today) <= today]
        if not dues:
            nxt = min((c["due"] for c in cards), default=None)
            return ("Chưa có thẻ nào. Tạo thẻ bằng skill the-ghi-nho trước." if not cards
                    else f"🎉 Hết thẻ đến hạn hôm nay ({len(cards)} thẻ trong bộ). Lượt ôn kế: {nxt}.")
        random.shuffle(dues)
        pick = dues[:MAX_DUE]
        out = [{"id": c["id"], "q": c["q"], "a": c["a"], "topic": c["topic"]} for c in pick]
        return (f"{len(dues)} thẻ đến hạn (lấy {len(pick)}). HỎI TỪNG THẺ MỘT (chỉ đưa câu hỏi q, "
                f"chờ trả lời rồi mới lộ đáp án a), chấm bằng flashcards grade sau mỗi thẻ:\n"
                + json.dumps(out, ensure_ascii=False))

    def grade(self, user_id: str, card_id: int, correct: bool) -> tuple[str, str]:
        """Trả (message, topic) — topic để core tự ghi mastery."""
        cards = self._load(user_id)
        card = next((c for c in cards if c.get("id") == card_id), None)
        if card is None:
            return (f"⚠️ Không có thẻ id={card_id}.", "")
        if correct:
            card["interval"] = min(90, max(3, round(card.get("interval", 1) * 2.2)))
            card["reps"] = card.get("reps", 0) + 1
        else:
            card["interval"] = 1
            card["lapses"] = card.get("lapses", 0) + 1
        card["due"] = (date.today() + timedelta(days=card["interval"])).isoformat()
        self._save(user_id, cards)
        return (f"{'✅' if correct else '🔁'} Thẻ {card_id}: ôn lại sau {card['interval']} ngày ({card['due']}).",
                card.get("topic", ""))

    # ---------- tool ----------
    def dispatch(self, user_id: str, args: dict) -> tuple[str, str]:
        """Trả (kết quả, topic_vừa_chấm — rỗng nếu không phải grade)."""
        action = (args.get("action") or "").strip().lower()
        if action == "save":
            return (self.add(user_id, args.get("cards") or []), "")
        if action == "due":
            return (self.due(user_id), "")
        if action == "grade":
            return self.grade(user_id, int(args.get("card_id", 0)), bool(args.get("correct")))
        return ("action phải là: save | due | grade", "")

    def tool_schema(self) -> dict:
        return {
            "type": "function",
            "function": {
                "name": "flashcards",
                "description": (
                    "Bộ thẻ ghi nhớ BỀN VỮNG + spaced repetition của học viên. "
                    "action='save' (cards=[{q,a,topic}]) lưu thẻ mới sau khi tạo bằng skill the-ghi-nho; "
                    "action='due' lấy thẻ đến hạn ôn hôm nay (hỏi TỪNG thẻ, giấu đáp án tới khi họ trả lời); "
                    "action='grade' (card_id, correct) chấm ngay sau mỗi thẻ -> tự xếp lịch ôn lại "
                    "(đúng: giãn dần 3→7→16→35 ngày; sai: mai ôn lại). "
                    "Học viên muốn ôn định kỳ -> schedule_task với prompt 'ôn flashcard đến hạn'."),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "action": {"type": "string", "description": "save | due | grade"},
                        "cards": {"type": "array", "description": "Cho save: [{q, a, topic}]",
                                  "items": {"type": "object", "properties": {
                                      "q": {"type": "string"}, "a": {"type": "string"},
                                      "topic": {"type": "string"}}}},
                        "card_id": {"type": "integer", "description": "Cho grade"},
                        "correct": {"type": "boolean", "description": "Cho grade"},
                    },
                    "required": ["action"],
                },
            },
        }
