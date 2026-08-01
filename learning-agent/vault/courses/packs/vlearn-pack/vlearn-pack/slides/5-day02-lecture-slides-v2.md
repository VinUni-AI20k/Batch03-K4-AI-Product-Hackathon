---
course: packs
generated: '2026-07-31T18:15:45+00:00'
lang: vi
lesson: 5-day02-lecture-slides-v2
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\slides\5-day02-lecture-slides-v2.md
source_hash: sha256:d8ac30a6886b4386325cbc57cec20098eccaa3ed10620745c0a67a562fb1cab6
type: lesson-note
---

```markdown
## Slide 1 — Xác định bài toán cho AI
Xác định bài toán cho AI, chuyển từ yêu cầu mơ hồ thành [[Problem Statement]] rõ ràng. 

## Slide 2 — Bốn câu hỏi trọng tâm
- Bài toán có thực sự cần AI giải quyết?
- Nếu có, giải pháp ở cấp độ nào: Rule, Workflow, hay [[Agent]]?
- Problem Statement đã đủ rõ ràng để triển khai?
- Khi nào quyết định: Go, Not Yet, hay No-Go?

## Slide 3 — Agenda
Mục tiêu: Biến yêu cầu mơ hồ thành Problem Statement rõ ràng để ra quyết định. 
- Sáng: Khung lý thuyết (4H)
- Chiều: Thực hành lab (4H)

## Slide 4 — Phát triển Sản phẩm AI
Sản phẩm tích hợp AI bản chất vẫn là một sản phẩm hoàn chỉnh, kế thừa chứ không thay thế nguyên lý sản phẩm truyền thống.

## Slide 5 — Ba trụ cột nền tảng của AI Product
- **AI Engineering**: Triển khai RAG, Agent, Guardrails, Evaluation và vận hành hệ thống AI thực tế.
- **Product Thinking**: Xác định đúng bài toán, thấu hiểu người dùng, tránh xây dựng những tính năng không mang lại giá trị.
- **Design Thinking**: Thiết kế dựa trên mô hình tư duy, cơ chế phản hồi và tối ưu trải nghiệm khi AI sai sót.

## Slide 6 — Thảo luận nhanh
“Tôi muốn xây dựng chatbot AI cho khách hàng.” Bạn có thể hỏi chatbot đó đang làm gì để hiểu rõ hơn.

## Slide 7 — "AI chatbot" chưa phải là một bài toán
Đối tượng khác nhau dẫn đến quy trình, chỉ số và rủi ro khác nhau.

## Slide 8 — Khoan đã, bạn có hỏi không?
Cần thấu hiểu bản chất vấn đề trước khi tìm giải pháp. Học viên gặp khó khăn ở công đoạn nào? 

## Slide 9 — Nhận diện điểm đau thực tế
Liệt kê ít nhất 3 điểm đau bạn quan sát hoặc gặp phải trong quá trình học.

## Slide 10 — Counter-Intuitive Rule
“Never solve the problem I am asked to solve.” - Don Norman

## Slide 11 — Problem Discovery
Tìm đúng vấn đề trước khi tìm giải pháp — áp dụng các kỹ thuật như [[Double Diamond]], HCD.

## Slide 12 — Tìm đúng vấn đề trước khi tìm giải pháp
Mô hình [[Double Diamond]] giúp mở rộng và thu hẹp vấn đề và giải pháp.

## Slide 13 — Diamond 1 — Tìm đúng vấn đề
- **Discover**: Khám phá và khảo sát vấn đề căn bản.
- **Define**: Định nghĩa đúng bài toán gốc.

## Slide 14 — Quy trình thiết kế lấy con người làm trung tâm (HCD)
Quy trình bao gồm: Observation, Ideation, Prototype, Test, Iteration.

## Slide 15 — Những câu hỏi nguyên bản
Đặt câu hỏi cho những điều hiển nhiên có thể cung cấp insight mới.

## Slide 16 — Câu hỏi gợi mở
Thúc đẩy tư duy sáng tạo qua việc đặt các câu hỏi mở về bài toán.

## Slide 17 — Khởi nguồn từ bài toán
Nắm rõ lĩnh vực, quy mô thị trường và định vị giải pháp là rất quan trọng.

## Slide 18 — Tìm bài toán AI ở đâu?
Quan sát các hoạt động thực tế xung quanh để nhận diện vấn đề.

## Slide 19 — Sai lầm thường gặp khi tích hợp AI
Cảnh báo bài toán chưa được định hình rõ hoặc giải pháp AI chọn quá sớm.

## Slide 20 — Discovery interview: 5 câu hỏi nên hỏi stakeholder
- Vấn đề nhức nhối là gì?
- Thiệt hại do vấn đề này gây ra là gì?

## Slide 21 — Problem Statement
Đi từ điểm đau đến [[Problem Statement]] — bài toán định hình qua workflow, bottleneck, metrics và boundary.

## Slide 22 — Quick Problem Card
Khung định hình cho bài toán, bao gồm các yếu tố như Problem, Actor, Workflow, Bottleneck, Impact, Success Metric.

## Slide 23 — Quick Problem Card — ví dụ đã điền
Ví dụ cụ thể về cách điền Quick Problem Card cho một bài toán thực tế.

## Slide 24 — Câu hỏi khai thác bài toán
Bộ câu hỏi định hình vấn đề để thuyết phục các bên liên quan.

## Slide 25 — Định lượng hóa bài toán
Điểm đau chưa được định lượng thì không thể xác định giá trị thực tế của AI.

## Slide 26 — Thiết lập chỉ số: Output & Input
Chỉ số đo lường cần phải phản ánh kết quả cuối cùng và các yếu tố có thể tác động.

## Slide 27 — Chuyển điểm đau thành chỉ số định lượng
Thiết lập phương án đo lường cho điểm đau đã nhận diện.

## Slide 28 — Có nên ứng dụng AI?
AI chỉ thực sự mang lại giá trị khi tích hợp chính xác vào quy trình nghiệp vụ và giải quyết đúng điểm đau.

## Slide 29 — Khi nào AI đáng để làm?
Mục tiêu áp dụng AI sẽ quyết định cách xây dựng giải pháp.

## Slide 30 — Tự xây dựng hay mua giải pháp?
Hai góc nhìn bổ sung nhau giúp định hình chiến lược triển khai.

## Slide 31 — Thiết lập kỳ vọng
Đo lường các chỉ số để xác định mức độ hiệu quả trước khi chính thức phát hành giải pháp.

## Slide 32 — Đánh giá mức độ phù hợp của AI
Năm câu hỏi cốt lõi để xác định cấp độ giải pháp phù hợp.

## Slide 33 — Vòng đời Sản phẩm AI
Mỗi giai đoạn từ ý tưởng đến vận hành thực tế yêu cầu phương thức xác thực chuyên biệt.

## Slide 34 — Khoảng cách giữa Demo và Production
Phản hồi chỉ vào một vài lần thử chưa đủ để triển khai hệ thống thực tế.

## Slide 35 — Hệ thống AI
Hệ thống AI thực tế là sự kết hợp của nhiều thành phần chứ không chỉ là mô hình ngôn ngữ.

## Slide 36 — Tổng quan về Hệ thống AI
Mô hình, ngữ cảnh, quy trình và công cụ là các thành phần cấu thành chính.

## Slide 37 — Vai trò của UX trong Sản phẩm AI
Thiết kế UX là rất quan trọng để xử lý các tình huống AI thiếu dữ liệu hoặc độ tin cậy thấp.

## Slide 38 — Rule / Workflow / Agent
Phân tích cấp độ giải pháp; ưu tiên đơn giản nhất đủ để giải quyết bài toán.

## Slide 39 — Ba mức giải pháp: Rule / Workflow / Agent
Mô tả các cấp độ giải pháp với ví dụ cụ thể cho từng cấp.

## Slide 40 — Tình huống: Tối ưu nguồn lực Trợ giảng
Mô hình hóa quy trình nghiệp vụ trước khi cân nhắc ứng dụng AI.

## Slide 41 — Cấp độ 1 — Giải pháp dựa trên Luật
Giải pháp dựa trên luật khi logic nghiệp vụ tường minh và điều kiện kết quả cố định.

## Slide 42 — Cấp độ 2 — Giải pháp dựa trên Quy trình
Các bước xử lý đã định hình rõ nhưng từng công đoạn cần hỗ trợ AI.

## Slide 43 — Cấp độ 3 — Giải pháp dựa trên Tác nhân tự chủ
Hệ thống tự động lập kế hoạch và linh hoạt thích ứng.

## Slide 44 — Một tình huống, ba cấp độ giải pháp
Ưu tiên lựa chọn giải pháp đơn giản nhất có thể giải quyết bài toán.

## Slide 45 — Workflow Patterns theo Anthropic
Khái quát về các mẫu quy trình hoạt động cơ bản và nâng cao.

## Slide 46 — Workflow patterns — đủ cho hầu hết bài toán
Mô hình cơ bản đáp ứng hầu hết tác vụ thực tế nên được ưu tiên sử dụng.

## Slide 47 — Khi nào cần phức tạp hơn?
Mẫu Orchestrator-Workers và Evaluator-Optimizer sẽ sử dụng khi cần yếu tố phức tạp.

## Slide 48 — Thang câu hỏi lựa chọn cấp độ giải pháp
Khung câu hỏi tuần tự giúp tránh nhảy vọt lên giải pháp phức tạp.

## Slide 49 — Cây quyết định: Lựa chọn cấp độ giải pháp
Phác thảo từ bài toán cốt lõi đến lựa chọn giải pháp phù hợp.

## Slide 50 — Ví dụ thực tế ngoài lớp học
Phân biệt cấp độ giải pháp trong các tình huống như chăm sóc khách hàng hay nghiên cứu bán hàng.

## Slide 51 — Thiết kế UX và Human-in-the-loop
Tối ưu hóa hiệu quả của AI qua thiết kế giao diện tương tác phù hợp.

## Slide 52 — Problem Statement hoàn chỉnh
Liên kết chặt chẽ giữa bài toán và các yếu tố quyết định AI.

## Slide 53 — Problem Statement cho hệ thống AI
Mô tả 6 yếu tố bài toán cốt lõi và 3 yếu tố quyết định AI.

## Slide 54 — Ví dụ mẫu: Hỗ trợ Lab Coach/TA
Mô tả một Problem Statement hoàn chỉnh cho tình huống thực hành.

## Slide 55 — Từ Problem Statement đến Eval Plan
Problem Statement rõ ràng giúp định hình các tiêu chí kiểm thử cụ thể.

## Slide 56 — Chuyển dịch từ Problem Statement sang Eval Plan
Phương pháp đánh giá, bộ dữ liệu mẫu và ngưỡng chấp nhận.

## Slide 57 — Khung ra quyết định: Go / Not Yet / No-Go
Quyết định dựa trên tính khả thi của Problem Statement và không thiên lệch vào công nghệ.

## Slide 58 — Bài tập Lab ngày 02
Áp dụng khung lý thuyết đã học vào thực tiễn thông qua bài tập cá nhân và nhóm.

## Slide 59 — Tổng quan bài Lab: Deliverables
Lộ trình làm bài cho cá nhân và nhóm với các phần việc cụ thể.

## Slide 60 — Giai đoạn 1 & 2: Phân kỳ và Hội tụ Cá nhân
Khảo sát tối thiểu 5 bài toán thực tế và lựa chọn top 3 Problem Cards tối ưu.

## Slide 61 — Hướng dẫn xây dựng Workflow Diagram
Phân tích giữa Current-State và Future-State trong quá trình thiết kế.

## Slide 62 — Worked Example: Báo cáo tuần trước và sau AI
Mô tả Current-State, Future-State, ranh giới kiểm soát và phương án fallback.

## Slide 63 — Sản phẩm bàn giao sau buổi Lab
Chi tiết về các sản phẩm bàn giao từ cá nhân và nhóm sau bài lab.

## Slide 64 — Năm nguyên tắc cốt lõi sau Day 02
Tóm tắt năm nguyên tắc để thẩm định mọi đề xuất ứng dụng AI.

## Khái niệm chính
- [[Problem Statement]]: Là bản tóm tắt vấn đề rõ ràng, giúp định hình hướng giải pháp cho AI.
- [[Agent]]: Một hệ thống AI có khả năng tự động ra quyết định và tương tác với người dùng.
- [[Double Diamond]]: Mô hình thiết kế bao gồm hai giai đoạn chính là mở rộng và thu hẹp để tìm ra vấn đề và giải pháp rõ ràng.
- [[HCD]]: Thiết kế lấy con người làm trung tâm, tập trung vào nhu cầu và mong đợi của người dùng.
```
