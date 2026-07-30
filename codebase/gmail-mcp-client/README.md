# Gmail MCP client (Python)

Python client để agent kết nối Gmail MCP server chính chủ của Google qua HTTP, tìm kiếm và đọc nội dung thread. Endpoint mặc định là `https://gmailmcp.googleapis.com/mcp/v1`. Client không lưu OAuth token vào file: ứng dụng multi-client phải cung cấp kho token mã hóa, phân vùng theo người dùng.

## Cài đặt

```bash
cd codebase
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -e gmail-mcp-client --no-deps
cp .env.example .env
cd gmail-mcp-client
```

Trước khi chạy, theo [tài liệu Google](https://developers.google.com/workspace/gmail/api/guides/configure-mcp-server):

1. Bật `gmail.googleapis.com` và `gmailmcp.googleapis.com` trong Google Cloud project.
2. Cấu hình OAuth consent screen, thêm scopes `gmail.readonly` và `gmail.compose`.
3. Tạo OAuth client loại **Web application**; thêm đúng URI `http://localhost:8765/oauth/callback` (hoặc giá trị `GMAIL_MCP_OAUTH_REDIRECT_URI` bạn chọn) vào Authorized redirect URIs.
4. Điền Client ID và Client Secret vào `codebase/.env`.

Lệnh CLI dùng `InMemoryTokenStorage`, phù hợp để thử kết nối nhưng sẽ yêu cầu đăng nhập lại sau khi tiến trình kết thúc. Với ứng dụng thật, tạo `TokenStorage` dùng database/secret manager và truyền vào `GmailMcpClient` cho từng người dùng.

```bash
gmail-mcp tools
gmail-mcp search 'from:alice@example.com newer_than:7d'
gmail-mcp read THREAD_ID
```

Với Gmail MCP của Google, hai tool đọc là `search_threads` và `get_thread`. Chạy `gmail-mcp tools` để xem schema chính xác; nếu dùng server khác, đặt `GMAIL_MCP_SEARCH_TOOL` hoặc `GMAIL_MCP_READ_TOOL`.

## Smoke test trong terminal

Sau khi đã cài package và điền `codebase/.env`, chạy từ thư mục này:

```bash
python scripts/test_gmail_mcp.py
```

Lệnh chỉ xác thực OAuth, kết nối và kiểm tra hai read tool. Dùng các lệnh sau nếu muốn test đọc dữ liệu thực:

```bash
python scripts/test_gmail_mcp.py --search 'is:unread newer_than:2d'
python scripts/test_gmail_mcp.py --thread-id THREAD_ID
```

Client chặn các tool ghi (`create_draft`, gắn/bỏ nhãn) theo mặc định, kể cả khi OAuth consent screen của Gmail MCP cần scope `gmail.compose`. Chỉ đặt `GMAIL_MCP_ALLOW_WRITE=true` khi bạn chủ đích cho agent thay đổi Gmail.

## Dùng trong agent

```python
from gmail_mcp_client import GmailMcpClient

async def fetch_mail():
    # token_storage chi truy cap token cua current_user_id va ma hoa khi luu.
    token_storage = await token_store.for_user(current_user_id)
    client = GmailMcpClient(token_storage=token_storage)
    async with client.connect() as gmail:
        results = await gmail.search("is:unread newer_than:2d")
        thread = await gmail.read_thread("THREAD_ID")
        return results, thread
```

Với tool riêng của server, gọi `await gmail.call_tool("tool_name", {"argument": "value"})`. Không log hoặc chuyển tiếp nội dung email nếu chưa có quyền phù hợp từ người dùng.

## Token store cho multi-client

`token_storage` cần kế thừa `mcp.client.auth.TokenStorage` và triển khai bốn coroutine: `get_tokens`, `set_tokens`, `get_client_info`, `set_client_info`. Dùng khóa `(tenant_id, user_id, provider="gmail")`; mã hóa `access_token`, `refresh_token` và OAuth client secret ở trạng thái nghỉ. Không trả token của user A cho session của user B, không đặt token trong JWT/frontend, log hay queue. `InMemoryTokenStorage` chỉ dùng cho local development.
