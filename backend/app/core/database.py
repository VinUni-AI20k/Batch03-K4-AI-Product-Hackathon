"""Small SQLite bootstrapper used by the session repository."""

from __future__ import annotations

import sqlite3
from pathlib import Path

from app.core.config import DATABASE_PATH


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS learning_sessions (
    session_id TEXT PRIMARY KEY,
    level TEXT,
    style TEXT,
    time_available_minutes INTEGER,
    state_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (level IS NULL OR level IN ('beginner', 'intermediate', 'advanced')),
    CHECK (style IS NULL OR style IN ('intuitive', 'mathematical', 'both')),
    CHECK (time_available_minutes IS NULL OR time_available_minutes > 0)
);

CREATE INDEX IF NOT EXISTS idx_learning_sessions_updated_at
    ON learning_sessions (updated_at DESC);
"""


def get_connection(database_path: Path = DATABASE_PATH) -> sqlite3.Connection:
    """Return a connection with row names and foreign-key enforcement enabled."""
    database_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize_database() -> None:
    """Create all tables and indexes. Safe to run each time the API starts."""
    with get_connection() as connection:
        connection.executescript(SCHEMA_SQL)
