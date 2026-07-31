from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.schemas import RetestQuestion, RetestScope
from app.core.session_store import get_session
from app.pipeline.retest_quiz import generate_retest_quiz

router = APIRouter(prefix="/api/retest", tags=["retest"])


class RetestOutlineInput(BaseModel):
    id: str
    title: str
    summary: str | list[str] = ""
    slide_ref: Optional[str] = None


class RetestTranscriptInput(BaseModel):
    id: str
    text: str


class GenerateRetestQuizRequest(BaseModel):
    session_id: str = Field(..., min_length=1)
    scope: RetestScope
    num_questions: int = Field(..., alias="numQuestions", ge=1)
    outline: list[RetestOutlineInput] = Field(default_factory=list)
    filtered_transcript: list[RetestTranscriptInput] = Field(default_factory=list, alias="filteredTranscript")
    avoid_similar_to: list[str] = Field(default_factory=list, alias="avoidSimilarTo")

    model_config = {"populate_by_name": True}


@router.post("/generate-quiz", response_model=List[RetestQuestion])
def post_generate_retest_quiz(payload: GenerateRetestQuizRequest) -> list[RetestQuestion]:
    session = get_session(payload.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    if not session.outline:
        raise HTTPException(status_code=422, detail="Session has no uploaded learning context")
    outline = [RetestOutlineInput(
        id=item.section_id, title=item.title, summary=item.key_points,
        slide_ref=item.slide_ids[0] if item.slide_ids else None,
    ) for item in session.outline]
    transcript = [RetestTranscriptInput(id=item.segment_id, text=item.text)
                  for item in (session.raw_transcript or [])]
    try:
        return generate_retest_quiz(
            outline,
            transcript,
            payload.scope,
            payload.num_questions,
            payload.avoid_similar_to,
        )
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except Exception as error:  # noqa: BLE001 - hide provider details
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=502, detail=f"Grounded retest generation failed: {error}") from error
