# codebase — Trợ lý tìm lại link tài liệu Discord

Toàn bộ code của prototype nằm trong thư mục này. Lát cắt và quality bar: xem [`../spec.md`](../spec.md).

## 1. Cấu trúc

```
codebase/
├── .venv/                  ← môi trường ảo (gitignore)
├── .env                    ← secret, tự tạo từ .env.example (gitignore)
├── .env.example            ← mẫu, KHÔNG chứa secret thật
├── requirements.txt
├── index.db                ← SQLite FTS5, sinh ra khi chạy (gitignore)
│
├── timlai/                 ← ★ PACKAGE — logic sản phẩm
│   ├── config.py           ← đọc .env, hằng số, ép UTF-8 cho console Windows
│   ├── index.py            ← ② retrieval: FTS5 + BM25
│   ├── tra_cuu.py          ← ③ quyết định AI + chống bịa   ← KHÔNG import discord
│   ├── render.py           ← trình bày 4 đường đi trải nghiệm
│   └── bot.py              ← ① Discord client + /timlai
│
├── scripts/                ← ★ ENTRY POINT — chạy tay, không phải logic
│   ├── kiem_tra_doc.py     ← smoke test: bot đọc được Discord chưa?
│   ├── seed_gia.py         ← nạp 20 tin nhắn giả (chạy được khi chưa có server)
│   ├── backfill.py         ← dựng index từ Discord thật
│   ├── thu_hoi.py          ← hỏi 1 câu từ terminal (vòng lặp dev)
│   └── chay_eval.py        ← chạy 22 case golden set → bảng % cho R4
│
└── tests/                  ← ★ TEST TỰ ĐỘNG — pytest, không cần API key
    ├── conftest.py         ← fixture: index in-memory + 3 tin mẫu
    ├── test_index.py       ← 7 test lớp ②
    └── test_tra_cuu.py     ← 11 test lớp ③ (4 lớp chỗ khó + 4 đường đi)
```

**Quy tắc chia thư mục** — chỉ một quy tắc, nhưng nó quyết định 15 điểm R4:

> `timlai/tra_cuu.py` **không được import discord**. Quyết định AI phải là một hàm Python thuần gọi được ngoài Discord — nếu không thì `chay_eval.py` không chạy nổi 22 case và R4 mất trắng.

`scripts/` chỉ nối dây, không chứa logic. Logic nào cần test thì phải nằm trong `timlai/`.

## 2. Cài đặt

**Bước 1 — venv.** Bắt buộc: `discord.py` ghim version, không nên cài vào Python hệ thống.

```powershell
cd codebase
python -m venv .venv
.\.venv\Scripts\Activate.ps1        # thấy (.venv) ở đầu dòng lệnh là xong
pip install -r requirements.txt
```

```bash
# Git Bash / macOS / Linux
cd codebase
python -m venv .venv
source .venv/Scripts/activate       # Linux/mac: source .venv/bin/activate
pip install -r requirements.txt
```

> PowerShell chặn script? Chạy một lần: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
> Không muốn activate? Gọi trực tiếp: `.\.venv\Scripts\python.exe scripts/thu_hoi.py "..."`

**Bước 2 — secret.**

```powershell
Copy-Item .env.example .env         # bash: cp .env.example .env
```

Điền `ANTHROPIC_API_KEY`, và `DISCORD_TOKEN` + `GUILD_ID` nếu đã có server test.
`.env` đã bị `.gitignore` chặn — **đừng bao giờ commit nó**.

## 3. Ba đường chạy

### A. Chưa có server Discord — chạy được ngay

Đề bài ràng buộc 3 cho phép **data giả tự sinh**. Đường này cho bạn demo được toàn bộ pipeline trước khi lo chuyện Discord.

```powershell
python scripts/seed_gia.py                          # nạp 20 tin nhắn giả
python scripts/thu_hoi.py "link slide buổi 5" --chi-loc   # xem FTS5, KHÔNG tốn token
python scripts/thu_hoi.py "link slide buổi 5"             # gọi AI thật
python scripts/chay_eval.py                               # 22 case → eval/ket-qua/
```

### B. Có server Discord test

```powershell
python scripts/kiem_tra_doc.py      # 1. xác nhận đọc được tin nhắn
python scripts/backfill.py          # 2. dựng index từ lịch sử thật
python scripts/thu_hoi.py "..."     # 3. thử
```

### C. Bot chạy thật

```powershell
python -m timlai.bot                # rồi gõ /timlai trong Discord
```

## 4. Test — ba tầng, dùng đúng tầng cho đúng việc

| Tầng | Lệnh | Cần API key? | Thời gian | Trả lời câu hỏi gì |
|---|---|---|---|---|
| **1. pytest** | `pytest tests -q` | ❌ | ~0.2s | Logic chống bịa và 4 lớp chỗ khó còn đúng không? |
| **2. thu_hoi** | `python scripts/thu_hoi.py "..."` | ✅ (bỏ nếu `--chi-loc`) | ~5s | Một câu cụ thể ra kết quả thế nào? |
| **3. chay_eval** | `python scripts/chay_eval.py` | ✅ | ~2 phút | % qua quality bar — artifact nộp cho R4 |

**Chạy tầng 1 sau mỗi lần sửa code.** Nó không tốn token và bắt được hầu hết lỗi hồi quy:

```powershell
pytest tests -q                     # 18 passed
pytest tests -q -k lop1             # chỉ nhóm chống bịa
pytest tests -v                     # xem tên từng test
```

### 4.1 · Chín case phải test bằng tay trước khi demo

Đây là các case mà pytest **không** bắt được vì chúng phụ thuộc hành vi LLM thật. Chạy tầng 2 cho từng dòng, ghi kết quả vào `../validation/`.

| # | Lệnh | Phải thấy gì | Sai thì lỗi ở đâu |
|---|---|---|---|
| 1 | `thu_hoi.py "link slide buổi 5"` | 1 link, kèm `discord.com/channels/...` | — happy path |
| 2 | `thu_hoi.py "slie buoi 5"` | vẫn ra slide buổi 5 | FTS5 tokenizer — lớp ② |
| 3 | `thu_hoi.py "link slide buổi 10"` | `tim_thay=False`, **không có link nào** | ① nếu nó bịa link → prompt hoặc `neo()` |
| 4 | `thu_hoi.py "link checkin"` | `tim_thay=False` | ① |
| 5 | `thu_hoi.py "link slide"` | `do_tin_cay=thap` + câu hỏi lại | ② nếu tự chọn 1 → luật 3 trong SYSTEM |
| 6 | `thu_hoi.py "giải thích hàm softmax"` | `ngoai_pham_vi=True` | ③ |
| 7 | `thu_hoi.py "link slide buổi 5 bản mới nhất"` | link **v2** (24/07), không phải v1 | ④ thứ tự `truy_xuat` |
| 8 | `thu_hoi.py "link lab 2"` | có dòng `⚠️ Tin này từ N ngày trước` | ④ `canh_bao_cu` |
| 9 | `thu_hoi.py "link"` | hỏi lại kèm ví dụ | ② |

Case **3, 4** là quan trọng nhất: quality bar trong `spec.md §7` là **0 case bịa nguồn**. Một link bịa ở đây là fail cả bar, không phải trừ điểm.

### 4.2 · Kiểm runner trước khi chạy thật

`chay_eval.py` gọi AI 22 lần. Trước khi tốn token, kiểm runner bằng LLM giả:

```powershell
python scripts/chay_eval.py --gia    # LLM giả, 0 token
```

LLM giả cố tình trả 1 message_id bịa mỗi lần được gọi. Kết quả đúng phải là **`bịa nguồn: 19`** (không phải 22 — 3 case mà FTS5 trả 0 ứng viên thì `tra_cuu()` chặn trước, không gọi AI, nên không có gì để bịa). Nếu con số này về **0**, cơ chế `neo()` đã hỏng và mọi số liệu sau đó vô nghĩa.

Con số pass ở lượt `--gia` (~73%) **không có ý nghĩa gì** — nó chỉ chứng minh runner chạy và biết phát hiện sai lệch.

```powershell
python scripts/chay_eval.py --kho    # chỉ 8 case ①②③④, ~40% token
python scripts/chay_eval.py          # trọn bộ 22 case → nộp cho R4
```

Kết quả ghi ra `../eval/ket-qua/luot-N.md`, **kèm cả case chưa đạt**. Rubric ghi rõ: kết quả thấp vẫn được tính đủ điểm nếu ghi nhận trung thực; số liệu bị che thì không được tính.

## 5. Lỗi thường gặp

| Hiện tượng | Nguyên nhân | Sửa |
|---|---|---|
| `kiem_tra_doc.py` in `(không có text)` mọi dòng | Chưa bật **MESSAGE CONTENT INTENT** | Developer Portal → tab Bot → bật → **restart bot** |
| `UnicodeEncodeError: 'charmap'` | Console Windows cp1252 | Đã xử lý trong `config.py`; nếu vẫn gặp thì script đó chưa `import config` |
| `/timlai` không hiện trong Discord | Thiếu scope `applications.commands` | Sinh lại URL OAuth2 với **cả** `bot` và `applications.commands` |
| `Thiếu DISCORD_TOKEN` | Chưa có `.env` | `Copy-Item .env.example .env` rồi điền |
| `index.db trống` | Chưa nạp dữ liệu | `python scripts/seed_gia.py` hoặc `backfill.py` |
| `sqlite3.OperationalError: fts5: syntax error` | Có input lọt qua `_cau_truy_van` | Thêm case đó vào `test_ky_tu_dac_biet_khong_lam_sap` rồi sửa regex `_TU` |
| Bot trả link nhưng sai bài | Lỗi lớp ② không phải ③ | Chạy `--chi-loc` xem FTS5 có ra tin đúng không trước khi sửa prompt |

## 6. Bản đồ code → rubric

| Rubric | Điểm | File |
|---|---|---|
| R3 · 4 lớp chỗ khó | 11 | `tra_cuu.py` SYSTEM + `neo()` + `canh_bao_cu()`; 4 đường đi ở `render.py` |
| R4 · Kiểm thử | **15** | `tests/`, `scripts/chay_eval.py`, `../eval/golden-set.yaml`, `../eval/ket-qua/` |
| R5 · Prototype | 8 | `timlai/bot.py` end-to-end; lời gọi AI thật + log `[trace]` ở `tra_cuu._goi_claude` |
| R7 · Repo | 3 | cấu trúc mục 1 |
