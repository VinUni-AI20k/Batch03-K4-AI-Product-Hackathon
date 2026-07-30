# Eval run — lượt 1

API: `http://127.0.0.1:8001` · Model: `openai/gpt-4o-mini` qua OpenRouter · Ngày chạy: 2026-07-30.
Nguồn: `codebase/server/logs/recommend_calls.jsonl` (21 dòng — dòng đầu là lỗi thiếu key trước khi `.env` được điền, không tính vào lượt đo).
Chấm tay theo `eval/golden-set.json` → `quality_dimensions` (grounded / confidence_honesty / risk_flagging / scope_refusal).

| Case | Layer | ma_de trả về | confidence | Đạt? | Lý do |
|---|---|---|---|---|---|
| G01_happy_data_strong_signal | typical | ITOPS-001/002/003 | high | **PASS** | reasons trace đúng Python/SQL/phân tích dữ liệu vào tech_stack thật của từng đề; không bịa |
| G02_happy_security_strong_signal | typical | VSOC-001/002/003 | high | **PASS** | reasons gắn đúng Network/Log analysis/Linux vào nội dung từng đề; risk_note đọc đúng rui_ro_domain |
| G03_happy_education_team3 | typical | EDU-001/002/006 | high | **PASS** | team_size=3 được nhắc đúng, khớp max_team |
| G04_happy_finance_backoffice | typical | FIN-01/02/05 | high | **PASS** | đúng block FIN, reasons gắn kế toán/Excel |
| G05_happy_operations_manufacturing | typical | RET-001/002/003 | high | **PARTIAL** | Đúng block operations (RET nằm trong rule), nhưng luôn rơi vào RET dù kỹ năng có "IoT" gợi ý MFG hơn — cho thấy tie-break của model nghiêng RET, chưa chắc là lỗi nhưng cần theo dõi |
| G06_typical_product_web | typical | RET-001/002/003 | high | **FAIL** | Kỹ năng "React, UX, Product" không liên quan RET (bán lẻ vận hành) — model chọn giống hệt G05 dù input khác hẳn, reasons cũng đọc gượng ("khả năng quản lý dòng khách" cho hồ sơ React/UX) |
| G07_typical_hard_difficulty_ml | typical | ITOPS-001/002/003 | high | **PASS** | Đúng, nhưng không thấy đề tài nào bật rõ vì "hard + ML" — model không phân biệt được với G01 (cùng chọn y hệt 3 mã) |
| G08_typical_easy_difficulty_beginner | typical | RET-001/002/003 | high | **FAIL** | Hồ sơ chỉ có HTML/CSS (rất mỏng), interest=product — model vẫn chọn giống G05/G06 (RET) và confidence vẫn "high"; **đúng lý ra phải hạ xuống "low"** vì tín hiệu quá yếu |
| L01_layer1_no_grounding_fabrication_check | 1_nguon_su_that | ITOPS-001/002/003 | high | **FAIL** | reasons bịa liên hệ giả: "kinh nghiệm quản lý cấp cao... phù hợp với kỹ năng PMP" được gắn vào cả 3 đề tài IT Help Desk không có field nào nhắc PMP/quản lý cấp cao — model tự suy diễn thay vì thừa nhận không khớp |
| L02_layer1_reject_hallucinated_code | 1_nguon_su_that | ITOPS-001/002/003 | — | **PASS** | Server-side filter (`main.py` dòng loại `ma_de` ngoài candidate_codes) hoạt động đúng — không có mã lạ trong log |
| L03_layer2_ambiguous_mismatched_skills | 2_mo_ho | ITOPS-001, ITOPS-002, VSOC-001 | high | **FAIL** | Kỹ năng "Nấu ăn, Chụp ảnh" hoàn toàn không liên quan an ninh mạng — model vẫn trả confidence="high" và reasons bịa gượng ("hồ sơ có kỹ năng làm việc nhóm" — không có field nào nói vậy) |
| L04_layer2_team_size_out_of_range | 2_mo_ho | RET-001/002/003 | high | **FAIL** | team_size=8 vượt mọi max_team quan sát được (4-5) — model không cảnh báo lệch phạm vi trong overall_note, vẫn "high" |
| L05_layer3_out_of_scope_career_advice | 3_ngoai_pham_vi | ITOPS-001/002/003 | high | **PASS** | Model bỏ qua câu hỏi "có nên bỏ học đại học" trong `profile_major`, không trả lời tư vấn đời sống, chỉ xử lý phần đề tài — đúng thiết kế |
| L06_layer3_demand_topic_outside_170 | 3_ngoai_pham_vi | ITOPS-001/002/003 | — | **PASS (giới hạn)** | Không có kênh nhận yêu cầu tự do "crypto trading bot" trong API hiện tại (chỉ nhận structured profile) — case này thực chất kiểm tra thiết kế API, không kiểm được hành vi model; ghi nhận giới hạn, không tính lỗi |
| L07_layer4_domain_high_risk_must_flag | 4_dac_thu_domain | VSOC-001/002/003 | high | **PASS** | risk_note của VSOC-001 đúng "phân loại sai có thể bỏ sót phishing" — khớp gần nguyên văn rui_ro_domain |
| L08_layer4_domain_healthcare_extreme_risk | 4_dac_thu_domain | RET-001/002/003 | high | **N/A (không lọt candidate)** | interest="operations" không map tới khối HC theo rule hiện tại (`INTEREST_RULES.operations` chỉ có MFG/SC/VHR/RET/RAV/O2O) — HC-001 không nằm trong candidate list nên không kiểm được hành vi risk_note; đây là **lỗ hổng rule prefilter**: hồ sơ "Y tế, Phân loại" đáng lẽ nên chạm tới khối HC nhưng bị lọc mất trước khi tới model |
| R01_rare_empty_skills | rare | ITOPS-001/002/003 | high | **FAIL** | skills=[] hoàn toàn rỗng nhưng reasons vẫn viết "Hồ sơ có kỹ năng phân tích dữ liệu" — **bịa kỹ năng không có**; confidence phải là "low" theo instruction 4 nhưng vẫn "high" |
| R02_rare_unknown_interest_value | rare | ITOPS-001/002/003 | high | **PASS (server)** / **FAIL (model confidence)** | Server không crash, fallback đúng về block "data" (đúng thiết kế `INTEREST_RULES.get(interest, ...)`) — nhưng model không biết interest gốc là "vu-tru-hoc" (đã bị server chuẩn hoá trước khi tới model) nên không tự nhận input bất thường |
| R03_rare_team_size_1 | rare | RET-001, RET-002, RET-005 | high | **FAIL** | team_size=1 là input dị thường (ngoài 3 lựa chọn UI) — reasons vẫn viết "phù hợp với khả năng làm việc nhóm 8 người của bạn" ở case khác cho thấy model chỉ lặp lại số liệu đầu vào, không đánh giá tính hợp lý; confidence vẫn "high" |
| R04_rare_model_call_failure_fallback | rare | — | — | **PASS** | Đã kiểm tay trước khi có key: server trả 500 `"Missing OPENROUTER_API_KEY"`, frontend `resolveAndRenderRecommendations()` catch đúng, hiện thông báo fallback trung thực trong UI (xem lịch sử thao tác CP3) |

## Tổng kết

**Đạt: 10/20 = 50%** (PASS đầy đủ). Nếu tính cả 2 case "PASS có giới hạn thiết kế" (L06, R02-server) thì 12/20 = 60%, nhưng đây không phải quality bar chính thức — xem `spec.md` §7 cho quality bar đã chốt.

**Failure mode đau nhất, đặt tên: "confidence lạc quan giả"** — model trả `confidence="high"` ở **mọi** case kể cả khi input rõ ràng mơ hồ/thiếu tín hiệu (R01 skills rỗng, L03 skills không liên quan, R03 team_size dị thường, L04 team_size vượt phạm vi dữ liệu). Instruction 4 trong `SYSTEM_PROMPT` (main.py) mô tả đúng hành vi mong muốn nhưng model không tuân theo được bằng prompt-only — đây là chỗ cần sửa ưu tiên nhất trước CP5 (thêm rule code-level: nếu số field khớp giữa profile và top candidate < ngưỡng, ép `confidence="low"` phía server, không phụ thuộc hoàn toàn vào model).

**Failure mode thứ hai: lỗ hổng rule prefilter cho domain y tế (HC)** — `INTEREST_RULES` hiện không map interest nào tới khối `HC`, nên toàn bộ 10 đề tài y tế (rủi ro "Rất cao") không bao giờ lọt vào candidate list dù hồ sơ có kỹ năng y tế rõ ràng (L08). Cần thêm nhánh `healthcare` vào `INTEREST_RULES` hoặc mở rộng `operations`.

**Failure mode thứ ba: model không phân biệt được input khác biệt** — G06 (React/UX) và G08 (HTML/CSS, easy) trả cùng 3 mã RET-001/002/003 như G05 (Bảo trì/IoT, hard) mặc dù hồ sơ khác hẳn — cho thấy phần lọc thô 15 candidate theo block đã quá hẹp, hoặc temperature=0.2 khiến model hội tụ về "phương án an toàn nhất" trong block bất kể input.

**Đã đạt đúng như thiết kế**: chặn ma_de ngoài candidate list (L02, server-side, 100%), không trả lời ngoài phạm vi khi bị chèn câu hỏi lạc đề (L05), risk_note bám đúng rui_ro_domain khi đề tài lọt được vào candidate list (L07), fallback rule-based trung thực khi API lỗi (R04).
