from __future__ import annotations

from app.services.ocr.pii_redactor import PiiRedactor


def test_redacts_personal_and_secret_values_but_keeps_technologies():
    text = """Họ và tên: Nguyễn Văn Demo
Email: demo.person@example.com
Điện thoại: 0912 345 678
Địa chỉ: 12 Đường Tổng Hợp, Hà Nội
Ngày sinh: 01/02/2002
CCCD: 012345678901
API_KEY=sk-demoSecretToken123456789
GitHub: https://github.com/synthetic/student
Private URL: https://example.com/cv?token=secret-value
Kỹ năng: Python, FastAPI, SQL, GitHub
"""
    result = PiiRedactor().redact(text)
    assert "demo.person@example.com" not in result.text
    assert "0912 345 678" not in result.text
    assert "Nguyễn Văn Demo" not in result.text
    assert "sk-demoSecretToken123456789" not in result.text
    assert "token=secret-value" not in result.text
    assert "<EMAIL_REDACTED>" in result.text
    assert "<PHONE_REDACTED>" in result.text
    assert "<NAME_REDACTED>" in result.text
    assert result.counts["secret_count"] == 2
    assert "Python" in result.text
    assert "FastAPI" in result.text
    assert "https://github.com/synthetic/student" in result.text
