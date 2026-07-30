from app.providers.llm.base import LLMProvider
from app.schemas.retrieval import SourceChunk
from app.tools.context.context_builder import build_context


def explain_concept(
    concept: str,
    sources: list[SourceChunk],
    llm: LLMProvider,
    level: str = "beginner",
) -> str:
    return llm.generate(
        "Giải thích như trợ giảng; không thêm fact ngoài nguồn.",
        f"Mức độ: {level}\nKhái niệm: {concept}\n\n{build_context(sources)}",
    )
