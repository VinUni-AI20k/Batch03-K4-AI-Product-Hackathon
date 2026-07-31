# Bản Thu Hoạch Cá Nhân (Reflection)

**Họ và tên:** Nguyễn Thị Hải Yến
**Mã HV:** 2A2026
**Vai trò trong nhóm:** Validation

## 1. Công việc đã thực hiện
- Lên kịch bản kiểm thử (Test cases) với 4 mức độ rủi ro (Nguồn sự thật, Mơ hồ, Thẩm quyền, Đặc thù domain).
- Đóng vai người dùng cuối để test các edge cases (xin API key, xin gia hạn nộp bài).
- Ghi nhận `feedback_log.md` để team điều chỉnh System Prompt.

## 2. Bài học rút ra (Learnings)
- **Góc nhìn User:** Người dùng thường không biết cách đặt câu hỏi rõ ràng (ví dụ: "Sửa lỗi này kiểu gì?"). Bot cần phải biết cách hỏi ngược lại thay vì trả lời bừa.
- **Giá trị của Test:** Validation không chỉ là tìm lỗi code, mà là tìm xem AI có đang xử lý "đúng luồng" (Align) với mục tiêu của khoá học hay không.

## 3. Điều muốn làm tốt hơn
- Nếu có thời gian, mình muốn tổ chức một đợt test rộng rãi hơn (A/B testing) với khoảng 10-20 bạn học viên thật để xem họ phản ứng thế nào khi bị bot "từ chối" yêu cầu.
