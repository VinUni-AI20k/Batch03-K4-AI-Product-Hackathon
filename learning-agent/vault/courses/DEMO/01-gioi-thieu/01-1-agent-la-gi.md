---
type: lesson-note
course: DEMO
module: 01-gioi-thieu
lesson: 01-1-agent-la-gi
source_file: DEMO/01-gioi-thieu/01-1-agent-la-gi.pptx
source_hash: "sha256:demo"
generated: 2026-07-30T00:00:00+00:00
lang: vi
maps: ["[[MOC - DEMO]]"]
---
## Slide 1 — AI Agent là gì
<!-- src: 01-1-agent-la-gi.pptx#1 -->
[[ai-agent]] là chương trình dùng LLM làm bộ não, tự lập kế hoạch và gọi [[tool]] để hoàn thành mục tiêu, thay vì chỉ trả lời một lượt như chatbot thường.

## Slide 2 — Vòng lặp agent
<!-- src: 01-1-agent-la-gi.pptx#2 -->
Vòng lặp cơ bản: nhận yêu cầu → suy luận → gọi tool → đọc kết quả → lặp lại đến khi xong. Đây gọi là [[tool-calling-loop]].

## Khái niệm chính
- [[ai-agent]]: chương trình LLM tự lập kế hoạch và hành động qua tool.
- [[tool]]: hàm mà agent gọi được để tác động ra ngoài (tìm kiếm, đọc file...).
- [[tool-calling-loop]]: vòng lặp suy luận – hành động – quan sát của agent.
