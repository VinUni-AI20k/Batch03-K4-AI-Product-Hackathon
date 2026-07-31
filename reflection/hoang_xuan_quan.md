# Reflection Cá Nhân — Hoàng Quân (Lead Engineer / Core Developer)

## 1. Vai trò & Nhiệm vụ đảm nhận
- **Họ và tên:** Hoàng Xuân Quân
- **Mã học viên / Lớp:** 2A202601868 · Lớp AI Thực Chiến K4 VinUni
- **Nhiệm vụ trong dự án:**
  - **Lập trình Backend RAG Architecture:** Xây dựng lõi [page_rag_agent.py](file:///Users/hoangquan/Desktop/K4-hackathon-sharkb-E403/codebase/backend/agents/page_rag_agent.py), tích hợp `Fast Intent Router`, `Input Guardrails`, `Output Guardrails` và bộ nhớ đệm `_RAG_RESPONSE_CACHE` giúp phản hồi tức thì 0.5ms.
  - **Lập trình Frontend Slide Viewer:** Phát triển giao diện đọc slide tương tác [slide-viewer.html](file:///Users/hoangquan/Desktop/K4-hackathon-sharkb-E403/codebase/slide-viewer.html), tích hợp Canvas vẽ/highlight/tẩy nét vẽ với tính năng Undo/Redo.
  - **Phát triển UI/UX Flashcard 3D:** Thiết kế và lập trình tính năng **3D Card Deck Fan (Xếp chia bài lật 3D)** tại [js/flashcard-modal.js](file:///Users/hoangquan/Desktop/K4-hackathon-sharkb-E403/codebase/js/flashcard-modal.js) & [css/flashcard-modal.css](file:///Users/hoangquan/Desktop/K4-hackathon-sharkb-E403/codebase/css/flashcard-modal.css).
  - **Tích hợp Tool Write Note:** Xây dựng cơ chế nối tiếp ghi chú (`Append Mode`) chuẩn Markdown hiển thị khớp trên vở kẻ ngang.

## 2. Các công cụ AI đã sử dụng
- **Antigravity AI Agent & Cursor:** Sử dụng trợ lý AI để refactor code Python/FastAPI, tối ưu hóa CSS 3D Keyframes Animation cho bộ bài Flashcard và debug cú pháp ES Module JS.

## 3. Bài học quan trọng từ một Case Fail của nhóm
- **Sự cố thực tế:** Khi phát triển tính năng ghi chú tự động `[WRITE_NOTE:]`, ở phiên bản đầu tiên hàm `typewriterEffectOnNote()` mỗi lần AI trả lời đều chạy dòng lệnh `noteEl.innerHTML = ''` (xoá trắng vở ghi). Học sinh phản ánh vừa đặt câu hỏi tiếp theo thì toàn bộ ghi chú cũ trước đó bị mất sạch!
- **Bài học rút ra:** Luôn phải chú ý đến trạng thái dữ liệu người dùng (User State Persistence). Nhóm đã lập tức chuyển đổi sang cơ chế **Nối tiếp ghi chú (Append Mode)**, đồng thời giữ nguyên cấu trúc Markdown gạch đầu dòng `- ` và tiêu đề `# `. Nhờ đó trải nghiệm ghi chép trở nên vô cùng tự nhiên và mượt mà.
