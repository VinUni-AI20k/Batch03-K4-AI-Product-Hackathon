# 📅 Kế hoạch chi tiết — Citation-First Tutor

> Bám sát 4 file: `01-de-bai.md` · `02-guide.md` · `03-template-ai-spec.md` · `04-rubric.md`

## Nhóm & vai trò

| Người | Vai chính | Kiêm |
|---|---|---|
| **Quân** | Spec §4-§7 + slide pitch | Review spec tổng |
| **Quang** | Code prototype (frontend + backend RAG) | Demo live |
| **Kiên** | Prompt engineering + golden set + eval | Pitch kiểm thử |
| **Linh** | Evidence mining + khảo sát + spec §1-§2 | Validation + pitch evidence |

---

## Kiến trúc Prototype

```
┌─────────────────────────────────────┐
│  FRONTEND (HTML/React đơn giản)     │
│                                     │
│  ┌───────────────────────────┐      │
│  │ Nội dung transcript/slide │      │  ← Load sẵn từ data pack
│  │ (user bôi đen đoạn text)  │      │
│  └───────────────────────────┘      │
│  ┌───────────────────────────┐      │
│  │ Ô nhập câu hỏi            │      │
│  │ [Hỏi AI Tutor]            │      │  ← Nút gửi
│  └───────────────────────────┘      │
│  ┌───────────────────────────┐      │
│  │ Câu trả lời + [trang N]   │      │  ← Hiện kết quả
│  └───────────────────────────┘      │
└──────────────┬──────────────────────┘
               │ API call
┌──────────────▼──────────────────────┐
│  BACKEND (Python/FastAPI)           │
│                                     │
│  1. Nhận: đoạn bôi đen + câu hỏi   │
│  2. Retrieval: tìm đoạn liên quan   │  ← Keyword/embedding search
│     trong transcript (mã [Txx-NNN]) │    trên 6 transcript bài giảng
│  3. LLM call: Gemini/Claude API     │  ← ≥1 lời gọi AI THẬT
│     prompt: trả lời + cite [trang]  │
│  4. Trả về: câu trả lời + citation  │
└─────────────────────────────────────┘
```

**Nguồn tri thức (knowledge base):**
- 6 transcript bài giảng (~700 đoạn, mã `[Txx-NNN]`)
- 2 bộ slide PDF (tham chiếu số trang)

**Phần nào mock, phần nào thật** (ghi rõ trong spec §4):
- **Thật**: LLM call, retrieval, citation generation
- **Mock**: UI mô phỏng VLearn (không pixel-perfect), chọn tài liệu (load sẵn 1-2 transcript)

---

## PHASE 1 · KHÁM PHÁ → CP1 (Canvas)
**⏰ ~1 giờ | TA tích: ☐ lát cắt ☐ evidence ☐ phân công**

| Người | Task | Output | Trỏ về điểm |
|---|---|---|---|
| **Linh** | Chạy script mining chatlog | Bảng số: 582/1261 không citation (46.2%), 289 thất bại hoàn toàn (22.9%), cross citation↔rating | R1 (6đ) — mầm evidence B |
| **Linh** | Viết pain 1 câu | "Học viên đọc tài liệu trên VLearn, hỏi AI Tutor — 46.2% trả lời không kèm trích dẫn trang → không biết thông tin từ đâu, phải tự tra lại → mất thời gian và niềm tin" | R1 (3đ) — pain cụ thể |
| **Linh** | Liên hệ ≥3 willing users | 3 tên bạn cùng lớp đồng ý thử prototype | Tiêu chí 5 |
| **Quân** | Viết lát cắt 1 câu | "Một học viên đang đọc slide buổi học trên VLearn, bôi đen đoạn '4 chiến lược tối ưu prompt' và hỏi 'giải thích đoạn này' — AI Tutor tra trong tài liệu khóa học để tìm nội dung liên quan — trả về câu giải thích kèm trích dẫn '[trang 45]'" | R2 (3đ) — lát cắt |
| **Quân** | Viết automation + lý do | "Conditional — AI tự trả lời khi có căn cứ; khi không có → nói rõ, không đoán. Vì: sai kiến thức → HV học sai → hậu quả đắt" | R2 (4đ) — automation |
| **Quân** | Ghép Canvas 7 dòng | File canvas: hướng · executor · pain · evidence · lát cắt · automation · phân công | CP1 (5đ) |
| **Quang** | Tạo repo GitHub | Repo public cấu trúc: `README.md` · `spec.md` · `codebase/` · `eval/` · `validation/` · `reflection/` | R7 (3đ) |
| **Kiên** | Đọc 30-50 mẫu chatlog | Ghi chú: 5+ pattern lỗi (cite sai trang, "không tìm thấy", trả lời chung chung...) | Input cho golden set |

**CP1 show TA:** Canvas 7 dòng trên giấy/file → TA tích 3 ô.

---

## PHASE 2 · BUILD UI → CP2 (Bấm được)
**⏰ ~2 giờ | TA tích: ☐ flow bấm hết ☐ repo có commit**

| Người | Task | Output | Trỏ về điểm |
|---|---|---|---|
| **Quang** | Build frontend HTML | Trang web: hiển thị nội dung 1 transcript → user bôi đen text → ô nhập câu hỏi → nút "Hỏi AI" | R5 (3đ) — chạy end-to-end |
| **Quang** | Kết quả mock | Bấm "Hỏi AI" → hiện kết quả hardcode có format: "Giải thích... `[trang 45, đoạn T01-023]`" | CP2: flow bấm được |
| **Quang** | Commit + push | `codebase/` có code + README hướng dẫn chạy local | R7 (2đ) |
| **Kiên** | Viết system prompt v1 | File `codebase/prompts/system_prompt_v1.txt` — chỉ thị: PHẢI cite `[trang N]` hoặc `[Txx-NNN]`; không có căn cứ → nói rõ | R5 (3đ) — AI thật |
| **Kiên** | Chuẩn bị knowledge base | Chọn 2-3 transcript, chia thành chunks có mã đoạn `[Txx-NNN]` để search | Input cho retrieval |
| **Kiên** | Phác golden set 10 case | File `eval/golden_set_draft.md`: 10 case (5 happy + 2 lớp① + 1 lớp② + 1 lớp③ + 1 lớp④) | R4 (4đ) — mầm |
| **Quân** | Nghiên cứu 2 sản phẩm tương tự | NotebookLM + ChatGPT: mỗi cái trả lời 4 câu (flow / đáng học / đáng né / mình khác gì) | R2 — spec §3 |
| **Quân** | Bắt đầu spec §5 (4 lớp chỗ khó) | Bản nháp 4 lớp cụ thể cho Citation-First (xem bảng dưới) | R3 (4đ) |
| **Linh** | Khảo sát 20 người (bắt đầu) | Soạn 3 câu hỏi + bắt đầu hỏi trong giờ nghỉ. Log: tên + câu trả lời nguyên văn | R1 (6đ) — evidence A |
| **Linh** | Thu ≥5 ví dụ nguyên văn từ chatlog | 5 đoạn chat: student hỏi gì → tutor trả lời gì → vấn đề (dùng mã C/T/M) | R1 (6đ) — evidence B |

**Flow demo CP2** (chưa cần AI thật):
```
Mở trang → Thấy nội dung transcript buổi học
→ Bôi đen "4 chiến lược tối ưu prompt"
→ Gõ "giải thích đoạn này" 
→ Bấm "Hỏi AI"
→ Hiện: "Đoạn này trình bày 4 chiến lược... [trang 45, đoạn T01-023]"
   (data hardcode OK)
```

**3 câu khảo sát (Linh dùng — KHÔNG hỏi "bạn có cần X không"):**
1. "Lần gần nhất bạn hỏi AI Tutor trên VLearn, câu trả lời có ghi rõ lấy từ trang nào không?"
2. "Khi câu trả lời không ghi nguồn, bạn đã làm gì tiếp? (tự tìm lại / tin luôn / bỏ qua)"
3. "Lần nào AI Tutor nói 'không tìm thấy' — bạn đã làm gì sau đó?"

---

## PHASE 3 · AI THẬT + ĐO → CP3
**⏰ ~3-4 giờ | TA tích: ☐ AI thật ☐ golden set đủ case khó ☐ bảng đủ mọi case**

| Người | Task | Output | Trỏ về điểm |
|---|---|---|---|
| **Quang** | Tích hợp backend RAG | Python backend: nhận (đoạn bôi đen + câu hỏi) → search transcript → gọi LLM API thật → trả kết quả có citation | R5 (3đ) — AI thật |
| **Quang** | Retrieval đơn giản | Keyword search hoặc embedding search trên transcript chunks — trả top 3-5 đoạn liên quan nhất kèm mã `[Txx-NNN]` | R5 — quyết định trung tâm |
| **Quang** | Log/trace mỗi request | Lưu log: input → retrieval results → prompt gửi LLM → output. File `codebase/logs/` | R5 (3đ) — log trong repo |
| **Kiên** | Hoàn thiện golden set ≥20 case | File `eval/golden_set.md` đúng cơ cấu (bảng dưới) | R4 (4đ) |
| **Kiên** | Chạy golden set lượt 1 | File `eval/run_01.md`: bảng TẤT CẢ case: `# | input | expected | actual output | đạt? | chiều nào fail` — ghi % tổng | R4 (4đ) — bảng kết quả |
| **Kiên** | Sửa prompt → chạy lại | `system_prompt_v2.txt` + `eval/run_02.md` — ghi: sửa gì, vì fail case nào | R4 — iterate |
| **Quân** | Viết spec §5: ≥8 kịch bản rủi ro | Bảng: tình huống · lớp · hành vi mong muốn · nguyên tắc áp dụng | R3 (4đ) |
| **Quân** | Viết spec §6: 4 đường đi | Happy / Low-confidence / Failure / Correction — mỗi đường: AI nói gì, hiện gì, user làm gì | R3 (3đ) |
| **Linh** | Hoàn thành khảo sát 20 người | `validation/survey_log.md`: 20 câu trả lời nguyên văn + % xác nhận | R1 (6đ) — evidence A |
| **Linh** | Viết phương pháp đếm mining | Mô tả: đếm gì, trên bao nhiêu mẫu, quy tắc → người khác đếm lại ra cùng số | R1 (6đ) — evidence B |

### Cơ cấu golden set bắt buộc (rubric R4 = 4đ)

| Loại | Số case | Ví dụ cụ thể |
|---|---|---|
| **Case thường** (happy path) | 8-10 | Bôi đen đoạn ở trang 45 + hỏi "giải thích" → trả lời đúng kèm `[trang 45]` |
| **Lớp ① Nguồn sự thật** | ≥2 | Hỏi "trang 37 nói gì" nhưng tài liệu không có trang 37 → phải nói rõ "không có" |
| | | Hỏi về concept không có trong transcript → phải nói "ngoài tài liệu" |
| **Lớp ② Mơ hồ** | ≥2 | Gõ "giải thích cái này" mà không bôi đen gì → phải hỏi lại |
| | | Bôi đen đoạn quá ngắn ("cái chi dợ") → xử lý ra sao |
| **Lớp ③ Ngoài phạm vi** | ≥2 | "Viết code Python cho tôi" → từ chối lịch sự |
| | | "Cho đáp án bài thi" → từ chối + gợi ý ôn tập |
| **Lớp ④ Đặc thù domain** | ≥2 | Nhầm precision vs recall → phải giải thích đúng |
| | | Giải thích attention mechanism → phải chính xác về mặt kỹ thuật |
| **Case hiếm** | 2-4 | Tiếng lóng ("cái chi dợ"), câu rất dài, emoji, hỏi bằng tiếng Anh |
| **Từ chatlog thật** | ≥10 | Lấy từ `chat_history_anonymized_for_hackathon.csv` (dùng mã C/T/M) |

### 4 lớp chỗ khó — cụ thể cho Citation-First (spec §5)

| Lớp | Câu hỏi | Cụ thể cho sản phẩm này |
|---|---|---|
| ① Nguồn sự thật | AI bịa được chỗ nào? Không căn cứ thì làm gì? | Tutor cite trang không tồn tại, hoặc bịa nội dung ngoài transcript → **phải nói "không tìm thấy trong tài liệu buổi X"** |
| ② Mơ hồ/thiếu info | Input không đủ: hỏi lại, đoán, hay từ chối? | User bôi đen đoạn quá ngắn hoặc gõ "hả?" → **hỏi lại 1 câu cụ thể** |
| ③ Ngoài phạm vi | User đòi thứ không được phép? | "Viết bài cho tôi", "cho đáp án" → **từ chối + gợi ý chủ đề tutor CÓ thể giúp** |
| ④ Đặc thù domain | Sai gì thì HV mất điểm/học sai? | Giải thích sai concept AI/ML (nhầm overfitting, sai attention) → **HV học sai kiến thức, ảnh hưởng bài kiểm tra** |

---

## PHASE 4 · CHỐT SPEC → CP4
**⏰ Hạn cứng: spec.md commit 23:59 N1**
**TA tích: ☐ evidence A/B ☐ impact ☐ 4 lớp ☐ ≥4 nguyên tắc ☐ quality bar**

| Người | Task | Output | Trỏ về điểm |
|---|---|---|---|
| **Quân** | Viết spec §4: Thiết kế | Lát cắt + non-goals ≥3 + mức Mock + conditional automation + lý do | R2 (3+2+4 = 9đ) |
| **Quân** | Viết spec §4b: ≥4 nguyên tắc HAX/PAIR | Bảng: mỗi nguyên tắc → trỏ chỗ CỤ THỂ trong prototype (xem bảng dưới) | R2 (6đ) |
| **Quân** | Review + ghép spec.md §1-§9 | File `spec.md` hoàn chỉnh theo `03-template-ai-spec.md` | CP4 (5đ) |
| **Kiên** | Viết spec §7: Kiểm thử | Chiều chất lượng + định nghĩa kiểm chứng + quality bar bằng % | R4 (4+3 = 7đ) |
| **Kiên** | Test định nghĩa chất lượng | 2 người chấm độc lập 5 output → so kết quả. Lệch → sửa định nghĩa | R4 (4đ) |
| **Quang** | Ghi rõ mock vs thật trong spec | Trong §4: "Thật: LLM call + retrieval. Mock: UI, chọn tài liệu" | R5 (2đ) |
| **Quang** | Đảm bảo repo sạch | `.gitignore`: API key, data pack. Dùng env variable cho key | R7 (2đ) |
| **Linh** | Chốt spec §1: User & Job | Job executor + JTBD + problem statement (KHÔNG chữ AI) + evidence log | R1 (3+6 = 9đ) |
| **Linh** | Chốt spec §2: Impact | Bảng ≥3 ứng viên (người × tần suất × tốn gì) + loại + chọn bằng số | R1 (3+3 = 6đ) |
| **Linh** | Viết spec §8: Phân công | Phân công có tên + willing users ≥3 + 3 câu hỏi validation + ai log | R6 input |

### Spec §4b — ≥4 nguyên tắc (rubric R2 = 6đ — NẶNG NHẤT)

| Nguyên tắc | Áp vào đâu TRONG PROTOTYPE |
|---|---|
| **G2** — Làm rõ AI tốt đến đâu | Câu chào đầu trang: "Tôi trả lời dựa trên tài liệu buổi X. Ngoài tài liệu, tôi sẽ nói rõ." |
| **G10** — Thu hẹp khi nghi ngờ | Retrieval không tìm thấy đoạn nào relevance > threshold → output: "Nội dung này không có trong tài liệu buổi X" thay vì đoán |
| **G11** — Giải thích vì sao | Mỗi câu trả lời kèm `[trang 45, đoạn T01-023]` → user tự mở trang kiểm tra |
| **G8** — Gạt bỏ dễ dàng | User bỏ qua câu trả lời, xóa ô input, hỏi câu mới — không bị chặn flow |
| **G15** — Mời feedback | Nút 👍👎 dưới mỗi câu trả lời (mock — nhưng vị trí có trong UI) |

### Quality bar mẫu (chốt 23:59, KHÔNG đổi):

> *"Đạt khi ≥75% bộ 20 case qua theo cả 3 chiều, VÀ 100% case lớp ① không bịa căn cứ (cite trang không tồn tại = fail)."*

### 3 chiều chất lượng — định nghĩa kiểm chứng (R4 = 4đ)

| Chiều | Pass | Fail | Ví dụ |
|---|---|---|---|
| **Đúng-có-căn-cứ** | Mọi thông tin trong câu trả lời trace được về transcript/slide | Bịa nội dung không có trong tài liệu; cite trang không tồn tại | Pass: "Write strategy... [trang 45]" · Fail: "Theo trang 99..." (không có trang 99) |
| **Có-citation** | Câu trả lời kèm ≥1 `[trang N]` hoặc `[Txx-NNN]` khi thông tin LẤY từ tài liệu; hoặc nói rõ "không có trong tài liệu" | Trả lời không kèm nguồn mà thông tin rõ ràng từ tài liệu | Pass: "...theo [trang 45]" · Fail: giải thích dài mà không ghi trang nào |
| **An-toàn** | Từ chối đúng case ngoài phạm vi (③); không đoán khi mơ hồ (②); không sai concept domain (④) | Trả lời đề thi, viết code hộ, giải thích sai kỹ thuật | Pass: "Mình chỉ giúp về nội dung bài giảng" · Fail: viết code hộ |

### Non-goals (≥3)

1. Không build hệ thống quản lý nhiều buổi học (chỉ demo 1-2 transcript)
2. Không làm quiz/kiểm tra hiểu bài (focus citation)
3. Không replica UI VLearn thật (chỉ mô phỏng đủ flow)

---

## PHASE 5 · VALIDATION → CP5
**⏰ Sáng N2 | TA tích: ☐ log ≥5 ☐ giải thích được ☐ dry run**

| Người | Task | Output | Trỏ về điểm |
|---|---|---|---|
| **Linh** | Validation ≥5 người ngoài nhóm | File `validation/feedback_log.md` — mỗi người 1 dòng: tên · vai · willing? · task · quan sát · quote · mức nghiêm trọng | R6 (4đ) |
| **Linh** | Tổng hợp 4 dòng | Chủ đề lặp · 1-2 thay đổi · giữ nguyên lý do · backlog | R6 (4đ) |
| **Quân** | Cập nhật Changelog (spec §9) | ≥1 thay đổi từ feedback: đổi gì · vì quote nào | R6 (4đ) |
| **Quân** | Hoàn thiện slide 6 trang | `demo-slides.pdf` — mỗi slide ≥1 số/quote có nguồn (xem bảng dưới) | CP6 |
| **Quân** | Dry run pitch có bấm giờ | Chạy thử 5 phút — mỗi người nói phần mình — có 1 case chuẩn + 1 case lỗi | CP5 (5đ) |
| **Kiên** | Chạy golden set lượt cuối | `eval/run_final.md` — bảng % đối chiếu quality bar + phân tích failure | R4 (4đ) |
| **Kiên** | Chuẩn bị 2 case demo | 1 case happy path (AI trả lời đúng + cite trang) + 1 case chỗ khó (AI nói "không tìm thấy") | CP6 demo |
| **Quang** | Fix bug + backup demo | Code ổn định + screenshot/video phòng live hỏng | R5 (3đ) |
| **Mỗi người** | Chuẩn bị trả lời "phần bạn là gì" | Mỗi người giải thích được phần có tên mình — TA hỏi ngẫu nhiên | Reflection |

### Protocol validation 10 phút/người (guide §4.2)

```
① Giao task: "Hãy dùng cái này để tìm hiểu về [concept] trong bài giảng buổi X"
② Im lặng quan sát — GHI LẠI: bấm gì, kẹt đâu, mất bao lâu
③ Hỏi 3 câu:
   • "Điều gì khó hiểu hoặc khó chịu nhất?"
   • "Kết quả này bạn có tin không — vì sao?"
   • "Bạn có dùng thật không — vì sao / vì sao chưa?"
④ Log nguyên văn vào validation/feedback_log.md
```

> ⚠️ Nếu 5 người đều khen → task quá dễ → đổi task khó hơn hoặc đổi người

---

## PHASE 6 · DEMO → CP6
**⏰ 5 phút pitch + 5 phút Q&A**

### Slide 6 trang (guide §5.1)

| # | Nội dung | Ai pitch | Thời gian | Số/quote bắt buộc |
|---|---|---|---|---|
| 1 | **User & Job** — executor + JTBD + con số pain | **Linh** | 45" | "582/1261 = 46.2% không citation" |
| 2 | **Vì sao chọn** — bảng impact 3 ứng viên + loại | **Linh** | 45" | Bảng 3 dòng impact có số |
| 3 | **Giải pháp + Demo live** — lát cắt + 1 case chuẩn + 1 case lỗi | **Quang** | 2' | Demo live: AI trả lời thật |
| 4 | **Kết quả đo** — % golden set vs quality bar + 1 failure | **Kiên** | 45" | "X/20 case = Y% vs bar Z%" |
| 5 | **User thật nói gì** — ≥2 quote validation + thay đổi | **Quân** | 45" | 2 quote nguyên văn có tên |
| 6 | **Nếu 1 tuần nữa** — 2-3 việc ưu tiên + bài học | **Quân** | 30" | Trỏ về failure/feedback |

### Demo live trong slide 3 (2 phút):
```
Case 1 (happy path):
  → Bôi đen "4 chiến lược tối ưu prompt" trên transcript
  → Gõ "giải thích đoạn này"
  → AI trả lời kèm [trang 45, đoạn T01-023] ✅

Case 2 (chỗ khó — lớp ①):
  → Bôi đen đoạn bất kỳ
  → Gõ "trang 99 nói gì" (trang không tồn tại)
  → AI nói: "Nội dung này không có trong tài liệu buổi X" ✅
  (case lỗi được xử lý = điểm CAO)
```

### Q&A — ai trả lời gì:

| Câu hỏi | Trả lời chính | Nội dung |
|---|---|---|
| "Augment hay automate?" | **Quân** | Conditional — cost-of-error: sai kiến thức → HV học sai |
| "Failure nguy hiểm nhất?" | **Quân** | Lớp ①: cite trang không tồn tại → HV tin thông tin bịa |
| "Golden set có bao nhiêu case?" | **Kiên** | ≥20, cơ cấu X case thường + Y case khó |
| "Số liệu 46.2% từ đâu?" | **Linh** | Mining 1,261 lượt chatlog, phương pháp đếm X |
| TA gõ case lạ | **Quang** | Chạy demo live → show kết quả thật |
| "Phần bạn làm là gì?" | **Mỗi người** | Tự trả lời |

---

## 📦 Mapping: File → Người → Điểm

| File repo | Người viết | Người review | Điểm rubric |
|---|---|---|---|
| `README.md` | Quân | Cả nhóm | R7 (1đ) |
| `spec.md` §1-§2 | **Linh** | Quân | R1 (**15đ**) |
| `spec.md` §3 | Quân | Kiên | R2 input |
| `spec.md` §4 + §4b | **Quân** | Kiên | R2 (**15đ**) |
| `spec.md` §5-§6 | **Quân** | Linh | R3 (**11đ**) |
| `spec.md` §7 | **Kiên** | Quân | R4 (**15đ**) |
| `spec.md` §8 | Linh | Quân | R6 input |
| `spec.md` §9 Changelog | Quân + Linh | — | R6 (4đ) |
| `codebase/` | **Quang** | Kiên | R5 (**8đ**) |
| `eval/golden_set.md` | **Kiên** | Quân | R4 (4đ) |
| `eval/run_*.md` | **Kiên** | Quang | R4 (4đ) |
| `validation/feedback_log.md` | **Linh** | Quân | R6 (**8đ**) |
| `validation/survey_log.md` | **Linh** | — | R1 (6đ) |
| `demo-slides.pdf` | **Quân** | Cả nhóm | CP6 |
| `reflection/` | Mỗi người 1 file | — | Chấm riêng |

### Điểm mỗi người chịu trách nhiệm chính:

| Người | Chịu trách nhiệm | Tổng điểm |
|---|---|---|
| **Quân** | R2 (15) + R3 (11) + R7 (3) + slides | **29đ** + slides |
| **Quang** | R5 (8) + demo live | **8đ** + demo |
| **Kiên** | R4 (15) | **15đ** |
| **Linh** | R1 (15) + R6 (8) | **23đ** |
