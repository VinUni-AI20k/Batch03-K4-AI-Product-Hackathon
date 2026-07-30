---
course: AI20K
generated: '2026-07-30T17:26:58+00:00'
lang: vi
lesson: 6-day02-lecture-slides-v2
maps:
- '[[MOC - AI20K]]'
module: ''
source_file: AI20K/6-day02-lecture-slides-v2.pdf
source_hash: sha256:e12ef5acd137dcaf71524395bc77071256af945db3d25f3fa40cba46d6e8234c
type: lesson-note
---

```markdown
## Slide 1 — Xác Định Bài Toán Kinh Doanh Cho AI

Chọn đúng bài toán, đúng mức tự động hóa, đúng gate kỹ thuật. [00:10]

## Instructor

<!-- image -->

## Nguyễn Tiến Đồng

Technical Director CMC AI

- ■ 7+ năm nghiên cứu và phát triển các mô hình ML, AI
- ■ 5+ năm ở vai trò quản lý quy trình nghiên cứu, phát triển các model ML, AI cho đến AI Product

Focus: AI product management, Natural language processing, Computer vision

## Hôm nay bạn sẽ học gì?

3 câu hỏi xuyên suốt ngày:

1. Có thật sự nên dùng [[AI]] không?
2. Nếu có, nên dùng mức nào: rule, feature, hay agent?
3. Khi nào nên Go / Not Yet / No-Go?

Sáng: học framework + case study → Chiều: tự làm với bài toán thật từ chính bạn [01:20]

## Flow buổi học

## SÁNG - LECTURE (3H)

- Có nên dùng AI không? Buy vs Build
- Design Thinking + Human-Centered Design
- AI System + 5 Workflow Patterns
- AI Readiness Checklist + Problem Statement
- Go / Not Yet / No-Go

## CHIỀU - LAB (3.5H)

- 👤 Cá nhân:

Scan 5+ bài toán từ chính mình

- 👤 Cá nhân:

Viết Quick Problem Card top 3

👥 Nhóm:

Pitch - Challenge - Vote → chọn 1

- 👥 Nhóm:

Deep-Dive: workflow, PS, research

- 👥 Nhóm: Evaluate: AI Readiness

→ Go/No-Go

- 👤 Cá nhân:

Reflection Log

## DELIVERABLES

## ➤ Deliverable 1

Scan &amp; Filter Log (cá nhân)

## ➤ Deliverable 2

Problem Deep-Dive (nhóm)

## ➤ Deliverable 3

Reflection Log (cá nhân)

## Slide 2 — Building AI Product

AI Product chứa Build Product bên trong - không thay thế. [02:30]

<!-- image -->

## Một Số Cuốn Sách Nền Tảng

Deep-dive thêm sau khóa học. [02:45]

<!-- image -->

## KỸ THUẬT &amp; HỆ THỐNG

## AI Engineering

Chip Huyen (2025)

" Có [[API]] rồi - làm gì tiếp?" RAG, agents, guardrails, eval, production ops. [03:00]

<!-- image -->

## PRODUCT &amp; STRATEGY

## Inspired

Marty Cagan (2018)

Build cái gì, cho ai, và tại sao họ cần? Khám phá vấn đề thay vì feature factory. [03:15]

<!-- image -->

## TƯ DUY &amp; THIẾT KẾ

## Design of Everyday Things

Don Norman (2013)

Affordance, feedback, mental model. Nền tảng [[UX]] đặc biệt quan trọng khi AI không giải thích được. [03:30]

## 'Tôi muốn xây chatbot cho khách hàng'

Nếu stakeholder nói "Tôi muốn làm [[chatbot]]", theo bạn họ thực ra đang muốn giải bài toán gì? [04:00]

## 'Chatbot' không phải 1 bài toán

1 brief = 5 bài toán = 5 kiến trúc = 5 metric khác nhau. AI không sai. Họ giải sai bài toán. [04:30]

"Đừng bao giờ giải quyết vấn đề mà bạn được yêu cầu giải quyết."

Don Norman The Design of Everyday Things (2013) [05:00]

## Slide 3 — Tìm Đúng Vấn Đề Trước Khi Tìm Giải Pháp

Mô hình Kim Cương Đôi - Don Norman / British Design Council (2005) [05:45]

<!-- image -->

## Kim cương 1 - Tìm đúng vấn đề

Discover:

Mở rộng - khảo sát vấn đề căn bản

Define:

Thu hẹp - xác định đúng bài toán gốc [06:00]

## Kim cương 2 - Tìm đúng giải pháp

Develop:

Mở rộng - nhiều giải pháp tiềm năng

Deliver:

Thu hẹp - chọn và triển khai [06:15]

Kỹ sư và doanh nhân được đào tạo để giải vấn đề. Nhà thiết kế được đào tạo để khám phá vấn đề thật. [06:30]

Giải pháp xuất sắc cho sai vấn đề có thể còn tệ hơn không có giải pháp. [06:45]

## Slide 4 — Quy Trình Thiết Kế Lấy Con Người Làm Trung Tâm (HCD)

4 bước lặp lại bên trong mỗi kim cương - Don Norman [07:00]

<!-- image -->

## Observation (Quan sát)

Những người được quan sát phải phù hợp với đối tượng mục tiêu. Quan sát những khách hàng tiềm năng trong cuộc sống bình thường, hiểu các tình huống thực tế mà họ gặp phải. [07:30]

## Ideation (Tạo ra ý tưởng)

Tạo ra nhiều ý tưởng, sáng tạo mà không bị ràng buộc bởi các hạn chế. Tránh phê bình ý tưởng của bản thân hay của người khác. Đặt câu hỏi về tất cả mọi thứ. [08:00]

## Prototype (Tạo mẫu thử)

Tạo một nguyên mẫu nhanh cho mỗi giải pháp tiềm năng. Mục tiêu là kiểm tra nhanh nhất có thể trước khi build. [08:30]

## Test (Kiểm tra)

Ngồi quan sát cách người dùng tương tác với Prototype trong thực tế. [09:00]

## Iteration (Lặp lại)

Tinh chỉnh và nâng cao liên tục. [09:15]

## Slide 5 — Những Câu Hỏi 'Ngớ Ngẩn' Đã Thay Đổi Thế Giới

Norman: 'Hãy đặt câu hỏi về tất cả mọi thứ - đặc biệt là những điều hiển nhiên' [09:30]

<!-- image -->

## 'Nếu quá táo rơi xuống, thì mặt trăng có rơi không?'

Isaac Newton

Câu hỏi ngớ ngẩn về quả táo → nền tảng toàn bộ cơ học cổ điển &amp; cách mạng công nghiệp. [10:00]

<!-- image -->

## 'Tại sao con phải đợi lâu mới xem được ảnh?'

Jennifer Land, 3 tuổi (1943)

Câu hỏi của đứa trẻ → cha cô bé phát minh máy ảnh chụp lấy ngay Polaroid. [10:30]

<!-- image -->

## 'Nếu cho thuê phòng trống cho khách du lịch thì sao?'

Brian Chesky &amp; Joe Gebbia (2007)

Hai designer vật lộn tiền thuê nhà → [[Airbnb]], định giá hơn 100 tỷ USD. [11:00]

## Slide 6 — Problem-first, not AI-first

## 3 case studies thực tế [11:30]

## Team Cursor

Xây [[AI]] cho ngành mình không hiểu sâu (4 tháng trong cơ khí) → thiếu dữ liệu, thiếu insight domain. [12:00]

Kết quả: Hủy ý tưởng, pivot về phần mềm. [12:15]

## Bài học

Đừng xây AI rồi mong mọi người tự tìm cách dùng. Hãy bắt đầu từ trải nghiệm end-to-end và xác định đúng điểm AI giải quyết vấn đề người dùng thực sự quan tâm. [12:30]

Câu hỏi không còn là HOW to build - mà là WHAT TO BUILD. [12:45]

## Slide 7 — Artifact

AI cá nhân hóa tin tức tốt, nhưng market dynamics yếu (thiếu viral loop tự nhiên). Kết quả: Đóng cửa sản phẩm. [13:00]

## Slide 8 — CEO Lovable (Summer Labs)

Công nghệ tốt nhưng yêu cầu đổi tác phong làm việc của user hiện có để tích hợp. Kết quả: Khó được thị trường chấp nhận. [13:30]

## Slide 9 — Tìm bài toán AI ở đâu?

4 Lenses - Scan from self [14:00]

<!-- image -->

Lặp lại

Việc gì tôi/team làm đi làm lại mỗi ngày/tuần? [14:30]

<!-- image -->

Tốn thời gian

Việc gì mất nhiều thời gian hơn lẽ ra nên mất? [14:45]

<!-- image -->

## AI có thể tốt hơn

Sản phẩm nào tôi dùng mà [[AI]] có thể cải thiện? [15:00]

<!-- image -->

Pain từ người khác

Đồng nghiệp/bạn bè hay phàn nàn gì? [15:15]

## Lab hôm nay bắt đầu bằng scan from self - dùng 4 lenses này để quét xung quanh mình trước khi chọn bài toán. [15:30]

## Hai bài học từ Google

## GOOGLE FLU TRENDS

2008:

Tương quan 97.5% với [[CDC]] [15:45]

2011-2013:

SAI 100/108 tuần, ước tính cao >50%, bỏ lỡ H1N1 [16:00]

Nguyên nhân:

Proxy metric sai - search vì sợ cúm ≠ bị cúm thật. [16:15]

## BÀI HỌC

Sai problem framing / sai proxy metric. Correlation đẹp lúc đầu ≠ đúng dài hạn. [16:30]

## GOOGLE PHOTOS

Câu hỏi:

Có nên dùng [[AI]] cho filter ảnh? [16:45]

Đánh giá:

Rule-based đã đủ tốt - nhanh, ít rủi ro, dễ kiểm soát. [17:00]

Quyết định:

Chọn KHÔNG dùng AI. [17:15]

## BÀI HỌC

Không phải chỗ nào [[AI]] cũng add value. Rule-based đủ tốt → đừng tăng complexity. [17:30]

Trước khi hỏi 'dùng model gì' - phải hỏi 'mình đang tối ưu đúng biến chưa' và 'AI có thực sự tạo thêm giá trị không'. [17:45]

## Slide 10 — 4 Anti-Patterns Làm Team Đốt Tiền Vào AI Sai Chỗ

- [ ] ☐ Trend-first: Thay đổi theo trend 'agent' trước khi rõ actor, workflow, metric
- [ ] ☐ No baseline: Không có rule/manual baseline để so sánh nhưng vẫn build AI trước
- [ ] ☐ No eval path: Có demo đẹp nhưng không có bộ test, không biết khi nào đủ tốt để deploy
- [ ] ☐ No owner of failure: Không rõ ai review output sai, ai rollback, ai chịu compliance
- [ ] ☑ Nguyên tắc: Dùng [[AI]] khi nó tạo giá trị hơn cách đơn giản hơn, không phải vì nó nghe hiện đại hơn

Nhiều team nghĩ mình đang build [[AI]]. Thực ra họ đang build mơ hồ. [18:15]

## Slide 11 — Discovery Interview: 5 Câu Hỏi Nên Hỏi Stakeholder

- ■ Pain point là gì? Xảy ra bao nhiêu lần / ngày / tuần?
- ■ Workflow hiện tại ra sao? Tool nào, bước nào, ai hand-off cho ai?
- ■ Cost của vấn đề là gì? Mất bao nhiêu phút, tiền, SLA, hay conversion?
- ■ Nếu [[AI]] sai thì sao? Điểm nào cần HITL, approval, hoặc chỉ để suggest?
- ■ Ai sẽ nói YES? Metric nào và risk nào quyết định việc đầu tư?

Lưu ý: Nếu stakeholder không mô tả được workflow hiện tại và failure cost, team đang đề xuất solution trong sương mù. [19:00]

## Slide 12 — Có nên dùng AI không và dùng mức nào?

## Khi nào AI đáng để làm? [19:30]

## AI HỢP KHI NÀO

- ■ Tác vụ lặp lại nhưng biến thể vừa phải
- ■ Cần tổng hợp / search
- ■ Nhiều bước + nhiều tool
- ■ Deterministic thì rule có thể tốt hơn

Lý do áp dụng [[AI]] sẽ quyết định cách build, mức tự động hóa và mức đầu tư. [20:00]

## Slide 13 — VÌ SAO DOANH NGHIỆP ĐẦU TƯ

01 Sống còn - không dùng AI → [20:30]

02 Hiệu quả [20:45]

03 Khám phá: 

bị đối thủ vượt - giảm chi phí, tăng tốc, cải thiện throughput - đầu tư để học, tránh tụt hậu, tìm cơ hội mới. [21:00]

## Slide 14 — Tự xây dựng hay mua giải pháp?

Hai góc nhìn bổ sung nhau [21:30]

GÓC NHÌN 1 - CHIP HUYEN, AI ENGINEERING (2025)

In-house (Build): Khi [[AI]] là lợi thế cốt lõi và yếu tố sống còn. [21:45]

GÓC NHÌN 2 - MIT CISR (VAN DER MEULEN &amp; WIXOM, 2025)

## Buy

- Off-the-shelf, vendor duy trì
- Nhanh, ít differentiation
- Phụ thuộc vendor roadmap

## Boost

- Mua model + enhance bằng data riêng
- Fine-tune hoặc RAG
- Cần data governance tốt

Mua / SaaS (Buy)

Khi AI chủ yếu là productivity layer. [22:00]

## Build

- Tự xây custom model
- Control cao nhất, đắt nhất
- Cần team [[AI]] mạnh

Thực tế: Hầu hết team đang ở giữa - Boost (RAG / fine-tune). Không phải lúc nào cũng cần build from scratch. [22:30]

## Slide 15 — Thiết lập kỳ vọng

Đo gì để biết [[AI]] có đáng triển khai? [23:00]

## 1 - TÁC ĐỘNG KINH DOANH

Question: [[AI]] tạo giá trị gì cho doanh nghiệp? [23:15]

Đo bằng:

- % tác vụ / tin nhắn tự động hóa
- khả năng xử lý tăng thêm
- tốc độ phản hồi cải thiện
- thời gian lao động tiết kiệm [23:30]

## 2 - SỰ HÀI LÒNG KHÁCH HÀNG

Question: Người dùng có thật sự thấy tốt hơn không? [23:45]

Đo bằng:

- CSAT (Điểm hài lòng khách hàng)
- phản hồi trực tiếp
- hành vi sử dụng / bỏ giữa chừng / phải retry [24:00]

## 3 - NGƯỠNG HỮU DỤNG

Question: Tới mức nào thì sản phẩm đủ tốt để ship? [24:15]

Đo bằng:

Chất lượng: đầu ra có đúng và hữu ích không?

Độ trễ: TTFT, TPOT, thời gian phản hồi.

Chi phí: mỗi request tốn bao nhiêu? [24:30]

## Slide 16 — Từ Demo đến Production

Vì sao [[AI]] mất thời gian thật sự? [25:00]

## DEMO

## 1 cuối tuần

- Verify giả thuyết
- Align stakeholder
- Test nhanh UI/UX [25:15]

## PRODUCTION

## Nhiều tháng → năm

✗ Edge cases, guardrails

✗ Hallucination

✗ Giành từng 1% chất lượng [25:30]

## 80% → 95% là đoạn đau nhất

LinkedIn: 80% trải nghiệm trong 1 tháng, mất thêm 4 tháng để nhích lên 95%. [25:45]

## Slide 17 — AI Product Lifecycle

6 milestones từ ý tưởng đến vận hành [26:00]

<!-- image -->

Data Flywheel: feedback từ production → cải thiện data → model → architecture. [26:15]

## Slide 18 — Vai Trò Của UX Trong AI Product

[[AI]] không hoàn hảo, nếu [[UX]] không đưa ra được điều gì hữu ích. [26:30]

<!-- image -->

## AI System = Model + Context + Planning + Tools [26:45]

<!-- image -->

| Thành phần                                    | Cần khi...                           | Failure mode                            | Control                  | Cost driver          |
|-----------------------------------------------|--------------------------------------|-----------------------------------------|--------------------------|----------------------|
| Task mở, cần suy luận / tạo                   | văn bản Hallucination, inconsistency | Eval set, guardrails, structured output | tokens / latency         | Model                |
| Cần dựa trên tài liệu / trạng thái ngoài      | Wrong retrieval, stale context       | Retrieval test, freshness, citations    | storage / retrieval      | Context              |
| Task nhiều bước, cần ra quyết định trung gian | Looping, over-planning               | Step limit, policy, approvals           | extra calls              | Planning             |
| Tools Cần đọc / ghi hệ thống ngoài            | Side effects, prompt                 | injection                               | sandbox, allowlist, HITL | API calls / failures |

## Slide 19 — Framework Chọn Rule / Workflow / Agent

Bắt đầu đơn giản nhất - chỉ tăng phức tạp khi bài toán thật sự cần [27:30]

## Ba Mức Giải Pháp: Rule / Workflow / Agent

## Rule / Script

- Input ổn định
- Logic rõ ràng
- Cần predictability cao
- Compliance nặng

## LLM Feature

- Input biến thể vừa phải
- Output cần linh hoạt
- Có metric và guardrails
- Human có thể review

## Agent

- Nhiều bước, nhiều tool
- Trạng thái thay đổi liên tục
- Cần quyết định động
- Có risk control rõ ràng [28:00]

Thứ tự ưu tiên thực dụng: bắt đầu từ bên trái, chỉ đi sang bên phải khi giá trị tăng hơn độ phức tạp. [28:15]

## Slide 20 — Decision Tree: Chọn mức giải pháp

Từ bài toán của bạn → Rule, LLM Feature, hay Agent? [28:30]

<!-- image -->

## Slide 21 — Workflow Patterns - Đủ cho hầu hết bài toán

Nguồn: Anthropic - Building Effective Agents (2024) [29:00]

<!-- image -->

## 1. Prompt Chaining

Chia task thành chuỗi bước tuần tự. Có gate kiểm tra giữa các bước. [29:15]

VD: Viết outline → check → viết bài. [29:30]

<!-- image -->

## 2. Routing

Phân loại input → đưa vào nhánh chuyên biệt. Tối ưu từng loại riêng. [29:45]

VD: CS query → FAQ / refund / kỹ thuật. [30:00]

<!-- image -->

## 3. Parallelization

Chạy song song rồi tổng hợp (sectioning), hoặc chạy nhiều lần lấy vote. [30:15]

VD: Guardrail + response đồng thời. [30:30]

Nguyên tắc Anthropic: 'Start with the simplest solution possible, only increase complexity when needed.' - Hầu hết bài toán thực tế chỉ cần 3 patterns này. [30:45]

## Slide 22 — Khi Nào Cần Phức Tạp Hơn?

Orchestrator-Workers, Evaluator-Optimizer, và Agent [31:00]

<!-- image -->

## 4. Orchestrator-Workers

- 1 LLM phân việc động cho workers. Subtasks không biết trước. [31:15]

VD: Coding agent sửa nhiều file. [31:30]

<!-- image -->

## Agent

LLM tự lập kế hoạch + gọi tools + iterate. Autonomous loop. [31:45]

VD: SWE-bench, computer use. [32:00]

Chi phí cao hơn, lỗi cộng dồn. Chỉ dùng khi không predict được subtasks và cần tool autonomy. 'Agents' autonomy makes them ideal for scaling tasks in trusted environments.' [32:15]

<!-- image -->

5. Evaluator-Optimizer

1 LLM tạo, 1 LLM đánh giá → lặp cho đến khi đạt. [32:30]

VD: Dịch văn học → review → sửa. [32:45]

## Slide 23 — AI Readiness Checklist - 5 Câu Hỏi Nhanh

- Value: Bài toán xảy ra thường xuyên và đang tốn thời gian / tiền / SLA thật sự?
- Baseline: Hiện tại đã có manual hoặc workflow baseline để so sánh?
- Eval: Có metric, sample cases, hoặc logs để đánh giá reproducible?
- Tolerance: Sai số hữu hạn có chấp nhận được, hoặc có HITL ở điểm quan trọng?
- Operations: Có owner, rollback, logging, và policy cho output sai? [33:00]

Dưới 3 câu YES: dừng lại và làm rõ problem / workflow trước khi đầu tư [[AI]]. [33:15]

Thiếu baseline hoặc thiếu eval = chưa biết AI đang tốt hơn cái gì. [33:30]

Lưu ý: [[AI]] "Jagged Frontier" - ranh giới AI gồ ghề, khó đoán. Framework là starting point, không phải kết luận. Phải test thực tế. (Dell'Acqua, Mollick et al. 2023) [33:45]

## Slide 24 — Gate Criteria: Đi Tiếp Khi Nào, Dừng Lại Khi Nào?

Rules of ML + practical AI product heuristics [34:00]

| Giai đoạn                                              | Go nếu...                                          | No-Go nếu...     |
|--------------------------------------------------------|----------------------------------------------------|------------------|
| Actor, workflow, pain, metric đã rõ                    | Problem mơ hồ, mô tả solution trước problem        | Problem Scoping  |
| Có data / logs / docs / SME support để eval            | Không có nguồn dữ liệu hoặc dữ liệu quá lệch       | Data Readiness   |
| Heuristic, workflow, hoặc baseline người được xác lập  | Chưa biết [[AI]] cần tốt hơn cái gì                 | Baseline / Model |
| Có bộ test, task-level eval, latency/cost budget       | Chỉ có demo thủ công, không có reproducible eval   | Build & Eval     |
| Có HITL, logging, approval, rollback, owner of failure | Không rõ ai duyệt output, ai dừng hệ thống khi sai | Deploy Controls  |

## Slide 25 — Key takeaways:

- Không có metric → không có gate
- Không có baseline → chưa biết tốt hơn gì
- Không có eval → mới chỉ là demo
- Không có rollback → deploy là đánh bạc [35:00]

## Slide 26 — Problem Statement

Từ ý tưởng mơ hồ đến bài toán có metric, boundary, và đường eval. [35:30]

<!-- image -->

## Khung Problem Statement Cho AI System

Một problem statement tốt phải giúp suy ra được test case, metric và boundary. [35:45]

| Actor / Operator     | Ai đang làm việc này hằng ngày?                                           |
|----------------------|---------------------------------------------------------------------------|
| Current Workflow     | Hiện tại họ xử lý qua những bước nào, dùng tool gì?                       |
| Bottleneck           | Bước nào chậm, lỗi, không nhất quán, hoặc cần tổng hợp quá nhiều?         |
| Impact               | Tổn thất đo bằng thời gian, chi phí, SLA, error rate, hay conversion nào? |
| Success Metric       | Khi nào được coi là thành công? Mức ngưỡng là bao nhiêu?                  |
| Operational Boundary | Hệ thống được phép làm gì, không được phép làm gì, và điểm nào cần HITL?  | [36:00]

## Nhớ

Nếu viết xong mà bạn chưa suy ra được test cases, eval metric, và architecture boundary, thì problem statement vẫn chưa đủ chặt. [36:30]

## Slide 27 — Từ Problem Statement Sang Eval Plan

Problem Statement tốt là cầu nối giữa bài toán kinh doanh và bộ eval kỹ thuật. [37:00]

## Slide 28 — Chọn Đúng Metric: North Star &amp; Input/Output

Nguồn: Lenny Rachitsky (a16z) - North Star Metric Framework [37:30]

Câu hỏi: metric nào nếu tăng hôm nay sẽ tăng tốc flywheel kinh doanh nhất? [37:45]

## Revenue

ARR, GMV [38:00]

## Customer Growth

Paid users, market share [38:15]

Output Metric (North Star)

Kết quả cuối - team không trực tiếp control [38:30]

Airbnb: 'nights booked' [38:45]

## Engagement

MAU, DAU [39:00]

Growth Efficiency LTV/CAC, margins [39:15]

## Input Metrics (Levers)

Cái team làm hằng ngày để đẩy output lên [39:30]

Airbnb: conversion rate, supply of homes, site traffic [39:45]

PS field 'Success Metric': cần cả output metric (thành công = gì?) và input metric (team làm gì hằng ngày?). 'Cải thiện hiệu suất' không phải metric. [40:00]

## Consumption

Messages sent, nights booked. User Experience NPS, CSAT [40:20]

## Discovery và Feasibility

Kiểm tra bài toán, khả năng triển khai, và risk trước khi viết dòng code đầu tiên. [40:40]

## Slide 29 — Go / No-Go / Not Yet

- Go: Problem rõ, baseline rõ, eval rõ, risk controls rõ.
- Not Yet: Có pain thật, nhưng thiếu data, thiếu metric, hoặc chưa rõ workflow boundary.
- No-Go: Rule-based đã đủ tốt, hậu quả khi sai quá đắt, hoặc change cost lớn hơn value. [41:00]

## Bài học cho Dev

Quyết định chuẩn không phải lúc nào cũng là 'build'. Rất nhiều dự án [[AI]] thành công bắt đầu bằng không build ngay, mà bằng đo baseline, gom logs, và thử workflow đơn giản hơn. [41:30]

Lab hôm nay không bắt buộc ra kết luận Go. Kết luận tốt có thể là Not Yet hoặc No-Go. [41:45]

<!-- image -->

## Slide 30 — Workflow nào quanh bạn đủ đau để đáng cân nhắc AI?

## Tổng Kết Ngày 2

- 1 Đừng giải quyết vấn đề bạn được yêu cầu giải quyết - hãy tìm vấn đề thật trước. (Don Norman)
- 2 Bắt đầu từ rule / workflow trước khi nhảy lên agent. Đúng architecture quan trọng hơn đúng model.
- 3 5 Workflow Patterns (Anthropic) cho vocabulary cụ thể - hầu hết bài toán chỉ cần Prompt Chaining hoặc Routing.
- 4 Problem Statement tốt phải suy ra được eval plan, system boundary, và success metric có ngưỡng cụ thể.
- 5 "Not Yet" không phải thất bại - đó là quyết định trưởng thành nhất khi chưa đủ data hoặc baseline. [42:30]

## Thực Hành

Lab 2: Chọn use case, viết PS, và ra quyết định go/no-go. [42:45]

<!-- image -->

## Tổng quan Lab 2 - Deliverables &amp; AI Rules

<!-- image -->

## Phase 1 + 2

Hoạt động cá nhân. [43:00]

<!-- image -->

## Hướng dẫn vẽ Workflow Diagram

Dùng cho Phase 4 - Deep-dive: Current-State &amp; Future-State [43:15]

<!-- image -->

## Worked Example: Weekly Report - Trước và Sau AI

## Weekly Report - 7 bưc, 90 phút → 5 bưc, 21 phút [43:30]

<!-- image -->

## Phase 3 · Pitch - Challenge - Vote

Framework peer review trong nhóm · 30 phút [43:45]

## PITCH

## 2 phút / người

- Present bài toán của mình cho nhóm
- Dùng Quick Problem Card làm visual [44:00]

## ⚡ CHALLENGE

## 3 câu hỏi chuẩn · 3 phút / người

- "Rule/script đủ chưa? Có thật sự cần [[AI]] không?"
- "Ngoài bạn, ai đau nữa? Bao nhiêu người?"
- "Metric đo được không? Có số cụ thể chưa?" [44:15]

## VOTE

<!-- image -->

## 5-10 phút sau khi tất cả pitch

- Mỗi người 1 phiếu → chọn 1 bài đi tiếp
- Viết 1 dòng kill rationale cho bài bị loại [44:30]

## Quick Problem Card - Ví dụ đã điền

Mỗi người điền 1 card trong Phase 2 · ~5 phút [44:45]

| Bài toán (1 câu)                | Mất 3h/ngày để tổng hợp feedback từ 200+ email khách hàng thành báo cáo cho team sản phẩm   |
|---------------------------------|---------------------------------------------------------------------------------------------|
| Ai đang đau?                    | Product Manager · ~50 PM trong công ty · lặp lại mỗi tuần                                   |
| Workflow hiện tại (3-5 bước)    | Nhận email → đọc từng email → tự tóm tắt → gộp thành doc → gửi team                         |
| Bước nào tốn nhất?              | Bước 2 - đọc & tóm tắt (~2.5h/ngày · 150h/tuần × 50 PM)                                     |
| [[AI]] có thể giúp ở bước nào?  | Bước 2 - [[AI]] tóm tắt từng email, PM review + edit trước khi gửi                          |
| Đo thành công bằng gì? (có số!) | Giảm từ 3h → dưới 30 min/ngày · chất lượng báo cáo đồng đều hơn                             |
| Quick gut                       | ☑ LLM - cần xử lý ngôn ngữ tự nhiên đa dạng, không thể rule-based                           | [45:15]

💡

<!-- image -->

## Nhận xét

## Lab 2 - Deliverables - Mỗi người cần nộp gì?

## [Deliverables Example](https://github.com/VinUni-AI20k/AI-Product-Labs/blob/main/day-02/02-deliverable-example.md)
<!-- image -->
```
