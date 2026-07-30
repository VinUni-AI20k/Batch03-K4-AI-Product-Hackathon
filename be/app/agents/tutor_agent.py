from app.schemas.chat import ChatRequest, ChatResponse
from app.tools.scope_router import resolve_scope


class TutorAgent:
    """Coordinates scope, retrieval, tutoring tools and validation.

    Retrieval and LLM generation are deliberately left behind provider
    interfaces. Until ingestion is implemented, the agent returns a safe,
    explicit response instead of inventing an answer.
    """

    def run(self, request: ChatRequest) -> ChatResponse:
        scope = resolve_scope(request.message, request.context)
        return ChatResponse(
            answer=(
                "Hệ thống chatbot đã sẵn sàng về cấu trúc, nhưng kho bài giảng "
                "chưa được lập chỉ mục nên chưa thể trả lời có căn cứ."
            ),
            status="not_configured",
            scope=scope,
            citations=[],
            suggested_questions=[
                "Tóm tắt bài giảng hiện tại",
                "Giải thích khái niệm chính trong slide này",
            ],
        )


tutor_agent = TutorAgent()
