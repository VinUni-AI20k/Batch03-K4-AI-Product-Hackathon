---
course: packs
generated: '2026-07-31T18:28:44+00:00'
lang: vi
lesson: day04-prompt-engineering-tool-calling
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\slides\day04-prompt-engineering-tool-calling.md
source_hash: sha256:0dc28a3ff66772df5141657c8a9ea4b676d9b629619a0b9bc38131198c6f93c7
type: lesson-note
---

```markdown
## Slide 1 — Prompt Engineering & Tool Calling
Làm sao nói để AI hiểu đúng ý? 

## Slide 2 — Hãy Suy Nghĩ...
“Hai người hỏi AI cùng một việc, một người nhận kết quả xuất sắc, người kia nhận rác. Tại sao? Và: cùng một agent, đôi khi nó gọi tool đúng, đôi khi gọi sai — do prompt hay do tool?” Giữ câu hỏi này trong đầu khi học bài hôm nay.

## Slide 3 — Nội Dung Bài Học
1. [[prompt-fundamentals]]
2. [[advanced-prompting-techniques]]
3. [[system-prompt-engineering]]
4. [[context-engineering]]
5. [[prompt-safety-evaluation]]
6. [[tool-calling]]
7. [[design-principles-cho-tools]]
8. [[tool-patterns-error-handling]]
9. Lab 4 + deliverable cuối buổi

## Slide 4 — Mục Tiêu Ngày 4
- Viết được prompt rõ ràng theo các thành phần [[Role]], [[Task]], [[Context]], [[Format]].
- Hiểu khi nào nên dùng [[zero-shot]], [[few-shot]], [[CoT]], và khi nào không cần.
- Viết được [[system-prompt-production-grade]] cho agent.
- Khai báo được [[tool-schema]] và hiểu vòng lặp [[tool-calling]] từ model đến tool rồi quay lại model.
- Nhận diện được [[prompt-injection]] và viết [[system-prompt-an-toàn]].
- Biết cách iterate và evaluate [[prompt-quality]].

## Slide 5 — Deliverable Cuối Ngày
1 agent script chạy được + 1 system prompt + 2 tool schemas + 5 test questions + ghi chú lỗi prompt/tool/control flow + checklist self-review.

## Slide 6 — Prompt Engineering Fundamentals
Prompt tốt không phải prompt “hay”, mà là prompt tạo ra hành vi mong muốn ổn định.

## Slide 7 — Prompt = Interface Giữa Ý Định và Khả Năng Model
Ví dụ prompt kém: "Viết email cho tôi" không rõ ràng. Ví dụ prompt tốt: "Viết email xin lỗi khách hàng về giao hàng trễ 2 ngày, tone lịch sự, dưới 120 từ, có [[CTA rõ ràng]]". Nguyên tắc vàng: Specificity beats cleverness.

## Slide 8 — 4 Thành Phần Của Prompt Tốt
- [[ROLE]]: "Act as a senior support analyst"
- [[TASK]]: "Summarize the ticket and propose next step"
- [[CONTEXT]]: "For an internal operations dashboard"
- [[FORMAT]]: "Output as JSON with 3 fields"

## Slide 9 — RTCF Deep Dive: Ví Dụ Thực Tế
Ví dụ tốt và kém cho các thành phần [[ROLE]], [[TASK]], [[CONTEXT]], và [[FORMAT]]. Mỗi component thêm vào prompt phải có lý do rõ ràng.

## Slide 10 — Prompt Iteration: Từ Kém → Tốt → Xuất Sắc
Ví dụ về sự cải thiện từ prompt kém đến xuất sắc. Prompt engineering là quá trình lặp lại: viết → test → observe → improve.

## Slide 11 — Instruction vs Conversation vs System Prompt
- [[Instruction-prompt]]: Ra lệnh trực tiếp cho một tác vụ.
- [[Conversation-prompt]]: Giữ ngữ cảnh nhiều lượt với user.
- [[System-prompt]]: Đặt policy, boundary, output contract.

## Slide 12 — Negative Prompting & Boundary Setting
Chỉ nói "đừng" kém, nói rõ thay thế tốt hơn.

## Slide 13 — Token Budget Awareness
Prompt dài hơn không đồng nghĩa prompt tốt hơn. Ưu tiên: instruction rõ, examples đúng chỗ, output contract rõ.

## Slide 14 — Temperature & Sampling Parameters
Những giá trị temperature khác nhau cho các use case khác nhau. Temperature không thay thế prompt tốt.

## Slide 15 — Quick Exercise: Viết Prompt Theo RTCF
Viết prompt cho chatbot hỗ trợ sinh viên VinUni đăng ký môn học. Xác định 4 thành phần: [[Role]], [[Task]], [[Context]], [[Format]].

## Slide 16 — Advanced Prompting Techniques
Dùng kỹ thuật nâng cao khi chúng cải thiện chất lượng thật sự.

## Slide 17 — Zero-shot, One-shot, Few-shot, CoT
Thứ tự thử thực dụng: [[zero-shot]] → [[few-shot]] → decomposition / [[CoT]].

## Slide 18 — Khi Nào Dùng Few-shot?
Khi model hiểu [[task]] nhưng ra sai [[format]] hoặc không ổn định.

## Slide 19 — Few-shot Prompting — Python Example
Ví dụ về cách sử dụng few-shot trong Python.

## Slide 20 — Few-shot Anti-patterns
Một số mẹo để tránh sai lầm trong few-shot prompting.

## Slide 21 — Chain-of-Thought (CoT) và Tree-of-Thought
Xu hướng sử dụng [[CoT]] trong bài toán cần reasoning nhiều bước.

## Slide 22 — Chain-of-Thought — Python Example
Ví dụ về cách sử dụng CoT trong phân tích review khách sạn.

## Slide 23 — Structured Output Prompting
Sự cần thiết của output dạng cấu trúc để dễ dàng Parse.

## Slide 24 — Khi Nào KHÔNG Cần Kỹ Thuật Nâng Cao
Bắt đầu đơn giản, chỉ thêm complexity khi output chưa đạt yêu cầu.

## Slide 25 — System Prompt Engineering
[[System-prompt]] tốt làm agent nhất quán hơn, dễ kiểm soát hơn, và dễ test hơn.

## Slide 26 — Anatomy của System Prompt Production-grade
Các thành phần trong [[system-prompt]] production-grade.

## Slide 27 — System Prompt — Python Example
Ví dụ về cách viết system prompt hiệu quả trong Python.

## Slide 28 — System Prompt Iteration: v1 → v2
Cải thiện system prompt qua các kết quả test.

## Slide 29 — System Prompt: Anthropic vs OpenAI API
So sánh giữa [[Anthropic]] và [[OpenAI]] về cấu trúc system prompt.

## Slide 30 — System Prompt Anti-Patterns
Các lỗi thường gặp khi thiết kế [[system-prompt]].

## Slide 31 — System Prompt Testing Checklist
Danh sách kiểm tra các yếu tố cần thiết khi test [[system-prompt]].

## Slide 32 — Real-world System Prompt Template
Mẫu system prompt dùng làm điểm khởi đầu.

## Slide 33 — Mini Exercise: Critique a System Prompt
Phân tích một system prompt và tìm ra vấn đề.

## Slide 34 — Context Engineering
Chọn đúng [[context]] cần thiết chứ không phải nhét bao nhiêu context.

## Slide 35 — Context Window Management
Quản lý không gian context một cách hợp lý.

## Slide 36 — Lost in the Middle Problem
Vị trí trong context ảnh hưởng đến việc model tiếp nhận thông tin.

## Slide 37 — Memory Injection và Context Compression
Chiến lược để cải thiện tính hiệu quả của [[context]].

## Slide 38 — Token Budget Allocation: Nên Nghĩ Theo Rổ Nào?
Phân bổ token cần chủ động.

## Slide 39 — RAG Context Pattern
Mô hình lấy lại và đưa vào context theo yêu cầu.

## Slide 40 — Context Engineering Checklist
Danh sách kiểm tra cho việc tối ưu hóa [[context]].

## Slide 41 — Prompt Safety & Evaluation
[[Prompt]] tốt không chỉ cho kết quả đúng — mà còn phải an toàn và đáng tin.

## Slide 42 — Direct injection
Cách mà người dùng có thể trực tiếp gây ảnh hưởng đến model.

## Slide 43 — Defense Strategies
Các chiến lược bảo vệ chống lại các cuộc tấn công.

## Slide 44 — Prompt Evaluation Framework
Khung đánh giá prompt để đo lường [[correctness]], [[consistency]], và [[safety]].

## Slide 45 — Guardrails Pattern
Mô hình bảo vệ để đảm bảo an toàn cho output.

## Slide 46 — Tool Calling
[[Tool-calling]] là cách agent chuyển từ “nói” sang “tương tác với thế giới thực”.

## Slide 47 — Tool Calling Flow
Quy trình cơ bản của việc gọi tool.

## Slide 48 — Tool Calling: Ai Làm Gì?
Phân vai trong quy trình [[tool-calling]].

## Slide 49 — Tool Schema Anatomy
Các thành phần cần thiết trong [[tool-schema]].

## Slide 50 — Tool Schema — Python Example
Ví dụ sử dụng [[tool-schema]] trong Python.

## Slide 51 — Good vs Bad Tool Description
So sánh giữa mô tả tool tốt và kém.

## Slide 52 — tool_choice Parameter
Chức năng của các giá trị trong tham số `tool_choice`.

## Slide 53 — Tool Calling: OpenAI vs Anthropic Format
So sánh hai định dạng của OpenAI và Anthropic trong việc gọi tool.

## Slide 54 — Xử Lý Tool Errors
Cách xử lý các lỗi khi gọi tool.

## Slide 55 — Design Principles Cho Tools
Nguyên tắc thiết kế cho [[tool]] hiệu quả.

## Slide 56 — 4 Nguyên Tắc Thiết Kế Tool
Các nguyên tắc chính khi thiết kế tool.

## Slide 57 — Tool Granularity: Quá Nhỏ Hay Quá To Đều Có Giá
Quan điểm về độ chi tiết của tool.

## Slide 58 — Parameter Design Best Practices
Các thực hành tốt khi thiết kế tham số cho tool.

## Slide 59 — Tool Return Format Best Practices
Những thực hành tốt cho định dạng trả về của tool.

## Slide 60 — Tool Description Engineering
Mô tả tool rõ ràng để model hiểu đúng cách sử dụng.

## Slide 61 — Parallel Tool Calling & Patterns
Nhu cầu có flow control trong việc gọi song song các tool.

## Slide 62 — Sequential vs Parallel Tool Calls
So sánh giữa gọi tool tuần tự và song song.

## Slide 63 — 3 Tool Use Patterns Thường Gặp
Những mẫu sử dụng tool phổ biến.

## Slide 64 — 3 Patterns — Visual Flow
Hình ảnh mô tả quy trình gọi tool.

## Slide 65 — Minimal Tool Loop — Python Example
Ví dụ về vòng lặp tool tối thiểu trong Python.

## Slide 66 — Robust Tool Loop — Error Handling
Xử lý lỗi trong vòng lặp tool một cách hiệu quả.

## Slide 67 — Thực Hành
Lab 4: Build first agent với system prompt + 2 tools + 5 test cases.

## Slide 68 — Hands-on 4: Cách Chạy Lab
Các bước để hoàn thành lab 4.

## Slide 69 — Lab Skeleton — Python Example
Mẫu code cho lab.

## Slide 70 — Lab Walkthrough: Step-by-Step
Hướng dẫn từng bước cho lab.

## Slide 71 — 5 Test Questions Gợi Ý
Một số câu hỏi kiểm tra đề xuất cho lab.

## Slide 72 — Lab Self-Review Checklist
Danh sách kiểm tra tự đánh giá cho lab.

## Slide 73 — Lab #4
Mục tiêu xây dựng agent với các công cụ tùy chỉnh.

## Slide 74 — Tổng kết — Key Takeaways
Những điểm chính cần nhớ trước khi chuyển sang bài tiếp theo.

## Slide 75 — Tiếp theo & Bài tập
Công việc cho ngày tiếp theo sau khi hoàn thành lab.

## Slide 76 — Tài Liệu Tham Khảo
Danh sách tài liệu tham khảo để nghiên cứu thêm.

## Slide 77 — Hỏi & Đáp
Giải đáp thắc mắc liên quan đến prompt và tool contract.

## Slide 78 — Cảm ơn!
Email: lecturer@vinuni.edu.vn
```
