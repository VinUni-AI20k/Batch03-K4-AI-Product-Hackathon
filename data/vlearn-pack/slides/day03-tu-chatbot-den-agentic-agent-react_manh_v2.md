# day03 tu chatbot den agentic agent react manh v2

## Slide 1

**Nội dung hình ảnh:** Slide bìa với logo VinUniversity, ảnh nền là khuôn viên trường VinUniversity nhìn từ trên cao (tòa nhà chính và quảng trường), phủ lớp overlay màu xanh; có một đường kẻ đỏ ngang phân cách phần tiêu đề và phần tác giả.

Từ Chatbot Đến Agentic Agent
AICB-P1 · Ngày 3 · Design Pattern ReAct
Phạm Mạnh
VinUniversity · Phase 1 · Tuần 1 ·
01/06/2026

## Slide 2

**Nội dung hình ảnh:** Danh sách 8 mục nội dung được trình bày thành 2 cột (mục 1-4 bên trái, mục 5-8 bên phải), có logo VinUniversity ở góc trên phải.

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

## Slide 3

**Nội dung hình ảnh:** Slide chỉ có text (danh sách gạch đầu dòng các mục tiêu học), không có sơ đồ/hình minh họa bổ sung ngoài tiêu đề có gạch chân đỏ và logo VinUniversity.

Mục Tiêu Ngày 3
■Phân biệt được rule-based bot, LLM bot, và agent
■Dùng Agentic Fit để biết khi nào nên nâng từ chatbot lên agent
■Hiểu và giải thích được vòng lặp ReAct: Thought → Action → Observation
■Build được ReAct agent đầu tiên với tools, system prompt, và safeguard cơ bản

## Slide 4

**Nội dung hình ảnh:** Một khối hộp nhấn mạnh (highlight box viền xanh bên trái, nền xanh nhạt) chứa câu deliverable chính, phía dưới là danh sách gạch đầu dòng 3 deliverable cụ thể.

Deliverable Cuối Ngày
Chatbot baseline + ReAct agent cho cùng một bài toán, kèm trace và flowchart
luồng xử lý
■5 test cases để so sánh chatbot và agent
■1 trace Thought / Action / Observation của agent
■1 nhận định rõ: khi nào chatbot đủ, khi nào agent vượt trội

## Slide 5

**Nội dung hình ảnh:** Slide tiêu đề chuyển chương (section divider), nền xanh đậm đồng nhất với thanh kẻ đỏ ở đáy, không có sơ đồ minh họa.

3 Kiểu Hệ Thống AI
Từ bot có rule đến agent có khả năng lập kế hoạch và dùng
công cụ

## Slide 6

**Nội dung hình ảnh:** Sơ đồ 4 khối màu nối tiếp nhau bằng mũi tên, thể hiện phổ (spectrum) từ trái sang phải: Rule-based Bot (xám) → LLM Chatbot (xanh dương) → Reactive Agent (đỏ) → Autonomous Agent (xanh lá), phía trên có chú thích "Khả năng thích nghi, tool use, memory, risk tăng dần" cho thấy mức độ phức tạp/rủi ro tăng dần từ trái qua phải.

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

## Slide 7

**Nội dung hình ảnh:** Bảng so sánh dạng lưới với 4 cột (Tiêu chí, Rule-based Bot, LLM Chatbot, Agent) và 6 hàng tiêu chí (Cách xử lý, Flexibility/Memory, Tool use, Cost, Risk, Ví dụ phù hợp), giúp đối chiếu trực quan đặc điểm của từng loại hệ thống theo hàng ngang.

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

## Slide 8

**Nội dung hình ảnh:** Bố cục 3 cột song song (Bot có rule, LLM chatbot, Reactive agent) mỗi cột có danh sách gạch đầu dòng riêng, minh họa cùng một bài toán được xử lý khác nhau ở 3 mức độ hệ thống; phía dưới có hộp cảnh báo màu hồng nhạt.

Ví Dụ Nhanh: Cùng Một Câu Hỏi, 3 Mức Độ Hệ Thống
Bài toán: "Tìm vé HAN → HCM dưới 2 triệu, rồi
gợi ý mang gì nếu trời mưa."
Bot có rule
■Trả menu lựa chọn cố định
■Không search được dữ liệu mới
■Không tổng hợp nhiều điều kiện
LLM chatbot
■Viết câu trả lời mượt
■Nhưng không tự truy vấn giá vé thật
Reactive agent
■Tách goal thành 2 việc: tìm vé +
check thời tiết
■Gọi từng tool theo bước
■So sánh kết quả rồi trả lời gộp
Lưu ý: Nếu bài toán không cần dữ liệu mới, nhiều bước, hay quyết định động,
agent thường là overkill.

## Slide 9

**Nội dung hình ảnh:** Slide tiêu đề chuyển chương (section divider), nền xanh đậm đồng nhất, không có sơ đồ minh họa.

Agentic Fit Framework
4 tiêu chí để biết bài toán có thật sự cần agent hay không

## Slide 10

**Nội dung hình ảnh:** Lưới 4 thẻ (card) 2x2, mỗi thẻ có tiêu đề màu khác nhau (2 thẻ xanh dương: Multi-step Reasoning, Tool Interaction; 2 thẻ đỏ: Dynamic Decision, Long Horizon) chứa câu hỏi gợi mở tương ứng, phía dưới là hộp khuyến nghị màu xanh nhạt.

4 Tiêu Chí Agentic Fit
1. Multi-step Reasoning
Bài toán có cần chia thành nhiều bước phụ thuộc
nhau không?
2. Tool Interaction
Hệ thống có cần gọi search, API, database,
calculator, browser, file system...?
3. Dynamic Decision
Mỗi bước tiếp theo có phụ thuộc vào kết quả vừa
quan sát không?
4. Long Horizon
Hệ thống có phải giữ mục tiêu xuyên suốt qua nhiều
vòng lặp hoặc nhiều state không?
Nếu đa số tiêu chí chỉ ở mức 1–2 tiêu chí, hãy bắt đầu bằng chatbot hoặc workflow
đơn giản.

## Slide 11

**Nội dung hình ảnh:** Bảng chấm điểm (scoring matrix) với các cột Use case, Reasoning, Tool use, Dynamic decision, Tổng, liệt kê 5 use case ví dụ (FAQ nội bộ HR, Tóm tắt hợp đồng, Booking assistant du lịch, Research agent, Code assistant) kèm điểm số minh họa cách áp dụng thang điểm để quyết định mức độ cần agent; có thanh footer thông tin giảng viên/ngày ở đáy slide.

Scoring Matrix: Có Cần Agent Không?
Use case
Reasoning
Tool use
Dynamic decision

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

## Slide 12

**Nội dung hình ảnh:** Danh sách 4 gạch đầu dòng với ô vuông trước mỗi mục (2 mục cuối được tô màu đỏ để nhấn mạnh), phía dưới có hộp nền xanh lá nhạt chứa "Nguyên tắc"; có thanh footer thông tin giảng viên/ngày ở đáy slide.

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
Giảng viên
(Vi U i)
AICB · Ngày
3
17/03/2026  9 / 34
Nguyên tắc: luôn benchmark rule / workflow / chatbot trước khi mở agent loop

## Slide 13

**Nội dung hình ảnh:** Hai thẻ (card) đặt song song: thẻ trái tiêu đề xanh dương "Customer FAQ", thẻ phải tiêu đề đỏ "Booking Assistant", mỗi thẻ liệt kê đặc điểm và kết luận "Best fit" tương ứng, minh họa so sánh trực quan hai case study; có thanh footer thông tin giảng viên/ngày ở đáy slide.

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
Giảng viên
(Vi U i)
AICB · Ngày
3
17/03/2026  10 / 34

## Slide 14

**Nội dung hình ảnh:** Sơ đồ 5 khối màu nối tiếp bằng mũi tên thể hiện các pattern agent tăng dần độ phức tạp: Augmented LLM (xanh xám) → Prompt Chaining (xanh dương đậm) → Routing (đỏ nhạt) → Orchestrator Worker (đỏ đậm) → Agent (xanh lá), mỗi khối có chú thích ngắn bên dưới; phía dưới có hộp khuyến nghị và thanh footer thông tin giảng viên/ngày.

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

## Slide 15

**Nội dung hình ảnh:** Slide tiêu đề chuyển chương (section divider), nền xanh đậm đồng nhất, không có sơ đồ minh họa.

Kiến Trúc Agent
Perception, reasoning, action, memory và luồng thông
tin giữa các khối

## Slide 16

**Nội dung hình ảnh:** Sơ đồ kiến trúc agent gồm 4 khối hộp: Perception (trái, chứa User input/Tool results) → mũi tên vào khối trung tâm Reasoning/LLM Core (xanh dương đậm) → mũi tên ra Action API (phải, chứa Exploring tool/Final result); bên dưới khối Reasoning có mũi tên hai chiều nối tới khối Memory (nền xanh lá nhạt, chứa Short-term Memory Context window và Long-term Memory Store/DB); phía trên có nhãn "Input từ môi trường" và bên phải là danh sách giải thích 4 khối (Perception, Reasoning, Action, Memory).

Kiến Trúc Agent: Từ Trong Ra Ngoài
Reasoning
LLM Core
Perception
User input
Tool results
Action API
Exploring tool
Final result
Short-term Memory Context window
Long-term Memory Store / DB
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

## Slide 17

**Nội dung hình ảnh:** Bố cục 2 cột song song (Short-term memory / Long-term memory), mỗi cột có danh sách gạch đầu dòng đặc điểm riêng, cột trái có thêm mục con "Phù hợp khi"; phía dưới là hộp lưu ý màu hồng nhạt.

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

## Slide 18

**Nội dung hình ảnh:** Sơ đồ vòng lặp tool calling: User Goal → LLM (đỏ) → Tool Call (xanh lá) → API/DB/Search, với nhãn "JSON/args" trên mũi tên đi, "observation" trên mũi tên phản hồi vòng dưới quay lại LLM, và "final answer" trên mũi tên vòng trên quay lại từ LLM về User Goal; thể hiện chu trình LLM gọi tool rồi nhận kết quả để trả lời.

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

## Slide 19

**Nội dung hình ảnh:** Slide tiêu đề chuyển chương (section divider), nền xanh đậm đồng nhất, không có sơ đồ minh họa.

ReAct Pattern
Reasoning + Acting: cách đơn giản nhất để biến
LLM thành agent có thể debug được

## Slide 20

**Nội dung hình ảnh:** Một khối hộp nền xám nhạt chứa định nghĩa ReAct và danh sách gạch đầu dòng giải thích 3 bước Thought/Action/Observation, không có sơ đồ đồ họa.

Định Nghĩa
ReAct = Reasoning + Acting
ReAct là pattern kết hợp suy luận theo từng bước với gọi công cụ và quan sát
kết quả. Thay vì trả lời ngay, agent sẽ lặp qua các bước:
■Thought: mình đang thiếu gì, nên làm gì tiếp?
■Action: gọi tool nào, với tham số nào?
■Observation: kết quả trả về là gì?
■Lặp lại đến khi đủ thông tin để trả lời hoặc gặp điều kiện dừng

## Slide 21

**Nội dung hình ảnh:** Sơ đồ vòng lặp ReAct: User Input → Thought (phân tích bước tiếp, màu đỏ nhạt) → Action (tool_name(args), màu xanh lá) → Observation (kết quả tool, màu xanh dương); có mũi tên cong phía trên từ Observation quay lại Thought với nhãn "chưa đủ" (biểu thị lặp lại), và mũi tên từ Observation đi xuống Final Answer (màu đỏ) với nhãn "đủ" khi vòng lặp kết thúc.

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

## Slide 22

**Nội dung hình ảnh:** Ba khối hộp xếp dọc minh họa trace từng bước (Thought 1/Action 1 viền đỏ, Observation 1 nền xám, Thought 2/Action 2 viền đỏ), trình bày cụ thể lệnh gọi hàm search_flights và get_weather với tham số thật.

Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (1/2)
Thought 1: Tôi cần tìm chuyến bay sáng mai từ HAN tới HCM dưới 2 triệu.
Action 1: search_flights(origin="HAN", destination="SGN", date="2026-03-18",
max_price=2000000)
Observation 1: Có 2 lựa chọn phù hợp: VietJet 06:10 giá 1.75M, Vietnam Airlines 08:20
giá 1.95M.
Thought 2: User cũng hỏi về trang phục nếu trời mưa. Tôi cần check thời tiết tại HCM.
Action 2: get_weather(city="Ho Chi Minh City", date="2026-03-18")

## Slide 23

**Nội dung hình ảnh:** Ba khối hộp xếp dọc tiếp nối slide trước (Observation 2 nền xám, Thought 3 viền đỏ, Final Answer nền xanh lá viền xanh), thể hiện kết quả cuối cùng của trace ReAct.

Trace Ví Dụ: Tìm Chuyến Bay HAN → HCM (2/2)
Observation 2: Nhiệt độ 27–32C, xác suất mưa 70%.
Thought 3: Tôi đã có cả lựa chọn chuyến bay và dữ liệu thời tiết. Có thể kết luận.
Final Answer: Gợi ý chuyến 06:10 giá 1.75M; mang áo mỏng, giày dễ khô, ô gập hoặc áo
mưa nhẹ.
Điểm mạnh không chỉ là answer tốt hơn, mà là con người nhìn được agent đã hành động
dựa trên quan sát nào.

## Slide 24

**Nội dung hình ảnh:** Bố cục 2 cột song song (Ưu điểm bên trái, Giới hạn bên phải), mỗi cột là danh sách gạch đầu dòng; phía dưới có hộp lưu ý màu hồng nhạt.

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

## Slide 25

**Nội dung hình ảnh:** Slide tiêu đề chuyển chương (section divider), nền xanh đậm đồng nhất, không có sơ đồ minh họa.

Agent Loop:  Code Anatomy
Từ prompt, tool registry, đến loop control và
framework hóa

## Slide 26

**Nội dung hình ảnh:** Khối code Python (nền đen, cú pháp highlight màu) trình bày pseudocode vòng lặp agent tối thiểu: khởi tạo messages, vòng for lặp MAX_ITERATIONS gọi call_model, kiểm tra final_answer, chạy tool và cập nhật messages.

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

## Slide 27

**Nội dung hình ảnh:** Khối code (nền đen) hiển thị chuỗi văn bản SYSTEM_PROMPT bằng tiếng Anh, mô tả vai trò travel planning agent, nhiệm vụ (Your job) và quy tắc (Rules) mà agent phải tuân theo.

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

## Slide 28

**Nội dung hình ảnh:** Khối code (nền đen) định nghĩa dictionary TOOLS bằng Python/JSON, khai báo 2 tool get_weather và search_flights kèm description và danh sách args cho từng tool.

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

## Slide 29

**Nội dung hình ảnh:** Bố cục 2 cột song song (Cần guardrails gì? / Dấu hiệu loop), mỗi cột là danh sách gạch đầu dòng; phía dưới có hộp nhấn mạnh màu xanh nhạt.

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

## Slide 30

**Nội dung hình ảnh:** Sơ đồ chuyển từ ReAct sang LangGraph gồm 5 khối nối tiếp: State Input → LLM Node (đỏ) → Tool Node (xanh lá) → Conditional Edge (xanh dương xám) → Final Answer (đỏ); có nhãn "tool call" và "observation" trên các mũi tên, mũi tên cong "continue" từ Conditional Edge quay lại LLM Node, và nhãn "done" dẫn tới Final Answer, minh họa luồng có điều kiện dạng graph.

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

## Slide 31

**Nội dung hình ảnh:** Slide tiêu đề chuyển chương (section divider), nền xanh đậm đồng nhất, không có sơ đồ minh họa.

Live Demo & Debug
Build agent tra cứu thời tiết và gợi ý trang phục ngay trên lớp

## Slide 32

**Nội dung hình ảnh:** Danh sách 5 bước đánh số cho kịch bản live demo, có 2 tên hàm get_weather và recommend_outfit được định dạng dạng code inline; phía dưới có hộp nhấn mạnh màu xanh nhạt.

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

## Slide 33

**Nội dung hình ảnh:** Khối code Python (nền đen) định nghĩa 2 hàm: get_weather trả về dict với temperature_c và rain_probability, và recommend_outfit dùng if/else để trả về gợi ý trang phục dựa trên nhiệt độ và xác suất mưa.

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

## Slide 34

**Nội dung hình ảnh:** Bố cục 2 cột song song (Nhìn vào trace trước / 4 nơi thường phải sửa), mỗi cột là danh sách gạch đầu dòng; phía dưới có hộp lưu ý màu hồng nhạt.

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

## Slide 35

**Nội dung hình ảnh:** Slide tiêu đề chuyển chương (section divider), nền xanh đậm đồng nhất, không có sơ đồ minh họa.

Chatbot vs Agent
Khi nào mỗi loại thắng và tại sao hybrid pattern thường thực
dụng nhất

## Slide 36

**Nội dung hình ảnh:** Bảng so sánh dạng lưới với 3 cột (Khía cạnh, Chatbot thắng, Agent thắng) và 5 hàng (Tác vụ, Tốc độ, Cost, Kiểm soát, UX), đối chiếu ưu thế của từng loại hệ thống theo từng khía cạnh.

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

## Slide 37

**Nội dung hình ảnh:** Sơ đồ luồng hybrid: User Query → Intent/Triage (đỏ), từ đó rẽ nhánh theo nhãn "simple" lên Simple Chatbot path (xanh dương) hoặc theo nhãn "multi-step" xuống Agent path (xanh lá), rồi Agent path có mũi tên "fallback" dẫn sang Human/Escalation (đỏ); minh họa cơ chế định tuyến (triage) chọn chatbot hay agent tùy độ phức tạp câu hỏi.

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

## Slide 38

**Nội dung hình ảnh:** Slide tiêu đề chuyển chương (section divider), nền xanh đậm đồng nhất, không có sơ đồ minh họa.

Thực Hành
Lab 3: Chatbot vs Agent — Hands-on Comparison

## Slide 39

**Nội dung hình ảnh:** Danh sách 5 bước đánh số hướng dẫn chạy Lab 3, có các cụm từ khóa được in đậm (chatbot baseline, ReAct agent, 5 test cases, flowchart); phía dưới có hộp nhấn mạnh màu xanh nhạt.

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

## Slide 40

**Nội dung hình ảnh:** Một khối hộp nền xanh nhạt tổng hợp thông tin lab theo 4 nhãn in đậm màu (Mục tiêu, Deliverable, Bonus, Thời gian), không có sơ đồ đồ họa.

Lab #3
Mục tiêu: Build chatbot baseline rồi nâng cấp thành ReAct agent cho cùng một use
case để so sánh trực tiếp
Deliverable: Nộp cuối buổi: chatbot + agent + 5 test cases + 1 trace + 1 flowchart
Bonus: thêm fallback path hoặc human escalation
Thời gian: 150 phút

## Slide 41

**Nội dung hình ảnh:** 4 khối hộp xếp dọc, mỗi khối có số thứ tự trong vòng tròn xanh đậm bên trái (1-4) và nội dung takeaway tương ứng bên phải, dạng danh sách tổng kết trực quan.

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

## Slide 42

**Nội dung hình ảnh:** Bố cục 2 cột: cột trái là khối hộp viền đỏ bên trái chứa tiêu đề chủ đề buổi sau và trích dẫn in nghiêng; cột phải là danh sách gạch đầu dòng 2 bài tập, có thanh dọc màu xanh dương bên trái.

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

## Slide 43

**Nội dung hình ảnh:** Danh sách 3 mục tài liệu tham khảo đánh số, mỗi mục có tên tác giả, tiêu đề in nghiêng và nguồn/link; không có sơ đồ đồ họa.

Tài Liệu Tham Khảo
1 Yao et al. ReAct: Synergizing Reasoning and Acting in Language Models. arXiv:2210.03629,
2023.
2 Anthropic. Building effective agents. anthropic.com/research/building-effective-agents
3 LangChain / LangGraph docs. Quickstart and Introduction. langchain-ai.github.io/langgraph

## Slide 44

**Nội dung hình ảnh:** Slide kết thúc (Q&A) với tiêu đề lớn có gạch chân, nền xanh đậm đồng nhất, câu hỏi thảo luận in nghiêng bên dưới, không có sơ đồ minh họa.

Hỏi & Đáp
Use case nào trong công việc của bạn chỉ cần chatbot, và use case nào thực
sự cần agent loop?
