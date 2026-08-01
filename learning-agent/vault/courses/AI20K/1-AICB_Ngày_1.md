---
course: AI20K
generated: '2026-07-30T17:39:04+00:00'
lang: vi
lesson: 1-AICB_Ngày_1
maps:
- '[[MOC - AI20K]]'
module: ''
source_file: AI20K/1-AICB_Ngày_1.pdf
source_hash: sha256:f7e39bcbf84917d52d166b0fd149831afbed0d9f5f958278f4cbafcc2be70493
type: lesson-note
---

```markdown
<!-- src: ... -->
## Slide 1 — AI & LLM Foundation

Bạn đang dùng AI mỗi ngày nhưng thực sự bên trong nó làm gì? Giữ câu hỏi này trong đầu khi học bài hôm nay.

## Nội dung bài học
1. Bức tranh AI 2026
2. LLM - Trái tim của AI hiện đại
3. Token Economy
4. Gọi API lần đầu
5. Vibe Coding
6. Thực hành

<!-- src: ... -->
## Slide 2 — Bức tranh AI 2026

Từ [[Machine Learning]] đến [[Agentic AI]].

<!-- src: ... -->
## Slide 3 — Sau buổi học này, bạn sẽ:

1. Hiểu cách [[LLM]] hoạt động (Transformer, token, next-token prediction).
2. Ước tính chi phí API call dựa trên [[token economy]].
3. Sử dụng LLM từ third-party (OpenAI, Anthropic) hoặc self-host open model.
4. Nắm vững [[Vibe Coding]] mindset và sử dụng AI đúng cách, không lệ thuộc.
5. Xây dựng chatbot đơn giản có streaming response.

Python 3.10+, VS Code/Cursor, API key (OpenAI).

<!-- src: ... -->
## Slide 4 — AI Taxonomy - Các tầng của trí tuệ nhân tạo

- ■ AI: Máy thực hiện tác vụ 'thông minh'.
- ■ ML: Học từ dữ liệu, không cần lập trình tường minh.
- ■ DL: Neural networks nhiều tầng.
- ■ Generative AI: Nhánh AI tiên tiến có khả năng sáng tạo ra nội dung (văn bản, ảnh, video) giống như con người.
- ■ LLM: Foundation Model chuyên ngôn ngữ - nền tảng của Generative AI và Agentic AI.

Khóa học này tập trung vào LLM → xây dựng Agentic AI.

<!-- src: ... -->
## Slide 5 — Discriminative AI

Chức năng: Phân loại, dự đoán.

Ví dụ:
- Spam filter
- Image classifier
- Fraud detection

Input → Label.

<!-- src: ... -->
## Slide 6 — Generative AI

Chức năng: Sinh nội dung mới.

Ví dụ:
- ChatGPT, Claude
- DALL-E, Midjourney
- GitHub Copilot

Prompt → Content.

<!-- src: ... -->
## Slide 7 — Agentic AI

Chức năng: Tự lập kế hoạch & hành động.

Ví dụ:
- AI coding agents
- Auto customer support
- Research agents

Goal → Plan → Action.

[[LLM]] là engine chung cho cả Generative AI lẫn Agentic AI.

Hành trình khóa học: LLM Foundation → Agent → Multi-Agent → Deploy → Evaluate.

<!-- src: ... -->
## Slide 8 — Tình hình sử dụng AI

78% Doanh nghiệp dùng AI.

15.7T GDP toàn cầu từ AI (2030). 

3.7x ROI trung bình trên mỗi $1 đầu tư. 

AI không còn chỉ là 'trả lời hay' nữa. Từ 2024 trở đi, doanh nghiệp quan tâm nhiều hơn đến AI biết hành động, kết nối công cụ và tạo ra ROI.

<!-- src: ... -->
## Slide 9 — Level 0 - Core reasoning engine

LLM suy luận dựa trên kiến thức nội tại của chính nó, không sử dụng công cụ bên ngoài.

<!-- src: ... -->
## Slide 10 — Level 1 - Connected Solver

LLM trở thành agent, có khả năng kết nối với công cụ bên ngoài, truy xuất dữ liệu, tìm kiếm, gọi API.

<!-- src: ... -->
## Slide 11 — Level 2 - Strategic Problem-Solver

LLM agent lập kế hoạch nhiều bước. Sử dụng nhiều công cụ và chuỗi suy luận để xử lý bài toán phức tạp.

<!-- src: ... -->
## Slide 12 — Level 3 - Collaborative AI Agents

Nhiều agent LLM chuyên biệt phối hợp làm việc với nhau để giải quyết vấn đề phức tạp.

## Prompt tĩnh chỉ giải quyết 1 câu hỏi

- ■ Prompt → Response (1 bước)
- ■ Không truy cập dữ liệu mới
- ■ Không hành động được.

## AI Agent giải quyết mục tiêu hoàn chỉnh

- ■ Goal → Plan → Action
- ■ Kết nối API, database, tools
- ■ Xử lý workflow nhiều bước
- ■ Tạo giá trị thực tế (ROI).

<!-- src: ... -->
## Slide 13 — Thành phần của AI Agent

- ■ Goal - nhận mục tiêu thay vì prompt đơn lẻ.
- ■ Reasoning - phân tích và lập kế hoạch nhiều bước.
- ■ Tools - search, API, database, code.
- ■ Memory - lưu trạng thái và lịch sử.
- ■ Action - thực thi hành động trong hệ thống.

[[Agent]] = Goal + Reasoning + Tools + Memory + Action.

<!-- src: ... -->
## Slide 14 — Tương lai của AI

- ■ Generalist AI: Agent chuyển từ chuyên biệt → AI tổng quát xử lý mục tiêu phức tạp, dài hạn.
- ■ Deep Personalization: AI cá nhân hóa sâu, chủ động đề xuất và khám phá mục tiêu người dùng.
- ■ Embodied AI: AI tích hợp vào robot, IoT và hệ thống thế giới vật lý.
- ■ Agent-driven Economy: AI agents tự vận hành, tham gia kinh tế và tự động hóa lao động.
- ■ Adaptive Multi-Agent Systems: Hệ multi-agent tự đánh giá, tạo/nhân bản/loại bỏ agent để tối ưu nhiệm vụ.

<!-- src: ... -->
## Slide 15 — LLM - Trái tim của AI hiện đại

[[Transformer]], [[Token]], và cách [[LLM]] 'suy nghĩ'.

<!-- src: ... -->
## Slide 16 — Large Language Model (LLM)

Mô hình ngôn ngữ lớn dựa trên kiến trúc [[Transformer]], được huấn luyện trên lượng dữ liệu văn bản khổng lồ (hàng nghìn tỷ token). [[LLM]] có khả năng sinh văn bản, trả lời câu hỏi, viết code, và thực hiện reasoning phức tạp.

## Đặc điểm chính:

- ■ Decoder-only [[Transformer]] architecture.
- ■ Self-supervised pre-training + RLHF fine-tuning.
- ■ Next-token prediction - dự đoán từ tiếp theo.
- ■ Emergent capabilities xuất hiện khi scale lên.

<!-- src: ... -->
## Slide 17 — Transformer - Kiến trúc cách mạng (2017)

- ■ Self-Attention: Mỗi token 'nhìn' tất cả token khác trong context.
- ■ Multi-Head: Nhiều 'góc nhìn' song song.
- ■ Feed-Forward: Xử lý phi tuyến từng vị trí.
- ■ Residual connections: Gradient chảy dễ dàng.

Hai kiến trúc chính: Encoder-Decoder (BERT, T5) hiểu ngữ cảnh 2 chiều để phân loại, dịch thuật. Decoder-only (GPT, Claude, Gemini) đọc trái → phải để dự đoán token tiếp và sinh văn bản. Ngày nay Decoder-only thắng thế nhờ scale tốt hơn.

<!-- src: ... -->
## Slide 18 — Transformer - Positional Encoding

Positional Encoding (P) to ra một vector vị trí được ip, sau đó cộng trực tiếp vào input embedding. Positional encoding không thay thế embedding, nó dung hợp vị trí vào ngữ nghĩa.

X = E + P
- E: Input Embeddings (Nội dung).
- X: Final Input (Kết quả).
- P: Positional Encodings (Vị trí).

<!-- src: ... -->
## Slide 19 — Attention

Attention cho phép model "chú ý" đến các phần quan trọng nhất của input khi xử lý mỗi token.

Ví dụ: "Con mèo ngồi trên bàn. Nó rất đáng yêu." Khi xử lý từ “Nó”, attention sẽ gán trọng số cao cho “mèo”, hiểu được rằng “Nó” đang chỉ đến con mèo.

<!-- src: ... -->
## Slide 20 — Self-Attention - Q, K, V và Attention Score

Tính "điểm tương đồng" (dot-product). Điểm càng cao, 2 token càng liên quan.

<!-- src: ... -->
## Slide 21 — Quy trình Self-Attention

Bước 1: Tính điểm chú ý (Attention Scoring), Bước 2: Chia (Scaling), và Bước 3: Chuẩn hóa (Softmax) để tạo attention map.

<!-- src: ... -->
## Slide 22 — Self-Attention - Masked Self-Attention

Khi dùng Decoder-only, ta phải che (mask) các từ chưa được sinh ra để đảm bảo tính đồng nhất trong quy trình sinh văn bản.

<!-- src: ... -->
## Slide 23 — Token

Token là đơn vị nhỏ nhất mà [[LLM]] xử lý, khoảng 0.75 từ tiếng Anh, 0.5 từ tiếng Việt. 

Ví dụ Tokenization:
- 'Hello world' → 2 tokens.
- 'def func():' → 4 tokens.
- 'Xin chào' → 3-4 tokens.

[[LLM]] không đọc 'từ', [[LLM]] đọc subword tokens.

<!-- src: ... -->
## Slide 24 — Đặc điểm của LLM

- ■ [[LLM]] không 'hiểu' ngôn ngữ - nó dự đoán token có xác suất cao nhất.
- ■ Temperature: Điều chỉnh độ 'sáng tạo' (0 = deterministic, 1 = random hơn).
- ■ Autoregressive: Output token trở thành input cho bước tiếp theo.

Lưu ý: [[LLM]] có thể tự tin đưa ra thông tin sai (hallucination) vì nó tối ưu xác suất, không phải sự thật.

### Các khái niệm quan trọng:
- **[[Knowledge cutoff]]**: Model không biết những gì xảy ra sau thời điểm huấn luyện nếu không được cấp thêm dữ liệu/tools.
- **[[Hallucination]]**: Model có thể trả lời rất tự tin nhưng sai vì đang tối ưu xác suất token, không phải tính đúng-sai.

<!-- src: ... -->
## Slide 25 — Token Economy

Chi phí, tốc độ và cách tính giá API.

Token = đơn vị nhỏ nhất mà [[LLM]] xử lý.

- Công thức chi phí: Input tokens + Output tokens = Cost.
- [[Tokens]] được dùng để tính chi phí API, giới hạn context window, đo độ dài prompt, quyết định latency.

## Các trường hợp phổ biến
- Tiếng Việt tốn nhiều token hơn tiếng Anh.
- Code với nhiều ký tự đặc biệt và khoảng trắng tốn nhiều hơn.

<!-- src: ... -->
## Slide 26 — Chi phí API

- Giá tính theo 1 triệu tokens (1M tokens).
- Output tokens đắt hơn input tokens (3-5x).
- Giá có thể giảm ∼ 10x mỗi năm.

## Nguồn làm tăng chi phí
- Input tokens chiếm phần lớn chi phí.
- Chat history dài → cost tăng dần.

## Kết luận

Tối ưu chi phí = tối ưu prompt + context.

<!-- src: ... -->
## Slide 27 — Latency và Cost

- Nhiều tokens hơn → vừa chậm hơn vừa đắt hơn.

- Tổng thời gian = Nhiều input tokens + Nhiều output tokens + Model đắt hơn.

## So sánh LLM phổ biến

| Model            | In    | Out   | Ctx   | Loại   | Khi nên dùng            |
|------------------|-------|-------|-------|--------|-------------------------|
| Claude Opus 4.6  | $5.0  | $25   | 1M    | Closed | Reasoning, code khó     |
| Claude Sonnet 4  | $3.0  | $15   | 1M    | Closed | Balanced choice         |
| Claude Haiku 4.5 | $0.8  | $4    | 200K  | Closed | Fast, cheap, routing    |
| GPT-4o           | $5.0  | $20   | 128K  | Closed | Multimodal, ecosystem   |
| Gemini 2.5 Pro   | $1.25 | $10   | 1M    | Closed | Long-context tasks      |
| Llama 4 Scout    | Free  | Free  | 1M    | Open   | Self-host, private data |

Lưu ý: Closed = API hosted; Open = self-host / control nhiều hơn.

<!-- src: ... -->
## Slide 28 — Gọi API lần đầu

Từ 'Hello World' đến production-ready call.

## Prerequisites - Trước khi bắt đầu

- Python 3.10+ đã cài đặt.
- VS Code hoặc Cursor IDE.
- Tài khoản Open API (có credit).
- Biến môi trường: OPENAI_API_KEY.
- Tài khoản Google Colab.

<!-- src: ... -->
## Slide 29 — Giải phẫu một API Call

- Request (gửi đi):
  - model: model sử dụng (vd: gpt-4o).
  - messages: input hội thoại.
  - max_tokens: giới hạn độ dài output.
  - temperature: độ sáng tạo (tuỳ chọn).

- Response (nhận về):
  - choices[0].message.content: nội dung trả lời.
  - usage.prompt_tokens: input tokens.
  - usage.completion_tokens: output tokens.
  - usage.total_tokens: tổng tokens.
  - finish_reason: stop | length | tool_calls.

<!-- src: ... -->
## Slide 30 — Vibe Coding

Lập trình bằng cách làm việc cùng AI.

## Định nghĩa

Viết phần mềm bằng cách mô tả ý tưởng AI sẽ generate code.

## Quy trình Vibe Coding

Idea → Prompt → Code → Test → Refine.

- Viết phần mềm nhanh hơn không phải viết code nhiều hơn.

<!-- src: ... -->
## Slide 31 — Mindset Shift

Developer chuyển từ người viết code → sang người thiết kế + review + điều phối AI.

## Vibe Coding Mindset

- Mô tả mục tiêu rõ ràng.
- AI generate code.
- Chỉnh sửa bằng prompt.
- Review logic quan trọng.
- Iterate nhanh nhiều lần.

<!-- src: ... -->
## Slide 32 — Thực hành Live Demo & Lab

Mục tiêu: Gọi OpenAI API thực tế: so sánh GPT-4o và GPT-4o-mini về latency, cost, quality.

Deliverable: Script Python hoàn chỉnh: gọi GPT-4o + GPT-4o-mini, chatbot có streaming, bảng so sánh kết quả.

Thời gian: 90 phút.

<!-- src: ... -->
## Slide 33 — Ngày 2: Prompt Engineering

'Prompt tốt tạo ra output tốt. Nhưng 'tốt' nghĩa là gì?'

## Đọc thêm:
- Vaswani et al. (2017).
- Thử gọi API với 3 prompts khác nhau.

<!-- src: ... -->
## Slide 34 — Hỏi & Đáp

Bạn có câu hỏi nào về [[LLM]], [[Transformer]], [[Token Economy]], hoặc API?

<!-- src: ... -->
## Slide 35 — Cảm ơn!

Huỳnh Thành Trung

Email: trung.ht@vinuni.edu.vn

Bài tập nộp trước Ngày 2 ∙ Đọc thêm: Vaswani et al. (2017).

## Khái niệm chính

- **[[AI]]**: Trí tuệ nhân tạo - sự mô phỏng của các quy trình thông minh của con người qua máy tính.
- **[[ML]]**: Machine Learning - học từ dữ liệu mà không cần lập trình tường minh.
- **[[DL]]**: Deep Learning - một phần của học máy sử dụng neural networks nhiều tầng.
- **[[Generative AI]]**: Nhánh AI có khả năng tạo ra nội dung mới.
- **[[LLM]]**: Large Language Model - mô hình ngôn ngữ lớn dựa trên kiến trúc Transformer.
- **[[Transformer]]**: Kiến trúc mạng neural cách mạng cho xử lý ngôn ngữ tự nhiên.
- **[[Token]]**: Đơn vị nhỏ nhất mà LLM xử lý.
- **[[Token Economy]]**: Hệ sinh thái chi phí, tốc độ và cách tính giá API.
- **[[Vibe Coding]]**: Lập trình bằng cách làm việc cùng AI.
- **[[Hallucination]]**: Hiện tượng khi model đưa ra thông tin sai mặc dù có vẻ tự tin.
- **[[Knowledge cutoff]]**: Thời điểm mà model không còn biết về dữ liệu mới hơn.
- **[[Agentic AI]]**: AI có khả năng tự lập kế hoạch và hành động để giải quyết vấn đề.
```
