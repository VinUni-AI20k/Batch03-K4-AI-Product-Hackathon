from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path


@dataclass(slots=True)
class ValidatedFile:
    mime_type: str
    extension: str
    size_bytes: int
    page_count: int
    file_hash: str


@dataclass(slots=True)
class PageText:
    page: int
    text: str
    source_type: str
    ocr_confidence: float | None = None
    retry_performed: bool = False


@dataclass(slots=True)
class ExtractionResult:
    pages: list[PageText]
    primary_method: str
    ocr_used: bool
    text_pages: list[int] = field(default_factory=list)
    ocr_pages: list[int] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    @property
    def text(self) -> str:
        return "\n".join(page.text for page in self.pages if page.text)

    @property
    def mean_ocr_confidence(self) -> float | None:
        values = [page.ocr_confidence for page in self.pages if page.ocr_confidence is not None]
        return round(sum(values) / len(values), 2) if values else None


@dataclass(slots=True)
class QualityReport:
    character_count: int
    valid_character_ratio: float
    line_count: int
    error_character_ratio: float
    ocr_confidence: float | None
    text_density_by_page: dict[int, int]
    unreadable_pages: list[int]
    low_quality_pages: list[int]
    retry_performed: bool
    is_low_quality: bool
    warnings: list[str]
