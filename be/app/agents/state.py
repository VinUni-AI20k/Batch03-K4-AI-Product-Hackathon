from dataclasses import dataclass, field

from app.schemas.retrieval import SourceChunk


@dataclass
class AgentState:
    query: str
    scope: str
    sources: list[SourceChunk] = field(default_factory=list)
    token_budget: int = 6000
