"""Căn transcript vào slide interval: segment thuộc slide nào nếu midpoint
của nó rơi vào khoảng on-screen của slide đó (kỹ thuật Lecture2Notes)."""
from __future__ import annotations

from .audio import Segment, fmt_ts
from .video import SlideInterval


def align_transcript(
    segments: list[Segment], intervals: list[SlideInterval]
) -> dict[int, list[Segment]]:
    """slide index -> các segment lời giảng của slide đó."""
    result: dict[int, list[Segment]] = {iv.index: [] for iv in intervals}
    for seg in segments:
        mid = (seg.start + seg.end) / 2
        for iv in intervals:
            if iv.t_start <= mid < iv.t_end:
                result[iv.index].append(seg)
                break
    return result


def transcript_markdown(segments: list[Segment], video_url: str = "") -> str:
    """Fallback khi chỉ có audio (không video): transcript thành các block 60s."""
    lines, block, block_start = [], [], 0.0
    for seg in segments:
        if seg.start - block_start >= 60 and block:
            lines.append(f"## [{fmt_ts(block_start)}]\n" + " ".join(block))
            block, block_start = [], seg.start
        block.append(seg.text)
    if block:
        lines.append(f"## [{fmt_ts(block_start)}]\n" + " ".join(block))
    return "\n\n".join(lines)
