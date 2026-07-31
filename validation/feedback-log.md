# CP5 — Feedback log

> Chỉ ghi người ngoài nhóm đã đồng ý thử sản phẩm. Không chép dữ liệu định danh nhạy cảm hoặc nội dung hồ sơ thật vào repo.

## Kịch bản dùng thử

1. Hỏi một thủ tục bằng cách nói tự nhiên.
2. Điền thông tin giả lập không nhạy cảm qua chat hoặc form.
3. Rà soát, chủ động sửa một lỗi và xác nhận nộp mô phỏng.
4. Kiểm tra người dùng có phân biệt biên nhận demo với biên nhận chính thức hay không.

## Ba câu hỏi cố định

1. Bạn có hiểu đây là nộp mô phỏng, không phải nộp thật không? Chi tiết nào giúp hoặc làm bạn hiểu nhầm?
2. Bạn có hoàn tất flow mà không được thành viên nhóm hướng dẫn miệng không? Nếu không, bạn dừng ở đâu?
3. Ở bước nào bạn do dự hoặc không biết phải làm gì tiếp?

## Feedback nguyên văn

| Người thử (tên/vai trò đã được phép ghi) | Thời điểm | Đường đi đã thử | Quote nguyên văn | Quan sát | Thay đổi/Quyết định |
|---|---|---|---|---|---|
| Lê Thị Hương Ly — Quản lý mua sắm và thủ tục, CMC ATI | 31/07/2026 | Yêu cầu đăng ký khai sinh từ chat | “Khi tôi hỏi đăng ký khai sinh, hệ thống hiển thị kế hoạch và tên các tool nên khá khó hiểu. Tôi muốn hệ thống hỏi trước xem tôi muốn tự điền biểu mẫu hay trả lời từng bước.” | Kế hoạch kỹ thuật làm người dùng mất tập trung; hệ thống quyết định cách nhập thay người dùng. | Ẩn plan/tên tool khỏi UI; hỏi chọn “Điền trên biểu mẫu” hoặc “Điền từng bước cùng Agent” trước khi mở form. |
| Vũ Minh Trí — Người sử dụng dịch vụ công | 31/07/2026 | Điền form khai sinh và nộp mô phỏng | “Tôi muốn biểu mẫu xuất hiện ngay trong khung chat. Sau khi điền xong cần cho tôi xem lại PDF và xác nhận lần cuối trước khi gửi.” | Luồng chuyển trang và thiếu bước xem lại làm giảm cảm giác kiểm soát. | Hiển thị form trong chat; bắt buộc validation, xem PDF và xác nhận trước khi gọi tool nộp mô phỏng. |
| Nguyễn Tiền Công — Sales và đăng ký giấy tờ xe, VinFast Nam Từ Liêm | 31/07/2026 | Hội thoại nhiều lượt và đổi thủ tục | “Khi cuộc trò chuyện kéo dài nhiều bước, hệ thống đôi lúc hiểu nhầm câu hỏi mới theo nội dung cũ. Khi đổi thủ tục, hệ thống cần nhận biết và bỏ ngữ cảnh cũ.” | State thủ tục cũ có thể gây retrieval/routing sai ở lượt sau. | Bổ sung context có cấu trúc, nhận biết đổi chủ đề, xóa form/state cũ và fail-closed khi không có đủ căn cứ. |
| Lê Thị Thảo Nguyên — Giáo viên | 31/07/2026 | Đọc câu trả lời hỏi đáp trên giao diện | “Câu trả lời còn hiển thị các ký tự Markdown như dấu sao nên khó đọc. Danh sách, tiêu đề và phần nhấn mạnh cần được hiển thị rõ ràng hơn.” | Markdown thô làm câu trả lời khó đọc và giảm độ tin cậy khi demo. | Thêm Markdown renderer an toàn cho heading, danh sách, nhấn mạnh, code và link; không cho phép HTML injection. |
| Khuất Thuỳ Linh — Tester tại CMC Global | 31/07/2026 | Chuyển từ hội thoại bình thường sang prompt injection/leo thang quyền | “Nếu đang hỏi bình thường rồi người dùng yêu cầu bỏ qua quy định, tự cấp quyền hoặc nộp hồ sơ không cần xác nhận thì hệ thống phải chặn ngay, không được tiếp tục gọi tool.” | Tấn công giữa hội thoại có thể lợi dụng context và workflow đang hoạt động. | Chặn injection/leo thang quyền trước RAG/LLM/tool; thêm allowlist, DLP, approval gắn hash, giới hạn call và duplicate/loop guard. |

## Tổng hợp kết quả validation

- Số người ngoài nhóm đã thử: **5**.
- Năm người đều chỉ dùng dữ liệu giả lập, không nhập hồ sơ hoặc định danh thật.
- Các thay đổi tương ứng đã được triển khai và regression test; golden set cuối đạt **25/25**.
- Trạng thái dry run có bấm giờ: **chưa có log xác nhận**; nhóm phải chạy và cập nhật trước khi chọn “Rồi, đúng 5 phút”.
