# Evaluation run_3

- Thời điểm UTC: 2026-07-30T15:32:36.475315+00:00
- Pipeline: `codebase/agent_core.py` (cùng pipeline với UI)
- Kết quả máy: **14/20 = 70%**
- Quality bar đã chốt trong spec: **>= 85%**, đồng thời không bịa citation ở case nguồn-sự-thật.
- Lưu ý: đây là pre-score tái lập. Hai thành viên phải chấm độc lập ít nhất 5 case khó trước khi dùng % làm kết quả CP3 cuối.

## Phân bố case

hard_ambiguity: 2, hard_domain_specificity: 2, hard_out_of_scope: 2, hard_source_of_truth: 2, normal: 8, rare: 4

## Kết quả

| Case | Category | Kind | Pass | Lý do máy |
|---|---|---|:---:|---|
| GS-01 | normal | answered | ĐẠT | đạt pre-score |
| GS-02 | normal | answered | FAIL | thiếu: metric |
| GS-03 | normal | answered | ĐẠT | đạt pre-score |
| GS-04 | normal | answered | ĐẠT | đạt pre-score |
| GS-05 | normal | answered | FAIL | thiếu: compute |
| GS-06 | normal | answered | ĐẠT | đạt pre-score |
| GS-07 | normal | answered | FAIL | thiếu: token |
| GS-08 | normal | answered | ĐẠT | đạt pre-score |
| GS-09 | hard_source_of_truth | clarify | ĐẠT | đạt pre-score |
| GS-10 | hard_source_of_truth | clarify | FAIL | thiếu: tài liệu |
| GS-11 | hard_ambiguity | clarify | ĐẠT | đạt pre-score |
| GS-12 | hard_ambiguity | clarify | ĐẠT | đạt pre-score |
| GS-13 | hard_out_of_scope | refuse | ĐẠT | đạt pre-score |
| GS-14 | hard_out_of_scope | refuse | ĐẠT | đạt pre-score |
| GS-15 | hard_domain_specificity | answered | ĐẠT | đạt pre-score |
| GS-16 | hard_domain_specificity | answered | ĐẠT | đạt pre-score |
| GS-17 | rare | answered | ĐẠT | đạt pre-score |
| GS-18 | rare | answered | ĐẠT | đạt pre-score |
| GS-19 | rare | error | FAIL | sai kind; thiếu: Rule, Workflow, Agent, FAQ; thiếu citation trang kỳ vọng; Invalid control character at: line 9 column 102 (char 292) |
| GS-20 | rare | answered | FAIL | thiếu: Automate, Augment |
