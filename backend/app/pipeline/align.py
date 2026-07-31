"""Semantic alignment between extracted slide sections and transcript segments.

The implementation is deliberately local and deterministic: normalized token
TF-IDF cosine similarity plus token overlap. It is suitable for the current
offline product path and gives the rewrite stage stable source IDs without
requiring an embedding provider.
"""

from __future__ import annotations

from collections import Counter
import math
import re
import unicodedata
from collections.abc import Iterable, Mapping
from typing import Any


TOKEN_RE = re.compile(r"[a-z0-9]{2,}", re.IGNORECASE)
STOP_WORDS = {
    "va", "và", "cua", "của", "cho", "trong", "mot", "một", "nhung", "những",
    "the", "and", "that", "this", "with", "from", "into", "khi", "các", "cac",
    "được", "duoc", "là", "la", "có", "co", "này", "nay", "về", "ve", "từ", "tu",
}


def normalize_tokens(text: str) -> list[str]:
    normalized = unicodedata.normalize("NFD", text.casefold())
    normalized = "".join(char for char in normalized if unicodedata.category(char) != "Mn")
    normalized = normalized.replace("đ", "d")
    return [token for token in TOKEN_RE.findall(normalized) if token not in STOP_WORDS]


def _value(item: Any, name: str, default: Any = None) -> Any:
    if isinstance(item, Mapping):
        return item.get(name, default)
    return getattr(item, name, default)


def _section_text(section: Any) -> str:
    key_points = _value(section, "key_points", []) or []
    segments = _value(section, "segments", []) or []
    segment_text = " ".join(str(_value(segment, "text", "")) for segment in segments)
    return " ".join([str(_value(section, "title", "")), *map(str, key_points), segment_text])


def _segment_text(segment: Any) -> str:
    return str(_value(segment, "text", ""))


def _tfidf_vectors(documents: list[list[str]]) -> list[dict[str, float]]:
    document_frequency = Counter({token for document in documents for token in set(document)})
    total_documents = len(documents)
    vectors: list[dict[str, float]] = []
    for document in documents:
        counts = Counter(document)
        total_terms = sum(counts.values()) or 1
        vectors.append({
            token: (count / total_terms) * math.log((total_documents + 1) / (document_frequency[token] + 1)) + 1
            for token, count in counts.items()
        })
    return vectors


def _cosine(left: Mapping[str, float], right: Mapping[str, float]) -> float:
    if not left or not right:
        return 0.0
    dot = sum(left[token] * right.get(token, 0.0) for token in left)
    left_norm = math.sqrt(sum(value * value for value in left.values()))
    right_norm = math.sqrt(sum(value * value for value in right.values()))
    return dot / (left_norm * right_norm) if left_norm and right_norm else 0.0


def _overlap(left: Iterable[str], right: Iterable[str]) -> float:
    left_set, right_set = set(left), set(right)
    if not left_set or not right_set:
        return 0.0
    return len(left_set & right_set) / min(len(left_set), len(right_set))


def align_sections(
    slide_sections: Iterable[Any],
    transcript_segments: Iterable[Any],
    *,
    min_score: float = 0.12,
    max_segments_per_section: int = 12,
) -> list[dict[str, object]]:
    """Return semantic transcript matches for every slide section.

    A match is retained when its combined score clears ``min_score``. If no
    segment clears the threshold, the strongest positive lexical match is
    retained only when it has at least two shared content tokens. This avoids
    arbitrary positional assignments while keeping short real sections usable.
    """
    sections = list(slide_sections)
    segments = list(transcript_segments)
    section_tokens = [normalize_tokens(_section_text(section)) for section in sections]
    segment_tokens = [normalize_tokens(_segment_text(segment)) for segment in segments]
    vectors = _tfidf_vectors(section_tokens + segment_tokens)
    section_vectors = vectors[:len(sections)]
    segment_vectors = vectors[len(sections):]

    results: list[dict[str, object]] = []
    for section, tokens, section_vector in zip(sections, section_tokens, section_vectors):
        scored: list[tuple[float, int, float, float]] = []
        for index, (segment_token_list, segment_vector) in enumerate(zip(segment_tokens, segment_vectors)):
            cosine = _cosine(section_vector, segment_vector)
            overlap = _overlap(tokens, segment_token_list)
            score = 0.75 * cosine + 0.25 * overlap
            if score >= min_score:
                scored.append((score, index, cosine, overlap))
        scored.sort(reverse=True)
        if not scored:
            best = max(
                ((0.75 * _cosine(section_vector, vector) + 0.25 * _overlap(tokens, token_list), index,
                  _cosine(section_vector, vector), _overlap(tokens, token_list))
                 for index, (token_list, vector) in enumerate(zip(segment_tokens, segment_vectors))),
                default=(0.0, -1, 0.0, 0.0),
            )
            if best[0] > 0 and len(set(tokens) & set(segment_tokens[best[1]])) >= 2:
                scored = [best]
        matches = [
            {
                "segment_id": _value(segments[index], "segment_id", _value(segments[index], "id", "")),
                "score": round(score, 4),
                "cosine": round(cosine, 4),
                "token_overlap": round(overlap, 4),
            }
            for score, index, cosine, overlap in scored[:max_segments_per_section]
        ]
        results.append({
            "section_id": _value(section, "section_id", _value(section, "id", "")),
            "related_segment_ids": [match["segment_id"] for match in matches],
            "matches": matches,
            "matched": bool(matches),
            "method": "tfidf_cosine+token_overlap",
        })
    return results


def retrieve_relevant_segments(
    query: str,
    transcript_segments: Iterable[Any],
    *,
    top_k: int = 5,
) -> list[dict[str, object]]:
    """Retrieve transcript excerpts using the same lexical semantic scorer."""
    segments = list(transcript_segments)
    query_tokens = normalize_tokens(query)
    segment_tokens = [normalize_tokens(_segment_text(segment)) for segment in segments]
    vectors = _tfidf_vectors([query_tokens, *segment_tokens])
    query_vector = vectors[0]
    ranked = []
    for index, (tokens, vector) in enumerate(zip(segment_tokens, vectors[1:])):
        cosine = _cosine(query_vector, vector)
        overlap = _overlap(query_tokens, tokens)
        score = 0.75 * cosine + 0.25 * overlap
        ranked.append((score, index, cosine, overlap))
    ranked.sort(reverse=True)
    return [
        {
            "segment_id": _value(segments[index], "segment_id", _value(segments[index], "id", "")),
            "text": _segment_text(segments[index]),
            "score": round(score, 4),
            "cosine": round(cosine, 4),
            "token_overlap": round(overlap, 4),
        }
        for score, index, cosine, overlap in ranked[:top_k]
        if score > 0
    ]


def retrieve_relevant_sources(
    query: str,
    sources: Iterable[Mapping[str, object]],
    *,
    top_k: int = 5,
) -> list[dict[str, object]]:
    """Rank heterogeneous study-note, transcript, and slide source chunks."""
    source_list = list(sources)
    query_tokens = normalize_tokens(query)
    source_tokens = [normalize_tokens(str(source.get("text", ""))) for source in source_list]
    vectors = _tfidf_vectors([query_tokens, *source_tokens])
    ranked = []
    for index, (tokens, vector) in enumerate(zip(source_tokens, vectors[1:])):
        cosine = _cosine(vectors[0], vector)
        overlap = _overlap(query_tokens, tokens)
        score = 0.75 * cosine + 0.25 * overlap
        ranked.append((score, index, cosine, overlap))
    ranked.sort(reverse=True)
    return [
        {
            **source_list[index],
            "score": round(score, 4),
            "cosine": round(cosine, 4),
            "token_overlap": round(overlap, 4),
        }
        for score, index, cosine, overlap in ranked[:top_k]
        if score > 0
    ]
