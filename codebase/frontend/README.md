# Frontend

Mỗi giao diện độc lập nằm trong một thư mục con, dùng tên kebab-case. Hiện có:

- [`warmup-ai/`](./warmup-ai/) — warm-up tương tác cho Bài 1 về AI.
- [`vlearn-course/`](./vlearn-course/) — cổng khóa học VLearn tĩnh, dẫn vào warm-up và tài liệu theo Day.
- [`quizzcuoi/`](./quizzcuoi/) — tự đánh giá và quiz củng cố sau Bài 1, do Giang khởi tạo.

Trước khi sửa hoặc thêm giao diện, đọc [`AGENTS.md`](./AGENTS.md). File này là quy ước chung cho người và coding agent.

## Chạy toàn bộ frontend

Chạy server từ **root của repository**, không chạy riêng trong từng thư mục UI:

```bash
python3 -m http.server 8765
```

Sau đó chỉ cần mở:

- Cửa vào duy nhất: `http://localhost:8765/`
- VLearn: `http://localhost:8765/codebase/frontend/vlearn-course/`
- Warm-up: `http://localhost:8765/codebase/frontend/warmup-ai/`
- Kiểm tra sau bài: `http://localhost:8765/codebase/frontend/quizzcuoi/`

Các màn hình liên kết với nhau bằng đường dẫn tương đối. Không hard-code
`localhost`, port hoặc domain trong source frontend; nhờ vậy cùng một luồng hoạt
động ở local và khi deploy static.
