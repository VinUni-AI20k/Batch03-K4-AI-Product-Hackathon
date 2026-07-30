---
course: AI20K
generated: '2026-07-30T17:31:25+00:00'
lang: vi
lesson: day3-material
maps:
- '[[MOC - AI20K]]'
module: ''
source_file: AI20K/day3-material.pdf
source_hash: sha256:447b4a5273fd44ae4558e1eb30e6e77088baab49d7a27a0ac99bd63c0efc1624
type: lesson-note
---

```markdown
## Slide 1 — Tù Chatbot Đn Agentic Agent
<!-- src: ... -->
Tràn Quang Thin trình bày về các AI tools gần đây và sự khác biệt giữa chatbot và agent.

## Slide 2 — Ni Dung Bài Học
<!-- src: ... -->
Bài học bao gồm: 3 Kiểu Hệ Thống AI, [[Agentic Fit Framework]], [[Kiến Trúc Agent]], [[ReAct Pattern]], [[ReAct vs Function Calling]], [[Agent Loop: Code Anatomy]], chi phí và an ninh, demo thực tế, so sánh giữa chatbot và agent, và tiêu chí chấm Lab.

## Slide 3 — Deliverable Cuối Ngày
<!-- src: ... -->
Mỗi nhóm cần thực hiện 5 test cases so sánh chatbot và agent, trace Thought/Action/Observation của agent, và nhận định rõ khi nào sử dụng chatbot hay agent.

## Slide 4 — 3 Kiểu Hệ Thống AI
<!-- src: ... -->
Điểm khác biệt giữa rule-based bot, LLM chatbot và agent. Các kiểu xử lý với cùng một yêu cầu nhưng đưa ra câu trả lời khác nhau.

## Slide 5 — Ví dụ về Rule-based Bot
<!-- src: ... -->
- Cung cấp các lựa chọn như tìm vé máy bay, thời tiết, gặp nhân viên.

## Slide 6 — Ví dụ về LLM Chatbot
<!-- src: ... -->
Người dùng có thể tìm vé máy bay trên các trang như Traveloka hoặc VietJet, với mức giá 1.5–2 triệu.

## Slide 7 — Ví dụ về Agent
<!-- src: ... -->
Agent cung cấp thông tin chuyến bay cụ thể và nhận xét về thời tiết mà người dùng nên chú ý.

## Slide 8 — Phân biệt giữa các hệ thống AI
<!-- src: ... -->
So sánh ba loại bot theo các tiêu chí: cách xử lý, tính linh hoạt, trí nhớ, khả năng sử dụng công cụ, chi phí, rủi ro và ví dụ phù hợp cho từng loại. 

## Slide 9 — Agentic Fit Framework
<!-- src: ... -->
Khung đánh giá để xác định có nên sử dụng agent hay không dựa trên 4 tiêu chí: khả năng tư duy nhiều bước, tương tác công cụ, quyết định động.

## Slide 10 — Ví dụ Use Case cho Agentic Fit
<!-- src: ... -->
Danh sách các use case và điểm số tương ứng với từng tiêu chí đánh giá.

## Slide 11 — Anti-Patterns
<!-- src: ... -->
Tránh các lỗi khi dùng agent không phù hợp như câu hỏi đơn giản, không có công cụ hay việc không đảm bảo tính chính xác.

## Slide 12 — Kiến Trúc Agent
<!-- src: ... -->
Mô tả kiến trúc cần thiết của agent bao gồm: perception, reasoning, action, and memory.

## Slide 13 — Tool Calling
<!-- src: ... -->
Tool calling là phần thiết yếu trong reasoning của agent và có thể ảnh hưởng đến độ chính xác.

## Slide 14 — Anatomy của một Tool Definition
<!-- src: ... -->
Năm thành phần chính trong định nghĩa công cụ: tên, mô tả, tham số, định dạng trả về, và chế độ lỗi.

## Slide 15 — Giới hạn và khả năng
<!-- src: ... -->
Thảo luận về các yếu tố có thể làm tăng hoặc giảm khả năng sử dụng công cụ của agent.

## Slide 16 — Live Demo & Debug
<!-- src: ... -->
Xây dựng demo thực tế cho agent với việc xác định thời tiết và giày dép phù hợp với thời tiết.

## Slide 17 — Đánh giá Agent
<!-- src: ... -->
Không chỉ đánh giá câu trả lời cuối cùng, mà còn phải đánh giá chất lượng trace của quá trình hoạt động.

## Slide 18 — Chatbot vs Agent
<!-- src: ... -->
Sự khác biệt giữa hai loại hệ thống và trường hợp sử dụng nào cho chatbot và agent.

## Khái niệm chính
- [[Rule-based-bot]]: Bot hoạt động dựa trên các quy tắc cụ thể chỉ định từ trước.
- [[LLM-chatbot]]: Bot có khả năng sinh câu trả lời dựa trên ngữ cảnh người dùng cung cấp.
- [[Agent]]: Hệ thống AI thực hiện hành động và phản ứng linh hoạt trong nhiều bước dựa trên quan sát.
- [[Agentic-fit-framework]]: Khung đánh giá khả năng sử dụng agent dựa trên nhiều tiêu chí khác nhau.
- [[React-pattern]]: Mô hình kết hợp suy luận và hành động để cải thiện khả năng của agent.
```
