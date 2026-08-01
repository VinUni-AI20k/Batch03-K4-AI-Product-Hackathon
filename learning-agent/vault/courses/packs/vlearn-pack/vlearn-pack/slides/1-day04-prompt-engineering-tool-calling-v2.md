---
course: packs
generated: '2026-07-31T18:11:16+00:00'
lang: vi
lesson: 1-day04-prompt-engineering-tool-calling-v2
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\slides\1-day04-prompt-engineering-tool-calling-v2.md
source_hash: sha256:0308ce9acc809aef85fad8af3a507658a78535253d7edbcef89abed8e8f667d8
type: lesson-note
---

```markdown
## Slide 1 — Prompt Engineering & Tool Calling
### AICB-P1 · Ngày 4 · Làm sao nói để AI hiểu đúng ý?
VinUniversity · Phase 1 · Tuần 2 · 2026

## Slide 2 — Hãy Suy Nghĩ...
Hãy giữ câu hỏi trong đầu: “Hai người hỏi AI cùng một việc, một người nhận kết quả xuất sắc, người kia nhận rác. Tại sao?”

## Slide 3 — Nội Dung Bài Học
1. Prompt fundamentals
2. Advanced prompting techniques
3. System prompt engineering
4. Function/Tool calling
5. Langgraph

## Slide 4 — Mục Tiêu Ngày 4
- Viết được prompt rõ ràng theo các thành phần [[role]] / [[task]] / [[context]] / [[format]].
- Hiểu khi nào nên dùng [[zero-shot]], [[few-shot]], [[Chain-of-Thought]] (CoT), và khi nào không cần.
- Viết được [[system prompt]] production-grade cho [[agent]].
- Khai báo được [[tool schema]] và hiểu vòng lặp tool calling từ model đến tool rồi quay lại model.

Mục tiêu của buổi này là hiểu cơ chế: prompt là interface giữa [[human intent]] và [[model behavior]]; tool calling là interface giữa model và thế giới bên ngoài.

## Slide 5 — Deliverable Cuối Ngày
- 1 agent script chạy được + 1 system prompt + 2 tool schemas + 5 test questions + ghi chú lỗi prompt/tool/control flow.
- 2 tools tự viết: 1 API wrapper đơn giản, 1 data query đơn giản.
- 1 system prompt có [[rules]], [[constraints]], [[output contract]].
- 5 câu test để chứng minh agent biết khi nào trả lời trực tiếp, khi nào gọi tool.

## Slide 6 — Prompt Engineering Fundamentals
Prompt tốt không phải prompt “hay”, mà là prompt tạo ra hành vi mong muốn ổn định.

## Slide 7 — Prompt = Interface Giữa Ý Định và Khả Năng Model
### Prompt kém
“Viết email cho tôi” không rõ gửi ai, về gì, tone nào, dài bao nhiêu. Kết quả: chung chung, khó dùng ngay.
### Prompt tốt
Viết email xin lỗi khách hàng về giao hàng trễ 2 ngày, tone lịch sự, dưới 120 từ, có [[CTA]] rõ ràng. Kết quả: actionable hơn hẳn.
Nguyên tắc vàng: Specificity beats cleverness.

## Slide 8 — 4 Thành Phần Của Prompt Tốt
- **[[ROLE]]**: Vai trò.
- **[[TASK]]**: Nhiệm vụ.
- **[[CONTEXT]]**: Bối cảnh.
- **[[FORMAT]]**: Định dạng.

Bắt đầu với [[TASK]] + [[FORMAT]]. Chỉ thêm [[ROLE]] hoặc [[CONTEXT]] khi thực sự cải thiện chất lượng hoặc tính nhất quán.

## Slide 9 — Instruction vs Conversation vs System Prompt
- **Instruction prompt**: Ra lệnh trực tiếp cho một tác vụ.
- **Conversation prompt**: Giữ ngữ cảnh nhiều lượt với user.
- **System prompt**: Đặt policy, boundary, output contract.

## Slide 10 — Token Budget Awareness
Prompt dài hơn không đồng nghĩa prompt tốt hơn. Hãy cắt bớt nếu prompt dài thêm nhưng không làm thay đổi hành vi mong muốn.

## Slide 11 — Advanced Prompting & Context Structuring
Dùng kỹ thuật nâng cao khi chúng cải thiện chất lượng thật sự, không dùng như thần chú.

## Slide 12 — Types of Prompt
Phân loại các kỹ thuật prompting từ cơ bản đến nâng cao.

## Slide 13 — Zero-shot, One-shot, Few-shot, CoT
- **Zero-shot**: Không có ví dụ mẫu.
- **One-shot**: 1 ví dụ mẫu.
- **Few-shot**: 2–5 ví dụ.
- **CoT**: Cho model reasoning từng bước.

Thứ tự thử thực dụng: zero-shot -> few-shot -> decomposition / CoT.

## Slide 14 — Khi Nào Dùng Few-shot?
- Khi model hiểu task nhưng ra sai [[format]] hoặc không ổn định giữa các input tương tự.
- Khi cần giữ tiêu chuẩn đánh giá, tone, hoặc cách lập luận nhất quán.

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
CoT phù hợp khi:
- Bài toán cần reasoning nhiều bước.
- Bạn muốn model giải thích logic trung gian.
- Bạn cần debug xem model sai ở bước nào.

## Slide 17 — The Shift: Prompts as Code
Tư duy lập trình trong việc thiết kế và quản lý cấu trúc prompt.

## Slide 18 — Tại Sao Prompt Cơ Bản Thất Bại Trong Agent Loop?
- Tính mỏng manh (Fragility).
- Ảo giác định dạng (Format Hallucination).
- Một output sai format = Toàn bộ pipeline bị sập.

## Slide 19 — Hướng Tới "Prompt Determinism"
- **Khả năng**: LLM trả về đúng một định dạng cấu trúc dù input của user có "méo mó".
- **Thách thức**: Kiểm soát được nội dung người dùng nhập vào hệ thống.
- **Công cụ cốt lõi**: Thiết lập ranh giới và các ràng buộc chặt chẽ.

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
- **Persona**: role, expertise level, communication style.
- **Rules**: việc nên làm, việc luôn phải làm.
- **Capabilities**: model được phép dùng tools nào, dữ liệu nào.
- **Constraints**: không làm gì, khi nào từ chối, khi nào escalate.

## Slide 22 — Programming the Latent Space
- Pattern-Matching: LLM là một cỗ máy pattern-matching khổng lồ.
- Narrowing: Prompt tốt giúp "thu hẹp không gian xác suất".
- Delimiters: Đóng vai trò như dấu ngoặc trong lập trình.

## Slide 23 — System Prompt Anti-Patterns
- Quá dài.
- Mâu thuẫn.
- Mơ hồ.
- Không test edge cases.

## Slide 24 — Structural Prompting with XML / Delimiters
Sử dụng thẻ XML và các dấu phân tách để tối ưu cấu trúc prompt và ngăn chặn Context Bleed.

## Slide 25 — Cấu Trúc Hóa Bằng Thẻ XML (XML Tags)
- Bản chất của model: Được train trên lượng lớn dữ liệu HTML/XML.
- Attention Mechanism: Nhận diện rất tốt cấu trúc.

## Slide 26 — Bộ Thẻ XML Căn Bản Cho System Prompt
- `<system_role>`: Định nghĩa persona, giọng văn và chuyên môn.
- `<instructions>`: Các quy tắc cốt lõi, ràng buộc.
- `<examples>`: Khu vực chứa few-shot data.
- `<user_input>`: Dữ liệu thô từ phía người dùng.

## Slide 27 — Context Bleed - Kẻ Thù Số 1 Của RAG & Agents
- Context Bleed là gì? Khi LLM nhầm lẫn giữa Lệnh và Dữ liệu.
- Ví dụ minh họa: User nhập câu lệnh mập mờ, dẫn đến lỗi.

## Slide 28 — Cô Lập Dữ Liệu Bằng Delimiters
- Bao bọc Input bên ngoài.
- Lệnh xử lý rõ ràng.
- Tính nhất quán với dấu ngoặc kép hoặc XML.

## Slide 29 — So Sánh: Messy Prompt vs. XML-Structured Prompt
- Messy Prompt: Không có ranh giới rõ ràng.
- XML-Structured Prompt: Phân định rõ nội dung.

## Slide 30 — Nested XML (Cấu trúc lồng nhau)
Cấu trúc XML lồng nhau giúp tối ưu khả năng truy xuất và tham chiếu thông tin trong các hệ thống RAG phức tạp.

## Slide 31 — Advanced Few-Shot & Formatting
Kỹ thuật nâng cao trong việc tối ưu hóa ví dụ mẫu và định dạng đầu ra.

## Slide 32 — Sức Mạnh Thực Sự Của Few-Shot
- Dạy bằng ví dụ: giúp mô hình nắm bắt ngữ cảnh sâu hơn.
  
## Slide 33 — Chọn Ví Dụ Sao Cho Khôn Ngoan?
Cần tập trung vào "Edge-cases" (Ngoại lệ).

## Slide 34 — Negative Prompting: Dạy Model Việc KHÔNG Nên Làm
- Hạn chế của lệnh phủ định.
- Tạo ví dụ chống chỉ định.

## Slide 35 — Cấu Trúc Hóa Suy Nghĩ Của Model
```xml
<thinking>
Phân tích yêu cầu, liệt kê các bước giải quyết...
</thinking>
<result>
Kết quả cuối cùng dựa trên phân tích trên.
</result>
```

## Slide 36 — Few-shot Để Giữ Định Dạng JSON
Cung cấp JSON Schema cụ thể để model hiểu cấu trúc dữ liệu mong muốn.

## Slide 37 — Rủi Ro & Đánh Đổi Khi Dùng Few-shot
- Order Bias: LLM thường bị ảnh hưởng mạnh bởi ví dụ cuối cùng.
  
## Slide 38 — Handling Long Context: "Lost in the Middle"
Hiện tượng "Lost In The Middle" xảy ra khi LLM không nhớ thông tin ở giữa tài liệu lớn.

## Slide 39 — Tận Dụng Recency Bias
Thứ tự thông tin giúp tăng độ chính xác của câu trả lời dựa trên cơ chế chú ý của LLM.

## Slide 40 — Tối Ưu Bằng Cách Cắt Tỉa Context
Giải pháp Compression: Áp dụng cơ chế tóm tắt để giảm tải token.

## Slide 41 — Hoạt Động 1: Chỉnh sửa Prompt (10 Phút)
Nhiệm vụ: Tìm ra ít nhất 3 điểm yếu dễ gây lỗi trong đoạn prompt.

## Slide 42 — System Prompt Engineering
System prompt tốt làm agent nhất quán hơn, dễ kiểm soát hơn, và dễ test hơn.

## Slide 43 — User vs. System vs. Assistant Roles
Phân biệt vai trò để định hướng mô hình ngôn ngữ hoạt động chính xác.

## Slide 44 — Chat Completions API vs Completions API
Sự khác biệt giữa Completions API và Chat Completions API.

## Slide 45 — Phân Tách Quyền Lực: System, User, Assistant
Giúp model hiểu rõ đâu là chỉ dẫn bắt buộc và đâu là dữ liệu cần xử lý.

## Slide 46 — System Message Nặng Ký Đến Mức Nào?
Các model hiện đại được huấn luyện theo hệ thống ưu tiên từ System hơn User.

## Slide 47 — Đặt Cái Gì Vào Đâu?
Bối cảnh tĩnh và luật lệ phải được định nghĩa một cách rõ ràng.

## Slide 48 — Quản Lý Lịch Sử Bằng Trạng Thái
LLM là Stateless, cần quản lý trí nhớ qua State.

## Slide 49 — Memory Injection và Context Compression
Chỉ đưa vào facts cần cho task hiện tại.

## Slide 50 — Anatomy of a Production System Prompt

## Slide 51 — System Prompt = "Bộ Não" Của Agent
System Prompt không phải là một đoạn văn miêu tả chung chung mà là một Hợp đồng (Contract).

## Slide 52 — Persona - Định Hình Danh Tính
Ranh giới rõ ràng giúp thu hẹp khả năng ảo giác.

## Slide 53 — Core Directives - Mệnh Lệnh Bất Di Bất Dịch
Core Directives là những chỉ dẫn không thể thương lượng.

## Slide 54 — Capabilities - Agent Của Tôi Có Thể Làm Gì?
Cung cấp bối cảnh về công cụ giúp Agent hiểu rõ 'tại sao' và 'khi nào' cần sử dụng.

## Slide 55 — Output Contract - Ràng Buộc Kết Quả
Output Contract là lời cam kết về định dạng, giúp dữ liệu được xử lý tự động và chính xác.

## Slide 56 — Những "Sai Lầm" Khi Viết System Prompt
Lỗi mâu thuẫn, lịch sự thừa thãi, và vấn đề ngôn ngữ kép.

## Slide 57 — Edge Cases & Refusals
Thử thách thực sự của Prompt Engineering.

## Slide 58 — Rút Lui Trong Danh Dự (Graceful Fallback)
Quy định rõ Agent không được tự bịa dữ liệu.

## Slide 59 — Quyền Được Nói "Tôi Không Biết"
Thiết lập rào cản để ngăn chặn hành vi suy luận vô căn cứ.

## Slide 60 — Đối Phó Với Out-of-Scope Queries
Định nghĩa rõ cái gì nằm NGOÀI ranh giới để kiểm soát hành vi của Agent.

## Slide 61 — Bàn Giao Cho Con Người (Escalation)
Cần một cơ chế rút lui an toàn khi gặp tình huống phức tạp.

## Slide 62 — Ranh Giới Của System Prompt
System Prompt tập trung xử lý Logic Nghiệp Vụ và tối ưu hóa trải nghiệm người dùng.

## Slide 63 — Dynamic System Prompts
Nhu cầu về một lớp "Context Injection" để bơm dữ liệu thời gian và thông tin người dùng vào trước khi gửi tới LLM.

## Slide 64 — Thực Thi Dynamic Bằng Code
Sử dụng thư viện template Jinja2 và f-strings trong Python.

## Slide 65 — Hoạt Động 2: Bẻ Khóa "CFO Agent" (10 Phút)
Tìm ít nhất 3 cách để "Lừa" AI trong điều kiện cho phép.

## Slide 66 — Bước Ngoặt Tool Calling
Cung cấp APIs và Database để model tương tác thực tế.

## Slide 67 — Kiến Trúc Vòng Lặp Tool Calling
Cơ chế 4 bước trong tool calling.

## Slide 68 — Model Suy Nghĩ Và Yêu Cầu Tool
Cấu trúc Output (JSON Tool Calls) giúp model sinh ra các yêu cầu chính xác.

## Slide 69 — Trách Nhiệm Của Hệ Thống Của Bạn
Bắt trạng thái tool_calls và thực thi logic lập trình.

## Slide 70 — Đóng Vòng Lặp (Closing the Loop)
Cập nhật mảng message và gửi lại cho model.

## Slide 71 — Designing the Perfect JSON Schema
Crafting precise tool definitions to eliminate model ambiguity.

## Slide 72 — JSON Schema Của Tool Là Gì?
Là cấu trúc khai báo giúp LLM hiểu rõ danh sách và chức năng của các hàm.

## Slide 73 — Tên Hàm - Yếu Tố Quyết Định Phân Loại
Nguyên lý hoạt động dựa trên tên hàm giúp model đoán chức năng.

## Slide 74 — Description Của Tool CHÍNH LÀ Prompt
Nội dung cần rõ ràng và cụ thể để model dễ dàng kích hoạt công cụ.

## Slide 75 — Thiết Kế Parameters Cấu Trúc
Định nghĩa thuộc tính và mô tả riêng biệt giúp tăng tính chính xác.

## Slide 76 — Enums - Khóa Chặt Sự Lựa Chọn
Ràng buộc giá trị cần thiết để giảm thiểu rủi ro ảo giác.

## Slide 77 — Bắt Buộc Hay Tùy Chọn? (Required Fields)
Khai báo các trường bắt buộc giúp model nhận diện thông tin thiếu hụt.

## Slide 78 — Anti-Pattern: Nhồi Nhét Quá Nhiều Tham Số
Một tool không nên có quá nhiều parameters để tránh nhầm lẫn.

## Slide 79 — Mổ Xẻ Một Tool Schema Đạt Chuẩn
Cấu trúc ví dụ của một tool schema hoàn chỉnh.

## Slide 80 — Tool Execution Strategies
Nghệ thuật phối hợp các công cụ trong agents.

## Slide 81 — Gọi Tuần Tự (Sequential/Chained Calls)
Chi phí latency rất cao khi gọi các tool tuần tự.

## Slide 82 — Tối Ưu Tốc Độ Bằng Parallel Calling
Sử dụng các model đời mới giúp tối ưu hóa tốc độ phản hồi.

## Slide 83 — Cảnh Báo: Mặt Trái Của Parallel Calling
Rủi ro hệ thống khi gọi nhiều requests cùng lúc.

## Slide 84 — Handling Tool Failures & Retries
Xây dựng khả năng phục hồi cho các tích hợp tool.

## Slide 85 — Thực Tế Nghiệt Ngã: Tool Rất Hay Lỗi
Những lỗi thường gặp và cách xử lý.

## Slide 86 — Khi LLM "Tự Bịa" Tham Số Mới
Giải pháp validation chặt chẽ để đảm bảo tính chính xác.

## Slide 87 — Phép Màu Của Tự Sửa Lỗi (Self-Correction)
Gửi raw error message cho model để nó có cơ hội tự điều chỉnh.

## Slide 88 — Orchestration with LangGraph
Xây dựng luồng điều khiển phức tạp cho agent.

## Slide 89 — Why LangGraph?
Đi xa hơn các chuỗi đơn giản để xây dựng workflows phức tạp.

## Slide 90 — Tại Sao while True Không Còn Đủ Tốt?
Khó khăn trong việc debug và quản lý trạng thái.

## Slide 91 — Từ "Đồ Chơi" Đến Hệ Thống Thực Tế
Nhu cầu về một kiến trúc máy trạng thái (State Machine).

## Slide 92 — LangGraph: Tương Lai Của Agentic AI
Framework chuyên dụng cho các hệ thống multi-agent.

## Slide 93 — Sự Phân Nhánh: Chain vs. Graph
LangChain cho luồng dữ liệu tuyến tính, LangGraph cho vòng lặp phức tạp.

## Slide 94 — Lợi Ích Cốt Lõi Khi Học LangGraph
- Flow điều khiển tường minh.
- Quản lý trạng thái tự động.

## Slide 95 — Core Concepts of LangGraph
Hiểu biết về State, Nodes, và Edges để xây dựng kiến trúc agent phức tạp.

## Slide 96 — Giải Phẫu LangGraph (State, Nodes, Edges)
Mô tả chi tiết từng thành phần của LangGraph.

## Slide 97 — Cập Nhật Trạng Thái Thay Vì Ghi Đè
Cơ chế Append-only giúp duy trì toàn bộ lịch sử.

## Slide 98 — Chức Năng Của Node "Agent"
Node thực hiện gọi API và cập nhật trạng thái.

## Slide 99 — Chức Năng Của Node "Tool"
Node thực hiện duyệt qua danh sách các lệnh và parse arguments.

## Slide 100 — Normal Edge vs Conditional Edge
Định nghĩa luồng di chuyển giữa các nodes.

## Slide 101 — Logic Rẽ Nhánh Thông Minh (Router)
Giúp agent tự quyết định vòng đời và phản hồi của mình.

## Slide 102 — Xây Dựng Khung Xương (Builder)
Khởi tạo và định nghĩa trạng thái cho agent.

## Slide 103 — Khai Báo Dòng Chảy START / END
Điểm bắt đầu và kết thúc của đồ thị trong LangGraph.

## Slide 104 — Đóng Gói Và Biên Dịch (Compile)
Chuyển đổi từ cấu trúc Builder sang đối tượng đồ thị thực thi.

## Slide 105 — Chạy Thử Khối Động Cơ Này Thế Nào?
Quan sát luồng sự kiện khi chạy lab.

## Slide 106 — Lab Skeleton — Python Example
```python
SYSTEM_PROMPT = open("system_prompt.txt").read()
TOOLS = [get_weather_tool(), query_sales_tool()]
while True:
    user_input = input("You: ")
    messages.append({"role": "user", "content": user_input})
    response = call_model(messages, SYSTEM_PROMPT, TOOLS)
    messages = handle_tool_calls(response, messages)
    print(render_final_answer(messages, SYSTEM_PROMPT, TOOLS))
```

## Slide 107 — Lab #4
Mục tiêu: Build ReAct agent với 2 custom tools, viết system prompt chuẩn, và test end-to-end trên 5 câu hỏi.

## Slide 108 — Tổng kết — Key Takeaways
1. Prompt = interface giữa [[human intent]] và [[model capability]].
2. System prompt tốt = agent nhất quán và predictable hơn.
3. [[Tool schema description]] quyết định việc model biết khi nào dùng tool.
4. [[Parallel tool calls]] nhanh hơn khi tools không phụ thuộc.

## Slide 109 — Tiếp theo & Bài tập
Hoàn thiện Lab 4 với 5 test questions rõ pass/fail.

## Slide 110 — Tài Liệu Tham Khảo
1. Anthropic. Prompt Engineering Overview.
2. OpenAI. Function Calling Guide.

## Slide 111 — Hỏi & Đáp
Bạn đang gặp lỗi vì model chưa hiểu ý bạn, hay vì tool contract của bạn chưa đủ rõ?

## Slide 112 — Cảm ơn!
Email: lecturer@vinuni.edu.vn
Slides & tài liệu: github.com/aicb-vinuni
Lab template: bit.ly/aicb-day04-lab

## Khái Niệm Chính
- [[prompt]]: Chuỗi văn bản để chỉ dẫn AI thực hiện tác vụ.
- [[system prompt]]: Cấu trúc chỉ dẫn đầy đủ cho agent hoạt động.
- [[tool schema]]: Khai báo cấu trúc JSON cho các công cụ.
- [[human intent]]: Ý định của người dùng khi giao tiếp với AI.
- [[model behavior]]: Hành vi của AI khi nhận được prompt.
- [[role]]: Vai trò của AI trong một bối cảnh cụ thể.
- [[task]]: Nhiệm vụ cần thực hiện.
- [[context]]: Bối cảnh trong đó nhiệm vụ được đặt ra.
- [[format]]: Cách output cần được định dạng.
- [[zero-shot]]: Kỹ thuật không có ví dụ mẫu.
- [[few-shot]]: Kỹ thuật có từ 2–5 ví dụ mẫu.
- [[Chain-of-Thought]]: Kỹ thuật suy luận từng bước.
- [[CTA]]: Call to Action, chỉ dẫn hành động rõ ràng cho người dùng.
```
