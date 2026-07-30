# Codebase — Self Study Buddy (Prototype)

**Mức prototype: Mock.** Toàn bộ flow trong workflow (4 phase, 2 nhánh rẽ DEC1/DEC2, vòng lặp REVIEW→STYLE) đã bấm được end-to-end. Nội dung MCQ/outline/study note là **hardcode giả** — chưa có lời gọi AI thật.

## Cách chạy
Mở trực tiếp `index.html` bằng trình duyệt (double-click), không cần server/build tool.

## Map với workflow (flowchart 4 phase)

| Node trong workflow | Trạng thái trong prototype |
|---|---|
| U1 → A1 → A2 → A3 → KP (Phase 1) | Checklist mock có animation, tự động "hoàn thành" sau ~1.5s |
| Q1 → G1 → D1 → **DEC1** (Phase 2) | Quiz 20 câu thật (rule-based grading) → tính weak/good sections → **rẽ nhánh thật**: có phần yếu → sang STYLE; không có → thẳng tới Retest xác nhận |
| STYLE → AL → RM → CARD1/2/3 → FINISH (Phase 3) | Chọn learning style + study time → loading giả lập AL/RM → roadmap tabs, mỗi tab có đủ 3 card (Summary / Real-world Example / Mini Practice Question) |
| RET → GRADE → **DEC2** → REPORT / REVIEW (Phase 4) | Retest theo đúng phần vừa ôn (hoặc verify toàn bộ nếu DEC1=No) → chấm rule-based → **rẽ nhánh thật** theo ngưỡng mastery 80%: đạt → Report (before/after); chưa đạt → Review (hiện câu sai + nguồn) |
| REVIEW → STYLE (loop) | Nút "Ôn tập lại phần chưa vững" quay lại đúng màn STYLE với `weakSections` đã cập nhật theo kết quả retest — vòng lặp thật, không giới hạn số lần |

## Phần đã thật (không phải mock)
- Chấm điểm quiz/retest: rule-based thật (so `correct_index`).
- Tính weak/good sections: rule-based thật theo số câu sai mỗi section.
- Nhánh DEC1 (cần re-teach hay không) và DEC2 (đạt mastery ≥80% hay chưa): logic rẽ nhánh chạy thật dựa trên kết quả người dùng thao tác trực tiếp.
- Vòng lặp REVIEW → STYLE: chạy thật, `weakSections` được cập nhật lại mỗi vòng.

## Phần còn mock — cần thay bằng AI thật ở CP3
- `ROUND1_BANK`, `RETEST_BANK`: 20 câu MCQ ban đầu + câu retest hardcode. Cần thay bằng AI sinh MCQ thật từ outline + transcript (A3, RET).
- `STUDY_CONTENT`: Summary/Example/Practice Question hardcode. Cần thay bằng AI grounded-rewrite thật + AI align weak section với transcript (AL, RM).
- Checklist Phase 1 (A1 classify, A2 outline extract): hiện chỉ là animation giả, chưa có bước AI extract thật từ PDF.

## Giới hạn đã biết (chấp nhận được ở mức Mock)
- Mỗi section chỉ có 2 câu retest trong `RETEST_BANK` — nếu vòng lặp REVIEW→STYLE lặp nhiều lần, câu hỏi sẽ lặp lại (không sinh câu mới). Khi nối AI thật, RET sẽ sinh câu mới mỗi lần.
- Ngưỡng mastery cố định 80%, chưa cấu hình được qua UI.

## Data contract tham chiếu
Khớp với `schedule_5nguoi.md` §2:
```
outline.json      → [{ section_id, title, key_points[] }]
quiz.json         → [{ q_id, question, options[], correct_index, section_id }]
weakness.json     → [{ section_id, weak_score, reason }]
study_note.json   → [{ section_id, content_md, cited_segment_ids[] }]
```
