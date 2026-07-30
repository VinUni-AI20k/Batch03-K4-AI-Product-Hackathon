from app.providers.vector_store.base import VectorStoreProvider
from app.schemas.retrieval import SearchRequest, SourceChunk


class HybridSearch:
    def __init__(self, vector_store: VectorStoreProvider) -> None:
        self.vector_store = vector_store

    def search(self, request: SearchRequest) -> list[SourceChunk]:
        return self.vector_store.search(request)
