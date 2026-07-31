# Quy tắc quyền riêng tư — CRVLearn

Lớp cảnh báo này bảo vệ ô hội thoại bằng rule-based detection chạy hoàn toàn
trên trình duyệt. Nội dung người dùng không được gửi tới AI để phân loại xem có
riêng tư hay không.

## Quy tắc áp dụng

1. **Tối thiểu hóa dữ liệu:** không yêu cầu người học nhập thông tin định danh để
   nhận hỗ trợ học tập.
2. **Cảnh báo trước khi gửi:** khi phát hiện dữ liệu có thể riêng tư, lượt gửi đầu
   tiên bị giữ lại để người dùng sửa, che hoặc chủ động xác nhận vẫn gửi.
3. **Quyền kiểm soát của người dùng:** nút **Che thông tin** thay phần nhạy cảm
   bằng placeholder; hệ thống không tự ý thay đổi nội dung nếu chưa được chọn.
4. **Không ghi log từ bộ dò:** bộ dò không lưu nội dung, kết quả match hay bản sao
   thông tin riêng tư vào `localStorage`, console hoặc analytics.
5. **Minh bạch bên thứ ba:** giao diện nhắc rõ rằng khi dùng AI thật, nội dung được
   gửi tới nhà cung cấp AI đang chọn.
6. **API key là ngoại lệ có chủ đích:** key chỉ được nhập ở trường cấu hình riêng;
   key xuất hiện trong ô hội thoại vẫn bị coi là dữ liệu nhạy cảm nghiêm trọng.
7. **Phòng thủ nhiều lớp:** rule trong giao diện giúp ngăn gửi nhầm; system prompt
   hiện có tiếp tục yêu cầu tutor không hỏi, lưu hoặc in lại thông tin nhạy cảm.

## Nhóm dữ liệu được cảnh báo

- Mật khẩu, OTP, PIN, API key, access token và JWT.
- Số thẻ thanh toán và số tài khoản ngân hàng.
- CCCD, CMND, hộ chiếu và chuỗi 12 số có thể là CCCD.
- Số điện thoại và địa chỉ email.
- Mã số học viên/sinh viên, ngày sinh, họ tên và địa chỉ nhà khi có ngữ cảnh rõ.

Rule dùng ngữ cảnh cho các chuỗi dễ gây false positive. Số thẻ được kiểm tra thêm
bằng thuật toán Luhn. Đây là lớp hỗ trợ giảm rủi ro, không phải công cụ nhận diện
PII tuyệt đối; người dùng vẫn cần tự rà nội dung trước khi chọn **Vẫn gửi**.
