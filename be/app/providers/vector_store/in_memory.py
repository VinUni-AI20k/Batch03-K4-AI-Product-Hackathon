from app.retrieval.filters import is_in_scope
from app.schemas.retrieval import SearchRequest, SourceChunk


class InMemoryVectorStore:
    """Lexical development fallback; production can replace this provider."""

    def __init__(self) -> None:
        self._chunks: list[SourceChunk] = []

    def add(self, chunks: list[SourceChunk]) -> None:
        self._chunks.extend(chunks)

    def search(self, request: SearchRequest) -> list[SourceChunk]:
        query_terms = set(request.query.casefold().split())
        matches: list[SourceChunk] = []
        for chunk in self._chunks:
            if not is_in_scope(chunk, request):
                continue
            content_terms = set(chunk.content.casefold().split())
            score = len(query_terms & content_terms) / max(len(query_terms), 1)
            if score:
                matches.append(chunk.model_copy(update={"score": score}))
        return sorted(matches, key=lambda item: item.score, reverse=True)[: request.top_k]
