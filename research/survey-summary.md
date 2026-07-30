# Tóm tắt khảo sát nhu cầu ôn tập sau khi dùng VLearn Tutor

## 1. Mục đích và phạm vi

Khảo sát được thực hiện để kiểm chứng pain point của người học sau khi dùng AI Tutor: họ có nhận ra mình đã tìm hiểu gì, có xác định được phần cần ôn lại và có mất thời gian tổng hợp lại nội dung hay không.

Khảo sát không đo độ chính xác của AI, không chứng minh Learning Trace đã cải thiện điểm số và không thay thế cho vòng usability test ở CP5.

## 2. Kiểm tra dữ liệu

- Bản dữ liệu được nhóm nhận từ form có **34 dòng phản hồi** theo các timestamp đã dán vào nhóm làm việc. Nhóm ban đầu ghi nhận khoảng 31 người, vì vậy cần kiểm tra lại export để xác định `n` cuối cùng trước khi trình bày chính thức.
- Bản tổng hợp này tạm dùng `n = 34` theo số dòng hiện có; mọi phần trăm đều phải cập nhật lại nếu loại dòng trùng, dòng test hoặc phản hồi không hợp lệ.
- Các câu hỏi lý do và nhu cầu đầu ra là câu hỏi chọn nhiều đáp án; tổng số lựa chọn không dùng để suy ra số người.
- Giá trị thời gian `Tùy chọn 3` và các câu trả lời bỏ qua cần được xác minh hoặc mã hóa thành `không rõ` trước khi dùng làm KPI.
- Không đưa timestamp, định danh hoặc raw response vào giao diện demo. Bản log khảo sát đầy đủ được giữ riêng trong `research/survey-log.csv` với mã ẩn danh R01–R34.

## 3. Kết quả định lượng sơ bộ

### Mức độ sử dụng AI Tutor

| Số buổi đã dùng trong 3 buổi gần nhất | Số người | Tỷ lệ trên 34 dòng |
|---|---:|---:|
| 0 buổi | 6 | 17,6% |
| 1 buổi | 12 | 35,3% |
| 2 buổi | 9 | 26,5% |
| 3 buổi | 7 | 20,6% |
| Ít nhất 1 buổi | 28 | 82,4% |

### Khó xác định nên bắt đầu ôn từ đâu

| Số buổi muốn ôn lại nhưng khó bắt đầu | Số người | Tỷ lệ |
|---|---:|---:|
| 0 buổi | 9 | 26,5% |
| 1 buổi | 5 | 14,7% |
| 2 buổi | 10 | 29,4% |
| 3 buổi | 10 | 29,4% |
| Ít nhất 1 buổi | 25 | 73,5% |
| Ít nhất 2 buổi | 20 | 58,8% |

Đây là bằng chứng trực tiếp cho lát cắt sản phẩm: sau buổi học, người học cần biết nên ôn nội dung nào trước.

### Cách ôn lại hiện tại

| Hành vi sau buổi học | Số người |
|---|---:|
| Mở lại slide/tài liệu | 10 |
| Dùng ChatGPT/công cụ khác | 7 |
| Không ôn lại | 6 |
| Tự viết ghi chú | 4 |
| Đọc lại lịch sử chat | 4 |
| Hỏi bạn hoặc TA | 2 |
| Xem lại video bài giảng | 1 |

Các hành vi cho thấy việc ôn tập đang bị chia nhỏ giữa slide, lịch sử chat, ghi chú cá nhân và công cụ bên ngoài. Đây là lý do nhóm chọn một output cuối buổi tập trung thay vì thêm một chatbot mới.

### Nội dung người học muốn thấy trong bản tổng hợp

| Thành phần mong muốn | Số người | Tỷ lệ |
|---|---:|---:|
| Các chủ đề đã tìm hiểu | 17 | 50,0% |
| Phần có thể cần xem lại | 15 | 44,1% |
| Giải thích ngắn cho từng khái niệm | 14 | 41,2% |
| Mindmap liên kết các khái niệm | 14 | 41,2% |
| Khả năng xác nhận hoặc sửa nhận định | 10 | 29,4% |
| Câu hỏi tự kiểm tra | 10 | 29,4% |
| Citation về đúng slide/tài liệu | 9 | 26,5% |
| Lý do hệ thống cho rằng cần xem lại | 4 | 11,8% |

Các lựa chọn là multi-select nên một người có thể xuất hiện ở nhiều dòng.

### Thời gian tìm và tổng hợp lại

Trong các câu trả lời có thể mã hóa rõ: 13 người chọn 11–20 phút, 5 người chọn trên 20 phút, 7 người chọn 5–10 phút và 1 người chọn dưới 5 phút. Có 4 câu bỏ qua và 4 câu trả về `Tùy chọn 3`; chưa dùng phân bố này làm KPI cho đến khi form được kiểm tra lại.

## 4. Pain point định tính

Các câu trả lời mở được ẩn danh bằng mã dòng. Một số quote giữ nguyên cách viết của người trả lời:

> “Không lưu lại lịch sử trò chuyện khiến việc đọc lại của tôi bị gián đoạn.” — R02

> “Tutor không tóm tắt được đầy đủ nội dung cần thiết.” — R10

> “ai tutor không thể tổng hợp nội dung nếu chưa được hỏi trước đó.” — R13

> “Mất tgian.” — R15

> “Khó nhớ bài.” — R29

> “Phải đi research ở ngoài.” — R33

Các quote này củng cố ba vấn đề: lịch sử học tập bị rời rạc, người học phải tự tổng hợp lại và không có điểm bắt đầu rõ ràng khi ôn.

## 5. Bảng impact và quyết định phạm vi

| Ứng viên | Bằng chứng | Tần suất / hậu quả | Khả thi trong hackathon | Quyết định |
|---|---|---|---|---|
| Learning Trace cuối buổi | 25/34 từng khó xác định nên bắt đầu ôn từ đâu | 20/34 gặp trong ít nhất 2 buổi; dễ bỏ qua việc ôn | Cao với mock data và một AI call ở CP3 | **Chọn** |
| Note có nguồn đối chiếu | 9/34 chọn citation; nhiều quote nhắc Tutor thiếu chi tiết/căn cứ | Người học mất niềm tin hoặc phải research ngoài | Cao nếu grounding vào slide/transcript | **Chọn làm nguyên tắc bắt buộc** |
| Mindmap liên kết kiến thức | 14/34 chọn mindmap | Giúp nhìn quan hệ giữa các chủ đề thay vì đọc lại chat dài | Cao ở CP2; dùng HTML/SVG/CSS | **Chọn trong output** |
| Quiz tự kiểm tra | 10/34 chọn câu hỏi tự kiểm tra | Có giá trị nhưng cần thiết kế câu hỏi, chấm và tiêu chí đánh giá | Trung bình/thấp trong lát cắt hiện tại | **Để backlog** |
| Bản đồ lỗ hổng cấp lớp cho giảng viên | Chưa có câu hỏi khảo sát trực tiếp cho nhu cầu giảng viên | Mở rộng actor, quyền truy cập và privacy | Thấp trong thời gian hiện tại | **Loại khỏi CP2** |

## 6. Tác động đến thiết kế CP2

- Hiển thị **Personalized Note** theo từng ngày học để người học biết nội dung thuộc buổi nào.
- Tách rõ “đã tìm hiểu”, “gợi ý cần xác nhận/xem lại” và “chưa đủ dữ liệu”; không dùng ngôn ngữ kết luận người học yếu.
- Gắn citation và lượt hỏi Tutor vào mỗi nhận định để người học kiểm tra được căn cứ.
- Cho phép người học chọn “Mình đã hiểu” hoặc “Cần xem lại”; phản hồi cập nhật cả note, metric và mindmap.
- Giữ quiz ngoài CP2 dù có nhu cầu; đưa vào backlog để tránh biến Learning Trace thành công cụ chấm điểm.

## 7. Hạn chế và bước xác minh tiếp theo

- Mẫu khảo sát thuận tiện, chưa đại diện cho toàn bộ người học.
- Cần xác minh số phản hồi hợp lệ là 31 hay 34 và sửa giá trị `Tùy chọn 3`.
- Survey mới xác minh nhu cầu và pain point. Ở CP5, nhóm cần test prototype với ít nhất 5 người ngoài nhóm, quan sát họ hoàn thành task và ghi quote nguyên văn.
- Các chỉ số usability cần đo riêng: thời gian tìm được phần cần ôn, tỷ lệ tìm được citation, khả năng hiểu gợi ý và mức độ tin tưởng.
