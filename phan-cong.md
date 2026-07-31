# Phân công công việc — Nhóm BrainStormers (5 người)

> **Dự án**: AI Learning Bridge Agent — VLearn  
> **Thời lượng**: 1,5 ngày (build + demo)  
> **Nguyên tắc**: Mỗi người phải giải thích được phần có tên mình (vibe-coding rule, kiểm tra tại CP5)

---

## Tổng quan vai trò

| Vai trò | Thành viên | Trách nhiệm chính | File chịu trách nhiệm |
|---|---|---|---|
| 🔍 **Evidence Lead** | Người 1 | Mining data + Khảo sát | `spec.md` §1–§2, log mining |
| 📐 **Spec & Design Lead** | Người 2 | Thiết kế giải pháp + Viết spec | `spec.md` §3–§6, `demo-slides.pdf` |
| 💻 **Build Lead** | Người 3 | Code prototype + Tích hợp AI | `codebase/` |
| 🧪 **Eval & Prompt Lead** | Người 4 | Golden set + Prompt engineering | `eval/`, `spec.md` §7 |
| 👥 **Validation & Demo Lead** | Người 5 | User test + Demo prep + Repo | `validation/`, `demo-slides.pdf`, repo structure |

---

## Chi tiết từng người

### 🔍 Người 1 — Evidence Lead
**Mục tiêu**: Thu thập bằng chứng đạt chuẩn A và/hoặc B

#### Công việc cụ thể

| # | Việc | Deadline | Output | Điểm rubric liên quan |
|---|---|---|---|---|
| 1.1 | Mining chatlog: đếm số hội thoại liên quan đến "ôn lại buổi cũ", phân tích `day_code` cross-day | Trước CP1 (mầm), hoàn thiện trước CP4 | Số đếm + phương pháp + ≥5 ví dụ nguyên văn | R1: 6đ (evidence) |
| 1.2 | Khảo sát ≥20 học viên ngoài nhóm: "Lần gần nhất bạn bắt đầu buổi mới, bạn có nhớ buổi trước dạy gì? Mất bao lâu để ôn lại?" | Song song với mining, xong trước CP4 | Log đầy đủ câu hỏi + từng câu trả lời nguyên văn, ≥50% xác nhận | R1: 6đ (evidence) |
| 1.3 | Viết pain cụ thể (ai — đang làm gì — vướng đâu — hậu quả) vào spec §1 | CP1 (nháp), CP4 (chốt) | 1 đoạn trong spec.md §1 | R1: 3đ (pain) |
| 1.4 | Hoàn thiện bảng impact ≥3 ứng viên + ứng viên loại vào spec §2 | Trước CP4 | Bảng trong spec.md §2 | R1: 6đ (impact) |

#### Kỹ năng cần
- Python/Excel để phân tích CSV chatlog
- Kỹ năng phỏng vấn (hỏi "lần gần nhất", KHÔNG hỏi "bạn có cần tính năng X không")

#### File chịu trách nhiệm
```
spec.md §1–§2
evidence/mining_log.md (tạo thêm nếu cần)
evidence/survey_log.md (tạo thêm nếu cần)
```

---

### 📐 Người 2 — Spec & Design Lead
**Mục tiêu**: Thiết kế giải pháp rõ ràng, spec đầy đủ 9 phần

#### Công việc cụ thể

| # | Việc | Deadline | Output | Điểm rubric liên quan |
|---|---|---|---|---|
| 2.1 | Nghiên cứu 2 giải pháp tương tự (NotebookLM + Khanmigo/ChatGPT study mode) | Trước CP2 | spec.md §3 (mỗi sản phẩm: flow, đáng học, đáng né, mình khác gì) | — |
| 2.2 | Viết lát cắt 1 câu + non-goals + automation + lý do cost-of-error | CP1 (nháp), CP4 (chốt) | spec.md §4 | R2: 9đ |
| 2.3 | Khai báo ≥4 nguyên tắc HAX/PAIR + vị trí áp dụng cụ thể | Trước CP4 | spec.md §4b | R2: 6đ |
| 2.4 | Cụ thể hóa 4 lớp chỗ khó + ≥8 kịch bản rủi ro | Trước CP4 | spec.md §5 | R3: 8đ |
| 2.5 | Viết 4 đường đi trải nghiệm | Trước CP4 | spec.md §6 | R3: 3đ |
| 2.6 | Review spec tổng thể, đảm bảo đủ §1–§9 | **23:59 N1** (hạn cứng) | spec.md commit | — |

#### Kỹ năng cần
- Tư duy sản phẩm (PAIR framework, cost-of-error analysis)
- Viết rõ ràng, có cấu trúc

#### File chịu trách nhiệm
```
spec.md §3–§6, §9 (changelog)
problem-statement.md (tham khảo)
```

---

### 💻 Người 3 — Build Lead
**Mục tiêu**: Prototype chạy end-to-end, ≥1 lời gọi AI thật

#### Công việc cụ thể

| # | Việc | Deadline | Output | Điểm rubric liên quan |
|---|---|---|---|---|
| 3.1 | Dựng flow chính (UI skeleton) — bấm đi hết được | **CP2** | Prototype Sketch/Mock | R5: 3đ |
| 3.2 | Tích hợp LLM API (Gemini/Claude) cho recap & bridge | **CP3** | Lời gọi AI thật, log/trace trong repo | R5: 3đ |
| 3.3 | Xử lý input: load transcript/slide → chunk → đưa vào prompt | Trước CP3 | `codebase/src/` | — |
| 3.4 | Xử lý output: parse response → hiển thị recap + bridge + checklist | Trước CP3 | `codebase/src/` | — |
| 3.5 | Implement 4 đường đi (happy / low-confidence / failure / correction) | Trước CP5 | Prototype demo được | R3: 3đ (trải nghiệm) |
| 3.6 | Mock phần knowledge map visualization (Mermaid/HTML tĩnh) | Trước CP5 | UI mock | R5: 2đ |
| 3.7 | Tạo backup demo (screenshot/video ngắn) phòng live hỏng | Trước CP6 | File backup | — |

#### Kỹ năng cần
- API call (Python requests / JS fetch)
- UI cơ bản (HTML/CSS hoặc v0.dev / Lovable)
- Quản lý .env (KHÔNG commit API key)

#### File chịu trách nhiệm
```
codebase/
├── src/           ← toàn bộ source code
├── prompts/       ← phối hợp với Người 4
├── outputs/       ← log/trace các lần gọi AI
└── README.md
```

---

### 🧪 Người 4 — Eval & Prompt Lead
**Mục tiêu**: Golden set chất lượng + prompt tối ưu + quality bar

#### Công việc cụ thể

| # | Việc | Deadline | Output | Điểm rubric liên quan |
|---|---|---|---|---|
| 4.1 | Viết system prompt + prompt template cho recap & bridge | Trước CP3 | `codebase/prompts/` | — |
| 4.2 | Xây golden set ≥20 case (cơ cấu: 8–10 thường + ≥2 case/lớp + 2–4 hiếm + ≥10 từ chatlog) | **CP3** | `eval/golden_set.csv` | R4: 4đ |
| 4.3 | Định nghĩa chiều chất lượng: đúng có căn cứ / đúng cỡ / an toàn / trích dẫn | Trước CP3 | `eval/README.md` | R4: 4đ |
| 4.4 | Chạy golden set lượt đầu, ghi bảng % (2 người chấm độc lập case khó) | **CP3** | Bảng kết quả lượt 1 | R4: 4đ |
| 4.5 | Lặp: chọn failure đau nhất → sửa prompt → chạy lại trọn bộ | CP3 → CP5 | Bảng kết quả các lượt + phân tích | R4: 4đ |
| 4.6 | Chốt quality bar (bằng số) vào spec §7 | **23:59 N1** | Con số trong spec.md §7 | R4: 3đ |

#### Kỹ năng cần
- Prompt engineering
- Đánh giá output LLM (chấm pass/fail có hệ thống)
- Phối hợp chặt với Người 3 (prompt ↔ code)

#### File chịu trách nhiệm
```
eval/
├── golden_set.csv (hoặc .json)
├── results_round_1.md
├── results_round_N.md
└── README.md

codebase/prompts/
├── system_prompt.md
├── recap_prompt.md
└── bridge_prompt.md

spec.md §7
```

---

### 👥 Người 5 — Validation & Demo Lead
**Mục tiêu**: User test ≥5 người + Slide 6 trang + Demo mượt

#### Công việc cụ thể

| # | Việc | Deadline | Output | Điểm rubric liên quan |
|---|---|---|---|---|
| 5.1 | Tìm ≥3 willing users (khai tên cụ thể từ CP1) | **CP1** | Tên trong spec §8 | R6: 4đ |
| 5.2 | Chạy vòng validation ≥5 người (10 phút/người, 3 câu hỏi, log nguyên văn) | **CP5** | `validation/feedback_log.md` | R6: 4đ |
| 5.3 | Tổng hợp feedback → ghi ≥1 thay đổi vào Changelog (hoặc giữ nguyên + lý do) | **CP5** | spec.md §9 | R6: 4đ |
| 5.4 | Soạn slide 6 trang (theo guide §5.1 — mỗi slide ≥1 con số/quote có nguồn) | Trước CP5 | `demo-slides.pdf` | — |
| 5.5 | Phân vai trình bày (mỗi thành viên nói ≥1 phần) + dry run bấm giờ | **CP5** | Demo script | — |
| 5.6 | Đảm bảo repo đủ cấu trúc chuẩn (README + phân công + đủ thư mục) | Xuyên suốt | Repo | R7: 3đ |
| 5.7 | Chuẩn bị case lỗi live cho demo (case chỗ khó xử lý được) | Trước CP6 | 1 case live | — |

#### Kỹ năng cần
- Giao tiếp, phỏng vấn user (im lặng quan sát, không gợi ý)
- Presentation skills
- Quản lý repo/git

#### File chịu trách nhiệm
```
validation/
├── feedback_log.md
└── README.md

demo-slides.pdf
README.md (phần phân công)
reflection/ (nhắc mọi người viết)
```

---

## Timeline theo checkpoint (K4)

```
═══════════════════════════════════════════════════════════════════════════
  NGÀY 1
═══════════════════════════════════════════════════════════════════════════

  14:00  Khai mạc + phát đề
         ├── Cả nhóm: đọc đề, thống nhất hướng A, phân công
         └── Người 5: khai ≥3 willing users

  15:00  CP1 · Chốt Canvas
         ├── Người 1: evidence ban đầu (1-2 mầm mining)
         ├── Người 2: lát cắt 1 câu + automation dự kiến
         ├── Người 5: tên willing users + phân công
         └── Show: Canvas 7 dòng

  15:00–17:00  Build sprint 1
         ├── Người 1: mining chatlog (đếm pattern cross-day)
         ├── Người 2: nghiên cứu giải pháp tương tự
         ├── Người 3: dựng UI skeleton (flow bấm đi hết)
         ├── Người 4: viết system prompt + prompt template
         └── Người 5: bắt đầu khảo sát học viên

  17:00  CP2 · Show được thứ bấm được
         └── Người 3: prototype Sketch/Mock bấm hết flow

  17:00–22:00  Build sprint 2
         ├── Người 1: hoàn thiện mining + khảo sát
         ├── Người 2: viết spec §3-§6 (chỗ khó, kịch bản)
         ├── Người 3: tích hợp LLM API thật
         ├── Người 4: xây golden set ≥20 case
         └── Người 5: tiếp tục khảo sát + bắt đầu soạn slide

  ⚠️ 23:59  HẠN CỨNG — spec.md commit
         ├── Người 2: review spec tổng thể §1-§9
         ├── Người 4: chốt quality bar bằng số
         └── Người 1: evidence chốt vào §1-§2

═══════════════════════════════════════════════════════════════════════════
  NGÀY 2
═══════════════════════════════════════════════════════════════════════════

  08:00–10:30  Build sprint 3
         ├── Người 3: fix bug + implement 4 đường đi
         ├── Người 4: chạy golden set lượt đầu + lặp sửa prompt
         └── Người 5: khảo sát bổ sung nếu cần

  10:30  CP3 · AI chạy thật + đo lượt đầu
         ├── Người 3: lời gọi AI thật ở quyết định trung tâm
         ├── Người 4: bảng kết quả lượt 1 có %
         └── Golden set đủ case khó

  10:30–12:00  Polish
         ├── Người 3: mock knowledge map + backup demo
         ├── Người 4: lặp prompt → chạy lại golden set
         └── Người 2: cập nhật spec nếu cần

  12:00  CP4 · Chốt tiến độ

  12:00–14:00  Validation sprint
         ├── Người 5: chạy validation ≥5 người
         ├── Người 5: ghi feedback log + tổng hợp
         ├── Người 2: ghi changelog từ feedback
         └── Cả nhóm: soạn slide + dry run

  14:00  CP5 · Xác minh + validation + dry run
         ├── Feedback log ≥5 có tên
         ├── Slide final
         ├── Dry run bấm giờ
         └── Kiểm tra: mỗi người giải thích được phần mình

  15:00  CP6 · DEMO
         └── 5' trình bày + 5' Q&A
             Mỗi thành viên nói ≥1 phần
```

---

## Ma trận trách nhiệm (RACI)

| Deliverable | Người 1 | Người 2 | Người 3 | Người 4 | Người 5 |
|---|---|---|---|---|---|
| **Evidence (mining + khảo sát)** | **R** | C | — | — | **A** (khảo sát) |
| **spec.md §1–§2** | **R** | A | — | — | — |
| **spec.md §3–§6** | I | **R** | C | C | — |
| **spec.md §7** | — | I | — | **R** | — |
| **Prototype (codebase/)** | — | C | **R** | **A** (prompt) | — |
| **Golden set (eval/)** | C | — | — | **R** | — |
| **Validation (validation/)** | — | — | — | — | **R** |
| **Demo slides** | I | **A** | I | I | **R** |
| **Repo structure** | — | — | — | — | **R** |
| **Reflection (mỗi người)** | **R** | **R** | **R** | **R** | **R** |

> **R** = Responsible (làm) · **A** = Accountable (cùng làm/phụ trách) · **C** = Consulted · **I** = Informed

---

## Slide 6 trang — Phân vai trình bày

| Slide | Nội dung (45"–2') | Ai nói |
|---|---|---|
| 1 | User & Job — pain + evidence | **Người 1** |
| 2 | Vì sao chọn tính năng này — bảng impact | **Người 2** |
| 3 | Giải pháp & demo live — 1 case chuẩn + 1 case chỗ khó | **Người 3** + **Người 4** |
| 4 | Kết quả đo — % vs quality bar + failure đáng kể | **Người 4** |
| 5 | User thật nói gì — ≥2 quote + thay đổi | **Người 5** |
| 6 | Nếu có thêm 1 tuần + bài học | **Người 2** |

---

## Lưu ý quan trọng

> [!WARNING]
> **23:59 ngày 1** là hạn cứng commit spec.md. Quality bar chốt từ thời điểm này và KHÔNG được đổi sau.

> [!IMPORTANT]
> **Vibe-coding rule**: Dùng AI build thoải mái, nhưng bị hỏi tại CP5/CP6 mà không giải thích được phần có tên mình → 0 điểm phần đó.

> [!CAUTION]
> **Bảo mật data**: KHÔNG commit data pack vào repo. KHÔNG commit API key. Key để biến môi trường (.env).
