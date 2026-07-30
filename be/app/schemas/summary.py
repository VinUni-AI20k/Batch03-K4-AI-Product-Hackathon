from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.citation import Citation


class SummaryRequest(BaseModel):
    lecture_ids: list[str] = Field(default_factory=list)
    page: int | None = None
    topic: str | None = None
    style: Literal["brief", "detailed", "study_notes", "comparison"] = "brief"


class SummaryResult(BaseModel):
    summary: str
    citations: list[Citation] = Field(default_factory=list)
