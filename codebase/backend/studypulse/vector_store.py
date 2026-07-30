"""
=============================================================================
STUDYPULSE AI — DYNAMIC RAG VECTOR STORE (FAISS)
=============================================================================
Manages a FAISS-based vector index for semantic retrieval of timeline items,
evidence entries, and course documents. Falls back to static docs if FAISS
is unavailable.
=============================================================================
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class VectorStoreManager:
    """
    FAISS-backed vector store for dynamic RAG retrieval.
    
    Indexes timeline items, evidence entries, and course materials
    for semantic similarity search during chatbot interactions.
    """

    def __init__(self):
        self._store = None
        self._embeddings = None
        self._initialized = False
        self._fallback_docs = (
            "VinAI Academy Mini Hackathon Day 1 Foundation & Day 2 Specs. "
            "[T01-001] Introduction to AI Hackathon."
        )

    def _get_embeddings(self):
        """Lazy-init Google Generative AI embeddings."""
        if self._embeddings is None:
            try:
                from langchain_google_genai import GoogleGenerativeAIEmbeddings
                self._embeddings = GoogleGenerativeAIEmbeddings(
                    model="gemini-embedding-001"
                )
            except Exception as e:
                logger.warning(f"Failed to init embeddings: {e}")
                self._embeddings = None
        return self._embeddings

    def _ensure_store(self):
        """Lazy-init FAISS index."""
        if self._store is not None:
            return True
        try:
            from langchain_community.vectorstores import FAISS
            embeddings = self._get_embeddings()
            if embeddings is None:
                return False
            # Bootstrap with a seed document
            self._store = FAISS.from_texts(
                texts=[self._fallback_docs],
                embedding=embeddings,
                metadatas=[{"source": "seed", "type": "course_material"}],
            )
            self._initialized = True
            logger.info("FAISS vector store initialized successfully.")
            return True
        except Exception as e:
            logger.warning(f"FAISS init failed (falling back to static docs): {e}")
            return False

    def add_documents(
        self,
        texts: List[str],
        metadatas: Optional[List[Dict[str, Any]]] = None,
    ) -> int:
        """
        Add documents to the FAISS index.
        
        Returns number of documents successfully indexed.
        """
        if not self._ensure_store():
            return 0

        if not texts:
            return 0

        if metadatas is None:
            metadatas = [{"source": "dynamic"} for _ in texts]

        try:
            self._store.add_texts(texts=texts, metadatas=metadatas)
            logger.info(f"Indexed {len(texts)} documents into FAISS.")
            return len(texts)
        except Exception as e:
            logger.warning(f"Failed to add documents to FAISS: {e}")
            return 0

    def index_timeline_items(self, items: List[Dict[str, Any]]) -> int:
        """
        Index timeline items as searchable documents.
        
        Converts each timeline item into a text representation
        for semantic search.
        """
        if not items:
            return 0

        texts = []
        metadatas = []

        for item in items:
            # Build a rich text representation of the timeline item
            parts = []
            if item.get("category"):
                parts.append(f"[{item['category'].upper()}]")
            if item.get("title"):
                parts.append(item["title"])
            if item.get("description"):
                parts.append(item["description"])
            if item.get("due_date"):
                parts.append(f"Due: {item['due_date']}")
            if item.get("due_time"):
                parts.append(f"Time: {item['due_time']}")
            if item.get("priority"):
                parts.append(f"Priority: {item['priority']}")

            text = " | ".join(parts)
            if text.strip():
                texts.append(text)
                metadatas.append({
                    "source": "timeline",
                    "type": item.get("category", "other"),
                    "item_id": item.get("id", ""),
                    "due_date": item.get("due_date", ""),
                })

        return self.add_documents(texts, metadatas)

    def similarity_search(self, query: str, k: int = 3) -> str:
        """
        Search the vector store for documents similar to the query.
        
        Returns a formatted string of retrieved documents for RAG injection.
        Falls back to static docs if FAISS is unavailable.
        """
        if not self._ensure_store():
            logger.info("FAISS unavailable, using fallback static docs.")
            return self._fallback_docs

        try:
            results = self._store.similarity_search_with_score(query, k=k)

            if not results:
                return self._fallback_docs

            retrieved_parts = []
            for i, (doc, score) in enumerate(results, 1):
                source = doc.metadata.get("source", "unknown")
                doc_type = doc.metadata.get("type", "general")
                retrieved_parts.append(
                    f"[Doc {i}] (source={source}, type={doc_type}, relevance={1-score:.2f})\n"
                    f"{doc.page_content}"
                )

            retrieved_text = "\n\n".join(retrieved_parts)
            logger.info(f"Retrieved {len(results)} documents for query: {query[:50]}...")
            return retrieved_text

        except Exception as e:
            logger.warning(f"FAISS search failed: {e}")
            return self._fallback_docs


# ═══════════════════════════════════════════════════════════════════════════
# SINGLETON INSTANCE
# ═══════════════════════════════════════════════════════════════════════════

_vector_store_instance: Optional[VectorStoreManager] = None


def get_vector_store() -> VectorStoreManager:
    """Get or create the singleton VectorStoreManager instance."""
    global _vector_store_instance
    if _vector_store_instance is None:
        _vector_store_instance = VectorStoreManager()
    return _vector_store_instance
