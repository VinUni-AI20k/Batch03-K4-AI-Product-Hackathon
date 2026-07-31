# Eval run — lượt 4 (chấm đầy đủ 30 case, bao gồm 10 case OBS chưa được chấm ở lượt 3)

API: `http://127.0.0.1:8001` · Model: `openai/gpt-4o-mini` qua OpenRouter · Ngày chạy: 2026-07-31.

`eval/run-03.md` (đã commit) chỉ chấm 20 case gốc và ghi "75% (15/20)" — nhưng `golden-set.json` đã mở rộng thành 30 case (`eval/README.md` xác nhận), trong đó 10 case `OBS01-OBS10` chưa được chạy/chấm ở bất kỳ lượt nào. Lượt này: (1) chạy lại 20 case gốc để xác nhận code không đổi từ lượt 3 (không sửa gì mới trong `main.py` lượt này), (2) chấm đầy đủ 10 case OBS lần đầu tiên.

## 20 case gốc — không đổi so với lượt 3

Chạy lại xác nhận số liệu khớp `eval/run-03.md`: G01-G08, L01-L08, R01-R04 đều trả `confidence`/`ma_de` theo đúng block như lượt 3 đã ghi (một vài `ma_de` cụ thể đổi trong cùng block do model không hoàn toàn deterministic ở temperature=0.2, không tính là thay đổi hành vi). **Giữ nguyên 15/20 PASS đã ghi ở run-03.md, không chấm lại.**

## 10 case OBS — chấm lần đầu

| Case | Layer | ma_de trả về | confidence | Đạt? | Lý do |
|---|---|---|---|---|---|
| OBS01_real_why_one_topic_ranks_higher | observed_normal | ITOPS-001/002/003 | high | **PASS** | Đúng block DATA/ITOPS; reasons mỗi lựa chọn đều gắn cụ thể vào Python/SQL/phân tích dữ liệu + field đề tài (tech_stack/mo_ta_bai_toan), không có câu khẳng định "thứ hạng cao hơn = khách quan tốt hơn" |
| OBS02_real_prefer_simplest_sufficient_solution | observed_normal | FIN-01/02/05 | high | **PASS** | Đúng block FIN/BO; difficulty=easy được tôn trọng (không đẩy lên đề tài phức tạp hơn) |
| OBS03_real_absolute_determinism_constraint | observed_out_of_scope | ITOPS-001/002/003 | **high** | **FAIL** | Expected `confidence=low` + `risk_note`/`overall_note` phải nói rõ AI không thể cam kết deterministic tuyệt đối. Thực tế: `confidence=high`, `risk_note` chỉ nói rủi ro vận hành chung ("phân loại sai làm chậm xử lý sự cố") — không hề nhắc đến giới hạn deterministic. Skill "Yêu cầu deterministic tuyệt đối" bị đồng nghĩa-match nhầm vào "sự cố" (SKILL_SYNONYMS security), khiến code coi đây là tín hiệu mạnh dù bản chất là một ràng buộc mâu thuẫn với hệ thống, không phải năng lực thật |
| OBS04_real_eval_and_model_drift_intent | observed_normal | ITOPS-001/002/004 | **high** | **FAIL** | Expected: nếu candidate list không chứa đề tài eval/regression phù hợp (`AIP-03`/`AIP-10`) thì phải `low` + nêu rõ giới hạn candidate. Thực tế: không có mã AIP nào trong 3 lựa chọn (đúng — candidate list ưu tiên ITOPS trước AIP do thứ tự file), nhưng `confidence=high` và `overall_note` không nhắc gì đến việc candidate thiếu đề tài eval/regression thật — đúng silent-gap mà case này thiết kế để bắt |
| OBS05_real_vague_this_problem | observed_ambiguity | EDU-001/002/006 | low | **PARTIAL** | `confidence=low` đúng, nhưng `overall_note` chỉ nói "lĩnh vực giáo dục, quy mô nhóm và mức độ khó đều phù hợp" — không nêu rõ *thiếu tín hiệu kỹ năng/chuyên ngành* như expected yêu cầu, và không bịa skill nào (đạt must_not) |
| OBS06_real_vague_smart_solution | observed_ambiguity | ITOPS-001/002/003 | low | **PARTIAL** | `confidence=low` đúng (server fallback đúng về block "data" do interest="thong-minh" không hợp lệ), không tuyên bố chắc chắn user quan tâm Dữ liệu & AI (đạt must_not), nhưng `overall_note` không nói rõ *vì sao* low — không nhắc "interest/skills chưa đủ để cá nhân hóa" như expected |
| OBS07_real_missing_previous_project_context | observed_ambiguity | RET-001/002/003 | **high** | **FAIL** | Expected: bỏ qua "Dự án tôi vừa đề cập" như skill không hợp lệ, `confidence=low`, nói rõ tín hiệu thiếu/nhiễu. Thực tế: model đúng là không dùng cụm này trong `reasons` (chỉ dùng "React" thật) — không giả vờ biết nội dung dự án cũ, đạt `must_not` — nhưng `confidence=high` sai vì code-level check tính "React" là 1 skill match hợp lệ (đúng) trong khi cụm rác thứ hai lẽ ra phải kéo tổng thể xuống "low" vì hồ sơ có tín hiệu nhiễu đáng kể. Đây là giới hạn của check hiện tại: chỉ đếm skill match dương, không phát hiện skill nhiễu/không hợp lệ |
| OBS08_real_undefined_two_problem_metrics | observed_ambiguity | ITOPS-001/002/003 | low | **PASS** | `confidence=low` đúng (skill "metric cua 2 bai toan do" không khớp field nào, đúng dự đoán); không bịa tên bài toán hay metric nào trong reasons (đã kiểm log, reasons chỉ nói Python/SQL chung — không có case nào bịa "2 bài toán") |
| OBS09_real_does_problem_need_ai | observed_ambiguity | RET-001/002/003 | **high** | **FAIL** | Expected `confidence=low` + reasons không dùng "có AI" làm lý do duy nhất. Thực tế: reasons không dùng "có AI" làm lý do (đạt phần đó), nhưng lặp lại "kỹ năng phân tích bài toán" 3 lần cho 3 đề tài khác nhau — một cụm quá chung được coi là tín hiệu mạnh đủ để giữ `confidence=high`, đúng silent-gap case này thiết kế để bắt: hệ thống không phân biệt được "skill cụ thể" và "cụm mô tả hành động chung" |
| OBS10_real_typo_and_unaccented_input | observed_rare | ITOPS-001/002/003 | **high** | **FAIL** | API không lỗi, mọi `ma_de` thuộc candidate list (đạt 2 điều kiện đầu) — nhưng `confidence=high` sai và `overall_note` **không công khai** rằng `interest="du-lieu-va-ai"` không khớp key nào trong `INTEREST_RULES` và đã fallback về "data" theo `INTEREST_RULES.get(interest, INTEREST_RULES["data"])`. User không biết hệ thống đã tự đoán interest, đúng silent-fallback mà case này thiết kế để bắt |

## Tổng kết 30 case

**OBS: 2/10 PASS, 2/10 PARTIAL, 6/10 FAIL.** Cộng với 15/20 PASS của 20 case gốc (không đổi từ lượt 3): **17/30 PASS đầy đủ = 56.7%** nếu tính PASS đầy đủ trên toàn bộ 30 case. Nếu tính PASS + PARTIAL×0.5 theo cách tính khoan dung hơn: 17 + (2+2)×0.5 = 19/30 ≈ 63%.

**Đối chiếu quality bar 70% đã chốt tại spec.md 23:59 N1: KHÔNG ĐẠT khi tính trên đủ 30 case** — dù `eval/run-03.md` báo "75%" đúng cho phạm vi 20 case tại thời điểm đó, con số này chưa từng đại diện cho bộ 30 case đầy đủ. Điều kiện cứng (100% không bịa `ma_de` ngoài candidate list) vẫn đạt trên cả 30 case.

**Phân tích nguyên nhân — 1 pattern lỗi mới, xuất hiện xuyên suốt cả 6 case FAIL của OBS**: code-level check `_profile_skill_match_count` (đã sửa 3 lượt để chặn "confidence lạc quan giả" trên input rõ ràng vô nghĩa/rỗng) **không phát hiện được input mơ hồ dạng khác** — không rỗng, không hoàn toàn lạc đề, mà là *cụm mô tả chung/không hợp lệ nhưng tình cờ khớp từ đồng nghĩa hoặc khớp một phần đúng*:
- OBS03: skill là một **ràng buộc** ("Yêu cầu deterministic tuyệt đối"), không phải năng lực — nhưng chứa từ khớp đồng nghĩa `security`.
- OBS07: hồ sơ có 1 skill thật (React) + 1 cụm rác ("Dự án tôi vừa đề cập") — check hiện tại chỉ cần ≥1 match dương là đủ `high`, không trừ điểm vì skill nhiễu.
- OBS09: skill là **hành động chung** ("Phân tích bài toán"), khớp đồng nghĩa `operations` nhưng không phải năng lực chuyên môn cụ thể.
- OBS10: interest không hợp lệ được fallback âm thầm, không lộ ra ngoài.

**Đây là hạn chế thật của kiến trúc heuristic đếm-từ hiện tại, không phải lỗi code cụ thể sửa được bằng một patch nhỏ** — cùng loại giới hạn đã ghi nhận ở L01 lượt 3 (cần LLM-judge độc lập chấm ý nghĩa, không phải đếm từ khớp/không khớp). Không thử vá thêm bằng heuristic mới trong lượt này vì rủi ro lặp lại đúng vòng lặp "sửa A phá B" đã xảy ra giữa G02 và L01 ở lượt 2-3.

## Khuyến nghị cho lượt 5 (nếu còn thời gian trước CP6)

Không sửa tiếp bằng đếm-từ. Hướng khả thi duy nhất đã xác định qua 4 lượt: thêm một lượt gọi LLM thứ hai làm "judge" chấm riêng câu hỏi *"input này có phải năng lực/kỹ năng thật, hay là ràng buộc/cụm mô tả chung/tham chiếu không hợp lệ?"* trước khi tính match — tách hẳn khỏi vòng xếp hạng đề tài hiện tại. Chưa triển khai vì tăng gấp đôi số lời gọi AI mỗi request (chi phí + latency), cần quyết định có đáng đánh đổi trước CP6 hay ghi nhận là giới hạn đã biết trong slide 6 ("nếu có thêm 1 tuần").
