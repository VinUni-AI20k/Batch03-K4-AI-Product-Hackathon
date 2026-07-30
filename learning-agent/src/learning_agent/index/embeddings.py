"""Embedding provider: Voyage AI (chính) hoặc để Chroma tự embed (fallback local).

voyage-context-3 embed theo ngữ cảnh toàn tài liệu -> hợp slide rời rạc,
bỏ được bước LLM sinh câu ngữ cảnh cho từng chunk.
"""
from __future__ import annotations

import time


def _with_retry(fn, tries: int = 4, wait: float = 21.0):
    """Voyage free tier giới hạn RPM — gặp 429/rate limit thì chờ rồi thử lại."""
    for attempt in range(tries):
        try:
            return fn()
        except Exception as e:
            msg = str(e).lower()
            if attempt < tries - 1 and ("429" in msg or "rate" in msg or "limit" in msg):
                time.sleep(wait)
                continue
            raise


class VoyageEmbedder:
    def __init__(self, api_key: str, model: str = "voyage-context-3"):
        import voyageai

        self.client = voyageai.Client(api_key=api_key)
        self.model = model

    def embed_docs(self, chunks: list[str]) -> list[list[float]]:
        if self.model.startswith("voyage-context"):
            # contextualized: cả list chunk của MỘT tài liệu đi chung 1 request
            result = _with_retry(lambda: self.client.contextualized_embed(
                inputs=[chunks], model=self.model, input_type="document"
            ))
            return [e for r in result.results for e in r.embeddings]
        return _with_retry(lambda: self.client.embed(
            chunks, model=self.model, input_type="document"
        )).embeddings

    def embed_query(self, text: str) -> list[float]:
        if self.model.startswith("voyage-context"):
            result = _with_retry(lambda: self.client.contextualized_embed(
                inputs=[[text]], model=self.model, input_type="query"
            ))
            return result.results[0].embeddings[0]
        return _with_retry(lambda: self.client.embed(
            [text], model=self.model, input_type="query"
        )).embeddings[0]


def make_embedder(cfg) -> VoyageEmbedder | None:
    """None = dùng embedding mặc định của Chroma (chạy local, không cần key)."""
    if cfg.get("index", "embedding_provider") == "voyage" and cfg.voyage_api_key:
        try:
            return VoyageEmbedder(cfg.voyage_api_key, cfg.get("index", "voyage_model"))
        except ImportError:
            print("⚠️ Chưa cài voyageai (pip install 'learning-agent[voyage]') — dùng embedding local.")
    return None
