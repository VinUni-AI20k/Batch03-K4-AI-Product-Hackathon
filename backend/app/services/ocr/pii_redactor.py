from __future__ import annotations

import re
from dataclasses import dataclass, field


@dataclass(slots=True)
class RedactionResult:
    text: str
    counts: dict[str, int] = field(default_factory=dict)


class PiiRedactor:
    _patterns: tuple[tuple[str, str, re.Pattern[str]], ...] = (
        (
            "secret_count",
            "<SECRET_REDACTED>",
            re.compile(
                r"(?ix)"
                r"(?:\bAKIA[A-Z0-9]{16}\b"
                r"|\bAIza[0-9A-Za-z_-]{20,}\b"
                r"|\bgh[pousr]_[0-9A-Za-z]{20,}\b"
                r"|\bsk-[0-9A-Za-z_-]{16,}\b"
                r"|\bBearer\s+[0-9A-Za-z._~+/=-]{12,}\b"
                r"|(?:api[_ -]?key|access[_ -]?token|secret|password)\s*[:=]\s*[^\s,;]{8,})"
            ),
        ),
        (
            "email_count",
            "<EMAIL_REDACTED>",
            re.compile(r"(?i)(?<![\w.+-])[\w.+-]+@[\w-]+(?:\.[\w-]+)+(?![\w.-])"),
        ),
        (
            "date_of_birth_count",
            "<DATE_OF_BIRTH_REDACTED>",
            re.compile(
                r"(?im)\b(?:ngày\s*sinh|sinh\s*ngày|date\s*of\s*birth|dob)\s*[:\-]?\s*"
                r"(?:\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|\d{4}[./-]\d{1,2}[./-]\d{1,2})"
            ),
        ),
        (
            "id_number_count",
            "<ID_NUMBER_REDACTED>",
            re.compile(
                r"(?im)\b(?:cccd|cmnd|căn\s*cước|passport|hộ\s*chiếu)\s*(?:số|no\.?)?\s*[:\-]?\s*"
                r"[A-Z0-9]{8,16}\b"
            ),
        ),
        (
            "phone_count",
            "<PHONE_REDACTED>",
            re.compile(
                r"(?x)(?<!\d)(?:\+?84|0)(?:[\s().-]*\d){9,10}(?!\d)"
            ),
        ),
        (
            "address_count",
            "<ADDRESS_REDACTED>",
            re.compile(r"(?im)^(?:địa\s*chỉ|address|nơi\s*ở)\s*[:\-]\s*.+$"),
        ),
        (
            "name_count",
            "<NAME_REDACTED>",
            re.compile(r"(?im)^(?:họ\s*(?:và)?\s*tên|full\s*name|name)\s*[:\-]\s*.+$"),
        ),
    )
    _sensitive_url = re.compile(r"(?i)\bhttps?://[^\s<>\"]+")
    _sensitive_query_key = re.compile(
        r"(?i)(?:token|key|secret|password|signature|sig|auth|credential)="
    )

    def redact(self, text: str) -> RedactionResult:
        redacted = text or ""
        counts = {
            "email_count": 0,
            "phone_count": 0,
            "address_count": 0,
            "date_of_birth_count": 0,
            "id_number_count": 0,
            "secret_count": 0,
            "name_count": 0,
        }

        def redact_url(match: re.Match[str]) -> str:
            url = match.group(0)
            if "?" in url and self._sensitive_query_key.search(url.split("?", 1)[1]):
                counts["secret_count"] += 1
                return "<SECRET_REDACTED>"
            return url.rstrip(".,);")

        redacted = self._sensitive_url.sub(redact_url, redacted)
        for count_key, replacement, pattern in self._patterns:
            redacted, count = pattern.subn(replacement, redacted)
            counts[count_key] += count
        return RedactionResult(text=redacted, counts=counts)

    def sanitize_value(self, value: str, *, max_length: int = 300) -> str:
        sanitized = self.redact(str(value)).text
        sanitized = sanitized.replace("\r", " ").replace("\n", " ").replace("|", "/")
        return " ".join(sanitized.split())[:max_length]


INJECTION_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("IGNORE_INSTRUCTIONS", re.compile(r"(?i)\bignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions?\b")),
    ("SYSTEM_PROMPT_REQUEST", re.compile(r"(?i)\b(?:reveal|show|print|expose)\b.{0,40}\bsystem\s+prompt\b")),
    ("FORCED_RECOMMENDATION", re.compile(r"(?i)\b(?:always|must|hãy|luôn)\b.{0,40}\b(?:recommend|chọn|đề\s*tài)\b")),
    ("EXTERNAL_ACTION", re.compile(r"(?i)\b(?:send|upload|post|gửi|đăng)\b.{0,40}\b(?:cv|resume|file|hồ\s*sơ)\b")),
    ("ROLE_OVERRIDE", re.compile(r"(?i)\b(?:you\s+are\s+now|act\s+as|developer\s+message|system\s+message)\b")),
)


def detect_prompt_injection(text: str) -> list[str]:
    return [code for code, pattern in INJECTION_PATTERNS if pattern.search(text or "")]
