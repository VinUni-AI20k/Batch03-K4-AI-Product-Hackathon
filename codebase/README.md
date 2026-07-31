# codebase/ — CRVLearn prototype

Mở `index.html` bằng trình duyệt (không cần server, không cần build, không cần deploy).

## CP2 · Show được thứ bấm được

> Checklist theo `04-rubric.md` — mốc hỗ trợ kỹ thuật, TA xác nhận 2 điều: flow chính bấm hết được, và repo có commit.

- [x] Flow chính bấm đi hết được: sidebar chọn tài liệu (Day 1 / Day 2 — file PDF thật) → slide bấm bôi đen → Hỏi AI → 4 tab (Chat / Context / Luồng / Eval) đều thao tác được, không cần API key.
- [x] Repo có commit đầu của prototype (`codebase/`).
- Chưa cần AI thật ở mốc này — lời gọi AI thật (`callGemini`/`callClaude`) đã có sẵn trong code, bật ở CP3 khi cắm key.

## Tài liệu: THẬT — không còn dùng mock data

Trước đây `codebase/` dùng `mock-doc.js` (nội dung tự soạn). File đó **đã bị xoá**. Giờ tutor trả lời dựa trên `codebase/doc-data.js` — trích xuất thật từ 2 file trong `data/vlearn-pack/slides/`:

| Tài liệu | Nội dung | Trang có dữ liệu |
|---|---|---|
| `d1-slide-hackathon.pdf` | AI IN ACTION — Day 1: AI & LLM Foundation | 29 |
| `d2-slide-hackathon.pdf` | AI IN ACTION — Day 2: Xác định bài toán cho AI | 29 |

**Cách trích xuất:** `pdftotext -enc UTF-8` (không dùng `-layout`, vì `-layout` làm vỡ dấu tiếng Việt do font nhúng trong PDF) → tách theo trang (`\f`) → lọc watermark trang trí "AI IN ACTION - HACKATHON" chồng chữ theo chiều dọc → sinh keyword từ tiêu đề + nội dung mỗi trang.

**Giới hạn đã biết (không che giấu):** watermark trong PDF gốc chạy dọc theo lề và chồng lên chữ thật theo từng ký tự, nên một số trang còn sót vài chữ cái lẻ (VD "H", "AT", "N") xen giữa câu — dấu vết OCR/trích xuất tự nhiên, không ảnh hưởng ý nghĩa nội dung. Đây là đánh đổi hợp lý cho mốc prototype thay vì viết pipeline OCR layout-aware phức tạp.

## Mức prototype khai báo: **Mock retrieval, Real document**

| Thành phần | Thật / Mock | Ghi chú |
|---|---|---|
| Nội dung tài liệu (`doc-data.js`) | **THẬT** | Trích từ `data/vlearn-pack/slides/*.pdf` bằng `pdftotext`, không tự soạn |
| Sinh câu trả lời của tutor | **AI THẬT** (khi có key) | 1 lời gọi LLM mỗi engine mỗi lượt; chưa có key thì fallback trích thẳng đoạn tài liệu vừa retrieve được, không phải câu chung chung |
| Query rewriting (giải nghĩa "nó", "ý trên") | **AI THẬT** (khi có key) / heuristic JS khi mô phỏng | Chỉ chạy khi phát hiện tham chiếu ngầm |
| Sliding window 6–8 lượt hai chiều | **THẬT** (logic code) | `buildV2()` trong `index.html` |
| Baseline "mất prompt history" | **THẬT** (logic code) | `buildBaseline()` — dựng lại đúng lỗi kiến trúc quan sát được |
| Retrieval đoạn tài liệu | **MOCK** | keyword match trên `CORPUS()`, **không phải** vector search/embedding thật |
| Confidence score % | **MOCK** | suy ra từ kết quả chấm, không phải logprob của model |
| Ước lượng token | **MOCK** | `len/4`; token thật lấy từ `usage` của API và hiển thị riêng |

## Chạy AI thật

Tab **⚙️** → chọn provider → dán key → **Lưu** → **Test 1 lời gọi**.

- **Google AI Studio (Gemini)** — free tier, lấy key ở `aistudio.google.com/apikey`. Model mặc định `gemini-3-flash`; nếu API trả 404 thì đổi model ID trong cùng ô đó.
- **Anthropic (Claude)** — model mặc định `claude-opus-5`. Gọi trực tiếp từ trình duyệt qua header `anthropic-dangerous-direct-browser-access`.

Key chỉ nằm trong `localStorage`, **không** ghi vào repo. Nút **Xoá key khỏi máy** để dọn sau demo.

> Free tier của Google AI Studio có thể dùng dữ liệu để huấn luyện → chỉ gửi nội dung slide thật (đã public trong data pack) hoặc hội thoại mô phỏng, không gửi dữ liệu thật của người thật.

## Cách demo 5 phút

1. Tab **⚙️**: dán key, Test → thấy `✅ OK`.
2. Tab **Eval**: bấm preset **G-01** (`LLM là gì?` → `câu ở trên tôi hỏi là gì` — Day 1, trang 10).
   Engine để mặc định **⚖️ Chạy cả hai (A/B)** → mỗi lượt ra hai bong bóng cạnh nhau.
   → Baseline tái hiện đúng câu thú nhận trong screenshot gốc; v2 nhắc lại được `llm`.
3. Tab **Context** — phần chứng minh: dòng **"Prompt của học viên trong payload"** là `1` ở khối Baseline và `2+` ở khối v2. Kéo xuống xem `messages[]` thật của cả hai — nội dung tài liệu chèn vào là trích PDF thật, không phải văn bản tự soạn.
4. Tab **Luồng**: workflow diagram, node đỏ là chỗ vỡ, node xanh là 2 bước thêm vào.
5. Bấm preset **G-04** (`Automation và Augmentation khác nhau thế nào?` → `vậy nên chọn cái nào cho việc phân loại đơn hàng tự động?` — Day 2, trang 17) → xem dòng **🔁 Query viết lại** ở bong bóng v2.
6. Tab **Eval** → **⬇ Xuất Markdown cho eval/** → commit file đó vào `eval/`.

Case chỗ khó nên demo live (đừng giấu): **G-05** — học viên đòi viết hộ nguyên một Problem Card cho startup của mình. v2 có memory nhưng vẫn phải từ chối làm hộ; nếu nó làm hộ thì đó là failure lớp ③ (ngoài phạm vi) và cần nói thẳng ở slide CP.

## Tiêu chí chấm tự động

Một tiêu chí duy nhất, kiểm chứng được bằng chuỗi nên người ngoài nhóm chấm lại ra cùng kết quả:

> **ĐẠT** khi câu trả lời nhắc lại được đúng chủ thể/khái niệm (`probe`) từ prompt trước của học viên, **và** không chứa câu thú nhận mất lịch sử (danh sách `DENY` trong code).

Mọi lượt đều vào log, kể cả lượt v2 **KHÔNG ĐẠT** — số liệu không chỉnh sửa.

## Bản đồ code (cho vibe-coding rule ở CP5)

| Vị trí | Việc |
|---|---|
| `doc-data.js` | Nội dung THẬT trích từ 2 file PDF (`window.DOC_META`, `window.DOC_CORPUS`) |
| `CORPUS()` | Lọc `DOC_CORPUS` theo tài liệu đang mở (`S.doc`) — `index.html` |
| `PRESETS` | Golden set luồng follow-up, dựa trên nội dung thật |
| `buildBaseline()` | Dựng payload thiếu prompt history — **chỗ vỡ** |
| `buildV2()` | Rewrite + sliding window — **giải pháp** |
| `retrieve()` / `findEntryForPage()` | Keyword match (mock) trên corpus thật |
| `renderSlide()` / `setDoc()` | Render slide + chuyển tài liệu Day 1 ↔ Day 2 |
| `grade()` | Chấm tự động |
| `callGemini()` / `callClaude()` / `callMock()` | 3 provider |
| `send()` | Luồng một lượt: build → gọi → chấm → log |
| `exportMd()` | Xuất bảng kết quả cho `eval/` |
