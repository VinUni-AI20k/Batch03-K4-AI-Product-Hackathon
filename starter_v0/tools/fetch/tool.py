from __future__ import annotations

import os
import ipaddress
from typing import Any
from urllib.parse import urlparse

import requests

from tools._shared import TIMEOUT, domain


MAX_URL_LENGTH = 2048


def _guardrail_result(url: str, *, status: str, error: str, message: str) -> dict[str, Any]:
    """Return a machine-readable terminal skip that the chat loop cannot route around."""
    return {
        "tool": "read_url",
        "url": url,
        "status": status,
        "skipped": True,
        "fallback_allowed": False,
        "error": error,
        "message": message,
        "items": [],
    }


def _validate_public_url(url: str) -> tuple[bool, str, str]:
    candidate = (url or "").strip()
    if not candidate or len(candidate) > MAX_URL_LENGTH:
        return False, "invalid_url", "URL is empty or exceeds the supported length."

    try:
        parsed = urlparse(candidate)
        hostname = (parsed.hostname or "").rstrip(".").lower()
    except ValueError:
        return False, "invalid_url", "URL could not be parsed."

    if parsed.scheme not in {"http", "https"} or not hostname or parsed.username or parsed.password:
        return False, "invalid_url", "Only public HTTP(S) URLs without embedded credentials are accepted."
    if hostname == "localhost" or hostname.endswith(".localhost") or hostname.endswith(".local"):
        return False, "unsafe_url", "Local and private network URLs are blocked."

    try:
        address = ipaddress.ip_address(hostname)
    except ValueError:
        address = None
    if address is not None and not address.is_global:
        return False, "unsafe_url", "Local, private, reserved, and non-global IP URLs are blocked."

    return True, "", ""


def read_url(url: str = "") -> dict[str, Any]:
    url = (url or "").strip()
    valid, error_code, message = _validate_public_url(url)
    if not valid:
        return _guardrail_result(url, status="blocked", error=error_code, message=message)

    try:
        key = os.getenv("FIRECRAWL_API_KEY")
        if not key:
            raise RuntimeError("Missing FIRECRAWL_API_KEY env var")
        response = requests.post(
            "https://api.firecrawl.dev/v1/scrape",
            json={"url": url, "formats": ["markdown"]},
            headers={"Authorization": f"Bearer {key}"},
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        data = response.json().get("data", {})
        meta = data.get("metadata", {}) or {}
        return {"tool": "read_url", "url": url, "items": [{
            "title": meta.get("title") or url,
            "url": meta.get("sourceURL") or url,
            "source": domain(url),
            "summary": (data.get("markdown") or "")[:4000],
        }]}
    except Exception as exc:
        return _guardrail_result(
            url,
            status="skipped",
            error=type(exc).__name__,
            message=f"The supplied article URL could not be read and was skipped: {exc}",
        )
