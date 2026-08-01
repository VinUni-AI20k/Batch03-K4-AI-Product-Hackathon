---
course: AI20K
generated: '2026-07-30T17:35:24+00:00'
lang: vi
lesson: 1-day04-prompt-engineering-tool-calling-v2
maps:
- '[[MOC - AI20K]]'
module: ''
source_file: AI20K/1-day04-prompt-engineering-tool-calling-v2.pdf
source_hash: sha256:527e95ae0f1f1ec0aca704ce07e5a5c4f70c1408c841bb36a611ccd4a9f5ea76
type: lesson-note
---

```markdown
## Slide 1 — Prompt Engineering & Tool Calling
Mục tiêu bài học hôm nay là hiểu cơ chế: [[prompt]] là interface giữa [[human intent]] và [[model behavior]]; [[tool calling]] là interface giữa model và thế giới bên ngoài. Hãy nhớ câu hỏi: nếu hai người hỏi AI cùng một việc, tại sao một người lại nhận được kết quả xuất sắc trong khi người kia nhận rác? [00:00]

## Slide 2 — Mục tiêu học tập
- Viết được [[prompt]] rõ ràng theo các thành phần Role / Task / Context / Format.
- Hiểu khi nào nên dùng [[zero-shot]], [[few-shot]], [[Chain of Thought|CoT]], và khi nào không cần.
- Viết được [[system prompt]] đạt tiêu chuẩn sản xuất cho agent.
- Khai báo được [[tool schema]] và hiểu vòng lặp [[tool calling]] từ model đến tool rồi quay lại model. [01:07]

## Slide 3 — Deliverable Cuối Ngày
1 script agent chạy được + 1 system prompt + 2 tool schemas + 5 test questions, bao gồm ghi chú về lỗi [[prompt]]/tool/control flow:
- 2 tools tự viết: 1 API wrapper đơn giản, 1 data query đơn giản.
- 1 system prompt có rules, constraints, output contract.
- 5 câu test để chứng minh agent biết khi nào trả lời trực tiếp, khi nào gọi tool. [02:10]

## Slide 4 — Prompt Engineering Fundamentals
Prompt tốt không phải là prompt 'hay', mà là prompt tạo ra hành vi mong muốn ổn định. [02:35]

## Slide 5 — Prompt = Interface Giữa Ý Định và Khả Năng
- Ví dụ về prompt kém: "Viết email cho tôi" không rõ người nhận và nội dung.
- Ví dụ về prompt tốt: "Viết email xin lỗi khách hàng về giao hàng trễ 2 ngày, tone lịch sự, dưới 120 từ, có CTA rõ ràng". [02:50]

## Slide 6 — Nguyên tắc vàng
Nguyên tắc vàng: Specificity beats cleverness—prompt ngắn nhưng rõ nghĩa thường tốt hơn prompt dài mà lan man. [03:10]

## Slide 7 — Các Loại Prompt
| Loại prompt | Mục đích chính | Khi dùng |
|-------------|----------------|----------|
| Instruction prompt | Ra lệnh trực tiếp cho một tác vụ | Hỏi đáp 1 lượt, transform, summarize, classify |
| Conversation prompt | Giữ ngữ cảnh nhiều lượt với user | Chatbot, support, tutor |
| System prompt | Đặt policy, boundary, output contract | Agent, assistant production, use case cần hành vi ổn định | [03:50]

## Slide 8 — Lưu ý về Độ Dài của Prompt
- Prompt dài hơn không đồng nghĩa với prompt tốt hơn.
- Hãy ưu tiên: instruction rõ, examples đúng chỗ, output contract rõ. [04:10]

## Slide 9 — Advanced Prompting & Context Structuring
Dùng kỹ thuật nâng cao khi chúng cải thiện chất lượng thật sự, không dùng như thần chú. [04:30]

## Slide 10 — Types of Prompt
Phân loại các kỹ thuật prompting từ cơ bản đến nâng cao: [[zero-shot]], [[one-shot]], [[few-shot]], [[CoT]]. [04:50]

## Slide 11 — Kiểu Prompt Zero-shot
Không có ví dụ mẫu. Nhanh, rẻ, nên thử trước. [05:10]

## Slide 12 — Kiểu Prompt Few-shot
2-5 ví dụ. Tăng tính nhất quán nhưng tốn token hơn. Khi cần giữ tiêu chuẩn đánh giá, tone, hoặc cách lập luận nhất quán, [[few-shot]] là hữu ích. [05:30]

## Slide 13 — Chain of Thought CoT
CoT phù hợp khi bài toán cần [[reasoning]] nhiều bước. [05:50]

## Slide 14 — Tree of Thought
Phù hợp cho bài toán cần explore nhiều hướng, tuy nhiên phức tạp hơn và tốn nhiều tài nguyên hơn. [06:10]

## Slide 15 — Prompt Determinism
Định nghĩa [[determinism]]: khả năng LLM trả về đúng một định dạng cấu trúc, tuy nhiên thách thức lớn trong việc kiểm soát hành vi parse dữ liệu của mô hình. [06:30]

## Slide 16 — Anatomia của System Prompt Production-grade
Những yếu tố chính của một system prompt: persona, rules, capabilities, constraints, output format. [06:50]

## Slide 17 — System Prompt Anti-Patterns
Các nguyên tắc cấm kỵ bao gồm lỗi quá dài, mâu thuẫn, mơ hồ, không test edge cases. [07:10]

## Slide 18 — Context Bleed
[[Context Bleed]] là hiện tượng khi LLM nhầm lẫn giữa lệnh và dữ liệu, gây ra prompt injection, trả lời sai trọng tâm. [07:30]

## Slide 19 — Cấu Trúc Hóa Bằng Thẻ XML
Sử dụng thẻ XML để tối ưu cấu trúc prompt và ngăn chặn context bleed. [08:00]

## Slide 20 — Bộ Thẻ XML Căn Bản Cho System Prompt
Bao gồm thẻ &lt;system_role&gt;, &lt;examples&gt;, &lt;user_input&gt;, &lt;instructions&gt;, &lt;context&gt;. [08:20]

## Slide 21 — Handling Long Context
Mô tả giới hạn của [[context window]] và tầm quan trọng của vị trí thông tin trong prompt. [08:40]

## Slide 22 — Dynamic System Prompts
Cần xây dựng một lớp "context injection" để bơm dữ liệu thời gian và thông tin người dùng. [09:00]

## Khái niệm chính
- [[prompt]]: Được sử dụng để giao tiếp giữa ý định con người và khả năng của mô hình.
- [[tool calling]]: Giao tiếp giữa mô hình và các thực thể bên ngoài.
- [[zero-shot]]: Kỹ thuật không sử dụng ví dụ mẫu.
- [[few-shot]]: Kỹ thuật sử dụng vài ví dụ để củng cố ngữ cảnh.
- [[context bleed]]: Hiện tượng nhầm lẫn giữa lệnh và dữ liệu.
- [[determinism]]: Khả năng tuân thủ định dạng đầu vào rõ ràng trong tất cả mọi đầu vào.
```
