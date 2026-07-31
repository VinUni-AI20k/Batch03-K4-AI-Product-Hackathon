"""
Tool 4: get_current_time
Trả về ngày giờ hiện tại theo múi giờ Việt Nam UTC+7.
"""
import json
from datetime import datetime, timezone, timedelta

SCHEMA = {
    "type": "function",
    "function": {
        "name": "get_current_time",
        "description": "Trả về ngày giờ hiện tại theo múi giờ Việt Nam (UTC+7).",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    }
}


def run(**_) -> str:
    tz_vn = timezone(timedelta(hours=7))
    now = datetime.now(tz_vn)
    days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]
    return json.dumps({
        "datetime": now.strftime("%Y-%m-%d %H:%M:%S"),
        "date": now.strftime("%d/%m/%Y"),
        "time": now.strftime("%H:%M:%S"),
        "weekday": days[now.weekday()],
        "timezone": "Asia/Ho_Chi_Minh (UTC+7)",
    }, ensure_ascii=False)
