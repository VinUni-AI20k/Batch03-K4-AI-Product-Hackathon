# Bản Thu Hoạch Cá Nhân (Reflection)

**Họ và tên:** Trịnh Đắc Vụ
**Mã HV:** 2A2026
**Vai trò trong nhóm:** Build sản phẩm

## 1. Công việc đã thực hiện
- Hỗ trợ xây dựng cấu trúc bot Discord (Discord.js).
- Triển khai tính năng Activity Tracker (`daily_activity.json` và lệnh `!digest`).
- Hỗ trợ xử lý sự cố push lỗi Git (lộ API key).

## 2. Bài học rút ra (Learnings)
- **Kỹ thuật:** Hiểu sâu hơn về cách tích hợp LLM (OpenRouter/Gemini) vào bot Discord và xử lý các vấn đề về rate limit.
- **Tư duy sản phẩm:** Nhận ra tầm quan trọng của việc xây dựng "Graceful Failure" - khi AI không biết hoặc hệ thống sập thì phải có cơ chế đẩy cho TA xử lý thay vì crash bot.

## 3. Điều muốn làm tốt hơn
- Lần tới muốn áp dụng thêm caching cho các tin nhắn Discord để bot đỡ phải gọi lại API liên tục cho các câu hỏi trùng lặp, giúp tiết kiệm chi phí token hơn nữa.
