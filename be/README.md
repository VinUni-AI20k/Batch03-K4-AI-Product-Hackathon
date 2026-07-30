# VLearn backend

FastAPI backend cho trợ giảng có căn cứ từ slide. Code được chia theo trách
nhiệm: HTTP API, application services, agent orchestration, tools, retrieval và
các provider có thể thay thế.

## Chạy local

```powershell
cd be
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Kiểm tra:

- `GET http://localhost:8000/api/v1/health`
- `GET http://localhost:8000/api/course/info`
- `POST http://localhost:8000/api/v1/chat`
- OpenAPI: `http://localhost:8000/docs`

Chat endpoint hiện trả `not_configured` cho đến khi pipeline ingest và provider
LLM được nối. Đây là fallback có chủ đích để hệ thống không trả lời khi chưa có
nguồn.

## Chạy test

```powershell
cd be
python -m unittest discover -s tests -p "test_*.py"
```
