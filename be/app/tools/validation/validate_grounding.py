from app.schemas.citation import Citation


def validate_grounding(has_factual_claims: bool, citations: list[Citation]) -> bool:
    return not has_factual_claims or bool(citations)
