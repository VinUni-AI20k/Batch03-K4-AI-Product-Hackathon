# Reflection Cá Nhân — Đào Tùng Dương (AI Spec & Data Mining / Backend Support)

## 1. Vai trò & Nhiệm vụ đảm nhận
- **Họ và tên:** Đào Tùng Dương
- **Mã học viên / Lớp:** 2A2026001402 · Lớp AI Thực Chiến K4 VinUni
- **Nhiệm vụ trong dự án:**
  - **Data Mining & bằng chứng (Evidence B):** Khai phá tệp 1.261 chatlog thực tế của học viên K4 (`chat_history_anonymized_for_hackathon.csv`), phân tích 178 lượt hỏi tóm tắt slide và 37 lượt downvote để tìm ra nỗi đau cốt lõi.
  - **Thiết kế Golden Set:** Biên soạn 20 test cases trong [eval/golden_set.json](file:///Users/hoangquan/Desktop/K4-hackathon-sharkb-E403/eval/golden_set.json) phủ đủ 4 lớp chỗ khó (Hallucination, Ambiguity, Out of scope, Domain specific).
  - **Xây dựng Prompt System & Guardrails:** Soạn thảo bộ prompt [rag_prompts.py](file:///Users/hoangquan/Desktop/K4-hackathon-sharkb-E403/codebase/backend/prompts/rag_prompts.py) hướng dẫn AI Tutor từ chối lịch sự theo chuẩn HAX G10.

## 2. Các công cụ AI đã sử dụng
- **Python Pandas & Antigravity Agent:** Dùng script Python tự động thống kê tần suất từ khóa trong chatlog và nhờ AI Agent gợi ý câu hỏi test case khó cho bộ Golden set.

## 3. Bài học quan trọng từ một Case Fail của nhóm
- **Sự cố thực tế:** Ban đầu khi thử nghiệm Prompt từ chối Guardrail, AI bị cứng nhắc: Khi sinh viên hỏi *"bây giờ là mấy giờ"* hoặc *"lịch thi ở đâu"*, AI lập tức trả về câu trả lời máy móc *"Tôi là AI Tutor, tôi không có thông tin này"*, khiến sinh viên cảm thấy bị đuổi khéo và thả downvote.
- **Bài học rút ra:** Áp dụng nguyên tắc **HAX G10 (Graceful Failure & Redirection)**: Từ chối cần đi kèm với sự lịch sự và hướng dẫn hành động tiếp theo (ví dụ: *"Dạ, câu hỏi này nằm ngoài phạm vi bài học. Bạn vui lòng kiểm tra thông báo trên kênh Discord hoặc hỏi TA nhé!"*). Nhờ điều chỉnh này, điểm đánh giá trải nghiệm người dùng tăng lên đáng kể.
