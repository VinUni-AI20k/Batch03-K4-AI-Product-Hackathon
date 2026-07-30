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

- Danh sách bài giảng ban đầu và nội dung 5 slide mẫu.
- Upload PDF/PPTX: kiểm tra định dạng, kích thước và mô phỏng độ trễ; chưa lưu file lên server.
- Số trang của file PDF mới được gán giả là 12; PPTX hiển thị trạng thái chuyển đổi.
- Câu trả lời AI, citation, confidence score và hai lựa chọn hỏi lại G10.
- Lưu phản hồi 👍/👎 và nội dung góp ý trong state của phiên hiện tại.
- Viewer hiển thị layout slide mô phỏng; chưa tích hợp PDF.js hoặc dịch vụ render PowerPoint.

Các API mock được gom trong `app/services/mockApi.ts` để có thể thay bằng API thật mà không đổi contract của component.
