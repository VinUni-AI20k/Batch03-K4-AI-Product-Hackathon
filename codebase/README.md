# VLearn AI Tutor — Frontend prototype

Giao diện React + TypeScript cho trải nghiệm học trực tiếp từ slide. Prototype ưu tiên màn hình laptop, có responsive cho tablet/mobile và mô phỏng đầy đủ flow upload → đọc slide → hỏi AI → kiểm tra citation → đánh giá câu trả lời.

## Chạy dự án

Yêu cầu Node.js 22.13 trở lên.

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

Kiểm tra production:

```bash
npm run build
npm run lint
```

## Phần đang dùng mock

- Nội dung 5 trang của bài giảng mẫu chỉ xuất hiện trước lần upload đầu tiên.
- Upload PDF/PPTX kiểm tra định dạng, kích thước và mô phỏng độ trễ; file chỉ được giữ trong bộ nhớ trình duyệt, chưa lưu lên server.
- PDF thật được render bằng PDF.js từ object URL và đọc đúng tổng số trang.
- PPTX được giữ trong danh sách nhưng chưa có dịch vụ chuyển đổi sang PDF.
- Câu trả lời AI, citation, confidence score và hai lựa chọn hỏi lại G10.
- Lưu phản hồi 👍/👎 và nội dung góp ý trong state của phiên hiện tại.
- Lịch sử tài liệu upload không tồn tại sau khi tải lại trang.

Các API mock được gom trong `app/services/mockApi.ts` để có thể thay bằng API thật mà không đổi contract của component.
