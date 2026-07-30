"""Knowledge packs — bộ bài học cài từ GitHub (cài như skill
nhưng cho dữ liệu học tập).

An toàn: agent CHỈ cài được các pack khai báo sẵn trong config.yaml
(`knowledge_packs`), không clone URL tuỳ ý từ hội thoại. Clone về
source_mirror/packs/<name>/ rồi đi qua pipeline sync như mọi tài liệu khác.
"""
from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

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
    repo_dir = cfg.root / "data" / "pack-repos" / pack["name"]
    if repo_dir.exists():
        r = subprocess.run(
            ["git", "-C", str(repo_dir), "pull", "--ff-only"],
            capture_output=True, text=True,
        )
        action = "cập nhật"
    else:
        repo_dir.parent.mkdir(parents=True, exist_ok=True)
        r = subprocess.run(
            ["git", "clone", "--depth", "1", pack["repo"], str(repo_dir)],
            capture_output=True, text=True,
        )
        action = "cài"
    if r.returncode != 0:
        return f"⚠️ Không {action} được pack '{name}' (git lỗi): {r.stderr.strip()[-300:]}"

    # chỉ copy các thư mục/file bài học được khai báo (subdirs) vào nguồn ingest —
    # tránh nuốt nhầm code/tài liệu ngoài lề trong repo
    dest = cfg.path("sources", "dir") / "packs" / pack["name"]
    if dest.exists():
        shutil.rmtree(dest)  # phản ánh cả file đã bị gỡ khỏi pack
    subdirs = pack.get("subdirs") or ["."]
    for sub in subdirs:
        src = (repo_dir / sub).resolve()
        if not src.exists() or repo_dir.resolve() not in src.parents and src != repo_dir.resolve():
            continue
        target = dest / (Path(sub).name if sub != "." else "")
        if src.is_dir():
            shutil.copytree(src, target, dirs_exist_ok=True,
                            ignore=shutil.ignore_patterns(".git"))
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, target)
    stats = sync_once(cfg, vault, index, verbose=False)
    return (
        f"✅ Đã {action} pack '{name}': {stats['ingested']} bài mới/cập nhật, "
        f"{stats['chunks']} đoạn được index. Bạn hỏi mình về nội dung này được rồi!"
    )
