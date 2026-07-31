---
id: "day3-lab-chatbot-vs-react-agent-e402"
title: "Lab 03 — Chatbot vs ReAct Agent"
duration: 150
author: "VinUni AI Codelab × GDGoC"
updated: "2026-07-31"
category: "AI Agent"
description: "So sánh chatbot với ReAct Agent, kiểm tra tool deterministic, thêm guardrail và nộp trace chứng minh khi nào agent đáng dùng."
published: true
collection: "codelabs"
format: "steps"
day: "3"
preparationTipIds: []
level: "intermediate"
prerequisites: ["Chạy được lệnh Python trong terminal", "Đọc được JSON list và dict", "Dùng được Git để pull, commit và push", "Biết Python function và tham số"]
outcomes: ["So sánh chatbot và ReAct Agent bằng trace trong docs/trace_eval.md", "Kiểm tra tool contract trong src/tools.py với input hợp lệ và lỗi", "Giải thích guardrail MAX_ITERATIONS trong src/prompts.py", "Phân vai theo file và tích hợp app trong src/app.py", "Vẽ quyết định chatbot hay agent trong docs/hybrid_flowchart.mermaid"]
supportedOs: ["Windows", "macOS", "Linux"]
requiredTools: ["Python 3.10+", "pip", "Git"]
commonErrors: ["ModuleNotFoundError: No module named 'dotenv'", "LỖI: Không tìm thấy dữ liệu thời tiết cho địa điểm", "Không tìm thấy config/test_cases.json", "Commit API key trong .env"]
requiresSubmission: true
---
> **150 phút · Day 3 · intermediate.** Bạn sẽ dùng cùng một câu hỏi để thấy chatbot không có bằng chứng, còn [ReAct Agent](#glossary "Reasoning + Acting: application cho model luân phiên suy luận, gọi tool và đọc Observation.") có thể lấy dữ liệu từ tool. Step 1 chạy ở mock mode, chưa cần API key.

Câu hỏi trọng tâm xuyên suốt Lab:

> **Khi nào một chatbot là đủ, và khi nào dữ liệu hoặc hành động bên ngoài khiến agent đáng chịu thêm chi phí orchestration?**

> **Mâu thuẫn trong repo — cách guide này xử lý**
>
> - URL repo là E403 nhưng README và cấu trúc hướng dẫn cũ dùng E402. Guide giữ `id` E402 để không làm vỡ URL codelab hiện có; nội dung được lấy từ source code của repo E403.
> - README nói 4 mốc / 150 phút, còn bản guide cũ ghi 240 phút. Guide dùng 150 phút theo timeline trong README.
> - Repo không có test runner. Guide dùng validation deterministic cho từng module và smoke run `src/app.py` thay vì gọi đó là automated test.
> - README yêu cầu `docs/hybrid_flowchart.mermaid` nhưng file chưa có. Đây là FILE MỚI ở step 5.

| Mốc | Step | Xong sẽ có gì |
|---:|---|---|
| 0–20 | 1. Chạy mock app và ký role | `.venv` và app in demo ReAct |
| 20–50 | 2. Chốt test case và tool contract | `config/test_cases.json`, tool validation |
| 50–95 | 3. Ghép prompt và ReAct loop | Trace Thought → Action → Observation |
| 95–125 | 4. So sánh hai đường trả lời | `docs/trace_eval.md` có bằng chứng |
| 125–150 | 5. Chốt flowchart và nộp bài | Flowchart, repo sạch, artifacts đủ |

| Thành phần | Vai trò | File chủ sở hữu |
|---|---|---|
| Câu hỏi cần thử | Nhóm định nghĩa input và edge case | `config/test_cases.json` — Role 1 |
| Tool deterministic | Trả dữ liệu hoặc lỗi đọc được | `src/tools.py` — Role 2 |
| Prompt và phanh | Quy định format, số vòng tối đa | `src/prompts.py` — Role 3 |
| Entrypoint | Ghép và chạy nghiệm thu | `src/app.py` — Role 4 |
| Trace và quyết định | Lưu so sánh, flowchart | `docs/trace_eval.md` — Role 5 |

---

## 1. Chạy mock app và ký role

**20 phút · mốc 0–20.**

:::goal{title="Môi trường chạy được ở mock mode, mỗi người sở hữu một file"}
Bạn chạy được demo mà không cần API key và nhóm đã điền tên vào đúng một role trong `docs/PHAN_CONG_CONG_VIEC.md`.
:::

**Bạn làm:**

1. Clone hoặc fork repo, rồi mở terminal ở thư mục gốc.
2. Tạo `.env` từ `.env.example`, đặt `LLM_PROVIDER=mock`; đây là KHÔNG COMMIT vì `.gitignore` đã chặn `.env`.
3. Cài dependency và chạy smoke run.
4. Cả nhóm điền tên vào bảng role, một người chỉ sở hữu một file.

:::os
```bash tab="macOS / Linux"
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
python src/app.py
```
```powershell tab="Windows"
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python src/app.py
```
:::

Kết quả đúng: terminal có các dòng sau; tên provider có thể là `MockProvider`.

```text
Đã tải thành công 5 Test Cases
DEMO 1: CHẠY TRÊN CHATBOT BASELINE
DEMO 2: CHẠY TRÊN REACT AGENT
Observation: Thời tiết Hà Nội: 28°C, Nắng nhẹ, Độ ẩm 65%.
```

:::checkpoint{title="Hoàn thành khi"}
[ ] `python src/app.py` in `Đã tải thành công 5 Test Cases`
[ ] `.env` tồn tại nhưng `git status --short` không liệt kê nó
[ ] Bảng role có đúng một tên cho mỗi file chủ sở hữu
[ ] Bạn giải thích được vì sao mock mode giúp tách lỗi setup khỏi lỗi API key
:::

:::caution{title="Troubleshooting — Vấn đề thường gặp"}
`ModuleNotFoundError: No module named 'dotenv'`
→ **Mindset**: Python đang chạy chưa có dependency của repo, không phải `src/app.py` sai.
→ Activate `.venv`, rồi chạy lại `python -m pip install -r requirements.txt`.
:::

---

## 2. Chốt test case và tool contract

**30 phút · mốc 20–50.**

:::goal{title="Tool trả data hoặc lỗi có chủ đích, test case có đường kiểm"}
Bạn kiểm được tool trước khi ghép agent và Role 1, 2 đã bàn giao đúng file cho Role 4.
:::

Một tool giống quầy tra cứu: input thiếu hoặc sai thì quầy phải trả lời cách sửa, không đóng cửa cả hệ thống. [Contract](#glossary "Cam kết về input, output và cách xử lý lỗi của một hàm.") của `get_weather` và `search_flights` đã có sẵn trong `src/tools.py`.

**Bạn làm:**

1. Role 1 đọc `config/test_cases.json`, bảo đảm nhóm có câu đơn, câu nhiều dữ kiện và một câu bẫy.
2. Role 2 kiểm `get_weather` với Hà Nội và địa điểm không tồn tại; chỉ sửa `src/tools.py` khi output lỗi không còn đọc được.
3. Role 2 kiểm `AVAILABLE_TOOLS` có đủ hai tool mà `src/app.py` import.
4. Role 1 và 2 commit file của mình; Role 4 pull trước khi ghép.

```bash
python -c "from src.tools import AVAILABLE_TOOLS, get_weather, search_flights; print(sorted(AVAILABLE_TOOLS)); print(get_weather('Hà Nội')); print(get_weather('Atlantis')); print(search_flights('TP.HCM', 'Hà Nội').splitlines()[0])"
```

Kết quả đúng:

```text
['get_weather', 'search_flights']
Thời tiết Hà Nội: 28°C, Nắng nhẹ, Độ ẩm 65%.
LỖI: Không tìm thấy dữ liệu thời tiết cho địa điểm 'Atlantis'.
Chuyến bay từ TP.HCM -> Hà Nội ngày mai:
```

| Từ | Đến | Bàn giao | Điều kiện nhận |
|---|---|---|---|
| Role 1 | Role 4 | `config/test_cases.json` | JSON mở được, có 5 case |
| Role 2 | Role 4 | `src/tools.py` | Lệnh validation in đủ 4 dòng |
| Role 3 | Role 4 | `src/prompts.py` | Có `REACT_SYSTEM_PROMPT` và `MAX_ITERATIONS` |
| Role 5 | Cả nhóm | `docs/trace_eval.md` | Có chỗ ghi baseline và agent trace |

:::checkpoint{title="Hoàn thành khi"}
[ ] Validation in `['get_weather', 'search_flights']`
[ ] Input `Atlantis` trả chuỗi bắt đầu bằng `LỖI:` thay vì exception
[ ] Role 1 và Role 2 đã push file của mình trước khi Role 4 ghép app
[ ] Bạn giải thích được vì sao tool lỗi phải trả dữ liệu đọc được thay vì làm app crash
:::

---

## 3. Ghép prompt và ReAct loop

**45 phút · mốc 50–95.**

:::goal{title="Application chèn Observation, guardrail chặn được vòng lặp"}
Bạn nhìn thấy trace theo thứ tự Thought → Action → Observation → Final Answer và biết phanh nằm ở đâu.
:::

Model không được tự viết Observation, giống như nhân viên không được tự ghi kết quả xét nghiệm. `src/app.py` là nơi gọi `get_weather`, nhận data thật rồi in Observation; `src/prompts.py` giữ format và `MAX_ITERATIONS`.

**Bạn làm:**

1. Role 3 đọc `REACT_SYSTEM_PROMPT` và `MAX_ITERATIONS` trong `src/prompts.py`; giữ tên constant vì `src/app.py` import trực tiếp.
2. Role 4 pull các commit, chạy app và trích bốn dòng trace vào `docs/trace_eval.md`.
3. Role 5 so sánh Action với hàm trong `AVAILABLE_TOOLS`; Action không có trong registry phải là lỗi.
4. Cả nhóm kiểm integration gate bằng lệnh dưới đây.

```bash
python src/app.py | grep -E 'Thought:|Action:|Observation:|Final Answer:|GUARDRAIL'
```

Kết quả đúng:

```text
Thought: Câu hỏi này cần tra cứu thời tiết thời gian thực.
Action: get_weather['Hà Nội']
Observation: Thời tiết Hà Nội: 28°C, Nắng nhẹ, Độ ẩm 65%.
Final Answer: Thời tiết Hà Nội hôm nay 28°C, nắng nhẹ.
```

:::caution{title="Khi dùng Windows"}
`grep is not recognized as an internal or external command`
→ **Mindset**: app vẫn có thể chạy; chỉ lệnh lọc output khác shell của bạn.
→ Chạy `python src/app.py` không kèm `grep`, rồi tìm bốn nhãn bằng mắt trong terminal.
:::

:::checkpoint{title="Hoàn thành khi"}
[ ] Trace có đủ `Thought`, `Action`, `Observation`, `Final Answer` theo đúng thứ tự
[ ] Role 4 là người duy nhất sửa `src/app.py` sau khi pull các file bàn giao
[ ] `MAX_ITERATIONS` có giá trị số dương trong `src/prompts.py`
[ ] Bạn giải thích được vì sao Observation phải do application chèn, không phải do model tự sinh
:::

---

## 4. So sánh hai đường trả lời

**30 phút · mốc 95–125.**

:::goal{title="Báo cáo chỉ ra được câu nào cần agent và bằng chứng nào hỗ trợ kết luận"}
Bạn có baseline và agent trace cạnh nhau trong `docs/trace_eval.md`, không chỉ một câu trả lời nghe hợp lý.
:::

**Bạn làm:**

1. Role 5 mở `docs/trace_eval.md`, ghi cùng câu hỏi cho hai đường: chatbot và ReAct Agent.
2. Đánh dấu liệu output có Observation từ tool hay chỉ là trả lời từ model.
3. Cả nhóm chọn một case: Q&A không cần dữ liệu ngoài, hoặc cần thời tiết/chuyến bay hiện tại.
4. Role 5 commit report; Role 4 chạy lại smoke run sau khi merge.

| Tình huống | Chọn gì | Lý do kiểm được |
|---|---|---|
| Giải thích khái niệm đã biết | Chatbot | Không cần dữ liệu hay action ngoài app |
| Cần thời tiết hoặc chuyến bay | ReAct Agent | Trace phải có Observation từ tool |
| Tool trả lỗi | ReAct Agent với fallback | Agent có dữ liệu lỗi để hỏi lại hoặc từ chối |

```bash
python -c "from src.tools import get_weather; print(get_weather('Hà Nội')); print(get_weather('Atlantis'))"
```

Kết quả đúng:

```text
Thời tiết Hà Nội: 28°C, Nắng nhẹ, Độ ẩm 65%.
LỖI: Không tìm thấy dữ liệu thời tiết cho địa điểm 'Atlantis'.
```

:::checkpoint{title="Hoàn thành khi"}
[ ] `docs/trace_eval.md` có một baseline và một agent trace cho cùng câu hỏi
[ ] Report phân biệt được câu trả lời có Observation và câu trả lời không có Observation
[ ] Nhóm chọn một case chatbot đủ và một case cần agent
[ ] Bạn giải thích được vì sao câu trả lời mượt không tự chứng minh nó grounded
:::

---

## 5. Chốt flowchart và nộp bài

**25 phút · mốc 125–150.**

:::goal{title="Artifacts đủ, flowchart nêu được quyết định, repo không lộ secret"}
Bạn có một flowchart có thể đọc được và repo sẵn sàng push.
:::

**Bạn làm:**

1. Role 5 tạo FILE MỚI `docs/hybrid_flowchart.mermaid`; thư mục `docs/` đã có. Vẽ tối thiểu node `Question`, `Chatbot`, `ReAct Agent`, `Tool`, `Observation`, `Fallback`.
2. Role 4 chạy app một lần cuối sau khi pull toàn bộ commit.
3. Cả nhóm chạy security check, review artifacts, rồi push.

```bash
git status --short
git check-ignore .env
```

Kết quả đúng: `git status --short` không có `.env`; lệnh thứ hai in `.env` để xác nhận file bị ignore.

```text
.env
```

### Checklist artifacts bắt buộc

- [ ] [config/test_cases.json](../config/test_cases.json) — 5 test case có câu đơn, nhiều dữ kiện và edge case
- [ ] [src/tools.py](../src/tools.py) — tool contract trả data hoặc chuỗi lỗi
- [ ] [src/prompts.py](../src/prompts.py) — ReAct prompt và `MAX_ITERATIONS`
- [ ] [src/app.py](../src/app.py) — integration trace chạy được
- [ ] [docs/trace_eval.md](trace_eval.md) — so sánh baseline và agent có bằng chứng
- [ ] `docs/hybrid_flowchart.mermaid` — FILE MỚI: quyết định chatbot hay agent
- [ ] `docs/PHAN_CONG_CONG_VIEC.md` — tên owner và handoff của nhóm

```bash
git add config src docs
git commit -m "Day03 lab: chatbot vs ReAct agent"
git push origin main
```

Kết quả đúng: terminal báo branch đã được push; repo trên GitHub có đủ 7 artifacts trong checklist.

:::checkpoint{title="Hoàn thành khi"}
[ ] `git check-ignore .env` in `.env`
[ ] `docs/hybrid_flowchart.mermaid` có node chatbot, agent, tool và fallback
[ ] `git push origin main` hoàn thành không lỗi
[ ] Bạn trả lời được câu hỏi trọng tâm bằng một điều kiện cần dữ liệu/action ngoài app
:::

:::caution{title="Security check"}
`.env` xuất hiện trong `git status --short`
→ **Mindset**: ignore chỉ chặn file chưa được Git theo dõi; nếu đã add trước đó, Git vẫn giữ nó.
→ Chạy `git rm --cached .env`, kiểm tra lại file không chứa key thật rồi commit; key đã lộ phải revoke ở provider.
:::

> Nộp trace và quyết định dựa trên artifact trong repo. Không nộp một output mà nhóm không giải thích được nó đến từ tool, prompt hay application.
