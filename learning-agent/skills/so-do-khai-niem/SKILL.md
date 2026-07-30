---
name: so-do-khai-niem
description: >
  Vẽ sơ đồ khái niệm (concept map) dạng mermaid nối các khái niệm của một bài/chủ đề,
  cho thấy quan hệ giữa chúng. Dùng khi học viên muốn "nhìn tổng quan", "mindmap",
  "sơ đồ", thấy bài rời rạc khó liên kết, hoặc ôn nhanh cấu trúc cả bài trước khi thi.
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Sơ đồ khái niệm

Cơ sở: dual coding — kiến thức được mã hoá cả bằng lời lẫn hình ảnh/không gian thì nhớ chắc hơn.

## Quy trình
- [ ] 1. `get_lesson` bài (hoặc `search_lessons` nếu là chủ đề xuyên bài); lấy các [[wikilink]] và mục "Khái niệm chính".
- [ ] 2. Chọn 6–12 khái niệm cốt lõi; xác định quan hệ giữa từng cặp (là-một-loại, gồm-có, dẫn-đến, đối-lập, cần-trước).
- [ ] 3. Xuất mermaid trong code block:
      ```mermaid
      graph TD
        A[Khái niệm] -->|quan hệ| B[Khái niệm khác]
      ```
      Nhãn cạnh NGẮN (1-3 từ); nhóm màu theo cụm nếu >8 nút (dùng classDef).
- [ ] 4. Dưới sơ đồ: 3–5 dòng chú giải đường đi chính ("đọc từ X → Y để hiểu vì sao...").
- [ ] 5. Hỏi học viên muốn phóng to nhánh nào → vẽ sơ đồ con chi tiết cho nhánh đó.

## Lưu ý
- Sơ đồ >12 nút = rối — tách thành sơ đồ tổng quan + sơ đồ con.
- Chỉ dùng khái niệm CÓ trong tài liệu; đừng chế thêm nút ngoài giáo trình.
