# Reflection cá nhân — Đào Trung Hiếu · AI Agent QA · Batch 03

---

## 1. Vai trò & phần mình làm

**Phần mình phụ trách trong codebase:**
- File/module: Thư mục `eval/` (`run_golden_set.py`, `golden_set.md`), `validation/feedback_log.md`, và thiết kế tài liệu trình bày.
- Chức năng cụ thể: Setup script chạy tự động bộ Golden Set, lập bảng đánh giá Quality Bar, tổng hợp log test người dùng, chuẩn bị kịch bản và Slide cho vòng Demo (CP6).

**Phần mình phụ trách trong spec.md:**
- Section: §7 (Kiểm thử - Golden Set & Bảng kết quả), §9 (Changelog).

---

## 2. AI hỗ trợ mình như thế nào

| Công việc | Dùng AI tool nào | AI làm gì | Mình làm gì |
|---|---|---|---|
| Viết script Eval | Copilot | Viết code vòng lặp chạy mảng JSON vào API. | Tính toán và tự động xuất ra log thống kê % (Accuracy). |
| Sinh Golden Set | Gemini 1.5 Pro | Tạo ra các biến thể câu hỏi (đa dạng văn phong). | Đóng vai người dùng khó tính để thêm các câu hỏi hóc búa (edge cases). |
| Dàn ý Slide Demo | Claude 3.5 Sonnet | Tóm tắt spec thành dàn ý 6 trang slide. | Thiết kế hình ảnh, tập nói sao cho khớp 5 phút. |

**Mình hiểu dự án của mình đến mức:**
> Mình chịu trách nhiệm validate sản phẩm nên mình nắm được chính xác hệ thống pass/fail ở những case nào. Khi giám khảo yêu cầu chạy thử (Live Test), mình biết cách giải thích lý do tại sao hệ thống lại ra kết quả đó.

---

## 3. Một bài học từ case fail của nhóm

**Case fail cụ thể:**
> Lượt chạy Golden Set lần 1 (CP3), Accuracy chỉ đạt 64%, rất nhiều câu bị RAG nhầm tài liệu.

**Nguyên nhân:**
> Bộ Golden Set tạo bằng AI quá sạch sẽ, khi test thực tế người dùng gõ sai chính tả, viết tắt ("hk", "thik", "dc") làm hệ thống không nhận diện được keyword.

**Cách fix:**
> Phối hợp với bạn code (Đăng) để thêm tập từ khóa và cập nhật Regex. Thêm hẳn 10 case lấy từ chatlog thật (chứa lỗi chính tả) vào Golden Set để huấn luyện và test.

**Bài học:**
> Không nên phụ thuộc hoàn toàn vào dữ liệu do AI tự sinh để làm bài test. Dữ liệu thực tế từ User Validation (người thật) lộn xộn hơn rất nhiều. Phải đo lường trên sự lộn xộn đó mới ra insight.

---

## 4. Nếu làm lại, mình sẽ thay đổi gì

> Mình sẽ rủ các Willing Users tham gia test từ sớm (ngay khi có bản Mock) thay vì đợi đến lúc có Working Prototype mới đưa cho họ. Feedback sớm giúp nhóm né được rất nhiều "bẫy" tư duy.
