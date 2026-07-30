# codebase/ — CRVLearn prototype

Mở `index.html` bằng trình duyệt (không cần server, không cần build, không cần deploy).

## CP2 · Show được thứ bấm được

> Checklist theo `04-rubric.md` — mốc hỗ trợ kỹ thuật, TA xác nhận 2 điều: flow chính bấm hết được, và repo có commit.

- [x] Flow chính bấm đi hết được: sidebar chọn tài liệu → slide bấm bôi đen → Hỏi AI → 4 tab (Chat / Context / Luồng / Eval) đều thao tác được, chạy trên data giả (`mock-doc.js`), không cần API key.
- [x] Repo có commit đầu của prototype (`codebase/`).
- Chưa cần AI thật ở mốc này — lời gọi AI thật (`callGemini`/`callClaude`) đã có sẵn trong code, bật ở CP3 khi cắm key.

## Mức prototype khai báo: **Mock**

Flow bấm được end-to-end với data giả, **AI thật ở quyết định trung tâm**.

| Thành phần | Thật / Mock | Ghi chú |
|---|---|---|
| Sinh câu trả lời của tutor | **AI THẬT** | 1 lời gọi LLM mỗi engine mỗi lượt |
| Query rewriting (giải nghĩa "nó", "ý trên") | **AI THẬT** | 1 lời gọi LLM riêng, chỉ chạy khi phát hiện tham chiếu ngầm |
| Sliding window 6–8 lượt hai chiều | **THẬT** (logic code) | `buildV2()` trong `index.html` |
| Baseline "mất prompt history" | **THẬT** (logic code) | `buildBaseline()` — dựng lại đúng lỗi kiến trúc quan sát được |
| Retrieval đoạn tài liệu | **MOCK** | keyword match trên `CORPUS`, không phải vector search |
| `CORPUS` nội dung slide | **MOCK** | 8 đoạn rút gọn từ slide Day05 + transcript trong data pack |
| Confidence score % | **MOCK** | suy ra từ kết quả chấm, không phải logprob của model |
| Ước lượng token | **MOCK** | `len/4`; token thật lấy từ `usage` của API và hiển thị riêng |
| Sidebar Day01–Day04, note count, nút Bút / Báo bối rối | **MOCK UI** | chỉ để giống luồng thật của VLearn |

## Chạy AI thật

Tab **⚙️** → chọn provider → dán key → **Lưu** → **Test 1 lời gọi**.

- **Google AI Studio (Gemini)** — free tier, lấy key ở `aistudio.google.com/apikey`. Model mặc định `gemini-3-flash`; nếu API trả 404 thì đổi model ID trong cùng ô đó.
- **Anthropic (Claude)** — model mặc định `claude-opus-5`. Gọi trực tiếp từ trình duyệt qua header `anthropic-dangerous-direct-browser-access`.

Key chỉ nằm trong `localStorage`, **không** ghi vào repo. Nút **Xoá key khỏi máy** để dọn sau demo.

> Free tier của Google AI Studio có thể dùng dữ liệu để huấn luyện → chỉ gửi nội dung slide/hội thoại trong file này hoặc data pack, không gửi dữ liệu thật của người thật.

## Cách demo 5 phút

1. Tab **⚙️**: dán key, Test → thấy `✅ OK`.
2. Tab **Eval**: bấm preset **G-03** (`lstm là gì` → `câu ở trên tôi hỏi là gì`).
   Engine để mặc định **⚖️ Chạy cả hai (A/B)** → mỗi lượt ra hai bong bóng cạnh nhau.
   → Baseline tái hiện đúng câu thú nhận trong screenshot; v2 nhắc lại được `lstm`.
3. Tab **Context** — phần chứng minh: dòng **"Prompt của học viên trong payload"** là `1` ở khối Baseline và `2+` ở khối v2. Kéo xuống xem `messages[]` thật của cả hai.
4. Tab **Luồng**: workflow diagram, node đỏ là chỗ vỡ, node xanh là 2 bước thêm vào.
5. Bấm preset **G-01** (`vậy nó khác gì…`) → xem dòng **🔁 Query viết lại** ở bong bóng v2: chứng minh Query Rewriting chạy thật.
6. Tab **Eval** → **⬇ Xuất Markdown cho eval/** → commit file đó vào `eval/`.

Case chỗ khó nên demo live (đừng giấu): **G-05** — học viên đòi làm hộ Lab 5. v2 có memory nhưng vẫn phải từ chối; nếu nó làm hộ thì đó là failure lớp ③ và cần nói thẳng ở slide 4.

## Tiêu chí chấm tự động

Một tiêu chí duy nhất, kiểm chứng được bằng chuỗi nên người ngoài nhóm chấm lại ra cùng kết quả:

> **ĐẠT** khi câu trả lời nhắc lại được đúng chủ thể/khái niệm (`probe`) từ prompt trước của học viên, **và** không chứa câu thú nhận mất lịch sử (danh sách `DENY` trong code).

Mọi lượt đều vào log, kể cả lượt v2 **KHÔNG ĐẠT** — số liệu không chỉnh sửa.

## Bản đồ code (cho vibe-coding rule ở CP5)

Mọi thứ trong `index.html`, tìm theo tên hàm:

| Vị trí | Việc |
|---|---|
| `CORPUS` | 8 đoạn tài liệu mock |
| `PRESETS` | golden set luồng follow-up |
| `buildBaseline()` | dựng payload thiếu prompt history — **chỗ vỡ** |
| `buildV2()` | rewrite + sliding window — **giải pháp** |
| `retrieve()` | keyword match (mock) |
| `grade()` | chấm tự động |
| `callGemini()` / `callClaude()` / `callMock()` | 3 provider |
| `send()` | luồng một lượt: build → gọi → chấm → log |
| `exportMd()` | xuất bảng kết quả cho `eval/` |
