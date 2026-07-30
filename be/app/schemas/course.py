from pydantic import BaseModel


class CourseInfo(BaseModel):
    title: str
    students: int
    progress_completed: int
    progress_total: int


class Day(BaseModel):
    id: int
    seq: str
    title: str
    slides: int
    is_completed: bool


class ToggleDayResult(BaseModel):
    success: bool
    completed: int
    total: int
