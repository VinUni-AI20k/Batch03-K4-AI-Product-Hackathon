# AI SPEC — Tổng hợp thông báo đa nền tảng cho học viên · Nhóm [Venture Arena Team B] · Zone [X]
Hướng: [ ] A — VLearn  [x] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

## §1. User & Job
- **Job executor + workflow**: 
  - Học viên tham gia các chương trình đào tạo/chuỗi bài giảng dài hạn (Ví dụ: Batch 03 - Khoá 4 AI Product Hackathon).
  - *Workflow hiện tại*: Nhận yêu cầu bài tập từ Email (Gmail/Outlook) → Nhận thông báo lịch học đột xuất/thay đổi từ Discord → Trao đổi tài liệu qua Zalo → Mở hệ thống LMS riêng để kiểm tra tài liệu và ghi nhận thời hạn nộp bài.
- **Core JTBD**: Nắm bắt và cập nhật toàn bộ dòng thời gian, thời hạn công việc và biến động lịch trình học tập từ nhiều nguồn phân mảnh để tối ưu hóa thời gian chuẩn bị.
- **Problem statement**: Học viên gặp khó khăn lớn trong việc bao quát thông tin học tập do thông báo bị rải rác trên nhiều kênh liên lạc khác nhau, dẫn đến tốn thời gian kiểm tra thủ công định kỳ và tăng nguy cơ bỏ lỡ thời hạn quan trọng.
- **Evidence**:
  - *Số liệu khảo sát sơ bộ*: Nghiên cứu hành vi thực tế (n = 20 học viên phản hồi): 85.0% xác nhận mất trung bình từ 15 phút mỗi ngày trở lên để đảo qua tất cả các nền tảng học tập (Email, Discord, Zalo). Trong đó, 45.0% mất từ 15-30 phút, 30.0% mất từ 30-60 phút, và 10.0% mất trên 60 phút. Có 45.0% học viên từng gặp sự cố quên hoặc vào muộn lịch học/lịch họp, và 70.0% thường xuyên phải cuống cuồng tìm lại link Zoom/Meet khi đến giờ vào lớp.
  - *≥5 quote nguyên văn làm bằng chứng (Evidence Log)*:
    1. "Quên đổi tên và lịch họp -> bị nhắc nhở" - Học viên Khóa 4 ẩn danh, Jul 30, 2026, 11:53 AM.
    2. "hạn nộp bài lab kì 2 năm học 2026 bị nhắc nhở" - Học viên Khóa 4 ẩn danh, Jul 30, 2026, 12:50 PM.
    3. "Hạn nộp bài => ảnh hưởng đến kết quả học tập" - Học viên Khóa 4 ẩn danh, Jul 30, 2026, 12:52 PM.
    4. "tháng 5, mình không nhận được thông báo ký kết thúc học phần và phải email thầy xin lên ký bù" - Học viên Khóa 4 ẩn danh, Jul 30, 2026, 2:30 PM.
    5. "Đổi cách tính điểm - C+ Đại số" - Học viên Khóa 4 ẩn danh, Jul 30, 2026, 2:34 PM.
    6. "Là trượt môn" - Học viên Khóa 4 ẩn danh, Jul 30, 2026, 2:44 PM.

## §2. Impact & quyết định chọn
- **Bảng impact ≥3 ứng viên**:

| Ứng viên tính năng | Bao nhiêu người ảnh hưởng | Tần suất | Tốn gì mỗi lần (Bottleneck) | Khả thi kỹ thuật |
| :--- | :---: | :---: | :--- | :---: |
| **Ứng viên 1 (CHỌN)**: AI Agent quét tự động Gmail, Outlook, Discord và tổng hợp dòng thời gian thông báo/deadline | Toàn bộ học viên (100%) | Hàng ngày | Mất 15-30m check thủ công; rủi ro bỏ sót thông tin cực cao. | Cao (Có API/Webhook mở sẵn) |
| **Ứng viên 2 (LOẠI)**: AI tự động phân tích video bài giảng để cắt nhỏ và tìm kiếm đoạn kiến thức theo câu hỏi | Học viên cần ôn tập (40%) | Trước kỳ thi | Mất 20-30m tua video thủ công trên Drive. | Trung bình (Tốn chi phí xử lý video/nhúng và hạ tầng tính toán) |
| **Ứng viên 3 (LOẠI)**: AI Agent tự động kết nối và tương tác nhắn tin nhắc bài trực tiếp qua tài khoản cá nhân Zalo | Toàn bộ học viên (100%) | Hàng ngày | Mất thời gian đọc tin nhắn trôi | Thấp (Zalo API kiểm soát quyền truy cập doanh nghiệp/cá nhân rất nghiêm ngặt) |

- **Ứng viên ĐÃ LOẠI + vì sao**: 
  - *Ứng viên 2*: Loại vì tần suất sử dụng không liên tục hàng ngày, chi phí vận hành xử lý dữ liệu video quá lớn trong khuôn khổ Hackathon ngắn ngày.
  - *Ứng viên 3*: Loại vì rào cản kỹ thuật từ chính sách bảo mật API của bên thứ ba (Zalo) gây rủi ro lớn cho việc phân phối sản phẩm thực tế trong lab.
- **Ứng viên CHỌN + vì sao**: Ứng viên 1 được chọn tuyệt đối vì giải quyết trực tiếp nỗi đau diễn ra hàng ngày của 100% học viên. Khả năng kết nối API của Gmail/Outlook và Discord Bot vô cùng khả thi để build bản Prototype chạy được ngay (Working Prototype), mang lại chỉ số giảm thiểu thời gian tra cứu rõ ràng từ 20 phút xuống dưới 2 phút.

## §3. Giải Pháp tương tự đã nghiên cứu
- **Microsoft Copilot (M365)**: 
  - *Flow*: Truy xuất thông tin thông qua câu lệnh chat tự do trong không gian dữ liệu của Outlook, Teams.
  - *Đáng học*: Khả năng kết nối bảo mật tốt, trích xuất dữ liệu ngữ nghĩa chuẩn xác.
  - *Đáng né*: Giao diện dạng chat-bot thuần túy bắt người dùng phải chủ động hỏi thì mới trả lời; không tự động cấu trúc hóa thành dòng thời gian trực quan.
  - *Mình khác gì*: Định hình sẵn giao diện Dashboard chuyên biệt cho học tập và tự động đẩy thông báo chủ động (Push notification) theo mức độ khẩn cấp mà không cần đợi học viên kích hoạt lệnh hỏi.
- **Lark Suite (Base/Task system)**: 
  - *Flow*: Tập trung luồng công việc, tài liệu và lịch trình vào một siêu ứng dụng (All-in-one).
  - *Đáng học*: Thiết kế giao diện luồng công việc cực tốt, các thông báo được cấu trúc rõ ràng.
  - *Đáng né*: Đòi hỏi toàn bộ hệ thống trường học hoặc tổ chức phải chuyển sang dùng chung một nền tảng, không giải quyết được bài toán khi học viên bị phân mảnh thông tin từ các công cụ bên ngoài tổ chức.
  - *Mình khác gì*: Đóng vai trò là một lớp trung gian (Middleware AI) đi thu thập dữ liệu từ các nền tảng có sẵn của học viên, không ép buộc học viên hay tổ chức thay đổi thói quen dùng app.

## §4. Thiết kế
- **Lát cắt MỘT CÂU**: Một *học viên Khóa 4* cung cấp *quyền truy cập Gmail/Discord*, AI Agent *trích xuất toàn bộ các thực thể lịch học/thời hạn bài tập nộp* và trả ra *một thông báo đã được chuẩn hóa*.
- **Non-goals**:
  1. KHÔNG xây dựng tính năng tự động nộp bài thay cho học viên lên hệ thống LMS.
  2. KHÔNG tự động gửi tin nhắn phản hồi thay cho học viên trên Discord/Gmail.
  3. KHÔNG xử lý các tệp tin bài giảng đính kèm có dung lượng lớn vượt quá giới hạn token (chỉ trích xuất text/thông báo).
- **Mức prototype nhắm tới**: [ ] Sketch [ ] Mock [x] Working
  - *Phần Mock*: Phần hiển thị thông báo liên kết mở rộng sang Zalo và giao diện nền tảng LMS riêng.
  - *Phần Thật*: Hệ thống quét API Gmail/Outlook, Discord Bot nhận tin nhắn thời gian thực, module LLM trích xuất thực thể (Môn học, Deadline, Link phòng học) và hiển thị lên web Dashboard.
- **Automation**: [ ] augment [ ] conditional [x] automate
  - *Lý do*: Quá trình quét và trích xuất thông tin cần chạy ngầm tự động (Automate) theo lịch trình để đảm bảo tính kịp thời. Chi phí lỗi (Cost-of-error) ở mức thấp vì thông tin được tổng hợp kèm theo đường link gốc (Source URL) để học viên đối chiếu trực tiếp, không gây hậu quả nghiêm trọng nếu AI phân loại sai mức độ ưu tiên.
- **§4b. Nguyên tắc đã áp dụng (HAX/PAIR)**:

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
| :--- | :--- |
| **HAX G1**: Làm rõ hệ thống có thể làm được gì | Ngay khi đăng nhập, hệ thống hiển thị rõ: "Tôi có thể tổng hợp lịch từ Gmail và Discord của bạn" kèm danh sách các kênh đang kết nối thành công. |
| **HAX G11**: Cung cấp khả năng sửa đổi, khắc phục lỗi | Tại mỗi dòng thông báo/deadline do AI trích xuất, luôn có nút "Chỉnh sửa lịch" hoặc "Đánh dấu sai" để học viên tự điều chỉnh lại ngày giờ thủ công. |
| **PAIR**: Thiết kế cơ chế Human-in-the-loop | AI chỉ làm nhiệm vụ đi gom và nháp sẵn lịch biểu vào Dashboard; học viên là người trực tiếp bấm "Xác nhận thêm vào Google Calendar cá nhân" để giữ quyền kiểm soát tối cao. |
| **PAIR**: Minh bạch nguồn dữ liệu trích xuất | Dưới mỗi thông tin tóm tắt thời hạn nộp bài luôn đính kèm hyperlink [Xem email gốc] hoặc [Đi tới tin nhắn Discord] để người dùng kiểm chứng tức thì. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

| Lớp lỗi | Tình huống cụ thể (Chỗ khó) | Kịch bản xử lý của hệ thống (Fallback) |
| :--- | :--- | :--- |
| **Lớp 1: Lỗi hệ thống/Dữ liệu đầu vào** | API Discord bị mất kết nối hoặc token truy cập Gmail của người dùng hết hạn đột xuất. | Hiển thị cảnh báo trạng thái màu đỏ trên Dashboard kèm hướng dẫn: "Token Gmail đã hết hạn, vui lòng bấm vào đây để cấp lại quyền trong 10 giây". |
| **Lớp 1: Lỗi hệ thống/Dữ liệu đầu vào** | Giảng viên thông báo deadline bằng cách gửi một file ảnh chụp màn hình thời khóa biểu lên Discord (không có văn bản). | AI phát hiện tin nhắn có chứa hình ảnh nhưng trích xuất text thất bại sẽ đưa tin nhắn đó vào mục "Thông báo cần kiểm tra thủ công" kèm cảnh báo "Phát hiện hình ảnh chưa xử lý". |
| **Lớp 2: Lỗi mô hình AI (Hallucination)** | Giảng viên viết tin nhắn: "Hạn nộp bài là thứ Hai tuần sau", AI suy diễn sai ngày cụ thể do không neo đúng mốc thời gian thực của tin nhắn. | Hệ thống bắt buộc phải sử dụng Metadata (Thời gian tạo tin nhắn của Discord) làm mốc neo cứng để LLM tính toán chính xác ngày dương lịch cụ thể trước khi hiển thị. |
| **Lớp 2: Lỗi mô hình AI (Hallucination)** | Tin nhắn chứa từ khóa mơ hồ: "Chúng ta sẽ nộp bài vào cuối tháng này nha các bạn". | AI trích xuất deadline với trạng thái "Ước tính/Chờ làm rõ" thay vì chốt ngày cố định, hiển thị dấu hỏi vàng để học viên lưu ý. |
| **Lớp 3: Trải nghiệm người dùng (UX)** | Dashboard có quá nhiều thông báo được quét về cùng một lúc gây rối mắt, phá vỡ mục tiêu ban đầu. | Mặc định áp dụng bộ lọc nhóm theo Môn học (Module) và sắp xếp theo Dòng thời gian giảm dần (Deadline gần nhất lên đầu). |
| **Lớp 3: Trải nghiệm người dùng (UX)** | Học viên bấm nhầm nút xóa một dòng deadline quan trọng mà AI vừa quét về. | Cung cả hệ thống nút "Hoàn tác (Undo)" xuất hiện trong vòng 5 giây ở góc màn hình và giữ một mục "Thùng rác thông báo" để khôi phục lại khi cần. |
| **Lớp 4: Lạm dụng/Tấn công hệ thống** | Một học viên khác cố tình spam liên tục các tin nhắn có cấu trúc giống deadline giả lập vào kênh chat chung Discord để phá hủy dữ liệu AI. | AI thiết lập bộ lọc nâng cao: Chỉ trích xuất thông báo từ các tài khoản có Role là "Giảng viên", "Trợ giảng (TA)" hoặc "Ban tổ chức". Tin nhắn từ học viên khác chỉ được quét nếu nằm trong nhóm thảo luận riêng được chỉ định. |
| **Lớp 4: Lạm dụng/Tấn công hệ thống** | Người dùng yêu cầu AI Agent tìm kiếm và hiển thị thông tin email cá nhân không liên quan đến học tập. | Hệ thống chặn ngay từ vòng tiền xử lý prompt bằng cách kiểm tra domain hoặc từ khóa liên quan đến giáo dục/học tập; từ chối xử lý các nội dung nhạy cảm ngoài phạm vi (Non-goals). |

## §6. Bốn đường đi của trải nghiệm
- **Happy path**: Học viên kết nối tài khoản → AI chạy ngầm quét dữ liệu định kỳ → Phát hiện email thông báo deadline bài tập mới từ Ban tổ chức → Trích xuất chuẩn xác thời gian, môn học, link nộp bài → Hiển thị gọn gàng lên Timeline Dashboard → Học viên vào xem và bấm tích chọn hoàn thành đúng hạn.
- **Low-confidence (②)**: AI quét được thông báo lịch học bù nhưng độ tin cậy trích xuất thời gian dưới 85% do câu văn của giảng viên dùng nhiều đại từ nhân xưng địa phương. Hệ thống sẽ hiển thị dòng lịch này với màu xám kèm ghi chú: "Hệ thống nghi ngờ đây là lịch học bù, bạn vui lòng bấm vào đây kiểm tra lại tin nhắn gốc để xác nhận".
- **Failure/không căn cứ (①)**: Giảng viên gửi email dặn dò chung chung về việc chuẩn bị tinh thần cho bài kiểm tra sắp tới mà không hề có mốc thời gian cụ thể. AI cố tình suy diễn ra một ngày ngẫu nhiên. *Cơ chế xử lý*: Trình chặn Prompt (Guardrails) sẽ kiểm tra nếu đầu ra không chứa các thực thể thời gian có căn cứ trong văn bản, hệ thống lập tức hủy bỏ bản ghi đó, không hiển thị lên Dashboard tránh gây hoang mang.
- **Correction (user sửa)**: Học viên phát hiện AI trích xuất sai thời gian nộp bài từ 9AM thành 9PM. Học viên nhấp trực tiếp vào ô thời gian trên Dashboard, sửa lại thành 9AM. Hệ thống ghi nhận log sửa đổi của user để tinh chỉnh lại Prompt trích xuất cho các lượt chạy sau.
- **Khi bị đòi ngoài phạm vi (③)**: Học viên gõ vào ô tìm kiếm của Dashboard: "Hãy viết giúp tôi một bài luận văn 500 từ về AI Product". *Phản hồi của AI*: "Tôi là trợ lý tổng hợp thông báo học tập StudyPulse. Tính năng viết luận văn nằm ngoài phạm vi hỗ trợ của tôi. Bạn có muốn tôi tìm kiếm các thông báo hoặc tài liệu liên quan đến bài luận này trong Gmail/Discord của bạn không?".
- **Case đặc thù domain (④)**: Lịch học bị thay đổi liên tục trong dịp nghỉ lễ Tết Nguyên Đán, dẫn đến việc giảng viên nhắn tin: "Lịch học bù của tuần này sẽ chuyển sang tuần sau Tết, còn bài tập thì vẫn nộp đúng hạn trước Tết". AI xử lý tách biệt hai thực thể: Cập nhật hoãn lịch học trên bảng Lịch trình, nhưng giữ nguyên thời hạn nộp bài trên bảng Deadline công việc.

## §7. Kiểm thử
- **Chiều chất lượng + định nghĩa kiểm chứng được**:
  - *Độ chính xác trích xuất thực thể (Entity Extraction Accuracy)*: Tỷ lệ phần trăm các trường dữ liệu (Thời gian, Tên môn học, Link nguồn) được AI trích xuất khớp hoàn toàn với nội dung gốc trong file kiểm thử.
  - *Tỷ lệ bỏ sót thông báo quan trọng (Missing Rate)*: Số lượng thông báo chứa deadline thực tế bị hệ thống bỏ qua không đưa lên Dashboard.
- **Golden set**: Gồm 20 test case mẫu (đã được nạp sẵn vào thư mục `eval/` trong repo), bao gồm: 5 email thông báo bài tập định dạng chuẩn, 5 tin nhắn Discord viết tắt của giảng viên, 5 email spam quảng cáo (để test bộ lọc nhiễu), và 5 tin nhắn thay đổi lịch học có cấu trúc phức tạp.
- **Quality bar**: "Đạt khi ≥ 90% test case trong Golden set trích xuất đúng hoàn toàn mốc thời gian (ngày, giờ), và tỷ lệ bỏ sót thông báo deadline (Missing Rate) bằng 0%".
- **Kết quả các lượt chạy**:

| Lượt chạy | Thời điểm | % Qua bộ Golden Set | Tỷ lệ sót deadline | Ghi chú |
| :---: | :---: | :---: | :---: | :--- |
| Lượt 1 | Jul 28, 2026 | 70% | 15% | Lỗi nghiêm trọng do chưa xử lý múi giờ hệ thống của Discord Bot. |
| Lượt 2 | Jul 29, 2026 | 85% | 5% | Cải tiến Prompt RAG; vẫn sót trường hợp giảng viên viết tắt tên môn học. |
| Lượt 3 | Jul 30, 2026 | 95% | 0% | Đã bổ sung bộ Glossary tên viết tắt các môn học; hệ thống đạt Quality Bar chốt. |

## §8. Phân công & kế hoạch
- **Phân công có tên cụ thể**:
  - `spec` + `evidence log`: Quang Minh Trương
  - `prompt engineering` + `eval`: Thành viên nhóm B1
  - `backend code` + `API Integration`: Thành viên nhóm B2
  - `frontend`: Thành viên nhóm B3
  - `demo video` + `pitch deck`: Quang Minh Trương
- **Willing users (≥3 tên)**: Anh Đức (Học viên K4), Minh Hạnh (Học viên K4), Quốc Bảo (Học viên K4).
  - *Kế hoạch vòng validation CP5*: Gửi bản chạy thử (Working Prototype) cho 3 người dùng trên sử dụng liên tục trong 2 ngày học tập cao điểm của Hackathon. Cuối đợt, thực hiện phỏng vấn với 3 câu hỏi chốt để ghi log làm bằng chứng:
    1. "Trong 2 ngày qua, bạn có phát hiện ra thông báo deadline nào có thật trên Discord/Email mà Dashboard của StudyPulse không quét về được không?"
    2. "Mốc thời gian hiển thị trên Timeline có lần nào bị lệch giờ so với thông báo gốc của giảng viên không?"
    3. "Bạn mất bao nhiêu giây để nắm được lịch học của ngày hôm nay khi sử dụng Dashboard so với trước đây?"
- **Multi-prototype**: Phát triển song song 2 phương án Prompting:
  - *Phương án A*: Sử dụng 1 Prompt tổng thể (Single-step LLM) để vừa phân loại vừa trích xuất thực thể cùng lúc nhằm tối ưu chi phí token và tốc độ phản hồi.
  - *Phương án B*: Sử dụng chuỗi Workflow (Multi-step LLM) - Bước 1 chỉ làm nhiệm vụ lọc thông báo quan trọng/nhiễu, Bước 2 nhận kết quả từ Bước 1 rồi mới tiến hành trích xuất chi tiết.
  - *Lý do chọn*: Qua thử nghiệm, phương án B được chọn làm chính thức cho bản Demo vì dù tốn thời gian xử lý hơn 1-2 giây nhưng độ chính xác trích xuất ngày giờ tăng từ 75% lên 95%, đảm bảo nghiêm ngặt Quality Bar của dự án.

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
| :---: | :---: | :--- |
| Jul 28, 2026 | Bổ sung module chuẩn hóa múi giờ hệ thống (UTC+7) | Fix lỗi cấu trúc trong Test Case #04: AI trích xuất lịch học bị sớm hơn 7 tiếng do lấy giờ gốc của máy chủ Discord. |
| Jul 29, 2026 | Thêm bảng tra cứu từ viết tắt (Glossary Mapping) trước khi đưa dữ liệu vào LLM | Giải quyết phản hồi từ User Anh Đức: AI không hiểu từ viết tắt "HĐH" là môn "Hệ điều hành" nên bỏ qua không trích xuất deadline. |
| Jul 30, 2026 | Đưa tính năng liên kết Zalo và LMS sang mục Mock-up (Non-goals của MVP) | Do hạn chế về thời gian nộp bài trước 23:59 và giới hạn API bảo mật của bên thứ ba. |
