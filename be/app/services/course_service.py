from app.repositories.course_repository import InMemoryCourseRepository
from app.schemas.course import CourseInfo, Day, ToggleDayResult


class CourseService:
    def __init__(self, repository: InMemoryCourseRepository) -> None:
        self.repository = repository

    def get_info(self) -> CourseInfo:
        return CourseInfo(**self.repository.get_course())

    def get_days(self) -> list[Day]:
        return [Day(**day) for day in self.repository.get_days()]

    def toggle_day(self, day_id: int) -> ToggleDayResult:
        course = self.repository.toggle_day(day_id)
        return ToggleDayResult(
            success=True,
            completed=course["progress_completed"],
            total=course["progress_total"],
        )
