# Working Agreement: Team VLearn Quiz AI (K4-AI-Product-Hackathon)

**Ngày lập:** 31/07/2026
**Cập nhật lần cuối:** 31/07/2026

> Ghi chú: đây là bản đề xuất dựa trên các sự cố THỰC TẾ đã xảy ra trong dự án (liệt kê ở mỗi mục). Các ô đánh dấu **(đề xuất)** là gợi ý dựa trên best practice — team cần họp 10-15 phút để chốt chính thức, không tự động có hiệu lực chỉ vì nằm trong file này.

## 1. Giờ làm việc

| Mục | Quy định |
|---|---|
| Giờ core (bắt buộc online) | Không cố định — đây là dự án hackathon, làm khi rảnh, không ép khung giờ cứng. |
| Báo nghỉ / không kịp task | **(đề xuất)** Báo trước ít nhất 4 giờ trên kênh Messenger chung nếu biết trước sẽ không kịp deadline — không đợi đến sát giờ chốt mới báo. |

## 2. Giao việc & nhận việc

| Mục | Quy định |
|---|---|
| Ai là người phân việc chính | **Chưa xác định** — cần team chốt (hiện tại có vẻ mỗi người tự nhận việc/tự sửa code mình thấy cần, dẫn đến chỉnh sửa chồng lấn — xem mục 5). |
| Thời hạn xác nhận đã nhận việc | **Chưa xác định** — cần team chốt. |
| Khi sắp trễ deadline | **(đề xuất)** Báo trước ít nhất 4 giờ cho cả nhóm qua Messenger, nêu rõ đang vướng ở đâu (không chỉ báo "sắp trễ" chung chung). |

## 3. Kênh liên lạc

| Kênh | Mục đích | Thời gian phản hồi kỳ vọng |
|---|---|---|
| Messenger | Trao đổi nhanh, thông báo tiến độ/blocker | **(đề xuất)** Trong ngày (không cần tức thì vì giờ làm không cố định) |
| GitHub (Issues/PR comment) | Thảo luận kỹ thuật gắn với 1 đoạn code cụ thể, review | **(đề xuất)** Trước khi merge PR liên quan |

## 4. Quy ước Git / Code review

Mục này dựa trên các sự cố **đã xảy ra thật** trong dự án, không phải lý thuyết suông:

| Mục | Quy định | Vì sao (bằng chứng thực tế) |
|---|---|---|
| Nhánh chính (`main`) | **(đề xuất)** Không push thẳng lên `main` — tạo nhánh riêng, merge qua Pull Request. | Nhiều lần các file (`app.py`, `.env.example`, `services/model_factory.py`) bị nhiều người sửa đè lên nhau cùng lúc qua GitHub Desktop, gây lỗi "file đã bị sửa từ lúc đọc" liên tục khi debug. |
| Đặt tên nhánh | **(đề xuất)** `feature/<tên-tính-năng>` (vd `feature/litellm-multi-provider`), `fix/<tên-bug>` (vd `fix/405-generate-quiz`). | Chưa có quy ước — nếu tiếp tục làm trực tiếp trên `main` thì không áp dụng được. |
| PR review | **(đề xuất)** Tối thiểu 1 thành viên khác đọc qua trước khi merge, đặc biệt PR đổi kiến trúc (thêm thư viện mới, đổi provider AI). | LightRAG + LangGraph đã được thêm thẳng vào `app.py` mà không có bước trao đổi trước — dẫn đến việc phải đánh giá lại xem có over-engineering hay không **sau khi** code đã có sẵn, thay vì trước. |
| **Thay đổi kiến trúc lớn** (thêm thư viện mới, đổi provider AI, đổi luồng xử lý chính) | **(đề xuất)** Bắt buộc nhắn trên Messenger trước khi bắt tay code, chờ ít nhất 1 người khác phản hồi. | Cùng bằng chứng như trên — tránh lặp lại việc 1 người tự ý thêm nguyên 1 tầng kiến trúc (RAG + graph workflow) cho use case vốn chỉ xử lý 1 PDF/lần. |
| **Bí mật (API key, secrets)** | `.env` **không bao giờ** commit (đã có trong `.gitignore`). `.env.example` **chỉ chứa placeholder**, không bao giờ là key thật. Không dán API key thật vào Messenger/chat AI. | Đã xảy ra **2 lần**: key OpenAI thật bị commit vào `.env.example` và push lên GitHub public (2 commit khác nhau), và nhiều lần key thật bị dán trực tiếp vào hội thoại với AI — cả hai đều phải coi là "khoá đã lộ, nên rotate". |
| Commit message | **(đề xuất)** Ngắn gọn, nêu rõ thay đổi gì + tại sao (vd `fix: sửa lỗi 405 khi GET /api/generate-quiz`), không commit chung chung kiểu "update code". | Chưa quan sát được vi phạm cụ thể, nhưng thêm để nhất quán với các mục trên. |

## 5. Escalation (leo thang khi bất đồng)

Khi 2 thành viên bất đồng về kỹ thuật (vd kiến trúc, chọn thư viện, provider AI) mà tự thảo luận không ra được quyết định chung trong hợp lý thời gian: **đẩy lên giảng viên/mentor hướng dẫn** để chốt, thay vì để tồn đọng hoặc mỗi người tự làm theo ý mình (rủi ro thực tế: code app.py hiện có nhiều đoạn "chưa dùng" do các hướng đi khác nhau chưa được thống nhất dứt điểm — ví dụ hàm `call_openai()` cũ vẫn còn trong file dù route đã đổi sang batching, và luồng LangGraph/LightRAG vẫn còn trong `services/` dù route `/api/generate-quiz` đã bỏ không gọi tới nữa).

---
*Tài liệu này là điểm khởi đầu, không phải luật cố định — team nên chỉnh sửa trực tiếp file này khi thống nhất được thêm chi tiết, và coi các mục "chưa xác định" là việc cần làm trong buổi họp gần nhất.*
