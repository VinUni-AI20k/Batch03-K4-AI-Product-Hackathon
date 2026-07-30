# AI SPEC - Discord Knowledge Finder - Nhóm Gehihi36

Hướng: [ ] A - VLearn  [x] B - Trợ lý Học viên  [ ] C - Làn mở  
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

## §1. User & Job

### Job Executor + Workflow

Job executor: học viên trong khóa AI Thực Chiến đang cần tìm lại một thông tin, tài nguyên, hướng dẫn hoặc kinh nghiệm từng được đăng trên Discord.

Workflow hiện tại:

1. Nhớ mang máng nội dung cần tìm.
2. Đoán channel chứa thông tin.
3. Tìm bằng một số từ khóa.
4. Duyệt và mở nhiều kết quả.
5. Đọc post và comment để tìm đoạn liên quan.
6. Đổi từ khóa nếu chưa thấy.
7. Hỏi lại cộng đồng hoặc bỏ cuộc nếu vẫn không tìm được.

### Core JTBD

Tìm lại đúng nguồn thông tin đã được chia sẻ trong khóa học khi chỉ nhớ mang máng nội dung cần tìm.

### Problem Statement

Khi học viên cần tìm lại nội dung đã được đăng trong các khu vực Thông báo, Bài học hoặc Chia sẻ, họ phải đoán từ khóa, xác định channel và mở nhiều post/thread thủ công. Do cách diễn đạt trong bài viết thường khác với từ khóa mà học viên nhớ, họ mất nhiều thời gian, không tìm được nội dung dù nó đã tồn tại, hoặc phải hỏi lại cộng đồng.

### Evidence

Trạng thái: cần bổ sung sau khi nhóm thu thập dữ liệu Discord/khảo sát.

Cần đạt ít nhất một trong hai đường:

- Chuẩn A - Khảo sát: >=20 người ngoài nhóm, >=50% xác nhận pain, log đầy đủ câu hỏi và câu trả lời.
- Chuẩn B - Mining: số đếm kiểm lại được + >=5 ví dụ nguyên văn + phương pháp đếm.

Dự kiến câu hỏi khảo sát:

1. Lần gần nhất bạn cần tìm lại một tài nguyên/hướng dẫn trên Discord khóa học, bạn đang tìm gì?
2. Bạn đã tìm bằng cách nào?
3. Mất khoảng bao lâu?
4. Bạn có tìm được đúng nguồn không?
5. Nếu không tìm được, bạn đã làm gì tiếp theo?

Evidence cần điền:

- Số liệu mining/khảo sát: `TODO`, lưu tại `evidence/survey_log.csv` hoặc `evidence/mining_log.md`.
- >=5 quote/ví dụ nguyên văn + nguồn: `TODO`.
- Phương pháp đếm: `TODO`.

## §2. Impact & Quyết Định Chọn

### Bảng Impact Ứng Viên

| Ứng viên | Ai gặp | Tần suất | Tốn gì mỗi lần | Khả thi trong hackathon | Chọn? |
|---|---|---|---|---|---|
| Discord Knowledge Finder | Học viên cần tìm lại post/thread/tài nguyên | TODO sau survey | Thời gian tìm, gián đoạn học, hỏi lặp | Cao nếu dùng snapshot JSON | Chọn |
| Discord daily digest cho TA | TA/mentor cần nắm câu hỏi tồn | TODO | Thời gian đọc chat, bỏ sót câu hỏi | Vừa, cần nhiều log Discord | Loại tạm |
| VLearn tutor follow-up/check understanding | Học viên đang học trong VLearn | Có signal từ data VLearn | Học xong nhưng chưa chắc đã hiểu | Cao, có data sẵn | Loại tạm |

### Ứng Viên Đã Loại + Vì Sao

- Daily digest cho TA: có ích nhưng user chính là TA, cần access nhiều channel và metric impact khó hơn trong 1,5 ngày.
- VLearn tutor follow-up: data sẵn mạnh, nhưng nhóm đã chọn pain gắn với Discord và có thể validate bằng user thật trong lớp nhanh hơn.

### Ứng Viên Chọn + Vì Sao

Chọn Discord Knowledge Finder vì pain nằm ở khoảng cách giữa cách học viên diễn đạt nhu cầu và cấu trúc/từ khóa thật của Discord. MVP có thể làm gọn bằng snapshot JSON được whitelist, đo được bằng time-to-source, Hit@3 và citation precision.

## §3. Giải Pháp Tương Tự Đã Nghiên Cứu

Cần bổ sung nhanh, mỗi thành viên nghiên cứu 1 sản phẩm trong 15 phút.

| Sản phẩm | Flow | Đáng học | Đáng né | Mình khác gì |
|---|---|---|---|---|
| Discord Search | Keyword/channel search | Có link nguồn gốc | Yếu với semantic intent, phải đoán keyword | Thêm semantic + clarify/abstain |
| Perplexity/ChatGPT Search | Trả lời kèm citation | Citation tạo niềm tin | Dễ tổng hợp quá đà ngoài nguồn nội bộ | Chỉ dùng nguồn whitelist Discord |
| Slack/Notion AI Search | Search theo ngữ nghĩa trong workspace | Gắn workflow nội bộ | Cần permission/data setup lớn | MVP snapshot JSON, không realtime |

## §4. Thiết Kế

### Lát Cắt MỘT CÂU

Học viên đang cần tìm lại một tài nguyên/hướng dẫn đã được đăng trên Discord; AI quyết định trả lời, hỏi lại hay từ chối dựa trên nguồn whitelist; kết quả là học viên mở đúng post/thread có citation nhanh hơn Discord Search.

### Non-Goals

1. Không build bot Discord realtime trong MVP.
2. Không crawl toàn bộ Discord.
3. Không trả lời các câu hỏi không có trong nguồn whitelist.
4. Không thay thế TA/mentor trong việc đưa lời khuyên cá nhân hóa.
5. Không tự động kết luận deadline/logistics nếu nguồn không phải official.

### Mức Prototype

Mức nhắm tới: Mock/Working nhẹ.

- Thật: snapshot JSON, retriever, AI call quyết định answer/clarify/abstain, citation, trace, eval.
- Mock: Discord API realtime, permission model, UI bot Discord thật.

### Automation

Mức: Conditional.

Lý do theo cost-of-error:

- Nếu AI trả lời sai deadline/hướng dẫn, học viên có thể nộp sai, học sai hoặc mất niềm tin.
- Nếu AI chỉ search và citation đúng nguồn, user có thể tự kiểm lại.
- Vì vậy AI chỉ tự trả lời khi có căn cứ đủ mạnh; nếu mơ hồ thì hỏi lại; nếu không đủ nguồn thì abstain và hiện top nguồn liên quan.

### §4b. Nguyên Tắc Đã Áp Dụng

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| HAX G1 - Làm rõ hệ thống làm được gì | Màn hình đầu nói rõ chỉ tìm trong nguồn Discord whitelist |
| HAX G2 - Làm rõ mức độ tin cậy | Mỗi câu trả lời có citation và nhãn `official/community` |
| HAX G10 - Thu hẹp phạm vi khi nghi ngờ | Câu hỏi mơ hồ thì hỏi lại một câu thay vì đoán |
| HAX G11 - Giải thích vì sao | Nếu answer, nêu nguồn/câu đoạn đúng; nếu abstain, nói lý do không đủ căn cứ |
| PAIR - Feedback + Control | User có thể mở nguồn, hỏi tiếp hoặc báo citation sai |

## §5. Kiểu Lỗi - 4 Lớp Chỗ Khó + Kịch Bản

| Tình huống | Lớp | Hành vi mong muốn | Nguyên tắc |
|---|---|---|---|
| User hỏi "link bài agent hôm trước đâu?" | Mơ hồ/thiếu thông tin | Hỏi lại cần tìm bài học, post chia sẻ hay assignment | G10 |
| User hỏi deadline nộp bài nhưng snapshot có cả comment cộng đồng và thông báo chính thức | Nguồn sự thật | Ưu tiên official, tách rõ community nếu có | G2/G11 |
| User hỏi một kinh nghiệm "nên dùng model nào" chỉ có comment cộng đồng | Domain | Trả lời rằng đây là kinh nghiệm cộng đồng, không phải quy định chính thức | G2 |
| User hỏi nội dung không có trong whitelist | Nguồn sự thật | Abstain, hiện top bài gần nhất nếu có | G10/G11 |
| User hỏi xin tóm tắt toàn bộ private thread không trong snapshot | Ngoài phạm vi | Từ chối, nói hệ thống chỉ dùng nguồn được phép | G1 |
| Citation top 1 liên quan keyword nhưng không trả lời đúng câu hỏi | Domain | Không answer nếu score/evidence không đủ; hiện nguồn liên quan | G2 |
| Nguồn official và community mâu thuẫn | Nguồn sự thật | Trình bày tách biệt, ưu tiên official | G11 |
| LLM lỗi/timeout | Failure hệ thống | Fallback semantic/keyword top results, không generate | G8 |

## §6. Bốn Đường Đi Của Trải Nghiệm

- Happy path: user hỏi "bài nào hướng dẫn viết AI spec?" -> hệ thống tìm post official, trả lời ngắn + citation.
- Low-confidence: user hỏi "cái bài agent hôm trước" -> hệ thống hỏi lại "bạn cần bài giảng, bài tập hay chia sẻ kinh nghiệm về agent?"
- Failure/không căn cứ: user hỏi nội dung không có trong snapshot -> hệ thống không generate, hiện top bài gần nhất.
- Correction: user báo "citation này không đúng" -> hệ thống cho feedback, chạy lại với nguồn bị loại trừ.
- Ngoài phạm vi: user hỏi thông tin cá nhân/kênh private -> hệ thống từ chối.
- Domain-specific: deadline/logistics chỉ được trả lời từ official source.

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
- Điều kiện cứng: không có answer nào về deadline/logistics nếu citation không phải official.

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
