from app.schemas.chat import LearningContext


def get_current_context(context: LearningContext) -> dict:
    return context.model_dump()
