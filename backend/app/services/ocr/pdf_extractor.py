from __future__ import annotations

import io
from pathlib import Path
from typing import Any, Callable

import fitz
from PIL import Image

from .errors import OcrPipelineError
from .image_ocr import ImageOcr
from .models import ExtractionResult, PageText


EventCallback = Callable[[str, str, dict[str, Any]], None]


class PdfExtractor:
    def __init__(self, image_ocr: ImageOcr, *, min_text_characters: int = 60) -> None:
        self.image_ocr = image_ocr
        self.min_text_characters = min_text_characters

    def extract(
        self,
        path: Path,
        *,
        languages: str,
        on_event: EventCallback | None = None,
    ) -> ExtractionResult:
        callback = on_event or (lambda _event, _status, _metadata: None)
        pages: list[PageText] = []
        warnings: list[str] = []
        text_pages: list[int] = []
        ocr_pages: list[int] = []
        try:
            with fitz.open(path) as document:
                for index, page in enumerate(document, start=1):
                    text = page.get_text("text", sort=True).strip()
                    if len(text) >= self.min_text_characters:
                        page_result = PageText(index, text, "pdf_text")
                        text_pages.append(index)
                    else:
                        pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
                        with Image.open(io.BytesIO(pixmap.tobytes("png"))) as image:
                            ocr_result = self.image_ocr.extract(
                                image,
                                languages=languages,
                                on_event=callback,
                            )
                        page_result = PageText(
                            index,
                            ocr_result.text,
                            "ocr",
                            ocr_confidence=ocr_result.confidence,
                            retry_performed=ocr_result.retry_performed,
                        )
                        ocr_pages.append(index)
                        warnings.extend(ocr_result.warnings)
                    pages.append(page_result)
                    callback(
                        "page_extracted",
                        "success" if page_result.text else "warning",
                        {
                            "page_number": index,
                            "extraction_method": page_result.source_type,
                            "character_count": len(page_result.text),
                            "ocr_confidence": page_result.ocr_confidence,
                        },
                    )
        except OcrPipelineError:
            raise
        except (fitz.FileDataError, RuntimeError, OSError, ValueError) as exc:
            raise OcrPipelineError("PDF_EXTRACTION_FAILED", "PDF text extraction failed.") from exc

        if ocr_pages and text_pages:
            primary_method = "hybrid_pdf_ocr"
        elif ocr_pages:
            primary_method = "tesseract_ocr"
        else:
            primary_method = "pymupdf_text"
        return ExtractionResult(
            pages=pages,
            primary_method=primary_method,
            ocr_used=bool(ocr_pages),
            text_pages=text_pages,
            ocr_pages=ocr_pages,
            warnings=list(dict.fromkeys(warnings)),
        )
