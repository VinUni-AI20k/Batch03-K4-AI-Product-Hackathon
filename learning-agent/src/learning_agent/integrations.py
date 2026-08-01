"""Ecosystem & Integrations — quản lý tích hợp của Vlearn Agent:

- Chat channels (Telegram/Discord): trạng thái từ env token.
- Skills registries (GitHub): duyệt + cài skill chuẩn agentskills.io vào skills/.
- CLI hạ tầng (gog CLI, Microsoft 365 CLI...): phát hiện đã cài chưa, admin BẬT
  qua dashboard thì agent mới được dùng (tool use_cli, whitelist binary, có audit).
- Trạng thái bật/tắt lưu data/integrations.json — toggle không cần restart.
"""
from __future__ import annotations

import json
import shlex
import shutil
import subprocess
from pathlib import Path

import frontmatter

# Token hành động bị cấm khi agent gọi use_cli (chỉ cho đọc/tra cứu, chặn ghi/gửi/xoá).
CLI_DENY = {"send", "rm", "remove", "delete", "del", "trash", "share",
            "revoke", "forward", "destroy", "purge", "empty", "upload"}

CATALOG = [
    {"key": "telegram", "name": "Telegram", "category": "Chat channels",
     "type": "channel", "env": "TELEGRAM_BOT_TOKEN", "url": "https://core.telegram.org/bots"},
    {"key": "discord", "name": "Discord", "category": "Chat channels",
     "type": "channel", "env": "DISCORD_BOT_TOKEN", "url": "https://discord.com/developers/applications"},

    {"key": "vlearn-skills", "name": "Vlearn Agent Skills", "category": "Ecosystem — Skills registries",
     "type": "registry", "repo": "https://github.com/aiecosvietnam/vlearn-skills",
     "url": "https://github.com/aiecosvietnam/vlearn-skills"},
    {"key": "community-skills", "name": "Kho skill cộng đồng (agentskills.io)", "category": "Ecosystem — Skills registries",
     "type": "registry", "repo": "https://github.com/anthropics/skills",
     "url": "https://agentskills.io"},

    {"key": "gog", "name": "gog CLI — Google Workspace", "category": "Agent Infrastructure & CLIs",
     "type": "cli", "binary": "gog", "install": "curl -fsSL https://gogcli.sh/install.sh | bash",
     "url": "https://gogcli.sh", "desc": "Gmail/Drive/Calendar/Classroom từ terminal — nguồn tài liệu học tập"},
    {"key": "m365", "name": "Microsoft 365 CLI", "category": "Agent Infrastructure & CLIs",
     "type": "cli", "binary": "m365", "install": "npm i -g @pnp/cli-microsoft365",
     "url": "https://pnp.github.io/cli-microsoft365/", "desc": "Teams/OneDrive/OneNote/SharePoint — lớp học Microsoft"},
    {"key": "maton", "name": "Maton — SaaS integrations", "category": "Agent Infrastructure & CLIs",
     "type": "api", "env": "MATON_API_KEY", "url": "https://www.maton.ai",
     "desc": "Kết nối hàng trăm SaaS app qua một API/MCP"},
]


class Integrations:
    def __init__(self, cfg):
        self.cfg = cfg
        self.state_path = cfg.root / "data" / "integrations.json"
        self.repos_dir = cfg.root / "data" / "skill-repos"
        self.skills_dir = cfg.path("agent", "skills_dir")

    # ---------- trạng thái ----------
    def _state(self) -> dict:
        if self.state_path.exists():
            return json.loads(self.state_path.read_text(encoding="utf-8"))
        return {}

    def set_enabled(self, key: str, enabled: bool) -> None:
        state = self._state()
        state[key] = bool(enabled)
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        self.state_path.write_text(json.dumps(state), encoding="utf-8")

    def status(self) -> list[dict]:
        import os
        state = self._state()
        out = []
        for item in CATALOG:
            detected = False
            detail = ""
            if item["type"] == "channel" or item["type"] == "api":
                detected = bool(os.environ.get(item.get("env", ""), ""))
                detail = f"env {item.get('env')}"
            elif item["type"] == "cli":
                path = shutil.which(item["binary"])
                detected = path is not None
                detail = path or f"cài: {item.get('install', '')}"
            elif item["type"] == "registry":
                detected = (self.repos_dir / item["key"]).exists()
                detail = item["repo"]
            out.append({**item, "detected": detected,
                        "enabled": state.get(item["key"], item["type"] == "channel"),
                        "detail": detail})
        return out

    # ---------- skills registry ----------
    def _sync_registry(self, key: str) -> Path | str:
        item = next((i for i in CATALOG if i["key"] == key and i["type"] == "registry"), None)
        if item is None:
            return f"Không có registry '{key}'."
        dest = self.repos_dir / key
        if dest.exists():
            subprocess.run(["git", "-C", str(dest), "pull", "--ff-only", "-q"],
                           capture_output=True, timeout=120)
        else:
            dest.parent.mkdir(parents=True, exist_ok=True)
            r = subprocess.run(["git", "clone", "--depth", "1", item["repo"], str(dest)],
                               capture_output=True, text=True, timeout=300)
            if r.returncode != 0:
                return f"⚠️ Clone lỗi: {r.stderr.strip()[-200:]}"
        return dest

    def registry_skills(self, key: str) -> list[dict] | str:
        dest = self._sync_registry(key)
        if isinstance(dest, str):
            return dest
        installed = {p.parent.name for p in self.skills_dir.glob("*/SKILL.md")}
        out = []
        for p in sorted(dest.rglob("SKILL.md")):
            try:
                post = frontmatter.load(p)
                name = str(post.metadata.get("name", p.parent.name))
                out.append({
                    "name": name,
                    "description": " ".join(str(post.metadata.get("description", "")).split())[:220],
                    "installed": name in installed,
                })
            except Exception:
                continue
        return out

    def install_skill(self, key: str, skill_name: str) -> str:
        dest = self._sync_registry(key)
        if isinstance(dest, str):
            return dest
        for p in dest.rglob("SKILL.md"):
            try:
                post = frontmatter.load(p)
            except Exception:
                continue
            if str(post.metadata.get("name", p.parent.name)) == skill_name:
                target = self.skills_dir / skill_name
                if target.exists():
                    shutil.rmtree(target)
                shutil.copytree(p.parent, target, ignore=shutil.ignore_patterns(".git"))
                return f"✅ Đã cài skill '{skill_name}' từ {key} — agent dùng được ngay lượt chat sau."
        return f"Không tìm thấy skill '{skill_name}' trong {key}."

    # ---------- CLI cho agent ----------
    def run_cli(self, tool: str, args: str) -> str:
        item = next((i for i in CATALOG if i["key"] == tool and i["type"] == "cli"), None)
        if item is None:
            return f"'{tool}' không phải CLI tích hợp. Các CLI: " + ", ".join(
                i["key"] for i in CATALOG if i["type"] == "cli")
        if not self._state().get(tool, False):
            return f"⚠️ CLI '{tool}' chưa được admin bật trong dashboard (Config → Integrations)."
        if shutil.which(item["binary"]) is None:
            return f"⚠️ '{item['binary']}' chưa cài trên máy. Cài: {item.get('install')}"
        try:
            parts = shlex.split(args)
        except ValueError as e:
            return f"⚠️ Args không hợp lệ: {e}"
        # Chặn hành động ghi/gửi/xoá: use_cli chỉ để đọc/tra cứu. Ngăn prompt-injection
        # (tài liệu/kết quả web) lái model đi gửi mail hay xoá dữ liệu trên tài khoản đã kết nối.
        bad = next((t for t in parts if t.lower().lstrip("-") in CLI_DENY), None)
        if bad:
            return (f"⚠️ Từ chối: '{bad}' là hành động nhạy cảm. use_cli chỉ cho phép thao tác "
                    "đọc/tra cứu (list, get, ls, download...), không gửi/xoá/chia sẻ. "
                    "Nếu thật sự cần, admin chạy trực tiếp trên terminal.")
        argv = [item["binary"], *parts]
        try:
            r = subprocess.run(argv, capture_output=True, text=True, timeout=30)
        except subprocess.TimeoutExpired:
            return "⚠️ CLI chạy quá 30 giây — đã dừng."
        out = (r.stdout or "") + (("\n[stderr] " + r.stderr) if r.stderr.strip() else "")
        return out.strip()[:3000] or "(không có output)"
