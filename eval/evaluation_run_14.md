# Evaluation run_14

- Thời điểm UTC: 2026-07-30T17:57:56.581092+00:00
- Pipeline: `codebase/agent_core.py` (cùng pipeline với UI)
- Pre-score theo khái niệm: **20/24 = 83%**
- Pre-score khớp đúng nhãn chữ: **19/24 = 79%**

### Tách theo bên ra quyết định

- **Case do AI quyết định: 14/18 = 78%** — đây là con số phản ánh năng lực thật của model.
- Case do rule quyết định: 6/6 = 100% — rule chốt cứng nhóm logistics (deadline/link nộp) và trang không tồn tại; các case này pass theo thiết kế nên không tính là thành tích của AI.
- Citation đối chiếu được với text thật của trang: **38/41 = 93%**

- Alias semantic được khai báo cố định trong `eval/run_eval.py`; không thay đổi golden set sau khi xem output.
- Quality bar đã chốt trong spec: **>= 85%**, đồng thời không bịa citation ở case nguồn-sự-thật.
- Lưu ý: đây là pre-score tái lập. Hai thành viên phải chấm độc lập ít nhất 5 case khó trước khi dùng % làm kết quả CP3 cuối.

## Phân bố case

hard_ambiguity: 2, hard_domain_specificity: 2, hard_out_of_scope: 6, hard_source_of_truth: 2, normal: 8, rare: 4

## Kết quả

| Case | Category | Quyết định bởi | Kind | Pass | Citation đối chiếu | Lý do máy |
|---|---|:---:|---|:---:|:---:|---|
| GS-01 | normal | AI | answered | ĐẠT | 8/8 | đạt pre-score |
| GS-02 | normal | AI | answered | ĐẠT | 3/5 | đạt pre-score |
| GS-03 | normal | AI | answered | FAIL | 1/1 | thiếu khái niệm: mảnh |
| GS-04 | normal | AI | answered | ĐẠT | 1/1 | đạt pre-score |
| GS-05 | normal | AI | answered | ĐẠT | 1/1 | đạt pre-score |
| GS-06 | normal | AI | answered | ĐẠT | 1/1 | đạt pre-score |
| GS-07 | normal | AI | answered | ĐẠT | 4/4 | đạt pre-score |
| GS-08 | normal | AI | answered | ĐẠT | 1/1 | đạt pre-score |
| GS-09 | hard_source_of_truth | RULE | clarify | ĐẠT | — | đạt pre-score |
| GS-10 | hard_source_of_truth | AI | clarify | ĐẠT | — | đạt pre-score |
| GS-11 | hard_ambiguity | RULE | clarify | ĐẠT | — | đạt pre-score |
| GS-12 | hard_ambiguity | RULE | clarify | ĐẠT | — | đạt pre-score |
| GS-13 | hard_out_of_scope | RULE | refuse | ĐẠT | — | đạt pre-score |
| GS-14 | hard_out_of_scope | AI | refuse | FAIL | — | thiếu khái niệm: ngoài phạm vi |
| GS-15 | hard_domain_specificity | AI | answered | ĐẠT | 1/1 | đạt pre-score |
| GS-16 | hard_domain_specificity | AI | answered | ĐẠT | 1/1 | đạt pre-score |
| GS-17 | rare | AI | answered | FAIL | 8/8 | thiếu citation trang kỳ vọng |
| GS-18 | rare | AI | answered | ĐẠT | 1/2 | đạt pre-score |
| GS-19 | rare | AI | error | FAIL | — | sai kind; thiếu khái niệm: Rule, Workflow, Agent, FAQ; thiếu citation trang kỳ vọng; Model trả JSON lỗi: Expecting ',' delimiter. |
| GS-20 | rare | AI | answered | ĐẠT | 7/7 | đạt pre-score |
| GS-21 | hard_out_of_scope | RULE | refuse | ĐẠT | — | đạt pre-score |
| GS-22 | hard_out_of_scope | RULE | refuse | ĐẠT | — | đạt pre-score |
| GS-23 | hard_out_of_scope | AI | refuse | ĐẠT | — | đạt pre-score |
| GS-24 | hard_out_of_scope | AI | refuse | ĐẠT | — | đạt pre-score |
