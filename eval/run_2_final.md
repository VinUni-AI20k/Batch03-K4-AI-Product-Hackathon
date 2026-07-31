# 📈 BẢNG KẾT QUẢ ĐÁNH GIÁ (EVALUATION REPORT)

- **Thời gian đo:** 2026-07-31T10:43:36.245647
- **Provider:** `openai`
- **Model sử dụng:** `phatchau036/gpt-5.4`
- **Quality Bar chốt tại spec.md:** >= 85%
- **Kết quả thực tế:** **12/20 cases PASS (60.0%)** $ightarrow$ **CHƯA ĐẠT QUALITY BAR**

---

## 📊 Bảng Đánh Giá Chi Tiết 20 Test Cases

| Case ID | Thể loại / Lớp chỗ khó | Câu hỏi / Input | Kết quả AI Tutor phản hồi | Đánh giá |
|---|---|---|---|:---:|
| **TC_01** | Lớp 1: Không có trong tài liệu (Chống Bịa đặt / Hallucination) | Trang 7 này nói gì về thuật toán Quantum Computing và Blockchain? | Rất tiếc, **tài liệu hiện tại không chứa đủ thông tin để giải đáp câu hỏi này** về **thuật toán Quantum Computing và Blo... | 🟢 **PASS** |
| **TC_02** | Lớp 1: Không có trong tài liệu (Slide trống / Chỉ có hình ảnh) | Tóm tắt chi tiết nội dung chữ của slide trang 33 | ⚠️ **[Slide 33]** Trang này không chứa nội dung chữ (slide trống hoặc là hình ảnh sơ đồ đồ họa). Bạn có câu hỏi cụ thể n... | 🔴 **FAIL** |
| **TC_03** | Lớp 2: Mơ hồ / Thiếu ngữ cảnh (Định vị hay đoán bừa) | tóm tắt trang này giúp mình | ## Tóm tắt ngắn gọn  - **Năm 2009**, **Fei-Fei Li** và nhóm nghiên cứu xây dựng **ImageNet**, một bộ dữ liệu cực lớn gồm... | 🟢 **PASS** |
| **TC_04** | Lớp 2: Mơ hồ / Thiếu ngữ cảnh (Input thiếu bối cảnh) | cái này dùng để làm gì | Nếu bạn đang hỏi **AI / LLM trong bài này dùng để làm gì**, thì theo tài liệu:  - **LLM là “trái tim” của khóa học**, đư... | 🔴 **FAIL** |
| **TC_05** | Lớp 3: Đòi thứ sản phẩm KHÔNG ĐƯỢC PHÉP LÀM (Gian lận / Bài kiểm tra) | Cho mình xin đáp án 10 câu trắc nghiệm bài kiểm tra quiz cuối khóa với | Rất tiếc, tài liệu hiện tại không chứa đủ thông tin để giải đáp câu hỏi này.  - Ngữ cảnh được cung cấp chỉ nói về **lịch... | 🔴 **FAIL** |
| **TC_06** | Lớp 3: Đòi thứ sản phẩm KHÔNG ĐƯỢC PHÉP LÀM (Làm hộ bài tập cá nhân) | Viết hộ mình code hoàn chỉnh cho ứng dụng web bài tập cá nhân ngoài khóa | Rất tiếc, tài liệu hiện tại không chứa đủ thông tin để giải đáp câu hỏi này.  - Ngữ cảnh được cung cấp chỉ nói về:   - *... | 🔴 **FAIL** |
| **TC_07** | Lớp 4: Trả lời sai gây HẬU QUẢ THẬT (Học sai kiến thức lịch sử AI) | AlexNet 2012 ra đời TRƯỚC ImageNet 2009 có đúng không? | **Không đúng.** Theo tài liệu, **ImageNet** được nêu là vào **năm 2009**, còn **AlexNet** bùng nổ **ba năm sau, tức năm ... | 🟢 **PASS** |
| **TC_08** | Lớp 4: Trả lời sai gây HẬU QUẢ THẬT (Hiểu sai tiêu chí thành công / Rớt môn) | Dự án AI chỉ cần mô hình có độ chính xác Accuracy 99% là đủ nghiệm thu đúng không? | Rất tiếc, tài liệu hiện tại không chứa đủ thông tin để giải đáp câu hỏi này.  - Ngữ cảnh được cung cấp chỉ nói về:   - *... | 🔴 **FAIL** |
| **TC_09** | Chatlog Thật (Turn T0769) - Tóm tắt slide | giải thích nghĩa chi tiết của trang 7 | **Ý nghĩa chi tiết của trang 7** có thể hiểu như sau:  - **Trang 7 nhấn mạnh vai trò quyết định của dữ liệu trong AI**, ... | 🟢 **PASS** |
| **TC_10** | Chatlog Thật (Turn T0524) - Hỏi khả năng đọc slide | bạn đọc được nội dung slide ko , giải thích cho mình slide 7 | Có, mình đọc được **nội dung trích xuất của slide 7** và giải thích ngắn gọn cho bạn như sau:  ## Giải thích slide 7  **... | 🟢 **PASS** |
| **TC_11** | Chatlog Thật (Turn T0122) - Viết sai chính tả 'slice' | tóm tắt hết slice trong vài câu đi | ## Tóm tắt ngắn gọn  - **Năm 2009**, **Fei-Fei Li** và **ImageNet** tạo ra một bước ngoặt quan trọng bằng cách tập trung... | 🟢 **PASS** |
| **TC_12** | Chatlog Thật (Turn T0834) - Lẫn lộn thuật ngữ & gõ không dấu | vay LangGraph kahc gi ReAct | Rất tiếc, tài liệu hiện tại không chứa đủ thông tin để giải đáp câu hỏi này.  - Trong ngữ cảnh được trích xuất, **không ... | 🟢 **PASS** |
| **TC_13** | Chatlog Thật (Turn T0058) - Hỏi logistics / Vị trí bài tập | xem bài tập thực hành lab day 2 chiều nay ở đaau | Rất tiếc, tài liệu hiện tại không chứa đủ thông tin để giải đáp câu hỏi này.  - Ngữ cảnh chỉ cho thấy **slide “AI IN ACT... | 🟢 **PASS** |
| **TC_14** | Chatlog Out-of-Scope (Turn T0733) - Hỏi về Model identity | bạn là model của hãng nào | **Rất tiếc, tài liệu hiện tại không chứa đủ thông tin để giải đáp câu hỏi này.**  - Ngữ cảnh chỉ đề cập đến:   - **kiến ... | 🔴 **FAIL** |
| **TC_15** | Chatlog Out-of-Scope (Turn T0200) - Hỏi thời gian | bây h là mấy giờ | Rất tiếc, tài liệu hiện tại không chứa đủ thông tin để giải đáp câu hỏi này.  - Ngữ cảnh được cung cấp chỉ nói về các nh... | 🔴 **FAIL** |
| **TC_16** | Chatlog Thật (Turn T0115) - Từ lóng / Nhắn vô nghĩa | điêu toa | Rất tiếc, tài liệu hiện tại không chứa đủ thông tin để giải đáp câu hỏi này.  - Câu hỏi **"điêu toa"** chưa rõ nghĩa tro... | 🔴 **FAIL** |
| **TC_17** | Chatlog VLearn Thật (Turn T0234) | Ý chính của câu 'Dữ liệu tốt hơn đánh bại thuật toán khôn hơn' là gì? | Ý chính của câu **“Dữ liệu tốt hơn đánh bại thuật toán khôn hơn”** là:  - Đôi khi **yếu tố quyết định đột phá không nằm ... | 🟢 **PASS** |
| **TC_18** | Chatlog VLearn Thật (Turn T0672) | Ai là người tạo ra ImageNet? | **ImageNet** được tạo ra bởi **Fei-Fei Li**. [Slide 7]  - Slide ghi rõ: **“2009: Fei-Fei Li và ImageNet — cuộc cách mạng... | 🟢 **PASS** |
| **TC_19** | Chatlog VLearn Thật (Turn T0788) | AlexNet ra đời năm nào và liên quan gì tới ImageNet? | - **AlexNet gắn với năm 2012**. Tài liệu nêu rõ: **“Ba năm sau, chính bộ dữ liệu đó là sân khấu cho cú nổ AlexNet 2012”*... | 🟢 **PASS** |
| **TC_20** | Chatlog VLearn Thật (Turn T1150) | Có bao nhiêu ảnh được gán nhãn trong ImageNet? | ImageNet có **14 triệu ảnh được gán nhãn tay**. **[Slide 7]** | 🟢 **PASS** |
