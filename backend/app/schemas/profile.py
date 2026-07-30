from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


ExperienceLevel = Literal["beginner", "intermediate", "advanced", "unknown"]
SourceType = Literal["pdf_text", "docx_text", "ocr", "vision", "rule"]


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class EvidenceItem(StrictModel):
    page: int | None = Field(default=None, ge=1)
    source_type: SourceType
    snippet: str = Field(min_length=1, max_length=180)


class SkillEvidence(StrictModel):
    name: str = Field(min_length=1, max_length=80)
    level: ExperienceLevel = "unknown"
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: list[EvidenceItem] = Field(default_factory=list, max_length=20)

    @model_validator(mode="after")
    def high_confidence_requires_evidence(self) -> "SkillEvidence":
        if self.confidence > 0.7 and not self.evidence:
            raise ValueError("A high-confidence skill requires evidence")
        return self


class ProjectEvidence(StrictModel):
    title: str | None = Field(default=None, max_length=120)
    description: str = Field(min_length=1, max_length=1000)
    technologies: list[str] = Field(default_factory=list, max_length=30)
    role: str | None = Field(default=None, max_length=120)
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: list[EvidenceItem] = Field(default_factory=list, max_length=20)

    @model_validator(mode="after")
    def high_confidence_requires_evidence(self) -> "ProjectEvidence":
        if self.confidence > 0.7 and not self.evidence:
            raise ValueError("A high-confidence project requires evidence")
        return self


class UncertainField(StrictModel):
    field: str = Field(min_length=1, max_length=120)
    reason: str = Field(min_length=1, max_length=300)
    question_for_user: str = Field(min_length=1, max_length=300)


class StudentProfile(StrictModel):
    skills: list[SkillEvidence] = Field(default_factory=list, max_length=100)
    projects: list[ProjectEvidence] = Field(default_factory=list, max_length=50)
    interests: list[str] = Field(default_factory=list, max_length=50)
    tools: list[str] = Field(default_factory=list, max_length=100)
    experience_level: ExperienceLevel = "unknown"
    github_urls: list[str] = Field(default_factory=list, max_length=20)
    portfolio_urls: list[str] = Field(default_factory=list, max_length=20)
    uncertain_fields: list[UncertainField] = Field(default_factory=list, max_length=100)
    warnings: list[str] = Field(default_factory=list, max_length=100)
    requires_user_confirmation: bool = True

    @field_validator("requires_user_confirmation")
    @classmethod
    def confirmation_is_mandatory(cls, value: bool) -> bool:
        if value is not True:
            raise ValueError("Extracted profiles always require user confirmation")
        return value

    @field_validator("interests", "tools")
    @classmethod
    def unique_short_values(cls, values: list[str]) -> list[str]:
        result: list[str] = []
        seen: set[str] = set()
        for raw in values:
            value = raw.strip()[:100]
            key = value.casefold()
            if value and key not in seen:
                result.append(value)
                seen.add(key)
        return result

    @field_validator("github_urls", "portfolio_urls")
    @classmethod
    def public_urls_only(cls, values: list[str]) -> list[str]:
        result: list[str] = []
        for value in values:
            value = value.strip()
            if value.startswith(("https://", "http://")) and "?" not in value and "#" not in value:
                result.append(value[:500])
        return list(dict.fromkeys(result))


class SourceMetadata(StrictModel):
    file_hash: str = Field(pattern=r"^[a-f0-9]{64}$")
    mime_type: str
    size_bytes: int = Field(ge=0)
    page_count: int = Field(ge=1)


class ProcessingMetadata(StrictModel):
    primary_method: str
    ocr_used: bool
    llm_used: bool
    duration_ms: int = Field(ge=0)


class OcrParseResponse(StrictModel):
    run_id: str
    status: Literal["needs_confirmation", "partial_success", "failed"]
    source: SourceMetadata
    processing: ProcessingMetadata
    profile: StudentProfile
    uncertain_fields: list[UncertainField]
    warnings: list[str]
    requires_user_confirmation: bool = True
    report_id: str
    trace: list[str] = Field(default_factory=list)
