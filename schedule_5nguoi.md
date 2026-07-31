# In-Action Learning Buddy — Phân công 5 người & Schedule

**Team:** Đạt (A), Mai Anh (B), Trà (C), Anh Tuấn (D), Linh (E)

## 0. Nguyên tắc vận hành (giữ nguyên từ bản gốc)
- **Data contract trước, code sau.** 30 phút đầu chốt schema JSON, không ai code trước khi có schema.
- **Không ai chờ ai.** Anh Tuấn (D) làm fixture JSON cho từng bước → Mai Anh (B) và Trà (C) build song song trên fixture, không chờ Đạt (A).
- **2 checkpoint tích hợp bắt buộc** — Linh (E) là người dẫn dắt cả hai checkpoint này.
- **Có fallback cache cho demo** — Linh (E) sở hữu việc chạy pipeline thật, lưu cache, và test fallback.
- **Cắt P1 (chat highlight-to-ask) không thương tiếc nếu trễ.**

## 1. Vai trò & phạm vi (để tránh chồng chéo)

| Vai | Người | Sở hữu | KHÔNG làm |
|---|---|---|---|
| A — Diagnosis | Đạt | Classify transcript, outline extraction, quiz gen (câu MCQ + câu mở), retest gen | Không đụng vào rewrite/citation (B), không đụng UI (C), không đụng orchestration (E) |
| B — Alignment + Rewrite | Mai Anh | Alignment (section ↔ segment), grounded rewrite + citation | Không tự sinh quiz (A), không đụng weakness scoring logic (D) |
| C — Frontend | Trà | Toàn bộ UI: upload, dropdown, quiz UI, study note render, retest UI, result screen, (P1) chat UI | Không viết prompt AI, không tự nối API (chỉ gọi API do E định nghĩa) |
| D — Data & Weakness | Linh | Chuẩn bị/làm sạch data demo, 3 kịch bản test, fixture JSON, weakness analysis module, chấm quiz + retest (rule-based) | Không đụng orchestration/backend routes (E), không chạy cache demo cuối (E) |
| E — Tích hợp & Vận hành | Anh Tuấn | Backend/API orchestration, nối pipeline ở 2 checkpoint, đo latency, error handling (retry+fallback), chạy & lưu cache demo, test fallback | Không viết prompt AI, không tự sửa logic weakness (chỉ báo bug cho D) |

## 2. Data contracts (chốt ở Kickoff, không đổi)

```
outline.json            → [{ section_id, title, key_points[] }]
filtered_transcript.json → [{ segment_id, text, label }]
quiz.json                → [{ q_id, question, options[], correct_index, section_id }]
weakness.json            → [{ section_id, weak_score, reason }]
study_note.json           → [{ section_id, content_md, cited_segment_ids[] }]
```

---

## 3. Schedule theo checkpoint (09:00–19:30, ~10.5h, giờ tương đối)

### H0 · 09:00–09:30 — Kickoff (cả team)
- [ ] Chốt 5 schema data contract — Anh Tuấn (D) chủ trì, cả team ký duyệt
- [ ] Anh Tuấn (D) cam kết thời điểm giao fixture JSON cho từng bước
- [ ] Chốt chủ đề/format bộ dữ liệu demo (chưa cần nội dung final)
- [ ] Linh (E) chốt cấu trúc API routes (endpoint nào nhận input gì, trả gì) để C và D biết gọi đúng contract
- [ ] Xác nhận: chat highlight-to-ask là P1, cắt đầu tiên nếu trễ

### H0.5–H2.5 · 09:30–11:30 — Sprint 1

**Đạt (A)**
- [ ] Prompt classify transcript: input `[T-xxx]` → output `{segment_id, label}`
- [ ] Test trên transcript demo thật ngay khi D giao
- [ ] DoD: ≥90% teaching-segment giữ đúng khi eyeball thủ công

**Mai Anh (B)**
- [ ] Build trên fixture `outline.json` + `filtered_transcript.json` của D, không chờ A
- [ ] Prompt alignment v1: 1 outline section → list `segment_id` liên quan
- [ ] DoD: với 1 section mock, ra kết quả hợp lý (eyeball)

**Trà (C)**
- [ ] Scaffold flow: Upload → Level → Quiz → Style/Time → Study Note → Retest → Result
- [ ] Upload UI (PDF + transcript)
- [ ] Dropdown level

**Anh Tuấn (D)**
- [ ] **Ưu tiên số 1:** chốt + làm sạch bộ data demo thật (slide text-based + transcript có `[T-xxx]`)
- [ ] Viết 3 kịch bản "cố tình trả lời sai ở section X/Y/Z" — dùng test weakness detection sau
- [ ] Giao fixture JSON cho B và C theo đúng contract đã chốt

**Linh (E)**
- [ ] Scaffold backend/API orchestration (stub routes theo contract đã chốt ở Kickoff)
- [ ] Chuẩn bị khung test tích hợp (script gọi tuần tự các bước) cho Checkpoint 1
- [ ] Setup logging cơ bản để trace lỗi giữa các bước AI

### H2.5–H4.5 · 11:30–13:30 — Sprint 2

**Đạt (A)**
- [ ] Prompt outline extraction: slide text → `{section_id, title, key_points[]}`
- [ ] Prompt quiz generation: outline + filtered transcript → 8 MCQ, bắt buộc gắn `section_id` + `correct_index`
- [ ] Sinh câu hỏi mở "phần nào khó nhất"

**Mai Anh (B)**
- [ ] Prompt grounded rewrite v1: section yếu + outline + transcript liên quan + level/style → Study Note có citation `segment_id`
- [ ] Spot-check 3 ví dụ: citation có trỏ đúng segment thật không (không được bịa)

**Trà (C)**
- [ ] UI làm quiz (MCQ + ô trả lời mở)
- [ ] Dropdown style + thời gian
- [ ] Component hiển thị Study Note (render markdown + citation badge)

**Anh Tuấn (D)**
- [ ] Module weakness analysis: đếm sai theo `section_id` (rule-based) + AI đọc nhẹ câu trả lời mở → top 2-3 section yếu
- [ ] Test module độc lập với mảng kết quả quiz giả

**Linh (E)**
- [ ] Hoàn thiện route nối các bước theo contract (chưa cần chạy data thật)
- [ ] Chuẩn bị checklist Checkpoint 1: các bước cần nối, thứ tự chạy, ai fix gì nếu lỗi
- [ ] Bắt đầu thiết kế cơ chế retry 1 lần khi AI call fail

### 13:30–14:00 — Nghỉ trưa

### H5–H7 · 14:00–16:00 — **Checkpoint 1: Tích hợp lần 1** (Linh dẫn dắt) + Sprint 3

**Cả team — do Linh (E) điều phối**
- [ ] Nối: classify → outline extract → quiz gen, chạy 1 lượt trên data thật
- [ ] Nối: quiz result → weakness analysis → alignment → rewrite → study note
- [ ] Chạy full pipeline lần đầu trên data demo thật — kỳ vọng có bug, đây là lúc để tìm

**Đạt (A)** — fix bug classify/outline/quiz phát sinh

**Mai Anh (B)** — fix bug alignment/rewrite, siết độ chính xác citation (mục tiêu ≥90% câu trace được nguồn)

**Trà (C)**
- [ ] UI quiz retest (tái dùng component quiz)
- [ ] Màn hình kết quả before/after
- [ ] (nếu kịp) Layout split-screen: Study Note trái, chat phải — khung sườn, chưa nối AI

**Anh Tuấn (D)**
- [ ] Chấm retest rule-based (tái dùng logic chấm quiz) + trỏ citation câu sai từ metadata có sẵn (không thêm AI call)

**Linh (E)**
- [ ] Đo latency "sinh Study Note" — có dưới 30s không? Nếu không, báo Trà (C) để bàn loading state/streaming
- [ ] Ghi lại toàn bộ lỗi phát sinh ở checkpoint này, phân về đúng người fix (A/B/D)
- [ ] Implement retry 1 lần cho AI call lỗi (chuẩn bị nền cho fallback cache cuối ngày)

### H7–H8.5 · 16:00–17:30 — Sprint 4 / Stretch

- [ ] **Nếu đang đúng/vượt tiến độ:** build chat highlight-to-ask — Mai Anh (B) viết prompt, Trà (C) làm UI, Linh (E) nối API
- [ ] **Nếu đang trễ:** bỏ hẳn chat, dồn lực ổn định vòng lặp lõi (ưu tiên A, B fix chất lượng output)

**Anh Tuấn (D)**
- [ ] Regression test: chạy lại 3 kịch bản cố tình sai, xác nhận weakness detection vẫn đúng sau các fix ở Checkpoint 1

**Linh (E)**
- [ ] Chạy pipeline thật 1 lần trên đúng bộ data demo, lưu toàn bộ output JSON làm cache dự phòng
- [ ] Hoàn thiện cơ chế fallback: AI lỗi → retry 1 lần → chuyển sang cache

### H8.5–H9.5 · 17:30–18:30 — **Checkpoint 2: Chạy full end-to-end** (Linh dẫn dắt)
- [ ] Chạy toàn bộ flow 3 lần trên data demo thật, không can thiệp tay
- [ ] Chạy 3 kịch bản "cố tình sai section X/Y/Z" — Anh Tuấn (D) xác nhận weakness detection chỉ đúng section được nhắm
- [ ] Linh (E) tổng hợp lỗi phát sinh, phân về đúng người (A/B/C/D) fix — đây là block dev cuối cùng

### H9.5–H10.5 · 18:30–19:30 — Polish + Demo prep
- [ ] Trà (C): polish UI
- [ ] Anh Tuấn (D): viết kịch bản demo (dùng bộ data nào, kịch bản sai nào, nói gì)
- [ ] Linh (E): test fallback cache — giả lập AI lỗi (tắt mạng/mock timeout), xác nhận chuyển cache mượt
- [ ] Đạt (A) + Mai Anh (B): hỗ trợ rehearsal, đảm bảo output prompt ổn định cho lần chạy demo thật
- [ ] Cả team: chạy thử demo có bấm giờ, nói to, trước mặt cả team

### H10.5+ — Buffer / rehearsal cuối, nghỉ nếu có thể

---

## 4. Metrics theo problem doc (Definition of Done — không đổi)
- Grounding rate Study Note ≥ 90% câu trace được nguồn (Mai Anh chịu trách nhiệm chính)
- Latency sinh Study Note < 30s, nếu không phải có loading/streaming rõ ràng (Linh đo, Trà xử lý UI)
- Weakness detection: đúng cả 3 kịch bản cố tình sai (Anh Tuấn chịu trách nhiệm chính)
- End-to-end completion: 100% trên bộ data demo đã chọn, chạy không lỗi (Linh chịu trách nhiệm chính)
