from __future__ import annotations


ERROR_CODES = {
    "UNSUPPORTED_FILE_TYPE",
    "FILE_TOO_LARGE",
    "TOO_MANY_PAGES",
    "INVALID_FILE_SIGNATURE",
    "CORRUPTED_FILE",
    "PDF_EXTRACTION_FAILED",
    "OCR_ENGINE_UNAVAILABLE",
    "OCR_LANGUAGE_UNAVAILABLE",
    "OCR_LOW_CONFIDENCE",
    "NO_MEANINGFUL_TEXT",
    "PII_REDACTION_FAILED",
    "LLM_UNAVAILABLE",
    "LLM_INVALID_JSON",
    "PROFILE_SCHEMA_INVALID",
    "TEMP_FILE_DELETE_FAILED",
    "INTERNAL_ERROR",
}


class OcrPipelineError(Exception):
    def __init__(self, code: str, message: str, *, status_code: int = 400) -> None:
        safe_code = code if code in ERROR_CODES else "INTERNAL_ERROR"
        super().__init__(message)
        self.code = safe_code
        self.safe_message = message[:300]
        self.status_code = status_code
