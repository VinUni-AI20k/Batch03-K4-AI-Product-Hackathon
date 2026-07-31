"""
Tool 10: format_code
Format và làm sạch code Python: kiểm tra syntax, đề xuất sửa lỗi cơ bản.
"""
import json
import ast
import re

SCHEMA = {
    "type": "function",
    "function": {
        "name": "format_code",
        "description": (
            "Kiểm tra syntax Python và đề xuất sửa lỗi cơ bản. "
            "Dùng khi người dùng paste code bị lỗi và muốn biết lỗi ở đâu."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string",
                    "description": "Đoạn code Python cần kiểm tra."
                }
            },
            "required": ["code"]
        }
    }
}

COMMON_FIXES = [
    (r"\bprint\s+(['\"])", r"print(\1",       "print statement → print() function (Python 3)"),
    (r"==\s*None\b",        "is None",         "Dùng 'is None' thay vì '== None'"),
    (r"!=\s*None\b",        "is not None",     "Dùng 'is not None' thay vì '!= None'"),
    (r"\bexcept\s*:",       "except Exception:", "Tránh bare except, dùng except Exception:"),
]


def run(code: str, **_) -> str:
    if not code.strip():
        return json.dumps({"error": "Code trống."}, ensure_ascii=False)

    result = {"syntax_ok": False, "errors": [], "warnings": [], "suggestions": [], "line_count": len(code.splitlines())}

    # Syntax check
    try:
        ast.parse(code)
        result["syntax_ok"] = True
    except SyntaxError as e:
        result["errors"].append({
            "type": "SyntaxError",
            "line": e.lineno,
            "message": str(e.msg),
            "text": e.text.strip() if e.text else "",
        })

    # Common pattern suggestions
    for pattern, fix, msg in COMMON_FIXES:
        if re.search(pattern, code):
            result["suggestions"].append({"pattern": pattern, "fix": fix, "message": msg})

    # Basic warnings
    if "import *" in code:
        result["warnings"].append("Tránh 'import *' — import cụ thể tên cần dùng.")
    if len(code.splitlines()) > 50 and "def " not in code:
        result["warnings"].append("Code dài nhưng không có hàm — cân nhắc tách thành functions.")
    if "password" in code.lower() or "secret" in code.lower() or "api_key" in code.lower():
        result["warnings"].append("Phát hiện thông tin nhạy cảm — không hardcode credentials trong code.")

    return json.dumps(result, ensure_ascii=False, indent=2)
