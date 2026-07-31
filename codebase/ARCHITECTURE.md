# Kiến trúc — PDF Tutor

> Upload PDF → bôi đen đoạn text hoặc cắt một vùng trên trang → hỏi AI tutor.
> AI **chỉ được trả lời bằng nội dung trong đúng file PDF đó**. Kèm tính năng sinh quiz trắc nghiệm 4 đáp án.

Quy mô: ~3.100 dòng (13 module Python + 12 file frontend).

---

## 1. Tech stack

| Lớp | Công nghệ | Lý do chọn |
|---|---|---|
| AI | Gemini Flash qua `google-genai` | structured output (`response_schema`) → backend không bao giờ phải parse văn xuôi |
| Backend | FastAPI + Swagger UI | tự sinh docs tại `/docs`, pydantic validate sẵn |
| PDF (server) | `pypdf` | thuần Python, tách text theo từng trang |
| Retrieval | BM25 tự viết | **không cần vector DB**, chạy tiếng Việt không cần tokenizer model |
| Frontend | React 19 + Vite + `pdfjs-dist` | pdf.js cho text layer thật → bôi đen là selection gốc của browser |
| CSS | thuần, biến CSS | không framework, palette xanh/trắng tối giản |

Model mặc định đặt trong `GEMINI_MODEL`. Lưu ý: `gemini-2.5-flash` bị API trả `404 NOT_FOUND` với key mới ("no longer available to new users"), nên default là model Flash hiện hành.

---

## 2. Cấu trúc thư mục

```
codebase/
├── backend/
│   ├── main.py            # khởi tạo FastAPI, CORS, gắn router, metadata Swagger
│   ├── config.py          # đọc .env, mọi hằng số cấu hình
│   ├── schemas.py         # pydantic model request/response → sinh ra Swagger
│   ├── store.py           # lưu document (đĩa) + chat session (RAM)
│   ├── pdf_utils.py       # tách PDF thành 1 chunk text / 1 trang
│   ├── retrieval.py       # BM25 trên các chunk trang
│   ├── grounding.py       # chọn trang đưa vào prompt + XÁC MINH trích dẫn
│   ├── prompts.py         # system instruction (ràng buộc grounding nằm ở đây)
│   ├── gemini.py          # gọi model, structured output, retry
│   └── routers/
│       ├── documents.py   # upload, list, xoá, phục vụ file PDF gốc
│       ├── chat.py        # session + hỏi đáp có grounding
│       └── quiz.py        # sinh quiz + lọc câu không bám tài liệu
└── frontend/src/
    ├── App.tsx            # state gốc: document đang mở, trang, khay đính kèm
    ├── api.ts             # client gọi REST
    ├── types.ts           # type dùng chung
    └── components/
        ├── Sidebar.tsx    # upload (drag & drop) + danh sách tài liệu
        ├── PdfViewer.tsx  # khung cuộn, toolbar, đồng bộ scroll ↔ số trang
        ├── PdfPage.tsx    # render 1 trang: canvas + text layer + lớp crop
        ├── ChatPanel.tsx  # hội thoại, khay đính kèm, nút thử lại
        ├── QuizPanel.tsx  # tạo quiz, chấm điểm, xem nguồn
        ├── Markdown.tsx   # renderer markdown tối giản (không dựng HTML tuỳ ý)
        └── Icon.tsx       # bộ icon SVG inline
```

---

## 3. Cơ chế grounding — phần lõi của sản phẩm

Đây là điểm khác biệt chính. **Chỉ prompt là không đủ** — model vẫn bịa. Nên ràng buộc được ép ở 3 tầng:

### Tầng 1 — Giới hạn nguồn (trước khi gọi model)
`grounding.select_pages()` quyết định model được nhìn thấy những trang nào:
- Tài liệu nhỏ (≤ `FULL_DOC_CHAR_BUDGET`, mặc định 120k ký tự) → đưa **toàn bộ** tài liệu. Grounding mạnh nhất.
- Tài liệu lớn → BM25 lấy top-K trang, **cộng thêm** trang đang xem, trang bị bôi đen, trang bị crop và các trang liền kề của chúng.

Model không nhận được gì ngoài các khối `<page>` này.

### Tầng 2 — System prompt (`prompts.py`)
Quy định tuyệt đối: không dùng kiến thức ngoài; nếu tài liệu không có thì đặt `grounded = false` và nói thẳng là tài liệu không đề cập, **không được đoán**; mọi luận điểm phải kèm **trích dẫn nguyên văn 5–25 từ** copy đúng từng ký tự từ trang đó.

### Tầng 3 — Xác minh sau khi sinh (`grounding.quote_is_grounded()`)
Đây là tầng quan trọng nhất vì nó **không tin lời model**:
- Mọi câu trích dẫn được đối chiếu ngược lại với text của đúng trang mà model khai.
- So khớp gần đúng (`difflib`, ngưỡng 0.82) vì pypdf hay chèn khoảng trắng thừa — bản model chép lại sẽ lệch nhẹ.
- Trích dẫn trỏ vào trang **chưa từng được đưa vào context** → loại bỏ ngay (bịa rõ ràng).
- Trích dẫn không khớp → gắn cờ `verified: false`, UI hiện màu cảnh báo.
- Với quiz: câu hỏi có `evidence_quote` không tìm thấy trên trang đã khai thì **bị loại hẳn**, trả về trong trường `dropped`.

Kết quả đo được: trích dẫn nguyên văn ✓ đạt, bản chép sai khoảng trắng ✓ vẫn đạt, còn câu bịa / trích sai trang / câu dịch lại đều ✗ bị chặn.

---

## 4. Luồng dữ liệu

### Upload
```
Browser ──PDF──▶ POST /api/documents
                      │
                      ├─ lưu source.pdf vào storage/{doc_id}/
                      ├─ pypdf tách text từng trang → pages.json
                      └─ phát hiện file scan (gần như không có text)
                           → cảnh báo: chỉ dùng được bằng screenshot
```

### Hỏi đáp
```
Browser: câu hỏi + N đoạn bôi đen + M ảnh crop
   │
   ▼ POST /api/chat/sessions/{id}/ask
select_pages()  → chọn trang được phép nhìn
build_context() → dựng khối <page>
build_focus_block() → LẶP LẠI toàn văn trang bị crop (xem §5)
   │
   ▼ gemini.ask()  — mỗi ảnh gắn nhãn "Crop i — cắt từ trang P"
Gemini trả JSON có schema: {answer, grounded, citations[], suggested_followups[]}
   │
   ▼ xác minh từng citation ngược lại text trang
Browser: câu trả lời + chip trích dẫn (bấm vào là nhảy tới trang)
```

Session lưu lịch sử hội thoại, `MAX_HISTORY_TURNS` lượt gần nhất được gửi lại → hỏi nối tiếp ("cái đó nghĩa là gì?") hoạt động đúng.

### Quiz
```
POST /api/quiz {document_id, num_questions, page_from/to, difficulty}
   │
   ├─ chọn trang trong khoảng, thưa đều nếu vượt budget (quiz trải khắp tài liệu)
   ├─ yêu cầu model sinh dư 2 câu để bù phần bị loại
   └─ lọc: đúng 4 đáp án, không trùng, correct_index hợp lệ,
           trang hợp lệ, evidence_quote xác minh được
```

---

## 5. Xử lý screenshot: crop nhỏ → giải thích cả slide

Người dùng cắt một ô nhỏ thì AI phải hiểu **cả slide** chứ không chỉ mấy pixel được cắt. Ba việc:

1. **Định vị slide** — không cần OCR dò tìm: mỗi `PdfPage` tự biết số trang của mình, frontend gửi kèm. Nhiều crop từ nhiều trang vẫn map đúng.
2. **Khối `<slide_in_focus>`** — lặp lại **toàn văn** trang bị crop thành một khối riêng. Trang đó đã nằm trong context chung, nhưng nhắc lại riêng mới đủ sức kéo model ra khỏi việc chỉ tả vùng ảnh.
3. **Prompt 3 bước** — nhận diện vùng crop → đọc hết trang → giải thích trong tương quan cả slide (crop là 1 ô của bảng thì nói bảng so sánh gì; là 1 bước của pipeline thì nói trước/sau là gì).

---

## 6. API

Swagger UI: `http://localhost:8000/docs`

| Method | Endpoint | Chức năng |
|---|---|---|
| `POST` | `/api/documents` | upload PDF, trả về bản đồ trang |
| `GET` | `/api/documents` | danh sách tài liệu |
| `GET` | `/api/documents/{id}` | chi tiết + bản đồ trang |
| `GET` | `/api/documents/{id}/file` | file PDF gốc (cho pdf.js render) |
| `GET` | `/api/documents/{id}/pages/{n}` | text đã tách của 1 trang |
| `DELETE` | `/api/documents/{id}` | xoá tài liệu + session liên quan |
| `POST` | `/api/chat/sessions` | mở session cho 1 tài liệu |
| `GET` | `/api/chat/sessions/{id}` | toàn bộ hội thoại |
| `POST` | `/api/chat/sessions/{id}/ask` | hỏi (kèm highlight + screenshot) |
| `DELETE` | `/api/chat/sessions/{id}` | xoá session |
| `POST` | `/api/quiz` | sinh quiz trắc nghiệm |
| `GET` | `/api/health` | trạng thái + đã cấu hình key chưa |

Giới hạn mỗi câu hỏi: tối đa 4 screenshot, 10 highlight.

---

## 7. Frontend — cách bôi đen và cắt ảnh hoạt động

**PdfViewer** giữ khung cuộn, toolbar, và đồng bộ hai chiều giữa vị trí cuộn ↔ số trang (bấm chip trích dẫn thì cuộn tới trang đó).

**PdfPage** render từng trang, lazy qua `IntersectionObserver` với biên dựng trước `1200px` — chỉ render trước 1–2 màn hình, không dựng cả file.

- **Bôi đen**: pdf.js dựng *text layer* thật đè lên canvas → bôi đen là selection gốc của browser, không phải mô phỏng. Toạ độ vùng bôi lưu dạng **tỉ lệ phần trăm** của khung trang nên zoom vào/ra vẫn đúng chỗ.
- **Cắt ảnh**: bật chế độ crop → kéo khung → cắt thẳng từ **canvas đã render** → xuất JPEG (giới hạn rộng 1400px) → gửi lên dạng data URL.
- Canvas render ở **độ phân giải thiết bị** (devicePixelRatio) nhưng layout ở kích thước CSS → chữ nét trên màn Retina và ảnh crop không bị mờ.
- Nhiều highlight + nhiều crop dồn vào một **khay đính kèm** phía trên ô nhập, gửi chung trong một câu hỏi.

---

## 8. Chống lỗi

**Retry** (`gemini.py`): tối đa 3 lần gọi, backoff 0.6s → 1.2s kèm jitter. Chỉ retry lỗi **tạm thời** — 429, 5xx, timeout, JSON hỏng/rỗng. Lỗi vĩnh viễn (sai key, sai model, request sai) dừng ngay sau 1 lần thay vì bắt người dùng chờ vô ích. Hết 3 lần thì UI hiện nút **Thử lại**, giữ nguyên câu hỏi và các đoạn đã bôi đen.

**Bốn đường trải nghiệm:**

| Tình huống | Hành vi |
|---|---|
| Happy path | trả lời + chip trích dẫn bấm được, nhảy đúng trang |
| Không có trong tài liệu | `grounded: false`, viền vàng, nói thẳng tài liệu không đề cập |
| Trích dẫn không xác minh được | chip đổi màu cảnh báo, `verified: false` |
| Gọi model thất bại | tự retry 3 lần → nút Thử lại |
| PDF là bản scan | cảnh báo ngay lúc upload, gợi ý dùng chức năng cắt ảnh |

---

## 9. Các quyết định thiết kế đáng lưu ý

**Không dùng vector DB.** Tài liệu hackathon chỉ vài chục đến vài trăm trang. BM25 in-process nhanh hơn, dễ debug hơn, và chạy tiếng Việt không cần tokenizer model. Tránh luôn một service phải vận hành.

**Nếu tài liệu đủ nhỏ thì bỏ qua retrieval, đưa nguyên văn.** Retrieval là thoả hiệp; khi ngân sách context cho phép thì đưa hết cho grounding chính xác nhất.

**Xác minh trích dẫn thay vì tin model.** Model được yêu cầu trích nguyên văn, nhưng ta kiểm tra lại — đây là điểm phân biệt "có vẻ đúng" và "chứng minh được".

**Structured output thay vì parse text.** Dùng `response_schema` nên tầng API không bao giờ phải regex bóc dữ liệu ra khỏi văn xuôi.

**Lưu trữ:** document nằm trên đĩa (sống sót qua restart), BM25 index và session giữ trong RAM — đánh đổi hợp lý cho prototype.

---

## 10. Chạy dự án

```bash
# Backend
cd codebase/backend
pip install -r requirements.txt
cp .env.example .env          # điền GEMINI_API_KEY
uvicorn main:app --reload --port 8000

# Frontend (terminal khác)
cd codebase/frontend
npm install
npm run dev
```

Giao diện `http://localhost:5173` · Swagger `http://localhost:8000/docs`
Vite proxy `/api` sang FastAPI nên browser chỉ thấy một origin.

---

## 11. Giới hạn đã biết

- Session chat lưu trong RAM → restart backend là mất lịch sử (document thì còn).
- PDF scan không có text → chỉ hỏi được qua chức năng cắt ảnh; quiz không tạo được.
- Chưa có xác thực người dùng, chưa phân quyền theo tài liệu.
- Chưa stream câu trả lời (chờ trọn gói mới hiện).
