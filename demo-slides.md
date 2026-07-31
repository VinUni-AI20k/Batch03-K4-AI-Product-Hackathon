<!--
Slide 6 trang theo guide §5.1. Luật: mỗi slide phải có ≥1 con số / quote có nguồn /
kết quả đo — người nghe kiểm chứng được. Chuyển file này thành demo-slides.pdf
trước khi nộp (in ra PDF từ trình xem markdown, hoặc dán nội dung vào Google Slides/
PowerPoint theo đúng 6 mục dưới).

CẦN ĐIỀN THÊM TRƯỚC KHI DEMO: Slide 5 hiện chưa có quote user thật — xem
validation/feedback-log.md để biết chính xác việc cần làm trước CP6.
-->

# Slide 1 — User & Job *(45")*

**Job executor**: Học viên (sinh viên / học sinh / người đi làm) đang cần chọn một đề tài capstone/dự án cuối khoá.

**Core JTBD**: Chọn một đề tài phù hợp với sở thích, kỹ năng hiện có và quy mô nhóm, để bắt đầu thực hiện ngay mà không mất nhiều thời gian cân nhắc.

**Con số pain** (khảo sát Google Form, n=34 người ngoài nhóm, log đầy đủ tại `validation/survey-responses-raw.csv`):
- **20/34 (59%)** chọn mức độ khó khăn 4-5/5 khi chọn đề tài — vượt ngưỡng ≥50% xác nhận của chuẩn A.
- **71%** nói khó khăn lớn nhất là "không biết đề tài có phù hợp với trình độ hay không".

---

# Slide 2 — Vì sao chọn tính năng này *(45")*

**Bảng impact rút gọn** (đầy đủ tại `spec.md` §2):

| Ứng viên | Bằng chứng | Chọn? |
|---|---|---|
| **A — Agent gợi ý đề tài** | 59% khảo sát báo khó cao, 71% muốn đúng tính năng này | ✅ Chọn |
| B — Chatbot hỏi-đáp logistics | Không có evidence riêng, trùng hướng B đã có nhóm khác làm chính thức | ❌ Loại |
| C — Đánh giá độ khó + lộ trình chi tiết | Là mở rộng của A, không phải bài toán độc lập | ❌ Loại (giữ làm backlog) |

**Lý do chọn A bằng số**: 59% (20/34) xác nhận pain thật, và giải pháp đúng khớp với 71% mong muốn "đề xuất đề tài phù hợp" — không phải nhóm tự nghĩ ra nhu cầu.

---

# Slide 3 — Giải pháp & demo live *(2')*

**Lát cắt MỘT CÂU**: Một học viên nhập hồ sơ (lĩnh vực, kỹ năng, quy mô nhóm, độ khó) → AI xếp hạng và giải thích 3 đề tài phù hợp nhất từ kho 170 đề tài thật kèm cảnh báo rủi ro → học viên chọn và bắt đầu.

**Automation**: Conditional — AI tự xếp hạng + viết lý do, nhưng user luôn xem lại và tự bấm "Chọn đề tài này" trước khi chốt (cost-of-error: chọn sai đề tài tốn thời gian nhưng sửa được dễ, không đủ rẻ để tự động hoàn toàn — xem `spec.md` §4).

**Demo trực tiếp — 2 case**:
1. **Case chuẩn**: hồ sơ Python/SQL/Phân tích dữ liệu → 3 đề tài IT/Data, `confidence: high`, lý do bám đúng tech_stack thật.
2. **Case chỗ khó** (xử lý được, không giấu): hồ sơ chỉ ghi "Nấu ăn, Chụp ảnh" — hệ thống tự nhận `confidence: low`, không đoán liều thay vì tự tin sai (`eval/golden-set.json` case L03, đã sửa từ eval lượt 2).

---

# Slide 4 — Kết quả đo *(45")*

**Quality bar đã chốt tại `spec.md` 23:59 N1**: "Đạt khi ≥70% case golden set PASS, và 100% không có mã đề tài bịa ngoài danh sách ứng viên (điều kiện cứng)."

| Lượt | Kết quả | Đối chiếu bar |
|---|---|---|
| 1 (2026-07-30) | 10/20 = 50% | Chưa đạt |
| 2 (2026-07-31) | 14/20 = 70% | Đạt |
| 3 (2026-07-31) | **15/20 = 75%** | **Đạt** |

Điều kiện cứng (0% mã đề tài bịa) **đạt ở cả 3 lượt**.

**Failure đáng kể nhất còn tồn tại**: model vẫn có thể bịa liên hệ giả trong lý do giải thích (case L01) khi kỹ năng không khớp thật với đề tài. Đã thử sửa bằng so khớp từ nhưng gây xung đột với một fix khác (case G02) — **chủ động bỏ fix nửa vời** thay vì để lại lỗi ẩn, ghi nhận cần công cụ đánh giá độc lập (LLM-judge) để giải đúng, không phải sửa vội. Chi tiết đầy đủ: `eval/run-03.md`.

---

# Slide 5 — User thật nói gì *(45")*

**Trạng thái thật, không giấu**: Tại thời điểm demo, nhóm **chưa có phiên validation trực tiếp** với người dùng thật (xem lý do và checklist cụ thể tại `validation/feedback-log.md`). Khảo sát 34 người (Slide 1) thu thập **trước khi** prototype tồn tại nên không dùng được làm quote về trải nghiệm sản phẩm — toàn bộ câu góp ý tự do của khảo sát đó (34/34) đều trống hoặc "Không có".

*(Nếu nhóm chạy được ≥1 phiên trước CP6: điền quote nguyên văn + tên/vai vào đây, thay thế đoạn trên.)*

---

# Slide 6 — Nếu có thêm 1 tuần *(30")*

1. Chạy validation thật với ≥5 người ngoài nhóm — ưu tiên hàng đầu, hiện là khoảng trống lớn nhất.
2. Sửa case L01 (model bịa liên hệ giả trong lý do) bằng LLM-judge độc lập thay vì heuristic so khớp từ — đã thử và bỏ vì gây xung đột với fix khác.
3. Sửa giới hạn "15-candidate limit trộn domain" khiến đề tài y tế/đúng-domain-nhất đôi khi chỉ chiếm 1/3 slot dù hồ sơ khớp rất rõ (case L08).

**Bài học lớn nhất**: một fix sửa đúng một lỗi cụ thể có thể tạo ra lỗi mới ở hướng ngược lại (case G02 quay lại đúng rồi lại sai khi thêm fix L01) — phải chạy lại toàn bộ golden set sau mỗi lần sửa, không chỉ test đúng case vừa sửa, và đôi khi quyết định đúng là **bỏ** một fix chưa chín thay vì giữ nó gây lỗi ẩn mới.
