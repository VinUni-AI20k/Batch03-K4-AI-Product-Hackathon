---
id: "day1-lab-llm-api-foundation"
title: "Lab 01 — Nền tảng LLM API"
duration: 240
author: "VinUni AI Codelab × GDGoC"
updated: "2026-07-31"
category: "LLM API"
description: "Hoàn thiện các hàm gọi LLM, system prompt, token và chi phí, streaming/retry, rồi ghép chúng thành trợ lý CLI có kiểm thử mock."
published: true
collection: "codelabs"
format: "steps"
day: "1"
preparationTipIds: []
level: "beginner"
prerequisites: ["Biết Python function và tham số", "Mở được terminal tại thư mục repo", "Có tài khoản GitHub để nộp bài"]
outcomes: ["Gọi Chat Completions theo đúng contract của test", "So sánh hai model theo chất lượng, độ trễ và chi phí", "Dùng system prompt, token fallback và cost breakdown", "Xử lý streaming, retry và history cho CLI assistant", "Nộp solution kèm 9 câu phản ánh không lộ API key"]
supportedOs: ["Windows", "macOS", "Linux"]
requiredTools: ["Python 3.10+", "pip", "Git", "API key OpenAI hoặc Gemini (chỉ cho phần chạy thật)"]
commonErrors: ["ModuleNotFoundError: No module named 'openai'", "Import OpenAI ở đầu template.py làm mock không bắt được", "Sai chữ ký hàm hoặc tên key trong dict", "Quên stream=True hoặc không bỏ chunk rỗng", "Commit file .env"]
requiresSubmission: true
---
> **240 phút · Day 1 · beginner.** Bạn sẽ biến `template.py` từ starter code thành một trợ lý CLI. Các checkpoint dùng mock nên xác minh được mà không gọi API và không tốn API key.

Câu hỏi xuyên suốt Lab:

> **Một lời gọi LLM cần những contract nào để vừa chạy được, vừa đo được chi phí, vừa chịu được lỗi mạng?**

| Mốc | Step | Checkpoint |
|---:|---|---|
| 0–60 | 1. Setup và baseline | Test chạy, starter fail đúng lý do |
| 60–100 | 2. API cơ bản | Part 1: 10 passed |
| 100–140 | 3. System prompt, token, cost | Part 2: 10 passed |
| 140–150 | Nghỉ | — |
| 150–190 | 4. Streaming và retry | Part 3: 6 passed |
| 190–230 | 5. Ghép CLI assistant | Part 4: 10 passed |
| 230–240 | 6. Chấm và nộp | `grade.py`, `solution/` |

---

## 1. Setup và xác nhận baseline

**60 phút · mốc 0–60.**

:::goal{title="Môi trường chạy được và bạn biết test đang chấm file nào"}
Bạn cài dependency, chạy được test mock và hiểu rằng `solution/solution.py` sẽ được ưu tiên nếu nó đã tồn tại.
:::

`pytest` ở đây giống bài chấm với diễn viên đóng thế: mock thay API thật, nên lỗi ban đầu phải là phần starter chưa được implement, không phải lỗi mạng.

**Bạn làm:**

1. Tạo virtual environment và cài dependency tại thư mục gốc repo.
2. Copy `.env.example` thành `.env` nếu muốn chạy API thật; giữ file này local.
3. Chạy baseline. Chưa sửa `template.py` ở step này.

:::os
```bash tab="macOS / Linux"
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
python -m pytest tests/ -v
```
```powershell tab="Windows"
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python -m pytest tests/ -v
```
:::

Kết quả kỳ vọng: test runner khởi động được; starter có nhiều lỗi `NotImplementedError`. Đây là baseline đúng.

:::checkpoint{title="Hoàn thành khi"}
- [ ] `python -m pytest tests/ -v` chạy được, dù đang fail.
- [ ] `.env` chỉ nằm local và không xuất hiện trong `git status --short`.
- [ ] `.gitignore` vẫn chặn `.env`; không thêm key vào bất kỳ file nào để commit.
- [ ] Chưa tạo `solution/` trước khi hoàn thiện `template.py`, để test đọc starter code.
:::

:::caution{title="Lỗi import OpenAI"}
Đặt `from openai import OpenAI` bên trong các hàm gọi API. Test thay thế `openai.OpenAI`; import ở đầu file có thể giữ tham chiếu thật và làm mock thất bại.
:::

---

## 2. Gọi API và so sánh hai model

**40 phút · mốc 60–100.**

:::goal{title="Part 1 trả đúng text, latency và bảng so sánh"}
Ba hàm đầu trong `template.py` pass contract: gọi model chính, tái sử dụng cho mini, và trả dict đủ năm key.
:::

### Tại sao phải tái sử dụng hàm?

`call_openai_mini` chỉ đổi model. Gọi lại `call_openai` giúp hai đường dùng chung cách tạo client, truyền tham số và đo latency.

**Bạn làm:**

1. Hoàn thiện `call_openai` theo docstring: client, một user message, `temperature`, `top_p`, `max_tokens`, rồi trả `(response_text, latency_seconds)`.
2. Hoàn thiện `call_openai_mini` bằng cách gọi lại hàm trên với `OPENAI_MINI_MODEL`.
3. Hoàn thiện `compare_models`; dict phải có đúng `gpt4o_answer`, `mini_answer`, `gpt4o_time`, `mini_time`, `gpt4o_cost`.

```bash
python -m pytest tests/test_part1.py -v
```

Kết quả kỳ vọng:
```text
tests/test_part1.py::... PASSED
...
========================= 10 passed in ... =========================
```

:::checkpoint{title="Hoàn thành khi"}
- [ ] Part 1 có 10 passed.
- [ ] `call_openai_mini` không copy-paste lời gọi API.
- [ ] `compare_models` không đổi tên hoặc thiếu key trong dict.
:::

**Nếu bị chậm:** ưu tiên `call_openai` trước; Part 2 và Part 3 không phụ thuộc `compare_models`.

---

## 3. Điều khiển system prompt và đo chi phí

**40 phút · mốc 100–140.**

:::goal{title="Part 2 tách được persona, token và chi phí hai chiều"}
Bạn gửi system message trước user message, đếm token có fallback và trả cost breakdown nhất quán.
:::

System prompt là brief cho người trả lời: nó định hướng vai trò trước khi user đặt câu hỏi. Giá API tính trên token, nên input và output phải được tính riêng.

**Bạn làm:**

1. Hoàn thiện `chat_with_system_prompt` với hai message theo thứ tự `system` rồi `user`.
2. Hoàn thiện `count_tokens` bằng `tiktoken.encoding_for_model(model)`; khi encoding/model lỗi, trả `max(1, len(text) // 4)`.
3. Hoàn thiện `estimate_cost` bằng `count_tokens` cho cả prompt và response; `total_cost` bằng tổng hai phần.

```bash
python -m pytest tests/test_part2.py -v
```

Kết quả kỳ vọng:
```text
tests/test_part2.py::... PASSED
...
========================= 10 passed in ... =========================
```

:::checkpoint{title="Hoàn thành khi"}
- [ ] Part 2 có 10 passed, gồm case model lạ không crash.
- [ ] `messages[0]` là system message; `messages[1]` là user message.
- [ ] Dict chi phí có `input_tokens`, `output_tokens`, `input_cost`, `output_cost`, `total_cost`.
:::

:::caution{title="Không coi bảng giá là giá live"}
`PRICING_PER_1K_TOKENS` là dữ liệu học tập trong repo. Dùng nó để pass contract, không dùng nó để báo giá thực tế cho sản phẩm.
:::

---

## 4. Streaming và retry khi lời gọi không ổn định

**40 phút · mốc 150–190.**

:::goal{title="Part 3 stream được text và retry đúng giới hạn"}
Bạn hiển thị từng chunk không rỗng và chỉ ném lỗi sau khi đã dùng hết số lần retry.
:::

Streaming là giao từng phần của câu trả lời thay vì chờ cả câu. Retry là thử lại lỗi tạm thời; exponential backoff tăng thời gian chờ để tránh nhiều client cùng dồn vào API.

**Bạn làm:**

1. Hoàn thiện `streaming_chatbot` với `stream=True`, chỉ nối/in chunk khi `delta.content` có giá trị.
2. Hoàn thiện `retry_with_backoff`; gọi lại hàm, chờ tăng dần và raise exception cuối khi vượt `max_retries`.
3. Trả lời Câu 3.1 và 3.2 trong `exercises.md` bằng quan sát của bạn.

```bash
python -m pytest tests/test_part3.py -v
```

Kết quả kỳ vọng:
```text
tests/test_part3.py::... PASSED
...
========================= 6 passed in ... =========================
```

:::checkpoint{title="Hoàn thành khi"}
- [ ] Part 3 có 6 passed.
- [ ] Không in `None` từ chunk kết thúc.
- [ ] Lỗi cuối cùng vẫn được raise sau giới hạn retry.
:::

---

## 5. Ghép thành trợ lý CLI có history

**40 phút · mốc 190–230.**

:::goal{title="run_assistant quản lý được phiên chat ngắn"}
CLI thoát đúng lệnh, lưu lịch sử bốn lượt cuối, stream phản hồi và trả thống kê phiên.
:::

**Bạn làm:**

1. Hoàn thiện `run_assistant` mà không đổi chữ ký hàm.
2. Dừng trước khi đọc input nếu `max_turns` bằng 0; chấp nhận `quit`, `exit`, `bye` không phân biệt hoa thường.
3. Gửi persona bằng system message, giới hạn history ở 8 messages và trả `turns`, `tokens_used`, `total_cost`, `history`.

```bash
python -m pytest tests/test_part4.py -v
```

Kết quả kỳ vọng:
```text
tests/test_part4.py::... PASSED
...
========================= 10 passed in ... =========================
```

:::checkpoint{title="Hoàn thành khi"}
- [ ] Part 4 có 10 passed.
- [ ] Một phiên sáu lượt chỉ giữ 8 messages cuối trong `history`.
- [ ] Persona được gửi vào system message khi gọi API.
:::

**Xong sớm:** cấu hình key rồi chạy `python template.py`. Nội dung và độ trễ của phản hồi là Coach inference vì phụ thuộc provider, model và mạng.

---

## 6. Chấm điểm và nộp bài

**10 phút · mốc 230–240.**

:::goal{title="Bài nộp có code, reflection và không có secret"}
Bạn có kết quả chấm cuối, 9 câu trả lời thật và bản sao nộp trong `solution/`.
:::

**Bạn làm:**

1. Trả lời đủ chín dòng trả lời trong `exercises.md`.
2. Tạo `solution/` cùng `solution/solution.py` và `solution/exercises.md` (FILE MỚI), copy hai file nộp rồi chạy grader; test sẽ ưu tiên hai file này.
3. Kiểm tra staged files trước khi commit, push repo theo quy ước trong `README.md`.

```bash
mkdir -p solution
cp template.py solution/solution.py
cp exercises.md solution/exercises.md
python grade.py
git status --short
```

Kết quả kỳ vọng:
```text
Total: 100.0/100
```
Điểm thấp hơn phản ánh số test hoặc số câu reflection chưa hoàn thành.

### Checklist artifacts bắt buộc

:::checkpoint{title="Hoàn thành khi"}
- [ ] [solution/solution.py](../solution/solution.py) có bản code cuối.
- [ ] [solution/exercises.md](../solution/exercises.md) có 9 câu trả lời.
- [ ] `python -m pytest tests/ -v` có 36 passed.
- [ ] `python grade.py` đạt mục tiêu của lớp.
- [ ] `git status --short` không chứa `.env`, key hoặc dữ liệu nhạy cảm.
- [ ] Đã push repo `DAY01-MSSV-HoVaTen` và nộp link lên VLearn.
:::

> Mock test xác minh contract. Chạy API thật chỉ dùng để quan sát hành vi model sau khi key đã được giữ local.
