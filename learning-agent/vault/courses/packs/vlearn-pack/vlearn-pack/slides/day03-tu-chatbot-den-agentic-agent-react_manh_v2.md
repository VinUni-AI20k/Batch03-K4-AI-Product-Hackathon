---
course: packs
generated: '2026-07-31T18:27:35+00:00'
lang: vi
lesson: day03-tu-chatbot-den-agentic-agent-react_manh_v2
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\slides\day03-tu-chatbot-den-agentic-agent-react_manh_v2.md
source_hash: sha256:e2fe14b3fb2ebea060bc3b70665453835f99ab58cecf547a05a9e89f7389f4ea
type: lesson-note
---

```markdown
# day03 tu chatbot den agentic agent react manh v2

## Slide 1 — Từ Chatbot Đến Agentic Agent
Phạm Mạnh  
VinUniversity · Phase 1 · Tuần 1 · 01/06/2026

## Slide 2 — Nội Dung Bài Học
- 3 Kiểu Hệ Thống AI
- Agentic Fit Framework
- Kiến Trúc Agent
- ReAct Pattern
- Agent Loop: Code Anatomy
- Live Demo & Debug
- Chatbot vs Agent
- Lab 3

## Slide 3 — Mục Tiêu Ngày 3
- Phân biệt được [[rule-based bot]], [[LLM bot]], và [[agent]].
- Dùng [[Agentic Fit]] để biết khi nào nên nâng từ chatbot lên agent.
- Hiểu và giải thích được vòng lặp [[ReAct]]: Thought → Action → Observation.
- Build được [[ReAct agent]] đầu tiên với tools, system prompt, và safeguard cơ bản.

## Slide 4 — Deliverable Cuối Ngày
- Chatbot baseline + [[ReAct agent]] cho cùng một bài toán, kèm trace và flowchart
- 5 test cases để so sánh chatbot và agent
- 1 trace Thought / Action / Observation của agent
- 1 nhận định rõ: khi nào chatbot đủ, khi nào agent vượt trội

## Slide 5 — 3 Kiểu Hệ Thống AI
Từ bot có [[rule]] đến [[agent]] có khả năng lập kế hoạch và dùng công cụ.

## Slide 6 — Spectrum: Bot → Chatbot → Agent
- [[Rule-based Bot]]: If/else cứng, predictable.
- [[LLM Chatbot]]: Trả lời thông minh nhưng chủ yếu một lượt.
- [[Reactive Agent]]: Dùng tools + loop quan sát theo từng bước.
- [[Autonomous Agent]]: Long-horizon goal, nhiều quyết định liên tiếp.
- Khả năng thích nghi, tool use, memory, risk tăng dần.

## Slide 7 — So Sánh 3 Kiểu Hệ Thống AI
| Tiêu chí        | Rule-based Bot                          | LLM Chatbot                        | Agent                          |
|-----------------|----------------------------------------|-----------------------------------|---------------------------------|
| Cách xử lý      | If/else cố định                        | Sinh câu trả lời tốt theo context | Plan → act → observe → adapt  |
| Flexibility/Memory | Thấp, gần như không có              | Trung bình, ngắn hạn              | Cao                            |
| Tool use        | Hard-coded                             | Có thể gọi tool theo chỉ định     | Chủ động chọn tool theo bước tiếp theo  |
| Cost            | Thấp nhất                              |                                   | Cao hơn do loop và nhiều calls |
| Risk            | Logic dễ kiểm soát                    | Hallucination / format drift       | Hallucination + tool misuse + loop |
| Ví dụ phù hợp   | Menu IVR, form validation              | FAQ, support cơ bản               | Booking, research, coding assistant |

## Slide 8 — Ví Dụ Nhanh: Cùng Một Câu Hỏi, 3 Mức Độ Hệ Thống
Bài toán: "Tìm vé HAN → HCM dưới 2 triệu, rồi gợi ý mang gì nếu trời mưa."
- [[Bot có rule]]: Trả menu lựa chọn cố định.
- [[LLM chatbot]]: Viết câu trả lời mượt nhưng không tự truy vấn giá vé thật.
- [[Reactive agent]]: Tách goal thành 2 việc và gọi từng tool theo bước.

## Slide 9 — Agentic Fit Framework
4 tiêu chí để biết bài toán có thật sự cần [[agent]] hay không.

## Slide 10 — 4 Tiêu Chí Agentic Fit
1. **Multi-step Reasoning**: Bài toán có cần chia thành nhiều bước phụ thuộc nhau không?
2. **Tool Interaction**: Hệ thống có cần gọi search, API, database, calculator...?
3. **Dynamic Decision**: Mỗi bước tiếp theo có phụ thuộc vào kết quả vừa quan sát không?
4. **Long Horizon**: Hệ thống có phải giữ mục tiêu xuyên suốt qua nhiều vòng lặp không?

## Slide 11 — Scoring Matrix: Có Cần Agent Không?
| Use case | Reasoning | Tool use | Dynamic decision | Tổng |
|----------|-----------|----------|-----------------|------|
| FAQ nội bộ HR | 1 | 1 | 1 | 3 |
| Tóm tắt hợp đồng | 3 | 2 | 2 | 7 |
| Booking assistant | 4 | 5 | 4 | 13 |
| Research agent | 4 | 4 | 4 | 12 |
| Code assistant | 5 | 5 | 4 | 14 |

## Slide 12 — Anti-Patterns: Khi Dùng Agent Là Sai Bài
- Bài toán 1 bước: hỏi đáp, tra FAQ.
- Không có tool nào để gọi.
- Mọi thứ phải 100% deterministic.
- Chi phí latency không chấp nhận được.

## Slide 13 — Case Study: Chatbot Đủ Hay Cần Agent?
### Customer FAQ
- Câu hỏi lặp lại, intent ổn định, best fit: chatbot.
### Booking Assistant
- Nhiều ràng buộc, best fit: [[reactive agent]].

## Slide 14 — Agent Patterns Nên Tăng Dần Theo Nhu Cầu
- Augmented LLM
- Prompt Chaining
- Routing
- Orchestrator Worker
- Agent

## Slide 15 — Kiến Trúc Agent
[[Perception]], [[reasoning]], [[action]], [[memory]] và luồng thông tin giữa các khối.

## Slide 16 — Kiến Trúc Agent: Từ Trong Ra Ngoài
- [[Reasoning]]: LLM Core
- [[Perception]]: User input, Tool results
- [[Action]]: Call tool, Final result
- [[Memory]]: Short-term, Long-term

## Slide 17 — Memory: Short-term vs Long-term
- **Short-term memory**: Nằm trong context window, dùng cho task hiện tại.
- **Long-term memory**: Lưu facts, preferences, cần retrieval strategy.

## Slide 18 — Tool Calling = Tay Chân Của Agent
- Các tool definitions phải rõ input / output / error mode.

## Slide 19 — ReAct Pattern
[[Reasoning]] + [[Acting]]: Cách đơn giản nhất để biến [[LLM]] thành [[agent]].

## Slide 20 — Định Nghĩa
ReAct = [[Reasoning]] + [[Acting]] là pattern kết hợp suy luận theo từng bước với gọi công cụ và quan sát kết quả.

## Slide 21 — ReAct Loop: Thought → Action → Observation
- Thought: Mình đang thiếu gì?
- Action: Gọi tool nào?
- Observation: Kết quả trả về là gì?

## Slide 22 — Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (1/2)
- Thought 1: Tôi cần tìm chuyến bay dưới 2 triệu.
- Action 1: `search_flights(...)`
- Observation 1: Có 2 lựa chọn.

## Slide 23 — Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (2/2)
- Observation 2: Nhiệt độ, xác suất mưa.
- Final Answer: Gợi ý chuyến và trang phục.

## Slide 24 — ReAct Tốt Ở Điểm Nào?
### Ưu điểm
- Dễ đọc trace, debug.
- Phù hợp các bài toán tìm kiếm, booking.
### Giới hạn
- Tốn nhiều token, latency hơn chatbot.

## Slide 25 — Agent Loop: Code Anatomy
Từ prompt, tool registry, đến loop control.

## Slide 26 — Pseudocode: Agent Loop Tối Thiểu
```python
messages = []
for step in range(MAX_ITERATIONS):
    output = call_model(...)
    if output.type == "final_answer":
        return output.content
    result = run_tool(output.name, output.args)
```

## Slide 27 — System Prompt Cho ReAct Agent
Mô tả vai trò và quy tắc của agent.

## Slide 28 — Tool Registry: Khai Báo "Tay Chân" Cho Agent
```python
TOOLS = {
    "get_weather": {...},
    "search_flights": {...},
}
```

## Slide 29 — Max Iterations Safeguard: Tránh Agent Đi Vòng
Cần guardrails và dấu hiệu loop.

## Slide 30 — Từ ReAct Đến LangGraph
- Biểu diễn state, nodes, edges, conditional routing.

## Slide 31 — Live Demo & Debug
Build agent tra cứu thời tiết và gợi ý trang phục.

## Slide 32 — Kịch Bản Live Demo
1. Định nghĩa 2 tools.
2. Viết system prompt.
3. Chạy loop và đọc trace.
4. Cố tình tạo lỗi.
5. Debug.

## Slide 33 — Code Demo: 2 Tool Tối Thiểu
```python
def get_weather(...): ...
def recommend_outfit(...): ...
```

## Slide 34 — Debug Checklist Khi Agent Lỗi
Nhìn vào trace trước và các nơi thường phải sửa.

## Slide 35 — Chatbot vs Agent
Khi nào mỗi loại thắng và tại sao hybrid pattern thực dụng nhất.

## Slide 36 — Khi Nào Chatbot Thắng, Khi Nào Agent Thắng?
| Khía cạnh        | Chatbot thắng                        | Agent thắng                     |
|------------------|-------------------------------------|----------------------------------|
| Tác vụ           | FAQ, support cơ bản                 | Nhiều bước                      |
| Tốc độ           | Nhanh, ít round-trip                | Chậm hơn do loop                |
| Cost             | Thấp hơn                            | Cao hơn                         |
| Kiểm soát        | Dễ hơn                             | Khó hơn                         |
| UX               | Phản hồi nhanh, đơn giản           | Cảm giác "làm việc giúp bạn"   |

## Slide 37 — Hybrid Pattern: Thực Dụng Hơn Cực Đoan
- Triage nhanh: câu đơn giản đi chatbot path, câu phức tạp mở agent loop.

## Slide 38 — Thực Hành
Lab 3: Chatbot vs Agent — Hands-on Comparison.

## Slide 39 — Cách Chạy Lab 3
1. Chọn use case từ Ngày 2.
2. Build chatbot baseline.
3. Nâng cấp thành [[ReAct agent]].
4. Chạy 5 test cases.
5. Vẽ flowchart.

## Slide 40 — Lab #3
- Mục tiêu: Build chatbot baseline, nâng cấp thành ReAct agent.
- Deliverable: chatbot + agent + 5 test cases + 1 trace + 1 flowchart.
- Thời gian: 150 phút.

## Slide 41 — Tổng Kết — Key Takeaways
1. [[Agent]] không phải "chatbot thông minh hơn".
2. [[ReAct]] là pattern dễ học nhất.
3. Chỉ dùng agent khi có [[multi-step reasoning]].
4. [[Guardrails]], trace, và evaluation quan trọng.

## Slide 42 — Tiếp theo & Bài tập
- Đọc lại trace lab hôm nay và tìm 1 chỗ agent ra quyết định chưa tối ưu.

## Slide 43 — Tài Liệu Tham Khảo
1. Yao et al. "ReAct: Synergizing Reasoning and Acting in Language Models". arXiv:2210.03629, 2023.
2. Anthropic. "Building effective agents". [anthropic.com/research/building-effective-agents](https://anthropic.com/research/building-effective-agents)
3. LangChain / LangGraph docs. "Quickstart and Introduction". [langchain-ai.github.io/langgraph](https://langchain-ai.github.io/langgraph)

## Slide 44 — Hỏi & Đáp
Use case nào trong công việc của bạn chỉ cần chatbot, và use case nào thực sự cần [[agent]] loop?

## Khái Niệm Chính
- [[rule-based bot]]: Bot sử dụng quy tắc if/else để xử lý, khô cứng.
- [[LLM bot]]: Bot sử dụng mô hình ngôn ngữ lớn để tạo ra câu trả lời theo ngữ cảnh.
- [[agent]]: Hệ thống thông minh có khả năng lập kế hoạch, hành động và quan sát kết quả.
- [[Agentic Fit]]: Khung đánh giá xem bài toán có cần sử dụng agent hay không.
- [[ReAct]]: Pattern kết hợp suy luận, hành động và quan sát trong quy trình của agent.
- [[multi-step reasoning]]: Quá trình giải quyết vấn đề yêu cầu nhiều bước phụ thuộc lẫn nhau.
- [[perception]]: Khối chịu trách nhiệm tiếp nhận thông tin từ bên ngoài.
- [[reasoning]]: Khối xử lý và phân tích thông tin.
- [[action]]: Khối thực hiện công việc cụ thể.
- [[memory]]: Khối lưu trữ thông tin và trạng thái của agent.
```
