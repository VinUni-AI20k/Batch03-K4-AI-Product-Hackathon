from app.providers.llm.base import LLMProvider
from app.schemas.retrieval import SourceChunk
from app.tools.context.context_builder import build_context


def summarize_content(
    sources: list[SourceChunk],
    style: str,
    llm: LLMProvider,
) -> str:
    return llm.generate(
        "Tóm tắt trung thành với nguồn và giữ citation cho từng ý chính.",
        f"Kiểu tóm tắt: {style}\n\n{build_context(sources)}",
    )
