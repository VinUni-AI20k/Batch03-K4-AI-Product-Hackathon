"""
Tool 5: summarize_doc
Tóm tắt nội dung tài liệu dài từ KB hoặc văn bản bất kỳ.
Trả về các điểm chính dạng bullet, không dùng LLM — dùng extractive summarization đơn giản.
"""
import json
import re
from typing import List


SCHEMA = {
    "type": "function",
    "function": {
        "name": "summarize_doc",
        "description": (
            "Tóm tắt nội dung tài liệu dài thành các điểm chính. "
            "Dùng khi người dùng muốn nắm nhanh nội dung một tài liệu, spec, rubric, hoặc guide."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "text": {
                    "type": "string",
                    "description": "Nội dung văn bản cần tóm tắt."
                },
                "max_points": {
                    "type": "integer",
                    "description": "Số điểm chính tối đa cần trích xuất (mặc định 6).",
                    "default": 6
                }
            },
            "required": ["text"]
        }
    }
}


def _split_sentences(text: str) -> List[str]:
    text = re.sub(r"\s+", " ", text).strip()
    sentences = re.split(r"(?<=[.!?])\s+|(?<=\n)", text)
    return [s.strip() for s in sentences if len(s.strip()) > 20]


def _score_sentence(sentence: str, freq: dict) -> float:
    words = re.findall(r"\w+", sentence.lower())
    if not words:
        return 0.0
    return sum(freq.get(w, 0) for w in words) / len(words)


def run(text: str, max_points: int = 6, **_) -> str:
    if not text or not text.strip():
        return json.dumps({"error": "Văn bản trống."}, ensure_ascii=False)

    sentences = _split_sentences(text)
    if not sentences:
        return json.dumps({"summary": [], "char_count": len(text)}, ensure_ascii=False)

    # Word frequency
    all_words = re.findall(r"\w+", text.lower())
    stopwords = {"là","và","của","cho","có","không","trong","với","các","những","này",
                 "khi","tại","thì","mà","hay","hoặc","ở","từ","làm","về","để","ra","đã","vào"}
    freq = {}
    for w in all_words:
        if w not in stopwords and len(w) > 1:
            freq[w] = freq.get(w, 0) + 1

    scored = sorted(sentences, key=lambda s: _score_sentence(s, freq), reverse=True)
    top = scored[:max_points]
    # Giữ thứ tự gốc
    order = {s: i for i, s in enumerate(sentences)}
    top_ordered = sorted(top, key=lambda s: order.get(s, 999))

    return json.dumps({
        "summary": top_ordered,
        "total_sentences": len(sentences),
        "char_count": len(text),
    }, ensure_ascii=False, indent=2)
