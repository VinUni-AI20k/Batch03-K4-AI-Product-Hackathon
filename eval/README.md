# Bộ dữ liệu đánh giá VLearn Tutor

Bộ đánh giá này kiểm tra quyết định trung tâm của prototype: khi học viên hỏi về
một đoạn tài liệu đang chọn, tutor phải trả lời có căn cứ, hỏi lại khi thiếu ngữ
cảnh, hoặc từ chối/chuyển hướng khi câu hỏi nằm ngoài phạm vi.

## Cấu trúc

- `golden_set.jsonl`: 22 case, mỗi dòng là một JSON object độc lập.
- `grading-rubric.md`: quy tắc chấm pass/fail có thể kiểm lại.
- `run-template.csv`: bảng trống để ghi một lượt chạy đầy đủ.
- `validate_dataset.py`: kiểm tra schema và độ phủ theo rubric hackathon.

## Độ phủ

| Nhóm case | Số lượng | Yêu cầu |
|---|---:|---|
| Thường (`normal`) | 10 | 8-10 |
| Bốn lớp rủi ro (`risk`) | 8 | 2 case cho mỗi lớp |
| Hiếm (`rare`) | 4 | 2-4 |
| Tổng | 22 | >=20 |
| Phát triển từ chatlog thật | 17 | >=10 |

Bốn lớp rủi ro:

1. `source_truth`: không dùng trang khác để lấp chỗ phần nguồn bị thiếu.
2. `ambiguity`: hỏi lại một câu cụ thể thay vì tự đoán ngữ cảnh.
3. `scope`: không đoán thông tin thời gian, deadline, link hay hành động ngoài
   quyền của tutor.
4. `domain`: không dạy sai kiến thức cốt lõi của khóa học.

## Quality bar đề xuất

Đạt khi **>=80% case pass (18/22)**, đồng thời:

- 100% case `critical=true` phải pass.
- Không có citation bị bịa hoặc trỏ sai trang.
- Mỗi lớp rủi ro có ít nhất 1/2 case pass.

Quality bar chỉ có hiệu lực chấm điểm khi được nhóm chép vào `spec.md` trước hạn
chốt và giữ nguyên. Không sửa bar sau khi xem kết quả.

## Cách chạy một lượt đánh giá

1. Chạy `python3 eval/validate_dataset.py`.
2. Đưa từng `input` vào cùng một phiên bản prototype/prompt, không sửa prompt
   giữa lượt.
3. Lưu nguyên output vào `eval/runs/<run-id>/outputs.jsonl` hoặc một artifact
   tương đương; không bỏ case fail.
4. Hai người chấm độc lập ít nhất các case `critical=true`, theo
   `grading-rubric.md`.
5. Điền tất cả 22 dòng trong một bản sao của `run-template.csv`, tính tổng pass,
   so với quality bar và ghi nguyên nhân của từng failure.

## Nguồn và bảo mật

Case có `source.type="chatlog"` chỉ giữ đoạn ngắn cần cho việc kiểm thử và mã
`turn_id`/`conversation_id` để truy vết về data pack nội bộ. Không đưa nguyên hội
thoại hoặc thông tin nhận dạng vào bộ đánh giá. Case `synthetic` là dữ liệu giả
tự sinh theo các failure mode của prototype.
