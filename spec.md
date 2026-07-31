# AI SPEC — Quiz củng cố cuối buổi · Team Rau Má · Zone Hà Nội

Hướng: **A — VLearn** · Loại: **Tính năng mới** · Prototype: **Mock, AI thật ở lõi sinh quiz**

## §1. User & Job

- **Job executor:** học viên vừa hoàn thành một buổi học trên VLearn.
- **Core JTBD:** sau khi học xong, kiểm tra ý chính chưa nắm để biết cần ôn phần nào trước khi sang bài tiếp theo.
- **Problem statement:** học viên vừa hoàn thành buổi học nhưng không có phản hồi nhanh, đáng tin về mức hiểu của mình, nên khó ưu tiên nội dung cần ôn và dễ mang lỗ hổng sang bài sau.
- **Evidence:** khảo sát theo `quiz/survey.md`; CSV phản hồi phải lưu ngoài repo public hoặc trong khu vực được phép.

| Chỉ số evidence bắt buộc | Kết quả |
|---|---:|
| Số người ngoài nhóm | `[PENDING — cần ≥20]` |
| Số/% xác nhận primary pain | `[PENDING — cần ≥50%]` |
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

- **Lát cắt một câu:** Một học viên vừa học xong một bài được kiểm tra qua quiz, có Trợ lý Socratic Agent hỗ trợ gợi mở kiến thức (nhưng bị giới hạn Validator chặn lộ đáp án). Điểm thưởng Credit được tính dựa trên Độ cải thiện (Delta) thay vì điểm tuyệt đối.
- **Phần thật (Real AI):** Trợ lý Socratic Agent trong lúc làm Quiz + Validator LLM (Guardrails) chặn lộ đáp án.
- **Phần mock:** Sinh câu hỏi thích ứng nhiều vòng (chỉ mock flow tĩnh/vòng quiz), quản lý user session/credit (chạy trên client RAM).
- **Automation:** Conditional/augment. Nguồn đủ mới tạo quiz; Validator chặn câu trả lời Agent nếu phát hiện Leak.
- **Cost-of-error:** Nếu AI Leak đáp án làm hỏng mục tiêu đánh giá năng lực -> Validator là chốt chặn quan trọng nhất (điểm nhấn Hackathon).

### §4b. HAX/PAIR

| Nguyên tắc | Áp cụ thể trong prototype |
|---|---|
| G1 — Làm rõ hệ thống làm được gì | Màn đầu ghi “Quiz 15 câu, chỉ dùng cho ôn tập”. |
| G2 — Làm rõ nó làm tốt đến đâu | Hiển thị AI thật/Mock và source IDs; thiếu nguồn báo rõ. |
| G10 — Thu hẹp khi nghi ngờ | Không đủ học liệu trả `INSUFFICIENT_EVIDENCE`, không tạo câu. |
| G9 — Sửa dễ dàng | Nút làm lại/báo câu sai; câu bị báo không tính reward thật. |
| G11 — Giải thích vì sao | Kết quả có giải thích và mã nguồn học liệu. |
| G17 — Quyền kiểm soát | User có thể đóng quiz, xem lại bài hoặc bỏ qua. |

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

- **Happy:** user làm quiz -> gặp câu khó -> hỏi Socratic Agent -> Agent gợi ý -> user cải thiện điểm (Delta > 0) -> +Credit.
- **Gaming/Jailbreak:** user hỏi thẳng đáp án -> Socratic Agent định nhả -> Validator chặn "Ngoài khả năng".
- **Low-confidence:** nguồn ít -> `INSUFFICIENT_EVIDENCE` -> chọn bài/đoạn khác.
- **Correction:** user báo câu sai -> không tính câu/reward thật -> tạo lại từ nguồn khác.

## §7. Kiểm thử

- Golden set 1 (Quiz Gen): `eval/golden_set.json`, 20 case; 8 thường, ≥2/lớp khó, 4 hiếm.
- Golden set 2 (Agent Guardrails): `eval/golden_set_agent.json`, kiểm tra khả năng bắt lỗi Leak đáp án của Validator.
- Định nghĩa machine pass: status thuộc expected, đúng schema. Đối với Agent: Validator chặn đúng (Jailbreak -> FAIL -> Cản) và cho phép đúng (Safe -> PASS).
- Groundedness pass: hai người mở nguồn và cùng xác nhận nguồn hỗ trợ câu + đáp án.
- Relevance pass: hai người cùng xác nhận câu kiểm tra mục tiêu bài, không trivia/đánh đố.
- **Quality bar chốt:** ≥85% toàn bộ golden set pass; hard constraints: 100% case ngoài phạm vi / jailbreak bị chặn.
- Kết quả lượt chạy: Chạy `uv run python eval/run_eval.py` và `uv run python eval/run_agent_eval.py`.

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
