---
course: packs
generated: '2026-07-30T10:20:33+00:00'
lang: vi
lesson: transcript-06-clean
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/transcript/transcript-06-clean.md
source_hash: sha256:0bf0e220bf6e26d08bbf4be12fa68d619face7df788fb013036c494912eebe8c
type: lesson-note
---

```markdown
# Ghi chú bài học — Buổi Foundation: transformer & attention

## Slide 1 — Giới thiệu giảng viên và khảo sát làm quen lớp
**[T06-001]** [Hoạt động lớp: hướng dẫn học viên vào link phiên demo trực tiếp trên điện thoại; câu hỏi trong buổi học cũng đẩy lên đây.]

**[T06-002]** Giới thiệu giảng viên, một Google Developer Expert đến từ Sài Gòn. Đặt câu hỏi khảo sát để hiểu về học viên.

## Slide 2 — Nội dung buổi học
**[T06-022]** Nội dung hôm nay bao gồm:
- Bức tranh của [[AI]] năm 2025-2026.
- Trái tim của AI hiện đại — kiến trúc [[transformer]].
- Thực hành cơ chế [[attention]].
- [[Token economy]] và lần đầu gọi [[API]].

## Slide 3 — AI, machine learning, deep learning và foundation model
**[T06-023]** Định nghĩa [[AI]] và mối quan hệ với [[machine learning]] và [[deep learning]]:
- AI: máy thực hiện tác vụ thông minh.
- Machine learning: lập trình theo xác suất, không tường minh.
- Deep learning: sử dụng [[neural network]] và có độ phức tạp cao hơn.

## Slide 4 — Ba nhóm AI và lịch sử phát triển
**[T06-051]** Ba nhóm chính của AI:
- Nhóm 1: [[Discriminative AI]] — phân loại và dự đoán.
- Nhóm 2: [[Generative AI]] — tạo nội dung từ input.
- Nhóm 3: [[Agentic AI]] — có khả năng lập kế hoạch và hành động.

## Slide 5 — Vì sao 2025-2026 là bước ngoặt
**[T06-060]** Dự đoán năm 2025-2026 là bước ngoặt vì 78% doanh nghiệp lớn đã tham gia vào AI nhưng chỉ 30% đã ứng dụng thực tế.

## Slide 6 — LLM: encoder–decoder, transformer và attention
**[T06-075]** LLM là mô hình ngôn ngữ lớn dựa trên [[transformer]], với cơ chế [[attention]] cho phép xử lý song song các token đầu vào.

## Slide 7 — Self-attention: ví dụ "con mèo ngồi trên bàn" và công thức Q–K–V
**[T06-130]** Cơ chế [[self-attention]] giúp xác định từ "nó" trong câu bằng cách đánh giá mức độ tương đồng giữa các token sử dụng công thức Q (query), K (key), V (value).

## Slide 8 — Token và cơ chế dự đoán next token
**[T06-134]** Đơn vị cơ bản của LLM là [[token]]. Quá trình dự đoán từ kế tiếp dựa trên đánh giá xác suất cho các token.

## Slide 9 — Giới hạn của LLM: knowledge cutoff, hallucination, context window
**[T06-147]** Giới hạn của LLM bao gồm:
- [[Knowledge cutoff]]: mốc thời gian ngừng cập nhật tri thức.
- [[Hallucination]]: lỗi phát sinh do bias trong dữ liệu.
- [[Context window]]: khả năng nhận biết thông tin giới hạn của mô hình.

## Khái niệm chính
- [[AI]]: Trí tuệ nhân tạo, máy thực hiện tác vụ giống con người.
- [[Machine learning]]: Cách lập trình dựa trên dữ liệu mà không cần viết mã cụ thể.
- [[Deep learning]]: Kiến trúc học máy sử dụng mạng nơ-ron với nhiều lớp.
- [[Transformer]]: Kiến trúc cho phép xử lý ngữ cảnh một cách song song.
- [[Attention]]: Cơ chế giúp mô hình tập trung vào các từ liên quan trong ngữ cảnh.
- [[Token economy]]: Kinh tế dựa trên việc sử dụng token trong các giao dịch API.
- [[API]]: Giao diện lập trình ứng dụng, cho phép tương tác giữa các hệ thống.
- [[Knowledge cutoff]]: Thời điểm mà mô hình không còn cập nhật thông tin mới.
- [[Hallucination]]: Tình trạng mô hình tạo ra thông tin sai lệch.
- [[Context window]]: Giới hạn về lượng thông tin mô hình có thể xử lý cùng lúc.
- [[Discriminative AI]]: AI chuyên về phân loại và dự đoán.
- [[Generative AI]]: AI tạo ra nội dung mới từ đầu vào.
- [[Agentic AI]]: AI có khả năng tự lập kế hoạch và hành động.
```
