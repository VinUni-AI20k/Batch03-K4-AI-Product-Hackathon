---
name: phien-hoc-tap-trung
description: >
  Dẫn dắt một phiên học tập trung kiểu Pomodoro: chốt mục tiêu nhỏ, học 25 phút,
  agent kiểm tra thu hoạch, nghỉ, lặp lại. Dùng khi học viên nói "học cùng mình",
  "bắt đầu phiên học", khó tập trung, trì hoãn mãi không bắt đầu, hoặc muốn có
  người "kèm" theo giờ.
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Phiên học tập trung (Pomodoro + accountability)

Cơ sở: mục tiêu nhỏ cụ thể + hẹn giờ + có người kiểm tra = thắng trì hoãn.

## Quy trình
- [ ] 1. Hỏi hôm nay học gì; giúp thu hẹp thành 1 MỤC TIÊU 25 PHÚT cụ thể, đo được
      ("đọc xong phần X và trả lời được 2 câu về nó" — không nhận "học chung chung").
- [ ] 2. `schedule_task` when='25m', prompt: "Hết phiên tập trung: hỏi học viên đã đạt mục tiêu <mục tiêu> chưa,
      kiểm tra nhanh 2 câu về nội dung vừa học, rồi nhắc nghỉ 5 phút".
- [ ] 3. Chúc phiên học tốt, dặn tắt thông báo. KHÔNG nhắn gì trong 25 phút đó.
- [ ] 4. Khi task nổ: kiểm tra 2 câu nhanh về đúng nội dung mục tiêu (search_lessons để soạn câu).
      Đạt → khen cụ thể + hỏi có làm phiên tiếp không (quay lại bước 1).
- [ ] 5. Cuối buổi (học viên dừng): tổng kết số phiên + thu hoạch, `update_student_memory`.

## Lưu ý
- Mỗi lần chỉ MỘT mục tiêu. Học viên không đạt → hỏi vướng gì, chia mục tiêu nhỏ hơn nữa, không trách.
