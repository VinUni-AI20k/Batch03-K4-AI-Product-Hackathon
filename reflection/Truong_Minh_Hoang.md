# Reflection cá nhân — Trương Minh Hoàng · AI Agent QA · Batch 03

---

## 1. Vai trò & phần mình làm

**Phần mình phụ trách trong codebase:**
- File/module: `spec.md`, `README.md`
- Chức năng cụ thể: Thiết kế kiến trúc tổng thể, định nghĩa Job to be done (JTBD), xây dựng Lát cắt 1 câu, và thiết lập 4 lớp khó (Taxonomy).

**Phần mình phụ trách trong spec.md:**
- Section: Chịu trách nhiệm chính cho toàn bộ khung `spec.md`, đặc biệt là §2 (Impact), §4 (Lát cắt & Thiết kế), §5, §6 (Kịch bản).

---

## 2. AI hỗ trợ mình như thế nào

| Công việc | Dùng AI tool nào | AI làm gì | Mình làm gì |
|---|---|---|---|
| Viết Problem Statement | Claude 3.5 Sonnet | Tóm tắt các ý tưởng rời rạc thành JTBD chuẩn. | Sửa lại để đảm bảo KHÔNG có chữ "AI" trong JTBD theo đúng chuẩn. |
| Chọn HAX/PAIR | ChatGPT | Gợi ý các nguyên tắc phù hợp với luồng RAG. | Đánh giá và map các nguyên tắc (G1, G11) vào đúng chỗ trong Prototype. |
| Brainstorm Kịch bản | Gemini 1.5 Pro | Gợi ý các kịch bản fallback. | Phân loại vào đúng 4 lớp khó theo Rubric. |

**Mình hiểu dự án của mình đến mức:**
> Mình nắm được trọn vẹn tại sao team lại chọn làm tính năng này thay vì chatbot thông thường. Việc đưa ra quyết định loại bỏ Ứng viên 2 (Chatbot Rule-based) là do mình tính toán Cost of Error và Impact trên bàn giấy.

---

## 3. Một bài học từ case fail của nhóm

**Case fail cụ thể:**
> Lát cắt (Slice) ban đầu quá rộng: "Giúp học viên giải quyết mọi thắc mắc về khóa học". 

**Nguyên nhân:**
> Tham vọng ôm đồm quá nhiều thứ (cả bài tập, cả kỹ thuật sâu, cả tuyển sinh) trong một thời gian quá ngắn (1.5 ngày).

**Cách fix:**
> Thu hẹp lại lát cắt 1 câu: Chỉ tập trung vào "thí sinh tìm hiểu đăng ký" + "cần AI phân loại để RAG sổ tay hoặc search FB". Bỏ qua phần hướng dẫn code phức tạp ở version 1.

**Bài học:**
> Build AI Product không phải là nhét càng nhiều tính năng càng tốt. Lát cắt càng mỏng, càng cụ thể thì tỷ lệ demo thành công và mang lại Impact thực tế càng cao.

---

## 4. Nếu làm lại, mình sẽ thay đổi gì

> Mình sẽ viết Non-goals trước cả khi viết tính năng. Việc xác định rõ "Những gì chúng ta KHÔNG LÀM" giúp cả team (đặc biệt là bạn code) tiết kiệm được rất nhiều thời gian đi lạc hướng.
