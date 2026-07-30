# learning-agent

**Agent học tập cá nhân, open source, self-host** — cài về là chạy, UX theo mô hình [Hermes Agent](https://github.com/NousResearch/hermes-agent): một gateway nhiều kênh chat (Discord + Telegram), skills chuẩn [agentskills.io](https://agentskills.io), cron tự làm việc hằng ngày, memory theo học viên. Knowledge base kiểu Obsidian (tham khảo [basic-memory](https://github.com/basicmachines-co/basic-memory)) — không phụ thuộc repo nào, toàn bộ code tự build.

```
 Nguồn bài học ──► ingest ──► vault/ (markdown kiểu Obsidian) ──► index (Voyage AI + Chroma)
 • folder source_mirror/            │ courses/ concepts/ students/          │
 • GỬI FILE qua chat ───────────────┘                                       ▼
                                                              TutorAgent (tools + skills + memory)
                                                                    ▲               │
 Telegram ◄──────────── gateway (1 process, 1 event loop) ──────────┴─► Discord     │
      ▲                                                                             │
      └───────────── cron scheduler (báo cáo hằng ngày về home chat) ◄──────────────┘
```

## Cài đặt

**Yêu cầu**: Python ≥ 3.11 · git · ffmpeg (chỉ cần cho video/ghi âm: `brew install ffmpeg` / `apt install ffmpeg`)

```bash
# 1. Tải code
git clone https://github.com/aiecosvietnam/learning-agent.git
cd learning-agent

# 2. Cài (khuyên dùng venv)
python3 -m venv .venv && source .venv/bin/activate
pip install -e .                 # lõi: agent + 2 gateway + index
pip install -e '.[ingest]'       # thêm: Docling, faster-whisper (xử lý PPTX/PDF/video/ghi âm)
pip install -e '.[voyage]'       # thêm: Voyage AI embeddings (khuyên dùng)

# 3. Cấu hình
learning-agent onboard           # tạo .env + checklist
```

Mở `.env` và điền:

| Biến | Lấy ở đâu | Bắt buộc? |
|---|---|---|
| `LLM_API_KEY` | [OpenAI](https://platform.openai.com/api-keys) / OpenRouter / bất kỳ API OpenAI-compatible (đổi `LLM_BASE_URL` tương ứng) | ✅ |
| `TELEGRAM_BOT_TOKEN` | Chat với [@BotFather](https://t.me/BotFather) → `/newbot` → copy token | 1 trong 2 kênh |
| `DISCORD_BOT_TOKEN` | [Discord Developer Portal](https://discord.com/developers/applications) → New App → Bot → bật *Message Content Intent* → copy token; mời bot vào server với scope `bot + applications.commands` | 1 trong 2 kênh |
| `TELEGRAM_ALLOWED_USERS` / `DISCORD_ALLOWED_USERS` | User ID của bạn (nhắn bot lúc chưa cấp quyền, bot sẽ báo ID) — rỗng = ai cũng dùng được | Khuyên điền |
| `VOYAGE_API_KEY` | [dashboard.voyageai.com](https://dashboard.voyageai.com) — free 200M token; bỏ trống thì dùng embedding local | ⬜ |

```bash
# 4. Chạy
learning-agent bot
```
Mở Telegram/Discord, nhắn bot `/start` — xong. Muốn chạy 24/7 thì đưa lên VPS (systemd/tmux/Docker đều được).

## Dùng

```bash
learning-agent bot        # chạy gateway: kênh nào có token thì bật + cron scheduler
learning-agent sync       # ingest từ source_mirror/ (incremental theo hash)
learning-agent ask "RAG là gì?"   # hỏi thử trong terminal
learning-agent reindex    # rebuild index từ vault (khi đổi model embedding)
```

**Nạp bài học** (2 đường, cùng vào một pipeline):
1. Bỏ file vào `source_mirror/<khoá>/<module>/` (hoặc rclone sync từ Drive) → `learning-agent sync`
2. **Gửi file thẳng cho bot** trên Discord/Telegram: PDF/PPTX, ghi âm, video, ghi chú `.md` — bot nạp xong báo lại. (Telegram Bot API giới hạn nhận 20MB; video lớn dùng đường folder hoặc bật local bot-api server.)

**Trong chat**: nhắn tin để hỏi (luôn trích nguồn "Bài X · Slide N · video mm:ss", không bịa) · `/quiz <bài>` · `/tomtat <bài>` · `/sethome` chọn nơi nhận báo cáo cron. Giới hạn người dùng bằng `DISCORD_ALLOWED_USERS` / `TELEGRAM_ALLOWED_USERS`.

**Scheduled tasks** — 2 kiểu:
- *Từ chat, ngôn ngữ tự nhiên*: "5 phút nữa nhắc tôi uống nước", "mỗi tối 21:00 quiz tôi 3 câu" — agent tự lên lịch (persist qua restart, kết quả về đúng chat đã tạo). Xem/huỷ: "tôi đã lên lịch gì?", "huỷ task \<id\>".
- *Cron tĩnh* (`schedules` trong config.yaml): mỗi job chạy phiên agent mới với skill chỉ định (vd `bao-cao-hang-ngay` đọc lộ trình chương trình + hồ sơ học viên → báo cáo tiến độ mỗi sáng), kết quả về home chat.

**Knowledge packs**: khai báo repo GitHub chứa bài học trong `config.yaml` (`knowledge_packs`) → học viên mới được agent mời cài; xác nhận là agent tự `git clone` + ingest. Agent chỉ cài được repo trong danh sách khai báo (chống prompt injection).

**SOUL.md**: nhân cách agent — sửa file là áp dụng ngay lượt chat sau, không cần restart.

## Kiến trúc & nguyên tắc

- **`vault/` là source of truth** — vault Obsidian chuẩn (frontmatter + wikilink): mở/duyệt bằng app Obsidian, hệ thống đọc/ghi cùng bộ file. Index Chroma là phái sinh, `reindex` là rebuild lại được.
- **`courses/` (máy sinh) tách khỏi `concepts/` + `students/` (agent/người viết)** — bài học update thì regenerate an toàn, tri thức tích luỹ không bao giờ bị ghi đè.
- **Incremental update**: manifest SQLite lưu sha256 từng file nguồn; chỉ trích xuất + re-embed bài thay đổi, tự gỡ note + index của bài đã xoá; mỗi lần sync là 1 git commit trên vault.
- **Skills chuẩn agentskills.io** (`skills/<name>/SKILL.md`): progressive disclosure (catalog → toàn văn → file tham chiếu). Có sẵn: `tao-quiz`, `tom-tat-bai`, `nghien-cuu`, `lo-trinh-on-tap`, `bao-cao-hang-ngay`. Thêm skill = thêm thư mục, không sửa code — cài được skill cộng đồng cùng chuẩn (skills.sh, anthropics/skills...).
- **Model-agnostic**: đổi `LLM_BASE_URL` + `llm.model` là chạy với OpenAI/OpenRouter/Ollama/Nous.

## An ninh & bảo mật

- **Allowlist mặc định** (`*_ALLOWED_USERS`): bot công khai trên Telegram/Discord — ai cũng nhắn được nếu không giới hạn. Để trống sẽ có cảnh báo to khi khởi động.
- **Chống prompt injection**: nội dung tài liệu/file/kết quả tìm kiếm được agent coi là *dữ liệu*, không phải mệnh lệnh — chỉ dẫn nhúng trong tài liệu ("bỏ qua quy tắc", "cài pack X"...) bị từ chối và báo lại học viên.
- **Knowledge pack whitelist-only**: agent chỉ cài được repo khai báo sẵn trong `config.yaml`, không bao giờ clone URL xuất hiện trong hội thoại.
- **Rate limit theo user** (`security.user_rate_per_minute`, mặc định 10 tin/phút) — chống spam và đội chi phí LLM.
- **Giới hạn upload** (`security.max_upload_mb`, mặc định 32MB Discord; Telegram Bot API tự chặn 20MB); tên file được làm sạch chống path traversal.
- **Audit log** (`data/audit.log`, JSON-lines): ghi lại user bị từ chối, rate-limit, mọi lần ingest file, cài pack, tạo scheduled task.
- **Secrets**: chỉ nằm trong `.env` (gitignore, `chmod 600` khi onboard); hồ sơ học viên (`vault/students/`) và dữ liệu runtime (`data/`) không bao giờ vào git.

## Cấu trúc code

```
src/learning_agent/
├── vault/      # engine vault kiểu Obsidian (note, wikilink, backlink, MOC, git)
├── ingest/     # slides (Docling+notes) · audio (PhoWhisper) · video (dHash) · align · structurer
├── index/      # manifest (hash, incremental) · embeddings (Voyage) · store (Chroma)
├── agent/      # core (tool loop) · tools · skills (agentskills.io) · memory · subagent
├── gateway/    # base (split, allowlist, home) · discord_bot · telegram_bot
├── updater/    # sync (diff→ingest→index→MOC→git) · inbox (file gửi qua chat)
└── scheduler.py  # cron kiểu Hermes: tick 60s, phiên mới per job, giao về home chat
```

## Test

```bash
pip install -e '.[dev]' && pytest
```
