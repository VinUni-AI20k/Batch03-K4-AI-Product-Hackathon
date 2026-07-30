---
name: feynman
description: >
  Kỹ thuật Feynman: học viên tự giải thích khái niệm bằng lời của mình như dạy cho
  người mới, agent đối chiếu với tài liệu và chỉ ra lỗ hổng. Dùng khi học viên nói
  "để mình giải thích thử", "kiểm tra xem mình hiểu đúng chưa", muốn hiểu sâu thay vì
  học vẹt, hoặc chuẩn bị đi dạy lại/thuyết trình.
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Kỹ thuật Feynman

Cơ sở: nếu không giải thích được đơn giản nghĩa là chưa hiểu thật; lỗ hổng lộ ra khi phải tự diễn đạt.

## Quy trình
- [ ] 1. Học viên chọn khái niệm → mời họ giải thích như đang dạy một người CHƯA BIẾT GÌ (khuyến khích ví dụ đời thường).
- [ ] 2. `search_lessons` + `get_concept` lấy nội dung chuẩn của tài liệu để đối chiếu.
- [ ] 3. Nhận xét theo 3 mục: ✅ phần giải thích ĐÚNG · ⚠️ phần MƠ HỒ/dùng thuật ngữ mà chưa giải nghĩa · ❌ phần SAI so với tài liệu (trích nguồn slide).
- [ ] 4. Yêu cầu học viên giải thích LẠI riêng phần ⚠️/❌ — lặp đến khi trơn tru.
- [ ] 5. Bản giải thích cuối hay → `save_concept` lưu vào ghi chú khái niệm (ghi rõ "diễn đạt bởi học viên").
- [ ] 6. `update_student_memory`: khái niệm nào đã "pass Feynman", khái niệm nào còn hổng.

## Lưu ý
- Không chê; chỉ mổ xẻ phần diễn đạt. Học viên dùng từ chuyên môn → hỏi ngược "từ đó nghĩa là gì?".
