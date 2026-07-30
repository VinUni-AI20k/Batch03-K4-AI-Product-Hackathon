# Evaluation run 1 — KHÔNG HỢP LỆ CHO CP3

- File output: `eval/actual_outputs_run_1.json`
- Trạng thái: **không được dùng làm bằng chứng “AI chạy thật” hoặc % chất lượng**.

## Lý do vô hiệu

1. 18/20 output có tiền tố `[MOCK]`; hai output còn lại cũng được sinh bằng nhánh điều kiện hardcode.
2. Báo cáo cũ ghi model “Gemini 1.5 Flash”, trong khi script cấu hình DeepSeek và output thực tế là mock.
3. Con số 12/20 (60%) không được suy ra từ nội dung trong `actual_outputs_run_1.json`.
4. Golden set cũ trỏ tới các trang 37, 45, 67, 68 dù hai PDF hiện có đều chỉ dài 29 trang.
5. Các case “image” cũ chỉ chứa mô tả text, không có file/pixel ảnh để kiểm tra vision.

File được giữ lại để audit lịch sử, không xoá hoặc sửa thành số đẹp hơn. Golden set thay thế dùng nguồn thật và runner mới nằm tại `eval/golden_set.json` và `eval/run_eval.py`.
