---
course: packs
generated: '2026-07-31T18:25:22+00:00'
lang: vi
lesson: day03-tu-chatbot-den-agentic-agent-react_hieu_e403
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\slides\day03-tu-chatbot-den-agentic-agent-react_hieu_e403.md
source_hash: sha256:0bb0771127c8cc83ac67d5d9116e63ce38a3b03a13fd05bc9a2d8dec19caffe3
type: lesson-note
---

```markdown
# Ghi chú bài học ngày 3: Từ Chatbot Đến Agentic Agent

## Slide 1 — Từ Chatbot Đến Agentic Agent
<!-- src: ... -->
Ngày 3 của môn học AICB-P1 tại VinUniversity, giảng viên giới thiệu chủ đề từ [[chatbot]] đến [[agentic-agent]].

## Slide 2 — Hãy Suy Nghĩ...
<!-- src: ... -->
Câu hỏi gợi mở: "ChatGPT là chatbot hay agent? Siri thì sao? Cursor IDE thì sao?" Giữ câu hỏi này trong đầu khi học bài hôm nay.

## Slide 3 — Nội Dung Bài Học
<!-- src: ... -->
1. 3 Kiểu [[hệ-thống-ai]]
2. [[Agentic-Fit-Framework]]
3. [[Kiến-trúc-agent]]
4. [[ReAct-Pattern]]
5. [[Agent-Loop-Code-Anatomy]]
6. Live Demo & Debug
7. [[Eval-Telemetry]]
8. [[Chatbot-vs-Agent]]
9. Lab 3

## Slide 4 — Mục Tiêu Ngày 3
<!-- src: ... -->
- Phân biệt được [[rule-based-bot]], [[LLM-chatbot]], và [[agent]].
- Dùng [[Agentic-Fit]] để biết khi nào nên nâng từ chatbot lên agent.
- Hiểu và giải thích được vòng lặp [[ReAct]]: Thought → Action → Observation.
- Build được ReAct agent đầu tiên với tools, system prompt, và safeguard cơ bản.
- Phân biệt text-ReAct vs native tool calling; biết các failure mode và đo bằng [[telemetry]].

## Slide 5 — Deliverable Cuối Ngày
<!-- src: ... -->
Chatbot baseline + ReAct agent (native tool calling) cho cùng bài toán, chạy được end-to-end kèm telemetry.
- Group report: so sánh chatbot vs agent trên bộ scenario, kèm 1 trace thành công + 1 trace lỗi.
- Individual report: đóng góp kỹ thuật + 1 case debug đọc từ log.
- Chấm theo rubric 100 điểm (group 60 / individual 40).

## Slide 6 — 3 Kiểu Hệ Thống AI
<!-- src: ... -->
Giới thiệu về 3 kiểu hệ thống AI từ bot có rule đến agent có khả năng lập kế hoạch và sử dụng công cụ.

## Slide 7 — Spectrum: Bot → Chatbot → Agent
<!-- src: ... -->
Mức độ phức tạp tăng dần từ trái sang phải: 
- [[Rule-based-bot]]: predictable, predictable chất lượng thấp.
- [[LLM-chatbot]]: thông minh nhưng không chủ động.
- [[Reactive-agent]]: dùng tools và quan sát theo từng bước.
- [[Autonomous-agent]]: tự quyết định nhiều bước liên tiếp.

## Slide 8 — So Sánh 3 Kiểu Hệ Thống AI
<!-- src: ... -->
So sánh giữa [[Rule-based-bot]], [[LLM-chatbot]], và [[Agent]] về các tiêu chí như Cách xử lý, Flexibility, Memory, Tool use, Cost, Risk, và Ví dụ phù hợp.

## Slide 9 — Ví Dụ Nhanh: Cùng Một Câu Hỏi, 3 Mức Độ Hệ Thống
<!-- src: ... -->
Bài toán "Tìm vé HAN → HCM dưới 2 triệu, rồi gợi ý mang gì nếu trời mưa." 
- [[Rule-based-bot]] không thể trả lời.
- [[LLM-chatbot]] chỉ trả lời một lần.
- [[Reactive-agent]] tách goal thành hai việc và sử dụng tools.

## Slide 10 — Agentic Fit Framework
<!-- src: ... -->
4 tiêu chí để xác định bài toán có thật sự cần agent hay không.

## Slide 11 — 4 Tiêu Chí Agentic Fit
<!-- src: ... -->
1. Multi-step Reasoning: Bài toán có cần chia thành nhiều bước phụ thuộc nhau không?
2. Tool Interaction: Hệ thống cần gọi tool nào không?
3. Dynamic Decision: Các bước có phụ thuộc vào kết quả quan sát không?
4. Long Horizon: Hệ thống cần giữ mục tiêu xuyên suốt qua nhiều vòng lặp không?

## Slide 12 — Scoring Matrix: Có Cần Agent Không?
<!-- src: ... -->
Bảng điểm để đánh giá mức độ phù hợp với agent dựa trên Reasoning, Tool use, và Dynamic decision.

## Slide 13 — Anti-Patterns: Khi Dùng Agent Là Sai Bài
<!-- src: ... -->
Danh sách các anti-pattern khi dùng agent không hiệu quả, cùng với nguyên tắc benchmark trước khi mở agent loop.

## Slide 14 — Case Study: Chatbot Đủ Hay Cần Agent?
<!-- src: ... -->
So sánh giữa [[Customer-FAQ]] và [[Booking-Assistant]] để xác định khi nào cần dùng [[agent]].

## Slide 15 — Từ Anthropic: Agent Patterns Nên Tăng Dần Theo Nhu Cầu
<!-- src: ... -->
Mô hình các bước từ [[Augmented-LLM]] đến [[Agent]], thể hiện mức độ phức tạp gia tăng.

## Slide 16 — Kiến Trúc Agent
<!-- src: ... -->
Phân tích các khối trong kiến trúc agent như Perception, Reasoning, Action và Memory.

## Slide 17 — Kiến Trúc Agent: Từ Trong Ra Ngoài
<!-- src: ... -->
Mô tả chi tiết về hệ thống vào ra trong kiến trúc agent.

## Slide 18 — Memory: Short-term vs Long-term
<!-- src: ... -->
Khái niệm về [[Short-term-memory]] và [[Long-term-memory]].

## Slide 19 — Tool Calling = Tay Chân Của Agent
<!-- src: ... -->
Giải thích về việc gọi các công cụ trong agent và tầm quan trọng của chúng trong vòng [[ReAct]].

## Slide 20 — ReAct Pattern
<!-- src: ... -->
Định nghĩa về [[ReAct]] là sự kết hợp giữa reasoning và action.

## Slide 21 — Định Nghĩa
<!-- src: ... -->
Giải thích vòng lặp [[ReAct]]: Thought → Action → Observation.

## Slide 22 — ReAct Loop: Thought → Action → Observation
<!-- src: ... -->
Mô tả luồng vòng lặp [[ReAct]] và cách mà nó giữ cho agent hoạt động hiệu quả.

## Slide 23 — Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (1/2)
<!-- src: ... -->
Chạy ví dụ trace tìm chuyến bay để minh họa cách mà agent xử lý vấn đề.

## Slide 24 — Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (2/2)
<!-- src: ... -->
Tiếp tục phần trace, cho thấy quá trình quyết định của agent.

## Slide 25 — ReAct Tốt Ở Điểm Nào?
<!-- src: ... -->
Ưu điểm và giới hạn của [[ReAct]], cũng như các tình huống sử dụng.

## Slide 26 — Hai Cách Hiện Thực "Action": Text-ReAct vs Native Tool Calling
<!-- src: ... -->
So sánh cách hiện thực [[Action]] của [[ReAct]].

## Slide 27 — "Action" Được Parse Như Thế Nào?
<!-- src: ... -->
So sánh giữa quy trình parse của text-ReAct và native tool calling.

## Slide 28 — Agent Loop: Code Anatomy
<!-- src: ... -->
Mô tả về mã nguồn của vòng lặp agent.

## Slide 29 — Pseudocode: Agent Loop Tối Thiểu
<!-- src: ... -->
Đưa ra pseudocode cho vòng lặp agent tối thiểu.

## Slide 30 — System Prompt Cho ReAct Agent
<!-- src: ... -->
Ví dụ về system prompt cho ReAct agent.

## Slide 31 — Tool Registry: Khai Báo "Tay Chân" Cho Agent
<!-- src: ... -->
Khai báo các tool cần thiết cho agent.

## Slide 32 — Max Iterations Safeguard: Tránh Agent Đi Vòng
<!-- src: ... -->
Những biện pháp bảo vệ cần có khi sử dụng agent để tránh lặp.

## Slide 33 — Khi Nào Cần Hơn ReAct Loop? (Teaser)
<!-- src: ... -->
Khi nào cần chuyển sang dùng state-graph cho agent phức tạp.

## Slide 34 — Live Demo & Debug
<!-- src: ... -->
Trình bày nội dung của buổi live demo.

## Slide 35 — Kịch Bản Live Demo
<!-- src: ... -->
Mô tả các bước trong kịch bản live demo.

## Slide 36 — Code Demo: 2 Tool Tối Thiểu
<!-- src: ... -->
Mã Python cho hai tool mẫu trong live demo.

## Slide 37 — Debug Checklist Khi Agent Lỗi
<!-- src: ... -->
Danh sách kiểm tra để debug khi agent gặp lỗi.

## Slide 38 — ReAct Failure Modes: 5 Kiểu Lỗi Phải Biết
<!-- src: ... -->
Các loại lỗi thường gặp khi sử dụng [[ReAct]] cùng với hướng giải quyết.

## Slide 39 — Eval & Telemetry
<!-- src: ... -->
Cách đo hiệu quả của agent bằng trace, không chỉ bảo bám vào final answer.

## Slide 40 — Eval-by-Trace: Đo Gì Trên Mỗi Bước?
<!-- src: ... -->
Bảng minh họa cách đánh giá agent qua từng bước thực hiện.

## Slide 41 — Chatbot vs Agent
<!-- src: ... -->
So sánh giữa chatbot và agent trong các tình huống khác nhau.

## Slide 42 — Khi Nào Chatbot Thắng, Khi Nào Agent Thắng?
<!-- src: ... -->
Bảng so sánh những lợi thế của chatbot và agent theo từng khía cạnh.

## Slide 43 — Hybrid Pattern: Thực Dụng Hơn Cực Đoan
<!-- src: ... -->
Mô tả mô hình hybrid, giúp kết hợp tốt giữa chatbot và agent.

## Slide 44 — Lab 3: Chatbot vs Agent
<!-- src: ... -->
Giới thiệu về nội dung thực hành Lab 3.

## Slide 45 — Bridge: Ví Dụ Lớp Học → Bài Lab
<!-- src: ... -->
So sánh giữa nội dung bài học và lab thực hành.

## Slide 46 — Cách Chạy Lab 3
<!-- src: ... -->
Hướng dẫn cách thức thực hiện Lab 3.

## Slide 47 — Lab #3
<!-- src: ... -->
Mô tả mục tiêu, deliverable, và thời gian cho lab.

## Slide 48 — Rubric Lab 3 — 100 Điểm
<!-- src: ... -->
Chi tiết rubric chấm điểm cho Lab 3 chia thành nhóm riêng.

## Slide 49 — Tổng Kết — Key Takeaways
<!-- src: ... -->
Tóm tắt 5 điểm chính của bài học hôm nay.

## Slide 50 — Tiếp theo & Bài tập
<!-- src: ... -->
Giới thiệu nội dung bài học tiếp theo và bài tập về nhà.

## Slide 51 — Tài Liệu Tham Khảo
<!-- src: ... -->
Danh sách tài liệu tham khảo cho bài học hôm nay.

## Slide 52 — Hỏi & Đáp
<!-- src: ... -->
Thảo luận về các use case cho chatbot và agent.

## Slide 53 — Cảm ơn!
<!-- src: ... -->
Thông tin liên hệ và trang tài liệu của giảng viên.
```

## Khái niệm chính
- [[chatbot]]: Chương trình tương tác tự động có khả năng trả lời câu hỏi người dùng.
- [[agentic-agent]]: Hệ thống AI có khả năng tự quyết định và thực hiện các hành động để đạt được mục tiêu.
- [[hệ-thống-ai]]: Các loại hệ thống AI được phân loại dựa trên độ phức tạp và chức năng.
- [[Agentic-Fit-Framework]]: Khuôn khổ giúp xác định khi nào một bài toán cần sử dụng agent.
- [[kiến-trúc-agent]]: Cấu trúc tổ chức các thành phần trong một hệ thống agent.
- [[ReAct-Pattern]]: Mô hình kết hợp reasoning và acting trong quy trình làm việc của agent.
- [[telemetry]]: Dữ liệu ghi lại các metric trong quá trình hoạt động của hệ thống để đánh giá hiệu suất.
- [[rule-based-bot]]: Bot hoạt động dựa trên quy tắc cố định.
- [[LLM-chatbot]]: Chatbot sử dụng [[large-language-model]] để tương tác.
- [[agent]]: Hệ thống có khả năng tương tác linh hoạt và tự động đưa ra quyết định.
