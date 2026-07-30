"""Vòng update: quét source_mirror -> hash diff -> chỉ ingest + re-index bài đổi.

Chuỗi đầy đủ: rclone sync (ngoài scope, cron) -> sync_once() -> vault git commit.
Bài học update -> ghi chú courses/ regenerate + index cập nhật; concepts/ giữ nguyên.
"""
from __future__ import annotations

from pathlib import Path

from openai import OpenAI

from .. import ingest
from ..index import LessonIndex, Manifest, file_hash
from ..ingest.structurer import lesson_meta, note_rel_path, structure_lesson
from ..vault import Note, Vault


def sync_once(cfg, vault: Vault, index: LessonIndex, verbose: bool = True) -> dict:
    source_dir = cfg.path("sources", "dir")
    source_dir.mkdir(parents=True, exist_ok=True)
    manifest = Manifest(cfg.path("sources", "manifest_db"))
    changes = manifest.diff(source_dir, ingest.SUPPORTED_EXTS)

    llm = OpenAI(base_url=cfg.llm_base_url, api_key=cfg.llm_api_key) if cfg.llm_api_key else None
    structurer_model = cfg.get("llm", "structurer_model", default="gpt-4o-mini")
    asr_model = cfg.get("asr", "model", default="large-v3")
    language = cfg.get("asr", "language", default="vi")

    stats = {"ingested": 0, "removed": 0, "chunks": 0}

    for path in changes.added + changes.modified:
        if verbose:
            print(f"→ ingest: {path.name}")
        raw = ingest.extract(path, asr_model, language)
        body = structure_lesson(raw, llm, structurer_model)
        meta = lesson_meta(path, source_dir, file_hash(path))
        note = vault.write_lesson_note(note_rel_path(path, source_dir), meta, body)
        stats["chunks"] += index.index_note(note)
        manifest.record(source_dir, path, str(note.path))
        stats["ingested"] += 1

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


def reindex_all(cfg, vault: Vault, index: LessonIndex) -> int:
    """Index là phái sinh — rebuild toàn bộ từ vault khi cần (đổi model embedding...)."""
    total = 0
    for note in vault.notes("courses"):
        total += index.index_note(note)
    return total
