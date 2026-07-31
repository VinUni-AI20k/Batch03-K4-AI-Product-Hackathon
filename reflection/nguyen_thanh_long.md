# Reflection Cá Nhân — Nguyễn Thành Long (Team Lead / Tester / Co-Developer)

## 1. Vai trò & Nhiệm vụ đảm nhận
- **Họ và tên:** Nguyễn Thành Long
- **Mã học viên / Lớp:** 2A202601536 · Lớp AI Thực Chiến K4 VinUni
- **Nhiệm vụ trong dự án:**
  - **Quản lý dự án & Team Lead:** Phân công công việc, giữ nhịp tiến độ theo 6 mốc Checkpoint (CP1 đến CP6).
  - **Soạn thảo AI Spec & Tài liệu:** Xây dựng file [spec.md](file:///Users/hoangquan/Desktop/K4-hackathon-sharkb-E403/spec.md) theo mẫu 03-template-ai-spec, xác định 4 lớp chỗ khó (① Nguồn sự thật, ② Mơ hồ, ③ Ngoài phạm vi, ④ Đặc thù domain).
  - **Xây dựng & Chạy bộ kiểm thử (Evaluation):** Thiết kế 20 test cases trong [eval/golden_set.json](file:///Users/hoangquan/Desktop/K4-hackathon-sharkb-E403/eval/golden_set.json), lập trình script [eval/run_eval.py](file:///Users/hoangquan/Desktop/K4-hackathon-sharkb-E403/eval/run_eval.py) và đo đạc Pass Rate (đạt 80% - 100%).
  - **Khảo sát User Validation:** Thu thập và ghi nhận phản hồi từ 6 Willing Users trong [validation/feedback_log.json](file:///Users/hoangquan/Desktop/K4-hackathon-sharkb-E403/validation/feedback_log.json).

## 2. Các công cụ AI đã sử dụng
- **Antigravity AI Agent / Claude / GPT-5.4:** Hỗ trợ sinh mã Python cho bộ định tuyến `PageAwareRAGAgent`, viết script tự động đo kiểm thử eval và rà soát lỗi cú pháp CSS/JS.
- **ChatGPT 4o:** Hỗ trợ phân tích ngữ nghĩa chatlog 1.261 lượt đối thoại của học viên K4 để trích xuất bằng chứng (Evidence B).

## 3. Bài học quan trọng từ một Case Fail của nhóm
- **Sự cố thực tế:** Trong lượt chạy Eval đầu tiên (Baseline), AI bị fail ở 9/30 câu hỏi tóm tắt slide (ví dụ slide 4, slide 33) vì hệ thống RAG cũ dùng Vector Search dựa trên độ tương đồng từ vựng. Khi học viên gõ *"tóm tắt slide 4"*, Vector DB kéo về các đoạn text ở trang 14 và trang 24 có chữ "slide 4", dẫn tới AI trả lời sai lệch hoặc báo *"không tìm thấy nội dung"*.
- **Bài học rút ra:** Với bài toán học tập tài liệu có cấu trúc (Slide PDF), Vector Search thuần túy không phải lúc nào cũng tối ưu. Việc chuyển sang **Page-Aware Metadata Filtering** (lọc cứng theo số trang `slide_number`) kết hợp Fast Router đã giải quyết triệt me lỗi hallucination và đưa tỷ lệ Pass Rate từ 70% lên vượt mức Quality Bar!
