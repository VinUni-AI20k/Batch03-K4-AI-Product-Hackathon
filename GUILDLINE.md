# Hướng dẫn chạy VLearn Quiz Demo

Tài liệu này dành cho toàn bộ team khi chạy prototype local để demo hoặc phát triển tiếp.

## 1. Chuẩn bị môi trường

Yêu cầu: Python 3.11 hoặc 3.12 và [uv](https://docs.astral.sh/uv/).

Tại thư mục gốc repo, cài toàn bộ dependency:

```bash
uv sync
```

Lệnh này tạo môi trường `.venv/` đồng nhất cho từng thành viên. Không cần tự dùng
`pip install` riêng lẻ.

## 2. Cấu hình OpenAI API key

Copy `.env.example` thành `.env`, sau đó **mở bằng VS Code và điền key mới vào**:

```dotenv
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.6-luna
```

Quy tắc bảo mật:

- Không gửi API key lên chat, Discord, Google Form hoặc screenshot.
- Không commit `.env`; `.gitignore` đã chặn file này.
- Nếu key đã bị lộ, revoke key đó trên OpenAI Platform và tạo key mới.
- Không cần key để xem UI, làm Quiz cuối bài cố định hoặc chạy unit test.
- Key chỉ cần khi dùng **Hỏi bài học** hoặc **Tạo quiz củng cố cá nhân hoá**.

## 3. Chạy ứng dụng

Chạy server của prototype (không dùng `python -m http.server`, vì server tĩnh không có API,
LangGraph hoặc route PDF):

```bash
PORT=8001 uv run python codebase/api_server.py
```

Mở trình duyệt tại:

```text
http://127.0.0.1:8001
```

Nếu cổng 8001 đang được dùng, đổi ví dụ thành `PORT=8002` và mở
`http://127.0.0.1:8002`.

Sau khi team thay HTML/CSS/JS, hard refresh bằng `Ctrl + Shift + R`.

## 4. Nguồn dữ liệu

| Mục đích | Nguồn | Cách dùng |
|---|---|---|
| Trình chiếu | `slide/day03-material.pdf`, `slide/day04-prompt-engineering-tool-calling-v2.pdf`, `slide/day05-lecture-slides.pdf` | Sidebar đổi Day03/04/05 sẽ đổi PDF trong khung giữa. |
| Hỏi bài học | Các PDF trong `slide/` | LangGraph tìm trang PDF liên quan, đọc trang, rồi trả lời kèm số trang. |
| Quiz củng cố | `data/vlearn-pack/transcript/transcript-03-clean.md` | LangGraph truy xuất các đoạn transcript có mã `T03-xxx` trước khi gọi model. |

Không đưa data pack lên repo công khai, mạng xã hội hoặc công cụ bên ngoài không được phép.

## 5. Hai loại Quiz

### Quiz cuối bài đã phát hành

- Hiển thị ở cuối slide và trong sidebar: **Quiz cuối bài đã phát hành**.
- Gồm 15 câu cố định.
- Luồng sản phẩm mong muốn: AI hỗ trợ giảng viên soạn nháp → giảng viên verify → mới release
  cho học viên.
- Trong prototype, đây là **bản demo mô phỏng quy trình GV duyệt**, không khẳng định câu hỏi đã
  được giảng viên thật duyệt.
- Không gọi API khi học viên mở quiz này.

Sau khi nộp, bấm **Phân tích mức độ nắm vững**. Kết quả theo bốn mục đề cương Day03:

1. Phù hợp bài toán & giới hạn LLM.
2. Tool calling & phần xác định.
3. Context & RAG.
4. Thiết kế sản phẩm AI.

Mỗi mục hiển thị `%`, số câu đúng/tổng và trạng thái **Đã nắm tốt** hoặc **Cần củng cố**.
Ngưỡng hiện tại là 70%; đây là tham số demo, cần giảng viên xác nhận trước khi triển khai thật.

### Quiz củng cố cá nhân hoá

- Sau màn phân tích, bấm **Tạo quiz củng cố**.
- Hệ thống tạo 5 câu tập trung vào các mục có tỷ lệ dưới 70%.
- LangGraph chạy flow:

```text
retrieve_transcript → generate_quiz → validate_quiz → retry nếu cần
```

- `validate_quiz` kiểm tra số câu, 4 lựa chọn/câu và `source_id` phải nằm trong transcript đã
  truy xuất.
- Nếu transcript không đủ căn cứ, UI báo rõ lỗi; không thay bằng câu hỏi giả.
- Mỗi AI call lưu trace ở `eval/traces/` và không lưu API key.

## 6. Kịch bản demo 3 phút

1. Chọn **Day03** ở sidebar, cho thấy PDF được hiển thị từ `slide/`.
2. Cuộn tới cuối tài liệu hoặc bấm **Quiz cuối bài đã phát hành** ở sidebar.
3. Làm vài câu trong Quiz cuối bài; có thể dùng bản cố định để không phát sinh API cost.
4. Nộp bài, bấm **Phân tích mức độ nắm vững** và chỉ ra các % theo đề cương.
5. Bấm **Tạo quiz củng cố** để show LangGraph truy xuất transcript, tạo 5 câu theo phần yếu.
6. Mở `eval/traces/` nếu cần chứng minh AI call có trace, nguồn và thời điểm chạy.

## 7. Kiểm thử trước khi demo

```bash
node --check codebase/app.js
uv run python -m unittest discover -s tests -v
```

Không chạy cả golden set nhiều lần nếu không cần thiết vì mỗi lượt sẽ gọi model và phát sinh chi phí.

## 8. Xử lý lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| Slide báo `404 Slide not found` | Kiểm tra đúng ba tên file trong thư mục `slide/`, rồi restart server. |
| Bấm Quiz củng cố báo thiếu key | Kiểm tra `.env` có `OPENAI_API_KEY` mới; restart server sau khi lưu `.env`. |
| Mở `127.0.0.1:8000` nhưng API không chạy | Dùng đúng URL theo biến `PORT`; server tĩnh ở cổng khác không đủ chức năng. |
| Giao diện chưa đổi sau khi sửa | Hard refresh `Ctrl + Shift + R`. |
| Quiz củng cố không được tạo | Xem thông báo lỗi, trace trong `eval/traces/`, và kiểm tra transcript/source ID thay vì tự bịa kết quả. |

## 9. Sơ đồ file cần biết

```text
codebase/
  api_server.py    # HTTP API, phục vụ PDF và gọi hai LangGraph flow
  lesson_agent.py  # agent hỏi slide PDF
  quiz_agent.py    # agent truy xuất transcript, tạo và kiểm tra Quiz
  app.js           # UI Quiz cố định, phân tích và Quiz củng cố
  index.html       # giao diện VLearn
slide/             # PDF dùng để trình chiếu
eval/traces/       # trace AI local, không commit dữ liệu nhạy cảm
tests/             # unit test backend
```
