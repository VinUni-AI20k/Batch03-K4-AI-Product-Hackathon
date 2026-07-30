---
name: van-dap-active-recall
description: >
  Kiểm tra vấn đáp kiểu active recall: hỏi câu MỞ từng câu một, chờ học viên tự nhớ lại
  và trả lời, chấm và đào sâu chỗ yếu. Dùng khi học viên muốn "kiểm tra miệng", "hỏi xoáy",
  luyện trả lời không nhìn tài liệu, chuẩn bị vấn đáp/phỏng vấn. Khác tao-quiz (trắc nghiệm
  có sẵn đáp án A-D) — ở đây học viên phải TỰ diễn đạt.
license: MIT
metadata:
  author: learning-agent
  version: "1.0"
---

# Vấn đáp active recall

Cơ sở: tự nhớ lại (retrieval) hiệu quả hơn đọc lại nhiều lần; câu mở buộc não tổ chức kiến thức.

## Quy trình
- [ ] 1. `get_lesson` bài được yêu cầu; đọc hồ sơ học viên xem chỗ nào yếu để ưu tiên hỏi.
- [ ] 2. Hỏi TỪNG CÂU MỘT, câu mở ("Giải thích...", "So sánh...", "Điều gì xảy ra nếu..."), từ dễ đến khó.
- [ ] 3. Chờ học viên trả lời. Chấm theo 3 mức: ✅ đạt / 🟡 thiếu ý / ❌ sai — nêu đúng ý còn thiếu, trích nguồn slide.
- [ ] 4. Trả lời 🟡/❌ → hỏi thêm 1 câu đào sâu đúng lỗ hổng đó trước khi sang câu mới.
- [ ] 5. Hết 5–7 câu: tổng kết điểm mạnh/yếu + `update_student_memory` ghi chủ đề còn yếu.

## Lưu ý
- TUYỆT ĐỐI không hỏi dồn nhiều câu một lượt; không đưa đáp án trước khi học viên thử.
- Học viên bí → gợi ý mảnh nhỏ (từ khoá đầu tiên), đừng nói hết.
