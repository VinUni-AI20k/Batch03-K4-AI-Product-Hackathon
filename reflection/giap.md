# Báo cáo Trải nghiệm (Reflection)

**Họ và tên:** Đặng Nguyên Giáp
**Mã Học Viên:** 2A202601486
**Vai trò:** Frontend, Spec & Tài liệu

---

## 1. Những gì tôi đã làm

- **Tính năng Mind Map:** Xây dựng chức năng sinh mind map từ outline — nhận dữ liệu các ý chính/quan hệ do AI sinh ra từ tài liệu bài giảng và dựng thành sơ đồ phân cấp trên giao diện, giúp học viên nhìn tổng quan quan hệ giữa các nội dung trong một Section thay vì đọc lại toàn bộ text.
- **Tính năng Slide thuyết trình:** Xây dựng chức năng tạo slide thuyết trình từ outline — ghép nội dung do AI sinh (lời giảng, ảnh slide gốc, vị trí khoanh vùng) thành luồng trình chiếu bấm được, đồng bộ với phần đọc/animation.
- **Spec & tài liệu:** Hoàn thiện `spec.md` theo đúng khung 9 mục của chương trình (User & Job, Impact, Thiết kế, Kiểu lỗi, 4 đường đi trải nghiệm, Kiểm thử, Phân công, Changelog) và chuyển bảng test nội bộ của nhóm thành golden set chuẩn trong `eval/golden-set.md`, đối chiếu với code thật để spec không khai sai thực tế đang build.

---

## 2. Bài học lớn nhất (Lessons Learned)

**Hiểu được luồng hoạt động thật của một ứng dụng có AI đứng ở giữa, không chỉ là "gọi API rồi hiển thị kết quả".**

Trước khi làm, tôi hình dung việc tích hợp AI đơn giản là gửi request, nhận JSON, render ra UI. Thực tế làm mind map và slide cho tôi thấy rõ hơn:

- **Dữ liệu AI trả về phải được thiết kế để FE dựng lại đúng, không chỉ đúng nội dung.** Mind map cần cấu trúc quan hệ cha-con rõ ràng, slide cần toạ độ/vùng khoanh gắn đúng với ảnh gốc — sai một chút ở tầng dữ liệu là hỏng cả trải nghiệm phía trước, dù nội dung AI sinh ra vẫn "đúng".
- **Việc tích hợp AI vào sản phẩm hay ở chỗ nó biến một việc tốn công (tự đọc lại tài liệu, tự vẽ sơ đồ, tự soạn slide) thành một thao tác gần như tức thời** — nhưng chỉ có giá trị thật khi luồng gọi API, xử lý lỗi, và hiển thị được nối liền mạch với nhau, không phải từng mảnh rời rạc.
- **Viết spec sau khi đã đọc code thật khác hẳn viết spec trước khi biết code sẽ ra sao** — nhiều chỗ trong bảng test ban đầu của nhóm mô tả một tính năng (chatbot hỏi-đáp theo Section) chưa thực sự tồn tại trong bản build; phải đối chiếu tay giữa spec và code mới tránh khai sai.

---

## 3. Nếu có thêm thời gian, tôi sẽ làm gì?

1. **Chỉnh chu lại tính năng mind map và slide:** cải thiện cách bố cục mind map khi số nhánh nhiều, xử lý mượt hơn các trường hợp ảnh slide gốc có tỉ lệ/khổ khác nhau.
2. **Đầu tư API key chất lượng hơn:** free-tier hiện tại hết quota rất nhanh (gặp lỗi `429 RESOURCE_EXHAUSTED` ngay từ lượt test đầu), nên nếu làm tiếp sẽ dùng key có billing đủ lớn để chạy được trọn bộ golden set và đo thật, thay vì phải dừng ở fallback rule-based.
3. **Hoàn thiện phần spec/tài liệu còn để trống:** chốt số quality bar dựa trên kết quả chạy thật, bổ sung case còn thiếu trong golden set (đặc biệt lớp ② — mơ hồ/thiếu thông tin).

---

> **Bài học lớn nhất sau toàn bộ dự án:** Tích hợp AI vào sản phẩm không nằm ở việc gọi được API, mà ở việc thiết kế dữ liệu và luồng xung quanh nó đủ chặt để phần "thông minh" đó thực sự giúp người dùng nhanh hơn, chứ không chỉ là một tính năng trình diễn.
