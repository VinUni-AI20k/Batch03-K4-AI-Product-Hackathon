---
course: AI20K
generated: '2026-07-30T17:32:07+00:00'
lang: vi
lesson: day02-slide-v2-blue (1)
maps:
- '[[MOC - AI20K]]'
module: ''
source_file: AI20K/day02-slide-v2-blue (1).pdf
source_hash: sha256:22708aa916784c4e0df466cd1d694346ea1883c18560b7ce370de6bd28f156bf
type: lesson-note
---

```markdown
## Slide 1 — Xác định bài toán cho AI.
Từ yêu cầu mơ hồ đến [[Problem Statement]] rõ ràng.

## Slide 2 — Instructor
<!-- src: ... -->
## Mai Anh Nguyen Blue
Generalist Product Builder

| 2026      | FPT Long Châu PM · Healthcare Product)       |
|-----------|-----------------------------------------------|
| 2025      | Thongtincuuho.org Co-founder)                |
| 2025      | FPT Software AI Center PM · AI Agent)        |
| 2021-2025 | Xantus PM · On-chain Analytics, AI Agent)    |
| 2016-2021 | DYNO, Kalapa PM · OCR, eKYC, Credit Scoring) |
| LinkedIn  | &#124; Facebook                               |

## Slide 3 — Bốn câu hỏi trọng tâm
- Từ xác định bài toán đến quyết định ứng dụng [[AI]].
- 01 Bài toán có thực sự cần [[AI]] giải quyết?
- 02 Nếu có, giải pháp ở cấp độ nào: [[Rule]], [[Workflow]], hay [[Agent]]?
- 03 [[Problem Statement]] đã đủ rõ ràng để triển khai?
- 04 Khi nào quyết định: Go, Not Yet, hay No-Go?

## Slide 4 — Agenda
- Mục tiêu: Biến yêu cầu mơ hồ thành [[Problem Statement]] rõ ràng để ra quyết định.

## Slide 5 — KHUNG LÝ THUYẾT 4H
- [[Problem Discovery]] [[Double Diamond]], [[HCD]]
- [[Problem Statement]] & định lượng hóa
- PAIR ① [[AI]] có thêm giá trị?
- PAIR ② [[Automate]]/[[Augment]] → [[Rule]]/[[Workflow]]/[[Agent]]
- PAIR ③ [[Reward function]] & [[success criteria]]
- Khi [[AI]] sai & [[UX]]/[[HITL]]
- [[Problem Statement]] hoàn chỉnh → Go/Not Yet/No-Go

## Slide 6 — THỰC HÀNH LAB 4H
- Cá nhân: Tìm 5 bài toán & điền 3 [[Problem Cards]]
- Nhóm: Phản biện chéo, chốt 1 bài toán
- Nhóm: Xác thực dữ liệu & vẽ quy trình
- Nhóm: Xác định giải pháp & ra quyết định
- Cá nhân: Viết nhật ký phản tư [[Reflection Log]].

## Slide 7 — CUỐI BUỔI
- Nhật ký tìm và lọc bài toán Cá nhân)
- [[Problem Statement]] hoàn chỉnh Nhóm
- Nhật ký phản tư Cá nhân).

## Slide 8 — Nguyên tắc tương tác & Thực hành
- Hình thức trao đổi, bài tập nhanh và nộp sản phẩm chính.

## Slide 9 — Thảo luận nhanh qua Discord
Gửi phản hồi ngắn, câu hỏi nhanh hoặc ý kiến phản biện trực tiếp lên Discord.

## Slide 10 — Khuyến khích chia sẻ ý tưởng sơ khởi

## Slide 11 — Nộp sản phẩm qua GitHub
Ý tưởng không cần hoàn hảo ngay từ đầu; các câu trả lời chưa sâu sẽ là chất liệu để cùng phân tích. 
Báo cáo thực hành [[Bài tập Lab]] ngày 02 được nộp trực tiếp trên GitHub Repository.
Điểm thưởng (Bonus) dành cho học viên tích cực tương tác.

## Slide 12 — Phát triển Sản phẩm AI (AI Product)
- Sản phẩm tích hợp [[AI]] bản chất vẫn là một sản phẩm hoàn chỉnh, kế thừa chứ không thay thế nguyên lý sản phẩm truyền thống.

## Slide 13 — Ba trụ cột nền tảng của AI Product
- Kỹ thuật hệ thống [[AI]] · [[Tư duy sản phẩm]] · [[Tư duy thiết kế]].

## Slide 14 — AI Engineering
Triển khai [[RAG]], [[Agent]], [[Guardrails]], [[Evaluation]] (Đánh giá) và vận hành hệ thống [[AI]] thực tế.

## Slide 15 — Product Thinking (Inspired)
Xác định đúng bài toán, thấu hiểu người dùng, tránh xây dựng những tính năng không mang lại giá trị.

## Slide 16 — Design Thinking (Everyday Things)
Thiết kế dựa trên mô hình tư duy (Mental Model), cơ chế phản hồi (Feedback) và tối ưu trải nghiệm khi [[AI]] sai sót.

## Slide 17 — Tài liệu xuyên suốt buổi học
- Google PAIR Guidebook là "sách giáo khoa" hôm nay; hai tài liệu phụ đọc thêm.

## Slide 18 — People + AI Guidebook
6 chương - cẩm nang thiết kế sản phẩm [[AI]] lấy con người làm trung tâm:
1. [[User Needs]] + [[Defining Success]]
2. [[Data Collection]] + [[Evaluation]]
3. [[Mental Models]]
4. [[Explainability]] + [[Trust]]
5. [[Feedback]] + [[Control]]
6. [[Errors]] + [[Graceful Failure]]

[[Chương 1]]   [[User Needs]] + [[Defining Success]] là xương sống buổi sáng nay (PAIR ①②③).

## Slide 19 — Building effective agents
Chọn giải pháp đơn giản nhất: [[rule]]/[[workflow]] trước, [[agent]] chỉ khi thật sự cần - dùng ở PAIR ②.

## Slide 20 — Rules of Machine Learning
Các quy tắc thực chiến của Google: giải pháp đơn giản ([[rule]], [[heuristic]]) trước, [[ML]] sau.

## Slide 21 — Thảo luận nhanh
"Tôi muốn xây dựng chatbot [[AI]] cho khách hàng." THEO BẠN CHATBOT ĐÓ ĐANG LÀM GÌ?

## Slide 22 — "AI chatbot" chưa phải là một bài toán
- Đối tượng khác nhau dẫn đến quy trình (workflow), chỉ số (metrics) và rủi ro khác nhau.

## Slide 23 — PHỤC VỤ KHÁCH HÀNG
- Giải đáp câu hỏi thường gặp (FAQ) về sản phẩm & chính sách.
- Tư vấn và hỗ trợ mua hàng.
- Chăm sóc sau mua hàng.
- Bán thêm & bán chéo (Upsell & [[Cross-sell]]).

## Slide 24 — HỖ TRỢ NỘI BỘ
- Phân loại yêu cầu hỗ trợ (Tickets/Questions).
- Tra cứu thông tin nghiệp vụ nhanh.
- Đề xuất nháp phản hồi để con người phê duyệt.
- Chuyển tiếp câu hỏi phức tạp hoặc rủi ro cao cho nhân sự hỗ trợ.

## Slide 25 — TÌNH HUỐNG THỰC TẾ
Lớp học 1000 học viên (khóa K3 & K4), số lượng Trợ giảng có hạn. Dùng [[AI]] giải quyết thế nào?

## Slide 26 — Khoan đã, bạn có hỏi không?
- Cần thấu hiểu bản chất vấn đề trước khi tìm giải pháp.
  
## Slide 27 — Nhận diện điểm đau thực tế
- 5 PHÚT · GỬI LÊN DISCORD.

## Slide 28 — Câu hỏi gợi mở
- Đặt câu hỏi gợi mở để mở rộng tư duy trước khi lựa chọn bài toán.

## Slide 29 — Khởi nguồn từ bài toán, không bắt đầu từ [[AI]]
- Ba bài học thực tế: am hiểu lĩnh vực, quy mô thị trường và định vị giải pháp.

## Slide 30 — Những câu hỏi nguyên bản
- Đôi khi insight bắt đầu từ việc đặt câu hỏi cho những điều hiển nhiên.

## Slide 31 — Câu hỏi gợi mở
1. Giả định hiển nhiên nào cần được lật lại?
2. Tại sao bài toán này cần [[AI]]? Nếu không thì sao?

## Slide 32 — Bộ thẻ câu hỏi #1 - PHÂN KỲ
1. Giả định hiển nhiên nào cần lật lại?
...
6. Có câu hỏi cốt lõi nào đang bị né tránh?

## Slide 33 — x 
...

## Slide 34 — Từ pain point đến [[Problem Statement]]
...

## Slide 35 — Quick [[Problem Card]]
- Khung định hình bài toán.

## Slide 36 — Quick [[Problem Card]] - ví dụ đã điền
...

## Slide 37 — Câu hỏi khai thác bài toán
...

## Slide 38 — Định lượng hóa bài toán
...

## Slide 39 — [[INPUT]]
- Hiện trạng / đâu là chi phí cao nhất?

## Slide 40 — [[OUTPUT]]
- Mục tiêu / kỳ vọng cải thiện là gì?

## Slide 41 — Có nên ứng dụng [[AI]]?
[[AI]] chỉ chân chính phát huy giá trị khi tích hợp vào quy trình nghiệp vụ.

## Slide 42 — Ba bước quyết định [[AI]] theo PAIR
...

## Khái niệm chính
- [[Problem Statement]]: Là tuyên bố rõ ràng về vấn đề cần giải quyết.
- [[AI]]: Công nghệ cho phép máy móc học hỏi và thực hiện nhiệm vụ.
- [[Rule]]: Quy tắc đơn giản dùng để xử lý thông tin.
- [[Workflow]]: Quy trình từng bước để hoàn thành một tác vụ.
- [[Agent]]: Hệ thống tự động hóa có khả năng thực hiện địa chỉ công việc từ xa.
- [[User Needs]]: Nhu cầu và mong đợi của người dùng đối với sản phẩm.
- [[Data Collection]]: Quá trình thu thập dữ liệu cần thiết cho [[AI]].
- [[Feedback]]: Phản hồi từ người dùng nhằm cải thiện sản phẩm.
- [[HITL]]: Khái niệm về sự can thiệp của con người trong quy trình [[AI]].
- [[Reward function]]: Chỉ số xác định mục tiêu và độ hiệu quả của [[AI]].
- [[Mental Models]]: Mô hình tư duy giúp người dùng hiểu cách [[AI]] hoạt động.

```
