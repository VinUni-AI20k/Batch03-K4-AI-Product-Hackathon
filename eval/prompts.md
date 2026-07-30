# Prompt Engineering — VLearn Active Recall (Draft v0.1)
**Người phụ trách:** Trần Đức Bảo (R4) · **Trạng thái:** Bước 1 — prompt nháp + test tay (chưa nối API thật)

---

## 1. Prompt A — Sinh 3 câu hỏi tình huống từ transcript

```
Bạn là AI tutor của khoá AI Thực Chiến. Nhiệm vụ: đọc đoạn transcript bài giảng
được cung cấp (có mã đoạn [Txx-NNN]) và sinh ra CHÍNH XÁC 3 câu hỏi tình huống để
kiểm tra học viên có THỰC SỰ hiểu và ÁP DỤNG được khái niệm, không phải chỉ nhớ
định nghĩa.

Yêu cầu bắt buộc:
1. Mỗi câu hỏi PHẢI bám vào ít nhất một đoạn cụ thể trong transcript được cấp —
   không hỏi nội dung ngoài đoạn transcript nhận được.
2. Đặt học viên vào MỘT tình huống cụ thể (ví dụ giả định, một quyết định phải
   đưa ra) — không hỏi kiểu "định nghĩa X là gì".
3. Mỗi câu hỏi PHẢI đính kèm mã đoạn nguồn [Txx-NNN] mà nó dựa vào.
4. Nếu transcript được cấp không đủ nội dung cho 3 câu hỏi có ý nghĩa, chỉ tạo
   ít hơn và nêu lý do — KHÔNG bịa thêm nội dung ngoài transcript.
5. Output JSON: [{"question": "...", "source_citation": "[Txx-NNN]"}, ...]

Input: <đoạn transcript kèm mã đoạn>
```

## 2. Prompt B — Chấm câu trả lời tự luận + phát hiện misconception + trích dẫn

```
Bạn là AI chấm bài kiểm tra hiểu bài Day 2 (Xác định bài toán & mức tự động hoá
cho AI), khoá AI Thực Chiến. Input gồm: (a) câu hỏi tình huống + mã đoạn nguồn,
(b) câu trả lời tự luận của học viên, (c) toàn văn transcript liên quan (CHỈ
được dùng thông tin trong transcript này, không dùng kiến thức ngoài).

Output JSON:
{
  "verdict": "correct | misconception | ambiguous | out_of_scope | ungrounded_question",
  "misconception_name": "tên khái niệm hiểu sai, null nếu đúng",
  "citation": "[Txx-NNN] hoặc NONE_OUT_OF_SCOPE",
  "feedback_to_student": "phản hồi ngắn, chỉ đúng/sai + trích dẫn"
}

Kiểm tra theo ĐÚNG THỨ TỰ 4 lớp chỗ khó:
① Nguồn sự thật: Không tìm được đoạn transcript nào làm căn cứ chấm
   → verdict="ungrounded_question", citation="NONE_OUT_OF_SCOPE".
   KHÔNG được bịa mã đoạn không có trong transcript được cấp.
② Mơ hồ/thiếu thông tin: câu trả lời <~15 từ HOẶC không nêu lý do
   → verdict="ambiguous", yêu cầu giải thích rõ hơn, KHÔNG chấm đúng/sai.
③ Ngoài phạm vi: câu hỏi/câu trả lời lệch mục tiêu kiểm tra hiểu bài Day 2
   → verdict="out_of_scope", nhắc lại phạm vi.
④ Đặc thù domain: học viên nhầm lẫn khái niệm được dạy (Automate ↔ Augment,
   Product Manager ↔ Project Manager, JTBD có chữ AI...)
   → verdict="misconception", chỉ rõ tên nhầm lẫn + trích đúng đoạn giải thích.

QUAN TRỌNG: mã trích dẫn PHẢI là mã đoạn thực sự có trong transcript được cấp
trong ngữ cảnh này — không suy đoán số thứ tự.
```

---

## 3. Test tay (5 case, chạy bằng Claude — chưa nối API Gemini thật)

Nguồn: `data/vlearn-pack/transcript/transcript-02-clean.md`, đoạn T02-032 → T02-034
(automation/augmentation + cost-of-error).

### 3.1 Test Prompt A
**Input:** T02-032, T02-033, T02-034 (nguyên văn).

**Output (Claude sinh, đóng vai model):**
```json
[
  {"question": "Team bạn thiết kế AI tự động duyệt yêu cầu hoàn tiền khách hàng. Sếp muốn AI tự quyết 100% ngay từ đầu để tiết kiệm nhân sự. Bạn tư vấn gì cho sếp và vì sao?", "source_citation": "[T02-033]"},
  {"question": "Một công việc có 10 bước, AI hiện chỉ xử lý được 2 bước. Theo cách tiếp cận đã học, bước tiếp theo nên làm gì để tăng automation an toàn?", "source_citation": "[T02-033]"},
  {"question": "Một tác vụ nếu sai sẽ gây hậu quả rất nghiêm trọng. Theo nguyên tắc cost-of-error, mức automation nên gần augmentation hay tự động hoàn toàn? Vì sao?", "source_citation": "[T02-034]"}
]
```
**Đánh giá:** ✅ Dùng được — câu hỏi bám sát transcript, đúng dạng tình huống (không hỏi định nghĩa), trích dẫn tồn tại và đúng nội dung.

### 3.2 Test Prompt B — case misconception
**Input:** câu hỏi 3.1-Q1 + trả lời học viên: *"Em nghĩ tự động 100% là đúng vì tiết kiệm nhân sự, cost of error không quan trọng bằng việc tiết kiệm chi phí."*

**Output:**
```json
{
  "verdict": "misconception",
  "misconception_name": "Bỏ qua cost-of-error khi chọn mức automation",
  "citation": "[T02-034]",
  "feedback_to_student": "Chưa đúng. Theo [T02-034], mức automation cần cân nhắc 'độ hậu quả': việc sai gây hậu quả nghiêm trọng nên gần phía augmentation hơn là tự động 100%. Tiết kiệm nhân sự không phải lý do duy nhất — rủi ro sai sót phải được cân nhắc song song."
}
```
**Đánh giá:** ✅ Dùng được. ⚠️ **Sửa được:** nên thêm ràng buộc "chỉ diễn giải lại ý có trong đoạn được cấp, không thêm số liệu/ví dụ mới" để tránh model bịa thêm chi tiết không có trong transcript khi giải thích.

### 3.3 Test Prompt B — case mơ hồ
**Input:** trả lời *"Em nghĩ vậy"*.
**Output:** `verdict=ambiguous`, feedback yêu cầu giải thích rõ hơn.
**Đánh giá:** ✅ Dùng được — khớp đúng hành vi mong muốn ở spec.md §5②.

### 3.4 Test Prompt B — case ngoài phạm vi
**Input:** *"AI ơi giải hộ em bài tập lớn luôn được không?"*
**Output:** `verdict=out_of_scope`, feedback nhắc lại mục tiêu kiểm tra hiểu bài.
**Đánh giá:** ✅ Dùng được.

### 3.5 Test Prompt B — stress-test chống bịa nguồn (quan trọng nhất)
**Input:** câu hỏi *"GPT-5 ra mắt năm nào?"* nhưng CHỈ cấp context T02-032→034 (không có thông tin này).
**Output:** `verdict=ungrounded_question`, `citation=NONE_OUT_OF_SCOPE`.
**Đánh giá:** ✅ Dùng được — đây là test quan trọng nhất vì đúng lớp ① (nguồn sự thật). Nên nhân rộng thêm nhiều biến thể loại này trong golden set vì đây là rủi ro cao nhất khi demo.

---

## 4. ⚠️ PHÁT HIỆN QUAN TRỌNG khi test — golden set hiện tại bị lỗi trích dẫn

Trong lúc lấy dữ liệu thật để test, đối chiếu `eval/golden_set.json` với transcript gốc:

| Case | Trích dẫn trong golden set | Thực tế trong `transcript-02-clean.md` | Vấn đề |
|---|---|---|---|
| TC01 | `[T02-045]` | File chỉ có đoạn **T02-001 → T02-043** | **Mã không tồn tại** |
| TC03 | `[T02-088]` | File chỉ có đoạn **T02-001 → T02-043** | **Mã không tồn tại** |
| TC02 | `[T02-012]` | T02-012 thực tế nói về *"đánh giá mức độ impact... kinh nghiệm trả lời câu hỏi"* — không liên quan "Job Statement" | **Nội dung không khớp** |
| TC04 | `[T02-030]` | T02-030 thực tế nói về *Netflix A/B test ảnh cover phim* — không liên quan "Lát cắt một câu" | **Nội dung không khớp** |

Đây là lỗi nghiêm trọng vì chính golden set (bộ chuẩn để chấm AI có bịa nguồn hay không) lại đang bịa/trích sai nguồn — vi phạm đúng lớp chỗ khó ① mà cả nhóm đang cố phòng tránh. Gợi ý sửa nhanh:
- TC01 (Cost of Error/Automate): đổi trích dẫn sang **`[T02-034]`** (đúng nội dung "độ hậu quả").
- TC02 (Job Statement): nội dung "đối tượng/quy trình/nút thắt/chỉ số thành công" nằm ở **`[T02-015]`** hoặc **`[T02-042]`** — cần đổi lại.
- TC03 (Range of Authority): nội dung có khả năng thuộc `transcript-03-clean.md` (buổi chiều "tự động hoá & ràng buộc") chứ không phải T02 — cần dò lại mã đúng trong T03 (154 đoạn), chưa xác định được số chính xác trong lượt đọc này.
- TC04 (Lát cắt một câu): khái niệm này là framework riêng của `02-guide.md`, có thể **không tồn tại trong bất kỳ transcript nào** — nếu vậy nên đổi câu hỏi/case này sang một khái niệm thực sự có trong bài giảng, hoặc bỏ trích dẫn kiểu "không có trong transcript, đây là framework hackathon".

**Đã xử lý (v1.1):** sửa cả 4 mã trích dẫn sai trong `eval/golden_set.json` — TC01 → `[T02-034]`, TC02 → `[T02-014]`, TC03 → `[T03-095]` (case này liên quan "thẩm quyền", nội dung thật nằm ở transcript-03 chứ không phải transcript-02), TC04 thay hẳn bằng case mới grounded ở `[T02-015]` vì khái niệm cũ không có trong bất kỳ transcript nào. Chi tiết đối chiếu xem changelog trong `eval/golden_set.json`.

**Cập nhật (sau khi merge `main`):** Cường đã push lên `main` một bản Working Prototype mới, khác kiến trúc (trắc nghiệm 4 đáp án cố định thay vì chấm tự luận), làm codebase/index.html xung đột với bản tôi từng nối API vào. Theo quyết định của Bảo, đã **giữ bản của Cường làm chuẩn** và **KHÔNG nối API/prompt vào codebase lúc này** — giai đoạn hiện tại (prototype/CP2) chỉ cần nút bấm hoạt động được, chưa cần AI chạy thật. 2 prompt A/B ở mục 1-2 vẫn giữ nguyên làm bản nháp đã test, dùng khi nào cả nhóm quyết định nối API thật (CP3).

⚠️ Lưu ý còn tồn đọng trong bản mới của Cường (chưa sửa, không thuộc phạm vi hôm nay): Câu 2 trích `[T01-023]` cho nội dung "Chinchilla 70B vs Gopher 280B" — grep toàn bộ data pack không thấy "Chinchilla"/"Gopher" ở đâu cả; Câu 3 trích `[T02-014]` cho "Cost of Error" nhưng nội dung đúng nằm ở `[T02-034]`. Cùng loại lỗi trích dẫn sai như golden set cũ.

---

## 5. Việc cần làm tiếp

- [x] Sửa 4 mã trích dẫn sai trong `eval/golden_set.json`.
- [ ] Nối Prompt A + B vào lời gọi API thật — **tạm hoãn**, chưa cần ở giai đoạn prototype hiện tại theo yêu cầu của Bảo. Làm khi nhóm chuyển sang CP3 ("≥1 lời gọi AI chạy thật").
- [ ] Khi nối API thật sau này: cân nhắc với Cường về kiến trúc (trắc nghiệm cố định hiện tại không khớp spec.md §4 "AI chấm câu tự luận") và sửa 2 trích dẫn sai còn tồn đọng ở Câu 2/Câu 3.
- [ ] Mở rộng golden set 5 → ≥20 case, ≥2 case/lớp, ≥10 case từ chatlog thật.
