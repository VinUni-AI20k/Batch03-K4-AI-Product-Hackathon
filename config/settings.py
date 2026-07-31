import sys
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Try loading from codebase/.env first, then root .env
try:
    from dotenv import load_dotenv
    for p in [BASE_DIR / "codebase" / ".env", BASE_DIR / ".env"]:
        if p.exists():
            load_dotenv(dotenv_path=p, override=True)
except ImportError:
    # Manual fallback parser in case python-dotenv is not installed
    for p in [BASE_DIR / "codebase" / ".env", BASE_DIR / ".env"]:
        if p.exists():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            parts = line.split("=", 1)
                            if len(parts) == 2:
                                k, v = parts
                                val = v.strip()
                                if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                                    val = val[1:-1]
                                os.environ[k.strip()] = val
            except Exception as e:
                print(f"[VLearn Warning] Failed to manually load .env file: {e}")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.xah.io/v1")

DEFAULT_PROVIDER = os.getenv("LLM_PROVIDER", "openai")
DEFAULT_OPENAI_MODEL = os.getenv("OPENAI_MODEL", "phatchau036/gpt-5.4")
DEFAULT_GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


DEFAULT_TEMPERATURE = 0.2
MAX_OUTPUT_TOKENS = 2048

SLIDES_DIR = BASE_DIR / "data" / "vlearn-pack" / "slides"
OUTPUT_DIR = BASE_DIR / "output"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
