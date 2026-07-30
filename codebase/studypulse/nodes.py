"""
=============================================================================
STUDYPULSE AI — LANGGRAPH NODE IMPLEMENTATIONS
=============================================================================
All 10 nodes: Ingestion, LangDetect, IntentRouter, AIExtraction,
ValidationGuardrail, DashboardSync, RAGChatbot, UserEvidenceLog,
HITLEscalation, ResponseFormatter + SpamRescue, DailyReminder.
=============================================================================
"""

from __future__ import annotations

import json
import re
import uuid
from datetime import datetime, timedelta
from typing import Any

# LangGraph & LangChain imports (runtime dependencies)
# from langchain_core.messages import HumanMessage, SystemMessage
# from langchain_google_genai import ChatGoogleGenerativeAI

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
from .system_prompt import get_system_prompt


# ═══════════════════════════════════════════════════════════════════════════
# NODE 1: INGESTION NODE
# ═══════════════════════════════════════════════════════════════════════════

def ingestion_node(state: StudyPulseState) -> StudyPulseState:
    """
    Entry point. Normalize raw payloads from Gmail/Outlook/Discord/Direct.
    
    Responsibilities:
    - Parse webhook payload or direct input
    - Normalize to unified internal format
    - Initialize state fields with defaults
    - Mask PII in raw payload before downstream processing
    """
    raw = state.get("raw_payload", {})
    user_query = state.get("user_query", "")

    # Determine source platform from payload metadata
    source = raw.get("source_platform", "direct_input")

    # PII masking on raw text
    text_content = raw.get("body", "") or raw.get("content", "") or user_query
    masked_text = _mask_pii(text_content)

    # Initialize state defaults
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
        "metadata": {
            "ingestion_timestamp": datetime.utcnow().isoformat(),
            "source_platform": source,
            "node_trace": ["ingestion_node"],
        },
    }


# ═══════════════════════════════════════════════════════════════════════════
# NODE 2: LANGUAGE DETECT NODE
# ═══════════════════════════════════════════════════════════════════════════

def language_detect_node(state: StudyPulseState) -> StudyPulseState:
    """
    Detect input language (VI/EN) from first 50 tokens.
    
    Algorithm:
    1. Tokenize first 50 words of user_query
    2. Count Vietnamese diacritical markers (ắ, ề, ủ, ơ, etc.)
    3. If ≥3 diacritical tokens → VI; else → EN
    4. Mixed → VI primary (per system prompt protocol)
    """
    text = state.get("user_query", "")
    tokens = text.split()[:50]
    sample = " ".join(tokens)

    # Vietnamese diacritical detection pattern
    vi_pattern = re.compile(
        r"[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]",
        re.IGNORECASE,
    )
    vi_count = len(vi_pattern.findall(sample))

    detected = "vi" if vi_count >= 3 else "en"

    metadata = state.get("metadata", {})
    metadata["node_trace"] = metadata.get("node_trace", []) + ["language_detect_node"]
    metadata["vi_diacritical_count"] = vi_count

    return {
        **state,
        "language": detected,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# NODE 3: INTENT ROUTER NODE
# ═══════════════════════════════════════════════════════════════════════════

def intent_router_node(state: StudyPulseState) -> StudyPulseState:
    """
    Classify flow_type based on payload source and content signals.
    
    Routing Logic:
    - Webhook payload with source_platform in (gmail, outlook, discord) → 'ingestion'
    - Direct user text with question markers → 'chat'
    - Direct user text with survey/feedback signals → 'survey_log'
    - Spam rescue request → 'spam_rescue'
    - Scheduled trigger → 'daily_reminder'
    """
    raw = state.get("raw_payload", {})
    query = state.get("user_query", "").lower()
    source = raw.get("source_platform", "direct_input")

    # Pre-set flow_type overrides
    if state.get("flow_type"):
        flow_type = state["flow_type"]
    elif source in ("gmail", "outlook", "discord") and not query.strip():
        flow_type = "ingestion"
    elif any(kw in query for kw in ["spam", "thư rác", "rescue", "cứu mail"]):
        flow_type = "spam_rescue"
    elif any(kw in query for kw in ["khảo sát", "survey", "feedback", "phản hồi"]):
        flow_type = "survey_log"
    elif any(kw in query for kw in ["nhắc", "reminder", "deadline ngày mai"]):
        flow_type = "daily_reminder"
    else:
        flow_type = "chat"

    # Sub-intent for chat flows
    intent = "general"
    if flow_type == "chat":
        if any(kw in query for kw in ["lịch", "timeline", "schedule", "thời gian"]):
            intent = "query_timeline"
        elif any(kw in query for kw in ["tài liệu", "bài giảng", "material", "slide"]):
            intent = "query_material"
        elif any(kw in query for kw in ["deadline", "hạn nộp", "hạn chót", "nộp bài"]):
            intent = "query_deadline"

    metadata = state.get("metadata", {})
    metadata["node_trace"] = metadata.get("node_trace", []) + ["intent_router_node"]

    return {
        **state,
        "flow_type": flow_type,
        "intent": intent,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# NODE 4: AI EXTRACTION NODE
# ═══════════════════════════════════════════════════════════════════════════

def ai_extraction_node(state: StudyPulseState) -> StudyPulseState:
    """
    LLM-powered extraction of deadlines, schedules, assignments from raw text.
    
    Uses system prompt + structured output to extract items.
    Precision > Recall enforced:
    - Only extract items with explicit textual evidence
    - Never fabricate dates not present in source
    - Assign confidence scores based on extraction certainty
    """
    raw = state.get("raw_payload", {})
    text = raw.get("body_masked", state.get("user_query", ""))
    source = raw.get("source_platform", "direct_input")
    language = state.get("language", "vi")

    # ── LLM EXTRACTION CALL (placeholder — replace with actual LLM call) ──
    # In production:
    # llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    # response = llm.invoke([
    #     SystemMessage(content=get_system_prompt()),
    #     HumanMessage(content=EXTRACTION_PROMPT.format(text=text, source=source))
    # ])
    # extracted_items = parse_extraction_response(response.content)

    # ── MOCK EXTRACTION for prototype ──
    extracted_items = _mock_extract(text, source, language)

    # Calculate aggregate confidence
    if extracted_items:
        avg_conf = sum(i.get("confidence_score", 0) for i in extracted_items) / len(extracted_items)
    else:
        avg_conf = 0.0

    # Flag items needing HITL
    hitl_items = [i for i in extracted_items if i.get("confidence_score", 0) < 0.85]
    requires_hitl = len(hitl_items) > 0

    metadata = state.get("metadata", {})
    metadata["node_trace"] = metadata.get("node_trace", []) + ["ai_extraction_node"]
    metadata["items_extracted"] = len(extracted_items)
    metadata["items_needing_hitl"] = len(hitl_items)

    return {
        **state,
        "extracted_items": extracted_items,
        "confidence_score": round(avg_conf, 3),
        "requires_hitl": requires_hitl,
        "hitl_items": hitl_items,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# NODE 5: VALIDATION GUARDRAIL NODE
# ═══════════════════════════════════════════════════════════════════════════

def validation_guardrail_node(state: StudyPulseState) -> StudyPulseState:
    """
    Quality gate: validate extracted items against business rules.
    
    Checks:
    1. Date sanity: due_date not in the past (allow 1-day grace)
    2. Title not empty
    3. Category is valid enum value
    4. Confidence thresholds enforced
    5. Duplicate detection across existing dashboard_timeline
    6. Retry ceiling check
    """
    items = state.get("extracted_items", [])
    dashboard = state.get("dashboard_timeline", [])
    retry_count = state.get("retry_count", 0)
    max_retries = state.get("max_retries", 3)

    # Retry ceiling guard
    if retry_count >= max_retries:
        metadata = state.get("metadata", {})
        metadata["node_trace"] = metadata.get("node_trace", []) + ["validation_guardrail_node"]
        return {
            **state,
            "error_message": f"Max retries ({max_retries}) exceeded. Escalating to HITL.",
            "requires_hitl": True,
            "metadata": metadata,
        }

    validated = []
    rejected = []
    now = datetime.utcnow()
    grace = now - timedelta(days=1)

    existing_titles = {d.get("title", "").lower() for d in dashboard}

    for item in items:
        issues = []

        # Title check
        if not item.get("title", "").strip():
            issues.append("empty_title")

        # Date sanity
        due = item.get("due_date")
        if due:
            try:
                due_dt = datetime.fromisoformat(due.replace("Z", "+00:00"))
                if due_dt < grace:
                    issues.append("date_in_past")
            except (ValueError, TypeError):
                issues.append("invalid_date_format")

        # Category validation
        valid_categories = {c.value for c in ItemCategory}
        if item.get("category") not in valid_categories:
            issues.append("invalid_category")

        # Duplicate detection
        if item.get("title", "").lower() in existing_titles:
            issues.append("duplicate_detected")

        # Confidence threshold
        conf = item.get("confidence_score", 0)
        if conf < 0.70:
            issues.append("below_minimum_confidence")

        if issues:
            item["validation_issues"] = issues
            rejected.append(item)
        else:
            validated.append(item)

    metadata = state.get("metadata", {})
    metadata["node_trace"] = metadata.get("node_trace", []) + ["validation_guardrail_node"]
    metadata["validated_count"] = len(validated)
    metadata["rejected_count"] = len(rejected)

    # Re-assess HITL need after validation
    hitl_items = [i for i in validated if i.get("confidence_score", 0) < 0.85]
    confirmed_items = [i for i in validated if i.get("confidence_score", 0) >= 0.85]

    return {
        **state,
        "extracted_items": confirmed_items,
        "hitl_items": state.get("hitl_items", []) + hitl_items + rejected,
        "requires_hitl": len(hitl_items) > 0 or len(rejected) > 0,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# NODE 6: DASHBOARD SYNC NODE
# ═══════════════════════════════════════════════════════════════════════════

def dashboard_sync_node(state: StudyPulseState) -> StudyPulseState:
    """
    Sync validated items to the unified dashboard timeline.
    
    Operations:
    - Append confirmed items to dashboard_timeline
    - Sort by due_date (earliest first)
    - Generate timeline view
    - DO NOT modify existing items without user approval
    """
    confirmed = state.get("extracted_items", [])
    existing = state.get("dashboard_timeline", [])

    # Merge — append only, never overwrite
    updated = existing + confirmed

    # Sort by due_date (None → end of list)
    def sort_key(item: dict) -> str:
        return item.get("due_date") or "9999-12-31"

    updated.sort(key=sort_key)

    metadata = state.get("metadata", {})
    metadata["node_trace"] = metadata.get("node_trace", []) + ["dashboard_sync_node"]
    metadata["dashboard_total"] = len(updated)

    return {
        **state,
        "dashboard_timeline": updated,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# NODE 7: RAG CHATBOT NODE
# ═══════════════════════════════════════════════════════════════════════════

def rag_chatbot_node(state: StudyPulseState) -> StudyPulseState:
    """
    RAG-powered chatbot for timeline queries & lecture material lookup.
    
    Flow:
    1. Retrieve relevant items from dashboard_timeline
    2. Retrieve relevant lecture content from vector store (if material query)
    3. Generate response with source citations
    4. Apply bilingual formatting
    """
    query = state.get("user_query", "")
    language = state.get("language", "vi")
    intent = state.get("intent", "general")
    timeline = state.get("dashboard_timeline", [])

    # ── RAG RETRIEVAL (placeholder) ──
    # In production: vector_store.similarity_search(query, k=5)

    # ── LLM RESPONSE GENERATION (placeholder) ──
    # llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)

    # ── MOCK RESPONSE ──
    if intent == "query_deadline":
        upcoming = [i for i in timeline if i.get("category") in ("deadline", "assignment", "exam")]
        if upcoming:
            items_text = "\n".join(
                f"- {i['title']} | {i.get('due_date', 'N/A')} | {i.get('source_platform', '')}"
                for i in upcoming[:5]
            )
            response_text = f"Các deadline sắp tới:\n{items_text}" if language == "vi" else f"Upcoming deadlines:\n{items_text}"
        else:
            response_text = "Không tìm thấy deadline nào." if language == "vi" else "No deadlines found."
    elif intent == "query_timeline":
        if timeline:
            items_text = "\n".join(
                f"- [{i.get('category', '')}] {i['title']} | {i.get('due_date', 'N/A')}"
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
        intent=IntentType(intent) if intent in IntentType.__members__.values() else IntentType.GENERAL,
        response_text=response_text,
        confidence=0.9,
    ).model_dump()

    metadata = state.get("metadata", {})
    metadata["node_trace"] = metadata.get("node_trace", []) + ["rag_chatbot_node"]

    return {
        **state,
        "chat_response": chat_resp,
        "final_response": response_text,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# NODE 8: USER EVIDENCE LOG NODE
# ═══════════════════════════════════════════════════════════════════════════

def user_evidence_log_node(state: StudyPulseState) -> StudyPulseState:
    """
    Log survey/feedback responses VERBATIM to evidence store.
    
    STRICT RULES:
    - Save EXACT user text. NO summarization. NO paraphrasing.
    - Mask PII fields only (phone, ID, password). Keep text intact otherwise.
    - Append to Google Sheets / database (mock: append to state).
    """
    query = state.get("user_query", "")
    raw = state.get("raw_payload", {})
    language = state.get("language", "vi")

    # Extract survey question from payload or use default
    survey_question = raw.get("survey_question", "Phản hồi trải nghiệm học tập")
    respondent_email = raw.get("respondent_email", "unknown@student.vinai.edu.vn")

    # PII masking on email
    masked_email = _mask_email(respondent_email)

    # Detect and mask PII in verbatim text (minimal — preserve content)
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
        verbatim_text=verbatim,  # IMMUTABLE after this point
        language_detected=Language(language),
        source="direct_input",
        pii_masked_fields=pii_fields,
    ).model_dump()

    evidence_log = state.get("evidence_log", []) + [entry]

    # Format confirmation
    lang = state.get("language", "vi")
    if lang == "vi":
        confirmation = f"✅ Đã ghi nhận phản hồi nguyên văn (ID: {entry['id'][:8]}...). Cảm ơn bạn!"
    else:
        confirmation = f"✅ Verbatim feedback recorded (ID: {entry['id'][:8]}...). Thank you!"

    metadata = state.get("metadata", {})
    metadata["node_trace"] = metadata.get("node_trace", []) + ["user_evidence_log_node"]
    metadata["evidence_entries_total"] = len(evidence_log)

    return {
        **state,
        "evidence_log": evidence_log,
        "final_response": confirmation,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# NODE 9: HITL ESCALATION NODE
# ═══════════════════════════════════════════════════════════════════════════

def hitl_escalation_node(state: StudyPulseState) -> StudyPulseState:
    """
    Human-in-the-loop escalation for low-confidence items.
    
    Triggers:
    - confidence_score < 0.85 on deadline/exam items
    - Conflicting dates across sources
    - Validation failures after max retries
    
    Actions:
    - Format escalation message for TA/admin review
    - Mark items as pending_review
    - Generate bilingual escalation response
    """
    hitl_items = state.get("hitl_items", [])
    language = state.get("language", "vi")
    error_msg = state.get("error_message", "")

    if not hitl_items and not error_msg:
        # Nothing to escalate — pass through
        metadata = state.get("metadata", {})
        metadata["node_trace"] = metadata.get("node_trace", []) + ["hitl_escalation_node (skip)"]
        return {**state, "metadata": metadata}

    # Format escalation message
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
            f"Các mục sau đây có độ tin cậy thấp hoặc cần kiểm tra thủ công:\n\n"
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

    metadata = state.get("metadata", {})
    metadata["node_trace"] = metadata.get("node_trace", []) + ["hitl_escalation_node"]
    metadata["escalation_count"] = len(hitl_items)

    return {
        **state,
        "final_response": response,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# NODE 10: RESPONSE FORMATTER NODE
# ═══════════════════════════════════════════════════════════════════════════

def response_formatter_node(state: StudyPulseState) -> StudyPulseState:
    """
    Terminal node: format final response for user delivery.
    
    Applies:
    - Language-appropriate formatting
    - Confidence indicators
    - Action suggestions
    - Timeline summary if applicable
    """
    language = state.get("language", "vi")
    flow_type = state.get("flow_type", "chat")
    final = state.get("final_response", "")

    if not final:
        # Generate default response based on flow_type
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
        elif flow_type == "chat":
            if not final:
                final = (
                    "Xin lỗi, tôi không tìm thấy thông tin phù hợp."
                    if language == "vi"
                    else "Sorry, I couldn't find relevant information."
                )

    metadata = state.get("metadata", {})
    metadata["node_trace"] = metadata.get("node_trace", []) + ["response_formatter_node"]
    metadata["response_timestamp"] = datetime.utcnow().isoformat()

    return {
        **state,
        "final_response": final,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# BONUS NODE: SPAM RESCUE NODE
# ═══════════════════════════════════════════════════════════════════════════

def spam_rescue_node(state: StudyPulseState) -> StudyPulseState:
    """
    Scan spam/junk folders for important academic emails.
    
    Classification criteria for rescue:
    - Sender domain matches known academic senders
    - Content contains deadline/schedule keywords
    - Subject matches course naming patterns
    """
    language = state.get("language", "vi")

    # ── MOCK: In production, integrate with Gmail/Outlook API ──
    rescued_count = 0  # Placeholder

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

    metadata = state.get("metadata", {})
    metadata["node_trace"] = metadata.get("node_trace", []) + ["spam_rescue_node"]

    return {
        **state,
        "final_response": response,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# BONUS NODE: DAILY REMINDER NODE
# ═══════════════════════════════════════════════════════════════════════════

def daily_reminder_node(state: StudyPulseState) -> StudyPulseState:
    """
    Generate consolidated reminder for next-day deadlines.
    Scheduled trigger at 22:00 daily.
    """
    language = state.get("language", "vi")
    timeline = state.get("dashboard_timeline", [])

    tomorrow = (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d")
    tomorrow_items = [
        i for i in timeline
        if i.get("due_date", "")[:10] == tomorrow
    ]

    critical = [i for i in tomorrow_items if i.get("priority") == "critical"]

    if language == "vi":
        if tomorrow_items:
            items_text = "\n".join(
                f"  {'🔴' if i.get('priority') == 'critical' else '🟡'} "
                f"{i['title']} — {i.get('due_time', 'chưa rõ giờ')}"
                for i in tomorrow_items
            )
            msg = (
                f"⏰ **Nhắc nhở deadline ngày mai ({tomorrow})**\n\n"
                f"Bạn có {len(tomorrow_items)} mục cần hoàn thành "
                f"({len(critical)} quan trọng):\n\n{items_text}"
            )
        else:
            msg = f"✅ Không có deadline nào vào ngày mai ({tomorrow}). Nghỉ ngơi nhé!"
    else:
        if tomorrow_items:
            items_text = "\n".join(
                f"  {'🔴' if i.get('priority') == 'critical' else '🟡'} "
                f"{i['title']} — {i.get('due_time', 'time TBD')}"
                for i in tomorrow_items
            )
            msg = (
                f"⏰ **Tomorrow's Deadline Reminder ({tomorrow})**\n\n"
                f"You have {len(tomorrow_items)} items due "
                f"({len(critical)} critical):\n\n{items_text}"
            )
        else:
            msg = f"✅ No deadlines tomorrow ({tomorrow}). Rest well!"

    reminder = DailyReminder(
        target_date=tomorrow,
        language=Language(language),
        items=[ExtractedItem(**i) for i in tomorrow_items] if tomorrow_items else [],
        total_items=len(tomorrow_items),
        critical_count=len(critical),
        message_text=msg,
    ).model_dump()

    metadata = state.get("metadata", {})
    metadata["node_trace"] = metadata.get("node_trace", []) + ["daily_reminder_node"]

    return {
        **state,
        "daily_reminder": reminder,
        "final_response": msg,
        "metadata": metadata,
    }


# ═══════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

def _mask_pii(text: str) -> str:
    """Mask PII patterns in text."""
    # Phone numbers (VN format)
    text = re.sub(r"\b(0\d{9,10})\b", "[PHONE_MASKED]", text)
    text = re.sub(r"\b(\+84\d{9,10})\b", "[PHONE_MASKED]", text)
    # CMND/CCCD
    text = re.sub(r"\b(\d{9}|\d{12})\b", "[ID_MASKED]", text)
    # Passwords in context
    text = re.sub(r"(?i)(password|mật khẩu|pass)\s*[:=]\s*\S+", r"\1: [CREDENTIAL_MASKED]", text)
    return text


def _mask_email(email: str) -> str:
    """Mask email local part: h***@domain.com"""
    if "@" not in email:
        return email
    local, domain = email.rsplit("@", 1)
    if len(local) <= 1:
        return f"*@{domain}"
    return f"{local[0]}***@{domain}"


def _mock_extract(text: str, source: str, language: str) -> list[dict]:
    """
    Mock extraction for prototype demonstration.
    In production, replace with LLM structured output call.
    """
    items = []

    # Simple keyword-based mock extraction
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
                source_platform=SourcePlatform(source) if source in SourcePlatform.__members__.values() else SourcePlatform.DIRECT_INPUT,
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
