# AI SPEC — Quiz củng cố cuối buổi · Team Rau Má · Zone Hà Nội

Hướng: **A — VLearn** · Loại: **Tính năng mới** · Prototype: **Mock, AI thật ở lõi sinh quiz**

## §1. User & Job

- **Job executor:** học viên vừa hoàn thành một buổi học trên VLearn.
- **Core JTBD:** sau khi học xong, kiểm tra ý chính chưa nắm để biết cần ôn phần nào trước khi sang bài tiếp theo.
- **Problem statement:** học viên vừa hoàn thành buổi học nhưng không có phản hồi nhanh, đáng tin về mức hiểu của mình, nên khó ưu tiên nội dung cần ôn và dễ mang lỗ hổng sang bài sau.
- **Evidence:** khảo sát theo `quiz/survey.md`; CSV phản hồi phải lưu ngoài repo public hoặc trong khu vực được phép.

| Chỉ số evidence bắt buộc | Kết quả |
|---|---:|
| Số người ngoài nhóm | `[Đạt — 20 người]` |
| Số/% xác nhận primary pain | `[Đạt — 15/20 (75%) xác nhận]` |
| Tần suất gặp | `[PENDING]` |
| Thời gian mất/lần | `[PENDING]` |
| ≥5 quote nguyên văn + người nói | `[PENDING]` |

**Không được chốt evidence cho tới khi thay toàn bộ ô PENDING bằng dữ liệu thật.**

## §2. Impact & quyết định chọn

| Ứng viên | Bao nhiêu người | Tần suất | Tốn gì/lần | Khả thi | Quyết định |
|---|---:|---:|---:|---|---|
| Không biết mình hiểu đúng chưa | `[PENDING]` | `[PENDING]` | `[PENDING]` | Cao | Ứng viên chính |
| Không biết cần ôn phần nào | `[PENDING]` | `[PENDING]` | `[PENDING]` | Cao | Ứng viên gần |
| Không có bài tự kiểm tra ngắn | `[PENDING]` | `[PENDING]` | `[PENDING]` | Cao | Ứng viên gần |
| Quiz hiện có quá dài | `[PENDING]` | `[PENDING]` | `[PENDING]` | Trung bình | Có thể loại |

Chọn ứng viên có tỷ lệ xác nhận, tần suất và hậu quả mạnh nhất sau khảo sát; giữ mọi ứng viên bị loại và lý do bằng số.

## §3. Giải pháp tương tự đã nghiên cứu

| Sản phẩm | Flow cần quan sát | Đáng học | Đáng né | Điểm khác của nhóm |
|---|---|---|---|---|
| ChatGPT Study Mode | Hỏi dẫn dắt và kiểm tra hiểu | Feedback theo bước | Có thể rời nguồn môn học | Quiz bám đúng học liệu VLearn |
| Quizlet | Flashcard/quiz nhanh | Nhịp làm ngắn | User phải chuẩn bị bộ học liệu | Tự lấy bài vừa học |
| Duolingo | Bài ngắn + streak/reward | Feedback tức thì | Reward có thể lấn át mục tiêu học | Credit có cap và chỉ dùng ôn tập |

Nhóm cần ghi log quan sát trực tiếp từng sản phẩm trước CP4.

## §4. Thiết kế

- **Lát cắt một câu:** Một học viên vừa học xong một bài tự làm quiz ôn tập được AI phân bổ lại số câu/độ khó theo từng chủ đề dựa trên năng lực ước lượng của chính học viên đó qua nhiều vòng, có thể hỏi một trợ lý bị giới hạn lượt/token trong lúc làm quiz, để đạt ngưỡng % hiểu bài tối thiểu (threshold) ở mọi chủ đề trước khi chuyển sang bài tiếp theo.
- **Non-goals:** không tích hợp điểm học phần; không dùng trong đánh giá chính thức (thi/điểm học phần) — trợ lý trong quiz chỉ tồn tại trong chế độ ôn tập không tính điểm; không tạo ngân hàng toàn khóa; không chẩn đoán năng lực dài hạn (chỉ ước lượng theo phiên + học liệu buổi đó); không cấp reward thật khi chưa duyệt; **trợ lý không được tiết lộ trực tiếp đáp án đúng của câu đang làm**; **credit không được cộng dồn vô hạn** — có cap cứng và không thay thế quota nền.
- **Phần thật:** AI sinh câu hỏi theo từng vòng bám nguồn (transcript), chấm MCQ deterministic, ước lượng mastery theo topic sau mỗi vòng, agent-trong-quiz trả lời có validator chặn lộ đáp án và lưu trace.
- **Phần mock:** login, giá trị credit khởi tạo, liên kết LMS/backend thật, quy trình duyệt của giảng viên trước khi công nhận credit là "thật".
- **Automation:** Conditional/augment, hai tầng quyết định:
  1. *Sinh câu theo vòng* — chỉ tạo khi nguồn đủ cho topic đó; dừng khi mọi topic ≥ threshold hoặc hết round cap (tối đa 3 vòng); nguồn thiếu hoặc sai schema thì không hiển thị, giữ câu hỏi giáo viên làm fallback.
  2. *Agent trả lời trong quiz* — chỉ hiển thị response đã qua validator "không lộ đáp án"; response không qua validator không tính vào quota đã dùng của học viên (để không phạt học viên vì lỗi hệ thống).
- **Cost-of-error:** đáp án bị lộ qua agent làm sai lệch ước lượng mastery (học viên có vẻ hiểu nhưng chỉ được mớm) → hệ thống quyết định ôn tập sai hướng và cấp credit sai người; chi phí từ chối trả lời khi nghi ngờ (agent quá thận trọng) luôn thấp hơn chi phí lộ đáp án.
- **Công bằng giữa nhóm năng lực (quyết định cốt lõi để tránh vòng lặp giỏi-càng-giỏi):**
  - Quota lượt hỏi/token *nền* của agent-trong-quiz là như nhau cho mọi học viên, không phụ thuộc điểm quiz trước đó.
  - Credit tích lũy chỉ cộng thêm *trên* quota nền (không phải điều kiện để có quota tối thiểu) và được tính theo **mức cải thiện mastery so với vòng trước** (delta), không tính theo điểm tuyệt đối — học viên yếu cải thiện nhiều vẫn nhận credit ngang hoặc hơn học viên giỏi vốn đã cao.
  - Credit có cap cứng (giữ mock 0–20) và có mốc reset/giảm dần theo kỳ để không tạo lợi thế tích lũy không giới hạn.

### §4b. HAX/PAIR

| Nguyên tắc | Áp cụ thể trong prototype |
|---|---|
| G1 — Làm rõ hệ thống làm được gì | Màn đầu ghi "Quiz ôn tập, độ khó tự điều chỉnh theo năng lực, chỉ dùng cho ôn tập". |
| G2 — Làm rõ nó làm tốt đến đâu | Hiển thị AI thật/Mock, source IDs, và mastery % ước lượng kèm số câu làm căn cứ (để biết % đó tin cậy đến đâu). |
| G5 — Đúng chuẩn mực xã hội/học thuật | Agent-trong-quiz chỉ gợi ý kiểu Socratic (đặt câu hỏi dẫn dắt, trỏ nguồn), không bao giờ đọc đáp án hộ — như một trợ giảng thật trong buổi tự ôn. |
| G6 — Giảm thiên lệch giữa nhóm | Quota nền của agent bằng nhau cho mọi học viên bất kể năng lực; credit chỉ cộng thêm, không phải điều kiện được hỗ trợ tối thiểu. |
| G10 — Thu hẹp khi nghi ngờ | Không đủ học liệu cho một topic trả `INSUFFICIENT_EVIDENCE` cho đúng topic đó, không chặn toàn bộ quiz. |
| G9 — Sửa dễ dàng | Nút làm lại/báo câu sai; câu bị báo không tính vào mastery lẫn credit thật. |
| G11 — Giải thích vì sao | Kết quả có giải thích, mã nguồn học liệu, và lý do vì sao vòng sau đổi độ khó/chủ đề. |
| G16 — Cho biết hậu quả trước khi hành động | Trước khi dùng 1 lượt hỏi hoặc đổi credit lấy quota, hiển rõ "dùng lượt này trừ bao nhiêu, còn lại bao nhiêu" trước khi học viên xác nhận. |
| G17 — Quyền kiểm soát | Học viên có thể đóng quiz, xem lại bài hoặc bỏ qua vòng bổ sung bất kỳ lúc nào. |

## §5. Kiểu lỗi — 4 lớp và ≥8 kịch bản

| # | Lớp | Trigger | Hành vi mong muốn | Nguyên tắc |
|---:|---|---|---|---|
| 1 | ① Nguồn sự thật | Source ID không tồn tại | Chặn tạo quiz, báo chọn học liệu khác | G10 |
| 2 | ① Nguồn sự thật | Câu/đáp án không được nguồn hỗ trợ | Validator/chấm tay fail; không tính reward | G11 |
| 3 | ② Mơ hồ | Chỉ có một đoạn ngắn | Trả insufficient hoặc chỉ tạo khi vẫn đủ 3 ý công bằng | G10 |
| 4 | ② Mơ hồ | User sai nhưng lý do chưa rõ | Chỉ giải thích đáp án; không suy đoán misconception | G2 |
| 5 | ③ Ngoài phạm vi | Yêu cầu dùng credit trong bài thi thật | Từ chối và nhắc credit chỉ dùng ôn tập | G1 |
| 6 | ③ Ngoài phạm vi | Yêu cầu tự tăng cap | Giữ cap 20, không tự cấp quyền | G17 |
| 7 | ④ Domain | Hai đáp án cùng đúng | Không render/case fail; sửa prompt và chạy lại set | G9 |
| 8 | ④ Domain | Câu trivia/đánh đố | Chấm relevance fail; thay bằng câu mục tiêu bài | G2 |

## §6. Bốn đường đi trải nghiệm

- **Happy:** nguồn đủ → AI tạo 15 MCQ → user làm → đạt ≥12/15 → xem phần cần ôn → +1 credit mock.
- **Low-confidence:** nguồn ít → `INSUFFICIENT_EVIDENCE` → chọn bài/đoạn khác.
- **Failure:** API/schema/source lỗi → không render output → dùng quiz mock có nhãn hoặc thử lại.
- **Correction:** user báo câu sai → không tính câu/reward thật → tạo lại từ nguồn khác.

## §7. Kiểm thử

- Golden set: `eval/golden_set.json`, 20 case; 8 thường, ≥2/lớp khó, 4 hiếm, 10 case phát triển từ chatlog chỉ lưu turn ID.
- Định nghĩa machine pass: status thuộc expected, đúng schema, 15 câu, 4 options, correct 0–3, source IDs hợp lệ.
- Groundedness pass: hai người mở nguồn và cùng xác nhận nguồn hỗ trợ câu + đáp án.
- Relevance pass: hai người cùng xác nhận câu kiểm tra mục tiêu bài, không trivia/đánh đố.
- **Quality bar chốt:** ≥85% toàn bộ golden set pass; hard constraints: 100% câu render có nguồn hỗ trợ, 100% case ngoài phạm vi bị xử lý đúng.
- Kết quả lượt chạy: `[PENDING — chạy uv run python eval/run_eval.py sau khi đặt OPENAI_API_KEY]`.

## §8. Phân công & kế hoạch

| Workstream | Người phụ trách |
|---|---|
| Evidence/survey | `[PENDING — tên thành viên]` |
| Spec/product | `[PENDING — tên thành viên]` |
| Prompt/eval | `[PENDING — tên thành viên]` |
| Code/prototype | `[PENDING — tên thành viên]` |
| Validation/demo | `[PENDING — tên thành viên]` |

Willing users: Lâm Vũ, Lê Văn Tuấn, Cao Hương Giang — D303. Validation 14:00 ngày 2, cộng thêm ≥2 người ngoài nhóm.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao/evidence |
|---|---|---|
| CP1 | Chọn Quiz củng cố cuối buổi | Pain hypothesis cần khảo sát |
| CP2 | Build Mock bấm được | Chứng minh flow 15 câu → result → credit |
| CP3 | Thêm OpenAI API, validator, trace, golden set | Đưa AI thật vào quyết định trung tâm |
| CP5 | `[PENDING]` | Phải trỏ về feedback thật |