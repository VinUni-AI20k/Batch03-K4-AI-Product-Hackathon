# day03 tu chatbot den agentic agent react manh

## Slide 1

**Nội dung hình ảnh:** Slide tiêu đề với logo VinUniversity ở trên, nền là ảnh chụp toàn cảnh khuôn viên trường VinUniversity từ trên cao, phía dưới có một đường kẻ đỏ ngang phân cách phần tiêu đề và thông tin giảng viên.

Từ Chatbot Đến Agentic Agent
AICB-P1 · Ngày 3 · Design Pattern ReAct
Phạm Mạnh
VinUniversity · Phase 1 · Tuần 1 ·
01/06/2026

## Slide 2

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung.

HÃY SUY NGHĨ...
"ChatGPT là chatbot hay agent?
Siri thì sao? Cursor IDE thì sao?"
Giữ câu hỏi này trong đầu khi học bài hôm nay

## Slide 3

**Nội dung hình ảnh:** Danh sách 8 mục nội dung bài học được trình bày thành hai cột song song (mục 1-4 ở cột trái, mục 5-8 ở cột phải), mỗi mục có số thứ tự màu xanh.

Nội Dung Bài Học
1. 3 Kiểu Hệ Thống AI
2.
Agentic Fit Framework
3.
Kiến Trúc Agent
4.
ReAct Pattern
5.
Agent Loop: Code Anatomy
6.
Live Demo & Debug
7.
Chatbot vs Agent
8.
Lab 3

## Slide 4

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung.

Mục Tiêu Ngày 3
■Phân biệt được rule-based bot, LLM chatbot, và agent
■Dùng Agentic Fit để biết khi nào nên nâng từ chatbot lên agent
■Hiểu và giải thích được vòng lặp ReAct: Thought → Action → Observation
■Build được ReAct agent đầu tiên với tools, system prompt, và safeguard cơ
bản

## Slide 5

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung. Có một khối nổi bật (highlight box) chứa câu mô tả deliverable chính.

Deliverable Cuối Ngày
Chatbot baseline + ReAct agent cho cùng một bài toán, kèm trace và
flowchart luồng xử lý
■5 test cases để so sánh chatbot và agent
■1 trace Thought / Action / Observation của agent
■1 nhận định rõ: khi nào chatbot đủ, khi nào agent vượt trội

## Slide 6

**Nội dung hình ảnh:** Slide phân cách chương (section divider) nền xanh đậm, chỉ có tiêu đề và mô tả ngắn, không có sơ đồ minh họa.

3 Kiểu Hệ Thống AI
Từ bot có rule đến agent có khả năng lập kế hoạch
và dùng công cụ

## Slide 7

**Nội dung hình ảnh:** Sơ đồ 4 hộp nối tiếp nhau bằng mũi tên minh họa quang phổ (spectrum) từ trái sang phải: "Rule-based Bot" (xám) → "LLM Chatbot" (xanh dương) → "Reactive Agent" (đỏ) → "Autonomous Agent" (xanh lá), phía trên có chú thích "Khả năng thích nghi, tool use, memory, risk tăng dần" thể hiện mức độ phức tạp tăng dần từ trái qua phải.

Spectrum: Bot → Chatbot → Agent
Rule-based
Bot
If/else
cứng
predictable
LLM
Chatbot
Trả lời thông minh
nhưng chủ yếu 1
lượt
Reactive
Agent
Dùng tools + loop
quan sát theo từng bước
Autonomous
Agent
Long-horizon goal
nhiều quyết định liên
tiếp
Khả năng thích nghi, tool use, memory, risk tăng dần
Không phải mọi thứ dùng LLM đều là agent. Agent chỉ xuất hiện khi hệ
thống phải quyết định, hành động, quan sát kết quả, rồi lặp lại.

## Slide 8

**Nội dung hình ảnh:** Bảng so sánh dạng lưới với 3 cột (Rule-based Bot, LLM Chatbot, Agent) và 6 hàng tiêu chí (Cách xử lý, Flexibility Memory, Tool use, Cost, Risk, Ví dụ phù hợp), giúp so sánh trực quan đặc điểm của từng loại hệ thống.

So Sánh 3 Kiểu Hệ Thống AI
Tiêu chí
Rule-based Bot
LLM Chatbot
Agent
Cách xử lý
If/else cố định
Sinh câu trả lời tốt
theo context
Trung bình
Ngắn hạn trong
con-text
Plan → act → observe →
adapt
Cao
Ngắn hạn + có thể thêm
long-term memory
Chủ động chọn tool theo
bước tiếp theo
Cao hơn do loop và nhiều
calls
Hallucination + tool misuse +
loop
Booking,  research, coding
assistant
Flexibility Memory
Thấp
Gần như không có
Tool use
Hard-coded
Có thể gọi tool theo
chỉ định
Trung bình
Cost
Thấp nhất
Risk
Logic dễ kiểm soát
Hallucination / for-mat
drift
FAQ, support cơ bản
Ví dụ phù hợp
Menu IVR, form
validation
So sánh trực quan để chọn đúng mức độ phức tạp

## Slide 9

**Nội dung hình ảnh:** Slide chia làm 3 cột song song minh họa cùng một bài toán được xử lý bởi 3 loại hệ thống (Bot có rule, LLM chatbot, Reactive agent), mỗi cột liệt kê các gạch đầu dòng đặc trưng của cách xử lý; phía dưới có khối lưu ý màu hồng nhạt.

Ví Dụ Nhanh: Cùng Một Câu Hỏi, 3 Mức Độ Hệ Thống
Bài toán: "Tìm vé HAN → HCM dưới 2
triệu, rồi gợi ý mang gì nếu trời mưa."
Bot có rule
■Trả menu lựa chọn cố định
■Không search được dữ liệu mới
■Không tổng hợp nhiều điều kiện
LLM chatbot
■Viết câu trả lời mượt
■Nhưng không tự truy vấn giá vé thật
Reactive agent
■Tách goal thành 2 việc: tìm vé
+ check thời tiết
■Gọi từng tool theo bước
■So sánh kết quả rồi trả lời gộp
Lưu ý: Nếu bài toán không cần dữ liệu mới, nhiều bước, hay quyết định
động, agent thường là overkill.

## Slide 10

**Nội dung hình ảnh:** Slide phân cách chương nền xanh đậm, chỉ có tiêu đề và mô tả ngắn, không có sơ đồ minh họa.

Agentic Fit Framework
4 tiêu chí để biết bài toán có thật sự cần agent hay không

## Slide 11

**Nội dung hình ảnh:** Lưới 4 thẻ (card) 2x2 minh họa 4 tiêu chí Agentic Fit: "1. Multi-step Reasoning" và "3. Dynamic Decision" ở hàng trên (thẻ viền xanh và đỏ), "2. Tool Interaction" và "4. Long Horizon" ở hàng dưới, mỗi thẻ có tiêu đề màu và câu hỏi gợi ý bên dưới.

4 Tiêu Chí Agentic Fit
1. Multi-step Reasoning
Bài toán có cần chia thành nhiều bước phụ
thuộc nhau không?
2. Tool Interaction
Hệ thống có cần gọi search, API, database,
calculator, browser, file system...?
3. Dynamic Decision
Mỗi bước tiếp theo có phụ thuộc vào kết
quả vừa quan sát không?
4. Long Horizon
Hệ thống có phải giữ mục tiêu xuyên suốt qua
nhiều vòng lặp hoặc nhiều state không?
Nếu đa số tiêu chí chỉ ở mức 1–2/5, hãy bắt đầu bằng chatbot hoặc
workflow đơn giản.

## Slide 12

**Nội dung hình ảnh:** Bảng scoring matrix với các cột Use case, Reasoning, Tool use, Dynamic decision, Tổng; liệt kê 5 use case mẫu (FAQ nội bộ HR, Tóm tắt hợp đồng, Booking assistant, Research agent, Code assistant) kèm điểm số 1-5 cho từng tiêu chí và tổng điểm, minh họa cách chấm điểm để quyết định có cần agent hay không.

Scoring Matrix: Có Cần Agent Không?
Use case
Reasoning
Tool use
Dynamic
sion
deci-
Tổng
FAQ nội bộ HR
1
1
1
3
Tóm tắt hợp đồng và
highlight risk
3
2
2
7
Booking assistant du
lịch
4
5
4
13
Research agent tìm
đối thủ cạnh tranh
4
4
4
12
Code assistant có test
& fix loop
5
5
4
14
Gợi ý đọc điểm: 0–5 = chatbot/rule đủ  6–10 = augmented chatbot  11+ = agent đáng thử
Chấm nhanh theo thang 1–5 cho từng tiêu chí
Giảng viên
(Vi U i)
AICB · Ngày
3
17/03/2026  8 / 34

## Slide 13

**Nội dung hình ảnh:** Danh sách 4 anti-pattern có icon ô vuông (checkbox) đứng trước mỗi gạch đầu dòng, và một icon bút/checkmark trước phần "Nguyên tắc" ở khối nổi bật cuối slide.

Anti-Patterns: Khi Dùng Agent Là Sai Bài
□
Bài toán 1 bước: hỏi đáp, tra FAQ, phân loại cơ bản
□
Không có tool nào để gọi: agent chỉ "suy nghĩ" nhưng không hành động
được
□
Mọi thứ phải 100% deterministic: mỗi sai sót đều rất đắt
□
Chi phí latency không chấp nhận được: loop 3–5 bước là đã quá chậm
□
✓
Nguyên tắc: luôn benchmark rule / workflow / chatbot trước khi mở agent
loop
Giảng viên
(Vi U i)
AICB · Ngày
3
17/03/2026  9 / 34

## Slide 14

**Nội dung hình ảnh:** Hai thẻ (card) đặt cạnh nhau: thẻ trái tiêu đề xanh dương "Customer FAQ", thẻ phải tiêu đề đỏ "Booking Assistant", mỗi thẻ liệt kê đặc điểm và kết luận "Best fit" tương ứng, minh họa so sánh trực quan hai case study.

Case Study: Chatbot Đủ Hay Cần Agent?
Customer FAQ
■Câu hỏi lặp lại, intent khá ổn định
■Chủ yếu retrieve policy rồi trả lời
■Có thể thêm RAG nhưng chưa
cần autonomy
■Best fit: chatbot có retrieval
Booking Assistant
■Nhiều ràng buộc: thời gian, ngân
sách, preference
■Phải search, so sánh, hỏi lại, rồi
chốt phương án
■Bước sau phụ thuộc kết quả bước
trước
■Best fit: reactive agent có tool
use

## Slide 15

**Nội dung hình ảnh:** Sơ đồ 5 hộp nối tiếp bằng mũi tên theo chiều tăng dần độ phức tạp: "Augmented LLM" → "Prompt Chaining" → "Routing" → "Orchestrator Worker" → "Agent" (màu xanh lá), mỗi hộp có mô tả ngắn bên dưới, thể hiện các pattern agent nên áp dụng tăng dần theo nhu cầu.

Agent Patterns Nên Tăng Dần Theo Nhu Cầu
Augmented
LLM
Prompt +
docs + tools
Prompt
Chaining
Bước nối
tiếp rõ ràng
Routing
Chọn path
/ specialist
Orchestrator
Worker
Phân việc
rồi tổng hợp
Agent
Tự quyết nhiều bước
Bắt đầu từ cấu trúc đơn giản nhất đủ dùng. Agent là pattern mạnh
nhưng cũng đắt nhất về cost, eval, guardrails, và vận hành.
Giảng viên
(Vi U i)
AICB · Ngày
3
17/03/2026  11 / 34

## Slide 16

**Nội dung hình ảnh:** Slide phân cách chương nền xanh đậm, chỉ có tiêu đề và mô tả ngắn, không có sơ đồ minh họa.

Kiến Trúc Agent
Perception, reasoning, action, memory và luồng thông
tin giữa các khối

## Slide 17

**Nội dung hình ảnh:** Sơ đồ kiến trúc dạng hub-and-spoke: khối trung tâm "Reasoning – LLM Core" nối hai chiều bằng mũi tên với 4 khối xung quanh — "Perception (User input, Tool results)" và "Action (API/Search, Final answer)" ở trên, "Short-term Memory (Context window)" và "Long-term Memory (Store/DB)" ở dưới; phía trên có chú thích "Input từ môi trường".

Kiến Trúc Agent: Từ Trong Ra Ngoài
Reasoning
LLM Core
Perception
User input
Tool results
Action API /
Search Final
answer
Short-term Memory
Context window
Long-term
Memory Store
/ DB
Input từ môi trường
State và memory giúp agent không "mất mạch"
■
Perception: agent nhận text,
tool output, feedback
■
Reasoning: phân tích trạng thái
và chọn bước tiếp theo
■
Action: gọi tool hoặc trả lời
user
■
Memory: giữ goal, facts, và
intermediate results
4 khối kiến trúc thường kéo theo 4 nhóm cost chính: token, storage, API, và latency.

## Slide 18

**Nội dung hình ảnh:** Hai cột song song so sánh Short-term memory và Long-term memory, mỗi cột có gạch đầu dòng đặc điểm và điều kiện phù hợp; phía dưới có khối lưu ý màu hồng nhạt.

Memory: Short-term vs Long-term
Short-term memory
■Nằm trong context window
■Dùng cho task hiện tại
■Rẻ để implement, nhưng dễ
đầy
Phù hợp khi
■Cuộc hội thoại ngắn
■Goal chỉ kéo dài vài bước
Long-term memory
■Lưu facts, preferences, hay
state ngoài context
■Có thể là DB, vector
store, key-value store
■Cần retrieval strategy
và permission model
Lưu ý: Không phải thêm memory là agent giỏi hơn. Memory chỉ có ích
khi chiến lược đọc/ghi và quyền truy cập được thiết kế rõ.

## Slide 19

**Nội dung hình ảnh:** Sơ đồ luồng dạng vòng khép kín: "User Goal" → "LLM" → "Tool Call" → "API/DB/Search", với nhãn "JSON/args" trên mũi tên đi ra và "observation" trên đường vòng quay lại LLM, và "final answer" từ LLM vòng lại User Goal, minh họa vòng lặp gọi công cụ của agent.

Tool Calling = Tay Chân Của Agent
User Goal
LLM
Tool Call
API / DB / Search
JSON /
args
observation
final
answer
■Tool definitions phải rõ input / output / error mode
■Agent mạnh lên nhờ tool, nhưng cũng dễ fail hơn vì external dependency
■Tool calling là cầu nối giữa reasoning trong model và hành động ngoài thế
giới thực

## Slide 20

**Nội dung hình ảnh:** Slide phân cách chương nền xanh đậm, chỉ có tiêu đề và mô tả ngắn, không có sơ đồ minh họa.

ReAct Pattern
Reasoning + Acting: cách đơn giản nhất để biến
LLM thành agent có thể debug được

## Slide 21

**Nội dung hình ảnh:** Slide chỉ có text trong một khối nổi bật, không có sơ đồ minh họa bổ sung.

Định Nghĩa
ReAct = Reasoning + Acting
ReAct là pattern kết hợp suy luận theo từng bước với gọi công cụ và quan sát
kết quả. Thay vì trả lời ngay, agent sẽ lặp qua các bước:
■Thought: mình đang thiếu gì, nên làm gì tiếp?
■Action: gọi tool nào, với tham số nào?
■Observation: kết quả trả về là gì?
■Lặp lại đến khi đủ thông tin để trả lời hoặc gặp điều kiện dừng

## Slide 22

**Nội dung hình ảnh:** Sơ đồ vòng lặp ReAct: "User Input" → "Thought phân tích bước tiếp" → "Action tool_name(args)" → "Observation kết quả tool", với mũi tên cong "chưa đủ" quay ngược từ Observation về Thought (lặp lại), và mũi tên "đủ" đi xuống "Final Answer" khi đủ thông tin.

ReAct Loop: Thought → Action → Observation
User Input
Thought phân tích
bước tiếp
Action
tool_name(args)
Observation
kết quả tool
Final Answer
chưa đủ
đủ
ReAct mạnh vì trace lý do hành động được bộc lộ ra ngoài, giúp con người debug
và can thiệp dễ hơn so với chỉ nhìn final answer.

## Slide 23

**Nội dung hình ảnh:** Ba khối trace được đóng khung riêng biệt (Thought 1/Action 1 viền đỏ nhạt, Observation 1 viền xám, Thought 2/Action 2 viền đỏ nhạt) minh họa các bước đầu của một trace ReAct thực tế.

Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (1/2)
Thought 1: Tôi cần tìm chuyến bay sáng mai từ HAN tới HCM dưới 2 triệu.
Action 1: search_flights(origin="HAN", destination="SGN", date="2026-03-18",
max_price=2000000)
Observation 1: Có 2 lựa chọn phù hợp: VietJet 06:10 giá 1.75M, Vietnam Airlines 08:20
giá 1.95M.
Thought 2: User cũng hỏi về trang phục nếu trời mưa. Tôi cần check thời tiết tại HCM.
Action 2: get_weather(city="Ho Chi Minh City", date="2026-03-18")

## Slide 24

**Nội dung hình ảnh:** Ba khối trace được đóng khung riêng biệt (Observation 2 viền xám, Thought 3 viền đỏ nhạt, Final Answer viền xanh lá) minh họa phần kết của trace ReAct, cho thấy kết luận cuối cùng dựa trên các quan sát trước đó.

Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (2/2)
Observation 2: Nhiệt độ 27–32C, xác suất mưa 70%.
Thought 3: Tôi đã có cả lựa chọn chuyến bay và dữ liệu thời tiết. Có thể kết luận.
Final Answer: Gợi ý chuyến 06:10 giá 1.75M; mang áo mỏng, giày dễ khô, ô gập hoặc áo
mưa nhẹ.
Điểm mạnh không chỉ là answer tốt hơn, mà là con người nhìn được agent đã hành động
dựa trên quan sát nào.

## Slide 25

**Nội dung hình ảnh:** Hai cột song song "Ưu điểm" và "Giới hạn" liệt kê gạch đầu dòng đối lập nhau về ReAct pattern; phía dưới có khối lưu ý màu hồng nhạt.

ReAct Tốt Ở Điểm Nào?
Ưu điểm
■Dễ đọc trace và debug
■Tự quyết được bước tiếp theo từ
observation
■Phù hợp các bài toán search /
booking / investigation / coding
■Có thể cài safeguard ở từng vòng
lặp
Giới hạn
■Tốn nhiều token và latency hơn
chatbot
■Dễ loop hoặc gọi sai tool
■Cần eval theo trace, không chỉ
final answer
■Không phù hợp bài toán đơn giản
hoặc cần deterministic tuyệt đối
Lưu ý: ReAct dễ bắt đầu nhất, nhưng khi hệ thống nhiều nhánh hơn, nên chuyển
sang graph/state machine rõ ràng.

## Slide 26

**Nội dung hình ảnh:** Slide phân cách chương nền xanh đậm, chỉ có tiêu đề và mô tả ngắn, không có sơ đồ minh họa.

Agent Loop:  Code Anatomy
Từ prompt, tool registry, đến loop control và
framework hóa

## Slide 27

**Nội dung hình ảnh:** Khối code Python (nền đen, chữ có màu cú pháp) hiển thị pseudocode của vòng lặp agent tối thiểu: khởi tạo messages, vòng lặp for với MAX_ITERATIONS gọi model, kiểm tra loại output final_answer, chạy tool và nối kết quả vào messages, trả về thông báo dừng khi hết số vòng lặp cho phép.

Pseudocode: Agent Loop Tối Thiểu
messages = []
for step in range(MAX_ITERATIONS):
output = call_model(
system=SYSTEM_PROMPT,
messages=messages,
tools=TOOLS,
)
if output.type == "final_answer":
return output.content
result = run_tool(output.name, output.args)
messages += [
output.as_message(),
tool_message(output.name, result),
]
return "Stopped: max iterations reached"

## Slide 28

**Nội dung hình ảnh:** Khối code (nền đen) hiển thị chuỗi SYSTEM_PROMPT mẫu cho travel planning agent, gồm phần "Your job" liệt kê nhiệm vụ và phần "Rules" liệt kê quy tắc ràng buộc hành vi của agent.

System Prompt Cho ReAct Agent
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

## Slide 29

**Nội dung hình ảnh:** Khối code (nền đen) hiển thị dictionary TOOLS khai báo 2 tool "get_weather" và "search_flights", mỗi tool có description và danh sách args tương ứng.

Tool Registry: Khai Báo "Tay Chân" Cho Agent
TOOLS = {
"get_weather": {
"description": "Weather by city/date",
"args": ["city", "date"],
},
"search_flights": {
"description": "Flights by route/date/budget"
,
"args": ["origin", "destination", "date", "max_price"],
},
}

## Slide 30

**Nội dung hình ảnh:** Hai cột song song "Cần guardrails gì?" và "Dấu hiệu loop" liệt kê gạch đầu dòng; phía dưới có khối lưu ý màu xanh nhạt tóm tắt khi nào cần dừng loop.

Max Iterations Safeguard: Tránh Agent Đi Vòng
Cần guardrails gì?
■Giới hạn số vòng lặp
■Timeout cho từng tool
■Budget token / cost trần
■Retry có kiểm soát
■Fallback sang human hoặc
chatbot
Dấu hiệu loop
■lặp lại cùng một tool call
■hỏi lại thông tin đã có
■reasoning không tiến thêm
■observation không thay đổi nhưng
vẫn tiếp tục
Khi output không tiến triển, cùng một tool bị gọi lặp lại, hoặc observation không đổi
mà agent vẫn tiếp tục, cần dừng loop và fallback.

## Slide 31

**Nội dung hình ảnh:** Sơ đồ luồng LangGraph gồm 5 khối nối tiếp: "State Input" → "LLM Node" → "Tool Node" → "Conditional Edge" → "Final Answer", với nhãn "tool call" và "observation" trên các mũi tên, cùng một mũi tên cong "continue" quay ngược từ Conditional Edge về LLM Node và nhãn "done" đi tới Final Answer.

Từ ReAct Đến LangGraph
State Input
LLM Node
Tool Node
Final Answer
tool call
observation Conditional
Edge
continue
done
■ReAct loop bằng tay phù hợp để học bản chất
■LangGraph giúp biểu diễn state, nodes, edges, conditional routing rõ hơn
■Khi workflow nhiều nhánh hoặc cần persist state, graph approach dễ
maintain hơn loop ad-hoc

## Slide 32

**Nội dung hình ảnh:** Slide phân cách chương nền xanh đậm, chỉ có tiêu đề và mô tả ngắn, không có sơ đồ minh họa.

Live Demo & Debug
Build agent tra cứu thời tiết và gợi ý trang phục ngay trên lớp

## Slide 33

**Nội dung hình ảnh:** Danh sách 5 bước có số thứ tự minh họa kịch bản live demo; phía dưới có khối lưu ý màu xanh nhạt.

Kịch Bản Live Demo
1. Định nghĩa 2 tools: get_weather và recommend_outfit
2.
Viết system prompt: agent chỉ được kết luận khi đã có dữ liệu thời tiết
3.
Chạy loop và đọc trace Thought / Action / Observation
4.
Cố tình tạo lỗi: tool timeout hoặc agent chọn sai outfit
5.
Debug: sửa prompt, sửa tool description, hoặc thêm safeguard
Cho học viên thấy agent fail ở đâu và vì sao trace lại quan trọng hơn một final
answer "trông có vẻ đúng".

## Slide 34

**Nội dung hình ảnh:** Khối code Python (nền đen) hiển thị định nghĩa 2 hàm: get_weather trả về dict thông tin thời tiết, và recommend_outfit trả về chuỗi gợi ý trang phục dựa trên nhiệt độ và xác suất mưa.

Code Demo: 2 Tool Tối Thiểu
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

## Slide 35

**Nội dung hình ảnh:** Hai cột song song "Nhìn vào trace trước" và "4 nơi thường phải sửa" liệt kê gạch đầu dòng; phía dưới có khối lưu ý màu hồng nhạt.

Debug Checklist Khi Agent Lỗi
Nhìn vào trace trước
■Thought có đúng mục tiêu không?
■Agent chọn đúng tool chưa?
■Args truyền vào có hợp lệ không?
■Observation có bị thiếu field quan
trọng không?
4 nơi thường phải sửa
■Tool description quá mơ hồ
■System prompt thiếu rule dừng
■Không có safeguard cho retry /
loop
■Evaluation chỉ chấm final answer,
không chấm trace
Lưu ý: Agent debugging gần với debugging distributed system hơn là chỉ prompt
tuning. Ta phải nhìn cả model, tool, state, và orchestration.

## Slide 36

**Nội dung hình ảnh:** Slide phân cách chương nền xanh đậm, chỉ có tiêu đề và mô tả ngắn, không có sơ đồ minh họa.

Chatbot vs Agent
Khi nào mỗi loại thắng và tại sao hybrid pattern thường thực
dụng nhất

## Slide 37

**Nội dung hình ảnh:** Bảng so sánh 3 cột (Khía cạnh, Chatbot thắng, Agent thắng) với 5 hàng tiêu chí (Tác vụ, Tốc độ, Cost, Kiểm soát, UX) minh họa khi nào nên chọn chatbot và khi nào nên chọn agent.

Khi Nào Chatbot Thắng, Khi Nào Agent Thắng?
Khía cạnh
Chatbot thắng
Agent thắng
Tác vụ
FAQ, support đơn giản, nội
dung 1 lượt
Nhanh, ít round-trip
Booking, research, coding, data
analysis nhiều bước
Chậm hơn do loop và tool calls
Cao hơn nhưng đổi lại xử lý được
bài toán khó hơn
Khó hơn vì cần orchestration và
eval theo trace
Tạo cảm giác "làm việc giúp bạn"
nếu làm tốt
Tốc độ
Cost
Thấp hơn, predictable hơn
Kiểm soát
Dễ hơn, ít state
UX
Phản hồi nhanh, đơn giản
Bắt đầu bằng chatbot là lựa chọn mặc định tốt

## Slide 38

**Nội dung hình ảnh:** Sơ đồ luồng phân nhánh: "User Query" → "Intent / Triage", từ đó rẽ nhánh "simple" đi tới "Simple Chatbot path" (xanh dương) và nhánh "multi-step" đi tới "Agent path" (xanh lá), rồi "fallback" từ Agent path tới "Human / Escalation" (đỏ), minh họa hybrid pattern kết hợp chatbot và agent.

Hybrid Pattern: Thực Dụng Hơn Cực Đoan
User Query
Intent / Triage
Simple Chatbot
path
Agent
path
Human / Escalation
simple
multi-step
fallback
Không cần chọn một phe. Thiết kế tốt thường là: triage nhanh, câu đơn giản đi
chatbot path, câu phức tạp mới mở agent loop.

## Slide 39

**Nội dung hình ảnh:** Slide phân cách chương nền xanh đậm, chỉ có tiêu đề và mô tả ngắn, không có sơ đồ minh họa.

Thực Hành
Lab 3: Chatbot vs Agent — Hands-on Comparison

## Slide 40

**Nội dung hình ảnh:** Danh sách 5 bước có số thứ tự hướng dẫn cách chạy Lab 3; phía dưới có khối lưu ý màu xanh nhạt.

Cách Chạy Lab 3
1. Chọn lại use case từ Ngày 2 hoặc một use case tương đương
2.
Build chatbot baseline cho bài toán đó
3.
Nâng cấp thành ReAct agent có ít nhất 1–2 tools
4.
Chạy 5 test cases giống nhau trên cả hai hệ thống
5.
Vẽ flowchart và ghi nhận nơi agent thực sự tạo thêm giá trị
Nhờ AI generate scaffolding code, nhưng nhóm phải tự sửa system prompt, tool
description, và điều kiện dừng.

## Slide 41

**Nội dung hình ảnh:** Slide chỉ có text trong một khối nổi bật liệt kê Mục tiêu, Deliverable, Bonus, Thời gian của Lab #3, không có sơ đồ minh họa bổ sung.

Lab #3
Mục tiêu: Build chatbot baseline rồi nâng cấp thành ReAct agent cho cùng một use
case để so sánh trực tiếp
Deliverable: Nộp cuối buổi: chatbot + agent + 5 test cases + 1 trace + 1 flowchart
Bonus: thêm fallback path hoặc human escalation
Thời gian: 150 phút

## Slide 42

**Nội dung hình ảnh:** 4 khối nội dung xếp dọc, mỗi khối có một số thứ tự trong vòng tròn xanh đậm (1, 2, 3, 4) đứng trước, tóm tắt 4 key takeaway của bài học.

Tổng Kết — Key Takeaways
1
Agent không phải "chatbot thông minh hơn"; agent = LLM + reasoning + tools +
memory/state
2
ReAct là pattern dễ học nhất để biến LLM thành hệ thống biết hành động và dễ
debug
3
Chỉ dùng agent khi bài toán có multi-step reasoning, tool use, dynamic
decisions, long horizon
4
Trong production, guardrails, trace, và evaluation quan trọng không kém model
quality

## Slide 43

**Nội dung hình ảnh:** Hai cột: cột trái là khối hồng nhạt chứa tên chủ đề buổi học tiếp theo và trích dẫn in nghiêng; cột phải liệt kê 2 gạch đầu dòng bài tập cần làm.

Tiếp theo & Bài tập
Prompt Engineering & Tool Calling
"Ngày mai ta đi sâu hơn vào cách viết
system prompt production-grade và mô
tả tools để agent dùng đúng ý."
■Đọc lại trace lab hôm nay và tìm 1
chỗ agent ra quyết định chưa tối
ưu
■Thử viết lại tool description theo
hướng rõ input, output, và failure
mode hơn

## Slide 44

**Nội dung hình ảnh:** Slide chỉ có text, danh sách 3 tài liệu tham khảo có số thứ tự màu xanh, không có sơ đồ minh họa.

Tài Liệu Tham Khảo
1 Yao et al. ReAct: Synergizing Reasoning and Acting in Language Models. arXiv:2210.03629,
2023.
2 Anthropic. Building effective agents. anthropic.com/research/building-effective-agents
3 LangChain / LangGraph docs. Quickstart and Introduction. langchain-ai.github.io/langgraph

## Slide 45

**Nội dung hình ảnh:** Slide kết thúc nền xanh đậm với tiêu đề lớn có gạch chân, chỉ có text, không có sơ đồ minh họa.

Hỏi & Đáp
Use case nào trong công việc của bạn chỉ cần chatbot, và use case nào thực
sự cần agent loop?
