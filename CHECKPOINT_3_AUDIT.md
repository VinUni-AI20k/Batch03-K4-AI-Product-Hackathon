# Audit tiến độ so với Checkpoint 3

Ngày audit: 2026-07-30

## Kết luận

**Trước audit: chưa đạt CP3. Hiện tại: đạt các artifact kỹ thuật và quality bar máy của CP3; text, summary và vision đều chạy AI thật. Run 12 đạt 19/20 (95%) theo khái niệm, exact-label 18/20 (90%).** Chưa thể tuyên bố hoàn tất CP3 ở cấp nhóm cho đến khi hai thành viên chấm độc lập, manual QA thao tác thật và xác nhận việc nộp/show với TA.

| Tiêu chí CP3 | Trước audit | Hiện tại | Bằng chứng |
|---|---|---|---|
| ≥1 lời gọi AI thật tại quyết định trung tâm | Không chứng minh được; output Run 1 là mock | Có cho text/summary và crop ảnh | `eval/agent_traces_run_12_final.jsonl` có DeepSeek/Gemma model, request ID, latency, token usage |
| Golden set ≥20, đủ case khó | Có 20 nhưng sai nguồn/trang và không có pixel ảnh | Có 20: 8 thường + 8 khó + 4 hiếm; 15 case có nguồn/adaptation chatlog | `eval/golden_set.json`, `eval/fixtures/` |
| Bảng chạy đủ mọi case và có % | Báo cáo 12/20 không khớp output mock | Run 12 đủ 20 case/20 trace, pre-score 19/20 = 95% | `eval/actual_outputs_run_12_final.json`, `eval/evaluation_run_12_final.md` |

## Những tuyên bố cũ bị bác bỏ

- Run 1 không phải Gemini thật: 18/20 output có `[MOCK]`, 2 output còn lại hardcode.
- Hai PDF chỉ có 29 trang/file, không phải 54/76; citation trang 37/45/67 trong golden cũ không kiểm được bằng PDF hiện có.
- Case “ảnh” cũ chỉ có mô tả text, không có pixel ảnh.
- App cũ dừng JavaScript ngay khi mở do HTML thiếu các phần tử mà `app.js` truy cập.
- API key từng bị hardcode trong `index.html`; đã gỡ khỏi working tree nhưng vẫn tồn tại trong lịch sử Git.
- Evidence 134/86/88 và 68 trong spec cũ không tái lập. Phép đếm công bố hiện cho 144 summary và 14 yêu cầu vùng ảnh rõ ràng.

## Phần agent đã làm được

- Gỡ API key khỏi frontend; chuyển toàn bộ credential sang biến môi trường server.
- Nối backend AI cùng origin; không silent fallback về mock.
- Dùng PDF thật, số trang thật, trích evidence thật và kiểm citation theo trang hợp lệ.
- Gửi đoạn bôi đen nguyên văn; crop pixel thật từ canvas cho luồng chụp vùng.
- Thêm nút tóm tắt toàn bộ tài liệu theo nhu cầu.
- Ghi trace JSONL có model/request ID/token usage.
- Xây lại golden set 20 case và 4 fixture ảnh thật.
- Chạy Run 2 bằng AI thật: 16/20 (80%); 4 case vision fail đúng vì chưa có vision credential.
- Nối OpenRouter vision bằng `google/gemma-4-31b-it`; 4 request ảnh trong Run 12 đều có model/request ID và citation đã chuẩn hoá.
- Bổ sung retry JSON/body rỗng, giới hạn summary theo yêu cầu, focused retrieval và điểm semantic tách riêng exact-label.
- Chạy regression Run 12 trên đúng mã cuối: 19/20 (95%), 20/20 trace, không API error và không câu `answered` nào thiếu citation đã xác minh.
- Viết script audit evidence tái lập và sửa spec/README theo trạng thái thật.
- Kiểm thử browser: PDF 29 trang, summary end-to-end thành công, crop 200×120 được đính kèm và failure vision hiển thị đúng.

## Phần cần con người tương tác trực tiếp

1. **Thu hồi key đã lộ ngay:** revoke DeepSeek key cũ trên trang quản trị nhà cung cấp, tạo key mới và chỉ đặt trong `.env`. Xem key là đã lộ vì nó còn trong Git history.
2. **Chấm độc lập:** hai thành viên chấm cùng ít nhất 5 case khó theo 3 chiều trong spec; ghi tên, kết quả lệch và quyết định cuối vào report Run 12. Không dùng 95% làm % cuối trước bước này.
3. **Manual QA:** trực tiếp bôi đen text trên PDF, hỏi AI; chụp một sơ đồ thật và hỏi; kiểm citation nhảy đúng trang. Browser automation đã test summary/crop nhưng không mô phỏng được native text selection đáng tin cậy.
4. **Nộp/show với TA:** từng thành viên nộp link đúng checkpoint và một người bất kỳ phải giải thích được backend, golden set, trace. Agent không thể thay thao tác nộp hoặc phần vấn đáp.
5. **Phối hợp dọn Git history (sau khi revoke):** nếu repo đã push, thống nhất với cả nhóm trước khi rewrite history/force-push. Revoke key vẫn là bước bắt buộc kể cả đã rewrite.
