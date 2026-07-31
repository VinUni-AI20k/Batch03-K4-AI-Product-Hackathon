---
name: tao-quiz
description: >
  Tạo bộ quiz trắc nghiệm ôn tập từ tài liệu học, có đáp án, giải thích và trích nguồn.
  Dùng khi học viên muốn luyện tập, kiểm tra kiến thức, ôn thi, "test tôi", "cho tôi câu hỏi",
  hoặc lệnh /quiz — kể cả khi họ không nói từ "quiz". Không dùng cho tóm tắt hay hỏi đáp thường.
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Tạo quiz trắc nghiệm

## Quy trình
- [ ] 1. `get_lesson` lấy toàn văn bài được yêu cầu (học viên nói mơ hồ → `search_lessons` xác định bài trước).
- [ ] 2. CHỌN ĐỘ KHÓ + TRỌNG TÂM theo "Mức nắm vững" trong hồ sơ: chủ đề 🔴 yếu → nhiều câu hơn,
      mức cơ bản; chủ đề 🟢 vững → ít câu, mức vận dụng/phân tích. Chưa có dữ liệu → trộn đều.
- [ ] 3. Chọn các ý QUAN TRỌNG nhất (khái niệm, công thức, quy trình) — không hỏi chi tiết vặt.
- [ ] 4. Mỗi câu: 4 lựa chọn A–D, chỉ 1 đáp án đúng; 3 lựa chọn sai phải hợp lý (lỗi hiểu nhầm phổ biến).
- [ ] 5. Đáp án + giải thích 1–2 câu + trích nguồn (bài/slide) để CUỐI, sau dòng `---ĐÁP ÁN---`.
- [ ] 6. KHI HỌC VIÊN TRẢ LỜI (chấm điểm): với TỪNG câu → `log_assessment(topic=chủ đề câu đó,
      correct=đúng/sai, note=lỗi cụ thể nếu sai)` — âm thầm, để mức nắm vững tự cập nhật.
      Chấm xong: khen phần đúng, giảng lại phần sai, gợi ý chủ đề nên ôn tiếp.
- [ ] 7. Học viên yêu cầu quiz một chủ đề nhiều lần → `update_student_memory` ghi lại chủ đề đó.

## Lưu ý
- Chỉ ra đề từ nội dung có trong tài liệu — không bịa kiến thức ngoài.
- Mặc định 5 câu nếu học viên không nói số lượng.
