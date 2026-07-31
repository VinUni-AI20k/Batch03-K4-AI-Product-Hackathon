<!--
TEMPLATE — README.md của repo lab
Xoá mọi comment HTML trước khi giao.

Phân vai giữa hai file, đừng copy nội dung qua nhau:
  README.md        = bài toán, yêu cầu, xong sẽ có gì, setup, chấm điểm, nộp bài
  docs/CODELAB.md  = hướng dẫn từng bước
README trả lời "bài này là gì và tôi bị chấm thế nào". CODELAB trả lời "tôi làm thế nào".
-->
# <Tên lab> — <Ngày/Buổi> (<giờ bắt đầu>–<giờ kết thúc>)

Hướng dẫn từng bước: **[docs/CODELAB.md](docs/CODELAB.md)** hoặc trên web: <https://codelabs.vlearn.dev/codelab/<id>>

<1-2 câu bài toán. Vấn đề thật là gì, learner xây gì để giải nó.>

## Sau buổi này bạn làm được gì

<!-- Trùng với outcomes trong frontmatter CODELAB.md. Động từ quan sát được. -->

- <Động từ> <...>
- <Động từ> <...>
- <Động từ> <...>

## Yêu cầu trước khi vào lab

| Cần | Mức tối thiểu |
|---|---|
| <Python> | <3.10+> |
| <Kiến thức> | <năng lực kiểm được, không phải tên môn học> |
| <API key> | <có/không — nói rõ phần nào chạy được mà không cần key> |

## Setup

**macOS / Linux:**

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

**Windows (PowerShell):**

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

<!-- Giữ khối này nếu PowerShell hay chặn script trong lớp -->
> PowerShell chặn script → chạy một lần
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`,
> hoặc dùng Command Prompt với `.venv\Scripts\activate.bat`.

Mở `.env`, thay `<placeholder>` bằng key thật. `.env` đã nằm trong `.gitignore` — **không commit key**.

Kiểm môi trường:

```bash
<lệnh smoke test>
```

Kết quả đúng:

```text
<output>
```

## Cấu trúc thư mục

```text
<tên-repo>/
├── README.md            # File này — bài toán, setup, chấm điểm, nộp bài
├── docs/CODELAB.md      # Hướng dẫn từng bước
├── <file learner code>  # Nơi bạn viết code
├── requirements.txt
└── tests/               # <có/không có test tự động>
```

## Lịch trình và checkpoint

<!-- Chỉ giữ khi lab có mốc giờ thật. Số phải khớp duration trong CODELAB.md. -->

| Giờ | Hoạt động | Checkpoint |
|---|---|---|
| <hh:mm–hh:mm> | Setup | <lệnh> chạy được |
| <hh:mm–hh:mm> | Step 1 — <...> | <lệnh verify> |
| <hh:mm–hh:mm> | Step 2 — <...> | <lệnh verify> |

## Chạy kiểm thử

<!-- Repo KHÔNG có test tự động thì nói thẳng, đừng bịa. Thay bằng validation read-only. -->

```bash
<lệnh test hoặc validation>
```

<Nói rõ test có cần API key không.>

## Chấm điểm (<tổng> điểm)

| Tiêu chí | Chấm trên file nào | Điểm |
|---|---|---|
| <...> | `<path>` | <n> |
| <...> | `<path>` | <n> |
| **Tổng** | | **<tổng>** |

<!-- Mọi ô điểm phải trỏ về một file learner tạo được. Ô nào không có chỗ tạo trong CODELAB.md là lỗi. -->

## Nộp bài

```bash
<lệnh chuẩn bị bài nộp>
```

<Quy ước tên repo, nơi nộp link, deadline.>

## Danh sách kiểm tra trước khi nộp

- [ ] <lệnh test> pass
- [ ] <artifact 1> đã hoàn thiện
- [ ] <artifact 2> đã hoàn thiện
- [ ] Repo **không** chứa `.env` — kiểm bằng `git status --short`
- [ ] Đã nộp link repo trước <deadline>
