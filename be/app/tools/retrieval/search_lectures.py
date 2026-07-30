from app.retrieval.hybrid_search import HybridSearch
from app.schemas.retrieval import SearchRequest, SourceChunk


def search_lectures(
    search_engine: HybridSearch,
    request: SearchRequest,
) -> list[SourceChunk]:
    return search_engine.search(request)
