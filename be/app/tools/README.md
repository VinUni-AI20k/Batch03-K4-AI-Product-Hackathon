# Agent tools

Tools là các năng lực nhỏ, có input/output rõ và có thể gọi từ `TutorAgent`.

## Context

- `get_current_context`: lấy bài/trang đang mở.
- `context_builder`: chọn source chunk trong context budget.

## Retrieval

- `search_lectures`: tìm theo current page, current lecture, selected lectures
  hoặc all lectures.
- `get_source_detail`: lấy nội dung nguồn khi mở citation.

## Tutoring

- `answer_from_slides`: hỏi đáp có căn cứ.
- `summarize_content`: tóm tắt trang, bài, chủ đề hoặc nhiều bài.
- `explain_concept`: giải thích theo mức độ người học.
- `compare_lectures`: nhóm nguồn để so sánh giữa bài giảng.

## Learning

- Ghi chú ôn tập, quiz, kiểm tra câu trả lời, flashcard và gợi ý câu hỏi tiếp.

## Validation và guardrails

- Kiểm tra citation, grounding, ngoài phạm vi và yêu cầu gian lận học tập.

Retrieval engine, LLM và vector database không nằm trong tools; chúng được inject
qua `providers` để có thể thay thế mà không sửa agent.
