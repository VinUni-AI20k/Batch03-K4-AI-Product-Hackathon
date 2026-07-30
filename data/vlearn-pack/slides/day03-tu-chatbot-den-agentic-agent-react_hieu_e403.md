# day03 tu chatbot den agentic agent react hieu e403

## Slide 1

**Nội dung hình ảnh:** Slide tiêu đề với logo VinUniversity và ảnh nền là khuôn viên trường VinUniversity nhìn từ trên cao, phủ lớp overlay xanh dương; có một đường kẻ đỏ ngang phân tách phần tiêu đề và phần thông tin giảng viên.

TừChatbot Đến Agentic Agent
AICB-P1 · Ngày 3 · Design Pattern ReAct
Tên Giảng Viên
VinUniversity · Phase 1 · Tuần 1 · 17/03/2026

## Slide 2

**Nội dung hình ảnh:** Nền xanh dương với hình dấu chấm hỏi lớn mờ ở giữa làm nền trang trí, nhấn mạnh tính chất câu hỏi gợi mở của slide.

?
HÃY SUY NGHĨ...
"ChatGPT là chatbot hay agent?
Siri thì sao? Cursor IDE thì sao?"
Giữcâu hỏi này trong đầu khi học bài hôm nay

## Slide 3

**Nội dung hình ảnh:** Danh sách 9 mục nội dung được trình bày thành 2 cột (5 mục cột trái, 4 mục cột phải), mỗi mục có số thứ tự màu xanh; thanh trạng thái cuối trang hiển thị tên giảng viên, môn học và ngày tháng.

Nội Dung Bài Học
1. 3 Kiểu HệThống AI
2. Agentic Fit Framework
3. Kiến Trúc Agent
4. ReAct Pattern
5. Agent Loop: Code Anatomy
6. Live Demo & Debug
7. Eval & Telemetry
8. Chatbot vs Agent
9. Lab 3
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
1 / 40

## Slide 4

**Nội dung hình ảnh:** Danh sách 5 mục tiêu dạng bullet vuông màu xanh, các từ khóa quan trọng (rule-based bot, LLM chatbot, agent, Agentic Fit, ReAct, native tool calling, telemetry...) được in đậm để nhấn mạnh.

Mục Tiêu Ngày 3
■Phân biệt được rule-based bot, LLM chatbot, và agent
■Dùng Agentic Fit đểbiết khi nào nên nâng từchatbot lên agent
■Hiểu và giải thích được vòng lặp ReAct: Thought →Action →Observation
■Build được ReAct agent đầu tiên với tools, system prompt, và safeguard cơ bản
■Phân biệt text-ReAct vs native tool calling; biết các failure mode và đo bằng telemetry
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
2 / 40

## Slide 5

**Nội dung hình ảnh:** Đoạn văn deliverable chính được đóng khung nổi bật màu xanh nhạt ở trên, phía dưới là 3 bullet chi tiết về group report, individual report và cách chấm điểm.

Deliverable Cuối Ngày
Chatbot baseline + ReAct agent (native tool calling) cho cùng bài toán, chạy được
end-to-end kèm telemetry.
■Group report: so sánh chatbot vs agent trên bộscenario, kèm 1 trace thành công + 1
trace lỗi
■Individual report: đóng góp kỹthuật + 1 case debug đọc từlog
■Chấm theo rubric 100 điểm (group 60 / individual 40) — xem slide rubric ởphần Lab
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
3 / 40

## Slide 6

**Nội dung hình ảnh:** Slide phân cách chương với số "01" lớn màu mờ làm nền bên phải, tiêu đề chương và mô tả ngắn bên trái, có đường kẻ đỏ ngang phân cách.

01
3 Kiểu HệThống AI
Từbot có rule đến agent có khảnăng lập kếhoạch và dùng
công cụ

## Slide 7

**Nội dung hình ảnh:** Sơ đồ 4 hộp nối tiếp bằng mũi tên theo thứ tự: Rule-based Bot (xám) → LLM Chatbot (xanh dương) → Reactive Agent (đỏ) → Autonomous Agent (xanh lá), thể hiện mức độ phức tạp/tự chủ tăng dần từ trái sang phải; phía trên có ghi chú "Khả năng thích nghi, tool use, memory, risk tăng dần".

Spectrum: Bot →Chatbot →Agent
Rule-based
Bot
If/else cứng
predictable
LLM
Chatbot
Trảlời thông minh
nhưng chủyếu 1 lượt
Reactive
Agent
Dùng tools + loop
quan sát theo từng bước
Autonomous
Agent
Long-horizon goal
nhiều quyết định liên tiếp
Khảnăng thích nghi, tool use, memory, risk tăng dần
Chatbot phản ứng (reactive: trảlời khi được hỏi rồi dừng); agent hướng mục tiêu
(goal-driven: tựquyết định, dùng tool, lặp đến khi đạt goal). Không phải mọi thứdùng
LLM đều là agent — agent chỉxuất hiện khi hệthống phải quyết định, hành động,
quan sát kết quả, rồi lặp lại.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
4 / 40

## Slide 8

**Nội dung hình ảnh:** Bảng so sánh 3 cột (Rule-based Bot, LLM Chatbot, Agent) x 7 hàng tiêu chí (Cách xử lý, Flexibility, Memory, Tool use, Cost, Risk, Ví dụ phù hợp), trình bày dạng bảng kẻ ngang không có đường dọc phân cách.

So Sánh 3 Kiểu HệThống AI
Tiêu chí
Rule-based Bot
LLM Chatbot
Agent
Cách xửlý
If/else cốđịnh
Sinh câu trảlời tốt theo
context
Plan →act →observe
→adapt
Flexibility
Thấp
Trung bình
Cao
Memory
Gần như không có
Ngắn hạn trong con-
text
Ngắn hạn + có thể
thêm long-term mem-
ory
Tool use
Hard-coded
Có thểgọi tool theo chỉ
định
Chủđộng chọn tool
theo bước tiếp theo
Cost
Thấp nhất
Trung bình
Cao hơn do loop và
nhiều calls
Risk
Logic dễkiểm soát
Hallucination / format
drift
Hallucination
+
tool
misuse + loop
Ví dụphù hợp
Menu IVR (tổng đài),
form validation
FAQ, support cơ bản
Booking,
research,
coding assistant
So sánh trực quan đểchọn đúng mức độphức tạp
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
5 / 40

## Slide 9

**Nội dung hình ảnh:** Bố cục 2 cột liệt kê cách 3 loại hệ thống (Bot có rule, LLM chatbot, Reactive agent) xử lý cùng một bài toán ví dụ, kèm khung cảnh báo màu đỏ nhạt ở cuối trang.

Ví DụNhanh: Cùng Một Câu Hỏi, 3 Mức ĐộHệThống
Bài toán: "Tìm vé HAN →HCM dưới 2
triệu, rồi gợi ý mang gì nếu trời mưa."
Bot có rule
■Trảmenu lựa chọn cốđịnh
■Không search được dữliệu mới
■Không tổng hợp nhiều điều kiện
LLM chatbot
■Viết câu trảlời mượt
■Nhưng không tựtruy vấn giá vé thật
Reactive agent
■Tách goal thành 2 việc: tìm vé +
check thời tiết
■Gọi từng tool theo bước
■So sánh kết quảrồi trảlời gộp
Lưu ý: Nếu bài toán không cần dữliệu mới, nhiều bước, hay quyết định động, agent
thường là overkill.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
6 / 40

## Slide 10

**Nội dung hình ảnh:** Slide phân cách chương với số "02" lớn màu mờ làm nền bên phải, cùng phong cách với slide phân cách chương trước đó.

02
Agentic Fit Framework
4 tiêu chí đểbiết bài toán có thật sựcần agent hay không

## Slide 11

**Nội dung hình ảnh:** Bố cục lưới 2x2 gồm 4 thẻ (card) tiêu đề có màu nền khác nhau (2 thẻ xanh dương, 2 thẻ đỏ): Multi-step Reasoning, Tool Interaction, Dynamic Decision, Long Horizon, mỗi thẻ có câu hỏi gợi ý bên dưới tiêu đề.

4 Tiêu Chí Agentic Fit
1. Multi-step Reasoning
Bài toán có cần chia thành nhiều bước phụthuộc
nhau không?
2. Tool Interaction
Hệthống có cần gọi search, API, database, calcu-
lator, browser, file system...?
3. Dynamic Decision
Mỗi bước tiếp theo có phụthuộc vào kết quảvừa
quan sát không?
4. Long Horizon
Hệthống có phải giữmục tiêu xuyên suốt qua
nhiều vòng lặp hoặc nhiều state không?
Nếu đa sốtiêu chí chỉởmức 1–2/5, hãy bắt đầu bằng chatbot hoặc workflow đơn
giản.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
7 / 40

## Slide 12

**Nội dung hình ảnh:** Bảng scoring matrix liệt kê 5 use case với điểm số 1-5 cho 3 tiêu chí (Reasoning, Tool use, Dynamic decision) và cột Tổng điểm, giúp minh họa trực quan cách chấm điểm mức độ phù hợp với agent.

Scoring Matrix: Có Cần Agent Không?
Use case
Reasoning
Tool use
Dynamic
deci-
sion
Tổng
FAQ nội bộHR
1
1
1
3
Tóm tắt hợp đồng và high-
light risk
3
2
2
7
Booking assistant du lịch
4
5
4
13
Research agent tìm đối
thủcạnh tranh
4
4
4
12
Code assistant có test &
fix loop
5
5
4
14
Gợi ý đọc điểm: 0–5 = chatbot/rule đủ
6–10 = augmented chatbot
11+ = agent đáng thử
Chấm nhanh theo thang 1–5 cho từng tiêu chí
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
8 / 40

## Slide 13

**Nội dung hình ảnh:** Danh sách checklist với 4 ô vuông rỗng (chưa tick) cho các anti-pattern, và 1 ô vuông có dấu tick màu xanh cho nguyên tắc khuyến nghị, nằm trong khung viền.

Anti-Patterns: Khi Dùng Agent Là Sai Bài
□
Bài toán 1 bước: hỏi đáp, tra FAQ, phân loại cơ bản
□
Không có tool nào đểgọi: agent chỉ"suy nghĩ" nhưng không hành động được
□
Mọi thứphải 100% deterministic: mỗi sai sót đều rất đắt
□
Chi phí latency không chấp nhận được: loop 3–5 bước là đã quá chậm
□
✓
Nguyên tắc: luôn benchmark rule / workflow / chatbot trước khi mởagent loop
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
9 / 40

## Slide 14

**Nội dung hình ảnh:** Hai thẻ (card) đặt cạnh nhau: thẻ trái tiêu đề xanh dương "Customer FAQ", thẻ phải tiêu đề đỏ "Booking Assistant", mỗi thẻ có các bullet đặc điểm và dòng "Best fit" in đậm ở cuối.

Case Study: Chatbot ĐủHay Cần Agent?
Customer FAQ
■Câu hỏi lặp lại, intent khá ổn định
■Chủyếu retrieve policy rồi trảlời
■Có thểthêm RAG
(Retrieval-Augmented Generation)
nhưng chưa cần autonomy
■Best fit: chatbot có retrieval
Booking Assistant
■Nhiều ràng buộc: thời gian, ngân
sách, preference
■Phải search, so sánh, hỏi lại, rồi
chốt phương án
■Bước sau phụthuộc kết quảbước
trước
■Best fit: reactive agent có tool use
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
10 / 40

## Slide 15

**Nội dung hình ảnh:** Sơ đồ chuỗi 6 hộp nối tiếp bằng mũi tên (Augmented LLM → Prompt Chaining → Routing → Parallelization → Orchestrator Worker → Agent), màu sắc chuyển dần từ xanh dương/xám sang đỏ rồi xanh lá, thể hiện mức độ phức tạp tăng dần theo pattern của Anthropic.

TừAnthropic: Agent Patterns Nên Tăng Dần Theo Nhu Cầu
Augmented
LLM
Prompt +
docs + tools
Prompt
Chaining
Bước nối tiếp
Routing
Chọn path
/ specialist
Paralleli-
zation
Chia song
song rồi gộp
Orchestrator
Worker
Phân việc
rồi tổng hợp
Agent
Tựquyết
nhiều bước
Bắt đầu từcấu trúc đơn giản nhất đủdùng. Workflow (đường đi cốđịnh): prompt
chaining →routing →parallelization →orchestrator–worker →evaluator–optimizer.
Agent là khi model tựđịnh hướng quy trình — mạnh nhất nhưng đắt nhất vềcost,
eval, guardrails.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
11 / 40

## Slide 16

**Nội dung hình ảnh:** Slide phân cách chương với số "03" lớn màu mờ làm nền bên phải, cùng phong cách với các slide phân cách chương khác.

03
Kiến Trúc Agent
Perception, reasoning, action, memory và luồng thông tin giữa
các khối

## Slide 17

**Nội dung hình ảnh:** Sơ đồ kiến trúc agent dạng trung tâm-vệ tinh: khối "Reasoning / LLM Core" ở giữa kết nối 2 chiều (mũi tên đi và về) với 4 khối xung quanh: Perception (trên trái), Action (trên phải), Short-term Memory (dưới trái), Long-term Memory (dưới phải); phía trên có chú thích "Input từ môi trường", phía dưới có chú thích "State và memory giúp agent không mất mạch".

Kiến Trúc Agent: TừTrong Ra Ngoài
Reasoning
LLM Core
Perception
User input
Tool results
Action
API / Search
Final answer
Short-term
Memory
Context window
Long-term
Memory
Store / DB
Input từmôi trường
State và memory giúp agent không "mất mạch"
■Perception: agent nhận text, tool
output, feedback
■Reasoning: phân tích trạng thái
và chọn bước tiếp theo
■Action: gọi tool hoặc trảlời user
■Memory: giữgoal, facts, và
intermediate results
4 khối kiến trúc thường kéo theo 4 nhóm cost chính: token, storage, API, và latency.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
12 / 40

## Slide 18

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung.

Memory: Short-term vs Long-term
Short-term memory
■Nằm trong context window
■Dùng cho task hiện tại
■Rẻđểimplement, nhưng dễđầy
Phù hợp khi
■Cuộc hội thoại ngắn
■Goal chỉkéo dài vài bước
Long-term memory
■Lưu facts, preferences, hay state
ngoài context
■Có thểlà DB, vector store, key-value
store
■Cần retrieval strategy và permission
model
Lưu ý: Không phải thêm memory là agent giỏi hơn. Memory chỉcó ích khi chiến lược
đọc/ghi và quyền truy cập được thiết kếrõ. (Hiện thực long-term memory với vector
store: Ngày 7.)
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
13 / 40

## Slide 19

**Nội dung hình ảnh:** Sơ đồ luồng vòng tròn giữa 4 khối: User Goal → LLM → Tool Call → API/DB/Search, với nhãn "JSON/args" trên mũi tên LLM→Tool Call, nhãn "observation" trên đường phản hồi quay lại LLM, và nhãn "final answer" trên đường vòng cung phía trên nối thẳng từ LLM về User Goal.

Tool Calling = Tay Chân Của Agent
User Goal
LLM
Tool Call
API / DB / Search
JSON / args
observation
final answer
■Tool definitions phải rõ input / output / error mode
■Agent mạnh lên nhờtool, nhưng cũng dễfail hơn vì external dependency
■Hôm nay: tool calling như một khái niệm trong vòng ReAct. Ngày 4: tool như một
contract (JSON Schema, mô tảtool, parallel calls)
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
14 / 40

## Slide 20

**Nội dung hình ảnh:** Slide phân cách chương với số "04" lớn màu mờ làm nền bên phải, cùng phong cách với các slide phân cách chương khác.

04
ReAct Pattern
Reasoning + Acting: cách đơn giản nhất đểbiến LLM thành
agent có thểdebug được

## Slide 21

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung (nội dung định nghĩa được đóng khung với viền trái màu xanh nhấn mạnh).

Định Nghĩa
ReAct = Reasoning + Acting
ReAct là pattern kết hợp suy luận theo từng bước với gọi công cụvà quan sát
kết quả. Thay vì trảlời ngay, agent sẽlặp qua các bước:
■Thought: mình đang thiếu gì, nên làm gì tiếp?
■Action: gọi tool nào, với tham sốnào?
■Observation: kết quảtrảvềlà gì?
■Lặp lại đến khi đủthông tin đểtrảlời hoặc gặp điều kiện dừng
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
15 / 40

## Slide 22

**Nội dung hình ảnh:** Sơ đồ luồng ngang: User Input → Thought → Action → Observation → Final Answer (đường "đủ"), với mũi tên vòng lại từ Observation về Thought có nhãn "chưa đủ" thể hiện vòng lặp ReAct; các khối Thought/Action/Observation có màu đỏ/xanh lá/xanh dương tương ứng.

ReAct Loop: Thought →Action →Observation
User Input
Thought
phân tích bước tiếp
Action
tool_name(args)
Observation
kết quảtool
Final Answer
chưa đủ
đủ
ReAct mạnh vì trace lý do hành động được bộc lộra ngoài, giúp con người debug và
can thiệp dễhơn so với chỉnhìn final answer.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
16 / 40

## Slide 23

**Nội dung hình ảnh:** Các khối Thought/Action được đóng khung viền đỏ nhạt, khối Observation đóng khung viền xám, minh họa trực quan một trace ReAct thực tế theo trình tự Thought 1 → Action 1 → Observation 1 → Thought 2 → Action 2.

Trace Ví Dụ: Tìm Chuyến Bay HAN →HCM (1/2)
Thought 1: Tôi cần tìm chuyến bay sáng mai từHAN tới HCM dưới 2 triệu.
Action
1:
search_flights(origin="HAN",
destination="SGN",
date="2026-03-18",
max_price=2000000)
Observation 1: Có 2 lựa chọn phù hợp: VietJet 06:10 giá 1.75M, Vietnam Airlines 08:20
giá 1.95M.
Thought 2: User cũng hỏi vềtrang phục nếu trời mưa. Tôi cần check thời tiết tại HCM.
Action 2: get_weather(city="Ho Chi Minh City", date="2026-03-18")
Mỗi Thought nên làm rõ agent còn thiếu gì; mỗi Action phải chỉra tool và args đủcụthểđể
kiểm tra.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
17 / 40

## Slide 24

**Nội dung hình ảnh:** Tiếp nối trace của slide trước: khối Observation 2 (viền xám), Thought 3 (viền đỏ nhạt), và khối Final Answer được đóng khung viền xanh lá để nhấn mạnh đây là kết quả cuối cùng của vòng lặp.

Trace Ví Dụ: Tìm Chuyến Bay HAN →HCM (2/2)
Observation 2: Nhiệt độ27–32C, xác suất mưa 70%.
Thought 3: Tôi đã có cảlựa chọn chuyến bay và dữliệu thời tiết. Có thểkết luận.
Final Answer: Gợi ý chuyến 06:10 giá 1.75M; mang áo mỏng, giày dễkhô, ô gập hoặc áo
mưa nhẹ.
Điểm mạnh không chỉlà answer tốt hơn, mà là con người nhìn được agent đã hành động
dựa trên quan sát nào.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
18 / 40

## Slide 25

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung.

ReAct Tốt ỞĐiểm Nào?
Ưu điểm
■Dễđọc trace và debug
■Tựquyết được bước tiếp theo từ
observation
■Phù hợp các bài toán search /
booking / investigation / coding
■Có thểcài safeguard ởtừng vòng lặp
Giới hạn
■Tốn nhiều token và latency hơn
chatbot
■Dễloop hoặc gọi sai tool
■Cần eval theo trace, không chỉfinal
answer
■Không phù hợp bài toán đơn giản
hoặc cần deterministic tuyệt đối
Lưu ý: ReAct dễbắt đầu nhất, nhưng khi hệthống nhiều nhánh hơn, nên chuyển
sang graph/state machine rõ ràng.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
19 / 40

## Slide 26

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung (bố cục 2 cột so sánh Text-based ReAct và Native function/tool calling).

Hai Cách Hiện Thực "Action": Text-ReAct vs Native Tool Calling
Quan trọng — ReAct là mô hình tư duy (Thought →Action →Observation). Cách
hiện thực bước Action có 2 kiểu — và production 2026 mặc định chọn kiểu thứhai.
Text-based ReAct (paper gốc, 2022)
■Model in ra text: Action: get_weather("HCM")
■Code của bạn tựparse (regex / JSON)
■Chạy trên mọi text model (kểcảlocal nhỏ)
■Dễvỡ: lệch format, dính markdown fences, args bịa
Native function/tool calling (2024–2026)
■Model in ra object có cấu trúc (đã được post-train)
■API trảargs đã theo schema; strict mode đảm bảo
đúng schema
■Tin cậy hơn, ít parse error
■Cần model / endpoint hỗtrợtool calling
Học ReAct đểhiểu vòng lặp; hiện thực bằng native tool calling cho production. Ngày
4 đi sâu tool như một contract (JSON Schema, mô tảtool, parallel calls).
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
20 / 40

## Slide 27

**Nội dung hình ảnh:** Khối code minh họa trên nền đen với cú pháp Python được tô màu (comment xanh lá, string đỏ/cam, keyword vàng), so sánh cách parse thủ công bằng regex (text-ReAct) và cách lấy trực tiếp từ object của native tool calling.

"Action" Được Parse Như ThếNào?
# --- Text-ReAct: ban tu parse (de vo) ---
text = "Action: get_weather(city='HCM')"
m = re.match(r"Action:\s*(\w+)\((.*)\)", text)
# brittle
name, args = m.group(1), m.group(2)
# --- Native tool calling: API tra ve object (tin cay hon) ---
call = resp.choices[0].message.tool_calls[0]
name = call.function.name
# "get_weather"
args = json.loads(call.function.arguments)
# da theo schema
Lưu ý: Instructor guide gọi bước parse này là "the most common bottleneck". Lab
cho bạn trải nghiệm cảhai: text-ReAct cho local model, native tool calling cho OpenAI.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
21 / 40

## Slide 28

**Nội dung hình ảnh:** Slide phân cách chương với số "05" lớn màu mờ làm nền bên phải, cùng phong cách với các slide phân cách chương khác.

05
Agent Loop: Code Anatomy
Từprompt, tool registry, đến loop control và framework hóa

## Slide 29

**Nội dung hình ảnh:** Khối code Python trên nền đen minh họa pseudocode vòng lặp agent tối thiểu, có tô màu cú pháp (keyword vàng/xanh dương, string cam, comment xanh lá) thể hiện vòng lặp for gọi model, kiểm tra final_answer, hoặc chạy tool rồi nối kết quả vào messages.

Pseudocode: Agent Loop Tối Thiểu
messages = [user_message(user_goal)]
# seed loop voi input cua user
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
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
22 / 40

## Slide 30

**Nội dung hình ảnh:** Khối code trên nền đen hiển thị toàn bộ system prompt mẫu (dạng chuỗi Python triple-quote) với các dòng chữ màu xanh lá, được đóng khung viền để làm nổi bật ví dụ prompt production cho agent du lịch.

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
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
23 / 40

## Slide 31

**Nội dung hình ảnh:** Khối code trên nền đen minh họa cấu trúc dictionary Python TOOLS khai báo 3 tool (search_flights, get_weather, recommend_outfit) với các trường "description" và "args" được tô màu cam/vàng, thể hiện cách đăng ký tool registry.

Tool Registry: Khai Báo "Tay Chân" Cho Agent
TOOLS = {
"search_flights": {
"description": "Tim chuyen bay theo route/ngay/ngan sach",
"args": ["origin", "destination", "date", "max_price"],
},
"get_weather": {
"description": "Thoi tiet theo thanh pho/ngay",
"args": ["city", "date"],
},
"recommend_outfit": {
"description": "Goi y trang phuc theo nhiet do + xac suat mua",
"args": ["temp_high_c", "rain_probability"],
},
}
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
24 / 40

## Slide 32

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung (bố cục 2 cột: Cần guardrails gì và Dấu hiệu loop).

Max Iterations Safeguard: Tránh Agent Đi Vòng
Cần guardrails gì?
■Giới hạn sốvòng lặp
■Timeout cho từng tool
■Budget token / cost trần
■Retry có kiểm soát
■Fallback sang human hoặc chatbot
Dấu hiệu loop
■lặp lại cùng một tool call
■hỏi lại thông tin đã có
■reasoning không tiến thêm
■observation không thay đổi nhưng
vẫn tiếp tục
Khi output không tiến triển, cùng một tool bịgọi lặp lại, hoặc observation không đổi
mà agent vẫn tiếp tục, cần dừng loop và fallback.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
25 / 40

## Slide 33

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung (2 khung nội dung: khái niệm state-graph ở trên và ghi chú về LangGraph v1.0 ở dưới, có highlight code inline cho `create_react_agent` và `langchain.agents.create_agent`).

Khi Nào Cần Hơn ReAct Loop? (Teaser)
State-graph — Mô tảagent như nodes (bước) + edges (luồng) + state (dữliệu
mang theo), thay cho một vòng for ad-hoc.
■ReAct loop bằng tay: tốt nhất đểhọc bản chất và cho agent ít nhánh
■Khi workflow nhiều nhánh, cần persist state hoặc conditional routing rõ ràng →
chuyển sang state-graph (vd LangGraph)
■Đi sâu vào graph/state machine: Ngày 9 (multi-agent) và P2-T3 Ngày 8
LangGraph đạt v1.0 (10/2025).
create_react_agent (prebuilt) đã deprecated →
dùng langchain.agents.create_agent.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
26 / 40

## Slide 34

**Nội dung hình ảnh:** Slide phân cách chương với số "06" lớn màu mờ làm nền bên phải, cùng phong cách với các slide phân cách chương khác.

06
Live Demo & Debug
Build agent tra cứu thời tiết và gợi ý trang phục ngay trên lớp

## Slide 35

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung (danh sách 5 bước kịch bản demo có số thứ tự, tên hàm được in dạng code inline).

Kịch Bản Live Demo
1. Định nghĩa 2 tools: get_weather và recommend_outfit
2. Viết system prompt: agent chỉđược kết luận khi đã có dữliệu thời tiết
3. Chạy loop và đọc trace Thought / Action / Observation
4. Cốtình tạo lỗi: tool timeout hoặc agent chọn sai outfit
5. Debug: sửa prompt, sửa tool description, hoặc thêm safeguard
Cho học viên thấy agent fail ởđâu và vì sao trace lại quan trọng hơn một final answer
"trông có vẻđúng".
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
27 / 40

## Slide 36

**Nội dung hình ảnh:** Khối code Python trên nền đen định nghĩa 2 hàm tool mẫu get_weather và recommend_outfit với tô màu cú pháp (keyword def/if/return màu vàng/xanh dương, string cam, comment xanh lá).

Code Demo: 2 Tool Tối Thiểu
def get_weather(city: str, date: str) -> dict:
return {
"city": city,
"date": date,
"temp_high_c": 32,
# field khop voi recommend_outfit
"rain_probability": 0.7,
}
def recommend_outfit(temp_high_c: int, rain_probability: float) -> str:
if rain_probability > 0.5:
return "Ao mong, giay de kho, mang theo o gap."
if temp_high_c > 30:
return "Ao nhe, thoang, uu tien vai cotton."
return "Trang phuc thoai mai, co the mang ao khoac nhe."
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
28 / 40

## Slide 37

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung (bố cục 2 cột: câu hỏi kiểm tra trace bên trái, 4 nơi thường phải sửa bên phải).

Debug Checklist Khi Agent Lỗi
Nhìn vào trace trước
■Thought có đúng mục tiêu không?
■Agent chọn đúng tool chưa?
■Args truyền vào có hợp lệkhông?
■Observation có bịthiếu field quan
trọng không?
4 nơi thường phải sửa
■Tool description quá mơ hồ
■System prompt thiếu rule dừng
■Không có safeguard cho retry / loop
■Evaluation chỉchấm final answer,
không chấm trace
Lưu ý: Agent debugging gần với debugging distributed system hơn là chỉprompt
tuning. Ta phải nhìn cảmodel, tool, state, và orchestration.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
29 / 40

## Slide 38

**Nội dung hình ảnh:** Bảng 3 cột (Lỗi, Triệu chứng, Cách xử lý) x 5 hàng liệt kê 5 kiểu lỗi ReAct thường gặp (Parse error, Hallucinated tool, Hallucinated args, Empty observation, Timeout/loop), trình bày dạng bảng kẻ ngang.

ReAct Failure Modes: 5 Kiểu Lỗi Phải Biết
Lỗi
Triệu chứng
Cách xửlý
Parse error
Model in Action sai format, regex/J-
SON fail
Native tool calling;
strict schema;
retry có hướng dẫn
Hallucinated tool
Gọi tool không tồn tại
Validate tên tool theo registry; báo lỗi
rõ
Hallucinated args
Args sai / thiếu / bịa
JSON Schema + strict mode; default
an toàn
Empty observation
Tool trả"không có dữliệu"
Cho agent thửtool khác / hỏi lại /
dừng
Timeout / loop
Lặp tool, reasoning không tiến
max_iterations; phát hiện lặp; fall-
back human
Đây chính là taxonomy bạn sẽgặp & phải phân tích ởphase failure-analysis của Lab 3 — phần được chấm điểm
nặng nhất.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
30 / 40

## Slide 39

**Nội dung hình ảnh:** Slide phân cách chương với số "07" lớn màu mờ làm nền bên phải, cùng phong cách với các slide phân cách chương khác.

07
Eval & Telemetry
Đo bằng trace, không chỉfinal answer: tokens, latency, cost, loop
count

## Slide 40

**Nội dung hình ảnh:** Bảng 5 cột (Step, Action, Tokens, Latency, Pass?) x 4 hàng minh họa một trace mẫu 4 bước với ô tick xanh ở cột Pass, hàng Tổng cộng ở cuối tổng hợp số bước/tokens/latency.

Eval-by-Trace: Đo Gì Trên Mỗi Bước?
Step
Action
Tokens
Latency
Pass?
1
check_stock("iPhone")
180
0.6s
□✓
2
get_discount("WINNER")
120
0.4s
□✓
3
calc_shipping(2, "Hà Nội")
140
0.5s
□✓
4
final_answer
90
0.3s
□✓
Tổng
4 bước (loop count = 3)
530
1.8s
est. cost
Lab log mỗi bước ra JSON: token, latency, loop count, error code. Bạn so sánh agent v1 vs v2 bằng sốliệu, không
phải cảm tính. (Lab dùng total latency, không phải TTFT, vì call là non-streaming.)
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
31 / 40

## Slide 41

**Nội dung hình ảnh:** Slide phân cách chương với số "08" lớn màu mờ làm nền bên phải, cùng phong cách với các slide phân cách chương khác.

08
Chatbot vs Agent
Khi nào mỗi loại thắng và tại sao hybrid pattern thường thực
dụng nhất

## Slide 42

**Nội dung hình ảnh:** Bảng 3 cột (Khía cạnh, Chatbot thắng, Agent thắng) x 5 hàng so sánh trực tiếp theo từng khía cạnh (Tác vụ, Tốc độ, Cost, Kiểm soát, UX), trình bày dạng bảng kẻ ngang, có ghi chú in nghiêng ở cuối.

Khi Nào Chatbot Thắng, Khi Nào Agent Thắng?
Khía cạnh
Chatbot thắng
Agent thắng
Tác vụ
FAQ, support đơn giản, nội dung
1 lượt
Booking, research, coding, data
analysis nhiều bước
Tốc độ
Nhanh, ít round-trip
Chậm hơn do loop và tool calls
Cost
Thấp hơn, predictable hơn
Cao hơn nhưng đổi lại xửlý
được bài toán khó hơn
Kiểm soát
Dễhơn, ít state
Khó hơn vì cần orchestration và
eval theo trace
UX
Phản hồi nhanh, đơn giản
Tạo cảm giác "làm việc giúp bạn"
nếu làm tốt
Bắt đầu bằng chatbot là lựa chọn mặc định tốt
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
32 / 40

## Slide 43

**Nội dung hình ảnh:** Sơ đồ luồng phân nhánh: User Query → Intent/Triage, sau đó rẽ 2 nhánh có nhãn "simple" (đi tới Simple Chatbot path) và "multi-step" (đi tới Agent path), nhánh Agent path có thêm mũi tên "fallback" dẫn tới Human/Escalation; các khối được tô màu xanh dương/đỏ/xanh lá/đỏ đậm.

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
Không cần chọn một phe. Thiết kếtốt thường là: triage nhanh, câu đơn giản đi
chatbot path, câu phức tạp mới mởagent loop.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
33 / 40

## Slide 44

**Nội dung hình ảnh:** Slide phân cách chương với số "09" lớn màu mờ làm nền bên phải, cùng phong cách với các slide phân cách chương khác.

09
Thực Hành
Lab 3: Chatbot vs Agent — Hands-on Comparison

## Slide 45

**Nội dung hình ảnh:** Bố cục 2 cột song song so sánh domain/tools trên lớp (chuyến bay + thời tiết) và trong lab (e-commerce), tên hàm/tool được in dạng code inline.

Bridge: Ví DụLớp Học →Bài Lab
Trên lớp (lecture)
■Domain: chuyến bay + thời tiết
■search_flights, get_weather,
recommend_outfit
Trong lab (hands-on)
■Domain: e-commerce
■check_stock, get_discount,
calc_shipping
Vòng lặp ReAct giống hệt — chỉđổi bộtools. Pattern độc lập với domain: đó
chính là điều cần nhớ.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
34 / 40

## Slide 46

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung (danh sách 5 bước hướng dẫn chạy lab có số thứ tự, tên file/lệnh in dạng code inline như `.env.example`, `chatbot.py`, `agent.py`).

Cách Chạy Lab 3
1. cp .env.example .env, chọn provider (OpenAI / local llama.cpp)
2. Chạy chatbot baseline (chatbot.py) trên bộscenario e-commerce
3. Hiện thực ReAct loop trong agent.py với 2–3 tools (check_stock, get_discount,
calc_shipping)
4. Failure analysis: đọc log JSON, tìm parse error / hallucinated tool / loop
5. Sửa prompt + tool description (v1 →v2), rồi group eval so sánh bằng sốliệu
NhờAI generate scaffolding, nhưng nhóm tựsửa system prompt, tool description, và
điều kiện dừng. Xem VIBE-CODING.md.
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
35 / 40

## Slide 47

**Nội dung hình ảnh:** Nội dung được đóng khung trong một khối nền xanh nhạt duy nhất, chia thành 4 mục có nhãn in đậm: Mục tiêu, Deliverable, Bonus, Thời gian.

Lab #3
Mục tiêu: Build chatbot baseline rồi nâng cấp thành ReAct agent (native tool calling)
cho cùng use case e-commerce, chạy được kèm telemetry
Deliverable: Nộp: group report + individual report (rubric 100đ) + 1 trace thành
công & 1 trace lỗi
Bonus: provider thứ2 (Gemini), human-escalation, hoặc metrics nâng cao
Thời gian: 150 phút
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
36 / 40

## Slide 48

**Nội dung hình ảnh:** Bảng 2 cột (Hạng mục, Điểm) liệt kê rubric chấm điểm Lab 3 chia làm 2 nhóm: Group (60 điểm, 5 hạng mục) và Individual (40 điểm, 3 hạng mục), tiêu đề nhóm in nghiêng màu xanh.

Rubric Lab 3 — 100 Điểm
Hạng mục
Điểm
Group — 60 điểm
Chatbot baseline + ReAct agent chạy được (2+ tools)
16
Cải tiến v1 →v2 từfailure trace
12
Trace quality (thành công + lỗi)
12
Eval & so sánh chatbot vs agent (data-driven)
12
Code quality + telemetry tích hợp
8
Individual — 40 điểm
Đóng góp kỹthuật (modules / tools / tests)
15
Case debug đọc từlog (hallucination / loop / parse)
15
Reflection: chatbot vs agent
10
Sinh viên phải thấy rubric trước khi làm
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
37 / 40

## Slide 49

**Nội dung hình ảnh:** 5 khối nội dung xếp dọc, mỗi khối có một biểu tượng số tròn màu xanh dương (1-5) ở đầu dòng, đóng khung viền nhẹ, tổng kết 5 điểm chính (key takeaways) của bài học.

Tổng Kết — Key Takeaways
1
Agent không phải "chatbot thông minh hơn"; agent = LLM + reasoning + tools + memory/s-
tate
2
ReAct = mô hình tư duy (Thought/Action/Observation); production hiện thực bằng native
tool calling
3
Chỉdùng agent khi bài toán có multi-step reasoning, tool use, dynamic decisions, long
horizon
4
Đánh giá agent theo trace (token, latency, loop, error code), không chỉfinal answer
5
ReAct quay lại xuyên suốt khóa: Ngày 4 (tool contract), Ngày 9 (multi-agent), P2-T3 (Reflex-
ion, LangGraph)
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
38 / 40

## Slide 50

**Nội dung hình ảnh:** Bố cục 2 cột: cột trái là khối trích dẫn in nghiêng có viền trái màu đỏ giới thiệu chủ đề buổi học tiếp theo, cột phải là 2 bullet bài tập về nhà.

Tiếp theo & Bài tập
Prompt Engineering & Tool Calling
"Ngày mai ta đi sâu hơn vào cách
viết system prompt production-grade
và mô tảtools đểagent dùng đúng ý."
■Đọc lại trace lab hôm nay và tìm
1 chỗagent ra quyết định chưa
tối ưu
■Thửviết lại tool description theo
hướng rõ input, output, và failure
mode hơn
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
39 / 40

## Slide 51

**Nội dung hình ảnh:** Slide chỉ có text, không có sơ đồ/hình minh họa bổ sung (danh sách 4 tài liệu tham khảo có số thứ tự, tên bài báo/sách in nghiêng, tên hàm `create_react_agent` in dạng code inline).

Tài Liệu Tham Khảo
1 Yao et al. ReAct: Synergizing Reasoning and Acting in Language Models. arXiv:2210.03629, Oct
2022; ICLR 2023.
2 Anthropic. Building Effective Agents. anthropic.com/research/building-effective-agents (19/12/2024)
3 OpenAI. Function Calling & Structured Outputs. platform.openai.com/docs/guides/function-calling
4 LangChain. LangGraph v1.0 & create_agent. docs.langchain.com — create_react_agent đã
deprecated
Giảng viên (VinUni)
AICB · Ngày 3
17/03/2026
40 / 40

## Slide 52

**Nội dung hình ảnh:** Slide tiêu đề "Hỏi & Đáp" căn giữa với đường kẻ đỏ ngang bên dưới tiêu đề, nền xanh dương đồng nhất với các slide phân cách khác, không có sơ đồ minh họa.

Hỏi & Đáp
Use case nào trong công việc của bạn chỉcần chat-
bot, và use case nào thực sựcần agent loop?

## Slide 53

**Nội dung hình ảnh:** Slide kết thúc với logo VinUniversity (biểu tượng chữ V cách điệu màu xanh/đỏ trên nền trắng) ở trên cùng, tiêu đề "Cảm ơn!" căn giữa có đường kẻ đỏ gạch chân, phía dưới là thông tin liên hệ email và đường link GitHub.

Cảm ơn!
Email: lecturer@vinuni.edu.vn
Slides & tài liệu: github.com/VinUni-AI20k
Lab 3 repo: github.com/VinUni-AI20k/Day-3-Lab-Chatbot-vs-react-agent
