# 🎓 Vlearn Agent

**Trợ giảng AI cá nhân — open source, self-host.** Học viên chat trên **Telegram / Discord**, gửi slide · video · ghi âm → agent biến thành knowledge base rồi trả lời **có trích nguồn, không bịa**, dạy theo các kỹ thuật học tập đã được khoa học chứng minh.

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

## 🗂️ Cấu trúc repo

| Thư mục / file | Nội dung |
|---|---|
| **[`learning-agent/`](learning-agent/)** | Toàn bộ mã nguồn Vlearn Agent (README, cài đặt, tests) |
| [`HACKATHON.md`](HACKATHON.md) | Đề bài & thể lệ Mini Hackathon AI — Batch 03 |
| `01-de-bai.md` · `04-rubric.md` | Đề bài 3 hướng · rubric chấm điểm |
| `data/` · `tham-khao/` | Dữ liệu hackathon (chatlog ẩn danh, transcript, slide) · tài liệu tham khảo |

## 💬 Feedback & Issues

Mọi phản hồi theo dõi tại **[tab Issues](../../issues)** — chọn mẫu 💬 Feedback học viên · 🐛 Bug · 💡 Feature. Bảng tổng hợp: [issue ghim #1](../../issues/1).

---

*open source · self-host · made by **team VLagent** 🇻🇳*
