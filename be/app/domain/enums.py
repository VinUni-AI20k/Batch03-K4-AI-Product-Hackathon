from enum import StrEnum


class ConversationStatus(StrEnum):
    ANSWERED = "answered"
    NEEDS_CLARIFICATION = "needs_clarification"
    NOT_GROUNDED = "not_grounded"
    NOT_CONFIGURED = "not_configured"
