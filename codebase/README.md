# VLearn Learning Trace — CP2 Prototype

Clickable mock prototype cho tính năng tạo note và bản đồ ôn tập cá nhân sau
mỗi buổi học trên VLearn.

## Chạy local

Yêu cầu Node.js 20.9 trở lên.

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Flow đã triển khai

1. Học viên kết thúc buổi và bấm **Xem Learning Trace**.
2. UI hiển thị trạng thái đang đối chiếu lịch sử hỏi Tutor với học liệu.
3. Chọn **Day01**, **Day02** hoặc **Day03** để xem learning trace của từng
   ngày.
4. Personalized Note phân biệt:
   - chủ đề đã tìm hiểu;
   - gợi ý có thể cần xem lại;
   - nội dung chưa đủ dữ liệu để kết luận.
5. Học viên chuyển sang **Bản đồ kiến thức** của cùng ngày đang chọn.
6. Học viên chọn **Mình đã hiểu** hoặc **Cần xem lại**.
7. Metric, note, mindmap và sidebar phản hồi được cập nhật đồng bộ theo ngày.
8. Citation và lượt hỏi mở được panel căn cứ.

## Phạm vi CP2

- Toàn bộ dữ liệu nằm trong `src/data/mock-learning-trace.ts`.
- Không gọi AI, không có backend/database và không dùng dữ liệu học viên thật.
- Mock data có TypeScript interface để có thể thay bằng output API ở CP3.
- Không sinh quiz, điểm số hay kết luận học viên yếu một chủ đề.

## Kế hoạch CP3

- Thay mock result bằng một AI call có structured output.
- Grounding nội dung với slide/transcript chính thức.
- Kiểm tra citation và lưu trace của lần chạy.
- Chạy golden set và ghi nhận kết quả đầy đủ.

## Kiểm tra

```bash
npm run lint
npm run build
```
