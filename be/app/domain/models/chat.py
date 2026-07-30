from dataclasses import dataclass, field


@dataclass
class ConversationMemory:
    conversation_id: str
    rolling_summary: str = ""
    recent_messages: list[str] = field(default_factory=list)
    user_corrections: list[str] = field(default_factory=list)
