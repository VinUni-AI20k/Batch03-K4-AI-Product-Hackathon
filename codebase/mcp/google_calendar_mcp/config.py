import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

_DEFAULT_CREDENTIALS_DIR = Path(__file__).resolve().parent / "credentials"

GOOGLE_CLIENT_SECRETS_FILE = Path(
    os.environ.get("GOOGLE_CLIENT_SECRETS_FILE", str(_DEFAULT_CREDENTIALS_DIR / "client_secret.json"))
)
GOOGLE_CALENDAR_TOKEN_FILE = Path(
    os.environ.get("GOOGLE_CALENDAR_TOKEN_FILE", str(_DEFAULT_CREDENTIALS_DIR / "token.json"))
)
GOOGLE_CALENDAR_ID = os.environ.get("GOOGLE_CALENDAR_ID", "primary")
GOOGLE_CALENDAR_DEFAULT_TZ = os.environ.get("GOOGLE_CALENDAR_DEFAULT_TZ", "Asia/Ho_Chi_Minh")
MCP_HOST = os.environ.get("GOOGLE_CALENDAR_MCP_HOST", "0.0.0.0")
MCP_PORT = int(os.environ.get("GOOGLE_CALENDAR_MCP_PORT", "8086"))

if not GOOGLE_CLIENT_SECRETS_FILE.exists():
    print(
        f"ERROR: Google OAuth client secrets file not found at {GOOGLE_CLIENT_SECRETS_FILE}.\n"
        "Create an OAuth client ID (Application type: Desktop app) in Google Cloud Console, "
        "download its JSON, and save it there (or point GOOGLE_CLIENT_SECRETS_FILE at it). "
        "See README.md for the full setup steps.",
        file=sys.stderr,
    )
    sys.exit(1)
