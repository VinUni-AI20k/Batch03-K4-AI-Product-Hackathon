"""Knowledge packs — bộ bài học cài từ GitHub (pattern `hermes skills install`
nhưng cho dữ liệu học tập).

An toàn: agent CHỈ cài được các pack khai báo sẵn trong config.yaml
(`knowledge_packs`), không clone URL tuỳ ý từ hội thoại. Clone về
source_mirror/packs/<name>/ rồi đi qua pipeline sync như mọi tài liệu khác.
"""
from __future__ import annotations

import subprocess

from ..index import LessonIndex
from ..vault import Vault
from .sync import sync_once


def _packs(cfg) -> list[dict]:
    return cfg.get("knowledge_packs", default=None) or []


def list_packs(cfg) -> str:
    packs = _packs(cfg)
    if not packs:
        return "Chưa có knowledge pack nào được cấu hình (admin khai báo trong config.yaml, mục knowledge_packs)."
    lines = []
    for p in packs:
        dest = cfg.path("sources", "dir") / "packs" / p["name"]
        status = "✅ đã cài" if dest.exists() else "⬜ chưa cài"
        lines.append(f"- {p['name']}: {p.get('description', '')} ({status})")
    return "\n".join(lines)


def install_pack(cfg, vault: Vault, index: LessonIndex, name: str) -> str:
    pack = next((p for p in _packs(cfg) if p["name"] == name.strip()), None)
    if pack is None:
        return f"Không có pack '{name}'. Danh sách:\n{list_packs(cfg)}"
    dest = cfg.path("sources", "dir") / "packs" / pack["name"]
    if dest.exists():
        r = subprocess.run(
            ["git", "-C", str(dest), "pull", "--ff-only"],
            capture_output=True, text=True,
        )
        action = "cập nhật"
    else:
        dest.parent.mkdir(parents=True, exist_ok=True)
        r = subprocess.run(
            ["git", "clone", "--depth", "1", pack["repo"], str(dest)],
            capture_output=True, text=True,
        )
        action = "cài"
    if r.returncode != 0:
        return f"⚠️ Không {action} được pack '{name}' (git lỗi): {r.stderr.strip()[-300:]}"
    stats = sync_once(cfg, vault, index, verbose=False)
    return (
        f"✅ Đã {action} pack '{name}': {stats['ingested']} bài mới/cập nhật, "
        f"{stats['chunks']} đoạn được index. Bạn hỏi mình về nội dung này được rồi!"
    )
