# Log Khảo Sát & Đánh Giá Người Dùng (Validation Log)

**Giai đoạn:** CP5 - Validation với user
**Thời gian:** Chiều 31/07/2026
**Đối tượng thử nghiệm:** 3 Học viên (HV_01, HV_02, HV_03) đóng vai trò người dùng cuối và 1 TA đóng vai trò kiểm duyệt.

---

## 1. Kết quả vòng Test 1 (Happy Path)
- **Tester:** HV_01
- **Kịch bản:** Hỏi các thông tin cơ bản có trong thông báo (ví dụ: "Hạn nộp spec là mấy giờ?").
- **Phản hồi của Bot:** Bot lập tức trả lời "08:00 sáng mai" và dẫn link nguồn từ Announcements.
- **Feedback từ User:** "Bot trả lời cực nhanh, không cần phải lướt lên kênh thông báo để tìm lại nữa. Rất tiện."
- **Đánh giá:** ✅ Đạt (Pass).

## 2. Kết quả vòng Test 2 (Mơ hồ / Thiếu context)
- **Tester:** HV_02
- **Kịch bản:** Gắn thẻ bot và hỏi cụt lủn: "Bot ơi nộp bài ở đâu?".
- **Phản hồi của Bot:** Bot không bịa ra link nộp mà hỏi ngược lại: "Bạn muốn tìm link nộp cho Checkpoint nào hoặc Bài tập buổi mấy thế?".
- **Feedback từ User:** "Cách bot hỏi lại khá giống người thật (TA), giúp mình nhận ra là mình cần nói rõ hơn."
- **Đánh giá:** ✅ Đạt (Pass).

## 3. Kết quả vòng Test 3 (Vượt thẩm quyền & Báo cáo TA)
- **Tester:** HV_03
- **Kịch bản:** Thử xin gia hạn nộp bài: "Em bị ốm, cho em xin gia hạn deadline nộp spec thêm 3 tiếng được không?".
- **Phản hồi của Bot:** Bot từ chối giải quyết (báo ngoài thẩm quyền) và chèn thẻ `[ESCALATE_TA]`. Lệnh bot tự động tag role TA.
- **Feedback từ TA:** "Rất thích tính năng này vì những case xin xỏ, khiếu nại thì chỉ có TA mới xử lý được. Bot tự động chuyển tiếp giúp TA không bị lỡ tin nhắn quan trọng."
- **Đánh giá:** ✅ Đạt (Pass).

## 4. Kết quả vòng Test 4 (Phân biệt UGC)
- **Tester:** HV_01
- **Kịch bản:** Hỏi một kiến thức kỹ thuật được share trong kênh #chia-sẻ.
- **Phản hồi của Bot:** Trích dẫn nội dung từ forum và đính kèm nhãn cảnh báo: *"⚠️ Lưu ý: Đây là thông tin tham khảo từ thảo luận cộng đồng..."*.
- **Feedback từ TA:** "Chức năng phân cấp nguồn thông tin (Tier 1/Tier 2) hoạt động hoàn hảo, bảo vệ học viên khỏi các tin đồn sai lệch."
- **Đánh giá:** ✅ Đạt (Pass).

---

## 🎯 Kết luận chung
Sau quá trình dry-run, Bot hoạt động mượt mà, đáp ứng đúng 100% các kịch bản hóc búa (Lớp 1 đến Lớp 4). Sẵn sàng chốt sổ cho vòng Demo!
