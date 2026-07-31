"""SQLite-backed persistence for the complete ``SessionState`` schema."""

from __future__ import annotations

import json
import uuid
from typing import Optional

from app.core.database import get_connection
from app.core.schemas import Level, SessionState, Style


def _serialize(state: SessionState) -> str:
    # Support both Pydantic v1 and v2 while this project upgrades dependencies.
    data = state.model_dump(mode="json") if hasattr(state, "model_dump") else state.dict()
    return json.dumps(data, ensure_ascii=False)


def _deserialize(value: str) -> SessionState:
    data = json.loads(value)
    return SessionState.model_validate(data) if hasattr(SessionState, "model_validate") else SessionState.parse_obj(data)


def create_session(
    level: Optional[Level] = None,
    style: Optional[Style] = None,
    time_available_minutes: Optional[int] = None,
) -> SessionState:
    state = SessionState(
        session_id=str(uuid.uuid4()),
        level=level,
        style=style,
        time_available_minutes=time_available_minutes,
    )
    save_session(state, create_only=True)
    return state


def get_session(session_id: str) -> Optional[SessionState]:
    with get_connection() as connection:
        row = connection.execute(
            "SELECT state_json FROM learning_sessions WHERE session_id = ?", (session_id,)
        ).fetchone()
    return _deserialize(row["state_json"]) if row else None


def save_session(state: SessionState, *, create_only: bool = False) -> SessionState:
    """Insert or replace a session atomically; rejects an existing ID when requested."""
    values = (
        state.session_id,
        state.level.value if state.level else None,
        state.style.value if state.style else None,
        state.time_available_minutes,
        _serialize(state),
    )
    query = (
        "INSERT INTO learning_sessions "
        "(session_id, level, style, time_available_minutes, state_json) VALUES (?, ?, ?, ?, ?)"
        if create_only
        else """
        INSERT INTO learning_sessions
            (session_id, level, style, time_available_minutes, state_json)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(session_id) DO UPDATE SET
            level = excluded.level,
            style = excluded.style,
            time_available_minutes = excluded.time_available_minutes,
            state_json = excluded.state_json,
            updated_at = CURRENT_TIMESTAMP
        """
    )
    with get_connection() as connection:
        connection.execute(query, values)
    return state
