def can_expand_scope(explicit_current_only: bool, source_count: int) -> bool:
    """Allow cross-lecture search only when the user did not forbid it."""
    return not explicit_current_only and source_count == 0


def requires_citations(has_factual_claims: bool) -> bool:
    return has_factual_claims
