from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_course_service
from app.schemas.course import CourseInfo, Day, ToggleDayResult
from app.services.course_service import CourseService

router = APIRouter()


@router.get("/info", response_model=CourseInfo)
def get_course_info(
    service: Annotated[CourseService, Depends(get_course_service)],
) -> CourseInfo:
    return service.get_info()


@router.get("/days", response_model=list[Day])
def get_course_days(
    service: Annotated[CourseService, Depends(get_course_service)],
) -> list[Day]:
    return service.get_days()


@router.post("/toggle-day/{day_id}", response_model=ToggleDayResult)
def toggle_day(
    day_id: int,
    service: Annotated[CourseService, Depends(get_course_service)],
) -> ToggleDayResult:
    try:
        return service.toggle_day(day_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Day not found") from exc
