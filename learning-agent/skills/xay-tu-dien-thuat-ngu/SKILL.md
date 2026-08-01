---
name: xay-tu-dien-thuat-ngu
description: >
  Xây từ điển thuật ngữ của khoá học: trích các thuật ngữ trong bài thành ghi chú khái
  niệm trong vault (mỗi thuật ngữ 1 note, có wikilink chéo). Dùng khi học viên "loạn
  thuật ngữ", muốn "glossary", tra nhanh "từ này nghĩa là gì", hoặc sau khi ingest bài
  mới nhiều thuật ngữ lạ.
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Từ điển thuật ngữ (glossary builder)

Cơ sở: elaboration — mỗi thuật ngữ được định nghĩa lại + ví dụ + liên kết sẽ thành nút neo kiến thức.

## Quy trình
- [ ] 1. `get_lesson` bài được yêu cầu; liệt kê thuật ngữ (ưu tiên mục "Khái niệm chính" + từ in đậm/tiếng Anh).
- [ ] 2. Với TỪNG thuật ngữ: `get_concept` kiểm tra đã có note chưa —
      có rồi thì bổ sung nếu bài mới thêm ý; chưa có thì soạn theo khuôn:
      định nghĩa 1 câu → giải nghĩa đời thường 1-2 câu → ví dụ → thuật ngữ liên quan dạng [[wikilink]] → nguồn (bài, slide).
- [ ] 3. `save_concept` từng thuật ngữ (tên kebab-case, giữ nguyên thuật ngữ tiếng Anh nếu là chuẩn ngành).
- [ ] 4. Gửi học viên bảng tóm tắt: thuật ngữ → định nghĩa 1 dòng; nhắc họ xem đầy đủ trong vault (Obsidian, thư mục concepts/).
- [ ] 5. Đề nghị tạo bộ thẻ ghi nhớ từ các thuật ngữ này (load_skill the-ghi-nho) nếu học viên muốn thuộc.

## Lưu ý
- Không định nghĩa lại khác đi so với tài liệu; tài liệu và cách hiểu phổ thông lệch nhau → ghi cả hai và nói rõ.
