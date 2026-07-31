# Báo cáo Trải nghiệm (Reflection)

**Họ và tên:** Nguyễn Thế Sơn
**Mã Học Viên:** 2A202601632
**Vai trò:** Frontend Developer & API Integration

---

## 1. Vai trò & Những gì tôi đã làm

- **Phát triển Frontend:** Phụ trách phát triển giao diện người dùng bằng Next.js (TypeScript, Tailwind CSS, App Router) trong thư mục `codebase/frontend/`.
- **Tích hợp API (End-to-End):** Đảm nhận việc kết nối luồng dữ liệu giữa Frontend và hệ thống Backend (FastAPI), đảm bảo các tính năng của AI Agent hoạt động thông suốt từ đầu đến cuối (bấm được end-to-end).
- **Trải nghiệm người dùng (UX):** Đảm bảo luồng tương tác của người dùng với hệ thống mượt mà, từ việc điều hướng cho tới hiển thị các kết quả do AI sinh ra.

## 2. Trải nghiệm sử dụng AI hỗ trợ

- **Tăng tốc độ code UI:** Sử dụng các công cụ AI (như GitHub Copilot / ChatGPT) để tạo nhanh cấu trúc các component React và class Tailwind CSS, giúp tôi tiết kiệm thời gian đáng kể trong giai đoạn dựng layout.
- **Debug & Xử lý logic:** Nhờ AI hỗ trợ tìm lỗi và tối ưu hóa các logic phức tạp trên Frontend, đặc biệt là cách quản lý state (trạng thái) khi gọi API và xử lý dữ liệu bất đồng bộ trả về từ Backend.

## 3. Bài học lớn nhất từ một "case fail" của nhóm

**Tích hợp hệ thống (End-to-End) luôn phát sinh nhiều vấn đề về sự đồng nhất dữ liệu.**

- **Case Fail (Vấn đề gặp phải):** Khi tiến hành ghép nối Frontend và Backend, chúng tôi đã gặp tình trạng ứng dụng Frontend không hiển thị được dữ liệu hoặc bị lỗi do cấu trúc JSON trả về từ các tác vụ AI của Backend không khớp với những gì Frontend mong đợi (Interface/Type đã định nghĩa). Tính ngẫu nhiên của AI khiến một số luồng sinh ra kết quả sai format, làm vỡ giao diện.
- **Bài học rút ra:** Khi làm việc với các hệ thống Generative AI, không thể mong đợi dữ liệu trả về luôn hoàn hảo chuẩn chỉnh 100%. Frontend và Backend cần phải chốt chặt "hợp đồng dữ liệu" (API Spec) ngay từ đầu. Đồng thời, Frontend cần có một cơ chế xử lý lỗi (error boundaries, fallback UI, data validation) đủ tốt để ứng dụng không bị sập (crash) khi nhận dữ liệu rác hoặc sai định dạng từ AI.

---

> **Suy ngẫm:** Trong một sản phẩm tích hợp AI, Frontend không chỉ đơn thuần là nơi hiển thị dữ liệu tĩnh, mà còn đóng vai trò là "chốt chặn" để đảm bảo trải nghiệm người dùng luôn an toàn, mượt mà bất chấp sự bất định của các model AI ở phía sau.
