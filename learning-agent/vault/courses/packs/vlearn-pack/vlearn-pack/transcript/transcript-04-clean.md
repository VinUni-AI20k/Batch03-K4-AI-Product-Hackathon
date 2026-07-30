---
course: packs
generated: '2026-07-30T10:22:44+00:00'
lang: vi
lesson: transcript-04-clean
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs/vlearn-pack/vlearn-pack/transcript/transcript-04-clean.md
source_hash: sha256:92ae162746e1ed015c628ef8b904ef0f8e49222e930e78b1f0159139e9f88526
type: lesson-note
---

## Slide 1 — Chào lớp và giới thiệu giảng viên
**[T04-001]** Xin chào mọi người, mình là Trung. Mình rất ấn tượng với những bạn dũng cảm nghỉ việc để tham gia khóa học này. 
**[T04-002]** Lớp chúng ta có sự kết hợp giữa sinh viên năm cuối và những người đã đi làm, đây là tổ hợp lý tưởng để học hỏi lẫn nhau.
**[T04-003]** Ngày hôm nay, chúng ta sẽ bàn về nền tảng của AI và các mô hình ngôn ngữ lớn (LLM), cùng tìm hiểu cách mà chúng vận hành.
**[T04-004]** Mình có khoảng 10 năm kinh nghiệm trong lĩnh vực công nghệ và AI, với nhiều dự án từ blockchain đến tài chính.
**[T04-005]** Mình đã tham gia vào nhiều dự án AI, bao gồm mô hình chống gian lận và ứng dụng AI trong blockchain.
**[T04-006]** Gần đây, mình đã làm việc về AI Center tại FPT Software và phát triển sản phẩm AI cho lĩnh vực Healthcare.
**[T04-007]** Mình cũng tham gia vào một dự án cứu hộ mà đã thể hiện được sức mạnh của công nghệ trong các tình huống khẩn cấp.

## Slide 2 — Nội dung ngày học và bức tranh tổng quan về AI
**[T04-013]** Chúng ta sẽ điểm qua một bức tranh tổng quan về AI, xem xét lịch sử từ năm 1950 đến nay, cơ chế vận hành của LLM, và làm quen với API.
**[T04-014]** Cuối buổi, chúng ta sẽ có một quiz ngắn. Ngày mai, có lab đầu tiên để cài đặt môi trường và gọi API.

## Slide 3 — AI và các thuật ngữ
**[T04-015]** AI (trí tuệ nhân tạo) bao gồm nhiều khái niệm như [[machine-learning]], [[deep-learning]], và [[generative-ai]]. Các thuật ngữ này tạo thành một cấu trúc, với AI là lớp bên ngoài và [[generative-ai]] là lớp bên trong, hiện diện trong các mô hình như ChatGPT.

## Slide 4 — Lịch sử AI: Turing test và hai mùa đông
**[T04-016]** AI đã tồn tại khoảng 70 năm, khởi đầu từ các ý tưởng của [[Alan-Turing]].
**[T04-018]** Bài kiểm tra Turing là để xác định trí thông minh của máy tính.
**[T04-022]** AI đã trải qua hai giai đoạn lịch sử gọi là “mùa đông”, thời điểm mất niềm tin vào khả năng của AI.
**[T04-024]** Khái niệm [[symbolic-ai]] đã được giới thiệu trong những năm 1956 nhưng gặp phải vấn đề giới hạn.

## Slide 5 — Deep learning và sức mạnh của dữ liệu
**[T04-030]** [[Deep-learning]] là mô hình thần kinh gan sâu, giúp máy tự học từ dữ liệu mà không cần định nghĩa trước.
**[T04-031]** Bộ dữ liệu đầu tiên do [[Fei-Fei Li]] phát triển đã tạo đà cho deep learning.

## Slide 6 — AlphaGo và kiến trúc Transformer
**[T04-034]** AlphaGo đã đánh bại kỳ thủ cờ vây Lee Sedol, đánh dấu một bước ngoặt trong AI.
**[T04-038]** Kiến trúc [[transformer]] được giới thiệu trong bài báo "Attention Is All You Need" của Google vào năm 2017.

## Slide 7 — Cuộc đua AI sau ChatGPT
**[T04-041]** ChatGPT ra đời vào năm 2022 đã dẫn đến sự bùng nổ trong ngành AI, khiến nhiều công ty phải thay đổi ngay lập tức.
**[T04-042]** Nhiều hướng nghiên cứu mới bắt đầu phát triển sau thành công của ChatGPT.

## Slide 8 — Mổ xẻ mô hình ngôn ngữ lớn: dự đoán token và context
**[T04-046]** [[Mô-hình-ngôn-ngữ-lớn]] dự đoán token tiếp theo dựa vào khả năng thống kê.
**[T04-049]** Token là đơn vị ngôn ngữ của máy; mô hình xử lý thông tin thông qua [[context]] — bối cảnh của văn bản.

## Slide 9 — Attention, multi-head và bài học quản lý context
**[T04-053]** Cơ chế [[attention]] trong mô hình transformer giúp chú ý đến các phần quan trọng của văn bản.
**[T04-056]** Multi-head attention cho phép mô hình nhận diện nhiều đặc tính và quy luật khác nhau trong văn bản.

## Slide 10 — Tham số, RLHF và ngành gán nhãn dữ liệu
**[T04-058]** Các tham số (parameters) ảnh hưởng lớn đến khả năng của mô hình, và tăng cường khả năng học của mô hình qua [[RLHF]] — học tăng cường với sự tham gia của con người.
**[T04-060]** Ngành [[gán-nhãn-dữ-liệu]] cần thiết để huấn luyện các mô hình AI.

## Slide 11 — Thí nghiệm bàn cờ, giới hạn kiến thức và các mức tiếp cận mô hình
**[T04-064]** Một thí nghiệm cho thấy liệu mô hình có kết nối thông tin để dự đoán hay không — có thể xây dựng mô hình bên trong.
**[T04-067]** Các mô hình LLM không chỉ dựa vào dữ liệu cũ, chúng cần phải kết hợp thêm công cụ mới để cập nhật thông tin.

## Slide 12 — Cơ bản về gọi API mô hình LLM
**[T04-087]** Khi gọi API, bạn cần hiểu các cấu phần như [[system-prompt]], [[user-input]], và những thông số ảnh hưởng đến chi phí.

## Slide 13 — Tóm tắt buổi học
**[T04-091]** Hôm nay, chúng ta đã tìm hiểu về những khái niệm căn bản của AI và các mô hình LLM, bao gồm cách mà chúng hoạt động và sự quan trọng của việc đánh giá sản phẩm trong thực tế.

## Khái niệm chính
- [[ai]]: Hệ thống có trí thông minh mô phỏng trí tuệ con người.
- [[machine-learning]]: Kỹ thuật cho phép máy tính học từ dữ liệu mà không cần lập trình cụ thể.
- [[deep-learning]]: Phương pháp học sâu giúp mô hình tự học từ dữ liệu thông qua các mạng neuron.
- [[generative-ai]]: Công nghệ cho phép sản sinh nội dung mới từ dữ liệu đầu vào.
- [[symbolic-ai]]: Dạy máy bằng luật, phương pháp học đầu tiên của AI.
- [[transformer]]: Kiến trúc nổi bật trong xử lý ngôn ngữ tự nhiên với cơ chế attention.
- [[rlhf]]: Kỹ thuật học mà có sự tham gia của con người để cải thiện mô hình.
- [[gán-nhãn-dữ-liệu]]: Ngành giúp đánh giá và chuẩn bị dữ liệu cho việc huấn luyện mô hình AI.
- [[context]]: Bối cảnh thông tin mà mô hình tiếp nhận để xử lý các yêu cầu.
