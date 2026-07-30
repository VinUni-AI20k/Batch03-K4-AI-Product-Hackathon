from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=PROJECT_ROOT / "backend" / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    ocr_max_upload_mb: int = Field(default=5, ge=1, le=50)
    ocr_max_pages: int = Field(default=10, ge=1, le=100)
    ocr_languages: str = "vie+eng"
    ocr_temp_ttl_seconds: int = Field(default=300, ge=0, le=86_400)
    ocr_enable_external_vision: bool = False
    ocr_report_dir: Path = Path("artifacts/ocr/reports")
    ocr_log_file: Path = Path("artifacts/ocr/logs/ocr-events.jsonl")
    ocr_runtime_dir: Path = Path("runtime/ocr")
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"
    cors_allowed_origins: list[str] = [
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:3000",
    ]

    @field_validator("cors_allowed_origins", mode="before")
    @classmethod
    def split_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    @field_validator("ocr_languages")
    @classmethod
    def clean_languages(cls, value: str) -> str:
        allowed = "".join(ch for ch in value if ch.isalnum() or ch in {"+", "_", "-"})
        return allowed or "vie+eng"

    def resolve_path(self, value: Path) -> Path:
        return value if value.is_absolute() else PROJECT_ROOT / value

    @property
    def max_upload_bytes(self) -> int:
        return self.ocr_max_upload_mb * 1024 * 1024

    @property
    def report_dir(self) -> Path:
        return self.resolve_path(self.ocr_report_dir)

    @property
    def log_file(self) -> Path:
        return self.resolve_path(self.ocr_log_file)

    @property
    def runtime_dir(self) -> Path:
        return self.resolve_path(self.ocr_runtime_dir)

    def ensure_directories(self) -> None:
        self.report_dir.mkdir(parents=True, exist_ok=True)
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
        for child in ("uploads", "temp", "runs"):
            (self.runtime_dir / child).mkdir(parents=True, exist_ok=True)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    settings = Settings()
    settings.ensure_directories()
    return settings
