# Round 1 — baseline v1

Trạng thái: **completed — 22/22 case, prompt v1, model gemini-3.1-flash-lite**.

| Metric | Kết quả | Quality bar cố định |
|---|---:|---:|
| Case pass validator tự động | 81,8% (18/22) | — |
| Case recap có citation tồn tại | 73,3% (11/15 eligible) | ≥80% citation chính xác sau human review |
| Bridge không trace được | 0 | 0% |
| User thấy hữu ích | pending validation | ≥70% |

Failure ưu tiên sửa ở v2: **output vượt 300 từ**, xuất hiện ở 3/4 case fail (`normal_06`, `normal_09`, `hard_truth_01`). Failure còn lại là `rare_01` tạo bridge khi expectation là `low_overlap`; không sửa trong v2 để giữ đúng nguyên tắc chỉ thay một failure.
