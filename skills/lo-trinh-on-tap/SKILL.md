---
name: lo-trinh-on-tap
description: >
  Lập lộ trình ôn tập cá nhân hoá dựa trên hồ sơ học viên và lộ trình chương trình học.
  Dùng khi học viên hỏi "nên học gì tiếp", "kế hoạch ôn thi", "sắp thi rồi", muốn xếp lịch học,
  hoặc thấy mất phương hướng. Không dùng cho báo cáo định kỳ (dùng bao-cao-hang-ngay).
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Lộ trình ôn tập cá nhân hoá

## Quy trình
- [ ] 1. Đọc hồ sơ học viên (có sẵn trong system prompt) — xác định điểm yếu, chủ đề đã hỏi nhiều.
- [ ] 2. `get_lesson('lo-trinh')` đọc lộ trình chương trình học (nếu có) để biết đang ở tuần/module nào.
- [ ] 3. `search_lessons` + `get_concept` tìm các bài/khái niệm liên quan điểm yếu.
- [ ] 4. Đề xuất lộ trình 5–7 ngày: mỗi ngày 1 mục tiêu nhỏ (đọc lại bài X, làm quiz chủ đề Y).
- [ ] 5. `update_student_memory` ghi lại lộ trình đã giao để lần sau theo dõi tiến độ.
