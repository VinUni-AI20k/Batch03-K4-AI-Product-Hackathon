# AI SPEC — Page-Aware AI Tutor · Nhóm Shark B · Zone E403
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tối ưu tính năng có sẵn  [ ] Tính năng mới

---

## §1. User & Job
*   **Job executor + workflow:**
    *   **Job executor:** Học viên khóa AI Thực Chiến đang học tập, ôn tập kiến thức trên nền tảng VLearn trước hoặc sau các buổi học lý thuyết/thực hành.
    *   **Workflow hiện tại (Trước khi tối ưu):**
        1.  Học viên truy cập VLearn và mở tài liệu bài giảng (file PDF slide).
        2.  Học viên tự đọc slide và transcript bài học tương ứng.
        3.  Khi gặp một trang slide chứa kiến thức khó, sơ đồ phức tạp hoặc nhiều thuật ngữ chuyên ngành tiếng Anh, học viên muốn hệ thống lại hoặc nhờ giải thích nhanh.
        4.  *Hành động hiện tại:* Học viên phải bôi đen (select text) một đoạn chữ dài rồi nhấn hỏi AI Tutor ở khung bên phải, hoặc tự copy text/thuật ngữ ra ChatGPT/Google dịch bên ngoài để tự tra cứu.
        5.  *Vấn đề:* Nếu học viên chỉ gõ câu hỏi dạng *"tóm tắt trang slide 7 cho mình"*, AI Tutor hiện tại không có khả năng định vị trang slide và sẽ báo lỗi hoặc trả lời sai lệch (bịa nguồn).
    *   **Workflow mới (Sau khi tối ưu bằng AI):**
        1.  Học viên truy cập VLearn và mở slide bài giảng.
        2.  Khi học viên chuyển slide (ví dụ đến Trang 7), giao diện frontend tự động đồng bộ hóa metadata số trang sang khung chat AI Tutor.
        3.  *Hành động mới:* Học viên chỉ cần click vào nút nhanh **"📝 Tóm tắt slide"** hiển thị sẵn trên giao diện, hoặc gõ trực tiếp *"Tóm tắt trang này cho mình"* vào khung chat.
        4.  *Xử lý AI:* AI Tutor tự động lấy đúng context của Trang 7 (slide text + transcript bài giảng của giảng viên về trang 7) để trả về bản tóm tắt ngắn gọn và giải thích thuật ngữ chuyên ngành trong 5 giây.
        5.  *Kết quả:* Học viên nắm bắt nhanh kiến thức cốt lõi mà không cần phải thực hiện bất kỳ thao tác bôi đen hay copy thủ công nào.
*   **Core JTBD (không tên sản phẩm/AI trong câu):**
    *   *Nắm bắt và làm rõ nhanh nội dung cốt lõi của một trang tài liệu học tập cụ thể đang xem mà không phải rời trang tài liệu hay thực hiện thao tác thủ công phức tạp.*
*   **Problem statement (KHÔNG chữ AI):**
    *   Học viên gặp khó khăn khi muốn nhanh chóng tóm tắt, hệ thống hóa hoặc dịch nghĩa các thuật ngữ chuyên ngành của một trang slide cụ thể trên nền tảng học tập trực tuyến, dẫn đến mất nhiều thời gian thao tác thủ công (bôi đen, sao chép) hoặc phải tự lật tìm rải rác giữa các tài liệu, dễ gây nản chí hoặc hiểu sai kiến thức.
*   **Evidence (chuẩn B — mining từ chatlog):**
    *   Dựa trên phân tích tệp dữ liệu chatlog thực tế **[chat_history_anonymized_for_hackathon.csv](file:///d:/VINUNIVERSITY/LAB/hackathon_5/data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv)** gồm 1.261 lượt đối thoại giữa học viên và AI Tutor, nhóm ghi nhận:
        *   **178 lượt hỏi (14.1% tổng số hội thoại)** liên quan trực tiếp đến nhu cầu tóm tắt/tổng hợp/hệ thống hóa slide bài học.
        *   **49 lượt hỏi** liên quan đến việc hỏi nghĩa thuật ngữ tiếng Anh chuyên ngành hoặc yêu cầu dịch nghĩa/so sánh.
        *   **37 lượt đánh giá kém (down-vote)** của học viên dành cho AI Tutor phần lớn bắt nguồn từ việc AI từ chối hoặc trả lời sai khi được hỏi về một trang cụ thể (do hệ thống RAG không có ánh xạ số trang).
    *   *5 ví dụ nguyên văn từ chatlog:*
        1.  **Turn ID `T0769` (Hội thoại `C0021`):** Học viên bôi đen *"giải thích nghĩa chi tiết của trang 4"* ➡️ AI trả lời: *"Rất xin lỗi vì hiện tại hệ thống tìm kiếm không tìm thấy nội dung cụ thể cho trang 4..."*
        2.  **Turn ID `T0408` (Hội thoại `C0031`):** Học viên bôi đen *"tóm tắt các chủ đề chính của slide day05-lecture-slides-batch03.pdf này"* ➡️ AI trả lời: *"Rất tiếc, tôi không thể tìm thấy tệp tin hoặc nội dung chi tiết... để tóm tắt các chủ đề chính..."*
        3.  **Turn ID `T1258` (Hội thoại `C0076`):** Học viên hỏi *"tóm tắt slide này"* (tại Trang 33) ➡️ AI trả lời: *"Rất tiếc là tôi đã tra cứu trong tài liệu nhưng chưa tìm thấy nội dung cụ thể của Trang 33..."*
        4.  **Turn ID `T0122` (Hội thoại `C0020`):** Học viên hỏi *"tóm tắt hết slice trong vài câu đi"* ➡️ AI trả lời: *"Rất tiếc là mình đã thử tìm kiếm... nhưng hệ thống chưa trả về kết quả cụ thể... vì mình không có quyền truy cập trực tiếp..."*
        5.  **Turn ID `T0213` (Hội thoại `C0055`):** Học viên hỏi *"tóm tắt tất cả slide"* ➡️ AI trả lời: *"Chào bạn, rất tiếc là hệ thống hiện không thể tự động tổng hợp toàn bộ nội dung của tất cả các slide trong một lần."*

---

## §2. Impact & quyết định chọn
*   **Bảng impact ứng viên giải pháp:**

| Ứng viên giải pháp | Đối tượng ảnh hưởng (tỷ lệ gặp từ dữ liệu) | Tần suất gặp | Chi phí tốn kém mỗi lần (nếu không có AI) | Tính khả thi trong 1.5 ngày | Chọn? |
|---|---|---|---|---|---|
| **1. Page-Aware AI Tutor (Định vị & Tóm tắt đúng trang slide đang học)** | ~14.1% số lượt hỏi (178/1261 hội thoại) | Liên tục mỗi khi tự học lý thuyết | 5–10 phút thao tác thủ công (bôi đen, dịch nghĩa, tự tổng hợp); dễ chán nản bỏ qua | Rất cao (Đã có sẵn data slide & transcript bài giảng sạch) | **CHỌN** |
| **2. Bản đồ lỗ hổng kiến thức lớp học dựa trên Chatlog của VLearn** | Giảng viên & TA (mỗi lớp 4-5 người) | 1 lần/buổi học | Mất 30-60 phút TA phải đọc thủ công lịch sử chat để tổng hợp chủ đề học sinh kẹt | Trung bình (Thuật toán gom cụm chủ đề phức tạp, khó eval) | LOẠI |
| **3. Stuck Detector - Phát hiện học viên bị kẹt code trên Discord** | Học viên thực hành lab (~15-20 học viên kẹt/buổi) | Trong các giờ thực hành bài tập | 15-30 phút tự mò lỗi, gây trễ hạn nộp bài | Thấp (Cần setup bot Discord thật và không có dữ liệu chatlog Discord mẫu) | LOẠI |

*   **Ứng viên ĐÃ LOẠI + vì sao:**
    *   *Ứng viên 2 (Bản đồ lỗ hổng)* bị loại vì đối tượng sử dụng chính là Giảng viên/TA, tần suất dùng thấp (chỉ cuối buổi) và thuật toán phân tích phát hiện "hiểu sai" (misconception) yêu cầu xử lý ngôn ngữ rất sâu, khó hoàn thành prototype chuẩn xác trong 1.5 ngày.
    *   *Ứng viên 3 (Stuck Detector)* bị loại do không có sẵn tệp dữ liệu chatlog Discord mẫu từ ban tổ chức, việc tích hợp thời gian thực vào Discord tốn nhiều công sức hạ tầng kỹ thuật hơn là tập trung tối ưu lõi AI.
*   **Ứng viên CHỌN + vì sao:**
    *   *Ứng viên 1 (Page-Aware AI Tutor)* được chọn vì giải quyết trực tiếp nỗi đau lớn nhất và có tần suất cao nhất của học viên trên VLearn. Dữ liệu slide và transcript được cấp sẵn có cấu trúc rất tốt để map theo số trang, giúp nhóm dễ dàng xây dựng bộ kiểm thử (Golden set) và đạt chất lượng tốt trong thời gian ngắn.

---

## §3. Giải pháp tương tự đã nghiên cứu
*   **NotebookLM (Google):**
    *   *Flow:* Học viên tải tài liệu học tập lên và đặt câu hỏi. Hệ thống sẽ trả lời kèm các nhãn trích dẫn số trang (ví dụ `[1]`, `[5]`), khi di chuột vào sẽ hiển thị đoạn trích.
    *   *Đáng học:* Trích dẫn trực quan giúp tăng độ tin cậy và dễ kiểm chứng thông tin.
    *   *Đáng né:* Người dùng vẫn phải đọc ở dạng text thô, không hiển thị slide song song dạng đồ họa/ảnh khiến việc học các sơ đồ (diagram) rất khó khăn.
    *   *Chúng ta khác gì:* Giao diện chia đôi màn hình: Bên trái hiển thị slide trực quan (dựng bằng HTML/CSS bôi đen được hoặc ảnh), bên phải là AI Tutor tự động bắt ngữ cảnh số trang đang xem để tóm tắt mà không cần người dùng tự lật hoặc tìm trang.
*   **ChatPDF / PDF.ai:**
    *   *Flow:* Tải file PDF lên và trò chuyện.
    *   *Đáng học:* Giao diện nhảy trực tiếp đến trang chứa đoạn text liên quan khi bấm vào trích dẫn.
    *   *Đáng né:* RAG hoạt động theo độ tương đồng vector nên khi học viên hỏi những câu chung chung như *"tóm tắt trang 7"*, RAG thường lấy nhầm các chunk của trang khác có chứa từ "trang 7" hoặc chứa từ khóa tương tự, dẫn tới trả lời sai lệch.
    *   *Chúng ta khác gì:* Sử dụng cơ chế lọc cứng metadata (`Metadata-filtered RAG`): Khi người dùng đang ở trang 7 và bấm tóm tắt, backend chỉ truy xuất dữ liệu thuộc duy nhất trang 7 đó (bao gồm text slide + transcript bài giảng của giáo viên tương ứng trang 7) để trả lời.

---

## §4. Thiết kế
*   **Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả):**
    *   *Một học viên đang tự học slide Day 03 trên VLearn, bấm nút "Tóm tắt slide" (hoặc gõ yêu cầu ở trang hiện tại), AI Tutor tự động trích xuất nội dung của đúng trang đó từ Database để hiển thị bản tóm tắt và giải thích từ khóa chuyên ngành trong 10 giây.*
*   **Non-goals (≥3 thứ KHÔNG build):**
    *   Không xây dựng hệ thống tự động sinh câu hỏi trắc nghiệm ôn tập (Quiz generator).
    *   Không hỗ trợ học viên tải lên tài liệu cá nhân bên ngoài hệ thống.
    *   Không dịch toàn bộ slide sang ngôn ngữ khác (chỉ giải thích thuật ngữ chuyên ngành).
*   **Mức prototype nhắm tới:** [ ] Sketch [x] Mock [ ] Working
    *   *Phần mock:* Giao diện danh sách bài học và thanh trượt tài liệu được mock đơn giản.
    *   *Phần thật:* Giao diện chatbox kết nối trực tiếp với API Gemini 3.5 Flash để gọi AI thật xử lý yêu cầu tóm tắt và giải thích dựa trên metadata trang hiện tại được gửi từ UI.
*   **Automation:** [ ] augment [x] conditional [ ] automate
    *   *Lý do theo cost-of-error:* Nếu AI tóm tắt hoặc giải thích sai lệch kiến thức bài học, học viên có thể học sai thông tin dẫn tới làm quiz bị mất điểm (hậu quả trung bình). Để giảm thiểu rủi ro, chúng tôi chọn mức **Conditional** (AI tự động xử lý khi trang slide có đầy đủ text/transcript trong DB; nếu trang slide chỉ chứa ảnh phức tạp hoặc thiếu dữ liệu, AI sẽ kích hoạt luồng dự phòng (Fallback) yêu cầu người dùng đặt câu hỏi chi tiết hoặc tự nhập thông tin bổ sung thay vì tự suy đoán).

### §4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR)

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| **HAX G1 — Làm rõ hệ thống làm được gì** | Khi mở khung chat, AI Tutor chào bằng thông điệp ngắn: *"Chào bạn! Mình có thể giúp bạn tóm tắt nhanh hoặc giải nghĩa thuật ngữ của trang slide bạn đang mở."* |
| **HAX G2 — Làm rõ nó làm tốt đến đâu** | Bên dưới câu trả lời của AI luôn có dòng chú thích: *"Bản tóm tắt này được sinh dựa trên nội dung Trang [N] của bài học. Hãy đối chiếu với slide bên cạnh để kiểm chứng."* |
| **HAX G10 — Thu hẹp phạm vi khi nghi ngờ (Graceful Failure)** | Nếu học viên yêu cầu tóm tắt một slide trống hoặc slide chỉ có hình ảnh chưa được mô tả, AI sẽ trả lời: *"Slide này chỉ có ảnh minh họa. Bạn có câu hỏi cụ thể nào về sơ đồ này không để mình hỗ trợ?"* thay vì tự bịa nội dung. |
| **HAX G11 — Giải thích vì sao** | Trong câu trả lời của AI, các ý chính sẽ được đính kèm số trang trích dẫn (ví dụ `[Trang 7]`). Khi người dùng bấm vào nhãn này, slide bên trái sẽ tự động cuộn đến trang tương ứng. |

---

*(Các phần dưới đây sẽ được hoàn thiện đầy đủ tại các mốc kiểm thử và nghiệm thu tiếp theo)*

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)
*(TODO cho CP3 & CP4)*

## §6. Bốn đường đi của trải nghiệm
*(TODO cho CP3 & CP4)*

## §7. Kiểm thử
*(TODO cho CP3 & CP4)*

## §8. Phân công & kế hoạch
*(TODO cho CP3 & CP4)*

## §9. Changelog
*(TODO cho CP5)*
