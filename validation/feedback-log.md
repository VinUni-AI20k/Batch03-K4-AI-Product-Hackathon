# Validation log — CP5

Theo guide §4.2: ≥5 người ngoài nhóm, ưu tiên willing users đã khai ở CP1 + thành viên zone khác. Một phiên 10 phút/người.

## Cách chạy một phiên (đọc trước khi bắt đầu)

1. **Giao task thật** — nói đúng câu: *"Bạn hãy dùng trang này để tìm một đề tài capstone phù hợp với bạn."* Không giải thích thêm cách dùng, không chỉ tay vào nút nào.
2. **Im lặng quan sát** — không thuyết minh, không gợi ý khi họ lúng túng. Ghi lại: họ bấm gì, kẹt ở đâu, mất bao lâu để ra kết quả đầu tiên.
3. **Hỏi đúng 3 câu, theo thứ tự này**:
   - "Điều gì khó hiểu hoặc khó chịu nhất?"
   - "Kết quả này bạn có tin không — vì sao?"
   - "Bạn có dùng thật không — vì sao / vì sao chưa?"
4. **Log nguyên văn ngay lúc đó** — không diễn giải lại, không sửa câu cho "gọn".
5. Nếu người thử chỉ toàn khen → phiên chưa đạt. Đổi task khó hơn (ví dụ: "hãy tìm một đề tài về an ninh mạng dù bạn không giỏi kỹ thuật") hoặc đổi người thử.

Trước khi mời người thử: đảm bảo cả 3 service đang chạy (`codebase/server` :8001, `backend` :8080, frontend :8000) — xem `codebase/README.md` và `backend/README.md`.

## Bảng log

| # | Người thử (tên/vai — willing user?) | Task | Quan sát (bấm gì, kẹt đâu, mất bao lâu) | Quote nguyên văn (3 câu) | Mức nghiêm trọng |
|---|---|---|---|---|---|
| 1 | *(cần điền)* | | | | |
| 2 | *(cần điền)* | | | | |
| 3 | *(cần điền)* | | | | |
| 4 | *(cần điền)* | | | | |
| 5 | *(cần điền)* | | | | |

*(Mức nghiêm trọng: chặn hoàn toàn / gây khó chịu rõ / nhỏ, không ảnh hưởng quyết định dùng tiếp.)*

## Tổng hợp sau khi đủ ≥5 phiên *(điền sau khi chạy xong)*

- **Chủ đề lặp nhiều nhất**:
- **1-2 thay đổi làm trước demo** (→ ghi vào Changelog `spec.md` §9):
- **Giữ nguyên có lý do**:
- **Đưa vào backlog** (cho slide 6):

## Người ưu tiên mời (điền tên thật trước khi chạy)

- Willing users đã khai ở CP1: *(cần bổ sung ≥3 tên — spec.md §8 đang ghi "cần bổ sung ≥3 tên cụ thể trước CP5")*
- Thành viên zone khác / người đã trả lời khảo sát Google Form và đồng ý thử tiếp: *(cần bổ sung)*
- Ai log: *(cần chốt tên)*

---

## Trạng thái thật tại thời điểm viết file này (2026-07-31, trước CP6)

**Bảng log ở trên chưa có dòng nào được điền — chưa có phiên validation trực tiếp nào diễn ra.** Đây là thực trạng, không phải sơ suất: R6 (validation với user, 8đ) yêu cầu quote nguyên văn từ người đã thật sự dùng thử prototype, quan sát trực tiếp, trả lời đúng 3 câu ở guide §4.2 — chưa có ai làm việc này.

### File CSV khảo sát có dùng được cho R6 không? Không.

`validation/survey-responses-raw.csv` (34 người, dùng làm evidence ở spec.md §1) được thu **trước khi prototype tồn tại** — form hỏi về khó khăn chọn đề tài nói chung, không ai trong 34 người từng thấy hoặc dùng ĐềTài+. Kiểm tra lại toàn bộ câu 7 (góp ý tự do, cột duy nhất có thể chứa quote thật): **34/34 dòng đều để trống hoặc chỉ ghi "Không có"/"Nope"** — không có một câu nào nói về trải nghiệm dùng sản phẩm, vì sản phẩm chưa tồn tại lúc họ trả lời. Dùng câu 2/3/6 (số liệu khó khăn, sẵn sàng dùng AI) để đóng vai "quote nguyên văn từ validation" sẽ là gán sai ngữ cảnh — số đó đã dùng đúng chỗ ở §1 (evidence pain), không phải bằng chứng "user đã dùng thử và tin tưởng/không tin tưởng kết quả".

### Vì sao không điền số liệu giả định vào bảng trên

Rubric của khoá nói rõ (README.md, 04-rubric.md): *"Số liệu bị chỉnh sửa hoặc che giấu sẽ không được tính."* Quote gán cho "tên/vai" nhưng do người viết code tự nghĩ ra không phải số liệu bị chỉnh sửa — nó là số liệu không tồn tại được trình bày như thật. Rủi ro cho nhóm nếu bị phát hiện (TA phúc khảo, hỏi ngẫu nhiên tại CP5/CP6 theo "vibe-coding rule") nặng hơn nhiều so với 0đ trung thực ở R6.

### Việc cụ thể cần làm trước CP6 — có thể xong trong 30-45 phút nếu làm ngay

1. Mở `http://localhost:8000/codebase/` (frontend), `http://localhost:8001` (recommend API), `http://localhost:8080` (OCR API) — cả 3 phải chạy, xem `codebase/README.md` và `backend/README.md`.
2. Mời ≥5 người thật (bạn cùng lớp, người ngoài nhóm) — ưu tiên người đã trả lời khảo sát Google Form nếu liên hệ lại được.
3. Từng người: giao đúng câu task ở mục "Cách chạy một phiên" trên → im lặng quan sát → hỏi đúng 3 câu → **ghi lại đúng lời họ nói, không diễn giải**.
4. Điền vào bảng "Bảng log" ở trên — thay các dòng `*(cần điền)*`.
5. Báo lại để cập nhật `spec.md` §9 Changelog (nếu có thay đổi làm trước demo) và slide 5.

**Không có cách nào khác để có R6 hợp lệ ngoài việc này.**
