import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env")
# Also accept the repository-level .env used by the frontend/demo setup.
load_dotenv(BACKEND_DIR.parent / ".env")

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
OPENAI_API_KEYS = os.environ.get("OPENAI_API_KEYS", "")
OPENAI_BASE_URL = os.environ.get("OPENAI_BASE_URL", "")
QUIZ_MODEL = os.environ.get("QUIZ_MODEL", "gpt-4o-mini")


def _env_list(name: str) -> list[str]:
    """Read comma/newline separated values while ignoring empty entries."""
    return [item.strip() for item in os.environ.get(name, "").replace("\n", ",").split(",") if item.strip()]


def openai_api_keys() -> list[str]:
    """Return configured keys, supporting legacy and numbered env variables."""
    keys = _env_list("OPENAI_API_KEYS")
    if OPENAI_API_KEY and OPENAI_API_KEY not in keys:
        keys.insert(0, OPENAI_API_KEY)
    numbered = []
    for index in range(1, 100):
        value = os.environ.get(f"OPENAI_API_KEY_{index}", "").strip()
        if value:
            numbered.append(value)
    for value in numbered:
        if value not in keys:
            keys.append(value)
    return keys


def openai_base_urls() -> list[str]:
    """Optional per-key OpenAI-compatible endpoints, in the same order as keys."""
    urls = _env_list("OPENAI_BASE_URLS")
    if OPENAI_BASE_URL:
        urls.insert(0, OPENAI_BASE_URL.strip())
    for index in range(1, 100):
        value = os.environ.get(f"OPENAI_BASE_URL_{index}", "").strip()
        if value:
            urls.append(value)
    return urls

DATA_PACK_DIR = BACKEND_DIR.parent / "data" / "vlearn-pack"
TRANSCRIPT_DIR = DATA_PACK_DIR / "transcript"

# SQLite is deliberately kept inside the backend so a local deployment has no
# external database prerequisite.  Its parent directory is created at startup.
DATABASE_PATH = BACKEND_DIR / "data" / "illumimate.db"
