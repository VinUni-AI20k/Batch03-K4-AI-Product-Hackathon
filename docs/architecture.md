# 🏗️ Kiến trúc hệ thống — Vlearn Agent

> **Vlearn Agent** là trợ giảng AI cá nhân, open-source, self-host. Học viên chat qua Telegram/Discord, gửi tài liệu học tập, và agent trả lời có trích nguồn dựa trên giáo trình thực tế.

---

## Tổng quan kiến trúc

```
 ┌─────────────────────────────────────────────────────────────────────┐
 │                        NGUỒN BÀI HỌC                               │
 │  slide / PDF / PPTX · video · ghi âm · ghi chú .md · link GitHub  │
 └──────────────┬──────────────────────────────────────────────────────┘
                │ (thư mục source_mirror/ hoặc gửi file qua chat)
                ▼
 ┌──────────────────────────┐
 │     INGEST PIPELINE      │   Docling (slide/PDF) · PhoWhisper (ASR)
 │  ingest/                 │   dHash keyframe · align transcript↔slide
 └──────────────┬───────────┘   structurer (LLM → markdown chuẩn)
                ▼
 ┌──────────────────────────┐         ┌──────────────────────────┐
 │      VAULT (Obsidian)    │◄───────►│     INDEX (Vector DB)    │
 │  vault/                  │  đồng   │  index/                  │
 │  ├── courses/            │   bộ    │  Voyage AI embeddings    │
 │  ├── concepts/           │         │  ChromaDB store          │
 │  ├── students/           │         │  manifest.sqlite (hash)  │
 │  └── MEMORY.md           │         └──────────────────────────┘
 └──────────────────────────┘
              source of truth                   phái sinh (reindex được)

                                   ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │                        VLEARN AGENT (CORE)                           │
 │  agent/                                                               │
 │  ├── core.py      — tool-calling loop (OpenAI-compatible)            │
 │  ├── tools.py     — RAG search, vault r/w, scheduler, addons…        │
 │  ├── skills.py    — load & inject SKILL.md vào system prompt         │
 │  ├── memory.py    — đọc/ghi hồ sơ học viên + MEMORY.md              │
 │  ├── sessions.py  — lịch sử hội thoại FTS5 (SQLite)                 │
 │  └── subagent.py  — chạy skill trong phiên riêng (scheduler)        │
 └──────────────┬────────────────────────────────────────────────────────┘
                │
      ┌─────────┴──────────┐
      ▼                    ▼
 ┌──────────┐        ┌──────────────────────────────────┐
 │ GATEWAY  │        │  ADDONS & INTEGRATIONS           │
 │ gateway/ │        │  addons/       — plugin Python   │
 │ Telegram │        │  integrations  — CLI ecosystem   │
 │ Discord  │        │  maton.py      — MCP/Google WS   │
 │ allowlist│        │  research.py   — web/Reddit/GH   │
 │ rate lim │        └──────────────────────────────────┘
 └────┬─────┘
      │
 ┌────┴───────────────────────────────────┐
 │  SCHEDULER                scheduler.py │
 │  cron 60s · phiên subagent riêng       │
 │  nhắc hẹn · báo cáo hằng ngày         │
 └────────────────────────────────────────┘
      │
 ┌────┴───────────────────────────────────┐
 │  WEBUI DASHBOARD           webui/      │
 │  FastAPI + HTML · localhost:8321       │
 │  quản trị, trace, logs, config        │
 └────────────────────────────────────────┘
```

---

## Các lớp kiến trúc chi tiết

### 1. Ingest Pipeline (`ingest/`)

Xử lý đầu vào đa phương tiện thành markdown chuẩn để lưu vào vault.

| Thành phần | Chức năng |
|---|---|
| **Docling** | Chuyển slide PDF/PPTX → markdown (trích speaker notes) |
| **PhoWhisper** (faster-whisper) | ASR tiếng Việt: video/ghi âm → transcript |
| **dHash keyframe** | Trích keyframe video, match với trang slide tương ứng |
| **structurer** | LLM tóm tắt + cấu trúc hoá bài giảng → markdown cuối cùng |
| **manifest.sqlite** | Theo dõi hash file, chỉ ingest lại khi thay đổi (incremental) |

### 2. Vault — Source of Truth (`vault/`)

Kho lưu trữ dạng Markdown tương thích Obsidian. Toàn bộ kiến thức và dữ liệu người dùng được lưu dưới dạng plain text.

```
vault/
├── courses/      ← bài học (máy sinh, safe to regenerate)
│   └── <khoá>/<module>/<bài>.md
├── concepts/     ← khái niệm cốt lõi (agent/người viết, không bị ghi đè)
├── students/     ← hồ sơ học viên (agent tự ghi: điểm yếu, mục tiêu, tiến độ)
│   └── <user_id>.md
└── MEMORY.md     ← bộ nhớ chung: lịch thi, quy ước khoá học
```

> **Nguyên tắc thiết kế**: `courses/` (máy sinh) tách khỏi `concepts/` + `students/` (tri thức tích luỹ) để cập nhật bài học an toàn không ghi đè kiến thức đã xây dựng.

### 3. Index Layer (`index/`)

ChromaDB làm vector store, là **phái sinh** của vault — có thể rebuild lại bất kỳ lúc nào bằng `learning-agent reindex`.

| Thành phần | Chi tiết |
|---|---|
| **Voyage AI** (`voyage-context-3`) | Embedding contextualized: embed chunk theo ngữ cảnh toàn bài → đặc biệt hiệu quả với slide rời rạc |
| **ChromaDB** | Persistent vector store, collection `lessons` |
| **Provenance** | Mỗi chunk mang metadata: `course / lesson / slide / timestamp` → agent trích nguồn chính xác |
| **Fallback** | Nếu không có Voyage key → dùng embedding local mặc định của ChromaDB |

### 4. Agent Core (`agent/`)

Vòng lặp tool-calling theo chuẩn OpenAI function-calling. Agent nhận câu hỏi, lên kế hoạch, gọi tools, tổng hợp câu trả lời.

```
Nhận message
    │
    ▼
Inject: SOUL.md (nhân cách) + MEMORY.md + hồ sơ học viên + skill phù hợp
    │
    ▼
LLM reasoning → chọn tool
    │
    ├── search_vault()     — RAG semantic search trên ChromaDB
    ├── read_note()        — đọc note cụ thể trong vault
    ├── write_student()    — ghi hồ sơ học viên
    ├── schedule_task()    — đặt lịch nhắc/báo cáo
    ├── use_addon()        — gọi addon (wikipedia, custom…)
    ├── use_cli()          — gọi CLI ecosystem (gog/m365/Maton)
    └── web_search()       — tìm kiếm web/Reddit/GitHub
    │
    ▼
Tổng hợp → trả lời kèm 📖 trích nguồn (course/lesson/slide/phút video)
```

**Memory 3 tầng:**
- 🗂️ **Hồ sơ học viên** — `vault/students/<id>.md`: agent tự ghi, persist xuyên phiên
- 📋 **Bộ nhớ chung** — `vault/MEMORY.md`: nạp vào mỗi lượt chat
- 🔍 **Session search** — `data/sessions.db` (SQLite FTS5): toàn bộ hội thoại, tìm kiếm được

### 5. Skills System (`skills/`)

16 kỹ thuật học tập được chứng minh khoa học, chuẩn [agentskills.io](https://agentskills.io). Mỗi skill là một thư mục chứa `SKILL.md` — **không cần sửa code** để thêm skill mới.

| Skill | Kỹ thuật |
|---|---|
| `tao-quiz` | Active recall quiz |
| `the-ghi-nho` | Spaced repetition flashcard |
| `van-dap-active-recall` | Vấn đáp active recall |
| `feynman` | Kỹ thuật Feynman (giải thích lại) |
| `hoi-vi-sao` | Elaborative interrogation |
| `so-do-khai-niem` | Concept map |
| `tom-tat-bai` | Tóm tắt bài giảng |
| `nghien-cuu` | Nghiên cứu chuyên sâu |
| `nhat-ky-loi-sai` | Error log |
| `on-thi-mock-test` | Practice testing |
| `tron-bai-interleaving` | Interleaving (trộn bài) |
| `phien-hoc-tap-trung` | Pomodoro focus session |
| `tu-danh-gia-tuan` | Metacognition weekly review |
| `xay-tu-dien-thuat-ngu` | Glossary builder |
| `lo-trinh-on-tap` | Learning path planner |
| `bao-cao-hang-ngay` | Daily report (scheduler) |

### 6. Gateway (`gateway/`)

Một process duy nhất phục vụ cả Telegram và Discord.

- **Allowlist fail-closed**: danh sách `TELEGRAM_ALLOWED_USERS` / `DISCORD_ALLOWED_USERS` — rỗng = ai cũng dùng được (có cảnh báo khi khởi động)
- **Rate limit per user**: mặc định 10 tin nhắn/phút, chống spam và đội chi phí LLM
- **File inbox**: học viên gửi file PDF/PPTX/audio/video thẳng qua chat → ingest pipeline (có xác nhận trước khi nạp)

### 7. Scheduler (`scheduler.py`)

Cron tick mỗi 60 giây. Mỗi job chạy một **phiên subagent riêng** với skill được chỉ định, kết quả gửi về home chat (đặt bằng `/sethome`).

### 8. Web UI Dashboard (`webui/`)

FastAPI + HTML, bind `127.0.0.1:8321` — truy cập từ xa qua SSH tunnel.

| Tab | Chức năng |
|---|---|
| Overview | Trạng thái gateway, model, embedding, thống kê |
| Cron Jobs | Xem/tạo/huỷ scheduled task |
| Logs / Audit | Nhật ký an ninh: user bị chặn, ingest, cài pack/skill |
| Skills | Xem, gỡ, cài từ registry |
| Bài học | Tìm kiếm, đọc, xoá bài học |
| Knowledge Packs | Cài/cập nhật pack từ GitHub |
| Học viên | Hồ sơ memory, xoá (quyền riêng tư) |
| Chat | Hỏi thử agent, xem trace (thought + tool calls) |
| Config | Kênh chat, skill registries, CLIs, addons |

### 9. Addons & Integrations

**Addons** (`addons/`): plugin Python. Tạo file `addons/<tên>.py` với `NAME / DESCRIPTION / TOOLS / handle` → agent có tool mới ngay, không sửa core.

- Addon mẫu: `wikipedia` — tra cứu bổ sung khi giáo trình không có, ghi rõ nguồn

**CLI Ecosystem** (bật qua dashboard):
- `gog` — Google Workspace (Gmail, Drive, Classroom)
- `m365` — Microsoft 365 (Teams, OneDrive, OneNote)
- `Maton` — MCP SaaS (Google Calendar/Meet/Docs/Sheets/Gmail)

---

## Nguyên tắc kiến trúc cốt lõi

| Nguyên tắc | Chi tiết |
|---|---|
| **Vault là source of truth** | Index Chroma là phái sinh, `reindex` rebuild được bất kỳ lúc nào |
| **Provenance xuyên suốt** | Mỗi chunk mang metadata đầy đủ — không bịa, luôn có nguồn |
| **Model-agnostic** | Đổi `LLM_BASE_URL` + `llm.model` → chạy với OpenAI/OpenRouter/Ollama/Groq |
| **Fail-closed security** | Allowlist, whitelist-only cho pack/CLI, chống prompt injection |
| **Extensible by design** | Skill = folder, addon = 1 file Python, không sửa core |
| **Incremental sync** | Manifest hash — chỉ ingest lại file thay đổi |

---

## Stack công nghệ

| Lớp | Công nghệ |
|---|---|
| **LLM** | OpenAI · OpenRouter (Claude/Gemini/Llama) · Groq · Ollama |
| **Embedding** | Voyage AI `voyage-context-3` / embedding local ChromaDB |
| **Vector DB** | ChromaDB |
| **Session DB** | SQLite FTS5 |
| **ASR** | faster-whisper + PhoWhisper (tiếng Việt) |
| **Document parsing** | Docling (PDF/PPTX), python-pptx |
| **Video** | ffmpeg + imagehash (dHash keyframe) |
| **Gateway** | discord.py ≥ 2.4, python-telegram-bot ≥ 21 |
| **Web API** | FastAPI + uvicorn |
| **Web search** | ddgs (DuckDuckGo Search) |
| **Runtime** | Python ≥ 3.11 |
| **Container** | Docker / docker-compose |

---

## Cấu trúc thư mục dự án

```
K4-hackathon-VLAgent-D304/
├── learning-agent/              ← toàn bộ mã nguồn
│   ├── src/learning_agent/
│   │   ├── agent/               — core, tools, skills, memory, sessions, subagent
│   │   ├── ingest/              — Docling, Whisper, dHash, align, structurer
│   │   ├── index/               — manifest, Voyage embeddings, ChromaDB
│   │   ├── gateway/             — base, discord_bot, telegram_bot
│   │   ├── vault/               — vault engine (note, wikilink, backlink, MOC, git)
│   │   ├── updater/             — sync, inbox (file qua chat), packs, selfupdate
│   │   ├── webui/               — dashboard FastAPI + HTML
│   │   ├── scheduler.py
│   │   ├── integrations.py
│   │   ├── addons.py
│   │   └── security.py
│   ├── skills/                  — 16 skill agentskills.io
│   ├── addons/                  — plugin Python (wikipedia mẫu)
│   ├── vault/                   — dữ liệu runtime (gitignore)
│   ├── data/                    — chroma, sessions.db, audit.log
│   ├── SOUL.md                  — nhân cách agent
│   ├── config.yaml              — cấu hình hệ thống
│   └── .env                    — secrets (gitignore)
├── data/                        — dữ liệu hackathon (chatlog, transcript, slide)
└── docs/                        — tài liệu dự án
```
