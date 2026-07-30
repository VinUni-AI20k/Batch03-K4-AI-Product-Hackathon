---
course: packs
generated: '2026-07-30T10:39:49+00:00'
lang: vi
lesson: day04-prompt-engineering-tool-calling
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/slides/day04-prompt-engineering-tool-calling.md
source_hash: sha256:29d68f1da628027c757e87c97ab479f6ea2b0b3e189df55e48d7b384ff76128e
type: lesson-note
---

```markdown
## Slide 1 — Prompt Engineering & Tool Calling
Giới thiệu về prompt engineering và việc gọi tool trong AI, tập trung vào cách giao tiếp để AI hiểu đúng ý người dùng. <!-- src: ... -->

## Slide 2 — Hãy Suy Nghĩ...
Câu hỏi suy ngẫm: “Tại sao hai người hỏi AI cùng một việc có thể nhận phản hồi khác nhau?” và sự khác biệt trong việc gọi tool. Giữ câu hỏi này trong đầu khi học bài hôm nay. <!-- src: ... -->

## Slide 3 — Nội Dung Bài Học
1. [[prompt-fundamentals]]
2. [[advanced-prompting-techniques]]
3. [[system-prompt-engineering]]
4. [[context-engineering]]
5. [[prompt-safety-evaluation]]
6. [[tool-calling]]
7. [[design-principles-cho-tools]]
8. [[tool-patterns-error-handling]]
9. Thực hành Lab 4 + deliverable cuối buổi. <!-- src: ... -->

## Slide 4 — Mục Tiêu Ngày 4
Mục tiêu buổi học:
- Viết prompt rõ ràng với các thành phần [[role]], [[task]], [[context]], [[format]].
- Hiểu khi nào nên dùng các phương pháp zero-shot, few-shot, và CoT.
- Viết được system prompt sản xuất cho agent.
- Khai báo được [[tool-schema]] và hiểu vòng lặp tool calling từ model đến tool và trở lại model.
- Nhận diện [[prompt-injection]] và viết system prompt an toàn.
- Biết cách lặp lại và đánh giá chất lượng prompt. <!-- src: ... -->

## Slide 5 — Deliverable Cuối Ngày
Yêu cầu cuối buổi: 1 script agent hoạt động, 1 system prompt, 2 tool schemas, 5 câu hỏi kiểm tra, ghi chú lỗi prompt/tool/control flow, và checklist tự đánh giá. <!-- src: ... -->

## Slide 6 — Prompt Engineering Fundamentals
[[Prompt]] tốt không phải là prompt "hay", mà là prompt tạo ra hành vi mong muốn một cách ổn định. <!-- src: ... -->

## Slide 7 — Prompt = Interface Giữa Ý Định và Khả Năng Model
Prompt kém: “Viết email cho tôi” - không rõ nội dung. Prompt tốt: “Viết email xin lỗi khách hàng về việc giao hàng trễ 2 ngày, tone lịch sự, dưới 120 từ.” Nguyên tắc vàng: Rõ ràng hơn là tinh vi. <!-- src: ... -->

## Slide 8 — 4 Thành Phần Của Prompt Tốt
1. [[role]]: Vai trò.
2. [[task]]: Nhiệm vụ.
3. [[context]]: Bối cảnh.
4. [[format]]: Định dạng.
Bắt đầu với [[task]] + [[format]], chỉ thêm [[role]] hoặc [[context]] khi cần thiết. <!-- src: ... -->

## Slide 9 — RTCF Deep Dive: Ví Dụ Thực Tế
Ví dụ tốt và kém cho mỗi thành phần prompt. Mỗi thành phần thêm vào prompt phải có lý do rõ ràng. <!-- src: ... -->

## Slide 10 — Prompt Iteration: Từ Kém → Tốt → Xuất Sắc
Quá trình lặp lại: Viết → test → observe → improve. Không ai viết prompt hoàn hảo lần đầu. <!-- src: ... -->

## Slide 11 — Instruction vs Conversation vs System Prompt
Loai prompt với mục đích và cách sử dụng khác nhau: 
- Instruction prompt: Ra lệnh cho tác vụ. 
- Conversation prompt: Duy trì ngữ cảnh tương tác. 
- System prompt: Định nghĩa quy tắc, ranh giới, và hợp đồng đầu ra. <!-- src: ... -->

## Slide 12 — Negative Prompting & Boundary Setting
Nói rõ thay thế và yêu cầu tích cực thay vì chỉ nói "đừng". Nhấn mạnh tầm quan trọng của positive alternatives. <!-- src: ... -->

## Slide 13 — Token Budget Awareness
Prompt dài hơn không đồng nghĩa với prompt tốt hơn. Hãy tối ưu độ rõ và khả năng kiểm soát. <!-- src: ... -->

## Slide 14 — Temperature & Sampling Parameters
Lưu ý về việc thiết lập tham số nhiệt độ cho các trường hợp sử dụng khác nhau. Không thay thế cho prompt tốt. <!-- src: ... -->

## Slide 15 — Quick Exercise: Viết Prompt Theo RTCF
Viết prompt cho chatbot hỗ trợ sinh viên VinUni. Xác định 4 thành phần: [[role]], [[task]], [[context]], [[format]]. <!-- src: ... -->

## Slide 16 — Advanced Prompting Techniques
Sử dụng kỹ thuật nâng cao khi thật sự cần thiết, không phải như phép màu. <!-- src: ... -->

## Slide 17 — Zero-shot, One-shot, Few-shot, CoT
Khi nào sử dụng các kỹ thuật này hiệu quả nhất. Thứ tự sử dụng thực dụng. <!-- src: ... -->

## Slide 18 — Khi Nào Dùng Few-shot?
Sử dụng few-shot khi mô hình hiểu nhiệm vụ nhưng đầu ra không ổn định hoặc cần giữ nguyên tiêu chuẩn. <!-- src: ... -->

## Slide 19 — Few-shot Prompting — Python Example
Ví dụ về cách sử dụng few-shot prompting trong Python. <!-- src: ... -->

## Slide 20 — Few-shot Anti-patterns
Các vấn đề thường gặp khi sử dụng few-shot prompting. <!-- src: ... -->

## Slide 21 — Chain-of-Thought (CoT) và Tree-of-Thought
Sử dụng CoT khi bài toán cần reasoning nhiều bước. Tree-of-Thought cho các bài toán cần explore nhiều hướng. <!-- src: ... -->

## Slide 22 — Chain-of-Thought — Python Example
Ví dụ về việc áp dụng CoT trong phân tích review khách sạn. <!-- src: ... -->

## Slide 23 — Structured Output Prompting
Tại sao cần kết quả đầu ra có cấu trúc như JSON. Cách tiếp cận hiệu quả. <!-- src: ... -->

## Slide 24 — Khi Nào KHÔNG Cần Kỹ Thuật Nâng Cao
Sử dụng khi task đơn giản, format không ổn định, hoặc không cần reasoning nhiều bước. <!-- src: ... -->

## Slide 25 — System Prompt Engineering
[[System-prompt]] tốt giúp agent nhất quán hơn và dễ kiểm soát hơn. <!-- src: ... -->

## Slide 26 — Anatomy của System Prompt Production-grade
Chi tiết cấu trúc của system prompt, bao gồm persona, quy tắc, khả năng, ranh giới và định dạng đầu ra. <!-- src: ... -->

## Slide 27 — System Prompt — Python Example
Ví dụ về cài đặt system prompt cho agent hỗ trợ. <!-- src: ... -->

## Slide 28 — System Prompt Iteration: v1 → v2
Cải tiến từ system prompt thiếu ranh giới đến một prompt rõ ràng hơn sau khi thử nghiệm. <!-- src: ... -->

## Slide 29 — System Prompt: Anthropic vs OpenAI API
So sánh cách tổ chức system prompt giữa hai nền tảng. <!-- src: ... -->

## Slide 30 — System Prompt Anti-Patterns
Các lỗi thường gặp trong việc thiết kế system prompt và cách khắc phục những vấn đề này. <!-- src: ... -->

## Slide 31 — System Prompt Testing Checklist
Danh sách kiểm tra cho testing system prompt. <!-- src: ... -->

## Slide 32 — Real-world System Prompt Template
Template cho system prompt có thể áp dụng vào thực tế. <!-- src: ... -->

## Slide 33 — Mini Exercise: Critique a System Prompt
Phân tích một system prompt cụ thể và tìm các vấn đề tiềm ẩn. <!-- src: ... -->

## Slide 34 — Context Engineering
Sự quan trọng của việc lựa chọn đúng bối cảnh hơn là nhồi nhét quá nhiều thông tin không cần thiết. <!-- src: ... -->

## Slide 35 — Context Window Management
Quản lý không gian context để tối ưu hóa hiệu quả đầu ra của model. <!-- src: ... -->

## Slide 36 — Lost in the Middle Problem
Vấn đề mất mát thông tin trong bối cảnh dài và cách khắc phục. <!-- src: ... -->

## Slide 37 — Memory Injection và Context Compression
Kỹ thuật tối ưu hóa bối cảnh bằng cách chỉ đưa vào thông tin cần thiết cho nhiệm vụ hiện tại. <!-- src: ... -->

## Slide 38 — Token Budget Allocation: Nên Nghĩ Theo Rổ Nào?
Cách tối ưu hóa phân bổ token cho các thành phần khác nhau. <!-- src: ... -->

## Slide 39 — RAG Context Pattern
Cách thức sử dụng công cụ để truy xuất bối cảnh theo yêu cầu. <!-- src: ... -->

## Slide 40 — Context Engineering Checklist
Danh sách kiểm tra cho việc tối ưu hóa bối cảnh. <!-- src: ... -->

## Slide 41 — Prompt Safety & Evaluation
Đảm bảo prompt không chỉ đúng mà còn phải an toàn và đáng tin cậy. <!-- src: ... -->

## Slide 42 — Direct injection và Indirect injection
Giải thích về các hình thức tiêm nhiễm prompt có thể xảy ra. <!-- src: ... -->

## Slide 43 — Defense Strategies
Các chiến lược phòng ngừa khi xử lý input không tin cậy trong prompt. <!-- src: ... -->

## Slide 44 — Prompt Evaluation Framework
Khung đánh giá các prompt theo các tiêu chí độ chính xác, tính nhất quán, và an toàn. <!-- src: ... -->

## Slide 45 — Guardrails Pattern
Mô hình miếng đệm để đảm bảo độ an toàn trong xử lý input và output. <!-- src: ... -->

## Slide 46 — Tool Calling
Giới thiệu về quá trình gọi tool trong tương tác giữa agent và thế giới thực. <!-- src: ... -->

## Slide 47 — Tool Calling Flow
Luồng công việc khi thực hiện tool call và trả kết quả về model. <!-- src: ... -->

## Slide 48 — Tool Calling: Ai Làm Gì?
Phân chia vai trò và trách nhiệm trong quá trình tool calling. <!-- src: ... -->

## Slide 49 — Tool Schema Anatomy
Chi tiết về cách cấu trúc tool schema để mô hình có thể hiểu đúng cách sử dụng tool. <!-- src: ... -->

## Slide 50 — Tool Schema — Python Example
Ví dụ về cài đặt tool schema trong Python. <!-- src: ... -->

## Slide 51 — Good vs Bad Tool Description
So sánh giữa mô tả tool tốt và xấu. <!-- src: ... -->

## Slide 52 — tool_choice Parameter
Các giá trị có thể cho tham số tool_choice và khi nào nên dùng chúng. <!-- src: ... -->

## Slide 53 — Tool Calling: OpenAI vs Anthropic Format
So sánh định dạng gọi tool giữa OpenAI và Anthropic. <!-- src: ... -->

## Slide 54 — Xử Lý Tool Errors
Cách xử lý các lỗi trong quá trình gọi tool. <!-- src: ... -->

## Slide 55 — Design Principles Cho Tools
Nguyên tắc thiết kế cho các tool để đảm bảo hiệu quả. <!-- src: ... -->

## Slide 56 — 4 Nguyên Tắc Thiết Kế Tool
Chi tiết về bốn nguyên tắc thiết kế tool giúp tối ưu hóa hiệu suất. <!-- src: ... -->

## Slide 57 — Tool Granularity: Quá Nhỏ Hay Quá To Đều Có Giá
Phân tích và tìm hiểu về độ chi tiết của tool trong thiết kế. <!-- src: ... -->

## Slide 58 — Parameter Design Best Practices
Các quy tắc tốt nhất trong thiết kế tham số cho tool. <!-- src: ... -->

## Slide 59 — Tool Return Format Best Practices
Quy tắc tốt nhất cho định dạng trả lại của tool. <!-- src: ... -->

## Slide 60 — Tool Description Engineering
Tầm quan trọng của việc mô tả tool rõ ràng để điều khiển hành vi của model. <!-- src: ... -->

## Slide 61 — Parallel Tool Calling & Patterns
Cách thức gọi tool song song và xử lý kết quả. <!-- src: ... -->

## Slide 62 — Sequential vs Parallel Tool Calls
So sánh giữa gọi tool tuần tự và song song. <!-- src: ... -->

## Slide 63 — 3 Tool Use Patterns Thường Gặp
Điểm qua ba mẫu sử dụng tool phổ biến trong quá trình lập trình agent. <!-- src: ... -->

## Slide 64 — 3 Patterns — Visual Flow
Hình ảnh minh họa cho ba mẫu gọi tool. <!-- src: ... -->

## Slide 65 — Minimal Tool Loop — Python Example
Ví dụ về vòng lặp tool tối thiểu trong Python. <!-- src: ... -->

## Slide 66 — Robust Tool Loop — Error Handling
Cách giải quyết vấn đề trong vòng lặp tool. <!-- src: ... -->

## Slide 67 — Thực Hành
Lab 4: Xây dựng agent đầu tiên với system prompt, hai công cụ và năm trường hợp kiểm tra. <!-- src: ... -->

## Slide 68 — Hands-on 4: Cách Chạy Lab
Hướng dẫn cụ thể để hoàn thành lab. <!-- src: ... -->

## Slide 69 — Lab Skeleton — Python Example
Cấu trúc khung cho lab trong Python. <!-- src: ... -->

## Slide 70 — Lab Walkthrough: Step-by-Step
Hướng dẫn từng bước để thiết lập lab. <!-- src: ... -->

## Slide 71 — 5 Test Questions Gợi Ý
Các câu hỏi kiểm tra đề xuất để thử nghiệm agent. <!-- src: ... -->

## Slide 72 — Lab Self-Review Checklist
Danh sách rà soát tự đánh giá cho lab. <!-- src: ... -->

## Slide 73 — Lab #4
Mục tiêu và deliverable cho Lab 4. <!-- src: ... -->

## Slide 74 — Tổng kết — Key Takeaways
Những điểm chính cần nhớ trước khi chuyển sang bài học tiếp theo. <!-- src: ... -->

## Slide 75 — Tiếp theo & Bài tập
Hướng dẫn cho việc chuẩn bị nội dung cho bài học sau. <!-- src: ... -->

## Slide 76 — Tài Liệu Tham Khảo
Danh sách tài liệu tham khảo hữu ích cho việc nghiên cứu thêm. <!-- src: ... -->

## Slide 77 — Hỏi & Đáp
Thảo luận và giải đáp các thắc mắc. <!-- src: ... -->

## Slide 78 — Cảm ơn!
Thông tin liên hệ và tài liệu tham khảo. <!-- src: ... -->

## Khái niệm chính
- [[prompt-fundamentals]]: Khái niệm cơ bản về cách thiết kế prompt hiệu quả.
- [[advanced-prompting-techniques]]: Các kỹ thuật nâng cao trong việc lập trình prompt.
- [[system-prompt-engineering]]: Kỹ thuật xây dựng hệ thống prompt cho các agent.
- [[context-engineering]]: Cách tối ưu hóa bối cảnh sử dụng trong quá trình tương tác.
- [[prompt-safety-evaluation]]: Đánh giá độ an toàn và tính chính xác của prompt.
- [[tool-calling]]: Quá trình gọi và sử dụng tool thông qua agent.
- [[design-principles-cho-tools]]: Nguyên tắc thiết kế cho các công cụ trong agent.
- [[tool-patterns-error-handling]]: Các mẫu và cách xử lý lỗi liên quan đến tool.
- [[prompt-injection]]: Khái niệm về việc chèn mã độc hại vào prompt để làm sai lệch kết quả.
```
