"""Endpoints for Phase 3 adaptive re-teaching."""

import json
import re
from typing import List, Dict
from pydantic import BaseModel

from fastapi import APIRouter, HTTPException

from app.core.schemas import SelfCheckGrade, SelfCheckGradeRequest
from app.prompts.self_check_prompt import SELF_CHECK_PROMPT
from app.core.llm_client_openai import call_json

router = APIRouter(prefix="/api/reteach", tags=["reteach"])


class SectionInput(BaseModel):
    section_id: str
    title: str
    summary: str


class GenerateExamplesRequest(BaseModel):
    sections: List[SectionInput]


class GenerateExamplesResponse(BaseModel):
    examples: Dict[str, str]


SYSTEM_EXAMPLE_PROMPT = (
    "You are an expert AI teaching assistant. "
    "Your task is to generate a relatable, practical real-world example (ví dụ thực tế) in Vietnamese for a lesson section. "
    "The example should explain the technical concept using a clear analogy or real-life application that is easy to understand. "
    "Return ONLY valid JSON in this exact shape:\n"
    "{\"example\": \"your_example_here\"}"
)

USER_EXAMPLE_PROMPT_TEMPLATE = (
    "Generate a real-world example for the following section:\n"
    "Section Title: {title}\n"
    "Concepts/Summary: {summary}\n"
)


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


@router.post("/examples", response_model=GenerateExamplesResponse)
def generate_examples(payload: GenerateExamplesRequest) -> GenerateExamplesResponse:
    """Generate real-world examples using AI for each section."""
    examples = {}
    for section in payload.sections:
        try:
            user_prompt = USER_EXAMPLE_PROMPT_TEMPLATE.format(
                title=section.title,
                summary=section.summary
            )
            response = call_json(SYSTEM_EXAMPLE_PROMPT, user_prompt)
            examples[section.section_id] = response.get("example", "")
        except Exception as exc:
            examples[section.section_id] = f"(Không thể sinh ví dụ tự động: {str(exc)})"
    return GenerateExamplesResponse(examples=examples)

