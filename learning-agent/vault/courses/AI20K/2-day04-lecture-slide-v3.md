---
course: AI20K
generated: '2026-07-30T17:29:27+00:00'
lang: vi
lesson: 2-day04-lecture-slide-v3
maps:
- '[[MOC - AI20K]]'
module: ''
source_file: AI20K/2-day04-lecture-slide-v3.pdf
source_hash: sha256:79bdb60a5d81cec5a7cd7d2fa08fb16c84a5962578eecee651a021a5e26c8ca2
type: lesson-note
---

```markdown
## Slide 1 — Prompt · Context Engineering · Tool Calling
Một agent tốt không chỉ biết gọi công cụ, mà còn phải gọi đúng, dùng đúng thông tin và biết dừng khi cần kiểm soát. 
- **PROMPT**: Chỉ dẫn rõ ràng 
- **CONTEXT**: Thông tin đúng lúc, đúng nguồn 
- **TOOL**: Năng lực đọc dữ liệu và thực hiện hành động 
- **CONTROL**: Approval, eval, logging và guardrail

## Slide 2 — Từ agent chạy được đến agent đáng tin
Một agent tốt không chỉ biết gọi công cụ, mà còn phải gọi đúng, dùng đúng thông tin và biết dừng khi cần kiểm soát.

## Slide 3 — Agent biết chạy
- **Vòng lặp xử lý**: (Agent loop / ReAct)
- **Gọi công cụ cơ bản**: (tool calling)
- **Bản ghi các bước thực hiện**: (trace log)

## Slide 4 — Agent đáng tin hơn
- **Prompt**: Chỉ dẫn nhiệm vụ có rõ không?
- **Context**: thông tin có đủ và đúng nguồn không?
- **Tool**: agent có chọn đúng công cụ và điền đúng tham số không?
- **Eval / versioning**: phiên bản mới có tốt hơn phiên bản cũ không?

## Slide 5 — Agenda
- Mục tiêu: debug AI app theo đúng lớp cần sửa

01 · **PROMPT**

## Slide 6 — Prompt fundamentals
Viết instruction rõ: role, task, format, boundary; biết khi nào dùng example, CoT/ToT.

02 · **CONTEXT**

## Slide 7 — Context engineering
Prompt là một phần của context; chọn đúng thông tin nào đặt lên bàn.

03 · **TOOL**

## Slide 8 — Tool declaration & result
Khai báo tool để route đúng; thiết kế tool result như context mới.

04 · **CONTROL**

## Slide 9 — Control & harness
Khi nào cần approval, eval, logging, retry và guardrail. Mỗi phần tương ứng với một loại lỗi khi AI app chưa đáng tin.

05 · **LAB**

## Slide 10 — Lab artifacts
Chỉnh prompt, context policy, tool spec, result template & eval cases.

## Slide 11 — Prompt vs Context Engineering
Từ một yêu cầu đơn giản đến một hệ AI có chỉ dẫn, ngữ cảnh, công cụ và cơ chế kiểm soát rõ ràng.

## Slide 12 — Context = bàn làm việc của model
Model không chỉ đọc prompt. Model xử lý toàn bộ thông tin đang được đặt trong context.

## Slide 13 — Bản đồ các lớp của AI app
Khi hệ thống chưa làm đúng, cần xác định lỗi thuộc lớp nào trước khi chỉnh sửa.

## Slide 14 — Prompt
- **CHỈ DẪN ĐẦU TIÊN**: Nhiệm vụ, giới hạn, tiêu chí và định dạng đầu ra.

## Slide 15 — Context
- **THÔNG TIN ĐANG CÓ**: Dữ kiện người dùng, tài liệu, lịch sử hội thoại và dữ liệu liên quan.

## Slide 16 — Control
- **CƠ CHẾ VẬN HÀNH**: Phê duyệt, kiểm thử, ghi log, thử lại và giới hạn rủi ro.

Không phải lỗi nào cũng là lỗi prompt. Cần xác định đúng lớp trước khi sửa.

## Slide 17 — Tool
- **NĂNG LỰC BỔ SUNG**: Cách lấy thêm thông tin hoặc thực hiện hành động bên ngoài model.

## Slide 18 — Prompt fundamentals
Lớp chỉ dẫn đầu tiên: vai trò, nhiệm vụ, ranh giới và định dạng đầu ra.

## Slide 19 — Prompt là lớp can thiệp đầu tiên
Đây là phần dễ chỉnh nhất để định hướng nhiệm vụ, phạm vi xử lý và cách model trả lời.

## Slide 20 — System prompt vs User prompt
Cùng được gửi vào model dưới dạng message nhưng khác vai trò và mức ưu tiên.

## Slide 21 — Luật nền do app thiết lập
Vai trò, nguyên tắc xử lý, ràng buộc và mức ưu tiên cao hơn user.

## Slide 22 — Yêu cầu ở lượt hiện tại
Nội dung cần xử lý, câu hỏi, dữ kiện hoặc mục tiêu của người dùng.

## Slide 23 — Phản hồi của model trong lịch sử
Có thể được đưa lại vào context nếu hệ thống giữ lịch sử.

## Slide 24 — Người dùng thấy chat, model nhận context
Trước mỗi lượt trả lời, app lắp lại các thông tin cần thiết thành một context packet cho model.

## Slide 25 — Prompts mơ hồ
Prompts cần đủ rõ để hướng dẫn hành vi nhưng không nên biến thành danh sách rule cứng cho mọi tình huống.

## Slide 26 — Vừa đủ
Rõ vai trò, mục tiêu, ranh giới, cách dùng tool, và tiêu chí đầu ra.

## Slide 27 — Quá cụ thể
Nhồi nhiều rule chi tiết, nhánh if-else, case ngoại lệ. Khó bảo trì; dễ sai khi bối cảnh thay đổi.

## Slide 28 — Quá mơ hồ
Chỉ dẫn chung chung. Thiếu tín hiệu cụ thể để model biết hành vi đúng.

## Slide 29 — Role · Task · Context · Format
- **ROLE**: Bạn là ai trong workflow này?
- **CONTEXT**: Được biết / được dùng thông tin nào?
- **TASK**: Bạn cần làm việc gì?
- **FORMAT**: Trả lời theo cấu trúc nào?

## Slide 30 — Một prompt tốt hơn trông như thế nào?
Prompt tốt chia rõ nhiệm vụ, dữ kiện cần có, ranh giới và cấu trúc đầu ra.

## Slide 31 — Cấu trúc prompt bằng nhãn phân tách
Dùng XML tags hoặc delimiters để tách rõ instruction, context, examples, user input và output format.

## Slide 32 — Common blocks
Tách instruction khỏi data; cô lập input bên ngoài; chỉ rõ phạm vi xử lý và giữ cấu trúc nhất quán.

## Slide 33 — Boundary & ask-if-missing
Khi thiếu dữ kiện quan trọng, model nên hỏi lại, không biến thiếu thành câu trả lời tự tin.

## Slide 34 — Output Format
Thiết kế đầu ra theo nơi nó sẽ được dùng: người đọc hay hệ thống xử lý.

## Slide 35 — Đừng nhồi một prompt khổng lồ
Chia task phức tạp thành bước nhỏ hơn để dễ debug, test và kiểm soát.

## Slide 36 — Prompt scaffolding ladder
Bắt đầu bằng prompt đơn giản; chỉ thêm ví dụ hoặc bước suy luận khi có lý do.

## Slide 37 — Zero · One · Few-shot
Khi nào chỉ cần nêu quy tắc, khi nào cần thêm ví dụ mẫu?

## Slide 38 — Ví dụ không miễn phí
Mỗi ví dụ chiếm token và có thể làm output mất chất lượng.

## Slide 39 — Chain of Thought
- Reasoning theo từng bước. Không phải câu thần chú "think step by step".

## Slide 40 — Tree of Thought
Thử nhiều hướng, đánh giá, rồi chọn - tránh khóa vào hướng đầu tiên.

## Slide 41 — Chuỗi thẩm quyền của instruction
Khi các chỉ dẫn mâu thuẫn, model ưu tiên cấp cao hơn.

## Slide 42 — Prompt versioning
- Prompt thay đổi hành vi của model, nên không thể sửa bằng cảm giác.

## Slide 43 — Prompt là artifact vận hành
Một prompt production cần metadata, eval và đường rollback.

## Slide 44 — Supporting artifacts
- system_prompt.md · tools.yaml · eval_cases.json · version_log.csv.

## Slide 45 — Debug theo lỗi, không theo cảm giác
Gọi tên lỗi trước, rồi mới chọn pattern và artifact cần sửa.

## Slide 46 — Context engineering
Prompt là một phần của context; context là toàn bộ thứ model nhìn thấy.

## Slide 47 — Context packet
- Gói thông tin được hệ thống lắp trước mỗi lượt gọi model.

## Slide 48 — Hỏi người dùng hay tra nguồn?
Thiếu thông tin không có nghĩa là để model đoán; cũng không phải thiếu gì cũng hỏi người dùng.

## Slide 49 — Dynamic context
Weather, price, policy - dữ liệu thay đổi theo thời gian cần metadata.

## Slide 50 — Context window = token budget
Mặt bàn rộng hơn đặt được nhiều giấy hơn - nhưng capacity ≠ efficiency.

## Slide 51 — Lost in the Middle
Context dài hơn không đảm bảo mọi phần được dùng hiệu quả như nhau.

## Slide 52 — Best Practice
Đặt instruction quan trọng ở đầu và nhắc lại output requirement ở cuối.

## Slide 53 — Context rot
Bàn quá nhiều giấy cũng làm model rối: nhiều hơn không luôn tốt hơn.

## Slide 54 — Write · Select · Compress · Isolate
Đặt thông tin lên bàn mà không làm bàn rối.

## Slide 55 — History compaction: summarize · drop · archive
Chatbot nói 10 lượt: giữ gì trên bàn và bỏ gì?

## Slide 56 — Web content là untrusted context
Lấy nội dung từ web: là thông tin, không phải chỉ dẫn để làm theo.

## Slide 57 — Build context packet
Một packet gọn & đáng tin: biết gì, thiếu gì, cần tool gì, không được làm gì.

## Slide 58 — Context operations + memory
Chatbot "nhớ" thế nào? Model không nhớ - runtime gửi lại history/state.

## Slide 59 — Long-context failure bank
"Context window to hơn không có nghĩa cứ nhét hết".

## Slide 60 — Tools: gọi đúng và trả đúng
- A. Gọi đúng tool, đúng lúc, đúng tham số.
- B. Trả kết quả sạch để đưa lại vào context.

## Slide 61 — Tool có hai chiều cần thiết kế
Một lần gọi tool không chỉ là gửi request; kết quả trả về sẽ trở thành context mới cho model.

## Slide 62 — Gọi đúng tool
Model cần quyết định có cần gọi tool không và nên gọi tool nào.

## Slide 63 — Tool taxonomy
Phân loại tool theo mức tác động: bổ sung thông tin, mở rộng năng lực, hay thay đổi trạng thái thật.

## Slide 64 — Agent spec: mỗi agent có một bộ tool riêng
Tool không đứng riêng lẻ; nó là một phần của cấu hình agent.

## Slide 65 — Mở ít tool, nhưng mở đúng tool
Nhiều tool hơn không luôn tốt hơn; tool inventory cần thay đổi theo nhiệm vụ, quyền và mức rủi ro.

## Slide 66 — Tool access: mỗi agent chỉ thấy tool cần dùng
Không đưa cả kho tool vào context; chọn tool theo agent, stage, quyền và rủi ro.

## Slide 67 — Tool declaration: mô tả để model gọi đúng tool
Model không "biết" tool dùng để làm gì; nó dựa vào name, description và schema để quyết định có gọi hay không.

## Slide 68 — Tool arguments
Agent không chỉ chọn tool; nó phải trích xuất, chuẩn hóa và kiểm tra tham số trước khi gọi.

## Slide 69 — Agent có dùng đúng công cụ không?
Không chỉ chấm câu trả lời cuối; cần kiểm tra agent đã gọi đúng tool, đúng tham số và đúng quyền hay chưa.

## Slide 70 — Tool result là context mới
Kết quả tool quay lại context nhưng không có quyền ra lệnh cho model.

## Slide 71 — Tool result cần một lớp xử lý trước khi quay lại model
Raw result thường dài, nhiễu, sai format, hoặc chứa instruction lạ.

## Slide 72 — Tool errors & no-tool cases
Không phải lỗi nào cũng "bịa tiếp"; agent cần biết khi nào hỏi lại, fallback, hoặc dừng.

## Slide 73 — Read / write boundary
Không phải tool nào cũng có cùng mức rủi ro.

## Slide 74 — Rủi ro của tool tăng dần từ tra cứu thông tin đến hành động có tác động thật

## Slide 75 — Approval: lớp xác nhận, không cho agent tự ý hành động
Agent có thể đề xuất hành động; ứng dụng chỉ thực hiện khi người dùng đã xác nhận rõ.

## Slide 76 — Tiny eval: bộ test tối thiểu trước khi sửa prompt
3-8 case đại diện tốt hơn cảm giác "nghe ổn".

## Slide 77 — Prompt eval vs Agent eval
Prompt eval chấm kết quả của một lượt gọi; agent eval chấm cả đường đi qua tool, context và quyền hành động.

## Slide 78 — Prompt improvement ladder
Càng tự động hóa việc cải thiện prompt, càng cần spec, eval và dữ liệu kiểm thử rõ ràng.

## Slide 79 — Harness là quy trình quanh bàn làm việc
Ai quyết định giấy nào lên bàn, tool nào được gọi, log nào được giữ?

## Slide 80 — Debug-by-design: bản đồ sửa AI app
Khi AI sai, đừng chỉ sửa câu chữ; xác định lỗi nằm ở lớp nào.

## Khái niệm chính
- [[prompt]]: chỉ dẫn cho model về nhiệm vụ và tiêu chí đầu ra.
- [[context]]: toàn bộ thông tin mà model xử lý trong một lượt gọi.
- [[tool]]: công cụ bên ngoài giúp model thu thập thông tin hoặc thực hiện hành động.
- [[control]]: cơ chế kiểm soát hành vi của model, đảm bảo yêu cầu và phân quyền thích hợp.
- [[agent]]: một thực thể có khả năng gọi tool và xử lý thông tin.
- [[evaluation]]: quá trình đánh giá độ chính xác và hiệu quả của quyết định.
- [[dynamic-context]]: các dữ liệu thay đổi theo thời gian như thời tiết, giá cả.
- [[tool-declaration]]: mô tả chi tiết về công cụ, bao gồm tên và các tham số cần thiết.
```
