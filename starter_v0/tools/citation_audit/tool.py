from __future__ import annotations

from typing import Any
from urllib.parse import urlsplit, urlunsplit

from tools._shared import domain


def _normalized_http_url(value: str) -> str | None:
    try:
        parsed = urlsplit(value.strip())
    except (TypeError, ValueError):
        return None
    if parsed.scheme.lower() not in {"http", "https"} or not parsed.netloc:
        return None
    return urlunsplit((parsed.scheme.lower(), parsed.netloc.lower(), parsed.path.rstrip("/"), parsed.query, ""))


def audit_citations(
    items: list[dict[str, Any]] | None = None,
    require_https: bool = True,
) -> dict[str, Any]:
    source_items = items or []
    audited: list[dict[str, Any]] = []
    seen_urls: set[str] = set()
    duplicate_urls: list[str] = []
    issue_counts: dict[str, int] = {}

    for index, raw_item in enumerate(source_items):
        item = raw_item if isinstance(raw_item, dict) else {}
        title = str(item.get("title") or "").strip()
        url = str(item.get("url") or "").strip()
        normalized_url = _normalized_http_url(url) if url else None
        issues: list[str] = []

        if not title:
            issues.append("missing_title")
        if not url:
            issues.append("missing_url")
        elif normalized_url is None:
            issues.append("invalid_url")
        else:
            if require_https and not normalized_url.startswith("https://"):
                issues.append("insecure_url")
            if normalized_url in seen_urls:
                issues.append("duplicate_url")
                duplicate_urls.append(normalized_url)
            seen_urls.add(normalized_url)

        for issue in issues:
            issue_counts[issue] = issue_counts.get(issue, 0) + 1

        audited.append({
            "index": index,
            "title": title,
            "url": url,
            "source": str(item.get("source") or domain(url) or "").strip(),
            "valid": not issues,
            "issues": issues,
        })

    valid_count = sum(1 for item in audited if item["valid"])
    total = len(audited)
    return {
        "tool": "audit_citations",
        "items": audited,
        "summary": {
            "total": total,
            "valid": valid_count,
            "invalid": total - valid_count,
            "completeness_score": round(valid_count / total, 4) if total else 0.0,
            "issue_counts": issue_counts,
        },
        "duplicate_urls": sorted(set(duplicate_urls)),
        "require_https": require_https,
    }
