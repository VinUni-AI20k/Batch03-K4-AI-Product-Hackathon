"""Maton MCP client — nối agent với hàng trăm SaaS app qua Maton (mcp.maton.ai).

Maton là MCP server; agent mình dùng tool-calling nên đây là MCP client tối giản
(HTTP + SSE). Expose 1 tool 'maton' proxy tới các tool của Maton toolkit:
whoami · list_connections · search_apps · search_actions · get_action · run_action · api...

Luồng agent thường: search_apps -> (create_connection nếu chưa có) -> search_actions
-> get_action (xem schema) -> run_action. Auth bằng MATON_API_KEY.
"""
from __future__ import annotations

import json
import threading
import urllib.request

URL = "https://mcp.maton.ai/"


class MatonMCP:
    def __init__(self, api_key: str):
        self.key = api_key
        self._sid: str | None = None
        self._init = False
        self._lock = threading.Lock()

    def _rpc(self, method: str, params: dict, notify: bool = False):
        msg = {"jsonrpc": "2.0", "method": method, "params": params}
        if not notify:
            msg["id"] = 1
        h = {"Authorization": f"Bearer {self.key}", "Content-Type": "application/json",
             "Accept": "application/json, text/event-stream"}
        if self._sid:
            h["Mcp-Session-Id"] = self._sid
        req = urllib.request.Request(URL, data=json.dumps(msg).encode(), headers=h)
        r = urllib.request.urlopen(req, timeout=30)
        if r.headers.get("Mcp-Session-Id"):
            self._sid = r.headers["Mcp-Session-Id"]
        raw = r.read().decode()
        if notify:
            return None
        for line in raw.splitlines():          # định dạng SSE: 'data: {...}'
            if line.startswith("data:"):
                return json.loads(line[5:].strip())
        return json.loads(raw) if raw.strip() else None

    def _ensure_init(self):
        if self._init:
            return
        self._rpc("initialize", {"protocolVersion": "2024-11-05", "capabilities": {},
                                 "clientInfo": {"name": "vlearn-agent", "version": "0.2"}})
        try:
            self._rpc("notifications/initialized", {}, notify=True)
        except Exception:
            pass
        self._init = True

    def list_tools(self) -> list[str]:
        with self._lock:
            self._ensure_init()
            res = self._rpc("tools/list", {})
        return [t["name"] for t in (res or {}).get("result", {}).get("tools", [])]

    def _connection_id(self, app: str) -> str | None:
        """Lấy connection_id ACTIVE của một app (vd 'google-calendar')."""
        out = self.call("list_connections", {})
        try:
            for c in json.loads(out).get("connections", []):
                if c.get("app") == app and c.get("status") == "ACTIVE":
                    return c.get("connection_id")
        except Exception:
            pass
        return None

    def create_calendar_event(self, summary: str, start: str, end: str, with_meet: bool = True) -> str:
        """Gói sẵn cả flow tạo sự kiện Google Calendar (+Meet) — 1 lệnh, không cần agent chain nhiều bước."""
        conn = self._connection_id("google-calendar")
        if not conn:
            return "⚠️ Chưa kết nối Google Calendar trong Maton (hoặc connection không ACTIVE)."
        args = {"summary": summary, "start": start, "end": end}
        if with_meet:
            args["meet"] = True
        out = self.call("run_action", {"id": "google-calendar.event.create", "connection": conn, "args": args})
        import re
        meet = re.findall(r"https://meet\.google\.com/[a-z-]+", out)
        ev = re.findall(r'https://www\.google\.com/calendar/event\?[^"\\ ]+', out)
        if not (meet or ev):
            return f"Kết quả tạo lịch: {out[:400]}"
        lines = [f"✅ Đã tạo sự kiện Google Calendar: **{summary}** ({start} → {end})"]
        if meet:
            lines.append(f"🎥 Link Google Meet: {meet[0]}")
        if ev:
            lines.append(f"📅 Xem sự kiện: {ev[0]}")
        return "\n".join(lines)

    def call(self, tool: str, args: dict) -> str:
        with self._lock:
            try:
                self._ensure_init()
                res = self._rpc("tools/call", {"name": tool, "arguments": args or {}})
            except Exception as e:
                return f"⚠️ Maton lỗi: {e}"
        result = (res or {}).get("result", {})
        if result.get("isError"):
            return "⚠️ Maton báo lỗi: " + " ".join(
                c.get("text", "") for c in result.get("content", []))[:800]
        texts = [c.get("text", "") for c in result.get("content", []) if c.get("type") == "text"]
        out = "\n".join(texts).strip()
        return out[:3500] or json.dumps(result, ensure_ascii=False)[:3500]
