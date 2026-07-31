from typing import Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.schemas import Level, SessionState, Style
from app.core.session_store import create_session, get_session, save_session


router = APIRouter(prefix="/api/sessions", tags=["sessions"])


class CreateSessionRequest(BaseModel):
    level: Optional[Level] = None
    style: Optional[Style] = None
    time_available_minutes: Optional[int] = Field(default=None, gt=0)


@router.post("", response_model=SessionState, status_code=status.HTTP_201_CREATED)
def post_session(payload: CreateSessionRequest = CreateSessionRequest()):
    return create_session(**payload.dict())


@router.get("/{session_id}", response_model=SessionState, deprecated=True)
def read_session(session_id: str):
    session = get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.put("/{session_id}", response_model=SessionState, deprecated=True)
def put_session(session_id: str, payload: SessionState):
    if payload.session_id != session_id:
        raise HTTPException(status_code=400, detail="session_id in URL and body must match")
    if get_session(session_id) is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return save_session(payload)
