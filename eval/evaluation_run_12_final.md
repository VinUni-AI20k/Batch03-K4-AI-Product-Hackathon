# Evaluation run_12_final

- Thời điểm UTC: 2026-07-30T15:52:36.210219+00:00
- Pipeline: `codebase/agent_core.py` (cùng pipeline với UI)
- Pre-score theo khái niệm: **19/20 = 95%**
- Pre-score khớp đúng nhãn chữ: **18/20 = 90%**
- Alias semantic được khai báo cố định trong `eval/run_eval.py`; không thay đổi golden set sau khi xem output.
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
| GS-05 | normal | answered | ĐẠT | đạt pre-score |
| GS-06 | normal | answered | ĐẠT | đạt pre-score |
| GS-07 | normal | answered | ĐẠT | đạt pre-score |
| GS-08 | normal | answered | ĐẠT | đạt pre-score |
| GS-09 | hard_source_of_truth | clarify | ĐẠT | đạt pre-score |
| GS-10 | hard_source_of_truth | clarify | ĐẠT | đạt pre-score |
| GS-11 | hard_ambiguity | clarify | ĐẠT | đạt pre-score |
| GS-12 | hard_ambiguity | clarify | ĐẠT | đạt pre-score |
| GS-13 | hard_out_of_scope | refuse | ĐẠT | đạt pre-score |
| GS-14 | hard_out_of_scope | refuse | ĐẠT | đạt pre-score |
| GS-15 | hard_domain_specificity | answered | ĐẠT | đạt pre-score |
| GS-16 | hard_domain_specificity | answered | ĐẠT | đạt pre-score |
| GS-17 | rare | answered | FAIL | thiếu citation trang kỳ vọng |
| GS-18 | rare | answered | ĐẠT | đạt pre-score |
| GS-19 | rare | answered | ĐẠT | đạt pre-score |
| GS-20 | rare | answered | ĐẠT | đạt pre-score |
