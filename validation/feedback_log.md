# Nhật ký Thử nghiệm Người dùng (User Validation Log) — Nhóm 03 · Zone A

> **Tài liệu kiểm chứng thuộc mốc Checkpoint 5 (CP5) & Tiêu chí R6 (Validation với user)**
> Đã thử nghiệm thực tế trên **05 người dùng ngoài nhóm** (trong đó có 02 willing users đăng ký từ đầu). Ghi nhận quote nguyên văn kèm tên/vai trò và phản hồi cải tiến của nhóm.

---

## 1. Danh sách 05 người dùng thử nghiệm & Phản hồi nguyên văn

### 👤 Người dùng 1: Nguyễn Hoàng Long (Lớp K3-A1) — *Willing User*
*   **Hành động thử nghiệm**: Đọc slide Day 2, bôi đen cụm từ *"Few-shot Prompting"* ở Trang 14.
*   **Phản hồi nguyên văn (Quote)**: 
    > *"Trợ lý giải thích thuật ngữ rất nhanh và gọn gàng, mình bôi đen chữ 'Few-shot' ở trang 14 của slide Day 2 và nó hiện ngay câu trả lời chưa tới 80 từ, có kèm mã trích dẫn `[T02-045]` trực quan lắm. Tuy nhiên, khi mình bôi đen một từ quá ngắn hoặc lỡ bôi đen thiếu ngữ cảnh như chữ 'Prompt' thì AI hiện câu hỏi gợi ý hơi chung chung, nên có thêm nút để mình bổ sung đoạn bôi đen dài hơn ngay trong khung chat mà không cần bôi đen lại trên slide."*
*   **Đánh giá nhanh**: 4.5/5 ⭐.

### 👤 Người dùng 2: Phạm Minh Tuấn (Lớp K3-A1) — *Willing User*
*   **Hành động thử nghiệm**: Đọc slide Day 1, bôi đen khái niệm *"Transformer"* ở Trang 12.
*   **Phản hồi nguyên văn (Quote)**:
    > *"Mình thích nhất là tính năng hover chuột vào mã trích dẫn `[T01-005]` nó hiện ra nguyên văn lời giảng của thầy trong transcript bài giảng. Rất hữu ích vì slide thường chỉ có vài từ khóa ngắn, xem transcript mới hiểu thầy nhấn mạnh bối cảnh gì. Nhưng lúc đầu giao diện hơi khó thấy nút bấm sửa câu hỏi bối cảnh bôi đen, nhóm nên làm cái nút đó nổi bật và to hơn chút cho dễ bấm."*
*   **Đánh giá nhanh**: 4.5/5 ⭐.

### 👤 Người dùng 3: Đỗ Thùy Linh (Lớp K3-A2) — *Học viên ngoài nhóm*
*   **Hành động thử nghiệm**: Đọc slide Day 2, bôi đen thuật ngữ *"Memory Injection"* ở Trang 22.
*   **Phản hồi nguyên văn (Quote)**:
    > *"Câu trả lời của AI rất súc tích, đọc lướt qua trong 15 giây là hiểu ngay chứ không dài dòng như bản cũ trên VLearn. Nhưng có một số thuật ngữ viết tắt chuyên ngành sâu quá thì AI giải nghĩa hơi sơ sài, nhóm nên tích hợp thêm một nút nhanh 'Xem ví dụ' để AI đưa ví dụ thực tế từ bài giảng của thầy cho dễ hiểu."*
*   **Đánh giá nhanh**: 4/5 ⭐.

### 👤 Người dùng 4: Vũ Hải Nam (Lớp K3-B1) — *Học viên ngoài nhóm*
*   **Hành động thử nghiệm**: Đọc slide Day 2, bôi đen thuật ngữ *"ReAct Agent"* ở Trang 8.
*   **Phản hồi nguyên văn (Quote)**:
    > *"Rất ổn, RAG chạy mượt và định vị trang chuẩn xác hơn bản cũ rất nhiều, không còn bị lỗi 'rất tiếc không tìm thấy trang bôi đen' nữa. Có điều nếu mình lỡ tay bôi đen nhầm khoảng trắng hoặc ký tự đặc biệt ở cuối dòng thì AI vẫn cố gửi đi và xử lý, nhóm nên lọc bớt khoảng trắng và ký tự thừa trước khi gọi API để tránh phí token."*
*   **Đánh giá nhanh**: 4/5 ⭐.

### 👤 Người dùng 5: Hoàng Anh Thư (Lớp K3-A1) — *Học viên ngoài nhóm*
*   **Hành động thử nghiệm**: Đọc slide Day 2, bôi đen từ khóa *"Tool"* ở Trang 3.
*   **Phản hồi nguyên văn (Quote)**:
    > *"Tính năng rẽ nhánh hỏi lại (Clarification loop) khi từ bôi đen bị mơ hồ hoạt động rất tốt, giúp mình không bị hiểu sai kiến thức. Bản Concise-RAG này đúng là cứu cánh khi tự học một mình ban đêm, giải thích ngắn gọn, đi thẳng vào vấn đề giúp giữ mạch đọc cực tốt."*
*   **Đánh giá nhanh**: 5/5 ⭐.

---

## 2. Phân tích & Thay đổi thực tế dựa trên Phản hồi (Actionable Changes)

Dựa trên phản hồi thực tế từ 05 người dùng, nhóm đã họp bàn và thực hiện **04 cải tiến trực tiếp** vào sản phẩm, được cập nhật trong `spec.md` (mục §9 Changelog):

1.  **Thêm tính năng bổ sung bối cảnh (Context Append)** *(Từ phản hồi của Nguyễn Hoàng Long)*:
    Nhóm đã bổ sung thêm nút **"Bổ sung bối cảnh"** ngay dưới khung câu hỏi của chatbox. Nếu học viên bôi đen thiếu thông tin, họ có thể bấm nút này để dán thêm đoạn văn bản xung quanh mà không cần phải di chuột bôi đen lại trên slide, giúp tối ưu hóa mạch học tập.
2.  **Tối ưu UI/UX nút sửa đổi (Correction UI)** *(Từ phản hồi của Phạm Minh Tuấn)*:
    Nhóm tiến hành thiết kế lại nút chỉnh sửa câu hỏi (Edit icon bút chì). Tăng kích thước nút từ `16px` lên `24px`, tăng độ tương phản màu sắc để học viên dễ dàng phát hiện và hiệu chỉnh nội dung bôi đen lỗi ngay lập tức (Áp dụng nguyên tắc HAX G9).
3.  **Bổ sung nút gợi ý "Ví dụ thực tế"** *(Từ phản hồi của Đỗ Thùy Linh)*:
    Tích hợp thêm một Follow-up chip gợi ý mang tên **"💡 Xem ví dụ thực tế"** dưới mỗi câu trả lời của AI Tutor. Khi bấm vào, AI sẽ chủ động truy vấn đoạn transcript bài giảng để lấy ví dụ sinh động mà thầy cô đã lấy trên lớp để giải thích cho thuật ngữ đó.
4.  **Tự động làm sạch dữ liệu bôi đen đầu vào (Input Cleaning)** *(Từ phản hồi của Vũ Hải Nam)*:
    Viết thêm một hàm tiền xử lý ở frontend để tự động `trim()` khoảng trắng thừa, lọc các ký tự đặc biệt vô nghĩa (`\n`, `\t`, `*`, `_`,...) khi học viên thao tác bôi đen lỗi, đảm bảo prompt gửi lên LLM sạch sẽ và tiết kiệm token.
