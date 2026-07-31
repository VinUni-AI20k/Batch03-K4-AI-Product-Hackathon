from __future__ import annotations

import fitz
import pytest

from app.services.ocr.errors import OcrPipelineError
from app.services.ocr.file_validator import FileValidator


def test_text_pdf_is_validated_locally(settings, text_pdf_bytes):
    result = FileValidator(settings).validate(text_pdf_bytes, "profile.pdf", "application/pdf")
    assert result.mime_type == "application/pdf"
    assert result.page_count == 1
    assert len(result.file_hash) == 64


def test_scanned_pdf_is_a_valid_pdf(settings, scan_pdf_bytes):
    result = FileValidator(settings).validate(scan_pdf_bytes, "scan.pdf", "application/pdf")
    assert result.page_count == 1


def test_png_and_docx_are_valid(settings, image_bytes, docx_bytes):
    validator = FileValidator(settings)
    assert validator.validate(image_bytes, "profile.png", "image/png").page_count == 1
    docx = validator.validate(
        docx_bytes,
        "portfolio.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
    assert docx.extension == ".docx"


def test_wrong_extension_is_rejected(settings, text_pdf_bytes):
    with pytest.raises(OcrPipelineError, match="extension") as caught:
        FileValidator(settings).validate(text_pdf_bytes, "profile.jpg", "image/jpeg")
    assert caught.value.code == "INVALID_FILE_SIGNATURE"


def test_file_over_limit_is_rejected(settings):
    with pytest.raises(OcrPipelineError) as caught:
        FileValidator(settings).validate(b"x" * (settings.max_upload_bytes + 1), "large.pdf", "application/pdf")
    assert caught.value.code == "FILE_TOO_LARGE"


def test_corrupted_pdf_is_rejected(settings):
    with pytest.raises(OcrPipelineError) as caught:
        FileValidator(settings).validate(b"%PDF-1.7\nnot-a-real-pdf", "bad.pdf", "application/pdf")
    assert caught.value.code == "CORRUPTED_FILE"


def test_pdf_page_limit_is_enforced(settings):
    document = fitz.open()
    for _ in range(settings.ocr_max_pages + 1):
        document.new_page()
    data = document.tobytes()
    document.close()
    with pytest.raises(OcrPipelineError) as caught:
        FileValidator(settings).validate(data, "long.pdf", "application/pdf")
    assert caught.value.code == "TOO_MANY_PAGES"
