# Technical Feasibility Assessment: Tình trạng kỹ thuật hiện tại của quiz-app (trước khi demo/nộp hackathon)

**Ngày:** 31/07/2026
**Người đánh giá:** Claude (AI hỗ trợ kỹ thuật, đã trực tiếp sửa code cùng team phiên này)
**Người yêu cầu:** đăng

## 1. Yêu cầu (hiểu ở mức nghiệp vụ)

Không phải 1 tính năng mới, mà là đánh giá tổng thể: dự án quiz-app hiện tại (sau khi đã thêm chuẩn hoá đa-provider qua LiteLLM, sinh quiz song song theo lô + log token/thời gian, tính năng bôi đen → hỏi AI) có đủ ổn định để demo/nộp hackathon không, và có rủi ro kỹ thuật nào cần biết **trước khi cam kết** đã xong/sẵn sàng nộp.

## 2. Khả thi kỹ thuật

| Hạng mục | Đánh giá |
|---|---|
| Làm được trong kiến trúc hiện tại? | Có — toàn bộ tính năng mới (LiteLLM, batching, bôi đen hỏi AI) chạy trên kiến trúc Flask đơn giản sẵn có, không cần đổi kiến trúc tổng thể. |
| Công nghệ/thư viện mới cần dùng | `litellm` (đã thêm vào `requirements.txt`, đã test import + gọi thành công), `json_repair` (đã có sẵn từ trước). Không cần ai học công nghệ mới đáng kể. |
| Phụ thuộc hệ thống/API bên thứ ba | OpenAI / DeepSeek / Anthropic / Gemini (tuỳ `.env`, qua LiteLLM) — đáng tin, tài liệu đầy đủ. Riêng **SiliconFlow** (dùng cho embedding LightRAG) hiện đang bị gọi **không cần thiết** — xem mục 3. |

## 3. Độ phức tạp & rủi ro kỹ thuật

| Loại rủi ro | Mức độ | Ghi chú |
|---|---|---|
| Technical debt nếu làm nhanh/ẩu | **Cao** | 3 điểm nợ kỹ thuật cụ thể đang tồn tại: (1) `/api/upload-and-index` **luôn luôn** chạy LightRAG indexing (embedding qua SiliconFlow) ngay khi upload PDF, bất kể checkbox "Bật LightRAG" có tick hay không — nhưng route `/api/generate-quiz` đã **không còn gọi LangGraph/RAG ở bất kỳ đâu** sau khi đổi sang batching, nghĩa là toàn bộ công sức + API cost + thời gian indexing đó hiện **không phục vụ gì cả**. (2) Hàm `call_openai()` cũ trong `app.py` không còn được route nào gọi tới (route chính đã chuyển sang `generate_batch()`), nhưng vẫn còn nguyên trong file. (3) `services/langgraph_workflow.py` không còn được import ở bất kỳ đâu trong luồng chính (`app.py` không còn dòng `from services.langgraph_workflow import ...`), chỉ còn tồn tại như file mồ côi. |
| Bảo mật (dữ liệu người dùng, thanh toán...) | **Trung bình** (rủi ro treo từ quá khứ, không phải rủi ro mới) | Đã ghi nhận 2 lần API key thật bị lộ: commit vào `.env.example` (2 commit khác nhau, đã push GitHub public) + nhiều lần dán trực tiếp key thật vào hội thoại chat. Nếu các key đó **chưa được rotate**, đây vẫn là rủi ro đang mở, không phải chuyện đã qua. |
| Hiệu năng khi tăng tải | **Trung bình** | Các biến trạng thái tài liệu (`LAST_UPLOADED_PAGES`, `ACTIVE_DOC_ID`...) là biến toàn cục cấp module, không tách theo user/session. Với demo 1 máy/1 người dùng tại 1 thời điểm thì không sao, nhưng nếu 2 người dùng cùng lúc trên cùng 1 tiến trình Flask (vd nhiều giám khảo test song song), dữ liệu tài liệu của người này có thể lộ sang người kia. |
| Khả năng mở rộng về sau | **Thấp** (với mục tiêu demo hackathon) | Không cần giải quyết ngay cho demo, nhưng nếu dự án đi tiếp sau hackathon (nhiều người dùng thật) thì mục "Hiệu năng khi tăng tải" ở trên cần xử lý trước (tách state theo session, dùng cơ chế lưu trữ ngoài process thay vì biến toàn cục). |

## 4. Độ tin cậy của ước lượng

- [x] Ước lượng sơ bộ (rough order of magnitude, sai số có thể ±50%)
- [ ] Đã đủ thông tin để ước lượng chi tiết

**Effort sơ bộ:** ~0.5-1 ngày công cho 1 dev đã quen code hiện tại (chỉ là xoá/tắt code không dùng + thêm 1 điều kiện guard, không phải viết tính năng mới) — cụ thể: tắt bước LightRAG indexing ở `/api/upload-and-index` khi không cần (hoặc chỉ chạy khi `use_rag=true`), dọn `call_openai()` cũ, quyết định giữ hay xoá hẳn `services/langgraph_workflow.py`.

## 5. Kết luận gửi BA/PM (ngôn ngữ non-technical)

- [ ] Khả thi
- [ ] Không khả thi
- [x] **Khả thi có điều kiện** — điều kiện:
  1. Tắt bước lập chỉ mục LightRAG tự động khi upload PDF (hiện tốn thời gian + gọi API embedding thật mỗi lần upload mà không phục vụ gì cho việc sinh quiz nữa).
  2. Dọn code không còn dùng (`call_openai()` cũ, file `services/langgraph_workflow.py`) trước khi nộp/demo, để tránh giám khảo/mentor đọc code thấy 2 luồng xử lý mâu thuẫn nhau.
  3. Xác nhận các API key từng bị lộ (2 lần trong git, nhiều lần trong chat) đã được rotate — nếu chưa, đây là việc cần làm ngay, không nên để đến sau khi nộp bài.

**Rủi ro chính cần biết trước khi cam kết đã "xong":** mỗi lần upload PDF hiện vẫn âm thầm tốn 1 lượt gọi API embedding (LightRAG/SiliconFlow) dù kết quả không được dùng ở bất kỳ đâu trong luồng sinh quiz hiện tại — nên xử lý trước khi demo để tránh vừa tốn thời gian chờ vừa tốn chi phí API vô ích, và để code phản ánh đúng những gì sản phẩm thực sự đang làm.
