from collections import defaultdict

from app.schemas.retrieval import SourceChunk


def group_sources_by_lecture(
    sources: list[SourceChunk],
) -> dict[str, list[SourceChunk]]:
    grouped: dict[str, list[SourceChunk]] = defaultdict(list)
    for source in sources:
        grouped[source.lecture_id].append(source)
    return dict(grouped)
