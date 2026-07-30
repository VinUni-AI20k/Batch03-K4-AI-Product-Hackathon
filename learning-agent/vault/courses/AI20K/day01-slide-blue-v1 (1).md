---
course: AI20K
generated: '2026-07-30T17:28:10+00:00'
lang: vi
lesson: day01-slide-blue-v1 (1)
maps:
- '[[MOC - AI20K]]'
module: ''
source_file: AI20K/day01-slide-blue-v1 (1).pdf
source_hash: sha256:7c593abedb1884f8ea1204dbc3c2f4d89cae9cbeae2a52c6cd617189e0fd3619
type: lesson-note
---

## Slide 1 — AI & LLM Foundation

Bạn đang dùng AI mỗi ngày - nhưng thực sự bên trong nó đang làm gì?

## Instructor

<!-- image -->

## Mai Anh Nguyen Blue

Generalist Product Builder

Linkedin | Facebook

## Agenda

- Bức tranh AI & các tầng của AI
- Lịch sử AI 70 năm
- Bên trong LLM: cơ chế vận hành
- Từ LLM đến AI Agent
- Landscape: model hôm nay & cuộc đua hiện tại
- Chọn model & chi phí token
- Gọi API lần đầu
- Tổng kết - những ý để mang về

## Slide 2 — AI & LLM Foundation

Từ "nghe AI" đến "gọi AI" trong một ngày

## Hôm nay mình đi từ "nghe AI" đến "gọi AI"

Cuối ngày này, mỗi bạn sẽ ra về với 4 thứ:

<!-- image -->

## Hiểu được

Giải thích được [[LLM]] hoạt động thế nào - bằng trực giác, không cần công thức

## Nắm được

## Gọi được

Token, context, chi phí, độ trễ liên hệ với nhau ra sao. Lần gọi API đầu tiên - và hiểu cấu trúc của một lần gọi model. Không cần nền toán. Chỉ cần tò mò và một chiếc máy tính.

## Build được

Một chatbot dòng lệnh đơn giản có streaming - sản phẩm của chính bạn PHẦN 01

## Slide 3 — Bức tranh AI

AI, machine learning, LLM nằm ở đâu trong cùng một hệ?

## AI, ML, Deep Learning, GenAI, LLM - nằm ở đâu trong cùng một hệ?

<!-- image -->

## Ba nhóm AI chính: phân loại · sinh nội dung · hành động

## Discriminative AI

Giỏi phân loại, dự đoán: lọc spam, phát hiện gian lận, nhận diện ảnh.

Input → một nhãn, một con số

## Generative AI

Sinh ra thứ mới: văn bản, ảnh, code. ChatGPT, Claude, Midjourney.

Prompt → nội dung mới

## Agentic AI

Nhận mục tiêu rồi tự làm nhiều bước: lập kế hoạch, dùng công cụ, hành động.

Goal → Plan → Action

[[LLM]] là engine chung của cả Generative lẫn Agentic - cuối buổi sáng mình sẽ thấy agent khác LLM ở đâu PHẦN 02

## Slide 4 — Lịch sử AI

70 năm của những lần chạm trần và đổi nền tảng

## Lịch sử AI 70 năm

<!-- image -->

2 lần mùa đông, cách tiếp cận chạm trần. Từ model đơn lẻ sang system có khả năng hành động như agent.

## 1956: Dartmouth Workshop

<!-- image -->

## 1969: Perceptrons

<!-- image -->

Các hướng đi lần lượt chạm trần:

- Hướng symbolic (dạy máy bằng luật/quy tắc): bắt đầu đuối trước thế giới quá nhiều ngữ cảnh.
- Hướng Perceptron (thay vì viết hết luật, mình có thể cho máy học từ ví dụ) cũng gặp vấn đề vì quá đơn giản.

## 1973: Báo cáo Lighthill

Chính phủ Anh nhờ James Lighthill đánh giá lại toàn ngành AI. Ông kết luận thẳng: những gì AI làm được đi quá xa so với lời hứa.

Nguồn tiền đổ vào AI ở Anh và Mỹ bị cắt mạnh → mở màn [[mùa đông AI]] lần thứ nhất.

## 1980: Hệ chuyên gia (expert system)

Đặt lại vấn đề: "Nếu AI chỉ giải thật tốt một loại bài toán chuyên môn hẹp thì sao?"

- → Sự ra đời của [[expert systems]].

AI đổi chiến lược: thôi theo đuổi trí tuệ tổng quát và tập trung giải thật tốt một miền hẹp bằng cách mã hóa tri thức chuyên gia thành luật.

## Mùa đông AI lần 2

Expert systems từng tạo ra giá trị thật, nhưng càng mở rộng thì càng lộ trần: tri thức phải nhập bằng tay, luật càng nhiều càng khó cập nhật, và hệ thống khó đứng vững trước ngoại lệ mới.

- → [[Mùa đông AI]] lần 2

## Sự ra đời của Deep Learning

## 2009: Fei-Fei Li và ImageNet

Trong khi cả ngành chạy theo thuật toán thông minh hơn, Fei-Fei Li chọn con đường khác: xây bộ dữ liệu lớn hơn - 14 triệu ảnh được gán nhãn tay, hơn 20.000 loại vật.

Ba năm sau, chính bộ dữ liệu đó là sân khấu cho cú nổ [[AlexNet]] 2012 → bài học định hình cả kỷ nguyên: đôi khi dữ liệu tốt hơn đánh bại thuật toán khôn hơn.

## Deep Learning khác Machine Learning truyền thống ở chỗ nào?

- ImageNet cho mô hình ăn một lượng dữ liệu chưa từng có ở thời điểm đó.
- Kiến trúc sâu cho phép học dần từ cạnh, hình, bộ phận, rồi đến đối tượng.
- GPU cung cấp đủ năng lực tính toán để quá trình huấn luyện trở nên khả thi.

## AlphaGo và nước đi số 37

- Ban đầu nó học từ khoảng 150.000 ván cờ của chuyên gia con người để có trực giác khởi đầu → Tạo ra nhiều bản sao của [[AlphaGo]] và để chúng tự chơi với chính mình hàng triệu lần.
- → Hệ thống không chỉ học từ những gì con người đã biết, mà còn tự mở rộng không gian chiến lược bằng cách khám phá những nước đi chưa từng được thử trước đó.

## Nút thắt của RNN: đọc hết rồi mới nói - từng bước một

## Transformer thắng không phải vì phép màu nó tháo đúng nút thắt này: cho mọi từ nhìn nhau cùng lúc

## 2017: Transformer

[[Transformer]] là bước ngoặt vì nó cho mô hình hiểu ngôn ngữ theo cách linh hoạt hơn: mỗi từ có thể nhìn sang những từ quan trọng khác trong cả câu, thay vì chỉ đi tuần tự từng bước → trở thành nền móng kỹ thuật cho GPT, BERT và toàn bộ làn sóng [[LLM]] sau đó.

ChatGPT xuất hiện như một trải nghiệm đại chúng.

## Slide 5 — Bên trong LLM

Từ vòng lặp đoán token đến giới hạn của model.

## Bên trong LLM - bản đồ 5 chặng của buổi sáng

Thần chú xuyên suốt: 'Model chỉ đoán token tiếp theo - mọi thứ khác là hệ quả.’

## LLM là gì?

[[LLM]] (Large Language Model) là một mô hình ngôn ngữ rất lớn, thường dựa trên kiến trúc [[Transformer]], được luyện trên hàng nghìn tỷ mảnh chữ để học cách đoán mảnh chữ tiếp theo trong ngữ cảnh.

Nhờ được luyện đủ rộng, nó trở thành một nền chung: thay vì mỗi việc train một model riêng, cùng một model làm được rất nhiều việc. Chatbot chỉ là một dạng sản phẩm đóng gói quanh bộ não đó.

## Bên trong Transformer: đầu ra luôn là một phân bố xác suất

Với mọi ngữ cảnh, model chấm điểm mọi từ trong từ vựng và chọn theo xác suất đó.

## Sinh văn bản = đoán → nối vào câu → đoán tiếp

Mỗi token mới được nối vào ngữ cảnh, rồi model chạy lại từ đầu - vòng lặp predict → append → rerun.

## Token: model không đọc "từ", model đọc mảnh chữ

Model không nhìn từ nguyên vẹn. Nó cắt văn bản thành các mảnh nhỏ gọi là [[token]]: có từ là một mảnh, có từ vỡ thành ba bốn mảnh, cả dấu câu và khoảng trắng cũng là mảnh.

## Context: bàn làm việc có hạn của model

Mỗi lần trả lời, model chỉ nhìn được một lượng chữ có hạn - gọi là context. Hãy hình dung một bàn làm việc: mọi thứ muốn model "thấy" phải bày lên bàn.

## Attention: mỗi từ được 'nhìn sangˮ những từ quan trọng khác

Cơ chế attention cho phép mỗi token chủ động 'quay đầuˮ nhìn lại các token trước đó trong câu và chấm điểm mức độ liên quan của từng token đối với nghĩa của mình. 

## Minh họa khái niệm: token "nó" cần "chú ý" (attention) tới token nào để hiểu đúng nghĩa?

"Lan bỏ quyển sách vào túi vì nó quá dày" - mô hình so khớp "nó" với tất cả token trước đó.

## Slide 6 — Từ LLM đến AI Agent

Đặt bộ não vào vòng làm việc có mục tiêu và hành động.

## Chain-of-Thought

Chỉ thêm "giấy nháp", từ sai thành đúng.

## Không có nháp - trả lời ngay

Model đọc câu hỏi → bật ra đáp án ngay: "Đá p á n là 27 quả." ✗ SAI

## Có giấy nháp - "hãy nghĩ từng bước"

"Bắt đầu có 5 quả. Mỗi hộp 3 quả × 2 hộp = 6 quả. 5 + 6 = 11. Đáp án là 11 quả." ĐÚNG.

## LLM đứng một mình chưa làm được gì nhiều

Sản phẩm [[AI]] thật = bộ não [[LLM]] + hệ thống bao quanh - phần khó thường nằm ở hệ thống.

## Từ LLM đến agent: bốn mức độ - mỗi bậc thêm một năng lực

## LEVEL 0 Bộ não suy luận

LLM trần - không công cụ, không dữ liệu mới.

## LEVEL 1 Có kết nối

+ tools: search web, đọc database, gọi API - vượt khỏi bong bóng thời gian.

## LEVEL 2 Biết lập kế hoạch

+ tự chia mục tiêu thành nhiều bước, dùng nhiều tool nối tiếp, tự kiểm tra kết quả từng bước.

## LEVEL 3 Đội agent phối hợp

+ nhiều agent chuyên biệt chia việc như một đội ngũ (multiagent).

## Slide 7 — Landscape: model hôm nay

Giá rơi, năng lực hội tụ, và cuộc đua đang diễn ra.

## 2022 đến nay: tốc độ ra model tăng chóng mặt

## Cùng một mức năng lực, giá rơi khoảng 10 lần mỗi năm.

## Năng lực hội tụ - và model mở đang bắt kịp model đóng.

Không còn một model bỏ xa phần còn lại, chọn model là bài toán phương pháp, không phải bài toán nhớ tên.

## Từ model đơn lẻ sang hệ thống biết hành động.

## Slide 8 — Chọn model & chi phí token

Framework chọn tầng và token economy.

## Chọn model theo TẦNG, không chọn theo tên

### Việc đơn giản, khối lượng lớn

### Việc hàng ngày

### Việc khó nhất

### Việc cần kiểm soát

### Hai lỗi đối xứng:

- việc đơn giản mà gọi frontier → phí tiền.
- việc khó mà cố dùng rẻ → kết quả tệ.

## TẦNG MODEL

## TẦNG 1 - FRONTIER ĐÓNG

Fable 5 · GPT-5.6 Sol · Opus 4.8 - đắt nhất - chỉ trả cho việc thật sự khó.

## TẦNG 2 - RẺ MÀ MẠNH

Sonnet 4.6 · Terra · Gemini 3.1 Pro · Kimi K3 · Haiku · Flash - giải quyết đa số việc hằng ngày.

## TẦNG 3 - SELF-HOST / SIÊU RẺ

Kimi K3 open-weight · DeepSeek · Qwen - khi cần kiểm soát dữ liệu hoặc chi phí quy mô lớn.

## HÓA ĐƠN - 1 LẦN GỌI API

1.150 tok × $3 / 1M. Đọc mục usage trong mỗi response để kiểm soát chi phí từ ngày đầu.

## Slide 9 — Tổng kết những ý để mang về

## Key takeaways - 5 ý để mang về

1. [[LLM]] = cỗ máy [[Transformer]] đoán token tiếp theo từ context - mọi thứ khác là hệ quả.
2. Từ cỗ máy đoán chữ thành trợ lý: pre-training → SFT → căn chỉnh → luyện đề tự chấm & được nghĩ kỹ.
3. Model có giới hạn bẩm sinh: bong bóng thời gian, nói chắc như đúng rồi, bàn làm việc có hạn - nên đừng tin benchmark, hãy tự test.
4. Chọn model theo tầng theo việc, kiểm soát 3 núm: chất lượng - độ trễ - chi phí.
5. Gọi API là điều khiển một vòng next-token từ xa - kèm một mức quyền truy cập nhất định vào model.

## Khái niệm chính

- [[LLM]]: Mô hình ngôn ngữ lớn học cách đoán từ tiếp theo từ ngữ cảnh.
- [[Transformer]]: Kiến trúc cho phép hiểu ngôn ngữ theo cách linh hoạt hơn.
- [[mùa đông AI]]: Thời kỳ suy giảm tài trợ và hứng thú đối với AI.
- [[expert systems]]: Hệ thống AI chuyên môn hóa giải quyết một loại vấn đề cụ thể.
- [[token]]: Các mảnh nhỏ mà model đọc và xử lý trong văn bản.
