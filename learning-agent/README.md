# Vlearn Agent

**Trợ giảng AI cá nhân, open source, self-host** — cài về là chạy. Một gateway nhiều kênh chat (Telegram + Discord), skills chuẩn [agentskills.io](https://agentskills.io), scheduler tự làm việc hằng ngày, memory 3 tầng, dashboard quản trị web. Knowledge base dạng vault markdown tương thích Obsidian — toàn bộ code do đội Vlearn Agent tự build.

Học viên gửi tài liệu (slide, video, ghi âm) cho bot hoặc bỏ vào thư mục; Vlearn Agent xử lý thành knowledge base, rồi trả lời mọi câu hỏi **kèm trích nguồn, không bịa**, dạy theo các kỹ thuật học tập đã được khoa học chứng minh.

```
 Nguồn bài học ──► ingest ──► vault/ (markdown kiểu Obsidian) ──► index (Voyage AI + Chroma)
 • folder source_mirror/            │ courses/ concepts/ students/ MEMORY.md    │
 • GỬI FILE qua chat ───────────────┘                                          ▼
                                                        Vlearn Agent (tools · skills · memory · addons)
                                                              ▲               │
 Telegram ◄──────── gateway (1 process) ──────────────────────┴─► Discord     │
      ▲                                                                        │
      ├─ scheduler (nhắc hẹn · báo cáo hằng ngày) ◄─────────────────────────────┤
      └─ dashboard web (localhost:8321) ◄──────────────────────────────────────┘
```

---

## 1. Cài đặt (người quản trị)

**Yêu cầu**: Python ≥ 3.11 · git · ffmpeg (cho video/ghi âm). Chọn 1 trong các cách:

<details open><summary><b>Linux / macOS / WSL</b> — script tự động</summary>

```bash
git clone https://github.com/aiecosvietnam/learning-agent.git
cd learning-agent
bash install.sh            # cài lõi + Voyage; thêm --ingest để xử lý PDF/PPTX/video
```
</details>

<details><summary><b>Windows</b> — PowerShell</summary>

```powershell
git clone https://github.com/aiecosvietnam/learning-agent.git
cd learning-agent
.\install.ps1              # thêm -Ingest để xử lý PDF/PPTX/video
```
</details>

<details><summary><b>Docker / docker-compose</b> — không cần cài Python</summary>

```bash
git clone https://github.com/aiecosvietnam/learning-agent.git
cd learning-agent
cp .env.example .env       # điền LLM key + token bot vào .env
docker compose up -d       # bật bot + dashboard (http://127.0.0.1:8321)
docker compose logs -f bot
# Xử lý PDF/PPTX/video: sửa WITH_INGEST: "1" trong docker-compose.yml rồi `docker compose build`
```
Sửa `.env` / `config.yaml` / `SOUL.md` ở host là container đọc luôn (đã mount volume).
</details>

<details><summary><b>Thủ công</b> — pip</summary>

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -e '.[voyage]'       # lõi + Voyage
pip install -e '.[ingest]'       # thêm Docling/Whisper (xử lý PDF/PPTX/video)
learning-agent onboard
```
</details>

Có `Makefile`: `make install` · `make run` · `make ui` · `make docker-up`.

Mở `.env` và điền:

| Biến | Lấy ở đâu | Bắt buộc? |
|---|---|---|
| `LLM_API_KEY` | [OpenAI](https://platform.openai.com/api-keys) / OpenRouter / bất kỳ API OpenAI-compatible (đổi `LLM_BASE_URL` tương ứng) | ✅ |
| `TELEGRAM_BOT_TOKEN` | Chat với [@BotFather](https://t.me/BotFather) → `/newbot` → copy token | 1 trong 2 kênh |
| `DISCORD_BOT_TOKEN` | [Discord Developer Portal](https://discord.com/developers/applications) → New App → Bot → bật *Message Content Intent*; mời bot với scope `bot + applications.commands` | 1 trong 2 kênh |
| `TELEGRAM_ALLOWED_USERS` / `DISCORD_ALLOWED_USERS` | User ID được phép dùng (nhắn bot khi chưa cấp quyền, bot báo ID) — rỗng = ai cũng dùng được | Khuyên điền |
| `VOYAGE_API_KEY` | [dashboard.voyageai.com](https://dashboard.voyageai.com) — free 200M token (thêm payment method để mở rate limit, vẫn free); bỏ trống thì dùng embedding local | ⬜ |

```bash
learning-agent bot        # chạy gateway (Telegram + Discord + scheduler)
learning-agent ui         # (cửa sổ khác) mở dashboard http://127.0.0.1:8321
```

Muốn chạy 24/7 thì đưa lên VPS (systemd/tmux/Docker). Dashboard chỉ bind `127.0.0.1` — truy cập từ xa qua SSH tunnel.

### Nạp bài học vào

Hai đường, cùng một pipeline (Docling cho slide, PhoWhisper cho tiếng Việt, căn transcript↔slide):

1. **Thư mục**: bỏ file vào `source_mirror/<khoá>/<module>/` (hoặc rclone từ Drive) → `learning-agent sync`
2. **Gửi cho bot**: học viên gửi thẳng PDF/PPTX, ghi âm, video, ghi chú `.md` trong chat — bot nạp xong báo lại (Telegram giới hạn 20MB; file lớn dùng đường thư mục)
3. **Knowledge pack**: khai báo repo GitHub trong `config.yaml` (`knowledge_packs`) → cài từ dashboard hoặc học viên nhắn "cài \<tên pack\>"

Sửa/xoá tài liệu nguồn → hệ chỉ xử lý lại đúng bài đó (incremental theo hash), note và index tự cập nhật.

---

## 2. Học viên dùng thế nào

Mở Telegram/Discord, nhắn bot `/start`. Cứ **nói tự nhiên bằng tiếng Việt** — không cần nhớ lệnh:

| Muốn gì | Cứ nói |
|---|---|
| Hỏi bài | *"RAG là gì?"* · *"giải thích tool calling loop"* — trả lời kèm 📖 Bài · Slide · phút video |
| Ôn tập | *"tạo quiz bài day04"* · *"làm flashcard giúp mình"* · *"kiểm tra miệng mình đi"* |
| Hiểu sâu | *"để mình giải thích thử xem đúng chưa"* (Feynman) · *"tại sao lại thế?"* |
| Tổng quan | *"vẽ sơ đồ khái niệm bài này"* · *"tóm tắt bài day03"* |
| Ôn thi | *"sắp thi rồi, cho đề thi thử"* · *"mình hay sai chỗ nào?"* |
| Học tập trung | *"học cùng mình 25 phút"* (Pomodoro) |
| Nhắc hẹn | *"5 phút nữa nhắc mình uống nước"* · *"mỗi tối 21h quiz mình 3 câu"* |
| Lộ trình | *"nên học gì tiếp?"* · *"lập kế hoạch ôn thi cho mình"* |
| Đổi tính cách bot | *"xưng anh/em đi, nghiêm túc hơn"* (sửa SOUL.md) |

Lệnh slash tiện dùng: `/quiz <bài>` · `/tomtat <bài>` · `/sethome` (nhận báo cáo học tập hằng ngày ở chat này).

Bot **nhớ bạn xuyên phiên** — mai quay lại hỏi *"hôm qua mình học gì rồi?"* nó tìm lại được.

### 16 skills học tập cài sẵn

Dựa trên các kỹ thuật được nghiên cứu chứng minh — agent tự chọn khi câu hỏi khớp:

`tao-quiz` · `the-ghi-nho` (spaced repetition) · `van-dap-active-recall` · `feynman` · `hoi-vi-sao` (elaborative interrogation) · `so-do-khai-niem` (concept map) · `tom-tat-bai` · `nghien-cuu` · `nhat-ky-loi-sai` (error log) · `on-thi-mock-test` (practice testing) · `tron-bai-interleaving` · `phien-hoc-tap-trung` (Pomodoro) · `tu-danh-gia-tuan` (metacognition) · `xay-tu-dien-thuat-ngu` (glossary) · `lo-trinh-on-tap` · `bao-cao-hang-ngay`

Thêm skill mới = tạo thư mục `skills/<tên>/SKILL.md`, không sửa code. Cài skill cộng đồng cùng chuẩn agentskills.io từ dashboard.

---

## 3. Dashboard quản trị (`learning-agent ui`)

Mở http://127.0.0.1:8321 — control panel giao diện tối, dữ liệu thật, tự động refresh:

- **Overview** — trạng thái gateway, model, embedding, số bài học/chunks/học viên/tasks
- **Cron Jobs** — xem/tạo/huỷ scheduled task (scheduler nhận thay đổi trong ~20s)
- **Logs / Audit** — nhật ký an ninh: ai bị chặn, ingest gì, cài pack/skill nào, tạo lịch gì
- **Skills** — xem toàn văn, gỡ, hoặc cài thêm từ registry
- **Bài học** — tìm kiếm, đọc, xoá từng bài (gỡ cả vault + index)
- **Knowledge Packs** — cài/cập nhật pack từ GitHub
- **Học viên** — hồ sơ memory agent tự ghi, xoá được (quyền riêng tư)
- **Chat** — hỏi thử agent, xem được **trace** (thought + tool calls từng bước)
- **Config · Ecosystem & Integrations** — kênh chat · skills registries · CLI hạ tầng · Addons

### Ecosystem & Integrations

Trong tab Config, bật/tắt các tích hợp (mặc định TẮT, bật thì agent mới được gọi, có audit):

- **CLI hạ tầng**: `gog` (Google Workspace — Gmail/Drive/Classroom), `m365` (Microsoft 365 — Teams/OneDrive/OneNote), Maton (SaaS) — agent lấy tài liệu ngoài qua tool `use_cli`
- **Skills registries**: duyệt và cài skill cộng đồng thẳng từ dashboard
- **Addons**: thả file Python vào `addons/` (khai báo `NAME`/`DESCRIPTION`/`TOOLS`/`handle`) là agent có tool mới — sẵn addon mẫu `wikipedia` (tra cứu khi giáo trình không có, ghi rõ nguồn)

---

## 4. Các lệnh CLI

```bash
learning-agent onboard    # cấu hình lần đầu (.env + checklist)
learning-agent bot        # chạy gateway: Telegram + Discord + scheduler
learning-agent ui         # dashboard web (127.0.0.1:8321)
learning-agent sync       # ingest từ source_mirror/ (incremental)
learning-agent reindex    # rebuild index từ vault (khi đổi model embedding)
learning-agent ask "..."  # hỏi thử trong terminal (không cần bot)
learning-agent update     # cập nhật bản mới từ GitHub (git pull + cài deps)
```

Hỏi version qua chat: nhắn bot *"version bao nhiêu?"* → agent so với GitHub, báo có bản mới không.

---

## 5. Memory 3 tầng

- **Hồ sơ học viên** (`vault/students/<id>.md`) — agent tự ghi điểm yếu, mục tiêu, tiến độ từng người
- **Bộ nhớ chung** (`vault/MEMORY.md`) — thông tin bền vững về khoá học (lịch thi, quy ước), nạp vào mỗi lượt
- **Session search** (`data/sessions.db`, FTS5) — mọi hội thoại được ghi, agent tìm lại được "hôm trước hỏi gì", scope riêng theo user

`SOUL.md` (nhân cách agent) đọc lại mỗi lượt — sửa file hoặc nhắn bot đổi tính cách là áp dụng ngay, bản cũ tự backup.

---

## 6. Nguyên tắc kiến trúc

- **`vault/` là source of truth** — vault Obsidian chuẩn (frontmatter + wikilink): mở/duyệt bằng app Obsidian, hệ thống đọc/ghi cùng bộ file. Index Chroma là phái sinh, `reindex` rebuild lại được.
- **`courses/` (máy sinh) tách khỏi `concepts/` + `students/` (agent/người viết)** — bài học update thì regenerate an toàn, tri thức tích luỹ không bị ghi đè.
- **Provenance xuyên suốt** — mỗi chunk mang course/lesson/slide/timestamp, agent trích nguồn chính xác.
- **Model-agnostic** — đổi `LLM_BASE_URL` + `llm.model` là chạy với OpenAI/OpenRouter/Ollama/Nous.

## 7. An ninh & bảo mật

- **Allowlist** (`*_ALLOWED_USERS`) — bot công khai, giới hạn ai được dùng; để trống có cảnh báo khi khởi động
- **Chống prompt injection** — nội dung tài liệu/file là *dữ liệu*, không phải mệnh lệnh; chỉ dẫn nhúng ("bỏ qua quy tắc", "cài pack X") bị từ chối và báo lại
- **Whitelist-only** — knowledge pack và CLI chỉ chạy được thứ khai báo trong config/bật ở dashboard, không bao giờ theo URL/lệnh từ hội thoại
- **Rate limit theo user** (`security.user_rate_per_minute`) — chống spam và đội chi phí LLM
- **Giới hạn upload** + làm sạch tên file (chống path traversal)
- **Audit log** (`data/audit.log`) — ghi mọi hành động nhạy cảm
- **Secrets** chỉ trong `.env` (gitignore, `chmod 600`); hồ sơ học viên và dữ liệu runtime không vào git

---

## Cấu trúc code

```
src/learning_agent/
├── vault/        # engine vault kiểu Obsidian (note, wikilink, backlink, MOC, git)
├── ingest/       # slides (Docling) · audio (PhoWhisper) · video (dHash) · align · structurer
├── index/        # manifest (hash) · embeddings (Voyage) · store (Chroma)
├── agent/        # core (tool loop) · tools · skills · memory · sessions · subagent
├── gateway/      # base (split, allowlist, home) · discord_bot · telegram_bot
├── updater/      # sync · inbox (file qua chat) · packs · selfupdate
├── webui/        # dashboard FastAPI + index.html
├── scheduler.py  # cron: nhắc hẹn + báo cáo, phiên mới per job
├── integrations.py  # Ecosystem: chat channels · skills registries · CLIs
├── addons.py     # plugin system (addons/*.py)
└── security.py   # audit log + rate limiter
skills/           # 16 skill agentskills.io
addons/           # plugin Python (wikipedia mẫu)
SOUL.md           # nhân cách agent
```

## Test

```bash
pip install -e '.[dev]' && pytest
```

## Feedback & Issues

Chúng tôi theo dõi mọi phản hồi qua **[GitHub Issues](https://github.com/hoangaiecos-boop/K4-hackathon-VLAgent-D304/issues)**. Bấm **New issue** và chọn mẫu phù hợp:

| Mẫu | Dùng khi |
|---|---|
| 💬 **Góp ý / Feedback học viên** | Chia sẻ trải nghiệm học, điều hữu ích / cần cải thiện, chấm sao mức hài lòng |
| 🐛 **Báo lỗi (Bug report)** | Agent chạy sai, crash, trả lời không đúng |
| 💡 **Đề xuất tính năng** | Gợi ý tool / skill / addon / tích hợp mới |

Nhãn để phân loại & theo dõi: `feedback` · `bug` · `enhancement` · `cần phân loại`.

> ⚠️ Trước khi dán log, **xoá mọi API key, token, thông tin cá nhân** — repo này công khai.

