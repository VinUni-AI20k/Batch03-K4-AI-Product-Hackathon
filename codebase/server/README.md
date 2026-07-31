# VLearn Tutor+ — backend nhỏ

Giữ OpenAI API key ở server (biến môi trường) thay vì để lộ trong trình duyệt.
Server này cũng phục vụ luôn file tĩnh trong `codebase/prototype/` — chỉ cần chạy
1 tiến trình duy nhất.

## Chạy

```bash
cd codebase/server
npm install
cp .env.example .env
# mở .env, dán OPENAI_API_KEY thật vào (KHÔNG commit file .env)
npm start
```

Mở `http://localhost:3000` (không mở `index.html` trực tiếp bằng file:// nữa —
lúc đó `fetch('/api/summarize')` sẽ không có server để gọi tới).

## Kiểm tra nhanh

```bash
curl http://localhost:3000/api/health
```

Trả về `{"ok":true,"hasKey":true,"model":"gpt-4o-mini"}` nếu `.env` đã đúng.

## An toàn

- `.env` đã nằm trong `.gitignore` gốc (`*.env`) — không commit được kể cả lỡ tay.
- Key chỉ tồn tại trong biến môi trường của tiến trình Node, không bao giờ được
  gửi xuống browser — client chỉ gọi `POST /api/summarize` trên cùng origin.
- Nếu bạn từng dán key thật vào chat/Slack/bất kỳ đâu ngoài `.env`, coi như key
  đó đã lộ — revoke và tạo key mới trước khi dùng.
