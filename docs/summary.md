# 📚 Tóm tắt dự án — Vlearn Agent

> **Vlearn Agent** là trợ giảng AI cá nhân, open-source, self-host dành cho học viên. Giao tiếp tự nhiên qua **Telegram / Discord**, dạy học theo 16 kỹ thuật được khoa học chứng minh, trả lời luôn kèm trích nguồn từ giáo trình thực tế.

🌐 **Live demo**: [vlearn-agent.vercel.app](https://vlearn-agent.vercel.app)

---

## ✨ Điểm nổi bật

| Tính năng | Mô tả |
|---|---|
| 🧠 **RAG từ giáo trình thật** | Trả lời kèm 📖 *Bài · Slide · phút video*, không có thì nói thẳng — không bịa |
| 🎓 **16 skill học tập** | Spaced repetition, Feynman, active recall, Pomodoro… chuẩn [agentskills.io](https://agentskills.io) |
| 💬 **Đa kênh** | Telegram + Discord — 1 gateway, cùng 1 codebase |
| 📂 **Nạp bài linh hoạt** | Gửi file qua chat hoặc sync từ thư mục; hỗ trợ PDF/PPTX/video/ghi âm |
| 👤 **Memory 3 tầng** | Nhớ điểm yếu từng học viên xuyên phiên |
| 🔗 **Mở rộng dễ** | Skill = 1 folder, addon = 1 file Python |
| 🔒 **An toàn theo thiết kế** | Allowlist, chống prompt injection, rate limit, audit log |
| 🔀 **Model-agnostic** | OpenAI · Claude · Gemini · Groq · Ollama (local) |

---

## 🚀 Cài đặt nhanh

### Yêu cầu
- Python ≥ 3.11
- git
- ffmpeg (nếu cần ingest video/ghi âm)

### Cài đặt

**Linux / macOS / WSL:**
```bash
git clone https://github.com/hoangaiecos-boop/K4-hackathon-VLAgent-D304.git
cd K4-hackathon-VLAgent-D304/learning-agent
bash install.sh           # thêm --ingest để xử lý PDF/PPTX/video
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/hoangaiecos-boop/K4-hackathon-VLAgent-D304.git
cd K4-hackathon-VLAgent-D304\learning-agent
.\install.ps1             # thêm -Ingest để xử lý PDF/PPTX/video
```

**Docker (không cần Python):**
```bash
git clone https://github.com/hoangaiecos-boop/K4-hackathon-VLAgent-D304.git
cd K4-hackathon-VLAgent-D304/learning-agent
cp .env.example .env      # điền key + token
docker compose up -d      # bot + dashboard http://127.0.0.1:8321
```

**Thủ công (pip):**
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[voyage]'     # lõi + Voyage embedding
pip install -e '.[ingest]'     # thêm Docling/Whisper (PDF/PPTX/video)
learning-agent onboard
```

### Cấu hình `.env`

| Biến | Lấy ở đâu | Bắt buộc? |
|---|---|---|
| `LLM_API_KEY` | [OpenAI](https://platform.openai.com/api-keys) / OpenRouter / endpoint OpenAI-compatible | ✅ |
| `TELEGRAM_BOT_TOKEN` | [@BotFather](https://t.me/BotFather) → `/newbot` | 1 trong 2 kênh |
| `DISCORD_BOT_TOKEN` | [Discord Developer Portal](https://discord.com/developers/applications) → Bot | 1 trong 2 kênh |
| `TELEGRAM_ALLOWED_USERS` / `DISCORD_ALLOWED_USERS` | User ID được phép dùng (rỗng = mở cho tất cả) | Khuyên điền |
| `VOYAGE_API_KEY` | [dashboard.voyageai.com](https://dashboard.voyageai.com) — free 200M token | Tuỳ chọn |

---

## ▶️ Khởi chạy

```bash
learning-agent bot        # bật gateway: Telegram + Discord + scheduler
learning-agent ui         # (cửa sổ khác) dashboard http://127.0.0.1:8321
```

---

## 📖 Các chức năng chính

### 1. Hỏi bài & Giải thích (RAG)

Học viên hỏi tự nhiên bằng tiếng Việt — agent tìm trong knowledge base và trả lời **kèm trích nguồn chính xác** (Bài · Slide · phút video).

```
Học viên: "RAG là gì?"
Agent: "Bro, RAG (Retrieval-Augmented Generation) là... 📖 [Bài day04 · Slide 12]"

Học viên: "giải thích tool calling loop"
Agent: "Ok bro, tool calling loop hoạt động thế này... 📖 [day06 · Slide 3–5]"
```

> Nếu câu hỏi ngoài giáo trình, agent nói thẳng: *"cái này tài liệu chưa có ông ơi"* — không chém gió.

---

### 2. Ôn tập & Kiểm tra

16 skill học tập cài sẵn, agent tự chọn phù hợp với yêu cầu:

| Muốn gì | Cách nói | Skill kích hoạt |
|---|---|---|
| Quiz trắc nghiệm | *"tạo quiz bài day04"* | `tao-quiz` |
| Flashcard spaced repetition | *"làm flashcard giúp mình"* | `the-ghi-nho` |
| Kiểm tra miệng | *"kiểm tra miệng mình đi"* | `van-dap-active-recall` |
| Giải thích lại (Feynman) | *"để mình giải thích thử xem đúng chưa"* | `feynman` |
| Hỏi tại sao | *"tại sao lại thế?"* | `hoi-vi-sao` |
| Vẽ sơ đồ khái niệm | *"vẽ sơ đồ khái niệm bài này"* | `so-do-khai-niem` |
| Tóm tắt | *"tóm tắt bài day03"* | `tom-tat-bai` |
| Mock test | *"sắp thi rồi, cho đề thi thử"* | `on-thi-mock-test` |
| Trộn bài ôn | *"ôn nhiều bài cùng lúc"* | `tron-bai-interleaving` |

---

### 3. Nạp bài học vào hệ thống

**Cách 1 — Gửi file qua chat** (Telegram < 20MB / Discord < 32MB):
- Học viên gửi thẳng PDF/PPTX, ghi âm MP3/M4A, video MP4, ghi chú `.md`
- Bot hỏi xác nhận trước khi nạp
- Sau khi ingest: slide → markdown, ghi âm → transcript, video → keyframe + transcript

**Cách 2 — Thư mục source_mirror/**:
```bash
# Bỏ file vào thư mục đúng cấu trúc
source_mirror/<khoá>/<module>/bai01.pdf

# Chạy sync (chỉ xử lý file mới/thay đổi)
learning-agent sync
```

**Cách 3 — Knowledge Pack** (repo GitHub):
```yaml
# config.yaml
knowledge_packs:
  - name: my-course
    repo: https://github.com/org/course-materials.git
    subdirs: [slides/, notes/]
```
Rồi nhắn bot: *"cài my-course"* hoặc cài từ dashboard.

---

### 4. Lịch nhắc & Báo cáo tự động

```
Học viên: "5 phút nữa nhắc mình uống nước"
Học viên: "mỗi tối 21h quiz mình 3 câu bài RAG"
Học viên: "mỗi sáng thứ 2 gửi báo cáo học tập tuần"
```

Đặt home chat bằng lệnh `/sethome` — mọi nhắc hẹn và báo cáo sẽ gửi về chat đó.

Báo cáo sáng `07:30` chạy tự động mỗi ngày (có thể cấu hình trong `config.yaml`).

---

### 5. Pomodoro & Học tập tập trung

```
Học viên: "học cùng mình 25 phút"
→ Agent bắt đầu phiên Pomodoro, nhắc nghỉ sau 25 phút, tóm tắt cuối phiên
```

---

### 6. Nhớ & Thích ứng theo từng học viên

Agent tự ghi nhận và nhớ xuyên phiên:
- Điểm yếu, kiến thức còn hổng
- Mục tiêu học tập
- Tiến độ từng module
- Phong cách học ưa thích

```
Học viên (ngày hôm sau): "hôm qua mình học gì rồi?"
Agent: "Hôm qua bro học bài day04 về RAG, còn sai câu về chunking strategy. 
        Muốn ôn lại không? 🔥"
```

---

### 7. Đổi tính cách Bot

Tính cách mặc định là homie thân thiện (xưng "bro/ông"). Có thể thay đổi:

```
Học viên: "xưng anh/em đi, nghiêm túc hơn"
→ Agent đổi xưng hô và giọng điệu ngay lập tức (sửa SOUL.md, tự backup bản cũ)
```

---

### 8. Dashboard Quản trị (`learning-agent ui`)

Mở `http://127.0.0.1:8321` để quản trị hệ thống:

| Tab | Chức năng |
|---|---|
| **Overview** | Trạng thái gateway, model, embedding, số bài/chunks/học viên |
| **Cron Jobs** | Xem/tạo/huỷ lịch tự động |
| **Logs / Audit** | Nhật ký an ninh, ai bị chặn, ingest gì |
| **Skills** | Xem, gỡ, cài skill từ registry |
| **Bài học** | Tìm kiếm, đọc, xoá bài trong knowledge base |
| **Knowledge Packs** | Cài/cập nhật bộ tài liệu từ GitHub |
| **Học viên** | Hồ sơ memory từng học viên, xoá (quyền riêng tư) |
| **Chat** | Hỏi thử agent, xem **trace** (thought + tool calls từng bước) |
| **Config** | Kênh chat, skill registries, CLIs, addons |

> Dashboard chỉ bind `127.0.0.1` — truy cập từ xa qua SSH tunnel.

---

## 🔧 Các lệnh CLI

```bash
learning-agent onboard    # cấu hình lần đầu (.env + checklist)
learning-agent bot        # chạy gateway: Telegram + Discord + scheduler
learning-agent ui         # dashboard web (127.0.0.1:8321)
learning-agent sync       # ingest từ source_mirror/ (incremental)
learning-agent reindex    # rebuild index từ vault (khi đổi model embedding)
learning-agent ask "..."  # hỏi thử trong terminal (không cần bot)
learning-agent update     # cập nhật bản mới từ GitHub
```

Makefile shortcut: `make install` · `make run` · `make ui` · `make docker-up`

---

## 🔌 Tích hợp mở rộng

### Addons (plugin Python)

Tạo file `addons/<tên>.py` khai báo `NAME / DESCRIPTION / TOOLS / handle` → agent có tool mới ngay, không sửa core code.

Addon mẫu đi kèm: **wikipedia** — tra cứu bổ sung khi giáo trình không có, ghi rõ nguồn.

### CLI Ecosystem (bật qua dashboard)

| CLI | Tích hợp |
|---|---|
| `gog` | Google Workspace: Gmail, Drive, Classroom |
| `m365` | Microsoft 365: Teams, OneDrive, OneNote |
| `Maton` | MCP SaaS: Google Calendar, Meet, Docs, Sheets, Gmail |

### Skill mới

Tạo thư mục `skills/<tên>/SKILL.md` theo chuẩn agentskills.io → agent nhận skill ngay, không restart, không sửa code.

---

## 🔒 Bảo mật

| Cơ chế | Chi tiết |
|---|---|
| **Allowlist** | `*_ALLOWED_USERS` — giới hạn ai được dùng bot |
| **Rate limit** | 10 tin nhắn/user/phút (cấu hình được) |
| **Prompt injection** | Nội dung tài liệu/file là *dữ liệu*, không phải mệnh lệnh; chỉ dẫn nhúng bị từ chối |
| **Whitelist-only** | Knowledge pack và CLI chỉ chạy thứ khai báo trong config |
| **Upload limit** | Discord 32MB, Telegram 20MB (Bot API); làm sạch tên file chống path traversal |
| **Audit log** | `data/audit.log` — ghi mọi hành động nhạy cảm |
| **Secrets** | Chỉ trong `.env` (gitignore, chmod 600) |

---

## 🧪 Test

```bash
pip install -e '.[dev]' && pytest
```

---

## 💬 Lệnh slash tiện dụng

| Lệnh | Chức năng |
|---|---|
| `/start` | Bắt đầu, xem hướng dẫn |
| `/quiz <bài>` | Tạo quiz nhanh cho bài chỉ định |
| `/tomtat <bài>` | Tóm tắt nhanh bài chỉ định |
| `/sethome` | Đặt chat này làm nơi nhận báo cáo và nhắc hẹn |

---

## 📂 Cấu trúc thư mục

```
learning-agent/
├── src/learning_agent/    — source code Python
├── skills/                — 16 skill học tập (agentskills.io)
├── addons/                — plugin Python (wikipedia mẫu)
├── vault/                 — knowledge base runtime (gitignore)
├── data/                  — chroma DB, sessions.db, audit.log
├── source_mirror/         — nơi đặt file bài học để sync
├── SOUL.md                — nhân cách agent (sửa được khi đang chạy)
├── config.yaml            — cấu hình hệ thống
├── .env                   — secrets (gitignore)
├── docker-compose.yml     — chạy bằng Docker
├── install.sh / install.ps1  — script cài tự động
└── Makefile               — shortcut lệnh thường dùng
```

---

## 🔗 Links

- 🌐 **Live demo**: [vlearn-agent.vercel.app](https://vlearn-agent.vercel.app)
- 📖 **Kiến trúc chi tiết**: [docs/architecture.md](architecture.md)
- 🐛 **Issues & Feedback**: [GitHub Issues](https://github.com/hoangaiecos-boop/K4-hackathon-VLAgent-D304/issues)
- 📋 **Đề bài hackathon**: [HACKATHON.md](../HACKATHON.md)
