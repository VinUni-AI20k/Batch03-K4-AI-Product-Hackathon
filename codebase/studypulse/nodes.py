"""
=============================================================================
STUDYPULSE AI — LANGGRAPH NODE IMPLEMENTATIONS (REFACTORED)
=============================================================================
Changes from v1:
1. PII masking moved to dedicated Python preprocessing node (not in LLM prompt)
2. Date formatting done in Python node (not by LLM)
3. LLM calls use .with_structured_output(PydanticModel) — no JSON in prompt
4. Each LLM node injects only BASE_PERSONA + its task-specific sub-prompt
5. Non-LLM nodes are pure Python — no prompt tokens consumed
=============================================================================
"""

from __future__ import annotations

import json
import re
import uuid
from datetime import datetime, timedelta
from typing import Any

from .state import (
    StudyPulseState,
    ExtractedItem,
    ChatResponse,
    EvidenceEntry,
    DailyReminder,
    FlowType,
    Language,
    ItemCategory,
    Priority,
    IntentType,
    SourcePlatform,
)
from .system_prompt import (
    get_base_persona,
    get_extraction_prompt,
    get_rag_prompt,
    get_evidence_prompt,
    get_hitl_prompt,
    get_reminder_prompt,
    BOUNDARY_RULES_SHORT,
    CONFIDENCE_AUTO_APPROVE,
    CONFIDENCE_WARN,
    CONFIDENCE_CLARIFY,
    CONFIDENCE_REJECT,
)


# ═══════════════════════════════════════════════════════════════════════════
# HELPER: Trace updater
# ═══════════════════════════════════════════════════════════════════════════

def _trace(state: StudyPulseState, node_name: str) -> dict:
    """Append node name to metadata trace."""
    metadata = dict(state.get("metadata", {}))
    metadata["node_trace"] = metadata.get("node_trace", []) + [node_name]
    return metadata


# ═══════════════════════════════════════════════════════════════════════════
# PYTHON PREPROCESSING: PII MASKING NODE (no LLM, no tokens)
# ═══════════════════════════════════════════════════════════════════════════

_PII_RULES = [
    # Phone numbers (VN)
    (re.compile(r"\b(0\d{9,10})\b"), "[PHONE_MASKED]"),
    (re.compile(r"\b(\+84\d{9,10})\b"), "[PHONE_MASKED]"),
    # CMND/CCCD (9 or 12 digits)
    (re.compile(r"\b(\d{9}|\d{12})\b"), "[ID_MASKED]"),
    # Passwords in context
    (re.compile(r"(?i)(password|mật khẩu|pass)\s*[:=]\s*\S+"), r"\1: [CREDENTIAL_MASKED]"),
]


def _mask_pii(text: str) -> str:
    """Pure Python PII masking — deterministic, no LLM needed."""
    for pattern, replacement in _PII_RULES:
        text = pattern.sub(replacement, text)
    return text


def _mask_email(email: str) -> str:
    """Mask email local part: h***@domain.com"""
    if "@" not in email:
        return email
    local, domain = email.rsplit("@", 1)
    if len(local) <= 1:
        return f"*@{domain}"
    return f"{local[0]}***@{domain}"


# ═══════════════════════════════════════════════════════════════════════════
# PYTHON PREPROCESSING: DATE FORMATTER NODE (no LLM, no tokens)
# ═══════════════════════════════════════════════════════════════════════════

def _format_date_vi(iso_date: str | None) -> str:
    """Format ISO date to Vietnamese display format."""
    if not iso_date:
        return "Chưa xác định"
    try:
        dt = datetime.fromisoformat(iso_date.replace("Z", "+00:00"))
        weekdays_vi = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]
        return f"{weekdays_vi[dt.weekday()]}, {dt.strftime('%d/%m/%Y')}"
    except (ValueError, TypeError):
        return iso_date


def _format_date_en(iso_date: str | None) -> str:
    """Format ISO date to English display format."""
    if not iso_date:
        return "TBD"
    try:
        dt = datetime.fromisoformat(iso_date.replace("Z", "+00:00"))
        return dt.strftime("%A, %b %d, %Y")
    except (ValueError, TypeError):
        return iso_date


def _format_date(iso_date: str | None, language: str) -> str:
    """Format date based on detected language."""
    return _format_date_vi(iso_date) if language == "vi" else _format_date_en(iso_date)


# ═══════════════════════════════════════════════════════════════════════════
# NODE 1: INGESTION NODE (Pure Python — 0 tokens)
# ═══════════════════════════════════════════════════════════════════════════

def ingestion_node(state: StudyPulseState) -> StudyPulseState:
    """
    Entry point. Normalize raw payloads, run PII masking in Python.
    NO LLM call — pure preprocessing.
    """
    raw = state.get("raw_payload", {})
    user_query = state.get("user_query", "")
    source = raw.get("source_platform", "direct_input")

    # PII masking in Python (NOT in LLM prompt)
    text_content = raw.get("body", "") or raw.get("content", "") or user_query
    masked_text = _mask_pii(text_content)

    metadata = {
        "ingestion_timestamp": datetime.utcnow().isoformat(),
        "source_platform": source,
        "node_trace": ["ingestion_node"],
        "pii_masked": True,
        "original_length": len(text_content),
        "masked_length": len(masked_text),
    }

    return {
        **state,
        "raw_payload": {**raw, "body_masked": masked_text, "original_length": len(text_content)},
        "user_query": user_query if user_query else masked_text,
        "extracted_items": state.get("extracted_items", []),
        "dashboard_timeline": state.get("dashboard_timeline", []),
        "evidence_log": state.get("evidence_log", []),
        "confidence_score": 0.0,
        "requires_hitl": False,
        "hitl_items": [],
        "retry_count": state.get("retry_count", 0),
        "max_retries": state.get("max_retries", 3),
        "error_message": "",
        "final_response": "",
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# NODE 2: LANGUAGE DETECT NODE (Pure Python — 0 tokens)
# ═══════════════════════════════════════════════════════════════════════════

_VI_PATTERN = re.compile(
    r"[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]",
    re.IGNORECASE,
)


def language_detect_node(state: StudyPulseState) -> StudyPulseState:
    """Detect VI/EN from diacritical markers. Pure Python — 0 tokens."""
    text = state.get("user_query", "")
    sample = " ".join(text.split()[:50])
    vi_count = len(_VI_PATTERN.findall(sample))
    detected = "vi" if vi_count >= 3 else "en"

    metadata = _trace(state, "language_detect_node")
    metadata["vi_diacritical_count"] = vi_count

    return {**state, "language": detected, "metadata": metadata}


# ═══════════════════════════════════════════════════════════════════════════
# NODE 3: INTENT ROUTER NODE (Pure Python — 0 tokens)
# ═══════════════════════════════════════════════════════════════════════════

_FLOW_KEYWORDS: dict[str, list[str]] = {
    "spam_rescue": ["spam", "thư rác", "rescue", "cứu mail"],
    "survey_log": ["khảo sát", "survey", "feedback", "phản hồi"],
    "daily_reminder": ["nhắc", "reminder", "deadline ngày mai"],
}

_INTENT_KEYWORDS: dict[str, list[str]] = {
    "query_timeline": ["lịch", "timeline", "schedule", "thời gian"],
    "query_material": ["tài liệu", "bài giảng", "material", "slide"],
    "query_deadline": ["deadline", "hạn nộp", "hạn chót", "nộp bài"],
}


def intent_router_node(state: StudyPulseState) -> StudyPulseState:
    """Classify flow_type + intent. Pure Python keyword matching — 0 tokens."""
    raw = state.get("raw_payload", {})
    query = state.get("user_query", "").lower()
    source = raw.get("source_platform", "direct_input")

    # Flow type classification
    if state.get("flow_type"):
        flow_type = state["flow_type"]
    elif source in ("gmail", "outlook", "discord") and not query.strip():
        flow_type = "ingestion"
    else:
        flow_type = "chat"  # default
        for ft, keywords in _FLOW_KEYWORDS.items():
            if any(kw in query for kw in keywords):
                flow_type = ft
                break

    # Sub-intent for chat flows
    intent = "general"
    if flow_type == "chat":
        for it, keywords in _INTENT_KEYWORDS.items():
            if any(kw in query for kw in keywords):
                intent = it
                break

    metadata = _trace(state, "intent_router_node")
    return {**state, "flow_type": flow_type, "intent": intent, "metadata": metadata}


# ═══════════════════════════════════════════════════════════════════════════
# NODE 4: AI EXTRACTION NODE (LLM call — uses BASE_PERSONA + EXTRACTION_PROMPT)
# Uses .with_structured_output(ExtractionResult) — no JSON schema in prompt
# ═══════════════════════════════════════════════════════════════════════════

from pydantic import BaseModel, Field
from typing import Optional


class LLMExtractedItem(BaseModel):
    """Pydantic model passed to .with_structured_output() — replaces JSON in prompt."""
    category: str = Field(description="deadline|schedule|assignment|announcement|exam|other")
    title: str = Field(description="Extracted title, max 200 chars")
    description: str = Field(default="", description="Brief description, max 1000 chars")
    due_date: Optional[str] = Field(default=None, description="ISO 8601 date or null")
    due_time: Optional[str] = Field(default=None, description="HH:MM or null")
    time_unspecified: bool = Field(default=False, description="True if no time in source")
    priority: str = Field(default="medium", description="critical|high|medium|low")
    confidence_score: float = Field(description="0.0-1.0 extraction confidence")
    requires_clarification: bool = Field(default=False, description="Ambiguous date/info")
    conflict_detected: bool = Field(default=False, description="Conflicting sources found")


class ExtractionResult(BaseModel):
    """Top-level structured output for extraction — passed to LLM via API schema."""
    items: list[LLMExtractedItem] = Field(default_factory=list)


def ai_extraction_node(state: StudyPulseState) -> StudyPulseState:
    """
    LLM extraction using:
    - SystemMessage: BASE_PERSONA only (~120 tokens, cacheable)
    - HumanMessage: EXTRACTION_PROMPT with runtime context
    - .with_structured_output(ExtractionResult) → Pydantic enforced at API level
    """
    raw = state.get("raw_payload", {})
    text = raw.get("body_masked", state.get("user_query", ""))
    source = raw.get("source_platform", "direct_input")
    language = state.get("language", "vi")
    today = datetime.utcnow().strftime("%Y-%m-%d")
    current_year = datetime.utcnow().year

    # ── PRODUCTION LLM CALL ──
    # from langchain_core.messages import HumanMessage, SystemMessage
    # from langchain_google_genai import ChatGoogleGenerativeAI
    #
    # llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    # structured_llm = llm.with_structured_output(ExtractionResult)
    #
    # result: ExtractionResult = structured_llm.invoke([
    #     SystemMessage(content=get_base_persona()),       # ~120 tokens, CACHED
    #     HumanMessage(content=get_extraction_prompt(      # Task-specific, fresh
    #         text=text,
    #         source_platform=source,
    #         today=today,
    #         current_year=current_year,
    #     )),
    # ])
    # extracted_items = [
    #     ExtractedItem(
    #         source_platform=SourcePlatform(source),
    #         source_message_id=raw.get("message_id", str(uuid.uuid4())),
    #         language_detected=Language(language),
    #         pii_masked=True,
    #         raw_snippet=text[:500],
    #         **item.model_dump(),
    #     ).model_dump()
    #     for item in result.items
    # ]

    # ── MOCK EXTRACTION for prototype ──
    extracted_items = _mock_extract(text, source, language)

    # Aggregate confidence
    avg_conf = (
        sum(i.get("confidence_score", 0) for i in extracted_items) / len(extracted_items)
        if extracted_items else 0.0
    )

    # Flag HITL items
    hitl_items = [i for i in extracted_items if i.get("confidence_score", 0) < CONFIDENCE_WARN]

    metadata = _trace(state, "ai_extraction_node")
    metadata["items_extracted"] = len(extracted_items)
    metadata["items_needing_hitl"] = len(hitl_items)
    metadata["prompt_architecture"] = "base_persona(cached) + extraction_subprompt"

    return {
        **state,
        "extracted_items": extracted_items,
        "confidence_score": round(avg_conf, 3),
        "requires_hitl": len(hitl_items) > 0,
        "hitl_items": hitl_items,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# NODE 5: VALIDATION GUARDRAIL NODE (Pure Python — 0 tokens)
# Date sanity, duplicates, confidence thresholds — all deterministic
# ═══════════════════════════════════════════════════════════════════════════

def validation_guardrail_node(state: StudyPulseState) -> StudyPulseState:
    """Pure Python validation — no LLM, no tokens consumed."""
    items = state.get("extracted_items", [])
    dashboard = state.get("dashboard_timeline", [])
    retry_count = state.get("retry_count", 0)
    max_retries = state.get("max_retries", 3)

    if retry_count >= max_retries:
        metadata = _trace(state, "validation_guardrail_node")
        return {
            **state,
            "error_message": f"Max retries ({max_retries}) exceeded. Escalating to HITL.",
            "requires_hitl": True,
            "metadata": metadata,
        }

    validated, rejected = [], []
    now = datetime.utcnow()
    grace = now - timedelta(days=1)
    existing_titles = {d.get("title", "").lower() for d in dashboard}
    valid_categories = {c.value for c in ItemCategory}

    for item in items:
        issues = []
        if not item.get("title", "").strip():
            issues.append("empty_title")

        due = item.get("due_date")
        if due:
            try:
                due_dt = datetime.fromisoformat(due.replace("Z", "+00:00"))
                if due_dt < grace:
                    issues.append("date_in_past")
            except (ValueError, TypeError):
                issues.append("invalid_date_format")

        if item.get("category") not in valid_categories:
            issues.append("invalid_category")
        if item.get("title", "").lower() in existing_titles:
            issues.append("duplicate_detected")
        if item.get("confidence_score", 0) < CONFIDENCE_REJECT:
            issues.append("below_minimum_confidence")

        if issues:
            item["validation_issues"] = issues
            rejected.append(item)
        else:
            validated.append(item)

    hitl_items = [i for i in validated if i.get("confidence_score", 0) < CONFIDENCE_WARN]
    confirmed = [i for i in validated if i.get("confidence_score", 0) >= CONFIDENCE_WARN]

    metadata = _trace(state, "validation_guardrail_node")
    metadata["validated_count"] = len(confirmed)
    metadata["rejected_count"] = len(rejected)

    return {
        **state,
        "extracted_items": confirmed,
        "hitl_items": state.get("hitl_items", []) + hitl_items + rejected,
        "requires_hitl": len(hitl_items) > 0 or len(rejected) > 0,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# NODE 6: DASHBOARD SYNC NODE (Pure Python — 0 tokens)
# ═══════════════════════════════════════════════════════════════════════════

def dashboard_sync_node(state: StudyPulseState) -> StudyPulseState:
    """Append-only merge to timeline. Pure Python."""
    confirmed = state.get("extracted_items", [])
    existing = state.get("dashboard_timeline", [])
    updated = existing + confirmed
    updated.sort(key=lambda x: x.get("due_date") or "9999-12-31")

    metadata = _trace(state, "dashboard_sync_node")
    metadata["dashboard_total"] = len(updated)

    return {**state, "dashboard_timeline": updated, "metadata": metadata}


# ═══════════════════════════════════════════════════════════════════════════
# NODE 7: RAG CHATBOT NODE (LLM call — BASE_PERSONA + RAG_CHATBOT_PROMPT)
# ═══════════════════════════════════════════════════════════════════════════

def rag_chatbot_node(state: StudyPulseState) -> StudyPulseState:
    """
    RAG chatbot using:
    - SystemMessage: BASE_PERSONA (cached)
    - HumanMessage: RAG_CHATBOT_PROMPT with retrieved context
    - .with_structured_output(ChatResponse) for typed output
    """
    query = state.get("user_query", "")
    language = state.get("language", "vi")
    intent = state.get("intent", "general")
    timeline = state.get("dashboard_timeline", [])

    # ── PRODUCTION LLM CALL ──
    # structured_llm = llm.with_structured_output(ChatResponse)
    # result = structured_llm.invoke([
    #     SystemMessage(content=get_base_persona()),    # CACHED
    #     HumanMessage(content=get_rag_prompt(
    #         query=query, language=language,
    #         rag_context=retrieved_docs, timeline_data=json.dumps(timeline[:10]),
    #     )),
    # ])

    # ── MOCK RESPONSE ──
    if intent == "query_deadline":
        upcoming = [i for i in timeline if i.get("category") in ("deadline", "assignment", "exam")]
        if upcoming:
            items_text = "\n".join(
                f"- {i['title']} | {_format_date(i.get('due_date'), language)} | {i.get('source_platform', '')}"
                for i in upcoming[:5]
            )
            response_text = f"Các deadline sắp tới:\n{items_text}" if language == "vi" else f"Upcoming deadlines:\n{items_text}"
        else:
            response_text = "Không tìm thấy deadline nào." if language == "vi" else "No deadlines found."
    elif intent == "query_timeline":
        if timeline:
            items_text = "\n".join(
                f"- [{i.get('category', '')}] {i['title']} | {_format_date(i.get('due_date'), language)}"
                for i in timeline[:10]
            )
            response_text = f"Timeline hiện tại:\n{items_text}" if language == "vi" else f"Current timeline:\n{items_text}"
        else:
            response_text = "Timeline trống." if language == "vi" else "Timeline is empty."
    else:
        response_text = (
            "Tôi có thể giúp bạn tra cứu deadline, lịch học, và tài liệu bài giảng. Hãy hỏi cụ thể hơn!"
            if language == "vi"
            else "I can help you look up deadlines, schedules, and lecture materials. Please ask a specific question!"
        )

    chat_resp = ChatResponse(
        language=Language(language),
        intent=IntentType(intent) if intent in [e.value for e in IntentType] else IntentType.GENERAL,
        response_text=response_text,
        confidence=0.9,
    ).model_dump()

    metadata = _trace(state, "rag_chatbot_node")
    metadata["prompt_architecture"] = "base_persona(cached) + rag_subprompt"

    return {**state, "chat_response": chat_resp, "final_response": response_text, "metadata": metadata}


# ═══════════════════════════════════════════════════════════════════════════
# NODE 8: USER EVIDENCE LOG NODE (Python preprocessing + minimal LLM)
# PII masking done in Python BEFORE any LLM confirmation call
# ═══════════════════════════════════════════════════════════════════════════

def user_evidence_log_node(state: StudyPulseState) -> StudyPulseState:
    """
    Log survey responses VERBATIM.
    PII masking: Python preprocessing (not LLM).
    Confirmation message: can use LLM or static template.
    """
    query = state.get("user_query", "")
    raw = state.get("raw_payload", {})
    language = state.get("language", "vi")

    survey_question = raw.get("survey_question", "Phản hồi trải nghiệm học tập")
    respondent_email = raw.get("respondent_email", "unknown@student.vinai.edu.vn")

    # PII masking in PYTHON (not LLM) — deterministic, no token cost
    masked_email = _mask_email(respondent_email)
    pii_fields = []
    verbatim = query
    if re.search(r"\b\d{9,12}\b", verbatim):
        verbatim = re.sub(r"\b\d{9,12}\b", "[PHONE_MASKED]", verbatim)
        pii_fields.append("phone_number")
    if re.search(r"password|mật khẩu", verbatim, re.IGNORECASE):
        verbatim = re.sub(r"(?i)(password|mật khẩu)\s*[:=]\s*\S+", r"\1: [CREDENTIAL_MASKED]", verbatim)
        pii_fields.append("password")

    entry = EvidenceEntry(
        respondent_email_masked=masked_email,
        survey_question=survey_question,
        verbatim_text=verbatim,  # IMMUTABLE
        language_detected=Language(language),
        source="direct_input",
        pii_masked_fields=pii_fields,
    ).model_dump()

    evidence_log = state.get("evidence_log", []) + [entry]

    # Static confirmation (no LLM needed for this)
    confirmation = (
        f"✅ Đã ghi nhận phản hồi nguyên văn (ID: {entry['id'][:8]}...). Cảm ơn bạn!"
        if language == "vi"
        else f"✅ Verbatim feedback recorded (ID: {entry['id'][:8]}...). Thank you!"
    )

    metadata = _trace(state, "user_evidence_log_node")
    metadata["evidence_entries_total"] = len(evidence_log)
    metadata["pii_masked_in"] = "python_node"

    return {**state, "evidence_log": evidence_log, "final_response": confirmation, "metadata": metadata}


# ═══════════════════════════════════════════════════════════════════════════
# NODE 9: HITL ESCALATION NODE (Python formatting — 0 tokens)
# ═══════════════════════════════════════════════════════════════════════════

def hitl_escalation_node(state: StudyPulseState) -> StudyPulseState:
    """Format escalation message. Pure Python — no LLM tokens."""
    hitl_items = state.get("hitl_items", [])
    language = state.get("language", "vi")
    error_msg = state.get("error_message", "")

    if not hitl_items and not error_msg:
        metadata = _trace(state, "hitl_escalation_node (skip)")
        return {**state, "metadata": metadata}

    escalation_details = []
    for item in hitl_items:
        issues = item.get("validation_issues", [])
        conf = item.get("confidence_score", 0)
        escalation_details.append(
            f"- [{item.get('category', '?')}] {item.get('title', 'N/A')} | "
            f"confidence: {conf:.2f} | issues: {', '.join(issues) if issues else 'low_confidence'}"
        )

    details_text = "\n".join(escalation_details) if escalation_details else error_msg

    if language == "vi":
        response = (
            f"⚠️ **Cần xác nhận từ TA/giảng viên**\n\n"
            f"Các mục sau có độ tin cậy thấp hoặc cần kiểm tra thủ công:\n\n"
            f"{details_text}\n\n"
            f"Vui lòng xác nhận hoặc chỉnh sửa trước khi thêm vào timeline."
        )
    else:
        response = (
            f"⚠️ **TA/Instructor Review Required**\n\n"
            f"The following items have low confidence or need manual verification:\n\n"
            f"{details_text}\n\n"
            f"Please confirm or edit before adding to the timeline."
        )

    metadata = _trace(state, "hitl_escalation_node")
    metadata["escalation_count"] = len(hitl_items)

    return {**state, "final_response": response, "metadata": metadata}


# ═══════════════════════════════════════════════════════════════════════════
# NODE 10: RESPONSE FORMATTER NODE (Python postprocessing — 0 tokens)
# Date formatting done here in Python, not by LLM
# ═══════════════════════════════════════════════════════════════════════════

def response_formatter_node(state: StudyPulseState) -> StudyPulseState:
    """Format final response. Date formatting in Python. No LLM tokens."""
    language = state.get("language", "vi")
    flow_type = state.get("flow_type", "chat")
    final = state.get("final_response", "")

    if not final:
        if flow_type == "ingestion":
            items = state.get("extracted_items", [])
            hitl = state.get("hitl_items", [])
            if language == "vi":
                final = (
                    f"📋 Đã trích xuất {len(items)} mục từ nguồn.\n"
                    f"✅ Đã thêm vào timeline: {len(items)}\n"
                    f"⚠️ Cần xác nhận: {len(hitl)}"
                )
            else:
                final = (
                    f"📋 Extracted {len(items)} items from source.\n"
                    f"✅ Added to timeline: {len(items)}\n"
                    f"⚠️ Needs confirmation: {len(hitl)}"
                )
        else:
            final = (
                "Xin lỗi, tôi không tìm thấy thông tin phù hợp."
                if language == "vi"
                else "Sorry, I couldn't find relevant information."
            )

    metadata = _trace(state, "response_formatter_node")
    metadata["response_timestamp"] = datetime.utcnow().isoformat()

    return {**state, "final_response": final, "metadata": metadata}


# ═══════════════════════════════════════════════════════════════════════════
# NODE 11: SPAM RESCUE NODE (can use LLM for classification)
# ═══════════════════════════════════════════════════════════════════════════

def spam_rescue_node(state: StudyPulseState) -> StudyPulseState:
    """Scan spam folders. LLM optional for classification."""
    language = state.get("language", "vi")
    rescued_count = 0  # Mock

    if language == "vi":
        response = (
            f"🔍 Đã quét thư mục Spam/Junk.\n"
            f"📬 Phát hiện {rescued_count} email học tập quan trọng.\n"
            f"Các email đã được di chuyển về hộp thư chính."
        )
    else:
        response = (
            f"🔍 Scanned Spam/Junk folder.\n"
            f"📬 Found {rescued_count} important academic emails.\n"
            f"Emails have been moved to your main inbox."
        )

    metadata = _trace(state, "spam_rescue_node")
    return {**state, "final_response": response, "metadata": metadata}


# ═══════════════════════════════════════════════════════════════════════════
# NODE 12: DAILY REMINDER NODE (Python aggregation + optional LLM polish)
# ═══════════════════════════════════════════════════════════════════════════

def daily_reminder_node(state: StudyPulseState) -> StudyPulseState:
    """Generate next-day reminder. Aggregation in Python."""
    language = state.get("language", "vi")
    timeline = state.get("dashboard_timeline", [])
    tomorrow = (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d")

    tomorrow_items = [i for i in timeline if i.get("due_date", "")[:10] == tomorrow]
    critical = [i for i in tomorrow_items if i.get("priority") == "critical"]

    if language == "vi":
        if tomorrow_items:
            items_text = "\n".join(
                f"  {'🔴' if i.get('priority') == 'critical' else '🟡'} "
                f"{i['title']} — {i.get('due_time') or 'chưa rõ giờ'}"
                for i in tomorrow_items
            )
            msg = (
                f"⏰ **Nhắc nhở deadline ngày mai ({_format_date(tomorrow, 'vi')})**\n\n"
                f"Bạn có {len(tomorrow_items)} mục cần hoàn thành "
                f"({len(critical)} quan trọng):\n\n{items_text}"
            )
        else:
            msg = f"✅ Không có deadline nào vào ngày mai ({_format_date(tomorrow, 'vi')}). Nghỉ ngơi nhé!"
    else:
        if tomorrow_items:
            items_text = "\n".join(
                f"  {'🔴' if i.get('priority') == 'critical' else '🟡'} "
                f"{i['title']} — {i.get('due_time') or 'time TBD'}"
                for i in tomorrow_items
            )
            msg = (
                f"⏰ **Tomorrow's Deadline Reminder ({_format_date(tomorrow, 'en')})**\n\n"
                f"You have {len(tomorrow_items)} items due "
                f"({len(critical)} critical):\n\n{items_text}"
            )
        else:
            msg = f"✅ No deadlines tomorrow ({_format_date(tomorrow, 'en')}). Rest well!"

    reminder = DailyReminder(
        target_date=tomorrow,
        language=Language(language),
        items=[ExtractedItem(**i) for i in tomorrow_items] if tomorrow_items else [],
        total_items=len(tomorrow_items),
        critical_count=len(critical),
        message_text=msg,
    ).model_dump()

    metadata = _trace(state, "daily_reminder_node")
    return {**state, "daily_reminder": reminder, "final_response": msg, "metadata": metadata}


# ═══════════════════════════════════════════════════════════════════════════
# MOCK EXTRACTION (prototype only — replace with LLM structured output)
# ═══════════════════════════════════════════════════════════════════════════

def _mock_extract(text: str, source: str, language: str) -> list[dict]:
    """Mock extraction for prototype. Production: use .with_structured_output()."""
    items = []
    deadline_patterns = [
        (r"(?:deadline|hạn nộp|hạn chót)[:\s]*(.+?)(?:\n|$)", "deadline"),
        (r"(?:nộp bài|submit)[:\s]*(.+?)(?:\n|$)", "assignment"),
        (r"(?:thi|exam|kiểm tra)[:\s]*(.+?)(?:\n|$)", "exam"),
        (r"(?:lịch học|schedule|buổi học)[:\s]*(.+?)(?:\n|$)", "schedule"),
    ]
    for pattern, category in deadline_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            item = ExtractedItem(
                source_platform=(
                    SourcePlatform(source)
                    if source in [e.value for e in SourcePlatform]
                    else SourcePlatform.DIRECT_INPUT
                ),
                source_message_id=str(uuid.uuid4()),
                category=ItemCategory(category),
                title=match.strip()[:200],
                confidence_score=0.88,
                language_detected=Language(language),
                pii_masked=True,
                raw_snippet=text[:500],
            ).model_dump()
            items.append(item)
    return items
