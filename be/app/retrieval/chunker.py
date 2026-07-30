from app.schemas.retrieval import SourceChunk


def chunk_text(
    text: str,
    *,
    course_id: str,
    lecture_id: str,
    lecture_title: str,
    page: int | None = None,
    max_characters: int = 1200,
) -> list[SourceChunk]:
    """Small deterministic chunker to be replaced by semantic chunking later."""
    paragraphs = [part.strip() for part in text.split("\n\n") if part.strip()]
    chunks: list[SourceChunk] = []
    buffer = ""
    for paragraph in paragraphs:
        candidate = f"{buffer}\n\n{paragraph}".strip()
        if buffer and len(candidate) > max_characters:
            chunks.append(
                SourceChunk(
                    source_id=f"{lecture_id}:{page or 0}:{len(chunks)}",
                    course_id=course_id,
                    lecture_id=lecture_id,
                    lecture_title=lecture_title,
                    page=page,
                    content=buffer,
                )
            )
            buffer = paragraph
        else:
            buffer = candidate
    if buffer:
        chunks.append(
            SourceChunk(
                source_id=f"{lecture_id}:{page or 0}:{len(chunks)}",
                course_id=course_id,
                lecture_id=lecture_id,
                lecture_title=lecture_title,
                page=page,
                content=buffer,
            )
        )
    return chunks
