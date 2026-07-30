# 03 — Động Cơ Quyết Định Elo (Elo Engine)

**What to build:** Động cơ tính điểm Elo thực tế. Xây dựng API `POST /attempts` để chấm điểm, cập nhật điểm Elo (raw score), đồng thời thay đổi API generate quiz ưu tiên lấy concept yếu dựa trên Elo. Đấu nối kết quả ra giao diện UI (thanh Mastery và Elo).

**Blocked by:** 02 — Trình Sinh Quiz (Quiz Generation) & Fallback

**Status:** ready-for-agent

- [ ] Bảng `user_mastery` lưu trữ điểm số Elo thô cho từng concept của từng học viên.
- [ ] API `POST /attempts` ghi nhận câu trả lời, áp dụng công thức K-factor chuẩn để cập nhật Elo, và trả về điểm số mới.
- [ ] API `/quizzes/generate` được cập nhật để chọn ưu tiên các concept có Elo thấp và cấp độ câu hỏi (khó/dễ) phù hợp với điểm Elo hiện tại.
- [ ] Nửa trên của giao diện Phase 2 trong file HTML đấu nối với kết quả thật: thanh tiến trình hiển thị tỷ lệ %, Mastery (Yếu/Trung bình/Tốt), và log thay đổi Elo.
