# Hướng dẫn chạy StudyPulse (backend + frontend + MCP)

Tài liệu này hướng dẫn cách cài đặt, cấu hình biến môi trường (`.env`) và
chạy toàn bộ hệ thống ở local: backend (FastAPI), frontend (Vite + React),
và 3 MCP server chạy local (Discord, Gmail, Outlook). Google Calendar không
chạy server local — backend gọi thẳng MCP server của Google
(`calendarmcp.googleapis.com`).

## 1. Yêu cầu hệ thống

- **Python 3.11+** (venv riêng cho `backend` và cho `mcp`)
- **Node.js 18+** và `npm` (cho frontend)
- **Docker** (chỉ cần nếu muốn dùng tính năng kết nối **Outlook** — xem cách cài ở mục 5.4)
- Tài khoản/API key cần chuẩn bị trước:
  - `OPENAI_API_KEY` (bắt buộc — dùng cho agent chat)
  - Discord bot token (tùy chọn — nếu muốn kết nối Discord)
  - Google Cloud OAuth client (tùy chọn — nếu muốn kết nối Gmail/Google Calendar)

## 2. Cấu trúc thư mục liên quan

```
codebase/
├── backend/        # FastAPI server + agent chat (Python)
├── FE/             # Frontend Vite + React
└── mcp/            # 3 MCP server local: discord_mcp, gmail_mcp, outlook_mcp
#                  (Google Calendar dùng MCP server của Google, không cần chạy local)
scripts/dev.sh       # Script start/stop backend + frontend cùng lúc
```

## 3. Cài đặt

### 3.1. Backend

```bash
cd codebase/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### 3.2. MCP servers (Discord / Gmail / Outlook)

Dùng chung một venv:

```bash
cd codebase/mcp
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### 3.3. Frontend

```bash
cd codebase/FE
npm install
cp .env.example .env   # nếu chưa có file .env
```

## 4. Cấu hình biến môi trường (.env)

Có **3 file `.env`** riêng biệt, mỗi file nằm cạnh file `.env.example` tương ứng.

### 4.1. `codebase/backend/.env`

| Biến | Bắt buộc | Ý nghĩa |
|---|---|---|
| `OPENAI_API_KEY` | ✅ | API key OpenAI, dùng cho agent trả lời chat |
| `DISCORD_MCP_URL` | mặc định sẵn | URL của `discord_mcp` (mặc định `http://localhost:8085/mcp`) |
| `GOOGLE_CALENDAR_MCP_URL` | mặc định sẵn | URL MCP server Google Calendar của Google (mặc định `https://calendarmcp.googleapis.com/mcp/v1`) — chỉ đổi nếu muốn ghim endpoint theo vùng |
| `GMAIL_MCP_URL` | mặc định sẵn | URL của `gmail_mcp` (mặc định `http://localhost:8087/mcp`) |
| `GOOGLE_OAUTH_REDIRECT_URI` | mặc định sẵn | Redirect URI cho luồng OAuth Google (`http://localhost:8000/api/v1/connections/google/callback`) — phải khớp với redirect URI khai báo trên Google Cloud Console |
| `FRONTEND_URL` | mặc định sẵn | URL frontend đang chạy (mặc định `http://localhost:5190`), dùng để redirect lại sau khi OAuth Google xong |

Cách lấy `OPENAI_API_KEY`: đăng nhập https://platform.openai.com/api-keys → tạo key mới → dán vào `.env`.

**Kết nối Google (Gmail + Google Calendar dùng chung 1 OAuth client):**
1. Vào https://console.cloud.google.com/ → tạo (hoặc chọn) project.
2. **APIs & Services → Library** → bật **Google Calendar API**, **Gmail API**
   và **Google Calendar MCP API** (`calendarmcp.googleapis.com`). Bằng gcloud:
   ```bash
   gcloud services enable calendar-json.googleapis.com --project=PROJECT_ID
   gcloud services enable calendarmcp.googleapis.com --project=PROJECT_ID
   ```
   ⚠️ **MCP server Google Calendar đang ở Developer Preview** — project phải
   được đăng ký [Google Workspace Developer Preview Program](https://developers.google.com/workspace/preview)
   thì mới gọi được. Nếu chưa đủ điều kiện, mọi tool calendar sẽ trả lỗi
   `The caller does not have permission`.
3. **APIs & Services → OAuth consent screen** → User Type "External" → điền tên app/email → mục "Test users" thêm email Google của bạn.
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID** → chọn **Web application** → thêm `http://localhost:8000/api/v1/connections/google/callback` vào "Authorized redirect URIs" → **Download JSON**.
5. Lưu file JSON vừa tải thành `codebase/backend/credentials/client_secret.json` (thư mục này đã có sẵn, file bị gitignore nên không lo lộ key).
6. Sau đó vào FE, mục "Quản lý kết nối" → bấm kết nối Gmail để thực hiện OAuth — token sẽ được lưu tại `codebase/backend/credentials/token.json`, dùng chung cho `gmail_mcp` và cho các tool Google Calendar (backend gắn token này vào header `Authorization` khi gọi MCP server của Google).
   Nếu bạn đã kết nối từ trước khi chuyển sang MCP server của Google, hãy bấm
   **ngắt kết nối rồi kết nối lại** — token cũ thiếu 3 scope mà MCP server của
   Google yêu cầu (`calendar.calendarlist.readonly`, `calendar.events.freebusy`,
   `calendar.events.readonly`).

### 4.2. `codebase/mcp/.env`

| Biến | Bắt buộc | Ý nghĩa |
|---|---|---|
| `DISCORD_TOKEN` | chỉ khi dùng Discord | Token của Discord bot |
| `DISCORD_CLIENT_ID` | chỉ khi dùng Discord | Application ID của bot (dùng để tạo link mời bot) |
| `MCP_HOST` / `MCP_PORT` | mặc định sẵn | Host/port cho `discord_mcp` (mặc định `0.0.0.0:8085`) |
| `GOOGLE_CLIENT_SECRETS_FILE` | mặc định sẵn | Đường dẫn tới `client_secret.json` (trỏ chung sang `codebase/backend/credentials/`) |
| `GOOGLE_CALENDAR_TOKEN_FILE` | mặc định sẵn | Đường dẫn tới `token.json` (token OAuth dùng chung Gmail + Calendar) |
| `OUTLOOK_MCP_IMAGE` | chỉ khi dùng Outlook | Tên Docker image (`outlook-local-mcp:local`) |
| `OUTLOOK_MCP_VOLUME` | chỉ khi dùng Outlook | Docker volume lưu token đăng nhập Outlook |
| `OUTLOOK_MCP_CLIENT_ID` / `OUTLOOK_MCP_TENANT_ID` | mặc định sẵn | Client ID public của Microsoft, không cần tự đăng ký app |
| `OUTLOOK_MCP_MAIL_ENABLED`, `OUTLOOK_MCP_MAIL_MANAGE_ENABLED`, `OUTLOOK_MCP_READ_ONLY` | mặc định sẵn | Bật/tắt phạm vi quyền mail |
| `OUTLOOK_MCP_DEFAULT_TIMEZONE`, `OUTLOOK_MCP_LOG_LEVEL` | mặc định sẵn | Timezone và log level |
| `GMAIL_LOCAL_MCP_HOST` / `_PORT` | mặc định sẵn | Host/port cho `gmail_mcp` (mặc định `0.0.0.0:8087`) |

Cách lấy `DISCORD_TOKEN`:
1. https://discord.com/developers/applications → New Application → tab **Bot** → Reset/Copy token → dán vào `.env`.
2. Cũng ở tab Bot, bật 2 **Privileged Gateway Intents**: `Server Members Intent` và `Message Content Intent`.
3. Tab **OAuth2 → URL Generator** → scope `bot`, quyền tối thiểu: View Channels, Send Messages, Read Message History, Add Reactions, Manage Messages → dùng link tạo ra để mời bot vào server Discord.
4. Application ID (đầu trang General Information) → dán vào `DISCORD_CLIENT_ID`.

Outlook không cần đăng ký app riêng (dùng client ID công khai của Microsoft, đăng nhập bằng device-code — xem mục 5.4).

### 4.3. `codebase/FE/.env`

| Biến | Bắt buộc | Ý nghĩa |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Địa chỉ backend API (mặc định `http://localhost:8000/api/v1`) |

## 5. Chạy ứng dụng

### 5.1. Cách nhanh nhất — dùng `scripts/dev.sh`

Script này tự chạy cả backend (`:8000`) và frontend (`:5190`) cùng lúc (không
bao gồm các MCP server — cần các MCP nào thì chạy thêm ở bước 5.3/5.4 nếu
muốn dùng tính năng Discord/Gmail/Outlook thật; Calendar không cần chạy gì thêm).

```bash
# từ thư mục gốc repo
./scripts/dev.sh start     # khởi động backend + frontend
./scripts/dev.sh status    # xem trạng thái
./scripts/dev.sh stop      # dừng cả hai
./scripts/dev.sh restart   # khởi động lại
```

Log lưu tại `.run/backend.log` và `.run/frontend.log`.

### 5.2. Chạy thủ công — Backend

```bash
cd codebase/backend
source .venv/bin/activate
uvicorn server:app --host 127.0.0.1 --port 8000
```

Kiểm tra: mở http://127.0.0.1:8000/docs

### 5.3. Chạy thủ công — Frontend

```bash
cd codebase/FE
npm run dev
```

Mặc định Vite chạy ở `http://localhost:5173`; `scripts/dev.sh` ép dùng cổng
`5190` để tránh trùng với các dự án Vite khác — nếu chạy thủ công có thể
dùng cổng nào cũng được, miễn khớp với `FRONTEND_URL` trong
`codebase/backend/.env` (dùng cho redirect OAuth Google).

### 5.4. Chạy các MCP server (tùy chọn — chỉ cần khi muốn dùng tính năng thật)

Mở 3 terminal riêng, cùng dùng venv `codebase/mcp/.venv`:

```bash
cd codebase/mcp && source .venv/bin/activate
python -m discord_mcp            # http://localhost:8085/mcp
```

```bash
cd codebase/mcp && source .venv/bin/activate
python -m gmail_mcp              # http://localhost:8087/mcp
```

**Outlook** không chạy như 3 server trên (không có process `python -m
outlook_mcp` riêng) — backend gọi thẳng qua Docker mỗi khi cần.

**Cài Docker (nếu máy chưa có):**

- macOS/Windows: tải **Docker Desktop** tại <https://www.docker.com/products/docker-desktop/> → cài đặt → mở app Docker Desktop và đợi tới khi nó báo "Docker is running".
- Linux: cài `docker engine` theo hướng dẫn <https://docs.docker.com/engine/install/> rồi `sudo systemctl start docker`.
- Kiểm tra đã cài xong: chạy `docker info` — nếu in ra thông tin server (không phải lỗi "Cannot connect to the Docker daemon") là đã sẵn sàng.

**Build image (chỉ cần làm 1 lần):**

```bash
cd example/outlook-local-mcp
docker build -t outlook-local-mcp:local .
```

Sau đó chỉ cần Docker Desktop/daemon đang chạy nền; backend sẽ tự `docker run`
khi người dùng bấm kết nối Outlook trong FE ("Quản lý kết nối" → Outlook).
Lần đầu kết nối sẽ hiện mã device-code — đăng nhập tại
<https://microsoft.com/devicelogin> bằng trình duyệt. Token đăng nhập được
lưu trong Docker volume `outlook-mcp-auth` (tự tạo, xem `OUTLOOK_MCP_VOLUME`
ở mục 4.2) nên không cần đăng nhập lại mỗi lần chạy.

Nếu không có Docker/không cần Outlook, bỏ qua bước này — các tool
`outlook_*` sẽ chỉ trả lỗi thay vì làm crash agent (xem mục 5.5).

### 5.5. Không có MCP server / thiếu credentials thì sao?

Không sao — các tool tương ứng sẽ trả lỗi dạng
`{"tool": ..., "error": ..., "message": ...}` thay vì crash cả agent, nên có
thể phát triển/test dần từng phần mà không cần bật đủ các kết nối.

## 6. Thứ tự khởi động khuyến nghị

1. `codebase/mcp` → chạy `discord_mcp`, `gmail_mcp` (nếu cần)
2. Docker daemon bật sẵn (nếu cần Outlook)
3. Backend (`uvicorn` hoặc `scripts/dev.sh start`)
4. Frontend (`npm run dev` hoặc đã được `scripts/dev.sh start` chạy cùng)
5. Mở FE → vào "Quản lý kết nối" để kết nối Gmail/Discord/Outlook thật (nếu muốn)
