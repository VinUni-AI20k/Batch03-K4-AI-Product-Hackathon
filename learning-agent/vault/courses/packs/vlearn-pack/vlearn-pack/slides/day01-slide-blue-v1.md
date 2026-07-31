---
course: packs
generated: '2026-07-31T18:18:14+00:00'
lang: vi
lesson: day01-slide-blue-v1
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\slides\day01-slide-blue-v1.md
source_hash: sha256:82c8745f33def0100bef9e2b83150e24ec76c3f63831021f0635a1475402a4c9
type: lesson-note
---

```markdown
## Slide 1 — AI IN ACTION - Day 1
AI & LLM Foundation  
Bạn đang dùng AI mỗi ngày — nhưng thực sự bên trong nó đang làm gì?  
Instructor: Mai Anh Nguyen (Blue)

## Slide 2 — Giới thiệu giảng viên
Mai Anh Nguyen (Blue)  
Generalist Product Builder  
Linkedin | Facebook  
Instructor  
- 2026: FPT Long Châu (PM · Healthcare Product)  
- 2025: Thongtincuuho.org (Co-founder)  
- 2025: FPT Software AI Center (PM · AI Agent)  
- 2021 - 2025: Xantus (PM · On-chain Analytics, AI Agent)  
- 2016 - 2021: DYNO, Kalapa (PM · OCR, eKYC, Credit Scoring)

## Slide 3 — Lịch trình buổi học
AI IN ACTION - Day 1  
Agenda  
- Bức tranh AI & các tầng của AI  
- Lịch sử AI 70 năm  
- Bên trong LLM: cơ chế vận hành  
- Từ LLM đến AI Agent  
- Landscape: model hôm nay & cuộc đua hiện tại  
- Chọn model & chi phí token  
- Gọi API lần đầu  
- Tổng kết — những ý để mang về  
AI & LLM Foundation  
Từ "nghe AI" đến "gọi AI" trong một ngày

## Slide 4 — Mục tiêu buổi học
1. Hiểu được: Giải thích được [[LLM]] hoạt động thế nào — bằng trực giác, không cần công thức  
2. Nắm được: [[Token]], context, chi phí, độ trễ liên hệ với nhau ra sao  
3. Gọi được: Lần gọi API đầu tiên — và hiểu cấu trúc của một lần gọi model  
4. Build được: Một chatbot dòng lệnh đơn giản có streaming — sản phẩm của chính bạn  
Hôm nay mình đi từ "nghe AI" đến "gọi AI". Cuối ngày này, mỗi bạn sẽ ra về với 4 thứ: Không cần nền toán. Chỉ cần tò mò và một chiếc máy tính.

## Slide 5 — Bức tranh AI
PHẦN 01  
Bức tranh AI  
AI, [[Machine Learning]], LLM nằm ở đâu trong cùng một hệ?

## Slide 6 — Các khái niệm về AI
AI, ML, Deep Learning, GenAI, LLM — nằm ở đâu trong cùng một hệ?  
- AI — chiếc ô lớn nhất: mọi hệ thống có yếu tố “thông minh”.  
- Machine Learning — học từ dữ liệu thay vì viết luật tay.  
- Deep Learning — mạng nơ-ron nhiều tầng tự học đặc trưng.  
- Generative AI — sinh nội dung mới: văn bản, ảnh, code.  
- LLM — model nền chuyên ngôn ngữ, tim của làn sóng hiện nay.  
LLM không phải toàn bộ AI — nhưng nó là tầng nền của gần hết trải nghiệm AI bạn dùng hôm nay.

## Slide 7 — Các loại AI
- **Discriminative AI**: Giỏi phân loại, dự đoán: lọc spam, phát hiện gian lận, nhận diện ảnh.  
- **Generative AI**: Sinh ra thứ mới: văn bản, ảnh, code.  
- **Agentic AI**: Nhận mục tiêu rồi tự làm nhiều bước: lập kế hoạch, dùng công cụ, hành động.  
LLM là engine chung của cả Generative lẫn Agentic. Cuối buổi sáng mình sẽ thấy agent khác LLM ở đâu.

## Slide 8 — Lịch sử AI
PHẦN 02  
Lịch sử AI  
70 năm của những lần chạm trần và đổi nền tảng

## Slide 9 — Các giai đoạn chính trong lịch sử AI
Lịch sử AI 70 năm bao gồm:  
- Khai sinh, lời hứa đầu tiên  
- 2 lần mùa đông, cách tiếp cận chạm trần  
- Từ model đơn lẻ sang system có khả năng hành động như agent  

## Slide 10 — Sự ra đời của AI
1956: Dartmouth Workshop  
"Artificial Intelligence" ra đời với ý tưởng: nếu trí thông minh có thể được mô tả đủ rõ, thì máy móc cũng có thể mô phỏng lại nó.

## Slide 11 — Giai đoạn Perceptron
1969: Perceptrons  
Các hướng đi lần lượt chạm trần:  
- Hướng symbolic (dạy máy bằng luật/quy tắc): bắt đầu đuối trước thế giới quá nhiều ngữ cảnh.  
- Hướng Perceptron (thay vì viết hết luật, mình có thể cho máy học từ ví dụ) cũng gặp vấn đề vì quá đơn giản.

## Slide 12 — Báo cáo Lighthill
1973: Báo cáo Lighthill — cú hích kết thúc kỳ lạc quan đầu  
Chính phủ Anh nhờ James Lighthill đánh giá lại toàn ngành AI và kết luận rằng những gì AI làm được đi quá xa so với lời hứa.

## Slide 13 — Giai đoạn mùa đông AI lần 1
Bài toán nhỏ — trông khá thông minh ✓  
Mùa đông AI lần 1: 1974-1980

## Slide 14 — Hệ chuyên gia (expert system)
1980: Hệ chuyên gia (expert system)  
Đặt lại vấn đề: "Nếu AI chỉ giải thật tốt một loại bài toán chuyên môn hẹp thì sao?"  

## Slide 15 — Mùa đông AI lần 2
Mùa đông AI lần 2  
Expert systems từng tạo ra giá trị nhưng càng mở rộng càng lộ trần: tri thức phải nhập bằng tay, luật càng nhiều càng khó cập nhật.

## Slide 16 — Sự ra đời của Deep Learning
Sự ra đời của [[Deep Learning]]  
Sau mùa đông lần hai, câu hỏi của cả ngành đổi hẳn: "Nếu không thể viết hết tri thức thế giới vào máy, thì có thể để máy tự học nó từ dữ liệu không?"

## Slide 17 — Cách mạng dữ liệu ImageNet
2009: Fei-Fei Li và ImageNet — cuộc cách mạng của dữ liệu  
Bộ dữ liệu lớn hơn — 14 triệu ảnh được gán nhãn tay, hơn 20.000 loại vật.

## Slide 18 — Sự khác biệt giữa Deep Learning và Machine Learning
Deep Learning khác [[Machine Learning]] truyền thống ở chỗ nó không cần con người thiết kế đặc trưng bằng tay.

## Slide 19 — Cuộc thi ImageNet và AlexNet
ImageNet  
2012: AlexNet chiến thắng ở ImageNet Large Scale Visual Recognition Challenge.

## Slide 20 — AlphaGo
2016: AlphaGo  
Hệ thống không chỉ học từ những gì con người đã biết, mà còn tự mở rộng không gian chiến lược bằng cách khám phá những nước đi chưa từng được thử trước đó.

## Slide 21 — Nút thắt của RNN
Nút thắt của [[RNN]]: đọc hết rồi mới nói — từng bước một  
Bản chất từ nút thắt khiến việc mở rộng khó khăn.

## Slide 22 — Ra đời của Transformer
2017: [[Transformer]] ra đời, tạo bước ngoặt trong việc hiểu ngôn ngữ linh hoạt hơn.

## Slide 23 — Sự xuất hiện của ChatGPT
2022: ChatGPT xuất hiện như một trải nghiệm đại chúng.

## Slide 24 — Cuộc cách mạng từ ChatGPT
Trước khi ChatGPT bùng nổ, nghiên cứu mô hình ngôn ngữ phân thành rất nhiều nhánh. ChatGPT xuất hiện, chứng minh hiệu quả.

## Slide 25 — Bên trong LLM
PHẦN 03  
Bên trong LLM: từ vòng lặp đoán token đến giới hạn của model

## Slide 26 — Bản đồ chặng của buổi sáng
Bên trong LLM — bản đồ 5 chặng của buổi sáng. Một cỗ máy đoán token.

## Slide 27 — LLM là gì?
LLM là gì? — một bộ não nền, không phải một chatbot.

## Slide 28 — Đầu ra của Transformer
Bên trong Transformer: đầu ra luôn là một phân bố xác suất.

## Slide 29 — Vòng lặp sinh văn bản
Sinh văn bản = đoán → nối vào câu → đoán tiếp.

## Slide 30 — Token là gì?
Token: model không đọc "từ", model đọc mảnh chữ.

## Slide 31 — Context
Context: bàn làm việc có hạn của model.

## Slide 32 — Attention
Attention: mỗi từ được “nhìn sang” những từ quan trọng khác.

## Slide 33 — Minh họa về attention
Minh họa khái niệm: token "nó" cần "chú ý" tới token nào để hiểu đúng nghĩa.

## Slide 34 — Nhìn lân cận hay nhìn toàn cảnh?
Nhìn lân cận hay nhìn toàn cảnh? [[Attention]] cải thiện khả năng hiểu ngữ cảnh.

## Slide 35 — Multi-head attention
Multi-head: cùng một câu, nhiều con mắt chuyên môn nhìn song song.

## Slide 36 — Cách sử dụng hiệu quả Attention
1. Đặt điều quan trọng đầu – cuối.  
2. Giữ bàn làm việc sạch.  
3. Cho tra sổ thay vì bắt nhớ.  

## Slide 37 — Cuộc cách mạng mô hình
2020 — GPT-3  
2026 — Kimi K3. Luật chơi 2020–2024.

## Slide 38 — Các bước tạo ra LLM
LLM được tạo ra như thế nào? — đọc nhiều, được chỉ, được uốn nắn, luyện đề.

## Slide 39 — Quy trình RLHF
RLHF: ba bước uốn cỗ máy đoán token thành trợ lý biết nghe lời.

## Slide 40 — Câu hỏi về khả năng của LLM
LLM có thực sự “hiểu” — hay chỉ là vẹt thống kê?

## Slide 41 — Thí nghiệm Othello-GPT
Đầu vào duy nhất: chuỗi token biên bản ván cờ.

## Slide 42 — Mô hình thế giới bên trong
Muốn đi hợp lệ, nó buộc phải tự dựng lại bàn cờ trong đầu.

## Slide 43 — Que thử đọc được bàn cờ
1. Que thử đọc được trạng thái từng ô.  
2. Lật một quân trong "đầu" nó → nước đi đổi theo.

## Slide 44 — Giới hạn của LLM
Bong bóng thời gian và bàn làm việc có hạn.

## Slide 45 — Ví dụ về model
Model không chỉ mô hình hóa thế giới — nó mô hình hóa cả BẠN.  

## Slide 46 — Các kiểu kết nối với LLM
Bốn cách chạm vào LLM: tiện bao nhiêu, kiểm soát bấy nhiêu.

## Slide 47 — Nghịch để tin
Mở Transformer Explainer— tìm hiểu LLM.

## Slide 48 — Từ LLM đến AI Agent
PHẦN 04  
Từ LLM đến AI Agent: đặt bộ não vào vòng làm việc có mục tiêu và hành động.

## Slide 49 — Bài toán ví dụ về AI Agent
Giải bài toán phức tạp với cách tư duy từng bước — Chain-of-Thought.

## Slide 50 — Cấu trúc của LLM
LLM đứng một mình chưa làm được gì nhiều — cần hệ thống bao quanh.

## Slide 51 — Từ LLM đến agent
Từ LLM đến agent: bốn mức độ — mỗi bậc thêm một năng lực.

## Slide 52 — Giải phẫu một agent
Giải phẫu một agent: 5 bộ phận là một vòng lặp.

## Slide 53 — Voyager
Voyager: agent tự xây thư viện kỹ năng, rồi sống bằng tái dùng.

## Slide 54 — Landscape model hôm nay
PHẦN 05  
Landscape: model hôm nay.

## Slide 55 — Tốc độ ra model
2022 đến nay: tốc độ ra model tăng chóng mặt.

## Slide 56 — Giá rơi và năng lực hội tụ
Cùng một mức năng lực, giá rơi khoảng 10 lần mỗi năm.

## Slide 57 — Hệ thống biết hành động
Từ model đơn lẻ sang hệ thống biết hành động — là sự kiện nổi bật hiện nay.

## Slide 58 — Giới hạn bẩm sinh của model
33% → ~81% chỉ trong 20 tháng — và sắp chạm trần bão hòa.

## Slide 59 — Xu hướng model
Cái gì ĐI LÊN và cái gì CHẠM TRẦN.

## Slide 60 — Lịch sử phát triển mô hình
Claude Fable 5 — mạnh nhất nhưng bị khóa.

## Slide 61 — Chọn model
Chọn model theo TẦNG, không chọn theo tên.

## Slide 62 — Các trục làm model “giỏi hơn”
Ba trục làm model “giỏi hơn” — tham số chỉ là một trong ba.

## Slide 63 — Token có giá
Token có giá: vé vào rẻ, vé ra đắt gấp 3–5 lần.

## Slide 64 — Prompt dài = hóa đơn dài
Prompt dài = hóa đơn dài — mọi thứ cộng dồn mỗi lần gọi.

## Slide 65 — Nhiều token hơn
Nhiều token hơn = vừa chậm hơn, vừa đắt hơn.

## Slide 66 — Hệ quả khi chọn model
Cùng một prompt — ba model, ba phong cách trả lời.

## Slide 67 — Tính năng của model
Model học vẹt đường tắt — không tất cả đều thông minh.

## Slide 68 — Gọi API lần đầu
PHẦN 07  
Gọi API lần đầu — điều khiển vòng next-token từ xa.

## Slide 69 — Cấu trúc một prompt
Giải phẫu một prompt: bốn lớp xếp chồng.

## Slide 70 — Cấu trúc một API call
Giải phẫu một API call: gói thư gửi và gói thư về.

## Slide 71 — Chọn từ trong model
Hai núm vặn chọn từ: temperature & top_p.

## Slide 72 — Tổng kết buổi học
PHẦN 08  
Tổng kết — những ý để mang về.

## Slide 73 — Câu hỏi đầu ngày
TRẢ LỜI CÂU HỎI ĐẦU NGÀY: "Bên trong AI đang làm gì?"
— một vòng lặp đoán token, được nuôi bằng dữ liệu.

## Slide 74 — Xem & đọc thêm
Appendix — xem & đọc thêm sau buổi học.

## Khái niệm chính
- [[LLM]]: Mô hình ngôn ngữ lớn, học cách đoán mảnh chữ tiếp theo trong ngữ cảnh.
- [[Machine Learning]]: Học từ dữ liệu thay vì viết luật tay.
- [[Token]]: Mảnh nhỏ mà model xử lý trong văn bản.
- [[Attention]]: Cơ chế cho phép model tập trung vào các từ quan trọng trong ngữ cảnh.
- [[Deep Learning]]: Mạng nơ-ron nhiều tầng tự học đặc trưng từ dữ liệu.
```
