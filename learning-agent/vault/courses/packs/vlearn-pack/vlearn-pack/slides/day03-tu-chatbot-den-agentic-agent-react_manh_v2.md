---
course: packs
generated: '2026-07-30T10:29:44+00:00'
lang: vi
lesson: day03-tu-chatbot-den-agentic-agent-react_manh_v2
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/slides/day03-tu-chatbot-den-agentic-agent-react_manh_v2.md
source_hash: sha256:55948caf29821e66f75b837f035bdeedec4d9726f6f49b9857a655d0a1a7d169
type: lesson-note
---

```markdown
# day03 tu chatbot den agentic agent react manh v2

## Slide 1 — Từ Chatbot Đến Agentic Agent
<!-- src: ... -->
AICB-P1 · Ngày 3 · Design Pattern ReAct  
Phạm Mạnh  
VinUniversity · Phase 1 · Tuần 1 · 01/06/2026

## Slide 2 — Nội Dung Bài Học
<!-- src: ... -->
1. 3 Kiểu Hệ Thống AI  
2. Agentic Fit Framework  
3. Kiến Trúc Agent  
4. ReAct Pattern  
5. Agent Loop: Code Anatomy  
6. Live Demo & Debug  
7. Chatbot vs Agent  
8. Lab 3  

## Slide 3 — Mục Tiêu Ngày 3
<!-- src: ... -->
- Phân biệt được [[rule-based-bot]], [[LLM-bot]], và [[agent]]  
- Dùng [[Agentic-Fit]] để biết khi nào nên nâng từ chatbot lên agent  
- Hiểu và giải thích được vòng lặp [[ReAct]]: Thought → Action → Observation  
- Build được ReAct agent đầu tiên với tools, system prompt, và safeguard cơ bản  

## Slide 4 — Deliverable Cuối Ngày
<!-- src: ... -->
- Chatbot baseline + ReAct agent cho cùng một bài toán, kèm trace và flowchart luồng xử lý  
- 5 test cases để so sánh chatbot và agent  
- 1 trace Thought / Action / Observation của agent  
- 1 nhận định rõ: khi nào chatbot đủ, khi nào agent vượt trội  

## Slide 5 — 3 Kiểu Hệ Thống AI
<!-- src: ... -->
Từ bot có rule đến agent có khả năng lập kế hoạch và dùng công cụ  

## Slide 6 — Spectrum: Bot → Chatbot → Agent
<!-- src: ... -->
- [[Rule-based-Bot]]: If/else cứng, predictable  
- [[LLM-Chatbot]]: Trả lời thông minh nhưng chủ yếu 1 lượt  
- [[Reactive-Agent]]: Dùng tools + loop quan sát theo từng bước  
- [[Autonomous-Agent]]: Long-horizon goal nhiều quyết định liên tiếp  
Khả năng thích nghi, tool use, memory, risk tăng dần. Không phải mọi thứ dùng LLM đều là agent. [[Agent]] chỉ xuất hiện khi hệ thống phải quyết định, hành động, quan sát kết quả, rồi lặp lại.  

## Slide 7 — So Sánh 3 Kiểu Hệ Thống AI
<!-- src: ... -->
| Tiêu chí            | Rule-based Bot            | LLM Chatbot               | Agent                       |
|---------------------|--------------------------|--------------------------|-----------------------------|
| Cách xử lý          | If/else cố định          | Sinh câu trả lời tốt theo context  | Plan → act → observe → adapt |
| Flexibility/Memory   | Thấp                      | Trung bình                | Cao                         |
| Tool use           | Hard-coded               | Có thể gọi tool theo chỉ định | Chủ động chọn tool theo bước tiếp theo |
| Cost                | Thấp nhất                | Cao hơn                   | Cao hơn do loop và nhiều calls  |
| Risk                | Logic dễ kiểm soát      | Hallucination / format drift | Hallucination + tool misuse + loop |
| Ví dụ phù hợp      | Menu IVR, form validation| FAQ, support cơ bản     | Booking, research, coding assistant |

## Slide 8 — Ví Dụ Nhanh: Cùng Một Câu Hỏi, 3 Mức Độ Hệ Thống
<!-- src: ... -->
Bài toán: "Tìm vé HAN → HCM dưới 2 triệu, rồi gợi ý mang gì nếu trời mưa."
- Bot có rule: Trả menu lựa chọn cố định, không search được dữ liệu mới, không tổng hợp nhiều điều kiện  
- LLM chatbot: Viết câu trả lời mượt, nhưng không tự truy vấn giá vé thật  
- Reactive agent: Tách goal thành 2 việc: tìm vé + check thời tiết, gọi từng tool theo bước, so sánh kết quả rồi trả lời gộp  
Lưu ý: Nếu bài toán không cần dữ liệu mới, nhiều bước, hay quyết định động, [[agent]] thường là overkill.  

## Slide 9 — Agentic Fit Framework
<!-- src: ... -->
4 tiêu chí để biết bài toán có thật sự cần agent hay không  

## Slide 10 — 4 Tiêu Chí Agentic Fit
<!-- src: ... -->
1. Multi-step Reasoning: Bài toán có cần chia thành nhiều bước phụ thuộc nhau không?  
2. Tool Interaction: Hệ thống có cần gọi search, API, database, calculator, browser, file system...?  
3. Dynamic Decision: Mỗi bước tiếp theo có phụ thuộc vào kết quả vừa quan sát không?  
4. Long Horizon: Hệ thống có phải giữ mục tiêu xuyên suốt qua nhiều vòng lặp hoặc nhiều state không?  
Nếu đa số tiêu chí chỉ ở mức 1–2 tiêu chí, hãy bắt đầu bằng chatbot hoặc workflow đơn giản.  

## Slide 11 — Scoring Matrix: Có Cần Agent Không?
<!-- src: ... -->
| Use case                          | Reasoning | Tool use | Dynamic decision | Tổng |
|-----------------------------------|-----------|----------|------------------|------|
| FAQ nội bộ HR                     | 1         | 1        | 1                | 3    |
| Tóm tắt hợp đồng và highlight risk| 3         | 2        | 2                | 7    |
| Booking assistant du lịch          | 4         | 5        | 4                | 13   |
| Research agent tìm đối thủ cạnh tranh | 4       | 4        | 4                | 12   |
| Code assistant có test & fix loop  | 5         | 5        | 4                | 14   |
Gợi ý đọc điểm: 0–5 = chatbot/rule đủ, 6–10 = augmented chatbot, 11+ = agent đáng thử. Chấm nhanh theo thang 1–5 cho từng tiêu chí.  

## Slide 12 — Anti-Patterns: Khi Dùng Agent Là Sai Bài
<!-- src: ... -->
- Bài toán 1 bước: hỏi đáp, tra FAQ, phân loại cơ bản  
- Không có tool nào để gọi: agent chỉ "suy nghĩ" nhưng không hành động được  
- Mọi thứ phải 100% deterministic: mỗi sai sót đều rất đắt  
- Chi phí latency không chấp nhận được: loop 3–5 bước là đã quá chậm  
Nguyên tắc: luôn benchmark [[rule]] / workflow / chatbot trước khi mở [[agent]] loop.  

## Slide 13 — Case Study: Chatbot Đủ Hay Cần Agent?
<!-- src: ... -->
**Customer FAQ**  
- Câu hỏi lặp lại, intent khá ổn định  
- Chủ yếu retrieve policy rồi trả lời  
- Có thể thêm RAG nhưng chưa cần autonomy  
- Best fit: [[chatbot]] có retrieval  

**Booking Assistant**  
- Nhiều ràng buộc: thời gian, ngân sách, preference  
- Phải search, so sánh, hỏi lại, rồi chốt phương án  
- Bước sau phụ thuộc kết quả bước trước  
- Best fit: [[reactive-agent]] có tool use  

## Slide 14 — Agent Patterns Nên Tăng Dần Theo Nhu Cầu
<!-- src: ... -->
*Augmented LLM* → *Prompt Chaining* → *Routing* → *Orchestrator Worker* → *Agent*  
Bắt đầu từ cấu trúc đơn giản nhất đủ dùng. Agent là pattern mạnh nhưng cũng đắt nhất về cost, eval, guardrails, và vận hành.  

## Slide 15 — Kiến Trúc Agent
<!-- src: ... -->
Perception, reasoning, action, memory và luồng thông tin giữa các khối.  

## Slide 16 — Kiến Trúc Agent: Từ Trong Ra Ngoài
<!-- src: ... -->
- **Perception**: agent nhận text, tool output, feedback  
- **Reasoning**: phân tích trạng thái và chọn bước tiếp theo  
- **Action**: gọi tool hoặc trả lời user  
- **Memory**: giữ goal, facts, và intermediate results  
4 khối kiến trúc thường kéo theo 4 nhóm cost chính: token, storage, API, và latency.  

## Slide 17 — Memory: Short-term vs Long-term
<!-- src: ... -->
**Short-term memory**  
- Nằm trong context window  
- Dùng cho task hiện tại  
- Rẻ để implement, nhưng dễ đầy  
Phù hợp khi: cuộc hội thoại ngắn, goal chỉ kéo dài vài bước  

**Long-term memory**  
- Lưu facts, preferences, hay state ngoài context  
- Có thể là DB, vector store, key-value store  
- Cần retrieval strategy và permission model  

Lưu ý: Không phải thêm memory là agent giỏi hơn. Memory chỉ có ích khi chiến lược đọc/ghi và quyền truy cập được thiết kế rõ.  

## Slide 18 — Tool Calling = Tay Chân Của Agent
<!-- src: ... -->
Chủng trình LLM gọi tool rồi nhận kết quả để trả lời.  
- Tool definitions phải rõ input / output / error mode  
- [[Agent]] mạnh lên nhờ tool, nhưng cũng dễ fail hơn vì external dependency.  

## Slide 19 — ReAct Pattern
<!-- src: ... -->
ReAct = Reasoning + Acting: cách đơn giản nhất để biến LLM thành agent có thể debug được.  

## Slide 20 — Định Nghĩa
<!-- src: ... -->
ReAct là pattern kết hợp suy luận theo từng bước với gọi công cụ và quan sát kết quả.  
- Thought: mình đang thiếu gì, nên làm gì tiếp?  
- Action: gọi tool nào, với tham số nào?  
- Observation: kết quả trả về là gì?  
- Lặp lại đến khi đủ thông tin để trả lời hoặc gặp điều kiện dừng.  

## Slide 21 — ReAct Loop: Thought → Action → Observation
<!-- src: ... -->
Kết thúc vòng lặp với output từ LLM về User Goal.  
ReAct mạnh vì trace lý do hành động được bộc lộ ra ngoài, giúp con người debug và can thiệp dễ hơn so với chỉ nhìn final answer.  

## Slide 22 — Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (1/2)
<!-- src: ... -->
- Thought 1: Tôi cần tìm chuyến bay sáng mai từ HAN tới HCM dưới 2 triệu.  
- Action 1: search_flights(origin="HAN", destination="SGN", date="2026-03-18", max_price=2000000)  
- Observation 1: Có 2 lựa chọn phù hợp: VietJet 06:10 giá 1.75M, Vietnam Airlines 08:20 giá 1.95M.  
- Thought 2: Tôi cần check thời tiết tại HCM.  
- Action 2: get_weather(city="Ho Chi Minh City", date="2026-03-18")  

## Slide 23 — Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (2/2)
<!-- src: ... -->
- Observation 2: Nhiệt độ 27–32C, xác suất mưa 70%.  
- Thought 3: Tôi đã có cả lựa chọn chuyến bay và dữ liệu thời tiết. Có thể kết luận.  
- Final Answer: Gợi ý chuyến 06:10 giá 1.75M; mang áo mỏng, giày dễ khô, ô gập hoặc áo mưa nhẹ.  

## Slide 24 — ReAct Tốt Ở Điểm Nào?
<!-- src: ... -->
### Ưu điểm
- Dễ đọc trace và debug  
- Tự quyết được bước tiếp theo từ observation  
- Phù hợp các bài toán search / booking / investigation / coding  
- Có thể cài safeguard ở từng vòng lặp  

### Giới hạn
- Tốn nhiều token và latency hơn [[chatbot]]  
- Dễ loop hoặc gọi sai tool  
- Cần eval theo trace, không chỉ final answer  
- Không phù hợp bài toán đơn giản hoặc cần deterministic tuyệt đối  

## Slide 25 — Agent Loop: Code Anatomy
<!-- src: ... -->
Từ prompt, tool registry, đến loop control và framework hóa.  

## Slide 26 — Pseudocode: Agent Loop Tối Thiểu
<!-- src: ... -->
```python
messages = []
for step in range(MAX_ITERATIONS):
    output = call_model(system=SYSTEM_PROMPT, messages=messages, tools=TOOLS)
    if output.type == "final_answer":
        return output.content
    result = run_tool(output.name, output.args)
    messages += [output.as_message(), tool_message(output.name, result)]
return "Stopped: max iterations reached"
```

## Slide 27 — System Prompt Cho ReAct Agent
<!-- src: ... -->
```python
SYSTEM_PROMPT = """
You are a travel planning agent.
Your job:
- Break the user goal into smaller steps
- Use tools when fresh information is required
- Think briefly, then choose the best next action
- Stop when you have enough evidence to answer
Rules:
- Never invent tool results
- If a tool fails, explain the failure and try a fallback
- Keep internal thoughts short and actionable
- Output either a tool call or a final answer
"""
```

## Slide 28 — Tool Registry: Khai Báo "Tay Chân" Cho Agent
<!-- src: ... -->
```python
TOOLS = {
    "get_weather": {
        "description": "Weather by city/date",
        "args": ["city", "date"],
    },
    "search_flights": {
        "description": "Flights by route/date/budget",
        "args": ["origin", "destination", "date", "max_price"],
    },
}
```

## Slide 29 — Max Iterations Safeguard: Tránh Agent Đi Vòng
<!-- src: ... -->
### Cần guardrails gì?
- Giới hạn số vòng lặp  
- Timeout cho từng tool  
- Budget token / cost trần  
- Retry có kiểm soát  
- Fallback sang human hoặc chatbot  

### Dấu hiệu loop
- lặp lại cùng một tool call  
- hỏi lại thông tin đã có  
- reasoning không tiến thêm  
- observation không thay đổi nhưng vẫn tiếp tục  

Khi output không tiến triển, cần dừng loop và fallback.  

## Slide 30 — Từ ReAct Đến LangGraph
<!-- src: ... -->
- ReAct loop bằng tay phù hợp để học bản chất  
- LangGraph giúp biểu diễn state, nodes, edges, conditional routing rõ hơn  
- Khi workflow nhiều nhánh hoặc cần persist state, graph approach dễ maintain hơn loop ad-hoc.  

## Slide 31 — Live Demo & Debug
<!-- src: ... -->
Build agent tra cứu thời tiết và gợi ý trang phục ngay trên lớp.  

## Slide 32 — Kịch Bản Live Demo
<!-- src: ... -->
1. Định nghĩa 2 tools: get_weather và recommend_outfit  
2. Viết system prompt: agent chỉ được kết luận khi đã có dữ liệu thời tiết  
3. Chạy loop và đọc trace Thought / Action / Observation  
4. Cố tình tạo lỗi: tool timeout hoặc agent chọn sai outfit  
5. Debug: sửa prompt, sửa tool description, hoặc thêm safeguard  

## Slide 33 — Code Demo: 2 Tool Tối Thiểu
<!-- src: ... -->
```python
def get_weather(city: str, date: str) -> dict:
    return {
        "city": city,
        "date": date,
        "temperature_c": [27, 32],
        "rain_probability": 0.7,
    }

def recommend_outfit(temp_high: int, rain_probability: float) -> str:
    if rain_probability > 0.5:
        return "Ao mong, giay de kho, mang theo o gap."
    if temp_high > 30:
        return "Ao nhe, thoang, uu tien vai cotton."
    return "Trang phuc thoai mai, co the mang ao khoac nhe."
```

## Slide 34 — Debug Checklist Khi Agent Lỗi
<!-- src: ... -->
### Nhìn vào trace trước
- Thought có đúng mục tiêu không?  
- Agent chọn đúng tool chưa?  
- Args truyền vào có hợp lệ không?  
- Observation có bị thiếu field quan trọng không?  

### 4 nơi thường phải sửa
- Tool description quá mơ hồ  
- System prompt thiếu rule dừng  
- Không có safeguard cho retry / loop  
- Evaluation chỉ chấm final answer, không chấm trace  

## Slide 35 — Chatbot vs Agent
<!-- src: ... -->
Khi nào mỗi loại thắng và tại sao hybrid pattern thường thực dụng nhất.  

## Slide 36 — Khi Nào Chatbot Thắng, Khi Nào Agent Thắng?
<!-- src: ... -->
| Khía cạnh             | Chatbot thắng                                  | Agent thắng                |
|-----------------------|------------------------------------------------|----------------------------|
| Tác vụ                | FAQ, support đơn giản, nội dung 1 lượt       | Booking, research, coding, data analysis nhiều bước |
| Tốc độ                | Nhanh, ít round-trip                           | Chậm hơn do loop và tool calls |
| Cost                  | Thấp hơn, predictable hơn                     | Cao hơn nhưng đổi lại xử lý được bài toán khó hơn |
| Kiểm soát             | Dễ hơn, ít state                              | Khó hơn vì cần orchestration và eval theo trace |
| UX                    | Phản hồi nhanh, đơn giản                      | Tạo cảm giác "làm việc giúp bạn" nếu làm tốt |

## Slide 37 — Hybrid Pattern: Thực Dụng Hơn Cực Đoan
<!-- src: ... -->
Không cần chọn một phe. Thiết kế tốt thường là: triage nhanh, câu đơn giản đi chatbot path, câu phức tạp mới mở agent loop.  

## Slide 38 — Thực Hành
<!-- src: ... -->
Lab 3: Chatbot vs Agent — Hands-on Comparison  

## Slide 39 — Cách Chạy Lab 3
<!-- src: ... -->
1. Chọn lại use case từ Ngày 2 hoặc một use case tương đương  
2. Build chatbot baseline cho bài toán đó  
3. Nâng cấp thành ReAct agent có ít nhất 1–2 tools  
4. Chạy 5 test cases giống nhau trên cả hai hệ thống  
5. Vẽ flowchart và ghi nhận nơi agent thực sự tạo thêm giá trị  

## Slide 40 — Lab #3
<!-- src: ... -->
- Mục tiêu: Build chatbot baseline rồi nâng cấp thành ReAct agent cho cùng một use case để so sánh trực tiếp  
- Deliverable: Nộp cuối buổi: chatbot + agent + 5 test cases + 1 trace + 1 flowchart  
- Bonus: thêm fallback path hoặc human escalation  
- Thời gian: 150 phút  

## Slide 41 — Tổng Kết — Key Takeaways
<!-- src: ... -->
1. [[Agent]] không phải "chatbot thông minh hơn"; agent = LLM + reasoning + tools + memory/state  
2. [[ReAct]] là pattern dễ học nhất để biến LLM thành hệ thống biết hành động và dễ debug  
3. Chỉ dùng agent khi bài toán có multi-step reasoning, tool use, dynamic decisions, long horizon  
4. Trong production, guardrails, trace, và evaluation quan trọng không kém model quality  

## Slide 42 — Tiếp theo & Bài tập
<!-- src: ... -->
Prompt Engineering & Tool Calling  
"Ngày mai ta đi sâu hơn vào cách viết system prompt production-grade và mô tả tools để agent dùng đúng ý."  
- Đọc lại trace lab hôm nay và tìm 1 chỗ agent ra quyết định chưa tối ưu  
- Thử viết lại tool description theo hướng rõ input, output, và failure mode hơn  

## Slide 43 — Tài Liệu Tham Khảo
<!-- src: ... -->
1. Yao et al. *ReAct: Synergizing Reasoning and Acting in Language Models*. arXiv:2210.03629, 2023.  
2. Anthropic. *Building effective agents*. anthropic.com/research/building-effective-agents  
3. LangChain / LangGraph docs. *Quickstart and Introduction*. langchain-ai.github.io/langgraph  

## Slide 44 — Hỏi & Đáp
<!-- src: ... -->
Use case nào trong công việc của bạn chỉ cần [[chatbot]], và use case nào thực sự cần [[agent]] loop?  

## Khái niệm chính
- [[agent]]: Hệ thống có khả năng quyết định, hành động, quan sát kết quả và lặp lại.
- [[ReAct]]: Pattern kết hợp suy luận và hành động để tạo ra agent dễ debug.
- [[LLM-Chatbot]]: Chatbot dựa trên mô hình ngôn ngữ lớn, trả lời thông minh nhưng chủ yếu 1 lượt.
- [[rule-based-bot]]: Bot thực hiện dựa trên các điều kiện if/else cứng nhắc.
- [[Agentic-Fit]]: Khung đánh giá xem bài toán có cần agent hay không dựa trên các tiêu chí xác định.
```
