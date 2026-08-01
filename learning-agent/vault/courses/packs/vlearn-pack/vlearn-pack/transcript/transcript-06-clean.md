---
course: packs
generated: '2026-07-31T18:37:02+00:00'
lang: vi
lesson: transcript-06-clean
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\transcript\transcript-06-clean.md
source_hash: sha256:43b86eb16b949ffcbda4a773fd492a701fd98692ce0b4eb410b50bed9018aa5f
type: lesson-note
---

```markdown
# Ghi chú bài học — Buổi Foundation: transformer & attention

## Slide 1 — Giới thiệu giảng viên và khảo sát làm quen lớp
**[T06-001]** [Hoạt động lớp: hướng dẫn học viên vào link phiên demo trực tiếp trên điện thoại; câu hỏi trong buổi học cũng đẩy lên đây.]

**[T06-002]** Mình là [giảng viên], là Google Developer Expert. Hôm nay có bạn hỗ trợ demo về cơ chế [[attention]]. Mình muốn biết về các bạn thông qua khảo sát, có hai câu hỏi. Chúng ta sẽ quan sát kết quả.

## Slide 2 — Nội dung buổi học
**[T06-022]** Nội dung hôm nay bao gồm: 1) Bức tranh AI năm 2025-2026; 2) Trái tim của AI hiện đại — cơ chế bên trong; 3) [[Token economy]]; 4) Thực hành gọi [[API]] lần đầu.

## Slide 3 — AI, machine learning, deep learning và foundation model
**[T06-046]** Câu hỏi: Khi nào không dùng LLM? 

**[T06-051]** Nhóm đầu tiên là [[discriminative AI]], sử dụng cho phân loại và dự đoán. Nhóm thứ hai là [[generative AI]], tương tác bằng cách prompt để tạo ra nội dung. Nhóm cuối cùng là [[agentic AI]], có khả năng lập kế hoạch và hành động.

## Slide 4 — LLM: encoder–decoder, transformer và attention
**[T06-075]** LLM là mô hình ngôn ngữ lớn, sử dụng kiến trúc [[transformer]], có khả năng tạo và cho phép phân tích văn bản phức tạp.

## Slide 5 — Self-attention: ví dụ "con mèo ngồi trên bàn" và công thức Q–K–V
**[T06-129]** Cơ chế [[self-attention]] giúp xác định ngữ nghĩa từ trong câu. Công thức Q–K–V (query, key, value) quan trọng trong việc xác định mối quan hệ giữa các token.

## Slide 6 — Token và cơ chế dự đoán next token
**[T06-134]** Token là đơn vị cơ bản được sử dụng trong LLM. Quá trình dự đoán [[next token]] dựa trên xác suất và mức độ tương đồng giữa các token.

## Slide 7 — Vì sao có hallucination — bias dữ liệu và quá trình huấn luyện
**[T06-138]** Hallucination xảy ra khi LLM dự đoán sai do dữ liệu có bias và quy trình [[fine-tuning]] không hoàn hảo. Các bạn phải cẩn thận khi prompt cho các lĩnh vực như y tế hay tài chính.

## Slide 8 — Knowledge cutoff và context window
**[T06-146]** [[Knowledge cutoff]] có nghĩa là LLM chỉ biết được thông tin đến một thời điểm nhất định. [[Context window]] hạn chế số lượng token mà mô hình có thể xử lý cùng lúc.

## Slide 9 — Token economy và chi phí API
**[T06-154]** Mỗi lần gọi [[API]] sẽ khiến chúng ta "burn" token, chi phí phụ thuộc vào số lượng token đầu vào và đầu ra.

## Slide 10 — Tổng kết buổi học
**[T06-158]** Tổng kết học hôm nay: hiểu cấu trúc AI từ tổng quát đến chi tiết ([[machine learning]], [[deep learning]], [[transformer]]). Đặc biệt, biết áp dụng [[self-attention]] và [[token economy]] trong các dự án.

## Khái niệm chính
- [[attention]]: cơ chế giúp mô hình chú ý đến các phần khác nhau trong dữ liệu đầu vào.
- [[Token economy]]: mô hình kinh tế dựa trên việc sử dụng và thanh toán cho các token trong các thao tác AI.
- [[API]]: giao thức để các ứng dụng giao tiếp và tương tác với nhau.
- [[discriminative AI]]: AI có khả năng phân loại và dự đoán.
- [[generative AI]]: AI tạo ra nội dung mới dựa trên dữ liệu đã học.
- [[agentic AI]]: AI có khả năng lập kế hoạch và tự động hành động.
- [[knowledge cutoff]]: điểm mốc mà một mô hình AI không còn cập nhật thông tin mới.
- [[context window]]: số lượng token mà mô hình có thể xử lý cùng lúc.
```
