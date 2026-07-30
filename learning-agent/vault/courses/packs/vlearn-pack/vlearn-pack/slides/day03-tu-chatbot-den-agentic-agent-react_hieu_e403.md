---
course: packs
generated: '2026-07-30T10:40:47+00:00'
lang: vi
lesson: day03-tu-chatbot-den-agentic-agent-react_hieu_e403
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/slides/day03-tu-chatbot-den-agentic-agent-react_hieu_e403.md
source_hash: sha256:64544e450a80a79e7d5d8e34796e075a7e73e58b450e437ddee78abe2b4e25d9
type: lesson-note
---

```markdown
# Ghi chú bài học: Từ Chatbot đến Agentic Agent

## Slide 1 — Từ Chatbot Đến Agentic Agent
AICB-P1 · Ngày 3 · Design Pattern ReAct  
Giảng viên: VinUniversity · Phase 1 · Tuần 1 · 17/03/2026  

## Slide 2 — Hãy Suy Nghĩ...
"Hãy giữ câu hỏi trong đầu: ChatGPT là chatbot hay agent? Siri thì sao? Cursor IDE thì sao?" [00:20]

## Slide 3 — Nội Dung Bài Học
1. 3 Kiểu Hệ Thống AI
2. [[Agentic Fit Framework]]
3. Kiến Trúc [[Agent]]
4. [[ReAct]] Pattern
5. [[Agent Loop]]: Code Anatomy
6. Live Demo & Debug
7. Eval & Telemetry
8. Chatbot vs [[Agent]]
9. Lab 3  
Giảng viên (VinUni) AICB · Ngày 3 · 17/03/2026

## Slide 4 — Mục Tiêu Ngày 3
- Phân biệt được [[rule-based bot]], [[LLM chatbot]], và [[agent]].
- Dùng [[Agentic Fit]] để biết khi nào nên nâng từ chatbot lên agent.
- Hiểu và giải thích được vòng lặp [[ReAct]]: Thought → Action → Observation.
- Build được [[ReAct]] agent đầu tiên với tools, system prompt, và safeguard cơ bản.
- Phân biệt [[text-ReAct]] vs [[native tool calling]]; biết các failure mode và đo bằng [[telemetry]].

## Slide 5 — Deliverable Cuối Ngày
- Chatbot baseline + [[ReAct]] agent (native tool calling) cho cùng bài toán, phải chạy được end-to-end kèm [[telemetry]].
- Group report: so sánh chatbot vs agent trên bộ scenario, kèm 1 trace thành công + 1 trace lỗi.
- Individual report: đóng góp kỹ thuật + 1 case debug đọc từ log.
- Chấm theo rubric 100 điểm (group 60 / individual 40).

## Slide 6 — 3 Kiểu Hệ Thống AI
Từ bot có rule đến agent có khả năng lập kế hoạch và dùng công cụ.

## Slide 7 — Spectrum: Bot → Chatbot → Agent
- [[Rule-based Bot]]: If/else cứng, predictable.
- [[LLM Chatbot]]: Trả lời thông minh nhưng chủ yếu 1 lượt.
- [[Reactive Agent]]: Dùng tools + loop quan sát theo từng bước. 
- [[Autonomous Agent]]: Long-horizon goal, nhiều quyết định liên tiếp.

## Slide 8 — So Sánh 3 Kiểu Hệ Thống AI
| Tiêu chí           | Rule-based Bot           | LLM Chatbot                | Agent                    |
|---------------------|--------------------------|----------------------------|--------------------------|
| Cách xử lý          | If/else cố định          | Sinh câu trả lời tốt theo context | Plan → act → observe → adapt |
| Flexibility         | Thấp                     | Trung bình                 | Cao                      |
| Memory              | Gần như không có         | Ngắn hạn trong context     | Ngắn hạn + long-term memory  |
| Tool use            | Hard-coded               | Có thể gọi tool theo chỉ định | Chủ động chọn tool theo bước tiếp theo |
| Cost                | Thấp nhất                | Trung bình                 | Cao hơn                  |
| Risk                | Logic dễ kiểm soát      | Hallucination / format drift | Hallucination + tool misuse + loop |

## Slide 9 — Ví Dụ Nhanh: Cùng Một Câu Hỏi, 3 Mức Độ Hệ Thống
Bài toán: "Tìm vé HAN → HCM dưới 2 triệu, rồi gợi ý mang gì nếu trời mưa."
- Bot có rule: Trả menu lựa chọn cố định.
- [[LLM chatbot]]: Viết câu trả lời mượt nhưng không tự truy vấn giá vé thật.
- [[Reactive agent]]: Tách goal thành 2 việc: tìm vé + check thời tiết.

## Slide 10 — Agentic Fit Framework
4 tiêu chí để biết bài toán có thật sự cần agent hay không.

## Slide 11 — 4 Tiêu Chí Agentic Fit
1. [[Multi-step Reasoning]]: Bài toán có cần chia thành nhiều bước phụ thuộc không?
2. [[Tool Interaction]]: Hệ thống có cần gọi search, API, database, calculator, browser, file system...?
3. [[Dynamic Decision]]: Mỗi bước tiếp theo có phụ thuộc vào kết quả vừa quan sát không?
4. [[Long Horizon]]: Hệ thống có phải giữ mục tiêu xuyên suốt qua nhiều vòng lặp hoặc nhiều state không?

## Slide 12 — Scoring Matrix: Có Cần Agent Không?
| Use case                               | Reasoning | Tool use | Dynamic decision | Tổng  |
|----------------------------------------|-----------|----------|------------------|-------|
| FAQ nội bộ HR                         | 1         | 1        | 1                | 3     |
| Tóm tắt hợp đồng và highlight risk    | 3         | 2        | 2                | 7     |
| Booking assistant du lịch              | 4         | 5        | 4                | 13    |
| Research agent tìm đối thủ cạnh tranh  | 4         | 4        | 4                | 12    |
| Code assistant có test & fix loop      | 5         | 5        | 4                | 14    |

## Slide 13 — Anti-Patterns: Khi Dùng Agent Là Sai Bài
- Bài toán 1 bước: hỏi đáp, tra FAQ, phân loại cơ bản.
- Không có tool nào để gọi.
- Mọi thứ phải 100% deterministic: mỗi sai sót đều rất đắt.
- Chi phí latency không chấp nhận được.
- Nguyên tắc: luôn benchmark rule / workflow / chatbot trước khi mở agent loop.

## Slide 14 — Case Study: Chatbot Đủ Hay Cần Agent?
- [[Customer FAQ]]: Câu hỏi lặp lại, intent khá ổn định.
- [[Booking Assistant]]: Nhiều ràng buộc: thời gian, ngân sách, preference.

## Slide 15 — Từ Anthropic: Agent Patterns Nên Tăng Dần Theo Nhu Cầu
- Bắt đầu từ cấu trúc đơn giản nhất.
- [[Workflow]]: prompt chaining → routing → parallelization → orchestrator-worker → agent.

## Slide 16 — Kiến Trúc Agent
- Từ perception, reasoning, action, memory và luồng thông tin giữa các khối.

## Slide 17 — Kiến Trúc Agent: Từ Trong Ra Ngoài
- [[Reasoning]] / [[LLM Core]]: Kết nối với Perception, Action, Short-term Memory, Long-term Memory.

## Slide 18 — Memory: Short-term vs Long-term
- [[Short-term memory]]: Nằm trong context window, dùng cho task hiện tại.
- [[Long-term memory]]: Lưu facts, preferences, hay state ngoài context.

## Slide 19 — Tool Calling = Tay Chân Của Agent
Tool definitions phải rõ input / output / error mode.

## Slide 20 — ReAct Pattern
[[ReAct]] = Reasoning + Acting.

## Slide 21 — Định Nghĩa
- [[ReAct]] là pattern kết hợp suy luận theo từng bước với gọi công cụ và quan sát kết quả.

## Slide 22 — ReAct Loop: Thought → Action → Observation
- [[ReAct]] mạnh vì trace lý do hành động được bộc lộ ra ngoài, giúp con người debug dễ hơn.

## Slide 23 — Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (1/2)
- Thought 1: Tôi cần tìm chuyến bay sáng mai từ HAN tới HCM dưới 2 triệu.
- Action 1: search_flights(origin="HAN", destination="SGN", date="2026-03-18", max_price=2000000).
- Observation 1: Có 2 lựa chọn phù hợp: VietJet giá 1.75M, Vietnam Airlines giá 1.95M.

## Slide 24 — Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (2/2)
- Final Answer: Gợi ý chuyến 06:10 giá 1.75M; mang áo mỏng, giày dễ khô, ô gập hoặc áo mưa nhẹ.

## Slide 25 — ReAct Tốt Ở Điểm Nào?
- Dễ đọc trace và debug.
- Tự quyết được bước tiếp theo từ observation.
- Có thể cài safeguard ở từng vòng lặp.

## Slide 26 — Hai Cách Hiện Thực "Action": Text-ReAct vs Native Tool Calling
- [[Text-ReAct]]: Model in ra text, dễ vỡ.
- [[Native tool calling]]: Model in ra object có cấu trúc, tin cậy hơn.

## Slide 27 — "Action" Được Parse Như Thế Nào?
- Text-ReAct: ban tự parse (dễ vỡ).
- Native tool calling: API trả về object.

## Slide 28 — Agent Loop: Code Anatomy
- Vòng lặp agent tối thiểu dùng pseudocode.

## Slide 29 — System Prompt Cho [[ReAct]] Agent
- Mẫu system prompt cho agent du lịch.

## Slide 30 — Tool Registry: Khai Báo "Tay Chân" Cho Agent
- Khai báo các tool cho agent với mô tả và tham số.

## Slide 31 — Max Iterations Safeguard: Tránh Agent Đi Vòng
- Cần guardrails để tránh agent gặp vấn đề.

## Slide 32 — Khi Nào Cần Hơn [[ReAct]] Loop?
- Chuyển sang state-graph khi workflow nhiều nhánh.

## Slide 33 — Kịch Bản Live Demo
- Định nghĩa tools, viết system prompt, chạy loop và debug.

## Slide 34 — Code Demo: 2 Tool Tối Thiểu
- Định nghĩa các hàm mẫu cho agent.

## Slide 35 — Debug Checklist Khi Agent Lỗi
- Nhìn vào trace trước khi sửa lỗi.

## Slide 36 — ReAct Failure Modes: 5 Kiểu Lỗi Phải Biết
| Lỗi                       | Triệu chứng                          | Cách xử lý                              |
|---------------------------|--------------------------------------|-----------------------------------------|
| Parse error               | Model in Action sai format           | Native tool calling; strict schema     |
| Hallucinated tool         | Gọi tool không tồn tại              | Validate tên tool theo registry        |
| Hallucinated args         | Args sai / thiếu / bịa              | JSON Schema + strict mode              |
| Empty observation         | Tool trả "không có dữ liệu"         | Cho agent thử tool khác                |
| Timeout / loop            | Lặp tool, reasoning không tiến       | max_iterations; phát hiện lặp         |

## Slide 37 — Eval & Telemetry
- Đo bằng trace, không chỉ final answer.

## Slide 38 — Khi Nào Chatbot Thắng, Khi Nào Agent Thắng?
| Khía cạnh         | Chatbot thắng                         | Agent thắng                         |
|--------------------|---------------------------------------|-------------------------------------|
| Tác vụ             | FAQ, support đơn giản                 | Booking, research, coding           |
| Tốc độ             | Nhanh, ít round-trip                  | Chậm hơn do loop                    |
| Cost               | Thấp hơn, predictable hơn             | Cao hơn nhưng đổi lại xử lý bài toán |
| Kiểm soát          | Dễ hơn, ít state                      | Khó hơn vì cần orchestration        |
| UX                 | Phản hồi nhanh, đơn giản              | Tạo cảm giác "làm việc giúp bạn"   |

## Slide 39 — Hybrid Pattern: Thực Dụng Hơn Cực Đoan
Thiết kế tốt thường là: triage nhanh, câu đơn giản đi chatbot path, câu phức tạp mở agent loop.

## Slide 40 — Lab 3: Chatbot vs [[Agent]] — Hands-on Comparison
- Domain: chuyến bay + thời tiết trong lớp học; e-commerce trong lab.

## Slide 41 — Cách Chạy Lab 3
- Chạy chatbot baseline rồi hiện thực [[ReAct]] loop.

## Slide 42 — Lab #3
Mục tiêu: Build chatbot baseline rồi nâng cấp thành [[ReAct]] agent.

## Slide 43 — Rubric Lab 3 — 100 Điểm
| Hạng mục                             | Điểm   |
|--------------------------------------|--------|
| Chatbot baseline + [[ReAct]] agent   | 16     |
| Cải tiến v1 → v2 từ failure trace    | 12     |
| Trace quality (thành công + lỗi)    | 12     |
| Eval & so sánh chatbot vs agent      | 12     |
| Code quality + telemetry tích hợp     | 8      |
| Đóng góp kỹ thuật + case debug      | 15     |

## Slide 44 — Tổng Kết — Key Takeaways
1. [[Agent]] không phải "chatbot thông minh hơn"; agent = [[LLM]] + reasoning + tools + memory/state.
2. [[ReAct]] = mô hình tư duy (Thought/Action/Observation).
3. Chỉ dùng [[agent]] khi bài toán có [[multi-step reasoning]], [[tool use]], [[dynamic decisions]], [[long horizon]].
4. Đánh giá [[agent]] theo trace (token, latency, loop, error code).
5. [[ReAct]] quay lại xuyên suốt khóa: Ngày 4 (tool contract), Ngày 9 (multi-agent).

## Slide 45 — Tiếp theo & Bài tập
- Đọc lại trace lab hôm nay và tìm 1 chỗ agent ra quyết định chưa tối ưu.
- Thử viết lại tool description theo hướng rõ input, output, và failure mode hơn.

## Slide 46 — Tài Liệu Tham Khảo
1. Yao et al. ReAct: Synergizing Reasoning and Acting in Language Models.
2. Anthropic. Building Effective Agents.
3. OpenAI. Function Calling & Structured Outputs.
4. LangChain. LangGraph v1.0.

## Slide 47 — Hỏi & Đáp
"Use case nào trong công việc của bạn chỉ cần chatbot, và use case nào thực sự cần agent loop?"

## Slide 48 — Cảm ơn!
Email: lecturer@vinuni.edu.vn  
Slides & tài liệu: [GitHub](https://github.com/VinUni-AI20k)  
Lab 3 repo: [GitHub Lab 3](https://github.com/VinUni-AI20k/Day-3-Lab-Chatbot-vs-react-agent)

## Khái niệm chính
- [[Agent]]: hệ thống AI có khả năng tự quyết định, hành động và quan sát.
- [[ReAct]]: kết hợp suy luận từng bước với gọi công cụ và quan sát kết quả.
- [[Agent Loop]]: vòng lặp trong quy trình hoạt động của agent.
- [[Agentic Fit Framework]]: đánh giá tính cần thiết của một agent dựa trên bốn tiêu chí.
- [[Multi-step Reasoning]]: khả năng chia bài toán thành các bước phụ thuộc.
- [[Tool Interaction]]: tương tác cần thiết với các công cụ bên ngoài.
- [[Dynamic Decision]]: khả năng thay đổi quyết định dựa trên quan sát mới.
- [[Long Horizon]]: lưu giữ và hướng đến mục tiêu dài hạn.
- [[text-ReAct]]: cách vận dụng mô hình ngôn ngữ để biểu diễn hành động dưới dạng văn bản.
- [[native tool calling]]: gọi công cụ với cấu trúc dữ liệu đã được định nghĩa rõ ràng.
- [[telemetry]]: thu thập và phân tích dữ liệu về hiệu suất của agent.
- [[rule-based bot]]: bot hoạt động dựa vào các quy tắc cứng.
- [[LLM chatbot]]: chatbot có khả năng tạo ra câu trả lời tự nhiên, nhưng không tự động truy vấn thông tin ngoài.
- [[Reactive Agent]]: agent phản ứng với input của người dùng nhưng không có khả năng tự quyết định.
- [[Autonomous Agent]]: agent có khả năng tự định hướng và thực hiện nhiều quyết định.
```
