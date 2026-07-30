---
course: packs
generated: '2026-07-30T10:19:54+00:00'
lang: vi
lesson: DATA_DICTIONARY
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/chatlog/DATA_DICTIONARY.md
source_hash: sha256:4bf51da889b5df24e05c051a5063d444016c6aba8fabd1128598e5e02e4ec24a
type: lesson-note
---

## Slide 1 — Dữ liệu tổng quan

Nguồn: DB `VLearn Product Analytics — Production` (Postgres, Superset SQL Lab), kết hợp từ `chat_messages`, `turns`, `conversations` và `llm_calls` (tổng hợp theo từng lượt hỏi-đáp). Phạm vi dữ liệu bao gồm 2,522 dòng (1,261 cặp tin nhắn giữa học sinh và giảng viên) từ 22/07 đến 29/07/2026, với 369 người dùng và 585 hội thoại.

## Slide 2 — Kiểm tra dữ liệu nhạy cảm

Đã quét toàn bộ 2,522 dòng bằng regex/keyword để tìm kiếm các thông tin nhạy cảm như số điện thoại VN, email, số CCCD/CMND (9–12 số), tên, MSSV, địa chỉ, và các từ khóa liên hệ (Zalo/Facebook/Telegram...). 

- Sau khi kiểm tra, 5 dòng ban đầu bị đánh dấu nhưng sau đó xác định là **false positive** khi kiểm tra tay. Các dòng này chứa câu hỏi đùa, nội dung học thuật sử dụng cụm từ “số điện thoại” hoặc giảng viên giải thích khái niệm [[PII]].
- Đặc biệt, phát hiện rằng nền tảng đã có **lớp tự động redact PII**; 12 dòng chứa placeholder `[REDACTED_NAME]` / `[REDACTED_MSSV]`, khi học sinh chọn đoạn slide có tên/MSSV của giảng viên hoặc file.
- **Kết luận:** Dữ liệu trong file đã sạch, không cần thêm biện pháp mask/remove.
- ID nhận diện (`conversation_id`, `user_id`, `turn_id`, `message_id`) đã được thay thế bằng mã ẩn danh (`U0001`, `C0001`, `T0001`, `M0001`...), không thể map ngược về UUID/người thật.

## Slide 3 — Bảng field

| Field | Kiểu | Mô tả | Giá trị quan sát được | Ghi chú |
|---|---|---|---|---|
| `conversation_id` | string | ID hội thoại (đã ẩn danh: `C0001`–`C0585`) | | 1 hội thoại có nhiều lượt hỏi-đáp |
| `user_id` | string | Mã học sinh (đã ẩn danh: `U0001`–`U0369`) | 369 user | Không thể map ngược ra người thật |
| `day_code` | text | Mã bài giảng/tài liệu ngữ cảnh của hội thoại | vd. `Lecture_material_ms2044ey_k6uor3`, `New learning material`, `day02-c301` | `New learning material` xuất hiện nhiều nhất (794 tin nhắn) — có thể là placeholder/bug cần hỏi lại team kỹ thuật |
| `conversation_mode` | text | Chế độ hội thoại | 100% `in_class` trong file này | |
| `turn_id` | string | ID cho mỗi lượt hỏi-đáp (đã ẩn danh: `T0001`–`T1261`) | | 1 lượt bao gồm 2 tin nhắn (học sinh + giảng viên) |
| `turn_status` | text | Trạng thái của lượt hỏi-đáp | 100% `completed` | Không có lượt nào bị lỗi/dở dang trong file |
| `message_id` | string | ID của từng tin nhắn (đã ẩn danh: `M0001`–`M2522`) | | |
| `role` | text | Ai gửi tin nhắn | `student` / `tutor` (mỗi loại 1,261 dòng) | |
| `content` | text | Nội dung tin nhắn nguyên văn | | Đã qua lớp xử lý PII của nền tảng và đã tự kiểm tra lại |
| `move_used` | text | Nước đi sư phạm do giảng viên áp dụng (null cho tin nhắn của học sinh) | `review_concept`(1072) `give_direct_answer`(146) `give_example`(21) `motivate`(7) `give_hint`(4) `validate_understanding`(1) | |
| `citations` | text (jsonb) | Danh sách số trang tài liệu giảng viên trích dẫn khi trả lời | vd. `[45]`, hoặc `[]` | 46.2% rỗng — giảng viên không sử dụng tài liệu làm cơ sở cho câu trả lời |
| `misconceptions` | text (jsonb) | Danh sách hiểu lầm được phát hiện trong câu trả lời | luôn `[]` | **Field chưa từng được dùng** (0/1,261) |
| `follow_ups` | text (jsonb) | Câu hỏi gợi ý tiếp theo | luôn `[]` | **Field chưa từng được dùng** (0/1,261) |
| `rating` | text | Đánh giá của học sinh cho câu trả lời của giảng viên | `up`(33) `down`(37), phần lớn là null | Chỉ ~2.8% số tin nhắn có đánh giá |
| `asked_check_question` | boolean | Giảng viên có chủ động hỏi lại để kiểm tra hiểu bài không | `True`(3) `False`(2515) | Rất hiếm khi sử dụng |
| `message_created_at` | timestamp (UTC) | Thời điểm tạo tin nhắn | 2026-07-22 đến 2026-07-29 | |
| `llm_call_count` | integer | Số lần gọi LLM để tạo ra lượt này | 2–7 lần | Bao gồm cả bước sử dụng công cụ trung gian, không chỉ lần sinh cuối |
| `models_used` | text | Các model LLM được sử dụng trong lượt | `gemini-3.1-flash-lite`(1101) `gemini-3-flash`(160) | |
| `total_input_tokens` | integer | Tổng số input token của lượt | | |
| `total_output_tokens` | integer | Tổng số output token của lượt | | |
| `total_cost_usd` | numeric | Chi phí ước tính (USD) | **luôn = 0.000000** | ⚠️ Theo dõi chi phí đang gặp vấn đề — không nên sử dụng cột này để phân tích chi phí |
| `avg_latency_ms` | integer | Độ trễ trung bình các lệnh gọi LLM trong lượt | median 1,758ms, p90 3,686ms, max 23,848ms | Có outlier gần 24 giây, cần xem xét nguyên nhân trong hackathon |

## Khái niệm chính

- [[PII]]: Thông tin cá nhân nhạy cảm có thể dùng để xác định danh tính một người.
