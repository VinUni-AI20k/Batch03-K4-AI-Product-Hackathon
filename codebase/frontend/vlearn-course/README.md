# VLearn Course Gateway

Trang tĩnh mô phỏng cổng khóa học VLearn cho COMP2010. Visual của trang này chủ ý giữ theo VLearn (navy/red, course accordion), không dùng style Duolingo của `warmup-ai`.

## Chạy local

Từ root repo:

```bash
python3 -m http.server 8765
```

Mở `http://localhost:8765/` hoặc `http://localhost:8765/codebase/frontend/vlearn-course/`.
Chạy từ root giúp liên kết sang warm-up, quiz, PDF và transcript hoạt động đúng.

## Luồng

- Click một Day để mở các hành động.
- Day01 → **Chuẩn bị trước buổi học** dẫn tới `../warmup-ai/index.html`.
- **Đọc slide** sổ ngăn tài liệu bên dưới; PDF/transcript trỏ tới file hiện có trong `data/vlearn-pack/`.
- Day01 → **Kiểm tra sau bài** dẫn tới phần tự đánh giá và quiz tại `../quizzcuoi/index.html`.

Day02–Day06 giữ cùng cấu trúc và hiển thị trạng thái đang biên soạn cho các hoạt động chưa có nội dung.
