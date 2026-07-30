from app.schemas.retrieval import SourceChunk


def rerank(chunks: list[SourceChunk], top_k: int) -> list[SourceChunk]:
    return sorted(chunks, key=lambda chunk: chunk.score, reverse=True)[:top_k]
