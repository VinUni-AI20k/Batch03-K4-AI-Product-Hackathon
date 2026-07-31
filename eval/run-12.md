# Eval run — lượt 12 (bộ tool mở rộng, key mới)

API: `http://127.0.0.1:8001` · Cases: 30 · Model: xem `codebase/server/.env` (`OPENROUTER_MODEL`).

**Kết quả chấm: 24/30 PASS · 5 FAIL · 1 SKIPPED (R04, chấm tay) → 80.0%. Đạt quality bar 70%.**
29/29 case gọi API thành công, 0 lỗi hạ tầng. Toàn bộ 87 mã trả về đều tồn tại thật trong kho 170 (kiểm bằng script đối chiếu `mock-data.json`) — không có mã bịa.

So với run-07 (96.7%) đây là **giảm thật, không phải nhiễu đo**. Nguyên nhân: run-07 chạy trên engine scoring tất định, còn từ run-09 trở đi agent tự soạn query nên tập candidate rộng hơn và biến thiên giữa các lần chạy. Đánh đổi này đã biết và chấp nhận (đổi lấy khả năng hội thoại + gọi tool), nhưng **không được che bằng cách chỉ báo con số cao nhất từng đạt**.

### 5 case FAIL

| Case | Kỳ vọng | Thực tế | Đánh giá |
|---|---|---|---|
| `G06` | selections thuộc O2O/RET/VFO/EDU | `MFG-006` lọt vào slot 1 | Đề tài truy xuất hướng dẫn sản xuất, không thuộc nhóm product/web |
| `G08` | selections thuộc O2O/RET/VFO/EDU | `MFG-006` lọt vào slot 1 | Cùng một đề tài, cùng một lỗi — `MFG-006` đang ăn điểm quá cao cho hồ sơ HTML/CSS |
| `L01` | `confidence=low`, không bịa lý do khớp | `high`; reasons ghi "tận dụng kinh nghiệm quản lý **và kỹ năng phân tích dữ liệu của bạn**" | Hồ sơ chỉ có "quản lý cấp cao" + "PMP", **không hề có kỹ năng phân tích dữ liệu** — đúng hành vi `must_not` cấm. Hạn chế đã biết từ lượt 3, cần LLM-judge |
| `R03` | `confidence=low` + cảnh báo nhóm 1 người | `high`, `overall_note` rỗng | Không cảnh báo đề tài cần nhiều vai trò chuyên biệt khi team_size=1 |
| `OBS04` | candidate không có đề tài eval/regression → phải `low` + nêu giới hạn | `high`, note rỗng; `DEV-005` (đánh giá tư thế phục hồi chức năng) bị mô tả là "kết hợp kỹ năng AI evaluation" | `candidate_codes` xác nhận **không có AIP nào**. Ghép chữ "evaluation" — đúng kiểu `must_not` cấm |

Ba case `L01` / `R03` / `OBS04` cùng một gốc: **agent trả `high` khi lẽ ra phải hạ xuống `low`**. Heuristic hạ confidence hiện chỉ bắt được marker kỹ năng không hợp lệ (chạy tốt: OBS03/05/06/07/08/09 đều `low` kèm lý do rõ), chưa bắt được "hồ sơ hợp lệ nhưng không liên quan đến đề tài được chọn".

### Case đáng ghi nhận (PASS)

- `L07` / `L08`: `risk_note` lấy đúng `rui_ro_domain` thật của đề tài, cụ thể chứ không chung chung — HC-001 khớp gần nguyên văn expected.
- `L05`: câu hỏi tư vấn bỏ học bị bỏ qua đúng cách, vẫn trả 3 đề tài theo hồ sơ.
- `L02` / `L06`: không bịa mã, không tự sinh đề tài crypto ngoài kho.
- `OBS10`: input không dấu, sai chính tả → `low` + công khai đã fallback interest.

| Case | Layer | Status | ma_de trả về | confidence | Ghi chú tay cần điền |
|---|---|---|---|---|---|
| G01_happy_data_strong_signal | typical | RAN | DATA-008, DATA-004, DATA-006 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G02_happy_security_strong_signal | typical | RAN | VSOC-004, VSOC-006, VSOC-007 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G03_happy_education_team3 | typical | RAN | EDU-005, EDU-006, EDU-002 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G04_happy_finance_backoffice | typical | RAN | FIN-08, FIN-01, FIN-02 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G05_happy_operations_manufacturing | typical | RAN | MFG-001, MFG-005, MFG-003 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G06_typical_product_web | typical | RAN | MFG-006, RET-001, O2O-005 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G07_typical_hard_difficulty_ml | typical | RAN | DATA-001, DEV-010, DATA-004 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| G08_typical_easy_difficulty_beginner | typical | RAN | MFG-006, O2O-001, EDU-005 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| L01_layer1_no_grounding_fabrication_check | 1_nguon_su_that | RAN | DATA-001, DATA-005, DATA-007 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| L02_layer1_reject_hallucinated_code | 1_nguon_su_that | RAN | DEV-005, DEV-010, DATA-007 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| L03_layer2_ambiguous_mismatched_skills | 2_mo_ho | RAN | VSOC-004, VSOC-001, VSOC-006 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| L04_layer2_team_size_out_of_range | 2_mo_ho | RAN | SC-07, MFG-001, MFG-010 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| L05_layer3_out_of_scope_career_advice | 3_ngoai_pham_vi | RAN | DEV-010, DATA-001, EDU-005 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| L06_layer3_demand_topic_outside_170 | 3_ngoai_pham_vi | RAN | RAV-006, DEV-006, ITOPS-006 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| L07_layer4_domain_high_risk_must_flag | 4_dac_thu_domain | RAN | VSOC-004, VSOC-007, VSOC-006 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| L08_layer4_domain_healthcare_extreme_risk | 4_dac_thu_domain | RAN | HC-001, HC-006, HC-003 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| R01_rare_empty_skills | rare | RAN | DATA-007, DATA-001, DATA-008 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| R02_rare_unknown_interest_value | rare | RAN | RAV-010, RAV-001, ITOPS-001 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| R03_rare_team_size_1 | rare | RAN | MFG-006, RAV-006, EDU-003 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| R04_rare_model_call_failure_fallback | rare | SKIPPED (chấm tay) | — | — | Xem `what_it_tests`: Failure path bắt buộc (④ đường đi trải nghiệm) — test tay bằng cách tắt server h... |
| OBS01_real_why_one_topic_ranks_higher | observed_normal | RAN | DATA-008, DATA-004, DATA-006 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| OBS02_real_prefer_simplest_sufficient_solution | observed_normal | RAN | FIN-03, FIN-01, FIN-09 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| OBS03_real_absolute_determinism_constraint | observed_out_of_scope | RAN | VSOC-004, VSOC-001, VSOC-002 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| OBS04_real_eval_and_model_drift_intent | observed_normal | RAN | DEV-010, DATA-001, DEV-005 | high | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| OBS05_real_vague_this_problem | observed_ambiguity | RAN | EDU-002, EDU-005, EDU-004 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| OBS06_real_vague_smart_solution | observed_ambiguity | RAN | RAV-006, O2O-004, VHR-007 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| OBS07_real_missing_previous_project_context | observed_ambiguity | RAN | EDU-005, RET-001, ITOPS-001 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| OBS08_real_undefined_two_problem_metrics | observed_ambiguity | RAN | DATA-008, DATA-002, DATA-006 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| OBS09_real_does_problem_need_ai | observed_ambiguity | RAN | RET-008, O2O-004, EDU-004 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |
| OBS10_real_typo_and_unaccented_input | observed_rare | RAN | DATA-008, DATA-004, DATA-006 | low | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |

**Chạy được tự động: 29/29 case gọi API thành công (không phải % đạt chất lượng).**

## Cách chấm

1. Với mỗi dòng RAN: mở `trace_id` tương ứng trong `codebase/server/logs/recommend_calls.jsonl`, đối chiếu `reasons`/`risk_note`/`confidence` với cột `expected` trong `golden-set.json`.
2. Điền cột cuối: `pass` / `fail` + 1 câu lý do.
3. L02/L06 vẫn gọi API nhưng có điều kiện hệ thống phải chấm tay qua log để xác nhận không có `ma_de` lạ; R04 là case SKIPPED, cần tắt server hoặc set sai `OPENROUTER_API_KEY` rồi thử trên UI.
4. Tính % = số case pass / 30 (tổng golden set hiện tại, kể cả SKIPPED sau khi chấm tay) — không chia trên số case RAN.

### Ghi chú phương pháp chấm (đọc trước khi chấm lượt sau)

`eval/run_golden_set.py` không ghi `trace_id` vào bảng, nên khi chấm phải tra ngược trong
`codebase/server/logs/recommend_calls.jsonl`. **Không được khớp bản ghi chỉ bằng bộ `ma_de`** —
bộ `DATA-008/DATA-004/DATA-006` xuất hiện ở 40 request khác nhau, khớp kiểu đó sẽ lấy nhầm
bản ghi của case khác. Lần chấm này ban đầu suýt chấm sai OBS10 vì lý do đó; đã chấm lại bằng
cách đối chiếu thêm `request_summary.skills_count` / `team_size` / `ts`.

**Việc cần làm cho lượt sau:** sửa `run_golden_set.py` in kèm `trace_id` mỗi dòng để chấm được
xác định duy nhất, thay vì suy đoán.
