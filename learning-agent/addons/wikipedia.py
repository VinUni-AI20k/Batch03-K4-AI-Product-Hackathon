"""Addon mẫu: tra cứu Wikipedia tiếng Việt (không cần API key).

Bật trong dashboard: Config → Addons → wikipedia.
"""
import json
import urllib.parse
import urllib.request

NAME = "wikipedia"
DESCRIPTION = "Tra cứu định nghĩa/tóm tắt từ Wikipedia tiếng Việt — dùng khi khái niệm KHÔNG có trong tài liệu khoá học và học viên vẫn muốn biết (phải nói rõ nguồn là Wikipedia, không phải giáo trình)."

TOOLS = [
    {
        "name": "wiki_lookup",
        "description": "Tra tóm tắt một khái niệm trên Wikipedia tiếng Việt. Chỉ dùng khi tài liệu khoá học không có và học viên vẫn muốn tham khảo ngoài; luôn ghi rõ nguồn Wikipedia.",
        "parameters": {
            "type": "object",
            "properties": {"term": {"type": "string", "description": "Khái niệm cần tra, vd 'Häc máy'"}},
            "required": ["term"],
        },
    },
]


def handle(tool: str, args: dict) -> str:
    term = urllib.parse.quote(args.get("term", "").strip().replace(" ", "_"))
    if not term:
        return "Thiếu từ khoá."
    url = f"https://vi.wikipedia.org/api/rest_v1/page/summary/{term}"
    req = urllib.request.Request(url, headers={"User-Agent": "learning-agent/0.2"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode())
    except Exception as e:
        return f"Không tra được Wikipedia: {e}"
    extract = data.get("extract", "")
    if not extract:
        return "Wikipedia tiếng Việt không có bài về khái niệm này."
    link = data.get("content_urls", {}).get("desktop", {}).get("page", "")
    return f"{extract}\n(Nguồn: Wikipedia — {link})"
