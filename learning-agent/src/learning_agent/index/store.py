"""Vector store trên Chroma: 1 chunk = 1 section (slide) của ghi chú bài học.

Incremental: xoá theo metadata source_note rồi insert lại -> chỉ bài đổi bị đụng.
Metadata mỗi chunk mang đủ provenance để agent trích nguồn: course/lesson/slide/timestamp.
"""
from __future__ import annotations

from pathlib import Path
from typing import Any

import chromadb

from ..vault.note import Note
from .embeddings import VoyageEmbedder


class LessonIndex:
    def __init__(self, chroma_path: Path, collection: str, embedder: VoyageEmbedder | None):
        self.client = chromadb.PersistentClient(path=str(chroma_path))
        self.collection = self.client.get_or_create_collection(collection)
        self.embedder = embedder

    def index_note(self, note: Note) -> int:
        """Xoá chunks cũ của note rồi index lại từng section (1 slide = 1 chunk)."""
        source_note = str(note.path)
        self.remove_note(source_note)

        ids, docs, metas = [], [], []
        for i, (heading, text) in enumerate(note.sections()):
            content = f"{heading}\n{text}".strip()
            if len(content) < 20:
                continue
            ids.append(f"{note.name}::{i}")
            docs.append(content)
            metas.append(
                {
                    "source_note": source_note,
                    "note_name": note.name,
                    "heading": heading,
                    "course": str(note.meta.get("course", "")),
                    "lesson": str(note.meta.get("lesson", "")),
                    "video": str(note.meta.get("video", "")),
                }
            )
        if not ids:
            return 0
        kwargs: dict[str, Any] = {"ids": ids, "documents": docs, "metadatas": metas}
        if self.embedder:
            kwargs["embeddings"] = self.embedder.embed_docs(docs)
        self.collection.add(**kwargs)
        return len(ids)

    def remove_note(self, source_note: str) -> None:
        self.collection.delete(where={"source_note": source_note})

    def search(self, query: str, top_k: int = 6, course: str | None = None) -> list[dict]:
        kwargs: dict[str, Any] = {"n_results": top_k}
        if course:
            kwargs["where"] = {"course": course}
        if self.embedder:
            kwargs["query_embeddings"] = [self.embedder.embed_query(query)]
        else:
            kwargs["query_texts"] = [query]
        res = self.collection.query(**kwargs)
        hits = []
        for doc, meta, dist in zip(
            res["documents"][0], res["metadatas"][0], res["distances"][0]
        ):
            hits.append({"text": doc, "meta": meta, "score": 1 - dist})
        return hits
