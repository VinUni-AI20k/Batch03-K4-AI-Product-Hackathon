---
course: packs
generated: '2026-07-30T10:33:41+00:00'
lang: vi
lesson: 2-day04-lecture-slide-v3
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/slides/2-day04-lecture-slide-v3.md
source_hash: sha256:cc29df8ffc8d64fdf17e34d08cd8161818d1cbb69510067accd57791005e7f95
type: lesson-note
---

```markdown
## Slide 1 — AI IN ACTION · DAY 04
AI IN ACTION · DAY 04  
PROMPT · CONTEXT · TOOL · CONTROL  
Mỗi agent tốt cần gọi đúng công cụ, sử dụng thông tin chính xác và biết điểm dừng khi cần kiểm soát.  
- **PROMPT**: Chỉ dẫn rõ ràng  
- **CONTEXT**: Thông tin đúng lúc, đúng nguồn  
- **TOOL**: Năng lực đọc dữ liệu và thực hiện hành động  
- **CONTROL**: Approval, eval, logging và guardrail  
INSTRUCTOR: MAI ANH NGUYEN (BLUE)

## Slide 2 — Từ agent chạy được đến agent đáng tin
Một agent tốt không chỉ biết gọi công cụ, mà còn phải biết dừng khi cần kiểm soát.  
**NGÀY 3**: Agent biết chạy  
**NGÀY 4**: Agent đáng tin hơn  
### AGENDA
- Vòng lặp xử lý (Agent loop / ReAct)
- Gọi công cụ cơ bản (tool calling)
- Bản ghi các bước thực hiện (trace log)
- Prompt: Chỉ dẫn nhiệm vụ có rõ không?
- Context: thông tin có đủ và đúng nguồn không?
- Tool: agent có chọn đúng công cụ và điền đúng tham số không?
- Eval / versioning: phiên bản mới có tốt hơn phiên bản cũ không?

## Slide 3 — Agenda
### Mục tiêu: debug AI app theo đúng lớp cần sửa
1. **PROMPT**: Prompt fundamentals
2. **CONTEXT**: Context engineering
3. **TOOL**: Tool declaration & result
4. **CONTROL**: Control & harness
5. **LAB**: Lab artifacts

## Slide 4 — Prompt vs Context Engineering
Từ một yêu cầu đơn giản đến một hệ AI có chỉ dẫn, ngữ cảnh, công cụ và cơ chế kiểm soát rõ ràng.

## Slide 5 — Context = bàn làm việc của model
Model không chỉ đọc prompt mà còn xử lý toàn bộ thông tin trong context. Chất lượng câu trả lời phụ thuộc vào toàn bộ thông tin trong context.  
- **Context**: Bàn làm việc bao gồm thông tin từ yêu cầu hiện tại, lịch sử hội thoại, dữ liệu được truy xuất, kết quả từ công cụ và quy tắc kiểm soát.

## Slide 6 — Bản đồ các lớp của AI app
Cần xác định lỗi thuộc lớp nào trước khi chỉnh sửa.  
### BẢN ĐỒ 4 LỚP
- **Control**: Cơ chế vận hành
- **Prompt**: Chỉ dẫn đầu tiên
- **Context**: Thông tin đang có
- **Tool**: Năng lực bổ sung

## Slide 7 — Prompt fundamentals
Lớp chỉ dẫn đầu tiên: vai trò, nhiệm vụ, ranh giới và định dạng đầu ra.

## Slide 8 — Prompt là lớp can thiệp đầu tiên
Prompt là phần dễ chỉnh nhất để định hướng nhiệm vụ, phạm vi xử lý và cách model trả lời.

## Slide 9 — System prompt vs User prompt
Hệ thống và người dùng gửi các message khác nhau vào model, nhưng có vai trò và mức ưu tiên khác nhau.

## Slide 10 — Người dùng thấy chat, model nhận context
Mô tả cụ thể về cách model xử lý thông tin từ người dùng và xây dựng context.

## Slide 11 — Prompt template vs chat template
Cơ chế khiến context multi-turn dày lên: chatbot "nhớ" bằng cách nào?

## Slide 12 — Prompt mơ hồ
Một prompt không rõ ràng sẽ khiến model phải đoán.

## Slide 13 — Calibrating the system prompt
Chỉnh sửa hệ thống prompt cần đủ rõ để hướng dẫn hành vi, nhưng không quá cụ thể.

## Slide 14 — Role · Task · Context · Format
Scaffold tối thiểu không giao việc mơ hồ.

## Slide 15 — Một prompt tốt hơn trông như thế nào?
Prompt tốt chia rõ nhiệm vụ, dữ kiện cần có, ranh giới và cấu trúc đầu ra.

## Slide 16 — Cấu trúc prompt bằng nhãn phân tách
Sử dụng XML tags hoặc delimiters để tách rõ instruction, context, examples, user input và output format.

## Slide 17 — Boundary & ask-if-missing
Khi thiếu dữ kiện quan trọng, model nên hỏi lại.

## Slide 18 — Output Format
Thiết kế đầu ra theo nơi nó sẽ được dùng: người đọc hay hệ thống xử lý.

## Slide 19 — Output Format: Ví dụ
Trong một agent, mỗi bước cần format khác nhau tùy thuộc vào người nhận.

## Slide 20 — Đừng nhồi một prompt khổng lồ
Chia task phức tạp thành bước nhỏ hơn để dễ debug, test và kiểm soát.

## Slide 21 — Prompt scaffolding ladder
Bắt đầu với prompt đơn giản, chỉ thêm ví dụ khi thật sự cần thiết.

## Slide 22 — Zero · One · Few-shot
Khi nào chỉ cần nêu quy tắc, khi nào cần thêm ví dụ mẫu?

## Slide 23 — Ví dụ không miễn phí
Mỗi ví dụ chiếm token budget, có thể gây ra độ trễ và tăng chi phí.

## Slide 24 — ❡REFERENCE BANK · PROMPT
Format và example giải quyết hai lỗi khác nhau trong đầu ra.

## Slide 25 — Chain of Thought
Reasoning theo từng bước để có cái nhìn rõ ràng hơn.

## Slide 26 — Tree of Thought
Thử nhiều hướng, đánh giá, rồi chọn — tránh khóa vào hướng đầu tiên.

## Slide 27 — Chuỗi thẩm quyền của instruction
Khi các chỉ dẫn mâu thuẫn, model ưu tiên cấp cao hơn.

## Slide 28 — Prompt versioning
Prompt thay đổi hành vi của model, nên mọi sửa đổi cần phải có những minh chứng rõ ràng.

## Slide 29 — Prompt là artifact vận hành
Một prompt production cần metadata, eval và đường rollback.

## Slide 30 — Prompt Versioning — Example
Một version log tốt ghi rõ: sửa artifact nào, kỳ vọng cải thiện gì, kết quả đo ra sao, và quyết định tiếp theo.

## Slide 31 — Tổng kết: Prompt Engineering như một kỷ luật vận hành
Prompt không chỉ là văn tự; nó là cách thiết kế input, context, ví dụ, format và vòng đo lường.

## Slide 32 — ❡REFERENCE BANK · PROMPT
Debug theo lỗi, không theo cảm giác.

## Slide 33 — 03 S E C T I O N
Context engineering
Prompt là một phần của context; context là toàn bộ thứ model nhìn thấy.

## Slide 34 — Prompt là một phần của context
Model xử lý toàn bộ context được gửi vào lượt đó.

## Slide 35 — Context packet
Gói thông tin được hệ thống lắp trước mỗi lượt gọi model.

## Slide 36 — Hỏi người dùng hay tra nguồn?
Khác nhau giữa thông tin cần hỏi từ người dùng và thông tin cần tra từ nguồn đáng tin cậy.

## Slide 37 — Dynamic context
Dữ liệu thay đổi theo thời gian cần metadata.

## Slide 38 — Context window = token budget
Mặt bàn rộng hơn có nghĩa là có thể chứa nhiều thông tin hơn.

## Slide 39 — Lost in the Middle
Context dài hơn không đảm bảo các phần đều được sử dụng hiệu quả như nhau.

## Slide 40 — Context rot
Có quá nhiều thông tin gây nhầm lẫn cho model.

## Slide 41 — Write · Select · Compress · Isolate
Quy trình để đặt thông tin lên bàn làm việc mà không gây rối.

## Slide 42 — History compaction: summarize · drop · archive
Tóm tắt và quản lý thông tin lịch sử một cách hiệu quả.

## Slide 43 — Web content là untrusted context
Nội dung từ web chỉ làm dữ liệu để đọc chứ không phải chỉ dẫn phải làm theo.

## Slide 44 — Build context packet
Một packet gọn & đáng tin: biết gì, thiếu gì, cần tool gì, không được làm gì.

## Slide 45 — ❡REFERENCE BANK · CONTEXT
Context operations + memory.

## Slide 46 — ❡REFERENCE BANK · CONTEXT
Long-context failure bank - "Context window to hơn không có nghĩa cứ nhét hết".

## Slide 47 — 04 S E C T I O N
Tools: gọi đúng và trả đúng

## Slide 48 — Tool có hai chiều cần thiết kế
Gọi đúng tool và xử lý kết quả đúng.

## Slide 49 — Từ user request đến tool results
Agent dùng tool declarations để chọn tool, tạo arguments và gọi tool.

## Slide 50 — R E Q U E S T S I D E
Cần quyết định trước khi gọi tool.

## Slide 51 — Tool taxonomy
Phân loại tool theo mức tác động: bổ sung thông tin, mở rộng năng lực hay thay đổi trạng thái thật.

## Slide 52 — Agent spec: mỗi agent có một bộ tool riêng
Tool là một phần của cấu hình agent.

## Slide 53 — Mở ít tool, nhưng mở đúng tool
Nên mở đúng tool, không quá nhiều.

## Slide 54 — Tool access: mỗi agent chỉ thấy tool cần dùng
Chọn tool theo agent, stage, quyền và rủi ro.

## Slide 55 — Tool declaration: mô tả để model gọi đúng tool
Mô tả rõ giúp model không gọi sai tool.

## Slide 56 — Bad vs Good tool declaration
Sự phân loại và mô tả rõ giúp agent không lẫn giữa các loại công cụ.

## Slide 57 — Tool arguments
Agent cần trích xuất, chuẩn hóa và kiểm tra tham số trước khi gọi.

## Slide 58 — Agent có dùng đúng công cụ không?
Kiểm tra agent đã gọi đúng tool, đúng tham số và đúng quyền.

## Slide 59 — R E S P O N S E S I D E
Tool result là context mới cho model.

## Slide 60 — Tool result đi đâu sau khi tool chạy?
Kết quả từ tool vẫn cần được xử lý trước khi quay lại context.

## Slide 61 — Tool result đi qua trust boundary nhiều lớp
Có nhiều lớp kiểm soát đảm bảo độ tin cậy của dữ liệu.

## Slide 62 — Tool result cần một lớp xử lý trước khi quay lại model
Kết quả sơ bộ từ tool cần được xử lý để không gây nhầm lẫn cho model.

## Slide 63 — Tool errors & no-tool cases
Xử lý hợp lý khi không gọi tool hoặc khi tool gặp lỗi.

## Slide 64 — 05 S E C T I O N
Read / write boundary

## Slide 65 — Read tool vs write tool
Sự khác biệt giữa tool chỉ đọc và tool thực hiện thay đổi.

## Slide 66 — Risk ladder
Xếp hạng rủi ro của tool từ đọc thông tin đến thực hiện hành động.

## Slide 67 — Approval: lớp xác nhận
Quy trình xác nhận hành động của agent trước khi thực hiện.

## Slide 68 — 06 S E C T I O N
Eval · Safety · Harness

## Slide 69 — Tiny eval
Bộ test tối thiểu trước khi sửa prompt hoặc context.

## Slide 70 — Prompt eval vs Agent eval
Sự khác biệt giữa đánh giá một lượt gọi và đánh giá toàn bộ quy trình.

## Slide 71 — Prompt improvement ladder
Bước cải thiện prompt từ thủ công đến tự động hóa.

## Slide 72 — Harness là quy trình quanh bàn làm việc
Quy trình quản lý việc đưa thông tin lên bàn, tool được gọi, và log được giữ lại.

## Slide 73 — Production controls tối thiểu
Kiểm soát vận hành cơ bản cần có trong lab.

## Slide 74 — Debug-by-design: bản đồ sửa AI app
Xác định lớp nào gây ra lỗi và tiến hành sửa theo lớp đó.

## Khái niệm chính
- [[prompt]]: Chỉ dẫn rõ ràng cho AI.
- [[context]]: Thông tin mà AI xử lý trong phiên làm việc.
- [[tool]]: Công cụ AI sử dụng để lấy dữ liệu hoặc thực hiện hành động.
- [[control]]: Cơ chế quản lý các hành động và kết quả của AI.
- [[agent]]: Hệ thống AI thực hiện các yêu cầu từ người dùng.
- [[versioning]]: Quá trình theo dõi và cải thiện các phiên bản của prompt.
- [[evaluation]]: Đánh giá hiệu suất của AI dựa trên kết quả đầu ra.
```
