---
course: inbox
generated: '2026-07-30T16:36:20+00:00'
lang: vi
lesson: DeepPhys
maps:
- '[[MOC - inbox]]'
module: ''
source_file: inbox/DeepPhys.pdf
source_hash: sha256:b2a580aeba02da1bbd8e3e2c1ea69cbbcd9f1628200e7dffc805a21e57f2c0f6
type: lesson-note
---

## Slide 1 — DeepPhys: Video-Based Physiological Measurement Using Convolutional Attention Networks
<!-- src: ... -->

DeepPhys là hệ thống đầu tiên kết hợp mạng nơ-ron tích chập sâu để đo nhịp tim và nhịp thở từ video, với khả năng đo chính xác trong điều kiện ánh sáng khác nhau và chuyển động lớn. Phương pháp này vượt trội so với các công nghệ hiện tại và cho phép trực quan hóa phân phối thời gian không gian của các tín hiệu sinh lý. 

## Slide 2 — Introduction
<!-- src: ... -->

Đo đạc sinh lý không tiếp xúc bằng video là một lĩnh vực nghiên cứu đang phát triển, với những ứng dụng quan trọng trong y tế và tương tác người-máy. Kỹ thuật Imaging Photoplethysmography ([[ippg]]) đo sự thay đổi thể tích máu gần bề mặt da, trong khi Imaging Ballistocardiography ([[ibcg]]) lại sử dụng thông tin chuyển động để thu thập dữ liệu tim mạch. Các thông số sinh lý như nhịp tim và tần số hô hấp có thể được tái tạo từ video, giúp hình dung sự thay đổi sinh lý một cách trực quan. 

## Slide 3 — Related Work
<!-- src: ... -->

Nghiên cứu về [[remote-physiological-measurement]] sử dụng những thay đổi nhỏ trong ánh sáng phản chiếu từ da để trích xuất tín hiệu sinh lý. Các phương pháp truyền thống gặp khó khăn trong điều kiện ánh sáng và chuyển động khác nhau. Các phương pháp mới hơn đòi hỏi quy trình phức tạp và thiếu khả năng đánh giá chính xác. Hơn nữa, phần lớn nghiên cứu đều sử dụng [[unsupervised-learning]] và các phương pháp phân tách tín hiệu.

## Slide 4 — Deep Learning
<!-- src: ... -->

Trong bài nghiên cứu này, chúng tôi sử dụng các mô hình học sâu để phân tích chuyển động trong video. Các [[attention-mechanisms]] được áp dụng để tăng cường khả năng học các đặc trưng quan trọng trong video. Bằng cách kết hợp hai mô hình - một cho chuyển động và một cho màu sắc, chúng tôi có thể cải thiện độ chính xác trong việc ước lượng nhịp tim và hô hấp.

## Slide 5 — Skin Reflection Model
<!-- src: ... -->

Mô hình phản chiếu da được thiết lập để mô tả các thay đổi màu sắc và chuyển động trong video. Theo mô hình này, các yếu tố ánh sáng và màu da cũng được xem xét để tạo ra một chế độ kiểm tra chính xác hơn. Trình tự cải tiến được thực hiện để phân tách tín hiệu sinh lý từ footage.

## Slide 6 — Approach
<!-- src: ... -->

Phương pháp đề xuất bao gồm một [[motion-representation]] mới với sự tính toán sự khác biệt của khung hình chuẩn hóa để tối ưu hóa hơn nữa chất lượng dữ liệu đầu vào cho mạng nơ-ron. Mô hình tích chập sâu được sử dụng để ước lượng các tín hiệu sinh lý từ dữ liệu này.

## Slide 7 — Datasets
<!-- src: ... -->

Chúng tôi kiểm tra phương pháp của mình trên bốn tập dữ liệu khác nhau với nhiều đối tượng khác nhau. Các bài kiểm tra khác nhau liên quan đến chuyển động đầu được thực hiện để đánh giá chức năng của mô hình, xác nhận khả năng tổng quát với nhiều điều kiện chiếu sáng và độ tuổi khác nhau.

## Slide 8 — Results and Discussion
<!-- src: ... -->

Kết quả cho thấy mô hình DeepPhys vượt trội hơn nhiều so với các phương pháp trước đó. Đặc biệt, mô hình thành công trong các bài kiểm tra có chuyển động lớn, xác định và lấy mẫu tín hiệu sinh lý hiệu quả hơn. Các bộ dữ liệu đa dạng đã chứng minh khả năng của mô hình trong việc tổng quát hóa qua các loại hình dạng da và ánh sáng khác nhau.

## Khái niệm chính
- [[deep-learning]]: Một lĩnh vực trong trí tuệ nhân tạo, sử dụng mạng nơ-ron để học từ dữ liệu lớn.
- [[motion-representation]]: Biểu diễn thông tin chuyển động trong video để sử dụng trong các thuật toán xử lý.
- [[ippg]]: Kỹ thuật đo thể tích máu qua các biến đổi màu sắc của da.
- [[ibcg]]: Kỹ thuật đo đạc thông tin nhịp tim qua chuyển động cơ thể.
- [[attention-mechanisms]]: Cơ chế cho phép các mô hình tập trung vào những đặc trưng quan trọng hơn khi phân tích. 
- [[remote-physiological-measurement]]: Đo các chỉ số sinh lý từ xa mà không cần tiếp xúc trực tiếp. 
- [[unsupervised-learning]]: Phương pháp học máy không yêu cầu nhãn cho dữ liệu huấn luyện.
