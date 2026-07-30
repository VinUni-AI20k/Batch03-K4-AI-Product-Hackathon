---
course: packs
generated: '2026-07-30T10:35:13+00:00'
lang: vi
lesson: d1-slide-hackathon
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/slides/d1-slide-hackathon.pdf
source_hash: sha256:05e32f9a9a55f4b1f5e2f38e0f8bb71082b5f3897af0856c7d343a8d0f85d4b4
type: lesson-note
---

```markdown
## Slide 1 — AI & LLM Foundation

Bạn đang dùng AI mỗi ngày - nhưng thực sự bên trong nó đang làm gì?

## Slide 2 — Agenda

- Bức tranh AI & các tầng của AI
- Lịch sử AI 70 năm
- Bên trong LLM: cơ chế vận hành
- Từ LLM đến AI Agent
- Landscape: model hôm nay & cuộc đua hiện tại
- Chọn model & chi phí token
- Gọi API lần đầu
- Tổng kết - những ý để mang về

## Slide 3 — AI & LLM Foundation

Từ "nghe AI" đến "gọi AI" trong một ngày.

## Slide 4 — AI, ML, Deep Learning, GenAI, LLM

Nằm ở đâu trong cùng một hệ?

## Slide 5 — Ba nhóm AI chính

Phân loại · sinh nội dung · hành động.

## Slide 6 — Discriminative AI

Giỏi phân loại, dự đoán: lọc spam, phát hiện gian lận, nhận diện ảnh. 
Input → một nhãn, một con số.

## Slide 7 — Generative AI

## Slide 8 — Agentic AI

Nhận mục tiêu rồi tự làm nhiều bước: lập kế hoạch, dùng công cụ, hành động. 
Sinh ra thứ mới: văn bản, ảnh, code. ChatGPT, Claude, Midjourney. 
Prompt → nội dung mới; Goal → Plan → Action. 
[[LLM]] là engine chung của cả [[Generative AI]] lẫn [[Agentic AI]].

## Slide 9 — Lịch sử AI 70 năm

2 lần mùa đông, cách tiếp cận chạm trần. 
Từ model đơn lẻ sang system có khả năng hành động như agent.

## Slide 10 — Expert Systems 1980

Đặt lại vấn đề: "Nếu AI chỉ giải thật tốt một loại bài toán chuyên môn hẹp thì sao?" 
→ Sự ra đời của [[expert-systems]].

## Slide 11 — ImageNet 2009

Fei-Fei Li và [[ImageNet]] - cuộc cách mạng của dữ liệu. 
Xây bộ dữ liệu lớn hơn - 14 triệu ảnh gán nhãn tay, hơn 20.000 loại vật. 
Đôi khi dữ liệu tốt hơn thuật toán.

## Slide 12 — Transformer 2017

Transformer là bước ngoặt cho phép mô hình hiểu ngôn ngữ linh hoạt hơn. 
Mỗi từ có thể nhìn sang các từ quan trọng khác trong cả câu.

## Slide 13 — LLM là gì?

[[LLM]] (Large Language Model) là một mô hình ngôn ngữ rất lớn, thường dựa trên kiến trúc Transformer, học đoán mảnh chữ tiếp theo trong ngữ cảnh. 
LLM là bộ não ngôn ngữ dùng chung cho mọi việc.

## Slide 14 — Bên trong Transformer

Đầu ra luôn là một phân bố xác suất, model chấm điểm MỌI từ trong từ vựng.

## Slide 15 — Sinh văn bản

Mỗi token mới được nối vào ngữ cảnh, rồi model chạy lại từ đầu. 
Vòng lặp: predict → append → rerun.

## Slide 16 — Token

Model không đọc "từ", model đọc mảnh chữ - gọi là [[token]]. 
Mỗi token đều có giá và mọi thứ model làm đều quy ra token.

## Slide 17 — Context

Mỗi lần trả lời, model chỉ nhìn được một lượng chữ có hạn - gọi là [[context]].

## Slide 18 — Attention

Mỗi từ được nhìn sang những từ quan trọng khác. 
Cơ chế attention cho phép mỗi token chấm điểm mức độ liên quan của từng token đối với nghĩa của mình.

## Slide 19 — Quản lý Context

Cách bạn bày [[context]] quyết định model chú ý vào đâu. 
1. Đặt điều quan trọng đầu-cuối.
2. Giữ bàn làm việc sạch.

## Slide 20 — Tham số (parameter)

Các khớp nối model học được nằm trong tham số. 
Tham số không phải thứ bạn chỉnh mà đã được đóng gói sẵn.

## Slide 21 — LLM được tạo ra như thế nào?

LLM được "nuôi lớn" qua 3 bước: 
1. Pre-training - học tiếng nói và kiến thức từ hàng nghìn tỷ token.
2. SFT - học theo ví dụ mẫu để ra dáng trợ lý.
3. RLHF - học theo phản hồi con người để trở nên hữu ích, an toàn và dễ chịu hơn.

## Slide 22 — RLHF

Ba bước để cỗ máy đoán token trở thành trợ lý biết nghe lời.

## Slide 23 — Giới hạn bẩm sinh

Model bị "đóng băng" tại ngày ngừng đọc (knowledge cutoff). 
Có thể tự tin mà sai (hallucination).

## Slide 24 — Thực chất của LLM

Model rất giỏi học vẹt, nên có thể tự tin mà sai; cần prompt tốt, [[context]] sạch và luôn kiểm chứng.

## Slide 25 — Chain-of-Thought

Thêm "giấy nháp" để chuyển từ sai thành đúng. 
Tưởng tượng bài toán không có nháp và có nháp để thay đổi kết quả.

## Slide 26 — Từ LLM đến agent

Bốn mức độ - mỗi bậc thêm một năng lực, từ khả năng kết nối đến lập kế hoạch.

## Slide 27 — Giải phẫu một agent

Agent là sự phối hợp của Goal + Reasoning + Tools + Memory + Action.

## Slide 28 — Chọn model theo TẦNG

Lựa chọn model không theo tên mà theo tầng năng lực.

## Slide 29 — Giải phẫu một prompt

Viết rõ cả 4 lớp để làm tốt "prompt engineering".

## Slide 30 — Hai núm vặn chọn từ

Tùy chỉnh độ liều và chỉ xem top đầu bảng để hỗ trợ sự chọn lựa từ.

## Khái niệm chính

- [[AI]]: Trí tuệ nhân tạo, công nghệ cho phép máy móc thực hiện các tác vụ thông minh.
- [[ML]]: Học máy, phương pháp cho phép máy học từ dữ liệu và cải thiện theo kinh nghiệm.
- [[Deep Learning]]: Học sâu, một nhánh của học máy sử dụng mạng nơron sâu để học từ dữ liệu lớn.
- [[GenAI]]: AI sinh sinh nội dung, có khả năng tạo ra văn bản, hình ảnh hoặc âm thanh mới.
- [[LLM]]: Mô hình ngôn ngữ lớn, một loại mô hình học máy chuyên về ngôn từ.
- [[Agentic AI]]: AI có khả năng thực hiện hành động một cách tự động, lập kế hoạch và sử dụng công cụ.
- [[expert-systems]]: Hệ thống chuyên gia, một loại AI giải quyết các bài toán chuyên môn hẹp.
- [[ImageNet]]: Bộ dữ liệu lớn được dùng để huấn luyện các mô hình nhận diện ảnh.
- [[token]]: Mảnh chữ nhỏ mà model sử dụng để xử lý văn bản.
- [[context]]: Giới hạn thông tin mà model có thể sử dụng trong một lần trả lời.
```
