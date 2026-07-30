# VLearn AI Tutor — SlideSummarizer Backend

Backend của **VLearn AI Tutor** hỗ trợ hệ thống hóa kiến thức và tạo **Global Summary** từ các bộ slide PDF, giúp khắc phục các hạn chế của phương pháp tìm kiếm cục bộ (local retrieval) và giảm hiện tượng trích xuất sai nội dung theo từng trang.

Hệ thống hỗ trợ nhiều LLM (OpenAI, Gemini, DeepSeek), tích hợp sẵn công cụ đọc PDF và bộ kiểm thử tự động theo yêu cầu của đề bài.

---

# 1. Project Structure

```text
codebase/
├── .env                     # File cấu hình chứa API Key (không commit lên Git)
├── .env.example             # File mẫu cấu hình môi trường
├── requirements.txt         # Danh sách thư viện Python
├── env_loader.py            # Nạp biến môi trường và lựa chọn LLM Provider
├── prompts/
│   └── base_prompt.py       # System Prompt (HAX/PAIR Rules)
├── core/
│   ├── pdf_processor.py     # Đọc và trích xuất nội dung PDF
│   ├── tools.py             # Định nghĩa các Tool
│   └── agent.py             # Router và Tool Calling Agent
├── scripts/
│   └── preflight.py         # Kiểm tra API Key và môi trường
├── data/
│   └── eval_group.json      # Bộ test của nhóm
├── run_tests.py             # Chạy Automation Test
└── run_eval.py              # Chạy bộ đánh giá chính thức
```

---

# 2. Environment Setup

## Clone project

```bash
git clone <repository-url>
cd codebase
```

## Create Virtual Environment

### Windows (Git Bash)

```bash
python -m venv .venv
source .venv/Scripts/activate
```

### Windows (PowerShell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

---

# 3. Install Dependencies

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

---

# 4. Configure Environment Variables

Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
```

Sau đó điền API Key của provider mà nhóm sử dụng.

Ví dụ:

```env
LLM_PROVIDER=openai

OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx

# Hoặc Gemini
# LLM_PROVIDER=gemini
# GEMINI_API_KEY=AIzaSy...

# Hoặc DeepSeek
# LLM_PROVIDER=deepseek
# DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
```

---

# 5. Verify Environment

Kiểm tra API Key và kết nối mô hình:

```bash
python scripts/preflight.py
```

---

# 6. Run Local Evaluation

## Chỉnh sửa bộ test

```
data/eval_group.json
```

## Chạy Automation Test

```bash
python run_tests.py
```

---

# 7. Run Official Evaluation

```bash
python run_eval.py \
    --provider openai \
    --version v3 \
    --suite group \
    --eval-cases data/eval_group.json
```

---

# Supported Providers

- OpenAI
- Google Gemini
- DeepSeek

---

# Notes

- Không commit file `.env` lên GitHub.
- Chỉ commit `.env.example`.
- Khuyến nghị sử dụng Python **3.13**.
- Mỗi thành viên sử dụng API Key riêng trong file `.env`.