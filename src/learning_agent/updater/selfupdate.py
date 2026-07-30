"""Version & self-update (mô hình `hermes update`):
- check_version: version + commit local, so sánh với origin/main trên GitHub.
- do_update: git pull --ff-only + pip install -e . (chạy qua CLI `learning-agent update`).
"""
from __future__ import annotations

import subprocess
import sys

from .. import __version__


def _git(root, *args) -> str | None:
    r = subprocess.run(["git", "-C", str(root), *args],
                       capture_output=True, text=True, timeout=15)
    return r.stdout.strip() if r.returncode == 0 else None


def check_version(cfg) -> str:
    local = _git(cfg.root, "rev-parse", "HEAD")
    if local is None:
        return f"Phiên bản {__version__} (không phải bản cài từ git — không kiểm tra update được)."
    line = f"Phiên bản {__version__} · commit {local[:7]}"
    remote_out = None
    try:
        r = subprocess.run(["git", "-C", str(cfg.root), "ls-remote", "origin", "main"],
                           capture_output=True, text=True, timeout=15)
        remote_out = r.stdout.split()[0] if r.returncode == 0 and r.stdout else None
    except Exception:
        pass
    if not remote_out:
        return f"{line}. Không kết nối được GitHub để kiểm tra bản mới."
    if remote_out == local:
        return f"{line}. ✅ Đang là bản MỚI NHẤT trên GitHub."
    # local đã chứa remote chưa? (chạy trước bản trên GitHub)
    ahead = subprocess.run(
        ["git", "-C", str(cfg.root), "merge-base", "--is-ancestor", remote_out, local],
        capture_output=True,
    ).returncode == 0
    if ahead:
        return f"{line}. Đang chạy bản MỚI HƠN GitHub (dev local, chưa push)."
    return (
        f"{line}. 🆕 CÓ BẢN MỚI trên GitHub ({remote_out[:7]}). "
        f"Cập nhật: chạy `learning-agent update` trên máy chủ rồi khởi động lại bot."
    )


def do_update(cfg) -> None:
    print("→ git pull...")
    r = subprocess.run(["git", "-C", str(cfg.root), "pull", "--ff-only"],
                       capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr.strip())
    if r.returncode != 0:
        sys.exit("⚠️ Pull thất bại — kiểm tra thay đổi local (git status).")
    if "Already up to date" in r.stdout:
        print("✅ Đang là bản mới nhất.")
        return
    print("→ cài dependencies mới (nếu có)...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-q", "-e", str(cfg.root)], check=False)
    print("✅ Cập nhật xong — khởi động lại bot để áp dụng: learning-agent bot")
