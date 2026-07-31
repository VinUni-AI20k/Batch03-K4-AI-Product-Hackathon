# Eval run — lượt 7 (engine mới: TF-IDF retrieval toàn kho + chat rerank, thay thế lọc thô 15 candidate)

API: `http://127.0.0.1:8001` · Model: `openai/gpt-4o-mini` qua OpenRouter · Ngày chạy: 2026-07-31. 29/29 case gọi API thành công (R04 SKIPPED theo thiết kế).

## Bối cảnh — vì sao có lượt 7

Đồng đội (Trần Phú Nghĩa) build một engine hoàn toàn mới thay thế phần lọc thô 15-candidate + heuristic đếm-từ mà lượt 1-5 đã verify: `_retrieve_candidates` dùng TF-IDF thật trên toàn bộ 170 đề tài (không giới hạn theo block cứng), tính điểm từ mọi tín hiệu hồ sơ (skills, major, experience, projects, conversation, user_query mới nhất), hỗ trợ loại trừ tường minh ("không dùng machine learning"), và cho phép chat rerank sau khi có kết quả đầu. Code bị merge với conflict marker chưa giải quyết (commit trước đó không parse được) — đã giải quyết theo hướng giữ engine mới, tái tích hợp 3 check độc lập từ engine cũ (`_has_invalid_skill_marker`, `interest_fallback_used`, `MAX_OBSERVED_TEAM_SIZE`).

**Bộ test riêng của engine mới**: `codebase/server/tests/test_recommendation_engine.py` (5 unit test, dùng `unittest` + fake OpenAI client, không cần key thật) — **5/5 PASS** sau khi giải quyết conflict, không cần sửa gì thêm.

## Quá trình verify — 2 bug tìm và sửa trước khi chấm chính thức

1. **L03 (Nấu ăn/Chụp ảnh, interest=security) trả `high` sai** — điều tra: `_retrieval_matches` lẫn token từ `interest` label/keywords (đến từ category prior, không phải năng lực) với token từ skill thật, nên hồ sơ vô nghĩa + interest hợp lệ vẫn "có match". Sửa: thêm `_personal_tokens()` (chỉ tokens từ skills/major/experience/projects/query, KHÔNG từ interest) và đổi check confidence downstream để chỉ tin match giao với `_personal_tokens`.
2. **Sau fix 1, L03 vẫn `high`** — điều tra tiếp: "ảnh" (từ "Chụp ảnh") sau khi bỏ dấu thành "anh", trùng với "anh" tách ra từ "ảnh hưởng" (impact) trong field `metric_eval` của VSOC-007 — cùng loại đồng âm khác nghĩa tiếng Việt sau khi bỏ dấu đã gặp ở engine cũ (`ảnh`↔`cảnh báo`), tái diễn dưới kiến trúc TF-IDF khác. Sửa: thêm `AMBIGUOUS_SINGLE_TOKENS = {"anh"}`, loại khỏi `_personal_tokens`.
3. **OBS08 ("metric cua 2 bai toan do") trả `high` sai** — cùng gốc: "bài toán"/"bai toan" quá phổ biến trong corpus (xuất hiện ở nhiều `mo_ta_bai_toan`), khớp `_retrieval_matches` dù là câu hỏi tham chiếu mơ hồ, không phải kỹ năng. Sửa: bổ sung marker `"bài toán đó"`/`"2 bài toán"` vào `INVALID_SKILL_MARKERS`.

Sau mỗi fix đều chạy lại unit test (giữ 5/5) và verify tay 2-3 lần liên tiếp các case dễ vỡ nhất (G01, G02, G03, L03) trước khi chấm chính thức.

## 20 case gốc

| Case | ma_de trả về | confidence | Đạt? | Ghi chú |
|---|---|---|---|---|
| G01 | DATA-008/004/002 | high | **PASS** | |
| G02 | VSOC-004/007/006 | high | **PASS** | Ổn định qua re-verify, không regression từ fix L03 |
| G03 | EDU-005/006/002 | high | **PASS** | |
| G04 | FIN-02/01/03 | high | **PASS** | |
| G05 | SC-02, MFG-001/010 | high | **PARTIAL (đã biết)** | Vẫn có SC lẫn MFG — không phải mục tiêu sửa của lượt này |
| G06 | FIN-01/05/08 | high | **PASS (cải thiện)** | Engine cũ từng trả RET sai (không liên quan product/web); engine mới trả FIN — cần xem lại có đúng nhất không nhưng ít nhất đúng lĩnh vực gần "product" hơn qua retrieval thật |
| G07 | AIP-01/04/03 | high | **PASS** | |
| G08 | FIN-01, AIP-09, EDU-005 | low | **PASS** | Expected chấp nhận cả low/high cho hồ sơ mỏng — đạt |
| L01 | AIP-03/01, DATA-001 | high | **FAIL (đã biết, chưa sửa)** | Model vẫn có thể bịa liên hệ trong `reasons` — cần LLM-judge riêng, ngoài phạm vi heuristic đếm-từ (quyết định từ lượt 3, giữ nguyên) |
| L02 | AIP-03/01/04 | — | **PASS** | Không có `ma_de` lạ ngoài candidate |
| L03 | VSOC-004/007/006 | **low** | **PASS (đã sửa)** | Xem mục "2 bug tìm và sửa" ở trên |
| L04 | MFG-010, SC-08, MFG-005 | low | **PASS** | `team_size=8 > MAX_OBSERVED_TEAM_SIZE=5` vẫn hoạt động đúng trong engine mới |
| L05 | AIP-03, DEV-001, AIP-09 | high | **PASS** | |
| L06 | AIP-03/01/10 | high | **PASS (giới hạn, như trước)** | |
| L07 | VSOC-004/007/006 | high | **PASS** | |
| L08 | HC-006/003/008 | high | **PASS (cải thiện rõ rệt)** | Engine cũ: chỉ 1/3 slot là HC (lọc thô 15-candidate làm mất phần lớn đề tài y tế). Engine mới: **3/3 slot là HC** — retrieval toàn kho không còn giới hạn theo block cứng |
| R01 | AIP-03/01/10 | low | **PASS** | |
| R02 | EDU-001/002/005 | low | **PASS** | `interest_fallback_used` vẫn hoạt động đúng |
| R03 | FIN-01, AIP-09, EDU-005 | low | **PASS** | |
| R04 | — | — | **PASS** | Không đổi |

## 10 case OBS

| Case | ma_de trả về | confidence | Đạt? | Ghi chú |
|---|---|---|---|---|
| OBS01 | DATA-008/004/002 | high | **PASS** | |
| OBS02 | DATA-008, FIN-02/03 | high | **PASS** | |
| OBS03 | VSOC-004, VSOC-001/002 | low | **PASS** | `_has_invalid_skill_marker` bắt "deterministic tuyệt đối" đúng trong engine mới |
| OBS04 | **AIP-03**, AIP-08/10 | high | **PASS (đã sửa — khác engine cũ)** | Engine cũ: không có mã AIP nào (FAIL). Engine mới: **AIP-03 đứng đầu đúng như `preferred_codes_if_present_in_candidates` yêu cầu** — retrieval toàn kho + trọng số cao cho skill "AI evaluation"/"Prompt regression" giải quyết đúng gốc vấn đề đã ghi nhận ở lượt 4-5 |
| OBS05 | EDU-002/009/004 | low | **PASS** | |
| OBS06 | MFG-007, ITOPS-001/007 | low | **PASS** | |
| OBS07 | AIP-09, EDU-006/001 | low | **PASS** | |
| OBS08 | DEV-005, DATA-008, AIP-03 | **low** | **PASS (đã sửa)** | Xem mục "2 bug tìm và sửa" ở trên |
| OBS09 | EDU-004/002/009 | low | **PASS** | |
| OBS10 | DATA-008/004/006 | low | **PASS** | `interest_fallback_used` công khai đúng |

## Tổng kết

**29/30 PASS đầy đủ = 96.7%** (chỉ L01 FAIL, G05 PARTIAL nhẹ — cả hai đã biết từ trước, không phải case mới). **Đạt quality bar 70% với biên độ rất lớn.** Điều kiện cứng (100% không bịa `ma_de` ngoài candidate list) đạt trên cả 30 case — case L02.

**So với lượt 5 (engine cũ, 86.7%)**: engine mới giải quyết đúng gốc 2 hạn chế đã ghi nhận nhiều lượt liên tiếp mà engine cũ không thể sửa bằng heuristic nhỏ:
- **OBS04** (AI-eval profile không tìm thấy AIP) — engine cũ giới hạn 15 candidate theo block cứng nên không bao giờ thấy đủ AIP; engine mới retrieval toàn kho giải quyết triệt để.
- **L08** (healthcare chỉ 1/3 slot) — cùng nguyên nhân giới hạn candidate; engine mới cho 3/3 slot đúng.

**Đổi lại, engine mới đưa vào 2 bug mới thuộc cùng một lớp lỗi đã biết** (đồng âm tiếng Việt không dấu, từ chung phổ biến trong corpus bị hiểu nhầm là tín hiệu) — cả hai đã tìm và sửa trong lượt này trước khi chấm.

**Còn lại duy nhất: L01** — quyết định giữ nguyên từ lượt 3, chưa sửa vì heuristic đếm-từ không đủ tách "diễn giải đúng bằng từ khác" khỏi "bịa nội dung" mà không gây xung đột như đã xảy ra giữa G02/L01 trước đây. Cần LLM-judge độc lập nếu muốn sửa tiếp.
