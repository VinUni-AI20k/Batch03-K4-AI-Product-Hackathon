# KẾ HOẠCH PROTOTYPE — QUIZ CỦNG CỐ CUỐI BUỔI

## Mức nên làm: Mock

Mock là đủ nếu flow bấm hoàn chỉnh và có **một AI call thật** ở quyết định trung tâm: sinh quiz từ đoạn nguồn. Credit, đăng nhập và tích hợp hệ thống thật được mock rõ trong UI.

## Flow demo 5 phút

| Thời gian | Thao tác | Điều cần chứng minh |
|---:|---|---|
| 0:00–0:30 | Chọn bài, xem “Quiz 3 câu, ~3 phút, chỉ dùng cho ôn tập” | Phạm vi và quyền dùng AI rõ ràng |
| 0:30–1:30 | Nhấn tạo quiz | AI call thật tạo 3 câu từ 3 đoạn nguồn; mọi câu có mã nguồn học liệu |
| 1:30–2:30 | Làm quiz, cố ý sai 1 câu | Flow chính: chấm và feedback |
| 2:30–3:15 | Xem 2/3, phần cần ôn lại, credit 7→8/20 | Giá trị sản phẩm và cap |
| 3:15–4:00 | Bấm mở nguồn hoặc báo câu sai | Truy vết học liệu và correction |
| 4:00–5:00 | Demo thiếu nguồn hoặc xin dùng credit trong bài thi | Failure và guardrail |

## Màn hình tối thiểu

1. **Lesson recap:** tên bài, credit `7/20`, nhãn “chỉ dùng cho ôn tập”.
2. **Quiz:** 3 câu, tiến độ, nút xem nguồn.
3. **Kết quả:** đúng/sai, giải thích, mã nguồn học liệu, một phần cần ôn lại, credit.
4. **Fallback:** “chưa đủ nguồn để tạo quiz tin cậy” và nút chọn nội dung khác.

## AI prompt contract

**Input:** tiêu đề bài và danh sách `{id, text}` của các đoạn nguồn đã duyệt.

**Bắt buộc trong prompt:**

```text
Chỉ tạo câu hỏi và đáp án có thể chứng minh trực tiếp từ source_chunks.
Mỗi câu trả về source_ids hỗ trợ câu hỏi và đáp án.
Nếu không đủ nguồn để tạo câu công bằng, trả về INSUFFICIENT_EVIDENCE.
Không đưa kiến thức ngoài nguồn và không tạo câu đánh đố.
```

**Output:** `status`, đúng 3 câu, 4 options/câu, `correct_option`, `explanation`, `source_ids`.

Chỉ render khi `status = OK`, mọi source ID thuộc input, option hợp lệ và mã nguồn học liệu không rỗng.

## Thật và mock

| Phần | Trạng thái |
|---|---|
| Sinh quiz từ nguồn | **Thật** — AI call có log nguồn và timestamp |
| Chấm MCQ | Logic deterministic từ đáp án đã validate |
| Xem nguồn học liệu | UI mock mở source ID thật |
| Credit 0–20 | State mock, cap cứng 20 |
| Điểm/reward chính thức và VinUni final | **Không build** |

## Test tối thiểu

| Case | Kết quả mong muốn |
|---|---|
| Nguồn rõ | 3 câu có mã nguồn học liệu, đáp án đúng theo nguồn |
| Nguồn không đủ | `INSUFFICIENT_EVIDENCE`, không bịa câu |
| Mã nguồn học liệu không tồn tại | Validator chặn render |
| Credit 19/20 + pass | Thành 20/20 |
| Credit 20/20 + pass | Không tăng, giải thích cap |
| Xin dùng credit trong final | Từ chối: chỉ dùng ôn tập |
