# Prototype CP2 — AI Tutor VLearn

Đây là bản Sketch/Mock cho checkpoint **CP2 · Bấm được**. Mục tiêu là chứng minh luồng chính có thể thao tác từ đầu đến cuối; phản hồi tutor hiện dùng dữ liệu giả và chưa gọi AI thật.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Flow demo CP2

1. Mở trang đọc học liệu và chuyển trang bằng thanh điều hướng.
2. Bấm **AI Tutor** để mở panel hỏi đáp.
3. Chọn hoặc gõ câu hỏi rồi bấm nút gửi.
4. Quan sát đủ ba nhánh phản hồi mock:
   - câu hỏi về trang đang xem → badge phạm vi trang + trích dẫn;
   - câu hỏi về toàn bộ bài → badge cả bộ slide + trích dẫn;
   - câu hỏi xin đáp án bài tập → từ chối vì ngoài phạm vi.
5. Chuyển qua các tab **Sơ đồ**, **Flashcard**, **Ghi chú**; ghi chú mới có thể nhập và thêm ngay trên giao diện.

## Phạm vi mock

- Học liệu và danh sách buổi học là dữ liệu mẫu.
- Nội dung slide được dựng trực tiếp trên giao diện.
- Câu trả lời tutor được chọn bằng từ khóa trong `src/components/ReaderTabs.tsx`.
- Không cần API key ở CP2. Điểm cắm AI thật sẽ thay hàm xử lý mock ở CP3.
