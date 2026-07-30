# Canvas CP1 — Nhóm AI42E · Zone D304

**1 · Hướng** — A (VLearn) · tối ưu AI tutor có sẵn

**2 · Job executor** — Học viên **đang trong buổi học**, đang học trên bộ slide của buổi, cần hiểu ngay một chỗ cụ thể hoặc nắm được tổng quan để không mất mạch bài giảng.
*(1.252/1.261 tin nhắn mang context trang · 100% hội thoại `in_class`)*

**3 · Pain — một câu** — Học viên trong buổi học hỏi tutor một câu về học liệu của buổi — về trang đang mở, hoặc xin tổng quan cả bộ slide — và bị trả lời *"không tìm thấy / không thể tổng hợp được nội dung"* kèm yêu cầu tự cung cấp lại nội dung hoặc tự nêu chủ đề, nên cả chỗ chưa hiểu lẫn nhu cầu nắm tổng quan đều bị bỏ ngỏ giữa buổi học.

- **Ai:** học viên đang trong buổi học, đang xem slide
- **Đang làm gì:** hỏi về trang đang mở (gõ tự do, không bôi đen), hoặc xin tóm tắt cả bộ slide để nắm tổng quan / ôn lại
- **Vướng đâu:** hệ thống **không suy nghĩ về phạm vi nào nó có căn cứ** — nội dung trang đang render thì không được truyền vào context, cả bộ thì không tổng hợp được → đem số trang / tên file đi keyword-search rồi từ chối
- **Hậu quả:** **62,5% câu hỏi bị từ chối không bao giờ được trả lời** trong hội thoại đó (100/160); **78/160 = 49% là câu hỏi cuối cùng học viên hỏi trong ngày** — trong 84 ca hội thoại dừng luôn tại lượt bị từ chối, 92,9% không mở hội thoại nào khác trong ngày, tức bỏ hẳn chứ không hỏi lại chỗ khác. Ca có được trả lời thì phải hỏi lại thêm 1 lượt. Phạm vi: **112/369 user = 30%**, và 15/15 lượt được rate đều là 👎, không một lượt 👍

**4 · Bằng chứng đầu** —

**(a) Phạm vi TRANG — lỗi có trigger xác định**, phụ thuộc việc học viên có bôi đen hay không:

| Đường vào | Số lượt | Tutor nói "không tìm thấy" |
|---|---|---|
| **Gõ câu hỏi tự do** (tutor chỉ nhận số trang) | 757 | 160 = **21,1%** |
| **Bôi đen** (text slide được truyền vào prompt) | 495 | 10 = **2,0%** |

**(b) Phạm vi CẢ BỘ — gần như không bao giờ chạy:** 67 lượt xin tóm tắt cả bộ/cả buổi, từ **53 user riêng biệt** (14% của 369 user). Từ chối thẳng 23 = 34%; thêm 22 lượt "trả lời" mà không có citation nào, 8/8 mẫu kiểm tay đều là từ chối nói bằng cách khác → **thất bại thực ≥45/67 ≈ 67%**. VD `T0213` "tóm tắt tất cả slide" → *"hệ thống hiện không thể tự động tổng hợp toàn bộ nội dung của tất cả các slide trong một lần"*.

- **Chênh 10 lần.** Rating cùng chiều: gõ tự do 63% 👎 · bôi đen 26% 👎
- Độ dài đoạn bôi đen **không** liên quan (ngắn 3,1% · vừa 0,6% · dài 1,8%) → biến duy nhất là **có nội dung hay không có nội dung**
- Toàn bộ: **171/1.261 = 13,6%** *(quy tắc đếm + script kiểm lại được; biên dưới — xem [impact-table.md](impact-table.md))*
- **15/15 lượt loại này có rating đều là 👎, không một lượt 👍** (nhóm trả lời có trích dẫn đúng trang: 14% 👎)
- `T1258` — học viên ở trang 33 hỏi "tóm tắt slide này" → *"chưa tìm thấy nội dung cụ thể của Trang 33. Kết quả tìm kiếm chỉ hiển thị các trang khác có nhắc đến con số "33" (như mức điểm 33%... trên trang 60 và 72)."*
- Nguồn cơ chế: UI panel tutor hiện nhãn `NGỮ CẢNH: SLIDE TRANG 37` **kèm nguyên văn nội dung slide** khi có bôi đen (ảnh giao diện VLearn, 30/07/2026)

## 5 · LÁT CẮT — MỘT CÂU

> **Học viên trong buổi học hỏi một câu về học liệu của buổi → AI quyết định nó có căn cứ ở phạm vi nào (trang đang mở / cả bộ slide) và có đủ để trả lời hay không → trả về câu trả lời kèm trích dẫn đúng phạm vi đó, hoặc nói rõ thiếu gì và chỉ sang chỗ có, không đòi học viên tự cung cấp nội dung.**

`1 user` học viên trong buổi học · `1 việc` lấy câu trả lời có căn cứ về học liệu buổi học · `1 quyết định AI` **có căn cứ ở phạm vi nào, và đủ chưa** · `1 kết quả` câu trả lời có trích dẫn **hoặc** đường lui rõ ràng

*Một quyết định phủ cả hai phạm vi, vì cả hai đang hỏng vì cùng một lý do: hệ thống không hề suy nghĩ về việc nó có căn cứ tới đâu. Đường bôi đen (2,0%) là đối chứng — cùng một lõi chạy tốt khi có nội dung.*

## 6 · Automation + willing users dự kiến

**Automation — Conditional.** Sai mà nghe như có căn cứ → học viên học sai kiến thức ngay trong buổi, mang vào quiz (đắt, phát hiện muộn). Thận trọng quá → mất một lượt hỏi (rẻ, tự thấy ngay). Nên: đủ căn cứ thì tự trả lời kèm trích dẫn, không đủ thì **không đoán**.

**Willing users dự kiến (≥3) — đều là học viên khoá, ngoài nhóm:**

| Tên | Vai | Đã hỏi chưa |
|---|---|---|
| Tống Nguyễn Minh Khang | học viên khoá | chưa |
| Hoàng Văn Linh | học viên khoá | chưa |
| Nguyễn Mạnh Hùng | học viên khoá | chưa |

*CP1 chỉ cần **dự kiến** — chưa cần ai đồng ý. Nhưng chọn người thật mời được: R6 yêu cầu **≥2 trong số tên khai ở đây** phải có mặt trong feedback log ở CP5.*

## 7 · Phân công

| Mã HV | Tên | Phần phụ trách |
|---|---|---|
| `2A202601256` | Nguyễn Hùng Mạnh *(leader)* | spec.md · prompt ở quyết định trung tâm |
| `2A202601102` | Nguyễn Văn Trọng | evidence · golden set từ chatlog thật |
| `2A202601194` | Nguyễn Tuấn Hùng | chạy đo golden set · vòng validation CP5 |
| `2A202601568` | Trần Trọng Thịnh | code flow · demo |

---

Bảng impact đầy đủ + ứng viên đã loại + giới hạn bằng chứng: [impact-table.md](impact-table.md) *(dùng cho spec §2, không cần ở CP1)*
