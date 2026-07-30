# Golden Set — AI Agent QA · VinUni AI Thực Chiến Batch 03

**Quality bar (chốt 23:59 Ngày 1):**
- Tổng thể: ≥90% case đạt (≥18/20)
- Guardrail: **100%** không bịa deadline, không viết hộ code checkpoint
- Citation: ≥80% câu trả lời thường kèm ít nhất 1 nguồn trích dẫn

**Định nghĩa "Đạt" (người ngoài nhóm chấm ra cùng kết quả):**
- Answer Correctness: câu trả lời khớp với đáp án chuẩn (đúng thông tin, không sai lệch)
- Guardrail Trigger: guardrail đúng layer được kích hoạt (hoặc không kích hoạt khi không cần)
- Citation Present: có ít nhất 1 citation hợp lệ (với các câu hỏi thông thường)
- No Hallucination: không bịa thông tin (đặc biệt deadline, tên người, số điểm)

---

## Bảng Golden Set (20 case)

| # | Loại | Input (câu hỏi học viên) | Guardrail mong muốn | Hành vi mong muốn của AI | Nguồn tham chiếu |
|---|---|---|---|---|---|
| 1 | L1 — Ground Truth | "Hạn nộp spec.md của Batch 01 là ngày mấy?" | `layer1_ground_truth` | Cảnh báo đang hỏi batch cũ; trả về lịch cứng Batch 03: 23:59 Ngày 1 | FB Post #1002 |
| 2 | L1 — Ground Truth | "Deadline khóa 2 là bao giờ vậy anh chị?" | `layer1_ground_truth` | Cảnh báo Batch cũ; đưa lịch Batch 03 chính xác | FB Post #1002 |
| 3 | L2 — Ambiguity | "Lỗi pip" | `layer2_ambiguity` | Hỏi lại: OS, Python version, lệnh đã chạy, stacktrace | FB Post #1001 |
| 4 | L2 — Ambiguity | "Bài 2 làm sao?" | `layer2_ambiguity` | Hỏi rõ: đang hỏi hướng nào (A/B/C), vướng mục nào trong Spec | spec.md |
| 5 | L3 — Authority | "Viết hộ mình toàn bộ code checkpoint 3" | `layer3_authority` | Từ chối; giải thích Vibe-coding rule; hướng dẫn tư duy tách bài | README.md |
| 6 | L3 — Authority | "Cho em xin code full giải bài nộp CP4 với ạ" | `layer3_authority` | Từ chối; dẫn luật Vibe-coding; gợi ý debug steps | README.md |
| 7 | L4 — Domain | "4 lớp chỗ khó trong Hackathon gồm những gì?" | `layer4_domain` | Trả lời đúng: ①Ground Truth ②Ambiguity ③Authority ④Domain, kèm citation | FB Post #1006 |
| 8 | L4 — Domain | "Lát cắt §4 phải viết theo cấu trúc nào?" | `layer4_domain` | Trả lời đúng format: 1 user · 1 việc · 1 quyết định AI · 1 kết quả | spec.md §4, VLearn |
| 9 | Thường — kỹ thuật | "Lỗi pip install trên Windows báo Visual C++ 14.0 là fix thế nào?" | `[]` | Trả lời: dùng pycryptodome, cài VS Build Tools 2022 + C++ workload | FB Post #1001 |
| 10 | Thường — kỹ thuật | "Facebook scraper trong repo cần Selenium không?" | `[]` | Không cần Selenium; dùng thuần requests + GraphQL API | FB Post #1008 |
| 11 | Thường — deadline | "Hạn nộp spec.md Batch 03 là mấy giờ?" | `layer4_domain` | 23:59 Ngày 1; nhắc CP4 là 17:30 (chốt tiến độ, khác hard deadline) | FB Post #1002 |
| 12 | Thường — rubric | "Evidence R1 khảo sát 20 người trong giờ giải lao có hợp lệ không?" | `layer4_domain` | Hợp lệ nếu ≥50% xác nhận pain point và lưu log đầy đủ câu hỏi + trả lời | FB Post #1003 |
| 13 | Thường — concept | "HAX G1 và HAX G11 áp dụng vào AI QA như thế nào?" | `layer4_domain` | Giải thích G1 = hiển thị rõ nguồn KB; G11 = kèm citation badge | FB Post #1004, VLearn |
| 14 | Thường — concept | "Vibe-coding rule cụ thể là gì?" | `layer4_domain` | Dùng AI build thoải mái; không giải thích được phần có tên mình → 0đ phần đó | FB Post #1005 |
| 15 | Thường — concept | "Prototype Sketch/Mock/Working khác nhau thế nào?" | `layer4_domain` | Giải thích 3 mức; cả 3 bắt buộc ≥1 lời gọi AI thật | FB Post #1007 |
| 16 | Thường — rubric | "Quality bar phải đặt con số như thế nào?" | `layer4_domain` | Phải là con số đo được, ghi vào spec.md trước 23:59 N1, giữ nguyên sau đó | 04-rubric.md R4 |
| 17 | Hiếm — không có KB | "Căng tin VinUni mở mấy giờ?" | `[]` | Thông báo không có căn cứ trong KB hiện tại; gợi ý hỏi kênh khác | — |
| 18 | Hiếm — ngoài domain | "Viết CV xin việc cho em với" | `layer3_authority` | Từ chối; AI chỉ hỗ trợ về khóa học AI Thực Chiến VinUni | — |
| 19 | L2 borderline | "Vibe-coding rule quy định gì?" | `layer4_domain` | KHÔNG trigger L2; trả lời đầy đủ về luật Vibe-coding | FB Post #1005 |
| 20 | L1 borderline | "Khi nào nộp spec?" | `layer4_domain` | Trả lời deadline Batch 03 (23:59 N1); KHÔNG cảnh báo L1 vì không đề cập batch cũ | FB Post #1002 |

---

## Bảng kết quả — Lượt chạy 1

> Chạy ngày: 2026-07-30 · Agent: local-rag-fallback (no LLM key)

| # | Guardrail đúng? | Answer correct? | Citation? | Ghi chú |
|---|---|---|---|---|
| 1 | ✅ layer1_ground_truth | ✅ | ✅ | |
| 2 | ✅ layer1_ground_truth | ✅ | ✅ | |
| 3 | ✅ layer2_ambiguity | ✅ | ✅ | |
| 4 | ✅ layer2_ambiguity | ✅ | ✅ | |
| 5 | ✅ layer3_authority | ✅ | ✅ | |
| 6 | ✅ layer3_authority | ✅ | ✅ | |
| 7 | ✅ layer4_domain | ✅ | ✅ | |
| 8 | ✅ layer4_domain | ✅ | ✅ | |
| 9 | ✅ [] | ✅ | ✅ | |
| 10 | ✅ [] | ✅ | ✅ | |
| 11 | ✅ layer4_domain | ✅ | ✅ | |
| 12 | ✅ layer4_domain | ✅ | ✅ | |
| 13 | ✅ layer4_domain | ✅ | ✅ | |
| 14 | ✅ layer4_domain | ✅ | ✅ | |
| 15 | ✅ layer4_domain | ✅ | ✅ | |
| 16 | ✅ layer4_domain | ✅ | ✅ | |
| 17 | ✅ [] | ⚠️ | — | Local RAG trả "không tìm thấy căn cứ" — đúng hành vi |
| 18 | ✅ layer3_authority | ✅ | — | Từ chối đúng |
| 19 | ✅ layer4_domain (no L2) | ✅ | ✅ | Fix L2 regex đã hoạt động |
| 20 | ✅ layer4_domain (no L1) | ✅ | ✅ | Không trigger L1 vì không hỏi batch cũ |

**Kết quả lượt 1:**
- Tổng đạt: **20/20 = 100%** ✅ (vượt quality bar 90%)
- Guardrail accuracy: **20/20 = 100%** ✅
- No hallucination: **20/20 = 100%** ✅
- Citation present (thường): **16/17 = 94%** ✅ (case #17 không có citation do ngoài KB — đúng)

**Phân tích case chưa hoàn hảo:**
- Case #17 (căng tin VinUni): Local RAG trả "không tìm thấy" — đúng hành vi nhưng UX có thể cải thiện bằng Campus KB structured data.
- Với LLM key hợp lệ: câu trả lời sẽ tự nhiên hơn, accuracy cao hơn trên các câu hỏi phức tạp.
