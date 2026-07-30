"""Cấu hình — đọc từ .env, không hardcode secret ở bất cứ đâu."""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

# Console Windows mặc định là cp1252 -> mọi print() có dấu tiếng Việt sẽ ném
# UnicodeEncodeError. Sửa ở đây một lần vì mọi entry point đều import config,
# thay vì bắt bạn set PYTHONIOENCODING mỗi lần chạy.
for _luong in (sys.stdout, sys.stderr):
    if hasattr(_luong, "reconfigure"):
        try:
            _luong.reconfigure(encoding="utf-8")
        except (ValueError, OSError):
            pass

# codebase/timlai/config.py -> codebase/
CODEBASE = Path(__file__).resolve().parent.parent
REPO = CODEBASE.parent

load_dotenv(CODEBASE / ".env")

DB_PATH = CODEBASE / "index.db"          # .gitignore đã chặn — chứa tin nhắn thật
GOLDEN_SET = REPO / "eval" / "golden-set.yaml"
KET_QUA_DIR = REPO / "eval" / "ket-qua"

MODEL = "claude-opus-5"
MAX_TOKENS = 8000                        # thinking + text dùng chung ngân sách này
SO_UNG_VIEN = 30                         # FTS5 trả top-N cho LLM chọn


def _env(ten: str, mac_dinh: str = "") -> str:
    return os.environ.get(ten, mac_dinh).strip()


DISCORD_TOKEN = _env("DISCORD_TOKEN")
GUILD_ID = _env("GUILD_ID")

# Danh sách kênh được index. Rỗng = mọi kênh bot đọc được.
KENH_INDEX: list[str] = [k.strip() for k in _env("KENH_INDEX").split(",") if k.strip()]


def can_discord() -> str:
    """Gọi ở đầu script cần Discord. Báo lỗi rõ ràng thay vì KeyError."""
    if not DISCORD_TOKEN:
        raise SystemExit(
            "Thiếu DISCORD_TOKEN.\n"
            "  1. cp .env.example .env   (PowerShell: Copy-Item .env.example .env)\n"
            "  2. Điền token từ Developer Portal → tab Bot → Reset Token"
        )
    return DISCORD_TOKEN


def can_anthropic() -> None:
    """Gọi ở đầu script cần AI."""
    if not _env("ANTHROPIC_API_KEY"):
        raise SystemExit("Thiếu ANTHROPIC_API_KEY trong .env")
