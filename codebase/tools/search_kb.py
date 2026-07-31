"""
Tool 1: search_knowledge_base
Tìm kiếm hybrid BM25 + Semantic trong KB nội bộ MongoDB.
Agent nhận instance kb_searcher được inject từ AIQAAgent.
"""
import json

SCHEMA = {
    "type": "function",
    "function": {
        "name": "search_knowledge_base",
        "description": (
            "Tìm kiếm thông tin trong Knowledge Base nội bộ, bao gồm: "
            "bài đăng Facebook Group AI Thực Chiến đã được TA xác nhận, "
            "sổ tay chương trình, rubric, guide, spec, deadline, và tài liệu VLearn. "
            "Dùng tool này ĐẦU TIÊN cho mọi câu hỏi liên quan khoá học."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Câu truy vấn ngắn gọn, đúng trọng tâm."
                },
                "top_k": {
                    "type": "integer",
                    "description": "Số tài liệu muốn lấy (mặc định 5).",
                    "default": 5
                }
            },
            "required": ["query"]
        }
    }
}


def run(query: str, top_k: int = 5, *, kb_searcher=None) -> str:
    """kb_searcher là callable(query, top_k) -> List[Dict] được inject từ agent."""
    if kb_searcher is None:
        return json.dumps({"error": "kb_searcher not injected"}, ensure_ascii=False)

    results = kb_searcher(query, top_k=top_k)
    if not results:
        return json.dumps({"found": 0, "results": [], "message": "Không tìm thấy tài liệu liên quan."}, ensure_ascii=False)

    output = [
        {
            "rank": i,
            "title": d.get("title", ""),
            "source_type": d.get("source_type", ""),
            "url": d.get("url", ""),
            "score": round(d.get("score", 0), 3),
            "content": d.get("content", "")[:1500],
        }
        for i, d in enumerate(results, 1)
    ]
    return json.dumps({"found": len(output), "results": output}, ensure_ascii=False, indent=2)
