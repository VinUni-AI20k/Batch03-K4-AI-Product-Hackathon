from __future__ import annotations

import json
import threading
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


ALLOWED_EVENTS = {
    "upload_received",
    "upload_validated",
    "upload_rejected",
    "extraction_started",
    "page_extracted",
    "ocr_started",
    "ocr_completed",
    "quality_check_completed",
    "pii_redaction_completed",
    "prompt_injection_detected",
    "profile_parsing_started",
    "profile_parsing_completed",
    "profile_validation_failed",
    "profile_validation_completed",
    "report_written",
    "temporary_files_deleted",
    "run_completed",
    "run_failed",
}

ALLOWED_METADATA = {
    "file_hash",
    "mime_type",
    "size_bytes",
    "page_count",
    "page_number",
    "extraction_method",
    "character_count",
    "ocr_confidence",
    "email_count",
    "phone_count",
    "address_count",
    "date_of_birth_count",
    "id_number_count",
    "secret_count",
    "name_count",
    "skill_count",
    "project_count",
    "warning_code",
    "error_type",
    "retry_performed",
    "low_quality_page_count",
    "external_processing",
}


class EventLogger:
    _lock = threading.Lock()

    def __init__(self, path: Path) -> None:
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def log(
        self,
        run_id: str,
        event: str,
        status: str,
        *,
        duration_ms: int = 0,
        metadata: dict[str, Any] | None = None,
    ) -> None:
        safe_event = event if event in ALLOWED_EVENTS else "run_failed"
        safe_status = status if status in {"success", "warning", "failed", "started"} else "failed"
        safe_metadata = self._sanitize_metadata(metadata or {})
        record = {
            "timestamp": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
            "run_id": run_id,
            "event": safe_event,
            "status": safe_status,
            "duration_ms": max(0, int(duration_ms)),
            "metadata": safe_metadata,
        }
        serialized = json.dumps(record, ensure_ascii=True, separators=(",", ":"))
        with self._lock:
            with self.path.open("a", encoding="utf-8") as handle:
                handle.write(serialized + "\n")

    @staticmethod
    def _sanitize_metadata(metadata: dict[str, Any]) -> dict[str, Any]:
        result: dict[str, Any] = {}
        for key, value in metadata.items():
            if key not in ALLOWED_METADATA or value is None:
                continue
            if isinstance(value, bool):
                result[key] = value
            elif isinstance(value, int):
                result[key] = value
            elif isinstance(value, float):
                result[key] = round(value, 2)
            elif isinstance(value, str):
                cleaned = "".join(ch for ch in value if ch.isalnum() or ch in "._+-/")
                result[key] = cleaned[:100]
        return result
