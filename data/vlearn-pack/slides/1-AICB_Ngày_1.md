# 1 AICB Ngày 1

## Slide 1

AI & LLM Foundation
AICB-P1 ∙Ngày 1 ∙Nền tảng
Huỳnh Thành Trung
VinUniversity ∙Phase 1 ∙Tuần 1 ∙02/04/2026

## Slide 2

?
HÃY SUY NGHĨ...
“Bạn đang dùng AI mỗi ngày —
nhưng thực sựbên trong nó làm gì?”
Giữcâu hỏi này trong đầu khi học bài hôm nay

## Slide 3

Nội dung bài học
1. Bức tranh AI 2026
2. LLM — Trái tim của AI hiện đại
3. Token Economy
4. Gọi API lần đầu
5. Vibe Coding
6. Thực hành
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
1 / 67

## Slide 4

01
Bức tranh AI 2026
TừMachine Learning đến Agentic AI

## Slide 5

Mục tiêu bài học
Sau buổi học này, bạn sẽ:
1. Hiểu cách LLM hoạt động (Transformer, token, next-token prediction)
2. Ước tính chi phí API call dựa trên token economy
3. Sửdụng LLM từthird-party (OpenAI, Anthropic) hoặc self-host open model
4. Nắm vững Vibe Coding mindset và sửdụng AI đúng cách, không lệthuộc
5. Xây dựng chatbot đơn giản có streaming response
Python 3.10+, VS Code/Cursor, API key (OpenAI)
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
2 / 67

## Slide 6

AI Taxonomy — Các tầng của trí tuệnhân tạo
Artificial Intelligence
Machine Learning
Deep Learning
Generative AI
LLM
■AI: Máy thực hiện tác vụ“thông minh”
■ML: Học từdữliệu, không cần lập
trình tường minh
■DL: Neural networks nhiều tầng
■Generative AI: Nhánh AI tiên tiến có
khảnăng sáng tạo ra nội dung (văn
bản, ảnh, video) giống như con người
■LLM: Foundation Model chuyên ngôn
ngữ— nền tảng của GenAI và
Agentic AI
Khóa học này tập trung vào LLM →xây dựng Agentic
AI
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
3 / 67

## Slide 7

Ba nhóm AI chính
Discriminative AI
Chức năng: Phân loại, dựđoán
Ví dụ:
• Spam filter
• Image classifier
• Fraud detection
Input →Label
Generative AI
Chức năng: Sinh nội dung mới
Ví dụ:
• ChatGPT, Claude
• DALL-E, Midjourney
• GitHub Copilot
Prompt →Content
Agentic AI
Chức năng: Tựlập kếhoạch &
hành động
Ví dụ:
• AI coding agents
• Auto customer support
• Research agents
Goal →Plan →Action
LLM là engine chung cho cảGenerative AI lẫn Agentic AI
Hành trình khóa học: LLM Foundation →Agent →Multi-Agent →Deploy →Evaluate
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
4 / 67

## Slide 8

TừAI cổđiển đến Agentic AI
1
Perceptron
(1957)
2
Deep Learning
bùng nổ
(2012)
3
Transformer
(2017)
4
ChatGPT
(2022)
5
AI Agents
(2024–26)
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
5 / 67

## Slide 9

Vì sao 2024-2026 là bước ngoặt?
78%
Doanh nghiệp
dùng AI
$15.7T
GDP toàn cầu
từAI (2030)
3.7x
ROI trung bình
trên mỗi $1 đầu tư
AI không còn chỉlà “trảlời hay” nữa. Từ2024 trởđi, doanh nghiệp quan tâm nhiều
hơn đến AI biết hành động, kết nối công cụvà tạo ra ROI.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
6 / 67

## Slide 10

TừLLM đến AI Agents
Level 0 — Core reasoning engine
LLM suy luận dựa trên kiến thức
nội tại của chính nó, không sửdụng
công cụbên ngoài.
Level 2 — Strategic Problem-Solver
LLM agent lập kếhoạch nhiều bước.
Sửdụng nhiều công cụvà chuỗi suy
luận đểxửlý bài toán phức tạp.
Level 1 — Connected Solver
LLM trởthành agent, có khảnăng kết
nối với công cụbên ngoài, truy xuất
dữliệu, tìm kiếm, gọi API.
Level 3 — Collaborative AI Agents
Nhiều agent LLM chuyên biệt phối
hợp làm việc với nhau đểgiải quyết
vấn đềphức tạp.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
7 / 67

## Slide 11

Tại sao cần AI Agents?
Prompt tĩnh chỉgiải quyết 1 câu hỏi
■Prompt →Response (1 bước)
■Không truy cập dữliệu mới
■Không hành động được
AI Agent giải quyết mục tiêu hoàn chỉnh
■Goal →Plan →Action
■Kết nối API, database, tools
■Xửlý workflow nhiều bước
■Tạo giá trịthực tế(ROI)
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
8 / 67

## Slide 12

Thành phần của AI Agent
■Goal — nhận mục tiêu thay vì prompt đơn lẻ
■Reasoning — phân tích và lập kếhoạch nhiều bước
■Tools — search, API, database, code
■Memory — lưu trạng thái và lịch sử
■Action — thực thi hành động trong hệthống
Agent = Goal + Reasoning + Tools + Memory + Action
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
9 / 67

## Slide 13

Tương lai của AI Agents
■Generalist AI: Agent chuyển từchuyên biệt →AI tổng quát xửlý mục tiêu phức tạp,
dài hạn
■Deep Personalization: AI cá nhân hóa sâu, chủđộng đềxuất và khám phá mục
tiêu người dùng
■Embodied AI: AI tích hợp vào robot, IoT và hệthống thếgiới vật lý
■Agent-driven Economy: AI agents tựvận hành, tham gia kinh tếvà tựđộng hóa
lao động
■Adaptive Multi-Agent Systems: Hệmulti-agent tựđánh giá, tạo/nhân bản/loại bỏ
agent đểtối ưu nhiệm vụ
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
10 / 67

## Slide 14

02
LLM — Trái tim của AI hiện đại
Transformer, Token, và cách LLM “suy nghĩ”

## Slide 15

Định nghĩa
Large Language Model (LLM)
Mô hình ngôn ngữlớn dựa trên kiến trúc Transformer, được huấn luyện trên lượng
dữliệu văn bản khổng lồ(hàng nghìn tỷtoken). LLM có khảnăng sinh văn bản, trả
lời câu hỏi, viết code, và thực hiện reasoning phức tạp.
Đặc điểm chính:
■Decoder-only Transformer architecture
■Self-supervised pre-training + RLHF fine-tuning
■Next-token prediction — dựđoán từtiếp theo
■Emergent capabilities xuất hiện khi scale lên
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
11 / 67

## Slide 16

Transformer — Kiến trúc cách mạng (2017)
Input Tokens
Embedding + Position
Self-Attention
Feed-Forward Network
×N layers
Next Token Prediction
■Self-Attention: Mỗi token “nhìn” tất
cảtoken khác trong context
■Multi-Head: Nhiều “góc nhìn” song
song
■Feed-Forward: Xửlý phi tuyến
từng vịtrí
■Residual connections: Gradient
chảy dễdàng
Hai kiến trúc chính: Encoder-Decoder (BERT, T5) hiểu ngữcảnh 2 chiều đểphân loại,
dịch thuật. Decoder-only (GPT, Claude, Gemini) đọc trái→phải đểdựđoán token tiếp và
sinh văn bản. Ngày nay Decoder-only thắng thếnhờscale tốt hơn.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
12 / 67

## Slide 17

Transformer — Encoder-Decoder vs Decoder-only
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
13 / 67

## Slide 18

Transformer — Input Embedding
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
14 / 67

## Slide 19

Transformer — Input Embedding
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
15 / 67

## Slide 20

Transformer — Positional Encoding
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
16 / 67

## Slide 21

Self-Attention — Cơ chếcốt lõi
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
17 / 67

## Slide 22

Self-Attention — Q, K, V và Attention Score
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
18 / 67

## Slide 23

Self-Attention — Scaled Dot-Product Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
19 / 67

## Slide 24

Self-Attention — Scaled Dot-Product Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
20 / 67

## Slide 25

Self-Attention — Scaled Dot-Product Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
21 / 67

## Slide 26

Self-Attention — Scaled Dot-Product Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
22 / 67

## Slide 27

Self-Attention — Scaled Dot-Product Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
23 / 67

## Slide 28

Self-Attention — Scaled Dot-Product Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
24 / 67

## Slide 29

Self-Attention — Single Head Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
25 / 67

## Slide 30

Self-Attention — Single Head Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
26 / 67

## Slide 31

Self-Attention — Single Head Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
27 / 67

## Slide 32

Self-Attention — Single Head Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
28 / 67

## Slide 33

Self-Attention — Single Head Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
29 / 67

## Slide 34

Self-Attention — Single Head Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
30 / 67

## Slide 35

Self-Attention — Masked Self-Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
31 / 67

## Slide 36

Self-Attention —Multi-Head Attention
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
32 / 67

## Slide 37

Token — Đơn vịcơ bản của LLM
Token — Đơn vịnhỏnhất mà LLM xửlý —
khoảng 0.75 từtiếng Anh, 0.5 từtiếng Việt
Tokenization: Tách text thành subword units
"Hello world"
→2 tokens
"Xin chào"
→3–4 tokens
"anthropic"
→3 tokens
"def func():"
→4 tokens
[``Tôi''] [`` yêu'']
[`` Việt''] [`` Nam'']
→4+ tokens (mỗi từcó dấu = 1–2 tokens)
So sánh: “I love Vietnam” →3 tokens
Thử: platform.openai.com/tokenizer
Lưu ý: Tiếng Việt tốn nhiều token hơn tiếng Anh (dấu, ký tựUnicode)
→chi phí API cao hơn cho cùng nội dung.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
33 / 67

## Slide 38

Next-Token Prediction — LLM “suy nghĩ” thếnào
Hà
Nội
là
thủ
đô
của
Việt Nam
p = 0.94
■LLM không “hiểu” ngôn ngữ— nó dựđoán token có xác suất cao nhất
■Temperature: Điều chỉnh độ“sáng tạo” (0 = deterministic, 1 = random hơn)
■Autoregressive: Output token trởthành input cho bước tiếp theo
Lưu ý: LLM có thểtựtin đưa ra thông tin sai (hallucination) vì nó tối ưu xác suất,
không phải sựthật.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
34 / 67

## Slide 39

LLM được tạo ra như thếnào?
1. Pre-training
2. SFT
3. RLHF / DPO
Đọc Internet
học ngôn ngữ, kiến thức
Học theo ví dụ
đểbiết “trảlời đúng kiểu”
Căn chỉnh theo
sởthích con người, an toàn hơn
Lưu ý: Analogy dễnhớ: Pre-training = “đọc rất nhiều”, SFT = “được chỉcách trảlời”,
RLHF/DPO = “được uốn nắn đểcư xửđúng hơn”.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
35 / 67

## Slide 40

Giới hạn bẩm sinh của LLM
Knowledge cutoff
Model không biết những gì xảy ra sau
thời điểm training nếu không được cấp
thêm dữliệu/tools.
Hallucination
Model có thểtrảlời rất tựtin nhưng sai
vì đang tối ưu xác suất token, không
phải tính đúng-sai.
Context window
Model chỉ“nhìn” được lượng token
hữu hạn trong mỗi lần gọi. Quá dài thì
tốn chi phí, và thông tin giữa prompt dễ
bịquên.
Analogy
LLM giống một “học giảđọc rất nhiều”
nhưng sống trong một bong bóng thời
gian và chỉđược nhìn một sốtrang
trước mặt.
Gợi ý dạy: nhấn mạnh rằng các giới hạn này giải thích vì sao sau này cần prompt tốt, context management, RAG và tools.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
36 / 67

## Slide 41

03
Token Economy
Chi phí, tốc độvà cách tính giá API

## Slide 42

Token là gì?
Token = đơn vịnhỏnhất mà LLM xửlý
Ví dụTokenization
■”Hello world” →2 tokens
■”Xin chào” →3–4 tokens
■”def func():” →4 tokens
LLM không đọc “từ”,
LLM đọc subword tokens
Token được dùng để
■Tính chi phí API
■Giới hạn context window
■Đo độdài prompt
■Quyết định latency
Công thức chi phí
Input tokens + Output tokens = Cost
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
37 / 67

## Slide 43

Vì sao một sốnội dung tốn nhiều token hơn?
Các trường hợp phổbiến
■Tiếng Việt — Unicode và từbịtách nhỏhơn ”Tôi yêu Việt Nam” > ”I love
Vietnam”
■Code — nhiều ký tựđặc biệt và khoảng trắng def func(): →nhiều tokens
■Text có cấu trúc — JSON, URL, ID, sốdài user_id: 98347298347
Rule of Thumb
Unicode + ký tựđặc biệt + cấu trúc phức tạp →tốn nhiều token hơn
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
38 / 67

## Slide 44

API Pricing Model — Cách tính chi phí
Input Tokens
(prompt)
+
Output Tokens
(response)
=
Total Cost
($/call)
■Giá tính theo 1 triệu tokens (1M tokens)
■Output tokens đắt hơn input tokens (3–5x)
■Giá giảm ∼10x mỗi năm (GPT-4 level: $20/M →$2/M trong 2 năm)
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
39 / 67

## Slide 45

Prompt dài = Chi phí cao
Nguồn làm tăng chi phí
■Input tokens chiếm phần lớn
chi phí
■System prompt lặp lại mỗi API
call
■RAG context dài →cost cao
■Chat history dài →cost tăng
dần
Ví dụ
User question: 50 tokens
System prompt: 300 tokens
RAG context: 800 tokens
Output: 200 tokens
Total = 1350 tokens / call
Kết luận
Tối ưu chi phí = tối ưu prompt + context
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
40 / 67

## Slide 46

Latency vs Cost Trade-off
Tăng Latency
■Context dài hơn
■Output dài hơn
■Model lớn hơn
Tăng Cost
■Nhiều input tokens
■Nhiều output tokens
■Model đắt hơn
Key Insight
Nhiều tokens hơn →vừa chậm hơn vừa đắt hơn
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
41 / 67

## Slide 47

So sánh LLM phổbiến — Chọn gì cho đúng việc?
Model
In
Out
Ctx
Loại
Khi nên dùng
Claude Opus 4.6
$5.0
$25
1M
Closed
Reasoning, code
khó
Claude Sonnet 4
$3.0
$15
1M
Closed
Balanced choice
Claude Haiku 4.5
$0.8
$4
200K
Closed
Fast, cheap, rout-
ing
GPT-4o
$5.0
$20
128K
Closed
Multimodal,
ecosystem
Gemini 2.5 Pro
$1.25
$10
1M
Closed
Long-context
tasks
Llama 4 Scout
Free
Free
1M
Open
Self-host, private
data
Lưu ý: Closed = API hosted; Open = self-host / control nhiều hơn. Giá tham khảo tháng 3/2026.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
42 / 67

## Slide 48

Framework chọn model nhanh
Nếu ưu tiên cost/latency
■FAQ, phân loại, trích xuất đơn
giản
■Batch jobs sốlượng lớn
■Trảlời ngắn, ít reasoning
Gợi ý: Haiku, Gemini Flash, model
nhỏ/open-source
Nếu ưu tiên quality/reasoning
■Phân tích nhiều bước, code,
planning
■Tài liệu dài, ngữcảnh phức tạp
■Bài toán cần độtin cậy cao
Gợi ý: Sonnet, Opus, GPT-4o, Gemini
Pro
Lưu ý: Rule of thumb: bắt đầu từmodel đủtốt và đủrẻ. Chỉnâng model khi chất
lượng thực sựchặn use case.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
43 / 67

## Slide 49

Cùng một prompt — 3 model, 3 phong cách
Prompt ví dụ: “Tóm tắt báo cáo tài chính Q1 trong 3 bullet và nêu 1 rủi ro chính.”
Claude
Mạch lạc, thiên vềcấu
trúc.
Phong cách: cẩn thận,
“consulting style”.
GPT-4o
Ngắn gọn, tựnhiên,
linh hoạt.
Phong cách: hợp ap-
p/chat, đa dụng.
Gemini
Mạnh khi context dài,
nhiều tài liệu.
Phong
cách:
hợp
workflow nhiều file.
Gợi ý dạy: chạy live cùng 1 prompt đểhọc viên thấy model selection không chỉlà “giá”, mà còn là phong cách + độphù
hợp task.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
44 / 67

## Slide 50

Context Window — Bộnhớlàm việc của LLM
Context Window — Sốtoken tối đa mà
LLM xửlý trong 1 lần gọi API (input + out-
put)
■128K tokens ≈1 cuốn sách 300 trang
■1M tokens ≈4–5 cuốn sách
■Context càng dài →chi phí càng cao
■Thông tin ởgiữa context dễbị“quên” (Lost
in the Middle)
Gemini 2.5
1M
Claude Sonnet 4
1M
Claude Opus 4.6
1M
GPT-4o
128K
Llama 4
1M
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
45 / 67

## Slide 51

Tính chi phí thực tế— Ví dụ
Scenario: Chatbot hỗtrợkhách hàng, 1000 lượt/ngày
Input trung bình:
500 tokens/lượt (câu hỏi + context)
Output trung bình:
200 tokens/lượt (câu trảlời)
Dùng Claude Sonnet 4:
Input: 500K × $3/1M = $1.50
Output: 200K × $15/1M = $3.00
Tổng/ngày: $4.50
Tổng/tháng: ∼$135
Dùng Claude Haiku 4.5:
Input: 500K × $0.80/1M = $0.40
Output: 200K × $4/1M = $0.80
Tổng/ngày: $1.20
Tổng/tháng: ∼$36
Lưu ý: Chọn model phù hợp: Haiku cho tác vụđơn giản, Sonnet/Opus cho reasoning
phức tạp.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
46 / 67

## Slide 52

04
Gọi API lần đầu
Từ“Hello World” đến production-ready call

## Slide 53

Luồng một API call
Prompt
API Call
Token Stream
Response
■Prompt: system + user input + context
■API Call: gửi request tới model provider
■Token Stream: model sinh output từng chunk
■Response: text hoàn chỉnh + usage + stop reason
Lưu ý: Tư duy đúng cho PM/engineer: mỗi API call luôn có 3 thứcần kiểm soát cùng
lúc: quality, latency, cost.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
47 / 67

## Slide 54

Prerequisites — Trước khi bắt đầu
□
✓
Python 3.10+ đã cài đặt
□
✓
VS Code hoặc Cursor IDE
□
✓
Tài khoản Open API (có credit)
□
✓
Biến môi trường: OPENAI_API_KEY
□
✓
Tài khoản Google Colab
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
48 / 67

## Slide 55

Gọi OpenAI API — Hello World
from dotenv import load_dotenv
import os
from openai import OpenAI
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
response = client.chat.completions.create(
model="gpt-4o",
messages=[
{"role": "user", "content": "Hello!"}
]
)
print(response.choices[0].message.content)
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
49 / 67

## Slide 56

Giải phẫu một API Call (OpenAI GPT-4o)
Request (gửi đi):
■model: model sửdụng (vd: gpt-4o)
■messages: input hội thoại
■max_tokens: giới hạn độdài output
■temperature: độsáng tạo (tuỳchọn)
Ví dụ:
■role: system / user / assistant
■messages = list hội thoại
Response (nhận về):
■choices[0].message.content: nội
dung trảlời
■model: model thực tếdùng
■usage.prompt_tokens: input tokens
■usage.completion_tokens: output
tokens
■usage.total_tokens: tổng tokens
■finish_reason: stop | length |
tool_calls
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
50 / 67

## Slide 57

Tham sốĐiều Khiển Output
temperature
Độ“sáng tạo” (0–1)
0 = deterministic; 1 = diverse. Dùng
thấp cho code/phân tích, cao hơn cho
sáng tạo
top_p
Nucleus sampling (0–1)
Chỉchọn từtop tokens chiếm p% xác
suất. Thường dùng 0.9–0.95
stop_sequences
Dừng ởchuỗi chỉđịnh
Hữu ích khi cần output có cấu trúc cố
định hoặc cắt đúng điểm mong muốn
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
51 / 67

## Slide 58

Giải thích temperature và top_p
Bắt đầu với temperature=0 cho tác vụcần ổn định. Chỉtăng sampling khi thật sựcần
đa dạng câu trảlời.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
52 / 67

## Slide 59

So sánh cú pháp — Anthropic vs OpenAI
# === OPENAI (GPT) ===
from openai import OpenAI
client = OpenAI()
resp = client.chat.completions.create(
model="gpt-4o",
messages=[{"role": "user", "content": "Hello"}]
)
print(resp.choices[0].message.content)
# .choices[0]...
# === ANTHROPIC (Claude) ===
import anthropic
client = anthropic.Anthropic()
resp = client.messages.create(
model="claude-sonnet-4-6", max_tokens=1024,
messages=[{"role": "user", "content": "Hello"}]
)
print(resp.content[0].text)
# .content[0].text
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
53 / 67

## Slide 60

Gọi OpenAI API — Hàm wrapper
from openai import OpenAI
client = OpenAI(
base_url=f"<YOUR_API_ENDPOINT>",
api_key='<YOUR_API_KEY>',
)
def call_llm(prompt):
response = client.chat.completions.create(
model="<MODEL_NAME>",
messages=[
{"role": "user", "content": prompt}
],
max_tokens=300
)
return response.choices[0].message.content
print(call_llm("Explain RAG in 2 bullets"))
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
54 / 67

## Slide 61

Gọi OpenAI API — Đọc Token Usage
from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
model="gpt-4o",
messages=[
{"role": "user", "content": "Explain tokenization"}
],
max_tokens=200
)
print(response.choices[0].message.content)
print("Prompt tokens:", response.usage.prompt_tokens)
print("Completion tokens:", response.usage.completion_tokens)
print("Total tokens:", response.usage.total_tokens)
print("Finish reason:", response.choices[0].finish_reason)
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
55 / 67

## Slide 62

Gọi OpenAI API — Chatbot loop
from openai import OpenAI
client = OpenAI()
while True:
user_input = input("You: ")
if user_input.lower() in ["exit", "quit"]:
break
response = client.chat.completions.create(
model="gpt-4o",
messages=[
{"role": "user", "content": user_input}
],
max_tokens=300
)
print("Bot:", response.choices[0].message.content)
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
56 / 67

## Slide 63

Tựhost LLM lên local environment
from transformers import AutoTokenizer, AutoModelForCausalLM
model_name = "Qwen/Qwen3-0.6B-Base"
# Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name)
# Load the model
model = AutoModelForCausalLM.from_pretrained(model_name)
# Example of generating text (optional)
inputs = tokenizer("Hello, world!", return_tensors="pt")
outputs = model.generate(inputs["input_ids"], max_new_tokens=100)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
57 / 67

## Slide 64

Streaming — Response theo từng chunk (OpenAI)
from openai import OpenAI
client = OpenAI()
# Streaming: receive response chunk by chunk
stream = client.chat.completions.create(
model="gpt-4o",
messages=[
{"role": "user", "content": "Write a poem"}
],
stream=True,
max_tokens=1024
)
for chunk in stream:
if chunk.choices[0].delta.content is not None:
print(chunk.choices[0].delta.content,
end="", flush=True)
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
58 / 67

## Slide 65

05
Vibe Coding
Lập trình bằng cách làm việc cùng AI

## Slide 66

Vibe Coding là gì?
Định nghĩa
Viết phần mềm bằng cách mô tảý tưởng AI sẽgenerate code
■Không viết code từđầu
■Mô tảyêu cầu bằng ngôn ngữtựnhiên
■AI sinh code
■Developer review và chỉnh sửa
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
59 / 67

## Slide 67

Vì sao cần Vibecoding?
■Viết code thủcông chậm
■Boilerplate code lặp lại
■AI viết code nhanh hơn
■Tập trung vào logic thay vì syntax
Viết phần mềm nhanh hơn không phải viết code nhiều hơn
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
60 / 67

## Slide 68

Vibe Coding Workflow
Quy trình Vibe Coding
Idea →Prompt →Code →Test →Refine
■Mô tảbài toán
■AI generate code
■Chạy thửnhanh
■Refine prompt
■Lặp lại nhiều lần
■Chốt kết quả
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
61 / 67

## Slide 69

Mindset Shift — Từviết code sang điều phối AI
Cách lập trình truyền thống
■Nghĩ thuật toán trước
■Viết code từng bước
■Debug lỗi thủcông
■Tối ưu hiệu năng
■Boilerplate nhiều
Vibe Coding Mindset
■Mô tảmục tiêu rõ ràng
■AI generate code
■Chỉnh sửa bằng prompt
■Review logic quan trọng
■Iterate nhanh nhiều lần
Mindset mới
Developer chuyển từngười viết code →sang người thiết kế+ review + điều
phối AI
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
62 / 67

## Slide 70

3 nguyên tắc Vibecoding
1. Intent-driven
Nói rõ mục tiêu
và output mong muốn
2. Context-first
Cung cấp bối cảnh
file, ví dụ, ràng buộc
3. Human review
AI viết nhanh
con người kiểm tra và chốt
Vibecoding hiệu quảkhi ý định rõ ràng, ngữcảnh đầy đủvà luôn có bước rà soát cuối.
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
63 / 67

## Slide 71

Prompt tốt vs Prompt kém
Prompt kém
Write a chatbot using OpenAI
■Mục tiêu mơ hồ
■Thiếu yêu cầu cụthể
■Không có tiêu chí đầu ra
■AI dễtrảcode chung chung
Prompt tốt
Build a CLI chatbot using
OpenAI
■conversation memory
■streaming response
■exit with “quit”
■show token usage
Kết quả: output rõ hơn, dễdùng hơn,
ít phải sửa hơn
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
64 / 67

## Slide 72

06
Thực hành
Live Demo & Lab

## Slide 73

Lab #1
Mục tiêu: Gọi OpenAI API thực tế: so sánh GPT-4o và GPT-4o-mini vềlatency,
cost, quality
Deliverable: Script Python hoàn chỉnh: gọi GPT-4o + GPT-4o-mini, chatbot có
streaming, bảng so sánh kết quả
Thời gian: 90 phút
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
65 / 67

## Slide 74

Tổng kết — Key Takeaways
Những ý chính cần nhớtrước khi sang bài tiếp theo
1
LLM = Transformer dựđoán token tiếp theo từcontext
2
Đểusable, LLM đi qua Pre-training →SFT →alignment
3
Chọn model theo trade-off quality, latency, cost
4
Một API call luôn có prompt, response, usage và stop reason
5
Vibe Coding tốt = intent rõ + context đủ+ review kỹ
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
65 / 67

## Slide 75

Tiếp theo & Bài tập
Ngày 2: Prompt Engineering
“Prompt tốt tạo ra output tốt. Nhưng
“tốt” nghĩa là gì?”
■Đọc: “Attention Is All You Need”
(2017)
■Thửgọi API với 3 prompts khác
nhau
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
66 / 67

## Slide 76

Tài liệu tham khảo
1. Vaswani et al. (2017). “Attention Is All You Need”. arXiv:1706.03762
2. Ouyang et al. (2022). “InstructGPT / RLHF”. arXiv:2203.02155
3. Rafailov et al. (2023). “DPO”. arXiv:2305.18290
4. Karpathy (2023). “State of GPT” practitioner talk
5. Anthropic / OpenAI / Google API quickstarts
Giảng viên (VinUni)
AICB ∙Ngày 1
02/04/2026
67 / 67

## Slide 77

Hỏi & Đáp
Bạn có câu hỏi nào vềLLM, Transformer, Token Economy, hoặc API?

## Slide 78

Cảm ơn!
Huỳnh Thành Trung
Email: trung.ht@vinuni.edu.vn
Bài tập nộp trước Ngày 2 ∙Đọc thêm: Vaswani et al. (2017)
