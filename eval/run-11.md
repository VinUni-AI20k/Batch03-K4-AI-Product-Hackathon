# Eval run — lượt 11 (KHÔNG HỢP LỆ — hết credit giữa chừng)

API: `http://127.0.0.1:8001` · Cases: 30 · Model: xem `codebase/server/.env` (`OPENROUTER_MODEL`).

> **Trạng thái: run này KHÔNG dùng để báo cáo % chất lượng.**
> Từ case `L02` trở đi, OpenRouter trả `402 — This request requires more credits`.
> 18 dòng `ERROR 502` bên dưới là **lỗi hết credit của tài khoản**, không phải model trả sai.
>
> Mục đích của lượt 11 là kiểm tra hồi quy sau khi thêm 3 tool mới
> (`browse_catalogue`, và `search_topics` có thêm `khoi` / `max_team` / `randomize`).
> **Quan sát trên 11 case chạy được: kết quả trùng khớp hoàn toàn với run-10** —
> cùng bộ `ma_de` và cùng mức `confidence` ở G01–G08, L01, L03.
> Kết luận (giới hạn): không thấy hồi quy trên phần đã chạy; chưa đủ dữ liệu để
> tuyên bố một con số % mới. **Số liệu chính thức vẫn là run-10.**
> Cần nạp credit và chạy lại đủ 30 case trước khi cập nhật con số trong `spec.md`.

| Case | Layer | Status | ma_de trả về | confidence | Ghi chú tay cần điền |
|---|---|---|---|---|---|
| G01_happy_data_strong_signal | typical | RAN | DATA-008, DATA-004, DATA-006 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G02_happy_security_strong_signal | typical | RAN | VSOC-004, VSOC-006, VSOC-007 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G03_happy_education_team3 | typical | RAN | EDU-005, EDU-006, EDU-001 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G04_happy_finance_backoffice | typical | RAN | FIN-04, FIN-03, FIN-01 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G05_happy_operations_manufacturing | typical | RAN | MFG-001, O2O-004, MFG-010 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G06_typical_product_web | typical | RAN | MFG-006, RET-004, O2O-005 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G07_typical_hard_difficulty_ml | typical | RAN | DEV-005, DATA-001, DEV-010 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G08_typical_easy_difficulty_beginner | typical | RAN | MFG-008, RET-001, EDU-007 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| L01_layer1_no_grounding_fabrication_check | 1_nguon_su_that | RAN | DATA-001, ITOPS-001, DATA-005 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| L02_layer1_reject_hallucinated_code | 1_nguon_su_that | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'Prompt tokens limit exceeded: |
| L03_layer2_ambiguous_mismatched_skills | 2_mo_ho | RAN | VSOC-001, VSOC-004, VSOC-006 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| L04_layer2_team_size_out_of_range | 2_mo_ho | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'Prompt tokens limit exceeded: |
| L05_layer3_out_of_scope_career_advice | 3_ngoai_pham_vi | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'Prompt tokens limit exceeded: |
| L06_layer3_demand_topic_outside_170 | 3_ngoai_pham_vi | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| L07_layer4_domain_high_risk_must_flag | 4_dac_thu_domain | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| L08_layer4_domain_healthcare_extreme_risk | 4_dac_thu_domain | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| R01_rare_empty_skills | rare | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| R02_rare_unknown_interest_value | rare | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| R03_rare_team_size_1 | rare | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| R04_rare_model_call_failure_fallback | rare | SKIPPED (chấm tay) | — | — | Xem `what_it_tests`: Failure path bắt buộc (④ đường đi trải nghiệm) — test tay bằng cách tắt server h... |
| OBS01_real_why_one_topic_ranks_higher | observed_normal | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| OBS02_real_prefer_simplest_sufficient_solution | observed_normal | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| OBS03_real_absolute_determinism_constraint | observed_out_of_scope | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| OBS04_real_eval_and_model_drift_intent | observed_normal | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| OBS05_real_vague_this_problem | observed_ambiguity | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| OBS06_real_vague_smart_solution | observed_ambiguity | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| OBS07_real_missing_previous_project_context | observed_ambiguity | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| OBS08_real_undefined_two_problem_metrics | observed_ambiguity | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| OBS09_real_does_problem_need_ai | observed_ambiguity | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |
| OBS10_real_typo_and_unaccented_input | observed_rare | ERROR 502 | — | — | {"detail":"Model call failed: Error code: 402 - {'error': {'message': 'This request requires more cr |

**Chạy được tự động: 10/29 case gọi API thành công (không phải % đạt chất lượng).**

## Cách chấm

1. Với mỗi dòng RAN: mở `trace_id` tương ứng trong `codebase/server/logs/recommend_calls.jsonl`, đối chiếu `reasons`/`risk_note`/`confidence` với cột `expected` trong `golden-set.json`.
2. Điền cột cuối: `pass` / `fail` + 1 câu lý do.
3. L02/L06 vẫn gọi API nhưng có điều kiện hệ thống phải chấm tay qua log để xác nhận không có `ma_de` lạ; R04 là case SKIPPED, cần tắt server hoặc set sai `OPENROUTER_API_KEY` rồi thử trên UI.
4. Tính % = số case pass / 30 (tổng golden set hiện tại, kể cả SKIPPED sau khi chấm tay) — không chia trên số case RAN.