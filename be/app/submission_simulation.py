"""Deterministic submission tool for the hackathon's end-to-end demo flow.

This module deliberately does not connect to a government portal.  It records a
minimal, session-scoped receipt only after a matching validation and explicit
user confirmation.
"""

from __future__ import annotations

import secrets
from datetime import UTC, datetime

from app.form_validation import canonical_input_hash


class SubmissionSimulationError(ValueError):
    def __init__(self, reason: str, status_code: int = 409) -> None:
        super().__init__(reason)
        self.reason = reason
        self.status_code = status_code


def is_submission_simulation_request(message: str) -> bool:
    normalized = " ".join(message.casefold().split())
    simulation_marker = "mô phỏng" in normalized or "demo" in normalized
    submission_marker = "nộp hồ sơ" in normalized or "gửi hồ sơ" in normalized
    confirmation_marker = "xác nhận" in normalized or "đồng ý" in normalized or "hãy" in normalized
    return simulation_marker and submission_marker and confirmation_marker


def create_simulated_submission(
    *,
    form_code: str,
    draft: dict,
    validation: dict | None,
    confirmed: bool,
    channel: str,
) -> dict:
    if not confirmed:
        raise SubmissionSimulationError("explicit_confirmation_required", 422)
    if not validation:
        raise SubmissionSimulationError("validation_required")
    if validation.get("form_code") != form_code:
        raise SubmissionSimulationError("validation_form_mismatch")
    if validation.get("input_hash") != canonical_input_hash(draft):
        raise SubmissionSimulationError("draft_changed_since_validation")
    if validation.get("summary", {}).get("blocking_error", 0) > 0:
        raise SubmissionSimulationError("blocking_errors_remaining", 422)
    # `unable_to_validate` contains non-blocking facts the reviewer could not
    # verify.  A demo submission may proceed after explicit confirmation, while
    # `invalid` always remains blocked.  This mirrors the review UI's gate.
    if validation.get("status") not in {"valid", "valid_with_warnings", "unable_to_validate"}:
        raise SubmissionSimulationError("validation_not_ready", 422)

    submitted_at = datetime.now(UTC)
    receipt_code = f"SPDVC-DEMO-{submitted_at:%Y%m%d}-{secrets.token_hex(3).upper()}"
    return {
        "submission_id": secrets.token_urlsafe(12),
        "receipt_code": receipt_code,
        "form_code": form_code,
        "validation_id": validation["validation_id"],
        "input_hash": validation["input_hash"],
        "status": "submitted_simulation",
        "channel": channel,
        "submitted_at": submitted_at.isoformat(),
        "simulation": True,
        "official_submission": False,
        "message_vi": (
            "Đã nộp thành công trong môi trường mô phỏng. Đây không phải biên nhận của Cổng Dịch vụ công "
            "và hồ sơ chưa được gửi tới cơ quan nhà nước."
        ),
    }
