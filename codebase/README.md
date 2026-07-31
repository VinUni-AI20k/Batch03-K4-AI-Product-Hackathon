# Codebase — AI Learning Bridge Agent (VLearn Track A)

**Dự án**: AI Learning Bridge Agent  
**Nhóm**: BrainStormers (Khóa AI Thực Chiến - K4)  
**Vai trò phụ trách chính**: Người 3 — Build Lead  

---

## Mô tả Sản phẩm Prototype
Prototype hoàn chỉnh cho tính năng **AI Learning Bridge** trên VLearn — tự động sinh recap, bridge map giữa các buổi học, checklist chuẩn bị và quiz kiểm tra nhanh với trích dẫn chính xác `[slide X]` / `[Txx-NNN]`.

---

## Mức Prototype & Chứng minh Rubric R5
- [ ] Sketch
- [ ] Mock
- [x] **Working** *(Target Đạt chuẩn)*

| Thành phần | Thật / Mock | Chi tiết kỹ thuật & File phụ trách |
|---|---|---|
| **LLM Call sinh recap & bridge** | **Thật** | Gọi Gemini API (`gemini-1.5-flash`) thật qua REST, kèm chế độ fallback mượt trong [llmService.js](file:///c:/Documents/AIinAction/Labs/DAY0506_Brainstorms/codebase/src/services/llmService.js) |
| **Log/Trace vết gọi AI** | **Thật** | Lưu lịch sử gọi AI vào local storage / console qua [logger.js](file:///c:/Documents/AIinAction/Labs/DAY0506_Brainstorms/codebase/src/services/logger.js) (Rubric R5: 3đ) |
| **Dữ liệu transcript/slide** | **Thật** | Trích xuất từ `data/vlearn-pack/` đóng gói sẵn trong [courseData.js](file:///c:/Documents/AIinAction/Labs/DAY0506_Brainstorms/codebase/src/data/courseData.js) |
| **4 Đường đi Trải nghiệm (Paths)** | **Thật** | Hỗ trợ full 4 path: Happy, Low-confidence (warning), Failure (no-basis), Boundary/Out-of-scope |
| **UI VLearn Platform** | **Working React App** | Giao diện React + Vite + Vanilla CSS Dark Mode & Glassmorphic mượt mà |
| **Knowledge Map Graph** | **Working Component** | Trực quan hóa nút khái niệm nối Day 01 ➔ Day 02 tại [KnowledgeMap.jsx](file:///c:/Documents/AIinAction/Labs/DAY0506_Brainstorms/codebase/src/components/KnowledgeMap.jsx) |

---

## Hướng dẫn Chạy Lập trình (Local Execution)

```bash
# 1. Di chuyển vào thư mục codebase
cd codebase

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Cấu hình Gemini API Key (Tùy chọn cho API Thật)
# Tạo file .env và điền key:
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# 4. Khởi chạy server phát triển (Dev Server)
npm run dev
```

---

## Cấu trúc Thư mục Codebase
```
codebase/
├── .env.example            ← Mẫu biến môi trường API Key
├── package.json            ← Khai báo thư viện React & Vite
├── vite.config.js          ← Cấu hình Vite bundler
├── index.html              ← Trang HTML chính (Font Inter & Outfit)
├── README.md               ← File hướng dẫn này
├── prompts/                ← Prompt templates cho Person 4 (Eval Lead)
│   ├── system_prompt.txt   ← Quy định HAX/PAIR & 4 lớp chỗ khó
│   ├── recap_prompt.txt    ← Template prompt sinh recap
│   └── bridge_prompt.txt   ← Template prompt sinh bridge
└── src/
    ├── main.jsx            ← Điểm khởi chạy React DOM
    ├── index.css           ← Design System Dark Mode, Glassmorphism & Animations
    ├── App.jsx             ← Giao diện VLearn LMS + Demo Controller 4 paths
    ├── components/
    │   ├── LearningBridge.jsx  ← Widget AI trung tâm (Recap, Bridge, Checklist, Quiz, Trace)
    │   ├── KnowledgeMap.jsx    ← Sơ đồ trực quan nối tri thức cross-day
    │   └── FeedbackModal.jsx   ← Modal thu thập phản hồi người dùng (HAX G15)
    ├── data/
    │   └── courseData.js   ← Dữ liệu bài giảng sạch từ data/vlearn-pack/
    └── services/
        ├── llmService.js   ← Service gọi Gemini API thật + Fallback Simulator
        └── logger.js       ← Service lưu vết (trace/log) cho Rubric R5
```
