# Eval run — lượt 5 (sửa 4/6 case OBS fail của lượt 4 + 1 regression tự gây trong quá trình sửa)

API: `http://127.0.0.1:8001` · Model: `openai/gpt-4o-mini` qua OpenRouter · Ngày chạy: 2026-07-31. 29/29 case gọi API thành công (R04 SKIPPED theo thiết kế).

## Các thay đổi trong `codebase/server/main.py` so với lượt 4

1. **`INVALID_SKILL_MARKERS` + `_has_invalid_skill_marker`** (mới) — phát hiện skill là ràng buộc/tham chiếu mơ hồ/cụm hành động chung (`"deterministic"`, `"vừa đề cập"`, `"phân tích bài toán"`...), độc lập với logic đếm match — ép `confidence="low"` khi phát hiện, không đổi ngưỡng match hiện có. Sửa OBS03, OBS07, OBS09.
2. **`interest_fallback_used`** (mới) — khi `payload.interest` không có trong `INTEREST_RULES`, công khai trong `overall_note` thay vì fallback âm thầm. Sửa OBS10.
3. **Sửa lại `SKILL_SYNONYMS` → `SKILL_TO_DOMAIN`** — thiết kế cũ (domain → danh sách từ hay xuất hiện trong corpus) có bug thật: `"sự cố"` xuất hiện ở hầu hết đề tài IT Help Desk khiến MỌI hồ sơ `interest="security"` tự động match bất kể skill, phát hiện khi re-verify G02 quay lại regression sau khi sửa OBS. Đổi hướng: ánh xạ SKILL cụ thể (network/linux/log analysis...) → domain, chỉ match khi domain đó khớp `interest`.
4. **Sửa bug word-boundary cũ tái phát dưới dạng khác** — khi đổi sang match cụm nguyên văn để né lỗi "ảnh" khớp "cảnh báo" (lượt 2), vô tình mất khả năng match từng từ đơn hợp lệ (G03: "Thiết kế UX" không còn khớp EDU vì cụm "thiết kế ux" không xuất hiện nguyên văn, dù từ "thiết kế" một mình có). Sửa cuối: giữ match cả cụm VÀ từng từ đơn, chỉ loại trừ danh sách từ đơn đã biết gây nhiễu (`AMBIGUOUS_SINGLE_TOKENS = {"ảnh", "ăn", "nấu"}`) — không bỏ hẳn cơ chế từ đơn.

**Quá trình sửa lượt này đã tự gây 2 regression tạm thời (G02, G03) trước khi tìm ra fix đúng — cả hai đã được phát hiện và sửa trong cùng lượt, xác nhận bằng chạy lại 3 lần liên tiếp mỗi case trước khi chốt.** Không giấu các bước sai — đây là minh chứng thực tế cho nguyên tắc "chạy lại toàn bộ golden set sau mỗi lần đổi logic" đã ghi trong reflection.

## 20 case gốc

| Case | Layer | ma_de trả về | confidence | Đạt? | Lý do |
|---|---|---|---|---|---|
| G01_happy_data_strong_signal | typical | ITOPS-001/002/003 | high | **PASS** | Không đổi qua 5 lượt |
| G02_happy_security_strong_signal | typical | VSOC-001/002/003 | high | **PASS** | Ổn định qua re-verify 3 lần sau khi sửa lại `SKILL_TO_DOMAIN` |
| G03_happy_education_team3 | typical | EDU-001/002/006 | high | **PASS** | Ổn định qua re-verify 3 lần sau khi thêm lại match từ đơn |
| G04_happy_finance_backoffice | typical | FIN-01/02/05 | high | **PASS** | Không đổi |
| G05_happy_operations_manufacturing | typical | RET-001/002/003 | high | **PARTIAL (đã biết)** | Vẫn nghiêng RET dù có "IoT" — không thuộc phạm vi sửa của các lượt 2-5 |
| G06_typical_product_web | typical | RET-001/002/003 | low | **PASS** | Giữ nguyên từ lượt 2 |
| G07_typical_hard_difficulty_ml | typical | ITOPS-001/002/004 | high | **PASS** | Match trực tiếp qua "Python" |
| G08_typical_easy_difficulty_beginner | typical | RET-001/002/003 | low | **PASS** | Giữ nguyên từ lượt 2 |
| L01_layer1_no_grounding_fabrication_check | 1_nguon_su_that | ITOPS-001/002/003 | high | **FAIL (đã biết)** | Quyết định chủ động bỏ ở lượt 3 — xung đột với fix G02, cần LLM-judge riêng |
| L02_layer1_reject_hallucinated_code | 1_nguon_su_that | ITOPS-001/002/004 | — | **PASS** | Server-side filter đúng |
| L03_layer2_ambiguous_mismatched_skills | 2_mo_ho | ITOPS-001/002, VSOC-001 | low | **PASS** | Ổn định qua re-verify 3 lần sau khi thêm `AMBIGUOUS_SINGLE_TOKENS` |
| L04_layer2_team_size_out_of_range | 2_mo_ho | RET-001/002/003 | low | **PASS** | Không đổi từ lượt 3 |
| L05_layer3_out_of_scope_career_advice | 3_ngoai_pham_vi | ITOPS-001/002/003 | high | **PASS** | Không đổi |
| L06_layer3_demand_topic_outside_170 | 3_ngoai_pham_vi | ITOPS-001/002/003 | — | **PASS (giới hạn, như các lượt trước)** | Vẫn là giới hạn thiết kế API |
| L07_layer4_domain_high_risk_must_flag | 4_dac_thu_domain | VSOC-001/002/003 | high | **PASS** | Không đổi |
| L08_layer4_domain_healthcare_extreme_risk | 4_dac_thu_domain | RET-001, RET-002, HC-005 | low | **PARTIAL (đã biết)** | Vẫn chỉ 1/3 slot là HC — giới hạn ghi từ lượt 2, chưa sửa |
| R01_rare_empty_skills | rare | ITOPS-001/002/003 | low | **PASS** | Không đổi |
| R02_rare_unknown_interest_value | rare | ITOPS-001/002/003 | **low** | **PASS (cải thiện thêm)** | Lượt 2-4: "high", không công khai fallback. Lượt 5: "low" + `overall_note` nói rõ `interest="vu-tru-hoc"` không khớp danh mục, đã dùng "data" làm mặc định — đúng thiết kế OBS10 áp dụng chung cho mọi interest không hợp lệ |
| R03_rare_team_size_1 | rare | RET-001/002/003 | low | **PASS** | Không đổi |
| R04_rare_model_call_failure_fallback | rare | — | — | **PASS** | Không đổi |

## 10 case OBS

| Case | Layer | ma_de trả về | confidence | Đạt? | Lý do |
|---|---|---|---|---|---|
| OBS01_real_why_one_topic_ranks_higher | observed_normal | ITOPS-001/002/003 | high | **PASS** | Không đổi từ lượt 4 |
| OBS02_real_prefer_simplest_sufficient_solution | observed_normal | FIN-01/02/03 | high | **PASS** | Không đổi |
| OBS03_real_absolute_determinism_constraint | observed_out_of_scope | ITOPS-001/002/003 | **low** | **PASS (đã sửa)** | Lượt 4: "high" (FAIL). Lượt 5: "low" + `overall_note` nêu rõ "Yêu cầu deterministic tuyệt đối" không phải năng lực cụ thể — đúng `_has_invalid_skill_marker` |
| OBS04_real_eval_and_model_drift_intent | observed_normal | ITOPS-001/002/004 | high | **FAIL (còn tồn tại)** | Không có mã `AIP-03`/`AIP-10`, `overall_note` không nêu candidate thiếu đề tài eval/regression phù hợp. Chưa sửa — cần thay đổi cách `_prefilter` chọn candidate hoặc tăng limit, rủi ro ảnh hưởng nhiều case khác nên để lại cho lượt sau nếu còn thời gian |
| OBS05_real_vague_this_problem | observed_ambiguity | EDU-001/002/006 | low | **PASS** | Không đổi |
| OBS06_real_vague_smart_solution | observed_ambiguity | ITOPS-001/002/003 | low | **PASS** | Không đổi |
| OBS07_real_missing_previous_project_context | observed_ambiguity | RET-001/002/003 | **low** | **PASS (đã sửa)** | Lượt 4: "high" (FAIL). Lượt 5: "low" + `overall_note` nêu rõ "Dự án tôi vừa đề cập" không phải năng lực cụ thể |
| OBS08_real_undefined_two_problem_metrics | observed_ambiguity | ITOPS-001/002/003 | low | **PASS** | Không đổi |
| OBS09_real_does_problem_need_ai | observed_ambiguity | RET-001/002/003 | **low** | **PASS (đã sửa)** | Lượt 4: "high" (FAIL). Lượt 5: "low" + `overall_note` nêu rõ "Phân tích bài toán" không phải năng lực cụ thể |
| OBS10_real_typo_and_unaccented_input | observed_rare | ITOPS-001/002/008 | **low** | **PASS (đã sửa)** | Lượt 4: "high" (FAIL, fallback âm thầm). Lượt 5: "low" + `overall_note` công khai `interest="du-lieu-va-ai"` không khớp danh mục, đã fallback về "data" |

## Tổng kết

**20 case gốc: 17/20 PASS đầy đủ** (L01 FAIL đã biết + quyết định không sửa; G05/L08 PARTIAL đã biết, chưa nằm trong phạm vi sửa của lượt này).
**10 case OBS: 9/10 PASS đầy đủ** (chỉ OBS04 còn FAIL).

**Tổng 30 case: 26/30 PASS đầy đủ = 86.7%.** Nếu tính PARTIAL×0.5: 26 + 2×0.5 = 27/30 = 90%. **Đạt quality bar 70% với biên độ lớn** — tăng từ 56.7% (lượt 4) lên 86.7% (lượt 5). Điều kiện cứng (100% không bịa `ma_de` ngoài candidate list) vẫn đạt trên cả 30 case — case L02.

**Không có regression nào còn lại** so với lượt 4 — đã verify G01/G02/G03/L03 (4 case dễ vỡ nhất qua các lượt trước) ổn định qua 3 lần chạy liên tiếp mỗi case trước khi chấm chính thức.

## Còn tồn tại — 4 điểm chưa sửa, ghi nhận trung thực

1. **L01** — model vẫn có thể bịa liên hệ giả trong `reasons`. Quyết định chủ động từ lượt 3: cần LLM-judge độc lập, không phải heuristic đếm-từ.
2. **OBS04** — candidate list không có đề tài AI-eval/regression phù hợp nhưng không công khai giới hạn. Chưa sửa vì cách sửa khả thi duy nhất (tăng `_prefilter` limit hoặc đổi thứ tự block) có rủi ro ảnh hưởng dây chuyền tới các case khác đã PASS ổn định — không thử trong lượt này để tránh lặp vòng lặp sửa-vỡ đã xảy ra 2 lần trong chính lượt này (G02, G03).
3. **G05** — model không phân biệt input khác biệt rõ trong cùng block operations (IoT/Bảo trì vẫn ra RET).
4. **L08 một phần** — HC vẫn chỉ 1/3 slot dù hồ sơ khớp y tế rõ ràng.

## Bài học kỹ thuật từ lượt này (đáng đưa vào slide 6 / reflection)

Sửa OBS03/07/09/10 (bổ sung 2 check độc lập mới) không đụng logic match cũ, nhưng **quá trình điều tra tại sao G02 tự nhiên regression đã lộ ra 2 bug có sẵn từ trước, không liên quan gì đến thay đổi lần này**: (a) `SKILL_SYNONYMS` cũ chưa từng hoạt động đúng cho cụm 2 từ tiếng Việt kể từ khi thêm ở lượt 3 (tình cờ pass nhờ từ đơn có sẵn trong danh sách), và (b) word-boundary fix ở lượt 2 (chặn "ảnh"/"cảnh báo") mới chỉ đúng khi giữ được cả match từ đơn — bỏ hẳn nó (như tôi thử ở giữa lượt 5) lại phá case khác. Không có cách nào tìm ra 2 bug này ngoài việc re-run và re-verify từng case nghi ngờ bằng tay, không chỉ tin số % tổng.
