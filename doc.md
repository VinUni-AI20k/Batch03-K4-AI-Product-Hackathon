
# TÀI LIỆU DỰ ÁN (PROJECT OVERVIEW)
**Chủ đề:** Xây dựng Trợ lý AI QA (Hỏi đáp) Hỗ trợ Học viên Khóa học "AI Thực Chiến Vingroup - VinUni"  
**Nguồn dữ liệu thực chiến:** Facebook Group "Cộng đồng AI Thực Chiến Vingroup - VinUni" + VLearn Pack (Slide & Transcript bài giảng)  

---

## 🎯 1. Chủ đề tài (Topic Definition)

Trong khuôn khổ khóa học **"AI Thực Chiến Vingroup - VinUni"** (Batch 03), khối lượng kiến thức về trí tuệ nhân tạo, quy trình phát triển sản phẩm (Product Development), và các yêu cầu kỹ thuật (Python, API, GitHub) là rất lớn. 

Dự án này tập trung xây dựng một **AI Agent QA (Trợ lý Hỏi Đáp AI)** chuyên biệt. Hệ thống sử dụng công nghệ RAG (Retrieval-Augmented Generation) kết hợp với 4 Lớp Guardrail (Quy tắc an toàn) để tự động hóa việc tra cứu và giải đáp thắc mắc cho hàng ngàn học viên một cách chính xác, minh bạch, và tuân thủ tuyệt đối quy chế học thuật của Hackathon.

Khác với các AI Chatbot thông thường (như ChatGPT), trợ lý AI của dự án có khả năng:
1. **Kiểm chứng nguồn sự thật (Ground Truth):** Chỉ trả lời dựa trên kho tri thức đã được TA/Mentor (Trợ giảng) xác nhận trên Facebook Group của lớp.
2. **Tuân thủ quy chế học thuật (Vibe-coding Rule):** Kiên quyết từ chối việc "làm hộ bài thi" (như viết full code cho Checkpoint) và thay vào đó là hướng dẫn phương pháp giải quyết vấn đề (Pedagogical approach).

---

## 🚨 2. Nỗi Đau Khách Hàng (Pain Points) Để Giải Quyết

Qua quá trình khai phá dữ liệu (Data Mining) từ hơn 250 bài viết và bình luận trên Facebook Group của khóa học bằng công cụ facebook_post_comment_scraper, nhóm phát triển đã xác định được **3 Pain Points cốt lõi** mà học viên khóa AI Thực Chiến đang gặp phải:

### ❌ Pain Point 1: Thắc mắc kỹ thuật bị trôi bài, thời gian chờ phản hồi quá lâu
- **Thực trạng:** Khi cài đặt môi trường (Python, pip install, requirements.txt) hoặc debug code, học viên thường gặp chung một số lỗi (ví dụ: thiếu thư viện C++ Build Tools trên Windows). 
- **Vấn đề:** Các câu hỏi này lặp đi lặp lại rất nhiều trên Facebook Group. Mentor/TA phải mất từ 1–12 tiếng để vào phản hồi thủ công. Nhiều bài đăng của học viên bị trôi mất, dẫn đến việc họ bị gián đoạn tiến độ thực hành và sinh ra cảm giác chán nản.
- **Giải pháp AI Agent:** Cào (Scrape) sẵn các lời giải đáp chuẩn của TA về lỗi kỹ thuật vào Knowledge Base (Cơ sở tri thức). Khi học viên hỏi, AI sẽ trả về đáp án chuẩn ngay lập tức (dưới 5 giây) kèm link dẫn chứng bài gốc trên Facebook để tạo sự tin tưởng tuyệt đối.

### ❌ Pain Point 2: Nhầm lẫn về mốc thời gian (Logistics & Deadline) của các Batch khác nhau
- **Thực trạng:** Học viên thường tự tìm kiếm tài liệu từ các khóa học trước (Batch 01, Batch 02) và hay thắc mắc về lịch trình nộp bài, thời hạn cứng (Hard Deadline) của Spec.md hay CP4/CP5.
- **Vấn đề:** Trả lời sai deadline hoặc nhầm lịch của Batch cũ sẽ dẫn đến hậu quả nghiêm trọng: học viên nộp trễ và bị trừ điểm hoặc rớt môn.
- **Giải pháp AI Agent:** Áp dụng **Guardrail Lớp ① (Nguồn sự thật - Ground Truth)**. Khi AI phát hiện từ khóa liên quan đến "deadline" hoặc "Batch 01/02", nó sẽ ngay lập tức chặn nội dung ảo giác (hallucination) và đưa ra cảnh báo khẩn cấp màu đỏ về lịch trình chính xác, duy nhất của Batch 03.

### ❌ Pain Point 3: Thiếu định hướng khi hỏi bài, yêu cầu AI "giải bài hộ" vi phạm quy chế
- **Thực trạng:** Trong môi trường áp lực cao của Mini Hackathon, thay vì hỏi cách sửa lỗi (debug), học viên có xu hướng nhờ AI hoặc các bạn khác viết hộ toàn bộ code, hoặc đặt những câu hỏi quá mơ hồ (ví dụ: *"Lỗi Code không chạy, sửa sao?"*).
- **Vấn đề:** 
  - (1) Câu hỏi mơ hồ khiến TA không thể hỗ trợ được ngay mà phải hỏi ngược lại.
  - (2) Việc viết code hộ vi phạm quy tắc liêm chính học thuật (Academic Integrity / Vibe-coding rule).
- **Giải pháp AI Agent:** 
  - Tích hợp **Guardrail Lớp ② (Ambiguity - Mơ hồ):** Nếu câu hỏi cộc lốc, AI sẽ tự động yêu cầu học viên cung cấp hệ điều hành (Windows/Mac) và mã lỗi cụ thể (Stacktrace).
  - Tích hợp **Guardrail Lớp ③ (Authority - Ngoài thẩm quyền):** Nếu phát hiện hành vi nhờ viết hộ code bài tập lớn (Checkpoint 3, 4, 5), AI Agent sẽ từ chối thẳng thắn, giải thích luật Vibe-coding và hướng dẫn quy trình tư duy phân tách bài toán một cách sư phạm.

---

## 🏆 3. Tác Động (Impact) Kỳ Vọng

- **Tiết kiệm thời gian (Time-to-resolution):** Giảm thời gian chờ đợi phản hồi của học viên từ **trung bình 45 phút xuống còn dưới 5 giây**.
- **Tối ưu nguồn lực Mentor/TA:** Giảm **80%** khối lượng công việc phải trả lời lặp đi lặp lại các câu hỏi cài đặt kỹ thuật và logistics trên Group Facebook.
- **Tuân thủ & Chuẩn hóa:** Đảm bảo 100% học viên nhận được thông tin chuẩn xác, nhất quán về khái niệm (Rubric 100 điểm, HAX/PAIR, Cost of Error) và duy trì sự công bằng tuyệt đối trong môi trường thi đấu Hackathon.( các paint poitn như là muốn tìm kiếm thông tin khu vực trường, những vấn đề cần lưu ý, khóa học đem lại những gì) . Vì mình là người mới hoàn toàn không quen địa chỉ khu vực ở đây gì cả 

Nếu đối tượng người dùng là học viên mới tham gia khóa AI Thực Chiến VinUni, thì 3 pain point hiện tại của bạn đang nghiêng nhiều về vấn đề kỹ thuật. Tuy nhiên, trước khi học viên bắt đầu học, họ còn gặp rất nhiều khó khăn về thông tin, logistics và định hướng.

Mình đề xuất thay thế hoặc bổ sung các pain point sau để sát với thực tế hơn.

🚨 Pain Point 1: Khó tìm kiếm thông tin về khuôn viên và cơ sở vật chất của VinUni
❌ Thực trạng
Đa số học viên đến từ nhiều tỉnh thành khác nhau và lần đầu tiên học tại VinUni. Họ không quen với khuôn viên trường nên thường không biết:

Phòng học nằm ở tòa nhà nào.

Căng tin ở đâu.

Bãi gửi xe.

Khu vực check-in.

Nhà vệ sinh.

Máy bán nước.

Phòng tự học.

Thư viện.

Các lối đi giữa các tòa.

Những câu hỏi này xuất hiện rất nhiều trong Facebook Group hoặc Discord.

❌ Vấn đề
Mất thời gian hỏi đi hỏi lại.

Đến muộn vì không tìm được phòng học.

Không biết nơi ăn uống hoặc nghỉ ngơi.

Mentor/TA phải trả lời nhiều câu hỏi giống nhau.

✅ Giải pháp AI Agent
AI Agent xây dựng một Campus Knowledge Base gồm:

Bản đồ khuôn viên.

Danh sách các tòa nhà.

Vị trí phòng học.

Căng tin.

Bãi gửi xe.

Thư viện.

Khu vực học nhóm.

Người học chỉ cần hỏi:

"Phòng học hôm nay ở đâu?"

hoặc

"Căng tin VinUni ở tầng mấy?"

AI sẽ trả lời ngay kèm bản đồ hoặc hướng dẫn đường đi.

🚨 Pain Point 2: Không nắm rõ quy trình và những lưu ý khi tham gia khóa học
❌ Thực trạng
Học viên mới thường không biết:

Cần mang theo gì.

Điểm danh như thế nào.

Cách lấy vé ăn.

Cách nhận tài khoản.

Quy định sử dụng AI.

Quy định Hackathon.

Deadline.

Cách nộp bài.

Link GitHub.

Link Discord.

Link VLearn.

Mentor phụ trách là ai.

❌ Vấn đề
Thông tin nằm rải rác trên:

Facebook

Discord

Outlook

Slide

README

PDF

Email

Người học rất dễ bỏ sót thông tin quan trọng.

✅ Giải pháp AI Agent
AI Agent tổng hợp toàn bộ quy định thành một kho tri thức duy nhất.

Ví dụ người học hỏi:

"Hôm nay cần mang gì?"

AI sẽ trả lời:

Laptop

Sạc

Thẻ sinh viên

Vé ăn

Link tài liệu

Những lưu ý trong ngày

🚨 Pain Point 3: Không biết khóa học mang lại giá trị gì và nên học như thế nào
❌ Thực trạng
Rất nhiều học viên mới hỏi:

Khóa học này học những gì?

Có khó không?

Sau khóa học sẽ làm được gì?

Có cần biết Python trước không?

Có học AI từ đầu được không?

Mini Hackathon là gì?

Lộ trình học như thế nào?

❌ Vấn đề
Người học thiếu định hướng ngay từ đầu nên:

Học lan man.

Không biết mục tiêu từng giai đoạn.

Không hiểu mối liên hệ giữa các module.

Dễ bỏ cuộc khi gặp bài khó.

✅ Giải pháp AI Agent
AI Agent đóng vai trò như một cố vấn học tập.

Có thể trả lời:

Lộ trình toàn khóa.

Kiến thức từng tuần.

Mục tiêu mỗi checkpoint.

Kỹ năng đạt được sau khóa học.

Kiến thức nền cần chuẩn bị.

Các tài nguyên học bổ sung.

🏆 Impact kỳ vọng
Hiện tại	Sau khi có AI Agent
Mất nhiều thời gian hỏi thông tin cơ bản về trường và lớp học	Tra cứu trong vài giây
Mentor/TA phải trả lời lặp lại các câu hỏi logistics	Giảm đáng kể số lượng câu hỏi lặp lại
Người học khó tìm thông tin do phân tán trên nhiều nền tảng	Có một điểm truy cập thống nhất cho mọi thông tin
Học viên mới thiếu định hướng khi bắt đầu khóa học	AI hướng dẫn lộ trình, mục tiêu và quy định ngay từ đầu
Người học dễ bỏ sót deadline hoặc quy định quan trọng	AI cung cấp thông tin chính xác, nhất quán và có nguồn tham chiếu
Gợi ý
Nếu đây là đề tài tham gia Hackathon hoặc môn học AI Product, bạn có thể nhóm các pain point thành 3 nhóm lớn để rõ ràng hơn:

Information Discovery – Khó tìm kiếm thông tin (khuôn viên trường, tài liệu, lịch học, deadline, quy định).

Learning Support – Thiếu định hướng và hỗ trợ trong quá trình học (lộ trình, kiến thức, giải đáp kỹ thuật).

Academic Integrity & Safe AI – Đảm bảo AI hỗ trợ đúng quy chế học thuật (không làm hộ bài, chỉ hướng dẫn phương pháp và trả lời dựa trên nguồn đã xác thực).

Cách phân nhóm này giúp bài toán có tính sản phẩm rõ ràng hơn: không chỉ giải quyết lỗi kỹ thuật mà còn hỗ trợ toàn bộ hành trình của một học viên mới từ khi tham gia khóa học đến khi hoàn thành chương trình.


