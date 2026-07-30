"""Video/ghi âm -> transcript có timestamp (faster-whisper + PhoWhisper).

Với video, ffmpeg tách audio trước. Timestamp mức segment (2-10s) — đủ để
căn với slide interval.
"""
from __future__ import annotations

import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

AUDIO_EXTS = {".mp3", ".wav", ".m4a", ".flac", ".ogg"}
VIDEO_EXTS = {".mp4", ".mkv", ".webm", ".mov", ".avi"}


@dataclass
class Segment:
    start: float  # giây
    end: float
    text: str


def extract_audio(video_path: Path) -> Path:
    out = Path(tempfile.mkstemp(suffix=".wav")[1])
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(video_path), "-vn", "-ar", "16000", "-ac", "1", str(out)],
        check=True, capture_output=True,
    )
    return out


def transcribe(path: Path, model_name: str, language: str = "vi") -> list[Segment]:
    try:
        from faster_whisper import WhisperModel
    except ImportError as e:
        raise RuntimeError(
            "Chưa cài faster-whisper — chạy: pip install 'learning-agent[ingest]'"
        ) from e

    audio = extract_audio(path) if path.suffix.lower() in VIDEO_EXTS else path
    model = WhisperModel(model_name, compute_type="int8")  # int8: chạy được CPU/Apple Silicon
    segments, _info = model.transcribe(str(audio), language=language, vad_filter=True)
    return [Segment(start=s.start, end=s.end, text=s.text.strip()) for s in segments]


def fmt_ts(seconds: float) -> str:
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    return f"{h:02d}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"
