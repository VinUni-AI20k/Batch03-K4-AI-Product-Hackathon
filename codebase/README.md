# ĐềTài+ — UI prototype

Prototype tĩnh cho luồng **“Agent hỗ trợ học viên lựa chọn đề tài dựa trên sở thích và kỹ năng”**.

## Chạy demo

Từ thư mục gốc của repository:

```bash
python3 -m http.server 8000
```

Mở:

```text
http://localhost:8000/codebase/
```

## Luồng có thể trình diễn

1. Hoàn tất popup ba bước: hồ sơ, sở thích/kỹ năng và cách thực hiện.
2. Có thể chọn **Dùng hồ sơ mẫu** hoặc một tệp PDF/DOCX/TXT mô phỏng.
3. Xem ba đề tài được xếp hạng từ `../mock-data.json`.
4. Chuyển sang **Kho đề tài** để tìm kiếm, lọc lĩnh vực/quy mô nhóm và sắp xếp toàn bộ dữ liệu.
5. Bấm bất kỳ đề tài nào để xem lý do phù hợp và hướng dẫn setup bốn bước.
6. Chọn **Góp ý đề tài** để gửi một đề xuất mới trong phiên demo.

## Cài đặt giao diện

- Nút **Giao diện** ở thanh trên cùng và **Cài đặt giao diện** ở thanh bên mở bảng cá nhân hóa.
- Có ba chế độ màu: theo thiết bị, sáng và tối.
- Mặc định dùng **Be Vietnam Pro** để hiển thị dấu tiếng Việt rõ ràng; người dùng vẫn có thể chọn phông hệ thống.
- Tùy chọn giảm chuyển động hỗ trợ người dùng nhạy cảm với hiệu ứng.
- Các lựa chọn chỉ được lưu trong `localStorage` của trình duyệt, không gửi ra ngoài.

## Phần được mô phỏng

- Không có tệp nào được upload hoặc phân tích thật.
- Không gọi chatbot/LLM hay API bên ngoài.
- Điểm phù hợp dùng quy tắc cố định trong `app.js`.
- Form đề xuất chỉ tồn tại trong bộ nhớ của phiên trình duyệt.
- Nếu không tải được `mock-data.json`, giao diện dùng bốn đề tài fallback để flow vẫn bấm được đến cuối.
