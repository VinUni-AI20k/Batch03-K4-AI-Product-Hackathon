---
name: tron-bai-interleaving
description: >
  Luyện tập trộn bài (interleaving): câu hỏi xen kẽ ngẫu nhiên giữa NHIỀU bài/chủ đề
  đã học để não phải tự nhận diện "câu này thuộc dạng nào". Dùng khi học viên đã học
  xong vài bài và muốn "ôn tổng hợp", "trộn câu hỏi", cảm giác học bài nào biết bài đó
  nhưng trộn lên là loạn. Khác on-thi-mock-test (có chấm điểm, mô phỏng thi thật).
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Luyện trộn bài (interleaving)

Cơ sở: nghiên cứu Rohrer — luyện xen kẽ chủ đề cho kết quả thi tốt hơn hẳn luyện từng khối,
dù lúc luyện cảm giác "khó chịu" hơn.

## Quy trình
- [ ] 1. Xác định 2–4 bài đã học (hỏi học viên hoặc xem hồ sơ + lộ trình).
- [ ] 2. `get_lesson` các bài; soạn 8–10 câu XEN KẼ NGẪU NHIÊN giữa các bài — không theo cụm,
      không báo trước câu nào thuộc bài nào.
- [ ] 3. Hỏi từng câu; ngoài đáp án, yêu cầu học viên nói câu này THUỘC BÀI/DẠNG NÀO
      (nhận diện dạng chính là thứ interleaving rèn).
- [ ] 4. Ưu tiên cài vài câu "bẫy nhận diện": trông giống bài A nhưng thực ra dùng kiến thức bài B.
- [ ] 5. Tổng kết: nhận diện dạng đúng bao nhiêu %, nhầm giữa cặp bài nào → `update_student_memory`.

## Lưu ý
- Báo trước cho học viên: "trộn nên sẽ thấy khó hơn bình thường — đó là dấu hiệu não đang học thật".
