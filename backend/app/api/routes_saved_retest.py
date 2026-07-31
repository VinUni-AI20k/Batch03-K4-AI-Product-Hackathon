from typing import List, Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.schemas import RetestQuestion, RetestScope, SavedRetestQuiz
from app.core.session_store import get_saved_retest_quiz, save_retest_quiz

router = APIRouter(prefix="/api/retest", tags=["retest"])


class SaveRetestQuizRequest(BaseModel):
    questions: List[RetestQuestion] = Field(..., min_length=1)
    scope: RetestScope
    num_questions: int = Field(..., alias="numQuestions", ge=1)
    session_id: Optional[str] = None

    model_config = {"populate_by_name": True}


@router.post("/saved", response_model=SavedRetestQuiz, status_code=status.HTTP_201_CREATED)
def post_save_retest_quiz(payload: SaveRetestQuizRequest) -> SavedRetestQuiz:
    if payload.num_questions != len(payload.questions):
        raise HTTPException(
            status_code=422,
            detail="numQuestions must match the number of questions being saved",
        )
    return save_retest_quiz(
        payload.questions,
        payload.scope,
        payload.num_questions,
        payload.session_id,
    )


@router.get("/saved/{saved_quiz_id}", response_model=SavedRetestQuiz, deprecated=True)
def read_saved_retest_quiz(saved_quiz_id: str) -> SavedRetestQuiz:
    saved = get_saved_retest_quiz(saved_quiz_id)
    if saved is None:
        raise HTTPException(status_code=404, detail="Saved retest quiz not found")
    return saved
