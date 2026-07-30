# Bug Triage: 2026-07-30 — quiz-app (VLearn Quiz AI)

Nguồn: kiểm tra chạy thử project (`codebase/quiz-app`) + UI critique (heuristics Nielsen + audit kỹ thuật).

| Mã | Tiêu đề | Cách tái hiện | Mức nghiêm trọng | Ưu tiên | Người xử lý | US liên quan | Trạng thái |
|---|---|---|---|---|---|---|---|
| BUG-001 | API key OpenAI thật bị lộ trong `.env.example`, đã push lên GitHub public | `git show HEAD:codebase/quiz-app/.env.example` trên repo `dang16062004/K4-AI-Product-Hackathon_Ronaldo-E402` — thấy `OPENAI_API_KEY=sk-proj-...` thật, đã commit 2 lần (dd1b9d2, 3b9af3e) | Nghiêm trọng | P0 | Chưa gán | Hạ tầng/Bảo mật | Mở |
| BUG-002 | Không thể chọn file PDF bằng bàn phím/trình đọc màn hình | Dùng Tab để duyệt trang: không có cách nào focus vào `#dropzone` hoặc `#pdf-input` (input bị `hidden`, dropzone là `<div>` không có `tabindex`/`role`/`keydown` handler) | Cao | P1 | Chưa gán | Upload PDF | Mở |
| BUG-003 | Màu chữ phụ dưới chuẩn tương phản WCAG AA | Đo relative luminance: `--muted2 #A79F8E` trên nền `--bg #F7ECD9` ≈ 2.25:1; `--muted #8B8478` ≈ 3.17:1 — cả hai dưới ngưỡng 4.5:1 cho chữ thường. Ảnh hưởng `.dz-sub`, `footer`, `.section-sub`, `.meta-line` | Trung bình | P1 | Chưa gán | Toàn UI | Mở |
| BUG-004 | Không có nút Hủy khi đang chờ AI sinh quiz | Bấm "Tạo Quiz ngay" → `#loading-panel` chỉ có spinner tĩnh; request backend có thể mất tới vài phút (timeout 90s × tối đa 3 lần retry khi OpenAI trả 429/5xx) mà không có cách hủy/quay lại | Trung bình | P2 | Chưa gán | Sinh quiz | Mở |
| BUG-005 | Demo mẫu hiển thị đầy đủ 3 câu quiz ngay từ đầu, chia sự tập trung với form nhập liệu | Mở trang chủ: `#demo-panel` render sẵn full 3 quiz card cùng lúc với `#form-panel`, kéo dài trang trước khi user kịp upload | Thấp | P2 | Chưa gán | Trang chủ / Onboarding | Mở |
| BUG-006 | Không chặn double-submit nút "Tạo Quiz ngay" | Click nhanh 2 lần liên tiếp khi đã chọn file — `generateBtn` không bị disable ngay tại thời điểm click, có thể gửi 2 request tốn phí OpenAI thật | Thấp | P3 | Chưa gán | Sinh quiz | Mở |
| BUG-007 | Thuật ngữ kỹ thuật ("Temperature", tên model) lộ ra giao diện người dùng cuối | Thẻ chọn chế độ ghi "Temperature thấp"; header hiển thị "Model: gpt-5.6-terra" — giáo viên (persona chính, theo footer) không cần biết thuật ngữ này | Thấp | P3 | Chưa gán | Chọn chế độ sinh quiz | Mở |

## Thang đo tham khảo
- **Nghiêm trọng**: sập hệ thống, mất dữ liệu, chặn hoàn toàn luồng chính
- **Cao**: ảnh hưởng nhiều user hoặc tính năng quan trọng, có workaround
- **Trung bình**: ảnh hưởng 1 phần chức năng
- **Thấp**: lỗi giao diện nhỏ

## Ghi chú ưu tiên theo bối cảnh
- BUG-001 là P0 dù kỹ thuật thuộc nhóm "hạ tầng" chứ không phải bug tính năng — mức độ rủi ro tài chính/bảo mật thực tế bắt buộc xử lý trước mọi việc khác, kể cả trước BUG-002.
- BUG-005 đáng lẽ là lỗi giao diện thường (P3) nhưng vì nằm ngay màn hình đầu tiên user thấy (first impression) nên đẩy lên P2.
