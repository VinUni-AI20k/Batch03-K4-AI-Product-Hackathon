# Kịch bản demo 5 phút - VLearn Active Recall

## Slide 1 - User & Job (45 giây)

**Người nói:** Trần Hoàng Long

"Học viên thường xem xong bài và nghĩ rằng mình đã hiểu, nhưng chỉ phát hiện lỗ
hổng khi bắt tay làm bài tập lớn. Trong 2.518 lượt chat, 99,88% không có câu hỏi
kiểm tra chủ động. Đồng thời, 32/36 học viên sẵn sàng làm một Quiz nếu bài đủ
ngắn. Vì vậy job chúng tôi chọn là giúp học viên kiểm tra hiểu thật ngay sau buổi
học."

## Slide 2 - Vì sao chọn tính năng này (45 giây)

**Người nói:** Phạm Quốc Bảo

"Nhóm không bắt đầu với duy nhất một ý tưởng. Chúng tôi so sánh Active Recall,
sửa Tutor trả lời lan man và chuyển câu hỏi sang Discord. Active Recall phục vụ
khoảng 1.000 học viên, xảy ra 2-3 lần mỗi tuần và có thể tránh 2-3 giờ sửa bài.
Đây cũng là hướng có bằng chứng nhu cầu mạnh nhất nên được chọn."

## Slide 3 - Giải pháp và demo live (2 phút)

**Người nói:** Nguyễn Sỹ Mạnh Cường

"Prototype đưa ra 3-5 câu hỏi tình huống, chỉ ra misconception và luôn gắn mã
trích dẫn. Chúng tôi chọn Conditional Automation: hệ thống phân tích kết quả,
nhưng chỉ chuyển vùng slide cho TA khi học viên chủ động xác nhận."

**Demo case chuẩn:**

1. Mở `codebase/index.html`.
2. Chọn đáp án đúng ở một câu.
3. Chỉ vào phần giải thích và mã `[Txx-xxx]`.

**Demo case khó:**

1. Chọn đáp án thể hiện nhầm lẫn rằng Self-Attention hiểu ngữ nghĩa như con người.
2. Chỉ vào phần phát hiện misconception và trích dẫn `[T01-022]`.
3. Bấm "Chuyển vùng slide cho TA" và cho thấy bước xác nhận.

## Slide 4 - Kết quả đo (45 giây)

**Người nói:** Trần Đức Bảo

"Quality bar được chốt ở 85% và không được thay đổi sau khi đo. Lượt baseline
đạt 15/20 case, tương đương 75%, chủ yếu thiếu trích dẫn ở các case mơ hồ. Sau
khi tuning prompt, kết quả tăng lên 18/20, tương đương 90% và vượt quality bar
5 điểm phần trăm."

## Slide 5 - User nói gì (45 giây)

**Người nói:** Phạm Công Đạt

"Khảo sát 36 học viên cho thấy 32 người sẵn sàng làm Quiz nếu ngắn. Có 14 người
muốn hệ thống hỏi trước khi gửi cho giảng viên. Vì vậy prototype giới hạn Quiz
ở ba câu và đặt quyền chuyển TA vào tay học viên. Đây là khảo sát định hướng;
nhóm vẫn cần bổ sung năm lượt usability test trực tiếp trước CP5."

## Slide 6 - Nếu có thêm một tuần (30 giây)

**Người nói:** Cả nhóm, Phạm Công Đạt chốt

"Ba ưu tiên là test trực tiếp với ít nhất năm người, xử lý hai case còn fail và
xây lịch sử lỗi sai để cá nhân hóa ôn tập. Bài học lớn nhất của nhóm là bằng
chứng phải khớp đúng câu hỏi: khảo sát đo nhu cầu, eval đo chất lượng và
usability test đo khả năng sử dụng."

## Checklist trước khi lên demo

- Chạy thử `codebase/index.html` trên đúng máy trình chiếu.
- Chuẩn bị sẵn một case chuẩn và một case khó.
- Bổ sung slide 5 khi có ít nhất 5 lượt usability test.
- Bấm giờ toàn bộ phần nói, mục tiêu 4 phút 45 giây đến 5 phút.
