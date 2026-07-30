# AI SPEC — VLearn Active Recall · Nhóm 5tuat
**Hướng:** [X] A — VLearn  
**Loại:** [X] Tính năng mới

---

## §1. User & Job

- **Job executor + workflow**: Học viên khóa AI Thực Chiến ngay sau khi kết thúc 1 bài giảng / video bài học (buổi Day 2: *Xác định bài toán cho AI*).
  - Workflow hiện tại: Xem video ➔ Đọc slide ➔ Nghĩ rằng mình đã hiểu bài ➔ Bắt tay làm bài tập lớn/Quiz ➔ Phát hiện bị sai/hổng kiến thức cốt lõi.
- **Core JTBD** *(không chứa chữ AI)*: Kiểm tra và xác nhận mức độ hiểu bài thực tế của bản thân ngay sau buổi học để tự tin áp dụng kiến thức vào bài tập lớn mà không bị hổng kiến thức cốt lõi.
- **Problem statement** *(KHÔNG chữ AI)*: Học viên thường rơi vào trạng thái "ảo tưởng đã hiểu bài" (Illusion of Competence) sau khi đọc slide hoặc nghe giảng, nhưng thực chất bị hiểu sai hoặc hổng các khái niệm quan trọng mà không tự biết cho đến khi bị trừ điểm bài tập.
- **Evidence** *(Đạt cả chuẩn A và B — n = 36 học viên)*:
  - **Số liệu Mining Data (Đường B)** — từ dataset `chat_history_anonymized_for_hackathon.csv` (2.522 lượt chat):
    1. `asked_check_question = False` ở **2.515 / 2.518 lượt chat (99.88%)**: AI Tutor hiện tại vận hành hoàn toàn thụ động, gần như không bao giờ chủ động đặt câu hỏi kiểm tra bài.
    2. `misconceptions = []` ở **100% lượt chat (0 / 1.261)**: Field phát hiện hiểu lầm trong DB chưa từng được triển khai.
  - **Kết quả Khảo sát thực tế (Đường A — Đạt chuẩn $\ge 36$ mẫu)** — từ file khảo sát `Câu trả lời biểu mẫu 1.html` mới nhất ($N = 36$ học viên trong lớp):
    1. **88.88% (32/36 học viên)** xác nhận *sẵn sàng làm một bài Quiz ngắn ngay sau bài học* để hệ thống kiểm tra lại mức độ hiểu bài (17 bạn hoàn toàn sẵn sàng, 15 bạn sẵn sàng nếu Quiz ngắn).
    2. **91.66% (33/36 học viên)** đồng ý *chia sẻ lịch sử lỗi sai của mình với AI* để hệ thống phát hiện lỗ hổng kiến thức & gợi ý chủ đề ôn tập (điểm 3-5/5).
    3. **88.88% (32/36 học viên)** đồng ý *chuyển câu hỏi/vùng slide chưa hiểu cho Giảng viên/TA* khi làm Quiz không đạt (trong đó 38.9% yêu cầu nút "Đồng ý gửi" trước khi gửi).

---

## §2. Impact & quyết định chọn

- **Bảng impact 3 ứng viên**:

| Ứng viên | Số người gặp | Tần suất | Mỗi lần tốn gì | Build nổi trong 1.5 ngày? | Quyết định |
|---|---|---|---|---|---|
| **1. VLearn Active Recall (Kiểm tra hiểu thật)** | 1.000 HV | Sau mỗi buổi học (2-3 lần/tuần) | Hổng kiến thức cốt lõi ➔ Làm sai bài tập lớn, mất 2-3h sửa lại | **Có** (RAG + Prompt Evaluation) | **CHỌN** |
| 2. Phân loại & Fix Tutor trả lời lan man | 1.000 HV | Mỗi lần hỏi tutor | Tốn 2-5 phút đọc câu trả lời dài lê thê không đúng ý | Có (Prompt Tuning) | Bị loại (Bằng chứng yếu hơn ứng viên 1) |
| 3. Tự động chuyển câu hỏi cho TA trên Discord | ~200 HV | Khi tutor không biết | Chờ TA rep 15-30 phút | Khó (Cần setup Discord Bot Webhook) | Bị loại (Không thuộc VLearn) |

- **Ứng viên ĐÃ LOẠI + vì sao**: Loại ứng viên 2 & 3 vì ứng viên 1 có **bằng chứng khảo sát thực tế vượt chuẩn (N=24 mẫu, 83.33% nhu cầu)** và tận dụng được 100% data transcript sạch có sẵn trong repo.
- **Ứng viên CHỌN + vì sao (bằng số)**: Chọn **VLearn Active Recall** vì phục vụ 1.000 học viên, 83.33% học viên khao khát tính năng này, chứng minh được bằng 99.88% dữ liệu chatlog chưa có tính năng kiểm tra bài.

---

## §3. Giải pháp tương tự đã nghiên cứu

- **Khanmigo (Khan Academy)**:
  - *Flow*: Đặt câu hỏi kiểm tra sau từng video bài học.
  - *Đáng học*: Luôn đưa ra gợi ý nhỏ (hints) chứ không đưa đáp án ngay.
  - *Đáng né*: Hỏi nhiều câu trắc nghiệm quá đơn giản, không kiểm tra được khả năng áp dụng tình huống.
  - *Mình khác gì*: Sinh câu hỏi tình huống tự luận bám sát transcript và chỉ ra chính xác trích dẫn `[T02-xxx]`.
- **Duolingo (Smart Review)**:
  - *Flow*: Thống kê các từ/mẫu câu sai nhiều nhất để nhắc ôn tập lại.
  - *Đáng học*: Hiển thị trực quan khái niệm bạn đang gặp khó khăn.
  - *Đáng né*: Lặp đi lặp lại câu hỏi cũ gây chán.
  - *Mình khác gì*: Tập trung phát hiện **Hiểu lầm khái niệm (Misconceptions)** thay vì nhớ vẹt.

---

## §4. Thiết kế

- **Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả)**:
  > *"Dành cho học viên vừa học xong bài Day 2, AI tự động sinh 3 câu hỏi tình huống bám sát transcript bài giảng `[T02-xxx]`, chấm điểm câu tự luận của học viên và chỉ ra chính xác khái niệm học viên đang hiểu sai kèm trích dẫn trang slide/transcript."*
- **Non-goals (3 thứ KHÔNG build)**:
  1. KHÔNG build hệ thống chấm bài tập tự động thay cho giảng viên.
  2. KHÔNG build tính năng phát giọng nói/video giải thích (chỉ tập trung vào văn bản + trích dẫn).
  3. KHÔNG build tính năng thảo luận nhóm realtime.
- **Mức prototype nhắm tới**: **Working Prototype** (Giao diện HTML/Streamlit + Gọi API Gemini/OpenAI chạy thật 100%).
- **Automation**: **Conditional Automation** (AI tự động chấm & gợi ý nhận xét; trường hợp học viên muốn chuyển cho TA thì phải có nút bấm xác nhận).
  - *Lý do theo Cost-of-Error*: Hiểu sai kiến thức dẫn đến hỏng bài tập lớn, nhưng nếu tự động gửi cho TA khi chưa hỏi ý kiến sẽ khiến 37.5% học viên cảm thấy bị làm phiền/sợ bị đánh giá.

---

## §5. Kiểu lỗi — 4 lớp chỗ khó & kịch bản rủi ro

| Lớp chỗ khó | Kịch bản rủi ro | Trải nghiệm khi gặp |
|---|---|---|
| **① Nguồn sự thật** | AI bịa ra kiến thức không có trong bài giảng Day 2 | Bắt buộc AI kèm mã trích dẫn `[T02-xxx]`. Không trích dẫn được ➔ Báo "Không có trong bài giảng". |
| **② Mơ hồ / Thiếu thông tin** | Học viên gõ câu trả lời quá ngắn ("Em nghĩ vậy", "AI làm hết") | AI từ chối chấm và phản hồi: "Câu trả lời quá ngắn, vui lòng giải thích lý do cụ thể." |
| **③ Ngoài phạm vi** | Học viên hỏi hoặc gõ câu trả lời không liên quan ("Hôm nay ăn gì?") | AI từ chối: "Tôi chỉ hỗ trợ kiểm tra bài học Day 2. Vui lòng quay lại câu hỏi tình huống." |
| **④ Đặc thù domain** | Học viên nhầm lẫn giữa khái niệm *Automate* và *Augment* | AI phát hiện ngay lỗi misconception này và trích dẫn slide Day 2 trang 14 để giải thích. |

---

## §6. Bốn đường đi của trải nghiệm

- **Happy path**: Học viên học xong Day 2 ➔ Bấm "Kiểm tra bài" ➔ Nhận câu hỏi tình huống ➔ Trả lời tự luận ➔ AI phân tích đúng/sai + phát hiện hiểu lầm + dẫn nguồn `[T02-045]`.
- **Low-confidence**: Học viên trả lời chưa rõ ➔ AI hỏi lại 1 câu để xác nhận ý trước khi đưa ra kết luận.
- **Failure / Không căn cứ**: Kiến thức nằm ngoài bài giảng ➔ AI thông báo không có trong phạm vi bài học và đề xuất quay lại tài liệu chính thức.
- **Khi bị đòi ngoài phạm vi**: Học viên yêu cầu giải bài tập hộ ➔ AI nhắc nhở mục tiêu là kiểm tra hiểu bài và từ chối giải hộ.

---

## §7. Kiểm thử & Quality Bar

- **Golden set**: 20 test cases (xây dựng trong `eval/golden_set.json`).
- **Quality Bar (Chốt 23:59 N1)**: Đạt khi $\ge 85\%$ số test cases trả về đúng trích dẫn `[Txx-xxx]` và chỉ ra đúng lỗi misconception.

---

## §8. Phân công & Kế hoạch (Nhóm 5tuat)

- **Phân công có tên**:
  - **Phạm Quốc Bảo (2A202601502)**: Viết AI Spec, thiết kế 4 lớp chỗ khó (Rubric R2 & R3).
  - **Trần Hoàng Long (2A202601646)**: Đào data mining & Phân tích khảo sát 24 học viên (Rubric R1).
  - **Trần Đức Bảo (2A202601472)**: Viết Prompt AI & Dựng bộ test `eval/golden_set.json` (Rubric R4).
  - **Nguyễn Sỹ Mạnh Cường (2A202601040)**: Lập trình Working Prototype frontend/backend (Rubric R5).
  - **Phạm Công Đạt (2A202601406)**: Quản lý vòng test user, nộp bài & Slide Demo 5 phút (Rubric R6).
- **Willing users (3 tên)**:
  1. Nguyễn Văn Thành - 2A202601030
  2. Nguyễn Chiến Thắng - 2A202601734
  3. Hồ Ngọc Quỳnh - 2A202601684
