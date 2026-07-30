# 02 — Trình Sinh Quiz (Quiz Generation) & Fallback

**What to build:** Khả năng tạo đề trắc nghiệm cá nhân hoá. Cài đặt schema (`concepts`, `questions`, `attempts`), API `/quizzes/generate` gọi Gemini LLM sinh câu hỏi nếu thiếu, tránh lặp lại câu cũ bằng query `NOT IN attempts`, và báo lỗi 503 nếu AI sập. Đấu nối vào UI Phase 0 và 1 của tab "Học thích ứng".

**Blocked by:** None — can start immediately

**Status:** ready-for-agent

- [ ] Schema `concepts` (với single `prerequisite_id`), `questions` (không dùng mảng `used_by[]`), và `attempts` được thiết lập.
- [ ] API `/quizzes/generate` truy vấn Database loại bỏ các câu hỏi user đã làm (dựa trên bảng `attempts`).
- [ ] API `/quizzes/generate` biết gọi Gemini LLM để sinh câu hỏi mới khi kho câu hỏi cạn kiệt, xử lý lỗi trả về 503 khi LLM timeout/lỗi.
- [ ] Giao diện Phase 0 và Phase 1 của thẻ "Học thích ứng" trong file HTML được đấu nối, bấm "Tạo quiz" sẽ gọi API thật. Giao diện xử lý hiển thị báo lỗi khi hệ thống bận (nhận mã lỗi 503).
