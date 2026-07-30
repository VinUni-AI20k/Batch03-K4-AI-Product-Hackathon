"""
=============================================================================
STUDYPULSE AI — LANGGRAPH GRAPH DEFINITION
=============================================================================
Compiles the full StateGraph with conditional routing, decision gates,
loop guards, and fallback edges.
=============================================================================
"""

from __future__ import annotations

from langgraph.graph import END, StateGraph

from .state import StudyPulseState
from .nodes import (
    ingestion_node,
    language_detect_node,
    intent_router_node,
    ai_extraction_node,
    validation_guardrail_node,
    dashboard_sync_node,
    rag_chatbot_node,
    user_evidence_log_node,
    hitl_escalation_node,
    response_formatter_node,
    spam_rescue_node,
    daily_reminder_node,
)


# ═══════════════════════════════════════════════════════════════════════════
# CONDITIONAL EDGE FUNCTIONS (Decision Gates)
# ═══════════════════════════════════════════════════════════════════════════

def route_by_flow_type(state: StudyPulseState) -> str:
    """
    DECISION GATE 1: Route based on classified flow_type.
    
    Branches:
    - 'ingestion'      → AIExtractionNode
    - 'chat'           → RAGChatbotNode
    - 'survey_log'     → UserEvidenceLogNode
    - 'spam_rescue'    → SpamRescueNode
    - 'daily_reminder' → DailyReminderNode
    """
    flow = state.get("flow_type", "chat")
    route_map = {
        "ingestion": "ai_extraction",
        "chat": "rag_chatbot",
        "survey_log": "user_evidence_log",
        "spam_rescue": "spam_rescue",
        "daily_reminder": "daily_reminder",
    }
    return route_map.get(flow, "rag_chatbot")


def route_by_confidence(state: StudyPulseState) -> str:
    """
    DECISION GATE 2: Route based on extraction confidence & HITL flag.
    
    Branches:
    - requires_hitl=True OR confidence < 0.85 → HITLEscalationNode
    - All items valid (confidence ≥ 0.85)     → DashboardSyncNode
    - Max retries exceeded                    → HITLEscalationNode (forced)
    """
    if state.get("retry_count", 0) >= state.get("max_retries", 3):
        return "hitl_escalation"

    if state.get("requires_hitl", False):
        return "hitl_escalation"

    confidence = state.get("confidence_score", 0.0)
    if confidence < 0.85:
        return "hitl_escalation"

    return "dashboard_sync"


def route_after_hitl(state: StudyPulseState) -> str:
    """
    DECISION GATE 3: After HITL, route to formatter (no retry loop).
    
    This prevents infinite loops — HITL is a terminal escalation.
    The human reviewer will handle items externally.
    """
    return "response_formatter"


# ═══════════════════════════════════════════════════════════════════════════
# GRAPH BUILDER
# ═══════════════════════════════════════════════════════════════════════════

def build_studypulse_graph() -> StateGraph:
    """
    Build and compile the StudyPulse AI LangGraph.
    
    Architecture:
    
    ┌─────────────┐    ┌──────────────┐    ┌────────────────┐
    │  Ingestion   │───▶│ LangDetect   │───▶│ IntentRouter   │
    └─────────────┘    └──────────────┘    └───────┬────────┘
                                                   │
                              ┌─────────────────────┤ (DECISION GATE 1)
                              │                     │ route_by_flow_type
                              ▼                     ▼
                    ┌─────────────────┐   ┌──────────────────┐
                    │  AIExtraction   │   │  RAGChatbot      │──▶ Formatter ──▶ END
                    └────────┬────────┘   ├──────────────────┤
                             │            │ UserEvidenceLog  │──▶ Formatter ──▶ END
                             │            ├──────────────────┤
                             ▼            │ SpamRescue       │──▶ Formatter ──▶ END
                    ┌─────────────────┐   ├──────────────────┤
                    │ Validation      │   │ DailyReminder    │──▶ Formatter ──▶ END
                    │ Guardrail       │   └──────────────────┘
                    └────────┬────────┘
                             │
                    (DECISION GATE 2)
                    route_by_confidence
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
         ┌──────────────┐    ┌─────────────────┐
         │ DashboardSync│    │ HITL Escalation  │
         └──────┬───────┘    └────────┬────────┘
                │                     │
                │            (DECISION GATE 3)
                │            route_after_hitl
                │                     │
                ▼                     ▼
         ┌───────────────────────────────────┐
         │        ResponseFormatter          │
         └──────────────┬────────────────────┘
                        │
                        ▼
                       END
    
    Safeguards:
    - max_retries = 3 ceiling enforced in ValidationGuardrailNode
    - No retry loops in graph — HITL is terminal escalation
    - All paths converge to ResponseFormatter → END
    """

    # Initialize StateGraph
    graph = StateGraph(StudyPulseState)

    # ── REGISTER ALL NODES ──
    graph.add_node("ingestion", ingestion_node)
    graph.add_node("language_detect", language_detect_node)
    graph.add_node("intent_router", intent_router_node)
    graph.add_node("ai_extraction", ai_extraction_node)
    graph.add_node("validation_guardrail", validation_guardrail_node)
    graph.add_node("dashboard_sync", dashboard_sync_node)
    graph.add_node("rag_chatbot", rag_chatbot_node)
    graph.add_node("user_evidence_log", user_evidence_log_node)
    graph.add_node("hitl_escalation", hitl_escalation_node)
    graph.add_node("response_formatter", response_formatter_node)
    graph.add_node("spam_rescue", spam_rescue_node)
    graph.add_node("daily_reminder", daily_reminder_node)

    # ── STATIC PIPELINE: Ingestion → LangDetect → IntentRouter ──
    graph.set_entry_point("ingestion")
    graph.add_edge("ingestion", "language_detect")
    graph.add_edge("language_detect", "intent_router")

    # ── DECISION GATE 1: IntentRouter → Conditional Branch ──
    graph.add_conditional_edges(
        "intent_router",
        route_by_flow_type,
        {
            "ai_extraction": "ai_extraction",
            "rag_chatbot": "rag_chatbot",
            "user_evidence_log": "user_evidence_log",
            "spam_rescue": "spam_rescue",
            "daily_reminder": "daily_reminder",
        },
    )

    # ── INGESTION PIPELINE: Extraction → Validation → Confidence Gate ──
    graph.add_edge("ai_extraction", "validation_guardrail")

    # ── DECISION GATE 2: Validation → Confidence Branch ──
    graph.add_conditional_edges(
        "validation_guardrail",
        route_by_confidence,
        {
            "dashboard_sync": "dashboard_sync",
            "hitl_escalation": "hitl_escalation",
        },
    )

    # ── CONVERGENCE: All paths → ResponseFormatter → END ──
    graph.add_edge("dashboard_sync", "response_formatter")

    # ── DECISION GATE 3: HITL → Formatter (no loop) ──
    graph.add_conditional_edges(
        "hitl_escalation",
        route_after_hitl,
        {
            "response_formatter": "response_formatter",
        },
    )

    # ── DIRECT PATHS: Chat/Evidence/Spam/Reminder → Formatter ──
    graph.add_edge("rag_chatbot", "response_formatter")
    graph.add_edge("user_evidence_log", "response_formatter")
    graph.add_edge("spam_rescue", "response_formatter")
    graph.add_edge("daily_reminder", "response_formatter")

    # ── TERMINAL: Formatter → END ──
    graph.add_edge("response_formatter", END)

    return graph


def compile_graph():
    """Compile the graph for execution."""
    graph = build_studypulse_graph()
    return graph.compile()


# ═══════════════════════════════════════════════════════════════════════════
# GRAPH METADATA (for documentation)
# ═══════════════════════════════════════════════════════════════════════════

GRAPH_METADATA = {
    "name": "StudyPulse AI — EduCentral Agent",
    "version": "1.0.0",
    "nodes": 12,
    "decision_gates": 3,
    "safeguards": {
        "max_retries": 3,
        "confidence_threshold": 0.85,
        "hitl_terminal": True,
        "infinite_loop_prevention": "No retry edges in graph; HITL is terminal",
    },
    "flow_types": ["ingestion", "chat", "survey_log", "spam_rescue", "daily_reminder"],
    "supported_platforms": ["gmail", "outlook", "discord", "direct_input"],
    "languages": ["vi", "en"],
}
