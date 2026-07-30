import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env")

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
QUIZ_MODEL = os.environ.get("QUIZ_MODEL", "gpt-4o-mini")

DATA_PACK_DIR = BACKEND_DIR.parent / "data" / "vlearn-pack"
TRANSCRIPT_DIR = DATA_PACK_DIR / "transcript"
