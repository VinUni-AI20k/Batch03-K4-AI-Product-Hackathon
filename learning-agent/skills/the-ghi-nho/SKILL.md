---
name: the-ghi-nho
description: >
  Tạo bộ thẻ ghi nhớ (flashcards) từ bài học và tự động lên lịch ôn lặp lại ngắt quãng
  (spaced repetition 1-3-7 ngày). Dùng khi học viên muốn ghi nhớ lâu, "làm flashcard",
  "thẻ ghi nhớ", học thuộc khái niệm/công thức, hoặc than "học xong quên ngay".
  Không dùng cho kiểm tra một lần (dùng tao-quiz).
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Thẻ ghi nhớ + lặp lại ngắt quãng

Cơ sở: retrieval practice + spacing effect — ôn đúng lúc sắp quên giúp nhớ lâu gấp nhiều lần.

## Quy trình
- [ ] 1. `get_lesson` lấy bài; chọn 8–15 ý đáng nhớ nhất (khái niệm, định nghĩa, công thức, so sánh).
- [ ] 2. Viết thẻ dạng Hỏi → Đáp, MỖI THẺ MỘT Ý duy nhất; mặt hỏi không chứa gợi ý đáp án.
- [ ] 3. Gửi bộ thẻ cho học viên (đánh số), hỏi họ muốn ôn ngay vài thẻ không.
- [ ] 4. `schedule_task` ba lịch ôn ngắt quãng: '1 ngày sau', '3 ngày' và '7 ngày' —
      prompt dạng: "Ôn flashcards bài <tên bài>: hỏi học viên 5 thẻ ngẫu nhiên trong bộ, chấm và chữa".
      (when dùng: '24h', '72h', '168h')
- [ ] 5. `update_student_memory` ghi: đã tạo bộ thẻ bài nào, ngày nào.

## Lưu ý
- Thẻ ghép nhiều ý = thẻ hỏng — tách ra.
- Khi ôn: hỏi TRƯỚC, chờ học viên trả lời rồi mới hiện đáp án; sai thì giải thích ngắn + trích nguồn bài.
