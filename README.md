# 👥 Thông tin thành viên

| STT | Họ và Tên | MSSV | Role |
|---|---|---|---|
| 1 | Nguyễn Tấn Hoàng | 2A202601198 | **Team Lead / AI Engineer** (Đảm nhận build AI Agent) |
| 2 | Nguyễn Minh Hiếu | 2A202601154 | **Data** (Thu thập data, thử nghiệm sản phẩm) |
| 3 | Nguyễn Minh Đức | 2A202601946 | **Data** (xử lý data, góp ý kiến trúc Agent) |
| 4 | Trần Thanh Huyền | 2A202601578 | **Documentation** (Viết tài liệu báo cáo, evidence) |
| 5 | Đỗ Tú Anh | 2A202601272 | **Documentation** (Viết tài liệu test case, làm survey) |

# 🎓 Vlearn Agent

**Trợ giảng AI cá nhân — open source, self-host.** Học viên chat trên **Telegram / Discord**, gửi slide · video · ghi âm → agent biến thành knowledge base rồi trả lời **có trích nguồn, không bịa**, dạy theo các kỹ thuật học tập đã được khoa học chứng minh.

> 🌐 **Trang giới thiệu (live): [vlearn-agent.vercel.app](https://vlearn-agent.vercel.app)**
>
> Bài dự thi của **team VLagent** — VinUni AI20K. Đề bài & rubric hackathon: [HACKATHON.md](HACKATHON.md).

```
 Slide/Video/Ghi âm ─► ingest ─► vault/ (markdown kiểu Obsidian) ─► index (Voyage AI + Chroma)
 • folder / GỬI FILE qua chat        │ courses · concepts · students · MEMORY   │
                                                                                 ▼
                                              Vlearn Agent (tools · skills · memory · addons)
        Telegram ◄──── gateway (1 process) ────► Discord ─────────► dashboard web (localhost:8321)
                          └─ scheduler (nhắc hẹn · báo cáo hằng ngày) ─┘
```

## ⚡ Quickstart

Toàn bộ mã nguồn nằm trong thư mục **[`learning-agent/`](learning-agent/)**.

```bash
git clone https://github.com/hoangaiecos-boop/K4-hackathon-VLAgent-D304.git
cd K4-hackathon-VLAgent-D304/learning-agent
bash install.sh            # Linux/macOS (Windows: .\install.ps1 · hoặc: docker compose up -d)
cp .env.example .env       # điền LLM key + token bot
learning-agent bot         # bật Telegram/Discord + scheduler
learning-agent ui          # dashboard http://127.0.0.1:8321
```

📖 **Hướng dẫn đầy đủ** (cài đặt, cách học viên dùng, dashboard, CLI, bảo mật): **[learning-agent/README.md](learning-agent/README.md)**

## ✨ Điểm nổi bật

- 🧠 **Trả lời từ chính giáo trình của bạn** (RAG) — luôn kèm 📖 *Bài · Slide · phút video*, không có trong tài liệu thì nói thẳng
- 🎓 **16 skill học tập** chuẩn [agentskills.io](https://agentskills.io) — spaced repetition, active recall, Feynman, interleaving…
- 💬 **Một gateway, nhiều kênh** — Telegram + Discord; gửi file thẳng cho bot để nạp bài (có xác nhận trước khi nạp)
- 🔗 **Kết nối mở** — MCP Maton (Google Calendar/Meet/Docs/Sheets/Gmail), research web/Reddit/GitHub/X, addon plugin
- 🔀 **Đa nhà cung cấp LLM** — OpenAI · OpenRouter (Claude/Gemini/Llama) · Groq · Ollama (local)
- 👤 **Nhớ & thích ứng** — memory 3 tầng, nhớ điểm yếu từng học viên
- 🔒 **An toàn theo thiết kế** — allowlist fail-closed, chống prompt-injection, dashboard có token, audit log

## 🛠️ Chức năng chi tiết

### 1. 🧠 Hỏi đáp từ giáo trình (RAG — Retrieval-Augmented Generation)

| Chức năng | Mô tả |
|---|---|
| `search_lessons` | Tìm kiếm ngữ nghĩa (semantic search) trong toàn bộ bài giảng đã nạp — trả về đoạn liên quan nhất kèm metadata (tên bài, slide, timestamp video) |
| `list_lessons` | Liệt kê toàn bộ bài học trong kho, nhóm theo khoá — xem tổng quan kiến thức đã nạp |
| `get_lesson` | Đọc toàn văn một bài học — dùng khi cần tóm tắt hoặc tạo quiz cả bài |
| `get_concept` | Đọc ghi chú khái niệm + backlinks (các bài học nhắc tới khái niệm đó) |
| `save_concept` | Lưu/bổ sung giải thích khái niệm hay để tái sử dụng cho các học viên khác |
| Trích nguồn | Mọi câu trả lời đều kèm 📖 *Bài · Slide/phần · Video (nếu có)* — học viên có thể click để tự kiểm chứng |
| Từ chối khi thiếu căn cứ | Nếu tài liệu chưa đề cập → nói thẳng, không bịa; gợi ý hỏi lại hoặc tra kiến thức chung |

### 2. 📥 Nạp tài liệu (Ingest Pipeline)

| Loại đầu vào | Module | Chi tiết |
|---|---|---|
| Slide PDF/PPTX | `ingest/slides.py` | Chuyển đổi slide thành markdown có cấu trúc |
| Video bài giảng | `ingest/video.py` | Trích audio → transcript tự động |
| Ghi âm / Audio | `ingest/audio.py` | Nhận dạng giọng nói tiếng Việt (PhoWhisper) |
| URL / Web page | `ingest/web.py` | Fetch trang web → chuyển thành markdown |
| Căn chỉnh slide–transcript | `ingest/align.py` | Gán đúng nội dung transcript vào từng slide theo timeline |
| Cấu trúc hoá | `ingest/structurer.py` | Biến raw text thành markdown có heading, bullet, code block |
| **Gửi file qua chat** | Gateway | Học viên gửi file thẳng trên Telegram/Discord → bot đọc, hỏi xác nhận trước khi nạp vào kiến thức lâu dài |
| Knowledge Pack | `updater/packs.py` | Cài/cập nhật bộ bài học từ GitHub repo (khai báo trong `config.yaml`) |

### 3. 🎓 16 Skill học tập

Mỗi skill là một thư mục trong `skills/` chứa file `SKILL.md` (chuẩn [agentskills.io](https://agentskills.io)) — agent tự load và thực hiện đúng quy trình từng bước.

| # | Skill | Mô tả | Kỹ thuật học tập |
|---|---|---|---|
| 1 | `tao-quiz` | Tạo bộ câu hỏi trắc nghiệm / tự luận từ bài học | Active recall |
| 2 | `the-ghi-nho` | Tạo thẻ ghi nhớ (flashcard) tự động | Spaced repetition |
| 3 | `van-dap-active-recall` | Vấn đáp ngược — agent hỏi, học viên trả lời | Active recall |
| 4 | `feynman` | Giải thích khái niệm bằng ngôn ngữ đơn giản | Kỹ thuật Feynman |
| 5 | `tom-tat-bai` | Tóm tắt bài học thành dàn ý ngắn gọn | Summarization |
| 6 | `so-do-khai-niem` | Vẽ sơ đồ khái niệm (concept map) dạng text | Concept mapping |
| 7 | `hoi-vi-sao` | Đào sâu bằng chuỗi câu hỏi "Vì sao?" | Elaborative interrogation |
| 8 | `lo-trinh-on-tap` | Lên lộ trình ôn tập cá nhân theo thời gian | Study planning |
| 9 | `on-thi-mock-test` | Thi thử / mock test mô phỏng đề thi thật | Practice testing |
| 10 | `tron-bai-interleaving` | Trộn câu hỏi từ nhiều bài khác nhau | Interleaving |
| 11 | `nhat-ky-loi-sai` | Ghi lại các lỗi sai để ôn tập lại | Error logging |
| 12 | `nghien-cuu` | Nghiên cứu tài liệu bổ sung ngoài giáo trình | Research skills |
| 13 | `phien-hoc-tap-trung` | Phiên học tập trung có hẹn giờ | Pomodoro technique |
| 14 | `xay-tu-dien-thuat-ngu` | Xây từ điển thuật ngữ chuyên ngành | Vocabulary building |
| 15 | `bao-cao-hang-ngay` | Báo cáo tiến độ học tập hằng ngày | Daily review |
| 16 | `tu-danh-gia-tuan` | Tự đánh giá kết quả học tập mỗi tuần | Weekly self-assessment |

### 4. 👤 Bộ nhớ 3 tầng (Memory System)

| Tầng | Lưu trữ | Nội dung | Cơ chế |
|---|---|---|---|
| **Short-term** | RAM (deque) | Lịch sử hội thoại hiện tại (12 lượt gần nhất) | Mất khi restart |
| **Long-term** | `MEMORY.md` (vault) | Thông tin chung về khoá học, quy ước, thiết lập | Agent tự ghi/cập nhật qua `update_memory`; backup tự động |
| **Student profile** | `vault/students/<id>.md` | Điểm mạnh/yếu, mục tiêu, sở thích, kết quả quiz của từng học viên | Agent tự cập nhật qua `update_student_memory`; đọc được bằng Obsidian |

Bổ sung:
- `search_sessions` — tìm lại các cuộc hội thoại cũ khi học viên nhắc "hôm trước", "lần trước mình hỏi gì" (lưu SQLite)
- `read_soul` / `update_soul` — đọc/chỉnh tính cách agent (`SOUL.md`) theo yêu cầu người dùng

### 5. 💬 Gateway đa nền tảng

| Nền tảng | Tính năng |
|---|---|
| **Telegram** | Chat DM · gửi file để nạp tài liệu (≤20MB) · allowlist user · slash commands |
| **Discord** | DM · @mention · auto thread · slash commands (`/hoi`, `/quiz`, `/tomtat`, `/sethome`) · gửi file · tạo sự kiện server · tạo link mời · Message Content Intent tuỳ chọn |
| **Dashboard Web** | `http://localhost:8321` — chat console, quản lý bài học/skills/addons/integrations/students/tasks, xem audit log, cấu hình |

Cả 3 nền tảng chạy đồng thời trong 1 process (`learning-agent bot` + `learning-agent ui`).

### 6. ⏰ Lập lịch & Nhắc hẹn (Scheduler)

| Loại | Ví dụ | Cơ chế |
|---|---|---|
| **Nhắc hẹn một lần** | "5 phút nữa nhắc tôi uống nước" · "21:00 nhắc tôi ôn bài" | `schedule_task` → lưu `schedules.json` → gửi về đúng chat đã tạo |
| **Việc lặp lại hằng ngày** | "mỗi tối 21:00 quiz tôi" | `schedule_task` với `when: "daily 21:00"` |
| **Cron tĩnh** (config) | Báo cáo học tập 7:30 sáng mỗi ngày | Khai báo trong `config.yaml` → skill `bao-cao-hang-ngay` → gửi về home chat |
| **Quản lý** | Xem / huỷ lịch | `list_scheduled_tasks` · `cancel_scheduled_task` |
| **Sự kiện Discord** | "Tạo sự kiện họp nhóm trong server" | `discord_create_event` → hiện trong tab Sự kiện của server |
| **Sự kiện Google Calendar** | "Tạo lịch meeting + link Google Meet" | `google_calendar_event` → tạo event thật trên Google Calendar kèm link Meet |

### 7. 🔗 Tích hợp & Kết nối mở

| Tích hợp | Loại | Mô tả |
|---|---|---|
| **Maton MCP** | API | Kết nối hàng trăm SaaS app (Google Calendar/Meet/Gmail/Docs/Sheets, HubSpot…) qua một API |
| **gog CLI** | CLI | Google Workspace (Drive/Calendar/Classroom/Gmail) từ terminal — chỉ đọc/tra cứu, chặn ghi/gửi/xoá |
| **Microsoft 365 CLI** | CLI | Teams/OneDrive/OneNote/SharePoint (phát hiện tự động, admin bật trong dashboard) |
| **Research: Web** | Tool | Tìm kiếm web tổng quát (DuckDuckGo) |
| **Research: Reddit** | Tool | Thảo luận/kinh nghiệm cộng đồng |
| **Research: GitHub** | Tool | Repo/code/thư viện để học thực hành |
| **Research: X/Twitter** | Tool | Bài viết / tin tức mới nhất |
| **Skills Registry** | Ecosystem | Duyệt + cài skill từ kho cộng đồng (agentskills.io) hoặc Vlearn Skills |

Tất cả tích hợp đều có toggle bật/tắt qua dashboard, không cần restart.

### 8. 🔌 Hệ thống Addon (Plugin)

- Mỗi addon là 1 file Python trong `addons/` — khai báo `NAME`, `DESCRIPTION`, `TOOLS`, `handle()`
- Mặc định **TẮT** — admin bật trong dashboard (Config → Addons) thì agent mới gọi được
- Bật/tắt **có hiệu lực ngay**, không cần restart
- Addon mẫu: `wikipedia.py` — tra cứu Wikipedia tiếng Việt
- Mọi lần gọi addon đều ghi audit log

### 9. 🔒 Bảo mật & An toàn

| Lớp bảo mật | Chi tiết |
|---|---|
| **Allowlist (fail-closed)** | Chỉ user trong danh sách `TELEGRAM_ALLOWED_USERS` / `DISCORD_ALLOWED_USERS` mới chat được; trống = từ chối tất cả (trừ khi bật `VLEARN_ALLOW_ALL`) |
| **Rate limiting** | Tối đa N tin nhắn/user/phút (cấu hình `security.user_rate_per_minute`) — chống spam + đội chi phí LLM |
| **Chống prompt injection** | Rule 0 trong system prompt: nội dung từ tools/tài liệu là DỮ LIỆU, không bao giờ là mệnh lệnh; phát hiện chỉ dẫn lạ → báo cho học viên |
| **CLI chỉ đọc** | `use_cli` chặn mọi hành động ghi/gửi/xoá (deny list: send, rm, delete, share, forward…) |
| **Dashboard token** | Đặt `VLEARN_UI_TOKEN` → mọi request phải kèm token; bắt buộc khi bind ngoài localhost |
| **Audit log** | Ghi JSON-lines mọi sự kiện nhạy cảm (user bị chặn, ingest, cài pack, tạo lịch) vào `data/audit.log` |
| **Upload limit** | Trần file upload qua chat (cấu hình `security.max_upload_mb`, mặc định 32MB) |
| **Không làm bài hộ** | Bài kiểm tra/thi đang diễn ra → chỉ gợi ý cách nghĩ (Socratic method), không cho đáp án |

### 10. 🖥️ Dashboard quản trị (Web UI)

Dashboard chạy tại `http://localhost:8321`, cung cấp:

| Tab / Tính năng | Mô tả |
|---|---|
| **Status** | Tổng quan: version, model LLM, provider, embedding, uptime, số bài/chunk/học viên/task |
| **Chat console** | Hỏi đáp trực tiếp với agent (có lịch sử + trace tool calls) |
| **Bài học** | Xem danh sách bài đã nạp, đọc nội dung, xoá bài |
| **Skills** | Xem 16 skill đã cài, đọc nội dung, gỡ skill |
| **Integrations** | Bật/tắt Telegram · Discord · gog CLI · M365 CLI · Maton; cài skill từ registry |
| **Addons** | Bật/tắt addon plugin (Wikipedia…) |
| **Học viên** | Xem hồ sơ từng học viên, xoá hồ sơ |
| **Tasks** | Xem/tạo/huỷ lịch nhắc hẹn (schedule) |
| **Knowledge Packs** | Cài/cập nhật bộ bài học từ GitHub |
| **Audit log** | Xem lịch sử sự kiện bảo mật (50 dòng gần nhất) |
| **Config** | Xem cấu hình `config.yaml` (không hiện secrets) |

## 🗂️ Cấu trúc repo

```
K4-hackathon-VLAgent-D304/
│
├── README.md                          # Tổng quan dự án, hướng dẫn nhanh
├── HACKATHON.md                       # Đề bài & thể lệ Mini Hackathon AI — Batch 03
├── 01-de-bai.md                       # Đề bài 3 hướng lựa chọn
├── 02-guide.md                        # Hướng dẫn chi tiết cho thí sinh
├── 03-template-ai-spec.md             # Template viết AI Spec cho sản phẩm
├── 04-rubric.md                       # Rubric chấm điểm hackathon
├── .gitignore                         # Danh sách file/thư mục không track bởi Git
│
├── .github/                           # Cấu hình GitHub
│   └── ISSUE_TEMPLATE/                # Mẫu issue trên GitHub
│       ├── bug_report.yml             #   → Mẫu báo lỗi (Bug Report)
│       ├── feature_request.yml        #   → Mẫu đề xuất tính năng
│       ├── gop-y-feedback.yml         #   → Mẫu góp ý / phản hồi học viên
│       └── config.yml                 #   → Cấu hình chung issue template
│
├── artifact/                          # Tài liệu sản phẩm & đánh giá
│   ├── spec.md                        # AI Spec — đặc tả chi tiết sản phẩm
│   ├── eval/                          # Đánh giá & kiểm thử
│   │   └── test_cases.md              #   → Bộ test case kiểm thử chức năng
│   ├── slide/                         # Slide thuyết trình
│   │   └── slide.html                 #   → Slide demo dạng HTML (reveal.js)
│   └── validation/                    # Xác nhận từ người dùng thực
│       └── feedback_issue.md          #   → Tổng hợp phản hồi & issue từ học viên
│
├── data/                              # Dữ liệu hackathon (input cho agent)
│   └── vlearn-pack/                   # Gói dữ liệu Vlearn
│       ├── README.md                  #   → Mô tả cấu trúc gói dữ liệu
│       ├── chatlog/                   #   → Lịch sử chat ẩn danh
│       │   ├── DATA_DICTIONARY.md     #       → Từ điển dữ liệu (giải thích cột)
│       │   └── chat_history_*.csv     #       → File CSV chatlog ẩn danh
│       ├── discord/                   #   → Dữ liệu kênh Discord mẫu
│       │   ├── Thôngbáo.md            #       → Nội dung kênh thông báo
│       │   ├── rule.md                #       → Nội quy server
│       │   └── start.md               #       → Hướng dẫn bắt đầu
│       ├── slides/                    #   → Slide bài giảng (markdown & PDF)
│       │   ├── day01-slide-blue-v1.md #       → Slide ngày 1
│       │   ├── day02-slide-blue.md    #       → Slide ngày 2
│       │   ├── day03-*.md             #       → Slide ngày 3 (nhiều phiên bản)
│       │   ├── day04-*.md             #       → Slide ngày 4 (nhiều phiên bản)
│       │   ├── d1-slide-hackathon.pdf #       → Slide PDF ngày 1
│       │   └── d2-slide-hackathon.pdf #       → Slide PDF ngày 2
│       └── transcript/               #   → Transcript bài giảng đã làm sạch
│           ├── README.md              #       → Mô tả quy trình transcript
│           └── transcript-0X-clean.md #       → Transcript buổi 1–6
│
├── tham-khao/                         # Tài liệu tham khảo
│   ├── Strategyn_JTBD_Playbook.pdf    #   → Playbook JTBD (Jobs-To-Be-Done)
│   └── worksheet-jtbd-day-du.md       #   → Worksheet JTBD đầy đủ
│
└── learning-agent/                    # ⭐ MÃ NGUỒN CHÍNH — Vlearn Agent
    ├── README.md                      # Hướng dẫn cài đặt & sử dụng chi tiết
    ├── LICENSE                        # Giấy phép MIT
    ├── SOUL.md                        # Tính cách & nguyên tắc ứng xử của agent
    ├── config.yaml                    # Cấu hình chính (LLM, RAG, skills, security)
    ├── pyproject.toml                 # Metadata & dependencies Python (PEP 621)
    ├── Makefile                       # Lệnh tắt: test, lint, build
    ├── install.sh                     # Script cài đặt cho Linux/macOS
    ├── install.ps1                    # Script cài đặt cho Windows
    ├── Dockerfile                     # Build Docker image
    ├── docker-compose.yml             # Chạy bằng Docker Compose (1 lệnh)
    ├── .env.example                   # Mẫu biến môi trường (API key, token bot)
    ├── .dockerignore                  # File bỏ qua khi build Docker
    ├── .gitignore                     # Git ignore riêng cho learning-agent
    │
    ├── src/learning_agent/            # 📦 Package Python chính
    │   ├── __init__.py                # Khởi tạo package, version
    │   ├── cli.py                     # CLI entry-point (learning-agent bot/ui/…)
    │   ├── config.py                  # Load & validate config.yaml + .env
    │   ├── security.py                # Allowlist, chống prompt-injection
    │   ├── scheduler.py               # Lên lịch nhắc hẹn & báo cáo hằng ngày
    │   ├── integrations.py            # Tích hợp bên ngoài (Google Calendar, Meet…)
    │   ├── maton.py                   # MCP connector (Maton protocol)
    │   ├── research.py                # Nghiên cứu web: Reddit, GitHub, X, web search
    │   ├── addons.py                  # Hệ thống addon/plugin mở rộng
    │   │
    │   ├── agent/                     # 🤖 Lõi AI Agent
    │   │   ├── __init__.py            #   → Export module
    │   │   ├── core.py                #   → Logic chính: reasoning, RAG pipeline, trả lời
    │   │   ├── memory.py              #   → Bộ nhớ 3 tầng (short/long/student profile)
    │   │   ├── sessions.py            #   → Quản lý phiên hội thoại (SQLite)
    │   │   ├── skills.py              #   → Load & dispatch 16 skill học tập
    │   │   ├── subagent.py            #   → Chạy sub-agent cho tác vụ phức tạp
    │   │   └── tools.py               #   → Định nghĩa tool cho LLM (function calling)
    │   │
    │   ├── gateway/                   # 🌐 Kết nối chat platform
    │   │   ├── __init__.py            #   → Export module
    │   │   ├── base.py                #   → Lớp trừu tượng Gateway chung
    │   │   ├── telegram_bot.py        #   → Bot Telegram (python-telegram-bot)
    │   │   ├── discord_bot.py         #   → Bot Discord (discord.py)
    │   │   └── discord_actions.py     #   → Xử lý action/button Discord
    │   │
    │   ├── ingest/                    # 📥 Nạp & xử lý tài liệu đầu vào
    │   │   ├── __init__.py            #   → Orchestrator nạp file (router các loại)
    │   │   ├── slides.py              #   → Xử lý slide (PDF/PPTX → markdown)
    │   │   ├── video.py               #   → Xử lý video (trích audio → transcript)
    │   │   ├── audio.py               #   → Xử lý audio/ghi âm (Whisper STT)
    │   │   ├── web.py                 #   → Xử lý URL/web page → markdown
    │   │   ├── align.py               #   → Căn chỉnh slide–transcript theo timeline
    │   │   └── structurer.py          #   → Chuyển raw text → markdown có cấu trúc
    │   │
    │   ├── index/                     # 🔍 Vector search & indexing
    │   │   ├── __init__.py            #   → Export module
    │   │   ├── embeddings.py          #   → Tạo embedding (Voyage AI / OpenAI)
    │   │   ├── store.py               #   → ChromaDB vector store
    │   │   └── manifest.py            #   → Quản lý manifest (SQLite, tránh nạp trùng)
    │   │
    │   ├── vault/                     # 🗄️ Knowledge base kiểu Obsidian
    │   │   ├── __init__.py            #   → Export module
    │   │   ├── vault.py               #   → CRUD vault: đọc/ghi/tìm note
    │   │   └── note.py                #   → Model note markdown (frontmatter + body)
    │   │
    │   ├── updater/                   # 🔄 Cập nhật & đồng bộ dữ liệu
    │   │   ├── __init__.py            #   → Export module
    │   │   ├── inbox.py               #   → Hàng đợi file chờ nạp (inbox queue)
    │   │   ├── packs.py               #   → Import gói dữ liệu vlearn-pack
    │   │   ├── selfupdate.py          #   → Tự cập nhật agent (git pull)
    │   │   └── sync.py                #   → Đồng bộ vault ↔ index
    │   │
    │   └── webui/                     # 🖥️ Dashboard web (localhost:8321)
    │       ├── __init__.py            #   → Export module
    │       ├── server.py              #   → HTTP server (FastAPI/Starlette)
    │       └── index.html             #   → Giao diện dashboard SPA
    │
    ├── skills/                        # 🎓 16 skill học tập (mỗi skill 1 thư mục)
    │   ├── tao-quiz/                  #   → Tạo quiz kiểm tra kiến thức
    │   ├── the-ghi-nho/               #   → Thẻ ghi nhớ (flashcard / spaced repetition)
    │   ├── van-dap-active-recall/     #   → Vấn đáp active recall
    │   ├── feynman/                   #   → Kỹ thuật Feynman (giải thích đơn giản)
    │   ├── tom-tat-bai/               #   → Tóm tắt bài học
    │   ├── so-do-khai-niem/           #   → Sơ đồ khái niệm (concept map)
    │   ├── hoi-vi-sao/                #   → Hỏi "Vì sao?" — đào sâu hiểu biết
    │   ├── lo-trinh-on-tap/           #   → Lộ trình ôn tập cá nhân
    │   ├── on-thi-mock-test/          #   → Ôn thi / mock test
    │   ├── tron-bai-interleaving/     #   → Trộn bài (interleaving practice)
    │   ├── nhat-ky-loi-sai/           #   → Nhật ký lỗi sai
    │   ├── nghien-cuu/                #   → Nghiên cứu tài liệu bổ sung
    │   ├── phien-hoc-tap-trung/       #   → Phiên học tập trung (Pomodoro)
    │   ├── xay-tu-dien-thuat-ngu/     #   → Xây từ điển thuật ngữ
    │   ├── bao-cao-hang-ngay/         #   → Báo cáo học tập hằng ngày
    │   └── tu-danh-gia-tuan/          #   → Tự đánh giá tuần
    │
    ├── addons/                        # 🔌 Addon mở rộng (plugin)
    │   └── wikipedia.py               #   → Addon tra cứu Wikipedia
    │
    ├── vault/                         # 🗃️ Knowledge base (dữ liệu runtime)
    │   ├── courses/                   #   → Note theo khóa học
    │   ├── concepts/                  #   → Note theo khái niệm
    │   ├── sources/                   #   → Note nguồn gốc tài liệu
    │   ├── students/                  #   → Hồ sơ từng học viên
    │   └── mocs/                      #   → Map of Content (mục lục liên kết)
    │
    ├── data/                          # 💾 Dữ liệu runtime của agent
    │   ├── chroma/                    #   → ChromaDB vector database
    │   ├── manifest.sqlite            #   → SQLite manifest (tracking file đã nạp)
    │   ├── sessions.db                #   → SQLite lưu phiên hội thoại
    │   ├── home.json                  #   → Cấu hình trang chủ dashboard
    │   ├── schedules.json             #   → Danh sách lịch hẹn đã đặt
    │   └── pack-repos/                #   → Cache gói dữ liệu đã tải
    │
    ├── source_mirror/                 # 🪞 Mirror file gốc đã nạp
    │   └── packs/                     #   → File gốc từ vlearn-pack
    │
    └── tests/                         # ✅ Kiểm thử tự động
        └── test_core.py               #   → Unit test cho agent core
```

## 💬 Feedback & Issues

Mọi phản hồi theo dõi tại **[tab Issues](../../issues)** — chọn mẫu 💬 Feedback học viên · 🐛 Bug · 💡 Feature. Bảng tổng hợp: [issue ghim #1](../../issues/1).

---

*open source · self-host · made by **team VLagent** 🇻🇳*
