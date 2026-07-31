# VLearn Active Recall — chạy prototype

## Chạy lần đầu

1. **API key**: copy `server/.env.example` → `server/.env`, dán Gemini API key vào (lấy tại aistudio.google.com/apikey). File `.env` đã bị `.gitignore` chặn, không commit.
2. **Cài dependency**:
   ```
   cd codebase/server && npm install
   cd codebase/scripts && npm install
   ```
3. **Tạo ảnh slide gốc** (bắt buộc — không commit sẵn trong repo vì đây là bản chụp lại `data/vlearn-pack/slides/*.pdf`, thuộc data pack cần giữ bảo mật theo README gốc):
   ```
   node codebase/scripts/pdf-to-images.mjs
   ```
   Cần có `data/vlearn-pack/slides/d1-slide-hackathon.pdf` và `d2-slide-hackathon.pdf` sẵn cục bộ (data pack cấp riêng cho hackathon, không có trong git).
4. **Chạy server**: `node codebase/server/server.js` rồi mở `http://localhost:3000/index.html`.

## Phần nào là AI thật, phần nào mock

- **Thật**: `POST /api/generate-quiz` (`codebase/server/server.js`) gọi Gemini (`gemini-flash-latest`) sinh 3-5 câu trắc nghiệm theo từng "phần kiến thức", chấm điểm dựa trên đáp án + feedback do chính AI trả về (không hard-code câu hỏi/đáp án).
- **Mock**: khung "🤖 Trợ lý AI VLearn" (nút "Hỏi AI") hiện đang so khớp từ khoá cục bộ trên `d1Slides`/`d2Slides`, không gọi API — xem comment trong `index.html` khu vực `AI CHAT`.
- Vẽ tay / highlight / nút chuyển TA là UI thuần, không có AI.

## Kiến trúc

- `index.html` — giao diện, hiển thị ảnh slide gốc (`assets/{d1,d2}/page-NNN.png`) + quiz theo từng section, khoá section sau cho đến khi qua quiz phần trước (≥60% đúng).
- `server/` — Express proxy giữ API key phía server, `server/data/knowledge.js` chứa tóm tắt text của từng slide (không hiện ra UI) dùng làm ngữ cảnh chấm/sinh quiz.
- `scripts/pdf-to-images.mjs` — công cụ build-time, không chạy lúc runtime.
