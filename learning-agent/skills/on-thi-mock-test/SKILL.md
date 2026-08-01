---
name: on-thi-mock-test
description: >
  Tạo đề thi thử tổng hợp NHIỀU bài, chấm điểm theo thang, phân tích kết quả và lên
  kế hoạch ôn phần yếu. Dùng khi học viên "sắp thi", "kiểm tra cuối kỳ", muốn "đề thi thử",
  "mock test", đánh giá tổng thể trước deadline. Khác tao-quiz (1 bài, luyện nhanh).
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Đề thi thử (mock test)

Cơ sở: practice testing là kỹ thuật hiệu quả nhất theo nghiên cứu tổng hợp của Dunlosky (2013).

## Quy trình
- [ ] 1. Hỏi phạm vi thi (những bài nào) nếu chưa rõ; `get_lesson('lo-trinh')` xem chương trình đến đâu.
- [ ] 2. `get_lesson` từng bài trong phạm vi; soạn đề 10–15 câu TRỘN các bài (interleaving),
      cơ cấu: 60% trắc nghiệm, 30% câu mở ngắn, 10% tình huống vận dụng. Ghi rõ thang điểm.
- [ ] 3. Giao đề trọn gói, hẹn học viên làm xong gửi toàn bộ đáp án một lượt (mô phỏng phòng thi — không gợi ý giữa chừng).
- [ ] 4. Chấm: điểm từng câu + tổng; bảng phân tích theo BÀI (bài nào mất điểm nhiều nhất).
- [ ] 5. Câu sai → ghi vào nhật ký lỗi (load_skill nhat-ky-loi-sai, làm phần Quy trình ghi).
- [ ] 6. Đề xuất kế hoạch ôn 3–5 ngày tập trung phần yếu; hỏi học viên có muốn
      `schedule_task` nhắc ôn + hẹn thi thử lần 2 không.

## Lưu ý
- Không ra đề ngoài phạm vi tài liệu. Điểm thấp → nhấn vào lộ trình cải thiện, không bình luận tiêu cực.
