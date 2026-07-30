from app.schemas.retrieval import SourceChunk


def get_source_detail(source_id: str, chunks: list[SourceChunk]) -> SourceChunk | None:
    return next((chunk for chunk in chunks if chunk.source_id == source_id), None)
