---
course: packs
generated: '2026-07-30T10:38:22+00:00'
lang: vi
lesson: d2-slide-hackathon
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/slides/d2-slide-hackathon.pdf
source_hash: sha256:5f729b2788a8f6d56a2252f96e96efec8e8cf7d66a20b39d470bca38f0754c5d
type: lesson-note
---

```markdown
## Slide 1 — Xác định bài toán cho AI.

Từ yêu cầu mơ hồ đến [[problem-statement]] rõ ràng.

### Agenda

- Mục tiêu: Biến yêu cầu mơ hồ thành [[problem-statement]] rõ ràng để ra quyết định.

## Slide 2 — Tìm đúng vấn đề trước khi tìm giải pháp

- Mô hình [[double-diamond]] - Don Norman / British Design Council (2005)

DIAMOND 1 - TÌM ĐÚNG VẤN ĐỀ

"Kỹ sư và doanh nhân được đào tạo để giải vấn đề. Nhà thiết kế được đào tạo để khám phá vấn đề thật."

Discover: Mở rộng - khảo sát vấn đề căn bản. Define: Thu hẹp - xác định đúng bài toán gốc. DIAMOND 2 - TÌM ĐÚNG GIẢI PHÁP Develop: Mở rộng - nhiều giải pháp tiềm năng. Deliver: Thu hẹp - chọn và triển khai.

## Slide 3 — Diamond 1 - Tìm đúng vấn đề

- Phân kỳ để thấu hiểu sâu sắc, hội tụ để lựa chọn chính xác.

DISCOVER · PHÂN KỲ

## Khám phá / mở rộng góc nhìn

- Quan sát thực tế (Observation)
- Phỏng vấn người dùng (User Interview)
- Khảo sát (Survey)
- Nhật ký hành vi (Diary Study)
- Phân tích dữ liệu / Nhật ký hệ thống
- Bản đồ các bên liên quan (Stakeholder Mapping)

DEFINE · HỘI TỤ

- Định nghĩa / chọn lọc dựa vào dữ liệu
- Sơ đồ đồng cảm / Gom nhóm (Affinity Mapping)
- Kỹ thuật đặt câu hỏi 5 Whys
- Ma trận Tác động - Nỗ lực (Impact-Effort)
- Biểu quyết bằng chấm tròn (Dot Voting)
- Câu hỏi mở hướng giải quyết (How Might We)
- Phát biểu bài toán (Problem Statement)

## Slide 4 — Khởi nguồn từ bài toán, không bắt đầu từ AI

- Ba bài học thực tế về am hiểu lĩnh vực, quy mô thị trường và định vị giải pháp.

CURSOR

## "Lệch năng lực cốt lõi"

Từ bỏ mảng AI thiết kế cơ khí (CAD) để tập trung vào AI code editor - nơi đội ngũ am hiểu sâu sắc quy trình nghiệp vụ.

ARTIFACT

"Sản phẩm tốt ≠ Thị trường lớn" Ứng dụng đọc tin tích hợp AI xuất sắc, nhưng quy mô thị trường quá hẹp để thương mại hóa thành công.

## Slide 5 — "Định vị đúng điểm đau"

Tập trung giải quyết nhu cầu hỏi đáp, tóm tắt trên tài liệu cá nhân và đối chiếu nguồn gốc bằng trích dẫn.

## Slide 6 — Tìm bài toán AI ở đâu?

- Bắt đầu từ việc quan sát các hoạt động thực tế xung quanh.

## Slide 7 — Tác vụ lặp lại

- Việc diễn ra thường xuyên; công đoạn nào cần chuẩn hóa để hướng tới tự động hóa?

## Slide 8 — Điểm đau người dùng

Ai đang gặp khó khăn, phàn nàn hoặc bị tắc nghẽn liên tục?

## Slide 9 — Sai lầm thường gặp - Anti-patterns

- Dấu hiệu cảnh báo bài toán chưa được định hình rõ hoặc giải pháp AI được lựa chọn quá sớm.
- Ưu tiên giải pháp (Solution-first)
- Bỏ qua đánh giá (No evaluation)
- Không lượng hóa tổn thất hiện tại
- Không rõ phạm vi tự chủ của AI.

Nếu phát hiện mắc các sai lầm trên, hãy quay lại làm rõ [[problem-statement]] trước khi chọn công nghệ.

## Slide 10 — Quick Problem Card

- Khung định hình bài toán.

| Bài toán (1 câu)              | Vấn đề cụ thể cần giải quyết (không bao gồm giải pháp).                    |
|---------------------------|----------------------------------------------------------------------------|
| Đối tượng ảnh hưởng         | Cá nhân hoặc bộ phận chịu tác động trực tiếp từ vấn đề.                    |
| Quy trình hiện tại          | Các bước vận hành thủ công hoặc tự động hiện tại (gồm 3–7 bước).          |
| Nút thắt & Tác động        | Khâu gây chậm trễ, sai sót hoặc lặp lại; hệ quả hay tổn thất cụ thể.       |
| Chỉ số đo thành công       | Chỉ số định lượng cụ thể dùng để chứng minh hiệu quả cải tiến.             |
| Định hướng giải pháp        | No AI / Rule / Workflow / Agent / Chưa xác định.                         |

## Slide 11 — Câu hỏi khai thác bài toán

- Bộ câu hỏi định hình vấn đề dành cho các bên liên quan hoặc chính mình.

01. Quy trình hiện tại như thế nào?  
03. Hao phí hiện tại là bao nhiêu?  
05. Hậu quả khi xảy ra sai sót?  
02. Nút thắt nằm ở đâu?  
04. Tiêu chí thành công đo bằng gì?  
06. Có giải pháp phi AI đơn giản hơn?

## Slide 12 — Định lượng hóa bài toán

- Điểm đau chưa được định lượng thì không thể xác định giá trị thực tế của AI.

01 · [[baseline]]  
02 · TARGET Mục tiêu / where to go  
03 · MEASUREMENT Đo lường / how we know  

- Chỉ số nào chứng minh tính hiệu quả? Cách thu thập?

## Slide 13 — Ba bước quyết định AI theo PAIR

- Google People + AI Guidebook · Chương 1: Nhu cầu người dùng + Định nghĩa thành công.

BƯỚC ① Giao điểm: nhu cầu × thế mạnh AI

Bài toán của bạn có nằm trong nhóm việc AI làm tốt hơn hẳn rule/heuristic không?

BƯỚC ② Automate hay Augment? AI thay thế hay hỗ trợ con người?

BƯỚC ③ Reward function & tiêu chí thành công

## Slide 14 — Khi nào AI có lợi thế?

- Tám trường hợp PAIR gọi là "AI probably better".

## Slide 15 — Khi nào AI KHÔNG tốt hơn?

- Sáu trường hợp PAIR gọi là "AI probably NOT better".

## Slide 16 — Hệ thống AI = Model + Context + Planning + Tools

- Một giải pháp AI thực tế là một hệ thống nhiều thành phần, không chỉ dừng lại ở mô hình ngôn ngữ.

## Slide 17 — Automation vs Augmentation

- Bước ② của PAIR: với từng tác vụ, AI nên làm thay hay hỗ trợ con người?

## Slide 18 — Ba mức giải pháp: Rule / Workflow / Agent

- Rule/Workflow/Agent là cấp độ kỹ thuật.

## Slide 19 — Cây quyết định: Lựa chọn cấp độ giải pháp

- Từ [[problem-statement]] đến lựa chọn Rule, Workflow hay Agent.

## Slide 20 — Reward function: hệ thống hiểu "đúng / sai" thế nào?

- PAIR Bước ③: Reward function là công thức quyết định đâu là dự đoán "đúng", đâu là "sai".

## Slide 21 — Precision ↔ Recall: đánh đổi không tránh khỏi

- Đánh đổi giữa độ chính xác và khả năng phát hiện.

## Slide 22 — Viết tiêu chí thành công mà hành động được

- PAIR Bước ③: Metric tốt = chỉ số cụ thể + ngưỡng có nghĩa + hành động cụ thể.

## Slide 23 — Khoảng cách giữa Demo và Production

- Phản hồi chính xác trong vài lần thử chưa đủ cơ sở để triển khai hệ thống thực tế.

## Slide 24 — Từ Problem Statement đến Eval Plan

- [[problem-statement]] rõ ràng giúp định hình cụ thể các tiêu chí kiểm thử.

## Slide 25 — Problem Statement cho hệ thống AI

- 6 yếu tố bài toán cốt lõi và 3 yếu tố quyết định AI.

## Khái niệm chính

- [[problem-statement]]: Tuyên bố rõ ràng mô tả vấn đề cần giải quyết.
- [[baseline]]: Mức độ hiện tại của một vấn đề được sử dụng làm chuẩn để so sánh.
- [[double-diamond]]: Mô hình thiết kế gồm hai giai đoạn - khám phá vấn đề và phát triển giải pháp.
```
