---
course: packs
generated: '2026-07-31T18:35:17+00:00'
lang: vi
lesson: transcript-04-clean
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\transcript\transcript-04-clean.md
source_hash: sha256:03457fb6ddbedfe72f2345185c7147651105a2fefeffe3afa4b9ad633af5bbb1
type: lesson-note
---

```markdown
# Ghi chú bài học — Day 1: Foundation (phần 1)

## Chào lớp và giới thiệu giảng viên
**[T04-001]** Xin chào mọi người, mình là Trung. Ngày hôm nay chúng ta sẽ bắt đầu một hành trình thú vị về [[AI]] (trí tuệ nhân tạo). Rất nhiều bạn đang có mặt ở đây vì sự hứng thú với lĩnh vực này.

**[T04-002]** Lớp học có sự kết hợp giữa sinh viên năm cuối và những người đã có kinh nghiệm trong ngành — đây là cơ hội tuyệt vời để tất cả học hỏi và chia sẻ.

**[T04-003]** Trong buổi học hôm nay, chúng ta sẽ tìm hiểu sự khác biệt giữa [[AI]] truyền thống và [[mô-hình-ngôn-ngữ-lớn]] (LLM) như ChatGPT, Gemini hay Claude — cùng xem cách mà những mô hình này hoạt động.

**[T04-004]** Mình có khoảng 10 năm kinh nghiệm trong lĩnh vực công nghệ, đã làm việc trong nhiều dự án liên quan đến [[AI]] và [[blockchain]], và sẽ chia sẻ những kiến thức của mình trong course này.

## Nội dung ngày học và bức tranh tổng quan về AI
**[T04-013]** Chúng ta sẽ cùng nhau khám phá bức tranh tổng thể của [[AI]], tóm tắt lịch sử của nó từ năm 1950, và đi sâu vào cơ chế hoạt động của [[mô-hình-ngôn-ngữ-lớn]]. Cuối buổi, chúng ta sẽ thực hành với API.

**[T04-015]** Đầu tiên, chúng ta cần hiểu rằng [[AI]] là một hệ thống có trí thông minh, bao gồm các tầng khác như [[machine-learning]] và [[deep-learning]]. [[AI tạo sinh]] là một tầng con của [[AI]], sử dụng trong các chatbot hiện nay.

## Lịch sử AI: Turing test và hai mùa đông
**[T04-016]** [[AI]] không phải là một khái niệm mới; nó đã có khoảng 70 năm phát triển. Năm 1956 đánh dấu sự ra đời của [[AI]]. Alan Turing là người đóng góp nhiều lý thuyết, bao gồm [[Turing test]] để xác định trí thông minh của máy.

**[T04-024]** Từ năm 1956, nhiều ý tưởng về [[AI]] đã được phát triển nhưng cũng gặp phải những mùa đông khi mà kỳ vọng không đạt được thực tế. Đặc biệt, ở các năm 70-80, sự thiếu hụt dữ liệu và máy móc đã khiến cho nhiều dự án AI thất bại. 

## Deep learning và sức mạnh của dữ liệu
**[T04-030]** [[Deep-learning]] là một bước đột phá, cho phép máy học được từ dữ liệu mà không cần phải định nghĩa luật bằng tay. Bên cạnh đó, dữ liệu chất lượng cao là rất quan trọng để mô hình có thể học tốt.

**[T04-031]** [[ImageNet]] ra đời với sự góp mặt của nhiều nhà nghiên cứu đã mở đường cho xu hướng [[deep-learning]] phát triển mạnh mẽ.

## AlphaGo và kiến trúc Transformer
**[T04-034]** [[AlphaGo]] là dấu mốc trong lịch sử [[AI]], khi mà nó đánh bại kỳ thủ cờ vây hàng đầu Lee Sedol. Câu chuyện này đã khơi dậy sự quan tâm lớn đến [[AI]].

**[T04-038]** Năm 2017, bài báo "Attention Is All You Need" đã giới thiệu [[kiến-trúc-transformer]], từ đó dẫn đến sự phát triển của các mô hình [[LLM]] như ChatGPT.

## Cuộc đua AI sau ChatGPT
**[T04-041]** Sau sự ra đời của ChatGPT vào năm 2022, tất cả các công ty [[AI]] đều nhanh chóng chuyển mình để thích nghi với xu hướng mới.

## Mổ xẻ mô hình ngôn ngữ lớn: dự đoán token và context
**[T04-046]** Các mô hình [[ngôn-ngữ-lớn]] như ChatGPT dự đoán và sinh ra [[token]] — các đơn vị ngôn ngữ nhỏ hơn chữ cái và từ. [[Context]] hay bối cảnh là thông tin mà mô hình có thể xử lý trong một lần.

## Attention, multi-head và bài học quản lý context
**[T04-053]** [[Attention]] trong [[Transformer]] cực kỳ quan trọng để mô hình có thể chú ý đến thông tin cần thiết. Quản lý context hiệu quả sẽ giúp tăng hiệu suất của [[AI]] hơn.

## Tham số, RLHF và ngành gán nhãn dữ liệu
**[T04-058]** [[Tham-số]] thể hiện khả năng của mô hình. [[RLHF]] (học tăng cường với con người) là phương pháp giúp nâng cao khả năng học của mô hình nhờ phản hồi từ người dùng.

## Tóm tắt buổi học
**[T04-091]** Trong buổi học hôm nay, chúng ta đã tìm hiểu về cách mô hình [[LLM]] hoạt động, cấu trúc và cách lựa chọn mô hình phù hợp với công việc mình đang làm.

## Khái niệm chính
- [[AI]]: Trí tuệ nhân tạo, là hệ thống có khả năng thực hiện những tác vụ cần trí thông minh.
- [[LLM]]: Mô hình ngôn ngữ lớn, cho phép sinh và xử lý văn bản tự nhiên.
- [[Deep-learning]]: Phương pháp học máy dựa trên mạng neuron nhiều lớp, tự động học từ dữ liệu.
- [[Turing test]]: Thử nghiệm đánh giá trí thông minh của máy tính thông qua khả năng giả mạo cuộc trò chuyện với con người.
- [[Context]]: Bối cảnh hay ngữ cảnh, thông tin mà mô hình có thể tiếp nhận trong một lần xử lý.
- [[Attention]]: Cơ chế giúp mô hình chú ý đến phần quan trọng trong dữ liệu.
- [[Token]]: Đơn vị cơ bản trong văn bản mà mô hình ngôn ngữ lớn sử dụng để phân tích và sinh ra văn bản.
- [[RLHF]]: Kỹ thuật học tăng cường có sự tham gia của con người để cải thiện phản hồi từ mô hình.
```
