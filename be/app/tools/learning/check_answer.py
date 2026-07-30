from app.providers.llm.base import LLMProvider
from app.schemas.retrieval import SourceChunk
from app.tools.context.context_builder import build_context


def check_answer(
    question: str,
    learner_answer: str,
    sources: list[SourceChunk],
    llm: LLMProvider,
) -> str:
    return llm.generate(
        "Chấm phản hồi dựa trên nguồn; giải thích điểm đúng và điểm cần cải thiện.",
        (
            f"Câu hỏi: {question}\nCâu trả lời: {learner_answer}\n\n"
            f"{build_context(sources)}"
        ),
    )
