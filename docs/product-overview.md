# Self Study Buddy — Mô tả sản phẩm

## 1. Tổng quan

Học viên ôn lại kiến thức cuối buổi học bằng cách làm bài trắc nghiệm (MCQ) do AI sinh từ slide + transcript buổi học. AI chẩn đoán phần nào học viên đã vững, phần nào còn yếu, rồi tạo lộ trình ôn tập cá nhân hoá (tóm tắt, ví dụ thực tế, câu hỏi luyện nhanh) cho đúng phần yếu đó. Học viên học xong sẽ được kiểm tra lại; nếu chưa đạt mức hiểu vững, hệ thống lặp lại vòng ôn tập cho đến khi đạt.

## 2. Persona & Job

- **Ai:** học viên đang tự ôn bài ngay sau buổi học, chuẩn bị làm bài tập/project.
- **Đang cố làm gì:** kiểm tra và củng cố lại mức hiểu một khái niệm phức tạp trên slide, dựa vào ngữ cảnh giảng viên đã giảng trên lớp.
- **Cách giải quyết hiện tại:** đọc slide (khô, thiếu ngữ cảnh) hoặc đọc transcript (dài, khó bao quát), hoặc hỏi AI ngoài (dễ sai lệch vì AI không biết nội dung buổi học thật).

## 3. Lát cắt — MỘT CÂU

> Học viên đang ôn lại kiến thức cuối buổi học · muốn tự kiểm tra mức hiểu qua MCQ bám sát nội dung buổi học · **AI sinh bộ câu hỏi trắc nghiệm có gắn nhãn chủ đề (section) + trích dẫn nguồn**, đồng thời chẩn đoán phần yếu và tạo lộ trình ôn tập cá nhân hoá · kết quả là học viên đạt mức hiểu vững (mastery) được xác nhận qua bài kiểm tra lại.

**Quyết định AI trung tâm (ưu tiên làm thật + eval kỹ ở CP3):** sinh bộ MCQ từ outline + transcript, gắn đúng `section_id` — vì sai ở đây gây hậu quả trực tiếp nhất (học sai kiến thức).

## 4. Luồng hoạt động — 4 Phase

### Phase 1 — Knowledge Preparation
```
Giảng viên upload PDF Slides + Transcript
  → AI Classify Transcript theo NGƯỜI NÓI (lời giảng viên / lời học viên)
      — không chỉ tách "giảng dạy vs nhiễu", mà xác định rõ từng đoạn là ai nói
  → AI chuyển PDF slide → text
  → AI tổng hợp slide (đã chuyển text) + transcript (đã lọc lời giảng viên)
      vào MỘT file duy nhất: knowledge.md
      — mỗi đoạn kiến thức giữ lại nguồn: slide trang mấy / transcript đoạn mấy
      — đây là nguồn sự thật (source of truth) duy nhất mà mọi bước sau
        (sinh MCQ, sinh study note, chatbot trả lời) đều phải trích dẫn từ đây
  → AI Extract Outline từ knowledge.md (section_id + key_points)
  → AI Generate Initial Quiz (20 câu MCQ, trải đều theo section)
```

### Phase 2 — Learning Diagnosis
```
User làm Quiz (Q1)
  → Chấm điểm rule-based (G1) — so đáp án đúng/sai theo section
  → AI/rule-based chẩn đoán phần yếu (D1) — tính weak/good sections
  → DEC1: Có cần re-teaching cá nhân hoá không?
      ├─ Có phần yếu → sang Phase 3 (chọn STYLE)
      └─ Không có phần yếu → bỏ qua Phase 3, sang thẳng Phase 4 (Retest xác nhận toàn bộ)
```

### Phase 3 — Adaptive Re-teaching (chỉ chạy khi DEC1 = Có)
```
STYLE: user chọn 1 trong 2 chế độ (không chọn learning style riêng nữa):
  · Quick Learning  — 10-20 phút, bài giảng cô đọng
  · Deep Learning   — 1-2 giờ, bài giảng đầy đủ, đào sâu hơn
  → AI Align phần yếu với knowledge.md (đúng đoạn slide/transcript liên quan)
  → AI Generate bài giảng cá nhân hoá (độ dài/độ sâu theo Quick/Deep đã chọn),
    bám sát đúng phần yếu, có trích dẫn nguồn tới knowledge.md
  → User bấm "Tôi đã học xong" (FINISH)
```

### Phase 4 — Learning Validation
```
AI Generate Retest — MCQ lần này trộn 2 nguồn câu hỏi:
  (a) câu hỏi ưu tiên về phần vừa sai/vừa ôn lại (weak sections)
  (b) câu hỏi về kiến thức KHÁC — chưa từng xuất hiện ở bất kỳ lượt MCQ trước đó
      (coverage tăng dần qua mỗi vòng, không hỏi lặp lại câu đã ra)
  — nếu đến từ DEC1 = Không (không có phần yếu) → chỉ xác nhận toàn bộ, không cần (b)
  → Chấm điểm rule-based (GRADE)
  → DEC2: Đạt mức hiểu vững (Mastery ≥ 80%) chưa?
      ├─ Đạt → Report: so sánh điểm Trước/Sau + danh sách phần đã vững → KẾT THÚC
      └─ Chưa đạt → Review: hiện câu sai kèm đáp án đúng + nguồn trích dẫn
                     → quay lại STYLE (Phase 3), lặp lại với phần vẫn còn yếu
```

Vòng lặp **Review → Style** không giới hạn số lần — học viên tiếp tục ôn và kiểm tra lại đến khi đạt mastery.

### Phase 3b — Q&A theo ngữ cảnh (tính năng phụ, P1 — cắt trước nếu trễ tiến độ)

Trong lúc đọc bài giảng cá nhân hoá (Phase 3), học viên có thể hỏi AI trực tiếp. Đây **không phải quyết định AI trung tâm của CP3** — MCQ generation vẫn là trọng tâm để làm thật + eval. Q&A ghi vào spec như hướng mở rộng, build sau nếu còn thời gian, được phép mock/cắt bỏ mà không ảnh hưởng lát cắt chính.

```
User hỏi 1 câu (vd: "Deep learning là gì?")
  → AI tự đánh giá: knowledge.md có đủ căn cứ để trả lời không?
      ├─ Đủ căn cứ trong knowledge.md
      │     → Trả lời + trích dẫn CHÍNH XÁC theo loại nguồn:
      │         · Từ slide      → "trích slide trang N"
      │         · Từ transcript → "giảng viên giải thích ở đoạn [T-xxx]"
      │           (CHỈ trích lời giảng viên — lời học viên KHÔNG được dùng làm
      │            nguồn kiến thức, vì có thể sai/chưa chuẩn; lời học viên chỉ
      │            dùng để phát hiện struggle ở Phase 2/4, không dùng để trả lời)
      ├─ Không đủ căn cứ, nhưng câu hỏi liên quan chủ đề khoá học
      │     → AI tool-call tra cứu bên ngoài (web search)
      │     → Trả lời + ghi rõ: "nguồn ngoài buổi học — [link]"
      │       + cảnh báo: nội dung này giảng viên CHƯA xác nhận
      └─ Câu hỏi ngoài phạm vi (③ ngoài phạm vi) → từ chối lịch sự,
            gợi ý hỏi TA/giảng viên thay vì đoán
```

Đây là điểm thể hiện rõ nhất 3/4 lớp chỗ khó cùng lúc (①③ và một phần ②) và 2 nguyên tắc HAX: **G10 — thu hẹp phạm vi khi nghi ngờ** (không trả lời liều khi thiếu căn cứ) và **G11 — giải thích vì sao** (luôn gắn nguồn cụ thể theo từng loại). Nên giữ trong spec §4/§5 dù build ở mức Mock.

## 5. Data contracts

```
knowledge.md        → nguồn sự thật duy nhất: slide (đã chuyển text) + transcript
                       (đã lọc lời giảng viên), mỗi đoạn giữ nguồn (trang/đoạn)
outline.json         → [{ section_id, title, key_points[], source_refs[] }]
quiz.json            → [{ q_id, question, options[], correct_index, section_id, asked_in_round }]
weakness.json        → [{ section_id, weak_score, reason }]
lecture.json         → [{ section_id, mode: "quick"|"deep", content_md, cited_refs[] }]
```

Ngưỡng mastery: **≥ 80%** số câu đúng trong bài retest.
`quiz.json.asked_in_round` dùng để đảm bảo Phase 4 không hỏi lặp câu đã ra ở vòng trước, và biết phần kiến thức nào "chưa từng đề cập" để ưu tiên hỏi mới.

## 6. Trạng thái hiện tại — thật vs mock (tính đến thời điểm viết file này)

| Phần | Trạng thái |
|---|---|
| **Sinh MCQ ban đầu (quyết định AI trung tâm)** | ✅ **THẬT** — `backend/app/pipeline/quiz_bank.py` gọi OpenAI (`gpt-4o-mini`) thật, sinh MCQ từ transcript thật, gắn `section_id`+`segment_id` để trích dẫn. Golden set 22 case chạy thật, 22/22 đạt (xem `eval/results-round1.md`) |
| Extract outline từ transcript | ✅ Thật, nhưng **rule-based** (không phải AI) — `backend/app/pipeline/outline.py` parse markdown thật (heading + mã `[Txx-NNN]`), **tự động loại lời học viên** dựa trên tag `[Học viên]:` có sẵn trong data | 
| Classify theo người nói (giảng viên/học viên) | ⚠️ **Rule-based, không phải AI** — dùng tag `[Học viên]:` có sẵn trong transcript đã làm sạch, chưa cần AI phân loại vì data pack đã gắn nhãn. Nếu dữ liệu thật (không có tag sẵn) thì bước này mới cần AI thật |
| Chấm điểm quiz/retest (rule-based) | ✅ Thật — so đáp án đúng, chạy thật trong code |
| Nhánh rẽ DEC1 (bỏ qua re-teach nếu không có phần yếu) | ✅ Thật — logic chạy thật theo kết quả người dùng |
| Nhánh rẽ DEC2 (ngưỡng mastery 80%) + vòng lặp Review→Style | ✅ Thật — chạy thật, không giới hạn số lần lặp |
| Sinh câu hỏi Retest | ⚠️ **Mock** — tái dùng câu hỏi THẬT đã sinh ở round 1 cho đúng section yếu (không bịa câu mới), gắn nhãn "Ôn lại: ...". Phần "sinh câu MỚI chưa từng hỏi" (yêu cầu sản phẩm) vẫn chưa build — cần 1 lời gọi AI riêng |
| Hợp nhất slide + transcript thành `knowledge.md` | ❌ Chưa build — hiện dùng thẳng transcript thật làm nguồn, chưa có bước hợp nhất với slide PDF |
| PDF slide → text | ❌ Chưa build — nút Upload chỉ mock xác nhận file, demo dùng transcript thật bundle sẵn ở backend, chưa đọc nội dung PDF thật |
| STYLE — chọn cách ôn tập | ⚠️ **Đang khác yêu cầu mới nhất** — code hiện tại (`StyleTimeSelect.tsx`) có 3 learning style × 3 mốc thời gian; yêu cầu Quick/Deep 2-lựa-chọn chưa áp vào code |
| Roadmap (Summary/Example/Practice card) | ⚠️ **Đang khác định dạng yêu cầu mới nhất** — hiện hiện 3 mini-card mỗi section (Summary dùng key_points thật, Example là placeholder, Practice tái dùng 1 câu MCQ thật); yêu cầu "một bài giảng liền mạch" theo Quick/Deep chưa áp vào code |
| Q&A + tool-call ngoài (Phase 3b) | ❌ Chưa build — vẫn ở dạng thiết kế trong tài liệu này |

→ **CP3 đã đạt điều kiện tối thiểu**: có ≥1 lời gọi AI thật ở quyết định trung tâm (không hardcode) + golden set ≥20 case (22 case, ≥2/lớp chỗ khó, 14 case từ data thật) + bảng kết quả lượt 1 có % (`eval/results-round1.md`, 22/22 = 100%, có ghi nhận 1 phát hiện thật đáng phân tích dù case vẫn tính đạt — xem file). Việc còn lại: đồng bộ 4 điểm UI (knowledge.md, STYLE 2-lựa-chọn, bài giảng liền mạch, retest có phần kiến thức mới) — không bắt buộc cho CP3 nhưng cần trước khi spec.md chốt.

## 7. Kiến trúc kỹ thuật

- **Frontend:** React + TypeScript + Vite (`frontend/`). State machine chính nằm ở `App.tsx`, tách theo `stage`: `upload → ready → quiz → diagnosis → style → roadmap → review/report`. Gọi backend thật qua `fetch` tới `http://127.0.0.1:8000`.
- **Backend:** FastAPI (`backend/app/`) — `main.py` (2 endpoint: `/api/outline`, `/api/quiz/generate`), `pipeline/outline.py` (parse transcript thật, rule-based), `pipeline/quiz_bank.py` (gọi AI thật — quyết định trung tâm), `core/llm_client.py` (wrapper OpenAI), `prompts/quiz_bank_prompt.py`. Setup: xem `backend/README.md`.
- **Eval:** `eval/cases.py` (22 case golden set) + `eval/run_golden_set.py` (script chạy thật) + `eval/results-round1.md` (kết quả lượt 1) + `eval/golden_set.md` (mô tả phương pháp + quality bar).
- **Prototype tĩnh song song:** `codebase/index.html` — bản HTML/JS thuần, dùng để demo nhanh/dự phòng, độc lập với frontend React (vẫn 100% mock, chưa nối bản cập nhật này).

## 8. Vai trò & phân công (theo `schedule_5nguoi.md`)

| Vai | Người | Phụ trách |
|---|---|---|
| A — Diagnosis | Đạt | Classify, outline extraction, quiz gen, retest gen |
| B — Alignment + Rewrite | Mai Anh | Align section↔transcript, grounded rewrite + citation |
| C — Frontend | Trà | Toàn bộ UI |
| D — Data & Weakness | Anh Tuấn | Data demo, golden set, weakness analysis, chấm rule-based |
| E — Tích hợp & Vận hành | Linh | Backend orchestration, nối pipeline, latency, fallback |

## 9. Bốn lớp chỗ khó (áp dụng cho sản phẩm này)

| Lớp | Tình huống cụ thể |
|---|---|
| ① Nguồn sự thật | Slide/transcript không đủ thông tin → AI có báo "không đủ dữ liệu" thay vì bịa câu hỏi/đáp án không? Đồng thời: nếu AI classify nhầm lời học viên thành lời giảng viên, kiến thức sai/chưa chuẩn của học viên có thể lọt vào `knowledge.md` và bị coi là nguồn chính thức |
| ② Mơ hồ | Buổi học ít nội dung, không đủ đa dạng để trải đều 5 section |
| ③ Ngoài phạm vi | Học viên đòi quiz nội dung buổi khác/ngoài chương trình; hoặc hỏi AI (Phase 3b) câu hoàn toàn ngoài môn học |
| ④ Đặc thù domain | Đáp án AI sinh bị sai/trích dẫn sai trang → học viên học sai kiến thức, mất niềm tin ngay lập tức; hoặc AI tool-call ra ngoài lấy nguồn không đáng tin mà không ghi rõ đó là nguồn ngoài |

## 10. Việc còn thiếu

**Đã xong cho CP3 (checklist TA sẽ tích):**
- ✅ Lời gọi AI thật ở quyết định trung tâm, không hardcode (`backend/app/pipeline/quiz_bank.py`)
- ✅ Golden set ≥20 case, đủ case khó (22 case, ≥2/lớp chỗ khó — `eval/cases.py`)
- ✅ Bảng kết quả lượt 1 có % (`eval/results-round1.md` — 22/22 = 100%, có ghi nhận 1 phát hiện thật)

**Còn lại, ưu tiên trước khi spec.md chốt (23:59 N1):**
1. Khôi phục nội dung `README.md` gốc (đang rỗng) — cần tên nhóm + phân công.
2. Đồng bộ 4 điểm UI với yêu cầu sản phẩm mới nhất: STYLE 2-lựa-chọn (Quick/Deep), roadmap → bài giảng liền mạch, hợp nhất slide+transcript thành `knowledge.md`, retest sinh câu MỚI (chưa từng hỏi) thay vì chỉ tái dùng câu cũ.
3. PDF slide → text thật (hiện Upload chỉ mock, demo dùng transcript bundle sẵn).
4. Phase 3b (Q&A + tool-call ngoài) — vẫn ở dạng thiết kế, chưa có code. Không bắt buộc, build sau nếu còn thời gian.
5. Sửa prompt cho case C2 trong golden set (model đôi khi tự chuẩn hoá section_id lạ về "S1" — xem "Lưu ý trung thực" trong `eval/results-round1.md`), rồi chạy lại lượt 2.
6. `.venv` của backend không commit (đã thêm `.gitignore`) — mỗi máy cần tự `pip install -r requirements.txt` theo `backend/README.md`.
