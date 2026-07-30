# AI SPEC — VLearn Flashcard AI Tutor (Tự Động Tạo & Ôn Luyện Flashcard Theo Buổi Học) · Nhóm 08 · Zone 1
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tính năng mới  [ ] Tối ưu tính năng có sẵn

## §1. User & Job
- **Job executor + workflow**: Học viên khoá AI Thực Chiến. Sau mỗi buổi học (hoặc trong lúc học trực tuyến trên VLearn), học viên muốn tự kiểm tra độ hiểu bài ngay lập tức trước khi bước sang các bài tập thực hành phức tạp hơn.
- **Core JTBD**: Ôn luyện và kiểm tra đánh giá mức độ ghi nhớ/hiểu bài của bản thân cho từng bài học cụ thể mà không phải tốn thời gian đọc lại 3 tiếng transcript hay tự soạn câu hỏi thô.
- **Problem statement**: Học viên sau mỗi buổi học 2-3 tiếng không có sẵn bộ câu hỏi tự đánh giá nhanh xem mình đã thực sự nắm đúng các khái niệm trọng tâm hay chưa. Việc tự tạo flashcards thủ công tốn 30-45 phút/buổi, còn sử dụng công cụ AI chung bên ngoài (như ChatGPT) lại tạo câu hỏi lan man, không bám sát transcript và slide chính thức của khoá học.
- **Evidence (chuẩn A & B — log đầy đủ trong repo)**:
  - **Khảo sát (n = 22 học viên khoá K4)**: 18/22 (81.8%) xác nhận họ gặp khó khăn trong việc tự đánh giá độ hiểu bài sau buổi học và muốn có tính năng flashcard/quiz bám sát transcript bài giảng.
  - **Data Mining (chatlog VLearn & transcript)**: Có 142/2.522 lượt hội thoại trên VLearn tutor (chiếm 5.6%) học viên đặt câu hỏi mang tính chất kiểm tra kiến thức ("Cho mình hỏi khái niệm X là gì?", "Phân biệt A và B giúp mình", "Buổi 1 đã dạy về cái gì?").
  - **≥5 quotes nguyên văn**:
    1. *"Học xong buổi 2 tiếng nhiều kiến thức quá, mình không biết mình đã nắm chắc phần RAG hay chưa nếu không có câu hỏi test thử."* — Học viên Nguyễn V. A (K4)
    2. *"Tự làm flashcards trên Anki thì lười và tốn thời gian, ước gì VLearn tự tạo sẵn thẻ theo transcript buổi đó luôn."* — Học viên Trần T. B (K4)
    3. *"Mình hỏi ChatGPT tạo quiz thì nó toàn cho câu hỏi lý thuyết chung chung trên mạng, không giống cách thầy dạy trong slide."* — Học viên Phạm M. C (K4)
    4. *"Có nhiều thuật ngữ AI học xong nhớ mang mang, lật flashcards 5 phút trước giờ học tiếp theo là chuẩn nhất."* — Học viên Lê H. D (K4)
    5. *"Nhiều khi mình tưởng mình hiểu rồi nhưng khi nhìn vào câu hỏi trắc nghiệm/flashcard mới thấy mình bị hổng kiến thức."* — Học viên Hoàng K. E (K4)

## §2. Impact & quyết định chọn
- **Bảng impact 3 ứng viên**:

| Ứng viên tính năng | Số người gặp | Tần suất | Tốn gì mỗi lần | Khả thi build | Chọn? |
|---|---|---|---|---|---|
| **1. Flashcard AI Tutor tự động theo từng buổi học** | ~1.000 HV | 2-3 lần/tần (sau mỗi buổi học) | 30-45 phút tự soạn/tua video ôn bài | Cao (dùng RAG trích transcript) | **CHỌN** |
| 2. AI Tóm tắt tự động bài giảng dài 3 tiếng | ~1.000 HV | 1 lần/buổi | 20 phút đọc lại | Trung bình | Loại |
| 3. AI Gợi ý bài tập cá nhân hoá theo trình độ | ~300 HV | 1 lần/tuần | 60 phút làm bài | Thấp (cần tracking lâu dài) | Loại |

- **Ứng viên ĐÃ LOẠI + vì sao**:
  - *Ứng viên 2 (AI Tóm tắt)*: Đã có slide tóm tắt của giảng viên, học viên đọc tóm tắt thụ động không giúp kiểm tra độ hiểu sâu bằng việc active recall qua Flashcard.
  - *Ứng viên 3 (AI Gợi ý bài tập cá nhân hoá)*: Phạm vi quá rộng, đòi hỏi nhiều dữ liệu lịch sử làm bài của học viên, không khả thi build prototype chất lượng trong 1.5 ngày.
- **Ứng viên CHỌN + vì sao (bằng số)**:
  - Chọn **Flashcard AI Tutor tự động** vì giải quyết đúng nhu cầu active recall của 81.8% học viên, tần suất dùng cao (sau 8 buổi học x 1.000 HV = 8.000 lượt dùng/khoá), tốn ít cost-of-error (học viên trả lời sai thì tự lật xem đáp án và học lại ngay), hoàn toàn build được prototype sắc nét trong hackathon.

## §3. Giải pháp tương tự đã nghiên cứu
- **Quizlet AI**:
  - *Flow*: User nhập text -> AI sinh flashcard.
  - *Đáng học*: Giao diện lật thẻ 3D trực quan, có chế độ ôn tập chủ động.
  - *Đáng né*: Flashcard tự do không có nguồn trích dẫn chứng minh tính đúng đắn.
  - *Sản phẩm mình khác gì*: Flashcard bám sát transcript bài giảng khoá AI Thực Chiến, tự động gắn trích dẫn đoạn bài giảng `[Txx-NNN]` để học viên kiểm chứng.
- **NotebookLM Flashcards / Study Guide**:
  - *Flow*: Upload document -> Sinh study guide & câu hỏi.
  - *Đáng học*: Trích dẫn nguồn cực kỳ chính xác bám theo tài liệu gốc.
  - *Đáng né*: Giao diện dạng tài liệu tĩnh, không tối ưu cho việc lật thẻ học tập nhanh (spaced retrieval).
  - *Sản phẩm mình khác gì*: Kết hợp giao diện lật thẻ tương tác (Flashcard UI) với khả năng trích dẫn nguồn bám sát transcript và tích hợp AI Tutor giải thích tại chỗ.

## §4. Thiết kế
- **Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả)**:
  > *"Một học viên vừa kết thúc buổi học (hoặc đang chat trên VLearn) muốn kiểm tra độ hiểu bài -> AI Tutor dựa trên Transcript/Slide bài giảng tự động trích xuất các kiến thức trọng tâm để sinh bộ 5 Flashcards ôn tập (kèm câu hỏi, gợi ý, đáp án & trích dẫn [Txx-NNN]) -> Học viên lật thẻ ôn tập, tự đánh giá độ thuộc và nhận phản hồi/giải thích tức thì từ AI Tutor."*
- **Non-goals (3 thứ KHÔNG build)**:
  1. KHÔNG build hệ thống chấm điểm hay chấm bài thi trắc nghiệm chính thức thay thế quiz của khoá.
  2. KHÔNG build thuật toán Spaced Repetition phức tạp (như Anki SM-2) đòi hỏi lưu trữ cơ sở dữ liệu học tập nhiều tháng.
  3. KHÔNG sinh flashcard cho các tài liệu nằm ngoài giáo trình khoá AI Thực Chiến.
- **Mức prototype nhắm tới**: [x] Mock / Working — Chạy web app interactive hoàn chỉnh, kết nối Google Gemini API thật (nếu có key) hoặc chạy mock AI generator thông minh dựa trên data pack thật (`data/vlearn-pack`).
- **Automation**: [x] Conditional — AI tự động trích xuất transcript để sinh flashcards chuẩn; học viên chủ động lật thẻ & tự đánh giá; trường hợp thắc mắc học viên có thể bấm "Hỏi AI Tutor" để nhận giải thích chi tiết.
- **§4b. Nguyên tắc HAX / PAIR đã áp dụng**:

| Nguyên tắc HAX/PAIR | Áp dụng cụ thể vào đâu trong prototype |
|---|---|
| **G1 — Làm rõ hệ thống làm được gì** | Banner thông báo rõ: "AI Tutor sinh Flashcard dựa trên Transcript buổi học [Day 1/Day 2]. Bạn có thể lật thẻ ôn tập và hỏi AI giải thích." |
| **G2 — Làm rõ độ tin cậy & Nguồn** | Mỗi thẻ Flashcard đều hiển thị Badge trích dẫn rõ mã transcript (ví dụ: `[T01-042]`) để học viên biết câu hỏi dựa vào đâu. |
| **G9 — Cho phép sửa/đổi dễ dàng** | Học viên có thể bấm "Tạo bộ thẻ khác" hoặc "Yêu cầu AI điều chỉnh độ khó" ngay tại màn hình ôn tập. |
| **G10 — Thu hẹp phạm vi khi nghi ngờ** | Khi dữ liệu transcript bài học không có nội dung nâng cao, AI Tutor từ chối đoán và thông báo giới hạn trong phạm vi bài giảng. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (8 kịch bản)

| Kịch bản | Lớp chỗ khó | Hành vi mong muốn (nói gì, hiện gì, cho user làm gì) | Nguyên tắc áp dụng |
|---|---|---|---|
| 1. AI tự bịa câu hỏi/đáp án không có trong bài giảng | ① Nguồn sự thật | Ép RAG Prompt chỉ dùng thông tin có trong transcript; hiển thị mã trích dẫn `[Txx-NNN]`. Nếu không tìm thấy trích dẫn, không hiển thị thẻ đó. | G2, PAIR Grounding |
| 2. Đáp án Flashcard bị mơ hồ, giải thích không rõ ràng | ① Nguồn sự thật | Cung cấp nút "Hỏi AI giải thích thêm", AI Tutor mở drawer bên phải phân tích chi tiết đáp án theo ngữ cảnh slide. | G9, G11 |
| 3. Học viên yêu cầu tạo flashcard về chủ đề chưa được dạy (vd: Agentic Frameworks ở Day 1) | ② Mơ hồ / Thiếu TT | AI hiển thị thông báo: "Chủ đề này thuộc bài học nâng cao ở các buổi sau. Hiện tại AI chỉ tạo flashcard bám sát bài học Day 1." | G10 |
| 4. Input của học viên quá ngắn ("tạo quiz bài 1 đi") | ② Mơ hồ / Thiếu TT | AI tự động áp dụng preset mặc định: Sinh 5 câu hỏi trọng tâm nhất của Day 1 kèm phân loại độ khó. | G1 (Defaults) |
| 5. Học viên yêu cầu AI cho biết đáp án bài thi cuối kỳ | ③ Ngoài phạm vi | AI từ chối: "AI không có quyền truy cập ngân hàng đề thi chính thức. AI chỉ hỗ trợ tạo thẻ ôn luyện kiến thức bài giảng." | G10 |
| 6. Học viên yêu cầu viết code hoàn chỉnh một dự án thương mại | ③ Ngoài phạm vi | AI hướng dẫn: "Tính năng Flashcard tập trung vào củng cố khái niệm bài học. Để viết code dự án, bạn hãy trao đổi với AI Tutor chính trên VLearn." | G1 |
| 7. Sinh câu hỏi hiểu sai khái niệm core (vd: nhầm Augment với Automate) | ④ Đặc thù domain | Sử dụng Glossary chuẩn của khoá học trong Prompt System để ép định nghĩa chính xác 100%. | G2, Domain Guard |
| 8. Mã trích dẫn transcript bị trỏ sai dòng | ④ Đặc thù domain | Thiết lập kiểm tra định dạng mã `[Txx-NNN]` khớp với file transcript thật trước khi render thẻ lên UI. | G2 |

## §6. Bốn đường đi của trải nghiệm
- **Happy path**: Học viên chọn Buổi học (Day 1) -> Bấm "Sinh Flashcards" -> AI hiển thị 5 thẻ -> Học viên lật từng thẻ xem đáp án & trích dẫn `[T01-015]` -> Bấm đánh giá (🟢 Đã thuộc) -> Xem báo cáo hoàn thành.
- **Low-confidence path (② Mơ hồ)**: Học viên chọn bài học nhưng dữ liệu transcript ngắn -> AI sinh 3 thẻ thay vì 5 thẻ và đưa cảnh báo: "Dữ liệu bài học ngắn, AI đã chọn lọc 3 câu hỏi quan trọng nhất."
- **Failure / Không căn cứ path (① Nguồn sự thật)**: AI phát hiện thông tin câu hỏi không có mã trích dẫn hợp lệ -> Tự động loại bỏ thẻ lỗi và thay thế bằng thẻ kiểm tra khái niệm tổng quan kèm disclaimer.
- **Correction path (User sửa / Hỏi lại)**: Học viên không hiểu đáp án của thẻ -> Bấm nút "Hỏi AI giải thích thêm" -> Mở AI Tutor Drawer -> Học viên gõ thắc mắc -> AI giải thích chi tiết kèm trích dẫn văn bản transcript.

## §7. Kiểm thử
- **Chiều chất lượng + định nghĩa kiểm chứng được**:
  1. *Tính chính xác kiến thức*: Đáp án khớp 100% với nội dung slide & transcript khoá học (Pass/Fail).
  2. *Tính đầy đủ trích dẫn*: 100% thẻ flashcard có mã trích dẫn `[Txx-NNN]` hợp lệ trỏ tới bài giảng (Pass/Fail).
  3. *Trải nghiệm lật thẻ & giải thích*: Thẻ lật mượt mà, AI Tutor giải thích dễ hiểu dưới 150 từ (Thang 1-5, ≥4 là Pass).
- **Golden set (20 case trong `eval/golden_set.json`)**:
  - 10 case thô trích từ chatlog VLearn thật và transcript Day 1 & Day 2.
  - 8 case đại diện cho 4 lớp chỗ khó (2 case/lớp).
  - 2 case biên/hiếm (input rỗng, bài giảng nhiều thuật ngữ tiếng Anh).
- **Quality bar (chốt từ 23:59 N1)**: "Đạt khi ≥ 85% case qua toàn bộ bộ kiểm thử Golden set, và 100% case không vi phạm lỗi bịa nguồn kiến thức."
- **Kết quả các lượt chạy**:

| Lượt chạy | Ngày/Giờ | Số case test | % Đạt | Ghi chú |
|---|---|---|---|---|
| Lượt 1 (Baseline Mock) | N1 17:00 | 20 | 85.0% | Đạt quality bar mốc CP2 với bộ dữ liệu canonical |

## §8. Phân công & Kế hoạch
- **Phân công thành viên**:
  - Nguyễn Thế Hân: Product Lead & Lead Frontend (Build codebase interactive UI, Flashcard 3D flip effect).
  - Thành viên 2: AI Prompting & RAG Integration (Tối ưu prompt Gemini API & trích dẫn transcript `[Txx-NNN]`).
  - Thành viên 3: Data Mining & Golden Set (Xây dựng 20 test cases trong `eval/` từ data pack).
  - Thành viên 4: Validation & Slide Presentation (Thực hiện user test với 5 người dùng và soạn slide demo 6 trang).
- **Willing users (≥3 người ngoài nhóm)**:
  1. Học viên Lê Văn H. (Zone 1 - K4)
  2. Học viên Phạm Thị K. (Zone 2 - K4)
  3. Học viên Trần Minh T. (Zone 1 - K4)
- **Kế hoạch vòng validation CP5**:
  - Giao task: "Hãy chọn Buổi 1, sinh bộ Flashcard và lật thẻ ôn tập 5 câu hỏi."
  - 3 câu hỏi phỏng vấn:
    1. *"Điều gì ở trải nghiệm lật thẻ Flashcard này làm bạn thấy tiện nhất hoặc khó chịu nhất?"*
    2. *"Bạn có tin tưởng đáp án và nguồn trích dẫn [Txx-NNN] trên thẻ không — vì sao?"*
    3. *"Bạn có muốn dùng tính năng này sau mỗi buổi học thật trên VLearn không — vì sao?"*

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| N1 17:00 | Tạo bản thảo Spec CP2 | Khởi tạo cấu trúc spec theo rubric CP2 |
