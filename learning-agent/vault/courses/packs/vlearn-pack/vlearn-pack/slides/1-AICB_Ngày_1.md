---
course: packs
generated: '2026-07-30T10:27:56+00:00'
lang: vi
lesson: 1-AICB_Ngày_1
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/slides/1-AICB_Ngày_1.md
source_hash: sha256:61559b05ae520ce1816c2017a982dd7d6c809b4c53b6eb7ccaa96f21a7465f90
type: lesson-note
---

```markdown
# AICB Ngày 1

## Slide 1 — AI & LLM Foundation
AICB-P1 ∙Ngày 1 ∙Nền tảng  
Huỳnh Thành Trung  
VinUniversity ∙Phase 1 ∙Tuần 1 ∙02/04/2026  

## Slide 2 — Hãy suy nghĩ...
“Bạn đang dùng AI mỗi ngày — nhưng thực sự bên trong nó làm gì?”  
Giữ câu hỏi này trong đầu khi học bài hôm nay.

## Slide 3 — Nội dung bài học
1. Bức tranh AI 2026
2. LLM — Trái tim của AI hiện đại
3. Token Economy
4. Gọi API lần đầu
5. Vibe Coding
6. Thực hành

## Slide 4 — Bức tranh AI 2026
Từ [[Machine Learning]] đến [[Agentic AI]].

## Slide 5 — Mục tiêu bài học
Sau buổi học này, bạn sẽ:
1. Hiểu cách LLM hoạt động (Transformer, token, next-token prediction)
2. Ước tính chi phí API call dựa trên [[token economy]]
3. Sử dụng LLM từ third-party (OpenAI, Anthropic) hoặc self-host open model
4. Nắm vững [[Vibe Coding]] mindset và sử dụng AI đúng cách, không lệ thuộc
5. Xây dựng chatbot đơn giản có streaming response  
Python 3.10+, VS Code/Cursor, API key (OpenAI)

## Slide 6 — AI Taxonomy
Các tầng của trí tuệ nhân tạo:
- **AI**: Máy thực hiện tác vụ “thông minh”
- **ML**: Học từ dữ liệu, không cần lập trình tường minh
- **DL**: Neural networks nhiều tầng
- **Generative AI**: Nhánh AI có khả năng sáng tạo nội dung giống như con người
- **LLM**: [[Foundation Model]] chuyên ngôn ngữ— nền tảng của [[Generative AI]] và [[Agentic AI]]  
Khóa học tập trung vào LLM để xây dựng [[Agentic AI]].

## Slide 7 — Ba nhóm AI chính
1. **Discriminative AI**: Phân loại, dự đoán (ví dụ: Spam filter, Image classifier)
2. **Generative AI**: Sinh nội dung mới (ví dụ: ChatGPT, Claude, DALL-E)
3. **Agentic AI**: Tự lập kế hoạch & hành động (ví dụ: AI coding agents, Auto customer support)  
LLM là engine chung cho cả Generative AI lẫn Agentic AI.

## Slide 8 — Từ AI cổ điển đến Agentic AI
1. Perceptron (1957)
2. Deep Learning bùng nổ (2012)
3. Transformer (2017)
4. ChatGPT (2022)
5. AI Agents (2024–26)

## Slide 9 — Vì sao 2024-2026 là bước ngoặt?
- 78% doanh nghiệp dùng AI
- $15.7T GDP toàn cầu từ AI (2030)
- 3.7x ROI trung bình trên mỗi $1 đầu tư  
AI không còn chỉ là “trả lời hay” nữa; từ 2024 trở đi, doanh nghiệp quan tâm đến AI biết hành động và tạo ra ROI.

## Slide 10 — Từ LLM đến AI Agents
- **Level 0**: Core reasoning engine
- **Level 1**: Connected Solver
- **Level 2**: Strategic Problem-Solver
- **Level 3**: Collaborative AI Agents  
LLM agent lập kế hoạch nhiều bước, sử dụng nhiều công cụ và chuỗi suy luận.

## Slide 11 — Tại sao cần AI Agents?
Prompt tĩnh chỉ giải quyết 1 câu hỏi. AI Agent giải quyết mục tiêu hoàn chỉnh với khả năng kết nối API, database và xử lý workflow phức tạp.

## Slide 12 — Thành phần của AI Agent
Agent = Goal + Reasoning + Tools + Memory + Action.

## Slide 13 — Tương lai của AI Agents
- **Generalist AI**: Agent chuyển từ chuyên biệt sang AI tổng quát
- **Deep Personalization**: AI cá nhân hóa sâu
- **Embodied AI**: AI tích hợp vào robot, IoT
- **Agent-driven Economy**: AI agents tự vận hành
- **Adaptive Multi-Agent Systems**: Hệ multi-agent tự đánh giá và tối ưu nhiệm vụ.

## Slide 14 — LLM — Trái tim của AI hiện đại
Transformer, Token, và cách LLM “suy nghĩ”.

## Slide 15 — Định nghĩa LLM
Mô hình ngôn ngữ lớn dựa trên kiến trúc [[Transformer]], được huấn luyện trên lượng dữ liệu văn bản khổng lồ. LLM có khả năng sinh văn bản, trả lời câu hỏi, viết code, và thực hiện reasoning phức tạp.

## Slide 16 — Transformer — Kiến trúc cách mạng
Kiến trúc Transformer sử dụng Self-Attention và Feed-Forward Network. Hai loại chính: Encoder-Decoder và Decoder-only.

## Slide 17 — Transformer — Encoder-Decoder vs Decoder-only

## Slide 18 — Transformer — Input Embedding

## Slide 19 — Transformer — Input Embedding

## Slide 20 — Transformer — Positional Encoding

## Slide 21 — Self-Attention — Cơ chế cốt lõi

## Slide 22 — Self-Attention — Q, K, V và Attention Score

## Slide 23 — Self-Attention — Scaled Dot-Product Attention

## Slide 24 — Self-Attention — Scaled Dot-Product Attention

## Slide 25 — Self-Attention — Scaled Dot-Product Attention

## Slide 26 — Self-Attention — Scaled Dot-Product Attention

## Slide 27 — Self-Attention — Scaled Dot-Product Attention

## Slide 28 — Self-Attention — Scaled Dot-Product Attention

## Slide 29 — Self-Attention — Single Head Attention

## Slide 30 — Self-Attention — Single Head Attention

## Slide 31 — Self-Attention — Single Head Attention

## Slide 32 — Self-Attention — Single Head Attention

## Slide 33 — Self-Attention — Single Head Attention

## Slide 34 — Self-Attention — Masked Self-Attention

## Slide 35 — Self-Attention — Multi-Head Attention

## Slide 37 — Token — Đơn vị cơ bản của LLM
Token là đơn vị nhỏ nhất mà LLM xử lý. Ví dụ: "Hello world" → 2 tokens, "Xin chào" → 3–4 tokens.

## Slide 38 — Next-Token Prediction
LLM không “hiểu” ngôn ngữ mà dự đoán token có xác suất cao nhất.

## Slide 39 — LLM được tạo ra như thế nào?
1. Pre-training
2. SFT
3. RLHF / DPO

## Slide 40 — Giới hạn bẩm sinh của LLM
- **Knowledge cutoff**: Model không biết những gì xảy ra sau thời điểm training.
- **Hallucination**: Model có thể trả lời sai.
- **Context window**: Model chỉ "nhìn" được lượng token hữu hạn trong mỗi lần gọi.

## Slide 41 — Token Economy
Chi phí, tốc độ và cách tính giá API.

## Slide 42 — Token là gì?
Token là đơn vị nhỏ nhất mà LLM xử lý. LLM sử dụng token để tính chi phí API và giới hạn context window.

## Slide 43 — Vì sao một số nội dung tốn nhiều token hơn?
Unicode, ký tự đặc biệt và cấu trúc phức tạp thường tốn nhiều token hơn.

## Slide 44 — API Pricing Model
Tính chi phí dựa trên input tokens và output tokens.

## Slide 45 — Prompt dài = Chi phí cao
Tối ưu chi phí = tối ưu prompt + context.

## Slide 46 — Latency vs Cost Trade-off
Nhiều tokens hơn thường chậm hơn và tốn hơn.

## Slide 47 — So sánh LLM phổ biến
So sánh một số LLM phổ biến với các tiêu chí về chi phí và hiệu suất.

## Slide 48 — Framework chọn model nhanh
Hướng dẫn chọn model dựa trên cost/latency và quality/reasoning.

## Slide 49 — Cùng một prompt — 3 model, 3 phong cách
So sánh output từ các model khác nhau dựa trên cùng một prompt.

## Slide 50 — Context Window
Số token tối đa mà LLM xử lý trong 1 lần gọi API.

## Slide 51 — Tính chi phí thực tế— Ví dụ
Ví dụ về chi phí khi sử dụng chatbot với mô hình khác nhau.

## Slide 52 — Gọi API lần đầu
Luồng một API call: Prompt, API Call, Token Stream, Response.

## Slide 53 — Prerequisites
Điều kiện cần có trước khi bắt đầu gọi API.

## Slide 54 — Gọi OpenAI API — Hello World
Ví dụ cơ bản về gọi OpenAI API bằng Python.

## Slide 55 — Giải phẫu một API Call
Các tham số trong một API call và ý nghĩa của chúng.

## Slide 56 — Tham số Điều Khiển Output
Giải thích các tham số như temperature và top_p.

## Slide 57 — Giải thích temperature và top_p
Phương pháp thiết lập giá trị cho temperature và top_p.

## Slide 58 — So sánh cú pháp — Anthropic vs OpenAI
So sánh cú pháp sử dụng API giữa hai nền tảng.

## Slide 59 — Gọi OpenAI API — Hàm wrapper
Ví dụ về hàm wrapper cho việc gọi OpenAI API.

## Slide 60 — Gọi OpenAI API — Đọc Token Usage
Cách đọc và phân tích token usage từ Response.

## Slide 61 — Gọi OpenAI API — Chatbot loop
Ví dụ về cách thực hiện một vòng lặp chatbot.

## Slide 62 — Tự host LLM lên local environment
Hướng dẫn tải và chạy LLM trong môi trường local.

## Slide 63 — Streaming — Response theo từng chunk
Hướng dẫn về quá trình lấy response theo từng chunk.

## Slide 64 — Vibe Coding
Viết phần mềm bằng cách mô tả ý tưởng cho AI sinh code.

## Slide 65 — Vì sao cần Vibecoding?
Lợi ích của Vibe Coding trong lập trình.

## Slide 66 — Vibe Coding Workflow
Quy trình của Vibe Coding bao gồm việc mô tả, phát triển và chỉnh sửa code.

## Slide 67 — Mindset Shift
Sự chuyển đổi từ lập trình truyền thống sang điều phối AI trong lập trình.

## Slide 68 — 3 nguyên tắc Vibecoding
1. Intent-driven: Nói rõ mục tiêu
2. Context-first: Cung cấp bối cảnh đầy đủ
3. Human review: Luôn có bước rà soát cuối.

## Slide 69 — Prompt tốt vs Prompt kém
Sự khác biệt giữa prompt tốt và prompt kém trong việc thu được kết quả đầu ra.

## Slide 70 — Thực hành
Live Demo & Lab.

## Slide 71 — Lab #1
Mục tiêu: Gọi OpenAI API thực tế để so sánh GPT-4o và GPT-4o-mini về latency, cost, quality.

## Slide 72 — Tổng kết — Key Takeaways
1. LLM = Transformer dự đoán token tiếp theo từ context.
2. Để usable, LLM phải đi qua Pre-training → SFT → alignment.
3. Chọn model theo trade-off giữa quality, latency, cost.
4. Một API call gồm có prompt, response, usage và stop reason.
5. Vibe Coding tốt = intent rõ, context đủ và review kỹ.

## Slide 73 — Tiếp theo & Bài tập
Ngày 2: {{Prompt Engineering}}.

## Slide 74 — Tài liệu tham khảo
Danh sách tài liệu tham khảo liên quan đến LLM và Transformer.

## Slide 75 — Hỏi & Đáp
Bạn có câu hỏi nào về LLM, Transformer, Token Economy, hoặc API?

## Slide 76 — Cảm ơn!
Huỳnh Thành Trung  
Email: trung.ht@vinuni.edu.vn  
Bài tập nộp trước Ngày 2
```

## Khái niệm chính
- [[AI]]: Trí tuệ nhân tạo, là công nghệ cho phép máy tính thực hiện các tác vụ thông minh.
- [[LLM]]: Mô hình ngôn ngữ lớn, được đào tạo trên dữ liệu văn bản lớn, dự đoán từ tiếp theo.
- [[Machine Learning]]: Học máy, giúp máy tính học từ dữ liệu mà không cần lập trình tường minh.
- [[Generative AI]]: AI có khả năng sinh ra nội dung mới như văn bản, hình ảnh.
- [[Agentic AI]]: AI có khả năng tự lập kế hoạch và hành động.
- [[Transformer]]: Kiến trúc cách mạng trong học sâu giúp xử lý ngôn ngữ tự nhiên.
- [[token economy]]: Hệ thống tính toán chi phí dựa trên số lượng token xử lý trong mô hình. 
- [[Vibe Coding]]: Quy trình lập trình nơi AI tạo ra mã dựa trên mô tả ý tưởng của lập trình viên.
