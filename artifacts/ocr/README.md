# OCR artifacts

Thư mục này chỉ được chứa:

- `logs/ocr-events.jsonl`: event metadata đã sanitize.
- `reports/ocr-report-*.md`: báo cáo tổng hợp đã sanitize.
- Artifact demo được sinh từ fixture giả và đã rà soát.

Không lưu CV thật, raw OCR text, ảnh người dùng, API key, token hoặc dữ liệu nhận
dạng cá nhân trong thư mục này. Tệp làm việc tạm thuộc `runtime/ocr/` và bị xóa
ngay sau xử lý hoặc theo TTL.
