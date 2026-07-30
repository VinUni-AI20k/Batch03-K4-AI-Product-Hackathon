"""Local PDF retrieval for the VLearn lesson demo.

The source PDFs stay on the user's machine. Only the few pages returned by a
search tool are sent to the model.
"""

from __future__ import annotations

import math
import re
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader

TOKEN_PATTERN = re.compile(r"[^\W_]{2,}", flags=re.UNICODE)


@dataclass(frozen=True)
class Lesson:
    id: str
    title: str
    filename: str


@dataclass(frozen=True)
class SlidePage:
    lesson_id: str
    filename: str
    page: int
    text: str


LESSONS = (
    Lesson("day03", "Day03 · Từ Chatbot đến Agentic Agent", "day03-material.pdf"),
    Lesson(
        "day04",
        "Day04 · Prompt Engineering & Tool Calling",
        "day04-prompt-engineering-tool-calling-v2.pdf",
    ),
    Lesson("day05", "Day05 · AI Product", "day05-lecture-slides.pdf"),
)


def tokenize(text: str) -> list[str]:
    return TOKEN_PATTERN.findall(text.casefold())


class SlideStore:
    """Lazily extract PDF pages and rank them with a small local BM25 index."""

    def __init__(self, slide_dir: Path):
        self.slide_dir = slide_dir
        self._pages: dict[str, list[SlidePage]] = {}

    def list_lessons(self) -> list[dict]:
        result = []
        for lesson in LESSONS:
            path = self.slide_dir / lesson.filename
            result.append(
                {
                    "id": lesson.id,
                    "title": lesson.title,
                    "filename": lesson.filename,
                    "available": path.is_file(),
                }
            )
        return result

    def _lesson(self, lesson_id: str) -> Lesson:
        lesson = next((item for item in LESSONS if item.id == lesson_id), None)
        if lesson is None:
            allowed = ", ".join(item.id for item in LESSONS)
            raise ValueError(f"Bài học không hợp lệ. Chọn một trong: {allowed}")
        path = self.slide_dir / lesson.filename
        if not path.is_file():
            raise FileNotFoundError(f"Không tìm thấy slide: {path}")
        return lesson

    def pages(self, lesson_id: str) -> list[SlidePage]:
        if lesson_id in self._pages:
            return self._pages[lesson_id]
        lesson = self._lesson(lesson_id)
        reader = PdfReader(self.slide_dir / lesson.filename)
        pages = []
        for number, page in enumerate(reader.pages, start=1):
            text = " ".join((page.extract_text() or "").split())
            pages.append(SlidePage(lesson.id, lesson.filename, number, text))
        self._pages[lesson_id] = pages
        return pages

    def search(self, lesson_id: str, query: str, limit: int = 4) -> list[dict]:
        query_tokens = tokenize(query)
        if not query_tokens:
            raise ValueError("Câu hỏi phải có ít nhất một từ có nghĩa")
        limit = max(1, min(int(limit), 6))
        pages = self.pages(lesson_id)
        page_tokens = [tokenize(page.text) for page in pages]
        nonempty = [tokens for tokens in page_tokens if tokens]
        average_length = sum(map(len, nonempty)) / max(len(nonempty), 1)
        document_frequency = Counter()
        for tokens in page_tokens:
            document_frequency.update(set(tokens))

        scored = []
        total = len(pages)
        for page, tokens in zip(pages, page_tokens, strict=True):
            frequencies = Counter(tokens)
            score = 0.0
            for token in query_tokens:
                frequency = frequencies[token]
                if not frequency:
                    continue
                frequency_in_docs = document_frequency[token]
                inverse_frequency = math.log(
                    1 + (total - frequency_in_docs + 0.5) / (frequency_in_docs + 0.5)
                )
                length_norm = 1.5 * (1 - 0.75 + 0.75 * len(tokens) / max(average_length, 1))
                score += inverse_frequency * frequency * 2.5 / (frequency + length_norm)
            if score > 0:
                scored.append((score, page))

        scored.sort(key=lambda pair: (-pair[0], pair[1].page))
        return [
            {
                "lesson_id": page.lesson_id,
                "filename": page.filename,
                "page": page.page,
                "score": round(score, 3),
                "excerpt": page.text[:1200],
            }
            for score, page in scored[:limit]
        ]

    def read_pages(self, lesson_id: str, page_numbers: list[int]) -> list[dict]:
        pages = self.pages(lesson_id)
        unique_numbers = list(dict.fromkeys(int(number) for number in page_numbers))
        if not unique_numbers or len(unique_numbers) > 6:
            raise ValueError("Đọc từ 1 đến 6 trang mỗi lần")
        result = []
        for number in unique_numbers:
            if number < 1 or number > len(pages):
                raise ValueError(f"Trang {number} nằm ngoài khoảng 1–{len(pages)}")
            page = pages[number - 1]
            result.append(
                {
                    "lesson_id": page.lesson_id,
                    "filename": page.filename,
                    "page": page.page,
                    "text": page.text[:5000],
                }
            )
        return result
