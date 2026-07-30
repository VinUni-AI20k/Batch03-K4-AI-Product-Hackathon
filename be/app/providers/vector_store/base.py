from typing import Protocol

from app.schemas.retrieval import SearchRequest, SourceChunk


class VectorStoreProvider(Protocol):
    def add(self, chunks: list[SourceChunk]) -> None: ...

    def search(self, request: SearchRequest) -> list[SourceChunk]: ...
