"""Parse a cleaned lecture transcript (markdown, [Txx-NNN] segment codes) into
an outline of sections, keeping only the instructor's speech as ground truth.

Student speech (marked "[Học viên]:") is excluded from the knowledge source —
per product decision, only giảng viên + slide count as citable ground truth.
"""
import re
from dataclasses import dataclass, field


@dataclass
class Segment:
    segment_id: str
    text: str


@dataclass
class Section:
    section_id: str
    title: str
    segments: list[Segment] = field(default_factory=list)

    @property
    def key_points(self) -> list[str]:
        # first sentence of each segment as a lightweight key point
        points = []
        for seg in self.segments:
            first_sentence = re.split(r"(?<=[.!?])\s", seg.text.strip(), maxsplit=1)[0]
            points.append(first_sentence[:160])
        return points[:5]

    def as_text(self) -> str:
        return "\n".join(f"[{seg.segment_id}] {seg.text}" for seg in self.segments)


SEGMENT_RE = re.compile(r"\*\*\[([A-Za-z0-9\-]+)\]\*\*\s*(.*)")
STUDENT_PREFIX_RE = re.compile(r"^\[Học viên\]:\s*")


def parse_transcript(markdown_text: str, section_prefix: str = "S") -> list[Section]:
    sections: list[Section] = []
    current: Section | None = None
    section_index = 0

    for line in markdown_text.splitlines():
        stripped = line.strip()
        if stripped.startswith("## "):
            section_index += 1
            current = Section(section_id=f"{section_prefix}{section_index}", title=stripped[3:].strip())
            sections.append(current)
            continue

        match = SEGMENT_RE.match(stripped)
        if match and current is not None:
            segment_id, text = match.group(1), match.group(2).strip()
            if STUDENT_PREFIX_RE.match(text):
                continue  # exclude student speech from ground truth
            if text.startswith("[Hoạt động lớp"):
                continue  # exclude collapsed class-activity notes
            current.segments.append(Segment(segment_id=segment_id, text=text))

    return [s for s in sections if s.segments]


def outline_json(sections: list[Section]) -> list[dict]:
    return [
        {"section_id": s.section_id, "title": s.title, "key_points": s.key_points}
        for s in sections
    ]
