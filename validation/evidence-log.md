# Nhật Ký Bằng Chứng & Data Mining (Evidence Log)

**Người thực hiện**: Thảo Tiên (Evidence Lead)  
**Mục tiêu**: Cung cấp bằng chứng thực tế cho `spec.md` §1 theo Chuẩn A & Chuẩn B của Đề bài.

---

## 📊 1. Data Mining Log (Chuẩn B — Khai thác Data Pack)

- **Dataset**: `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv`
- **Quy mô**: 1,261 turn hội thoại, 369 học viên (`U0001` - `U0369`), 585 cuộc trò chuyện.
- **Phương pháp đếm**:
  1. Thống kê cột `move_used`: Có **1,072 / 1,261 turn (85.0%)** thuộc loại `review_concept` (học viên gõ thắc mắc để nhắc lại lý thuyết bài giảng).
  2. Thống kê cột `citations`: Có **583 / 1,261 turn (46.2%)** có giá trị `citations = []` (AI Tutor trả lời thiếu trích dẫn nguồn).

### 5 Quote Nguyên Văn Khai Thác Từ Chatlog:
1. `U0042` (Turn `C0015`): *"Cho mình hỏi lại đoạn Cost-of-error sáng nay giảng viên nói ở slide nào vậy? Mình đang gõ code phần xử lý lỗi mà không nhớ khi nào thì dùng Conditional."*
2. `U0108` (Turn `C0089`): *"Tutor ơi giải thích lại giúp mình sự khác nhau giữa Augment và Automate với, mình đang gõ code tính năng nhưng bị phân vân."*
3. `U0215` (Turn `C0142`): *"Có mã trích dẫn slide cho đoạn 4 lớp chỗ khó không? Mỗi lần mình quay lại trang slide tìm tốn thời gian quá."*
4. `U0089` (Turn `C0210`): *"Cho mình xin lại định nghĩa 1 lát cắt câu chuẩn sáng nay học với, mình lật slide mãi không thấy."*
5. `U0312` (Turn `C0350`): *"Tutor trả lời giúp mình nguyên lý HAX 11 là gì, không cần cho code đáp án đâu chỉ cần nhắc lại lý thuyết thôi."*

---

## 📋 2. Nhật Ký Khảo Sát Thực Tế (Chuẩn A)

- **Số người khảo sát**: $n = 21$ học viên thực tế ngoài nhóm.
- **Tỉ lệ xác nhận**: **20/21 học viên (95.2%)** xác nhận gặp khó khăn khi làm Codelab chiều.
- **Chi tiết kết quả**:
  - *Tần suất lật slide/chuyển tab*: 20/21 học viên chuyển tab giữa Codelab và bài giảng sáng >5 lần/buổi.
  - *Thời gian lãng phí*: Trung bình 10-15 phút/lần mò mẫm lật slide.
  - *Hậu quả*: Mất luồng tập trung (flow state), mệt mỏi và tăng rủi ro trễ deadline Checkpoint bài tập.
