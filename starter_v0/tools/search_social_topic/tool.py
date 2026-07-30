from __future__ import annotations

import os
import secrets
from typing import Any

from tools._shared import fold_text
from tools.social_search.tool import search_tweets


DEFAULT_RANDOM_TOPICS = ("AI", "technology", "science", "startups", "climate", "space")


def _random_topics() -> tuple[str, ...]:
    configured = tuple(
        topic.strip()
        for topic in os.getenv("TWITTER_RANDOM_TOPICS", "").split(",")
        if topic.strip()
    )
    return configured or DEFAULT_RANDOM_TOPICS


def _is_random_request(query: str, random_mode: bool) -> bool:
    folded = fold_text(query or "").strip()
    return random_mode or "random" in folded or "ngau nhien" in folded


def search_social_topic(
    query: str = "",
    search_type: str = "Latest",
    limit: int = 5,
    random_mode: bool = False,
) -> dict[str, Any]:
    requested_query = (query or "").strip()
    random_requested = _is_random_request(requested_query, random_mode)
    if random_requested:
        resolved_query = secrets.choice(_random_topics())
    else:
        resolved_query = requested_query

    if not resolved_query:
        return {
            "tool": "search_social_topic",
            "status": "missing_query",
            "error": "missing_query",
            "message": "A topic is required unless random_mode=true.",
            "items": [],
        }

    result = search_tweets(query=resolved_query, search_type=search_type, limit=limit)
    result.update({
        "tool": "search_social_topic",
        "requested_query": requested_query,
        "random_mode": random_requested,
        "selected_topic": resolved_query if random_requested else None,
    })
    return result
