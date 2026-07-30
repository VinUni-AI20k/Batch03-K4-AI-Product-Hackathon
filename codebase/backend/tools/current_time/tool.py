from __future__ import annotations

from datetime import datetime, timedelta, timezone as dt_timezone
from typing import Any

import requests

from tools._shared import TIMEOUT, err

_TZ_ALIASES = {
    "vn": "Asia/Ho_Chi_Minh",
    "vietnam": "Asia/Ho_Chi_Minh",
    "viet nam": "Asia/Ho_Chi_Minh",
    "việt nam": "Asia/Ho_Chi_Minh",
    "hcm": "Asia/Ho_Chi_Minh",
    "saigon": "Asia/Ho_Chi_Minh",
    "gmt+7": "Asia/Ho_Chi_Minh",
    "utc+7": "Asia/Ho_Chi_Minh",
}


def get_current_time(timezone: str = "Asia/Ho_Chi_Minh") -> dict[str, Any]:
    tz_query = _TZ_ALIASES.get(timezone.strip().lower(), timezone)
    try:
        response = requests.get(
            f"https://timeapi.io/api/time/current/zone?timeZone={tz_query}",
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        data = response.json()
        return {
            "tool": "current_time",
            "timezone": data.get("timeZone", tz_query),
            "datetime": data.get("dateTime"),
            "date": data.get("date"),
            "time": data.get("time"),
            "day_of_week": data.get("dayOfWeek"),
        }
    except Exception as exc:
        try:
            try:
                from zoneinfo import ZoneInfo

                now = datetime.now(ZoneInfo(tz_query))
            except Exception:
                if tz_query == "Asia/Ho_Chi_Minh":
                    now = datetime.now(dt_timezone(timedelta(hours=7)))
                else:
                    now = datetime.now()
            return {
                "tool": "current_time",
                "timezone": tz_query,
                "datetime": now.isoformat(),
                "date": now.strftime("%Y-%m-%d"),
                "time": now.strftime("%H:%M"),
                "day_of_week": now.strftime("%A"),
                "note": f"Fallback to system time due to API/network error: {type(exc).__name__}",
            }
        except Exception:
            return err("current_time", exc)
