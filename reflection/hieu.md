# Báo cáo Trải nghiệm (Reflection)

**Họ và tên:** Phạm Minh Hiếu
**Mã Học Viên:** 2A202601562
**Vai trò:** Team Lead, Backend, AI, Demo

---

## 1. Những gì tôi đã làm

- **Khởi tạo & quản lý dự án:** Thiết lập repository GitHub, cấu trúc codebase và phân công nhiệm vụ cho các thành viên trong nhóm.
- **Xây dựng Agent Skill & Backend:** Phát triển hệ thống backend cho phép Agent Tutor có thể đọc, trích xuất và xử lý nội dung từ file PDF slide bài giảng.
- **Xử lý dữ liệu slide:** Viết logic tách nội dung PDF và chuyển đổi sang định dạng mà Agent có thể hiểu được, đồng thời đảm bảo hiển thị chính xác tọa độ và nội dung văn bản trong từng slide.
- **Tích hợp AI & Demo:** Kết nối các thành phần AI, đảm bảo luồng xử lý end-to-end và trực tiếp thuyết trình demo sản phẩm trước hội đồng.

---

## 2. Bài học lớn nhất (Lessons Learned)

**Trích xuất thông tin từ PDF là một bài toán khó hơn tôi nghĩ.**

Ban đầu tôi nghĩ việc đọc nội dung từ file PDF là đơn giản, nhưng thực tế đòi hỏi phải xử lý nhiều lớp phức tạp:

- **Tọa độ văn bản:** Không chỉ lấy ra chữ, mà cần biết chữ đó nằm ở đâu trên slide để Agent có thể "chỉ vào" đúng phần đang giải thích — điều này quyết định trải nghiệm người dùng có tin vào câu trả lời của AI hay không.
- **Định dạng đặc thù:** PDF từ các nguồn khác nhau có cấu trúc khác nhau; cần xây dựng bộ parser linh hoạt để không bị vỡ với từng loại file.
- **Tốc độ xử lý:** File slide có thể lên tới 100+ trang, việc parse và index phải đủ nhanh để user không phải chờ đợi quá lâu — bài toán tối ưu hiệu năng là thứ tôi học được trong quá trình này.

---

## 3. Nếu có thêm thời gian, tôi sẽ làm gì?

1. **Hoàn thiện sản phẩm dựa trên phản hồi người dùng:** Ưu tiên sửa các lỗi UX đã được ghi nhận trong vòng validation (progress bar, tốc độ xử lý, đồng bộ TTS/animation) để sản phẩm sẵn sàng cho production.
2. **Mở rộng khả năng xử lý đa định dạng:** Hỗ trợ thêm các định dạng tài liệu khác ngoài PDF (Word, PowerPoint) để tăng phạm vi ứng dụng.
3. **Tối ưu hóa hiệu suất xử lý slide:** Rút ngắn thời gian parse và generate nội dung, đặc biệt với các file có dung lượng lớn (>150 slide), để mang lại trải nghiệm mượt mà hơn cho người dùng.

---

> **Bài học lớn nhất sau toàn bộ dự án:** Code chạy được chỉ là bước đầu. Phần khó hơn là làm cho nó chạy _đúng_ — với đúng định dạng, đúng tọa độ, đúng tốc độ — để user thực sự tin và sử dụng được.
