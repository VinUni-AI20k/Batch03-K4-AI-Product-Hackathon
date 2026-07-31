"""Lexical retrieval (BM25) over the page chunks of a single document.

Deliberately dependency-free: a hackathon document is a few hundred pages at
most, so an in-process BM25 is both faster and more debuggable than a vector
store, and it works on Vietnamese text without a tokenizer model.
"""

import math
import re
import unicodedata
from collections import Counter
from typing import Dict, List, Sequence, Tuple

_TOKEN = re.compile(r"\w+", re.UNICODE)

K1 = 1.5
B = 0.75


def tokenize(text: str) -> List[str]:
    folded = unicodedata.normalize("NFKC", text.lower())
    return _TOKEN.findall(folded)


class PageIndex:
    """BM25 index where each document is one PDF page."""

    def __init__(self, pages: Sequence[dict]):
        self.pages = list(pages)
        self.tokens: List[List[str]] = [tokenize(p["text"]) for p in self.pages]
        self.lengths = [len(t) for t in self.tokens]
        self.avg_length = (sum(self.lengths) / len(self.lengths)) if self.lengths else 0.0
        self.freqs: List[Counter] = [Counter(t) for t in self.tokens]

        doc_freq: Counter = Counter()
        for tokens in self.tokens:
            doc_freq.update(set(tokens))
        n = len(self.pages)
        self.idf: Dict[str, float] = {
            term: math.log(1 + (n - df + 0.5) / (df + 0.5)) for term, df in doc_freq.items()
        }

    def search(self, query: str, top_k: int = 6) -> List[Tuple[int, float]]:
        """Return [(1-based page number, score)] ranked by relevance."""
        terms = tokenize(query)
        if not terms or not self.pages:
            return []

        scored: List[Tuple[int, float]] = []
        for i, freqs in enumerate(self.freqs):
            length = self.lengths[i] or 1
            score = 0.0
            for term in terms:
                tf = freqs.get(term)
                if not tf:
                    continue
                denom = tf + K1 * (1 - B + B * length / (self.avg_length or 1))
                score += self.idf.get(term, 0.0) * (tf * (K1 + 1)) / denom
            if score > 0:
                scored.append((self.pages[i]["page"], score))

        scored.sort(key=lambda item: item[1], reverse=True)
        return scored[:top_k]
