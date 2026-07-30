# Eval Rubric

## Decision Accuracy

Pass khi `decision` của hệ thống trùng với `expected_decision` trong golden set:

- `answer`: có đủ căn cứ để trả lời và có citation.
- `clarify`: query mơ hồ, cần hỏi lại một câu.
- `abstain`: không có nguồn đủ căn cứ hoặc ngoài whitelist.

## Retrieval Hit@3

Pass khi ít nhất một `expected_source_ids` nằm trong top 3 retrieved sources.

## Citation Precision

Chỉ tính với case `answer`.

Pass khi citation được hiển thị thật sự chứa thông tin đúng để hỗ trợ câu trả lời.

## Groundedness

Pass khi mọi thông tin quan trọng trong answer có thể trace về citation. Fail nếu AI thêm deadline, quy định, lời khuyên hoặc nội dung không có trong nguồn.

## Task Completion Proxy

Pass khi:

- Case answer: user có thể mở đúng nguồn từ citation.
- Case clarify: câu hỏi clarify thu hẹp đúng điểm mơ hồ.
- Case abstain: hệ thống không generate sai và hiện nguồn gần nhất nếu có.
