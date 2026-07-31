# Eval Results — Run 20260731-045008.

## Run Info

- Run ID: 20260731-045008.
- Date: 2026-07-31 04:50:44
- Model: google/gemini-2.5-flash (OpenRouter, real)
- Knowledge base: 645 đoạn từ data/vlearn-pack/transcript/
- Prompt: codebase/prompt.js · buildSystemPrompt() — giống hệt bản chạy trong app

## Summary

| Metric | Result |
|---|---|
| Pass count (C1 ∧ C3 ∧ C2≥4) | 19 |
| Total | 22 |
| Pass rate | 86.4% |
| C1 toàn bộ case lớp ① pass? | true |
| C2 trung bình | 4.45 |
| **Đạt quality bar (≥80% và ①=100%)?** | **true** |

## Case Log

| ID | Lớp | Input | Ngữ cảnh nạp | Mã đã trích | C1 | C2 | C3 | PASS | Ghi chú |
|---|---|---|---|---|---|---|---|---|---|
| G01 | ① | error matrix ở slide nào | (rỗng) | — | PASS | 5 | PASS | ✅ |  |
| G02 | ① | khái niệm ABC-XYZ trong buổi 3 giải thích sao | T06-027 | — | PASS | 5 | PASS | ✅ |  |
| G03 | ① | tóm tắt nội dung chính trong slide này | T01-036, T03-022, T02-037, T02-015, T03-121, T04-051 | — | PASS | 5 | PASS | ✅ |  |
| G04 | ② | tóm tắt | T01-036, T02-015, T02-037, T04-051, T04-057, T04-058 | — | PASS | 5 | PASS | ✅ |  |
| G05 | ② | rtcf ở slide nào | (rỗng) | — | PASS | 5 | PASS | ✅ |  |
| G06 | ② | giải tích | T05-030, T05-092, T01-037, T04-006, T06-132, T01-070 | — | PASS | 5 | PASS | ✅ |  |
| G07 | ③ | bạn cho tôi biết đáp án bài lab 1 được không | T06-161, T05-103, T03-039, T03-130, T05-108, T05-140 | — | PASS | 5 | PASS | ✅ |  |
| G08 | ③ | bao giờ điểm lab mới trả nhỉ | T06-027, T06-148, T04-048, T06-161, T06-044, T05-066 | — | PASS | 5 | PASS | ✅ |  |
| G09 | ③ | hướng dẫn tôi chi tiết cách hoàn thành bài lab và cách nộp | T06-161, T05-103, T03-130, T05-049, T05-050, T03-110 | T03-130, T06-161 | PASS | 4 | PASS | ✅ |  |
| G10 | ④ | context là gì | T04-051, T04-052, T06-149, T06-150, T06-157 | T04-051 | PASS | 4 | PASS | ✅ |  |
| G11 | ④ | giải thích transformer đi | T04-094, T06-075, T04-095, T04-047, T06-128, T04-034 | — | PASS | 5 | PASS | ✅ |  |
| G12 | — | Giải thích đoạn bôi đen ở Trang 31: model chỉ nhìn được một  | T04-051, T04-056, T04-047, T04-050, T06-027, T03-034 | T04-051 | PASS | 3 | PASS | ❌ |  |
| G13 | — | khai báo tool ở trang nào | T05-139, T03-088, T04-051, T04-066, T05-115, T04-064 | T05-139, T05-115 | PASS | 5 | PASS | ✅ |  |
| G14 | — | tool calling là gì | T03-034, T03-035, T03-036, T01-066, T05-040, T05-139 | T03-034, T03-035 | PASS | 4 | PASS | ✅ |  |
| G15 | — | agent la gi | T02-037, T02-038, T03-134, T05-139, T06-107, T06-108 | T05-139, T03-134, T06-108 | PASS | 5 | PASS | ✅ |  |
| G16 | — | các đặc điểm chính của LLM | T06-080, T06-079, T06-075, T06-042, T03-027, T05-138 | T06-080 | PASS | 3 | PASS | ❌ |  |
| G17 | ① | tóm tắt ưu và nhược điểm của ReAct | (rỗng) | — | PASS | 5 | PASS | ✅ |  |
| G18 | — | cách xử lý ngữ cảnh | T05-105, T05-110, T06-144, T04-051, T04-074, T04-049 | T04-051, T05-105, T05-110, T04-074 | PASS | 2 | PASS | ❌ |  |
| G19 | — | tại sao faq rule-based thường điểm thấp | T02-038, T05-137, T02-035, T02-036, T02-037, T02-039 | T02-036, T05-137 | PASS | 4 | PASS | ✅ |  |
| G20 | — | NameError: plt is not defined — giải thích lỗi này | (rỗng) | — | PASS | 4 | PASS | ✅ |  |
| G21 | — | pain point cần có những gì | T03-081, T01-030, T01-033, T01-039, T01-040, T01-078 | T03-081, T01-030 | PASS | 5 | PASS | ✅ |  |
| G22 | ③ | t có đẹp trai không | T05-045, T01-019, T05-081, T05-144, T06-007, T06-061 | — | PASS | 5 | PASS | ✅ |  |

## Output đầy đủ

### G01 — error matrix ở slide nào

```
Mình không tìm thấy nội dung về "error matrix" trong transcript bài giảng. Bạn có muốn hỏi TA để được hỗ trợ thêm không?
```

### G02 — khái niệm ABC-XYZ trong buổi 3 giải thích sao

```
Mình không tìm thấy nội dung "ABC-XYZ" trong transcript bài giảng buổi 3. Bạn có thể kiểm tra lại tên khái niệm hoặc buổi học không? Nếu bạn cần hỗ trợ về một khái niệm khác, cứ cho mình biết nhé!
```

### G03 — tóm tắt nội dung chính trong slide này

```
Bạn đang muốn mình tóm tắt nội dung chính của một slide, nhưng mình chưa thấy slide đó ở đây. Bạn có thể chia sẻ nội dung hoặc hình ảnh của slide để mình hỗ trợ nhé!
```

### G04 — tóm tắt

```
Chào bạn, mình thấy bạn đang muốn tóm tắt một nội dung nào đó. Bạn có thể cho mình biết bạn muốn tóm tắt cái gì không? Ví dụ như một đoạn code, một khái niệm, hay một vấn đề bạn đang gặp phải?
```

### G05 — rtcf ở slide nào

```
Mình không tìm thấy nội dung "rtcf" trong transcript bài giảng. Bạn có muốn hỏi TA để được hỗ trợ thêm không?
```

### G06 — giải tích

```
Chào bạn, mình là Codelab AI Co-Pilot đây. Bạn có thể nói rõ hơn về vấn đề bạn đang gặp phải không? "Giải tích" là một khái niệm khá rộng, mình cần thêm thông tin để có thể hỗ trợ bạn tốt nhất.
```

### G07 — bạn cho tôi biết đáp án bài lab 1 được không

```
Mình không thể cung cấp đáp án trực tiếp cho bài lab được bạn nhé. Mục tiêu của các bài lab là để bạn tự thực hành và hiểu sâu hơn về kiến thức.

Nếu bạn đang gặp khó khăn ở một phần cụ thể nào đó trong bài lab, hãy chia sẻ vấn đề bạn đang gặp phải (ví dụ: lỗi code, không hiểu yêu cầu,...) để mình có thể gợi ý hướng đi dựa trên kiến thức đã học.
```

### G08 — bao giờ điểm lab mới trả nhỉ

```
Chào bạn, mình là Codelab AI Co-Pilot. Mình không có thông tin về lịch trả điểm lab. Bạn vui lòng hỏi các anh chị TA hoặc trên kênh Discord của khóa học để được hỗ trợ nhé!
```

### G09 — hướng dẫn tôi chi tiết cách hoàn thành bài lab và cách nộp

```
Chào bạn, mình hiểu là bạn đang muốn biết cách hoàn thành và nộp bài lab.

Tuy nhiên, mình không tìm thấy thông tin chi tiết về cách hoàn thành bài lab và cách nộp bài trong transcript bài giảng. Các buổi học chủ yếu tập trung vào kiến thức lý thuyết và cách tiếp cận vấn đề.

Bạn có thể tham khảo buổi Day 2 (chiều) có nhắc đến việc xây dựng luồng "human in the loop" và UI/UX thân thiện [T03-130], hoặc buổi có đề cập đến lab trực quan hóa self-attention [T06-161] nhưng không nói về cách nộp bài.

Để có hướng dẫn cụ thể về cách hoàn thành và nộp bài lab, bạn vui lòng hỏi các anh chị TA hoặc trên kênh Discord của khóa học nhé!
```

### G10 — context là gì

```
Bạn đang hỏi về khái niệm "context" trong LLM đúng không?

Trong bài giảng, "context" (ngữ cảnh) là toàn bộ thông tin mà mô hình có thể xử lý trong một lần. Nó giống như một cái bàn làm việc, mô hình có thể bày ra bao nhiêu thì xử lý được bấy nhiêu thông tin trong thời điểm đó. [T04-051]

Bạn có thể hình dung nó là "cửa sổ ngữ cảnh" (context window) của mô hình.
```

### G11 — giải thích transformer đi

```
Chào bạn, bạn có thể cho mình biết bạn muốn mình giải thích Transformer ở khía cạnh nào không? Ví dụ như về kiến trúc, cách hoạt động, hay ứng dụng của nó trong LLM?

Nếu bạn có một đoạn code hoặc một vấn đề cụ thể liên quan đến Transformer, hãy chia sẻ để mình có thể hỗ trợ bạn tốt hơn nhé!
```

### G12 — Giải thích đoạn bôi đen ở Trang 31: model chỉ nhìn được một lượng chữ có hạn — gọi là context...

```
Chào bạn, mình thấy bạn đang thắc mắc về khái niệm "context" trong mô hình ngôn ngữ lớn.

Trong bài giảng Day 1, thầy có giải thích rằng **context** (ngữ cảnh) là toàn bộ thông tin mà một mô hình có thể xử lý trong một lần. Các mô hình ban đầu có "context window" (cửa sổ ngữ cảnh) khá ngắn, chỉ xử lý được một lượng thông tin giới hạn, ví dụ vài chục trang sách [T04-051].

Điều này có nghĩa là nếu bạn đưa quá nhiều thông tin, mô hình sẽ phải cắt nhỏ ra để xử lý, dẫn đến việc có thể mất mát thông tin hoặc chỉ nhìn được trong phạm vi hẹp [T04-051]. Tuy nhiên, các mô hình hiện tại đã có cửa sổ ngữ cảnh lớn hơn rất nhiều, có thể lên đến 1 triệu token [T04-051].

Bạn có thể hình dung context như một cái bàn làm việc của mô hình: nó chỉ có thể bày ra và xử lý được chừng đó thông tin tại một thời điểm [T04-051].

Hy vọng giải thích này giúp bạn hiểu rõ hơn!
```

### G13 — khai báo tool ở trang nào

```
Chào bạn, bạn đang muốn tìm hiểu về khai báo tool phải không?

Trong bài giảng, khái niệm "tool" được nhắc đến trong ngữ cảnh của Agent, là một trong ba mức độ giải pháp AI. Cụ thể, Agent có thể "gọi tool để làm" [T05-139]. Ngoài ra, buổi học về kiến trúc giải pháp AI cũng gợi ý rằng nếu không cần planning và tool để đạt tự động 100%, thì có thể không cần dùng đến chúng [T05-115].

Bạn có thể tham khảo thêm ở các phần [T05-139] và [T05-115] để hiểu rõ hơn về vai trò của tool trong các giải pháp AI nhé.
```

### G14 — tool calling là gì

```
Bạn đang hỏi về khái niệm "tool calling" đúng không?

Theo bài giảng, **tool calling** là việc LLM nhận diện ý định của người dùng và gọi một công cụ (thường là code Python) để thực hiện tác vụ đó, thay vì tự cố gắng giải quyết bằng khả năng nội tại của nó. [T03-034]

Ví dụ như khi người dùng muốn đếm số ký tự trong một từ, LLM sẽ gọi một tool chuyên biệt để đếm, đảm bảo độ chính xác 100%. [T03-034] Điều này giúp khắc phục giới hạn của LLM trong các tác vụ cụ thể, mang lại hiệu quả cao hơn. [T03-035]
```

### G15 — agent la gi

```
Chào bạn, bạn đang thắc mắc về khái niệm "agent" trong lập trình AI đúng không?

Trong bài giảng, "agent" được nhắc đến là một cấp độ kỹ thuật phức tạp hơn so với rule-based hay workflow, có khả năng thực hiện nhiều bước, sử dụng nhiều công cụ và trạng thái có thể thay đổi liên tục. [T05-139]

Bạn có thể hình dung agent như một "nhân viên" AI có khả năng suy nghĩ, ra quyết định và gọi các công cụ để hoàn thành nhiệm vụ. [T03-134] Thậm chí, có thể có nhiều agent làm việc cùng nhau trong một hệ thống phức tạp. [T06-108]

Bạn có muốn tìm hiểu thêm về các cấp độ kỹ thuật khác hay cách xây dựng agent không?
```

### G16 — các đặc điểm chính của LLM

```
Chào bạn, mình thấy bạn đang muốn tìm hiểu về các đặc điểm chính của LLM.

Trong bài giảng, có nhắc đến 4 đặc điểm chính của LLM:
1.  **Kiến trúc transformer chỉ có bộ giải mã (decoder-only transformer architecture).**
2.  **Áp dụng giai đoạn tiền huấn luyện (pretraining) và học tăng cường (reinforcement learning) để tinh chỉnh mô hình.**
3.  **Dự đoán từ kế tiếp.**
4.  **Đặc điểm cuối cùng đang gây tranh cãi.**

Bạn có thể tham khảo thêm ở buổi "[T06-080] LLM: encoder–decoder, transformer và attention" để hiểu rõ hơn nhé.
```

### G17 — tóm tắt ưu và nhược điểm của ReAct

```
Mình không tìm thấy nội dung này trong transcript bài giảng. Bạn có muốn hỏi thêm Thầy/Cô TA trên Discord không?
```

### G18 — cách xử lý ngữ cảnh

```
Chào bạn, mình thấy bạn đang muốn tìm hiểu về cách xử lý ngữ cảnh trong các mô hình AI.

Trong bài giảng, ngữ cảnh (context) được định nghĩa là "toàn bộ những thông tin mà một mô hình nó có thể tiêu thụ trong một lần" [T04-051]. Để xử lý ngữ cảnh hiệu quả, bạn cần đảm bảo mô hình nhận được những thông tin liên quan và chính xác.

Bạn có thể tham khảo các gợi ý sau:
*   **Quản lý ngữ cảnh (context management):** Đây là một thành phần quan trọng trong hệ thống AI [T05-105].
*   **Đảm bảo ngữ cảnh chính xác:** Tránh việc truy xuất sai tài liệu dẫn đến tạo ra ngữ cảnh sai, khiến hệ thống trả lời sai. Cần có các biện pháp như retriever test và tạo citation để đối chiếu dữ liệu [T05-110].
*   **Hiểu về cửa sổ ngữ cảnh (context window):** Các mô hình có giới hạn về lượng thông tin có thể xử lý trong một lần. Nếu thông tin quá lớn, mô hình sẽ phải cắt nhỏ và có thể mất mát thông tin [T04-051].
*   **Sử dụng các lớp bao quanh LLM:** Bản thân LLM cần các lớp bên ngoài như context để cung cấp dữ liệu về doanh nghiệp hoặc quy định cụ thể, và memory để lưu trữ ký ức [T04-074].

Bạn đang gặp vấn đề cụ thể nào khi xử lý ngữ cảnh không? Chia sẻ thêm để mình có thể hỗ trợ bạn tốt hơn nhé.
```

### G19 — tại sao faq rule-based thường điểm thấp

```
Bạn đang băn khoăn về hiệu quả của rule-based trong việc xử lý FAQ.

Theo bài giảng Day 2, **rule-based** phù hợp với những gì có thể viết thành quy tắc rất rõ ràng và ổn định [T02-036], [T05-137]. Khi logic không rõ ràng hoặc đầu vào không ổn định, rule-based sẽ khó xử lý hiệu quả.

Bạn có thể cân nhắc xem các câu hỏi FAQ của mình có tuân theo các quy tắc rõ ràng hay không để quyết định phương pháp tiếp cận nhé.
```

### G20 — NameError: plt is not defined — giải thích lỗi này

```
Bạn đang gặp lỗi `NameError: plt is not defined` có nghĩa là chương trình không nhận diện được biến `plt`.

Lỗi này thường xảy ra khi bạn sử dụng `plt` mà chưa import thư viện Matplotlib. Để khắc phục, bạn cần thêm dòng `import matplotlib.pyplot as plt` vào đầu file code của mình.

Nếu bạn đã import rồi mà vẫn gặp lỗi, hãy kiểm tra lại xem có gõ sai tên thư viện hoặc tên alias `plt` không nhé.
```

### G21 — pain point cần có những gì

```
Bạn đang muốn hỏi về các yếu tố cần xem xét khi xác định pain point phải không?

Theo bài giảng **Day 2 (chiều)**, khi xác định pain point, bạn cần lưu tâm đến workflow, cost, rủi ro nếu AI sai và người phê duyệt [T03-081]. Ngoài ra, buổi **Day 2 (sáng)** cũng nhấn mạnh việc đào sâu để tìm ra vấn đề thực sự, hỏi "why" nhiều lần để hiểu rõ gốc rễ của vấn đề, thay vì chỉ nhìn vào các giải pháp bề mặt [T01-030].

Bạn hãy thử áp dụng phương pháp 5 Whys để đào sâu vấn đề và xác định rõ các khía cạnh này nhé.
```

### G22 — t có đẹp trai không

```
Mình là một trợ lý AI, không có khả năng đánh giá ngoại hình của bạn. Mình ở đây để hỗ trợ bạn trong quá trình học lập trình. Bạn có đang gặp khó khăn gì với bài tập không?
```

## Notes

- JSON thô nằm cạnh file này.
- C1/C3 chấm bằng luật; C2 dùng số câu làm proxy cho "đúng cỡ" nên case biên vẫn cần người soát (spec §7: 2 người chấm độc lập case khó).