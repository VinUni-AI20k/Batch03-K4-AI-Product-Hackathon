# AI SPEC — Trợ lý AI Hỗ Trợ Tuyển Sinh · Nhóm B2-1 · Zone [X]
Hướng: [ ] A  [x] B — Trợ lý Tuyển Sinh  [ ] C
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

## §1. User & Job
- **Job executor + workflow:**
  - **Executor:** Thí sinh, người có nhu cầu đăng ký học và phụ huynh.
  - **Workflow hiện tại:** Người dùng tìm kiếm thông tin tuyển sinh -> Đọc sổ tay (handbook) quá dài hoặc hỏi trên các hội nhóm Facebook -> Nhận được thông tin lẫn lộn giữa chính thống và truyền miệng (có thể lỗi thời, sai lệch) -> Hoang mang, mất nhiều thời gian tổng hợp để ra quyết định. Khi hỏi Ban Tuyển Sinh thì phải chờ đợi phản hồi lâu.
- **Core JTBD (không tên sản phẩm/AI trong câu):**
  > *"Khi tôi tìm hiểu về chương trình để quyết định đăng ký, tôi muốn nhận được thông tin giải đáp nhanh chóng, có phân định rõ ràng giữa quy định chính thức và kinh nghiệm truyền miệng, để tôi không bị ngợp thông tin và đưa ra lựa chọn chính xác nhất."*
- **Problem statement (KHÔNG chữ AI):**
  - Người dùng thường bị lẫn lộn giữa thông tin chính thống từ ban tổ chức và thông tin truyền miệng từ cộng đồng (thường thiếu kiểm chứng, hoặc đã lỗi thời). Hơn nữa, việc trả lời chung chung một khối lượng thông tin lớn sẽ làm giảm trải nghiệm của từng nhóm đối tượng cụ thể (người tìm hiểu chung, người muốn đăng ký chi tiết, phụ huynh).
- **Evidence (Đạt cả tiêu chí A & B):**
  - **[Hướng A] Khảo sát người thật:** Thực hiện khảo sát 40 người dùng (lưu tại `ket_qua_khao_sat.csv`). Kết quả: **82.5%** xác nhận gặp vấn đề khó tìm thông tin trong Sổ tay; **90%** phải lên tìm kiếm trên các Group Facebook/Zalo; **65%** tốn từ 15 phút đến hơn 1 ngày chỉ để tìm câu trả lời, và **95%** xác nhận sự bất tiện khi tìm kiếm ngoài sổ tay.
  - **[Hướng B] Đếm trên dữ liệu (Chatlog/Log):** Tiến hành cào (mining) 250+ bài đăng từ Facebook Group/Fanpage tuyển sinh. *(Cách đếm: Chạy script đếm tần suất xuất hiện các nhóm keyword "sổ tay/handbook", "không thấy", "review/thực tế", "đậu/rớt" trong tập dữ liệu json)*. Kết quả: **68%** số lượng bài đăng thuộc về các thắc mắc không thể giải quyết ngay bằng sổ tay truyền thống.
  - **≥5 quote/ví dụ nguyên văn + nguồn (để kiểm chứng):**
    1. *Quote 1:* "Cho em hỏi phần thời gian nhận trợ cấp ở đâu vậy ạ, em đọc sổ tay không thấy rõ?" (FB Group tuyển sinh, bài post ngày 15/07)
    2. *Quote 2:* "Mọi người cho em xin review thực tế về môi trường học tập ở đây với ạ, em thấy trên mạng ý kiến trái chiều quá." (FB Group tuyển sinh, bài post ngày 18/07)
    3. *Quote 3:* "Anh chị Admin cho phụ huynh hỏi chương trình này yêu cầu đầu vào cụ thể ra sao, con tôi đang học lớp 12 thì có tham gia được không?" (Inbox Fanpage Zalo, log ID #1052)
    4. *Quote 4:* "Em tìm trong sổ tay không thấy nói về việc hỗ trợ tìm chỗ ở trọ, cho em hỏi ban tổ chức có hỗ trợ phần này không?" (FB Group tuyển sinh, bài post ngày 20/07)
    5. *Quote 5:* "Em được 8.5 IELTS và gpa 3.5 thì hồ sơ em có chắc chắn đậu vào chương trình không ạ?" (Inbox Fanpage Zalo, log ID #1088)

## §2. Impact & quyết định chọn
- **Bảng impact ≥3 ứng viên:**

| Ứng viên tính năng | Bao nhiêu người | Tần suất | Tốn gì mỗi lần | Khả thi |
|---|---|---|---|---|
| 1. Trợ lý phân loại Intent, RAG sổ tay & Search FB kèm Disclaimer | ~1.000 thí sinh/phụ huynh | 3-5 lần/người | Mất hàng giờ tự tổng hợp & đối chiếu thông tin | Cao (Có sẵn RAG và tool search FB) |
| 2. Chatbot Rule-based (Hỏi - Đáp theo menu) | ~1.000 thí sinh | 1-2 lần/người | Không linh hoạt, tốn thời gian bấm menu | Rất cao nhưng UX/Trải nghiệm kém |
| 3. Hệ thống chỉ gom nhóm & cào dữ liệu FB chung với nguồn chính thống | ~1.000 thí sinh | Thường xuyên | Rủi ro ảo giác (hallucination), sai lệch thông tin cao | Trung bình |

- **Ứng viên ĐÃ LOẠI + vì sao:**
  - Loại **Ứng viên 2** vì không cá nhân hóa được trải nghiệm (người mới vs người cần chi tiết vs phụ huynh).
  - Loại **Ứng viên 3** vì trộn lẫn thông tin chính thống và truyền miệng gây rủi ro lớn về tính chính xác và an toàn dữ liệu, sinh ảo giác.
- **Ứng viên CHỌN + vì sao (bằng số):**
  - **Chọn Ứng viên 1:** Xử lý khéo léo việc điều phối thông tin. Ưu tiên trả lời chính xác từ sổ tay cho người cần chi tiết; dẫn dắt từ từ cho người mới; tìm kiếm on-demand trên Facebook kèm disclaimer cho review thực tế, và có luồng ticket xử lý human-in-the-loop cho ca khó. Tiết kiệm trung bình **30 - 45 phút chờ đợi/câu hỏi** và giảm thiểu ít nhất **65%** số câu hỏi lặp lại gây quá tải cho đội ngũ tư vấn viên.

## §3. Giải pháp tương tự đã nghiên cứu
- **Chatbot tư vấn tuyển sinh truyền thống (Dialogflow/ManyChat):**
  - *Flow:* Dựa vào kịch bản (Flow) hoặc Keyword.
  - *Đáng học:* Dễ cài đặt, kiểm soát được 100% câu trả lời có sẵn.
  - *Đáng né:* Trả lời cứng nhắc (đưa nguyên khối thông tin dài), không xử lý được các câu hỏi ngoài lề (review chỗ ở, môi trường học) mà thí sinh rất quan tâm.
  - *Mình khác gì:* Hệ thống có **Router điều phối 4 intent**, thay đổi văn phong theo đối tượng (tổng quan vs chi tiết vs phụ huynh) và có **Luồng Search FB kèm Disclaimer minh bạch** cho các câu hỏi về trải nghiệm.

## §4. Thiết kế
- **Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả):**
  > **Một học sinh/phụ huynh** · đang **tìm hiểu thông tin đăng ký tuyển sinh** · cần **AI phân loại đúng nhu cầu để RAG sổ tay (trích dẫn chuẩn) hoặc tìm kiếm review thực tế trên Facebook (kèm disclaimer minh bạch)** · giúp họ **nhận được thông tin vừa đủ, đa chiều, khách quan và ra quyết định chính xác.**
- **Non-goals (≥3 thứ KHÔNG build):**
  1. Không được phép đưa ra lời khẳng định "dự đoán kết quả đậu/rớt" cho thí sinh.
  2. Không tự ý kết luận, chọn phe đại diện cho "đa số" khi các bài review từ cộng đồng (Facebook) có sự mâu thuẫn.
  3. Không thay thế hoàn toàn con người (vẫn giữ luồng tạo Ticket/Admin cho những ca cá nhân hóa sâu hoặc nằm ngoài kiến thức).
- **Mức prototype nhắm tới:** [ ] Sketch  [x] Mock  [x] Working
- **Automation:** [ ] augment  [x] conditional  [ ] automate
  - *Lý do:* Sử dụng **Router/LLM logic** để điều phối (conditional): RAG Sổ tay cho intent 1,2,4; Agent Search FB cho intent 3; Chủ động tạo Ticket cho trường hợp ngoại lệ.
- **§4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR):**

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| **HAX G1 (Make clear what the system can do)** | Phân định rõ với người dùng lúc nào là thông tin Sổ tay (chính thống), lúc nào là tổng hợp Cộng đồng. |
| **HAX G11 (Make clear why the system did what it did)** | Bắt buộc trích dẫn nguồn `[trang N]` (đối với sổ tay) và Link bài gốc + Ngày đăng (đối với nguồn Facebook). |
| **PAIR (Design for error & graceful degradation)** | Luồng tạo Ticket: Khi ngoài phạm vi hoặc không có tool phù hợp, Agent chủ động tạo ticket và thông báo quy trình phản hồi qua Email/Frontend. |
| **HAX G4 (Show contextually relevant information)** | Ưu tiên hiển thị nội dung/comment từ Admin/Chuyên gia (như LamLuu, AI thực chiến) lên đầu phần tổng hợp FB khi có sự trùng lặp. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

| # | Lớp chỗ khó | Kịch bản / Câu hỏi của người dùng | Quyết định của AI Agent |
|---|---|---|---|
| 1 | ① Nguồn sự thật (RAG) | "Cho tôi biết chính sách trợ cấp chi tiết" | Đi luồng 1 (Intent 2): RAG sổ tay, trả lời chi tiết + trích dẫn `[trang N]`. |
| 2 | ① Nguồn sự thật (Review FB) | "Mọi người bảo học ở đây nặng lắm phải không?" | Đi luồng 2 (Intent 3): Search FB, tổng hợp đa chiều + Link gốc + Disclaimer ("⚠️ Thông tin cộng đồng chưa xác nhận..."). |
| 3 | ② Mơ hồ / Thiếu TT | "Cho tôi hỏi thông tin khóa học" | Agent hỏi lại để xác định Intent 1 (tổng quan) hay 2 (chi tiết) hoặc 4 (phụ huynh). |
| 4 | ② Mơ hồ / Thiếu TT | "Em định đăng ký cho cháu nhà..." | Nhận diện Intent 4: Tư vấn ở mức tổng quan, văn phong thân thiện, hỏi thêm thông tin thí sinh. |
| 5 | ③ Ngoài thẩm quyền | "gpa em 3.5 thì có chắc chắn đậu không?" | Từ chối dự đoán; báo đây là vấn đề xét duyệt của BGK, chỉ cung cấp tiêu chí đánh giá. |
| 6 | ③ Ngoài thẩm quyền | "Hỗ trợ tôi làm hồ sơ bảo lưu ngay bây giờ với" | Tạo Ticket (Luồng ngoại lệ) gửi về trang Admin để người thật xử lý; thông báo user chờ email. |
| 7 | ④ Đặc thù domain (Mâu TT) | "Chỗ thuê trọ ở khu vực này đắt hay rẻ?" (FB có 2 ý kiến) | Tổng hợp và liệt kê CẢ 2 luồng ý kiến, KHÔNG tự kết luận ý nào đúng. Kèm Disclaimer. |
| 8 | ④ Đặc thù domain (Router nhầm)| Hỏi câu có vẻ review nhưng thực chất trong sổ tay có ghi | Router ưu tiên đi qua Luồng 1 (Sổ tay chính thống) trước khi đi Luồng 2. |

## §6. Bốn đường đi của trải nghiệm
- **Happy path 1 (Sổ tay/Chính thống):** Câu hỏi rành mạch nằm trong handbook -> Trả lời đúng intent (dẫn dắt từ từ hoặc chi tiết), có trích dẫn `[Trang X]`.
- **Happy path 2 (On-demand Search):** Câu hỏi về trải nghiệm thực tế -> Gọi tool Facebook -> Trả lời đa chiều + Link bài + Disclaimer. Đặc biệt ưu tiên highlight ý kiến của Admin/Chuyên gia.
- **Low-confidence (② - Thiếu ngữ cảnh):** Hỏi chung chung -> Hỏi lại để phân loại intent.
- **Failure/không căn cứ (①):** Câu hỏi hóc búa, cá nhân hóa sâu hoặc không có tool -> Tạo Ticket -> Admin tiếp nhận.
- **Correction (user sửa):** AI xin lỗi vì hiểu nhầm, ghi nhận ngay ngữ cảnh đính chính ("À ý em là hỏi review cơ...") để phân loại lại Intent và đổi luồng trả lời (từ Sổ tay sang FB Search hoặc ngược lại) mà không bắt người dùng phải gõ lại câu hỏi từ đầu.
- **Khi bị đòi ngoài phạm vi (③):** Từ chối dự đoán kết quả đậu/rớt, báo rõ thẩm quyền thuộc về ban giám khảo.
- **Case đặc thù domain (④ - Mâu thuẫn thông tin):** Tổng hợp và liệt kê tất cả các luồng ý kiến, KHÔNG tự kết luận ý nào đúng, kèm Disclaimer.

## §7. Kiểm thử
- **Chiều chất lượng:** Khả năng Router (điều hướng) chính xác; Độ minh bạch (Quality Bar): không suy diễn, trích dẫn đúng trang, luôn có disclaimer cho luồng FB.
- **Golden set (≥20 case):** Tập trung vào 6 nhóm case chính: (1) RAG chính thống, (2) Review kinh nghiệm, (3) Router ưu tiên sổ tay, (4) Từ chối dự đoán điểm, (5) Mâu thuẫn thông tin (không chọn phe), (6) Thiếu ngữ cảnh.
- **Quality bar:** Đạt khi **Routing Accuracy > 80%** (Phân loại đúng 4 intent), **100%** không suy diễn ngoài sổ tay đối với luồng chính thống, và **100%** các câu trả lời tổng hợp từ Facebook phải kèm theo link gốc và Disclaimer minh bạch.
- **Kết quả các lượt chạy (cập nhật đến trước CP6):**
  *(Ghi chú: Điền kết quả sau khi chạy bộ Golden set vào bảng dưới)*

| Tiêu chí | Lượt 1 (CP3) | Lượt 2 (CP5) | Đạt Quality Bar? |
|---|---|---|---|
| Routing Accuracy (%) | 64% | 80% | Yes |
| Tỉ lệ không suy diễn (Sổ tay) | 80% | 100% | Yes |
| Tỉ lệ có Link & Disclaimer (FB)| 100% | 100% | Yes |

## §8. Phân công & kế hoạch
- **Phân công có tên:** *(Tự chọn các phần: spec / evidence / prompt / code / demo)*
  - **Phan Văn Hoàng Nam**: [prompt]
  - **Trương Minh Hoàng**: [spec]
  - **Tạ Kim Ngân**: [evidence]
  - **Phạm Thế Đăng**: [code]
  - **Đào Trung Hiếu**: [demo]
- **Willing users (≥3 tên):** Phạm Quốc Thanh, Hoàng Tuấn Minh, Vũ Thu Huyền (từ danh sách khảo sát) sẵn sàng test prototype.

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| 2026-07-31 | Hoàn thiện Spec File dựa trên Draft tổng quan dự án | Đồng bộ team luồng xử lý 4 intent và các tính năng chính |
