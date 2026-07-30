---
course: packs
generated: '2026-07-30T10:34:34+00:00'
lang: vi
lesson: day03-tu-chatbot-den-agentic-agent-react-v7
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/slides/day03-tu-chatbot-den-agentic-agent-react-v7.md
source_hash: sha256:81c58a7d11dff9e29e7925e53e426186b6a6d5e5946f22da14c6506df8b4f55a
type: lesson-note
---

```markdown
# day03 tu chatbot den agentic agent react v7

## Slide 1 — TừChatbot Đến Agentic Agent
AICB-P1 · Ngày 3 · Design Pattern ReAct  
Tên Giảng Viên  
VinUniversity · Phase 1 · Tuần 1 · 17/03/2026  

## Slide 2 — Hãy Suy Nghĩ...
“ChatGPT là chatbot hay agent?  
Siri thì sao? Cursor IDE thì sao?”  
Giữ câu hỏi này trong đầu khi học bài hôm nay.

## Slide 3 — Nội Dung Bài Học
1. 3 Kiểu Hệ Thống AI
2. Agentic Fit Framework
3. Kiến Trúc Agent
4. ReAct Pattern
5. ReAct vs Function Calling
6. Agent Loop: Code Anatomy
7. Cost & Security
8. Live Demo & Debug
9. Chatbot vs Agent
10. Lab 3 + Rubric

## Slide 4 — Mục Tiêu Ngày 3
- Phân biệt được [[rule-based bot]], [[LLM chatbot]], và [[agent]].
- Dùng [[Agentic Fit]] để biết khi nào nên nâng từ chatbot lên agent.
- Hiểu và giải thích được vòng lặp [[ReAct]]: Thought → Action → Observation.
- Phân biệt [[ReAct prompting]] với [[native function calling]] và biết khi nào dùng cái nào.
- Build được ReAct agent đầu tiên với tools, system prompt, và safeguard cơ bản.

## Slide 5 — Deliverable Cuối Ngày
- Chatbot baseline + ReAct agent cho cùng một bài toán, kèm trace và flowchart luồng xử lý.
- 5 test cases để so sánh chatbot và agent.
- 1 trace Thought / Action / Observation của agent.
- 1 nhận định rõ: khi nào chatbot đủ, khi nào agent vượt trội.

## Slide 6 — 3 Kiểu Hệ Thống AI
Từ bot có [[rule]] đến agent có khả năng lập kế hoạch và dùng công cụ.

## Slide 7 — Spectrum: Bot → Chatbot → Agent
- [[Rule-based Bot]]: If/else cứng, predictable.
- [[LLM Chatbot]]: Trả lời thông minh nhưng chủ yếu 1 lượt, reactive.
- [[Agent]]: Dùng tools + loop quan sát theo từng bước, autonomous, có thể đặt mục tiêu dài hạn với nhiều quyết định liên tiếp.

## Slide 8 — Quick Check: Phân Loại 6 Sản Phẩm AI Thật
| Sản phẩm | Bot | Chatbot | Reactive Agent | Autonomous |
| -------- | --- | ------- | --------------- | ---------- |
| Tổng đài 1900 bấm phím | □ | ✓ | | |
| ChatGPT (không plugin) | □ | ✓ | | |
| ChatGPT + web + code interpreter | □ | ✓ | | |
| Cursor IDE Tab completion | □ | ✓ | | |
| Cursor IDE Agent mode | □ | ✓ | | |
| Devin (AI software engineer) | □ | ✓ | | |

## Slide 9 — So Sánh 3 Kiểu Hệ Thống AI
| Tiêu chí | Rule-based Bot | LLM Chatbot | Agent |
| -------- | -------------- | ------------ | ----- |
| Cách xử lý | If/else cố định | Sinh câu trả lời tốt theo context | Plan → act → observe → adapt |
| Flexibility | Thấp | Trung bình | Cao |
| Memory | Gần như không có | Ngắn hạn trong context | Ngắn hạn + có thể thêm long-term memory |
| Tool use | Hard-coded | Có thể gọi tool theo chỉ định | Chủ động chọn tool theo bước tiếp theo |
| Cost | Thấp nhất | Trung bình | Cao hơn do loop và nhiều calls |
| Risk | Logic dễ kiểm soát | Hallucination / format drift | Hallucination + tool misuse + loop |
| Ví dụ phù hợp | Menu IVR, form validation | FAQ, support cơ bản | Booking, research, coding assistant |

## Slide 10 — Ví Dụ Nhanh: Cùng Một Câu Hỏi, 3 Mức Độ Hệ Thống
Bài toán: “Tìm vé HAN → HCM dưới 2 triệu, rồi gợi ý mang gì nếu trời mưa.”
- Bot có rule: Trả menu lựa chọn cố định, không search được dữ liệu mới.
- LLM chatbot: Viết câu trả lời mượt nhưng không tự truy vấn giá vé thật.
- Reactive agent: Tách goal thành 2 việc: tìm vé + check thời tiết.

## Slide 11 — Cùng Một Query: Output Chatbot vs Agent
- **Chatbot response**: “Bạn có thể tìm vé trên Traveloka hoặc VietJet. Giá vé thường khoảng 1.2–2.5 triệu.”
    - Không có nguồn, không verifiable.
- **Agent response**: “Tìm được 2 chuyến: VietJet 06:10 giá 1.75M, VNA 08:20 giá 1.95M.”

## Slide 12 — Agentic Fit Framework
4 tiêu chí để biết bài toán có thật sự cần agent hay không.

## Slide 13 — 4 Tiêu Chí Agentic Fit
1. [[Multi-step Reasoning]]: Bài toán có cần chia thành nhiều bước phụ thuộc nhau không?
2. [[Tool Interaction]]: Hệ thống có cần gọi search, API, database...?
3. [[Dynamic Decision]]: Mỗi bước tiếp theo có phụ thuộc vào kết quả vừa quan sát không?
4. [[Long Horizon]]: Hệ thống có phải giữ mục tiêu xuyên suốt qua nhiều vòng lặp không?

## Slide 14 — Scoring Matrix: Có Cần Agent Không?
- Tóm tắt cho các use case với điểm từ 0 đến 15, chỉ rõ khi nào cần dùng agent.

## Slide 15 — Bài Tập Nhanh: Chấm Agentic Fit Cho Use Case Của Nhóm
Mỗi nhóm điền bảng cho use case đã chọn từ Ngày 2.

## Slide 16 — Anti-Patterns: Khi Dùng Agent Là Sai Bài
Những bài toán không phù hợp để dùng agent và nguyên tắc chung cần tuân thủ.

## Slide 17 — 3 Lầm Tưởng Phổ Biến Về Agent
1. “Dùng LLM = đã là agent”.
2. “Agent thông minh hơn = luôn tốt hơn”.
3. “Thêm nhiều tool = agent mạnh hơn”.

## Slide 18 — Case Study: Chatbot Đủ Hay Cần Agent?
Phân tích ví dụ cụ thể cho [[Customer FAQ]] và [[Booking Assistant]].

## Slide 19 — Từ Anthropic: Agent Patterns Nên Tăng Dần Theo Nhu Cầu
Cách tiếp cận từ đơn giản đến phức tạp trong việc xây dựng agent.

## Slide 20 — Cùng Bài Toán, 5 Mức Kiến Trúc — Bạn Chọn Mức Nào?
So sánh các kiểu kiến trúc từ đơn giản đến phức tạp.

## Slide 21 — Kiến Trúc Agent
Perception, reasoning, action, memory và luồng thông tin giữa các khối.

## Slide 22 — Kiến Trúc Agent: Từ Trong Ra Ngoài
Mô tả các khối kiến trúc chính và vai trò của chúng trong hoạt động của agent.

## Slide 23 — Memory: Short-term vs Long-term
Phân biệt giữa [[short-term memory]] và [[long-term memory]].

## Slide 24 — Tool Calling = Tay Chân Của Agent
Giải thích vai trò quan trọng của tool calling trong hoạt động của agent.

## Slide 25 — Anatomy Của Một Tool Definition Tốt
5 thành phần bắt buộc trong mỗi tool definition.

## Slide 26 — Tool Description: Tệ vs Tốt
So sánh độ rõ ràng của tool description và ảnh hưởng của nó đến hoạt động của agent.

## Slide 27 — ReAct Pattern
Giới thiệu về khái niệm [[ReAct]] và cách mà nó hoạt động trong agent.

## Slide 28 — Định Nghĩa
Giải thích ReAct là pattern kết hợp suy luận từng bước với gọi công cụ và quan sát kết quả.

## Slide 29 — Lịch Sử Ngắn: Từ Chain-of-Thought Đến Agent
Tóm tắt quá trình phát triển từ Chain-of-Thought đến ReAct và hybrid model hiện tại.

## Slide 30 — ReAct Loop: Message History Thực Tế
Mô tả chi tiết về cách hoạt động của ReAct loop qua một ví dụ thực tế.

## Slide 31 — ReAct Loop: Thought → Action → Observation
Mô tả quy trình của ReAct và những điểm mạnh mà nó mang lại.

## Slide 32 — Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (1/2)
Mô tả quá trình thực hiện một truy vấn tìm chuyến bay.

## Slide 33 — Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (2/2)
Hoàn thành ví dụ tìm chuyến bay và tóm tắt kết quả.

## Slide 34 — Trace Ví Dụ2: Smart E-commerce Assistant
Mô tả cách một assistant mua sắm hoạt động với các bước cụ thể.

## Slide 35 — Parallel vs Chained Tools — Tại Sao Thứ Tự Quan Trọng
Lý do mà thứ tự trong gọi tool ảnh hưởng đến kết quả.

## Slide 36 — Trace Ví Dụ: Khi Tool Fail — Graceful Degradation
Mô tả quy trình xử lý khi một tool gặp sự cố.

## Slide 37 — Bài Tập: Tìm 3 Bug Trong Trace Này
Yêu cầu học viên tìm lỗi trong một trace được cung cấp.

## Slide 38 — Đáp Án: 3 Bug Trong Trace
Trình bày các lỗi mà học viên cần xác định trong trace.

## Slide 39 — ReAct Tốt Ở Điểm Nào?
Ưu điểm và nhược điểm của ReAct.

## Slide 40 — ReAct vs Function Calling
So sánh giữa ReAct truyền thống và native function calling.

## Slide 41 — ReAct Truyền Thống vs Native Function Calling
Trình bày chi tiết về sự khác biệt giữa hai phương pháp này.

## Slide 42 — Khi Nào Dùng Pattern Nào?
Hướng dẫn sử dụng các pattern khác nhau tùy theo độ phức tạp của tác vụ.

## Slide 43 — Code So Sánh: ReAct Text vs Function Calling JSON
So sánh mã giữa hai cách tiếp cận khác nhau.

## Slide 44 — Agent Loop: Code Anatomy
Mô tả cấu trúc code tối thiểu cho vòng lặp của agent.

## Slide 45 — Pseudocode: Agent Loop Tối Thiểu
Cung cấp ví dụ mã pseudocode cho vòng lặp của agent.

## Slide 46 — System Prompt Cho ReAct Agent
Đưa ra hướng dẫn cho việc viết system prompt cho agent.

## Slide 47 — Tool Registry: Khai Báo “Tay Chân” Cho Agent
Cung cấp thông tin cần thiết cho việc khai báo công cụ.

## Slide 48 — System Prompt: 5 Thành Phần Production-Grade
Liệt kê các thành phần cần thiết trong system prompt cho môi trường production.

## Slide 49 — System Prompt V2: Production-Grade
Phiên bản hoàn thiện hơn của system prompt cho môi trường production.

## Slide 50 — Agent Loop V2: Thêm Error Handling
Mô tả cách quản lý lỗi trong vòng lặp agent.

## Slide 51 — Max Iterations Safeguard: Tránh Agent Đi Vòng
Các biện pháp cần thiết để đảm bảo agent không bị kẹt.

## Slide 52 — Từ ReAct Đến LangGraph
Giới thiệu về khả năng mở rộng và quản lý phức tạp hơn với LangGraph.

## Slide 53 — Cost & Security
Xem xét các yếu tố chi phí và bảo mật cho agent.

## Slide 54 — Cost Napkin Math: Chatbot vs Agent
So sánh chi phí xử lý giữa chatbot và agent trong một truy vấn.

## Slide 55 — Cost Ở Scale: 1K → 1M Queries/Ngày
Tóm tắt ảnh hưởng của quy mô đến chi phí.

## Slide 56 — Agent Security: Prompt Injection Qua Tool Output
Giải thích về tấn công có thể xảy ra thông qua output của tool.

## Slide 57 — 3 Lớp Defense Cho Agent Production
Mô tả ba lớp bảo vệ cho agent trong môi trường sản xuất.

## Slide 58 — Live Demo & Debug
Thực hiện demo trực tiếp để xây dựng agent và xử lý lỗi.

## Slide 59 — Kịch Bản Live Demo
Mô tả chi tiết về hoạt động trong demo.

## Slide 60 — Code Demo: 2 Tool Tối Thiểu
Cung cấp mã cho hai công cụ đơn giản.

## Slide 61 — Debug Checklist Khi Agent Lỗi
Danh sách kiểm tra để debug agent khi gặp lỗi.

## Slide 62 — Evaluation Agent: Không Chỉ Chấm Final Answer
Cách đánh giá agent không chỉ dựa vào kết quả cuối cùng.

## Slide 63 — Chatbot vs Agent
Xem xét khi nào từng loại hệ thống phát huy được điểm mạnh.

## Slide 64 — Khi Nào Chatbot Thắng, Khi Nào Agent Thắng?
So sánh các tình huống mà chatbot hoặc agent đều nổi bật hơn.

## Slide 65 — Hybrid Pattern: Thực Dụng Hơn Cực Đoan
Trình bày lý thuyết về việc áp dụng cả hai phương pháp theo nhu cầu.

## Slide 66 — Trả Lời Câu Hỏi Đầu Buổi: ChatGPT, Siri, Cursor?
Phân tích vai trò của các sản phẩm khác nhau trong tình huống cụ thể.

## Slide 67 — Thực Hành
Lab 3: Chatbot vs Agent — Hands-on Comparison

## Slide 68 — Cách Chạy Lab 3
Mô tả quy trình thực hiện lab.

## Slide 69 — Thiết Kế 5 Test Cases Có Mục Đích
Yêu cầu thiết kế các test cases có mục đích cụ thể.

## Slide 70 — Lab #3
Mục tiêu là so sánh giữa chatbot và agent.

## Slide 71 — Rubric Chấm Lab 3 (100 điểm)
Chi tiết về cách chấm điểm cho các tiêu chí khác nhau.

## Slide 72 — Lab Timeline: 150 Phút Chia Nhỏ
Hướng dẫn từng bước trong thời gian thực hiện lab.

## Slide 73 — Scaffold Code: Cấu Trúc File Nộp Bài
Hướng dẫn cách cấu trúc file nộp bài.

## Slide 74 — Tổng Kết — Key Takeaways
Tóm tắt những điểm chính từ bài học.

## Slide 75 — Tiếp theo & Bài tập
Giới thiệu về bài tập tiếp theo và đề nghị nhà học viên thực hiện.

## Slide 76 — Tài Liệu Tham Khảo
Liệt kê tài liệu tham khảo đã sử dụng trong bài giảng.

## Slide 77 — Hỏi & Đáp
Thảo luận về các use case cần chatbot và agent.

## Slide 78 — Cảm ơn!
Email: lecturer@vinuni.edu.vn  
Slides & tài liệu: github.com/aicb-vinuni  
Lab template: bit.ly/aicb-day03-lab  

## Khái niệm chính
- [[Agent]]: Hệ thống có khả năng quyết định, hành động và quan sát kết quả.
- [[LLM chatbot]]: Chatbot sử dụng mô hình ngôn ngữ lớn để phản hồi thông minh.
- [[Rule-based bot]]: Bot hoạt động dựa trên các quy tắc cố định và không có khả năng học.
- [[ReAct]]: Pattern kết hợp suy luận từng bước với gọi công cụ và quan sát kết quả.
- [[Agentic Fit]]: Cách đánh giá xem bài toán có cần dùng agent hay không dựa trên tiêu chí cụ thể.
- [[Multi-step Reasoning]]: Khả năng phân chia bài toán thành nhiều bước phụ thuộc.
- [[Dynamic Decision]]: Các quyết định phải được đưa ra dựa trên kết quả của các bước trước.
- [[Tool Interaction]]: Khả năng gọi các công cụ như API hoặc cơ sở dữ liệu trong quá trình hoạt động.
- [[Short-term memory]]: Bộ nhớ dùng cho nhiệm vụ hiện tại, không lưu trữ lâu dài.
- [[Long-term memory]]: Bộ nhớ lưu trữ thông tin lâu dài, có thể là cơ sở dữ liệu hoặc các cấu trúc lưu trữ khác.
```
