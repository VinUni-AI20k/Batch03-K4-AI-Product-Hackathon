# Mini Hackathon AI — Batch 03

**SPEC → Prototype → Demo.** Đây không phải cuộc thi code — đây là cuộc thi **tư duy sản phẩm AI**.

- Thời lượng: **1,5 ngày** (một ngày build + một buổi demo)
- Nhóm: **4-5 người** · zone tối đa 5 nhóm · thi theo lớp

---

## 👥 THÀNH VIÊN & PHÂN CÔNG

- **Thành viên 1:** [Mã HV] - [Tên] - Phân công: [Phần đảm nhận]
- **Thành viên 2:** [Mã HV] - [Tên] - Phân công: [Phần đảm nhận]
- **Thành viên 3:** [Mã HV] - [Tên] - Phân công: [Phần đảm nhận]
- **Thành viên 4:** [Mã HV] - [Tên] - Phân công: [Phần đảm nhận]

---

## 🛠️ HƯỚNG DẪN SETUP HỆ THỐNG (NEXT.JS & FASTAPI VỚI UV)

Dự án được xây dựng với kiến trúc Client-Server:

- **Frontend:** Next.js (TypeScript, Tailwind CSS, App Router) nằm trong `codebase/frontend/`.
- **Backend:** FastAPI (Python, quản lý môi trường bằng `uv`) nằm trong `codebase/backend/`.

### 1. Chuẩn bị môi trường Python (Backend)

Các thành viên trong nhóm cần cài đặt công cụ quản lý package Python cực nhanh `uv`:

- **Cài đặt `uv`:**
    - MacOS/Linux:
        ```bash
        curl -LsSf https://astral.sh/uv/install.sh | sh
        ```
    - Windows:
        ```powershell
        powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
        ```
    - Hoặc qua pip:
        ```bash
        pip install uv
        ```

- **Kích hoạt Conda environment (nếu có sẵn environment `ai_in_action` như trên máy server):**

    ```bash
    conda activate ai_in_action
    ```

- **Cài đặt các thư viện Python:**
  Di chuyển vào thư mục backend và cài đặt dependencies tự động qua `uv`:

    ```bash
    cd codebase/backend
    uv sync
    ```

    Lệnh trên sẽ tự động tạo virtual environment `.venv` và đồng bộ mọi thư viện cần thiết đã định nghĩa trong `pyproject.toml` và `uv.lock`.

- **Chạy backend local (FastAPI):**
    ```bash
    # Khi đứng ở codebase/backend:
    uv run uvicorn app.main:app --reload --port 8000
    ```
    API sẽ chạy ở địa chỉ: [http://localhost:8000](http://localhost:8000)
    Tài liệu API (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Chuẩn bị môi trường Frontend (Next.js)

Yêu cầu hệ thống đã cài đặt **Node.js (v18.x trở lên)** và **npm**.

- **Cài đặt dependencies:**

    ```bash
    cd codebase/frontend
    npm install
    ```

- **Chạy frontend local:**
    ```bash
    npm run dev
    ```
    Trang web Next.js sẽ chạy ở địa chỉ: [http://localhost:3000](http://localhost:3000)

---

## Bắt đầu từ đâu?

1. Đọc **`01-de-bai.md`** để chọn hướng và hiểu tiêu chí.
2. Mở **`02-guide.md`** — hướng dẫn từng giai đoạn, đứng ở đâu đọc mục đó.
3. Viết spec theo **`03-template-ai-spec.md`** — deliverable trung tâm của cả sự kiện.
4. Đọc **`04-rubric.md`** ngay từ đầu — biết trước bài được chấm theo tiêu chí nào.

| File / thư mục           | Nội dung                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `01-de-bai.md`           | Đề bài 3 hướng · 5 tiêu chí nghiệm thu · ràng buộc chung                                          |
| `02-guide.md`            | Hướng dẫn 5 giai đoạn: khám phá → spec → build → đo & validate → demo                             |
| `03-template-ai-spec.md` | Template AI Spec (nộp 23:59 ngày 1)                                                               |
| `04-rubric.md`           | Rubric 100 điểm (25 nộp checkpoint + 75 chấm bài) + checklist xác minh 6 mốc                      |
| `data/`                  | Dữ liệu thật đã ẩn danh: chatlog VLearn tutor + 6 transcript bài giảng + 2 bộ slide bản hackathon |
| `tham-khao/`             | JTBD Playbook (PDF) + worksheet JTBD đầy đủ                                                       |

## Nộp bài

Một repo nhóm, cấu trúc như sau. Spec chốt lúc 23:59 ngày 1; bản hoàn chỉnh trước CP6.

```
repo/
├── README.md          ← thành viên + phân công + hướng dẫn setup này
├── spec.md            ← AI Spec theo 03-template-ai-spec.md
├── demo-slides.pdf    ← slide 6 trang theo 02-guide.md §5.1
├── codebase/          ← prototype (chứa frontend & backend)
├── eval/              ← golden set + bảng kết quả các lượt chạy
├── validation/        ← feedback log từ vòng user test
└── reflection/        ← mỗi người 1 file
```
