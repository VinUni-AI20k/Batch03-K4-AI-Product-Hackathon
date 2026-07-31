"""
Tool 6: translate
Dịch văn bản giữa tiếng Việt và tiếng Anh (và ngược lại).
Dùng deep-translator nếu có, fallback sang gợi ý thủ công.
"""
import json
import re

SCHEMA = {
    "type": "function",
    "function": {
        "name": "translate",
        "description": (
            "Dịch văn bản giữa tiếng Việt ↔ tiếng Anh. "
            "Hữu ích khi người dùng gặp thuật ngữ kỹ thuật hoặc muốn hiểu nội dung tiếng Anh."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "text": {
                    "type": "string",
                    "description": "Văn bản cần dịch."
                },
                "target_lang": {
                    "type": "string",
                    "description": "Ngôn ngữ đích: 'en' (tiếng Anh) hoặc 'vi' (tiếng Việt). Mặc định 'en'.",
                    "default": "en"
                }
            },
            "required": ["text"]
        }
    }
}


def _detect_lang(text: str) -> str:
    """Phát hiện đơn giản: nếu có nhiều ký tự Latin thường → English."""
    viet_chars = len(re.findall(r"[àáâãèéêìíòóôõùúýăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]", text, re.IGNORECASE))
    return "vi" if viet_chars > 2 else "en"


def run(text: str, target_lang: str = "en", **_) -> str:
    if not text.strip():
        return json.dumps({"error": "Văn bản trống."}, ensure_ascii=False)

    try:
        from deep_translator import GoogleTranslator
        translated = GoogleTranslator(source="auto", target=target_lang).translate(text)
        return json.dumps({
            "original": text[:200],
            "translated": translated,
            "target_lang": target_lang,
            "engine": "GoogleTranslator",
        }, ensure_ascii=False, indent=2)
    except ImportError:
        pass
    except Exception as e:
        return json.dumps({"error": f"Lỗi dịch: {str(e)}", "original": text[:200]}, ensure_ascii=False)

    detected = _detect_lang(text)
    note = (
        f"deep-translator chưa được cài (pip install deep-translator). "
        f"Văn bản phát hiện là '{detected}', cần dịch sang '{target_lang}'."
    )
    return json.dumps({"note": note, "original": text[:200]}, ensure_ascii=False)
