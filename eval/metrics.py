from __future__ import annotations

import math
import re
import unicodedata
from collections import Counter
from typing import Any, Iterable


def normalize_text(text: str) -> list[str]:
    """Normalize Vietnamese/English text for deterministic lexical metrics."""
    text = unicodedata.normalize("NFKC", str(text)).lower()
    text = re.sub(r"[^\w\s]", " ", text, flags=re.UNICODE)
    return [token for token in text.split() if token]


def exact_match(reference: str, candidate: str) -> float:
    return float(normalize_text(reference) == normalize_text(candidate))


def keyword_recall(text: str, keywords: Iterable[str]) -> float:
    normalized = " ".join(normalize_text(text))
    expected = [" ".join(normalize_text(item)) for item in keywords]
    expected = [item for item in expected if item]
    if not expected:
        return 1.0
    return sum(item in normalized for item in expected) / len(expected)


def _ngrams(tokens: list[str], n: int) -> Counter[tuple[str, ...]]:
    return Counter(tuple(tokens[i : i + n]) for i in range(len(tokens) - n + 1))


def bleu(reference: str, candidate: str, max_n: int = 4) -> float:
    """Sentence BLEU with add-one smoothing and brevity penalty."""
    ref_tokens = normalize_text(reference)
    cand_tokens = normalize_text(candidate)
    if not ref_tokens or not cand_tokens:
        return 0.0

    effective_n = min(max_n, len(ref_tokens), len(cand_tokens))
    log_precisions: list[float] = []
    for n in range(1, effective_n + 1):
        ref_counts = _ngrams(ref_tokens, n)
        cand_counts = _ngrams(cand_tokens, n)
        clipped = sum(min(count, ref_counts[gram]) for gram, count in cand_counts.items())
        total = sum(cand_counts.values())
        log_precisions.append(math.log((clipped + 1) / (total + 1)))

    brevity_penalty = (
        1.0
        if len(cand_tokens) >= len(ref_tokens)
        else math.exp(1 - len(ref_tokens) / len(cand_tokens))
    )
    return round(brevity_penalty * math.exp(sum(log_precisions) / effective_n), 4)


def rouge_l(reference: str, candidate: str) -> float:
    """ROUGE-L F1 based on longest common subsequence."""
    ref_tokens = normalize_text(reference)
    cand_tokens = normalize_text(candidate)
    if not ref_tokens or not cand_tokens:
        return 0.0

    previous = [0] * (len(cand_tokens) + 1)
    for ref_token in ref_tokens:
        current = [0]
        for j, cand_token in enumerate(cand_tokens, start=1):
            current.append(
                previous[j - 1] + 1
                if ref_token == cand_token
                else max(previous[j], current[-1])
            )
        previous = current

    lcs = previous[-1]
    recall = lcs / len(ref_tokens)
    precision = lcs / len(cand_tokens)
    if recall + precision == 0:
        return 0.0
    return round(2 * recall * precision / (recall + precision), 4)


def set_scores(expected: Iterable[str], actual: Iterable[str]) -> dict[str, float]:
    expected_set = {str(item) for item in expected}
    actual_set = {str(item) for item in actual}
    true_positive = len(expected_set & actual_set)
    precision = true_positive / len(actual_set) if actual_set else float(not expected_set)
    recall = true_positive / len(expected_set) if expected_set else 1.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    return {
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(f1, 4),
    }


def percentile(values: list[float], quantile: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    index = (len(ordered) - 1) * quantile
    low = math.floor(index)
    high = math.ceil(index)
    if low == high:
        return round(ordered[low], 2)
    value = ordered[low] + (ordered[high] - ordered[low]) * (index - low)
    return round(value, 2)


def json_serializable(value: Any) -> bool:
    try:
        import json

        json.dumps(value, ensure_ascii=False)
        return True
    except (TypeError, ValueError):
        return False
