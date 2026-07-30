# Backend — Self Study Buddy

FastAPI tối giản, đúng 1 endpoint chạy AI thật: sinh MCQ từ transcript thật (quyết định trung tâm
cho CP3). Extract outline hiện là rule-based/parsing, chưa gọi AI — xem `docs/product-overview.md`
mục 6 để biết phần nào thật/mock.

**Lưu ý 2 LLM client riêng biệt, không dùng chung:**
- `app/core/llm_client_openai.py` — OpenAI, dùng cho `pipeline/quiz_bank.py` (Đạt, quyết định trung tâm).
- `app/core/llm_client.py` — Gemini, dùng cho `pipeline/classify.py` (Mai Anh, phân loại transcript).

Mỗi pipeline tự quản key riêng trong `.env` (`OPENAI_API_KEY` / `GOOGLE_API_KEY`), không phụ thuộc nhau.

## Setup lần đầu

```bash
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt      # Windows
# .venv/bin/pip install -r requirements.txt        # macOS/Linux
cp .env.example .env                               # rồi điền OPENAI_API_KEY thật vào .env
```

`.env` đã nằm trong `.gitignore` — không commit key thật.

## Chạy

```bash
.venv/Scripts/python -m uvicorn app.main:app --port 8000 --host 127.0.0.1
```

Frontend (`frontend/`, chạy ở `localhost:5173`) đã cấu hình gọi thẳng `http://127.0.0.1:8000` —
CORS đã mở sẵn cho origin đó trong `app/main.py`.

## Endpoints

- `GET /api/health` — kiểm tra server sống
- `GET /api/outline?transcript_file=transcript-01-clean.md` — outline parse từ transcript thật
- `POST /api/quiz/generate?transcript_file=...&n_questions=20` — **quyết định AI trung tâm**, gọi
  OpenAI thật, trả về `{outline, questions}`

## Golden set / eval

Xem `eval/golden_set.md` ở thư mục gốc repo — chạy `eval/run_golden_set.py` để tái tạo
`eval/results-round1.md`.
