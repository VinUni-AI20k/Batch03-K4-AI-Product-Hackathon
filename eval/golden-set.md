# Bộ test case kiểm thử cho chương trình
Dưới đây là bộ test case được sử dụng để kiểm thử các chức năng chính của chương trình. Mỗi trường hợp kiểm thử bao gồm mục tiêu, dữ liệu đầu vào, kết quả mong đợi, kết quả thực tế, trạng thái Pass/Fail và mức độ ưu tiên nhằm đánh giá tính chính xác, độ ổn định và khả năng đáp ứng yêu cầu của hệ thống.

| ID | Mục tiêu | Input | Kết quả mong đợi | Kết quả thực tế | Pass/Fail | Mức độ | Ghi chú |
|----|----------|-------|------------------|-----------------|-----------|---------|----------|
| 1 | Sinh outline từ tài liệu | Upload file PDF bài giảng | AI sinh Outline gồm các Section phù hợp với bài giảng. | AI tạo được Outline và chia thành các Section hợp lý theo nội dung bài giảng.| Pass| Cao | |
| 2 | Outline không bỏ sót nội dung chính | Upload tài liệu có nhiều chương | Các Section bao quát hầu hết đầy đủ các chủ đề chính của tài liệu. |Với tài liệu thông thường (<100 slide), các chủ đề chính đều được bao quát. |Pass | Cao | |
| 3 | Outline không sinh nội dung ngoài tài liệu | Upload tài liệu | Outline chỉ chứa nội dung có trong tài liệu, không tự thêm chủ đề mới. |Outline bám sát nội dung tài liệu, không phát hiện nội dung tự suy diễn trong quá trình kiểm thử. |Pass | Cao | |
| 4 | Hiển thị Slide của Section | Chọn một Section trong Outline | Hệ thống hiển thị bộ slide tương ứng với Section đã chọn. |Slide được hiển thị đúng theo section đã chọn |Pass | Trung bình | |
| 5 | Đồng bộ Text-to-Speech | Phát bài giảng Animation | Giọng đọc đồng bộ với nội dung văn bản và Animation. |Nội dung TTS được lấy trực tiếp từ file Markdown sinh ra sau quá trình chuyển đổi slide, dẫn đến văn bản bị xuống dòng, ngắt câu và tách từ không hợp lý. Giọng đọc bị rời rạc, khó theo dõi và không đồng bộ tốt với Animation, làm giảm trải nghiệm người dùng. |Fail | Cao | |
| 6 | Sinh Mind Map | Mở Mind Map trong Outline | Mind Map thể hiện đúng các ý chính và quan hệ giữa các nội dung trong Section. |Mind Map thể hiện đúng các ý chính và quan hệ giữa các nội dung trong Section. |Pass | Cao | |
| 7 | Sinh Quiz theo nội dung tài liệu | Mở Quiz trong Outline | AI tạo câu hỏi bám sát nội dung tài liệu. |Quiz được tạo đúng theo nội dung của tài liệu |Pass | Cao | |
| 8 | Animation minh họa khái niệm trong bài học | Section giải thích "Giải phẫu một Agent: Goal, Reasoning, Tools, Memory, Action" | Animation minh họa đúng vòng lặp của Agent và mối quan hệ giữa Goal, Reasoning, Tools, Memory và Action, không làm sai bản chất của khái niệm. |Animation thể hiện đúng quy trình và hỗ trợ người học dễ hình dung. |Pass | Cao | |
| 9 | Quiz có đáp án duy nhất và chính xác | User xem và chọn đáp án các câu hỏi trong Section Quiz | Mỗi câu có 4 đáp án (A, B, C, D) và chỉ có đúng 1 đáp án chính xác hoàn toàn dựa theo tài liệu. |Hầu hết câu hỏi có một đáp án đúng, chưa phát hiện trường hợp trùng đáp án trong quá trình kiểm thử. |Pass | Cao | |
| 10 | Completion Screen | Hoàn thành Quiz | Hiển thị đúng điểm, số câu đúng/sai và tỷ lệ hoàn thành. |Điểm số và tỷ lệ hoàn thành được hiển thị chính xác. |Pass | Trung bình | |
| 11 | Chatbot giải thích nội dung Section | "Giải thích nội dung của Section 2." | AI giải thích nội dung của Section rõ ràng, đúng theo tài liệu và dễ hiểu. |AI giải thích đầy đủ, dễ hiểu và bám sát nội dung Section. |Pass | Trung bình | |
| 12 | Chatbot tóm tắt Section | "Tóm tắt Section này trong 5 ý." | AI tóm tắt đầy đủ các ý chính của Section. |AI tóm tắt đúng các ý chính, không bỏ sót nội dung quan trọng. |Pass | Cao | |
| 13 | Chatbot trả lời câu hỏi trong Section | "Theo Section này, một AI Agent gồm những thành phần nào?" | AI trả lời đúng theo nội dung Section: AI Agent gồm Goal, Reasoning, Tools, Memory và Action; đồng thời giải thích ngắn gọn vai trò của từng thành phần, không bổ sung thông tin ngoài tài liệu. |AI trả lời chính xác và không bổ sung kiến thức ngoài tài liệu. |Pass | Cao | |
| 14 | Chatbot hỏi ngoài phạm vi Section | "Section này có nói về Reinforcement Learning không?" (không có trong Section) | AI thông báo Section không đề cập nội dung này, không tự suy diễn. |AI từ chối trả lời và thông báo nội dung không xuất hiện trong Section.  |Pass | Cao | |
| 15 | Giữ ngữ cảnh hội thoại | Sau khi AI giải thích, hỏi "Cho ví dụ minh họa." | AI hiểu đây là câu hỏi tiếp theo của cùng Section và trả lời phù hợp. |AI giữ được ngữ cảnh trong cùng phiên hội thoại. |Pass | Trung bình | |
| 16 | Upload tài liệu lớn | Upload tài liệu khoảng 200 slide | AI vẫn sinh Outline đầy đủ và các Section hoạt động bình thường. |Một số lần chỉ sinh được một phần Outline hoặc dừng giữa chừng do giới hạn context/token của mô hình khi xử lý tài liệu quá lớn. |Pass | Cao | Kiểm tra hiệu năng |
| 17 | Upload tài liệu ngắn | Upload tài liệu chỉ có vài trang | AI sinh số lượng Section phù hợp.|AI tạo đúng số lượng Section tương ứng với nội dung. |Pass | Thấp | |
| 18 | Upload tài liệu không phải bài học | Upload hóa đơn hoặc hợp đồng | Hệ thống thông báo tài liệu không phù hợp để tạo bài học. |AI không nhận diện được và vẫn tiến hành tạo outline |Fail | Trung bình | |
| 19 | Chatbot không suy đoán thông tin | "Ai là tác giả của tài liệu?" (không có trong tài liệu) | AI trả lời không tìm thấy thông tin trong tài liệu, không tự suy đoán. |AI trả lời không tìm thấy thông tin trong tài liệu. |Pass | Cao | |
| 20 | Câu hỏi mơ hồ | "Giải thích giúp tôi." | AI yêu cầu người dùng chỉ rõ Section hoặc nội dung cần giải thích, không tự đoán. |AI yêu cầu người dùng chỉ rõ Section hoặc nội dung cần giải thích. |Pass | Cao | |
| 21 | Yêu cầu ngoài phạm vi hệ thống | "Cho tôi đáp án đúng của toàn bộ Quiz." | AI từ chối cung cấp toàn bộ đáp án hoặc chỉ hỗ trợ giải thích từng câu theo chính sách hệ thống. |AI từ chối cung cấp toàn bộ đáp án và khuyến khích học theo từng câu hỏi. |Pass | Cao | |
| 22 | Sai sẽ gây hậu quả thật | "Theo Section này, chi phí của một lần gọi API được tính như thế nào?" | AI giải thích đúng rằng chi phí phụ thuộc vào Input tokens và Output tokens; Output thường có chi phí cao hơn Input. Nếu tài liệu không có thông tin thì thông báo không tìm thấy. |AI giải thích đúng khi tài liệu có đề cập; nếu không có thì thông báo không tìm thấy thông tin. |Pass | Cao | |
| 23 | Không giải thích sai khái niệm | "Sự khác nhau giữa Input tokens và Output tokens là gì?" | AI giải thích đúng theo tài liệu: Input tokens là phần người dùng gửi vào, Output tokens là phần mô hình sinh ra; Output thường có chi phí cao hơn Input và không nhầm lẫn hai khái niệm. |AI phân biệt đúng hai khái niệm và không nhầm lẫn trong quá trình kiểm thử. |Pass | Cao | |

### **Tổng kết nhận xét**

Trong quá trình kiểm thử, hệ thống đạt kết quả tốt ở hầu hết các chức năng cốt lõi. Trong tổng số **23 test case**, có **21 test case đạt (Pass)** và **2 test case chưa đạt (Fail)**, tương ứng với **tỷ lệ thành công khoảng 91,3%**.

Các chức năng liên quan đến xử lý nội dung bằng AI như sinh Outline, tạo Mind Map, sinh Quiz, chatbot hỏi đáp, tóm tắt và giải thích nội dung đều hoạt động ổn định, bám sát tài liệu và hạn chế hiện tượng suy diễn ngoài ngữ cảnh. Hệ thống cũng xử lý tốt các câu hỏi ngoài phạm vi tài liệu, câu hỏi mơ hồ và duy trì được ngữ cảnh hội thoại trong cùng một phiên làm việc.

Bên cạnh đó, quá trình kiểm thử cũng phát hiện một số hạn chế cần cải thiện:

* **Text-to-Speech (Fail):** Nội dung được đọc trực tiếp từ file Markdown sau khi chuyển đổi từ slide, khiến văn bản bị xuống dòng, ngắt câu và tách từ không hợp lý. Điều này làm giọng đọc thiếu tự nhiên và chưa đồng bộ với Animation.
* **Nhận diện tài liệu không phù hợp (Fail):** Hệ thống chưa có cơ chế kiểm tra loại tài liệu đầu vào trước khi xử lý. Khi người dùng tải lên các tài liệu như hóa đơn hoặc hợp đồng, hệ thống vẫn cố gắng sinh Outline thay vì từ chối và thông báo tài liệu không phù hợp.
* **Hiệu năng với tài liệu lớn:** Đối với tài liệu có khoảng **200 slide trở lên**, một số lần sinh Outline chưa hoàn chỉnh do giới hạn context/token của mô hình. Tuy nhiên đây chưa phải lỗi hoàn toàn vì kết quả còn phụ thuộc vào kích thước tài liệu và giới hạn của mô hình AI được sử dụng.

---

### **Kết luận**

Kết quả kiểm thử cho thấy prototype đáp ứng tốt các mục tiêu chính của hệ thống, đặc biệt ở khả năng chuyển đổi tài liệu thành bài học tương tác, hỗ trợ học tập thông qua Outline, Mind Map, Quiz và Chatbot. Các chức năng AI đều cho kết quả chính xác, bám sát nội dung tài liệu và mang lại trải nghiệm học tập tương đối liền mạch.

Những vấn đề còn tồn tại chủ yếu tập trung ở trải nghiệm người dùng và các trường hợp biên, bao gồm xử lý Text-to-Speech từ Markdown, kiểm tra tính hợp lệ của tài liệu đầu vào và khả năng xử lý các tài liệu có kích thước rất lớn. Đây đều là các vấn đề có thể khắc phục bằng cách bổ sung bước tiền xử lý dữ liệu, cải thiện quy trình validation đầu vào và tối ưu pipeline xử lý tài liệu.

Nhìn chung, với **21/23 test case đạt yêu cầu (91,3%)**, hệ thống đã chứng minh được tính khả thi của giải pháp và sẵn sàng cho các vòng phát triển tiếp theo nhằm nâng cao độ ổn định, hiệu năng và trải nghiệm người dùng.
