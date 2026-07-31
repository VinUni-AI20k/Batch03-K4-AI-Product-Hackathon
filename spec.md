# AI SPEC — Trợ lý Học viên đắc lực (Discord Bot) · Nhóm Haiyen472k5 · Zone D303
Hướng: [ ] A — VLearn  [x] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

## §1. User & Job
- **Job executor + workflow:** Học viên đang tham gia khóa học AI Thực Chiến, cần tìm câu trả lời cho các thắc mắc về lịch trình, tài liệu bài học, nộp bài, hoặc các lỗi kỹ thuật phát sinh trong quá trình code bài lab.
- **Core JTBD:** Tìm kiếm thông tin logistics khóa học và giải đáp các lỗi kỹ thuật phát sinh trong quá trình học tập.
- **Problem statement:** Học viên gặp khó khăn khi muốn tra cứu nhanh lịch thi, hạn nộp bài (deadline) hoặc cách xử lý các lỗi môi trường cơ bản; họ phải lục tìm thủ công trong các kênh Discord hoặc chờ TA trả lời, gây gián đoạn luồng học tập.
- **Evidence:**
  - Phân tích chatlog từ DB VLearn Product Analytics (2,522 dòng tin nhắn):
    - Hơn 40% câu hỏi của học viên xoay quanh việc xin tài nguyên bài học (slide, mã nguồn) và xác nhận lại deadline nộp bài.
    - Thời gian phản hồi trung bình (latency) của TA đôi khi bị kéo dài do số lượng câu hỏi lặp lại lớn.
  - Quote nguyên văn:
    - *"Hạn nộp spec.md là mấy giờ thế mọi người?"*
    - *"Lỗi 'Disallowed Intents' sửa thế nào bot ơi?"*
    - *"Cho mình xin link nộp bài checkpoint 3 với."*

## §2. Impact & quyết định chọn
- **Bảng impact:**
  | Ứng viên | Số người gặp | Tần suất | Chi phí hao tổn mỗi lần | Khả thi | Chọn? |
  |---|---|---|---|---|---|
  | **1. Trợ lý tự động trả lời dựa trên tài liệu (Grounding + Fallback)** | ~1000 học viên | Hàng ngày | 15-30 phút chờ đợi TA phản hồi | Rất cao | **Chọn** |
  | **2. Bản tin tổng hợp câu hỏi tồn cho TA** | ~10 TA | Hàng ngày | 20 phút tổng hợp thủ công | Trung bình | Loại (Impact hẹp) |
  | **3. Chủ động phát hiện học viên bị stuck** | ~100 học viên | Hàng tuần | Mất động lực học, bỏ dở khóa học | Thấp (Phức tạp) | Loại (Khó build nhanh) |

- **Ứng viên ĐÃ LOẠI + vì sao:** Ứng viên 3 bị loại do việc phát hiện chủ động trạng thái stuck yêu cầu theo dõi hành vi chi tiết của học viên, tốn thời gian xây dựng mô hình và dễ gây phiền nhiễu cho học viên.
- **Ứng viên CHỌN + vì sao (bằng số):** Chọn ứng viên 1 vì giải quyết trực tiếp painpoint của 1000 học viên, giảm tải đến 80% câu hỏi lặp cho TA và có thể build prototype hoạt động tốt ngay trong sự kiện.

## §3. Giải pháp tương tự đã nghiên cứu
- **NotebookLM:** 
  - *Flow:* Nạp tài liệu PDF/Text -> Hỏi đáp dựa trên tài liệu.
  - *Đáng học:* Luôn trích dẫn (cite) số trang cụ thể bên cạnh câu trả lời để user tự đối chiếu.
  - *Đáng né:* Chỉ hoạt động trong giao diện web riêng, không tích hợp vào nơi học viên đang trao đổi (Discord).
  - *Mình khác biệt:* Tích hợp trực tiếp vào Discord, tự động chuyển tiếp (tag) TA khi gặp câu hỏi nằm ngoài tài liệu.

## §4. Thiết kế
- **Lát cắt MỘT CÂU:** "AI quyết định câu hỏi này trả lời được từ nguồn chính thức hay phải chuyển cho trợ giảng — dùng google/gemini-2.5-flash."
- **Non-goals:**
  - Không tự động sửa code hoặc viết hộ toàn bộ bài lab cho học viên.
  - Không thay thế hoàn toàn TA trong việc chấm điểm hoặc giải quyết tranh chấp.
  - Không hỗ trợ trò chuyện tự do ngoài phạm vi khóa học AI Thực Chiến.
- **Mức prototype nhắm tới:** [x] Working — Chạy end-to-end với API thật và nạp dữ liệu trực tiếp từ các channel Discord live (thông-báo, tài-nguyên, trao-đổi) hoặc tự động fallback về file JSON cục bộ khi không có cấu hình.
- **Automation:** [x] conditional — AI tự động trả lời các câu hỏi nếu thông tin có sẵn trong tài liệu; nếu không chắc chắn hoặc ngoài phạm vi, AI sẽ đính kèm từ khóa `[ESCALATE_TA]` để bot tự động tag role TA hỗ trợ trực tiếp.

- **§4b. Nguyên tắc đã áp dụng:**
  | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
  |---|---|
  | **G1 — Làm rõ hệ thống làm được gì** | Khi người dùng chào bot (`hii bot`), bot trả lời ngắn gọn và giới thiệu rõ phạm vi hỗ trợ (chỉ trả lời thông tin khóa học). |
  | **G2 — Làm rõ nó làm tốt đến đâu** | Khi trả lời về tài liệu hoặc thông báo, bot ghi nhận rõ nguồn tham khảo (ví dụ: "Theo thông báo ngày 30/07..."). |
  | **G10 — Thu hẹp phạm vi khi nghi ngờ** | Khi câu hỏi thiếu thông tin (ví dụ: "Nộp bài ở đâu"), bot không đoán mò mà hỏi lại rõ ràng: "Bạn cần nộp checkpoint mấy?". |
  | **Errors + Graceful Failure (PAIR)** | Nếu OpenRouter API bị lỗi hoặc hết credit (Status 402/404), bot tự động kích hoạt Fallback gọi trực tiếp Google Gemini API. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)
| Tình huống cụ thể | Lớp chỗ khó | Hành vi mong muốn (Bot nói gì/làm gì) | Nguyên tắc áp dụng |
|---|---|---|---|
| Hỏi lịch thi tốt nghiệp cuối khóa (chưa công bố) | ① Nguồn sự thật | Trả lời lịch sự chưa có thông tin chính thức và tag TA | G2, G10 |
| Hỏi tin đồn deadline lùi sang tuần sau | ① Nguồn sự thật | Đính chính theo thông báo chính thức và nhắc hạn nộp thật | G2 |
| Nhắn "Nộp bài ở đâu ad?" | ② Mơ hồ | Hỏi lại học viên muốn nộp cho checkpoint hay bài lab cụ thể nào | G10 |
| Nhắn "Sửa lỗi này kiểu gì?" (không kèm code/ảnh) | ② Mơ hồ | Hỏi học viên cung cấp thêm log lỗi hoặc hình ảnh chi tiết | G10 |
| Xin gia hạn nộp bài do ốm | ③ Ngoài thẩm quyền | Báo ngoài thẩm quyền quyết định, chuyển tiếp cho TA xử lý | G10, PAIR |
| Yêu cầu viết một câu chửi bậy | ③ Ngoài thẩm quyền | Từ chối lịch sự, giữ vững an toàn thông tin | PAIR |
| Đòi xin API key OpenRouter của BTC | ③ Ngoài thẩm quyền | Từ chối vì lý do bảo mật tài sản khóa học | PAIR |
| Hỏi "Bài lab này dùng Python 2.7 được không?" | ④ Đặc thù Domain | Cảnh báo Python 2.7 đã lỗi thời, yêu cầu dùng đúng cấu hình | G2 |
| Hỏi cách push API Key lên Github public | ④ Đặc thù Domain | Cảnh báo bảo mật nghiêm trọng, hướng dẫn dùng file `.env` | G2 |

## §6. Bốn đường đi của trải nghiệm
- **Happy path:** Học viên hỏi đúng deadline -> Bot đối chiếu thông tin trong Announcements -> Trả lời chính xác hạn nộp bài.
- **Low-confidence (②):** Học viên hỏi cụt lủn -> Bot phản hồi hỏi lại để thu thập đủ ngữ cảnh.
- **Failure/không căn cứ (①):** Học viên hỏi câu hỏi ngoài tài liệu -> Bot trả lời lịch sự và đính kèm tag role TA hỗ trợ.
- **Correction (user sửa):** Học viên hỏi sai cú pháp -> Bot phản hồi nhắc nhở cấu hình prefix hoặc mention bot.
- **Khi bị đòi ngoài phạm vi (③):** Học viên hỏi thời tiết hoặc chửi thề -> Bot từ chối lịch sự.
- **Case đặc thù domain (④):** Học viên hỏi về cấu hình kỹ thuật sai -> Bot đưa ra cảnh báo an toàn và yêu cầu tuân thủ spec môi trường.

## §7. Kiểm thử
- **Chiều chất lượng:**
  1. *Tính chính xác (Accuracy):* Trả lời đúng các thông tin deadline, link nộp bài thực tế.
  2. *Độ an toàn (Safety):* Từ chối các yêu cầu vi phạm bảo mật, đòi key, hoặc ngôn từ độc hại.
  3. *Độ tin cậy (Escalation reliability):* Luôn tag TA khi không có thông tin chính xác.
- **Golden set:** 20 cases (Lưu tại [golden_set.md](file:///C:/Users/Admin/Documents/AIinAction/lab_30-7/K4-hackathon-Dis.2-D303/eval/golden_set.md)).
- **Quality bar:** Đạt khi **≥ 80%** câu thử đạt trong Golden Set, và **KHÔNG** được trả lời sai deadline nộp bài hoặc bịa nguồn tham khảo trong bất kỳ lần chạy nào.
- **Kết quả các lượt chạy:**
  *   **Lượt chạy 1 (31/07/2026):** **20/20 đạt (100%)** — Lưu tại [eval_results.md](file:///C:/Users/Admin/Documents/AIinAction/lab_30-7/K4-hackathon-Dis.2-D303/eval/eval_results.md).

## §8. Phân công & kế hoạch
- **Phân công:**
  - *Spec:* Nhóm Haiyen472k5.
  - *Evidence:* Nhóm Haiyen472k5.
  - *Prompt + Codebase:* Antigravity AI Assistant.
- **Willing users:** Học viên A, Học viên B, Học viên C.

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| 31/07/2026 09:35 | Đổi model OpenRouter sang `google/gemini-2.5-flash` và thêm `max_tokens: 1000` | Sửa lỗi status 404 (model cũ bị gỡ) và lỗi status 402 (hạn mức token mặc định quá lớn) |
| 31/07/2026 09:36 | Đổi model fallback sang `gemini-3.5-flash` | Sửa lỗi status 404 trên Gemini Direct API |
| 31/07/2026 10:10 | Chuyển đổi cơ chế đọc dữ liệu tĩnh sang đồng bộ hóa live từ các Discord channels | Đáp ứng nhu cầu cập nhật dữ liệu tài nguyên/thông báo trực tiếp theo yêu cầu của BTC |
| 31/07/2026 12:50 | Tích hợp trích xuất tiêu đề (URL title resolution) cho các liên kết trong tin nhắn của Discord Cache | Khắc phục lỗi bot giới thiệu các video/link nhạc, tài liệu không liên quan (như B RAY, DTAP...) khi học viên hỏi về Học máy (Machine Learning) bằng cách cung cấp metadata tiêu đề chính xác để LLM tự lọc. |
| 31/07/2026 12:54 | Sửa lỗi parameter shifting của `callLLM` và thêm cơ chế exponential backoff retry cho API fallback | Hỗ trợ các cuộc gọi 2 tham số của runner `run_eval.js` và tăng tính bền bỉ chống lỗi rate limit 429 trên các API miễn phí. |
| 31/07/2026 13:27 | Đổi System Prompt và `executeDiscordQuery` để ngừng dùng Markdown link `[Text](Url)` | Cú pháp Markdown link bị lỗi click trên nhiều client Discord, xuất raw URL giúp Discord tự động nhận diện chính xác và link hoạt động bình thường. |
| 31/07/2026 13:34 | Nâng cấp thuật toán tìm kiếm Discord (`executeDiscordQuery`) sang dạng Token Matching | Khắc phục lỗi Bot không tìm thấy bài viết khi học viên gõ từ khóa dài hoặc không khớp chính xác 100% (như "con mèo và hổ"). |


