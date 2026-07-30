from app.providers.llm.base import LLMProvider
from app.schemas.retrieval import SourceChunk
from app.tools.context.context_builder import build_context


def answer_from_slides(
    question: str,
    sources: list[SourceChunk],
    llm: LLMProvider,
) -> str:
    if not sources:
        return "Không tìm thấy căn cứ phù hợp trong các bài giảng đã chọn."
    return llm.generate(
        "Chỉ trả lời từ nguồn được cung cấp và luôn dẫn bài giảng, số trang.",
        f"Nguồn:\n{build_context(sources)}\n\nCâu hỏi: {question}",
    )
