---
course: packs
generated: '2026-07-30T10:27:19+00:00'
lang: vi
lesson: 1-day04-prompt-engineering-tool-calling-v2
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/slides/1-day04-prompt-engineering-tool-calling-v2.md
source_hash: sha256:cc02884f84329731941b7940b923384d2ba2ff7ce088a95850deca1fb9b30d75
type: lesson-note
---

```markdown
## Slide 1 — Prompt Engineering & Tool Calling
Làm sao nói để AI hiểu đúng ý? Đây là bài giảng về [[Prompt Engineering]] và [[Tool Calling]] trong khuôn khổ AICB-P1 tại VinUniversity.

## Slide 2 — Hãy Suy Nghĩ...
“Hai người hỏi AI cùng một việc, một người nhận kết quả xuất sắc, người kia nhận rác. Tại sao?” Giữ câu hỏi này trong đầu khi học bài hôm nay.

## Slide 3 — Nội Dung Bài Học
1. [[Prompt fundamentals]]
2. [[Advanced prompting techniques]]
3. [[System prompt engineering]]
4. [[Function/Tool calling]]
5. [[Langgraph]]

## Slide 4 — Mục Tiêu Ngày 4
- Viết được prompt rõ ràng theo các thành phần [[Role]] / [[Task]] / [[Context]] / [[Format]].
- Hiểu khi nào nên dùng [[zero-shot]], [[few-shot]], [[CoT]], và khi nào không cần.
- Viết được [[system prompt]] production-grade cho agent.
- Khai báo được [[tool schema]] và hiểu vòng lặp [[tool calling]] từ model đến tool rồi quay lại model.
Mục tiêu là hiểu cơ chế: prompt là interface giữa [[human intent]] và [[model behavior]]; tool calling là interface giữa model và thế giới bên ngoài.

## Slide 5 — Deliverable Cuối Ngày
1. 1 agent script chạy được + 1 system prompt + 2 tool schemas + 5 test questions + ghi chú lỗi prompt/tool/control flow.
2. 2 tools tự viết: 1 API wrapper đơn giản, 1 data query đơn giản.
3. 1 system prompt có rules, constraints, output contract.
4. 5 câu test để chứng minh agent biết khi nào trả lời trực tiếp, khi nào gọi tool.

## Slide 6 — Prompt Engineering Fundamentals
Prompt tốt không phải prompt “hay”, mà là prompt tạo ra hành vi mong muốn ổn định.

## Slide 7 — Prompt = Interface Giữa Ý Định và Khả Năng Model
Prompt kém: “Viết email cho tôi” không rõ gửi ai, về gì, tone nào, dài bao nhiêu. Kết quả: chung chung, khó dùng ngay.
Prompt tốt: “Viết email xin lỗi khách hàng về giao hàng trễ 2 ngày, tone lịch sự, dưới 120 từ, có CTA rõ ràng.” Rõ task, context, constraint, format. Kết quả: actionable hơn hẳn. Nguyên tắc vàng: Specificity beats cleverness.

## Slide 8 — 4 Thành Phần Của Prompt Tốt
- [[ROLE]]: Vai trò
- [[TASK]]: Nhiệm vụ
- [[CONTEXT]]: Bối cảnh
- [[FORMAT]]: Định dạng

Bắt đầu với Task + Format. Chỉ thêm Role hoặc Context khi thực sự cải thiện chất lượng hoặc tính nhất quán.

## Slide 9 — Instruction vs Conversation vs System Prompt
- [[Instruction prompt]]: Ra lệnh trực tiếp cho một tác vụ.
- [[Conversation prompt]]: Giữ ngữ cảnh nhiều lượt với user.
- [[System prompt]]: Đặt policy, boundary, output contract.

## Slide 10 — Token Budget Awareness
Prompt dài hơn không đồng nghĩa prompt tốt hơn. Mỗi token thừa làm tăng chi phí, latency, và đôi khi cả nhiễu. Hãy ưu tiên: instruction rõ, examples đúng chỗ, output contract rõ.

## Slide 11 — Advanced Prompting & Context Structuring
Dùng kỹ thuật nâng cao khi chúng cải thiện chất lượng thực sự, không dùng như thần chú.

## Slide 12 — Types of Prompt
Phân loại các kỹ thuật prompting từ cơ bản đến nâng cao.

## Slide 13 — Zero-shot, One-shot, Few-shot, CoT
- [[Zero-shot]]: Không có ví dụ mẫu.
- [[One-shot]]: 1 ví dụ mẫu.
- [[Few-shot]]: 2–5 ví dụ.
- [[CoT]]: Cho model reasoning từng bước.

Thứ tự thử thực dụng: zero-shot -> few-shot -> decomposition / CoT.

## Slide 14 — Khi Nào Dùng Few-shot?
Khi model hiểu task nhưng ra sai format hoặc không ổn định giữa các input tương tự. Cần giữ tiêu chuẩn đánh giá, tone, hoặc cách lập luận nhất quán.

## Slide 15 — Few-shot Prompting — Python Example
```python
examples = """
Input: "Great product, fast delivery!"
Output: Positive
Input: "Terrible quality, waste of money"
Output: Negative
"""
prompt = f"""Classify feedback as Positive, Negative, or Neutral.
{examples}
Input: "Love the design but shipping was slow"
Output:"""
print(prompt)
```

## Slide 16 — Chain-of-Thought (CoT) và Tree-of-Thought
CoT phù hợp khi bài toán cần reasoning nhiều bước. Tree-of-Thought hữu ích cho bài toán cần explore nhiều hướng.

## Slide 17 — The Shift: Prompts as Code
Tư duy lập trình trong việc thiết kế và quản lý cấu trúc prompt.

## Slide 18 — Tại Sao Prompt Cơ Bản Thất Bại Trong Agent Loop?
Tính mỏng manh: Đổi 1 từ, model đổi toàn bộ format output. Ảo giác định dạng: Trả về Markdown thay vì JSON. 

## Slide 19 — Hướng Tới "Prompt Determinism"
Khả năng LLM trả về đúng một định dạng cấu trúc dù input của user có "méo mó" thế nào.

## Slide 20 — System Prompt — Python Example
```python
system_prompt = """
You are a support triage agent for an e-commerce team.
Rules:
- Answer in Vietnamese.
- Be concise and operational.
- If billing or refund policy is unclear, ask for more details.
Constraints:
- Never invent order status.
- Never promise refunds without tool confirmation.
Output format:
Return JSON with: intent, action, reply
"""
```

## Slide 21 — Anatomy của System Prompt Production-grade
- Persona: role, expertise level, communication style.
- Rules: việc nên làm, việc luôn phải làm.
- Capabilities: model được phép dùng tools nào.
- Constraints: không làm gì, khi nào từ chối.

## Slide 22 — Programming the Latent Space
LLM là một cỗ máy pattern-matching khổng lồ.

## Slide 23 — System Prompt Anti-Patterns
- Quá dài: nhồi mọi thứ vào 1 prompt 2000+ tokens.
- Mâu thuẫn: yêu cầu "ngắn gọn", vừa bảo "giải thích chi tiết từng bước".

## Slide 24 — Structural Prompting with XML / Delimiters
Sử dụng thẻ XML và các dấu phân tách để tối ưu cấu trúc prompt.

## Slide 25 — Cấu Trúc Hóa Bằng Thẻ XML (XML Tags)
Bản chất của model là được train trên dữ liệu HTML/XML.

## Slide 26 — Bộ Thẻ XML Căn Bản Cho System Prompt
- `<system_role>`: Định nghĩa persona.
- `<instructions>`: Các quy tắc cốt lõi.
- `<examples>`: Few-shot data.
- `<context>` / `<documents>`: Dữ liệu grounding RAG.
- `<user_input>`: Dữ liệu thô từ người dùng.

## Slide 27 — Context Bleed - Kẻ Thù Số 1 Của RAG & Agents
Context Bleed là khi LLM nhầm lẫn giữa Lệnh (Instructions) và Dữ liệu (Payload).

## Slide 28 — Cô Lập Dữ Liệu Bằng Delimiters
Bao bọc Input bên ngoài và chỉ thị mô hình xử lý rõ ràng.

## Slide 29 — So Sánh: Messy Prompt vs. XML-Structured Prompt
Messy Prompt không có ranh giới rõ ràng. XML-Structured Prompt làm rõ task và input.

## Slide 30 — Nested XML (Cấu trúc lồng nhau)
Cấu trúc XML lồng nhau tối ưu hóa khả năng truy xuất thông tin.

## Slide 31 — Advanced Few-Shot & Formatting
Kỹ thuật nâng cao trong việc tối ưu hóa ví dụ mẫu và định dạng đầu ra.

## Slide 32 — Sức Mạnh Thực Sự Của Few-Shot
Few-shot prompting là kỹ thuật quan trọng để kiểm soát sự nhất quán của các mô hình ngôn ngữ lớn.

## Slide 33 — Chọn Ví Dụ Sao Cho Khôn Ngoan?
Cần tập trung vào "Edge-cases" hơn là "Happy path".

## Slide 34 — Negative Prompting: Dạy Model Việc KHÔNG Nên Làm
Hạn chế của lệnh phủ định. Cách tốt nhất là tạo ví dụ thực tế về những gì không nên làm.

## Slide 35 — Cấu Trúc Hóa Suy Nghĩ Của Model
Model "nghĩ" bằng cách in ra token. Phân tích trước khi kết luận.

## Slide 36 — Few-shot Để Giữ Định Dạng JSON
Cung cấp JSON Schema cụ thể trong ví dụ mẫu.

## Slide 37 — Rủi Ro & Đánh Đổi Khi Dùng Few-shot
Order Bias và Token Budget là những điều cần chú ý khi sử dụng few-shot.

## Slide 38 — Handling Long Context: "Lost in the Middle"
Hiện tượng "Lost In The Middle" không thể nhớ hết thông tin.

## Slide 39 — Tận Dụng Recency Bias (Thiên Kiến Gần Nhất)
Đặt câu hỏi/lệnh chính ở vị trí gần cuối để tăng tính chính xác của câu trả lời.

## Slide 40 — Tối Ưu Bằng Cách Cắt Tỉa Context
Giữ lại dữ liệu relevant và áp dụng cơ chế tóm tắt.

## Slide 41 — Hoạt Động 1: Chỉnh sửa Prompt (10 Phút)
Nhiệm vụ tìm ra ít nhất 3 điểm yếu trong đoạn prompt thô.

## Slide 42 — System Prompt Engineering
System prompt tốt làm agent nhất quán và dễ kiểm soát.

## Slide 43 — User vs. System vs. Assistant Roles
Phân biệt vai trò để định hướng mô hình ngôn ngữ hoạt động chính xác.

## Slide 44 — Chat Completions API vs Completions API
Sự khác biệt giữa cách hoạt động của các API hiện đại và legacy.

## Slide 45 — Phân Tách Quyền Lực: System, User, Assistant
Tách biệt rõ ràng giữa các vai trò giúp Model hiểu chỉ dẫn và dữ liệu.

## Slide 46 — System Message Nặng Ký Đến Mức Nào?
Model ưu tiên System hơn User trong các xung đột mệnh lệnh.

## Slide 47 — Đặt Cái Gì Vào Đâu?
[[System prompt]] nên chứa bối cảnh tĩnh, trong khi [[User prompt]] chứa dữ liệu biến đổi.

## Slide 48 — Quản Lý Lịch Sử Bằng Trạng Thái (State)
LLM là Stateless và cần quản lý “trí nhớ” này qua State.

## Slide 49 — Memory Injection và Context Compression
Nên chỉ truyền vào facts thật sự cần cho task hiện tại.

## Slide 50 — Anatomy of a Production System Prompt
System prompt không phải đoạn văn miêu tả chung chung, mà là hợp đồng giữa bạn và Model.

## Slide 51 — Persona - Định Hình Danh Tính
Định nghĩa persona cho agent để duy trì giọng điệu nhất quán.

## Slide 52 — Core Directives - Mệnh Lệnh Bất Di Bất Dịch
Đưa ra các chỉ dẫn không thể thương lượng nhằm duy trì sự nhất quán cao.

## Slide 53 — Capabilities - Agent Của Tôi Có Thể Làm Gì?
Cung cấp thông tin về công cụ mà agent có thể sử dụng.

## Slide 54 — Output Contract - Ràng Buộc Kết Quả
Quy định định dạng kết quả cuối cùng và quy trình suy nghĩ liên quan.

## Slide 55 — Những "Sai Lầm" Khi Viết System Prompt
Sai lầm mâu thuẫn và thông điệp thừa thãi cần tránh khi thiết kế prompt.

## Slide 56 — Edge Cases & Refusals
Thiết kế hệ thống đủ bền bỉ để xử lý các ngoại lệ.

## Slide 57 — Rút Lui Trong Danh Dự
Quy định rõ Agent không được tự bịa dữ liệu.

## Slide 58 — Quyền Được Nói "Tôi Không Biết"
Thiết lập rào cản để ngăn chặn hành vi suy luận vô căn cứ.

## Slide 59 — Đối Phó Với Out-of-Scope Queries
Định nghĩa rõ cái gì nằm ngoài ranh giới của agent.

## Slide 60 — Bàn Giao Cho Con Người (Escalation)
Cần một cơ chế để can thiệp khi gặp tình huống phức tạp.

## Slide 61 — Ranh Giới Của System Prompt
Cảnh báo rằng System Prompt không phải là bức tường bảo mật.

## Slide 62 — Dynamic System Prompts
Cần một lớp "Context Injection" để bơm dữ liệu thời gian.

## Slide 63 — Dynamic System Prompts (Bơm Biến Trực Tiếp)
Biến System Prompt thành một Template với các placeholder.

## Slide 64 — Nhúng Trạng Thái Hệ Thống Vào Prompt
Cập nhật system prompt dựa trên trạng thái và thông tin người dùng.

## Slide 65 — Triển Khai Dynamic Prompt Bằng Code
Sử dụng thư viện template Jinja2 cho các hệ thống phức tạp.

## Slide 66 — Hoạt Động 2: Bẻ Khóa "CFO Agent" (10 Phút)
Tìm lỗi và lỗ hổng trong System Prompt cho một Agent duyệt chi ngân sách.

## Slide 67 — Function/Tool Calling
Tool calling là cách agent tương tác với thế giới thực.

## Slide 68 — The Tool Calling API Cycle
Hiểu vòng tay handshake giữa LLM và ứng dụng của bạn.

## Slide 69 — Bước Ngoặt Tool Calling
Trang bị APIs và Database để model tương tác thực tế.

## Slide 70 — Kiến Trúc Vòng Lặp Tool Calling
Cấu trúc vòng lặp 4 bước bắt buộc giữa LLM và tool.

## Slide 71 — Model Suy Nghĩ Và Yêu Cầu Tool
Model nhận diện và yêu cầu tool cần thiết.

## Slide 72 — Trách Nhiệm Của Hệ Thống Của Bạn
Nhận diện yêu cầu tool_calls và thực thi để phân tích cú pháp.

## Slide 73 — Đóng Vòng Lặp (Closing the Loop)
Cập nhật lịch sử hội thoại và gửi dữ liệu thực về cho model.

## Slide 74 — Designing the Perfect JSON Schema
Khai báo cấu trúc tool giúp LLM hiểu rõ chức năng.

## Slide 75 — JSON Schema Của Tool Là Gì?
Nhằm đảm bảo model gọi đúng hàm.

## Slide 76 — Tên Hàm - Yếu Tố Quyết Định Phân Loại
Tên hàm phải rõ ràng và ngữ nghĩa.

## Slide 77 — Description Của Tool CHÍNH LÀ Prompt
Viết mô tả cho AI thay vì cho lập trình viên.

## Slide 78 — Thiết Kế Parameters Cấu Trúc
Định nghĩa thuộc tính rõ ràng nhằm giảm thiểu lỗi.

## Slide 79 — Enums - Khóa Chặt Sự Lựa Chọn
Giúp loại bỏ rủi ro ảo giác và đảm bảo đầu ra đúng.

## Slide 80 — Bắt Buộc Hay Tùy Chọn? (Required Fields)
Quy định các tham số quan trọng cần có.

## Slide 81 — Anti-Pattern: Nhồi Nhét Quá Nhiều Tham Số
Giới hạn độ phức tạp của tool.

## Slide 82 — Mổ Xẻ Một Tool Schema Đạt Chuẩn
Cấu trúc hoàn chỉnh của tool schema mẫu.

## Slide 83 — Tool Execution Strategies
Chiến lược điều phối tool trong workflows của agent.

## Slide 84 — Nghệ Thuật Phối Hợp Các Công Cụ
Quyết định chiến lược phụ thuộc vào sự phụ thuộc dữ liệu.

## Slide 85 — Gọi Tuần Tự (Sequential/Chained Calls)
Thực hiện tuần tự có thể làm tăng độ trễ.

## Slide 86 — Tối Ưu Tốc Độ Bằng Parallel Calling
Gọi nhiều tools đồng thời để tối ưu hóa thời gian phản hồi.

## Slide 87 — Thực Thi Parallel Bằng Python
Sử dụng asyncio hoặc multithreading để cải thiện hiệu suất.

## Slide 88 — Cảnh Báo: Mặt Trái Của Parallel Calling
Rủi ro như Rate Limits và Race Conditions cần quản lý.

## Slide 89 — Handling Tool Failures & Retries
Xây dựng tính linh hoạt với cơ chế kiểm soát lỗi và retry.

## Slide 90 — Thực Tế Nghiệt Ngã: Tool Rất Hay Lỗi
Đảm bảo bảo vệ luồng suy nghĩ của Agent khi xảy ra lỗi.

## Slide 91 — Khi LLM "Tự Bịa" Tham Số Mới
Sử dụng validation chặt chẽ để tránh lỗi cú pháp hoặc tham số ảo giác.

## Slide 92 — Phép Màu Của Tự Sửa Lỗi (Self-Correction)
Gửi thông tin lỗi cho LLM để nó có cơ hội tự điều chỉnh.

## Slide 93 — Orchestration with LangGraph
Xây dựng luồng điều khiển phức tạp cho Agent.

## Slide 94 — Why LangGraph?
Đi vào kiến trúc máy trạng thái để quản lý tình huống phức tạp.

## Slide 95 — Từ "Đồ Chơi" Đến Hệ Thống Thực Tế
Yêu cầu kiểm soát luồng, ghi nhớ bền vững và sự can thiệp của con người.

## Slide 96 — LangGraph: Tương Lai Của Agentic AI
Framework chuyên dụng cho các hệ thống Multi-Agent.

## Slide 97 — Sự Phân Nhánh: Chain vs. Graph
LangGraph hỗ trợ vòng lặp cho Agent.

## Slide 98 — Lợi Ích Cốt Lõi Khi Học LangGraph
Giúp giảm thiểu sự mơ hồ và tăng tính chính xác trong luồng Agent.

## Slide 99 — Core Concepts of LangGraph
Hiểu các thành phần chính để xây dựng kiến trúc agent phức tạp.

## Slide 100 — Giải Phẫu LangGraph (State, Nodes, Edges)
Cấu trúc cơ bản của LangGraph giúp lưu trữ và di chuyển dữ liệu.

## Slide 101 — Khái Niệm 1: State
Định nghĩa và khai báo cấu trúc dữ liệu chung cho agent.

## Slide 102 — Cập Nhật Trạng Thái Thay Vì Ghi Đè
Giữ lại toàn bộ lịch sử để Agent có ngữ cảnh đầy đủ.

## Slide 103 — Khái Niệm 2: Nodes
Xử lý và trả về phần State mới cho agent.

## Slide 104 — Khái Niệm 3: Edges
Điều hướng giữa các Nodes dựa vào logic rẽ nhánh.

## Slide 105 — Logic Rẽ Nhánh Thông Minh (Router)
Logic định tuyến tự động quyết định bước tiếp theo.

## Slide 106 — Xây Dựng Khung Xương (Builder)
Khởi tạo cấu trúc và thêm các nút xử lý.

## Slide 107 — Khai Báo Dòng Chảy START / END
Điểm đánh dấu bắt đầu và kết thúc của một đồ thị.

## Slide 108 — Đóng Gói Và Biên Dịch (Compile)
Chuyển đổi từ cấu trúc Builder sang đối tượng đồ thị có thể thực thi.

## Slide 109 — Chạy Thử Khối Động Cơ Này Thế Nào?
Thay thế lời gọi API thông thường bằng cơ chế stream.

## Slide 110 — Hands-on: Cách Chạy Lab
1. Viết 1 system prompt với rules, constraints.
2. Tạo 2 custom tools.
3. Nối tools vào agent loop.
4. Chạy 5 câu test.

## Slide 111 — Lab #4
Mục tiêu: Build ReAct agent với 2 custom tools, viết system prompt chuẩn, và test end-to-end.

## Slide 112 — Tổng kết — Key Takeaways
1. Prompt = interface giữa [[human intent]] và [[model capability]].
2. System prompt tốt = agent nhất quán hơn.
3. [[Tool schema description]] quyết định mạnh mẽ việc model biết gọi tool nào.
4. [[Parallel tool calls]] nhanh hơn khi các tool độc lập.

## Slide 113 — Tiếp theo & Bài tập
Hoàn thiện Lab 4 với 5 test questions rõ pass/fail và chỉ ra các điểm còn mơ hồ trong system prompt.

## Slide 114 — Tài Liệu Tham Khảo
Danh sách tài liệu liên quan đến [[Prompt Engineering]], [[Tool Calling]], và [[LangGraph]].

## Slide 115 — Hỏi & Đáp
Bạn đang gặp lỗi vì model chưa hiểu ý bạn, hay vì tool contract của bạn chưa đủ rõ?

## Slide 116 — Cảm ơn!
Email: lecturer@vinuni.edu.vn
Slides & tài liệu: github.com/aicb-vinuni
Lab template: bit.ly/aicb-day04-lab

## Khái niệm chính
- [[Prompt Engineering]]: Kỹ thuật thiết kế prompts để tương tác hiệu quả với các mô hình ngôn ngữ.
- [[Tool Calling]]: Cách tương tác với thế giới bên ngoài thông qua các hàm và APIs.
- [[Zero-shot]]: Phương pháp quyết định không dùng ví dụ mẫu.
- [[Few-shot]]: Phương pháp dùng 2–5 ví dụ mẫu để cải thiện hiệu suất model.
- [[CoT]]: [[Chain-of-Thought]], một kỹ thuật giúp model suy luận từng bước.
- [[System prompt]]: Cấu trúc hướng dẫn hành vi của một agent.
- [[Tool schema]]: Định nghĩa cấu trúc và chức năng của tool mà agent có thể gọi.
- [[Role]]: Vai trò của agent trong quá trình tương tác.
- [[Task]]: Nhiệm vụ mà agent cần thực hiện trong tương tác.
- [[Context]]: Bối cảnh liên quan đến nhiệm vụ của agent.
- [[Format]]: Định dạng đầu ra mà agent sẽ cung cấp.
```
