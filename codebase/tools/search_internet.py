"""
Tool 2: search_internet
Tìm kiếm DuckDuckGo cho thông tin mới nhất bên ngoài KB.
"""
import json
import warnings

SCHEMA = {
    "type": "function",
    "function": {
        "name": "search_internet",
        "description": (
            "Tìm kiếm thông tin trên Internet qua DuckDuckGo. "
            "Dùng khi câu hỏi cần thông tin cập nhật, lỗi thư viện mới, "
            "tin tức AI, hoặc KB nội bộ không đủ."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Truy vấn tìm kiếm bằng tiếng Anh hoặc tiếng Việt."
                },
                "max_results": {
                    "type": "integer",
                    "description": "Số kết quả tối đa (mặc định 4).",
                    "default": 4
                }
            },
            "required": ["query"]
        }
    }
}


def run(query: str, max_results: int = 4, **_) -> str:
    try:
        try:
            from ddgs import DDGS
        except ImportError:
            from duckduckgo_search import DDGS

        results = []
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            with DDGS() as ddgs:
                for r in ddgs.text(query, max_results=max_results):
                    results.append({
                        "title": r.get("title", ""),
                        "url": r.get("href", ""),
                        "snippet": r.get("body", "")[:400],
                    })
        if not results:
            return json.dumps({"found": 0, "results": [], "message": "Không tìm thấy kết quả."}, ensure_ascii=False)
        return json.dumps({"found": len(results), "results": results}, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"error": f"Lỗi tìm kiếm: {str(e)}"}, ensure_ascii=False)
