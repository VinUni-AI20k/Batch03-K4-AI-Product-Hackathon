# Reflection cá nhân — Nguyễn Sỹ Mạnh Cường

- **Họ và tên:** Nguyễn Sỹ Mạnh Cường
- **Mã học viên:** 2A202601040
- **Vai trò trong nhóm 5tuat:** Working Prototype Developer

---

## 1. Phần việc phụ trách
- Lập trình giao diện Working Prototype trong `codebase/index.html` tích hợp Split View (Slide Viewer + Active Recall Assistant) (Rubric R5).
- Cài đặt hiệu ứng tương tác, minh họa Attention Weights, popup xác nhận gửi cho TA, và hiển thị thẻ trích dẫn `[Txx-xxx]`.
- Hiện thực hóa 4 đường đi trải nghiệm (Happy path, Low confidence, Out of scope, Correction).

## 2. AI hỗ trợ thế nào trong quá trình làm việc
- Dùng AI để sinh mã HTML/CSS theo phong cách modern glassmorphism, màu sắc HSL hài hòa và hiệu ứng micro-animations.
- Sử dụng AI để tối ưu hóa logic JavaScript xử lý trạng thái ẩn/hiện card chẩn đoán và chuyển slide mượt mà.

## 3. Bài học lớn nhất từ case fail của nhóm
- **Case fail:** Ban đầu UI thiết kế nút "Chuyển cho TA" bấm là gửi ngay lập tức, không có bước xác nhận.
- **Bài học rút ra:** Khi đối chiếu kết quả khảo sát 24 học viên (37.5% yêu cầu nút xác nhận trước khi gửi) và nguyên tắc PAIR Feedback & Control, việc tự động gửi khiến người dùng cảm thấy mất kiểm soát và lo lắng. Thêm modal xác nhận đơn giản đã giải quyết triệt để vấn đề này, chứng minh tầm quan trọng của việc lắng nghe phản hồi của người dùng.
