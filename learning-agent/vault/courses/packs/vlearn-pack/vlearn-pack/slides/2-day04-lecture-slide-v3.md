---
course: packs
generated: '2026-07-31T18:14:51+00:00'
lang: vi
lesson: 2-day04-lecture-slide-v3
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\slides\2-day04-lecture-slide-v3.md
source_hash: sha256:0ef4e5a0678c7273bf79f1a51ca049524297e6dbf1d659838f5aec627f42d786
type: lesson-note
---

```markdown
## Slide 1 — AI IN ACTION · DAY 04
AI trong hành động, ngày 04. Một agent tốt không chỉ biết gọi công cụ, mà còn phải gọi đúng, dùng đúng thông tin và biết dừng khi cần kiểm soát. 
- **PROMPT**: Chỉ dẫn rõ ràng
- **CONTEXT**: Thông tin đúng lúc, đúng nguồn
- **TOOL**: Năng lực đọc dữ liệu và thực hiện hành động
- **CONTROL**: Phê duyệt, đánh giá, ghi log và giới hạn rủi ro
<!-- src: slide 1 -->

## Slide 2 — Từ agent chạy được đến agent đáng tin
Một agent tốt không chỉ biết gọi công cụ, mà còn phải gọi đúng, dùng đúng thông tin và biết dừng khi cần kiểm soát. 
- **Ngày 3**: Agent biết chạy
- **Ngày 4**: Agent đáng tin hơn
### AGENDA
- Vòng lặp xử lý (Agent loop / ReAct)
- Gọi công cụ cơ bản (tool calling)
- Bản ghi các bước thực hiện (trace log)
- Prompt: Chỉ dẫn nhiệm vụ có rõ không?
- Context: thông tin có đủ và đúng nguồn không?
- Tool: agent có chọn đúng công cụ và điền đúng tham số không?
- Eval / versioning: phiên bản mới có tốt hơn phiên bản cũ không?
<!-- src: slide 2 -->

## Slide 3 — Agenda
Mục tiêu: debug AI app theo đúng lớp cần sửa
01. **PROMPT**: Viết instruction rõ: role, task, format, boundary; biết khi nào dùng example, CoT/ToT.
02. **CONTEXT**: Prompt là một phần của context; chọn đúng thông tin nào đặt lên bàn.
03. **TOOL**: Khai báo tool để route đúng; thiết kế tool result như context mới.
04. **CONTROL**: Khi nào cần approval, eval, logging, retry và guardrail.
05. **LAB**: Chỉnh prompt, context policy, tool spec, result template & eval cases.
Mỗi phần tương ứng với một loại lỗi khi AI app chưa đáng tin.
<!-- src: slide 3 -->

## Slide 4 — Prompt vs Context Engineering
Từ một yêu cầu đơn giản đến một hệ AI có chỉ dẫn, ngữ cảnh, công cụ và cơ chế kiểm soát rõ ràng.
<!-- src: slide 4 -->

## Slide 5 — Context = bàn làm việc của model
Model không chỉ đọc prompt. Model xử lý toàn bộ thông tin đang được đặt trong context. Prompt chỉ là một phần của context. Chất lượng câu trả lời phụ thuộc vào toàn bộ thông tin được đặt lên bàn.
- **YÊU CẦU HIỆN TẠI**: User request
- **LỊCH SỬ HỘI THOẠI**: History
- **DỮ LIỆU ĐƯỢC TRUY XUẤT**: Retrieved data
- **KẾT QUẢ TỪ CÔNG CỤ**: Tool result
- **QUY TẮC, CHECKLIST, ĐỊNH DẠNG ĐẦU RA**: Control
<!-- src: slide 5 -->

## Slide 6 — Bản đồ các lớp của AI app
Khi hệ thống chưa làm đúng, cần xác định lỗi thuộc lớp nào trước khi chỉnh sửa. Không phải lỗi nào cũng là lỗi prompt. 
- **CONTROL**: Cơ chế vận hành; phê duyệt, kiểm thử, ghi log, thử lại và giới hạn rủi ro.
- **PROMPT**: Chỉ dẫn đầu tiên; nhiệm vụ, giới hạn, tiêu chí và định dạng đầu ra.
- **CONTEXT**: Thông tin đang có; dữ kiện người dùng, tài liệu, lịch sử hội thoại và dữ liệu liên quan.
- **TOOL**: Năng lực bổ sung; cách lấy thêm thông tin hoặc thực hiện hành động bên ngoài model.
<!-- src: slide 6 -->

## Slide 7 — Prompt fundamentals
Lớp chỉ dẫn đầu tiên: vai trò, nhiệm vụ, ranh giới và định dạng đầu ra.
<!-- src: slide 7 -->

## Slide 8 — Prompt là lớp can thiệp đầu tiên
Đây là phần dễ chỉnh nhất để định hướng nhiệm vụ, phạm vi xử lý và cách model trả lời. 
- **Vai trò cần đảm nhận**
- **Nhiệm vụ cần hoàn thành**
- **Thông tin được phép sử dụng**
- **Ranh giới không được vượt qua**
- **Định dạng kết quả cần trả về**
- **Cách xử lý khi thiếu dữ kiện**
<!-- src: slide 8 -->

## Slide 9 — System prompt vs User prompt
Cùng được gửi vào model dưới dạng message, nhưng khác vai trò và mức ưu tiên.
- **SYSTEM**: Luật nền do app thiết lập; vai trò, nguyên tắc xử lý, ràng buộc và mức ưu tiên cao hơn user.
- **USER**: Yêu cầu ở lượt hiện tại, nội dung cần xử lý, câu hỏi, dữ kiện hoặc mục tiêu của người dùng.
- **ASSISTANT**: Phản hồi của model trong lịch sử.
Context không phải một role riêng — app quyết định message nào và dữ kiện nào được đưa vào lượt gọi model.
<!-- src: slide 9 -->

## Slide 10 — Người dùng thấy chat, model nhận context
Trước mỗi lượt trả lời, app lắp lại các thông tin cần thiết thành một context packet cho model.
<!-- src: slide 10 -->

## Slide 11 — Prompt template vs chat template
Cơ chế khiến context multi-turn dày lên: chatbot "nhớ" bằng cách nào? 
- **PROMPT TEMPLATE**: App developer viết nội dung một message.
- **CHAT TEMPLATE**: Model/provider serialize cả list messages thành token.
<!-- src: slide 11 -->

## Slide 12 — Prompt mơ hồ
Prompt mơ hồ
"Lên plan Đà Nẵng giúp tôi" khiến model phải đoán nhiều thông tin cần thiết.
<!-- src: slide 12 -->

## Slide 13 — Calibrating the system prompt
Prompt cần đủ rõ để hướng dẫn hành vi, nhưng không nên biến thành danh sách rule cứng cho mọi tình huống.
<!-- src: slide 13 -->

## Slide 14 — Role · Task · Context · Format
Scaffold tối thiểu để không giao việc mơ hồ: bạn là ai trong workflow này? bạn cần làm việc gì? được biết/dùng thông tin nào? trả lời theo cấu trúc nào?
<!-- src: slide 14 -->

## Slide 15 — Một prompt tốt hơn trông như thế nào?
Prompt tốt chia rõ nhiệm vụ, dữ kiện cần có, ranh giới và cấu trúc đầu ra.
<!-- src: slide 15 -->

## Slide 16 — Cấu trúc prompt bằng nhãn phân tách
Dùng XML tags hoặc delimiters để tách rõ instruction, context, examples, user input và output format.
<!-- src: slide 16 -->

## Slide 17 — Boundary & ask-if-missing
Khi thiếu dữ kiện quan trọng, model nên hỏi lại, không biến thiếu thành câu trả lời tự tin.
<!-- src: slide 17 -->

## Slide 18 — Output Format
Thiết kế đầu ra theo nơi nó sẽ được dùng: người đọc hay hệ thống xử lý.
<!-- src: slide 18 -->

## Slide 19 — Output Format: Ví dụ
Trong một agent, mỗi bước cần format khác nhau tùy vào output đi đâu tiếp.
<!-- src: slide 19 -->

## Slide 20 — Đừng nhồi một prompt khổng lồ
Chia task phức tạp thành bước nhỏ hơn để dễ debug, test và kiểm soát.
<!-- src: slide 20 -->

## Slide 21 — Prompt scaffolding ladder
Bắt đầu bằng prompt đơn giản; chỉ thêm ví dụ hoặc bước suy luận khi có lý do.
<!-- src: slide 21 -->

## Slide 22 — Zero · One · Few-shot
Khi nào chỉ cần nêu quy tắc, khi nào cần thêm ví dụ mẫu?
<!-- src: slide 22 -->

## Slide 23 — Ví dụ không miễn phí
Mỗi ví dụ chiếm token budget; nhiều ví dụ không miễn phí và có thể không cải thiện output.
<!-- src: slide 23 -->

## Slide 24 — REFERENCE BANK · PROMPT
Format và example giải quyết hai lỗi khác nhau; format kiểm soát đầu ra; example cho model thấy pattern đúng.
<!-- src: slide 24 -->

## Slide 25 — Chain of Thought
Reasoning theo từng bước; không phải câu thần chú "think step by step".
<!-- src: slide 25 -->

## Slide 26 — Tree of Thought
Thử nhiều hướng, đánh giá, rồi chọn — tránh khóa vào hướng đầu tiên.
<!-- src: slide 26 -->

## Slide 27 — Chuỗi thẩm quyền của instruction
Khi các chỉ dẫn mâu thuẫn, model ưu tiên cấp cao hơn.
<!-- src: slide 27 -->

## Slide 28 — Prompt versioning
Prompt thay đổi hành vi của model, nên không thể sửa bằng cảm giác.
<!-- src: slide 28 -->

## Slide 29 — Prompt là artifact vận hành
Một prompt production cần metadata, eval và đường rollback. 
<!-- src: slide 29 -->

## Slide 30 — Prompt Versioning — Example
Một version log tốt ghi rõ: sửa artifact nào, kỳ vọng cải thiện gì, kết quả đo ra sao, và quyết định tiếp theo.
<!-- src: slide 30 -->

## Slide 31 — Tổng kết: Prompt Engineering như một kỷ luật vận hành
Prompt không chỉ là câu chữ; nó là cách thiết kế input, context, ví dụ, format và vòng đo lường để điều chỉnh hành vi model.
<!-- src: slide 31 -->

## Slide 32 — REFERENCE BANK · PROMPT
Debug theo lỗi, không theo cảm giác — gọi tên lỗi trước, rồi mới chọn pattern và artifact cần sửa.
<!-- src: slide 32 -->

## Slide 33 — Context engineering
Prompt là một phần của context; context là toàn bộ thứ model nhìn thấy.
<!-- src: slide 33 -->

## Slide 34 — Prompt là một phần của context
Prompt là phần ta chủ động viết, nhưng model xử lý toàn bộ context được gửi vào lượt đó.
<!-- src: slide 34 -->

## Slide 35 — Context packet
Gói thông tin được hệ thống lắp trước mỗi lượt gọi model.
<!-- src: slide 35 -->

## Slide 36 — Hỏi người dùng hay tra nguồn?
Khi thiếu thông tin không có nghĩa là để model đoán; cũng không phải thiếu gì cũng hỏi người dùng.
<!-- src: slide 36 -->

## Slide 37 — Dynamic context
Dữ liệu thay đổi theo thời gian cần metadata.
<!-- src: slide 37 -->

## Slide 38 — Context window = token budget
Mặt bàn rộng hơn đặt được nhiều giấy hơn — nhưng capacity ≠ efficiency.
<!-- src: slide 38 -->

## Slide 39 — Lost in the Middle
Context dài hơn không đảm bảo mọi phần được dùng hiệu quả như nhau.
<!-- src: slide 39 -->

## Slide 40 — Context rot
Bàn quá nhiều giấy cũng làm model rối: nhiều hơn không luôn tốt hơn.
<!-- src: slide 40 -->

## Slide 41 — Write · Select · Compress · Isolate
Đặt thông tin lên bàn mà không làm bàn rối.
<!-- src: slide 41 -->

## Slide 42 — History compaction: summarize · drop · archive
Chatbot nói 10 lượt: giữ gì trên bàn và bỏ gì?
<!-- src: slide 42 -->

## Slide 43 — Web content là untrusted context
Lấy nội dung từ web: là thông tin, không phải chỉ dẫn.
<!-- src: slide 43 -->

## Slide 44 — Build context packet
Một packet gọn & đáng tin: biết gì, thiếu gì, cần tool gì, không được làm gì.
<!-- src: slide 44 -->

## Slide 45 — REFERENCE BANK · CONTEXT
Context operations + memory — Chatbot "nhớ" thế nào?
<!-- src: slide 45 -->

## Slide 46 — REFERENCE BANK · CONTEXT
Long-context failure bank — "Context window to hơn không có nghĩa cứ nhét hết". 
<!-- src: slide 46 -->

## Slide 47 — Tools: gọi đúng và trả đúng
Gọi đúng tool, đúng lúc, đúng tham số và trả kết quả sạch để đưa lại vào context.
<!-- src: slide 47 -->

## Slide 48 — Tool có hai chiều cần thiết kế
Một lần gọi tool không chỉ là gửi request; kết quả trả về sẽ trở thành context mới cho model.
<!-- src: slide 48 -->

## Slide 49 — Từ user request đến tool results
Agent dùng tool declarations để chọn tool, tạo arguments, gọi tool và tổng hợp kết quả.
<!-- src: slide 49 -->

## Slide 50 — Gọi đúng tool
Model quyết định: Có cần gọi tool không, gọi tool nào, truyền tham số gì, và có đủ quyền để gọi hay chưa.
<!-- src: slide 50 -->

## Slide 51 — Tool taxonomy
Phân loại tool theo mức tác động: bổ sung thông tin, mở rộng năng lực, hay thay đổi trạng thái thật.
<!-- src: slide 51 -->

## Slide 52 — Agent spec: mỗi agent có một bộ tool riêng
Tool không đứng riêng lẻ; nó là một phần của cấu hình agent.
<!-- src: slide 52 -->

## Slide 53 — Mở ít tool, nhưng mở đúng tool
Nhiều tool hơn không luôn tốt hơn; tool inventory cần thay đổi theo nhiệm vụ, quyền và mức rủi ro.
<!-- src: slide 53 -->

## Slide 54 — Tool access: mỗi agent chỉ thấy tool cần dùng
Không đưa cả kho tool vào context; chọn tool theo agent, stage, quyền và rủi ro.
<!-- src: slide 54 -->

## Slide 55 — Tool declaration: mô tả để model gọi đúng tool
Model không "biết" tool dùng để làm gì; nó dựa vào name, description và schema để quyết định có gọi hay không.
<!-- src: slide 55 -->

## Slide 56 — Bad vs Good tool declaration
Tên tool & schema phải nói rõ hành động; tool đọc dữ liệu và tool gửi ra ngoài không gộp chung.
<!-- src: slide 56 -->

## Slide 57 — Tool arguments
Agent không chỉ chọn tool; nó phải trích xuất, chuẩn hóa và kiểm tra tham số trước khi gọi.
<!-- src: slide 57 -->

## Slide 58 — Agent có dùng đúng công cụ không?
Cần kiểm tra agent đã gọi đúng tool, đúng tham số và đúng quyền hay chưa.
<!-- src: slide 58 -->

## Slide 59 — Tool result là context mới
Kết quả tool quay lại bàn làm việc của model, nhưng chỉ là dữ liệu tham khảo — không phải lệnh phải làm theo.
<!-- src: slide 59 -->

## Slide 60 — Tool result đi đâu sau khi tool chạy?
Tool call chưa kết thúc workflow; kết quả tool quay lại context nhưng không có quyền ra lệnh cho model.
<!-- src: slide 60 -->

## Slide 61 — Tool result đi qua trust boundary nhiều lớp
Không đảm bảo bằng một câu prompt; đảm bảo bằng nhiều lớp, mỗi lớp một cơ chế.
<!-- src: slide 61 -->

## Slide 62 — Tool result cần một lớp xử lý trước khi quay lại model
Raw result thường dài, nhiễu, sai format, hoặc chứa instruction lạ cần được xử lý trước khi đưa vào model.
<!-- src: slide 62 -->

## Slide 63 — Tool errors & no-tool cases
Không phải lỗi nào cũng "bịa tiếp"; agent cần biết khi nào hỏi lại, fallback, hoặc dừng.
<!-- src: slide 63 -->

## Slide 64 — Read / write boundary
Không phải tool nào cũng có cùng mức rủi ro.
<!-- src: slide 64 -->

## Slide 65 — Read tool vs write tool
Khác biệt không nằm ở tên tool, mà ở việc tool có thay đổi trạng thái bên ngoài hay không.
<!-- src: slide 65 -->

## Slide 66 — Risk ladder
Rủi ro của tool tăng dần từ tra cứu thông tin đến hành động có tác động thật.
<!-- src: slide 66 -->

## Slide 67 — Approval: lớp xác nhận, không cho agent tự ý hành động
Agent có thể đề xuất hành động; ứng dụng chỉ thực hiện khi người dùng đã xác nhận rõ.
<!-- src: slide 67 -->

## Slide 68 — Eval · Safety · Harness
Không đánh giá bằng cảm giác; cần đo kết quả, đọc trace và kiểm soát rủi ro trước khi release.
<!-- src: slide 68 -->

## Slide 69 — Tiny eval: bộ test tối thiểu trước khi sửa prompt
3–8 case đại diện tốt hơn cảm giác "nghe ổn".
<!-- src: slide 69 -->

## Slide 70 — Prompt eval vs Agent eval
Prompt eval chấm kết quả của một lượt gọi; agent eval chấm cả đường đi qua tool, context và quyền hành động.
<!-- src: slide 70 -->

## Slide 71 — Prompt improvement ladder
Càng tự động hóa việc cải thiện prompt, càng cần spec, eval và dữ liệu kiểm thử rõ ràng.
<!-- src: slide 71 -->

## Slide 72 — Harness là quy trình quanh bàn làm việc
Ai quyết định giấy nào lên bàn, tool nào được gọi, log nào được giữ?
<!-- src: slide 72 -->

## Slide 73 — Production controls tối thiểu
Những control vận hành cơ bản mà lab có thể mô phỏng.
<!-- src: slide 73 -->

## Slide 74 — Debug-by-design: bản đồ sửa AI app
Khi AI sai, đừng chỉ sửa câu chữ; xác định lỗi nằm ở lớp nào.
<!-- src: slide 74 -->

## Khái niệm chính
- [[prompt]]: Chỉ dẫn rõ ràng cho model để thực hiện một nhiệm vụ.
- [[context]]: Tất cả thông tin mà model sử dụng để xử lý yêu cầu, bao gồm lịch sử hội thoại và dữ liệu.
- [[tool]]: Công cụ bên ngoài mà model có thể gọi để lấy thông tin hoặc thực hiện hành động.
- [[control]]: Quy trình phê duyệt và kiểm soát các hành động của model để hạn chế rủi ro.
- [[versioning]]: Quá trình chỉnh sửa và theo dõi các thay đổi đối với prompt nhằm cải thiện hiệu suất của model.
```
