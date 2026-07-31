"""
Tool 3: calculate
Tính biểu thức toán học an toàn — whitelist math module.
"""
import json
import math
import re

SCHEMA = {
    "type": "function",
    "function": {
        "name": "calculate",
        "description": (
            "Thực hiện phép tính toán học an toàn. "
            "Hỗ trợ: +, -, *, /, **, sqrt, sin, cos, tan, log, ceil, floor, round, abs, pi, e. "
            "Ví dụ: '2**10', 'math.sqrt(144)', '(3+4)*2'."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "Biểu thức toán học Python hợp lệ."
                }
            },
            "required": ["expression"]
        }
    }
}


def run(expression: str, **_) -> str:
    allowed = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}
    allowed.update({"abs": abs, "round": round, "int": int, "float": float})
    try:
        safe = re.sub(r"[^0-9+\-*/().,%\s\w]", "", expression)
        result = eval(safe, {"__builtins__": {}}, allowed)  # noqa: S307
        return json.dumps({"expression": expression, "result": result}, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"expression": expression, "error": str(e)}, ensure_ascii=False)
