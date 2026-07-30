"""Configuration helpers for the repository deployment layout."""

from pathlib import Path

from dotenv import load_dotenv


def load_codebase_env() -> None:
    """Load ``codebase/.env`` when running this package from the repository."""
    codebase_env = Path(__file__).resolve().parents[2] / ".env"
    load_dotenv(codebase_env)
