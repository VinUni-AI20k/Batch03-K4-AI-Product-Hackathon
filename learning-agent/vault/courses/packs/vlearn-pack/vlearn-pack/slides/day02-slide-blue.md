---
course: packs
generated: '2026-07-31T18:20:29+00:00'
lang: vi
lesson: day02-slide-blue
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\slides\day02-slide-blue.md
source_hash: sha256:1153a1663f370926e55d7bb4ce8e3fe8d642f140a37a9dfbdb5882bd4bdc4c52
type: lesson-note
---

```markdown
## Slide 1 — AI IN ACTION · DAY 02 
Xác định bài toán cho AI. Từ yêu cầu mơ hồ đến [[problem-statement]] rõ ràng.  
Instructor: Mai Anh Nguyen (Blue)

## Slide 2 — MỞ ĐẦU · INSTRUCTOR
Mai Anh Nguyen (Blue)  
Generalist Product Builder  
2026  
FPT Long Châu (PM · Healthcare Product)  
2025  
Thongtincuuho.org (Co-founder)  
2025  
FPT Software AI Center (PM · AI Agent)  
2021–2025  
Xantus (PM · On-chain Analytics, AI Agent)  
2016–2021  
DYNO, Kalapa (PM · OCR, eKYC, Credit Scoring)  
LinkedIn | Facebook

## Slide 3 — MỞ ĐẦU · 4 CÂU HỎI
01. Bài toán có thực sự cần AI giải quyết?  
02. Nếu có, giải pháp ở cấp độ nào: [[rule]], [[workflow]], hay [[agent]]?  
03. [[Problem statement]] đã đủ rõ ràng để triển khai?  
04. Khi nào quyết định: Go, Not Yet, hay No-Go?  
Bốn câu hỏi trọng tâm — Từ xác định bài toán đến quyết định ứng dụng AI.

## Slide 4 — MỞ ĐẦU · AGENDA
**KHUNG LÝ THUYẾT (4H)**  
- Problem Discovery ([[double-diamond]], HCD)  
- [[Problem statement]] & định lượng hóa  
- PAIR ① AI có thêm giá trị?  
- PAIR ② Automate/Augment → [[rule]]/[[workflow]]/[[agent]]  
- PAIR ③ Reward function & success criteria  
- Khi AI sai & [[UX]]/HITL  
- [[Problem statement]] hoàn chỉnh → Go/Not Yet/No-Go  

**THỰC HÀNH LAB (4H)**  
- Cá nhân: Tìm 5 bài toán & điền 3 [[problem-cards]]  
- Nhóm: Phản biện chéo, chốt 1 bài toán  
- Nhóm: Xác thực dữ liệu & vẽ quy trình  
- Nhóm: Xác định giải pháp & ra quyết định  
- Cá nhân: Viết nhật ký phản tư (Reflection Log)  

**BÀI NỘP CUỐI BUỔI**  
- Nhật ký tìm và lọc bài toán (Cá nhân)  
- [[Problem statement]] hoàn chỉnh (Nhóm)  
- Nhật ký phản tư (Cá nhân)  

## Slide 5 — MỞ ĐẦU · LUẬT CHƠI
01. Thảo luận nhanh qua Discord — Gửi phản hồi ngắn, câu hỏi nhanh hoặc ý kiến phản biện trực tiếp lên Discord.  
02. Khuyến khích chia sẻ ý tưởng sơ khởi — Ý tưởng không cần hoàn hảo ngay từ đầu; các câu trả lời chưa sâu sẽ là chất liệu để cùng phân tích.  
03. Nộp sản phẩm qua GitHub — Báo cáo thực hành Bài tập Lab ngày 02 được nộp trực tiếp trên GitHub Repository.  

Nguyên tắc tương tác & Thực hành — Hình thức trao đổi, bài tập nhanh và nộp sản phẩm chính. Điểm thưởng (Bonus) dành cho học viên tích cực tương tác.

## Slide 6 — MỞ ĐẦU · NỀN TẢNG
Phát triển Sản phẩm AI ([[AI Product]]) — Sản phẩm tích hợp AI bản chất vẫn là một sản phẩm hoàn chỉnh, kế thừa chứ không thay thế nguyên lý sản phẩm truyền thống.

## Slide 7 — MỞ ĐẦU · NỀN TẢNG
**AI Engineering**  
Triển khai RAG, [[agent]], Guardrails, [[evaluation]] (Đánh giá) và vận hành hệ thống AI thực tế.  
**Product Thinking (Inspired)**  
Xác định đúng bài toán, thấu hiểu người dùng, tránh xây dựng những tính năng không mang lại giá trị.  
**Design Thinking (Everyday Things)**  
Thiết kế dựa trên mô hình tư duy ([[mental-model]]), cơ chế phản hồi ([[feedback]]) và tối ưu trải nghiệm khi AI sai sót.

Ba trụ cột nền tảng của [[AI product]] — Kỹ thuật hệ thống AI · Tư duy sản phẩm · Tư duy thiết kế

## Slide 8 — MỞ ĐẦU · TÀI LIỆU
Phát triển Sản phẩm AI ([[AI Product]]) — Google PAIR — People + AI Guidebook  
Chương 1 — User Needs + Defining Success là xương sống buổi sáng nay (PAIR ①②③).  
- [[Data Collection]] + [[Evaluation]]  
- [[Explainability]] + [[Trust]]  
- [[Errors]] + [[Graceful Failure]]

## Slide 9 — BÀI TOÁN · CHATBOT
Thảo luận nhanh về việc xây dựng chatbot AI cho khách hàng.

## Slide 10 — BÀI TOÁN · CHATBOT
Phạm vi sử dụng chatbot trong:  
- GIẢI ĐÁP CÂU HỎI THƯỜNG GẶP  
- TƯ VẤN và hỗ trợ mua hàng  
- CHĂM SÓC SAU MUA HÀNG  
-> "AI chatbot" chưa phải là một bài toán — Đối tượng khác nhau dẫn đến quy trình (workflow), chỉ số (metrics) và rủi ro khác nhau.

## Slide 11 — BÀI TOÁN · PHÂN TÍCH
Thảo luận về cách AI có thể giải quyết lớp học 1000 học viên.

## Slide 12 — BÀI TOÁN · PHÂN TÍCH
Cần thấu hiểu bản chất vấn đề trước khi tìm giải pháp. Chưa thấu hiểu [[pain-point]] thì chưa đề xuất giải pháp.

## Slide 13 — BÀI TẬP CÁ NHÂN
Liệt kê ít nhất 3 [[pain-points]] từ trải nghiệm ngày học đầu tiên.

## Slide 14 — BÀI TOÁN · DOUBLE DIAMOND
"Do not solve the problem I am asked to solve." — Don Norman.

## Slide 15 — BÀI TOÁN · DOUBLE DIAMOND
Tìm đúng vấn đề trước khi tìm giải pháp — [[Double-Diamond]], HCD và các kỹ thuật phân kỳ / hội tụ.

## Slide 16 — BÀI TOÁN · DIAMOND 1
**Discover**: Mở rộng — khảo sát vấn đề căn bản.  
**Define**: Thu hẹp — xác định đúng bài toán gốc.  
**Develop**: Mở rộng — nhiều giải pháp tiềm năng.  
**Deliver**: Thu hẹp — chọn và triển khai.  
Giải pháp xuất sắc cho sai vấn đề có thể còn tệ hơn không có giải pháp.

## Slide 17 — BÀI TOÁN · DIAMOND 1
**Discover**: Các kỹ thuật để mở rộng góc nhìn.  
**Define**: Kỹ thuật để lựa chọn chính xác.

## Slide 18 — BÀI TOÁN · HCD VÒNG LẶP
Quy trình thiết kế lấy con người làm trung tâm — liên tục lặp lại qua các giai đoạn.

## Slide 19 — BÀI TOÁN · CÂU HỎI NGUYÊN BẢN
Những câu hỏi nguyên bản có thể bắt nguồn từ việc đặt câu hỏi cho những điều hiển nhiên.

## Slide 20 — BÀI TẬP CÁ NHÂN
Bạn có câu hỏi nào mà cảm thấy "ngớ ngẩn" không?

## Slide 21 — BÀI TOÁN · CÂU HỎI GỢI MỞ
Gửi 1 câu hỏi phản biện lên Discord về thiết kế và cải tiến.

## Slide 22 — BÀI TOÁN · CASE STUDY
Ba bài học thực tế từ những ví dụ cụ thể — hiểu lĩnh vực, quy mô thị trường và định vị giải pháp.

## Slide 23 — BÀI TOÁN · 4 LENSES
Tập trung nhận diện vấn đề; chưa vội đề xuất giải pháp.

## Slide 24 — BÀI TOÁN · ANTI-PATTERNS
Những sai lầm thường gặp — Dấu hiệu cảnh báo bài toán chưa được định hình rõ.

## Slide 25 — BÀI TOÁN · PHỎNG VẤN
Những câu hỏi quan trọng trong phỏng vấn các bên liên quan.

## Slide 26 — BÀI TOÁN · PAIR REFRAME
"How might we solve ______?" là cách hỏi bài toán trước, về AI sau.

## Slide 27 — PROBLEM STATEMENT
Từ [[pain-point]] đến [[problem-statement]] — bài toán định hình rõ nét qua [[workflow]], bottleneck, metrics và boundary.

## Slide 28 — PROBLEM STATEMENT · QUICK CARD
Khung định hình bài toán bao gồm:  
- Bài toán (problem)  
- Đối tượng ảnh hưởng (actor)  
- Quy trình hiện tại (workflow)  
- Nút thắt (bottleneck) & Tác động (impact)  
- Chỉ số đo thành công (success metric)  
- Định hướng giải pháp (direction)  

## Slide 29 — PROBLEM STATEMENT · WORKED EXAMPLE
Ví dụ mẫu về cảm nhận thông tin.

## Slide 30 — PROBLEM STATEMENT · 6 CÂU HỎI
Bộ câu hỏi khai thác bài toán dành cho các bên liên quan.

## Slide 31 — PROBLEM STATEMENT · ĐỊNH LƯỢNG
Định lượng hóa bài toán để xác định giá trị thực tế của AI.

## Slide 32 — PROBLEM STATEMENT · METRICS
Thiết lập chỉ số đo lường cần phản ánh kết quả cuối và các đòn bẩy có thể tác động.

## Slide 33 — BÀI TẬP NHANH
Lựa chọn một điểm đau đã nhận diện và thiết lập phương án đo lường cụ thể.

## Slide 34 — CÓ NÊN ỨNG DỤNG AI?
AI chỉ thực sự mang lại giá trị khi tích hợp chính xác vào quy trình nghiệp vụ và giải quyết đúng điểm đau.

## Slide 35 — CÓ NÊN ỨNG DỤNG AI · PAIR 3 BƯỚC
Ba bước quyết định AI: Sự cần thiết, Cấp độ giải pháp và các chỉ số thành công.

## Slide 36 — CÓ NÊN ỨNG DỤNG AI · AI PROBABLY BETTER
Liệt kê các trường hợp khi AI thực sự mang lại lợi thế.

## Slide 37 — CÓ NÊN ỨNG DỤNG AI · KHI NÀO KHÔNG CẦN AI
Liệt kê các trường hợp không nên sử dụng AI.

## Slide 38 — CÓ NÊN ỨNG DỤNG AI · KHI NÀO HỢP
Dấu hiệu nhận biết bài toán phù hợp và động lực đầu tư của doanh nghiệp.

## Slide 39 — CÓ NÊN ỨNG DỤNG AI · BUILD / BOOST / BUY
Quyết định xây dựng hay mua giải pháp AI.

## Slide 40 — QUYẾT ĐỊNH AI · LIFECYCLE
Vòng đời sản phẩm AI và các yêu cầu xác thực cho từng giai đoạn.

## Slide 41 — RWA · TỔNG QUAN
Phân tích cấp độ giải pháp: Rule, Workflow và Agent.

## Slide 42 — HỆ THỐNG AI · KIẾN TRÚC
Một hệ thống AI là một giải pháp nhiều thành phần, không chỉ dừng lại ở mô hình ngôn ngữ.

## Slide 43 — RWA · AUTOMATE VS AUGMENT
Xác định tác vụ nào AI nên làm thay hay hỗ trợ con người.

## Slide 44 — RWA · AUTOMATE IN PHASES
Tăng mức tự động hóa theo pha – không bật full-auto từ đầu.

## Slide 45 — RWA · SO SÁNH
Một tình huống, ba cấp độ giải pháp: [[rule]], [[workflow]], [[agent]].

## Slide 46 — RWA · TÌNH HUỐNG
Minh họa việc tối ưu nguồn lực trợ giảng cho lớp học lớn.

## Slide 47 — RWA · MỨC 1: RULE
Áp dụng khi logic nghiệp vụ tường minh và kết quả cố định.

## Slide 48 — RWA · MỨC 2: WORKFLOW
Áp dụng cho các bước xử lý đã định hình rõ với AI hỗ trợ.

## Slide 49 — RWA · MỨC 3: AGENT
Khả năng tự động lập kế hoạch và điều chỉnh linh hoạt.

## Slide 50 — RWA · SO SÁNH
So sánh các thứ tự ưu tiên giữa Rule, Workflow và Agent.

## Slide 51 — WORKFLOW · PM MENTAL MODEL
Đọc workflow patterns như người làm product, hiểu các tradeoff.

## Slide 52 — WORKFLOW PATTERNS · BASIC
Bảng tổng quan các mô hình cơ bản đáp ứng đa số tác vụ. 

## Slide 53 — WORKFLOW PATTERNS · ADVANCED
Mô hình nâng cao cho nghiệp vụ phức tạp.

## Slide 54 — WORKFLOW · THANG QUYẾT ĐỊNH
Câu hỏi lựa chọn cấp độ giải pháp cho các tình huống khác nhau. 

## Slide 55 — WORKFLOW · DECISION TREE
Cây quyết định từ bài toán cốt lõi đến lựa chọn giải pháp thích hợp.

## Slide 56 — WORKFLOW · VÍ DỤ THỰC TẾ
Phân biệt cấp độ giải pháp trong các tình huống thực hành cụ thể.

## Slide 57 — REWARD · HÀM THƯỞNG
Reward function là công thức quyết định đâu là dự đoán "đúng", đâu là "sai".

## Slide 58 — REWARD · PRECISION ↔ RECALL
Đánh đổi giữa độ chính xác và mức độ bao phủ — cần xác định điểm cân bằng.

## Slide 59 — REWARD · SUCCESS CRITERIA
Viết tiêu chí thành công cần gắn với hiện trạng, mục tiêu và phương pháp đo.

## Slide 60 — CÓ NÊN ỨNG DỤNG AI · THIẾT LẬP KỲ VỌNG
Thiết lập kỳ vọng qua các chỉ số để xác định mức độ hiệu quả trước khi phát hành.

## Slide 61 — QUYẾT ĐỊNH AI · DEMO TO PRODUCTION
Khoảng cách giữa Demo và Production; cần kiểm thử kỹ lưỡng.

## Slide 62 — PROBLEM STATEMENT · EVAL PLAN
Từ [[problem-statement]] đến kế hoạch đánh giá cho hệ thống AI.

## Slide 63 — PROBLEM STATEMENT · EVAL FLOW
Chuyển dịch từ [[problem-statement]] sang [[eval-plan]] rõ ràng.

## Slide 64 — ERRORS · ĐỊNH NGHĨA LỖI
Xác định lỗi AI theo kỳ vọng và phù hợp với mô hình người dùng.

## Slide 65 — ERRORS · UX + HITL
Vai trò và trách nhiệm của [[UX]] cùng Human-in-the-loop trong quy trình AI.

## Slide 66 — PROBLEM STATEMENT · 9 TRƯỜNG
Các yếu tố cấu thành [[problem-statement]] gồm: Actor, Workflow, Bottleneck, Impact, Success Metric, Boundary.

## Slide 67 — PROBLEM STATEMENT · VÍ DỤ
Một ví dụ về [[problem-statement]] cho trường hợp hỗ trợ Lab Coach/TA.

## Slide 68 — QUYẾT ĐỊNH AI · 5 CÂU HỎI
Các câu hỏi kiểm tra mức độ phù hợp cho AI trước khi ra quyết định.

## Slide 69 — QUYẾT ĐỊNH · GO / NOT YET / NO-GO
Khung ra quyết định dựa trên tính khả thi của [[problem-statement]].

## Slide 70 — RECAP · 6 NGUYÊN TẮC
Sáu nguyên tắc thiết kế cốt lõi để thẩm định mọi đề xuất ứng dụng AI.

## Slide 71 — APPENDIX · ĐỌC THÊM
Bốn nguồn gốc của lỗi AI, cũng như chính sách thiết kế trải nghiệm người dùng chặt chẽ.

## Slide 72 — APPENDIX · ĐỌC THÊM
Các nguyên tắc cho Human-in-the-loop và cách xử lý feedback người dùng.

## Slide 73 — APPENDIX · ĐỌC THÊM
Tổng kết lại các pattern giúp tối ưu hóa giải pháp AI.

## Slide 74 — APPENDIX · ĐỌC THÊM
Bảng tổng quan các pattern theo yêu cầu và mức độ phức tạp của nghiệp vụ.

## Slide 75 — APPENDIX · LIFECYCLE
Vòng đời sản phẩm AI yêu cầu các phương thức xác thực chuyên biệt từ ý tưởng đến hiện thực hóa.

## Slide 76 — APPENDIX · QUESTION CARDS
Bộ thẻ câu hỏi tổng hợp từ Day 02 về việc hình thành [[problem-statement]] và quyết định ứng dụng AI.
```

## Khái niệm chính
- [[AI Product]]: Sản phẩm tích hợp AI trong quy trình sản phẩm hoàn chỉnh.
- [[Problem Statement]]: Bài toán cụ thể cần giải quyết, không bao gồm giải pháp.
- [[Rule]]: Các quy tắc tĩnh, không thay đổi để xử lý các tác vụ.
- [[Workflow]]: Quy trình gồm nhiều bước, có thể tự động hoặc thủ công.
- [[Agent]]: Tác nhân tự động hóa có khả năng ra quyết định trong các tình huống thay đổi.
- [[Pain Point]]: Vấn đề thực sự mà người dùng gặp phải.
- [[UX]]: Trải nghiệm người dùng, tập trung vào cảm nhận và sự thuận tiện.
- [[Double Diamond]]: Mô hình phát triển sản phẩm theo hai giai đoạn: Khám phá và hình thành.
- [[Evaluation]]: Đánh giá chất lượng và hiệu quả của sản phẩm hoặc giải pháp.
- [[Mental Model]]: Mô hình tư duy của người dùng giúp họ hiểu và tương tác với sản phẩm.
- [[Feedback]]: Thông tin hồi đáp từ người dùng để cải thiện sản phẩm hoặc dịch vụ.
