from pydantic import BaseModel

class ChatRequest(BaseModel):
    lecture_id: str
    slide_no: int
    question: str

class ChatResponse(BaseModel):
    answer: str
