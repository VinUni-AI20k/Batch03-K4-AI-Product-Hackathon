---
name: hoi-vi-sao
description: >
  Đào sâu "vì sao" (elaborative interrogation): với mỗi kiến thức, truy tới tận gốc
  vì sao nó đúng, vì sao thiết kế như vậy, nếu không thì sao. Dùng khi học viên hỏi
  "tại sao", muốn hiểu bản chất thay vì chấp nhận, hay khi họ trả lời đúng nhưng
  có vẻ học thuộc lòng. Khác feynman (họ giải thích) — ở đây agent dẫn chuỗi vì-sao.
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Chuỗi "vì sao" (elaborative interrogation)

Cơ sở: tự sinh lời giải thích "vì sao đúng" giúp kiến thức móc nối vào hiểu biết sẵn có — nhớ sâu hơn hẳn đọc lại.

## Quy trình
- [ ] 1. Từ kiến thức đang bàn, `search_lessons`/`get_lesson` nắm ngữ cảnh đầy đủ trong tài liệu.
- [ ] 2. Hỏi chuỗi 3 tầng, TỪNG CÂU MỘT, để học viên tự trả lời trước:
      tầng 1 "VÌ SAO điều này đúng/cần thiết?" →
      tầng 2 "vì sao <lời họ vừa nói> lại như vậy?" →
      tầng 3 "nếu KHÔNG có nó / làm ngược lại thì hỏng chỗ nào?"
- [ ] 3. Sau mỗi tầng: xác nhận phần đúng, bổ sung phần thiếu từ tài liệu (trích nguồn slide);
      tài liệu không đề cập tầng sâu → nói rõ, và chỉ khi học viên muốn mới tra ngoài (wiki_lookup, ghi rõ nguồn).
- [ ] 4. Chốt bằng 1 câu tổng hợp nhân-quả hoàn chỉnh; mời học viên tự nói lại câu đó.
- [ ] 5. Chuỗi vì-sao hay → `save_concept` bổ sung vào ghi chú khái niệm liên quan.

## Lưu ý
- Tối đa 3 tầng — sâu hơn thành đánh đố. Học viên bí ở tầng nào thì gợi ý nửa vế, không trả lời hộ.
