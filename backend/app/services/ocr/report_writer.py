from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from app.schemas.profile import StudentProfile

from .models import ExtractionResult, QualityReport, ValidatedFile
from .pii_redactor import PiiRedactor


WARNING_DESCRIPTIONS = {
    "OCR_LANGUAGE_UNAVAILABLE": "Requested OCR language data was unavailable; an installed language was used.",
    "OCR_LOW_CONFIDENCE": "OCR confidence was low; the user should verify extracted fields.",
    "NO_MEANINGFUL_TEXT": "The document contained too little readable text for reliable extraction.",
    "PROMPT_INJECTION_DETECTED": "Instruction-like content was detected and treated as untrusted document data.",
    "LLM_UNAVAILABLE": "The optional structured extraction model was unavailable; local rules were used.",
    "LLM_INVALID_JSON": "The optional model response was invalid; local rules were used.",
    "EXTERNAL_PROCESSING_CONSENT_REQUIRED": "External processing was requested without explicit consent; local rules were used.",
    "EXTERNAL_VISION_DISABLED_FOR_PRIVACY": "Image content was not sent externally because safe visual PII removal could not be guaranteed.",
}


class ReportWriter:
    def __init__(self, report_dir: Path, redactor: PiiRedactor) -> None:
        self.report_dir = report_dir
        self.redactor = redactor
        self.report_dir.mkdir(parents=True, exist_ok=True)

    def write(
        self,
        *,
        run_id: str,
        source: ValidatedFile,
        extraction: ExtractionResult,
        quality: QualityReport,
        pii_counts: dict[str, int],
        profile: StudentProfile,
        warnings: list[str],
        llm_used: bool,
        external_processing: bool,
        injection_detected: bool,
        temporary_files_deleted: bool,
        total_duration_ms: int,
        final_status: str,
    ) -> tuple[str, Path, str]:
        timestamp = datetime.now(UTC)
        report_id = f"ocr-report-{timestamp:%Y%m%d-%H%M%S}-{run_id[:8]}"
        path = self.report_dir / f"{report_id}.md"
        skill_names = ", ".join(
            self.redactor.sanitize_value(skill.name, max_length=80) for skill in profile.skills
        ) or "None"
        technologies = sorted(
            {
                self.redactor.sanitize_value(technology, max_length=80)
                for project in profile.projects
                for technology in project.technologies
            }
        )
        technology_names = ", ".join(item for item in technologies if item) or "None"
        questions = [
            self.redactor.sanitize_value(item.question_for_user, max_length=250)
            for item in profile.uncertain_fields
        ]
        warning_lines = [
            f"- `{code}` — {WARNING_DESCRIPTIONS.get(code, 'Review this warning before using the profile.')}"
            for code in warnings
        ] or ["- None"]
        question_lines = [f"- {question}" for question in questions if question] or ["- Confirm the extracted profile before recommendation."]
        confidence = "N/A" if quality.ocr_confidence is None else f"{quality.ocr_confidence:.2f}"
        content = f"""# OCR Run Report

## 1. Run information
- Run ID: `{run_id}`
- Timestamp: {timestamp.isoformat().replace("+00:00", "Z")}
- File hash: `{source.file_hash}`
- MIME type: `{source.mime_type}`
- File size: {source.size_bytes} bytes
- Page count: {source.page_count}
- Total duration: {total_duration_ms} ms

## 2. Processing summary
- Extractor: `{extraction.primary_method}`
- Text extraction pages: {", ".join(map(str, extraction.text_pages)) or "None"}
- OCR pages: {", ".join(map(str, extraction.ocr_pages)) or "None"}
- LLM used: {str(llm_used).lower()}
- External processing used: {str(external_processing).lower()}

## 3. Quality summary
- Character count: {quality.character_count}
- OCR confidence: {confidence}
- Low-quality pages: {", ".join(map(str, quality.low_quality_pages)) or "None"}
- Retry performed: {str(quality.retry_performed).lower()}

## 4. Privacy and security
- Emails redacted: {pii_counts.get("email_count", 0)}
- Phone numbers redacted: {pii_counts.get("phone_count", 0)}
- Secrets redacted: {pii_counts.get("secret_count", 0)}
- Prompt injection detected: {str(injection_detected).lower()}
- Temporary files deleted: {str(temporary_files_deleted).lower()}

## 5. Extracted profile summary
- Skill count: {len(profile.skills)}
- Skills: {skill_names}
- Project count: {len(profile.projects)}
- Technologies: {technology_names}
- Experience level: `{profile.experience_level}`
- Uncertain fields: {len(profile.uncertain_fields)}

## 6. Warnings
{chr(10).join(warning_lines)}

## 7. User confirmation required
{chr(10).join(question_lines)}

## 8. Final status
- {final_status}
"""
        path.write_text(content, encoding="utf-8")
        return report_id, path, content

    def write_failure(
        self,
        *,
        run_id: str,
        file_hash: str,
        size_bytes: int,
        mime_type: str,
        error_code: str,
        temporary_files_deleted: bool,
        total_duration_ms: int,
    ) -> tuple[str, Path, str]:
        timestamp = datetime.now(UTC)
        report_id = f"ocr-report-{timestamp:%Y%m%d-%H%M%S}-{run_id[:8]}"
        path = self.report_dir / f"{report_id}.md"
        safe_error = self.redactor.sanitize_value(error_code, max_length=80)
        content = f"""# OCR Run Report

## 1. Run information
- Run ID: `{run_id}`
- Timestamp: {timestamp.isoformat().replace("+00:00", "Z")}
- File hash: `{file_hash}`
- MIME type: `{self.redactor.sanitize_value(mime_type, max_length=100)}`
- File size: {size_bytes} bytes
- Page count: unavailable
- Total duration: {total_duration_ms} ms

## 2. Processing summary
- Extractor: not started or interrupted
- Text extraction pages: None
- OCR pages: None
- LLM used: false
- External processing used: false

## 3. Quality summary
- Character count: 0
- OCR confidence: N/A
- Low-quality pages: None
- Retry performed: false

## 4. Privacy and security
- Emails redacted: 0
- Phone numbers redacted: 0
- Secrets redacted: 0
- Prompt injection detected: false
- Temporary files deleted: {str(temporary_files_deleted).lower()}

## 5. Extracted profile summary
- Skill count: 0
- Skills: None
- Project count: 0
- Technologies: None
- Experience level: `unknown`
- Uncertain fields: 0

## 6. Warnings
- `{safe_error}` — Processing did not complete.

## 7. User confirmation required
- Use manual profile entry or provide a valid supported document.

## 8. Final status
- failed
"""
        path.write_text(content, encoding="utf-8")
        return report_id, path, content
