from dataclasses import dataclass


@dataclass(frozen=True)
class CitationRef:
    source_id: str
    lecture_id: str
    page: int | None
