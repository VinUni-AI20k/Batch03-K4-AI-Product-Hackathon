from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.profile import SkillEvidence
from app.services.ocr.models import PageText
from app.services.ocr.profile_parser import ProfileParser


def test_high_confidence_skill_requires_evidence():
    with pytest.raises(ValidationError):
        SkillEvidence(name="Python", confidence=0.9, level="unknown", evidence=[])


def test_evidence_snippet_has_a_hard_length_limit():
    with pytest.raises(ValidationError):
        SkillEvidence(
            name="Python",
            confidence=0.6,
            level="unknown",
            evidence=[{"page": 1, "source_type": "rule", "snippet": "x" * 181}],
        )


def test_keyword_only_skill_stays_unknown_and_low_confidence(settings):
    parser = ProfileParser(settings)
    result = parser.parse(
        [PageText(1, "Kỹ năng: Python", "docx_text")],
        use_llm=False,
        consent_external_processing=False,
        extraction_method="python_docx",
    )
    skill = result.profile.skills[0]
    assert skill.name == "Python"
    assert skill.level == "unknown"
    assert skill.confidence <= 0.7


def test_project_description_supports_higher_skill_confidence(settings):
    parser = ProfileParser(settings)
    result = parser.parse(
        [
            PageText(
                1,
                "Dự án: Phân tích học tập\nXây dựng API bằng Python và FastAPI cho dashboard.",
                "docx_text",
            )
        ],
        use_llm=False,
        consent_external_processing=False,
        extraction_method="python_docx",
    )
    python = next(skill for skill in result.profile.skills if skill.name == "Python")
    assert python.confidence > 0.7
    assert python.evidence
    assert result.profile.projects
