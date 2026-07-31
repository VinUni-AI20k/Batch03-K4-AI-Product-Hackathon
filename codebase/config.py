"""Centralized configuration for VLearn Prototype."""

import os
from pathlib import Path
from slide_store import SlideStore

def _load_env_file(root_dir: Path) -> None:
    path = root_dir / ".env"
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


# Global Paths
ROOT = Path(__file__).resolve().parents[1]
_load_env_file(ROOT)

STATIC_DIR = ROOT / "codebase"
TRANSCRIPT = ROOT / "data/vlearn-pack/transcript/transcript-03-clean.md"
TRACE_DIR = ROOT / "eval/traces"

# Global Constants
DEFAULT_SOURCE_IDS = [f"T03-{number:03d}" for number in range(24, 39)]

# Single Instance Objects
SLIDE_STORE = SlideStore(ROOT / "slide")
SLIDE_FILES = {
    lesson["id"]: ROOT / "slide" / lesson["filename"]
    for lesson in SLIDE_STORE.list_lessons()
    if lesson["available"]
}

# Env Variables Helpers
def get_openai_api_key() -> str:
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("Thiếu OPENAI_API_KEY trong .env")
    return key

def get_openai_model() -> str:
    return os.getenv("OPENAI_MODEL", "gpt-5.6-luna")
