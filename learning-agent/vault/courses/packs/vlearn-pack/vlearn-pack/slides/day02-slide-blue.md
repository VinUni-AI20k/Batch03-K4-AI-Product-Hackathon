---
course: packs
generated: '2026-07-30T10:37:49+00:00'
lang: vi
lesson: day02-slide-blue
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/slides/day02-slide-blue.md
source_hash: sha256:51760c98f602b530b506cc031ae104b365893581cc42f1e1679b3583fce8f4ef
type: lesson-note
---

```markdown
# Ghi chú bài học Day 02

## Slide 1 — AI IN ACTION · DAY 02
Xác định bài toán cho AI. Từ yêu cầu mơ hồ đến [[problem-statement]] rõ ràng.  
Instructor: Mai Anh Nguyen (Blue)

## Slide 2 — MỞ ĐẦU · INSTRUCTOR
Mai Anh Nguyen (Blue)  
Generalist Product Builder  
2026: FPT Long Châu (PM · Healthcare Product)  
2025: Thongtincuuho.org (Co-founder)  
2025: FPT Software AI Center (PM · AI Agent)  
2021–2025: Xantus (PM · On-chain Analytics, AI Agent)  
2016–2021: DYNO, Kalapa (PM · OCR, eKYC, Credit Scoring)  
LinkedIn | Facebook

## Slide 3 — MỞ ĐẦU · 4 CÂU HỎI
01. Bài toán có thực sự cần AI giải quyết?  
02. Nếu có, giải pháp ở cấp độ nào: [[rule]], [[workflow]], hay [[agent]]?  
03. Problem Statement đã đủ rõ ràng để triển khai?  
04. Khi nào quyết định: Go, Not Yet, hay No-Go?  
Bốn câu hỏi trọng tâm — Từ xác định bài toán đến quyết định ứng dụng AI.

## Slide 4 — MỞ ĐẦU · AGENDA
### KHUNG LÝ THUYẾT (4H)
- [[Problem-discovery]] (Double Diamond, HCD)
- [[Problem-statement]] & định lượng hóa
- PAIR ① AI có thêm giá trị?
- PAIR ② Automate/Augment → [[Rule|Rule/Workflow/Agent]]
- PAIR ③ Reward function & success criteria
- Khi AI sai & UX/HITL
- PS hoàn chỉnh → Go/Not Yet/No-Go

### THỰC HÀNH LAB (4H)
- Cá nhân: Tìm 5 bài toán & điền 3 Problem Cards
- Nhóm: Phản biện chéo, chốt 1 bài toán
- Nhóm: Xác thực dữ liệu & vẽ quy trình
- Nhóm: Xác định giải pháp & ra quyết định
- Cá nhân: Viết nhật ký phản tư (Reflection Log)

### BÀI NỘP CUỐI BUỔI
- Nhật ký tìm và lọc bài toán (Cá nhân)
- Problem Statement hoàn chỉnh (Nhóm)
- Nhật ký phản tư (Cá nhân)

## Slide 5 — MỞ ĐẦU · LUẬT CHƠI
01. Thảo luận nhanh qua Discord  
Gửi phản hồi ngắn, câu hỏi nhanh hoặc ý kiến phản biện trực tiếp lên Discord.  
02. Khuyến khích chia sẻ ý tưởng sơ khởi  
Ý tưởng không cần hoàn hảo ngay từ đầu; các câu trả lời chưa sâu sẽ là chất liệu để cùng phân tích.  
03. Nộp sản phẩm qua GitHub  
Báo cáo thực hành Bài tập Lab ngày 02 được nộp trực tiếp trên GitHub Repository.  
Điểm thưởng (Bonus) dành cho học viên tích cực tương tác.

## Slide 6 — MỞ ĐẦU · NỀN TẢNG
Phát triển [[AI-product]] (sản phẩm AI) — Sản phẩm tích hợp AI bản chất vẫn là một sản phẩm hoàn chỉnh, kế thừa chứ không thay thế nguyên lý sản phẩm truyền thống.

## Slide 7 — MỞ ĐẦU · NỀN TẢNG
[[AI-engineering]]: Triển khai RAG, [[agent]], Guardrails, [[evaluation]] (Đánh giá) và vận hành hệ thống AI thực tế.  
[[Product-thinking]] (Inspired): Xác định đúng bài toán, thấu hiểu người dùng, tránh xây dựng những tính năng không mang lại giá trị.  
[[Design-thinking]] (Everyday Things): Thiết kế dựa trên mô hình tư duy (Mental Model), cơ chế phản hồi và tối ưu trải nghiệm khi AI sai sót.

## Slide 8 — MỞ ĐẦU · TÀI LIỆU
[[Google PAIR Guidebook]]: 6 chương — cẩm nang thiết kế sản phẩm AI lấy con người làm trung tâm.  
Chương 1 — User Needs + Defining Success là xương sống buổi sáng nay (PAIR ①②③).  
ĐỌC THÊM · ANTHROPIC: Building effective agents.  
ĐỌC THÊM · GOOGLE: Rules of Machine Learning.

## Slide 9 — BÀI TOÁN · CHATBOT
Thảo luận nhanh: "Tôi muốn xây dựng chatbot AI cho khách hàng."  
Hỏi: Chatbot đó đang làm gì? Viết câu trả lời lên Discord · 3 phút

## Slide 10 — BÀI TOÁN · CHATBOT
### PHỤC VỤ KHÁCH HÀNG
- Giải đáp câu hỏi thường gặp (FAQ) về sản phẩm & chính sách
- Tư vấn và hỗ trợ mua hàng
- Chăm sóc sau mua hàng
- Bán thêm & bán chéo (Upsell & Cross-sell)

### HỖ TRỢ NỘI BỘ
- Phân loại yêu cầu hỗ trợ (Tickets/Questions)
- Tra cứu thông tin nghiệp vụ nhanh
- Đề xuất nháp phản hồi để con người phê duyệt
- Chuyển tiếp câu hỏi phức tạp hoặc rủi ro cao cho nhân sự hỗ trợ

"AI chatbot" chưa phải là một bài toán — Đối tượng khác nhau dẫn đến quy trình (workflow), chỉ số (metrics) và rủi ro khác nhau.

## Slide 11 — BÀI TOÁN · PHÂN TÍCH
Lớp học 1000 học viên (khóa K3 & K4), số lượng Trợ giảng có hạn.  
Dùng AI giải quyết thế nào? Viết câu trả lời lên Discord — 5 phút

## Slide 12 — BÀI TOÁN · PHÂN TÍCH
- Học viên gặp khó khăn ở công đoạn nào?
- Trợ giảng quá tải ở bước nào?
- Quy trình hiện tại đang xử lý ra sao?
- Giải pháp này xây dựng phục vụ ai?

Khoan đã, bạn có hỏi không? — Cần thấu hiểu bản chất vấn đề trước khi tìm giải pháp.  
Chưa thấu hiểu [[pain-point]] thì chưa đề xuất giải pháp.

## Slide 13 — BÀI TẬP CÁ NHÂN
Từ trải nghiệm ngày học đầu tiên, liệt kê ít nhất 3 điểm đau (pain points) bạn quan sát hoặc gặp phải.  
Nhận diện điểm đau thực tế: 5 phút · GỬI LÊN DISCORD · BẠN GẶP TẮC NGHẼN Ở ĐÂU?

## Slide 14 — BÀI TOÁN · VIET NORMAN
"Do not solve the problem I am asked to solve." — DON NORMAN · jnd.org

## Slide 15 — BÀI TOÁN · DOUBLE DIAMOND
### SECTION 01 — Problem Discovery
Tìm đúng vấn đề trước khi tìm giải pháp — [[double-diamond]], [[HCD]] và các kỹ thuật phân kỳ / hội tụ.

## Slide 16 — BÀI TOÁN · DIAMOND 1
### DIAMOND 1 — TÌM ĐÚNG VẤN ĐỀ
- Discover: Mở rộng — khảo sát vấn đề căn bản.
- Define: Thu hẹp — xác định đúng bài toán gốc.
### DIAMOND 2 — TÌM ĐÚNG GIẢI PHÁP
- Develop: Mở rộng — nhiều giải pháp tiềm năng.
- Deliver: Thu hẹp — chọn và triển khai.

"Kỹ sư và doanh nhân được đào tạo để giải vấn đề. Nhà thiết kế được đào tạo để khám phá vấn đề thật."  
Giải pháp xuất sắc cho sai vấn đề có thể còn tệ hơn không có giải pháp.  
Tìm đúng vấn đề trước khi tìm giải pháp — Mô hình [[double-diamond]] — Don Norman / British Design Council (2005).

## Slide 17 — BÀI TOÁN · DIAMOND 1
### DISCOVER · PHÂN KỲ
Khám phá / mở rộng góc nhìn
- Quan sát thực tế ([[observation]])
- Phỏng vấn người dùng ([[user-interview]])
- Khảo sát ([[survey]])
- Nhật ký hành vi ([[diary-study]])
- Phân tích dữ liệu / Nhật ký hệ thống
- Bản đồ các bên liên quan ([[stakeholder-mapping]])

### DEFINE · HỘI TỤ
Định nghĩa / chọn lọc dựa vào dữ liệu
- Sơ đồ đồng cảm / Gom nhóm ([[affinity-mapping]])
- Kỹ thuật đặt câu hỏi 5 Whys
- Ma trận Tác động – Nỗ lực ([[impact-effort]])
- Biểu quyết bằng chấm tròn ([[dot-voting]])
- Câu hỏi mở hướng giải quyết ([[how-might-we]])
- Phát biểu bài toán ([[problem-statement]])

Diamond 1 — Tìm đúng vấn đề — Phân kỳ để thấu hiểu sâu sắc, hội tụ để lựa chọn chính xác.

## Slide 18 — BÀI TOÁN · HCD VÒNG LẶP
[[HCD]] (Human-Centered Design): Thiết kế lấy con người làm trung tâm: vòng lặp 5 bước bên trong mỗi Diamond.  
- Observation (Quan sát): Người được quan sát phải phù hợp với đối tượng mục tiêu.  
- Ideation (Tạo ra ý tưởng): Tạo nhiều ý tưởng mà không bị hạn chế bởi các đánh giá.  
- Prototype (Tạo mẫu thử): Tạo nguyên mẫu nhanh để kiểm tra.  
- Test (Kiểm tra): Quan sát sự tương tác với Prototype.  
- Iteration (Lặp lại): Tinh chỉnh liên tục.

## Slide 19 — BÀI TOÁN · CÂU HỎI NGUYÊN BẢN
Isaac Newton: Quả táo rơi xuống đất — vậy Mặt Trăng có đang "rơi" tự do không?  
Polaroid: Tại sao không thể xem ảnh ngay lập tức sau khi chụp?  
Airbnb: Liệu không gian sống bỏ trống có thể dùng làm dịch vụ lưu trú?  
Tò mò trước. Đánh giá sau. — Những câu hỏi nguyên bản.

## Slide 20 — BÀI TẬP CÁ NHÂN
Bạn có câu hỏi nào mà cảm thấy "ngớ ngẩn" không?  
Viết lên Discord — 3 phút.

## Slide 21 — BÀI TOÁN · CÂU HỎI GỢI MỞ
1. Giả định hiển nhiên nào cần lật lại?  
2. Có cách tiếp cận nào hoàn toàn mới cho vấn đề?  
3. Nếu thiết kế lại từ đầu và không bị giới hạn?  
4. Tại sao bài toán này cần AI? Nếu không thì sao?  
5. Quy trình nào đang tồn tại chỉ vì thói quen?  
6. Có câu hỏi cốt lõi nào đang bị né tránh?  

Gửi 1 câu hỏi phản biện lên Discord.

## Slide 22 — BÀI TOÁN · CASE STUDY
Cần từ bỏ mảng AI thiết kế cơ khí (CAD) để tập trung vào AI code editor.  
"Sản phẩm tốt ≠ Thị trường lớn" — Giải pháp đọc tin tích hợp AI nhưng quy mô thị trường quá hẹp.  
"Định vị đúng điểm đau" — Tập trung giải quyết nhu cầu hỏi đáp, tóm tắt tài liệu.

## Slide 23 — BÀI TOÁN · 4 LENSES
### TÌM BÀI TOÁN AI
- Tác vụ lặp lại
- Tiêu tốn thời gian
- [[AI-advantage]]: Lợi thế của AI
- [[User-pain-points]]: Điểm đau người dùng

Tập trung nhận diện vấn đề; chưa vội đề xuất giải pháp.

## Slide 24 — BÀI TOÁN · ANTI-PATTERNS
Sai lầm thường gặp — Dấu hiệu cảnh báo bài toán chưa được định hình rõ hoặc giải pháp AI được lựa chọn quá sớm.

## Slide 25 — BÀI TOÁN · INTERVIEW
Discovery interview: 5 câu hỏi nên hỏi stakeholder:
1. Vấn đề nhức nhối (Pain Point) là gì? Tần suất ra sao?  
2. Quy trình hiện tại như thế nào?  
3. Hậu quả nếu hệ thống AI sai sót là gì?  
4. Ai là người có quyền phê duyệt dự án (nói YES)?

## Slide 26 — BÀI TOÁN · PAIR REFRAME
"Can we use AI to ______?"  
↓ Thay bằng hai câu hỏi:  
"How might we solve ______?"  
"Can AI solve this problem in a unique way?"  

Hỏi về bài toán trước, về AI sau — AI chỉ là một phương án trong nhiều phương án khả dĩ.

## Slide 27 — SECTION 02 · Problem Statement
Từ pain point đến Problem Statement — bài toán định hình rõ nét qua workflow, bottleneck, metrics và boundary.

## Slide 28 — PROBLEM STATEMENT · QUICK CARD
Bài toán: Vấn đề cụ thể cần giải quyết (không bao gồm giải pháp).  
Đối tượng: Cá nhân hoặc bộ phận chịu tác động trực tiếp từ vấn đề.  
Quy trình: Các bước vận hành thủ công hoặc tự động hiện tại.  
Nút thắt & Tác động: Khâu gây chậm trễ, sai sót hoặc lặp lại; hệ quả hay tổn thất cụ thể.  
Chỉ số đo thành công: Chỉ số định lượng cụ thể dùng để chứng minh hiệu quả cải tiến.  
Định hướng giải pháp: No AI / Rule / Workflow / Agent / Chưa xác định.  

## Slide 29 — PROBLEM STATEMENT · WORKED EXAMPLE
Bài toán: Mỗi thứ Hai, PM mất khoảng 90 phút tổng hợp Weekly Report từ Jira, Google Sheets và Slack.  
Đối tượng: Junior PM chịu trách nhiệm gửi weekly report cho Engineering Manager và CEO.  
Quy trình: Export Jira → lấy metrics từ Google Sheets → đọc Slack recap → tổng hợp vào Google Docs → viết narrative.  
Nút thắt: Bước viết narrative từ raw data mất khoảng 25 phút.  
Chỉ số: Giảm thời gian làm report từ 90 phút xuống dưới 30 phút.  
Định hướng: Workflow — tự động kéo và cấu trúc dữ liệu.

## Slide 30 — PROBLEM STATEMENT · 6 CÂU HỎI
1. Quy trình hiện tại như thế nào?  
2. Nút thắt nằm ở đâu?  
3. Hao phí hiện tại là bao nhiêu?  
4. Tiêu chí thành công đo bằng gì?  
5. Hậu quả khi xảy ra sai sót?  
6. Có giải pháp phi AI đơn giản hơn?

## Slide 31 — PROBLEM STATEMENT · ĐỊNH LƯỢNG
Định lượng hóa bài toán — Điểm đau chưa được định lượng thì không thể xác định giá trị thực tế của AI.

## Slide 32 — PROBLEM STATEMENT · METRICS
### OUTPUT METRIC
Kết quả cuối cùng: Thời gian hoàn tất quy trình, tỷ lệ sai sót, giá trị thực tế người dùng nhận được.  

### INPUT METRICS
Các đòn bẩy: Tỷ lệ câu hỏi được phân loại chính xác, tỷ lệ yêu cầu được chuyển tiếp hỗ trợ kịp thời.

## Slide 33 — BÀI TẬP NHANH
Lựa chọn một điểm đau đã nhận diện và thiết lập phương án đo lường cụ thể.  
Chuyển điểm đau thành chỉ số định lượng.

## Slide 34 — CÓ NÊN ỨNG DỤNG AI?
AI chỉ thực sự mang lại giá trị khi tích hợp chính xác vào quy trình nghiệp vụ và giải quyết đúng điểm đau.  

## Slide 35 — CÓ NÊN ỨNG DỤNG AI · PAIR 3 BƯỚC
BƯỚC ①: Bài toán của bạn có nằm trong nhóm việc AI làm tốt hơn hẳn [[rule]]/[[heuristic]] không?  
BƯỚC ②: AI thay thế hay [[augment]] con người?  
BƯỚC ③: Reward function & tiêu chí thành công.

## Slide 36 — CÓ NÊN ỨNG DỤNG AI · AI PROBABLY BETTER
Khi nào AI có lợi thế?  
- Gợi ý theo từng người  
- Dự đoán tương lai  
- Cá nhân hóa  
- Hiểu ngôn ngữ tự nhiên  
- Nhận diện thực thể  
- Phát hiện cái hiếm & biến đổi  
- [[AGENT]] cho một lĩnh vực cụ thể  
- Nội dung động thay giao diện tĩnh

## Slide 37 — CÓ NÊN ỨNG DỤNG AI · AI PROBABLY NOT BETTER
Khi nào AI KHÔNG tốt hơn?  
- Cần duy trì tính dự đoán được  
- Thông tin tĩnh, ít thay đổi  
- Lỗi quá tốn kém  
- Yêu cầu minh bạch tuyệt đối  
- Tối ưu tốc độ & chi phí thấp  
- Việc giá trị cao người dùng muốn tự làm.

## Slide 38 — CÓ NÊN ỨNG DỤNG AI · KHI NÀO HỢP
- Tác vụ mang tính lặp lại nhưng có độ biến thiên vừa phải.  
- Quy trình gồm nhiều bước phức tạp và cần tương tác với nhiều công cụ.  

Khi nào AI đáng để làm? — Dấu hiệu nhận biết bài toán phù hợp và động lực đầu tư của doanh nghiệp.

## Slide 39 — CÓ NÊN ỨNG DỤNG AI · BUILD / BOOST / BUY
- In-house (Build): Khi công nghệ AI là lợi thế cạnh tranh cốt lõi.  
- Mua / SaaS (Buy): Khi giải pháp AI đóng vai trò như công cụ tối ưu hóa năng suất.  
- Boost: Mua mô hình sẵn có, cải tiến bằng dữ liệu nội bộ.

## Slide 40 — QUYẾT ĐỊNH AI · LIFECYCLE
Vòng đời Sản phẩm AI — Mỗi giai đoạn từ ý tưởng đến vận hành thực tế yêu cầu phương thức xác thực chuyên biệt.

## Slide 41 — RWA · TỔNG QUAN
[[Rule|Rule]], [[Workflow]], [[Agent]] là ba cấp độ giải pháp.  
Biển hiện là: 
- [[Automation]]: AI làm thay 
- [[Augmentation]]: AI hỗ trợ con người  

## Slide 42 — HỆ THỐNG AI · KIẾN TRÚC
### Hệ thống AI = Model + Context + Planning + Tools
Một giải pháp AI thực tế là một hệ thống nhiều thành phần.

## Slide 43 — RWA · AUTOMATE VS AUGMENT
### Automation vs Augmentation
Bước ② của PAIR: với từng tác vụ, AI nên làm thay hay hỗ trợ con người?

## Slide 44 — RWA · AUTOMATE IN PHASES
Tăng mức tự động hóa theo pha — Mức tự động hóa tỷ lệ nghịch với rủi ro.

## Slide 45 — RWA · SO SÁNH
Một tình huống, ba cấp độ giải pháp: 
- Cấp độ 1 — [[Rule]] 
- Cấp độ 2 — [[Workflow]]
- Cấp độ 3 — [[Agent]]

## Slide 46 — RWA · TÌNH HUỐNG
Tình huống: Lớp học 1000 học viên nhưng nguồn lực Trợ giảng (TA) có hạn. Chủ yếu quan tâm đến việc tối ưu quy trình.

## Slide 47 — RWA · MỨC 1: RULE
Cấp độ 1 — Rule-based: Áp dụng khi logic nghiệp vụ tường minh, kết quả cố định.

## Slide 48 — RWA · MỨC 2: WORKFLOW
Cấp độ 2 — Workflow: Các bước xử lý đã định hình rõ, nhưng cần AI hỗ trợ ngôn ngữ hoặc đánh giá.

## Slide 49 — RWA · MỨC 3: AGENT
Cấp độ 3 — Agent: Hệ thống tự động lập kế hoạch, phối hợp công cụ và linh hoạt thích ứng.

## Slide 50 — RWA · SO SÁNH
Ba cấp độ giải pháp: [[Rule]], [[Workflow]], [[Agent]].  

## Slide 51 — WORKFLOW · PM MENTAL MODEL
Workflow được điều phối bởi code, AGENT tự điều phối lộ trình và cách dùng tools trong khi có nhiều trade-offs.

## Slide 52 — WORKFLOW PATTERNS · BASIC
### Các mô hình cơ bản 
- Prompt Chaining  
- Routing  
- Parallelization  

### Các mô hình nâng cao 
- Orchestrator-Workers  
- Evaluator-Optimizer  

## Slide 53 — WORKFLOW PATTERNS · ADVANCED
Nhận diện khi nào cần phức tạp hơn — [[Orchestrator-Workers]], [[Evaluator-Optimizer]] và [[Agent]].

## Slide 54 — WORKFLOW · THANG QUYẾT ĐỊNH
Thang câu hỏi để lựa chọn cấp độ giải pháp — khung câu hỏi tuần tự giúp tránh bẫy “nhảy vọt” lên Agent.

## Slide 55 — WORKFLOW · DECISION TREE
Cây quyết định: Lựa chọn cấp độ giải pháp — Đi từ bài toán cốt lõi đến lựa chọn [[Rule]], [[Workflow]] hay [[Agent]].

## Slide 56 — WORKFLOW · VÍ DỤ THỰC TẾ
Ví dụ thực tế ngoài lớp học — Phân biệt cấp độ giải pháp [[Rule]], [[Workflow]] và [[Agent]] trong các tình huống thực hành.

## Slide 57 — REWARD · HÀM THƯỞNG
Reward function: Hệ thống hiểu "đúng / sai" thế nào? Được thiết kế liên chức năng: tối thiểu UX × Product × Engineering.

## Slide 58 — REWARD · PRECISION ↔ RECALL
Đánh đổi không tránh khỏi giữa Precision và Recall trong thiết kế hệ thống AI.

## Slide 59 — REWARD · SUCCESS CRITERIA
Viết tiêu chí thành công mà hành động được — PAIR Bước ③ · Metric tốt = chỉ số cụ thể + ngưỡng có nghĩa + hành động cụ thể.

## Slide 60 — CÓ NÊN ỨNG DỤNG AI · THIẾT LẬP KỲ VỌNG
Thiết lập kỳ vọng: Đo lường các chỉ số để xác định mức độ hiệu quả trước khi phát hành giải pháp.

## Slide 61 — QUYẾT ĐỊNH AI · DEMO TO PRODUCTION
Khoảng cách giữa Demo và Production — Phản hồi chính xác trong vài lần thử chưa đủ cơ sở để triển khai hệ thống thực tế.

## Slide 62 — PROBLEM STATEMENT · EVAL PLAN
Từ Problem Statement đến Eval Plan — Phương pháp đánh giá, bộ dữ liệu mẫu và ngưỡng chấp nhận.

## Slide 63 — PROBLEM STATEMENT · EVAL FLOW
Chuyển dịch từ PS sang Eval Plan — Phát triển bài kiểm thử từ Problem Statement đã rõ ràng.

## Slide 64 — ERRORS · ĐỊNH NGHĨA LỖI
"Hệ thống chạy đúng nhưng giả định sai về người dùng" — Lỗi AI được định nghĩa bởi kỳ vọng người dùng.

## Slide 65 — ERRORS · UX + HITL
Vai trò UX + Human-in-the-loop trong việc kiểm duyệt trước các tác vụ rủi ro cao.

## Slide 66 — PROBLEM STATEMENT · 9 TRƯỜNG
Problem Statement cho hệ thống AI — 6 yếu tố cốt lõi và 3 yếu tố quyết định AI.

## Slide 67 — PROBLEM STATEMENT · VÍ DỤ
Ví dụ Problem Statement hoàn chỉnh cho giúp Lab Coach/TA trong một lớp học lớn.

## Slide 68 — QUYẾT ĐỊNH AI · 5 CÂU HỎI
Năm câu hỏi kiểm tra mức sẵn sàng — gate cuối trước khi ra quyết định để đảm bảo chất lượng ứng dụng AI.

## Slide 69 — QUYẾT ĐỊNH · GO / NOT YET / NO-GO
Khung ra quyết định: Go / Not Yet / No-Go dựa trên tính khả thi của Problem Statement.

## Slide 70 — RECAP · 6 NGUYÊN TẮC
Sáu nguyên tắc cốt lõi sau Day 02 — Kim chỉ nam để thẩm định mọi đề xuất ứng dụng AI.

## Slide 71 — APPENDIX · ĐỌC THÊM
Bốn nguồn gốc của lỗi AI — PAIR Chương 6: Errors + Graceful Failure.

## Slide 72 — APPENDIX · ĐỌC THÊM
**Paths forward from failure** — Thiết kế trải nghiệm khi AI sai.

## Khái niệm chính
- [[AI-product]]: Sản phẩm tích hợp AI.
- [[AI-engineering]]: Triển khai và vận hành hệ thống AI.
- [[Product-thinking]]: Tư duy sản phẩm để thấu hiểu nhu cầu người dùng.
- [[Design-thinking]]: Thiết kế dựa trên con người và trải nghiệm sử dụng.
- [[problem-statement]]: Phát biểu rõ ràng vấn đề cần giải quyết.
- [[double-diamond]]: Mô hình tìm đúng vấn đề và giải pháp.
- [[user-interview]]: Phỏng vấn người dùng để hiểu rõ nhu cầu.
- [[pain-point]]: Điểm đau của người dùng cần được giải quyết.
- [[stakeholder-mapping]]: Bản đồ các bên liên quan trong dự án.
- [[reward-function]]: Hàm xác định thành công trong một hệ thống AI.
- [[HCD]]: Thiết kế lấy con người làm trung tâm.
```
