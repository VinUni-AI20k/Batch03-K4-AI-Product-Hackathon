"""Sub-agent cho việc dài (quiz cả chương, tóm tắt module) — pattern Hermes:
chạy một agent con với system prompt riêng, context cô lập, trả kết quả về thread."""
from __future__ import annotations

from .core import TutorAgent

QUIZ_PROMPT = """Nhiệm vụ: tạo bộ quiz trắc nghiệm từ tài liệu khoá học.
- Dùng get_lesson/search_lessons lấy ĐÚNG nội dung bài được yêu cầu.
- Mỗi câu: 4 lựa chọn A-D, 1 đáp án đúng, kèm giải thích ngắn + trích nguồn (bài/slide).
- Định dạng markdown, đáp án + giải thích để cuối cùng (phần '---ĐÁP ÁN---')."""

SUMMARY_PROMPT = """Nhiệm vụ: tóm tắt bài học cho học viên ôn tập.
- Dùng get_lesson lấy toàn văn bài được yêu cầu.
- Tóm tắt theo cấu trúc: Ý chính (bullet) -> Khái niệm cần nhớ ([[wikilink]]) -> Câu hỏi tự kiểm tra.
- Giữ trích nguồn slide/timestamp."""


def run_quiz(agent: TutorAgent, user_id: str, display_name: str, lesson: str, n: int = 5) -> str:
    return agent.reply(
        user_id, display_name,
        history=[{"role": "user", "content": f"Tạo {n} câu quiz cho bài: {lesson}"}],
        system_extra=QUIZ_PROMPT,
    )


def run_summary(agent: TutorAgent, user_id: str, display_name: str, lesson: str) -> str:
    return agent.reply(
        user_id, display_name,
        history=[{"role": "user", "content": f"Tóm tắt bài: {lesson}"}],
        system_extra=SUMMARY_PROMPT,
    )
