from app.providers.llm.base import LLMProvider
from app.schemas.retrieval import SourceChunk
from app.tools.context.context_builder import build_context


def generate_flashcards(sources: list[SourceChunk], llm: LLMProvider) -> str:
    return llm.generate(
        "Tạo flashcard hỏi-đáp ngắn, mỗi thẻ có nguồn.",
        build_context(sources),
    )
