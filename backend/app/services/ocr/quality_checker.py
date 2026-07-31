from __future__ import annotations

import unicodedata

from .models import ExtractionResult, QualityReport


class QualityChecker:
    def check(self, extraction: ExtractionResult) -> QualityReport:
        text = extraction.text
        characters = [char for char in text if not char.isspace()]
        valid = [
            char
            for char in characters
            if char.isalnum() or unicodedata.category(char).startswith(("L", "N", "P", "S"))
        ]
        errors = [char for char in text if char == "\ufffd" or (ord(char) < 32 and char not in "\n\r\t")]
        valid_ratio = round(len(valid) / len(characters), 4) if characters else 0.0
        error_ratio = round(len(errors) / max(1, len(text)), 4)
        densities = {page.page: len(page.text.strip()) for page in extraction.pages}
        unreadable = [page for page, count in densities.items() if count < 20]
        low_quality_pages = [
            page.page
            for page in extraction.pages
            if len(page.text.strip()) < 60
            or (page.ocr_confidence is not None and page.ocr_confidence < 45)
        ]
        retry_performed = any(page.retry_performed for page in extraction.pages)
        warnings: list[str] = []
        if len(text.strip()) < 40:
            warnings.append("NO_MEANINGFUL_TEXT")
        if extraction.ocr_used and (
            extraction.mean_ocr_confidence is None or extraction.mean_ocr_confidence < 45
        ):
            warnings.append("OCR_LOW_CONFIDENCE")
        is_low_quality = bool(warnings or valid_ratio < 0.7 or error_ratio > 0.03)
        return QualityReport(
            character_count=len(text),
            valid_character_ratio=valid_ratio,
            line_count=len([line for line in text.splitlines() if line.strip()]),
            error_character_ratio=error_ratio,
            ocr_confidence=extraction.mean_ocr_confidence,
            text_density_by_page=densities,
            unreadable_pages=unreadable,
            low_quality_pages=low_quality_pages,
            retry_performed=retry_performed,
            is_low_quality=is_low_quality,
            warnings=list(dict.fromkeys(warnings)),
        )
