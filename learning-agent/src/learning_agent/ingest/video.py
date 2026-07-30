"""Tách slide từ video bài giảng: ffmpeg 1fps + perceptual hash (dHash).

Bền hơn PySceneDetect thuần với video slide ít chuyển động (bài học từ
paper PreMind + Lecture2Notes). Mỗi slide có khoảng on-screen [t_start, t_end)
để căn transcript vào.
"""
from __future__ import annotations

import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

HAMMING_THRESHOLD = 6  # dHash 64-bit; > ngưỡng = slide mới


@dataclass
class SlideInterval:
    index: int          # slide thứ mấy trong video
    t_start: float      # giây
    t_end: float
    keyframe: Path      # ảnh đại diện


def detect_slides(video_path: Path) -> list[SlideInterval]:
    try:
        import imagehash
        from PIL import Image
    except ImportError as e:
        raise RuntimeError(
            "Chưa cài imagehash/Pillow — chạy: pip install 'learning-agent[ingest]'"
        ) from e

    frames_dir = Path(tempfile.mkdtemp(prefix="frames_"))
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(video_path), "-vf", "fps=1", str(frames_dir / "%06d.jpg")],
        check=True, capture_output=True,
    )
    frames = sorted(frames_dir.glob("*.jpg"))
    if not frames:
        return []

    intervals: list[SlideInterval] = []
    prev_hash = None
    start = 0
    for sec, frame in enumerate(frames):
        h = imagehash.dhash(Image.open(frame))
        if prev_hash is not None and (h - prev_hash) > HAMMING_THRESHOLD:
            intervals.append(
                SlideInterval(index=len(intervals) + 1, t_start=float(start),
                              t_end=float(sec), keyframe=frames[start])
            )
            start = sec
        prev_hash = h
    intervals.append(
        SlideInterval(index=len(intervals) + 1, t_start=float(start),
                      t_end=float(len(frames)), keyframe=frames[start])
    )
    return intervals
