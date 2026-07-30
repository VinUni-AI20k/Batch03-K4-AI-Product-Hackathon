# Runtime artifacts

Đầu ra có thể kiểm tra lại của chatbot. Không dùng thư mục này cho source code.

- `conversations`: transcript các phiên demo đã chọn.
- `evaluation-runs`: kết quả chạy golden set theo phiên bản.
- `traces`: trace router, retrieval, context budget và tool calls.
- `exports`: file xuất phục vụ demo.

Mặc định dữ liệu runtime trong các thư mục con không commit để tránh lộ nội dung
người dùng. Chỉ đưa bản đã ẩn danh vào Git khi cần làm evidence.
