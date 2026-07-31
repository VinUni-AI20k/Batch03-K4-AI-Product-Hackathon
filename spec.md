# AI SPEC — AI Learning Bridge · Nhóm BrainStormers · Zone [X]
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [x] Tính năng mới

## §1. User & Job
- Job executor + workflow: Học viên khoá AI Thực Chiến (~1.000 người K3 & K4) bắt đầu buổi học mới trên VLearn.
  - Workflow: Kết thúc buổi N → Bắt đầu buổi N+1 → Cố nhớ lại buổi trước → Bối rối vì không thấy liên kết → Hỏi TA hoặc bỏ qua.
- Core JTBD (không tên sản phẩm/AI trong câu): Khi bắt đầu buổi học mới, học viên muốn nhanh chóng nắm lại kiến thức buổi trước và hiểu nó liên quan thế nào đến nội dung hôm nay, để tiếp thu bài mới hiệu quả hơn.
- Problem statement (KHÔNG chữ AI): Học viên không nhận ra mối liên hệ giữa nội dung các buổi học, dẫn đến kiến thức bị phân mảnh, khó hình thành tư duy hệ thống, và giảm động lực tiếp tục học.
- Evidence (chuẩn A và/hoặc B — log đầy đủ trong repo):
  - Khảo sát **n = 27 học viên K3–K4**: **23/27 (85%)** nêu ít nhất một vấn đề liên quan đến mất tính liên tục giữa các buổi — 11/27 (41%) không thấy buổi mới liên quan gì buổi trước; 6/27 (22%) không biết cần ôn phần nào; 6/27 (22%) gần như quên nội dung buổi trước. Ngoài ra, 1/27 (4%) khó tìm lại đúng tài liệu và 3/27 (11%) không gặp khó khăn. PP1 hiện là pain point lớn nhất và tăng từ 6/20 (30%) lên 11/27 (41%).
  - **Tần suất gặp tình trạng (Câu 6):** 11/27 (41%) gần như mọi buổi, 9/27 (33%) khoảng một nửa số buổi, 5/27 (19%) thỉnh thoảng và 2/27 (7%) hiếm khi. Như vậy **20/27 (74%)** gặp pain ở ít nhất khoảng một nửa số buổi.
  - **Mức hữu ích của tóm tắt tự động (Câu 7):** 9/27 (33%) rất hữu ích, 9/27 (33%) hữu ích, 5/27 (19%) bình thường, 1/27 (4%) không hữu ích và 3/27 (11%) rất không hữu ích; gộp hai mức tích cực là **18/27 (67%)**.
  - **Sẵn sàng sử dụng nếu tích hợp vào VLearn (Câu 8):** 12/27 (44%) chắc chắn có, 14/27 (52%) có thể và 1/27 (4%) chưa chắc; gộp “chắc chắn có/có thể” là **26/27 (96%)**.
  - Ví dụ nguyên văn (mã phản hồi dùng để đối chiếu với survey log; tên/MSSV không đưa vào spec public):
    1. Response #4, K4: “Việc khó khăn nhất là khi chưa kịp nhớ ra buổi trc học gì thì giảng viên đã giảng dạy bài học mới, vì vậy mình phải tự đọc cả 2 bài học cùng một lúc và sẽ gây khó khăn và quá tải nếu bài học quá khó”.
    2. Response #5, K4: “Tôi thường nhớ mang máng, không chắc chắn... tìm lại rất khó khăn, mất khoảng 20-30ph vì không biết tìm ở đâu, do quên kiến thức buổi trước”.
    3. Response #8, K4: “Tôi quên mất Transformer hoạt động ntn và tôi phải nhờ bạn chỉ lại mất 15p”.
    4. Response #13, K3: “Thường quên kiến thức, phải mất khoảng 30p để reload lại”.
    5. Response #20: “khi bắt đầu một buổi học mới tôi luôn mơ hồ về việc hôm nay giảng viên đang giảng dạy phần nào và có nhiều buổi gần như tôi không biết giảng viên đang giảng về thứ gì liên quan tới chương trình”.
    6. Response #18: “Tôi xem lại slides trong khoảng 10p trước khi bắt đầu bài học”.
    7. Phản hồi mới, ẩn danh trong spec: “Nếu như quá lười hoặc bận sau một vài buổi học sẽ ko có kiến thức gì đọng lại và mất thời gian để xem và tìm lại những gì đã học”.
    8. Phản hồi mới, ẩn danh trong spec: “slide quá nhiều mà không biết tóm tắt là gì nên, không có keyword nên rất khó để hiểu”.

## §2. Impact & quyết định chọn
- Bảng impact ≥3 ứng viên:

| Ứng viên | Bao nhiêu người | Tần suất | Tốn gì mỗi lần | Khả thi | Chọn? |
|---|---|---|---|---|---|
| Mất liên tục giữa các buổi: không thấy liên hệ, không biết ôn gì hoặc quên bài trước | **23/27 (85%)** trong mẫu; phạm vi tiềm năng ~1.000 HV K3–K4 | **20/27 (74%)** gặp ở ít nhất khoảng một nửa số buổi | Các ví dụ định lượng ghi nhận **10–30 phút/lần**; thêm quá tải và mất mạch kiến thức | Cao — transcript/slide hai buổi có sẵn | ✅ CHỌN |
| Khó tìm lại đúng tài liệu/ghi chú | **1/27 (4%)** | Chưa có số đếm tần suất riêng | Một phản hồi mất **20–30 phút/lần** | Cao — có thể cải thiện bằng điều hướng/tìm kiếm | ❌ |
| Không gặp khó khăn khi chuyển buổi | **3/27 (11%)** | Không áp dụng | Không ghi nhận chi phí | Không phải pain cần giải quyết | ❌ |

- Ứng viên ĐÃ LOẠI:
  - “Khó tìm tài liệu” chỉ xuất hiện ở **1/27 (4%)**, thấp hơn nhiều so với cụm mất liên tục giữa các buổi; đây cũng có thể giải bằng tìm kiếm/điều hướng mà chưa cần lát cắt AI riêng.
  - Nhóm **3/27 (11%) không gặp khó khăn** không có pain hoặc chi phí cần xử lý.
- Ứng viên CHỌN: cụm “mất liên tục giữa các buổi” được chọn vì có **23/27 (85%)** người khảo sát xác nhận một trong ba biểu hiện liên quan, **20/27 (74%)** gặp pain ở ít nhất khoảng một nửa số buổi và các phản hồi định lượng cho thấy mất **10–30 phút/lần**. Riêng PP1 “không thấy liên hệ giữa hai buổi” là pain lớn nhất với **11/27 (41%)**. Hướng giải pháp cũng có tín hiệu chấp nhận ban đầu: **18/27 (67%)** đánh giá tóm tắt tự động hữu ích/rất hữu ích và **26/27 (96%)** chắc chắn/có thể sử dụng nếu tích hợp vào VLearn.

## §3. Giải pháp tương tự đã nghiên cứu
> Nghiên cứu nhanh từ tài liệu chính thức, rà soát ngày 31/07/2026. Nhóm học theo từng cặp buổi trên VLearn nên chỉ lấy các pattern phù hợp với lát cắt, không sao chép toàn bộ sản phẩm.

| Giải pháp | Flow giải job | Đáng học | Đáng né / giới hạn | AI Learning Bridge khác gì |
|---|---|---|---|---|
| [NotebookLM](https://support.google.com/notebooklm/answer/16164461) | Người dùng tải/chọn PDF, slide, website, video hoặc ghi chú → hỏi trong notebook → nhận câu trả lời dựa trên nguồn, có citation; có thể tạo study guide, mind map, flashcard/quiz | Grounding theo tập nguồn do người dùng chọn; citation nằm cạnh nội dung và mở được đúng ngữ cảnh để kiểm chứng | Người học phải chủ động tạo notebook, nạp/chọn nguồn và đặt câu hỏi; nếu nhiều nguồn hoặc câu hỏi mơ hồ, hệ thống có thể không tìm đúng phần liên quan. Không có flow mặc định nối buổi N với N+1 trên VLearn | Tự kích hoạt tại thời điểm học viên mở buổi N+1; nguồn đã được giới hạn vào tài liệu hai buổi; output cố định ở recap + 2–4 bridge + checklist, đọc trong ≤3 phút |
| [Khanmigo](https://support.khanacademy.org/hc/en-us/articles/13860282793869-What-are-the-Community-Guidelines-for-Khanmigo) | Học viên mở trợ lý trong ngữ cảnh bài học/bài tập → Khanmigo dùng câu hỏi, gợi ý và giải thích để dẫn dắt → học viên trả lời qua nhiều lượt và tự đi đến kết quả | Không đưa đáp án ngay; dùng câu hỏi kiểu Socratic và “productive struggle” để giữ vai trò chủ động của người học; trợ giúp nằm trong ngữ cảnh học tập | Hội thoại nhiều lượt không phù hợp khi học viên chỉ có vài phút để lấy lại mạch kiến thức; Khan Academy cũng khuyến nghị không coi Khanmigo là nguồn duy nhất và phải kiểm tra thêm nguồn | Không đóng vai tutor tổng quát và không kéo dài hội thoại; chỉ làm cầu nối ngắn giữa hai buổi, luôn kèm căn cứ từ transcript/slide và cho phép bỏ qua |
| [ChatGPT Study Mode](https://help.openai.com/en/articles/11780217-study-mode) | Người học bật Study Mode, nêu mục tiêu/trình độ và có thể tải tài liệu → hệ thống hỏi điều đã biết, hướng dẫn từng bước → đặt câu hỏi mở/quiz để kiểm tra mức hiểu | Chia nhỏ kiến thức, điều chỉnh độ sâu, hỏi kiểm tra hiểu và khuyến khích suy luận thay vì chỉ trả đáp án | Phụ thuộc vào việc người học mô tả mục tiêu và cung cấp đúng context; tài liệu chính thức lưu ý hệ thống vẫn có thể sai hoặc đôi lúc trả lời thẳng. Đây là trải nghiệm chat rộng, không bảo đảm tự nối đúng hai buổi của một khóa | VLearn biết sẵn học viên đang mở buổi nào và buổi trước là gì; hệ thống chủ động tạo một artifact có cấu trúc, có citation và fallback khi không đủ căn cứ, không yêu cầu người học prompt |

**Kết luận thiết kế:** kết hợp pattern “grounded citation” của NotebookLM với cách giữ quyền chủ động cho người học của Khanmigo/Study Mode; không chọn trải nghiệm chatbot mở. Lợi thế của lát cắt là **đúng thời điểm chuyển buổi + đúng cặp nguồn + output ngắn, cố định và kiểm chứng được**.

## §4. Thiết kế
- Lát cắt MỘT CÂU: Khi một học viên bắt đầu Day 02 trên VLearn, hệ thống dùng tài liệu Day 01–02 để đề xuất recap Day 01 và 2–4 bridge có trích dẫn, giúp học viên tự kiểm chứng và nắm lại mạch kiến thức trong ≤3 phút thay vì tự tìm khoảng 15 phút.
- Non-goals (≥3):
  1. Không build lại toàn bộ UI của VLearn
  2. Không tạo hệ thống chấm điểm chính thức
  3. Không thay thế vai trò giảng viên
  4. Không xây chatbot Q&A tổng quát
  - Ranh giới với source hiện tại: `VLearnTutor.jsx` được xem là màn hình nền/mô phỏng tính năng VLearn sẵn có, **không thuộc lát cắt được đánh giá**; đường demo chính chỉ là Learning Bridge. Quiz nhanh chỉ hỗ trợ tự ôn, không lưu điểm và không được dùng để đánh giá năng lực chính thức.
- Mức prototype hiện tại: [ ] Sketch [x] Mock [ ] Working — UI React, knowledge map, citation navigation, feedback và trace đã có component chạy; happy path có mã gọi Gemini thật. Low-confidence/failure/out-of-scope dùng `PREBAKED_EXPERIENCE_PATHS`, nên là mock có chủ đích. Chưa công nhận Working end-to-end trên artifact repo vì đang thiếu `codebase/src/data/courseData.js`, là dependency được `App.jsx` và `llmService.js` import.
- Automation: [x] augment [ ] conditional [ ] automate — AI đề xuất recap/bridge nhưng học viên quyết định đọc, kiểm tra nguồn hoặc bỏ qua. Nếu nội dung sai, khoảng 1.000 học viên có thể ôn sai nền tảng cho buổi sau và TA phải sửa lại; vì chi phí lỗi trung bình–cao, mỗi ý phải có citation, trạng thái thiếu căn cứ phải thu hẹp output và kết quả không được dùng để chấm điểm chính thức.
- §4b. Nguyên tắc đã áp dụng (≥4):

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| G2 — Làm rõ nó làm tốt đến đâu | `LearningBridge.jsx`: badge `Grounded G2`, số ý có trích dẫn, citation cạnh từng recap/bridge và badge `Live API` khi có lời gọi thật |
| G10 — Thu hẹp phạm vi khi nghi ngờ | `App.jsx` + `llmService.js`: demo Low-Confidence/Failure và honest fallback không trả lời khi không tìm được nguồn; các path lỗi hiện dùng dữ liệu prebaked để chứng minh hành vi |
| G8 — Gạt bỏ dễ dàng | `LearningBridge.jsx`: nút “Học ngay” gọi `onSkipBridge`; AI Bridge không chặn học viên vào bài |
| G9 — Sửa dễ dàng | `LearningBridge.jsx` mở `FeedbackModal.jsx` ngay tại recap bị chọn; học viên chọn loại lỗi và nhập mô tả. Bản hiện tại ghi nhận yêu cầu sửa, chưa sửa trực tiếp nội dung trên màn hình |
| G11 — Giải thích vì sao | `LearningBridge.jsx`: mỗi `bridgeLink` hiển thị source concept, target concept, hai citation và `explanation`; knowledge map dùng cùng dữ liệu |
| G15 — Mời feedback chi tiết | `FeedbackModal.jsx` + `logger.js`: 👎 → chọn sai citation/nhầm khái niệm/hallucination/khác → nhập chi tiết → lưu feedback kèm section và citation ID |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

| Lớp | Rủi ro trong lát cắt | Quy tắc đường lui |
|---|---|---|
| ① Nguồn sự thật | Recap/bridge bịa ý hoặc gắn sai citation | Chỉ hiển thị điều truy ngược được về tài liệu; không có căn cứ thì không kết luận |
| ② Mơ hồ/thiếu thông tin | Transcript ngắn, slide thiếu hoặc đoạn được chọn không đủ ngữ cảnh | Nói rõ thiếu gì, thu hẹp output và đưa link tài liệu gốc |
| ③ Ngoài phạm vi/thẩm quyền | Người dùng đòi giải bài, chấm điểm hoặc hỏi ngoài tài liệu khóa học | Từ chối phần ngoài phạm vi, nhắc lại feature làm được gì và cho phép vào bài |
| ④ Đặc thù domain | Sai thuật ngữ AI làm học viên hình thành nền tảng sai | Giữ nguyên thuật ngữ/định nghĩa nguồn; tách các khái niệm gần nhau và cite riêng |

| # | Tình huống cụ thể | Lớp | Hành vi mong muốn | Trạng thái trong source hiện tại | Nguyên tắc |
|---|---|---|---|---|---|
| 1 | Hai buổi gần như không liên quan nhưng mô hình bịa một bridge nghe hợp lý | ① | Không hiện cạnh bridge; ghi “Chưa tìm thấy liên kết đủ căn cứ giữa hai buổi” và cho vào bài | **Mock:** Failure path trả `bridgeLinks=[]`; UI hiện trạng thái không có liên kết | G10 |
| 2 | Nội dung recap đúng nhưng citation trỏ nhầm trang/đoạn | ① | Cho mở nguồn và gửi 👎 ngay tại ý; không coi mã citation tồn tại là bằng chứng citation đúng nghĩa | **Một phần:** recap citation bấm được và feedback ghi đúng citation ID; bridge citation chưa truyền day code nên có thể mở sai buổi | G2, G9 |
| 3 | Transcript Day 01 bị thiếu nửa cuối hoặc quá ngắn | ② | Hiện cảnh báo dữ liệu thiếu; chỉ giữ phần có căn cứ và cho phép bỏ qua | **Mock:** Low-Confidence path được chọn từ Demo Controller | G10 |
| 4 | Một slide chỉ có tiêu đề, không đủ dữ kiện để xác định quan hệ với Day 02 | ② | Bỏ bridge không đủ căn cứ; không suy diễn từ tiêu đề | **Mock/được eval:** UI có failure state; golden set kiểm fallback nhưng frontend chưa tự gate theo chất lượng nguồn | G10 |
| 5 | Học viên hỏi một kiến thức không xuất hiện trong tài liệu Day 01–02 | ③ | Nêu rõ ngoài phạm vi và đưa người dùng về bài học | **Mock:** Out-of-Scope path trong Demo Controller; Tutor có honest fallback riêng | G2, G10 |
| 6 | Học viên yêu cầu làm hộ bài tập hoặc chấm điểm chính thức | ③ | Từ chối làm/chấm hộ; gợi ý xem recap và tự thử | **Chưa chứng minh trong Learning Bridge:** non-goal đã chốt; cần dùng Out-of-Scope demo hoặc bổ sung case UI | G8 |
| 7 | Mô hình nhầm “attention mechanism” với “attention” theo nghĩa chú ý thông thường | ④ | Giữ thuật ngữ đúng như nguồn, kèm định nghĩa và citation | **Một phần:** feedback có loại “Nhầm lẫn khái niệm kỹ thuật”; eval có `hard_domain_01`, nhưng frontend không có semantic gate tự động | G2, G11 |
| 8 | Recap gộp Chain-of-Thought và Prompt Engineering thành một khái niệm | ④ | Tách thành hai ý có nguồn riêng; khi mơ hồ thì không gộp | **Được eval, chưa có UI riêng:** `hard_domain_02` kiểm output; feedback cho phép báo nhầm khái niệm | G10, G11 |
| 9 | Học viên bỏ hai buổi liên tiếp rồi mở Day N+2 | Hiếm | Hiển thị recap rút gọn theo thứ tự và bridge tích lũy, có nút bỏ qua | **Chưa implement:** source hiện chỉ lấy `selectedDayIndex - 1` làm buổi trước | G2, G8 |

## §6. Bốn đường đi của trải nghiệm
- **Happy path — AI thật khi có API key:** Học viên mở Day N+1 → chọn tab Bridge Agent → xem recap có citation → xem bridge gồm hai nguồn và giải thích → mở knowledge map/checklist/quiz → chọn “Học ngay”. `llmService.generateLearningBridge()` chỉ gọi Gemini ở path này.
- **Low-confidence (②) — mock có chủ đích:** Demo Controller chọn Low-Confidence → frontend lấy dữ liệu prebaked → hiện cảnh báo/nội dung thu hẹp → học viên kiểm tra nguồn hoặc “Học ngay”. Không trình bày đây là output API live.
- **Failure/không căn cứ (①) — mock có chủ đích:** Demo Controller chọn Failure → trả danh sách bridge rỗng → UI không dựng liên kết giả và vẫn cho học viên vào bài.
- **Correction — component thật:** Tại một ý recap, học viên chọn 👎 → modal hiển thị đúng nội dung đang phản hồi → chọn “Trích dẫn sai / Nhầm khái niệm / Hallucination / Khác” → nhập mô tả → lưu log kèm citation → nhận xác nhận. Đây là đường correction thứ tư theo rubric; Out-of-Scope là case bổ sung, không thay thế correction.
- **Khi bị đòi ngoài phạm vi (③) — mock bổ sung:** Demo Controller chọn Out-of-Scope/Boundary → hiển thị hành vi từ chối theo dữ liệu prebaked → cho học viên quay lại bài.
- **Case đặc thù domain (④):** Frontend cho báo lỗi “Nhầm lẫn khái niệm kỹ thuật”; semantic correctness được đo bằng human review trong `eval/`, chưa có gate tự động ở frontend.

### §6b. Kết quả review khớp spec–source của Spec & Design Lead

| Mức | Phát hiện | Quyết định thiết kế / tiêu chí bàn giao |
|---|---|---|
| **Blocker** | Repo thiếu `codebase/src/data/courseData.js` dù `App.jsx` và `llmService.js` import file này | Giữ mức **Mock** cho đến khi file được commit và `npm run build` thành công từ clean checkout |
| **Blocker** | `LearningBridge.jsx` gọi `extractSlidePage(...)` tại tab Bridge nhưng chỉ khai báo `extractSlidePageAndDay(...)` | Sửa helper/call site và kiểm tra bấm mở cả citation nguồn lẫn đích trước khi demo |
| **Cao** | Khi Gemini lỗi, service âm thầm trả `PREBAKED_EXPERIENCE_PATHS.happy` | Fallback phải có nhãn “Demo fallback / Không phải Live API”, warning và hành động thử lại/bỏ qua; không để người dùng nhầm mock với kết quả thật |
| **Cao** | Citation bridge gọi `onJumpToSlide(srcPage/targetPage)` nhưng không truyền day code | Citation nguồn phải mở Day N; citation đích phải mở Day N+1, tương tự cách recap truyền cả trang và ngày |
| **Vừa** | Demo Controller có Out-of-Scope thay vì nút Correction | Demo correction bằng nút 👎 trên recap và nói rõ đây là path thứ tư; Out-of-Scope là case bổ sung |
| **Vừa** | `VLearnTutor.jsx` là chatbot Q&A rộng hơn lát cắt | Không đưa Tutor vào claim/lượt demo của Learning Bridge; coi đây là UI nền của VLearn để không vi phạm non-goal |
| **Vừa** | Ba path lỗi luôn prebaked (`pathMode !== 'happy'`) | Badge/slide demo phải công khai phần mock; chỉ happy path được dùng làm bằng chứng AI call thật |
| **Backlog** | Chưa hỗ trợ người học bỏ hai buổi liên tiếp | Không claim case hiếm #9 đã implement; giữ làm ưu tiên nếu có thêm một tuần |

## §7. Kiểm thử
- Chiều chất lượng và cách đo chi tiết: xem `eval/README.md`. Validator tự động kiểm schema, số lượng 5–7 recap/2–4 bridge, giới hạn 300 từ, citation tồn tại đúng phía và fallback. Hai reviewer độc lập kiểm citation thực sự hỗ trợ claim, logic bridge, nghĩa thuật ngữ domain và độ hữu ích.
- Golden set: `eval/golden_set.json` — đúng 22 case (10 thường, 8 khó với đúng 2 case cho mỗi lớp, 4 hiếm); 10 case thường truy được về chatlog bằng conversation ID ẩn danh. Nội dung đầy đủ được resolve từ `data/` khi chạy, không sao chép data pack vào artifact.
- Quality bar đã khóa lúc 23:48 ngày 30/07, giữ nguyên: "Đạt khi ≥ 80% recap có ít nhất 1 citation chính xác, VÀ 0% bridge chứa thông tin không trace được về tài liệu gốc, VÀ ≥ 70% học viên thử nghiệm xác nhận recap hữu ích."
- Kết quả: Round 1 pass tự động 81,8% (18/22), Round 2 pass 100% (22/22); recap có citation tồn tại tăng từ 73,3% lên 100%, bridge không trace được bằng 0. Xem `eval/results_round_1.md`, `eval/results_round_2.md` và JSON live trong `eval/results/`. Citation chính xác chờ đủ hai reviewer; chỉ số hữu ích lấy từ Validation Lead và vẫn là `pending validation` nếu chưa có feedback thật.

## §8. Phân công & kế hoạch
- Phân công có tên: _xem phan-cong.md_
- Willing users (≥3 tên): _TODO_
- Multi-prototype (nếu làm): _TODO_

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 31/07/2026 — sau khi pull prototype mới | Audit khớp spec–source: cập nhật mức thật/mock, vị trí 6 nguyên tắc, trạng thái 9 kịch bản và 4 đường đi; tách Tutor khỏi lát cắt | Source mới đã có UI/feedback/trace nhưng ba error path còn prebaked; cần mô tả trung thực theo artifact |
| 31/07/2026 — sau khi pull prototype mới | Ghi 2 blocker và các design gap: thiếu `courseData.js`, helper citation bridge sai tên, fallback API chưa minh bạch, citation bridge thiếu day code | Ngăn claim Working khi clean checkout chưa chạy và tránh người dùng nhầm output mock/API hoặc mở sai nguồn |
| 31/07/2026 — trước CP3 | Mở rộng evidence từ n=20 lên n=27; cập nhật pain (85%), tần suất thường xuyên (74%), mức hữu ích (67%), mức sẵn sàng dùng (96%) và thêm 2 quote | Phản ánh 7 phản hồi mới; PP1 “không thấy liên hệ giữa hai buổi” trở thành pain áp đảo với 11/27 (41%) |
| 31/07/2026 — trước CP3 | Cập nhật evidence n=20, 6 quote, tần suất (70% gặp thường xuyên), mức hữu ích (70%), mức sẵn sàng dùng (95%) và bảng impact | Thay các ước tính/TODO bằng kết quả khảo sát do Người 1 bàn giao; không công khai tên/MSSV trong spec |
| 31/07/2026 — trước CP3 | Hoàn thiện benchmark NotebookLM, Khanmigo và ChatGPT Study Mode; chốt khác biệt “đúng thời điểm + đúng cặp nguồn + output ≤3 phút” | Tránh biến lát cắt thành chatbot học tập tổng quát và làm rõ quyết định thiết kế từ sản phẩm tương tự |
| 31/07/2026 — trước CP3 | Viết lại lát cắt theo đủ 1 user · 1 việc · 1 quyết định AI · 1 kết quả; làm rõ AI đề xuất còn học viên kiểm chứng/quyết định | Khớp lựa chọn **augment** và xử lý cost-of-error khi recap/bridge sai |
| 31/07/2026 — trước CP3 | Cụ thể hóa 6 nguyên tắc HAX/PAIR thành thành phần UI/hành vi có thể kiểm tra | Đáp ứng yêu cầu mỗi nguyên tắc phải trỏ được vào vị trí cụ thể, không chỉ nêu tên |
| 31/07/2026 — trước CP3 | Bổ sung định nghĩa 4 lớp, làm rõ 9 kịch bản và 4 đường đi với thông báo + hành động tiếp theo | Để prototype/eval có đặc tả hành vi rõ ràng; không thay đổi prompt, golden set hay kết quả đo |
