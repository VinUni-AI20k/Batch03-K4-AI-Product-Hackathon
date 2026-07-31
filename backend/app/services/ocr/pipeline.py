from __future__ import annotations

import shutil
import time
import uuid
from pathlib import Path
from typing import Any

from PIL import Image
from pydantic import ValidationError

from app.config import Settings, get_settings
from app.schemas.profile import OcrParseResponse, ProcessingMetadata, SourceMetadata, StudentProfile
from app.utils.hashing import sha256_bytes

from .docx_extractor import DocxExtractor
from .errors import OcrPipelineError
from .event_logger import EventLogger
from .file_validator import FileValidator
from .image_ocr import ImageOcr
from .models import ExtractionResult, PageText, QualityReport, ValidatedFile
from .pdf_extractor import PdfExtractor
from .pii_redactor import PiiRedactor, detect_prompt_injection
from .profile_parser import ProfileParser
from .quality_checker import QualityChecker
from .report_writer import ReportWriter


class OcrPipeline:
    def __init__(
        self,
        settings: Settings | None = None,
        *,
        validator: FileValidator | None = None,
        image_ocr: ImageOcr | None = None,
        profile_parser: ProfileParser | None = None,
        logger: EventLogger | None = None,
        report_writer: ReportWriter | None = None,
    ) -> None:
        self.settings = settings or get_settings()
        self.settings.ensure_directories()
        self.validator = validator or FileValidator(self.settings)
        self.image_ocr = image_ocr or ImageOcr()
        self.pdf_extractor = PdfExtractor(self.image_ocr)
        self.docx_extractor = DocxExtractor()
        self.quality_checker = QualityChecker()
        self.redactor = PiiRedactor()
        self.profile_parser = profile_parser or ProfileParser(self.settings)
        self.logger = logger or EventLogger(self.settings.log_file)
        self.report_writer = report_writer or ReportWriter(self.settings.report_dir, self.redactor)
        self.records: dict[str, dict[str, Any]] = {}
        self._cleanup_expired()

    def parse(
        self,
        data: bytes,
        *,
        filename: str,
        declared_mime: str | None = None,
        use_llm: bool = False,
        language_hint: str | None = None,
        consent_external_processing: bool = False,
    ) -> OcrParseResponse:
        run_id = str(uuid.uuid4())
        started = time.monotonic()
        trace: list[str] = []
        upload_dir = self.settings.runtime_dir / "uploads" / run_id
        temp_dir = self.settings.runtime_dir / "temp" / run_id
        run_dir = self.settings.runtime_dir / "runs" / run_id
        runtime_paths = (upload_dir, temp_dir, run_dir)
        for path in runtime_paths:
            path.mkdir(parents=True, exist_ok=True)

        validated: ValidatedFile | None = None
        report_id: str | None = None
        report_content = ""
        cleaned = False

        def emit(
            event: str,
            status: str,
            metadata: dict[str, Any] | None = None,
            duration_ms: int = 0,
        ) -> None:
            trace.append(event)
            self.logger.log(
                run_id,
                event,
                status,
                duration_ms=duration_ms,
                metadata=metadata,
            )

        emit("upload_received", "started", {"size_bytes": len(data)})
        try:
            validation_started = time.monotonic()
            try:
                validated = self.validator.validate(data, filename, declared_mime)
            except OcrPipelineError:
                emit("upload_rejected", "failed")
                raise
            emit(
                "upload_validated",
                "success",
                {
                    "file_hash": validated.file_hash,
                    "mime_type": validated.mime_type,
                    "size_bytes": validated.size_bytes,
                    "page_count": validated.page_count,
                },
                self._elapsed_ms(validation_started),
            )

            source_path = upload_dir / f"source{validated.extension}"
            source_path.write_bytes(data)
            emit("extraction_started", "started", {"extraction_method": validated.extension.removeprefix(".")})
            extraction_started = time.monotonic()
            languages = language_hint or self.settings.ocr_languages
            extraction = self._extract(
                source_path,
                validated,
                languages=languages,
                emit=emit,
            )

            quality = self.quality_checker.check(extraction)
            emit(
                "quality_check_completed",
                "warning" if quality.is_low_quality else "success",
                {
                    "character_count": quality.character_count,
                    "ocr_confidence": quality.ocr_confidence,
                    "retry_performed": quality.retry_performed,
                    "low_quality_page_count": len(quality.low_quality_pages),
                },
                self._elapsed_ms(extraction_started),
            )

            injection_codes = detect_prompt_injection(extraction.text)
            warnings = list(dict.fromkeys([*extraction.warnings, *quality.warnings]))
            if injection_codes:
                warnings.append("PROMPT_INJECTION_DETECTED")
                emit(
                    "prompt_injection_detected",
                    "warning",
                    {"warning_code": "PROMPT_INJECTION_DETECTED"},
                )

            redacted_pages: list[PageText] = []
            pii_counts = {
                "email_count": 0,
                "phone_count": 0,
                "address_count": 0,
                "date_of_birth_count": 0,
                "id_number_count": 0,
                "secret_count": 0,
                "name_count": 0,
            }
            redaction_started = time.monotonic()
            for page in extraction.pages:
                result = self.redactor.redact(page.text)
                for key, value in result.counts.items():
                    pii_counts[key] += value
                redacted_pages.append(
                    PageText(
                        page=page.page,
                        text=result.text,
                        source_type=page.source_type,
                        ocr_confidence=page.ocr_confidence,
                        retry_performed=page.retry_performed,
                    )
                )
            emit(
                "pii_redaction_completed",
                "success",
                pii_counts,
                self._elapsed_ms(redaction_started),
            )

            if quality.is_low_quality and self.settings.ocr_enable_external_vision:
                # Sending a low-quality source image could expose PII that local OCR
                # failed to locate. Keep the optional cloud-vision path closed unless
                # a future image-redaction stage can prove those regions are removed.
                warnings.append("EXTERNAL_VISION_DISABLED_FOR_PRIVACY")

            emit("profile_parsing_started", "started")
            parsing_started = time.monotonic()
            parse_result = self.profile_parser.parse(
                redacted_pages,
                use_llm=use_llm,
                consent_external_processing=consent_external_processing,
                extraction_method=extraction.primary_method,
            )
            warnings.extend(parse_result.warnings)
            warnings = list(dict.fromkeys(warnings))
            try:
                profile = StudentProfile.model_validate(
                    parse_result.profile.model_copy(
                        update={
                            "warnings": list(dict.fromkeys([*parse_result.profile.warnings, *warnings])),
                            "requires_user_confirmation": True,
                        }
                    )
                )
            except ValidationError as exc:
                emit("profile_validation_failed", "failed", {"error_type": "PROFILE_SCHEMA_INVALID"})
                raise OcrPipelineError("PROFILE_SCHEMA_INVALID", "Extracted profile did not match the schema.") from exc
            emit(
                "profile_parsing_completed",
                "success",
                {
                    "skill_count": len(profile.skills),
                    "project_count": len(profile.projects),
                    "external_processing": parse_result.llm_used,
                },
                self._elapsed_ms(parsing_started),
            )
            emit(
                "profile_validation_completed",
                "success",
                {"skill_count": len(profile.skills), "project_count": len(profile.projects)},
            )

            cleaned = self._cleanup_runtime(runtime_paths)
            emit(
                "temporary_files_deleted",
                "success" if cleaned else "warning",
                {"warning_code": None if cleaned else "TEMP_FILE_DELETE_FAILED"},
            )
            if not cleaned:
                warnings.append("TEMP_FILE_DELETE_FAILED")

            duration_ms = self._elapsed_ms(started)
            response_status = "partial_success" if quality.is_low_quality else "needs_confirmation"
            final_status = "partial_success" if response_status == "partial_success" else "success"
            report_id, _report_path, report_content = self.report_writer.write(
                run_id=run_id,
                source=validated,
                extraction=extraction,
                quality=quality,
                pii_counts=pii_counts,
                profile=profile,
                warnings=warnings,
                llm_used=parse_result.llm_used,
                external_processing=parse_result.llm_used,
                injection_detected=bool(injection_codes),
                temporary_files_deleted=cleaned,
                total_duration_ms=duration_ms,
                final_status=final_status,
            )
            emit("report_written", "success")
            response = OcrParseResponse(
                run_id=run_id,
                status=response_status,
                source=SourceMetadata(
                    file_hash=validated.file_hash,
                    mime_type=validated.mime_type,
                    size_bytes=validated.size_bytes,
                    page_count=validated.page_count,
                ),
                processing=ProcessingMetadata(
                    primary_method=extraction.primary_method,
                    ocr_used=extraction.ocr_used,
                    llm_used=parse_result.llm_used,
                    duration_ms=duration_ms,
                ),
                profile=profile,
                uncertain_fields=profile.uncertain_fields,
                warnings=warnings,
                requires_user_confirmation=True,
                report_id=report_id,
                trace=list(dict.fromkeys(trace)),
            )
            emit("run_completed", "success" if response_status == "needs_confirmation" else "warning")
            self.records[run_id] = {
                "run_id": run_id,
                "status": response.status,
                "source": response.source.model_dump(),
                "processing": response.processing.model_dump(),
                "warnings": warnings,
                "report_id": report_id,
                "report": report_content,
                "runtime_deleted": cleaned,
            }
            return response
        except OcrPipelineError as exc:
            if not cleaned:
                cleaned = self._cleanup_runtime(runtime_paths)
                emit(
                    "temporary_files_deleted",
                    "success" if cleaned else "warning",
                    {"warning_code": None if cleaned else "TEMP_FILE_DELETE_FAILED"},
                )
            duration_ms = self._elapsed_ms(started)
            report_id, _report_path, report_content = self.report_writer.write_failure(
                run_id=run_id,
                file_hash=validated.file_hash if validated else sha256_bytes(data),
                size_bytes=len(data),
                mime_type=validated.mime_type if validated else (declared_mime or "application/octet-stream"),
                error_code=exc.code,
                temporary_files_deleted=cleaned,
                total_duration_ms=duration_ms,
            )
            emit("report_written", "success")
            emit("run_failed", "failed", {"error_type": exc.code})
            self.records[run_id] = {
                "run_id": run_id,
                "status": "failed",
                "source": {
                    "file_hash": validated.file_hash if validated else sha256_bytes(data),
                    "mime_type": validated.mime_type if validated else "unknown",
                    "size_bytes": len(data),
                    "page_count": validated.page_count if validated else None,
                },
                "processing": None,
                "warnings": [exc.code],
                "report_id": report_id,
                "report": report_content,
                "runtime_deleted": cleaned,
            }
            exc.run_id = run_id
            exc.report_id = report_id
            raise
        except Exception as exc:
            if not cleaned:
                cleaned = self._cleanup_runtime(runtime_paths)
                emit(
                    "temporary_files_deleted",
                    "success" if cleaned else "warning",
                    {"warning_code": None if cleaned else "TEMP_FILE_DELETE_FAILED"},
                )
            duration_ms = self._elapsed_ms(started)
            report_id, _report_path, report_content = self.report_writer.write_failure(
                run_id=run_id,
                file_hash=validated.file_hash if validated else sha256_bytes(data),
                size_bytes=len(data),
                mime_type=validated.mime_type if validated else (declared_mime or "application/octet-stream"),
                error_code="INTERNAL_ERROR",
                temporary_files_deleted=cleaned,
                total_duration_ms=duration_ms,
            )
            emit("report_written", "success")
            emit("run_failed", "failed", {"error_type": type(exc).__name__})
            self.records[run_id] = {
                "run_id": run_id,
                "status": "failed",
                "source": {
                    "file_hash": validated.file_hash if validated else sha256_bytes(data),
                    "mime_type": validated.mime_type if validated else "unknown",
                    "size_bytes": len(data),
                    "page_count": validated.page_count if validated else None,
                },
                "processing": None,
                "warnings": ["INTERNAL_ERROR"],
                "report_id": report_id,
                "report": report_content,
                "runtime_deleted": cleaned,
            }
            safe_error = OcrPipelineError("INTERNAL_ERROR", "Profile extraction failed.", status_code=500)
            safe_error.run_id = run_id
            safe_error.report_id = report_id
            raise safe_error from exc

    def get_run(self, run_id: str) -> dict[str, Any] | None:
        return self.records.get(run_id)

    def delete_run(self, run_id: str) -> dict[str, Any] | None:
        record = self.records.get(run_id)
        if record is None:
            return None
        paths = tuple(self.settings.runtime_dir / name / run_id for name in ("uploads", "temp", "runs"))
        cleaned = self._cleanup_runtime(paths)
        record["runtime_deleted"] = cleaned
        return {
            "run_id": run_id,
            "status": "runtime_deleted" if cleaned else "delete_incomplete",
            "event_log_retained": True,
            "report_retained": True,
        }

    def _extract(
        self,
        path: Path,
        validated: ValidatedFile,
        *,
        languages: str,
        emit: Any,
    ) -> ExtractionResult:
        if validated.extension == ".pdf":
            return self.pdf_extractor.extract(path, languages=languages, on_event=emit)
        if validated.extension == ".docx":
            result = self.docx_extractor.extract(path)
            emit(
                "page_extracted",
                "success" if result.text else "warning",
                {
                    "page_number": 1,
                    "extraction_method": "docx_text",
                    "character_count": len(result.text),
                },
            )
            return result
        with Image.open(path) as image:
            result = self.image_ocr.extract(image, languages=languages, on_event=emit)
        emit(
            "page_extracted",
            "success" if result.text else "warning",
            {
                "page_number": 1,
                "extraction_method": "ocr",
                "character_count": len(result.text),
                "ocr_confidence": result.confidence,
            },
        )
        return ExtractionResult(
            pages=[
                PageText(
                    page=1,
                    text=result.text,
                    source_type="ocr",
                    ocr_confidence=result.confidence,
                    retry_performed=result.retry_performed,
                )
            ],
            primary_method="tesseract_ocr",
            ocr_used=True,
            ocr_pages=[1],
            warnings=result.warnings,
        )

    def _cleanup_expired(self) -> None:
        ttl = self.settings.ocr_temp_ttl_seconds
        now = time.time()
        for name in ("uploads", "temp", "runs"):
            parent = self.settings.runtime_dir / name
            parent.mkdir(parents=True, exist_ok=True)
            for child in parent.iterdir():
                try:
                    if child.is_dir() and (ttl == 0 or now - child.stat().st_mtime > ttl):
                        shutil.rmtree(child)
                except OSError:
                    continue

    def _cleanup_runtime(self, paths: tuple[Path, ...]) -> bool:
        runtime_root = self.settings.runtime_dir.resolve()
        success = True
        for path in paths:
            try:
                resolved = path.resolve()
                if not resolved.is_relative_to(runtime_root):
                    success = False
                    continue
                if resolved.exists():
                    shutil.rmtree(resolved)
            except OSError:
                success = False
        return success

    @staticmethod
    def _elapsed_ms(started: float) -> int:
        return max(0, int((time.monotonic() - started) * 1000))
