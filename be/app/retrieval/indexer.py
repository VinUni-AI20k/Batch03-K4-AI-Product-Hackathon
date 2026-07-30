from app.providers.vector_store.base import VectorStoreProvider
from app.schemas.retrieval import SourceChunk


def index_chunks(
    provider: VectorStoreProvider,
    chunks: list[SourceChunk],
) -> None:
    provider.add(chunks)
