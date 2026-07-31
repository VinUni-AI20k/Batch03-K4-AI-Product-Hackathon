# Frontend

Mỗi giao diện độc lập nằm trong một thư mục con, dùng tên kebab-case. Hiện có:

- [`warmup-ai/`](./warmup-ai/) — warm-up tương tác cho Bài 1 về AI.
- [`vlearn-course/`](./vlearn-course/) — cổng khóa học VLearn tĩnh, dẫn vào warm-up và tài liệu theo Day.
- [`quizzcuoi/`](./quizzcuoi/) — tự đánh giá và quiz củng cố sau Bài 1, do Giang khởi tạo.

Trước khi sửa hoặc thêm giao diện, đọc [`AGENTS.md`](./AGENTS.md). File này là quy ước chung cho người và coding agent.

## Chạy toàn bộ frontend

Chạy một server duy nhất từ thư mục `codebase/frontend`:

```bash
cd codebase/frontend
python3 -m http.server 4176
```

Sau đó các route chuẩn là:

- VLearn: `http://localhost:4176/vlearn-course/`
- Warm-up: `http://localhost:4176/warmup-ai/`
- Kiểm tra sau bài: `http://localhost:4176/quiz/`

Các màn hình liên kết với nhau bằng đường dẫn tương đối. Không hard-code
`localhost`, port hoặc domain trong source frontend; nhờ vậy cùng một luồng hoạt
động ở local và khi deploy static.
