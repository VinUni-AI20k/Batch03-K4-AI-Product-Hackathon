# PRODUCT CANVAS — QUIZ CỦNG CỐ CUỐI BUỔI

**Nhóm:** Team Rau Má  
**Hướng:** A — VLearn, tính năng mới

## Canvas CP1

| Thành phần | Nội dung |
|---|---|
| Job executor | Học viên vừa kết thúc một buổi học và đang quyết định liệu mình đã hiểu đủ để tiếp tục hay cần ôn lại. |
| Core JTBD | Sau khi học xong một buổi, kiểm tra ý chính mình chưa nắm để biết cần ôn lại phần nào trước khi quên hoặc bước sang bài tiếp theo. |
| Pain giả thuyết | Học viên vừa hoàn thành buổi học nhưng không có phản hồi nhanh, đáng tin về mức hiểu của mình, nên khó ưu tiên nội dung cần ôn lại và dễ mang lỗ hổng kiến thức sang bài sau. |
| Bằng chứng cần có | Khảo sát ≥20 người ngoài nhóm, ≥50% xác nhận pain, lưu toàn bộ câu hỏi và phản hồi. |
| Lát cắt một câu | Một học viên vừa học xong một bài được hệ thống tạo quiz 15 câu có căn cứ theo đúng bài vừa học, chấm đáp án và chỉ ra nội dung cần ôn lại, để học viên quyết định bước học tiếp theo. |
| Automation | Conditional/augment: AI chỉ sinh câu có mã nguồn học liệu và nguồn đủ; thiếu nguồn thì không sinh hoặc yêu cầu chọn nội dung khác. |
| Willing users | Lâm Vũ, Lê Văn Tuấn, Cao Hương Giang — D303, đã đồng ý thử lúc 14:00 ngày 2. |

## Reward và ràng buộc học thuật

| Hạng mục | Thiết kế đề xuất |
|---|---|
| Reward | Đạt từ 12/15 câu đúng (80%) nhận 1 **practice-question credit**. |
| Cap | Tối đa 20 credits trong một học phần/chu kỳ. |
| Credit dùng cho | Mở thêm lượt hỏi **trong chế độ ôn tập VLearn**. |
| Không dùng cho | Bài thi/kiểm tra chính thức VinUni, điểm học phần, hoặc bất kỳ quyền lợi học vụ nào khi chưa được phê duyệt. |
| Chống spam | Mỗi quiz thưởng một lần; random hóa câu; quiz sau ưu tiên nội dung chưa đạt; log lượt làm. |
| Quyền quyết định | Giảng viên/ban vận hành phải duyệt reward, cap và quyền sử dụng AI trước khi triển khai thật. |

## Scope prototype

| In scope | Non-goals |
|---|---|
| Chọn 1 bài học và 3 đoạn nguồn đã duyệt | Không tích hợp điểm chính thức VinUni |
| Sinh quiz 15 câu MCQ, dự kiến 10–12 phút | Không dùng AI trong bài thi/kiểm tra thật |
| Mã nguồn học liệu cạnh từng câu và đáp án | Không tạo ngân hàng quiz toàn khóa |
| Chấm, feedback và một mục cần ôn | Không thưởng credit thật nếu chưa duyệt chính sách |
| Mô phỏng credit 0–20 | Không tự chẩn đoán toàn bộ lỗ hổng dài hạn |

## Bốn lớp chỗ khó

| Lớp | Rủi ro | Hành vi mong muốn |
|---|---|---|
| ① Nguồn sự thật | Câu hỏi/đáp án không được slide hỗ trợ | Chỉ sinh từ nguồn đã chọn; hiển thị mã nguồn học liệu; không có nguồn thì không sinh. |
| ② Mơ hồ | Bài ít nội dung hoặc mục tiêu học chưa rõ | Nói chưa đủ nguồn để tạo quiz tin cậy; cho chọn đoạn/chủ đề khác. |
| ④ Domain | Nhiều đáp án đúng, câu đánh đố, chấm mở không nhất quán | Prototype ưu tiên MCQ; câu mở chỉ feedback, không thành điểm chính thức. |

## Quality bar đề xuất

| Chiều | Định nghĩa pass | Bar |
|---|---|---:|
| Groundedness | Mọi câu/đáp án có nguồn hỗ trợ rõ | 100% |
| Chấm đúng | Đáp án khớp nguồn/rubric | 100% case test |
| Relevance | Câu kiểm tra mục tiêu bài, không trivia | ≥85% |
| Difficulty | User thử đánh giá vừa sức | ≥70% |
| Reward safety | Không có flow dùng credit cho đánh giá chính thức | 100% |
