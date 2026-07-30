"""File gửi qua chat — 2 giai đoạn, có XÁC NHẬN trước khi nạp kiến thức:

1. receive_upload: lưu file + trích text (để agent tra cứu ngay lượt này).
   KHÔNG đụng vào knowledge base. Trả text để inject vào context hội thoại.
2. commit_upload: chỉ chạy khi user ĐỒNG Ý nạp -> structure + embed vào vault/index
   (kiến thức lâu dài). Phát hiện update: nếu bài đã tồn tại -> cho chọn thay/giữ cả 2.

Dùng khi user chỉ muốn hỏi 1 file (không cần học) thì dừng ở bước 1 — file không
vào knowledge base, chỉ nằm trong memory phiên.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

from openai import OpenAI

from .. import ingest
from ..index import LessonIndex, Manifest, file_hash
from ..ingest.structurer import note_rel_path
from ..vault import Vault
from .sync import ingest_one_file


@dataclass
class Upload:
    path: Path            # file đã lưu trong source_mirror/inbox/
    name: str             # tên gốc
    text: str             # nội dung đã trích (cho tra cứu)
    is_update: bool       # đã có bài cùng tên trong knowledge base chưa
    rel: str              # đường dẫn note dự kiến (courses/<rel>)


def receive_upload(cfg, data: bytes, filename: str) -> Upload | str:
    """Giai đoạn 1: lưu + trích text. Chưa nạp vào knowledge base. Lỗi -> trả str."""
    safe = re.sub(r"[^\w.\-() ]", "_", filename).strip() or "file"
    ext = Path(safe).suffix.lower()
    if ext not in ingest.SUPPORTED_EXTS:
        return (f"⚠️ Chưa hỗ trợ `{ext or 'không rõ'}`. Nhận: "
                f"{', '.join(sorted(ingest.SUPPORTED_EXTS))}")
    source_dir = cfg.path("sources", "dir")
    dest = source_dir / "inbox" / safe
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    asr_model = cfg.get("asr", "model", default="large-v3")
    language = cfg.get("asr", "language", default="vi")
    try:
        text = ingest.extract(dest, asr_model, language)
    except RuntimeError as e:  # thiếu dependency ingest
        dest.unlink(missing_ok=True)
        return f"⚠️ Không đọc được `{safe}`: {e}"
    rel = note_rel_path(dest, source_dir)
    is_update = (cfg.path("vault", "path") / "courses" / rel).exists()
    return Upload(path=dest, name=safe, text=text[:200_000], is_update=is_update, rel=rel)


def commit_upload(cfg, vault: Vault, index: LessonIndex, up: Upload, keep_both: bool = False) -> str:
    """Giai đoạn 2: user đồng ý -> nạp thành kiến thức. keep_both=True -> lưu bản mới cạnh bản cũ."""
    source_dir = cfg.path("sources", "dir")
    manifest = Manifest(cfg.path("sources", "manifest_db"))
    llm = OpenAI(base_url=cfg.llm_base_url, api_key=cfg.llm_api_key) if cfg.llm_api_key else None
    structurer_model = cfg.get("llm", "structurer_model", default="gpt-4o-mini")
    asr_model = cfg.get("asr", "model", default="large-v3")
    language = cfg.get("asr", "language", default="vi")

    rel = up.rel
    note_word = "nạp"
    if up.is_update and keep_both:
        # giữ cả 2: bản mới thành <tên>-vN.md
        base = Path(up.rel)
        n = 2
        while (cfg.path("vault", "path") / "courses" / f"{base.stem}-v{n}{base.suffix}").exists():
            n += 1
        rel = str(base.with_name(f"{base.stem}-v{n}{base.suffix}"))
        note_word = f"lưu bản mới (giữ cả bản cũ) thành '{Path(rel).stem}'"
    elif up.is_update:
        note_word = "cập nhật (thay bản cũ)"

    note, chunks = ingest_one_file(cfg, vault, index, up.path, source_dir, manifest,
                                   llm, structurer_model, asr_model, language, rel_override=rel)
    course = str(note.meta.get("course", ""))
    if course:
        vault.regenerate_moc(f"MOC - {course}", course)
    vault.commit(f"ingest qua chat: {note.name} ({note_word})")
    return f"✅ Đã {note_word} — bài **{note.name}** ({chunks} đoạn được index). Hỏi mình về nội dung này được rồi!"
