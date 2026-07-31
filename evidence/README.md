# Chỉ mục bằng chứng dành cho người chấm

## CP4 — Evidence & impact

### A — Khảo sát người thật

- Kết quả mạnh nhất: **26/45 người (57,8%)** phải đi lại nhiều lần do hồ sơ thiếu/sai.
- Bằng chứng hỗ trợ: **25/45 (55,6%)** thấy quy trình/giấy tờ rườm rà, chồng chéo; **24/45 (53,3%)** khó tìm tên thủ tục.
- Mở [`cp4-survey/README.md`](cp4-survey/README.md) để xem câu hỏi, cách đếm, 45 phản hồi đã khử định danh, biểu đồ, hash ZIP nguồn và script tái lập.

### B — Phân tích log

- Nguồn: 10 tin nhắn trong log nhóm tự dùng thử ngày 30/07/2026, lọc từ `eval/cases.json` bằng nhãn nguồn cố định.
- Kết quả: **8/10 (80%)** câu dùng ngôn ngữ đời thường, viết tắt/lỗi gõ hoặc nhiều dữ kiện; **5/10 (50%)** cần chọn form và ánh xạ field.
- Mở [`cp4-log-mining/README.md`](cp4-log-mining/README.md) để xem quy tắc đếm, 8 ví dụ nguyên văn đã khử định danh, log JSONL, hash nguồn và script tái lập.

## Các file liên quan

- [`../spec.md`](../spec.md): §1–§2 mô tả evidence và quyết định chọn; §5–§7 mô tả tình huống khó và kiểm thử.
- [`../eval/cp4-form-answers.md`](../eval/cp4-form-answers.md): nội dung ngắn gọn dùng để điền form CP4.
- [`../eval/README.md`](../eval/README.md): golden set và lịch sử chạy thử CP3.

## Quyền riêng tư

Không lưu họ tên, email hoặc timestamp chính xác của người khảo sát. Bản dữ liệu dùng chấm chỉ có mã `R001`–`R045`; các ví dụ log đã thay tên và CCCD bằng marker khử định danh.
