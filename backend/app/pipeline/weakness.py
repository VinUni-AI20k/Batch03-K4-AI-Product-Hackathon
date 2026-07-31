"""Learning diagnosis owned by D.

Input is C's canonical ``GradingResult``.  Diagnosis is deterministic: a
section is weak when its own accuracy is below the mastery threshold.
"""

from __future__ import annotations

from collections import defaultdict
from enum import Enum

from pydantic import BaseModel, Field

from app.core.schemas import GradingResult, WeaknessAnalysis, WeaknessRankingItem


MASTERY_THRESHOLD = 0.8
MAX_SECTIONS_TO_RETEACH = 3


class LearningAction(str, Enum):
    RETEACH = "reteach"
    RETEST = "retest"


class DiagnosisResult(BaseModel):
    action: LearningAction
    score: float = Field(..., ge=0, le=1)
    mastery_threshold: float = Field(..., ge=0, le=1)
    weakness: WeaknessAnalysis | None = None


def diagnose_learning(
    grading: GradingResult,
    open_answer_text: str = "",
    *,
    mastery_threshold: float = MASTERY_THRESHOLD,
    max_sections: int = MAX_SECTIONS_TO_RETEACH,
) -> DiagnosisResult:
    """Create weak-section ranking and choose reteach or retest.

    ``retest`` means all sections reached mastery. ``reteach`` means at least
    one section is below mastery; at most three weakest sections are selected.
    """
    if not 0 <= mastery_threshold <= 1:
        raise ValueError("mastery_threshold must be between 0 and 1")
    if not 1 <= max_sections <= MAX_SECTIONS_TO_RETEACH:
        raise ValueError("max_sections must be between 1 and 3")
    if not grading.items:
        raise ValueError("grading result must contain at least one item")

    totals: dict[str, int] = defaultdict(int)
    correct: dict[str, int] = defaultdict(int)
    for item in grading.items:
        totals[item.section_id] += 1
        if item.correct:
            correct[item.section_id] += 1

    ranking: list[WeaknessRankingItem] = []
    for section_id, total in totals.items():
        correct_count = correct[section_id]
        section_accuracy = correct_count / total
        if section_accuracy >= mastery_threshold:
            continue
        weak_score = 1 - section_accuracy
        ranking.append(
            WeaknessRankingItem(
                section_id=section_id,
                weak_score=round(weak_score, 4),
                reason=(
                    f"Độ chính xác {section_accuracy:.0%} "
                    f"({correct_count}/{total} câu đúng), thấp hơn ngưỡng "
                    f"mastery {mastery_threshold:.0%}."
                ),
            )
        )

    ranking.sort(key=lambda item: (-item.weak_score, item.section_id))
    if not ranking:
        return DiagnosisResult(
            action=LearningAction.RETEST,
            score=grading.score,
            mastery_threshold=mastery_threshold,
        )

    selected = [item.section_id for item in ranking[:max_sections]]
    weakness = WeaknessAnalysis(
        quiz_result=grading.items,
        open_answer_text=open_answer_text,
        weakness_ranking=ranking,
        sections_to_reteach=selected,
    )
    return DiagnosisResult(
        action=LearningAction.RETEACH,
        score=grading.score,
        mastery_threshold=mastery_threshold,
        weakness=weakness,
    )


def analyze_weakness(
    grading: GradingResult,
    open_answer_text: str = "",
    *,
    mastery_threshold: float = MASTERY_THRESHOLD,
) -> WeaknessAnalysis:
    """Return just WeaknessAnalysis for callers that already chose reteach."""
    result = diagnose_learning(
        grading,
        open_answer_text,
        mastery_threshold=mastery_threshold,
    )
    if result.weakness is None:
        raise ValueError("No weak section found; learner should proceed to retest")
    return result.weakness
