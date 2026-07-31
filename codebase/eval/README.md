# eval/ — kết quả chạy golden set

Prototype tĩnh không có server nên không tự ghi file vào thư mục này — trình duyệt tải xuống qua `Blob` (vào Downloads mặc định của máy). Sau mỗi lần chạy đủ 20 case ở tab **Eval**:

1. Bấm **⬇ Xuất Markdown cho eval/** → tải `eval-run-<timestamp>.md` (bảng ĐẠT/KHÔNG ĐẠT + lý do từng case, dùng để nộp CP3/CP4).
2. Bấm **⬇ Xuất JSON trace** → tải `trace-<timestamp>.json` (toàn bộ `S.log`, gồm câu trả lời đầy đủ từng lượt — dùng để tra lại chi tiết khi cần).
3. Di chuyển 2 file vừa tải vào đúng thư mục `codebase/eval/` này rồi commit.

Không sửa tay nội dung số liệu trong các file đã xuất — kể cả case KHÔNG ĐẠT (đúng nguyên tắc "mọi lượt đều ghi, không chỉnh sửa" ở README chính).
