"""
Tool 11: kb_stats
Trả về thống kê tổng quan Knowledge Base — số lượng tài liệu, categories, LLM provider.
"""
import json

SCHEMA = {
    "type": "function",
    "function": {
        "name": "get_kb_stats",
        "description": (
            "Trả về thống kê tổng quan Knowledge Base: số bài FB, VLearn, handbook, "
            "LLM provider đang dùng, danh sách tools. "
            "Dùng khi hỏi về hệ thống, cơ sở dữ liệu, hoặc cấu hình hiện tại."
        ),
        "parameters": {
            "type": "object",
            "properties": {}
        }
    }
}


def run(*, stats_provider=None, **_) -> str:
    """stats_provider là callable() -> dict được inject từ agent."""
    if stats_provider is None:
        return json.dumps({"error": "stats_provider not injected"}, ensure_ascii=False)
    try:
        stats = stats_provider()
        return json.dumps(stats, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)}, ensure_ascii=False)
