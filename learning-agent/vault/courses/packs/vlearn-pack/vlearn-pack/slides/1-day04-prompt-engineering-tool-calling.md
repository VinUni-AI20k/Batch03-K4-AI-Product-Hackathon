---
course: packs
generated: '2026-07-30T10:28:48+00:00'
lang: vi
lesson: 1-day04-prompt-engineering-tool-calling
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/slides/1-day04-prompt-engineering-tool-calling.md
source_hash: sha256:83367c47b2a1504924d1b0d6c68e869fea795d5a85967e8282925459a6aa91bb
type: lesson-note
---

```markdown
## Slide 1 — Prompt Engineering & Tool Calling
Prompt Engineering & Tool Calling  
AICB-P1 · Ngày 4 · Nói thế nào để model làm đúng — rồi cho nó dùng tool  
Giảng viên: VinUniversity · Phase 1 · Tuần 1 · 2026

## Slide 2 — Hãy Suy Nghĩ...
“Hai người hỏi AI cùng một việc, một người nhận kết quả xuất sắc, người kia nhận rác. Tại sao?”  
Giữ câu hỏi này trong đầu khi học bài hôm nay.

## Slide 3 — Nội Dung Bài Học
**PHẦN A — Nguyên lý**
1. [[prompt-fundamentals]]
2. [[lịch-sử-tiến-hoá-prompting]]
3. [[advanced-prompting-techniques]]
4. [[system-prompt-engineering]]
5. [[context-engineering]]
6. [[tool-calling]] → create_agent
7. Thiết kế tool & [[tool-use-patterns]]
8. [[harness-engineering]] (2026)  
**PHẦN B — Áp dụng**
- Capstone: agent thật (áp dụng Phần A)
- Bài lab + deliverable cuối buổi  
Phần A dạy nguyên lý trên một ví dụ chung — trợ lý mua sắm ShopBot. Phần B áp dụng đúng các nguyên lý đó vào một agent thật trong bài lab.

## Slide 4 — Mục Tiêu Ngày 4
- Viết prompt rõ ràng theo [[role]] / [[task]] / [[context]] / [[format]] và bằng cấu trúc (tags/sections)
- Biết khi nào dùng [[few-shot]] / [[CoT]] — và khi nào không nên (CoT có lúc làm hại)
- Viết [[system-prompt]] như một contract: role + tiêu chí + ràng buộc + output
- Tư duy [[context-engineering]]: chọn đúng tập token (system, tools, examples, memory), không chỉ câu chữ
- Khai báo tool bằng @tool và dựng agent gọi tool bằng create_agent, grounded trong output tool  
Buổi này dạy cơ chế, không phải mẹo: prompt là interface giữa ý định và hành vi model; tool calling là interface giữa model và thế giới ngoài.

## Slide 5 — Prompt Engineering Fundamentals
Prompt tốt không phải prompt “hay”, mà là prompt tạo ra hành vi mong muốn ổn định.

## Slide 6 — Prompt Kém và Prompt Tốt
**Prompt = Interface Giữa Ý Định và Khả Năng Model**  
**Prompt kém:** “Tư vấn mua đồ giúp tôi.”  
Không rõ mua gì, ngân sách bao nhiêu, giao đâu.  
**Kết quả:** trả lời chung chung, khó dùng.  
**Prompt tốt:** Tìm laptop dưới 20 triệu cho sinh viên, ưu tiên pin trâu, giao về HCM.  
Rõ sản phẩm, ngân sách, nhu cầu, nơi giao.  
Model đủ thông tin để hành động.  
*Lưu ý:* Nguyên tắc vàng: Specificity beats cleverness. Prompt ngắn nhưng rõ nghĩa thường tốt hơn prompt dài mà lan man.

## Slide 7 — 4 Thành Phần Của Prompt Tốt
- **ROLE:** Vai trò
- **TASK:** Nhiệm vụ
- **CONTEXT:** Bối cảnh
- **FORMAT:** Định dạng  
Bắt đầu với [[task]] + [[format]]. Chỉ thêm [[role]] hoặc [[context]] khi chúng thực sự cải thiện chất lượng hoặc tính nhất quán.

## Slide 8 — Instruction vs Conversation vs System Prompt
- **Instruction prompt:** Ra lệnh trực tiếp cho một tác vụ  
  *Ví dụ:* “Tóm tắt 3 sản phẩm này thành 1 gợi ý.”
- **Conversation prompt:** Giữ ngữ cảnh nhiều lượt với user  
  *Ví dụ:* User hỏi tiếp “còn mẫu nào rẻ hơn không?”
- **System prompt:** Đặt policy, boundary, output contract  
  *Ví dụ:* Luật của ShopBot: ngôn ngữ, ràng buộc, định dạng

## Slide 9 — Cấu Trúc Hoá Để Output Ổn Định
```xml
<role>ShopBot, tro ly mua sam.</role>
<context>User dang tim san pham trong mot ngan sach.</context>
<task>De xuat 1 san pham phu hop.</task>
<constraints>
- Chi dung gia tu tool, khong bia.
- Thieu thong tin -> hoi lai.
</constraints>
<output_format>Tieng Viet, ngan: ten + gia + ly do.</output_format>
```
Tách prompt thành thẻ/section rõ ràng giúp model:
- bám đúng cấu trúc, ít “quên” ràng buộc
- dễ chèn/đổi từng phần (context, examples)
- dễ test & version

## Slide 10 — Token Budget: Dài Hơn KHÔNG Phải Tốt Hơn
- Mỗi token thừa làm tăng chi phí, latency, và đôi khi cản trở.
- “Context rot”: prompt càng dài, độ chính xác càng dễ giảm.
- Ưu tiên độ rõ: instruction rõ + cấu trúc + examples đúng chỗ.  
*Lưu ý:* Prompt engineering tốt là tối ưu độ rõ và khả năng kiểm soát.

## Slide 11 — Lịch Sử & Tiến Hoá Của Prompting
Từ “chọn câu chữ” đến “thiết kế cả hệ thống quanh model”.

## Slide 12 — Dòng Thời Gian Prompting (2020–2026)
| Năm | Cột mốc | Ý nghĩa |
|-----|---------|---------|
| 2020 | In-context / few-shot (GPT-3) | Học task từ vài ví dụ trong prompt — prompting thành một nghề |
| 2021–22 | Instruction tuning + RLHF (FLAN, InstructGPT) | Model “làm theo lời dặn” ⇒prompt đơn giản trở nên đáng tin |
| 2022 | CoT, Self-Consistency, zero-shot CoT | Chất lượng suy luận thành một biến của prompt |
| 2022 | ReAct, PAL | Reasoning + hành động/tool ⇒bản thiết kế cho agent |
| 2023 | Tree-of-Thought; function calling | Suy luận dạng tìm kiếm; tool use thành API chuẩn |
| 2024–25 | Reasoning models (o1, R1, extended thinking) | Suy luận chuyển vào trong model — bớt CoT viết tay |
| 2025 | “Context engineering” (Anthropic) | Đòn bẩy là tập token đưa vào, không chỉ câu chữ |
| 2026 | “Harness engineering” (đang nổi) | Đòn bẩy là cả hệ thống quanh model |

## Slide 13 — 3 Kỷ Nguyên: Prompt → Context → Harness
- **Prompt eng.:** 1 prompt “câu lệnh”
- **Context eng.:** cả context “mọi token model đọc”
- **Harness eng.:** nhiều prompt “khắp agent”  
*Lưu ý:* “context/harness engineering” là cách gọi mới của giới làm nghề (2025–26), chưa phải chuẩn học thuật.

## Slide 14 — Các Kỹ Thuật “Cổ Điển” Sau Dòng Thời Gian
| Kỹ thuật | Gốc | Ý tưởng / khi dùng |
|----------|-----|-------------------|
| Self-Consistency | Wang 2022 | Lấy nhiều chuỗi CoT rồi vote — khi đáp án là số/nhãn |
| Least-to-Most | Zhou 2022 | Chia bài toán khó thành các bước dễ, giải tuần tự |
| Generated Knowledge | Liu 2021 | Cho model liệt kê facts trước rồi trả lời |
| Tree-of-Thought | Yao 2023 | Suy luận dạng cây + backtrack — chỉ cho bài tìm kiếm |
| ReAct | Yao 2022 | Reason + Act + Observe — nay đã thành function calling |
| PAL / PoT | Gao 2022 | Model viết code, giao tính toán cho interpreter |
| Prompt chaining | Wu 2022 | Chuỗi nhiều lần gọi, mỗi bước nhận output bước trước |

## Slide 15 — Vòng Lặp Tự Cải Thiện: Plan-and-Solve / Self-Refine / Reflexion
1. **Plan-and-Solve (Wang 2023):** lập kế hoạch trước rồi thực thi từng bước.
2. **Self-Refine (Madaan 2023):** model tự phê bình output của mình rồi sửa.
3. **Reflexion (Shinn 2023):** agent rút “bài học” từ tín hiệu thất bại.

## Slide 16 — Advanced Prompting Techniques
Chọn kỹ thuật theo task — không dùng như thần chú.

## Slide 17 — Zero-shot, One-shot, Few-shot, CoT
- **Zero-shot:** Không có ví dụ mẫu.
- **One-shot:** 1 ví dụ mẫu.
- **Few-shot:** 2–5 ví dụ.
- **CoT:** Reasoning từng bước.  
*Thứ tự thử:* zero-shot → few-shot → CoT.

## Slide 18 — Few-shot — Trích Slot Từ Câu Tự Nhiên (ShopBot)
```python
examples = """
Input: "Tim balo laptop duoi 500k, chong nuoc"
Output: {"category": "balo", "budget": 500000, "qty": 1, "preferences": ["chong nuoc"]}
Input: "Mua 2 ban phim co gia tot, giao HN"
Output: {"category": "ban phim co", "budget": null, "qty": 2, "preferences": ["gia tot"]}
"""
```

## Slide 19 — Chain-of-Thought: Khi Giúp, Khi HẠI
CoT giúp khi task cần suy luận nhiều bước nhưng có thể làm hại với task trực giác. Khi cần con số chính xác, hãy đẩy phép tính vào tool.

## Slide 20 — Reasoning Models & Extended Thinking: Đừng Ép CoT
Khi task suy luận nặng, dùng reasoning model thay cho CoT; khi tra cứu, prompt trực tiếp.

## Slide 21 — System Prompt Engineering
System prompt tốt làm agent nhất quán hơn, dễ kiểm soát hơn, và dễ test hơn.

## Slide 22 — Anatomy của System Prompt Production-grade
- **Persona:** vai trò, mức chuyên môn, phong cách giao tiếp
- **Rules:** việc luôn làm / không làm
- **Capabilities:** được dùng tool nào
- **Constraints:** không bịa, khi nào từ chối
- **Output contract:** format, độ dài, ngôn ngữ

## Slide 23 — System Prompt Là Một CONTRACT, Không Phải Lời Khuyên
Role + tiêu chí + ràng buộc + output contract.

## Slide 24 — System Prompt Anti-Patterns
- Quá dài: nhồi mọi thứ vào 1 prompt 2000+ tokens rồi hy vọng model luôn làm đúng.
- Mâu thuẫn: vừa bảo “ngắn gọn”, vừa bắt “giải thích chi tiết từng bước”.
- Mơ hồ: “hãy thông minh”, không định nghĩa chuẩn output.
- ALL-CAPS / nhồi persona không giúp hơn; model phản hồi tốt với câu rõ, bình tĩnh.  
*Nguyên tắc:* system prompt là policy layer — rõ boundary, dễ predict hành vi.

## Slide 25 — Prompt Là Code: Version, Test, Tự Động Tối Ưu
Prompt production được versioned và đo trên một bộ test nhỏ.

## Slide 26 — Context Engineering
Vẫn là prompt engineering — nhưng kỹ thuật hoá cả tập token model đọc, không chỉ một câu lệnh.

## Slide 27 — Context Engineering = Chọn Đúng Tập Token
Không phải “viết câu này thế nào cho hay?”, mà: agent có đúng tool chưa?  
*Lưu ý:* Context là tài nguyên hữu hạn.

## Slide 28 — Context Window Management
Quản lý phân bổ context window để tối ưu hóa việc sử dụng token.

## Slide 29 — Memory Injection và Context Compression
- **Memory injection:** chỉ đưa vào facts thật sự cần cho task hiện tại.
- **Compression:** tóm tắt phần cũ, bỏ phần không còn liên quan, đẩy ra ngoài.

## Slide 30 — Prompt Caching: Xếp Phần Tĩnh Lên Trước
Prompt caching tái sử dụng phần prefix ổn định → giảm chi phí & latency đáng kể.

## Slide 31 — Tool Calling: Từ Cơ Chế Đến create_agent
Tool calling là cách agent chuyển từ “nói” sang “tương tác với thế giới thực”.

## Slide 32 — Tool Calling Flow — Model Không Tự Chạy Tool
Model chỉ đề nghị gọi tool (name + arguments). Ứng dụng mới thực sự chạy tool và gửi kết quả trở lại model.

## Slide 33 — Tool Schema: Description Là Một CONTRACT
- **Name:** ngắn, rõ, động từ đúng việc
- **Description:** nói khi nào nên dùng tool này
- **Parameters:** kiểu + ý nghĩa từng tham số  
*Lưu ý:* LLM đọc description như tài liệu hướng dẫn.

## Slide 34 — Cơ Chế: Vòng Lặp Tool Calling “Thủ Công”
Mô tả cách thực hiện vòng lặp tool calling trong code.

## Slide 35 — Khai Báo Tool Bằng @tool
Khai báo tool với docstring và type hints tương ứng.

## Slide 36 — Abstraction: create_agent Chạy Vòng Lặp Đó Cho Bạn
Mô tả cách mà create_agent tự động chạy vòng lặp decide→call→observe.

## Slide 37 — Thiết Kế Tool & Tool-Use Patterns
Tool tốt là interface tốt; điều phối chúng đúng control flow.

## Slide 38 — 4 Nguyên Tắc Thiết Kế Tool
Nguyên tắc để đảm bảo reliability cho tool interfaces.

## Slide 39 — Granularity: Quá Nhỏ Hay Quá To Đều Có Giá
Thiết kế tool quanh một hành động nghiệp vụ có thể test độc lập.

## Slide 40 — Dependency Chain: Output Tool Trước Là Input Tool Sau
Mô tả quy tắc dependency trong các tool gọi liên tiếp.

## Slide 41 — 3 Tool-Use Patterns Thường Gặp
1. Conditional: agent tự quyết định có cần tool hay trả lời trực tiếp.
2. Chaining (sequential): output tool A là input tool B. 
3. Parallel fetch + merge: các tool độc lập chạy cùng lúc rồi tổng hợp.

## Slide 42 — Harness Engineering (2026)
Đỉnh của arc: khi agent có nhiều prompt — system prompt, mô tả tool, prompt sub-agent.

## Slide 43 — Các Bề Mặt PROMPT Trong Một Harness
Nêu rõ các thành phần của một harness gồm system prompt, các tool, và output contract.

## Slide 44 — Vì Sao Harness Quan Trọng (Góc Nhìn Prompt)
Lỗi lặp lại được vá bằng prompt, không phải nhắc lại trong chat.

## Slide 45 — Lab 4: Bạn Xây Gì?
Chi tiết về lab và các yêu cầu hoàn thành.

## Slide 46 — System Prompt — TravelBuddy
Mô tả system prompt cho TravelBuddy, bao gồm các rules và constraints.

## Slide 47 — 3 Tool Contract Của TravelBuddy (chuỗi phụ thuộc)
Mô tả 3 tool và các tham số chính của chúng trong TravelBuddy.

## Slide 48 — 3 Pattern Map Vào 4 Hành Vi Của Lab
Liệt kê các tình huống và cách mà agent sẽ xử lý.

## Slide 49 — Grounding: Tool Output Là Nguồn Sự Thật
Nêu ví dụ về sự khác nhau giữa output grounded và hallucinated.

## Slide 50 — 4 Hành Vi Agent Phải Xử Lý Đúng
Liệt kê các hành vi mà agent cần thực hiện đúng trong lab.

## Slide 51 — Worked Example: Case Đà Nẵng 5 Triệu (Normal)
Minh họa cách agent xử lý tình huống cụ thể.

## Slide 52 — Bridge: Từ Nguyên Lý Phần A Đến graph.py
Liên kết giữa nguyên lý và các hàm bạn hoàn thiện trong lab.

## Slide 53 — Hands-on 4: Cách Chạy Lab
Hướng dẫn chi tiết từng bước để chạy lab 4.

## Slide 54 — Grader Chấm Theo Trọng Số Nào?
Chi tiết các tiêu chí chấm điểm cho lab và trọng số tương ứng.

## Slide 55 — Lab #4
Yêu cầu hoàn thiện lab và các yếu tố cần chú ý.

## Slide 56 — Tổng kết — Key Takeaways
Những ý chính cần nhớ trước khi sang bài tiếp theo.

## Slide 57 — Tiếp theo & Bài tập
Yêu cầu cho bài học tiếp theo và hoàn thiện lab.

## Slide 58 — Tài Liệu Tham Khảo
Liệt kê tài liệu và nguồn tham khảo đã sử dụng trong bài học.

## Slide 59 — Hỏi & Đáp
Khuyến khích sinh viên đặt câu hỏi về nội dung bài học.

## Slide 60 — Cảm ơn!
Liên hệ với giảng viên qua email hoặc thông tin github.
```

## Khái niệm chính
- [[prompt-fundamentals]]: Những nguyên tắc cơ bản trong việc tạo ra prompt hiệu quả.
- [[lịch-sử-tiến-hoá-prompting]]: Quá trình phát triển và tiến hóa của prompting từ các khái niệm cơ bản đến các phương pháp phức tạp hơn.
- [[advanced-prompting-techniques]]: Các kỹ thuật nâng cao trong việc thiết kế prompt nhằm tối ưu hóa tương tác với model.
- [[system-prompt-engineering]]: Thiết kế và tối ưu hóa system prompt để đảm bảo tính nhất quán và dễ kiểm soát của agent.
- [[context-engineering]]: Lựa chọn đúng các token để tối ưu hóa khả năng của model.
- [[tool-calling]]: Cách thức agent tương tác thông qua việc gọi các công cụ khác nhau khi thực hiện tác vụ.
- [[tool-use-patterns]]: Các mô hình sử dụng tool trong quá trình gọi và xử lý công việc của agent.
- [[harness-engineering]]: Khái niệm thiết kế hệ thống cấu trúc các prompt quanh model để tối ưu hóa hiệu suất làm việc.
- [[role]]: Vai trò của agent trong hệ thống.
- [[task]]: Nhiệm vụ mà agent cần thực hiện.
- [[context]]: Bối cảnh mà agent hoạt động và các yếu tố liên quan.
- [[format]]: Định dạng đầu ra mà agent phải tuân thủ.
