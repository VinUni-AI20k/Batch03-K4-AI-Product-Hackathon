# Reflection cá nhân — Phạm Thế Đăng · AI Agent QA · Batch 03

---

## 1. Vai trò & phần mình làm

**Phần mình phụ trách trong codebase:**
- File/module: Toàn bộ hệ thống trong `codebase/` (`main.py`, `agent.py`), các script `run_backend.bat`, `run_all.bat`.
- Chức năng cụ thể: Xây dựng Backend FastAPI, tích hợp Hybrid Search (BM25 + Semantic), viết logic Guardrails bằng Regex, kết nối OpenAI/Gemini API có Function Calling.

**Phần mình phụ trách trong spec.md:**
- Section: Tham vấn kỹ thuật cho §4 (Thiết kế) và kiểm chứng tính khả thi của các kịch bản rủi ro (§6).

---

## 2. AI hỗ trợ mình như thế nào

| Công việc | Dùng AI tool nào | AI làm gì | Mình làm gì |
|---|---|---|---|
| Code Hybrid Search | Cursor/Claude 3.5 | Gợi ý thuật toán kết hợp BM25 + Cosine. | Tinh chỉnh lại ngưỡng threshold và trọng số (60% Sem, 40% BM25). |
| Viết Regex Guardrail | ChatGPT | Gen ra các pattern check keyword. | Đọc lại, test edge cases (VD: Lỗi pip) để tránh trigger nhầm. |
| Fix lỗi thư viện | Copilot | Giải thích lỗi xung đột thư viện `rank_bm25`. | Viết lại `requirements.txt` và thêm try-except khi import. |

**Mình hiểu code của mình đến mức:**
> Mình viết và thiết kế luồng kiến trúc của `agent.py`. Mình có thể giải thích chi tiết hàm `_retrieve_relevant_docs()` hoạt động ra sao, cách kết hợp điểm BM25 và Semantic như thế nào.

---

## 3. Một bài học từ case fail của nhóm

**Case fail cụ thể:**
> Kết quả truy xuất RAG (Retrieval) ban đầu trả về toàn tài liệu rác, không liên quan đến câu hỏi.

**Nguyên nhân:**
> Ngưỡng cắt (threshold) của Cosine Similarity đặt quá thấp (0.05), và không có cơ chế chặn các câu hỏi ngoài lề (Out of Domain).

**Cách fix:**
> Bổ sung thêm logic check `_is_out_of_domain()` trong hàm retrieve. Tăng ngưỡng threshold, đồng thời cộng điểm thưởng (bonus) nếu query trùng keyword (tags) của tài liệu.

**Bài học:**
> AI RAG không chỉ là ném text vào Vector DB rồi gọi LLM. Việc tinh chỉnh thuật toán search (Hybrid), làm sạch dữ liệu (Data chunking) và thiết lập Threshold quan trọng hơn nhiều so với việc gọi API LLM.

---

## 4. Nếu làm lại, mình sẽ thay đổi gì

> Mình sẽ viết Unit Test cho từng Guardrail Regex. Khi sửa code sát giờ chạy Demo, mình lỡ tay sửa regex làm hỏng luôn luồng L2, nếu có Unit Test thì đã bắt được lỗi này ngay lập tức.
