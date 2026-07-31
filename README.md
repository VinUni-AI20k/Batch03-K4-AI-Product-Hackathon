# VLearn Concise-RAG Tutor (PDF Tutor) · Nhóm 03 · Zone A

> **Sản phẩm thuộc dự án Mini Hackathon AI — Batch 03**
> Một công cụ hỗ trợ học tập đắc lực cho học viên VLearn: Tải tài liệu PDF (slide bài giảng), bôi đen hoặc chụp ảnh một vùng kiến thức khó để hỏi đáp trực tiếp với trợ lý AI được kiểm chứng (grounded) nghiêm ngặt từ nội dung tài liệu. Đồng thời tự động tạo câu hỏi trắc nghiệm ôn tập.

---

## 👥 Thành viên nhóm & Phân công công việc


---

## 🌟 Giới thiệu sản phẩm

**VLearn Concise-RAG Tutor** giải quyết triệt để nỗi đau của học viên khi tự học slide trực tuyến:
- **Câu trả lời súc tích (< 100 từ):** Giúp học viên nắm bắt nhanh trọng tâm khái niệm mà không bị ngắt mạch tư duy học tập bởi những câu trả lời dài dòng.
- **Trích dẫn chính xác (Strict Grounding):** Tự động đối chiếu nguồn trích dẫn từ slide bài giảng và transcript giảng dạy của giáo viên.
- **Độ tin cậy cao:** Hệ thống kiểm tra và loại bỏ các trích dẫn sai lệch hoặc ảo tưởng (hallucination) từ mô hình ngôn ngữ lớn (LLM).

### Các tính năng cốt lõi:
1. **Highlight & Ask (Bôi đen hỏi đáp):** Học viên bôi đen trực tiếp thuật ngữ khó trên Slide, AI Tutor sẽ tự động lấy bối cảnh trang đó để trả lời.
2. **Capture Area (Chụp vùng màn hình):** Drag-and-drop chụp lại một vùng slide (ví dụ: sơ đồ, bảng biểu, đoạn code) để gửi câu hỏi trực quan.
3. **Smart Citation Tooltip:** Hiển thị trực quan mã trích dẫn slide/transcript (ví dụ: `[Txx-NNN]`). Học viên có thể click vào để tự động cuộn đến trang slide gốc.
4. **Interactive Quizzer (Tạo quiz tự động):** Tự động sinh bộ câu hỏi trắc nghiệm 4 đáp án từ tài liệu đã chọn, hỗ trợ chấm điểm và hiển thị đáp án giải thích.

---

## 🛠️ Yêu cầu hệ thống & Cài đặt

Dự án được chia thành 2 phần: **Backend** (FastAPI) và **Frontend** (React + Vite + TypeScript).

### 1. Cấu hình khóa API Gemini
Sản phẩm sử dụng mô hình **Gemini 3.5 Flash** (hoặc model Flash hiện hành) để xử lý ngôn ngữ và hình ảnh.
- Lấy API Key tại: [Google AI Studio](https://aistudio.google.com/apikey)

---

### 2. Cài đặt chi tiết

#### Bước 1: Khởi tạo Backend
Mở một terminal mới và chạy các lệnh sau:

```bash
# Di chuyển vào thư mục backend
cd codebase/backend

# Tạo môi trường ảo (Khuyến nghị)
python -m venv venv
# Kích hoạt môi trường ảo:
# Trên Windows:
.\venv\Scripts\activate
# Trên macOS/Linux:
source venv/bin/activate

# Cài đặt các thư viện phụ thuộc
pip install -r requirements.txt

# Tạo file cấu hình môi trường từ file ví dụ
copy .env.example .env

# Mở file .env vừa tạo và điền API Key của bạn:
# GEMINI_API_KEY=your_actual_gemini_api_key_here
```

#### Bước 2: Khởi tạo Frontend
Mở một terminal thứ hai và chạy các lệnh sau:

```bash
# Di chuyển vào thư mục frontend
cd codebase/frontend

# Cài đặt các package Node.js
npm install
```

---

## 🚀 Hướng dẫn chạy thử và Nghiệm thu

Sau khi cài đặt thành công, bạn tiến hành chạy dự án theo các bước sau:

### 1. Khởi động Backend
Tại terminal Backend (đã kích hoạt môi trường ảo):
```bash
uvicorn main:app --reload --port 8000
```
- **API URL:** `http://localhost:8000`
- **Tài liệu API Swagger:** [http://localhost:8000/docs](http://localhost:8000/docs) (Dùng để kiểm tra trực tiếp các endpoint).

### 2. Khởi động Frontend
Tại terminal Frontend:
```bash
npm run dev
```
- **Ứng dụng Web:** [http://localhost:5173](http://localhost:5173)

---

## 🔍 Kịch bản chạy thử (Test Walkthrough)

Để nghiệm thu nhanh các tính năng sản phẩm trên giao diện, hãy thực hiện theo kịch bản sau:

1. **Bước 1: Tải tài liệu**
   - Truy cập giao diện tại `http://localhost:5173`.
   - Trong bảng điều khiển bên trái, kéo thả một file slide PDF bài giảng của bạn (hoặc tài liệu học tập trong thư mục `data/` của hackathon).
2. **Bước 2: Sử dụng tính năng Highlight & Ask**
   - Click chọn tài liệu vừa tải lên để mở trình đọc PDF.
   - Dùng chuột bôi đen (highlight) một thuật ngữ bất kỳ trên slide.
   - Nhìn sang bảng Chat bên phải, nhập câu hỏi của bạn và nhấn **Gửi**.
   - Kiểm tra xem AI giải thích có súc tích và đính kèm chip trích dẫn `p.N` (Trang N) hay không. Click vào chip này để tự động cuộn đến trang đã trích dẫn.
3. **Bước 3: Thử nghiệm Capture Area**
   - Click vào nút **Capture area** trên thanh công cụ PDF.
   - Kéo một khung chữ nhật bao quanh một hình ảnh, sơ đồ hoặc đoạn code trên slide.
   - Đặt câu hỏi (ví dụ: *"Giải thích biểu đồ này"* hoặc *"Mã nguồn này thực hiện nhiệm vụ gì?"*) rồi nhấn **Gửi**.
4. **Bước 4: Trải nghiệm Quiz**
   - Chuyển sang tab **Quiz** ở bảng bên phải.
   - Lựa chọn khoảng trang, số lượng câu hỏi và độ khó mong muốn.
   - Nhấp **Generate Quiz** và tiến hành trả lời trực tiếp để chấm điểm.

---

## 📐 Kiến trúc & Cơ chế hoạt động chính

Hệ thống hoạt động dựa trên mô hình **Strict Grounding RAG** khép kín gồm 3 lớp bảo vệ để ngăn chặn LLM ảo tưởng:

- **Tách trang thông minh:** Tách tài liệu theo từng trang độc lập, kết hợp BM25 RAG tối giản không cần cơ sở dữ liệu vector cồng kềnh.
- **Đối chiếu chuỗi văn bản (difflib):** Toàn bộ trích dẫn của AI trả về được hệ thống kiểm thử lại trên server đối chiếu với dữ liệu text thực tế của trang slide trước khi phản hồi người dùng.

---

## 📦 Cấu trúc Thư mục Dự án

```
DAY5_6_2A202601780_DAONGOCDUY/
├── codebase/              # Mã nguồn prototype sản phẩm
│   ├── backend/           # FastAPI app, schemas, grounding, prompts & gemini client
│   └── frontend/          # React App + Vite + pdf.js + components
├── data/                  # Dữ liệu mẫu (chatlog, bài giảng, slide)
├── spec.md                # Bản đặc tả kỹ thuật AI Spec đầy đủ của sản phẩm
└── README.md              # File hướng dẫn này
```
