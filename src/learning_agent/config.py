"""Load config.yaml + .env thành một object cấu hình duy nhất."""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml
from dotenv import load_dotenv


@dataclass
class Config:
    raw: dict[str, Any]
    root: Path

    def __getitem__(self, key: str) -> Any:
        return self.raw[key]

    def get(self, *keys: str, default: Any = None) -> Any:
        node: Any = self.raw
        for k in keys:
            if not isinstance(node, dict) or k not in node:
                return default
            node = node[k]
        return node

    def path(self, *keys: str) -> Path:
        """Resolve một đường dẫn trong config tương đối với thư mục project."""
        p = Path(str(self.get(*keys)))
        return p if p.is_absolute() else self.root / p

    # secrets từ .env
    llm_base_url: str = field(init=False, default="")
    llm_api_key: str = field(init=False, default="")
    discord_token: str = field(init=False, default="")
    telegram_token: str = field(init=False, default="")
    voyage_api_key: str = field(init=False, default="")

    def __post_init__(self) -> None:
        self.llm_base_url = os.environ.get("LLM_BASE_URL", "https://api.openai.com/v1")
        self.llm_api_key = os.environ.get("LLM_API_KEY", "")
        # tên biến theo chuẩn Hermes, chấp nhận cả tên cũ
        self.discord_token = os.environ.get("DISCORD_BOT_TOKEN") or os.environ.get("DISCORD_TOKEN", "")
        self.telegram_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
        self.voyage_api_key = os.environ.get("VOYAGE_API_KEY", "")


def load_config(root: str | Path | None = None) -> Config:
    root = Path(root) if root else Path.cwd()
    load_dotenv(root / ".env")
    cfg_file = root / "config.yaml"
    raw = yaml.safe_load(cfg_file.read_text(encoding="utf-8")) if cfg_file.exists() else {}
    return Config(raw=raw or {}, root=root)
