import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

_DEFAULT_CREDENTIALS_DIR = Path(__file__).resolve().parent / "credentials"
_BACKEND_CREDENTIALS_DIR = Path(__file__).resolve().parent.parent.parent / "backend" / "credentials"


def _resolve_token_file() -> Path:
    env_path = os.environ.get("GOOGLE_CALENDAR_TOKEN_FILE")
    if env_path:
        return Path(env_path)
    default_path = _DEFAULT_CREDENTIALS_DIR / "token.json"
    if default_path.exists():
        return default_path
    backend_path = _BACKEND_CREDENTIALS_DIR / "token.json"
    if backend_path.exists():
        return backend_path
    return default_path


# Same shared token the backend's unified Google connection uses — reads
# codebase/backend/credentials/token.json so both read one file.
GOOGLE_TOKEN_FILE = _resolve_token_file()
MCP_HOST = os.environ.get("GMAIL_LOCAL_MCP_HOST", "0.0.0.0")
MCP_PORT = int(os.environ.get("GMAIL_LOCAL_MCP_PORT", "8087"))
