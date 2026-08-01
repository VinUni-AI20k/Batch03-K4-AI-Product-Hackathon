"""Pipeline trích xuất: nhận 1 file nguồn -> markdown thô có provenance.

Router theo đuôi file:
- .pdf/.pptx/.docx  -> slides.extract_slides (Docling + speaker notes)
- .mp4/.mkv/...     -> video.detect_slides + audio.transcribe + align
- .mp3/.wav/...     -> audio.transcribe -> transcript block 60s
"""
from __future__ import annotations

from pathlib import Path

from .audio import AUDIO_EXTS, VIDEO_EXTS, fmt_ts, transcribe
from .align import align_transcript, transcript_markdown
from .slides import extract_slides
from .video import detect_slides
from .web import extract_html

DOC_EXTS = {".pdf", ".pptx", ".docx"}
TEXT_EXTS = {".md", ".txt"}
HTML_EXTS = {".html", ".htm"}
SUPPORTED_EXTS = DOC_EXTS | TEXT_EXTS | HTML_EXTS | AUDIO_EXTS | VIDEO_EXTS


def extract(source: Path, asr_model: str, language: str = "vi") -> str:
    ext = source.suffix.lower()
    if ext in TEXT_EXTS:
        return source.read_text(encoding="utf-8", errors="replace")
    if ext in HTML_EXTS:
        return extract_html(source)
    if ext in DOC_EXTS:
        return extract_slides(source)

    if ext in VIDEO_EXTS:
        segments = transcribe(source, asr_model, language)
        intervals = detect_slides(source)
        if not intervals:
            return transcript_markdown(segments)
        aligned = align_transcript(segments, intervals)
        parts = []
        for iv in intervals:
            speech = " ".join(s.text for s in aligned.get(iv.index, []))
            parts.append(
                f"## Slide {iv.index} — [{fmt_ts(iv.t_start)}]\n"
                f"<!-- src: video slide {iv.index} | {fmt_ts(iv.t_start)}-{fmt_ts(iv.t_end)} -->\n"
                f"{speech}"
            )
        return "\n\n".join(parts)

    if ext in AUDIO_EXTS:
        return transcript_markdown(transcribe(source, asr_model, language))

    raise ValueError(f"Định dạng chưa hỗ trợ: {source}")
