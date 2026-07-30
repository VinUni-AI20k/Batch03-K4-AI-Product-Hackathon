---
name: nghien-cuu
description: >
  Nghiên cứu sâu một chủ đề xuyên suốt nhiều bài học: gom mọi nội dung liên quan trong
  tài liệu, đối chiếu các bài, tổng hợp thành một bài phân tích có trích nguồn và lưu lại
  thành ghi chú khái niệm. Dùng khi học viên muốn "tìm hiểu sâu", "nghiên cứu", so sánh
  các khái niệm, hỏi một chủ đề trải dài nhiều bài. Không dùng cho câu hỏi 1 bài cụ thể.
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Nghiên cứu sâu một chủ đề

## Quy trình
- [ ] 1. `search_lessons` với 2–3 truy vấn khác nhau về chủ đề (từ khoá, cách diễn đạt khác, thuật ngữ Anh/Việt) để gom đủ nội dung từ mọi bài liên quan.
- [ ] 2. `get_concept` các khái niệm liên quan đã có + backlinks để biết chủ đề xuất hiện ở đâu.
- [ ] 3. Tổng hợp thành bài phân tích: **Định nghĩa** → **Xuất hiện trong các bài nào (trích nguồn từng bài)** → **Liên hệ giữa các bài** → **Điểm hay nhầm lẫn**.
- [ ] 4. `save_concept` lưu phần tổng hợp cô đọng vào ghi chú khái niệm để tái sử dụng.

## Lưu ý
- Mọi kết luận phải bám vào nội dung tìm được — phần nào tài liệu chưa dạy thì nói rõ "tài liệu chưa đề cập".
- Chủ đề quá rộng → hỏi lại học viên muốn đào sâu nhánh nào trước.
