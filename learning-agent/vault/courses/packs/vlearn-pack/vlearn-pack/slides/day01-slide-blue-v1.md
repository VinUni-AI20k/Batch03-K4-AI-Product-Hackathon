---
course: packs
generated: '2026-07-30T10:31:21+00:00'
lang: vi
lesson: day01-slide-blue-v1
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/slides/day01-slide-blue-v1.md
source_hash: sha256:b64158e95569fb34644736aa88f3674464217a09fc4ebb9d078d7ea5115ea790
type: lesson-note
---

## Slide 1 — AI IN ACTION - Day 1
AI & LLM Foundation  
Bạn đang dùng AI mỗi ngày — nhưng thực sự bên trong nó đang làm gì?  
Instructor: Mai Anh Nguyen (Blue)

## Slide 2 — Giới thiệu giảng viên
Mai Anh Nguyen (Blue)  
Generalist Product Builder  
Linkedin | Facebook  
**Instructor**  
- 2026: FPT Long Châu (PM · Healthcare Product)  
- 2025: Thongtincuuho.org (Co-founder)  
- 2025: FPT Software AI Center (PM · AI Agent)  
- 2021 - 2025: Xantus (PM · On-chain Analytics, AI Agent)  
- 2016 - 2021: DYNO, Kalapa (PM · OCR, eKYC, Credit Scoring)

## Slide 3 — Agenda
AI IN ACTION - Day 1  
- Bức tranh AI & các tầng của AI  
- Lịch sử AI 70 năm  
- Bên trong LLM: cơ chế vận hành  
- Từ LLM đến [[AI Agent]]  
- Landscape: model hôm nay & cuộc đua hiện tại  
- Chọn model & chi phí token  
- Gọi API lần đầu  
- Tổng kết — những ý để mang về  
AI & LLM Foundation  
Từ "nghe AI" đến "gọi AI" trong một ngày

## Slide 4 — Mục tiêu khóa học
Cuối ngày này, mỗi bạn sẽ ra về với 4 thứ:  
1. Hiểu được cách [[LLM]] hoạt động — bằng trực giác, không cần công thức  
2. Nắm được token, context, chi phí, độ trễ liên hệ với nhau ra sao  
3. Gọi được lần gọi API đầu tiên — và hiểu cấu trúc của một lần gọi model  
4. Build được một [[chatbot]] dòng lệnh đơn giản có streaming — sản phẩm của chính bạn  
Hôm nay mình đi từ "nghe AI" đến "gọi AI". Không cần nền toán. Chỉ cần tò mò và một chiếc máy tính.

## Slide 5 — PHẦN 01: Bức tranh AI
Bức tranh AI tổng thể gồm [[AI]], [[Machine Learning]], [[LLM]] nằm ở đâu trong một hệ thống chung?

## Slide 6 — Cấu trúc AI
- [[AI]]: hệ thống có yếu tố "thông minh".  
- [[Machine Learning]]: học từ dữ liệu thay vì viết luật tay.  
- [[Deep Learning]]: mạng nơ-ron nhiều tầng tự học.  
- [[Generative AI]]: sinh nội dung mới: văn bản, ảnh, code.  
- [[LLM]]: model nền chuyên ngôn ngữ, hiện đang là tâm điểm.  
LLM không phải toàn bộ AI — nhưng nó là tầng nền của rất nhiều trải nghiệm AI bạn dùng hôm nay.

## Slide 7 — Các nhóm AI chính
1. **Discriminative AI**: Phân loại, dự đoán (lọc spam, phát hiện gian lận).  
2. **Generative AI**: Sinh ra thứ mới (ChatGPT, Claude).  
3. **Agentic AI**: Tự lập kế hoạch, dùng công cụ, hành động.  
LLM đóng vai trò động lực cho cả Generative lẫn Agentic AI — hành trình khóa học sẽ từ [[LLM]] Foundation → Agent → Multi-Agent → Deploy → Evaluate.

## Slide 8 — PHẦN 02: Lịch sử AI
Lịch sử AI 70 năm trải qua nhiều giai đoạn thách thức và đổi mới.

## Slide 9 — Lịch sử AI
- Khai sinh, lời hứa đầu tiên  
- Hai lần mùa đông, những chạm trần của phương pháp tiếp cận  
- Từ model đơn lẻ sang hệ thống có khả năng hành động như agent

## Slide 10 — 1956: Dartmouth Workshop
"Artificial Intelligence" ra đời, với ý tưởng rằng nếu trí thông minh có thể được mô tả rõ ràng, máy móc cũng có thể mô phỏng lại nó.

## Slide 11 — 1969: Perceptrons
Các hướng đi gặp khó khăn: phương pháp symbolic và phương pháp Perceptron đều bị hạn chế do thế giới quá đa dạng.

## Slide 12 — 1973: Báo cáo Lighthill
James Lighthill đánh giá rằng những gì AI đạt được đi quá xa so với kỳ vọng ban đầu, dẫn đến mùa đông AI lần thứ nhất.

## Slide 13 — Bài toán nhỏ
Bài toán nhỏ với ít nhánh có vẻ thông minh, nhưng trong thực tế, quá nhiều nhánh có thể khiến AI không thể xử lý.

## Slide 14 — 1980: Hệ chuyên gia
Đổi hướng chiến lược: nếu AI chỉ giải quyết tốt một loại bài toán chuyên môn hẹp thì sao? Sự ra đời của [[expert systems]].

## Slide 15 — Mùa đông AI lần 2
Những khó khăn của hệ chuyên gia dẫn đến một mùa đông AI lần thứ hai.

## Slide 16 — Sự ra đời của Deep Learning
Câu hỏi đổi mới: nếu không thể viết hết tri thức vào máy, có thể để máy tự học từ dữ liệu không?

## Slide 17 — 2009: Fei-Fei Li và ImageNet
Fei-Fei Li xây dựng bộ dữ liệu ImageNet, mở ra cuộc cách mạng của dữ liệu, cho phép học tốt hơn từ nhiều hình ảnh.

## Slide 18 — Deep Learning vs Machine Learning
Deep Learning khác Machine Learning ở điểm không cần con người thiết kế đặc trưng bằng tay, mà tự học từ dữ liệu.

## Slide 19 — 2012: AlexNet
AlexNet chiến thắng tại ImageNet, cho thấy sức mạnh của mạng nơ-ron sâu trong việc xử lý hình ảnh.

## Slide 20 — 2016: AlphaGo
AlphaGo học từ các trận đấu người và tự chơi để cải thiện chiến lược của mình.

## Slide 21 — Nút thắt của RNN
Mô hình RNN có khó khăn trong việc ghi nhớ thông tin khi câu càng dài, dẫn đến việc cần cải tiến.

## Slide 22 — 2017: Transformer
Transformer cho phép mô hình hiểu ngôn ngữ theo cách linh hoạt hơn và trở thành nền tảng cho nhiều model như GPT, BERT.

## Slide 23 — 2022: ChatGPT
ChatGPT xuất hiện, giúp người dùng phổ thông tiếp cận một mô hình ngôn ngữ mạnh mẽ qua giao diện đơn giản.

## Slide 24 — Xu hướng trước ChatGPT
Trước khi bùng nổ, nghiên cứu ngôn ngữ phân thành nhiều nhánh, nhưng ChatGPT đã tập trung ngành lại.

## Slide 25 — PHẦN 03: Bên trong LLM
Bén ngoài LLM: vòng lặp đoán token, các cơ chế hoạt động của model.

## Slide 26 — Bản đồ 5 chặng của buổi sáng
Cỗ máy đoán token.  
LLM là gì, xác suất, vòng lặp, token, context.  
Attention – cách mà model nhìn ngữ cảnh.  
Được tạo ra và huấn luyện.  
Model có thật sự hiểu không?  
Giới hạn và cách chạm vào.

## Slide 27 — LLM là gì?
LLM (Large Language Model) là mô hình ngôn ngữ lớn, học để đoán từ tiếp theo trong ngữ cảnh.

## Slide 28 — Đầu ra của Transformer
Đầu ra luôn là phân bố xác suất cho tất cả các từ trong từ vựng.

## Slide 29 — Mô hình sinh văn bản
Mỗi token mới được thêm vào ngữ cảnh, tạo nên vòng lặp predict → append → rerun.

## Slide 30 — Token
Model phân tích văn bản thành các [[token]], có thể là các từ hoặc các đoạn nhỏ hơn.

## Slide 31 — Context
Context là lượng chữ mà model có thể xem xét trong một lần trả lời.

## Slide 32 — Attention
Mỗi từ chú ý tới những từ quan trọng khác để hiểu ngữ cảnh tốt hơn, thay vì đọc tuần tự.

## Slide 33 — Minh họa Attention
Có sự tương tác phối hợp giữa các token trong câu để hiểu nghĩa chính xác.

## Slide 34 — Nhìn lân cận hay nhìn toàn cảnh?
Attention cho phép mọi từ đều có thể nhìn lại toàn bộ ngữ cảnh, chứ không chỉ những từ liền kề.

## Slide 35 — Multi-head Attention
Model có nhiều “con mắt” chuyên môn nhìn vào cùng một câu để có sự hiểu biết đầy đủ hơn về câu.

## Slide 36 — Chiến lược sử dụng attention
Các chiến lược sử dụng attention để tối ưu hóa việc quản lý context và sự chú ý của model.

## Slide 37 — Tăng trưởng mô hình
Những thay đổi trong các mô hình từ năm 2020 đến 2026 và sự chuyển mình của [[MoE]].

## Slide 38 — LLM được tạo ra như thế nào?
Quá trình đào tạo LLM qua các bước: Pre-training, SFT, RLHF/DPO.

## Slide 39 — RLHF
Quá trình để biến cỗ máy đoán token thành trợ lý thông minh qua phản hồi của con người.

## Slide 40 — Mô hình hiểu?
Một câu hỏi gây tranh cãi về việc liệu LLM có thật sự "hiểu" hay chỉ là "học vẹt".

## Slide 41 — Thí nghiệm Othello-GPT
Thí nghiệm cho thấy mô hình tự xây dựng bàn cờ trong đầu để chơi game.

## Slide 42 — Giải quyết vấn đề
Để đưa ra quyết định hợp lệ, mô hình cần tự xây dựng bản đồ trong đầu.

## Slide 43 — Kiểm chứng
Sử dụng que thử để kiểm tra khả năng của model trong việc mô hình hóa thế giới xung quanh.

## Slide 44 — Giới hạn của model
Model có giới hạn bẩm sinh và phải kiểm soát context để làm việc hiệu quả.

## Slide 45 — Những vấn đề học vẹt
LLM học những suy luận ngẫu nhiên và có thể gặp khó khăn trong các đoán đúng.

## Slide 46 — Mô hình hóa con người
LLM tự xây dựng hồ sơ về người dùng dựa trên cách họ viết và tương tác.

## Slide 47 — Quyền truy cập vào LLM
Bốn cách chạm vào LLM và mức độ kiểm soát mà bạn có thể có với từng cách tiếp cận.

## Slide 48 — Thí nghiệm với GPT-2
Thực hành tương tác trực tiếp với mô hình để hiểu sâu hơn về cách hoạt động của nó.

## Slide 49 — PHẦN 04: Từ LLM đến AI Agent
Mở rộng LLM thành các AI Agents có khả năng thực hiện mục tiêu và hành động.

## Slide 50 — Bài toán
Bài toán đưa ra ví dụ cho thấy sự khác biệt giữa quy trình giải quyết vấn đề với và không có giấy nháp.

## Slide 51 — Từ LLM đến agent
Lợi ích và cách thức bổ sung các công cụ và bước lập kế hoạch vào LLM để tạo ra agent hiệu quả.

## Slide 52 — Bốn mức độ của agent
Mô hình trạng thái của AI Agents cho thấy sự mở rộng năng lực và tính tự chủ.

## Slide 53 — Giải phẫu một agent
Các bộ phận cấu thành của một agent và cách chúng hoạt động cùng nhau.

## Slide 54 — Voyager
Mô hình agent tự xây dựng thư viện kỹ năng và tái sử dụng chúng trong các nhiệm vụ.

## Slide 55 — PHẦN 05: Landscape
Bức tranh tổng quan về các model hiện tại, xu hướng giá và năng lực.

## Slide 56 — Tốc độ ra model
Sự tăng trưởng chóng mặt của các mô hình trong giai đoạn 2022 đến nay.

## Slide 57 — Giá giảm
Giá của các mô hình đã giảm nhiều trong năm qua khi năng lực được cải thiện.

## Slide 58 — Năng lực hội tụ
Sự hội tụ năng lực giữa các model mở và đóng đang dần trở nên rõ ràng.

## Slide 59 — Từ model sang hệ thống
Chuyển từ các model đơn lẻ thành các hệ thống có khả năng hành động.

## Slide 60 — Đạt được benchmark
Khả năng đạt được benchmark cao trong thời gian ngắn đang dần trở nên phổ biến.

## Slide 61 — Xu hướng phát triển
Các công nghệ mới nổi và sự phát triển của mô hình AI trong thời gian tới.

## Slide 62 — Các mô hình hàng đầu
Nêu một số model hàng đầu hiện tại và bài học từ từng nhà cung cấp.

## Slide 63 — Multimodal
Khái niệm token không chỉ giới hạn ở văn bản mà còn bao gồm hình ảnh và âm thanh.

## Slide 64 — PHẦN 06: Chọn model & chi phí token
Cách chọn model phù hợp và quản lý chi phí token.

## Slide 65 — Chọn model theo tầng
Chọn model phải dựa theo công việc cụ thể thay vì chỉ chú ý đến tên.

## Slide 66 — Ba trục phát triển
Những yếu tố quyết định mô hình "giỏi hơn": quy mô pretraining, post-training và cách kiểm soát test-time.

## Slide 67 — Mixture of Experts
Cách tăng tham số mà không làm tăng chi phí tính toán thông qua mô hình [[MoE]].

## Slide 68 — Chi phí token
Cách tính toán chi phí đầu vào và đầu ra khi sử dụng model.

## Slide 69 — Tối ưu hóa chi phí
Tối ưu hóa chi phí bằng cách cải thiện prompt và context mỗi lần gọi.

## Slide 70 — Token và thời gian
Mối liên hệ giữa số lượng token và độ trễ, chi phí.

## Slide 71 — Phong cách trả lời
Các model có thể đáp ứng các phong cách khác nhau dựa trên cùng một prompt.

## Slide 72 — Lời nhắc về benchmark
Phân tích những vấn đề hiện tại với benchmark và cách chúng có thể ảnh hưởng đến đánh giá mô hình.

## Slide 73 — PHẦN 07: Gọi API lần đầu
Hướng dẫn cách gọi API và điều khiển model từ xa.

## Slide 74 — Quy trình gọi API
Quy trình diễn ra khi gửi một yêu cầu API đến model.

## Slide 75 — Giải phẫu một prompt
Cách cấu trúc một prompt tốt bằng cách sử dụng các lớp xếp chồng.

## Slide 76 — Giải phẫu một API call
Gói thông tin và phản hồi giữa máy bạn và máy chủ cung cấp dịch vụ.

## Slide 77 — Tùy chọn từ
Chọn lựa từ thông qua các tham số như temperature và top_p để điều chỉnh cách mà model tạo ra từ.

## Slide 78 — Chatbot và truyền phát
Sự hoạt động của một chatbot thông qua vòng lặp và cách quản lý context.

## Slide 79 — So sánh OpenAI và Anthropic
Cách gọi API tương đồng giữa các nền tảng, với những điểm khác biệt nhỏ trong cấu trúc.

## Slide 80 — PHẦN 08: Tổng kết
Tóm tắt những điểm chính và ý tưởng mang về từ bài học.

## Slide 81 — Key takeaways
1. LLM là cỗ máy Transformer đoán token tiếp theo từ context — mọi thứ khác là hệ quả.  
2. Từ cỗ máy đoán chữ thành trợ lý: pre-training → SFT → căn chỉnh → luyện đề tự chấm & được nghĩ kỹ.  
3. Model có giới hạn bẩm sinh: bong bóng thời gian, nói chắc như đúng rồi, bàn làm việc có hạn — nên đừng tin benchmark, hãy tự test.  
4. Chọn model theo tầng theo việc, kiểm soát 3 núm: chất lượng — độ trễ — chi phí.  
5. Gọi API là điều khiển một vòng next-token từ xa — kèm một mức quyền truy cập nhất định vào model.

## Slide 82 — Trả lời câu hỏi đầu ngày
"Bên trong AI đang làm gì?"  
— một vòng lặp đoán token, được nuôi bằng dữ liệu, đang chờ bạn điều khiển.

## Slide 83 — Appendix
🎬 Nên xem & chơi trước  
- [3Blue1Brown — Transformers, the tech behind LLMs](https://www.youtube.com/watch?v=wjZofJX0v4M)  
- [3Blue1Brown — Attention in transformers, step-by-step](https://www.youtube.com/watch?v=eMlx5fFNoYc)  
- [Transformer Explainer](https://poloclub.github.io/transformer-explainer)  

## Khái niệm chính
- [[AI]]: Hệ thống có yếu tố "thông minh".
- [[Machine Learning]]: Quá trình học từ dữ liệu thay vì viết luật tay.
- [[LLM]]: Mô hình ngôn ngữ lớn có khả năng xử lý ngôn ngữ tự nhiên.
- [[Generative AI]]: Các mô hình có khả năng sinh nội dung mới.
- [[chatbot]]: ứng dụng dựa trên AI để tương tác với người dùng. 
- [[MoE]]: Kiến trúc sử dụng nhiều chuyên gia trong quá trình xử lý để cải thiện hiệu suất và giảm chi phí.
