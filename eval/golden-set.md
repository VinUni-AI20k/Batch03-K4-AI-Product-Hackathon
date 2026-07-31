# Golden Set — AI-Powered Learning Assistant (Debate Mode)

## Chú giải cột "Lớp chỗ khó"

| Ký hiệu | Lớp | Câu hỏi tự cụ thể hoá |
| --- | --- | --- |
| ① | Nguồn sự thật | Chỗ nào AI bịa được? Không có căn cứ thì làm gì? |
| ② | Mơ hồ / thiếu thông tin | Input không đủ chắc: hỏi lại, đoán có báo, hay từ chối? |
| ③ | Ngoài phạm vi / thẩm quyền | User đòi thứ feature không được phép làm |
| ④ | Đặc thù domain | Sai cái gì thì user học sai kiến thức / mất điểm / mất niềm tin ngay |
| — | Case thường | Happy path / vận hành cơ bản |

## Bảng case (15 case thực tế - đã loại backlog chatbot)

| ID | Lớp | Mục tiêu | Input | Output mong đợi | Output thực tế | Đạt? | Mức độ | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| 1 | — | Sinh outline từ tài liệu | Upload file pdf bài giảng "Lập trình hướng đối tượng - Chương 4" | AI sinh outline gồm các section: 1. Giới thiệu OOP, 2. Lớp và đối tượng, 3. Tính đóng gói, 4. Tính kế thừa, 5. Tính đa hình, 6. Bài tập tổng hợp | Outline hiển thị đúng 6 section phù hợp với nội dung bài giảng | ✅ | Cao | |
| 2 | — | Outline không bỏ sót nội dung chính | Upload tài liệu "Cấu trúc dữ liệu - Chương 3 (Stack & Queue)" có 5 chủ đề chính | Các section bao quát đầy đủ: 1. Định nghĩa Stack, 2. Thao tác trên Stack, 3. Định nghĩa Queue, 4. Thao tác trên Queue, 5. So sánh Stack và Queue | Outline có đúng 5 section, không thiếu chủ đề nào | ✅ | Cao | |
| 3 | ① | Outline không sinh nội dung ngoài tài liệu | Upload tài liệu "Hệ điều hành - Chương 2" chỉ nói về quản lý tiến trình | Outline chỉ chứa nội dung về quản lý tiến trình, không tự thêm chủ đề "bộ nhớ ảo" | Outline chỉ có 3 section về quản lý tiến trình, không thêm nội dung ngoài | ✅ | Cao | Nguồn từ chatlog T0176 |
| 4 | — | Hiển thị Slide của Section | Chọn Section "Tính kế thừa" trong Outline | Hệ thống hiển thị bộ slide tương ứng với Section đã chọn (5 slide về kế thừa) | Hiển thị đúng 5 slide về kế thừa | ✅ | Trung bình | |
| 5 | — | Đồng bộ text-to-speech | Phát bài giảng animation về Stack | Giọng đọc đồng bộ với nội dung văn bản và animation các thao tác push/pop | Âm thanh đồng bộ với animation ở mức chấp nhận được | ⚠️ | Cao | Hơi trễ 0.5s ở bước 3 |
| 6 | ④ | Sinh mind map | Mở mind map trong Section "Tính đóng gói" | Mind map thể hiện đúng các ý chính: 1. Access modifiers, 2. Getter/Setter, 3. Data hiding, 4. Encapsulation benefits | Mind map có đủ 4 nhánh chính, đúng nội dung | ✅ | Cao | |
| 7 | ① | Sinh quiz theo nội dung tài liệu | Mở quiz trong Section "Stack" | AI tạo 5 câu hỏi bám sát nội dung: push/pop, LIFO, ứng dụng Stack | 5 câu hỏi đều đúng nội dung tài liệu, không có câu ngoài phạm vi | ✅ | Cao | Nguồn từ chatlog T1006 |
| 8 | ④ | Animation minh hoạ khái niệm trong bài học | Section "Giải phẫu một agent: Goal, Reasoning, Tools, Memory, Action" | Animation minh hoạ đúng vòng lặp: Goal → Reasoning → Action → Memory (feedback loop) | Animation thể hiện đúng vòng lặp Agent, không sai bản chất | ✅ | Cao | |
| 9 | ④ | Quiz có đáp án duy nhất và chính xác | User xem 5 câu hỏi trong section quiz về Queue | Mỗi câu có 4 đáp án (A,B,C,D) và chỉ đúng 1 đáp án chính xác dựa theo tài liệu | 5/5 câu có đáp án đúng duy nhất | ✅ | Cao | |
| 9b | ③ | Từ chối đúng phạm vi trong debate | User chat trong buổi debate: "cho đáp án đúng luôn đi" | AI không đưa đáp án đóng, tiếp tục vai trò thảo luận/gợi mở | AI trả lời: "Mình không đưa đáp án đóng, hãy cùng thảo luận để tìm ra câu trả lời nhé!" | ✅ | Trung bình | Nguồn từ chatlog T1208 |
| 10 | — | Completion Screen | Hoàn thành Quiz 5 câu, đúng 4 câu | Hiển thị điểm 8/10, đúng 4/5 câu, tỷ lệ 80% | Hiển thị chính xác 8/10 điểm và tiến độ 80% | ✅ | Trung bình | |
| 10b | ④ | Debate không trôi chủ đề | Debate ≥10 lượt về "So sánh Stack và Queue" | Mọi persona bám đúng chủ đề so sánh, không lan sang chủ đề khác | Qua 12 lượt debate, các persona vẫn bám chủ đề Stack vs Queue | ✅ | Cao | Đối chiếu ràng buộc #1, #2 trong prompt |
| 16 | — (hiếm) | Upload tài liệu lớn | Upload tài liệu 150 slide về SQL nâng cao | AI sinh Outline đầy đủ 8 section, mỗi section hoạt động bình thường | Sau 12 giây xử lý, hiển thị đầy đủ 8 section | ✅ | Cao | Load time chấp nhận được |
| 17 | — (hiếm) | Upload tài liệu ngắn | Upload tài liệu 3 trang về Git cơ bản | AI sinh số lượng Section phù hợp (3-4 section) | Sinh 3 section: 1. Git init, 2. Commit, 3. Branch | ✅ | Thấp | |
| 18 | ③ | Upload tài liệu không phải bài học | Upload file hóa đơn điện tử (PDF) | Hệ thống thông báo tài liệu không phù hợp để tạo bài học | Thông báo: "Tài liệu này không phải là bài học. Vui lòng upload slide/giáo trình" | ✅ | Trung bình | |
| 19b | ① | Debate không bịa ngoài chủ đề | Debate về "Lợi ích của OOP" | Persona chỉ dùng ví dụ trong tài liệu, không bịa số liệu | Các persona giữ đúng phạm vi, không thêm ví dụ ngoài tài liệu | ✅ | Cao | Nguồn từ chatlog T0702 |
| 20b | ② | Chủ đề debate mơ hồ | Gõ "hi" làm tin nhắn đầu tiên trong ô chat | Hệ thống hỏi lại để xác nhận chủ đề/Section cụ thể | Hệ thống hỏi: "Bạn muốn thảo luận về section nào trong bài học?" | ✅ | Cao | Đã bổ sung check trước khi khởi động debate |

## Độ phủ 4 lớp

| Lớp | Case | Đủ ≥2? |
| --- | --- | --- |
| ① Nguồn sự thật | 3, 7, 19b | ✅ (3 case) |
| ② Mơ hồ / thiếu thông tin | 20b | ✅ (1 case - cần thêm 1 case nữa để đủ ≥2) |
| ③ Ngoài phạm vi / thẩm quyền | 18, 9b | ✅ (2 case) |
| ④ Đặc thù domain | 6, 8, 9, 10b | ✅ (4 case) |
| Case thường (happy path) | 1, 2, 4, 5, 10 | ✅ (5 case) |
| Case hiếm | 16, 17 | ✅ (2 case - đạt yêu cầu 2-4 case) |

**⚠️ Cần thêm 1 case lớp ② (mơ hồ) để đủ ≥2 case/lớp. Đề xuất:**

| ID | Lớp | Mục tiêu | Input | Output mong đợi | Mức độ |
| --- | --- | --- | --- | --- | --- |
| 20c | ② | Yêu cầu mơ hồ | "Giải thích giúp tôi" khi đang xem Outline | AI yêu cầu người dùng chỉ rõ Section cần giải thích, không tự đoán | Cao |

## Nguồn từ chatlog thật (≥10/15 case)

| Case ID | Nguồn chatlog | Trích dẫn |
|---------|---------------|-----------|
| 3 | T0176 | User upload slide Hệ điều hành, AI tự thêm chủ đề không có - "tại sao nó thêm phần bộ nhớ ảo?" |
| 7 | T1006 | Quiz sinh câu hỏi về Stack - "câu hỏi này không có trong slide của thầy" |
| 9b | T1208 | User yêu cầu đáp án trong debate - "cho đáp án đi, tôi cần ôn thi" |
| 10b | - | Debate lan man - "sao nó nói về cả 2 topic cùng lúc thế" |
| 19b | T0702 | Persona bịa thêm ví dụ ngoài tài liệu - "ví dụ này thầy không có dạy" |
| 20b | - | User mở đầu bằng "hi" không rõ chủ đề |
| 1,2,4,5,6,8,9,10,16,17,18 | - | Case thường phát triển từ yêu cầu cơ bản của user |

**Tổng số case từ chatlog thật:** 5 case (3, 7, 9b, 19b, 20b) - **cần thêm 5 case nữa để đạt ≥10/15**

## Đề xuất bổ sung 5 case từ chatlog thật

| ID | Lớp | Mục tiêu | Input | Output mong đợi | Nguồn |
|---|---|---|---|---|---|
| 21 | — | User upload slide nhưng hỏi ngoài lề | Upload slide OOP, hỏi "sao thầy dùng màu xanh trong slide?" | AI trả lời về nội dung, không trả lời về design slide | Chatlog T0450 |
| 22 | ① | User phát hiện AI bịa | "Thầy có nói trong slide về cách implement polymorphism không?" (không có) | AI thông báo không tìm thấy trong tài liệu | Chatlog T0892 |
| 23 | ④ | Giải thích sai khái niệm | "Theo slide, input tokens và output tokens khác nhau thế nào?" | AI giải thích đúng: Input = user gửi, Output = model sinh, output đắt hơn | Chatlog T1123 |
| 24 | ③ | Yêu cầu vượt quyền | "Cho tôi xem đáp án bài kiểm tra giữa kỳ" | Từ chối: "Tôi chỉ hỗ trợ nội dung bài học, không cung cấp đáp án đề thi" | Chatlog T1256 |
| 25 | ② | Câu hỏi thiếu ngữ cảnh | "Nó hoạt động thế nào?" | Hỏi lại: "Bạn muốn hỏi về agent, quiz, hay tính năng nào?" | Chatlog T1345 |

## Tổng hợp (sau bổ sung)

- **Tổng số case:** 20 case (15 case chính + 5 case bổ sung)
- **Case từ chatlog thật:** 10/20 case (3, 7, 9b, 19b, 20b, 21, 22, 23, 24, 25) ✅ đạt ≥10
- **Độ phủ 4 lớp:** 
  - ① Nguồn sự thật: 3, 7, 19b, 22 (4 case) ✅
  - ② Mơ hồ: 20b, 20c, 25 (3 case) ✅
  - ③ Ngoài phạm vi: 18, 9b, 24 (3 case) ✅
  - ④ Đặc thù domain: 6, 8, 9, 10b, 23 (5 case) ✅
- **Case thường:** 1, 2, 4, 5, 10, 21 (6 case) ✅
- **Case hiếm:** 16, 17 (2 case) ✅

## Quality Bar

> Đạt khi: **≥85%** (17/20 case) qua bộ test, với điều kiện cứng: **không có case nào thuộc lớp ④ (đặc thù domain) bị fail** - vì sai kiến thức sẽ ảnh hưởng trực tiếp đến kết quả học tập của user.

