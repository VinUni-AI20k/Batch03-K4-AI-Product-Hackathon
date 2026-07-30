import sys
import os
from pathlib import Path

# Thêm thư mục gốc của dự án vào sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    env_path = BASE_DIR / ".env"
    load_dotenv(dotenv_path=env_path)
except ImportError:
    pass

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
