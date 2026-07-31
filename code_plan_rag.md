# 🔧 Code Plan — Citation-First Tutor (Phân công lại)

## Phân công trách nhiệm Code & Artifacts

| Thành viên | Trách nhiệm chính trong Codebase / Artifacts |
|---|---|
| **Kiên** | **Frontend**: Dựng UI HTML (`index.html`), CSS (`style.css`), JS client-side (`app.js`), tích hợp ô bôi đen text, ô gõ câu hỏi, hiển thị thẻ citation & nút feedback |
| **Quang** | **Prompt Engineering**: Viết & tinh chỉnh `system_prompt_v1.txt`, `system_prompt_v2.txt`, thiết kế luật bắt buộc AI cite nguồn `[Txx-NNN]` hoặc từ chối khi không có căn cứ |
| **Quân** | **Backend RAG & Mining**: Viết script mining evidence (`analyze_chatlog.py`), script chunking transcript (`loader.py`), module tìm kiếm (`retriever.py`), backend API FastAPI (`app.py`), tích hợp LLM API call & log trace (`logs/trace.jsonl`) |
| **Linh** | **Eval & Spec**: Xây dựng Golden Set (`eval/golden_set.md`), viết script/bảng đánh giá lượt 1 & 2 (`run_01.md`, `run_02.md`), hoàn thiện Spec.md §1-§4 |

---

## Kiến trúc hệ thống & Luồng công việc giữa 4 người

```
 ┌───────────────────────────────────────────────────────────┐
 │                   KIÊN (Frontend - UI)                    │
 │                                                           │
 │  static/index.html + static/app.js                        │
 │  - Hiển thị bài giảng (Transcript)                        │
 │  - Bắt sự kiện bôi đen text                               │
 │  - Gửi request POST /api/ask  ─────────────────────┐      │
 └────────────────────────────────────────────────────│──────┘
                                                      │
 ┌────────────────────────────────────────────────────│──────┐
 │                   QUÂN (Backend RAG)               │      │
 │                                                    │      │
 │  app.py + rag/retriever.py + rag/loader.py         │      │
 │  - Nhận request từ Kiên ◄──────────────────────────┘      │
 │  - Loader & Retriever: Tìm top 3-5 đoạn [Txx-NNN]        │
 │  - Ghép Prompt của Quang + Chunks tìm được                │
 │  - Gọi Gemini LLM API (AI THẬT)                           │
 │  - Trả kết quả JSON cho Kiên & Ghi log trace.jsonl        │
 └─────────────────────────┬─────────────────────────────────┘
                           │
 ┌─────────────────────────▼─────────────────────────────────┐
 │                   QUANG (Prompt Eng)                      │
 │                                                           │
 │  prompts/system_prompt_v1.txt / v2.txt                    │
 │  - Đưa ra quy tắc nghiêm ngặt: Prompt grounding vào data  │
 │  - Ép AI trả về đúng định dạng [trang N] / [Txx-NNN]      │
 └─────────────────────────┬─────────────────────────────────┘
                           │
 ┌─────────────────────────▼─────────────────────────────────┐
 │                   LINH (Golden Set & Eval)                │
 │                                                           │
 │  eval/golden_set.md + eval/run_01.md / run_02.md          │
 │  - Chạy 20+ test cases qua hệ thống                       │
 │  - Báo lỗi cho Quang (chỉnh Prompt) & Quân (chỉnh RAG)    │
 └───────────────────────────────────────────────────────────┘
```

---

## Chi tiết công việc theo từng File

### 1. KIÊN — Frontend Development (`static/`)

#### `static/index.html`
- Layout 2 cột: Cột trái xem bài giảng (Transcript), cột phải chat với AI Tutor.
- Thiết kế rõ ràng khu vực hiển thị đoạn text được chọn, ô nhập câu hỏi, nút "Hỏi AI Tutor".
- Thêm thẻ hiển thị Citation `[trang N]` hoặc `[Txx-NNN]` tách biệt với nội dung câu trả lời.
- Thêm nút feedback 👍 / 👎 (mô phỏng nguyên tắc HAX G15).

#### `static/app.js`
- Bắt sự kiện `mouseup` trên vùng transcript để lấy đoạn text người dùng bôi đen.
- Xử lý nút bấm "Hỏi AI Tutor":
  - **Mốc CP2**: Trả về dữ liệu mock đính kèm citation giả `[trang 45, đoạn T01-023]` để thông flow.
  - **Mốc CP3**: Fetch dữ liệu thật từ Backend của Quân:
    ```javascript
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: questionText, selected_text: selectedText })
    });
    ```
- Render câu trả lời và làm nổi bật các thẻ trích dẫn nguồn.

---

### 2. QUANG — Prompt Engineering (`prompts/`)

#### `prompts/system_prompt_v1.txt`
Viết system prompt chính xác phục vụ tính năng Citation-First:
- **Ràng buộc Grounding**: Chỉ sử dụng thông tin trong context được cung cấp. Nếu không tìm thấy, bắt buộc trả lời: *"Nội dung này không có trong tài liệu buổi học hiện tại."*
- **Ràng buộc Định dạng Trích dẫn**: Mọi ý trả lời phải kết thúc bằng mã đoạn dạng `[Txx-NNN]` hoặc số trang `[trang N]`.
- **Xử lý 4 lớp chỗ khó**:
  - Lớp ① (Không có căn cứ): Không bịa, từ chối rõ ràng.
  - Lớp ② (Mơ hồ): Hỏi lại 1 câu ngắn để làm rõ.
  - Lớp ③ (Ngoài phạm vi): Từ chối lịch sự nếu học viên đòi làm hộ bài tập hoặc viết code ngoài phạm vi.
  - Lớp ④ (Domain AI): Đảm bảo giải thích khái niệm chuẩn xác.

#### `prompts/system_prompt_v2.txt` (Dành cho lượt sửa CP3/CP4)
- Tiếp nhận phản hồi từ file `eval/run_01.md` của Linh.
- Điều chỉnh prompt để khắc phục các case bị trượt (ví dụ: AI vẫn đưa thông tin chung chung khi thiếu nguồn).

---

### 3. QUÂN — Evidence Mining & Backend RAG (`app.py`, `rag/`)

#### `scratch/analyze_chatlog.py`
- Chạy script mining dữ liệu từ `chat_history_anonymized_for_hackathon.csv`.
- Xuất số liệu: 46.2% không có citation, 22.9% bị thất bại hoàn toàn, so sánh tỉ lệ Up/Down vote giữa có và không có citation.

#### `rag/loader.py`
- Đọc file `transcript-01-clean.md` và `transcript-04-clean.md`.
- Sử dụng Regex bóc tách các đoạn có mã `[Txx-NNN]`, tạo file `data/chunks.json`.

#### `rag/retriever.py`
- Xây dựng lớp `SimpleRetriever`: Tìm kiếm từ khóa (Keyword match) giữa đoạn học viên bôi đen + câu hỏi với kho dữ liệu `chunks.json`.
- Trả về Top 3-5 chunks phù hợp nhất kèm mã `[Txx-NNN]`.

#### `app.py` (FastAPI Server)
- Tạo API endpoint `POST /api/ask`.
- Nối Retriever (của Quân) + Prompt (của Quang) + LLM Call (Gemini API thật).
- Tạo file log trace `codebase/logs/trace.jsonl` lưu vết từng request (phục vụ chấm bài R5).

---

### 4. LINH — Golden Set, Evaluation & Spec (`eval/`, `spec.md`)

#### `eval/golden_set.md`
- Xây dựng bộ test case gồm ≥20 câu hỏi:
  - 8-10 case thường (Happy path)
  - 2+ case Lớp ① (Hỏi nội dung không có trong bài giảng)
  - 2+ case Lớp ② (Hỏi mơ hồ: "giải thích cái này")
  - 2+ case Lớp ③ (Hỏi ngoài phạm vi: "viết code Python cho tôi")
  - 2+ case Lớp ④ (Khái niệm domain dễ nhầm lẫn)
  - 10+ case trích từ chatlog thật của khóa học.

#### `eval/run_01.md` & `eval/run_02.md`
- Đóng vai trò kiểm thử viên: Chạy bộ Golden set trực tiếp trên giao diện của Kiên / API của Quân.
- Đánh giá theo 3 chiều chất lượng (Đúng-có-căn-cứ, Có-citation, An-toàn).
- Tính % đạt đối chiếu với Quality Bar và gửi feedback lỗi cho Quang và Quân sửa.

#### `spec.md` (§1 - §4)
- Viết chi tiết §1 (User & Job, Pain Point, Evidence số liệu từ Quân).
- Viết §2 (Bảng Impact ≥3 ứng viên), §3 (Giải pháp tương tự), §4 (Lát cắt 1 câu, Non-goals, Automation Level & HAX/PAIR principles).

---

## Tiến độ bàn giao Code & Artifacts theo Checkpoint

| Checkpoint | Kiên (Frontend) | Quang (Prompt) | Quân (Backend RAG) | Linh (Eval & Spec) |
|---|---|---|---|---|
| **CP1** (15:00 N1) | Tạo repo, dựng layout HTML sơ bộ | Tổng hợp pattern lỗi từ chatlog | Chạy script mining evidence | Viết Canvas 7 dòng & Spec §1-§2 |
| **CP2** (17:00 N1) | Hoàn thành Flow UI mock (HTML/CSS/JS) | Viết `system_prompt_v1.txt` | Hoàn thành `loader.py` & `chunks.json` | Phác thảo Golden Set 10 case & Spec §3-§4 |
| **CP3** (10:30 N2) | Nối `app.js` với API Backend | Tối ưu prompt sang `v2` dựa trên lỗi eval | Tích hợp FastAPI + Retriever + Gemini API | Chạy Golden Set lượt 1 & 2 (`run_01.md`, `run_02.md`) |
| **CP4** (12:00 N2) | Polish UI/UX, thêm HAX G2/G15 | Chốt Prompt bản final | Clean code, kiểm tra `logs/trace.jsonl` | Chốt Quality Bar & hoàn thiện Spec.md |
