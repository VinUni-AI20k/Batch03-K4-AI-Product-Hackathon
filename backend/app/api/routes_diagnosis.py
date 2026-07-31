import json
import logging
from pathlib import Path
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.llm_client_openai import call_json
from app.prompts.weakness_prompt import SYSTEM_PROMPT


router = APIRouter(prefix="/api/diagnosis", tags=["diagnosis"])

DEBUG_LOG_PATH = Path(__file__).resolve().parents[2] / "data" / "weakness_debug.log"
DEBUG_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
debug_logger = logging.getLogger("illumimate.weakness")
if not debug_logger.handlers:
    debug_handler = logging.FileHandler(DEBUG_LOG_PATH, encoding="utf-8")
    debug_handler.setFormatter(logging.Formatter("%(asctime)s %(message)s"))
    debug_logger.addHandler(debug_handler)
    debug_logger.setLevel(logging.DEBUG)
    debug_logger.propagate = False


def _debug_log(event: str, **data: object) -> None:
    debug_logger.debug(json.dumps({"event": event, **data}, ensure_ascii=False))


class QuizSignalInput(BaseModel):
    outline_section_id: str
    wrongRate: float = Field(..., ge=0, le=1)
    misconceptionTags: List[str] = Field(default_factory=list)


class OutlineInput(BaseModel):
    id: str
    title: str
    summary: str


class WeaknessRefinementRequest(BaseModel):
    quiz_signal: List[QuizSignalInput]
    outline: List[OutlineInput] = Field(..., min_length=1)
    open_answer: str


class WeaknessOutput(BaseModel):
    outline_section_id: str
    confidence: float = Field(..., ge=0, le=1)
    reasoning: str = Field(..., min_length=1)


class WeaknessRefinementResponse(BaseModel):
    weaknesses: List[WeaknessOutput] = Field(..., min_length=1, max_length=3)


@router.post("/weaknesses", response_model=WeaknessRefinementResponse)
def refine_weaknesses(payload: WeaknessRefinementRequest) -> WeaknessRefinementResponse:
    """Use AI only on compact, precomputed quiz signals."""
    compact_input = payload.model_dump(mode="json")
    _debug_log("request", input=compact_input)
    try:
        result = call_json(
            SYSTEM_PROMPT,
            payload.model_dump_json(),
        )
        response = WeaknessRefinementResponse.model_validate(result)
    except Exception as error:  # noqa: BLE001 - present provider/format failure as an API error
        _debug_log("response_error", error=str(error))
        raise HTTPException(status_code=502, detail="AI weakness refinement failed.") from error

    allowed_section_ids = {section.id for section in payload.outline}
    validation_errors = [
        f"unknown_outline_section_id:{item.outline_section_id}"
        for item in response.weaknesses
        if item.outline_section_id not in allowed_section_ids
    ]
    if any(
        response.weaknesses[index].confidence < response.weaknesses[index + 1].confidence
        for index in range(len(response.weaknesses) - 1)
    ):
        validation_errors.append("confidence_not_descending")
    _debug_log(
        "response",
        response=result,
        validation_errors=validation_errors,
    )
    return response
