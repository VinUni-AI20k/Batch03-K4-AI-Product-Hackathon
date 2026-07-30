from copy import deepcopy


class InMemoryCourseRepository:
    def __init__(self) -> None:
        self._course = {
            "title": "COMP2010 - Khóa 3 + 4 Phase 1",
            "students": 1074,
        }
        self._days = [
            {"id": 1, "seq": "01", "title": "Day01", "slides": 2, "is_completed": False},
            {"id": 2, "seq": "02", "title": "Day02", "slides": 1, "is_completed": False},
            {"id": 3, "seq": "03", "title": "Day03", "slides": 2, "is_completed": False},
            {"id": 4, "seq": "04", "title": "Day04", "slides": 3, "is_completed": False},
        ]

    def get_course(self) -> dict:
        completed = sum(day["is_completed"] for day in self._days)
        return {
            **self._course,
            "progress_completed": completed,
            "progress_total": len(self._days),
        }

    def get_days(self) -> list[dict]:
        return deepcopy(self._days)

    def toggle_day(self, day_id: int) -> dict:
        day = next((item for item in self._days if item["id"] == day_id), None)
        if day is None:
            raise KeyError(day_id)
        day["is_completed"] = not day["is_completed"]
        return self.get_course()


course_repository = InMemoryCourseRepository()
