# VLearn prototype — quiz + hỏi bài bằng LangGraph

## Chạy local

Tại thư mục gốc repo:

```bash
uv sync
uv run python codebase/api_server.py
```

Mở `http://127.0.0.1:8000`.

Để bật AI thật, điền **key mới** vào `.env` (không commit file này):

```dotenv
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.6-luna
```

## Hai flow trong demo

1. **Hỏi bài học:** chọn Day03/04/05 ở panel VLearn Tutor, nhập câu hỏi hoặc chọn câu gợi ý.
2. **Quiz củng cố:** bấm “Bắt đầu quiz củng cố”, làm 15 câu và nhận practice credit mock nếu đạt
   từ 12/15.

## LangGraph agent

`lesson_agent.py` xây graph tường minh:

```text
START → model → (tools → model)* → END
```

Model được phép gọi ba tool trong `slide_store.py`:

- `list_lessons`: xem bài học nào có trong `slide/`.
- `search_slide_pages`: xếp hạng các trang PDF liên quan bằng BM25 cục bộ.
- `read_slide_pages`: đọc tối đa 6 trang đã tìm thấy.

Prompt bắt buộc agent phải search trước, chỉ trả lời từ tool output và trích dẫn
`[ten-file.pdf, tr. N]`. Mỗi lượt hỏi lưu trace vào `eval/traces/qa-*.json` (chỉ
lưu câu hỏi, tool call, câu trả lời và citation; không lưu API key).

Quiz dùng graph riêng trong `quiz_agent.py`:

```text
retrieve_transcript → generate_quiz → validate_quiz → retry (nếu cần)
```

Nguồn sự thật của Quiz là các đoạn `T03-024` đến `T03-038` trong transcript, không
phải PDF slide. Agent chỉ hiển thị quiz sau khi kiểm tra có đúng 15 câu, 4 đáp án/câu
và mọi `source_id` đều nằm trong transcript đã truy xuất.

## Nguồn slide

Prototype đọc các file đã chuẩn bị:

| `lesson_id` | File |
|---|---|
| `day03` | `slide/day03-material.pdf` |
| `day04` | `slide/day04-prompt-engineering-tool-calling-v2.pdf` |
| `day05` | `slide/day05-lecture-slides.pdf` |

PDF được đọc lazy khi bài đó được chọn; nội dung không được commit lên trace.
`day3-material.pdf` có một số trang dạng ảnh nên khả năng tìm kiếm text trên
những trang đó hạn chế; đây là giới hạn cần ghi rõ khi demo.

## API nhanh

```text
GET  /api/lessons
POST /api/ask
POST /api/generate-quiz
```

Ví dụ `/api/ask`:

```json
{"lesson_id":"day04","question":"Tool calling giúp agent làm gì?"}
```

Khi thiếu `OPENAI_API_KEY`, endpoint trả lỗi có nhãn rõ ràng; không giả lập câu
trả lời hỏi bài để tránh biến mock thành bằng chứng AI thật.
