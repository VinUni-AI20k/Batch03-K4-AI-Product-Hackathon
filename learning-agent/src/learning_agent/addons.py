"""Addon system — plugin tối giản kiểu Vlearn Agent: mỗi addon là 1 file Python trong
addons/ ở gốc project, khai báo tool cho agent.

Format addon (addons/<ten>.py):
    NAME = "wikipedia"
    DESCRIPTION = "Tra cứu Wikipedia tiếng Việt"
    TOOLS = [{"name": "wiki_lookup", "description": "...", "parameters": {...}}]
    def handle(tool: str, args: dict) -> str: ...

An toàn: addon là code local do admin tự đặt vào máy; mặc định TẮT — phải bật
trong dashboard (Config → Addons) agent mới gọi được; mọi lần gọi có audit.
Bật/tắt có hiệu lực ngay, không cần restart.
"""
from __future__ import annotations

import importlib.util
import json
import traceback
from pathlib import Path


class Addons:
    def __init__(self, cfg):
        self.dir = cfg.root / "addons"
        self.state_path = cfg.root / "data" / "addons.json"
        self.modules: dict[str, object] = {}   # addon name -> module
        self.tool_owner: dict[str, str] = {}   # tool name -> addon name
        self.errors: dict[str, str] = {}
        self._load()

    def _load(self) -> None:
        if not self.dir.exists():
            return
        for py in sorted(self.dir.glob("*.py")):
            try:
                spec = importlib.util.spec_from_file_location(f"addon_{py.stem}", py)
                mod = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(mod)
                name = getattr(mod, "NAME", py.stem)
                if not hasattr(mod, "TOOLS") or not hasattr(mod, "handle"):
                    self.errors[name] = "thiếu TOOLS hoặc handle()"
                    continue
                self.modules[name] = mod
                for t in mod.TOOLS:
                    self.tool_owner[t["name"]] = name
            except Exception:
                self.errors[py.stem] = traceback.format_exc(limit=1)

    # ---------- trạng thái bật/tắt ----------
    def _state(self) -> dict:
        if self.state_path.exists():
            return json.loads(self.state_path.read_text(encoding="utf-8"))
        return {}

    def set_enabled(self, name: str, enabled: bool) -> None:
        state = self._state()
        state[name] = bool(enabled)
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        self.state_path.write_text(json.dumps(state), encoding="utf-8")

    def status(self) -> list[dict]:
        state = self._state()
        out = []
        for name, mod in self.modules.items():
            out.append({
                "name": name,
                "description": getattr(mod, "DESCRIPTION", ""),
                "tools": [t["name"] for t in mod.TOOLS],
                "enabled": state.get(name, False),
            })
        for name, err in self.errors.items():
            out.append({"name": name, "description": f"⚠️ Lỗi nạp: {err}",
                        "tools": [], "enabled": False, "error": True})
        return out

    # ---------- cho agent ----------
    def schemas(self) -> list[dict]:
        out = []
        for mod in self.modules.values():
            for t in mod.TOOLS:
                out.append({"type": "function", "function": t})
        return out

    def owns(self, tool_name: str) -> bool:
        return tool_name in self.tool_owner

    def dispatch(self, tool_name: str, args: dict) -> str:
        addon = self.tool_owner.get(tool_name)
        if addon is None:
            return f"Tool '{tool_name}' không thuộc addon nào."
        if not self._state().get(addon, False):
            return f"⚠️ Addon '{addon}' chưa được admin bật (Config → Addons)."
        try:
            return str(self.modules[addon].handle(tool_name, args))[:3000]
        except Exception as e:
            return f"⚠️ Addon '{addon}' lỗi: {e}"
