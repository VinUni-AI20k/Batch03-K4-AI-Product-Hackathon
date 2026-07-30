"""Endpoints for Phase 3 adaptive re-teaching."""

import json
import re

from fastapi import APIRouter, HTTPException

from app.core.schemas import SelfCheckGrade, SelfCheckGradeRequest
from app.prompts.self_check_prompt import SELF_CHECK_PROMPT

router = APIRouter(prefix="/api/reteach", tags=["reteach"])


@router.post("/self-check/grade", response_model=SelfCheckGrade)
def grade_self_check(payload: SelfCheckGradeRequest) -> SelfCheckGrade:
    """Grade a mandatory written self-check using the section's grounded context."""
    try:
        # Import lazily: the server can still start its non-LLM endpoints without an API key.
        from app.core.llm_client import llm_client

        response = llm_client.generate_text(
            SELF_CHECK_PROMPT.format(**payload.model_dump()), temperature=0.1
        )
        match = re.search(r"\{.*\}", response, re.DOTALL)
        if not match:
            raise ValueError("LLM did not return JSON")
        return SelfCheckGrade.model_validate(json.loads(match.group()))
    except (ValueError, json.JSONDecodeError) as error:
        raise HTTPException(status_code=502, detail="LLM returned an invalid self-check grade.") from error
    except Exception as error:
        raise HTTPException(status_code=503, detail="Self-check grading is temporarily unavailable.") from error
