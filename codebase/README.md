# Prototype — AI Tutor VLearn

Lời gọi AI **thật** đã có ở quyết định trung tâm (CP3) — `src/app/api/tutor/route.ts`. Model tự quyết định phạm vi căn cứ (trang đang mở / cả bộ slide) và có đủ để trả lời hay không, đúng lát cắt trong `spec.md` §4.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

**Cần API key để gọi AI thật** — tạo `.env.local` (đã gitignore, không commit):

```
GEMINI_API_KEY=xxx
```

Không có key thì `/api/tutor` trả lỗi rõ ràng, không hardcode fallback im lặng.

## Flow

1. Mở trang đọc học liệu, chuyển trang bằng thanh điều hướng.
2. Bấm **AI Tutor** để mở panel hỏi đáp.
3. Gõ câu hỏi → gọi `/api/tutor` với `{question, currentPage}`.
4. Model quyết định `scope` (`page`/`deck`/`out_of_scope`) + `sufficient`, trả lời kèm `citations`, hoặc nói rõ thiếu gì ở `missing` — không đòi học viên tự cung cấp lại nội dung.

## Corpus

Trích xuất tĩnh từ 2 bộ slide bản hackathon chính thức trong `data/vlearn-pack/slides/` (không phải bản `day01-slide-blue-v0/v1` cũ — xem `cp1/impact-table.md` giới hạn #8):

```bash
node scripts/extract-pdf.mjs
```

Sinh `src/data/d1-pages.json` + `d2-pages.json`. Route hiện chỉ dùng `d1-pages.json` (deck Day 1) — đúng thiết kế một-deck ban đầu; `d2` sinh sẵn để mở rộng sau, chưa wire vào route.

## Chặn cứng — độc lập với model

`route.ts` có 2 lớp chặn sau khi model trả lời, đảm bảo 2 điều kiện cứng của quality bar (`spec.md` §7) dù model nào trả lời:

- `validateCitations()` — loại trích dẫn không hợp lệ (trang không có text, hoặc lệch trang đang mở khi `scope=page`)
- `stripContentDemand()` — chặn câu trả lời đòi học viên tự cung cấp lại nội dung/tiêu đề slide

## Đo — eval/

```bash
npm run dev              # terminal 1
node ../eval/run.mjs     # terminal 2, chạy từ root repo
```

Golden set 20 case, kết quả từng lượt: `eval/run-*.md`.

## Phần nào thật, phần nào mock

| Phần | Trạng thái |
|---|---|
| UI reader + PDF viewer + panel tutor | thật |
| Quyết định phạm vi + sinh câu trả lời | **thật** — gọi Gemini qua `/api/tutor` |
| Curriculum 5 "ngày" ở sidebar | mock — chỉ Day 1/Day 2 có corpus thật để AI ground vào |
| Mindmap / Flashcard / Ghi chú | mock |
