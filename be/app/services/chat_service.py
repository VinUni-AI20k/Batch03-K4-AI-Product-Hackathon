from app.agents.tutor_agent import TutorAgent, tutor_agent
from app.schemas.chat import ChatRequest, ChatResponse


class ChatService:
    def __init__(self, agent: TutorAgent) -> None:
        self.agent = agent

    def reply(self, request: ChatRequest) -> ChatResponse:
        return self.agent.run(request)


chat_service = ChatService(tutor_agent)
