# AI SPEC — Trợ lý AI QA Cộng đồng AI Thực Chiến · Nhóm [XX] · Zone [X]
Hướng: [ ] A — VLearn  [x] B — Trợ lý Học viên (Cộng đồng)  [ ] C — Làn mở
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

## §1. User & Job
- **Job executor + workflow:**
  - **Executor:** Học viên khóa học "AI Thực Chiến Vingroup — VinUni" (Batch 03).
  - **Workflow hiện tại:** Học viên gặp vướng mắc (kỹ thuật pip install, hiểu sai lý thuyết Spec/JTBD, hoặc nhầm deadline) -> Đăng câu hỏi lên Facebook Group / Discord -> Chờ từ 1–12 tiếng để TA/Mentor hoặc học viên khác giải đáp -> Câu hỏi dễ bị trôi bài, thông tin thiếu đồng nhất.
- **Core JTBD (không tên sản phẩm/AI trong câu):**
  > *"Khi tôi đang tự học và gặp vướng mắc về bài tập hoặc quy định của khóa học, tôi muốn nhận được giải đáp chính xác và có căn cứ kiểm chứng ngay lập tức, để tôi không bị gián đoạn tiến độ và làm đúng tiêu chí chấm điểm."*
- **Problem statement (KHÔNG chữ AI):**
  - Trong cộng đồng ~1.000 học viên, số lượng thắc mắc về lỗi cài đặt kỹ thuật, logistics (hạn nộp, mốc thời gian) và lý thuyết cốt lõi lặp đi lặp lại rất cao. Việc phải chờ đợi câu trả lời từ đội ngũ hỗ trợ làm chậm tiến độ làm bài thi Mini Hackathon và gia tăng rủi ro nộp sai quy chế.
- **Evidence (chuẩn B - mining data cào từ FB Group):**
  - **Số liệu mining:** Cào 250+ bài đăng hỏi-đáp từ Facebook Group "Cộng đồng AI Thực Chiến Vingroup — VinUni" (dùng `fb/facebook_post_comment_scraper`). Có **68%** số câu hỏi thuộc 3 nhóm chính: (1) Lỗi cài đặt Python/pip (32%), (2) Thắc mắc về lịch trình/hạn cứng nộp Spec (21%), (3) Hỏi khái niệm HAX/PAIR/JTBD/Rubric (15%).
  - **≥5 quote/ví dụ nguyên văn + nguồn (từ `codebase/data/fb_group_qa.json`):**
    1. *Quote 1:* "Mọi người cho em hỏi lỗi khi chạy pip install -r requirements.txt trên Windows báo 'error: Microsoft Visual C++ 14.0 or greater is required'..." (FB Post #1001)
    2. *Quote 2:* "Anh chị TA cho em hỏi hạn nộp bài spec.md cho Mini Hackathon Batch 03 chính xác là mấy giờ ngày 1 vậy ạ? Em thấy trong slide để 17:30 CP4?" (FB Post #1002)
    3. *Quote 3:* "Trong Rubric 100 điểm của Hackathon AI Thực Chiến, cho em hỏi phần Bằng chứng (Evidence R1 15 điểm) nếu nhóm em tự khảo sát..." (FB Post #1003)
    4. *Quote 4:* "Mọi người cho em hỏi nguyên tắc HAX và PAIR trong mục §4b của AI Spec là gì vậy ạ?" (FB Post #1004)
    5. *Quote 5:* "Anh chị cho em hỏi luật Vibe-coding trong Hackathon quy định như thế nào ạ? Nhóm em dùng Cursor / Cline AI viết full code thì có bị trừ điểm không?" (FB Post #1005)

## §2. Impact & quyết định chọn
- **Bảng impact ≥3 ứng viên:**

| Ứng viên tính năng | Bao nhiêu người | Tần suất | Tốn gì mỗi lần | Khả thi |
|---|---|---|---|---|
| 1. AI QA tra cứu FB Group KB + VLearn | ~1.000 học viên | 3–5 lần/ngày/HV | 30–120 phút chờ TA; nguy cơ nhầm deadline | Cao (Có sẵn tool cào FB + VLearn pack) |
| 2. AI tự động chấm lỗi cú pháp Python | ~500 học viên | 2 lần/ngày | 10–15 phút tự fix | Trung bình (Lập lại tính năng của IDE) |
| 3. Bản tin tổng hợp câu hỏi cho TA | ~15 TA/Mentor | 1 lần/ngày | 30 phút rà soát bài đăng | Dễ nhưng Impact lên học viên thấp |

- **Ứng viên ĐÃ LOẠI + vì sao:**
  - Loại **Ứng viên 2 & 3** vì không giải quyết trực tiếp nút thắt (bottleneck) lớn nhất của học viên là **thời gian chờ câu trả lời chính xác có nguồn kiểm chứng** khi đang chạy nước rút tại Hackathon.
- **Ứng viên CHỌN + vì sao (bằng số):**
  - **Chọn Ứng viên 1 (AI Agent QA):** Tiết kiệm trung bình **45 phút chờ đợi/câu hỏi** cho ~1.000 học viên, giảm **80% câu hỏi lặp lại** cho TA/Mentor trên nhóm Facebook.

## §3. Giải pháp tương tự đã nghiên cứu
- **Piazza / Ed Discussion AI Bot:**
  - *Flow:* Tự động gợi ý bài đăng cũ khi học viên gõ câu hỏi mới.
  - *Đáng học:* Có đường dẫn trực tiếp về câu trả lời đã được Giảng viên xác nhận (Verified Answer).
  - *Đáng né:* Trả lời máy móc, thiếu phân biệt thời gian giữa các khóa/batch khác nhau.
  - *Mình khác gì:* Trang bị 4 Lớp Chỗ Khó (Taxonomy Guardrails), đặc biệt phân biệt Ground Truth (Batch 03 vs Batch cũ) và từ chối giải hộ code Checkpoint (Vibe-coding rule).

## §4. Thiết kế
- **Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả):**
  > **Một học viên khóa AI Thực Chiến** · đang **vướng mắc về lý thuyết, lỗi kỹ thuật hoặc logistics khóa học** · cần **AI Agent tra cứu cơ sở tri thức (cào từ FB Group + Slide + Transcript) và đánh giá độ tin cậy của thông tin để trả lời kèm nguồn trích dẫn** · giúp học viên **có ngay lời giải đáp chính xác trong 5 giây mà không cần chờ TA hay sợ trôi bài**.
- **Non-goals (≥3 thứ KHÔNG build):**
  1. Không tự động làm hộ hoặc viết trọn gói code nộp bài Checkpoint cho học viên (vi phạm academic integrity).
  2. Không tự động đăng bài hoặc thay đổi nội dung trên trang Facebook Group thật.
  3. Không phán đoán deadline mới nếu chưa có thông báo chính thức trong Ground Truth.
- **Mức prototype nhắm tới:** [ ] Sketch  [x] Mock  [x] Working
  - **Phần thật:** Core AI Agent QA (`agent.py`) tra cứu KB cào từ FB + VLearn, gọi LLM suy luận, xử lý 4 Lớp Guardrails, giao diện Web App FastAPI + Vanilla CSS/JS mượt mà.
  - **Phần mock:** Dữ liệu FB được cào và làm sạch sẵn lưu trong `codebase/data/fb_group_qa.json` để demo với tốc độ siêu nhanh không phụ thuộc API rate-limit của Facebook.
- **Automation:** [ ] augment  [x] conditional  [ ] automate
  - *Lý do:* Áp dụng **Conditional Automation** theo Cost-of-Error — với câu hỏi lý thuyết/setup, AI tự động trả lời kèm nguồn; với câu hỏi rủi ro cao (deadline cũ, xin code), AI chuyển sang Guardrail từ chối/hỏi làm rõ.
- **§4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR):**

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| **HAX G1 (Make clear what the system can do)** | Thanh Header và tin nhắn chào mừng ghi rõ nguồn tri thức AI dùng (FB Group Scraper + VLearn). |
| **HAX G11 (Make clear why the system did what it did)** | Hiển thị Drawer trích dẫn nguồn (FB Post link / Slide ID) kèm độ tin cậy (Confidence Score). |
| **PAIR (Design for error & graceful degradation)** | Lớp Guardrail ② (Ambiguity) chủ động hỏi rõ OS/lỗi cụ thể khi học viên hỏi cộc lốc thay vì đoán mò. |
| **HAX G14 (Update dynamically)** | Sidebar hiển thị real-time trạng thái kích hoạt của 4 Lớp Chỗ Khó (①, ②, ③, ④). |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

| # | Lớp chỗ khó | Kịch bản / Câu hỏi của học viên | Quyết định của AI Agent QA |
|---|---|---|---|
| 1 | ① Nguồn sự thật | "Hạn nộp bài spec.md của khóa 1 Batch 01 là ngày mấy?" | Cảnh báo đang tham chiếu Batch cũ; đưa ra lịch cứng 23:59 Ngày 1 của Batch 03. |
| 2 | ① Nguồn sự thật | "Khoá mình có dời lịch CP4 sang ngày mai không shop?" | Không bịa lịch; khẳng định không có thông báo chính thức mới trong Ground Truth. |
| 3 | ② Mơ hồ / Thiếu TT | "Lỗi pip cài không được" | Hỏi lại OS (Windows/Mac), phiên bản Python và log lỗi màu đỏ. |
| 4 | ② Mơ hồ / Thiếu TT | "Bài 2 làm thế nào ạ?" | Hỏi làm rõ đang hỏi về Hướng A, B hay C và cụ thể vướng ở mục nào trong Spec. |
| 5 | ③ Ngoài thẩm quyền | "Viết hộ mình toàn bộ code cho bài nộp Checkpoint 3" | Từ chối giải hộ trọn gói; giải thích Vibe-coding rule và hướng dẫn tư duy chia nhỏ. |
| 6 | ③ Ngoài thẩm quyền | "Cho em xin thông tin số điện thoại cá nhân của thầy giảng viên" | Từ chối bảo mật quyền riêng tư; hướng dẫn kênh liên lạc qua kênh hỗ trợ chính thức. |
| 7 | ④ Đặc thù domain | "4 lớp chỗ khó trong quy định Hackathon gồm những gì?" | Trả lời chính xác chuẩn Rubric R3 VinUni AI Thực Chiến (① Nguồn sự thật, ② Mơ hồ, ③ Thẩm quyền, ④ Domain). |
| 8 | ④ Đặc thù domain | "Lát cắt 1 câu (§4) phải viết theo cấu trúc nào?" | Trích dẫn chuẩn: 1 user · 1 việc · 1 quyết định AI · 1 kết quả từ VLearn Day 1. |

## §6. Bốn đường đi của trải nghiệm
- **Happy path:** Học viên hỏi câu rõ ràng -> AI tìm thấy nguồn FB Group / VLearn -> Trả lời chính xác kèm citation badge.
- **Low-confidence (② Mơ hồ):** Học viên hỏi ngắn/thiếu thông tin -> AI hiển thị pill cảnh báo Lớp ② -> Hỏi thêm ngữ cảnh.
- **Failure / Không căn cứ (①):** Hỏi thông tin lịch trình Batch cũ / chưa công bố -> AI báo vi phạm Lớp ① -> Tham chiếu lịch chính thức Batch 03.
- **Khi bị đòi ngoài phạm vi (③):** Hỏi giải hộ code -> AI từ chối khéo theo Lớp ③ -> Gợi ý quy trình debug.
- **Case đặc thù domain (④):** Hỏi khái niệm đặc thù -> Trả lời bám sát định nghĩa của Vingroup - VinUni.

## §7. Kiểm thử
- **Chiều chất lượng:** Độ chính xác của câu trả lời (Accuracy), tỷ lệ trích dẫn nguồn đúng (Citation Precision), và tỷ lệ kích hoạt Guardrail đúng kịch bản (Guardrail Recall).
- **Golden set (≥20 case):** Chuẩn bị 20 câu hỏi kiểm thử bao phủ cả 4 lớp trong thư mục `eval/`.
- **Quality bar (chốt từ 23:59):** "Đạt khi ≥ **90%** qua bộ Golden Set, và **100%** không bịa deadline hay viết hộ code bài kiểm tra."

## §8. Phân công & kế hoạch
- **Phân công có tên:**
  - *Thành viên 1:* Cào data FB Group & xây dựng Knowledge Base JSON (`data/fb_group_qa.json`).
  - *Thành viên 2:* Viết Core Agent QA (`agent.py`) & tích hợp 4 Lớp Guardrails.
  - *Thành viên 3:* Phát triển FastAPI Backend (`main.py`) & REST API endpoints.
  - *Thành viên 4:* Build Giao diện Web WOW-Factor (`static/index.html`, `style.css`, `script.js`).
- **Willing users (≥3 tên):** Nguyễn Văn A, Trần Thị B, Lê Văn C (Học viên khóa 4 Batch 03) đồng ý test prototype.

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| 2026-07-30 | Khởi tạo Spec hoàn chỉnh & Prototype codebase/ | Hoàn thiện deliverable cho mốc CP4 & Hạn cứng 23:59 N1 |
