"""Configuration helpers for the repository deployment layout."""

from pathlib import Path

from dotenv import load_dotenv


def load_mcp_env() -> None:
    """Load ``codebase/mcp/.env`` when running this package from the repository."""
    mcp_env = Path(__file__).resolve().parents[2] / ".env"
    load_dotenv(mcp_env)
