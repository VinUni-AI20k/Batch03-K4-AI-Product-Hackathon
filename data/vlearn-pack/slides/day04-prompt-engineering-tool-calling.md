# day04 prompt engineering tool calling

## Slide 1

Prompt Engineering & Tool Calling
AICB-P1 · Ngày 4 · Làm sao nói đểAI hiểu đúng ý?
Tên Giảng Viên
VinUniversity · Phase 1 · Tuần 1 · 2026

## Slide 2

?
HÃY SUY NGHĨ...
“Hai người hỏi AI cùng một việc, một người nhận
kết quảxuất sắc, người kia nhận rác. Tại sao?
Và: cùng một agent, đôi khi nó gọi tool đúng,
đôi khi gọi sai — do prompt hay do tool?”
Giữcâu hỏi này trong đầu khi học bài hôm nay

## Slide 3

Nội Dung Bài Học
1. Prompt fundamentals
2. Advanced prompting techniques
3. System prompt engineering
4. Context engineering
5. Prompt safety & evaluation
6. Tool calling
7. Design principles cho tools
8. Tool patterns & error handling
9. Lab 4 + deliverable cuối buổi
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
1 / 64

## Slide 4

Mục Tiêu Ngày 4
■Viết được prompt rõ ràng theo các thành phần Role / Task / Context / Format
■Hiểu khi nào nên dùng zero-shot, few-shot, CoT, và khi nào không cần
■Viết được system prompt production-grade cho agent
■Khai báo được tool schema và hiểu vòng lặp tool calling từmodel đến tool rồi quay lại model
■Nhận diện được prompt injection và viết system prompt an toàn
■Biết cách iterate và evaluate prompt quality
Mục tiêu của buổi này là hiểu cơ chế: prompt là interface giữa human intent và model be-
havior; tool calling là interface giữa model và thếgiới bên ngoài.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
2 / 64

## Slide 5

Deliverable Cuối Ngày
1 agent script chạy được + 1 system prompt + 2 tool schemas + 5 test questions +
ghi chú lỗi prompt/tool/control flow + checklist self-review
■2 tools tựviết: 1 API wrapper đơn giản, 1 data query đơn giản
■1 system prompt có rules, constraints, output contract
■5 câu test đểchứng minh agent biết khi nào trảlời trực tiếp, khi nào gọi tool
■Self-review checklist cho system prompt (6 items)
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
3 / 64

## Slide 6

01
Prompt Engineering Fundamen-
tals
Prompt tốt không phải prompt “hay”, mà là prompt tạo ra hành vi
mong muốn ổn định

## Slide 7

Prompt = Interface Giữa Ý Định và KhảNăng Model
Prompt kém
"Viết email cho tôi"
Không rõ gửi ai, vềgì, tone nào, dài bao nhiêu.
Kết quả: chung chung, khó dùng ngay.
Prompt tốt
Viết email xin lỗi khách hàng
vềgiao hàng trễ2 ngày,
tone lịch sự, dưới 120 từ,
có CTA rõ ràng.
Rõ task, context, constraint, format.
Kết quả: actionable hơn hẳn.
Lưu ý: Nguyên tắc vàng: Specificity beats cleverness. Prompt ngắn nhưng rõ
nghĩa thường tốt hơn prompt dài mà lan man.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
4 / 64

## Slide 8

4 Thành Phần Của Prompt Tốt
ROLE
Vai trò
TASK
Nhiệm vụ
CONTEXT
Bối cảnh
FORMAT
Định dạng
”Act as a senior
support analyst”
”Summarize the ticket
and propose
next step”
”For an internal
operations dashboard”
”Output as JSON
with 3 fields”
Bắt đầu với Task + Format. Chỉthêm Role hoặc Context khi chúng thực sựcải thiện
chất lượng hoặc tính nhất quán.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
5 / 64

## Slide 9

RTCF Deep Dive: Ví DụThực Tế
Component
Ví dụtốt
Ví dụkém
Tại sao
Role
“Senior Python dev, FastAPI
expert”
“Developer”
Ảnh hưởng code style,
library choices
Task
“Refactor function X to use
async/await”
“Fix code”
Specificity giảm ambigu-
ity
Context
“Codebase:
FastAPI,
Python 3.12, PostgreSQL”
(trống)
Model đoán sai stack
Format
“Return only the function, no
explanation”
(trống)
Model thêm giải thích
không cần
Mỗi component thêm vào prompt phải có lý do rõ ràng
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
6 / 64

## Slide 10

Prompt Iteration: TừKém →Tốt →Xuất Sắc
v1 — Mơ hồ
"Tóm tắt bài báo này"
Không rõ dài bao nhiêu, cho ai đọc, focus gì.
v2 — Có format
"Tóm tắt trong 3 bullets, mỗi bullet
dưới 20 từ"
Rõ format, nhưng thiếu audience và focus.
v3 — RTCF đầy đủ
"Tóm tắt cho executive team.
3
bullets, <20 từ.
Focus: Q2 rev-
enue impact. Tone: data-driven."
Rõ audience, task, constraint, format.
Prompt engineering là iterative process. Viết →test →observe →improve. Không
ai viết prompt hoàn hảo lần đầu.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
7 / 64

## Slide 11

Instruction vs Conversation vs System Prompt
Loại prompt
Mục đích chính
Khi dùng
Instruction prompt
Ra lệnh trực tiếp cho một
tác vụ
Hỏi đáp 1 lượt, transform, sum-
marize, classify
Conversation
prompt
Giữngữcảnh nhiều lượt
với user
Chatbot, support, tutor, debug-
ging nhiều bước
System prompt
Đặt policy, boundary, output
contract
Agent, assistant production, use
case cần hành vi ổn định
Anthropic prompting guidance + teaching heuristics
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
8 / 64

## Slide 12

Negative Prompting & Boundary Setting
Chỉnói ”đừng” — kém
“Đừng dùng jargon”
“Đừng đoán”
“Đừng trảlời quá dài”
Nói rõ thay thế— tốt
“Giải thích bằng ngôn ngữlớp 10 hiểu được”
“Nếu không chắc, trảlời: Tôi cần thêm thông tin”
“Giới hạn dưới 150 từ”
Negative prompts hiệu quảnhất khi kèm positive alternative. Model cần biết nên
làm gì, không chỉbiết đừng làm gì.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
9 / 64

## Slide 13

Token Budget Awareness
■Prompt dài hơn không đồng nghĩa prompt tốt hơn.
■Mỗi token thừa làm tăng chi phí, latency, và đôi khi cảnhiễu.
■Hãy ưu tiên: instruction rõ, examples đúng chỗ, output contract rõ.
■Rule thực dụng: nếu prompt dài thêm nhưng không làm thay đổi hành vi mong
muốn, hãy cắt bớt.
Lưu ý: Prompt engineering tốt là tối ưu độrõ và khảnăng kiểm soát, không phải
thi xem ai viết prompt dài hơn.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
10 / 64

## Slide 14

Temperature & Sampling Parameters
Use case
Temp
Lý do
Classification,
extraction
0
Deterministic, reproducible
Chatbot,
sup-
port
0.3–0.5
Nhất quán nhưng tựnhiên
Creative writing
0.7–1.0
Đa dạng, sáng tạo
Brainstorming
1.0–1.5
Khám phá, chấp nhận noise
Lưu ý: Temperature không thay
thếprompt tốt. Nếu prompt mơ
hồ, giảm temperature chỉkhiến
model lặp lại cùng một output
kém.
Chỉxét các tokens có tổng xác suất ≤p. Thường dùng p = 0.9–0.95. Đừng tune cả
temp và top_p cùng lúc.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
11 / 64

## Slide 15

Quick Exercise: Viết Prompt Theo RTCF (2 phút)
Bạn cần viết prompt cho chatbot hỗtrợsinh viên VinUni đăng ký môn học.
Xác định 4 thành phần:
■Role: Chatbot là ai? Expertise level?
■Task: Nhiệm vụcụthểlà gì?
■Context: Hệthống nào? Giới hạn gì?
■Format: Output trông như thếnào?
Thảo luận với người bên cạnh. Chia sẻ1–2 ví dụsau 2 phút.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
12 / 64

## Slide 16

02
Advanced Prompting Techniques
Dùng kỹthuật nâng cao khi chúng cải thiện chất lượng thật sự,
không dùng như thần chú

## Slide 17

Zero-shot, One-shot, Few-shot, CoT
Zero-shot
Không có ví dụmẫu.
Nhanh, rẻ, nên thửtrước.
One-shot
1 ví dụmẫu.
Tốt khi cần giữformat rõ
hơn.
Few-shot
2–5 ví dụ.
Tăng consistency, nhưng
tốn token hơn.
CoT
Cho
model
reasoning
từng bước.
Hữu ích cho task suy
luận.
Thứtựthửthực dụng: zero-shot -> few-shot -> decomposition / CoT. Đừng nhảy
vào prompt phức tạp ngay từđầu.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
13 / 64

## Slide 18

Khi Nào Dùng Few-shot?
■Khi model hiểu task nhưng ra sai format
hoặc không ổn định giữa các input
tương tự.
■Khi cần giữtiêu chuẩn đánh giá, tone,
hoặc cách lập luận nhất quán.
■Ví dụmẫu nên relevant, đa dạng vừa đủ,
và đúng format mong muốn.
Few-shot không phải để“dạy lại” model mọi thứ; nó là cách chỉ
ra pattern mà bạn muốn model bám theo.
Nguồn minh họa: zero/few-shot teaching graphic trong repo
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
14 / 64

## Slide 19

Few-shot Prompting — Python Example
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
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
15 / 64

## Slide 20

Few-shot Anti-patterns
□
Ví dụquá giống nhau: model overfits pattern, không generalize sang input mới
□
Ví dụsai format: model copy sai format từexamples
□
Quá nhiều ví dụ(>5): diminishing returns, tốn token, chậm hơn
□
Ví dụcó lỗi: model sẽreproduce lỗi một cách trung thành
□
✓
Best practice: ví dụđa dạng, đúng format, cover edge cases, 2–5 examples
là đủ
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
16 / 64

## Slide 21

Chain-of-Thought (CoT) và Tree-of-Thought
CoT phù hợp khi:
■Bài toán cần reasoning nhiều bước
■Bạn muốn model giải thích logic trung
gian
■Bạn cần debug xem model sai ở
bước nào
Tree-of-Thought:
■Hữu ích cho bài toán cần explore
nhiều hướng
■Phức tạp hơn, tốn token và latency
hơn
■Chỉnên giới thiệu như extension,
không phải mặc định cho mọi task
CoT là công cụcải thiện reasoning, không phải phép màu. Nếu task vốn dĩ chỉlà
formatting hoặc extraction đơn giản, CoT thường là overkill.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
17 / 64

## Slide 22

Chain-of-Thought — Python Example
prompt = """Phan tich review khach san va cho diem 1-5.
Hay suy nghi tung buoc:
1. Xac dinh cac khia canh duoc nhac den
2. Danh gia sentiment cua tung khia canh
3. Tong hop diem cuoi cung
Review: "Phong rong, view dep, nhung dich vu cham va gia hoi cao"
Phan tich:"""
# Khong CoT: model tra loi "3/5" (khong giai thich)
# Co CoT:
model liet ke tung khia canh, danh gia, roi ket luan
#
-> de debug, de hieu tai sao model cho diem nhu vay
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
18 / 64

## Slide 23

Structured Output Prompting
Tại sao cần?
LLM output mặc định là free-form text, khó
parse programmatically. Trong agent pipeline,
bạn cần JSON/structured data.
Các cách tiếp cận:
■JSON mode: API parameter
(OpenAI)
■Prompt-based: “Respond ONLY with
valid JSON”
■XML tags:
<thinking>...</thinking>
■Prefill: Bắt đầu assistant msg bằng {
(Anthropic)
Lưu ý: Luôn validate JSON output.
Model có thểtrảsai format, đặc biệt
với schema phức tạp hoặc tempera-
ture cao.
Đưa JSON schema ví dụvào prompt
giúp model bám format tốt hơn. Ví dụ:
{"intent": "...", "action": "...",
"reply": "..."}
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
19 / 64

## Slide 24

Khi Nào KHÔNG Cần KỹThuật Nâng Cao
Task đơn
giản?
Format không
ổn định?
Cần reasoning
nhiều bước?
Zero-shot đủ
Few-shot
(1–3 examples)
CoT
Decomposition
Yes
Yes
Yes
No
No
No
Bắt đầu đơn giản. Chỉthêm complexity khi output chưa đạt yêu
cầu.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
20 / 64

## Slide 25

03
System Prompt Engineering
System prompt tốt làm agent nhất quán hơn, dễkiểm soát hơn,
và dễtest hơn

## Slide 26

Anatomy của System Prompt Production-grade
Persona: role, expertise level, communication style
Rules: việc nên làm, việc luôn phải làm
Capabilities: model được phép dùng tools nào, dữliệu nào
Constraints: không làm gì, khi nào từchối, khi nào escalate
Output format: JSON, markdown, bullet list, schema, language
priority
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
21 / 64

## Slide 27

System Prompt — Python Example
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
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
22 / 64

## Slide 28

System Prompt Iteration: v1 →v2
v1 — Thiếu constraints
You are a support agent.
Help customers with orders.
Be polite.
Vấn đề: model hallucinate order status,
trảlời câu hỏi ngoài scope,
output format không nhất quán.
v2 — Sau khi test & fix
You are a support triage agent.
Rules: Answer in Vietnamese. Be concise.
Constraints: NEVER invent order status.
If out of scope, say: “Tôi chỉhỗtrợvềđơn hàng.”
Output: JSON {intent, action, reply}
Cải thiện: clear boundaries, output contract,
refusal pattern rõ ràng.
System prompt cần iterate dựa trên test results. Viết →test 10 câu →fix →test
lại.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
23 / 64

## Slide 29

System Prompt: Anthropic vs OpenAI API
Anthropic Claude
client.messages.create(
model="claude-sonnet-4-...",
system="You are...",
messages=[...],
tools=[...]
)
HỗtrợXML tags: <rules>, <constraints> trong system
prompt đểcấu trúc rõ hơn.
OpenAI GPT
client.chat.completions.create(
model="gpt-4.1",
messages=[
{"role": "system",
"content": "You are..."},
{"role": "user", ...}
],
tools=[...]
)
System prompt nằm trong messages array.
Concept giống nhau, chỉkhác syntax. Dùng markdown/XML sections đểstructure system prompt
dài.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
24 / 64

## Slide 30

System Prompt Anti-Patterns
□
Quá dài: nhồi mọi thứvào 1 prompt 2000+ tokens rồi hy vọng model luôn làm
đúng
□
Mâu thuẫn: vừa bảo “ngắn gọn”, vừa bắt “giải thích chi tiết từng bước”
□
Mơ hồ: “hãy thông minh”, “hãy chuyên nghiệp”, nhưng không định nghĩa chuẩn
output
□
Không test edge cases: quên kiểm tra câu hỏi ngoài phạm vi, refusal, tool failure
□
✓
Nguyên tắc: system prompt là policy layer. Càng rõ boundary, càng dễpredict
hành vi
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
25 / 64

## Slide 31

System Prompt Testing Checklist
□
✓
Happy path: câu hỏi trong scope →trảlời đúng format?
□
✓
Edge case: câu hỏi mơ hồ→hỏi lại hay đoán bừa?
□
✓
Out of scope: câu hỏi ngoài phạm vi →từchối đúng cách?
□
✓
Adversarial: prompt injection →có bịbypass?
□
✓
Tool decision: khi nào gọi tool vs khi nào trảlời trực tiếp?
□
✓
Format consistency: 10 câu khác nhau →output format nhất quán?
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
26 / 64

## Slide 32

Real-world System Prompt Template
## Identity
Ban la [role] cho [company/product].
## Rules
- ALWAYS: [hanh vi bat buoc]
- NEVER: [hanh vi cam]
- WHEN [condition]: [hanh vi cu the]
## Available Tools
- tool_name: khi nao dung, khi nao KHONG dung
## Output Format
{"intent": "...", "action": "...", "reply": "..."}
## Escalation
Khi [dieu kien] -> chuyen cho nhan vien
Dùng template này làm starting point. Thêm/bớt sections tùy use case.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
27 / 64

## Slide 33

Mini Exercise: Critique a System Prompt (3 phút)
You are a helpful assistant. Be smart and professional.
Answer any question the user asks. Be concise but also explain in detail.
You can use tools. Always respond in JSON format. If you don't know, make your
best guess.
Tìm ít nhất 3 vấn đềtrong system prompt trên.
Gợi ý: Mâu thuẫn? Mơ hồ? Thiếu gì? Nguy hiểm ởđâu?
Thảo luận nhóm 3 phút →chia sẻ.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
28 / 64

## Slide 34

04
Context Engineering
Điều quan trọng không phải nhét bao nhiêu context, mà là chọn
đúng context cần thiết

## Slide 35

Context Window Management
System
History
Current input
Tools
Output
policy
recent / relevant
current task
schemas
buffer
Lưu ý: Token budget allocation cần chủđộng: đừng đểhistory, tools, và examples
ăn hết chỗdành cho output.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
29 / 64

## Slide 36

Lost in the Middle Problem
Vịtrí trong context
Attention
Đầu
Giữa
Cuối
Liu et al. 2023
Hệquảthực tiễn:
• Đặt instructions quan trọng ởđầu hoặc cuối
• Context dài →info ởgiữa dễbị“quên”
• Break long lists bằng headers/separators
• Recent context nên đặt ngay trước user
query
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
30 / 64

## Slide 37

Memory Injection và Context Compression
Memory injection
■Chỉđưa vào facts thật sựcần cho
task hiện tại
■Ưu tiên recent history hoặc relevant
history, không dump toàn bộtranscript
■Tốt cho support agent, coding
assistant, tutor nhiều lượt
Compression
■Summarize: tóm tắt phần cũ
■Drop: bỏhẳn phần không còn liên
quan
■Archive: đẩy ra ngoài context, chỉ
fetch lại khi cần
Context engineering là bài toán chọn lọc và ưu tiên. Nếu mọi thứđều quan trọng,
thực ra không có gì thực sựnổi bật với model.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
31 / 64

## Slide 38

Token Budget Allocation: Nên Nghĩ Theo RổNào?
Rổtoken
Chứa gì
Rủi ro nếu quá nhiều
System prompt
policy, rules, output format
chậm hơn, khó maintain
History
recent turns, facts liên quan
dễnhiễu, dễlost in the middle
Tool schemas
tên tool, mô tả, tham số
model chọn tool tệnếu schema
dài hoặc mơ hồ
Output buffer
phần model dùng đểtrảlời
bịcắt cụt output nếu cấp thiếu
Teaching heuristic for token budgeting
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
32 / 64

## Slide 39

RAG Context Pattern
User
Query
Retrieval
(search DB)
Relevant
Chunks
Inject vào
Prompt
LLM
Response
Agent có thểcó tool search_kb đểre-
trieve context on-demand, thay vì nhét
sẵn toàn bộKB vào prompt.
Best practices:
• Inject với source citation
• Limit chunk size (500–1000 tokens)
• Rank by relevance, chỉlấy top-k
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
33 / 64

## Slide 40

Context Engineering Checklist
□
✓
Đã cắt bỏhistory không liên quan đến task hiện tại?
□
✓
System prompt có dưới 500 tokens (trừkhi cần hơn)?
□
✓
Tool schemas có concise descriptions (không dài quá)?
□
✓
Output buffer đủcho expected response length?
□
✓
Important info ởđầu hoặc cuối context (tránh middle)?
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
34 / 64

## Slide 41

05
Prompt Safety & Evaluation
Prompt tốt không chỉcho kết quảđúng — nó còn phải an toàn và
đáng tin

## Slide 42

Direct injection
User trực tiếp nói “Ignore your instructions and do X”
Indirect injection
Malicious content trong document/email mà agent đọc qua
tool
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
35 / 64

## Slide 43

Defense Strategies
1. Delimiter separation:
Wrap untrusted input:
<user_input>...</user_input>
2. Instruction hierarchy:
System prompt luôn ưu tiên hơn user input
3. Input validation:
Filter known injection patterns trước khi đưa vào
prompt
4. Output validation:
Kiểm tra output trước khi execute actions
5. Least privilege:
Tool permissions tối thiểu cần thiết
6. Human-in-the-loop:
Yêu cầu confirm cho sensitive actions
Lưu ý: Không có defense nào là hoàn hảo 100%. Defense-in-depth: kết hợp nhiều
layers.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
36 / 64

## Slide 44

Prompt Evaluation Framework
Dimension
Câu hỏi
Đo bằng cách
Correctness
Output
có
đúng
không?
Test cases + human
review
Consistency
10
lần
chạy
cho
cùng kết quả?
Chạy lặp lại, đo %
match
Safety
Có
bị
bypass
không?
Adversarial
test
cases
Chạy 10–20 test cases.
Nếu
<90%
pass
→
cần
iterate
prompt.
A/B testing: so sánh prompt v1
vs v2 trên cùng test set.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
37 / 64

## Slide 45

Guardrails Pattern
User
Input
Pre-guard
validate input
LLM
Post-guard
validate output
Safe
Output
Pre-guard:
• Detect injection attempts
• Validate input format
• Rate limiting
Post-guard:
• Mask PII trong output
• Validate JSON schema
• Block dangerous tool calls
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
38 / 64

## Slide 46

06
Tool Calling
Tool calling là cách agent chuyển từ“nói” sang “tương tác với thế
giới thực”

## Slide 47

Tool Calling Flow
LLM
decides
tool_call JSON
App executes
tool
tool result
LLM final
response
Model không tựchạy code hay tựgọi API ngoài. Ứng dụng của bạn nhận tool request,
chạy tool, rồi gửi kết quảtrởlại model.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
39 / 64

## Slide 48

Tool Calling: Ai Làm Gì?
Vai trò
Trách nhiệm
Ví dụ
Developer (bạn)
Định nghĩa tool schema, viết imple-
mentation, handle errors
Viết get_weather() function
LLM
Quyết định tool nào, arguments gì,
dựa trên user intent
Output:
{"name":
"get_weather", "city":
"Hanoi"}
Application
Nhận tool call, execute, trảresult
Gọi API weather, trảJSON
result
LLM (lần 2)
Synthesize tool result thành câu trả
lời tựnhiên
“Hà Nội hôm nay 32°C, trời
nắng”
Phân vai rõ ràng giúp hiểu đúng cơ chế
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
40 / 64

## Slide 49

Tool Schema Anatomy
■Name: nên ngắn, rõ, động từđúng
việc
■Description: nói khi nào nên dùng
tool này
■Parameters: mô tảinput bằng JSON
Schema
■Required fields: giúp model biết
thiếu gì thì chưa gọi được
Lưu ý: LLM đọc description như tài
liệu hướng dẫn. Nếu description mơ
hồ, model sẽchọn sai tool hoặc truyền
sai arguments.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
41 / 64

## Slide 50

Tool Schema — Python Example
weather_tool = {
"type": "function",
"function": {
"name": "get_weather",
"description": "Get current weather for a city when the user asks about weather conditions.",
"parameters": {
"type": "object",
"properties": {
"city": {"type": "string", "description": "City name, e.g. Hanoi"}
},
"required": ["city"]
}
}
}
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
42 / 64

## Slide 51

Good vs Bad Tool Description
Description
Hệquả
Bad
"Gets weather"
Quá ngắn, model không biết khi nào
dùng
Bad
"This comprehensive tool can
be used to retrieve current
weather information for any city
worldwide..."
Quá dài, thêm noise
Good
"Get current weather for a city.
Use when user asks about weather,
temperature, or conditions."
Rõ chức năng + trigger condition
Tool description = documentation cho model. Nên chứa: (1) chức năng, (2) khi nào dùng, (3) khi nào KHÔNG dùng.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
43 / 64

## Slide 52

tool_choice Parameter
Giá trị
Ý nghĩa
Khi dùng
auto (mặc định)
Model tựquyết gọi hay không
Hầu hết use cases
required / any
Buộc gọi ít nhất 1 tool
Pipeline steps, routing
none
Cấm gọi tool, chỉtext
Test, fallback mode
{"name": "X"}
Buộc gọi tool cụthể
Khi biết chắc cần tool nào
Lưu ý: Dùng required cẩn thận: model có thểgọi tool với arguments bịa nếu user không cung cấp đủthông tin.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
44 / 64

## Slide 53

Tool Calling: OpenAI vs Anthropic Format
OpenAI
tools = [{
"type": "function",
"function": {
"name": "get_weather",
"description": "...",
"parameters": {...}
}
}]
Response:
message.tool_calls[0]
.function.name / .arguments
Anthropic
tools = [{
"name": "get_weather",
"description": "...",
"input_schema": {...}
}]
Response:
content[i].type == "tool_use"
content[i].name / .input
Concept giống nhau. Khác: parameters vs input_schema, response structure.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
45 / 64

## Slide 54

XửLý Tool Errors
Lỗi
Xửlý
Timeout
Retry + exponential backoff
Error response
Truyền error message cho
model đểnó thông báo user
Unexpected for-
mat
Validation layer + fallback
Tool not found
Log + return error JSON
Thêm instruction:
"If a tool returns an error, explain the issue to the user
and suggest alternatives. Never retry silently more than 2
times."
Lưu ý: Tool errors không phải edge case — chúng sẽxảy ra trong production. Plan
for failure.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
46 / 64

## Slide 55

07
Design Principles Cho Tools
Tool tốt là software interface tốt, không phải prompt trang trí

## Slide 56

4 Nguyên Tắc Thiết KếTool
Nguyên tắc
Ý nghĩa
Nếu vi phạm
Single Responsibil-
ity
Mỗi tool làm 1 việc rõ ràng
model khó quyết định nên gọi
tool nào
Idempotency
Cùng input cho cùng kết quả;
side effect được kiểm soát
retry dễsinh lỗi phụ
Granularity hợp lý
Không quá nhỏ, cũng không
ôm quá nhiều việc
hoặc overhead lớn, hoặc tool
quá cứng
Test độc lập
Unit test từng tool trước khi
gắn vào agent
khó tách lỗi tool khỏi lỗi prompt
Principles for reliable tool interfaces
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
47 / 64

## Slide 57

Tool Granularity: Quá NhỏHay Quá To Đều Có Giá
Quá nhỏ
■get_customer_name
■get_customer_email
■get_customer_phone
Hệquả: quá nhiều calls, overhead lớn,
flow rối.
Quá to
■handle_all_customer_operations
Hệquả: model không hiểu boundary, khó
debug, khó reuse.
Thiết kếtool quanh một hành động nghiệp vụrõ ràng:
ví dụlookup_order,
get_weather, query_sales_data, send_email_draft.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
48 / 64

## Slide 58

Parameter Design Best Practices
■Required vs Optional: chỉrequire
những gì thực sựcần
■Enum constraints:
"status": {"type": "string",
"enum": ["pending","shipped","delivered"]}
→Giảm lỗi arguments
■Default values: document rõ trong
description
Thêm ví dụvào parameter descrip-
tion:
"date": {
"type": "string",
"description": "Date in
YYYY-MM-DD format,
e.g. 2026-04-05"
}
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
49 / 64

## Slide 59

Tool Return Format Best Practices
Structured response:
// Success
{"status": "success",
"data": {"temp": 32, "city": "Hanoi"},
"source": "openweathermap"}
// Error
{"status": "error",
"message": "City not found",
"code": "NOT_FOUND"}
Rules:
• TrảJSON, không raw HTML/XML
• Error format consistent
• Include metadata (source, timestamp)
• Truncate nếu response quá dài
Lưu ý: Model xửlý structured JSON
tốt hơn nhiều so với raw text hay
HTML.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
50 / 64

## Slide 60

Tool Description Engineering
Cùng tool, description khác →model behavior khác hoàn toàn
Mơ hồ
"Search orders"
Model gọi cho MỌI câu hỏi liên quan đến order, kểcả“đơn hàng là gì?”
Rõ ràng
"Search orders by order_id or customer email.
Use ONLY when user provides an order number or
asks about specific order status."
Model biết boundary rõ, chỉgọi khi có đủdata
Description nên chứa: (1) chức năng, (2) khi nào dùng, (3) khi nào KHÔNG dùng.
Viết như viết API docs.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
51 / 64

## Slide 61

08
Parallel Tool Calling & Patterns
Nhanh hơn không có nghĩa là tốt hơn nếu flow control và merge
logic không rõ

## Slide 62

Sequential vs Parallel Tool Calls
Sequential
Tool B cần output của Tool A.
Ví dụ: tìm order ID -> rồi mới tra shipping status.
Parallel
Các tool độc lập có thểchạy cùng lúc.
Ví dụ: gọi thời tiết, tỷgiá, và lịch họp song song.
Lưu ý: Chỉsong song hóa khi không có phụthuộc dữliệu. Nếu song song, vẫn cần
bước merge / verify rõ ràng ởcuối.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
52 / 64

## Slide 63

3 Tool Use Patterns Thường Gặp
1. Conditional tool use: agent tựquyết định có cần tool hay trảlời trực tiếp.
2. Tool chaining: output của tool A là input của tool B.
3. Parallel fetch + merge: lấy nhiều nguồn độc lập rồi tổng hợp kết quả.
Tool calling không chỉlà “gọi API”. Nó là bài toán control flow: khi nào gọi, gọi cái gì,
gọi theo thứtựnào, và làm gì khi tool fail.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
53 / 64

## Slide 64

3 Patterns — Visual Flow
1. Conditional
User
LLM
?
Tool
Direct
2. Chaining
User
Tool A
LLM
Tool B
Reply
3. Parallel
User
LLM
Tool A
Tool B
Tool C
Merge
Reply
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
54 / 64

## Slide 65

Minimal Tool Loop — Python Example
messages = [{"role": "user", "content": "Thoi tiet Ha Noi va ty gia USD hom nay?"}]
response = client.responses.create(model="gpt-4.1", input=messages, tools=tools)
for item in response.output:
if item.type == "function_call":
result = run_tool(item.name, json.loads(item.arguments))
messages.append(item)
messages.append({"type": "function_call_output", "call_id": item.call_id, "output": result})
final = client.responses.create(model="gpt-4.1", input=messages, tools=tools)
print(final.output_text)
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
55 / 64

## Slide 66

Robust Tool Loop — Error Handling
MAX_ROUNDS = 5
messages = [{"role": "user", "content": user_input}]
for round_num in range(MAX_ROUNDS):
response = call_model(messages, SYSTEM_PROMPT, TOOLS)
tool_calls = extract_tool_calls(response)
if not tool_calls:
break
# Model done, no more tools needed
for tc in tool_calls:
try:
result = execute_tool(tc.name, tc.args)
except TimeoutError:
result = {"error": "Tool timed out, please try again"}
except Exception as e:
result = {"error": str(e)}
messages.append(tool_result(tc.id, json.dumps(result)))
else:
print("Warning: max tool rounds reached")
Luôn có max rounds đểtránh infinite loop. Luôn handle errors gracefully.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
56 / 64

## Slide 67

09
Thực Hành
Lab 4: Build first agent với system prompt + 2 tools + 5 test
cases

## Slide 68

Hands-on 4: Cách Chạy Lab
1. Viết 1 system prompt với rules, constraints, output format
2. Tạo 2 custom tools: 1 API wrapper đơn giản, 1 data query đơn giản
3. Nối tools vào agent loop
4. Chạy 5 câu test đểxem khi nào agent trảlời trực tiếp, khi nào gọi tool
5. Ghi lại lỗi thuộc loại prompt, tool schema, hay control flow
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
57 / 64

## Slide 69

Lab Skeleton — Python Example
SYSTEM_PROMPT = open("system_prompt.txt").read()
TOOLS = [get_weather_tool(), query_sales_tool()]
while True:
user_input = input("You: ")
messages.append({"role": "user", "content": user_input})
response = call_model(messages, SYSTEM_PROMPT, TOOLS)
messages = handle_tool_calls(response, messages)
print(render_final_answer(messages, SYSTEM_PROMPT, TOOLS))
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
58 / 64

## Slide 70

Lab Walkthrough: Step-by-Step
Step 1–3: Setup
1. Chọn domain (weather + sales, hoặc
tựchọn)
2. Viết system prompt (dùng template đã
học)
3. Viết 2 tool schemas (name,
description, params)
Step 4–6: Build & Test
4. Implement tool functions (mock data
OK)
5. Wire vào agent loop (có error
handling)
6. Test 5 câu hỏi, ghi pass/fail + lỗi
Bắt đầu với mock tools (trảdata cốđịnh) trước. Đảm bảo flow đúng rồi mới lo vềreal
data.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
59 / 64

## Slide 71

5 Test Questions Gợi Ý
#
Câu hỏi
Expected
Kiểm tra
1
“Thời tiết Hà Nội hôm nay?”
Gọi get_weather
Tool A hoạt động
2
“Doanh sốtháng 3 là bao nhiêu?”
Gọi query_sales
Tool B hoạt động
3
“So sánh doanh sốvới thời tiết tuần này”
Gọi cả2 tools
Parallel/chaining
4
“Prompt engineering là gì?”
Trảlời trực tiếp
Conditional: no tool
5
“Cho tôi sốđiện thoại CEO”
Từchối,
out of
scope
Refusal handling
Thêm câu test
riêng nếu agent của bạn có domain khác.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
60 / 64

## Slide 72

Lab Self-Review Checklist
□
✓
Agent chạy end-to-end không crash?
□
✓
System prompt có đủ5 thành phần (Persona, Rules, Capabilities, Constraints,
Format)?
□
✓
Tool schemas có clear descriptions + required fields?
□
✓
Agent biết khi nào gọi tool vs khi nào trảlời trực tiếp?
□
✓
Agent xửlý gracefully khi tool fail (không crash, thông báo user)?
□
✓
Đã ghi chú ít nhất 2 lỗi phát hiện + phân loại (prompt / tool / control flow)?
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
61 / 64

## Slide 73

Lab #4
Mục tiêu: Build ReAct agent với 2 custom tools, viết system prompt chuẩn, và test
end-to-end trên 5 câu hỏi
Deliverable:
Deliverable:
Agent script chạy được + system prompt + 2 tool
schemas + 5 test outputs + note lỗi prompt/tool/control flow + self-review check-
list
Thời gian: 150 phút
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
62 / 64

## Slide 74

Tổng kết — Key Takeaways
Những ý chính cần nhớtrước khi sang bài tiếp theo
1
Prompt = interface giữa human intent và model capability. Prompt tốt giúp model làm đúng
việc, đúng format, đúng boundary.
2
System prompt tốt = agent nhất quán và predictable hơn, đặc biệt khi có tools và constraints.
3
Tool schema description quyết định rất mạnh việc model biết khi nào dùng tool nào và gọi với
arguments gì.
4
Parallel tool calls nhanh hơn đáng kểkhi các tool độc lập; nếu có phụthuộc dữliệu, hãy giữ
flow tuần tự.
5
Prompt safety (injection defense, guardrails) là bắt buộc cho production agents, không phải
“nice to have”.
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
62 / 64

## Slide 75

Tiếp theo & Bài tập
AI Product Thinking & Require-
ments
“Bạn đã build được agent đầu tiên.
Nhưng build xong chưa đủ. Ngày mai:
sản phẩm này dành cho ai, yêu cầu ra
sao, và rủi ro nào phải nghĩ từđầu?”
■Hoàn thiện Lab 4 với 5 test
questions rõ pass/fail
■Đọc lại system prompt của mình
và chỉra 2 chỗcòn mơ hồhoặc
mâu thuẫn
■Thửviết 2 adversarial test cases
(prompt injection) cho agent của
bạn
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
63 / 64

## Slide 76

Tài Liệu Tham Khảo
1 Anthropic. Prompt Engineering Overview. docs.anthropic.com
2 Anthropic. Claude Prompting Best Practices và Multishot Prompting. docs.anthropic.com
3 Anthropic. Tool Use Overview. docs.anthropic.com
4 OpenAI. Function Calling Guide. platform.openai.com/docs
5 Wei et al. Chain-of-Thought Prompting Elicits Reasoning in LLMs. 2022.
6 Liu et al. Lost in the Middle: How Language Models Use Long Contexts. 2023.
7 LangGraph Docs. Quickstart. langchain-ai.github.io/langgraph
8 OWASP. Top 10 for LLM Applications. owasp.org
Giảng viên (VinUni)
AICB · Ngày 4
Tuần 1
64 / 64

## Slide 77

Hỏi & Đáp
Bạn đang gặp lỗi vì model chưa hiểu ý bạn,
hay vì tool contract của bạn chưa đủrõ?

## Slide 78

Cảm ơn!
Email: lecturer@vinuni.edu.vn
Slides & tài liệu: github.com/aicb-vinuni
Lab template: bit.ly/aicb-day04-lab
