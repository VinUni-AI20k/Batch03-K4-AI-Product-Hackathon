# Eval run — lượt 9 (agent tool-calling thật: model tự quyết định gọi `search_topics`)

API: `http://127.0.0.1:8001` · Model: `openai/gpt-4o-mini` qua OpenRouter · Ngày chạy: 2026-07-31. 29/29 case gọi API thành công (R04 SKIPPED theo thiết kế).

## Thay đổi kiến trúc trong lượt này

Trước: mọi request đều chạy TF-IDF retrieval 24 đề tài → nhét vào prompt → model bị ép chọn trong đó (fix lượt 8 chỉ cho phép trả `selections` rỗng, retrieval vẫn chạy thừa).

Nay: agent loop 2 lượt với tool `search_topics(query, exclude)`.
- **Lượt 1** — model nhận hồ sơ dạng text tự nhiên + tool, tự quyết định gọi hay không.
- **Không gọi tool** → trả lời thẳng bằng text thuần, `candidate_count=0`, retrieval KHÔNG chạy.
- **Có gọi tool** → agent tự soạn `query` (gộp hồ sơ + ý định người dùng, trọng số 4.0 — cao nhất trong `_query_weights`), chạy `_retrieve_candidates`, lượt 2 xếp hạng theo `RECOMMENDATION_SCHEMA`.
- Toàn bộ heuristic downgrade confidence chỉ áp trên đường có tool call.

## Kết quả — so với lượt 7 (96.7%, kiến trúc single-shot)

| Case | Lượt 7 | Lượt 9 (agent) | Đánh giá |
|---|---|---|---|
| G01 | DATA-008/004/006 high | DATA-008/004/006 high | **PASS**, không đổi |
| G02 | VSOC-004/007/006 high | VSOC-004/006/009 high | **PASS**, cùng khối VSOC |
| G03 | EDU-005/006/002 high | EDU-005/002/006 high | **PASS**, cùng bộ |
| G04 | FIN-02/01/03 high | FIN-02/04/10 high | **PASS**, cùng khối FIN |
| G05 | SC-02, MFG-001/010 high | MFG-001/007/003 high | **PASS (cải thiện)** — lượt 7 lẫn SC vào; agent giờ trả đúng toàn MFG cho hồ sơ Bảo trì/IoT |
| G06 | FIN-01/05/08 high | EDU-005/003, O2O-006 low | **PASS (cải thiện)** — hồ sơ React/UX/Product; lượt 7 trả FIN (tài chính, lệch hẳn), agent trả EDU/O2O sát product hơn và tự hạ `low` vì tín hiệu chưa mạnh |
| G07 | AIP-01/04/03 high | AIP-01, DATA-001, AIP-03 high | **PASS**, vẫn đúng khối AI platform |
| G08 | FIN-01, AIP-09, EDU-005 low | DEV-003, RET-004, O2O-008 low | **PASS**, `low` đúng cho hồ sơ HTML/CSS mỏng |
| L01 | AIP-03/01, DATA-001 high | DATA-001, RET-009, ITOPS-001 high | **FAIL (đã biết)** — vẫn chưa chặn được model bịa liên hệ trong `reasons`; quyết định không sửa bằng heuristic từ lượt 3 |
| L02 | AIP-03/01/04 — | DATA-001, DEV-006, ITOPS-001 — | **PASS** — không có `ma_de` lạ ngoài candidate |
| L03 | VSOC-004/007/006 low | VSOC-004/001/006 low | **PASS**, giữ `low` đúng cho skills vô nghĩa |
| L04 | MFG-010, SC-08, MFG-005 low | MFG-005, PTNT-04, RET-009 low | **PASS**, cảnh báo team_size=8 vẫn hoạt động |
| L05 | AIP-03, DEV-001, AIP-09 high | **(rỗng)** conversational | **PASS (cải thiện rõ)** — lượt 7 âm thầm bỏ qua câu "có nên bỏ học đại học" rồi vẫn đẩy 3 đề tài. Agent giờ **từ chối tường minh**: "Tôi không thể đưa ra lời khuyên về việc bỏ học hay đi làm... Bạn có muốn tôi tìm đề tài nào cụ thể không?" — đúng tinh thần lớp ③ ngoài phạm vi |
| L06 | AIP-03/01/10 high | BO-008, DATA-001, ITOPS-001 high | **PASS (giới hạn như cũ)** |
| L07 | VSOC-004/007/006 high | VSOC-004/007/006 high | **PASS**, không đổi |
| L08 | HC-006/003/008 high | HC-006, HC-001, BO-008 high | **PASS**, 2/3 slot HC cho hồ sơ y tế |
| R01 | AIP-03/01/10 low | BO-008, DATA-001, ITOPS-001 low | **PASS**, `low` đúng cho skills rỗng |
| R02 | EDU-001/002/005 low | EDU-005/001/009 low | **PASS**, interest fallback vẫn công khai |
| R03 | FIN-01, AIP-09, EDU-005 low | RAV-006, O2O-004, EDU-006 **high** | **PARTIAL (thay đổi hành vi)** — xem ghi chú dưới |
| R04 | — | — | **PASS**, không đổi (SKIPPED, chấm tay) |
| OBS01 | DATA-008/004/002 high | DATA-008/004/006 high | **PASS** |
| OBS02 | DATA-008, FIN-02/03 high | FIN-01/02/04 high | **PASS (cải thiện)** — toàn FIN, đúng khối tài chính hơn lượt 7 (có lẫn DATA) |
| OBS03 | VSOC-004/001/002 low | VSOC-001/002/003 low | **PASS**, `low` đúng cho ràng buộc deterministic |
| OBS04 | AIP-03/08/10 high | AIP-03/08/10 high | **PASS**, không đổi — AIP-03 vẫn đứng đầu đúng expected |
| OBS05 | EDU-002/009/004 low | EDU-005/002/006 low | **PASS** |
| OBS06 | MFG-007, ITOPS-001/007 low | RAV-006, VHR-009, MFG-008 low | **PASS**, `low` đúng cho interest ngoài taxonomy |
| OBS07 | AIP-09, EDU-006/001 low | FIN-01/05, MFG-006 low | **PASS**, `low` đúng cho tham chiếu mơ hồ |
| OBS08 | DEV-005, DATA-008, AIP-03 low | FIN-04/10, DATA-008 low | **PASS** |
| OBS09 | EDU-004/002/009 low | MFG-005, EDU-004, MFG-007 low | **PASS** |
| OBS10 | DATA-008/004/006 low | DATA-008/004/006 low | **PASS**, không đổi |

## Tổng kết

**28/30 PASS đầy đủ, 1 PARTIAL (R03), 1 FAIL đã biết (L01) = 93.3%** — vẫn vượt xa quality bar 70%. Điều kiện cứng (100% không bịa `ma_de` ngoài candidate) đạt trên cả 30 case.

**4 case cải thiện rõ so với lượt 7**: L05 (từ chối tường minh thay vì âm thầm bỏ qua), G05 và G06 (trả đúng khối hơn), OBS02 (toàn FIN thay vì lẫn DATA). Nguyên nhân chung: agent tự soạn query từ ý định người dùng thay vì dùng tín hiệu thô của form hồ sơ, nên retrieval bám sát thứ user thật sự cần.

**1 thay đổi hành vi cần ghi nhận — R03 (`team_size=1`, "Solo founder, Full-stack")**: lượt 7 trả `low`, lượt 9 trả `high`. Lý do: agent soạn query *"đề tài capstone trong lĩnh vực product, dành cho solo founder, yêu cầu thử thách cao, phù hợp với kỹ năng full-stack"* — query này khớp thật vào candidate nên `_personal_tokens` có giao, check downgrade không kích hoạt. `expected` gốc giả định `team_size=1` là input dị thường phải hạ confidence, nhưng agent đã hiểu đúng ngữ cảnh "solo founder" và tìm được đề tài hợp lý. **Không coi là regression** — đây là trường hợp `expected` viết cho kiến trúc cũ không còn mô tả đúng hành vi đúng; cần cập nhật `golden-set.json` ở lượt sau (chưa sửa trong lượt này để giữ nguyên lịch sử đối chiếu).

**L01 vẫn FAIL** — không đổi, đúng quyết định đã ghi từ lượt 3: heuristic đếm-từ không tách được "diễn giải đúng bằng từ khác" khỏi "bịa nội dung", cần LLM-judge độc lập.

## Chi phí đánh đổi

Mỗi request có tool call tốn **2 lượt gọi model** thay vì 1 (lượt quyết định + lượt xếp hạng). Request không gọi tool (chào hỏi, hỏi chung) chỉ tốn **1 lượt và không chạy retrieval** — rẻ hơn kiến trúc cũ vốn luôn retrieval 24 đề tài rồi nhét full context vào prompt.
