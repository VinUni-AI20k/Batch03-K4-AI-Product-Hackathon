"""Load config.yaml + .env thành một object cấu hình duy nhất."""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml
from dotenv import load_dotenv

# Preset provider LLM — tất cả đều OpenAI-compatible nên chỉ cần đổi base_url + key.
# Claude (Anthropic) KHÔNG có endpoint OpenAI-compatible native -> dùng qua openrouter
# (model 'anthropic/claude-...'). Chọn provider bằng llm.provider trong config.yaml.
LLM_PROVIDERS = {
    "openai":     {"base_url": "https://api.openai.com/v1",                       "key_env": "OPENAI_API_KEY",     "example_model": "gpt-4o-mini"},
    "openrouter": {"base_url": "https://openrouter.ai/api/v1",                    "key_env": "OPENROUTER_API_KEY", "example_model": "anthropic/claude-3.7-sonnet"},
    "gemini":     {"base_url": "https://generativelanguage.googleapis.com/v1beta/openai/", "key_env": "GEMINI_API_KEY", "example_model": "gemini-2.0-flash"},
    "groq":       {"base_url": "https://api.groq.com/openai/v1",                  "key_env": "GROQ_API_KEY",       "example_model": "llama-3.3-70b-versatile"},
    "together":   {"base_url": "https://api.together.xyz/v1",                     "key_env": "TOGETHER_API_KEY",   "example_model": "meta-llama/Llama-3.3-70B-Instruct-Turbo"},
    "ollama":     {"base_url": "http://localhost:11434/v1",                       "key_env": "OLLAMA_API_KEY",     "example_model": "llama3.1"},
    # "custom": dùng thẳng LLM_BASE_URL + LLM_API_KEY trong .env
}


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
    maton_api_key: str = field(init=False, default="")

    llm_provider: str = field(init=False, default="")

    def __post_init__(self) -> None:
        # Chọn provider: llm.provider trong config.yaml. Nếu là preset -> lấy base_url + key
        # từ preset đó. 'custom' hoặc rỗng -> dùng LLM_BASE_URL / LLM_API_KEY.
        provider = str((self.raw.get("llm") or {}).get("provider", "") or "").lower().strip()
        self.llm_provider = provider or "custom"
        preset = LLM_PROVIDERS.get(provider)
        if preset:
            self.llm_base_url = preset["base_url"]
            # ưu tiên key riêng của provider; fallback LLM_API_KEY (tương thích setup cũ)
            self.llm_api_key = (os.environ.get(preset["key_env"], "")
                                or os.environ.get("LLM_API_KEY", "")
                                or ("ollama" if provider == "ollama" else ""))
        else:
            self.llm_base_url = os.environ.get("LLM_BASE_URL", "https://api.openai.com/v1")
            self.llm_api_key = os.environ.get("LLM_API_KEY", "")
        # tên biến theo chuẩn Vlearn Agent, chấp nhận cả tên cũ
        self.discord_token = os.environ.get("DISCORD_BOT_TOKEN") or os.environ.get("DISCORD_TOKEN", "")
        self.telegram_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
        self.voyage_api_key = os.environ.get("VOYAGE_API_KEY", "")
        self.maton_api_key = os.environ.get("MATON_API_KEY", "")


def load_config(root: str | Path | None = None) -> Config:
    root = Path(root) if root else Path.cwd()
    load_dotenv(root / ".env")
    cfg_file = root / "config.yaml"
    raw = yaml.safe_load(cfg_file.read_text(encoding="utf-8")) if cfg_file.exists() else {}
    return Config(raw=raw or {}, root=root)
