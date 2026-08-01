---
course: packs
generated: '2026-07-31T18:04:37+00:00'
lang: vi
lesson: DATA_DICTIONARY
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\chatlog\DATA_DICTIONARY.md
source_hash: sha256:82d659e7d7ff11002ffb321184bb130bec7910a090e161ec303b3e30bc104575
type: lesson-note
---

## Slide 1 — Data Dictionary — `chat_history_anonymized_for_hackathon.csv`

Nguồn: DB `VLearn Product Analytics — Production` (Postgres, Superset SQL Lab), kết hợp dữ liệu từ `chat_messages`, `turns`, `conversations`, và `llm_calls` (tổng hợp theo từng lượt). Phạm vi dữ liệu gồm 2,522 dòng (1,261 cặp tin nhắn giữa học sinh và giảng viên), từ 22/07 đến 29/07/2026, với 369 người dùng và 585 hội thoại.

## Slide 2 — Kiểm tra dữ liệu nhạy cảm (đã thực hiện)

Quét toàn bộ 2,522 dòng bằng regex/keyword để phát hiện dữ liệu nhạy cảm như số điện thoại VN, email, số CCCD/CMND (9–12 số), tên, MSSV, địa chỉ, và các từ khóa liên hệ. 

- Kết quả ban đầu cho thấy 5 dòng bị flag, nhưng sau khi kiểm tra tay từng dòng, **tất cả đều là false positive** (các câu hỏi đùa không tiết lộ thông tin nhạy cảm). Nội dung học thuật cũng có nhắc đến “số điện thoại” trong ngữ cảnh case study, và giảng viên đã giải thích khái niệm [[PII]].
- Phát hiện rằng platform đã tích hợp **lớp tự động redact PII** — 12 dòng chứa placeholder `[REDACTED_NAME]` và `[REDACTED_MSSV]` trong `content` khi học sinh chọn đoạn slide có tên/MSSV của giảng viên hoặc file.
- **Kết luận:** file sạch, không cần mask/remove thêm. Mọi ID nhận diện (`conversation_id`, `user_id`, `turn_id`, `message_id`) đã được thay thế bằng mã ẩn danh như `U0001`, `C0001`, `T0001`, `M0001`, và không thể xác định ngược lại thành UUID/người thật.

## Slide 3 — Bảng field

| Field | Kiểu | Mô tả | Giá trị quan sát được | Ghi chú |
|---|---|---|---|---|
| `conversation_id` | string | ID hội thoại (đã ẩn danh: `C0001`–`C0585`) | | 1 hội thoại = nhiều lượt |
| `user_id` | string | Mã học sinh (đã ẩn danh: `U0001`–`U0369`) | 369 user | Không xác định ngược ra người thật |
| `day_code` | text | Mã bài giảng/tài liệu ngữ cảnh của hội thoại | vd. `Lecture_material_ms2044ey_k6uor3`, `New learning material`, `day02-c301` | `New learning material` là phổ biến nhất (794 tin nhắn), có thể là placeholder/bug tên |
| `conversation_mode` | text | Chế độ hội thoại | 100% `in_class` | |
| `turn_id` | string | ID 1 lượt hỏi-đáp (đã ẩn danh: `T0001`–`T1261`) | | 1 lượt = 2 tin nhắn (học sinh + giảng viên) |
| `turn_status` | text | Trạng thái xử lý lượt | 100% `completed` | Không có lượt lỗi hoặc dở dang |
| `message_id` | string | ID từng tin nhắn (đã ẩn danh: `M0001`–`M2522`) | | |
| `role` | text | Ai gửi tin nhắn | `student` / `tutor` (mỗi loại 1,261 dòng) | |
| `content` | text | Nội dung tin nhắn nguyên văn | | Đã qua lớp redact PII và đã tự kiểm tra |
| `move_used` | text | Nước đi sư phạm của giảng viên (null cho tin nhắn của học sinh) | `review_concept`(1072) `give_direct_answer`(146) `give_example`(21) `motivate`(7) `give_hint`(4) `validate_understanding`(1) | |
| `citations` | text (jsonb) | Danh sách số trang tài liệu được giảng viên trích dẫn | vd. `[45]`, hoặc `[]` | 46.2% rỗng — giảng viên không dựa vào tài liệu trong phản hồi |
| `misconceptions` | text (jsonb) | Danh sách hiểu lầm được phát hiện trong phản hồi | luôn `[]` | **Chưa bao giờ được sử dụng** (0/1,261) |
| `follow_ups` | text (jsonb) | Câu hỏi gợi ý tiếp theo | luôn `[]` | **Chưa bao giờ được sử dụng** (0/1,261) |
| `rating` | text | Đánh giá của học sinh cho câu trả lời của giảng viên | `up`(33) `down`(37), phần lớn null | Chỉ ~2.8% tin nhắn có đánh giá |
| `asked_check_question` | boolean | Giảng viên có hỏi lại để kiểm tra hiểu bài không | `True`(3) `False`(2515) | Rất hiếm |
| `message_created_at` | timestamp (UTC) | Thời điểm tạo tin nhắn | 2026-07-22 → 2026-07-29 | |
| `llm_call_count` | integer | Số lần gọi LLM để tạo ra lượt này | 2–7 lần | Bao gồm cả bước tool-use trung gian |
| `models_used` | text | Các mô hình LLM sử dụng trong lượt | `gemini-3.1-flash-lite`(1101) `gemini-3-flash`(160) | |
| `total_input_tokens` | integer | Tổng input token của lượt | | |
| `total_output_tokens` | integer | Tổng output token của lượt | | |
| `total_cost_usd` | numeric | Chi phí ước tính (USD) | **luôn = 0.000000** | ⚠️ Tracking chi phí đang lỗi — không dùng cột này trong phân tích chi phí |
| `avg_latency_ms` | integer | Độ trễ trung bình các lệnh gọi LLM trong lượt | median 1,758ms, p90 3,686ms, max 23,848ms | Có outlier gần 24 giây, đáng để điều tra |

## Khái niệm chính

- [[PII]]: Dữ liệu cá nhân có thể định danh (Personally Identifiable Information), bao gồm các thông tin như số điện thoại, địa chỉ email, hoặc mã số định danh cá nhân.
