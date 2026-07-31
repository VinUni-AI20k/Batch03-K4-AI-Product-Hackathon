# 01 — RAG Chatbot (Tab "VLearn Tutor")

**What to build:** Khả năng hỏi đáp sát nội dung bài học. Xây dựng cấu trúc dữ liệu (`slides`, `slide_embeddings`), script offline nhúng slide bằng Gemini, API `POST /chat` sử dụng pgvector để tìm ngữ cảnh, và đấu nối API này vào tab "VLearn Tutor" trên giao diện HTML hiện có (`vlearn-adaptive-loop-v7.html`).

**Blocked by:** None — can start immediately

**Status:** ready-for-agent

- [ ] Schema cơ sở dữ liệu cho bảng `slides` và `slide_embeddings` có enable extension `pgvector` được tạo thành công.
- [ ] Script offline đọc nội dung slide, gọi Gemini Embedding API (vd: `text-embedding-004`) và lưu vector vào Database hoạt động đúng.
- [ ] API `POST /chat` nhận vào `lecture_id`, `slide_no` và câu hỏi, trích xuất context bằng pgvector, gọi Gemini LLM và trả lời được.
- [ ] Giao diện tab "VLearn Tutor" trong file HTML gửi request thực tế lên API `POST /chat` (kèm user_id trong header) và hiển thị câu trả lời (thay vì mock như hiện tại).
