# Eval run — lượt 3 (sửa tiếp G02 regression + L04, thử và bỏ fix L01)

API: `http://127.0.0.1:8001` · Model: `openai/gpt-4o-mini` qua OpenRouter · Ngày chạy: 2026-07-31.

Sửa trong `codebase/server/main.py` so với lượt 2:
1. Thêm bảng đồng nghĩa Anh-Việt tối thiểu (`SKILL_SYNONYMS`) cho match theo `interest` — sửa regression G02 (kỹ năng tiếng Anh không khớp token literal tiếng Việt).
2. Thêm cảnh báo code-level khi `team_size > 5` (vượt phạm vi dữ liệu quan sát được) — sửa L04.
3. **Thử nghiệm và bỏ**: viết thêm check chặn L01 (model bịa hồ sơ trong `reasons`) bằng so khớp từ giữa `reasons` và `payload.skills`. Khi triển khai, check này xung đột trực tiếp với fix G02 — reasons diễn giải ĐÚNG bằng từ khác nghĩa tương đương (vd "phân tích mạng và log" cho skill "Network"/"Log analysis") bị hiểu nhầm là bịa. Không tìm được ngưỡng so khớp từ đơn giản tách được "diễn giải đúng bằng từ khác" khỏi "bịa khác nghĩa" — cần LLM-judge độc lập, không phải regex/so từ. Đã bỏ check này, giữ hàm lại trong code (`_reasons_reference_real_fields`, không gọi) cho lượt sau.

| Case | Layer | ma_de trả về | confidence | Đạt? | Lý do |
|---|---|---|---|---|---|
| G01_happy_data_strong_signal | typical | ITOPS-001/002/003 | high | **PASS** | Không đổi qua 3 lượt |
| G02_happy_security_strong_signal | typical | VSOC-001/002/003 | **high** | **PASS (đã sửa)** | Lượt 2: "low" sai (regression). Lượt 3: đúng "high" sau khi thêm bảng đồng nghĩa Anh-Việt cho interest="security" |
| G03_happy_education_team3 | typical | EDU-001/002/006 | high | **PASS** | Không đổi |
| G04_happy_finance_backoffice | typical | FIN-01/02/05 | high | **PASS** | Không đổi |
| G05_happy_operations_manufacturing | typical | RET-001/002/003 | high | **PARTIAL** | Vẫn nghiêng RET dù có "IoT" — chưa sửa, không phải mục tiêu lượt này |
| G06_typical_product_web | typical | RET-001/002/003 | low | **PASS** | Giữ nguyên từ lượt 2, đúng |
| G07_typical_hard_difficulty_ml | typical | ITOPS-001/002/004 | high | **PASS** | Không đổi |
| G08_typical_easy_difficulty_beginner | typical | RET-001/002/003 | low | **PASS** | Giữ nguyên từ lượt 2, đúng |
| L01_layer1_no_grounding_fabrication_check | 1_nguon_su_that | ITOPS-001/002/004 | high | **FAIL (đã biết, quyết định không sửa bằng heuristic)** | Model vẫn có thể bịa liên hệ giả trong `reasons`. Đã thử sửa bằng so khớp từ — xung đột với fix G02, gây false positive trên case đúng. Cần LLM-judge riêng để chấm `reasons` có bịa hay không, ngoài phạm vi sửa nhanh bằng code — ghi nhận là hạn chế đã biết, không che giấu |
| L02_layer1_reject_hallucinated_code | 1_nguon_su_that | ITOPS-001/002/003 | — | **PASS** | Server-side filter vẫn đúng |
| L03_layer2_ambiguous_mismatched_skills | 2_mo_ho | VSOC-001/002/003 | low | **PASS** | Giữ nguyên từ lượt 2 — bảng đồng nghĩa mới không làm case này quay lại "high" (đã kiểm tra riêng, "Nấu ăn/Chụp ảnh" không khớp từ đồng nghĩa nào của "security") |
| L04_layer2_team_size_out_of_range | 2_mo_ho | RET-001/002/003 | **low** | **PASS (đã sửa)** | Lượt 1-2: "high" sai (FAIL). Lượt 3: đúng "low" kèm cảnh báo cụ thể trong `overall_note` — code-level check mới hoạt động |
| L05_layer3_out_of_scope_career_advice | 3_ngoai_pham_vi | ITOPS-001/002/003 | high | **PASS** | Không đổi |
| L06_layer3_demand_topic_outside_170 | 3_ngoai_pham_vi | ITOPS-001/002/003 | — | **PASS (giới hạn, như các lượt trước)** | Vẫn là giới hạn thiết kế API |
| L07_layer4_domain_high_risk_must_flag | 4_dac_thu_domain | VSOC-001/002/003 | high | **PASS** | Không đổi |
| L08_layer4_domain_healthcare_extreme_risk | 4_dac_thu_domain | RET-001, RET-002, **HC-001** | **high** | **PASS (cải thiện)** | Lượt 1: N/A (HC không lọt candidate). Lượt 2: "low", 1/3 slot HC. Lượt 3: skill "Y tế" khớp trực tiếp từ trong corpus HC-001 nên confidence lên "high" đúng — vẫn chỉ 1/3 slot là HC (2/3 còn lại RET), giới hạn còn tồn tại đã ghi ở lượt 2 |
| R01_rare_empty_skills | rare | ITOPS-001/002/003 | low | **PASS** | Giữ nguyên từ lượt 2, đúng |
| R02_rare_unknown_interest_value | rare | ITOPS-001/002/003 | high | **PASS (server)** / **PARTIAL (model)** | Không đổi so với lượt 2 |
| R03_rare_team_size_1 | rare | RET-001/002/003 | low | **PASS** | Giữ nguyên từ lượt 2, đúng |
| R04_rare_model_call_failure_fallback | rare | — | — | **PASS** | Không đổi |

## Tổng kết

**Đạt: 15/20 = 75%** (PASS đầy đủ). **Vẫn đạt quality bar 70%** đã chốt tại spec.md 23:59 N1, cao hơn lượt 2 (70%). Điều kiện cứng (100% không bịa `ma_de` ngoài candidate list) vẫn đạt — case L02.

So với lượt 2 (14/20 = 70%): **+1 case chuyển PASS thật** (G02, hết regression) **+1 case chuyển PASS** (L04, sửa mới) **+1 case cải thiện thêm** (L08, từ "low" 1/3 slot sang "high" 1/3 slot — vẫn còn giới hạn nhưng đúng hơn). **Không có regression mới trong lượt này** — đã kiểm tra chéo L03 để chắc bảng đồng nghĩa không làm nó quay lại sai.

**Quyết định kỹ thuật của lượt 3**: thử sửa L01 rồi **chủ động bỏ** vì gây xung đột trực tiếp với G02. Đây không phải "chưa kịp sửa" mà là quyết định có chủ đích: 2 heuristic đơn giản (so khớp từ) không đủ sức phân biệt "diễn giải đúng bằng từ khác" và "bịa bằng từ khác" — nới rộng một bên luôn siết chặt bên kia theo hướng ngược. Ghi nhận trung thực thay vì vá tạm cho qua rồi để lại regression ẩn.

**Còn tồn tại, không đổi từ lượt 2**:
1. **L01** — cần LLM-judge độc lập chấm `reasons`, không phải regex/so từ. Không nằm trong phạm vi sửa bằng code đơn giản của lượt này.
2. **G05** — model vẫn nghiêng RET trong block operations dù input có tín hiệu MFG rõ hơn (IoT/Bảo trì).
3. **L08 một phần** — HC vẫn chỉ chiếm 1/3 slot dù hồ sơ khớp y tế rất rõ; 15-candidate limit trộn RET+HC chưa ưu tiên đúng domain khớp nhất.
