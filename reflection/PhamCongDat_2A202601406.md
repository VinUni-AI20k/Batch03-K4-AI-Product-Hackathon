# Reflection cá nhân - Phạm Công Đạt

**Mã học viên:** 2A202601406  
**Nhóm:** 5tuat  
**Vai trò:** User Validation, tổng hợp bài nộp và slide demo

## Phần tôi phụ trách

Tôi phụ trách tổng hợp dữ liệu khảo sát thành các quyết định thiết kế có thể
kiểm chứng, chuẩn bị quy trình validation và xây dựng câu chuyện demo 5 phút.
Tôi đối chiếu từng nội dung trình bày với artifact trong repo để tránh sử dụng
số liệu không có nguồn.

Từ 36 phản hồi Google Form, tôi tổng hợp được ba tín hiệu chính:

- 32/36 học viên sẵn sàng làm Quiz nếu bài Quiz ngắn.
- 14/36 học viên muốn được hỏi ý kiến trước khi chuyển câu hỏi cho giảng viên.
- 33/36 học viên sẵn sàng chia sẻ lịch sử câu sai để nhận gợi ý ôn tập.

Các tín hiệu này dẫn tới quyết định dùng Conditional Automation: AI phân tích
kết quả, nhưng học viên giữ quyền quyết định có chuyển vùng slide cho TA hay
không.

## AI đã hỗ trợ như thế nào

Tôi dùng AI để hỗ trợ đọc cấu trúc rubric, nhóm các phản hồi lặp lại, kiểm tra
phép tính tỷ lệ và đề xuất cách trình bày ngắn gọn. Tôi kiểm tra lại các con số
trên báo cáo Google Form và chỉ đưa vào bài những câu trả lời có trong nguồn.
AI không được dùng để tạo người tham gia hoặc bịa quote validation.

## Một case fail và bài học

Case fail quan trọng nhất của phần tôi là nhầm lẫn giữa khảo sát nhu cầu và
validation sau khi dùng thử. Báo cáo Google Form có 36 phản hồi thật nhưng không
thu tên và được thực hiện trước khi người dùng thao tác trên prototype, nên chưa
đáp ứng đầy đủ R6.

Bài học của tôi là bằng chứng chỉ có giá trị khi phương pháp thu thập khớp với
câu hỏi cần trả lời. Khảo sát cho biết người học có muốn giải pháp hay không;
usability test mới cho biết họ có sử dụng được prototype và tin kết quả hay
không. Vì vậy tôi ghi rõ giới hạn của dữ liệu và chuẩn bị kịch bản test với ít
nhất 5 người ngoài nhóm thay vì biến khảo sát thành log sử dụng giả.

## Nếu làm lại

Tôi sẽ tạo form validation ngay khi prototype có flow bấm được, gắn mã cho từng
người thử và ghi cả quan sát thao tác lẫn câu nói nguyên văn. Nhờ đó nhóm có thể
phân biệt rõ feedback về ý tưởng, feedback về giao diện và feedback về chất
lượng kết quả AI.
