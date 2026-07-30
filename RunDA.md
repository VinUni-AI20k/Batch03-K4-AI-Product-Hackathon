# Hướng Dẫn Chạy Dự Án (RunDA)

Dự án này là hệ thống **AI Agent QA** sử dụng công nghệ Retrieval-Augmented Generation (RAG) kết hợp Semantic Search & BM25, cùng với 4 lớp Guardrails để trả lời các câu hỏi chuyên môn dựa trên dữ liệu cào được từ các Group Facebook.

Dưới đây là hướng dẫn từng bước để khởi chạy và vận hành toàn bộ dự án trên máy tính local của bạn.

---

## 1. Yêu cầu hệ thống (Prerequisites)
- **Python 3.9+** (để chạy Backend và Scraper)
- **Node.js 18+** (để build giao diện Frontend React)
- **API Key** của nhà cung cấp LLM (OpenAI, Gemini hoặc Claude)

---

## 2. Cài đặt và Khởi chạy Frontend (React)
Giao diện người dùng được viết bằng React và Vite. Bạn cần build giao diện này trước để Backend FastAPI có thể phục vụ (serve) tĩnh.

1. Mở Terminal và di chuyển vào thư mục Frontend:
   ```bash
   cd codebase/frontend
   ```
2. Cài đặt các thư viện Node.js:
   ```bash
   npm install
   ```
3. Build dự án (kết quả sẽ được tự động xuất ra thư mục `codebase/frontend/dist`):
   ```bash
   npm run build
   ```
*(Lưu ý: Nếu bạn chỉ muốn dev frontend, bạn có thể chạy `npm run dev` để chạy trên cổng 5173).*

---