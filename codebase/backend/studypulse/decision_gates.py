"""
=============================================================================
STUDYPULSE AI — DECISION GATES & BOUNDARY MATRIX
=============================================================================
Defines all hard boundaries, escalation triggers, fallback strategies,
and the complete decision gate specification.
=============================================================================
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


# ═══════════════════════════════════════════════════════════════════════════
# BOUNDARY CLASSIFICATION
# ═══════════════════════════════════════════════════════════════════════════

class BoundaryType(str, Enum):
    HARD = "hard"           # Forbidden autonomously — always blocked
    SOFT = "soft"           # Allowed with conditions
    ESCALATION = "escalation"  # Requires HITL approval


@dataclass
class BoundaryRule:
    """Single boundary rule definition."""
    id: str
    category: str                  # difficulty_layer ①②③④
    boundary_type: BoundaryType
    description: str
    trigger_condition: str
    agent_action: str
    user_message_vi: str
    user_message_en: str
    hax_principle: str = ""        # Mapped HAX/PAIR principle


# ═══════════════════════════════════════════════════════════════════════════
# HARD BOUNDARIES — Actions FORBIDDEN autonomously
# ═══════════════════════════════════════════════════════════════════════════

HARD_BOUNDARIES: list[BoundaryRule] = [
    BoundaryRule(
        id="HB-001",
        category="③ Out of Scope",
        boundary_type=BoundaryType.HARD,
        description="Direct database destructive operations",
        trigger_condition="Any DELETE, DROP, TRUNCATE on student data",
        agent_action="BLOCK. Log attempt. Alert admin.",
        user_message_vi="Hơ, định làm gì cơ sở dữ liệu của tớ thế? Tớ ngoan lắm không phá hoại đâu nha, có gì liên hệ anh chị quản trị viên xem sao nhé!",
        user_message_en="Oh no, what are you trying to do to my database? I am a good bot and cannot delete anything. Please ask the admin!",
        hax_principle="G17 — User control",
    ),
    BoundaryRule(
        id="HB-002",
        category="① Source of Truth",
        boundary_type=BoundaryType.HARD,
        description="Fabricating deadlines not in source data",
        trigger_condition="No date evidence in any source channel for claimed deadline",
        agent_action="REFUSE to create item. Return 'not_found' response.",
        user_message_vi="Tớ lục tung hòm thư với tin nhắn rồi mà không thấy deadline này ở đâu cả. Tớ không tự bịa ra được đâu nha.",
        user_message_en="I searched everywhere but couldn't find this deadline. I cannot make up deadlines from thin air!",
        hax_principle="G2 — System capability clarity",
    ),
    BoundaryRule(
        id="HB-003",
        category="③ Out of Scope",
        boundary_type=BoundaryType.HARD,
        description="Direct calendar overwrite without approval",
        trigger_condition="Attempt to modify existing calendar entry",
        agent_action="PROPOSE change, require explicit confirmation.",
        user_message_vi="Tớ thấy mục này có vẻ thay đổi nè, bạn có chắc chắn muốn sửa không thế? Trả lời Có hoặc Không để tớ biết nha.",
        user_message_en="I see a change here, are you sure you want to update it? Please reply Yes or No.",
        hax_principle="G8 — Easy dismissal",
    ),
    BoundaryRule(
        id="HB-004",
        category="④ Domain-specific",
        boundary_type=BoundaryType.HARD,
        description="Guessing unmentioned due dates for exams",
        trigger_condition="Exam/quiz date not explicitly stated in source",
        agent_action="REFUSE to guess. Flag requires_clarification: true.",
        user_message_vi="Ngày thi chưa có thông báo chính thức đâu nha, đoán mò nguy hiểm lắm. Đi hỏi giảng viên đi nè!",
        user_message_en="The exam date is not officially announced yet. Guessing is risky, please double check with your teacher!",
        hax_principle="G10 — Scope narrowing under uncertainty",
    ),
    BoundaryRule(
        id="HB-005",
        category="③ Out of Scope",
        boundary_type=BoundaryType.HARD,
        description="Accessing grades or academic records",
        trigger_condition="User asks for grade, GPA, transcript data",
        agent_action="REFUSE. Redirect to academic portal.",
        user_message_vi="Ui, điểm số là bí mật thầm kín đó, tớ không sờ vào được đâu. Bạn lên portal học viên xem nhé!",
        user_message_en="Whoops, grades are confidential! I can't touch them, please check the student portal!",
        hax_principle="G1 — System capability clarity",
    ),
    BoundaryRule(
        id="HB-006",
        category="③ Out of Scope",
        boundary_type=BoundaryType.HARD,
        description="Summarizing or paraphrasing survey responses",
        trigger_condition="Evidence log write attempt with non-verbatim text",
        agent_action="BLOCK. Force verbatim save. Alert if modification detected.",
        user_message_vi="Ý kiến đóng góp quý báu của bạn tớ phải giữ nguyên văn từng chữ nha, tóm tắt là mất hết ý nghĩa đấy.",
        user_message_en="Your feedback is precious, I must save it word-for-word without any summary!",
        hax_principle="Data integrity — evidence protocol",
    ),
]


ESCALATION_TRIGGERS: list[BoundaryRule] = [
    BoundaryRule(
        id="ET-001",
        category="② Ambiguity",
        boundary_type=BoundaryType.ESCALATION,
        description="Low extraction confidence (< 0.85)",
        trigger_condition="confidence_score < 0.85 on any extracted item",
        agent_action="Flag item. Route to HITLEscalationNode. Present to TA for review.",
        user_message_vi="Mục này tớ chưa chắc chắn lắm. Đã gửi cho các anh chị TA duyệt hộ rồi nha.",
        user_message_en="This item needs TA confirmation. Sent to TA for review.",
        hax_principle="G10 — Scope narrowing",
    ),
    BoundaryRule(
        id="ET-002",
        category="④ Domain-specific",
        boundary_type=BoundaryType.ESCALATION,
        description="High ambiguity in exam/deadline dates",
        trigger_condition="Multiple conflicting dates for same event across sources",
        agent_action="Present ALL versions with source attribution. Do NOT pick one.",
        user_message_vi="Hình như có sự chồng chéo ngày nè: {source_a} bảo ngày {date_a}, còn {source_b} lại bảo ngày {date_b}. Đi hỏi thầy cô cho chắc nhé.",
        user_message_en="Date conflict detected: {source_a} says {date_a}, {source_b} says {date_b}. Please confirm with instructor.",
        hax_principle="G11 — Explain why",
    ),
    BoundaryRule(
        id="ET-003",
        category="④ Domain-specific",
        boundary_type=BoundaryType.ESCALATION,
        description="Sensitive academic notifications",
        trigger_condition="Message contains keywords: 'đình chỉ', 'kỷ luật', 'suspend', 'expel', 'warning'",
        agent_action="Do NOT auto-process. Flag for admin review. Log but do not display.",
        user_message_vi="Phát hiện thông báo quan trọng và nhạy cảm rồi nè. Đã chuyển cho các anh chị quản trị viên xử lý giúp nhé.",
        user_message_en="Sensitive notification detected. Forwarded to administrator for review.",
        hax_principle="G5 — Social norms compliance",
    ),
    BoundaryRule(
        id="ET-004",
        category="② Ambiguity",
        boundary_type=BoundaryType.ESCALATION,
        description="Relative date references without anchor",
        trigger_condition="Text contains 'tuần sau', 'next week', 'sắp tới' without specific date",
        agent_action="Resolve against current date. Flag requires_clarification: true.",
        user_message_vi="'Tuần sau' tớ hiểu tạm là ngày {resolved_date} nha. Bạn xem chuẩn chưa thế?",
        user_message_en="'Next week' -> I interpreted as {resolved_date}. Is this correct?",
        hax_principle="G9 — Easy correction",
    ),
    BoundaryRule(
        id="ET-005",
        category="① Source of Truth",
        boundary_type=BoundaryType.ESCALATION,
        description="Information from unofficial Discord channels",
        trigger_condition="Source channel not in verified_channels list",
        agent_action="Extract with low confidence (0.6). Flag source as unverified.",
        user_message_vi="Thông tin này trích từ kênh chưa được xác minh chính thức đâu nha. Nhớ kiểm tra lại cho chắc!",
        user_message_en="This information is from an unverified channel. Please verify with official sources.",
        hax_principle="G2 — System performance clarity",
    ),
    BoundaryRule(
        id="ET-006",
        category="② Ambiguity",
        boundary_type=BoundaryType.ESCALATION,
        description="Max retries exceeded during extraction",
        trigger_condition="retry_count >= max_retries (3)",
        agent_action="Force escalation to HITL. Log failure. Return graceful error.",
        user_message_vi="Úi, tớ thử trích xuất 3 lần rồi mà không được. Đã nhờ các anh chị TA cứu bồ xử lý thủ công rồi nhé.",
        user_message_en="Extraction failed after 3 attempts. Forwarded to TA for manual processing.",
        hax_principle="PAIR — Errors & Graceful Failure",
    ),
]


# ═══════════════════════════════════════════════════════════════════════════
# FALLBACK STRATEGIES
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class FallbackStrategy:
    """Graceful error handling strategy."""
    id: str
    trigger: str
    strategy: str
    message_vi: str
    message_en: str
    route_to: str  # Node or external handler


FALLBACK_STRATEGIES: list[FallbackStrategy] = [
    FallbackStrategy(
        id="FB-001",
        trigger="LLM API timeout or error",
        strategy="Return cached data if available. Else, graceful error with retry suggestion.",
        message_vi="Hệ thống hơi bận một tẹo. Bạn thử lại sau 30 giây nữa nhé, hoặc réo các anh chị TA cứu bồ nha.",
        message_en="System is busy. Please retry in 30 seconds or contact TA.",
        route_to="response_formatter",
    ),
    FallbackStrategy(
        id="FB-002",
        trigger="Empty extraction (no items found in source)",
        strategy="Confirm no items with appropriate message. Suggest checking source directly.",
        message_vi="Hình như không tìm thấy mục mới nào từ nguồn này rồi nè. Bạn nghía thử lại hộp thư hoặc Discord trực tiếp xem sao.",
        message_en="No new items found from this source. Check your inbox or Discord directly.",
        route_to="response_formatter",
    ),
    FallbackStrategy(
        id="FB-003",
        trigger="RAG retrieval returns zero results",
        strategy="Acknowledge gap. Suggest alternative search or TA contact.",
        message_vi="Không tìm thấy tài liệu phù hợp mất rồi. Thử đổi từ khóa khác xem sao, hoặc gọi điện cho TA nhé.",
        message_en="No matching materials found. Try different keywords or ask your TA.",
        route_to="response_formatter",
    ),
    FallbackStrategy(
        id="FB-004",
        trigger="PII masking failure",
        strategy="BLOCK output entirely. Do NOT return unmasked PII. Log error for admin.",
        message_vi="Có chút trục trặc bảo mật rồi nè. Tớ không được phép hiển thị đâu. Để tớ báo quản trị viên sửa ngay nhé.",
        message_en="Security processing error. Cannot display results. Administrator notified.",
        route_to="hitl_escalation",
    ),
    FallbackStrategy(
        id="FB-005",
        trigger="User asks question in unsupported language (not VI/EN)",
        strategy="Detect language mismatch. Request VI or EN input.",
        message_vi="Tớ mới chỉ hiểu được tiếng Việt và tiếng Anh thôi à. Viết lại bằng một trong hai thứ tiếng đó cho tớ hiểu nhé!",
        message_en="I currently support Vietnamese and English. Please re-enter your query in one of these languages.",
        route_to="response_formatter",
    ),
]


# ═══════════════════════════════════════════════════════════════════════════
# COMPLETE BOUNDARY MATRIX (Exportable)
# ═══════════════════════════════════════════════════════════════════════════

BOUNDARY_MATRIX = {
    "hard_boundaries": [
        {
            "id": b.id,
            "category": b.category,
            "description": b.description,
            "trigger": b.trigger_condition,
            "action": b.agent_action,
            "hax_principle": b.hax_principle,
        }
        for b in HARD_BOUNDARIES
    ],
    "escalation_triggers": [
        {
            "id": e.id,
            "category": e.category,
            "description": e.description,
            "trigger": e.trigger_condition,
            "action": e.agent_action,
            "hax_principle": e.hax_principle,
        }
        for e in ESCALATION_TRIGGERS
    ],
    "fallback_strategies": [
        {
            "id": f.id,
            "trigger": f.trigger,
            "strategy": f.strategy,
            "route_to": f.route_to,
        }
        for f in FALLBACK_STRATEGIES
    ],
}


# ═══════════════════════════════════════════════════════════════════════════
# DECISION GATE SPECIFICATIONS
# ═══════════════════════════════════════════════════════════════════════════

DECISION_GATES = {
    "gate_1_flow_router": {
        "name": "Flow Type Router",
        "location": "After IntentRouterNode",
        "input_field": "flow_type",
        "branches": {
            "ingestion": "→ AIExtractionNode",
            "chat": "→ RAGChatbotNode",
            "survey_log": "→ UserEvidenceLogNode",
            "spam_rescue": "→ SpamRescueNode",
            "daily_reminder": "→ DailyReminderNode",
        },
        "default": "→ RAGChatbotNode",
    },
    "gate_2_confidence_router": {
        "name": "Confidence Quality Gate",
        "location": "After ValidationGuardrailNode",
        "input_fields": ["confidence_score", "requires_hitl", "retry_count"],
        "thresholds": {
            "auto_approve": "confidence_score ≥ 0.85 AND requires_hitl = false",
            "escalate": "confidence_score < 0.85 OR requires_hitl = true OR retry_count ≥ max_retries",
        },
        "branches": {
            "auto_approve": "→ DashboardSyncNode",
            "escalate": "→ HITLEscalationNode",
        },
    },
    "gate_3_hitl_terminal": {
        "name": "HITL Terminal Gate",
        "location": "After HITLEscalationNode",
        "purpose": "Prevent infinite retry loops",
        "action": "ALWAYS route to ResponseFormatterNode → END",
        "loop_prevention": "No edges back to extraction or validation",
    },
}


def get_boundary_matrix() -> dict:
    """Export the complete boundary matrix for documentation."""
    return BOUNDARY_MATRIX


def get_decision_gates() -> dict:
    """Export decision gate specifications."""
    return DECISION_GATES
