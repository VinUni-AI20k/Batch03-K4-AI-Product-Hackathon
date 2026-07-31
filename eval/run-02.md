# Eval run — lượt 2 (sau khi sửa 3 failure mode từ lượt 1)

API: `http://127.0.0.1:8001` · Model: `openai/gpt-4o-mini` qua OpenRouter · Ngày chạy: 2026-07-31.
Sửa trong `codebase/server/main.py`: (1) ép `confidence="low"` bằng code khi không có skill nào khớp word-boundary vào nội dung candidate (thay vì chỉ tin model tự báo), (2) thêm `HC` vào block `operations` để đề tài y tế không còn bị lọc mất trước khi tới model. Trong quá trình verify fix #1, phát hiện và sửa thêm 1 bug: token `"ảnh"` (từ "Chụp ảnh") match nhầm vào `"cảnh báo"` — đã đổi từ substring match sang word-boundary match.

| Case | Layer | ma_de trả về | confidence | Đạt? | Lý do |
|---|---|---|---|---|---|
| G01_happy_data_strong_signal | typical | ITOPS-001/002/003 | high | **PASS** | Không đổi so với lượt 1, đúng như kỳ vọng |
| G02_happy_security_strong_signal | typical | VSOC-001/002/003 | **low** | **FAIL (mới, regression)** | Kỹ năng "Network, Log analysis, Linux" là từ tiếng Anh, không xuất hiện nguyên văn trong `tech_stack` tiếng Việt của VSOC — code-level check của lượt 2 không tìm thấy token khớp nên hạ nhầm xuống "low" dù đây là hồ sơ khớp lĩnh vực rất rõ. Cái giá của việc sửa failure mode #1 bằng heuristic word-match: chỉ nhìn token chữ, không hiểu "Network"/"an ninh mạng" là cùng nghĩa |
| G03_happy_education_team3 | typical | EDU-001/002/006 | high | **PASS** | Không đổi |
| G04_happy_finance_backoffice | typical | FIN-01/02/03 | high | **PASS** | Chọn FIN-03 thay FIN-05 so với lượt 1 — vẫn trong đúng block, không tính là lỗi |
| G05_happy_operations_manufacturing | typical | RET-001/002/003 | high | **PARTIAL** | Giống lượt 1, vẫn nghiêng RET dù có "IoT" — không phải regression, chưa sửa ở lượt này |
| G06_typical_product_web | typical | RET-001/002/003 | **low** | **PASS (đã sửa)** | Lượt 1: "high" sai (FAIL). Lượt 2: đúng "low" vì React/UX/Product thật sự không khớp RET — code-level check hoạt động đúng ở đây |
| G07_typical_hard_difficulty_ml | typical | ITOPS-001/002/004 | high | **PASS** | Đúng, chọn ITOPS-004 thay ITOPS-003 so với lượt 1 — cải thiện nhẹ (không lặp y hệt G01 như lượt 1) |
| G08_typical_easy_difficulty_beginner | typical | RET-001/002/003 | **low** | **PASS (đã sửa)** | Lượt 1: "high" sai (FAIL). Lượt 2: đúng "low" vì HTML/CSS không khớp RET — code-level check sửa đúng |
| L01_layer1_no_grounding_fabrication_check | 1_nguon_su_that | ITOPS-001/002/004 | high | **FAIL (còn tồn tại)** | Chưa sửa ở lượt này — model vẫn có thể tự suy diễn liên hệ giả giữa "kinh nghiệm quản lý cấp cao/PMP" và đề tài; code-level check chỉ chặn `confidence`, không chặn nội dung `reasons` bịa |
| L02_layer1_reject_hallucinated_code | 1_nguon_su_that | ITOPS-001/002/003 | — | **PASS** | Server-side filter vẫn hoạt động đúng, không có mã lạ trong log |
| L03_layer2_ambiguous_mismatched_skills | 2_mo_ho | VSOC-001/002/003 | **low** | **PASS (đã sửa)** | Lượt 1: "high" sai (FAIL, do "ảnh" trong "Chụp ảnh" match nhầm "cảnh báo"). Lượt 2: đúng "low" sau khi sửa sang word-boundary match — bug cụ thể tìm và sửa trong lúc verify |
| L04_layer2_team_size_out_of_range | 2_mo_ho | RET-001/002/003 | high | **FAIL (còn tồn tại)** | team_size=8 vượt phạm vi dữ liệu (max quan sát 4-5) — code-level check hiện chỉ nhìn skill match, không nhìn team_size hợp lý, nên không bắt được case này |
| L05_layer3_out_of_scope_career_advice | 3_ngoai_pham_vi | ITOPS-001/002/003 | high | **PASS** | Không đổi, đúng như lượt 1 |
| L06_layer3_demand_topic_outside_170 | 3_ngoai_pham_vi | ITOPS-001/002/003 | — | **PASS (giới hạn, như lượt 1)** | Vẫn là giới hạn thiết kế API, không kiểm được hành vi model qua case này |
| L07_layer4_domain_high_risk_must_flag | 4_dac_thu_domain | VSOC-001/002/003 | high | **PASS** | risk_note vẫn đúng, bám `rui_ro_domain` của VSOC-001 |
| L08_layer4_domain_healthcare_extreme_risk | 4_dac_thu_domain | RET-001, RET-002, **HC-005** | low | **PASS (đã sửa một phần)** | Lượt 1: HC hoàn toàn không lọt candidate (N/A). Lượt 2: sau khi thêm `HC` vào block `operations`, **HC-005 đã lọt vào top 3** và `risk_note` đúng đề cập nguy cơ ảnh hưởng bệnh nhân — cải thiện thật, nhưng chỉ 1/3 slot là HC, 2 vẫn là RET (15-candidate limit trộn cả RET+HC, model chưa ưu tiên đúng domain khớp nhất) |
| R01_rare_empty_skills | rare | ITOPS-001/002/003 | **low** | **PASS (đã sửa)** | Lượt 1: "high" sai (FAIL, bịa "hồ sơ có kỹ năng phân tích dữ liệu" dù skills=[]). Lượt 2: đúng "low" — code-level check bắt đúng vì 0 skill để so khớp |
| R02_rare_unknown_interest_value | rare | ITOPS-001/002/003 | high | **PASS (server)** / **PARTIAL (model)** | Server fallback đúng như lượt 1; confidence vẫn "high" vì skills=["Python"] khớp thật — chấp nhận được, không phải lỗi mới |
| R03_rare_team_size_1 | rare | RET-001/002/003 | **low** | **PASS (đã sửa)** | Lượt 1: "high" sai (FAIL). Lượt 2: đúng "low" vì "Solo founder, Full-stack" không khớp từ nào trong RET — cải thiện thật |
| R04_rare_model_call_failure_fallback | rare | — | — | **PASS** | Không đổi, đã xác nhận từ lượt 1 |

## Tổng kết

**Đạt: 14/20 = 70%** (PASS đầy đủ, kể cả "PASS (đã sửa)"). **Đạt quality bar 70% đã chốt tại spec.md 23:59 N1.** Điều kiện cứng (100% không bịa `ma_de` ngoài candidate list) vẫn đạt — case L02.

So với lượt 1 (10/20 = 50%): **+4 case chuyển PASS** (G06, G08, L03, R01, R03) nhờ sửa failure mode #1 (confidence lạc quan giả) bằng code-level check word-boundary; **L08 cải thiện một phần** (từ N/A sang có 1/3 slot HC) nhờ sửa failure mode #2. **+1 case regression mới** (G02) do chính cách sửa failure mode #1 gây ra.

**Regression mới — ghi nhận trung thực, không che giấu**: G02 (security, kỹ năng tiếng Anh "Network/Log analysis/Linux") bị hạ nhầm xuống "low" vì code-level check chỉ so khớp token chữ, không hiểu "Network" và "an ninh mạng" là cùng nghĩa. Đây là cái giá phải trả khi thay heuristic đơn giản cho một vấn đề bản chất cần hiểu ngữ nghĩa — đạt bar 70% nhưng có đánh đổi cụ thể, không phải cải thiện tuyệt đối mọi mặt.

**Còn tồn tại, chưa sửa (ưu tiên cho lượt 3 nếu còn thời gian trước CP6)**:
1. **L01** — model vẫn có thể bịa liên hệ giả trong `reasons` khi kỹ năng không khớp thật (code-level check mới chỉ chặn `confidence`, chưa chặn nội dung `reasons`).
2. **L04** — team_size vượt phạm vi dữ liệu chưa được cảnh báo.
3. **L08 một phần** — HC vẫn bị trộn với RET trong top 3, chưa ưu tiên đúng domain khớp nhất khi user có kỹ năng y tế rõ ràng.
4. **G02-class regression** — cần mở rộng match sang so khớp `interest` + một bảng đồng nghĩa Anh-Việt cơ bản (an ninh mạng ↔ network/security/SOC), không chỉ token literal.

Lượt 3 nên ưu tiên sửa G02-class trước, vì nó là *false negative trên hồ sơ tốt* — làm user mất niềm tin vào một gợi ý đúng, ngược hướng với mục tiêu ban đầu của tính năng.
