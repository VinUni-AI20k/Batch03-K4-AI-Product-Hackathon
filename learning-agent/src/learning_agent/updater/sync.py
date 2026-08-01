"""Vòng update: quét source_mirror -> hash diff -> chỉ ingest + re-index bài đổi.

Chuỗi đầy đủ: rclone sync (ngoài scope, cron) -> sync_once() -> vault git commit.
Bài học update -> ghi chú courses/ regenerate + index cập nhật; concepts/ giữ nguyên.
"""
from __future__ import annotations

from pathlib import Path

from openai import OpenAI

from .. import ingest
from ..index import Changes, LessonIndex, Manifest, file_hash
from ..ingest.structurer import lesson_meta, note_rel_path, structure_lesson
from ..vault import Note, Vault


def sync_once(cfg, vault: Vault, index: LessonIndex, verbose: bool = True) -> dict:
    source_dir = cfg.path("sources", "dir")
    source_dir.mkdir(parents=True, exist_ok=True)
    manifest = Manifest(cfg.path("sources", "manifest_db"))
    changes = manifest.diff(source_dir, ingest.SUPPORTED_EXTS)

    # LƯỚI AN TOÀN: nhiều file "biến mất" cùng lúc gần như luôn là source_dir bị trỏ sai
    # (ổ ngoài chưa mount, cwd sai khi chạy CLI, lỗi chuẩn hoá Unicode NFC/NFD trên macOS
    # với tên file có dấu...) chứ hiếm khi là học viên xoá thật hàng loạt. Xoá nhầm ở đây
    # là MẤT NOTE VĨNH VIỄN (unlink thẳng) — thà bỏ qua lượt xoá, để admin tự kiểm tra.
    total_known = manifest.count()
    if changes.deleted and len(changes.deleted) > max(10, total_known * 0.3):
        if verbose:
            print(f"🛑 AN TOÀN: {len(changes.deleted)}/{total_known} file nguồn 'biến mất' cùng lúc — "
                  "bất thường, có thể source_dir đang trỏ sai (kiểm tra sources.dir trong config.yaml, "
                  "ổ ngoài đã mount chưa, ký tự có dấu trong tên file). BỎ QUA xoá tự động lượt này để "
                  "không mất dữ liệu — bài học/index KHÔNG bị đụng. Chạy lại sync khi đã chắc chắn.")
        changes = Changes(added=changes.added, modified=changes.modified, deleted=[])

    llm = OpenAI(base_url=cfg.llm_base_url, api_key=cfg.llm_api_key) if cfg.llm_api_key else None
    structurer_model = cfg.get("llm", "structurer_model", default="gpt-4o-mini")
    asr_model = cfg.get("asr", "model", default="large-v3")
    language = cfg.get("asr", "language", default="vi")

    stats = {"ingested": 0, "removed": 0, "chunks": 0}

    stats["failed"] = []
    for path in changes.added + changes.modified:
        if verbose:
            print(f"→ ingest: {path.name}")
        try:
            note, chunks = ingest_one_file(cfg, vault, index, path, source_dir, manifest,
                                           llm, structurer_model, asr_model, language)
            stats["chunks"] += chunks
            stats["ingested"] += 1
        except Exception as e:  # 1 file lỗi (mã hoá, hỏng...) -> bỏ qua, tiếp file khác
            stats["failed"].append((path.name, str(e)[:120]))
            if verbose:
                print(f"  ⚠️ bỏ qua {path.name}: {str(e)[:120]}")

    for rel in changes.deleted:
        note_path = manifest.note_for(rel)
        if note_path:
            index.remove_note(note_path)
            Path(note_path).unlink(missing_ok=True)
        manifest.forget(rel)
        stats["removed"] += 1
        if verbose:
            print(f"→ gỡ: {rel}")

    # MOC sinh lại theo course có thay đổi
    courses = {n.meta.get("course") for n in vault.notes("courses")} - {None, ""}
    for course in courses:
        vault.regenerate_moc(f"MOC - {course}", str(course))

    if stats["ingested"] or stats["removed"]:
        vault.commit(
            f"sync: +{stats['ingested']} bài, -{stats['removed']} bài, {stats['chunks']} chunks"
        )
    return stats


def ingest_one_file(cfg, vault, index, path: Path, source_dir: Path, manifest,
                    llm, structurer_model, asr_model, language,
                    rel_override: str | None = None):
    """Ingest ĐÚNG 1 file: extract -> structure -> ghi note -> embed -> ghi manifest.
    rel_override: đổi đường dẫn note (để lưu 'giữ cả 2' thành phiên bản mới)."""
    raw = ingest.extract(path, asr_model, language)
    body = structure_lesson(raw, llm, structurer_model)
    meta = lesson_meta(path, source_dir, file_hash(path))
    rel = rel_override or note_rel_path(path, source_dir)
    note = vault.write_lesson_note(rel, meta, body)
    chunks = index.index_note(note)
    manifest.record(source_dir, path, str(note.path))
    return note, chunks


def reindex_all(cfg, vault: Vault, index: LessonIndex) -> int:
    """Index là phái sinh — rebuild toàn bộ từ vault khi cần (đổi model embedding...)."""
    total = 0
    for note in vault.notes("courses"):
        total += index.index_note(note)
    return total
