# Round 2 — prompt v2

Trạng thái: **completed — 22/22 case, prompt v2, model gemini-3.1-flash-lite**.

| Metric | Kết quả | Quality bar cố định |
|---|---:|---:|
| Case pass validator tự động | 100% (22/22) | — |
| Case recap có citation tồn tại | 100% (15/15 eligible) | ≥80% citation chính xác sau human review |
| Bridge không trace được | 0 | 0% |
| User thấy hữu ích | pending validation | ≥70% |

So với Round 1:

- Case pass tăng từ 81,8% lên 100%.
- Ba failure vượt 300 từ đều pass; output dài nhất Round 2 là 213 từ.
- `rare_01` cũng trả đúng `low_overlap`, dù v2 không sửa riêng hành vi overlap.
- Hai round dùng cùng model và mỗi case lưu prompt hash, timestamp, latency, attempt log; artifact cuối không còn API error.

Human review: Eval & Prompt Lead đã chấm bảng riêng; bảng Spec & Design Lead và kết luận bất đồng đang chờ Người 2 hoàn tất. Chỉ số hữu ích vẫn `pending validation` cho đến khi Validation Lead cung cấp feedback thật.
