# CANVAS CP1 — VLEARN ACTIVE RECALL (DẠNG VĂN BẢN)

**Nhóm:** 5tuat · **Hướng:** A — VLearn (Tính năng mới)

---

### 1. Hướng lựa chọn
- **Hướng A — VLearn**: Phát triển tính năng mới trên nền tảng học tập VLearn.

### 2. Job Executor (Người trực tiếp dùng)
- **Ai**: Học viên khóa AI Thực Chiến ngay sau khi kết thúc một bài giảng hoặc xem xong video bài học (Cụ thể: Buổi Day 2 — *Xác định bài toán cho AI*).
- **Core JTBD** *(Không từ AI/sản phẩm)*: Kiểm tra và xác nhận mức độ hiểu bài thực tế của bản thân trước khi bắt tay làm bài tập lớn để không bị hổng kiến thức cốt lõi.

### 3. Pain Point một câu (Ai — Đang làm gì — Vướng đâu — Hậu quả)
- **Nỗi đau**: Học viên rơi vào trạng thái "ảo tưởng đã hiểu bài" (Illusion of Competence) sau khi đọc slide/nghe giảng, nhưng thực chất bị hổng hoặc nhầm lẫn các khái niệm cốt lõi mà không tự biết, dẫn đến hậu quả bị trừ điểm hoặc phải làm lại toàn bộ bài tập lớn.

### 4. Bằng chứng đầu tiên (Chuẩn A & B)
- **Đường B (Mining Data - 2.522 chat)**:
  - `asked_check_question = False` ở 2.515 / 2.518 lượt chat (99.88% thụ động, không bao giờ chủ động đặt câu hỏi kiểm tra lại mức hiểu bài).
  - `misconceptions = []` ở 100% lượt chat (0 / 1.261 lượt dùng — hệ thống chưa từng có tính năng phát hiện hiểu lầm).
- **Đường A (Khảo sát thực tế - N = 24 học viên trong lớp)**:
  - 83.33% (20/24 bạn) khao khát làm Quiz ngắn ngay sau bài học để hệ thống kiểm tra lại mức độ hiểu bài.
  - 91.67% (22/24 bạn) đồng ý chia sẻ lịch sử câu sai với AI để được chỉ ra lỗ hổng kiến thức.

### 5. Lát cắt MỘT CÂU (Core Slice)
> **"Dành cho học viên vừa học xong bài Day 2, AI tự động sinh 3 câu hỏi tình huống bám sát transcript bài giảng `[T02-xxx]`, chấm điểm câu tự luận của học viên và chỉ ra chính xác khái niệm hiểu sai kèm trích dẫn trang slide/transcript."**

### 6. Automation dự kiến & Lý do theo Cost-of-Error
- **Mức Automation**: Conditional Automation (AI tự động chấm & đưa gợi ý nhận xét; nếu học viên muốn gửi câu hỏi chưa hiểu cho Giảng viên/TA thì phải qua 1 bước nhấn nút xác nhận).
- **Lý do theo Cost-of-Error**: Cost-of-Error mức Trung bình - Cao (Hiểu sai kiến thức dẫn đến hỏng bài tập lớn). Tuy nhiên, khảo sát cho thấy 37.5% học viên yêu cầu nút bấm "Đồng ý gửi" trước khi gửi cho TA để tránh bị gián đoạn hoặc sợ bị đánh giá.

### 7. Willing Users & Phân công nhóm
- **≥3 Willing Users sẵn sàng dùng thử tại CP5**:
  1. Nguyễn Văn Thành — 2A202601030
  2. Nguyễn Chiến Thắng — 2A202601734
  3. Hồ Ngọc Quỳnh — 2A202601684
- **Phân công 5 thành viên nhóm 5tuat**:
  1. Phạm Quốc Bảo (2A202601502) — Spec & Thiết kế 4 lớp chỗ khó (R2/R3)
  2. Trần Hoàng Long (2A202601646) — Mining Data & Khảo sát Evidence (R1)
  3. Trần Đức Bảo (2A202601472) — Prompt AI & Golden set (R4)
  4. Nguyễn Sỹ Mạnh Cường (2A202601040) — Lập trình Working Prototype (R5)
  5. Phạm Công Đạt (2A202601406) — User Testing & Slide Demo (R6)
