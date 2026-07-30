# AI SPEC - Discord Knowledge Finder - Nhóm Gehihi36

Hướng: [ ] A - VLearn  [x] B - Trợ lý Học viên  [ ] C - Làn mở  
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

## §1. User & Job

### Job Executor + Workflow

Job executor: học viên trong khóa AI Thực Chiến đang cần tìm lại thread chia sẻ liên quan đến câu hỏi hiện tại, hoặc cần tìm nhanh link/deadline quan trọng từng được đăng trong Thông báo.

Workflow hiện tại:

1. Nhớ mang máng nội dung cần tìm.
2. Đoán channel chứa thông tin.
3. Tìm bằng một số từ khóa.
4. Duyệt và mở nhiều kết quả.
5. Đọc thread/post và comment để tìm đoạn liên quan hoặc link/deadline đúng.
6. Đổi từ khóa nếu chưa thấy.
7. Hỏi lại cộng đồng hoặc bỏ cuộc nếu vẫn không tìm được.

### Core JTBD

Tìm lại đúng thread chia sẻ, link hoặc deadline đã được đăng trong khóa học khi chỉ nhớ mang máng nội dung cần tìm.

### Problem Statement

Khi học viên cần tìm lại thread hữu ích trong mục Chia sẻ hoặc link/deadline quan trọng trong mục Thông báo, họ phải đoán từ khóa, xác định channel và mở nhiều post/thread thủ công. Do cách diễn đạt trong câu hỏi của học viên thường khác với tiêu đề/nội dung thật trên Discord, họ mất nhiều thời gian, không tìm được nội dung dù nó đã tồn tại, hoặc phải hỏi lại cộng đồng.

### Evidence

Khảo sát ban đầu: n = 54 học viên. Log tổng hợp nằm tại `evidence/survey_summary.md`.

Cần đạt ít nhất một trong hai đường:

- Chuẩn A - Khảo sát: >=20 người ngoài nhóm, >=50% xác nhận pain, log đầy đủ câu hỏi và câu trả lời.
- Chuẩn B - Mining: số đếm kiểm lại được + >=5 ví dụ nguyên văn + phương pháp đếm.

Kết quả chính:

| Câu hỏi | Có | Không | Other | Tỉ lệ xác nhận pain |
|---|---:|---:|---:|---:|
| Bạn có gặp khó khăn khi tìm lại các thông báo hay đường link quan trọng trong Discord do có quá nhiều kênh không? | 49 | 5 | 0 | 90,7% |
| Bạn có từng lỡ mất các thông báo gấp như đổi lịch học/dời deadline vì tin nhắn bị trôi quá nhanh chưa? | 36 | 17 | 1 | 66,7% |
| Bạn có cảm thấy tốn thời gian khi phải lội ngược dòng tin nhắn hoặc dùng Discord Search nhưng vẫn không tìm thấy thứ mình cần không? | 46 | 8 | 0 | 85,2% |
| Khi cần tìm tài liệu/link bài giảng của một buổi học cụ thể, bạn có phải đi hỏi lại bạn bè thay vì tự tìm trên Discord không? | 38 | 16 | 0 | 70,4% |

Takeaway:

- Pain về tìm lại link/thông báo/deadline là rõ nhất: 49/54 người xác nhận khó tìm lại thông báo/link quan trọng.
- Pain về trôi thông báo gấp có cost-of-error cao hơn vì liên quan đổi lịch/deadline: 36/54 người từng gặp.
- Discord Search/scroll chưa đủ tốt với nhu cầu thực tế: 46/54 người thấy tốn thời gian nhưng vẫn không tìm thấy thứ cần.

Evidence còn cần bổ sung trước CP4:

- >=5 quote/ví dụ nguyên văn + nguồn: `TODO`.
- Phương pháp thu thập khảo sát đầy đủ: `TODO`.
- Nếu có mining Discord: thêm số đếm và ví dụ tại `evidence/mining_log.md`.

## §2. Impact & Quyết Định Chọn

### Bảng Impact Ứng Viên

| Ứng viên | Ai gặp | Tần suất | Tốn gì mỗi lần | Khả thi trong hackathon | Chọn? |
|---|---|---|---|---|---|
| Discord Knowledge Finder | Học viên cần tìm thread chia sẻ/link/deadline | 49/54 gặp khó với thông báo/link; 46/54 tốn thời gian tìm | Thời gian tìm, gián đoạn học, hỏi lặp, có thể lỡ deadline | Cao nếu dùng snapshot JSON | Chọn |
| Discord daily digest cho TA | TA/mentor cần nắm câu hỏi tồn | TODO | Thời gian đọc chat, bỏ sót câu hỏi | Vừa, cần nhiều log Discord | Loại tạm |
| VLearn tutor follow-up/check understanding | Học viên đang học trong VLearn | Có signal từ data VLearn | Học xong nhưng chưa chắc đã hiểu | Cao, có data sẵn | Loại tạm |

### Ứng Viên Đã Loại + Vì Sao

- Daily digest cho TA: có ích nhưng user chính là TA, cần access nhiều channel và metric impact khó hơn trong 1,5 ngày.
- VLearn tutor follow-up: data sẵn mạnh, nhưng nhóm đã chọn pain gắn với Discord và có thể validate bằng user thật trong lớp nhanh hơn.

### Ứng Viên Chọn + Vì Sao

Chọn Discord Knowledge Finder vì pain nằm ở khoảng cách giữa cách học viên diễn đạt nhu cầu và cấu trúc/từ khóa thật của Discord. MVP có thể làm gọn bằng snapshot JSON gồm thread trong `Chia sẻ` và post/message trong `Thông báo`, đo được bằng time-to-source, Hit@3 và citation precision.

## §3. Giải Pháp Tương Tự Đã Nghiên Cứu

Cần bổ sung nhanh, mỗi thành viên nghiên cứu 1 sản phẩm trong 15 phút.

| Sản phẩm | Flow | Đáng học | Đáng né | Mình khác gì |
|---|---|---|---|---|
| Discord Search | Keyword/channel search | Có link nguồn gốc | Yếu với semantic intent, phải đoán keyword | Thêm semantic + clarify/abstain |
| Perplexity/ChatGPT Search | Trả lời kèm citation | Citation tạo niềm tin | Dễ tổng hợp quá đà ngoài nguồn nội bộ | Chỉ dùng nguồn whitelist Discord |
| Slack/Notion AI Search | Search theo ngữ nghĩa trong workspace | Gắn workflow nội bộ | Cần permission/data setup lớn | MVP snapshot JSON, không realtime |

## §4. Thiết Kế

### Lát Cắt MỘT CÂU

Học viên đang đặt câu hỏi để tìm thread liên quan trong mục Chia sẻ hoặc tìm link/deadline trong mục Thông báo; AI quyết định trả lời, hỏi lại hay từ chối dựa trên nguồn whitelist; kết quả là học viên mở đúng thread/link/thông báo có citation nhanh hơn Discord Search.

### Non-Goals

1. Không build bot Discord realtime trong MVP.
2. Không crawl toàn bộ Discord.
3. Không tìm trong các channel ngoài `Chia sẻ` và `Thông báo` ở MVP.
4. Không thay thế TA/mentor trong việc đưa lời khuyên cá nhân hóa.
5. Không tự động kết luận deadline/logistics nếu nguồn không phải `Thông báo`/official.

### Mức Prototype

Mức nhắm tới: Mock/Working nhẹ.

- Thật: snapshot JSON từ `Chia sẻ` và `Thông báo`, retriever, AI call quyết định answer/clarify/abstain, citation, trace, eval.
- Mock: Discord API realtime, permission model, UI bot Discord thật.

### Automation

Mức: Conditional.

Lý do theo cost-of-error:

- Nếu AI trả lời sai deadline/link quan trọng, học viên có thể lỡ hạn, vào nhầm tài nguyên hoặc mất niềm tin.
- Nếu AI chỉ search và citation đúng nguồn, user có thể tự kiểm lại.
- Vì vậy AI chỉ tự trả lời khi có căn cứ đủ mạnh; nếu mơ hồ thì hỏi lại; nếu không đủ nguồn thì abstain và hiện top nguồn liên quan.

### §4b. Nguyên Tắc Đã Áp Dụng

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| HAX G1 - Làm rõ hệ thống làm được gì | Màn hình đầu nói rõ chỉ tìm thread `Chia sẻ` và link/deadline từ `Thông báo` |
| HAX G2 - Làm rõ mức độ tin cậy | Mỗi câu trả lời có citation và nhãn `official/community` |
| HAX G10 - Thu hẹp phạm vi khi nghi ngờ | Câu hỏi mơ hồ thì hỏi lại một câu thay vì đoán |
| HAX G11 - Giải thích vì sao | Nếu answer, nêu nguồn/câu đoạn đúng; nếu abstain, nói lý do không đủ căn cứ |
| PAIR - Feedback + Control | User có thể mở nguồn, hỏi tiếp hoặc báo citation sai |

## §5. Kiểu Lỗi - 4 Lớp Chỗ Khó + Kịch Bản

| Tình huống | Lớp | Hành vi mong muốn | Nguyên tắc |
|---|---|---|---|
| User hỏi "link bài agent hôm trước đâu?" | Mơ hồ/thiếu thông tin | Hỏi lại đang cần thread chia sẻ, link bài học hay deadline/thông báo | G10 |
| User hỏi deadline nộp bài nhưng snapshot có cả comment cộng đồng và thông báo chính thức | Nguồn sự thật | Chỉ chốt deadline từ `Thông báo`; nếu có community thì tách riêng | G2/G11 |
| User hỏi một kinh nghiệm "nên dùng model nào" và có thread Chia sẻ phù hợp | Domain | Gợi ý các thread liên quan và nói rõ đây là kinh nghiệm cộng đồng | G2 |
| User hỏi nội dung không có trong whitelist | Nguồn sự thật | Abstain, hiện top bài gần nhất nếu có | G10/G11 |
| User hỏi xin tóm tắt toàn bộ private thread không trong snapshot | Ngoài phạm vi | Từ chối, nói hệ thống chỉ dùng nguồn được phép | G1 |
| Citation top 1 liên quan keyword nhưng không trả lời đúng câu hỏi | Domain | Không answer nếu score/evidence không đủ; hiện nguồn liên quan | G2 |
| Nguồn official và community mâu thuẫn | Nguồn sự thật | Trình bày tách biệt, ưu tiên official | G11 |
| LLM lỗi/timeout | Failure hệ thống | Fallback semantic/keyword top results, không generate | G8 |

## §6. Bốn Đường Đi Của Trải Nghiệm

- Happy path: user hỏi "có thread nào chia sẻ cách viết prompt guardrail không?" -> hệ thống gợi ý 2-3 thread `Chia sẻ` liên quan + citation.
- Happy path thông báo: user hỏi "deadline nộp spec là khi nào?" -> hệ thống chỉ trả lời nếu tìm thấy nguồn `Thông báo`/official.
- Low-confidence: user hỏi "cái bài agent hôm trước" -> hệ thống hỏi lại "bạn cần bài giảng, bài tập hay chia sẻ kinh nghiệm về agent?"
- Failure/không căn cứ: user hỏi nội dung không có trong snapshot -> hệ thống không generate, hiện top bài gần nhất.
- Correction: user báo "citation này không đúng" -> hệ thống cho feedback, chạy lại với nguồn bị loại trừ.
- Ngoài phạm vi: user hỏi thông tin cá nhân/kênh private -> hệ thống từ chối.
- Domain-specific: deadline/logistics chỉ được trả lời từ `Thông báo`/official source.

## §7. Kiểm Thử

### Chiều Chất Lượng + Định Nghĩa Kiểm Chứng

| Chiều chất lượng | Định nghĩa đạt |
|---|---|
| Retrieval Hit@3 | Nguồn đúng nằm trong top 3 retrieved sources |
| Citation precision | Citation được gắn trong câu trả lời thật sự chứa thông tin đúng |
| Decision accuracy | Hệ thống chọn đúng answer/clarify/abstain theo expected behavior |
| Groundedness | Mọi thông tin quan trọng trong answer trace được về nguồn |
| Task completion | User/test case mở được đúng nguồn hoặc nhận đúng câu hỏi clarify/abstain |

### Golden Set

File: `eval/golden_set.csv`.

Cơ cấu cần đạt:

- >=20 case.
- 8-10 case thường.
- >=2 case cho mỗi lớp chỗ khó.
- 2-4 case hiếm.
- Mỗi case có expected decision.
- Case answer có expected citation.

### Quality Bar

Chốt trước 23:59 N1, giữ nguyên sau khi chốt:

- Task completion rate >=80%.
- Retrieval Hit@3 >=80%.
- Citation precision >=90%.
- Answer/Clarify/Abstain accuracy >=80%.
- Điều kiện cứng: không có answer nào về deadline/logistics nếu citation không phải `Thông báo`/official.

### Kết Quả Các Lượt Chạy

| Lượt | Thời điểm | Hit@3 | Citation precision | Decision accuracy | Task completion | Ghi chú |
|---|---|---:|---:|---:|---:|---|
| Run 01 | TODO | TODO | TODO | TODO | TODO | TODO |

## §8. Phân Công & Kế Hoạch

| Phần việc | Owner | File/artifact |
|---|---|---|
| Product architect, spec, demo story | Nguyễn Tuấn Đức | `spec.md`, `demo-slides-outline.md` |
| AI engine | Nguyễn Tuấn Đức | `codebase/src/` |
| Prompt, guardrail, risk scenarios | Nguyễn Việt Phong | `spec.md` §5-§6, prompt files |
| Tools, data snapshot, retrieval | Lê Trọng Việt Dũng | `codebase/data/`, `codebase/src/` |
| Testcase, evaluation | Ngô Quang Anh | `eval/` |
| Evidence | Dũng + cả nhóm | `spec.md` §1 + survey/mining log |
| Validation | Phong + cả nhóm | `validation/` |

### Willing Users

Cần điền >=3 tên người thật ngoài nhóm:

1. TODO
2. TODO
3. TODO

### Multi-Prototype

Nếu kịp, thử 2 phương án:

- Phương án A: search-first, hiện top sources trước, answer bên dưới.
- Phương án B: answer-first, citation sau.

Tiêu chí chọn: user tìm đúng nguồn nhanh hơn và tin citation đúng mức.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 2026-07-30 | Tạo spec bản đầu | Chốt đề tài Discord Knowledge Finder |
