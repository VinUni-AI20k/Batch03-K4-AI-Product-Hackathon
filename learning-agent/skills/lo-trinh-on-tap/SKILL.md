---
name: lo-trinh-on-tap
description: >
  Lập lộ trình ôn tập cá nhân hoá dựa trên MỨC NẮM VỮNG (đánh giá ngầm), hồ sơ học viên
  và lộ trình chương trình học. Dùng khi học viên hỏi "nên học gì tiếp", "kế hoạch ôn thi",
  "sắp thi rồi", muốn xếp lịch học, hoặc thấy mất phương hướng.
  Không dùng cho báo cáo định kỳ (dùng bao-cao-hang-ngay).
license: MIT
metadata:
  author: learning-agent
  version: "2.0"
---

# Lộ trình ôn tập cá nhân hoá (data-driven)

## Nguyên tắc
Lộ trình phải xây từ **dữ liệu thật** của học viên, không phải template chung:
- **Mức nắm vững theo chủ đề** (mục trong hồ sơ, do log_assessment tích luỹ): 🔴 yếu ôn TRƯỚC
  và lặp lại nhiều lần; 🟡 củng cố; 🟢 chỉ ôn nhanh trước thi (spaced repetition).
- Chủ đề **chưa có dữ liệu** đánh giá -> chèn 1 bài quiz thăm dò ngắn vào đầu lộ trình
  để đo trước khi xếp lịch sâu.

## Quy trình
- [ ] 1. Đọc hồ sơ học viên + mục "Mức nắm vững theo chủ đề" (có sẵn trong system prompt).
      Liệt kê: chủ đề 🔴 (ưu tiên 1), 🟡 (ưu tiên 2), chủ đề chưa đo.
- [ ] 2. Hỏi (nếu chưa biết): ngày thi/deadline? mỗi ngày rảnh bao nhiêu phút?
- [ ] 3. `get_lesson('lo-trinh')` đọc lộ trình chương trình (nếu có); `list_lessons` xem kho
      có bài nào khớp các chủ đề yếu; `search_lessons` tìm bài/khái niệm liên quan.
- [ ] 4. Xếp lộ trình theo ngày (5–7 ngày hoặc đến deadline), mỗi ngày:
      - 1 mục tiêu chính (đọc lại bài X / làm quiz chủ đề Y ở độ khó phù hợp mức nắm vững)
      - xen kẽ chủ đề (interleaving) + lặp lại chủ đề 🔴 sau 2–3 ngày (spaced repetition)
      - ngày đầu: quiz thăm dò các chủ đề chưa đo (nếu có)
- [ ] 5. Đề nghị đặt nhắc lịch: `schedule_task` cho từng buổi (nếu học viên đồng ý).
- [ ] 6. `update_student_memory` ghi lộ trình đã giao (ngày bắt đầu, mục tiêu) để buổi sau
      theo dõi tiến độ; khi học viên làm quiz trong lộ trình -> `log_assessment` từng câu
      để mức nắm vững cập nhật và lộ trình tự điều chỉnh.
