---
course: AI20K
generated: '2026-07-30T17:28:36+00:00'
lang: vi
lesson: NIPS-2017-attention-is-all-you-need-Paper
maps:
- '[[MOC - AI20K]]'
module: ''
source_file: AI20K/NIPS-2017-attention-is-all-you-need-Paper.pdf
source_hash: sha256:2061f47159e144b009636db1e0c40b9712e4080d7d05afa2e32119c0fa367fc5
type: lesson-note
---

```markdown
## Slide 1 — Attention Is All You Need

Bài báo giới thiệu mô hình Transformer, thay thế các mạng nơ-ron hồi tiếp và tích chập bằng các cơ chế [[attention]]. [[Model Transformer]] sử dụng hoàn toàn [[self-attention]] để xây dựng các phụ thuộc toàn cầu giữa các đầu vào và đầu ra mà không cần sử dụng mạng RNN hay các lớp tích chập. Thí nghiệm cho thấy Transformer vượt trội trong chất lượng dịch machine translation và yêu cầu ít thời gian huấn luyện hơn các mô hình trước đó. Mô hình đạt 28.4 điểm BLEU trong nhiệm vụ dịch từ tiếng Anh sang tiếng Đức và 41.0 điểm BLEU trong nhiệm vụ dịch tiếng Anh sang tiếng Pháp, với thời gian huấn luyện chỉ trong một khoảng thời gian ngắn.

## Slide 2 — Introduction

Mạng nơ-ron hồi tiếp đã được chứng minh là phương pháp hàng đầu trong mô hình hóa [[chuỗi]] và các vấn đề [[transduction]] như mô hình ngôn ngữ và dịch máy. Mặc dù có nhiều nỗ lực nhằm cải thiện các mô hình dựa trên hồi tiếp, chúng vẫn mắc phải hạn chế trong việc xử lý các chuỗi dài do tính chất tuần tự trong tính toán. [[Attention]] cho phép mô hình hóa các phụ thuộc mà không cần quan tâm đến khoảng cách giữa các yếu tố trong chuỗi đầu vào và đầu ra. Mô hình Transformer đưa ra giải pháp cho vấn đề này bằng cách sử dụng toàn bộ kiến trúc dựa trên [[attention]].

## Slide 3 — Background

Giảm thiểu tính toán tuần tự là nền tảng cho nhiều mô hình như [[Extended Neural GPU]], [[ByteNet]] và [[ConvS2S]], nhưng chúng vẫn phải đối mặt với vấn đề trong việc học các phụ thuộc từ xa. Mô hình Transformer giảm được số lượng phép toán cần thiết để liên kết các tín hiệu từ hai vị trí bất kỳ trong chuỗi xuống nổi, cho phép khả năng học các phụ thuộc giữa các vị trí xa hơn.

## Slide 4 — Model Architecture

Mô hình Transformer bao gồm cấu trúc encoder-decoder, với encoder biến đổi chuỗi đầu vào thành các biểu diễn liên tục, còn decoder tạo ra chuỗi đầu ra từ các biểu diễn này. Cả hai cấu trúc đều sử dụng các lớp [[self-attention]] và mạng fully connected.

## Slide 5 — Encoder and Decoder Stacks

Encoder bao gồm một chồng các lớp giống nhau với hai phụ lớp: [[multi-head self-attention]] và một mạng fully connected. Decoder tương tự nhưng có thêm một lớp attention thứ ba cho phép tách biệt giữa các trạng thái.

## Slide 6 — Attention

Chức năng [[attention]] bản chất là ánh xạ một truy vấn và một tập hợp các cặp khóa-giá trị thành đầu ra, cho phép tính toán đầu ra dựa trên các trọng số tương ứng với độ tương thích giữa truy vấn và khóa.

## Slide 7 — Scaled Dot-Product Attention

[[Scaled Dot-Product Attention]] tính toán đầu ra bằng cách dùng tích vô hướng của truy vấn với tất cả khóa, chia mỗi tích cho √dk, rồi áp dụng hàm softmax để thu được trọng số.

## Slide 8 — Multi-Head Attention

[[Multi-head attention]] cho phép mô hình đồng thời chú ý đến thông tin từ các không gian biểu diễn khác nhau ở nhiều vị trí. Việc sử dụng nhiều đầu chú ý giúp tăng cường khả năng học tập của mô hình.

## Slide 9 — Applications of Attention in our Model

Transformer sử dụng [[multi-head attention]] theo ba cách khác nhau: trong các lớp attention encoder-decoder, trong các lớp self-attention của encoder, và trong các lớp self-attention của decoder với các kết nối được kiểm soát để duy trì tính chất auto-regressive.

## Khái niệm chính

- [[attention]]: Cơ chế cho phép mô hình hóa các phụ thuộc giữa các yếu tố trong chuỗi đầu vào và đầu ra.
- [[self-attention]]: Cơ chế ánh xạ các vị trí khác nhau trong cùng một chuỗi để tính toán biểu diễn của chuỗi.
- [[Transformer]]: Kiến trúc mạng nơ-ron không dựa trên hồi tiếp, sử dụng hoàn toàn các cơ chế attention.
- [[multi-head attention]]: Kỹ thuật cho phép thực hiện nhiều phép toán attention song song, cải thiện khả năng học tập của mô hình.
- [[transduction]]: Quy trình chuyển đổi dữ liệu từ dạng này sang dạng khác, thường thấy trong dịch machine translation.
- [[chuỗi]]: Một dãy các yếu tố, thường là dữ liệu tuần tự như văn bản trong mô hình ngôn ngữ.
```
