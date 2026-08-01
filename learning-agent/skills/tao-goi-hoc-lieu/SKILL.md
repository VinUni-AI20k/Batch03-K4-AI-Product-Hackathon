---
name: tao-goi-hoc-lieu
description: >
  Tạo TRỌN GÓI học liệu (study pack) từ một bài học trong MỘT lần: tóm tắt + khái niệm chính
  + glossary + cheat sheet + quiz + flashcard + mindmap + lộ trình học tiếp. CHỈ dùng khi học viên
  muốn "trọn gói/gói học liệu/study pack/bộ tài liệu ôn đầy đủ". Nếu chỉ cần MỘT thứ riêng lẻ thì
  dùng skill tương ứng: tom-tat-bai (tóm tắt), tao-quiz (trắc nghiệm), the-ghi-nho (flashcard),
  so-do-khai-niem (mindmap), xay-tu-dien-thuat-ngu (glossary).
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
  inspired_by: SYuan03/Skill-Anything (MIT)
---

# Gói học liệu trọn bộ (study pack)

Một lệnh → bộ học liệu đầy đủ, phủ ĐỀU mọi phần của bài (không dồn hết vào phần đầu).

## Quy trình
- [ ] 1. Xác định bài: học viên nói mơ hồ → `search_lessons` chốt tên bài; rồi `get_lesson` đọc TOÀN VĂN.
- [ ] 2. `think`: liệt kê các SECTION của bài (theo heading/slide) + phân bổ quota câu hỏi/thẻ
      cho TỪNG section theo độ dài — section nào cũng phải có ít nhất 1 câu (map-reduce coverage).
      Đối chiếu "Mức nắm vững" trong hồ sơ: chủ đề 🔴 yếu được nhiều quiz/thẻ hơn.
- [ ] 3. Soạn gói theo ĐÚNG cấu trúc 8 phần dưới đây (một tin nhắn, markdown, mục nào thiếu
      dữ liệu trong bài thì ghi "tài liệu chưa đề cập" — không bịa):

### Cấu trúc gói (bắt buộc đủ 8 mục)
```
# 📦 Gói học liệu: <tên bài>

## 1. Tóm tắt (10 dòng)
## 2. Khái niệm chính (5-8 khái niệm, mỗi cái 1-2 câu)
## 3. Glossary (bảng thuật ngữ: Thuật ngữ | Nghĩa ngắn)
## 4. Cheat sheet (công thức/quy trình/mẹo — dạng gạch đầu dòng nén)
## 5. Quiz (5-10 câu A-D, phủ đều các section; đáp án + giải thích sau ---ĐÁP ÁN---)
## 6. Flashcard (10 thẻ: **Q:** ... / **A:** ...)
## 7. Mindmap (```mermaid mindmap — theo skill so-do-khai-niem: label trơn, indent 2 space)
## 8. Học tiếp gì (2-3 gợi ý bài/chủ đề kế tiếp trong kho + chủ đề 🔴 nên ôn)
```

- [ ] 4. Cuối gói hỏi: muốn làm quiz ngay (chấm điểm + `log_assessment` từng câu) hay
      lưu lại phần nào không.
- [ ] 5. `update_student_memory` ghi 1 dòng: đã tạo gói học liệu bài X ngày nào.

## Lưu ý
- Toàn bộ nội dung từ tài liệu trong kho — trích nguồn 📖 một dòng cuối gói.
- Bài quá dài (>2 phần lớn): hỏi học viên muốn cả bài hay từng phần trước khi làm.
- KHÔNG tự gọi skill khác (đã gộp đủ trong cấu trúc trên); mindmap viết đúng cú pháp
  mermaid mindmap để web/Discord/Telegram render hình.
