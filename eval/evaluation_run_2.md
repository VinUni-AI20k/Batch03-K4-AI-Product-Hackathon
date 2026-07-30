# Evaluation run_2

- Thời điểm UTC: 2026-07-30T15:07:08.294914+00:00
- Pipeline: `codebase/agent_core.py` (cùng pipeline với UI)
- Kết quả máy: **16/20 = 80%**
- Quality bar đã chốt trong spec: **>= 85%**, đồng thời không bịa citation ở case nguồn-sự-thật.
- Lưu ý: đây là pre-score tái lập. Hai thành viên phải chấm độc lập ít nhất 5 case khó trước khi dùng % làm kết quả CP3 cuối.

## Phân bố case

hard_ambiguity: 2, hard_domain_specificity: 2, hard_out_of_scope: 2, hard_source_of_truth: 2, normal: 8, rare: 4

## Kết quả

| Case | Category | Kind | Pass | Lý do máy |
|---|---|---|:---:|---|
| GS-01 | normal | answered | ĐẠT | đạt pre-score |
| GS-02 | normal | answered | ĐẠT | đạt pre-score |
| GS-03 | normal | answered | ĐẠT | đạt pre-score |
| GS-04 | normal | answered | ĐẠT | đạt pre-score |
| GS-05 | normal | error | FAIL | sai kind; thiếu: MoE, chuyên gia, compute; thiếu citation trang kỳ vọng; Luồng chụp ảnh cần model vision. Hãy cấu hình VISION_API_KEY và VISION_MODEL ở server. |
| GS-06 | normal | error | FAIL | sai kind; thiếu: Rule, Workflow, Agent; thiếu citation trang kỳ vọng; Luồng chụp ảnh cần model vision. Hãy cấu hình VISION_API_KEY và VISION_MODEL ở server. |
| GS-07 | normal | answered | ĐẠT | đạt pre-score |
| GS-08 | normal | answered | ĐẠT | đạt pre-score |
| GS-09 | hard_source_of_truth | clarify | ĐẠT | đạt pre-score |
| GS-10 | hard_source_of_truth | clarify | ĐẠT | đạt pre-score |
| GS-11 | hard_ambiguity | clarify | ĐẠT | đạt pre-score |
| GS-12 | hard_ambiguity | clarify | ĐẠT | đạt pre-score |
| GS-13 | hard_out_of_scope | refuse | ĐẠT | đạt pre-score |
| GS-14 | hard_out_of_scope | refuse | ĐẠT | đạt pre-score |
| GS-15 | hard_domain_specificity | error | FAIL | sai kind; thiếu: attention, token, liên quan; thiếu citation trang kỳ vọng; Luồng chụp ảnh cần model vision. Hãy cấu hình VISION_API_KEY và VISION_MODEL ở server. |
| GS-16 | hard_domain_specificity | error | FAIL | sai kind; thiếu: precision, recall, False; thiếu citation trang kỳ vọng; Luồng chụp ảnh cần model vision. Hãy cấu hình VISION_API_KEY và VISION_MODEL ở server. |
| GS-17 | rare | answered | ĐẠT | đạt pre-score |
| GS-18 | rare | answered | ĐẠT | đạt pre-score |
| GS-19 | rare | answered | ĐẠT | đạt pre-score |
| GS-20 | rare | answered | ĐẠT | đạt pre-score |
