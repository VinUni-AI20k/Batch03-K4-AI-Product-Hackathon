---
name: tu-danh-gia-tuan
description: >
  Tự đánh giá cuối tuần (metacognition): dẫn học viên nhìn lại tuần học — đã học gì,
  cách học nào hiệu quả, tuần tới đổi gì — rồi điều chỉnh lộ trình. Dùng cuối tuần,
  khi học viên nói "tuần này học được gì nhỉ", "review tuần", cảm giác học nhiều mà
  không vào, hoặc do cron cuối tuần kích hoạt.
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Tự đánh giá tuần (metacognition)

Cơ sở: người học giỏi khác người học chăm ở chỗ họ đánh giá được CÁCH mình học và tự điều chỉnh.

## Quy trình
- [ ] 1. Gom dữ liệu khách quan: hồ sơ học viên + `search_sessions` các trao đổi trong tuần
      (đã hỏi gì, quiz điểm sao, lỗi gì) + `get_lesson('lo-trinh')` xem tuần này đáng lẽ học gì.
- [ ] 2. Trình bày bức tranh: ✅ đã làm được · 📊 so với lộ trình (đủ/thiếu gì) · 🔁 lỗi lặp lại.
- [ ] 3. Hỏi học viên 3 câu metacognition, TỪNG CÂU MỘT:
      "Điều gì tuần này bạn hiểu sâu nhất — nhờ đâu?" ·
      "Điều gì học rồi mà vẫn mơ hồ?" ·
      "Tuần tới bạn muốn đổi MỘT điều gì trong cách học?"
- [ ] 4. Từ câu trả lời: đề xuất 2–3 điều chỉnh cụ thể cho tuần tới (kỹ thuật học, thời lượng, chủ đề ưu tiên).
- [ ] 5. `update_student_memory` ghi kết luận tuần + điều chỉnh đã thống nhất;
      đề nghị `schedule_task` 'weekly <thứ> <giờ họ hay rảnh>' nếu họ muốn duy trì
      nhịp đánh giá hằng tuần đều đặn.

## Lưu ý
- Đây là buổi trò chuyện, không phải bài kiểm tra — nghe nhiều hơn nói. Khen tiến bộ bằng số liệu thật.
