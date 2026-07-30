from app.schemas.citation import Citation
from app.schemas.retrieval import SourceChunk


def validate_citations(
    citations: list[Citation],
    sources: list[SourceChunk],
) -> bool:
    valid_ids = {source.source_id for source in sources}
    return all(citation.source_id in valid_ids for citation in citations)
