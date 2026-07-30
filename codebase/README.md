# AI Agent QA — Khóa học Cộng đồng AI Thực Chiến Vingroup - VinUni ⚡

Prototype **AI Agent QA** tích hợp nguồn dữ liệu thực chiến cào từ Facebook Group **"Cộng đồng AI Thực Chiến Vingroup - VinUni"** (ID: `363757814515154`) bằng công cụ `fb/facebook_post_comment_scraper`, kết hợp cùng **VLearn Pack** (Transcript bài giảng & Slide).

---

## 🎯 Điểm nổi bật theo Rubric 100 Điểm (Hackathon Batch 03)

- **Lát cắt 1 câu (§4 - R2 - 15đ):**
  > Một học viên khóa AI Thực Chiến · đang vướng mắc về lý thuyết, lỗi kỹ thuật hoặc logistics khóa học · cần AI Agent tra cứu cơ sở tri thức (cào từ FB Group + Slide + Transcript) và đánh giá độ tin cậy của thông tin để trả lời kèm nguồn trích dẫn · giúp học viên có ngay lời giải đáp chính xác trong 5 giây mà không cần chờ TA hay sợ trôi bài.
- **Bằng chứng từ FB Group Scraper (R1 - 15đ):**
  - Đồng bộ trực tiếp dữ liệu bài đăng & bình luận giải đáp kiểm chứng bởi TA/Mentor từ Group Facebook.
  - Tích hợp thêm trích dẫn từ 6 transcript bài giảng (`data/vlearn-pack/transcript/`).
- **4 Lớp Chỗ Khó - Guardrail Taxonomy (R3 - 11đ):**
  - ① **Nguồn sự thật (Ground Truth):** Chặn các câu hỏi hỏi về hạn nộp / lịch trình của các Batch cũ (Batch 01, 02), luôn dẫn link lịch trình chuẩn của Batch 03.
  - ② **Mơ hồ / Thiếu thông tin (Ambiguity):** Hỏi lại OS, mã lỗi cụ thể khi câu hỏi của học viên cộc lốc (*"lỗi pip"*, *"bài 1 làm sao"*).
  - ③ **Ngoài thẩm quyền (Authority / Vibe-coding rule):** Từ chối viết nguyên văn toàn bộ code bài nộp Checkpoint 3/4/5, hướng dẫn tư duy lập trình thực chiến.
  - ④ **Đặc thù domain:** Nhận diện chính xác ngữ cảnh các thuật ngữ AI Thực Chiến (*JTBD, Cost of Error, HAX/PAIR, Rubric 100 điểm*).
- **Giao diện Web WOW-Factor (R5 - 8đ):**
  - Đẹp mắt với Dark Mode + Glassmorphism.
  - 3 Tab tiện ích: **Trợ lý AI QA Chat**, **Explorer dữ liệu FB Scraper**, và **Live Demo 4 Lớp Chỗ Khó** (cho Ban Giám Khảo bấm 1-click test ngay lập tức).

---

## 🚀 Hướng dẫn cài đặt & khởi chạy nhanh (Trong 1 phút)

### 1. Cài đặt môi trường Python
Di chuyển vào thư mục `codebase/` và cài đặt các package cần thiết (nhẹ, nhanh, thuần Python):

```bash
cd codebase
pip install -r requirements.txt
```

### 2. (Tùy chọn) Cấu hình Gemini API Key
Nếu muốn gọi LLM Gemini API thật (đáp ứng Quy định ≥1 lời gọi AI thật):
Tạo file `.env` trong thư mục `codebase/`:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(Nếu không có API key, hệ thống tự động chuyển sang chế độ Local RAG Engine đã được nạp sẵn tri thức FB Group & VLearn, đảm bảo Demo hoàn hảo không lo đứt mạng!)*

### 3. Khởi chạy Server FastAPI & Web UI

```bash
python main.py
```
Hoặc dùng uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Truy cập Web UI
- **Truy cập trực tiếp bản Build React WOW-Factor tích hợp sẵn:**
  👉 **http://localhost:8000**
- **(Tùy chọn) Chế độ Live Dev với Vite React Hot-Reloading:**
  Nếu muốn chỉnh sửa code React với giao diện cập nhật real-time:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
  👉 Mở trình duyệt tại: **http://localhost:5173** (Tự động gọi API về port 8000 nhờ CORS tích hợp sẵn).

---

## 📁 Cấu trúc thư mục `codebase/`

```
codebase/
├── agent.py               ← Core AI Agent QA với 4 Lớp Chỗ Khó (Taxonomy Guardrails) & KB Retrieval
├── main.py                ← FastAPI Server cung cấp API (/api/chat, /api/kb/search, /api/kb/stats) & phục vụ React dist
├── requirements.txt       ← Các thư viện tối thiểu (fastapi, uvicorn, pydantic, google-generativeai,...)
├── README.md              ← Hướng dẫn sử dụng prototype
├── frontend/              ← Giao diện React Vite WOW-Factor (Glassmorphism + Dark Mode + Lucide Icons)
│   ├── src/
│   │   ├── components/    ← Header.jsx, ChatTab.jsx, KBExplorerTab.jsx, GuardrailsTab.jsx, CitationModal.jsx
│   │   ├── App.jsx        ← State manager kết nối FastAPI backend & chế độ Local RAG fallback
│   │   └── index.css      ← Styling Glassmorphism, Animated Ambient Glows & Responsive Layout
│   └── dist/              ← Bản build sản phẩm sẵn sàng phục vụ từ trang chủ FastAPI
├── data/
│   ├── fb_group_qa.json   ← Knowledge Base cào từ Facebook Group (Bài Q&A + Verified Answers)
│   └── vlearn_kb.json     ← Tri thức từ VLearn Pack (Slide & Lecture Transcripts)
└── static/
    ├── index.html         ← Giao diện HTML tĩnh dự phòng
    ├── style.css          ← Giao diện Glassmorphism Dark Mode
    └── script.js          ← Logic tương tác giao diện tĩnh
```
