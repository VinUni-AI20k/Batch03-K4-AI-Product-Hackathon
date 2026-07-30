from dataclasses import dataclass


@dataclass(frozen=True)
class LectureRef:
    course_id: str
    lecture_id: str
    title: str
