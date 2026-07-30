# AI Thực Chiến: Venture Arena — Nhóm AI42E · Zone D304

**Hướng A — VLearn · tối ưu AI tutor có sẵn**

> **Lát cắt:** Học viên trong buổi học hỏi một câu về học liệu của buổi → AI quyết định nó có căn cứ ở phạm vi nào (trang đang mở / cả bộ slide) và có đủ để trả lời hay không → trả về câu trả lời kèm trích dẫn đúng phạm vi đó, hoặc nói rõ thiếu gì và chỉ sang chỗ có, không đòi học viên tự cung cấp nội dung.

Chi tiết bài toán, bằng chứng và bảng impact: **[cp1/canvas.md](cp1/canvas.md)** · **[cp1/impact-table.md](cp1/impact-table.md)**

## Thành viên & phân công

Leader: **Nguyễn Hùng Mạnh** — `2A202601256`

| Mã HV | Tên | Phần phụ trách |
|---|---|---|
| `2A202601256` | Nguyễn Hùng Mạnh | `spec.md` · prompt ở quyết định trung tâm |
| `2A202601102` | Nguyễn Văn Trọng | evidence · golden set từ chatlog thật |
| `2A202601194` | Nguyễn Tuấn Hùng | chạy đo golden set · vòng validation CP5 |
| `2A202601568` | Trần Trọng Thịnh | code flow · demo |

**Vibe-coding rule:** mỗi người phải giải thích được phần có tên mình — bị hỏi ngẫu nhiên tại CP5.

## Bằng chứng — chạy lại được

```bash
python cp1/scripts/verify.py
```

Một lệnh in ra mọi con số được trích trong canvas và bảng impact. Chỉ dùng thư viện chuẩn của Python 3.7+, không cần cài gì. Map từng con số về chỗ nó được trích: [cp1/scripts/README.md](cp1/scripts/README.md).

Số chính, mining **1.261 lượt hỏi-đáp thật** (369 user, 585 hội thoại, 22–29/07/2026):

- Đường **gõ câu hỏi tự do** hỏng **21,1%** (160/757) so với **2,0%** (10/495) khi có **bôi đen** — chênh 10 lần, và độ dài đoạn bôi đen không phải biến giải thích
- **62,5%** câu hỏi bị từ chối không bao giờ được trả lời · **49%** là câu hỏi cuối cùng học viên hỏi trong ngày
- Nhóm lỗi này **15/15 lượt được rate đều là 👎**, không một lượt 👍
- Đã loại trừ giả thuyết "do slide là ảnh" từ hai phía: 55% ca thất bại nằm trên trang đã chứng minh có text, và cả 58 trang slide trong pack đều extract được text

Giới hạn bằng chứng ghi nhận trung thực — gồm cả 2 giả thuyết đã kiểm và **không** đứng vững: [cp1/impact-table.md](cp1/impact-table.md) mục "Giới hạn bằng chứng".

## Tiến độ theo checkpoint

| Đường dẫn | Nội dung | Trạng thái |
|---|---|---|
| `cp1/` | Canvas CP1 · bảng impact · kịch bản khảo sát · script đếm | ✅ CP1 |
| `codebase/` | Prototype — ghi rõ phần nào mock | ⬜ CP2 |
| `eval/` | Golden set ≥20 case + bảng kết quả các lượt chạy | ⬜ CP3 |
| `spec.md` | AI Spec theo `03-template-ai-spec.md` | ⬜ **hạn cứng 23:59 N1** |
| `validation/` | Feedback log ≥5 mẩu từ ≥5 người ngoài nhóm | ⬜ CP5 |
| `demo-slides.pdf` | Slide 6 trang theo `02-guide.md` §5.1 | ⬜ CP6 |
| `reflection/` | Mỗi người 1 file | ⬜ CP6 |

Lịch 6 mốc (khoá 4) và checklist TA xác minh từng mốc: [04-rubric.md](04-rubric.md) Phần 3.

Tài liệu ban tổ chức giữ nguyên trong repo: [01-de-bai.md](01-de-bai.md) · [02-guide.md](02-guide.md) · [03-template-ai-spec.md](03-template-ai-spec.md) · [04-rubric.md](04-rubric.md)

## Bảo mật dữ liệu được cung cấp

Dữ liệu trong `data/` là dữ liệu thật của khoá học (đã ẩn danh), cấp riêng cho hackathon này. Khi nhận data, nhóm cam kết:

1. **Chỉ dùng trong phạm vi hackathon** — tìm bằng chứng, xây golden set, build prototype. Không dùng cho mục đích khác.
2. **Không chia sẻ ra ngoài khoá học** — không đăng mạng xã hội, không gửi người ngoài, không đưa vào dataset hay repo công khai nào.
3. **Không commit data pack vào repo nộp bài** — chỉ trích dẫn ngắn để minh hoạ; golden set ghi mã đoạn/mã hội thoại thay vì dán nguyên văn dài.
4. **Cẩn trọng khi đưa data vào công cụ ngoài** — chỉ phần tối thiểu cần thiết; free tier có thể dùng dữ liệu để huấn luyện (xem [02-guide.md](02-guide.md) §3.4).
5. **Không cố suy ngược danh tính** từ dữ liệu đã ẩn danh (`[học viên]`, mã `U`/`C`/`T`/`M`).
6. Sau sự kiện, **xoá các bản sao data pack** khỏi máy cá nhân và các công cụ đã upload nếu ban tổ chức yêu cầu.

Không commit API key. Key chỉ đọc trong server route qua `process.env` — không đặt tên `NEXT_PUBLIC_*` cho key vì biến đó đi vào bundle JS công khai.
