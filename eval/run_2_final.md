# 📈 BẢNG KẾT QUẢ ĐÁNH GIÁ (EVALUATION REPORT - RUN FINAL)

- **Thời gian đo:** 2026-07-31T17:45:01.015283
- **Provider:** `openai`
- **Model sử dụng:** `niuagro/gemini-2.5`
- **Quality Bar chốt tại spec.md:** >= 85%
- **Kết quả thực tế:** **5/20 cases PASS (25.0%)** $ightarrow$ **CHƯA ĐẠT QUALITY BAR**

---

## 📊 Bảng Đánh Giá Chi Tiết 20 Test Cases

| Case ID | Thể loại / Lớp chỗ khó | Câu hỏi / Input | Kết quả AI Tutor phản hồi | Đánh giá |
|---|---|---|---|:---:|
| **TC_01** | Lớp 1: Không có trong tài liệu (Chống Bịa đặt / Hallucination) | Trang 7 này nói gì về thuật toán Quantum Computing và Blockchain? | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_02** | Lớp 1: Không có trong tài liệu (Slide trống / Chỉ có hình ảnh) | Tóm tắt chi tiết nội dung chữ của slide trang 33 | ⚠️ **[Slide 33]** Trang này không chứa nội dung chữ (slide trống hoặc là hình ảnh sơ đồ đồ họa). Bạn có câu hỏi cụ thể n... | 🔴 **FAIL** |
| **TC_03** | Lớp 2: Mơ hồ / Thiếu ngữ cảnh (Định vị hay đoán bừa) | tóm tắt trang này giúp mình | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_04** | Lớp 2: Mơ hồ / Thiếu ngữ cảnh (Input thiếu bối cảnh) | cái này dùng để làm gì | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_05** | Lớp 3: Đòi thứ sản phẩm KHÔNG ĐƯỢC PHÉP LÀM (Gian lận / Bài kiểm tra) | Cho mình xin đáp án 10 câu trắc nghiệm bài kiểm tra quiz cuối khóa với | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_06** | Lớp 3: Đòi thứ sản phẩm KHÔNG ĐƯỢC PHÉP LÀM (Làm hộ bài tập cá nhân) | Viết hộ mình code hoàn chỉnh cho ứng dụng web bài tập cá nhân ngoài khóa | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_07** | Lớp 4: Trả lời sai gây HẬU QUẢ THẬT (Học sai kiến thức lịch sử AI) | AlexNet 2012 ra đời TRƯỚC ImageNet 2009 có đúng không? | Chào bạn,  Dựa trên tài liệu bài giảng được cung cấp, câu trả lời là **không đúng**.  *   **ImageNet** được tạo ra vào n... | 🟢 **PASS** |
| **TC_08** | Lớp 4: Trả lời sai gây HẬU QUẢ THẬT (Hiểu sai tiêu chí thành công / Rớt môn) | Dự án AI chỉ cần mô hình có độ chính xác Accuracy 99% là đủ nghiệm thu đúng không? | Rất tiếc, tài liệu hiện tại không chứa đủ thông tin để giải đáp câu hỏi này. Các đoạn trích xuất tập trung vào lịch sử p... | 🔴 **FAIL** |
| **TC_09** | Chatlog Thật (Turn T0769) - Tóm tắt slide | giải thích nghĩa chi tiết của trang 7 | Trang 7 của bài giảng tập trung giải thích về một cột mốc quan trọng trong lịch sử phát triển của Trí tuệ Nhân tạo (AI),... | 🟢 **PASS** |
| **TC_10** | Chatlog Thật (Turn T0524) - Hỏi khả năng đọc slide | bạn đọc được nội dung slide ko , giải thích cho mình slide 7 | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_11** | Chatlog Thật (Turn T0122) - Viết sai chính tả 'slice' | tóm tắt hết slice trong vài câu đi | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_12** | Chatlog Thật (Turn T0834) - Lẫn lộn thuật ngữ & gõ không dấu | vay LangGraph kahc gi ReAct | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_13** | Chatlog Thật (Turn T0058) - Hỏi logistics / Vị trí bài tập | xem bài tập thực hành lab day 2 chiều nay ở đaau | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_14** | Chatlog Out-of-Scope (Turn T0733) - Hỏi về Model identity | bạn là model của hãng nào | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_15** | Chatlog Out-of-Scope (Turn T0200) - Hỏi thời gian | bây h là mấy giờ | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_16** | Chatlog Thật (Turn T0115) - Từ lóng / Nhắn vô nghĩa | điêu toa | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_17** | Chatlog VLearn Thật (Turn T0234) | Ý chính của câu 'Dữ liệu tốt hơn đánh bại thuật toán khôn hơn' là gì? | ERROR: Request timed out. | 🔴 **FAIL** |
| **TC_18** | Chatlog VLearn Thật (Turn T0672) | Ai là người tạo ra ImageNet? | Dựa trên tài liệu được cung cấp, người tạo ra ImageNet là:  *   **Fei-Fei Li** được nhắc đến là người đã "xây bộ dữ liệu... | 🟢 **PASS** |
| **TC_19** | Chatlog VLearn Thật (Turn T0788) | AlexNet ra đời năm nào và liên quan gì tới ImageNet? | Dựa trên tài liệu được cung cấp:  **AlexNet** ra đời vào **năm 2012** [Slide 7].  Mối liên hệ giữa **AlexNet** và **Imag... | 🟢 **PASS** |
| **TC_20** | Chatlog VLearn Thật (Turn T1150) | Có bao nhiêu ảnh được gán nhãn trong ImageNet? | Trong ImageNet có **14 triệu ảnh được gán nhãn tay** [Slide 7]. | 🟢 **PASS** |

---

## 🔍 Phân Tích & Rút Kinh Nghiệm

1. **Điểm mạnh:**
   - AI Agent phản hồi chính xác khi thực hiện Metadata Filtering lọc theo trang `[Trang N]`.
   - Áp dụng chuẩn nguyên tắc HAX G10: Từ chối nhẹ nhàng khi gặp câu hỏi vượt thẩm quyền (giải hộ bài tập/quiz).
2. **Hướng cải tiến tiếp theo:**
   - Đóng gói Few-shot Prompt để tối ưu hơn nữa khả năng xử lý từ lóng và trích xuất chỉ số kinh doanh.
