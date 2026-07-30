from app.providers.llm.base import LLMProvider
from app.schemas.retrieval import SourceChunk
from app.tools.context.context_builder import build_context


def generate_study_notes(sources: list[SourceChunk], llm: LLMProvider) -> str:
    return llm.generate(
        "Tạo ghi chú ôn tập có ý chính, thuật ngữ và citation.",
        build_context(sources),
    )
