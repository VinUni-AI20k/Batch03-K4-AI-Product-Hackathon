"""Theo dõi vault: sửa/thêm/xoá ghi chú trong courses/ (vd bằng Obsidian) -> tự cập nhật
index RAG từng bài (incremental, không rebuild toàn bộ).

- Polling mtime (không thêm dependency watchdog); debounce SETTLE giây để tránh index
  giữa lúc Obsidian đang autosave dở.
- Chỉ MỘT tiến trình canh (pid-lock data/vault-watch.pid) — bot và ui chạy song song
  không giẫm nhau ghi Chroma.
- Tắt bằng VLEARN_NO_WATCH=1.
"""
from __future__ import annotations

import os
import threading
import time
from pathlib import Path

POLL = 10     # giây giữa 2 lần quét
SETTLE = 5    # file phải "yên" ngần này giây mới index (tránh bắt giữa lúc đang gõ)


def _alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False


def _snapshot(root: Path) -> dict[str, float]:
    out: dict[str, float] = {}
    if not root.exists():
        return out
    for p in root.rglob("*.md"):
        try:
            out[str(p)] = p.stat().st_mtime
        except OSError:
            pass
    return out


def start_vault_watcher(cfg, vault, index):
    """Chạy thread nền canh vault/courses. Trả Thread hoặc None (tắt / process khác đang canh)."""
    if os.environ.get("VLEARN_NO_WATCH", "").strip():
        return None
    lock = cfg.root / "data" / "vault-watch.pid"
    try:
        lock.parent.mkdir(parents=True, exist_ok=True)
        if lock.exists():
            old = int((lock.read_text().strip() or "0"))
            if old and old != os.getpid() and _alive(old):
                return None  # tiến trình khác (bot/ui) đã canh rồi
        lock.write_text(str(os.getpid()), encoding="utf-8")
    except Exception:
        pass  # không lock được thì vẫn canh — tệ nhất là index 2 lần, không mất dữ liệu

    courses = vault.path / "courses"

    def run() -> None:
        from ..vault.note import Note
        seen = _snapshot(courses)
        print(f"👁 Đang theo dõi vault ({len(seen)} bài) — sửa trong Obsidian là RAG tự cập nhật.")
        while True:
            time.sleep(POLL)
            try:
                now = _snapshot(courses)
                t = time.time()
                for p, m in now.items():
                    if seen.get(p) == m or t - m < SETTLE:
                        continue
                    try:
                        note = Note.load(Path(p))
                        k = index.index_note(note)
                        print(f"👁 Vault đổi: {Path(p).stem} → cập nhật {k} chunks")
                    except Exception as e:
                        print(f"👁 Vault: lỗi index {Path(p).name}: {e}")
                    seen[p] = m
                for p in [q for q in seen if q not in now]:
                    try:
                        index.remove_note(p)
                        print(f"👁 Vault xoá: {Path(p).stem} → đã gỡ khỏi index")
                    except Exception:
                        pass
                    seen.pop(p, None)
            except Exception:
                pass  # watcher không bao giờ được làm sập tiến trình chính

    th = threading.Thread(target=run, daemon=True, name="vault-watch")
    th.start()
    return th
