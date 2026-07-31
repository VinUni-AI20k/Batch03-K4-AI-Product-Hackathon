# Bản Thu Hoạch Cá Nhân (Reflection)

**Họ và tên:** Đỗ Đình Thi
**Mã HV:** 2A2026
**Vai trò trong nhóm:** Build sản phẩm

## 1. Công việc đã thực hiện
- Tham gia code phần lõi của bot (Message Handler) và kết nối với OpenRouter API.
- Viết logic đọc dữ liệu (Data Loader) và phân tầng kiến thức (Tier 1 vs Tier 2).
- Khắc phục các lỗi về Markdown link (cú pháp bọc link Discord bị lỗi click) và nâng cấp thuật toán Search (từ AND sang OR matching).

## 2. Bài học rút ra (Learnings)
- **Xử lý linh hoạt:** Việc người dùng gõ thiếu chữ (vd: "tìm con mèo" thay vì "tìm bài viết về con mèo") là rất phổ biến. Phải relax thuật toán tìm kiếm (Token Matching) để bot "thoáng hơn", mang lại UX tốt hơn.
- **Bảo mật:** Nhận được bài học nhớ đời về GitHub Secret Scanning khi lỡ để lộ API Key trong file chat log.

## 3. Điều muốn làm tốt hơn
- Muốn nghiên cứu tích hợp RAG (Retrieval-Augmented Generation) thực thụ với Vector Database để bot có thể tìm kiếm dữ liệu trên hàng chục nghìn tin nhắn thay vì file JSON tĩnh.
