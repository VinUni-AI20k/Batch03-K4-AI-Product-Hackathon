"""Backward-compatible import for the former upload classifier.

The upload path now uses the validated production classifier directly.  Keep
this symbol for integrations that imported it before the runtime cut-over.
"""

from collections.abc import Iterable

from app.pipeline.classify import classify_with_llm


def classify_segments(segments: Iterable[dict[str, str]]) -> list[dict[str, str]]:
    """Classify uploaded segments with the same production path as the CLI."""
    return classify_with_llm(list(segments))
