# UI Critique — quiz-app, 31/07/2026

**Target:** Trang chủ `templates/index.html` + `static/app.js` + `static/style.css`. Trọng tâm: (1) xác nhận lại 7 bug trong `bug-triage-2026-07-30.md` đã sửa đúng chưa, (2) audit riêng tính năng mới "bôi đen → hỏi AI" (`#ask-ai-btn`, `#ask-ai-bubble`) — chưa từng được review.

**Method note:** Đánh giá dựa trên đọc source code trực tiếp, KHÔNG có browser tool kết nối tới server đang chạy trên máy bạn — đây không phải bằng chứng hình ảnh trực tiếp, chỉ là suy luận từ code. Các số liệu contrast dưới đây được tính bằng công thức WCAG relative luminance thật (không đoán).

## 0. Xác nhận lại 7 bug cũ

| Mã | Trạng thái thực tế | Bằng chứng |
|---|---|---|
| BUG-001 (lộ key) | Đã sửa trong `.env.example` hiện tại (chỉ còn placeholder) | Đọc `.env.example`: `OPENAI_API_KEY=dan_api_key_openai_vao_day_KHONG_dan_vao_file_nay` |
| BUG-002 (bàn phím dropzone) | Đã sửa | `#dropzone` có `tabindex="0" role="button" aria-label="..."` + `keydown` handler trong `app.js` |
| BUG-003 (contrast) | Đã sửa, có dư | `--muted2 #5F594C` trên `--bg #F7ECD9` = **5.95:1**; `--muted #6B6458` trên `--card-alt #FBF3E4` = **5.30:1** — cả hai đều vượt ngưỡng AA 4.5:1 |
| BUG-004 (nút Hủy) | Đã sửa | `#cancel-btn` + `AbortController` wired đúng trong `app.js` |
| BUG-005 (demo chiếm màn hình) | Đã sửa | `#demo-content` mặc định `class="hidden"`, có toggle |
| BUG-006 (double-submit) | Đã sửa | `generateBtn.disabled = true` set ngay đầu handler + guard ở điều kiện đầu hàm |
| BUG-007 (jargon kỹ thuật) | **Chỉ sửa 1 nửa** ⚠️ | Copy "Temperature thấp" đã bỏ khỏi `index.html`, nhưng `static/app.js` dòng 567 vẫn hiển thị `Model: ${data.model}` (vd "Model: gpt-5.6-terra") thẳng ra `#meta-line` cho người dùng cuối — đây vẫn là thuật ngữ kỹ thuật thô, việc "đóng" bug này trong báo cáo trước là **chưa chính xác**. |

## 1. Bảng điểm Heuristics (Nielsen)

| # | Heuristic | Điểm /4 | Ghi chú |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Loading spinner + upload progress % tốt; nhưng khi vùng bôi đen không hợp lệ, nút "Hỏi AI" chỉ **im lặng biến mất** — không có phản hồi gì. |
| 2 | Match System/Real World | 3 | Toàn tiếng Việt dễ hiểu, trừ điểm vì "Model: gpt-5.6-terra" vẫn lộ ra (xem BUG-007). |
| 3 | User Control & Freedom | 3 | Có Hủy/Đóng bằng chuột, nhưng không có phím Esc để đóng bubble "Hỏi AI". |
| 4 | Consistency & Standards | 3 | Pattern nút nổi/bubble là kiểu mới so với phần còn lại (toàn panel tĩnh) — chấp nhận được vì đây vốn là popup ngữ cảnh, nhưng là điểm khác biệt cần lưu ý. |
| 5 | Error Prevention | 3 | Giới hạn độ dài/số từ mirror cả client lẫn server tốt; double-submit đã chặn ở cả nút chính lẫn nút Hỏi AI (ẩn ngay sau click). |
| 6 | Recognition > Recall | 2 | **Không có bất kỳ gợi ý/hint nào** cho biết có thể bôi đen để hỏi AI — người dùng chỉ phát hiện được nếu tình cờ thử bôi đen. |
| 7 | Flexibility & Efficiency | 3 | Cache theo text đã hỏi (tránh gọi AI trùng) là điểm cộng thực dụng; không có phím tắt nhưng surface không thực sự cần. |
| 8 | Aesthetic & Minimalist | 3 | Giao diện gọn, dùng token màu nhất quán, không rối mắt. |
| 9 | Error Recovery | 3 | Thông báo lỗi bằng tiếng Việt rõ ràng (`showError`, `renderAskAiError`), thử lại dễ dàng. |
| 10 | Help & Documentation | 1 | Tính năng mới hoàn toàn không có hint tại chỗ — liên quan trực tiếp tới điểm yếu ở mục 6. |

**Tổng: 27/40 — Chấp nhận được** (biên trên của mức, sát ngưỡng "Tốt").

### Cognitive Load
0 mục fail rõ ràng trong 8 mục checklist — **tốt**. Điểm cộng riêng: bubble "Hỏi AI" luôn hiện lại nguyên văn đoạn đã bôi đen (`#ask-ai-quote`) — đúng nguyên tắc "không bắt nhớ" (working memory), người dùng không cần nhớ mình vừa hỏi gì.

## 2. Bảng điểm Audit kỹ thuật

| Dimension | Điểm /4 | Ghi chú |
|---|---|---|
| Accessibility | 2 | Phần cũ (dropzone, contrast) đã tốt, nhưng tính năng mới kéo điểm xuống: xem P1 bên dưới. |
| Performance | 3 | Listener `mouseup`/`scroll` nhẹ, không có thao tác DOM nặng. |
| Theming | 3 | Dùng `var(--...)` nhất quán trong hầu hết code mới; `#8A5A15` ở `.ask-ai-empty` là hex cứng nhưng khớp với màu cảnh báo đã dùng sẵn ở `.warning-banner`, không phải màu mới bịa ra. |
| Responsive | 2 | Có clamp vị trí theo `window.innerWidth/innerHeight` khá cẩn thận, nhưng touch target 2 nút mới đều nhỏ hơn khuyến nghị — xem P2. |
| Implementation Integrity | 4 | Code phản ánh đúng đặc trưng sản phẩm thật (copy tiếng Việt cụ thể, tích hợp backend thật), không phải code mẫu chung chung. |

**Tổng: 14/20 — Tốt** (biên dưới của mức).

## 3. Điểm làm tốt (cụ thể)

- Giới hạn độ dài/số từ cho tính năng bôi đen được validate **cả 2 lớp** (client `validateSelectionClientSide()` + server `SELECTION_MIN/MAX_CHARS`), đúng nguyên tắc "đừng tin client" mà vẫn phản hồi nhanh.
- Contrast của `--muted`/`--muted2` sau khi sửa đã vượt ngưỡng AA với biên độ thoải mái (5.3-5.95:1, không phải vừa đủ 4.5:1), là 1 lần fix hiếm khi bị tái phạm.
- Cơ chế cache theo `text.toLowerCase()` trong `askAiCache` (Map) là chi tiết nhỏ nhưng đúng — tránh gọi AI trùng lặp tốn phí khi người dùng bôi đen lại đúng chỗ cũ.

## 4. Vấn đề ưu tiên

- **[P1] Tính năng "bôi đen → hỏi AI" không dùng được bằng bàn phím/screen reader.** Toàn bộ luồng phụ thuộc sự kiện `mouseup` trên `document` — người dùng Sam (a11y-dependent) không có cách nào kích hoạt được. Vi phạm WCAG 2.1.1 (Keyboard). Cách sửa tối thiểu: thêm 1 nút "Hỏi AI về câu này" luôn hiện sẵn trong mỗi `.qcard` (không phụ thuộc mouse selection), song song với cơ chế bôi đen hiện tại.
- **[P2] Chọn vùng không hợp lệ bị ẩn nút trong im lặng.** `validateSelectionClientSide()` đã trả về `reason` (lý do cụ thể, vd "Bôi đen tối đa 300 ký tự...") nhưng trong `app.js` chỉ destructure `{ valid }`, **bỏ luôn `reason`** — dữ liệu hữu ích đã có sẵn nhưng không được dùng. Cách sửa gần như miễn phí: hiện `reason` dưới dạng tooltip nhỏ thay vì gọi `hideAskAiBtn()` im lặng.
- **[P2] Touch target quá nhỏ trên mobile.** `#ask-ai-btn` (padding 8px 14px, ~30px cao) và `#ask-ai-close` (padding 2px 4px, ~20px) đều dưới ngưỡng khuyến nghị 44×44px, ảnh hưởng Casey (mobile). Cách sửa: thêm `min-width`/`min-height:44px` cho cả 2.
- **[P2] Không có hint nào cho biết tính năng tồn tại.** Trực tiếp gây ra điểm thấp ở heuristic 6 và 10. Cách sửa: thêm 1 dòng gợi ý nhỏ, vd `💡 Mẹo: bôi đen bất kỳ từ nào trong câu hỏi để hỏi AI giải thích thêm`, đặt ngay trên `#quiz-list`.
- **[P3] BUG-007 (jargon) thực chất chưa đóng hoàn toàn.** `app.js` dòng 567 vẫn in `Model: ${data.model}` ra UI. Cách sửa: bỏ hẳn phần này khỏi `metaLine`, hoặc đổi thành câu trung tính không nêu tên model.

## 5. Persona red flags

- **Sam (a11y-dependent):** Không có cách nào dùng bàn phím/screen reader để kích hoạt "Hỏi AI" — tính năng coi như không tồn tại với nhóm này (xem P1).
- **Jordan (first-timer):** Sẽ không bao giờ tự phát hiện ra có thể bôi đen để hỏi AI — không có hint nào gợi ý (xem P2).
- **Riley (stress tester):** Thử bôi đen 1 ký tự, hoặc bôi đen nguyên 1 đoạn dài 400 ký tự — hệ thống chặn đúng ở backend, nhưng UI không nói lý do gì, Riley sẽ kết luận "tính năng bị lỗi" thay vì "mình bôi đen sai cách".
- **Casey (mobile, phân tâm):** Nút "Hỏi AI" và nút đóng bubble đều nhỏ hơn ngón tay cái, dễ bấm trượt khi đang di chuyển/mất tập trung.

## 6. Ghi chú nhỏ

- `.ask-ai-quote` giới hạn `max-height:60px` — nếu bôi đen gần sát 300 ký tự, phần trích dẫn trong bubble phải cuộn trong 1 ô rất nhỏ, hơi bất tiện nhưng không nghiêm trọng.
- Không có phím Esc để đóng `#ask-ai-bubble`, chỉ có nút ✕ hoặc click ra ngoài — khác với kỳ vọng phổ biến của popover.

## 7. Đề xuất hành động (theo thứ tự ưu tiên)

1. Thêm đường dẫn thay thế không cần chuột cho tính năng Hỏi AI (P1) — quan trọng nhất vì loại hẳn 1 nhóm người dùng.
2. Hiện lý do khi vùng bôi đen không hợp lệ, tận dụng `reason` đã có sẵn trong code (P2, sửa nhanh, gần như miễn phí).
3. Thêm hint phát hiện tính năng + nới touch target cho 2 nút mới (P2, mỗi việc ước chừng vài dòng CSS/HTML).
4. Bỏ nốt "Model: ..." khỏi `metaLine` để đóng BUG-007 triệt để (P3).
