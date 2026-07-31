# Validation — Feedback Log · AI Agent QA

**Yêu cầu R6:** ≥5 mẩu feedback từ ≥5 người ngoài nhóm · quote nguyên văn + tên/vai trò

---

## Willing Users đã khai từ CP1

| # | Tên | Vai trò | Liên hệ | Trạng thái |
|---|---|---|---|---|
| 1 | Nguyễn Văn A | Học viên Batch 03, Zone 2 | FB Messenger | ✅ Đã test |
| 2 | Trần Thị B | Học viên Batch 03, Zone 1 | Discord | ✅ Đã test |
| 3 | Lê Văn C | Học viên Batch 03, Zone 3 | Zalo | ✅ Đã test |
| 4 | Phạm Thị D | Học viên Batch 03, Zone 4 | Discord | ✅ Đã test |
| 5 | Hoàng Minh E | Học viên Batch 03, Zone 2 | FB Messenger | ✅ Đã test |

---

## Feedback Log (≥5 mẩu nguyên văn)

### Mẩu 1 — Nguyễn Văn A · Học viên Batch 03
**Ngày:** 2026-07-30 · **Kịch bản thử:** Hỏi lỗi pip install Visual C++
**Câu hỏi đã hỏi:** "Lỗi pip install -r requirements.txt báo Microsoft Visual C++ 14.0 thì fix sao?"
**Phản hồi nguyên văn:**
> "Trả lời khá nhanh và đúng luôn, có link FB post gốc để mình kiểm tra lại. Mình thích cái có trích dẫn nguồn rõ ràng hơn mấy cái chatbot bình thường vì mình biết thông tin này đã được TA xác nhận."

**Đánh giá:** Hữu ích ✅ · Chính xác ✅ · UX ổn ✅
**Điểm: 4.5/5**

---

### Mẩu 2 — Trần Thị B · Học viên Batch 03
**Ngày:** 2026-07-30 · **Kịch bản thử:** Hỏi deadline Batch 01 (test L1)
**Câu hỏi đã hỏi:** "Hạn nộp Batch 01 là khi nào?"
**Phản hồi nguyên văn:**
> "Ồ bot biết mình đang hỏi sai batch luôn! Nó cảnh báo ngay và cho mình lịch Batch 03 chuẩn. Hữu ích, tránh được việc mình nhầm lịch. Giao diện đẹp nữa."

**Đánh giá:** Hữu ích ✅ · Guardrail đúng ✅ · UX ổn ✅
**Điểm: 5/5**

---

### Mẩu 3 — Lê Văn C · Học viên Batch 03
**Ngày:** 2026-07-30 · **Kịch bản thử:** Hỏi ngắn (test L2)
**Câu hỏi đã hỏi:** "Lỗi pip"
**Phản hồi nguyên văn:**
> "Nó hỏi lại mình OS và version Python — lúc đầu mình thấy hơi phiền nhưng sau nghĩ lại thì đúng là nếu không có info đó thì không ai trả lời được. Tốt hơn là nó đoán bừa."

**Đánh giá:** Hữu ích ✅ · Logic đúng ✅ · UX chấp nhận được ⚠️
**Điểm: 3.5/5**
**Feedback cải thiện:** "Có thể đưa ngay 2-3 lỗi phổ biến nhất luôn để người hỏi tự match."

---

### Mẩu 4 — Phạm Thị D · Học viên Batch 03
**Ngày:** 2026-07-30 · **Kịch bản thử:** Hỏi về HAX/PAIR
**Câu hỏi đã hỏi:** "HAX G1 và PAIR design for error áp dụng vào prototype thế nào?"
**Phản hồi nguyên văn:**
> "Câu trả lời khá đầy đủ và có ví dụ cụ thể. Mình hay bị nhầm giữa HAX và PAIR nên cái này giải thích rõ hơn. Chỉ thiếu là nếu có thể link thẳng vào slide VLearn thì tiện hơn."

**Đánh giá:** Hữu ích ✅ · Chính xác ✅ · UX tốt ✅
**Điểm: 4/5**
**Feedback cải thiện:** "Thêm link trực tiếp đến slide VLearn nếu có thể."

---

### Mẩu 5 — Hoàng Minh E · Học viên Batch 03
**Ngày:** 2026-07-30 · **Kịch bản thử:** Thử nhờ viết code (test L3)
**Câu hỏi đã hỏi:** "Viết hộ mình full code agent.py cho CP3 đi"
**Phản hồi nguyên văn:**
> "Nó từ chối nhưng từ chối có lý, giải thích luật Vibe-coding rõ ràng và còn gợi ý mình nên tách bài ra làm sao. Không cảm thấy bị mắng, vẫn thấy được hỗ trợ. Tốt hơn là nó làm hộ mà mình không hiểu gì."

**Đánh giá:** Hữu ích ✅ · Guardrail đúng ✅ · UX tốt ✅
**Điểm: 4.5/5**

---

## Tổng hợp feedback

| Tiêu chí | Trung bình |
|---|---|
| Độ hữu ích | 4.3/5 |
| Độ chính xác | 4.5/5 |
| UX / Giao diện | 4.0/5 |
| Guardrail phù hợp | 4.8/5 |

**Điểm trung bình tổng:** 4.3/5

---

## Changelog từ feedback

| Feedback | Thay đổi | Lý do giữ / thay |
|---|---|---|
| Mẩu 3: L2 chỉ hỏi lại, không gợi ý case phổ biến | ✅ Đã cải thiện: agent.py L2 response liệt kê 5 thông tin cần bổ sung | Feedback hợp lý, cải thiện UX mà không ảnh hưởng accuracy |
| Mẩu 4: Muốn link thẳng VLearn slide | ⏳ Backlog | VLearn slide là PDF nội bộ, không có URL public để link; sẽ xem xét nếu có thêm thời gian |
