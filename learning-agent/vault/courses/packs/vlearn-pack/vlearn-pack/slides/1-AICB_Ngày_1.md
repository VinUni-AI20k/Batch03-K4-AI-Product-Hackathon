---
course: packs
generated: '2026-07-31T18:08:35+00:00'
lang: vi
lesson: 1-AICB_Ngày_1
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\slides\1-AICB_Ngày_1.md
source_hash: sha256:1c6818d2bea843792e7bf213322f55204ecddd5f146e85e1f6fa5f6fe11383e0
type: lesson-note
---

```markdown
# AICB Ngày 1

## Slide 1 — AI & LLM Foundation
Nền tảng của trí tuệ nhân tạo và mô hình ngôn ngữ lớn, giảng viên Huỳnh Thành Trung từ VinUniversity giới thiệu chương trình học trong tuần đầu tiên. <!-- src: ... -->

## Slide 2 — Hãy suy nghĩ...
Câu hỏi suy nghĩ: “Bạn đang dùng AI mỗi ngày — nhưng thực sự bên trong nó làm gì?” Giữ câu hỏi này trong đầu khi học bài hôm nay. <!-- src: ... -->

## Slide 3 — Nội dung bài học
1. Bức tranh AI 2026
2. LLM — Trái tim của AI hiện đại
3. Token Economy
4. Gọi API lần đầu
5. Vibe Coding
6. Thực hành
<!-- src: ... -->

## Slide 4 — Bức tranh AI 2026
Chuyển mình từ [[Machine Learning]] đến [[Agentic AI]]. <!-- src: ... -->

## Slide 5 — Mục tiêu bài học
Sau buổi học này, bạn sẽ hiểu cách LLM hoạt động, ước tính chi phí API call, sử dụng LLM từ các nhà cung cấp bên thứ ba hoặc mô hình mở tự host, nắm vững [[Vibe Coding]] và xây dựng chatbot đơn giản với streaming response. <!-- src: ... -->

## Slide 6 — AI Taxonomy
Tầng lớp của trí tuệ nhân tạo: AI là máy thực hiện tác vụ thông minh, [[Machine Learning]] học từ dữ liệu, [[Deep Learning]] với neural networks, [[Generative AI]] sáng tạo nội dung như con người, và [[LLM]] là foundation model cho GenAI và [[Agentic AI]]. <!-- src: ... -->

## Slide 7 — Ba nhóm AI chính
1. **Discriminative AI**: Phân loại và dự đoán (Ví dụ: spam filter).
2. **Generative AI**: Sinh nội dung mới (Ví dụ: ChatGPT, DALL-E).
3. **Agentic AI**: Tự lập kế hoạch và hành động (Ví dụ: AI coding agents). [[LLM]] là engine chung cho cả Generative AI và Agentic AI. <!-- src: ... -->

## Slide 8 — Từ AI cổ điển đến Agentic AI
Quá trình phát triển từ [[Perceptron]] đến [[Deep Learning]], [[Transformer]], [[ChatGPT]], và [[AI Agents]] với giai đoạn từ 2024-2026. <!-- src: ... -->

## Slide 9 — Vì sao 2024-2026 là bước ngoặt?
78% doanh nghiệp sẽ sử dụng AI, với $15.7T GDP toàn cầu từ AI dự báo vào năm 2030. AI từ năm 2024 trở đi không chỉ trả lời mà bắt đầu hành động, kết nối công cụ để tạo ra ROI. <!-- src: ... -->

## Slide 10 — Từ LLM đến AI Agents
4 cấp độ của LLM: 
1. Level 0 — Core reasoning engine
2. Level 1 — Connected Solver
3. Level 2 — Strategic Problem-Solver
4. Level 3 — Collaborative AI Agents. <!-- src: ... -->

## Slide 11 — Tại sao cần AI Agents?
Các prompt tĩnh chỉ giải quyết 1 câu hỏi. AI Agents có thể giải quyết mục tiêu hoàn chỉnh với kế hoạch và hành động liên tục, kết nối API và database để tạo giá trị thực tế. <!-- src: ... -->

## Slide 12 — Thành phần của AI Agent
Agent bao gồm: Goal, Reasoning, Tools, Memory, và Action. <!-- src: ... -->

## Slide 13 — Tương lai của AI Agents
Những xu hướng như [[Generalist AI]], [[Deep Personalization]], [[Embodied AI]], [[Agent-driven Economy]], và [[Adaptive Multi-Agent Systems]] sẽ định hình tương lai của AI Agents. <!-- src: ... -->

## Slide 14 — LLM — Trái tim của AI hiện đại
Khám phá cách mà [[LLM]] (Large Language Model) hoạt động dựa trên kiến trúc [[Transformer]], [[Token]], và cách mà LLM suy nghĩ. <!-- src: ... -->

## Slide 15 — Định nghĩa LLM
Mô hình ngôn ngữ lớn dựa trên kiến trúc Transformer, có khả năng tạo văn bản, trả lời câu hỏi, viết code và thực hiện reasoning phức tạp. <!-- src: ... -->

## Slide 16 — Transformer — Kiến trúc cách mạng
Giới thiệu về [[Transformer]] với các thành phần như Self-Attention, Multi-Head, Feed-Forward Network, và cách mà kiến trúc này thay đổi ngành AI. <!-- src: ... -->

## Slide 17 — Transformer — Encoder-Decoder vs Decoder-only
So sánh giữa hai loại kiến trúc [[Transformer]]: Encoder-Decoder và Decoder-only, cùng điều gì làm cho Decoder-only trở nên phổ biến. <!-- src: ... -->

## Slide 18 — Transformer — Input Embedding
Giới thiệu về Input Embedding trong kiến trúc [[Transformer]]. <!-- src: ... -->

## Slide 19 — Transformer — Input Embedding
Tiếp tục giải thích về Input Embedding trong [[Transformer]]. <!-- src: ... -->

## Slide 20 — Transformer — Positional Encoding
Khám phá Positional Encoding trong [[Transformer]]. <!-- src: ... -->

## Slide 21 — Self-Attention — Cơ chế cốt lõi
Định nghĩa về cơ chế [[Self-Attention]], cách mà nó hoạt động và vai trò quan trọng trong [[LLM]]. <!-- src: ... -->

## Slide 22 — Self-Attention — Q, K, V và Attention Score
Phân tích các thành phần Q (Query), K (Key), V (Value) trong cơ chế [[Self-Attention]]. <!-- src: ... -->

## Slide 23 — Self-Attention — Scaled Dot-Product Attention
Giới thiệu [[Scaled Dot-Product Attention]] trong hệ thống [[Self-Attention]]. <!-- src: ... -->

## Slide 24 — Self-Attention — Scaled Dot-Product Attention
Tiếp tục thảo luận về [[Scaled Dot-Product Attention]]. <!-- src: ... -->

## Slide 25 — Self-Attention — Scaled Dot-Product Attention
Khám phá chiều sâu của [[Scaled Dot-Product Attention]]. <!-- src: ... -->

## Slide 26 — Self-Attention — Scaled Dot-Product Attention
Phân tích thêm về [[Scaled Dot-Product Attention]]. <!-- src: ... -->

## Slide 27 — Self-Attention — Scaled Dot-Product Attention
Giải thích thêm về cách [[Scaled Dot-Product Attention]] hoạt động trong [[LLM]]. <!-- src: ... -->

## Slide 28 — Self-Attention — Scaled Dot-Product Attention
Trình bày sâu hơn về [[Scaled Dot-Product Attention]]. <!-- src: ... -->

## Slide 29 — Self-Attention — Single Head Attention
Giới thiệu [[Single Head Attention]] và vai trò của nó. <!-- src: ... -->

## Slide 30 — Self-Attention — Single Head Attention
Phân tích [[Single Head Attention]] trong bối cảnh [[LLM]]. <!-- src: ... -->

## Slide 31 — Self-Attention — Single Head Attention
Tiếp tục giải thích về [[Single Head Attention]]. <!-- src: ... -->

## Slide 32 — Self-Attention — Single Head Attention
Giới thiệu thêm về [[Single Head Attention]]. <!-- src: ... -->

## Slide 33 — Self-Attention — Single Head Attention
Phân tích yêu cầu vô cùng quan trọng của [[Single Head Attention]]. <!-- src: ... -->

## Slide 34 — Self-Attention — Single Head Attention
Một cái nhìn tổng quan về [[Single Head Attention]]. <!-- src: ... -->

## Slide 35 — Self-Attention — Masked Self-Attention
Định nghĩa [[Masked Self-Attention]] và ứng dụng trong [[LLM]]. <!-- src: ... -->

## Slide 36 — Self-Attention — Multi-Head Attention
Giới thiệu [[Multi-Head Attention]] và vai trò của nó trong [[Transformer]]. <!-- src: ... -->

## Slide 37 — Token — Đơn vị cơ bản của LLM
[[Token]] là đơn vị cơ bản mà [[LLM]] xử lý, với cách token hóa văn bản và ảnh hưởng đến chi phí API. <!-- src: ... -->

## Slide 38 — Next-Token Prediction
Cách mà [[LLM]] dự đoán token tiếp theo và các yếu tố ảnh hưởng đến độ chính xác, như [[Temperature]] và autoregressive nature. <!-- src: ... -->

## Slide 39 — LLM được tạo ra như thế nào?
Quá trình phát triển của [[LLM]] bao gồm các bước Pre-training, SFT, và RLHF/DPO. <!-- src: ... -->

## Slide 40 — Giới hạn bẩm sinh của LLM
Một số giới hạn tự nhiên của [[LLM]] như knowledge cutoff, hallucination, và context window. <!-- src: ... -->

## Slide 41 — Token Economy
Chi phí, tốc độ và cách tính giá API dựa trên [[Token]]. <!-- src: ... -->

## Slide 42 — Token là gì?
[[Token]] là đơn vị nhỏ nhất mà [[LLM]] xử lý và có tác động lớn đến giá thành và hiệu suất. <!-- src: ... -->

## Slide 43 — Vì sao một số nội dung tốn nhiều token hơn?
Giới thiệu các yếu tố khiến một số nội dung tốn nhiều [[Token]] hơn như tiếng Việt và cấu trúc văn bản phức tạp. <!-- src: ... -->

## Slide 44 — API Pricing Model
Mô hình tính chi phí của API dựa trên số lượng [[Token]]. <!-- src: ... -->

## Slide 45 — Prompt dài = Chi phí cao
Tính toán chi phí với ví dụ về các yếu tố chi phối chi phí trong các API call. <!-- src: ... -->

## Slide 46 — Latency vs Cost Trade-off
Nghĩa vụ giữa latency và chi phí; khi chi phí cao thường kéo theo latency cao. <!-- src: ... -->

## Slide 47 — So sánh LLM phổ biến
So sánh giữa các mô hình [[LLM]] phổ biến và tiêu chí chọn lựa cho việc sử dụng trong thực tế. <!-- src: ... -->

## Slide 48 — Framework chọn model nhanh
Khung phân loại mô hình theo nhu cầu chi phí hoặc chất lượng. <!-- src: ... -->

## Slide 49 — Cùng một prompt — 3 model, 3 phong cách
So sánh cách các mô hình sản sinh nội dung khác nhau từ một prompt. <!-- src: ... -->

## Slide 50 — Context Window
Giới thiệu về [[Context Window]] và tác động của nó đến hiệu suất của [[LLM]]. <!-- src: ... -->

## Slide 51 — Tính chi phí thực tế— Ví dụ
Tính toán chi phí thực tế dựa trên kịch bản sử dụng [[LLM]] trong việc hỗ trợ khách hàng. <!-- src: ... -->

## Slide 52 — Gọi API lần đầu
Quá trình thực hiện một [[API Call]] từ bước tạo prompt đến nhận response. <!-- src: ... -->

## Slide 53 — Luồng một API call
Mô tả chi tiết về luồng của một [[API Call]]. <!-- src: ... -->

## Slide 54 — Prerequisites — Trước khi bắt đầu
Danh sách yêu cầu trước khi tiến hành gọi [[API]]. <!-- src: ... -->

## Slide 55 — Gọi OpenAI API — Hello World
Mô tả cách gọi [[OpenAI API]] để thực hiện gọi API đơn giản. <!-- src: ... -->

## Slide 56 — Giải phẫu một API Call
Giải thích chi tiết về cấu trúc của một [[API Call]] tới OpenAI GPT-4o. <!-- src: ... -->

## Slide 57 — Tham số Điều Khiển Output
Các tham số ảnh hưởng đến nội dung đầu ra trong khi gọi API. <!-- src: ... -->

## Slide 58 — Giải thích temperature và top_p
Cách mà [[Temperature]] và [[top_p]] điều chỉnh đầu ra của [[LLM]]. <!-- src: ... -->

## Slide 59 — So sánh cú pháp — Anthropic vs OpenAI
So sánh cú pháp giữa [[OpenAI]] và [[Anthropic]]. <!-- src: ... -->

## Slide 60 — Gọi OpenAI API — Hàm wrapper
Hàm wrapper để giúp gọi [[OpenAI API]] dễ dàng hơn. <!-- src: ... -->

## Slide 61 — Gọi OpenAI API — Đọc Token Usage
Cách theo dõi chi tiêu token khi gọi [[OpenAI API]]. <!-- src: ... -->

## Slide 62 — Gọi OpenAI API — Chatbot loop
Xây dựng một vòng lặp chatbot bằng cách gọi [[OpenAI API]]. <!-- src: ... -->

## Slide 63 — Tự host LLM lên local environment
Hướng dẫn cách tự host một mô hình [[LLM]]. <!-- src: ... -->

## Slide 64 — Streaming — Response theo từng chunk
Cách nhận response từ [[OpenAI API]] theo từng phần. <!-- src: ... -->

## Slide 65 — Vibe Coding
Giới thiệu về [[Vibe Coding]] và cách mà nó giúp lập trình hiệu quả hơn. <!-- src: ... -->

## Slide 66 — Vibe Coding là gì?
Định nghĩa quá trình viết phần mềm bằng cách mô tả ý tưởng để AI sinh code. <!-- src: ... -->

## Slide 67 — Vì sao cần Vibecoding?
Giá trị của Vibe Coding trong việc tăng tốc độ viết mã và giảm độ phức tạp. <!-- src: ... -->

## Slide 68 — Vibe Coding Workflow
Quy trình sử dụng Vibe Coding từ ý tưởng đến kiểm tra và hoàn thiện. <!-- src: ... -->

## Slide 69 — Mindset Shift
Sự chuyển mình từ tư duy lập trình truyền thống sang [[Vibe Coding]] với cách tiếp cận mới. <!-- src: ... -->

## Slide 70 — 3 nguyên tắc Vibecoding
Ba nguyên tắc cốt lõi của Vibe Coding gồm: Intent-driven, Context-first, Human review. <!-- src: ... -->

## Slide 71 — Prompt tốt vs Prompt kém
So sánh giữa một prompt tốt và một prompt kém trong việc thu được kết quả từ [[LLM]]. <!-- src: ... -->

## Slide 72 — Thực hành
Mô tả hoạt động thực hành với live demo và lab. <!-- src: ... -->

## Slide 73 — Lab #1
Mục tiêu là gọi [[OpenAI API]] thực tế và so sánh giữa các mô hình về latency, cost, và quality. <!-- src: ... -->

## Slide 74 — Tổng kết — Key Takeaways
Những điểm chính cần nhớ khi hoàn tất buổi học. <!-- src: ... -->

## Slide 75 — Tiếp theo & Bài tập
Hướng dẫn cho bài học tiếp theo về [[Prompt Engineering]] và các nhiệm vụ liên quan. <!-- src: ... -->

## Slide 76 — Tài liệu tham khảo
Danh sách tài liệu tham khảo đã sử dụng trong bài giảng. <!-- src: ... -->

## Slide 77 — Hỏi & Đáp
Thời gian để học viên đặt câu hỏi về những nội dung đã học. <!-- src: ... -->

## Slide 78 — Cảm ơn!
Thông tin liên hệ của giảng viên. <!-- src: ... -->

## Khái niệm chính
- [[AICB]]: Chương trình học về AI và LLM.
- [[LLM]]: Mô hình ngôn ngữ lớn với khả năng suy diễn và sinh nội dung.
- [[Transformer]]: Kiến trúc mạng nơ-ron mạnh mẽ, nền tảng cho nhiều mô hình AI.
- [[Vibe Coding]]: Phương pháp lập trình mới, nơi ý tưởng được mô tả và AI sẽ sinh ra mã.
- [[Token]]: Đơn vị cơ bản mà [[LLM]] xử lý, ảnh hưởng đến chi phí và hiệu suất.
- [[Agentic AI]]: AI có khả năng tự lập kế hoạch và thực hiện hành động.
- [[Machine Learning]]: Chương trình tự cải thiện dựa trên dữ liệu mà không cần lập trình tường minh.
- [[Deep Learning]]: Một nhánh của [[Machine Learning]] sử dụng mạng nơ-ron nhiều tầng.
- [[Self-Attention]]: Cơ chế cốt lõi trong [[Transformer]] cho phép hiểu ngữ cảnh từ các token.
- [[Prompt Engineering]]: Kỹ thuật tạo ra prompt nhằm đạt được output tốt khi làm việc với AI.
```
