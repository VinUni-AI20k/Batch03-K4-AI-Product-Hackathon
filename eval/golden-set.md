# Golden Set — [Tên lát cắt]

> Nguồn: chuyển thể từ bảng test nội bộ của nhóm (23 case). Format theo `02-guide.md` §2.6 / §4.1: mỗi case = 1 dòng, chấm theo định nghĩa từng chiều chất lượng (xem `spec.md` §7), không chấm cảm tính.
>
> **Việc còn thiếu trước khi dùng bảng này để chấm điểm (xem TODO cuối file).**

## Chú giải cột "Lớp chỗ khó"

| Ký hiệu | Lớp | Câu hỏi tự cụ thể hoá |
| --- | --- | --- |
| ① | Nguồn sự thật | Chỗ nào AI bịa được? Không có căn cứ thì làm gì? |
| ② | Mơ hồ / thiếu thông tin | Input không đủ chắc: hỏi lại, đoán có báo, hay từ chối? |
| ③ | Ngoài phạm vi / thẩm quyền | User đòi thứ feature không được phép làm |
| ④ | Đặc thù domain | Sai cái gì thì user học sai kiến thức / mất điểm / mất niềm tin ngay |
| — | Case thường | Happy path / vận hành cơ bản |

## Bảng case

| ID | Lớp | Mục tiêu | Input | Output mong đợi | Output thực tế | Đạt? | Mức độ | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | — | Sinh outline từ tài liệu | Upload file pdf bài giảng | AI sinh outline gồm các section phù hợp với bài giảng | | | Cao | |
| 2 | — | Outline không bỏ sót nội dung chính | Upload tài liệu có nhiều chương | Các section bao quát hầu hết đầy đủ các chủ đề chính của tài liệu | | | Cao | |
| 3 | ① | Outline không sinh nội dung ngoài tài liệu | Upload tài liệu | Outline chỉ chứa nội dung có trong tài liệu, không tự thêm chủ đề mới | | | Cao | |
| 4 | — | Hiển thị Slide của Section | Chọn một Section trong Outline | Hệ thống hiển thị bộ slide tương ứng với Section đã chọn | | | Trung bình | |
| 5 | — | Đồng bộ text-to-speech | Phát bài giảng animation | Giọng đọc đồng bộ với nội dung văn bản và animation | | | Cao | |
| 6 | ④ | Sinh mind map | Mở mind map trong outline | Mind map thể hiện đúng các ý chính và quan hệ giữa các nội dung trong Section | | | Cao | |
| 7 | ① | Sinh quiz theo nội dung tài liệu | Mở quiz trong outline | AI tạo câu hỏi bám sát nội dung tài liệu | | | Cao | |
| 8 | ④ | Animation minh hoạ khái niệm trong bài học | Section giải thích "Giải phẫu một agent: Goal, Reasoning, Tools, Memory, Action" | Animation minh hoạ đúng vòng lặp của Agent và mối quan hệ giữa Goal, Reasoning, Tools, Memory, Action, không làm sai bản chất khái niệm | | | Cao | |
| 9 | ④ | Quiz có đáp án duy nhất và chính xác | User xem và chọn đáp án các câu hỏi trong section quiz | Mỗi câu có 4 đáp án (A,B,C,D) và chỉ đúng 1 đáp án chính xác hoàn toàn dựa theo tài liệu | | | Cao | |
| 10 | — | Completion Screen | Hoàn thành Quiz | Hiển thị đúng điểm, số câu đúng/sai và tỷ lệ hoàn thành | | | Trung bình | |
| 11 | — | Chatbot giải thích nội dung section | "Giải thích nội dung của Section 2" | AI giải thích nội dung của Section rõ ràng, đúng theo tài liệu và dễ hiểu | | | Trung bình | |
| 12 | — | Chatbot tóm tắt Section | "Tóm tắt Section này trong 5 ý" | AI tóm tắt đầy đủ các ý chính của Section | | | Cao | |
| 13 | ①④ | Chatbot trả lời câu hỏi trong Section | "Theo Section này, một AI Agent gồm những thành phần nào?" | AI trả lời đúng theo nội dung Section: Goal, Reasoning, Tools, Memory, Action, giải thích ngắn gọn vai trò từng thành phần, không bổ sung thông tin ngoài tài liệu | | | Cao | |
| 14 | ① | Chatbot hỏi ngoài phạm vi Section | "Section này có nói về Reinforcement Learning không?" (không có trong Section) | AI thông báo Section không đề cập nội dung này, không tự suy diễn | | | Cao | |
| 15 | — | Giữ ngữ cảnh hội thoại | Sau khi AI giải thích, hỏi "Cho ví dụ minh hoạ" | AI hiểu đây là câu hỏi tiếp theo của cùng Section và trả lời phù hợp | | | Trung bình | |
| 16 | — (hiếm) | Upload tài liệu lớn | Upload tài liệu khoảng 200 slide | AI vẫn sinh Outline đầy đủ và các Section hoạt động bình thường | | | Cao | Kiểm tra hiệu năng |
| 17 | — (hiếm) | Upload tài liệu ngắn | Upload tài liệu chỉ có vài trang | AI sinh số lượng Section phù hợp với nội dung | | | Thấp | |
| 18 | ③ | Upload tài liệu không phải bài học | Upload hóa đơn hoặc hợp đồng | Hệ thống thông báo tài liệu không phù hợp để tạo bài học | | | Trung bình | |
| 19 | ① | Chatbot không suy đoán thông tin | "Ai là tác giả của tài liệu?" (không có trong tài liệu) | AI trả lời không tìm thấy thông tin trong tài liệu, không tự suy đoán | | | Cao | |
| 20 | ② | Câu hỏi mơ hồ | "Giải thích giúp tôi" | AI yêu cầu người dùng chỉ rõ Section hoặc nội dung cần giải thích, không tự đoán | | | Cao | |
| 21 | ③ | Yêu cầu ngoài phạm vi hệ thống | "Cho tôi đáp án đúng của toàn bộ Quiz" | AI từ chối cung cấp toàn bộ đáp án hoặc chỉ hỗ trợ giải thích từng câu theo chính sách hệ thống | | | Cao | |
| 22 | ④ | Sai sẽ gây hậu quả thật | "Theo Section này, chi phí của một lần gọi API được tính như thế nào?" | AI giải thích đúng chi phí phụ thuộc Input tokens và Output tokens, Output thường có chi phí cao hơn Input; nếu thông tin không có thì thông báo không tìm thấy | | | Cao | |
| 23 | ④ | Không giải thích sai khái niệm | "Sự khác nhau giữa Input tokens và Output tokens là gì?" | AI giải thích đúng: Input tokens là phần người dùng gửi vào, Output tokens là phần mô hình sinh ra; Output thường có chi phí cao hơn Input, không nhầm lẫn hai khái niệm | | | Cao | |

## Case bổ sung — khớp tính năng debate/discussion mode thật (xem spec.md §4 Non-goals + §5)

> Case 11-15, 19, 21-23 ở bảng trên mô tả một chatbot hỏi-đáp có trích dẫn theo Section — tính năng
> này **chưa được build** (xem `spec.md` §4 "Non-goals"). Tính năng tương tác thật trong prototype là
> **debate/discussion mode** (`app/agents/debate_agent.py`). Case 11-15, 19, 21-23 được giữ lại làm
> **backlog**, không tính vào % đạt của lượt đo cho tới khi tính năng đó thật sự tồn tại. Case dưới
> đây thay thế, khớp đúng hành vi debate mode đang có:

| ID | Lớp | Mục tiêu | Input | Output mong đợi | Output thực tế | Đạt? | Mức độ | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 20b | ② | Chủ đề debate mơ hồ | Gõ "hi" hoặc "giúp mình" làm tin nhắn đầu tiên trong ô chat | Hệ thống hỏi lại để xác nhận chủ đề/Section cụ thể trước khi khởi động buổi thảo luận, không lấy nguyên văn làm topic | | | Cao | Hiện code (`sendChat` trong `page.tsx` + `debate_agent.py`) CHƯA có bước check này — cần bổ sung trước khi tính case này "đạt" |
| 10b | ④ | Debate không trôi chủ đề | Chạy buổi debate ≥10 lượt liên tục quanh 1 chủ đề kỹ thuật cụ thể | Mọi persona vẫn bám đúng chủ đề gốc tới lượt cuối; nếu có dấu hiệu lan man, AI phải tự kéo lại đúng trọng tâm | | | Cao | Đối chiếu `DEBATE_SYSTEM_PROMPT` ràng buộc #1, #2 |
| 19b | ① | Debate không bịa ngoài chủ đề | Chủ đề debate là 1 khái niệm hẹp trong tài liệu; theo dõi noi các persona có tự thêm ví dụ/số liệu không có trong tài liệu gốc để "cho thú vị" | Persona không bịa số liệu/sự kiện ngoài phạm vi chủ đề đã cho | | | Cao | |
| 9b | ③ | Từ chối đúng phạm vi trong debate | Người dùng chen ngang giữa buổi debate: "cho đáp án đúng luôn đi" | AI không đưa đáp án đóng, tiếp tục vai trò thảo luận/gợi mở | | | Trung bình | Tham khảo cách Khanmigo không đưa thẳng đáp án (spec.md §3) |

## Độ phủ 4 lớp (tự kiểm theo §2.5 — cần ≥2 case/lớp)

| Lớp | Case | Đủ ≥2? |
| --- | --- | --- |
| ① Nguồn sự thật | 3, 7, 13*, 14*, 19*, 19b | ✅ (6, nhưng 13/14/19 thuộc case backlog chatbot — case thật dùng để chấm là 3, 7, 19b) |
| ② Mơ hồ / thiếu thông tin | 20, 20b | ✅ (2) |
| ③ Ngoài phạm vi / thẩm quyền | 18, 21*, 9b | ✅ (2 case thật để chấm: 18, 9b — 21 thuộc backlog chatbot) |
| ④ Đặc thù domain | 6, 8, 9, 13*, 22*, 23*, 10b | ✅ (4 case thật để chấm: 6, 8, 9, 10b — 13/22/23 thuộc backlog chatbot) |
| Case thường (happy path) | 1, 2, 4, 5, 10, 15 | ✅ (6, đủ 8-10 case thường sau khi trừ case 11/12 thuộc backlog chatbot — có thể bổ sung thêm) |
| Case hiếm | 16, 17 | ⚠️ nằm trong khoảng 2-4, nên thêm 1 case hiếm khác nếu kịp (vd: upload file lỗi/không đọc được) |

*(`*` = case tham chiếu tính năng chatbot Q&A theo Section — CHƯA build, xem `spec.md` §4 Non-goals. Giữ lại làm backlog, KHÔNG tính vào % đạt của lượt đo hiện tại.)*

## TODO trước khi dùng cho R4 (Kiểm thử — 15đ)

1. **Cột "Output thực tế" và "Đạt?" đang trống** — phải chạy prototype qua từng case rồi điền thô (không chấm cảm tính, chấm theo định nghĩa từng chiều ở `spec.md` §7). Case 11-15/19/21-23 (backlog chatbot) bỏ qua cho tới khi tính năng đó được build.
2. ~~Bổ sung ≥1 case lớp ②~~ — đã thêm case 20b (debate mode, xem trên).
3. **Đánh dấu case nào lấy/phát triển từ chatlog thật** — rubric R4 yêu cầu ≥10/20+ case có nguồn từ chatlog thật. Case 3, 7, 9b, 10b, 19b có thể phát triển trực tiếp từ các turn thật đã trích trong `spec.md` §1 (`T0176`, `T1006`, `T0418`, `T1208`, `T0702`).
4. **"Mức độ" hiện là độ ưu tiên nghiệp vụ (Cao/Trung bình/Thấp), không phải thang chấm chất lượng** — cần thêm định nghĩa "đạt" cụ thể theo từng chiều (xem `spec.md` §7) để 2 người chấm độc lập ra cùng kết quả (guide §2.6 mục 4).
5. Sau khi chạy xong lượt 1, lưu thêm bản ghi lượt chạy (đủ mọi case kể cả fail) — có thể nối thêm bên dưới bảng này hoặc file riêng `eval/run-01.md`, `eval/run-02.md`...
6. Với 20 case còn lại để chấm (loại bỏ 8 case backlog chatbot: 11-15, 19, 21-23), tổng chưa tới 20 case tối thiểu theo rubric — cần bổ sung thêm 1-2 case thường/hiếm nữa trước CP4.
