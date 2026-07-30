from app.schemas.chat import LearningContext


def resolve_scope(message: str, context: LearningContext) -> str:
    normalized = message.casefold()
    if any(term in normalized for term in ("toàn khóa", "các bài khác", "bài nào khác")):
        return "all_lectures"
    if any(term in normalized for term in ("trang này", "slide này")) and context.current_page:
        return "current_page"
    if context.selected_lecture_ids:
        return "selected_lectures"
    if context.current_lecture_id:
        return "current_lecture"
    return "all_lectures"
