"""An ninh: audit log + rate limit theo user.

- Audit: mọi sự kiện nhạy cảm (user bị từ chối, ingest file, cài pack, tạo lịch)
  ghi JSON-lines vào data/audit.log — soi lại được ai làm gì, lúc nào.
- RateLimiter: chặn spam/lạm dụng chi phí LLM theo từng user (token bucket đơn giản).
"""
from __future__ import annotations

import json
import time
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path


class Audit:
    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def log(self, event: str, **fields) -> None:
        entry = {
            "ts": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "event": event,
            **fields,
        }
        with open(self.path, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")


class RateLimiter:
    """Tối đa N sự kiện / 60 giây / user."""

    def __init__(self, per_minute: int = 10):
        self.per_minute = per_minute
        self._events: dict[str, deque] = defaultdict(deque)

    def allow(self, user_id: str) -> bool:
        now = time.monotonic()
        q = self._events[user_id]
        while q and now - q[0] > 60:
            q.popleft()
        if len(q) >= self.per_minute:
            return False
        q.append(now)
        return True
