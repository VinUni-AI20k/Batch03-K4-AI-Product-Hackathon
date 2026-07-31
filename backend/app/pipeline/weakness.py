"""Adapter between C's weakness output and D's alignment pipeline.

D deliberately does not grade answers or recalculate weakness.  The canonical
input is the ``WeaknessResult[]`` produced by C's ``analyzeWeakness`` function.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class WeaknessResultInput(BaseModel):
    """Python mirror of C's frontend WeaknessResult type."""

    outline_section_id: str = Field(..., pattern=r"^s\d+$")
    confidence: float = Field(..., ge=0, le=1)
    reasoning: str = Field(..., min_length=1)


def validate_weakness_results(
    weaknesses: list[WeaknessResultInput],
    valid_section_ids: set[str],
) -> list[WeaknessResultInput]:
    """Validate C's result without changing its score, order, or reasoning."""
    if not 1 <= len(weaknesses) <= 3:
        raise ValueError("C must return between 1 and 3 weakness results")

    seen: set[str] = set()
    for item in weaknesses:
        if item.outline_section_id not in valid_section_ids:
            raise ValueError(f"Unknown outline section: {item.outline_section_id}")
        if item.outline_section_id in seen:
            raise ValueError(f"Duplicate outline section: {item.outline_section_id}")
        seen.add(item.outline_section_id)
    return weaknesses
