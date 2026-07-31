from __future__ import annotations

import io
import re
import zipfile
from pathlib import Path

import fitz
from docx import Document
from PIL import Image, UnidentifiedImageError

from app.config import Settings
from app.utils.hashing import sha256_bytes

from .errors import OcrPipelineError
from .models import ValidatedFile


MIME_BY_EXTENSION = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
}

SAFE_DECLARED_MIMES = {
    "",
    "application/octet-stream",
    *MIME_BY_EXTENSION.values(),
}


class FileValidator:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def validate(self, data: bytes, filename: str, declared_mime: str | None) -> ValidatedFile:
        size_bytes = len(data)
        if size_bytes > self.settings.max_upload_bytes:
            raise OcrPipelineError(
                "FILE_TOO_LARGE",
                f"File exceeds the {self.settings.ocr_max_upload_mb} MB limit.",
                status_code=413,
            )
        if not data:
            raise OcrPipelineError("CORRUPTED_FILE", "The uploaded file is empty.")

        extension = Path(filename or "").suffix.lower()
        if extension not in MIME_BY_EXTENSION:
            raise OcrPipelineError("UNSUPPORTED_FILE_TYPE", "Supported types are PDF, DOCX, PNG, JPG and JPEG.")

        detected_extension = self._detect_extension(data)
        if detected_extension is None:
            raise OcrPipelineError("INVALID_FILE_SIGNATURE", "The file signature does not match a supported type.")
        if extension == ".jpeg":
            extension = ".jpg"
        if detected_extension != extension:
            raise OcrPipelineError("INVALID_FILE_SIGNATURE", "The file extension and binary signature do not match.")

        mime_type = MIME_BY_EXTENSION[extension]
        normalized_declared = (declared_mime or "").split(";", 1)[0].strip().lower()
        if normalized_declared not in SAFE_DECLARED_MIMES:
            raise OcrPipelineError("UNSUPPORTED_FILE_TYPE", "The declared MIME type is not supported.")
        if normalized_declared not in {"", "application/octet-stream", mime_type}:
            raise OcrPipelineError("INVALID_FILE_SIGNATURE", "The declared MIME type does not match the file.")

        page_count = self._validate_content(data, extension)
        if page_count > self.settings.ocr_max_pages:
            raise OcrPipelineError(
                "TOO_MANY_PAGES",
                f"Document has {page_count} pages; the limit is {self.settings.ocr_max_pages}.",
            )

        return ValidatedFile(
            mime_type=mime_type,
            extension=extension,
            size_bytes=size_bytes,
            page_count=page_count,
            file_hash=sha256_bytes(data),
        )

    @staticmethod
    def _detect_extension(data: bytes) -> str | None:
        if data.startswith(b"%PDF-"):
            return ".pdf"
        if data.startswith(b"\x89PNG\r\n\x1a\n"):
            return ".png"
        if data.startswith(b"\xff\xd8\xff"):
            return ".jpg"
        if data.startswith(b"PK\x03\x04"):
            try:
                with zipfile.ZipFile(io.BytesIO(data)) as archive:
                    names = set(archive.namelist())
                if "[Content_Types].xml" in names and "word/document.xml" in names:
                    return ".docx"
            except (OSError, zipfile.BadZipFile):
                return None
        return None

    def _validate_content(self, data: bytes, extension: str) -> int:
        try:
            if extension == ".pdf":
                with fitz.open(stream=data, filetype="pdf") as document:
                    if document.needs_pass or document.page_count < 1:
                        raise ValueError("Encrypted or empty PDF")
                    return document.page_count
            if extension == ".docx":
                with zipfile.ZipFile(io.BytesIO(data)) as archive:
                    if archive.testzip() is not None:
                        raise ValueError("Corrupted DOCX member")
                    if sum(item.file_size for item in archive.infolist()) > 50 * 1024 * 1024:
                        raise ValueError("DOCX expands beyond the safe limit")
                    document_xml = archive.read("word/document.xml")
                Document(io.BytesIO(data))
                explicit_breaks = len(re.findall(rb"<w:(?:lastRenderedPageBreak|br\\b[^>]*w:type=\"page\")", document_xml))
                return max(1, explicit_breaks + 1)
            with Image.open(io.BytesIO(data)) as image:
                image.verify()
            with Image.open(io.BytesIO(data)) as image:
                image.load()
                if image.width < 1 or image.height < 1:
                    raise ValueError("Empty image")
            return 1
        except OcrPipelineError:
            raise
        except (ValueError, OSError, RuntimeError, zipfile.BadZipFile, UnidentifiedImageError, fitz.FileDataError) as exc:
            raise OcrPipelineError("CORRUPTED_FILE", "The uploaded file is corrupted or unreadable.") from exc
