---
course: packs
generated: '2026-07-30T10:13:02+00:00'
lang: vi
lesson: 01-de-bai
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/01-de-bai.md
source_hash: sha256:6bd9cb10832eccf1808bfaff82ca428c9ebb9ea394e05256527fcf4e3301201c
type: lesson-note
---

```markdown
# Ghi chú bài học - AI cho khoá AI Thực Chiến

## Slide 1 — Bối cảnh
Khoá đang vận hành các sản phẩm [[AI]] nội bộ phục vụ khoảng 1.000 học viên. Nhóm bạn là product team: chọn một hướng, tìm pain có bằng chứng, và build prototype **một tính năng**.

## Slide 2 — Chọn 1 trong 3 hướng
### Hướng A — VLearn
Nền tảng học tập thích ứng của khoá; có AI tutor trong trang học (bôi đen đoạn tài liệu + hỏi, tutor trả lời kèm trích dẫn [trang N]). 
- **Tối ưu AI tutor hiện có**: mining chatlog để tìm điểm tutor đang làm chưa tốt, chọn một điểm và cải thiện đến nơi đến chốn.
- **Tính năng AI mới trên VLearn**: kiểm tra hiểu thật cuối buổi, trải nghiệm học online, bản đồ lỗ hổng của lớp cho giảng viên từ signal, chatlog...

### Hướng B — Trợ lý Học viên (Discord)
Trợ lý trả lời câu hỏi học viên trong Discord khoá.
- **Tối ưu**: nhận diện intent thật (chào hỏi / hỏi bài / hỏi logistics) và trả lời đúng cỡ; biết-mình-không-biết + chuyển TA thay vì đoán; trả lời câu hỏi logistics (deadline, link, nộp bài) chỉ từ nguồn chính thức.
- **Tính năng mới**: bản tin cuối ngày cho TA (câu hỏi tồn, chủ đề hỏi nhiều nhất); phát hiện học viên stuck và chủ động hỗ trợ — chủ động đến đâu thì thành phiền?

### Hướng C — Làn mở
Mining data và đề xuất sản phẩm AI khác cho khoá — qua đủ 5 tiêu chí nghiệm thu như mọi hướng.

## Slide 3 — Data cấp cho mọi nhóm
- Chatlog VLearn tutor × học viên đã ẩn danh + 6 transcript bài giảng bản sạch có mã đoạn để trích dẫn + 2 bộ slide bài giảng bản hackathon (xem `data/vlearn-pack/`).
- Với Trợ lý Học viên: không có data pack riêng — nhóm tự tìm kiếm và quan sát trực tiếp trong Discord khoá. Cả lớp là người dùng thật — nhóm có thể khảo sát 20 người ngay trong giờ nghỉ.

## Slide 4 — Lát cắt = MỘT CÂU
> **một người dùng · một công việc · một quyết định AI · một kết quả**

## Slide 5 — Ràng buộc chung
1. Build **prototype** (Sketch / Mock / Working) — phải có **≥1 lời gọi AI chạy thật**.
2. Tự xác định **4 lớp chỗ khó** theo taxonomy — duyệt tại các mốc theo `04-rubric.md`:
   - ① **Nguồn sự thật**: AI bịa được chỗ nào?
   - ② **Mơ hồ / thiếu thông tin**: input không đủ chắc; hỏi lại, đoán có báo, hay từ chối?
   - ③ **Ngoài phạm vi / thẩm quyền**: user đòi thứ không được phép làm, từ chối sao cho vẫn hữu ích?
   - ④ **Đặc thù domain**: sai cái gì thì user mất điểm, mất niềm tin?
3. Chỉ dùng data trong `data/` hoặc data giả tự sinh — không data thật ngoài pack đã rà.

## Slide 6 — 5 tiêu chí nghiệm thu bài toán
| # | Tiêu chí | Đạt khi |
|---|---|---|
| 1 | Pain cụ thể | Ai — đang làm gì — vướng đâu — hậu quả gì. |
| 2 | Bằng chứng | Khảo sát ≥20 người ngoài nhóm, ≥50% xác nhận, log toàn bộ câu hỏi + từng câu trả lời. |
| 3 | Problem statement + impact | Không chữ [[AI]]; bảng impact ≥3 ứng viên + lý do chọn. |
| 4 | Lát cắt prototype được | Một câu theo đúng format, demo được trong 5 phút. |
| 5 | User sẵn sàng thử | ≥3 người thật ngoài nhóm đồng ý thử prototype. |

*Canvas nháp nộp tại CP1; evidence và spec hoàn thiện dần, chốt tại spec.md 23:59 N1.*

## Khái niệm chính
- [[AI]]: Công nghệ cho phép máy tính thực hiện các tác vụ giống như con người.
- [[pain-point]]: Điểm đau, vấn đề mà người dùng gặp phải trong quá trình sử dụng sản phẩm.
- [[prototype]]: Mẫu thử nghiệm của sản phẩm để kiểm tra tính khả thi và hiệu quả.
- [[taxonomy]]: Hệ thống phân loại dùng để phân loại các vấn đề trong quá trình phát triển sản phẩm.
```
