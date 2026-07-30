"""
retriever.py — TF-IDF RAG engine cho transcript chunks.
Tìm top-K đoạn transcript liên quan nhất với câu hỏi.
"""

from typing import List, Dict, Optional, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


class TranscriptRetriever:
    """TF-IDF retriever cho transcript chunks."""

    def __init__(self, chunks: List[Dict]):
        self.chunks = chunks
        self.texts = [c["text"] for c in chunks]
        self.ids = [c["id"] for c in chunks]

        # Build TF-IDF index
        self.vectorizer = TfidfVectorizer(
            max_features=10000,
            ngram_range=(1, 2),  # unigram + bigram
            min_df=1,
            max_df=0.95,
            sublinear_tf=True,
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(self.texts)

    def search(
        self,
        query: str,
        top_k: int = 3,
        source_filter: Optional[str] = None,
    ) -> List[Tuple[Dict, float]]:
        """
        Tìm top_k đoạn liên quan nhất.

        Args:
            query: đoạn text học viên bôi đen / câu hỏi
            top_k: số kết quả trả về
            source_filter: tên file transcript (None = tất cả)

        Returns:
            List of (chunk_dict, similarity_score) — sorted desc
        """
        query_vec = self.vectorizer.transform([query])
        scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        # Filter by source nếu cần
        if source_filter and source_filter != "all":
            mask = np.array(
                [c["source_file"] == source_filter for c in self.chunks]
            )
            scores = scores * mask

        # Get top-k indices
        top_indices = scores.argsort()[-top_k:][::-1]

        results = []
        for idx in top_indices:
            score = float(scores[idx])
            if score > 0:  # Bỏ qua score = 0
                results.append((self.chunks[idx], score))

        return results

    def get_confidence_level(self, top_score: float) -> str:
        """
        Phân loại mức tin cậy của kết quả tìm kiếm.

        Returns:
            "high" | "low" | "not_found"
        """
        if top_score >= 0.15:
            return "high"
        elif top_score >= 0.05:
            return "low"
        else:
            return "not_found"
