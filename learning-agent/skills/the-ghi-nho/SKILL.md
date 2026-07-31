---
name: the-ghi-nho
description: >
  Tạo bộ thẻ ghi nhớ (flashcards) BỀN VỮNG từ bài học và ôn lặp lại ngắt quãng thật
  (SRS: đúng giãn 3→7→16→35 ngày, sai về 1 ngày — tool flashcards). Dùng khi học viên muốn
  ghi nhớ lâu, "làm flashcard", "thẻ ghi nhớ", "ôn thẻ", học thuộc khái niệm/công thức,
  hoặc than "học xong quên ngay". Không dùng cho kiểm tra một lần (dùng tao-quiz).
license: MIT
metadata:
  author: learning-agent
  version: "2.0"
---

# Thẻ ghi nhớ + spaced repetition thật

Cơ sở: retrieval practice + spacing effect — ôn đúng lúc sắp quên giúp nhớ lâu gấp nhiều lần.
Thẻ được LƯU BỀN VỮNG (tool `flashcards`), lịch ôn tự giãn theo kết quả từng thẻ.

## A. TẠO thẻ mới
- [ ] 1. `get_lesson` lấy bài; chọn 8–15 ý đáng nhớ nhất (khái niệm, định nghĩa, công thức, so sánh).
      Ưu tiên chủ đề 🔴 yếu trong "Mức nắm vững" (hồ sơ) — thêm thẻ cho phần đó.
- [ ] 2. Viết thẻ Hỏi → Đáp, MỖI THẺ MỘT Ý; mặt hỏi không chứa gợi ý đáp án.
- [ ] 3. `flashcards` action='save' với cards=[{q, a, topic}] (topic = chủ đề ngắn của thẻ).
- [ ] 4. Gửi bộ thẻ (đánh số) + hỏi muốn ôn ngay không (sang mục B).
- [ ] 5. Đề nghị ôn định kỳ: học viên đồng ý -> `schedule_task` when='daily 21:00'
      prompt="Ôn flashcard đến hạn: lấy flashcards due, hỏi từng thẻ, chấm bằng grade".
- [ ] 6. `update_student_memory` ghi: đã tạo bộ thẻ bài nào, ngày nào.

## B. ÔN thẻ (khi học viên nói "ôn thẻ", hoặc lịch nhắc chạy)
- [ ] 1. `flashcards` action='due' lấy thẻ đến hạn.
- [ ] 2. Hỏi TỪNG THẺ MỘT: chỉ đưa câu hỏi (q) — KHÔNG lộ đáp án; chờ trả lời.
- [ ] 3. Sau mỗi câu trả lời: so với đáp án (a), nói đúng/sai + giải thích ngắn,
      rồi `flashcards` action='grade' (card_id, correct) — mastery tự cập nhật theo.
- [ ] 4. Hết lượt: tổng kết (x/y đúng), thẻ sai sẽ quay lại NGÀY MAI, thẻ đúng giãn xa dần;
      gợi ý chủ đề nên đọc lại nếu sai nhiều.

## Lưu ý
- Thẻ ghép nhiều ý = thẻ hỏng — tách ra.
- Chấm ngay sau TỪNG thẻ (đừng gom cuối buổi) để lịch ôn chính xác.
