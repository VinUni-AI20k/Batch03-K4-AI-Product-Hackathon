"""
=============================================================================
STUDYPULSE AI — STATE SCHEMA & TYPE DEFINITIONS
=============================================================================
LangGraph State TypedDict + Pydantic models for extraction, chat, evidence.
=============================================================================
"""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field
from typing_extensions import TypedDict


# ═══════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════

class SourcePlatform(str, Enum):
    GMAIL = "gmail"
    OUTLOOK = "outlook"
    DISCORD = "discord"
    DIRECT_INPUT = "direct_input"


class ItemCategory(str, Enum):
    DEADLINE = "deadline"
    SCHEDULE = "schedule"
    ASSIGNMENT = "assignment"
    ANNOUNCEMENT = "announcement"
    EXAM = "exam"
    OTHER = "other"


class Priority(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class FlowType(str, Enum):
    INGESTION = "ingestion"
    CHAT = "chat"
    SURVEY_LOG = "survey_log"
    SPAM_RESCUE = "spam_rescue"
    DAILY_REMINDER = "daily_reminder"


class Language(str, Enum):
    VI = "vi"
    EN = "en"


class IntentType(str, Enum):
    QUERY_TIMELINE = "query_timeline"
    QUERY_MATERIAL = "query_material"
    QUERY_DEADLINE = "query_deadline"
    GENERAL = "general"


# ═══════════════════════════════════════════════════════════════════════════
# PYDANTIC MODELS — Extraction, Chat, Evidence
# ═══════════════════════════════════════════════════════════════════════════

class ExtractedItem(BaseModel):
    """Single extracted academic item from any source channel."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    source_platform: SourcePlatform
    source_message_id: str
    source_channel: str = ""
    category: ItemCategory
    title: str = Field(..., max_length=200)
    description: str = Field(default="", max_length=1000)
    due_date: Optional[str] = None  # ISO 8601
    due_time: Optional[str] = None  # HH:MM
    time_unspecified: bool = False
    recurrence: str = "none"
    priority: Priority = Priority.MEDIUM
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    requires_clarification: bool = False
    conflict_detected: bool = False
    conflicting_sources: list[str] = Field(default_factory=list)
    extracted_by: str = "studypulse_ai_v1"
    language_detected: Language = Language.VI
    pii_masked: bool = False
    raw_snippet: str = Field(default="", max_length=500)


class ChatResponse(BaseModel):
    """Structured response from the RAG chatbot node."""
    query_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    language: Language
    intent: IntentType
    response_text: str
    sources_cited: list[dict[str, str]] = Field(default_factory=list)
    timeline_items_referenced: list[str] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)
    requires_clarification: bool = False
    suggested_actions: list[str] = Field(default_factory=list)


class EvidenceEntry(BaseModel):
    """Verbatim survey/feedback evidence log entry."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    respondent_email_masked: str
    survey_question: str
    verbatim_text: str  # IMMUTABLE — exact user response
    language_detected: Language
    source: str = "direct_input"
    pii_masked_fields: list[str] = Field(default_factory=list)


class DailyReminder(BaseModel):
    """Consolidated next-day deadline reminder."""
    reminder_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    generated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    target_date: str  # YYYY-MM-DD
    scheduled_send_time: str = "22:00"
    language: Language = Language.VI
    items: list[ExtractedItem] = Field(default_factory=list)
    total_items: int = 0
    critical_count: int = 0
    message_text: str = ""


# ═══════════════════════════════════════════════════════════════════════════
# LANGGRAPH STATE SCHEMA
# ═══════════════════════════════════════════════════════════════════════════

class StudyPulseState(TypedDict, total=False):
    """
    Central state object passed through all LangGraph nodes.
    
    Fields:
    -------
    raw_payload : dict
        Raw incoming message/webhook payload from any source channel.
    user_query : str
        Direct user text input (for chat or survey flows).
    user_id : str
        Masked student identifier.
    language : str
        Detected language code ('vi' or 'en').
    flow_type : str
        Routing discriminator: 'ingestion' | 'chat' | 'survey_log' |
        'spam_rescue' | 'daily_reminder'.
    intent : str
        Sub-intent within chat flow: 'query_timeline' | 'query_material' |
        'query_deadline' | 'general'.
    extracted_items : list[dict]
        List of ExtractedItem dicts produced by AIExtractionNode.
    dashboard_timeline : list[dict]
        Confirmed items synced to the unified dashboard.
    evidence_log : list[dict]
        Verbatim evidence entries from UserEvidenceLogNode.
    chat_response : dict
        Structured chat response from RAGChatbotNode.
    daily_reminder : dict
        Compiled reminder object from ReminderNode.
    confidence_score : float
        Aggregate confidence for the current extraction batch.
    requires_hitl : bool
        True if any item needs human-in-the-loop escalation.
    hitl_items : list[dict]
        Items flagged for HITL review.
    retry_count : int
        Current retry counter for failed operations.
    max_retries : int
        Ceiling for retry attempts (default: 3).
    error_message : str
        Error description if a node fails.
    final_response : str
        Formatted final response string to return to user.
    metadata : dict
        Auxiliary metadata (timestamps, node trace, etc.).
    """
    raw_payload: dict[str, Any]
    user_query: str
    user_id: str
    language: str
    flow_type: str
    intent: str
    extracted_items: list[dict[str, Any]]
    dashboard_timeline: list[dict[str, Any]]
    evidence_log: list[dict[str, Any]]
    chat_response: dict[str, Any]
    daily_reminder: dict[str, Any]
    confidence_score: float
    requires_hitl: bool
    hitl_items: list[dict[str, Any]]
    retry_count: int
    max_retries: int
    error_message: str
    final_response: str
    metadata: dict[str, Any]
