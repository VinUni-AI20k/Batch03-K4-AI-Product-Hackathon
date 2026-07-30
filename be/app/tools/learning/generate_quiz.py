from app.providers.llm.base import LLMProvider
from app.schemas.retrieval import SourceChunk
from app.tools.context.context_builder import build_context


def generate_quiz(
    sources: list[SourceChunk],
    llm: LLMProvider,
    question_count: int = 5,
) -> str:
    return llm.generate(
        "Tạo câu hỏi luyện tập từ nguồn; không lộ đáp án ngay.",
        f"Số câu: {question_count}\n\n{build_context(sources)}",
    )
