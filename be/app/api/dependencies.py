from app.repositories.course_repository import course_repository
from app.services.course_service import CourseService


def get_course_service() -> CourseService:
    return CourseService(course_repository)
