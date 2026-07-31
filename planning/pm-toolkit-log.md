# PM Toolkit — Nhật ký bài học

Tích lũy bài học qua từng lần dùng skill, để lời khuyên sát thực tế team này thay vì chung chung. Đọc file này trước mỗi lần chạy (Bước 0), ghi thêm sau mỗi lần chạy xong (Bước cuối).

## Hiệu chỉnh ước lượng (calibration)

| Kỳ / Task | Ước lượng | Thực tế | Sai lệch | Nguyên nhân chính |
|---|---|---|---|---|
| (chưa có dữ liệu — cần quay lại cập nhật sau khi dọn dead code theo đề xuất trong tech-feasibility-2026-07-31.md) | | | | |

**Hệ số hiệu chỉnh hiện tại:** chưa đủ dữ liệu (mới chạy lần đầu).

## Quyết định đã đưa & kết quả

| Ngày | Quyết định | Bối cảnh | Kết quả thực tế |
|---|---|---|---|
| 31/07/2026 | Đánh dấu "khả thi có điều kiện" cho việc demo/nộp, thay vì "khả thi" thẳng | Phát hiện `/api/upload-and-index` vẫn âm thầm chạy LightRAG indexing dù không còn được `/api/generate-quiz` dùng tới, cộng thêm dead code (`call_openai()` cũ, `services/langgraph_workflow.py`) | (chưa biết — cần quay lại ghi nhận sau khi team xử lý 3 điều kiện đã nêu) |

## Bài học theo workflow

### Technical Feasibility
- Khi 1 route được refactor (batching thay LangGraph), luôn kiểm tra xem còn route/luồng nào khác (ở đây là `/api/upload-and-index`) vẫn gọi tới phần cũ hay không — dễ sót vì refactor thường chỉ nhìn vào 1 route đang sửa, không rà toàn bộ codebase.

## Thông tin hay bị thiếu khi chạy skill

- Chưa phát sinh — mới chạy 1 lần, người dùng xác nhận không thiếu thông tin gì.

## Nhật ký từng lần chạy

### 31/07/2026 — Technical Feasibility & Risk Assessment
- **Dùng được ngay?** Có (người dùng xác nhận "Dùng được ngay").
- **Skill lẽ ra nên hỏi thêm:** Không — người dùng xác nhận câu hỏi đã đủ.
- **Ghi chú:** Phát hiện chính là chi phí/thời gian API embedding bị lãng phí ở `/api/upload-and-index` (chạy LightRAG dù không còn ai dùng kết quả). Effort dọn dẹp ước lượng ~0.5-1 ngày công, chưa có số liệu thực tế để đối chiếu.
