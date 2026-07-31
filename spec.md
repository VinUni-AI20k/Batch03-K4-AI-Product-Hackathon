# AI SPEC — VLearn Context-Aware AI Tutor · Nhóm My3Mien · Zone A
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tối ưu tính năng có sẵn  [ ] Tính năng mới

## §1. User & Job
- Job executor + workflow: 
  * **Job executor:** Học viên Khóa 3 và Khóa 4 đang theo học chương trình VinAI thực chiến trên hệ thống VLearn trong các buổi tự học hoặc ôn tập trước bài kiểm tra.
  * **Workflow hiện tại:** Đọc slide trên VLearn ➔ Gặp thuật ngữ khó/mơ hồ (như *Microservices*, *Loosely Coupled*) ➔ Chuyển tab mở Google/ChatGPT/Discord ➔ Copy-paste câu hỏi ➔ Đọc câu trả lời chung chung ➔ Quay lại slide (bị ngắt quãng luồng tư duy / mất bối cảnh).
- Core JTBD: "Khi gặp thuật ngữ hoặc khái niệm kiến thức khó trong tài liệu học tập trên VLearn, học viên Khóa 3 và Khóa 4 muốn lập tức hiểu rõ ý nghĩa theo đúng ngữ cảnh bài học và kiểm tra độ hiểu của bản thân, để có thể tiếp tục tiến trình học mà không bị xao nhãng hoặc tiếp thu sai kiến thức."
- Problem statement: "Học viên Khóa 3 và Khóa 4 khi học các môn chuyên ngành thường xuyên bị ngắt quãng luồng tư duy và nhầm lẫn các khái niệm phụ thuộc (như Tight/Loose Coupling, Microservices/Monolith) khi phải tự tìm kiếm giải thích bên ngoài tài liệu bài giảng, dẫn đến việc tốn thời gian tra cứu và hổng kiến thức nền mà không tự phát hiện được."
- Evidence:
  - Số liệu mining / kết quả khảo sát: 
    * Mining trên 150 log trao đổi thảo luận của học viên Khóa 3 & 4: **42/150 (28%)** câu hỏi lặp đi lặp lại về việc phân biệt các khái niệm kiến thức nền (Coupling, Cohesion, Microservices).
    * Khảo sát nhanh (n = 24 học viên Khóa 3 & 4): **18/24 (75%)** xác nhận thường xuyên phải chuyển tab ra ngoài để search ChatGPT/Google khi đọc slide nhưng gặp câu trả lời quá dài hoặc lệch bối cảnh slide.
  - ≥5 quote/ví dụ nguyên văn + nguồn:
    1. *"Slide 12 ghi Loose Coupling mà không hiểu khác gì với Tight Coupling ở Slide 5 vậy mọi người?"* — [Log Chat Discord Khóa 3]
    2. *"Hỏi ChatGPT Microservices nó ra cả bài báo dài, trong khi mình chỉ cần hiểu đúng cái sơ đồ trên slide 12 thôi."* — [Khảo sát HV Khóa 3 - Nguyễn Quang Minh]
    3. *"Nhiều lúc đọc slide hiểu sương sương tưởng đúng rồi, tới lúc làm Quiz mới biết mình bị nhầm kiến thức nền."* — [Khảo sát HV Khóa 3 - Trịnh Hải Đăng]
    4. *"Mỗi lần không hiểu thuật ngữ lại phải copy qua tab khác search, học xong 1 slide tốn cả nửa tiếng."* — [Khảo sát HV Khóa 4 - Nguyễn Minh Công]
    5. *"Tutor trả lời trên forum thường bị chậm, đến khi được rep thì mình đã học sang bài khác rồi."* — [Log Forum VLearn Khóa 3]

## §2. Impact & quyết định chọn
- Bảng impact ≥3 ứng viên:

| Ứng viên ý tưởng | Bao nhiêu người gặp | Tần suất | Tốn gì mỗi lần | Khả thi build | Chọn? |
|---|---|---|---|---|---|
| **1. Context-Aware AI Tutor (Tóm tắt Slide + Bôi đen chữ / Khoanh hình ảnh sơ đồ + Micro-Quiz ôn tập + Auto Jump lấp lỗ hổng)** | 21/24 HV K3&K4 khảo sát (87.5%) | Hàng ngày / Mỗi buổi học | 10-15 phút chuyển tab, gõ lại sơ đồ & đọc giải thích lệch bối cảnh | Cao (Web Prototype + AI Call / Vision) | **CHỌN** |
| **2. Chatbot tra cứu tài liệu tổng hợp (RAG Chatbot dạng Chat riêng)** | 12/24 HV K3&K4 khảo sát (50%) | 2-3 lần/tuần | 5-7 phút gõ prompt mô tả lại slide/sơ đồ | Trung bình | LOẠI |
| **3. Tự động dịch Slide sang tiếng Việt** | 8/24 HV K3&K4 khảo sát (33%) | Thỉnh thoảng | 2-3 phút đọc bản dịch thô | Cao | LOẠI |

- Ứng viên ĐÃ LOẠI + vì sao:
  * *Chatbot RAG chung:* Bị loại vì học viên vẫn phải gõ thủ công mô tả bối cảnh hoặc không thể gửi nhanh vùng hình ảnh/sơ đồ trên slide, chưa giải quyết triệt me vấn đề ngắt quãng luồng tư duy.
  * *Tự động dịch Slide:* Bị loại vì dịch thô không giúp học viên hiểu bản chất các sơ đồ kiến thức chuyên ngành (như Microservices/Coupling), dễ gây hiểu sai.
- Ứng viên CHỌN + vì sao: Chọn **Ứng viên 1** vì tác động vượt trội ($21/24$ HV K3&K4 gặp), giải quyết trực tiếp 3 nhu cầu cốt lõi:
  * **Tóm tắt Slide tự động:** Lập tức cô đọng 3 ý chính của slide ngay khi chuyển trang.
  * **Bôi đen chữ / Khoanh vùng hình ảnh (Image Selection):** Giúp học viên hỏi ngay lập tức về các đoạn văn hoặc sơ đồ phức tạp mà không cần gõ mô tả lại.
  * **Micro-Quiz ôn tập & Auto-Jump:** Đánh giá độ hiểu bài ngay tại chỗ và tự động nhảy về slide kiến thức nền để lấp lỗ hổng nếu học viên trả lời sai.

## §3. Giải pháp tương tự đã nghiên cứu
- **Khanmigo (Khan Academy):**
  * Flow: Trợ lý AI nằm cạnh video/bài tập, gợi ý câu hỏi theo tiến trình.
  * Đánh học: Tích hợp sâu vào nội dung bài học, không cho đáp án trực tiếp mà gợi ý tư duy.
  * Đánh né: Nhập liệu hoàn toàn bằng ô chat, chưa có thao tác bôi đen bối cảnh trực tiếp trên tài liệu.
  * Mình khác gì: Tích hợp thao tác **Text Selection (Bôi đen ➔ Nút nổi)** giảm thời gian đặt câu hỏi xuống 0.5s và tự động **Chuyển Slide (Slide Jump)** khi trả lời sai Quiz.
- **NotebookLM (Google):**
  * Flow: Upload tài liệu ➔ AI tóm tắt và cho phép chat hỏi-đáp có cite nguồn bên cạnh.
  * Đánh học: Trích dẫn nguồn (citation) chuẩn xác ngay bên cạnh câu trả lời.
  * Đánh né: Là công cụ làm việc độc lập, không gắn liền với giao diện học tập/LMS trực tuyến.
  * Mình khác gì: Đóng vai trò Trợ lý gia sư (Tutor) tương tác 2 chiều (giải thích + đố lại bằng Micro-Quiz), không chỉ là công cụ tra cứu thụ động.

## §4. Thiết kế
- Lát cắt MỘT CÂU: "Một học viên Khóa 3/Khóa 4 bôi đen thuật ngữ hoặc khoanh vùng sơ đồ trên Slide 12 để AI tóm tắt/giải thích ngắn gọn đúng bối cảnh slide kèm 1 câu hỏi Micro-Quiz ôn tập kiểm tra, và khi học viên trả lời sai, AI phát hiện hổng kiến thức nền rồi chủ động đưa nút bấm tự động nhảy về Slide 5 kèm tóm tắt kiến thức cũ để lấp lỗ hổng ngay lập tức."
- Non-goals (≥3 thứ KHÔNG build):
  1. KHÔNG build hệ thống quản lý lớp học / chấm điểm toàn diện cho Giảng viên.
  2. KHÔNG build tính năng nhận diện giọng nói hoặc cuộc gọi video call thoại với AI.
  3. KHÔNG build công cụ chỉnh sửa/vẽ trực tiếp sơ đồ đồ họa phức tạp trên slide.
- Mức prototype nhắm tới: [x] Mock
  * **Phần Mock:** Dữ liệu slide bài giảng giả lập (Slide 5, Slide 12), khung khoanh chọn ảnh giả lập và giao diện ứng dụng (UI Framework).
  * **Phần Thật (Thực hiện ở CP3 - N2):** Lời gọi model `openai/gpt-4o-mini` qua OpenRouter xử lý Tóm tắt Slide, giải thích bối cảnh bôi đen text/ảnh sơ đồ và sinh Micro-Quiz ôn tập.
- Automation: [x] augment — Lý do theo cost-of-error: Kiến thức chuyên ngành nếu AI tự quyết định thay hoặc trả lời sai sẽ khiến học viên tiếp thu sai bản chất (Cost-of-error đắt). Do đó, AI chỉ đóng vai trò **Augment** (gợi ý tóm tắt, giải thích hình ảnh, đặt câu hỏi ôn tập, đưa Card đề xuất), quyền bấm chuyển slide hay chọn đáp án hoàn toàn do học viên quyết định.

- §4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR):

  | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
  |---|---|
  | **G1 — Làm rõ hệ thống làm được gì** | Ngay góc trên Sidepanel hiện Badge xanh: `🟢 Context Synced: Slide 12 (Chương 3)` và các nút chức năng rõ ràng (`Tóm tắt Slide`, `Khoanh vùng sơ đồ`, `Hỏi AI`). |
  | **G2 — Làm rõ làm tốt đến đâu** | AI luôn mở đầu câu trả lời bằng: *"Theo sơ đồ/nội dung Slide 12, [khái niệm] là..."* để minh bạch căn cứ câu trả lời nằm trong slide. |
  | **G8 — Gạt bỏ dễ dàng** | Khi AI đưa ra Card gợi ý `📌 Open Slide 5`, học viên có thể lờ đi tiếp tục học mà không bị chặn (block) giao diện. |
  | **G10 — Thu hẹp phạm vi khi nghi ngờ** | Khi học viên chọn vùng ảnh mờ hoặc trả lời sai Quiz ôn tập, AI không đoán bừa mà phát hiện lỗ hổng và thu hẹp bối cảnh bằng cách gợi ý xem lại kiến thức nền ở Slide 5. |
  | **G11 — Giải thích vì sao** | Khi hiện Card gợi ý chuyển Slide, AI ghi rõ lý do: *"Có vẻ bạn đang nhầm lẫn sơ đồ Microservices với Tight Coupling ở Slide 5"*. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

| STT | Tình huống cụ thể | Lớp chỗ khó | Hành vi mong muốn (Nói gì, hiện gì, cho user làm gì tiếp) | Nguyên tắc áp (HAX/PAIR) |
|:---:|---|---|---|---|
| 1 | Học viên hỏi thuật ngữ không hề có trong nội dung slide hiện tại | ① Nguồn sự thật | AI báo rõ: *"Khái niệm này không có trong Slide 12. Theo kiến thức chung..."* và hiển thị nhãn `[Ngoài Slide]`. | G2 / PAIR Trust |
| 2 | Học viên khoanh một vùng ảnh quá nhỏ hoặc bôi đen từ vô nghĩa (VD: *"và"*, *"là"*) | ② Mơ hồ/Thiếu thông tin | AI không giải thích tràn lan mà phản hồi: *"Vùng chọn chưa rõ bối cảnh. Bạn vui lòng khoanh lại sơ đồ hoặc chọn lại thuật ngữ cần hỏi nhé."* | G10 (Thu hẹp phạm vi) |
| 3 | Học viên yêu cầu AI giải bài tập nộp điểm / làm hộ Assignment | ③ Ngoài phạm vi/Thẩm quyền | AI từ chối giải hộ: *"Mình không thể làm bài hộ bạn, nhưng mình có thể giải thích lý thuyết Slide 12 để bạn tự làm nhé!"* | G1 (Rõ phạm vi) |
| 4 | Học viên nhầm lẫn khái niệm Microservices (Slide 12) với Monolith (Slide 5) | ④ Đặc thù Domain | AI chỉ ra lỗi sai kiến thức cốt lõi và đính kèm Card: `📌 Open Slide 5: Loose Coupling Concepts`. | G11 (Giải thích lý do) |
| 5 | AI sinh câu hỏi Micro-Quiz quá dài hoặc quá khó vượt trình độ slide | ④ Đặc thù Domain | Prompt được thiết kế giới hạn câu hỏi Quiz chỉ 1 câu dạng Trắc nghiệm / Đúng-Sai trực diện. | G2 (Phù hợp năng lực) |
| 6 | Mạng chập chờn / Lỗi kết nối API Key khi gửi câu hỏi | ① Nguồn sự thật | Khung chat hiện thông báo nhẹ màu đỏ: *"Không thể kết nối AI Tutor. Bấm để thử lại"* kèm nút `[ Thử lại ]`. | PAIR Graceful Failure |
| 7 | Học viên nhập lệnh chuyển đến slide không tồn tại (VD: *"Mở slide 99"*) | ③ Ngoài phạm vi | AI phản hồi lịch sự: *"Bài học SWD392 hiện chỉ có 45 slides. Bạn vui lòng chọn từ Slide 1 đến 45."* | G10 (Thu hẹp phạm vi) |
| 8 | Học viên trả lời câu Quiz bằng ngôn ngữ teen code / viết tắt (VD: *"k"*, *"sập đâu"*) | ② Mơ hồ/Thiếu thông tin | AI tự động parse ngữ nghĩa viết tắt (*"k"* = *"Không"*) để chấm Quiz chính xác thay vì báo lỗi. | G5 (Hợp xã hội) |

## §6. Bốn đường đi của trải nghiệm
- **Happy path:** Bôi đen từ khóa "Microservices" trên Slide 12 ➔ Nút nổi `Ask AI Tutor` hiện ra ➔ Bấm nút ➔ AI giải thích chuẩn nội dung Slide 12 + đưa 1 câu hỏi Micro-Quiz ➔ Học viên gõ trả lời đúng ("Không") ➔ AI chúc mừng và xác nhận hiểu bài.
- **Low-confidence (②):** Học viên bôi đen cụm từ mờ nhạt ➔ AI trả lời giải thích kèm lời nhắn: *"Nội dung này được suy luận thêm từ kiến thức tổng quan môn học, không nằm trực tiếp trên Slide 12"*.
- **Failure/không căn cứ (①):** Mất kết nối AI hoặc Slide không chứa dữ liệu text ➔ AI báo lỗi giao tiếp lịch sự, không tự sinh thông tin ảo (Hallucination) và gợi ý học viên chọn lại đoạn văn bản rõ ràng hơn.
- **Correction (user sửa):** Học viên thấy AI giải thích chưa đúng ý ➔ Bấm nút `[ Hỏi lại / Sửa prompt ]` hoặc gõ câu hỏi tùy chỉnh mới ngay tại ô chat.
- **Khi bị đòi ngoài phạm vi (③):** Học viên gõ *"Viết code hoàn chỉnh cho assignment SWD392"* ➔ AI từ chối khéo, quay lại phạm vi tóm tắt lý thuyết slide.
- **Case đặc thù domain (④):** Học viên trả lời sai câu hỏi Quiz (gõ "Có" - nhầm kiến thức Loose vs Tight Coupling) ➔ AI phát hiện hổng kiến thức nền ➔ Hiện Card màu vàng `📌 Open Slide 5` ➔ Click Card ➔ Màn hình tự nhảy về Slide 5 đồng thời AI tóm tắt lại kiến thức Slide 5 ngay trên chat.

## §7. Kiểm thử
- Chiều chất lượng + định nghĩa kiểm chứng được:
  1. *Đúng bối cảnh (Context Accuracy):* Trả lời đúng nội dung slide đang xem, trace được về dữ liệu slide (Pass/Fail).
  2. *An toàn domain (Domain Safety):* Không giải hộ bài tập, không đưa kiến thức sai lệch (Pass/Fail).
  3. *Độ ngắn gọn (Conciseness):* Đoạn giải thích $\le 3$ câu, Micro-Quiz $\le 2$ câu (Pass/Fail).
  4. *Trải nghiệm lấp lỗ hổng (Gap Bridging):* Phát hiện trả lời sai và kích hoạt đúng Card chuyển slide (Pass/Fail).
- Golden set: Bộ $\ge 20$ test cases lưu tại file `eval/golden-set.json` (Gồm 10 case lấy từ chatlog thật + 8 case phủ 4 lớp chỗ khó + 2 case hiếm).
- Quality bar: "Đạt khi ≥ 80% qua bộ test Golden Set, và 100% các case thuộc Lớp ④ (Đặc thù Domain) không được sai kiến thức cốt lõi."
- Kết quả các lượt chạy (Cập nhật qua các mốc CP3 - CP6):

| Lượt chạy | Mốc thời gian | Số case Đạt / Tổng | Tỷ lệ (%) | Ghi chú / Failure chính |
|:---:|:---:|:---:|:---:|---|
| Lượt 1 (Test Prompt nháp) | CP3 (Sáng N2) | _ / 20 | _ % | (Sẽ cập nhật sau khi nối AI Call thật tại CP3) |
| Lượt 2 (Sau khi fix Prompt) | CP4 (Trưa N2) | _ / 20 | _ % | (Dự kiến chạy lại toàn bộ bộ test để chốt % cho Demo) |

## §8. Phân công & kế hoạch
- Phân công có tên:
  * **Đào Chí Hiển (2A202601066):** Leader & chịu trách nhiệm file `spec.md`, thiết kế kiến trúc hệ thống tổng quan.
  * **Nguyễn Việt Anh (2A202601144):** Thu thập dữ liệu khảo sát HV Khóa 3 & 4, phụ trách mảng Evidence & Validation Log.
  * **Nguyễn Bùi Anh Tuấn (2A202601208):** Xây dựng bộ Golden Set (`eval/`), tối ưu Prompt AI Tutor & chạy đánh giá Evals.
  * **Nguyễn Ngọc Chi (2A202602024):** Phụ trách giao diện React/Tailwind và các component Slide Viewer, AI Tutor Chat Panel.
  * **Trần Thanh Bình (2A202601174):** Full-stack & Demo Lead — xây dựng backend Express kết nối `openai/gpt-4o-mini` qua OpenRouter; tích hợp Text Selection, Micro-Quiz, Slide Jump và chuẩn bị Demo Script.
- Willing users (≥3 tên) + kế hoạch vòng validation CP5:
  * *Danh sách HV thử nghiệm:* Nguyễn Quang Minh (Học viên Khóa 3), Trịnh Hải Đăng (Học viên Khóa 4), Nguyễn Minh Công (Học viên Khóa 4).
  * *Kế hoạch CP5:* Cho học viên thực hiện task "Học Slide 12 và trả lời Quiz", quan sát im lặng, hỏi 3 câu hỏi trải nghiệm và ghi log nguyên văn vào folder `validation/`.
- Multi-prototype:
  * *Phương án A (Chờ gọi):* Chỉ khi bôi đen bấm nút mới hiện AI giải thích.
  * *Phương án B (Chủ động):* AI tự động nhảy popup quiz mỗi khi chuyển slide.
  * *Lý do chọn:* Chọn **Phương án A** vì Phương án B gây phiền nhiễu (intrusive) cho luồng đọc của học viên.

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|:---:|---|---|
| 23:59 N1 | Khóa file `spec.md` & Quality Bar (80%) | Chốt mốc nộp Ngày 1 theo quy định |
| N1 - 16:00 | Thêm tính năng tự động tóm tắt Slide mới khi Jump | Dựa trên feedback chạy thử giao diện |
