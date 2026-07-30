from app.schemas.retrieval import SearchRequest, SourceChunk


def is_in_scope(chunk: SourceChunk, request: SearchRequest) -> bool:
    if request.scope == "all_lectures":
        return True
    if request.lecture_ids and chunk.lecture_id not in request.lecture_ids:
        return False
    if request.scope == "current_page" and request.page is not None:
        return chunk.page == request.page
    return True
