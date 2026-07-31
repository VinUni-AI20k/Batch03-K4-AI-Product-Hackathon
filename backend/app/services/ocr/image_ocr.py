from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Callable

import pytesseract
from PIL import Image
from pytesseract import Output, TesseractError, TesseractNotFoundError

from .errors import OcrPipelineError
from .image_preprocessor import ImagePreprocessor, PreprocessOptions


EventCallback = Callable[[str, str, dict[str, Any]], None]


@dataclass(slots=True)
class OcrTextResult:
    text: str
    confidence: float
    language: str
    retry_performed: bool = False
    warnings: list[str] = field(default_factory=list)


class ImageOcr:
    def __init__(self, preprocessor: ImagePreprocessor | None = None) -> None:
        self.preprocessor = preprocessor or ImagePreprocessor()

    def extract(
        self,
        image: Image.Image,
        *,
        languages: str,
        on_event: EventCallback | None = None,
    ) -> OcrTextResult:
        callback = on_event or (lambda _event, _status, _metadata: None)
        selected_language, warnings = self._select_language(languages)
        callback("ocr_started", "started", {"extraction_method": "tesseract_ocr"})

        first = self._run_once(
            self.preprocessor.preprocess(image, options=PreprocessOptions()),
            selected_language,
        )
        result = OcrTextResult(
            text=first.text,
            confidence=first.confidence,
            language=selected_language,
            warnings=warnings,
        )

        if len(first.text.strip()) < 40 or first.confidence < 55:
            retry = self._run_once(
                self.preprocessor.preprocess(
                    image,
                    options=PreprocessOptions(auto_rotate=False, threshold=True),
                ),
                selected_language,
            )
            result.retry_performed = True
            if self._score(retry) > self._score(first):
                result.text = retry.text
                result.confidence = retry.confidence

        if len(result.text.strip()) < 40 or result.confidence < 45:
            result.warnings.append("OCR_LOW_CONFIDENCE")

        callback(
            "ocr_completed",
            "warning" if "OCR_LOW_CONFIDENCE" in result.warnings else "success",
            {
                "extraction_method": "tesseract_ocr",
                "character_count": len(result.text),
                "ocr_confidence": result.confidence,
                "retry_performed": result.retry_performed,
            },
        )
        return result

    @staticmethod
    def _score(result: OcrTextResult) -> tuple[int, float]:
        return (len(result.text.strip()), result.confidence)

    @staticmethod
    def _run_once(image: Image.Image, language: str) -> OcrTextResult:
        try:
            data = pytesseract.image_to_data(
                image,
                lang=language,
                config="--psm 6",
                output_type=Output.DICT,
            )
        except TesseractNotFoundError as exc:
            raise OcrPipelineError(
                "OCR_ENGINE_UNAVAILABLE",
                "Tesseract is not installed or is not available on PATH.",
                status_code=503,
            ) from exc
        except TesseractError as exc:
            raise OcrPipelineError("OCR_ENGINE_UNAVAILABLE", "Tesseract could not process the image.", status_code=503) from exc

        tokens: list[str] = []
        confidences: list[float] = []
        for token, raw_confidence in zip(data.get("text", []), data.get("conf", []), strict=False):
            token = str(token).strip()
            try:
                confidence = float(raw_confidence)
            except (TypeError, ValueError):
                confidence = -1
            if token:
                tokens.append(token)
            if confidence >= 0:
                confidences.append(confidence)
        text = " ".join(tokens)
        mean_confidence = round(sum(confidences) / len(confidences), 2) if confidences else 0.0
        return OcrTextResult(text=text, confidence=mean_confidence, language=language)

    @staticmethod
    def _select_language(requested: str) -> tuple[str, list[str]]:
        cleaned = "+".join(
            item for item in re.split(r"[^A-Za-z0-9_-]+", requested or "") if item
        ) or "vie+eng"
        try:
            pytesseract.get_tesseract_version()
            installed = set(pytesseract.get_languages(config=""))
        except TesseractNotFoundError as exc:
            raise OcrPipelineError(
                "OCR_ENGINE_UNAVAILABLE",
                "Tesseract is not installed or is not available on PATH.",
                status_code=503,
            ) from exc

        requested_parts = cleaned.split("+")
        available = [item for item in requested_parts if item in installed]
        missing = [item for item in requested_parts if item not in installed]
        warnings: list[str] = []
        if missing:
            warnings.append("OCR_LANGUAGE_UNAVAILABLE")
        if available:
            return "+".join(available), warnings
        if "eng" in installed:
            return "eng", [*warnings, "OCR_LANGUAGE_UNAVAILABLE"]
        if installed:
            return sorted(installed)[0], [*warnings, "OCR_LANGUAGE_UNAVAILABLE"]
        raise OcrPipelineError("OCR_ENGINE_UNAVAILABLE", "Tesseract has no installed language data.", status_code=503)
