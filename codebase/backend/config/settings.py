import sys
import os
from pathlib import Path

# Thêm thư mục backend vào sys.path
BACKEND_DIR = Path(__file__).resolve().parent.parent
BASE_DIR = BACKEND_DIR.parent.parent

if str(BACKEND_DIR) in sys.path:
    sys.path.remove(str(BACKEND_DIR))
sys.path.insert(0, str(BACKEND_DIR))
if str(BASE_DIR) in sys.path:
    sys.path.remove(str(BASE_DIR))
sys.path.append(str(BASE_DIR))

# Fix lỗi httpx.InvalidURL khi httpx parse IPv6 (::1/128) trong NO_PROXY của hệ thống
for env_v in ["NO_PROXY", "no_proxy"]:
    env_val = os.getenv(env_v)
    if env_val and ("::" in env_val or "/" in env_val):
        cleaned_items = [item.strip() for item in env_val.split(",") if "::" not in item and "/" not in item]
        os.environ[env_v] = ",".join(cleaned_items)

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    for env_p in [BASE_DIR / "codebase" / ".env", BASE_DIR / ".env", BACKEND_DIR / ".env"]:
        if env_p.exists():
            load_dotenv(dotenv_path=env_p, override=True)
except ImportError:
    # Manual fallback parser in case python-dotenv is not installed
    for env_p in [BASE_DIR / "codebase" / ".env", BASE_DIR / ".env", BACKEND_DIR / ".env"]:
        if env_p.exists():
            try:
                with open(env_p, "r", encoding="utf-8") as f:
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

# LLM Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.xah.io/v1")

# Default Model settings
DEFAULT_PROVIDER = os.getenv("LLM_PROVIDER", "openai")

DEFAULT_OPENAI_MODEL = os.getenv("OPENAI_MODEL", "phatchau036/gpt-5.4")
DEFAULT_GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")


DEFAULT_TEMPERATURE = 0.2
MAX_OUTPUT_TOKENS = 2048


# Data paths
SLIDES_DIR = BASE_DIR / "data" / "vlearn-pack" / "slides"
OUTPUT_DIR = BASE_DIR / "output"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
