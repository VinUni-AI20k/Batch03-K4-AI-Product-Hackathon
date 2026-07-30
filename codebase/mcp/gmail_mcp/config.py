import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

_DEFAULT_CREDENTIALS_DIR = Path(__file__).resolve().parent / "credentials"

# Same shared token google_calendar_mcp and the backend's unified Google
# connection use — set GOOGLE_CALENDAR_TOKEN_FILE (codebase/mcp/.env) to
# codebase/backend/credentials/token.json so all three read one file. No
# client secrets are needed here: the backend already performed the
# interactive consent and this server only ever refreshes the cached token.
GOOGLE_TOKEN_FILE = Path(
    os.environ.get("GOOGLE_CALENDAR_TOKEN_FILE", str(_DEFAULT_CREDENTIALS_DIR / "token.json"))
)
MCP_HOST = os.environ.get("GMAIL_LOCAL_MCP_HOST", "0.0.0.0")
MCP_PORT = int(os.environ.get("GMAIL_LOCAL_MCP_PORT", "8087"))
