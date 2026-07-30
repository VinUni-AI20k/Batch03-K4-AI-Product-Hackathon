"""HTTP entrypoint for the StudyPulse agent, for the Vite/React frontend in
codebase/FE. Wraps the exact same tool-calling loop chat.py uses
(agent.run_model_tool_loop + tools.TOOL_FUNCTIONS) behind FastAPI instead of
stdin, plus an in-memory 'derived timeline' (see timeline_store.py) since
there is no persistent extracted-item store. See specs/UI.md for the
response envelope this follows, and the plan's Known Gaps for what's
intentionally not implemented (OAuth/integrations, persistence, correction log).
"""

from __future__ import annotations

import hashlib
import logging
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

import discord_connection
import google_connection
from agent import run_model_tool_loop
from env_loader import load_backend_env
from providers import make_provider
from timeline_store import derive_from_tool_events, timeline_store
from tools import TOOL_FUNCTIONS, load_tool_declarations, to_openai_tools

ROOT = Path(__file__).parent
ARTIFACTS_DIR = ROOT / "artifacts"
load_backend_env(ROOT)

SYSTEM_PROMPT_PATH = ARTIFACTS_DIR / "system_prompt.md"
TOOLS_PATH = ARTIFACTS_DIR / "tools.yaml"

_system_prompt = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")
_tool_declarations = load_tool_declarations(TOOLS_PATH)
_missing = {item["name"] for item in _tool_declarations} - set(TOOL_FUNCTIONS)
if _missing:
    raise SystemExit(f"tools.yaml declares tools with no implementation in TOOL_FUNCTIONS: {sorted(_missing)}")
_openai_tools = to_openai_tools(_tool_declarations)
_provider = make_provider("openai")

_ARTIFACT_VERSION = hashlib.sha256(
    (_system_prompt + TOOLS_PATH.read_text(encoding="utf-8")).encode("utf-8")
).hexdigest()[:12]

# conversation_id -> history list, same shape chat.py keeps per-process.
_conversations: dict[str, list[dict[str, str]]] = {}

app = FastAPI(title="StudyPulse agent API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def envelope(data: Any = None, error: dict[str, Any] | None = None) -> dict[str, Any]:
    return {"data": data, "error": error, "meta": {"request_id": uuid.uuid4().hex, "timestamp": now_iso()}}


def error_response(status_code: int, code: str, message: str) -> HTTPException:
    return HTTPException(status_code=status_code, detail=envelope(error={"code": code, "message": message, "details": {}}))


class ChatRequest(BaseModel):
    user_query: str
    conversation_id: str | None = None


class PatchTimelineRequest(BaseModel):
    date: str | None = None
    time: str | None = None
    due_date_iso: str | None = None
    due_time_iso: str | None = None


class FeedbackRequest(BaseModel):
    feedback_type: str = "incorrect"
    note: str | None = None


class CalendarConfirmRequest(BaseModel):
    timezone: str | None = None


class DiscordDisconnectRequest(BaseModel):
    guild_id: str


FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5190")


def _sources_cited(tool_events: list[dict[str, Any]]) -> list[dict[str, str]]:
    sources: list[dict[str, str]] = []
    for event in tool_events:
        name = event.get("tool")
        if name == "gmail_read_thread":
            thread_id = event.get("args", {}).get("thread_id", "")
            sources.append({
                "label": "Email gốc",
                "url": f"https://mail.google.com/mail/u/0/#all/{thread_id}" if thread_id else "",
            })
        elif name == "discord_read_messages":
            sources.append({"label": "Tin nhắn Discord", "url": ""})
        elif name == "calendar_list_events":
            sources.append({"label": "Google Calendar", "url": ""})
    return sources


def _calendar_events(tool_events: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Structured events from every calendar_list_events call this turn, for
    the FE to render as meeting cards — deduped by event id (a follow-up
    round can re-list overlapping ranges)."""
    seen: dict[str, dict[str, Any]] = {}
    for event in tool_events:
        if event.get("tool") != "calendar_list_events":
            continue
        for item in event.get("result", {}).get("events", []) or []:
            if item.get("id"):
                seen[item["id"]] = item
    return list(seen.values())


@app.post("/api/v1/chat")
def chat(request: ChatRequest) -> dict[str, Any]:
    conversation_id = request.conversation_id or uuid.uuid4().hex
    history = _conversations.setdefault(conversation_id, [])

    messages = [
        {"role": "system", "content": _system_prompt},
        *history[-10:],
        {"role": "user", "content": request.user_query},
    ]

    try:
        result = run_model_tool_loop(
            provider=_provider,
            messages=messages,
            tools=_openai_tools,
            model=None,
            max_tool_rounds=4,
        )
    except Exception as exc:
        raise error_response(502, "PROVIDER_ERROR", f"{type(exc).__name__}: {exc}") from exc

    assistant_text = result["assistant_text"]
    history.append({"role": "user", "content": request.user_query})
    history.append({"role": "assistant", "content": assistant_text})

    new_items = derive_from_tool_events(result["tool_events"], _provider)
    timeline_store.upsert(new_items)

    data = {
        "query_id": uuid.uuid4().hex,
        "conversation_id": conversation_id,
        "timestamp": now_iso(),
        "response_text": assistant_text,
        "sources_cited": _sources_cited(result["tool_events"]),
        "calendar_events": _calendar_events(result["tool_events"]),
        "timeline_items_referenced": [item["id"] for item in new_items],
        "requires_clarification": result["status"] == "waiting_for_user",
        "suggested_actions": [],
        # Extra fields beyond UI.md's ChatResponse, per the repo TODO note asking
        # for tool events + artifact version to be visible on the demo UI.
        "tool_events": result["tool_events"],
        "rounds": result["rounds"],
        "status": result["status"],
        "artifact_version": _ARTIFACT_VERSION,
    }
    return envelope(data=data)


@app.get("/api/v1/timeline")
def get_timeline() -> dict[str, Any]:
    items = timeline_store.list_items()
    return envelope(data={"items": items, "total": len(items)})


@app.patch("/api/v1/timeline/{item_id}")
def patch_timeline(item_id: str, request: PatchTimelineRequest) -> dict[str, Any]:
    patch = {k: v for k, v in request.model_dump().items() if v is not None}
    item = timeline_store.update(item_id, patch)
    if item is None:
        raise error_response(404, "NOT_FOUND", f"No timeline item with id {item_id}")
    return envelope(data=item)


@app.post("/api/v1/timeline/{item_id}/feedback")
def flag_timeline(item_id: str, request: FeedbackRequest) -> dict[str, Any]:
    removed = timeline_store.remove(item_id)
    if not removed:
        raise error_response(404, "NOT_FOUND", f"No timeline item with id {item_id}")
    return envelope(data={"status": "queued_for_review", "item_id": item_id})


@app.post("/api/v1/timeline/{item_id}/calendar")
def confirm_calendar(item_id: str, request: CalendarConfirmRequest) -> dict[str, Any]:
    item = timeline_store.get(item_id)
    if item is None:
        raise error_response(404, "NOT_FOUND", f"No timeline item with id {item_id}")

    due_date_iso = item.get("due_date_iso") or ""
    if not due_date_iso:
        raise error_response(
            422,
            "MISSING_DATE",
            "Mục này chưa có ngày cụ thể được xác nhận từ nguồn — không thể thêm vào Calendar. "
            "Hãy chỉnh sửa lại thời gian trước, hoặc kiểm tra nguồn gốc.",
        )

    due_time_iso = item.get("due_time_iso") or ""
    start = f"{due_date_iso}T{due_time_iso}:00" if due_time_iso else due_date_iso
    kwargs: dict[str, Any] = {
        "summary": item["title"],
        "start": start,
        "end": start,
        "description": item.get("detail", ""),
        "confirmed": True,
    }
    if due_time_iso:
        kwargs["timezone"] = request.timezone or "Asia/Ho_Chi_Minh"
    elif request.timezone:
        kwargs["timezone"] = request.timezone

    result = TOOL_FUNCTIONS["calendar_create_event"](**kwargs)
    if "error" in result:
        raise error_response(502, "CALENDAR_ERROR", result.get("message", "calendar_create_event failed"))

    timeline_store.update(item_id, {"verified": True})
    return envelope(data={"status": result.get("status", "created"), "detail": result.get("text", "")})


@app.get("/api/v1/connections")
def get_connections() -> dict[str, Any]:
    """Status of the connections the backend actually knows how to manage.
    One Google connection (shared by Gmail + Calendar) and one Discord
    connection (shared bot, one server); other platforms in the FE's
    connection list remain client-side only for now."""
    try:
        google_status = google_connection.get_status()
    except google_connection.GoogleConnectionError:
        google_status = {"connected": False, "email": None, "scopes": []}
    discord_status = discord_connection.get_status()
    return envelope(data={"google": google_status, "discord": discord_status})


@app.get("/api/v1/connections/google/start")
def start_google_connection() -> dict[str, Any]:
    try:
        auth_url = google_connection.get_authorization_url()
    except google_connection.GoogleConnectionError as exc:
        raise error_response(400, "GOOGLE_OAUTH_NOT_CONFIGURED", str(exc)) from exc
    return envelope(data={"auth_url": auth_url})


@app.get("/api/v1/connections/google/callback")
def google_connection_callback(code: str | None = None, error: str | None = None) -> RedirectResponse:
    if error:
        return RedirectResponse(f"{FRONTEND_URL}/?google_connected=0&reason={error}")
    if not code:
        return RedirectResponse(f"{FRONTEND_URL}/?google_connected=0&reason=missing_code")
    try:
        google_connection.exchange_code(code)
    except Exception:
        logging.exception("Google OAuth token exchange failed")
        return RedirectResponse(f"{FRONTEND_URL}/?google_connected=0&reason=exchange_failed")
    return RedirectResponse(f"{FRONTEND_URL}/?google_connected=1")


@app.post("/api/v1/connections/google/disconnect")
def disconnect_google_connection() -> dict[str, Any]:
    google_connection.disconnect()
    return envelope(data={"connected": False})


@app.get("/api/v1/connections/discord/start")
def start_discord_connection() -> dict[str, Any]:
    """Returns the bot invite URL. Completing it is a manual, one-time action
    by whoever administers the target Discord server — Discord requires
    "Manage Server" on the inviting account, which this backend cannot do on
    anyone's behalf."""
    invite_url = discord_connection.get_invite_url()
    if not invite_url:
        raise error_response(
            400,
            "DISCORD_CLIENT_ID_NOT_SET",
            "Thiếu DISCORD_CLIENT_ID trong codebase/mcp/.env — lấy Application ID trong Discord "
            "Developer Portal (tab General Information).",
        )
    return envelope(data={"invite_url": invite_url})


@app.post("/api/v1/connections/discord/disconnect")
def disconnect_discord_connection(request: DiscordDisconnectRequest) -> dict[str, Any]:
    try:
        discord_connection.disconnect(request.guild_id)
    except ValueError as exc:
        raise error_response(400, "GUILD_ID_REQUIRED", str(exc)) from exc
    except Exception as exc:
        raise error_response(502, "DISCORD_DISCONNECT_FAILED", str(exc)) from exc
    return envelope(data={"guild_id": request.guild_id})
