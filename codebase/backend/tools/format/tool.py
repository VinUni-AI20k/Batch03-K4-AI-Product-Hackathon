from __future__ import annotations

from typing import Any

_PRIORITY_ICON = {"critical": "🔴", "high": "🟠", "medium": "🟡", "low": "⚪"}


def _line(item: dict[str, Any]) -> str:
    title = (item.get("title") or "").strip()
    due_date = item.get("due_date") or ""
    due_time = item.get("due_time") or ""
    when = f"{due_date} {due_time}".strip() or "chưa rõ thời gian"
    icon = _PRIORITY_ICON.get((item.get("priority") or "").lower(), "")
    source = item.get("source_platform") or item.get("source") or ""
    link = item.get("link") or item.get("url") or ""
    tail = f" — [nguồn]({link})" if link else (f" — {source}" if source else "")
    return f"- {icon} **{title}** ({when}){tail}".replace("  ", " ")


def render_digest(
    items: list[dict[str, Any]] | None = None,
    template: str = "timeline",
    headline: str = "",
) -> dict[str, Any]:
    items = items or []
    if template == "brief":
        markdown = (f"**{headline}**\n\n" if headline else "") + "\n".join(_line(item) for item in items[:5])
    else:
        groups: dict[str, list[dict[str, Any]]] = {}
        for item in items:
            groups.setdefault(item.get("category", "Khác"), []).append(item)
        parts = ([f"# {headline}", ""] if headline else [])
        for category, group_items in groups.items():
            parts += [f"## {category}", *[_line(item) for item in group_items], ""]
        markdown = "\n".join(parts)
    return {"tool": "format", "template": template, "markdown": markdown, "item_count": len(items)}
