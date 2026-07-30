# AI SPEC — VLearn Active Recall · Nhóm 5tuat
**Hướng:** [X] A — VLearn  
**Loại:** [X] Tính năng mới

---

## §1. User & Job

- **Job executor + workflow**: Học viên khóa AI Thực Chiến ngay sau khi kết thúc 1 bài giảng hoặc xem xong video/slide bài học (Cụ thể: Buổi Day 01 — *AI & LLM Foundation* hoặc Day 02 — *Xác định bài toán cho AI*).
  - *Workflow hiện tại*: Xem video/slide bài giảng ➔ Nghĩ rằng mình đã hiểu bài (Ảo tưởng hiểu bài) ➔ Bắt tay làm bài tập lớn/Quiz ➔ Phát hiện bị sai/hổng kiến thức cốt lõi ➔ Tốn thời gian làm lại hoặc bị trừ điểm.
- **Core JTBD** *(không chứa từ AI / tên sản phẩm)*: Kiểm tra và xác nhận mức độ hiểu bài thực tế của bản thân ngay sau buổi học để tự tin áp dụng kiến thức vào bài tập lớn mà không bị hổng kiến thức cốt lõi.
- **Problem statement** *(KHÔNG chữ AI)*: Học viên thường rơi vào trạng thái "ảo tưởng đã hiểu bài" (Illusion of Competence) sau khi xem slide hoặc nghe giảng, nhưng thực chất bị hiểu sai hoặc hổng các khái niệm quan trọng mà không tự biết cho đến khi bị trừ điểm hoặc bị chỉ ra lỗi trong bài tập lớn.
- **Evidence** *(Đạt cả chuẩn B - Mining Data và chuẩn A - Khảo sát thực tế)*:
  - **Số liệu Mining Data (Đường B)** — Trích xuất từ dataset `chat_history_anonymized_for_hackathon.csv` (2.522 lượt chat thật):
    1. `asked_check_question = False` ở **2.515 / 2.518 lượt chat (99.88%)**: AI Tutor hiện tại vận hành hoàn toàn thụ động, gần như không bao giờ chủ động đặt câu hỏi kiểm tra lại mức độ hiểu bài của học viên.
    2. `misconceptions = []` ở **100% lượt chat (0 / 1.261 lượt dùng)**: Field phát hiện hiểu lầm trong DB chưa từng được triển khai.
  - **Kết quả Khảo sát thực tế (Đường A — Đạt chuẩn $\ge 20$ mẫu)** — Trích xuất từ bộ dữ liệu khảo sát mới nhất ($N = 36$ học viên trong lớp):
    1. **88.88% (32/36 học viên)** xác nhận *sẵn sàng làm một bài Quiz ngắn ngay sau bài học* để hệ thống kiểm tra lại mức độ hiểu bài (17 bạn hoàn toàn sẵn sàng, 15 bạn sẵn sàng nếu Quiz thực sự ngắn).
    2. **91.66% (28/36 học viên)** đồng ý *chia sẻ lịch sử câu sai của mình với AI* để hệ thống phát hiện lỗ hổng kiến thức & gợi ý chủ đề ôn tập (điểm 3-5/5).
    3. **88.88% (32/36 học viên)** đồng ý *chuyển câu hỏi/vùng slide chưa hiểu cho Giảng viên/TA* khi làm Quiz không đạt (trong đó 38.9% yêu cầu nút "Đồng ý gửi" trước khi gửi - Cơ sở cho PAIR Control).

---

## §2. Impact & quyết định chọn

- **Bảng impact 3 ứng viên**:

| Ứng viên | Số người gặp | Tần suất | Mỗi lần tốn gì | Build nổi trong 1.5 ngày? | Quyết định |
|---|---|---|---|---|---|
| **1. VLearn Active Recall (Kiểm tra hiểu thật & Bắt lỗi Misconception)** | 1.000 HV | Sau mỗi buổi học (2-3 lần/tuần) | Hổng kiến thức cốt lõi ➔ Làm sai bài tập lớn, mất 2-3h sửa lại | **Có** (RAG + Prompt Evaluation) | **CHỌN** |
| 2. Phân loại & Fix Tutor trả lời lan man | 1.000 HV | Mỗi lần hỏi tutor | Tốn 2-5 phút đọc câu trả lời dài lê thê không đúng ý | Có (Prompt Tuning) | Bị loại (Bằng chứng yếu hơn ứng viên 1) |
| 3. Tự động chuyển câu hỏi cho TA trên Discord | ~200 HV | Khi tutor không biết | Chờ TA rep 15-30 phút | Khó (Cần setup Discord Bot Webhook) | Bị loại (Không thuộc VLearn) |

- **Ứng viên ĐÃ LOẠI + vì sao**: Loại ứng viên 2 & 3 vì ứng viên 1 có **bằng chứng khảo sát thực tế vượt chuẩn (N=36 mẫu, 88.88% nhu cầu)** và tận dụng được 100% data transcript sạch có sẵn trong repo.
- **Ứng viên CHỌN + vì sao (bằng số)**: Chọn **VLearn Active Recall** vì phục vụ 1.000 học viên, 88.88% học viên khao khát tính năng này, chứng minh được bằng 99.88% dữ liệu chatlog chưa có tính năng kiểm tra bài.

---

## §3. Giải pháp tương tự đã nghiên cứu

- **Khanmigo (Khan Academy)**:
  - *Flow*: Đặt câu hỏi kiểm tra sau từng video bài học.
  - *Đáng học*: Luôn đưa ra gợi ý nhỏ (hints) chứ không đưa đáp án ngay.
  - *Đáng né*: Hỏi nhiều câu trắc nghiệm quá đơn giản, không kiểm tra được khả năng áp dụng tình huống.
  - *Mình khác gì*: Sinh câu hỏi tình huống tự luận bám sát transcript và chỉ ra chính xác trích dẫn `[Txx-xxx]`.
- **Duolingo (Smart Review)**:
  - *Flow*: Thống kê các từ/mẫu câu sai nhiều nhất để nhắc ôn tập lại.
  - *Đáng học*: Hiển thị trực quan khái niệm bạn đang gặp khó khăn.
  - *Đáng né*: Lặp đi lặp lại câu hỏi cũ gây chán.
  - *Mình khác gì*: Tập trung phát hiện **Hiểu lầm khái niệm (Misconceptions)** thay vì nhớ vẹt.

---

## §4. Thiết kế

- **Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả)**:
  > *"Dành cho học viên vừa học xong bài Day 01, AI tự động sinh 3-5 câu hỏi tình huống bám sát transcript bài giảng `[T01-xxx]`, chấm điểm câu tự luận của học viên và chỉ ra chính xác khái niệm học viên đang hiểu sai kèm trích dẫn trang slide/transcript."*
- **Non-goals (3 thứ KHÔNG build)**:
  1. KHÔNG build hệ thống chấm bài tập tự động thay cho giảng viên.
  2. KHÔNG build tính năng phát giọng nói/video giải thích (chỉ tập trung vào văn bản + trích dẫn).
  3. KHÔNG build tính năng thảo luận nhóm realtime.
- **Mức prototype nhắm tới**: **Working Prototype** (Giao diện HTML/JS mô phỏng VLearn + Gọi API Gemini/OpenAI chạy thật 100%).
- **Automation**: **Conditional Automation** (AI tự động chấm & gợi ý nhận xét; trường hợp học viên muốn chuyển cho TA thì phải có nút bấm xác nhận).
  - *Lý do theo Cost-of-Error*: Hiểu sai kiến thức dẫn đến hỏng bài tập lớn, nhưng nếu tự động gửi cho TA khi chưa hỏi ý kiến sẽ khiến 38.9% học viên cảm thấy bị làm phiền/sợ bị đánh giá.

---

### §4b. Nguyên tắc HAX / PAIR đã áp dụng (≥4 nguyên tắc)

| Nguyên tắc HAX/PAIR | Áp dụng cụ thể vào đâu trong Prototype |
|---|---|
| **G1 (HAX): Làm rõ hệ thống làm được gì** | Hiển thị thông báo ngay đầu bài test: *"AI sẽ kiểm tra mức độ hiểu bài của bạn dựa trên nội dung Slide Day 01 và chỉ ra các điểm nhầm lẫn khái niệm."* |
| **G2 (HAX): Làm rõ nó làm tốt đến đâu** | Gắn nhãn trích dẫn `[T01-xxx]` cạnh nhận xét của AI để học viên biết câu trả lời dựa trên slide chính thức chứ không phải kiến thức trôi nổi. |
| **PAIR (Feedback & Control)** | Thiết kế nút *"Đồng ý gửi cho TA hỗ trợ"* để học viên toàn quyền quyết định khi nào cần nhờ giảng viên giải đáp thêm. |
| **G10 (HAX): Thu hẹp phạm vi khi nghi ngờ** | Khi câu trả lời của học viên quá ngắn hoặc mơ hồ, AI không đoán bậy mà yêu cầu học viên giải thích chi tiết hơn 1 câu. |

---

## §5. Kiểu lỗi — 4 lớp chỗ khó + Kịch bản rủi ro (≥8 kịch bản)

| # | Lớp chỗ khó | Kịch bản rủi ro cụ thể | Trải nghiệm & Cách xử lý khi gặp |
|---|---|---|---|
| 1 | **① Nguồn sự thật** | AI bịa ra kiến thức ngoài bài giảng (Ví dụ: Hỏi GPT-5 ra năm nào) | AI từ chối và phản hồi: *"Kiến thức này không nằm trong slide Day 01. Vui lòng quay lại chủ đề bài học."* |
| 2 | **① Nguồn sự thật** | AI đưa trích dẫn sai mã trang slide / transcript không tồn tại | Bắt buộc kiểm tra mã trích dẫn với bộ index `[Txx-xxx]`. Nếu không tìm thấy mã ➔ Không hiển thị citation. |
| 3 | **② Mơ hồ / Thiếu thông tin** | Học viên nhập câu trả lời cụt ngủn ("Em nghĩ vậy", "Có") | AI phản hồi: *"Câu trả lời quá ngắn. Bạn vui lòng giải thích lý do cụ thể để AI phân tích được chính xác."* |
| 4 | **② Mơ hồ / Thiếu thông tin** | Học viên dùng từ lóng hoặc viết tắt không rõ nghĩa | AI hỏi lại 1 câu ngắn để xác nhận ý intent của học viên trước khi đưa ra nhận xét. |
| 5 | **③ Ngoài phạm vi** | Học viên nhờ AI làm hộ toàn bộ bài tập lớn của khóa học | AI từ chối: *"Tôi chỉ hỗ trợ kiểm tra hiểu bài và giải thích khái niệm. Vui lòng tự thực hiện bài tập lớn."* |
| 6 | **③ Ngoài phạm vi** | Học viên hỏi về quy chế điểm số hoặc deadline nộp bài | AI chuyển hướng: *"Câu hỏi quy chế vui lòng kiểm tra tại kênh Discord chính thức của khóa học."* |
| 7 | **④ Đặc thù domain** | Học viên nhầm giữa *Self-Attention* với việc mô hình hiểu ngữ nghĩa như con người | AI phát hiện lỗi Misconception này và trích dẫn ngay Slide 22 [T01-022] để đính chính cơ chế xác suất vector. |
| 8 | **④ Đặc thù domain** | Học viên nhầm giữa mô hình *Dense* và *Mixture of Experts (MoE)* | AI chỉ ra điểm sai: MoE chỉ kích hoạt một số chuyên gia (2/8 experts) cho mỗi token chứ không chạy toàn bộ tham số. |

---

## §6. Bốn đường đi của trải nghiệm

- **Happy path**: Học viên đọc hết slide ➔ Bấm "Kiểm tra bài" ➔ Nhận câu hỏi tình huống ➔ Trả lời tự luận ➔ AI phân tích đúng/sai + phát hiện hiểu lầm + dẫn nguồn `[T01-022]`.
- **Low-confidence**: Học viên trả lời chưa rõ ➔ AI hỏi lại 1 câu để xác nhận ý trước khi đưa ra kết luận.
- **Failure / Không căn cứ**: Kiến thức nằm ngoài bài giảng ➔ AI thông báo không có trong phạm vi bài học và đề xuất quay lại tài liệu chính thức.
- **Khi bị đòi ngoài phạm vi**: Học viên yêu cầu giải bài tập hộ ➔ AI nhắc nhở mục tiêu là kiểm tra hiểu bài và từ chối giải hộ.

---

## §7. Kiểm thử & Quality Bar

- **Chiều chất lượng & Định nghĩa kiểm chứng được**:
  1. *Độ chính xác bắt lỗi Misconception*: AI phát hiện đúng 100% các lỗi nhầm lẫn khái niệm kinh điển.
  2. *Grounding*: 100% nhận xét đều có mã trích dẫn `[Txx-xxx]` hợp lệ.
- **Golden set**: 20 test cases (Xây dựng trong file `eval/golden_set.json`).
- **Quality Bar (Chốt 23:59 N1)**: *"Đạt khi $\ge 85\%$ số test cases qua bộ kiểm thử golden set và không bịa trích dẫn sai."*
- **Kết quả các lượt chạy (Bảng cập nhật)**:

| Lượt chạy | Ngày | Số case qua | % Đạt | Ghi chú |
|---|---|---|---|---|
| Lượt 1 (Baseline) | 30/07 | 15/20 | 75.0% | Thiếu trích dẫn ở một số case mơ hồ |
| Lượt 2 (Prompt Tuning) | 30/07 | 18/20 | 90.0% | **Đạt Quality Bar ($\ge 85\%$)** |

---

## §8. Phân công & Kế hoạch (Nhóm 5tuat)

- **Phân công có tên cụ thể**:
  - **Phạm Quốc Bảo (2A202601502)** — Product Manager / Spec Lead: Viết AI Spec, thiết kế 4 lớp chỗ khó & HAX/PAIR (§4, §5).
  - **Trần Hoàng Long (2A202601646)** — Data & Evidence Lead: Đào dữ liệu chatlog & Phân tích khảo sát $N=36$ (§1, §2).
  - **Trần Đức Bảo (2A202601472)** — Prompt & Eval Lead: Xây dựng Prompt AI & Bộ test `eval/golden_set.json` (§7).
  - **Nguyễn Sỹ Mạnh Cường (2A202601040)** — Code Prototype Lead: Lập trình Working Prototype `codebase/index.html` (§4).
  - **Phạm Công Đạt (2A202601406)** — User Validation & Presentation Lead: Vòng test 3 Willing Users (`validation/`) & Slide Demo 5 phút.
- **Willing users (3 tên)**:
  1. Nguyễn Văn Thành - 2A202601030
  2. Nguyễn Chiến Thắng - 2A202601734
  3. Hồ Ngọc Quỳnh - 2A202601684

---

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 30/07 15:00 | Khởi tạo Spec v1.0 | Nộp Checkpoint 1 (Canvas) |
| 30/07 16:35 | Cập nhật Evidence $N=36$ khảo sát | Long merge dữ liệu khảo sát mới nhất |
| 30/07 16:45 | Hoàn thiện §4b HAX/PAIR & §5 8 Kịch bản rủi ro | Rà soát chuẩn hóa Spec trước mốc 23:59 N1 |
