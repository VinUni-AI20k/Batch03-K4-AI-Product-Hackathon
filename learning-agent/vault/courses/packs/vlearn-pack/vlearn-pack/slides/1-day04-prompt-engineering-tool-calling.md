---
course: packs
generated: '2026-07-31T18:11:50+00:00'
lang: vi
lesson: 1-day04-prompt-engineering-tool-calling
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\slides\1-day04-prompt-engineering-tool-calling.md
source_hash: sha256:e8d2326b4d4aa39837f0064f323f5de727e76fab1b13ce61f1f9fcd3530870f1
type: lesson-note
---

```markdown
# 1 day04 prompt engineering tool calling

## Slide 1 — Prompt Engineering & Tool Calling
Nội dung bài học này liên quan đến [[Prompt Engineering]] và [[Tool Calling]]. Mục tiêu giúp model thực hiện đúng ý định và sử dụng các công cụ cần thiết. [00:00]

## Slide 2 — Hãy Suy Nghĩ...
Có sự khác biệt lớn trong kết quả khi hai người hỏi AI cùng một vấn đề. Câu hỏi này cần được giữ lại trong tâm trí khi chúng ta học bài hôm nay. [00:45]

## Slide 3 — Nội Dung Bài Học
Bài học bao gồm hai phần: 
- **Phần A — Nguyên lý**: Các nguyên tắc cơ bản về prompt, lịch sử và tiến hóa của prompting, kỹ thuật prompting nâng cao, và cách kỹ thuật gọi tool.
- **Phần B — Áp dụng**: Thiết kế và áp dụng một agent thực tế qua bài Lab. [01:30]

## Slide 4 — Mục Tiêu Ngày 4
- Viết prompt rõ ràng theo cấu trúc Role / Task / Context / Format.
- Biết cách sử dụng few-shot và CoT phù hợp.
- Viết system prompt giống như một hợp đồng.
- Tư duy về [[Context Engineering]] để chọn đúng tập token và khai báo tool bằng @tool và create_agent. [02:00]

## Slide 5 — Prompt Engineering Fundamentals
Một prompt tốt không phải là prompt "hay", mà là prompt tạo ra hành vi mong muốn ổn định từ model. [03:00]

## Slide 6 — Prompt Tốt và Kém
Ví dụ cho thấy sự khác biệt giữa prompt kém và tốt, cụ thể cần rõ ràng về sản phẩm, ngân sách, và yêu cầu. "Nguyên tắc vàng: Specificity beats cleverness". [03:45]

## Slide 7 — 4 Thành Phần Của Prompt Tốt
Prompt tốt cần có 4 thành phần: Role (Vai trò), Task (Nhiệm vụ), Context (Bối cảnh), Format (Định dạng). Chỉ thêm Role hoặc Context khi cải thiện chất lượng. [04:30]

## Slide 8 — Instruction vs Conversation vs System Prompt
Các loại prompt khác nhau và mục đích sử dụng chúng: Instruction prompt (ra lệnh), Conversation prompt (giữ ngữ cảnh), và System prompt (đặt ràng buộc). [05:15]

## Slide 9 — Structured Prompting
Sử dụng cấu trúc hoá với XML tags hoặc tiêu đề giúp model dễ bám theo cấu trúc và cải thiện tính nhất quán của output. [06:00]

## Slide 10 — Token Budget
Cần quản lý số lượng token sao cho hiệu quả, tránh kéo dài quá mức không cần thiết. "Prompt engineering tốt là tối ưu độ rõ và khả năng kiểm soát". [06:45]

## Slide 11 — Lịch Sử & Tiến Hoá Của Prompting
Khám phá quá trình phát triển của prompting từ những ngày đầu đến hiện tại. [07:30]

## Slide 12 — Dòng Thời Gian Prompting (2020–2026)
Mô tả các mốc quan trọng trong lịch sử và ý nghĩa của chúng đối với sự phát triển của [[Prompt Engineering]]. [08:15]

## Slide 13 — 3 Kỷ Nguyên: Prompt → Context → Harness
Chuyển mình từ Prompt sang Context đến Harness, mỗi giai đoạn đều có vai trò riêng. [09:00]

## Slide 14 — Các Kỹ Thuật “Cổ Điển”
Lịch sử các kỹ thuật prompting từ những năm 2021-2023 và ứng dụng của chúng. [09:45]

## Slide 15 — Vòng Lặp Tự Cải Thiện
Những phương pháp cải thiện quy trình suy nghĩ và quyết định của agent thông qua các bước như Plan-and-Solve, Self-Refine, Reflexion. [10:30]

## Slide 16 — Advanced Prompting Techniques
Chọn kỹ thuật tùy vào nhiệm vụ cụ thể thay vì sử dụng như một phép màu. [11:15]

## Slide 17 — Zero-shot, One-shot, Few-shot, CoT
Giải thích các hình thức prompting khác nhau từ không có ví dụ đến có các ví dụ để hỗ trợ cho agent trong việc quyết định. [12:00]

## Slide 18 — Few-shot — Trích Slot Từ Câu Tự Nhiên
Ví dụ về cách sử dụng few-shot prompting để trích xuất ý định mua sắm một cách có hiệu quả. [12:45]

## Slide 19 — Chain-of-Thought: Khi Giúp, Khi HẠI
CoT có thể giúp ích khi có suy luận nhiều bước, nhưng cũng có thể làm sai lệch kết quả trong một số trường hợp. [13:30]

## Slide 20 — Reasoning Models & Extended Thinking
Khi nào nên sử dụng reasoning model và khi nào không, đồng thời cách thiết kế bài toán suy luận hiệu quả. [14:15]

## Slide 21 — System Prompt Engineering
System prompt tốt giúp agent hoạt động nhất quán hơn và dễ kiểm soát hơn. [15:00]

## Slide 22 — Anatomy của System Prompt
Các thành phần của một system prompt như Persona, Rules, Capabilities, Constraints, và Output contract. [15:45]

## Slide 23 — System Prompt Là Một CONTRACT
System prompt cần rõ ràng và cụ thể, tương tự như một hợp đồng. [16:30]

## Slide 24 — System Prompt Anti-Patterns
Cảnh báo về các sai lầm thường gặp trong việc thiết kế system prompt. [17:15]

## Slide 25 — Prompt Là Code
Cần thường xuyên kiểm tra, phiên bản hóa và tối ưu hóa prompt như một đoạn mã. [18:00]

## Slide 26 — Context Engineering
Kỹ thuật hoá tập token mà model đọc, quản lý không chỉ câu lệnh mà còn cả các yếu tố khác giúp agent hoạt động. [19:00]

## Slide 27 — Context Engineering = Chọn Đúng Tập Token
Xác định rõ tập token sẽ sử dụng cho Agent, không chỉ chú trọng vào câu cú. [19:45]

## Slide 28 — Context Window Management
Quản lý không gian context để sản phẩm đầu ra không bị mất mát thông tin quan trọng trong quá trình xử lý. [20:30]

## Slide 29 — Memory Injection và Context Compression
Chỉ đưa vào những facts cần thiết và tóm tắt thông tin cũ để giảm tải cho model. [21:15]

## Slide 30 — Prompt Caching
Ứng dụng caching để giảm thiểu chi phí và thời gian đáp ứng, xếp đặt phần tĩnh lên trước. [22:00]

## Slide 31 — Tool Calling: Từ Cơ Chế Đến create_agent
Giới thiệu cách thức gọi tool trong quá trình tương tác với các yếu tố bên ngoài. [22:45]

## Slide 32 — Tool Calling Flow
Mô tả quy trình gọi tool và cách mà model chỉ gửi yêu cầu gọi tool mà không tự chạy tool. [23:30]

## Slide 33 — Tool Schema
Đây là cấu trúc hướng dẫn chi tiết giúp model quyết định khi nào và cách gọi tool một cách chính xác. [24:15]

## Slide 34 — Cơ Chế: Vòng Lặp Tool Calling “Thủ Công”
Chương trình mô tả vòng lặp thủ công khi thực hiện gọi các tool. [25:00]

## Slide 35 — Khai Báo Tool Bằng @tool
Hướng dẫn khai báo chi tiết các tool bằng cách sử dụng decorator @tool. [25:45]

## Slide 36 — Abstraction: create_agent
Giới thiệu cách thực hiện vòng lặp quyết định, gọi và quan sát mà không cần lập trình thủ công. [26:30]

## Slide 37 — Thiết Kế Tool & Tool-Use Patterns
Nêu rõ vai trò của thiết kế tool và cách sử dụng pattern khi gọi tool để điều phối quy trình một cách tối ưu. [27:15]

## Slide 38 — 4 Nguyên Tắc Thiết Kế Tool
Trình bày các nguyên tắc quan trọng trong thiết kế tool cần tuân thủ. [28:00]

## Slide 39 — Granularity: Quá Nhỏ Hay Quá To
Phân tích tầm quan trọng của chi tiết trong thiết kế tool, tránh sự phức tạp không cần thiết. [28:45]

## Slide 40 — Dependency Chain
Lưu ý về chuỗi phụ thuộc đầu vào đầu ra giữa các tool và cách tổ chức chúng. [29:30]

## Slide 41 — 3 Tool-Use Patterns Thường Gặp
Mô tả ba pattern gọi tool thường gặp mà agent cần xử lý. [30:15]

## Slide 42 — Harness Engineering (2026)
Giới thiệu đến giai đoạn mới trong thiết kế prompt, tổ chức và tối ưu hóa. [31:00]

## Slide 43 — Các Bề Mặt PROMPT Trong Một Harness
Giới thiệu đến các bề mặt prompt quan trọng trong một harness. [31:45]

## Slide 44 — Vì Sao Harness Quan Trọng
Nhấn mạnh tầm quan trọng của việc xây dựng một harness mạnh mẽ để cải thiện hiệu suất của agent. [32:30]

## Slide 45 — Lab 4: Bạn Xây Gì?
Giới thiệu nội dung bài Lab 4, nơi áp dụng các nguyên lý từ Phần A vào thực tiễn. [33:15]

## Slide 46 — System Prompt — TravelBuddy
Mô tả system prompt mẫu cho dự án TravelBuddy, định nghĩa rõ vai trò và nhiệm vụ của agent. [34:00]

## Slide 47 — Tool Contract Của TravelBuddy
Trình bày chi tiết về các tool cùng với các tham số chính và giá trị trả về. [34:45]

## Slide 48 — 3 Pattern Map Vào 4 Hành Vi Của Lab
Liệt kê cách các pattern tương ứng với hành vi của agent trong bài lab. [35:30]

## Slide 49 — Grounding: Tool Output Là Nguồn Sự Thật
Khẳng định sự quan trọng của việc lấy dữ liệu từ output của tool để bảo đảm tính chính xác. [36:15]

## Slide 50 — 4 Hành Vi Agent Phải Xử Lý Đúng
Các hành vi mà agent cần thể hiện trong quá trình thực hiện nhiệm vụ. [37:00]

## Slide 51 — Worked Example: Case Đà Nẵng 5 Triệu
Trình bày ví dụ thực hành về cách agent xử lý thông tin từ đầu đến cuối. [37:45]

## Slide 52 — Bridge: Từ Nguyên Lý Phần A Đến graph.py
Kết nối lý thuyết từ Phần A vào ứng dụng thực tiễn trong mã nguồn. [38:30]

## Slide 53 — Hands-on 4: Cách Chạy Lab
Hướng dẫn cụ thể cách triển khai và kiểm tra Lab 4. [39:15]

## Slide 54 — Grader Chấm Theo Trọng Số Nào?
Chi tiết về tiêu chí chấm điểm và các yếu tố cần chú ý khi đánh giá. [40:00]

## Slide 55 — Lab #4
Tóm tắt mục tiêu và yêu cầu của bài Lab 4, đảm bảo sinh viên hiểu rõ những gì cần hoàn thiện. [40:45]

## Slide 56 — Tổng kết — Key Takeaways
Các ý chính cần ghi nhớ trước khi bước vào bài mới. [41:30]

## Slide 57 — Tiếp theo & Bài tập
Chuẩn bị cho những gì sẽ đến trong bài học tiếp theo cùng các yêu cầu cần hoàn thiện. [42:15]

## Slide 58 — Tài Liệu Tham Khảo
Danh sách các tài liệu quan trọng để tham khảo và nghiên cứu. [43:00]

## Slide 59 — Hỏi & Đáp
Thời gian dành cho những câu hỏi và giải đáp thắc mắc trong lớp học. [44:00]

## Slide 60 — Cảm ơn!
Thông tin liên hệ và tài liệu hỗ trợ bổ sung. [45:00]

## Khái niệm chính
- [[Prompt Engineering]]: Lĩnh vực liên quan đến việc tạo ra các câu lệnh để giao tiếp hiệu quả với model AI.
- [[Tool Calling]]: Phương pháp mà agent sử dụng để tương tác với các công cụ bên ngoài trong quá trình thực hiện nhiệm vụ.
- [[Context Engineering]]: Nghệ thuật lựa chọn và quản lý các tập token có ảnh hưởng đến output của agent.
```
