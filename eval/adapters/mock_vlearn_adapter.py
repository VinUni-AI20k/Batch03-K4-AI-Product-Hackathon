"""Deterministic contract fixture for the evaluation pipeline.

It returns a schema-valid response satisfying the expectation embedded in each
case. A 100% result proves that case loading, scoring, reporting, and thresholds
work together; it is NOT a measure of the VLearn AI agents.
"""
from __future__ import annotations


def run_case(case: dict) -> dict:
    expected = case.get("expected", {})
    reference = expected.get("reference_answer", expected.get("exact", "contract fixture"))
    # Some legacy golden cases use keywords that are broader than the reference
    # answer. Include them as fixture metadata so the contract covers every
    # mandatory scorer assertion without pretending this is natural AI text.
    answer = f"{reference}\nContract keywords: {'; '.join(expected.get('keywords', []))}".strip()
    return {
        "answer": answer,
        "citations": list(case.get("expected_citations", [])),
        "tool_calls": list(case.get("expected_tool_calls", [])),
        "validator_blocked": bool(case.get("validator_should_block", False)),
        "integrity_ok": bool(case.get("integrity_should_pass", True)),
        "quota_delta": int(case.get("expected_quota_delta", 0)),
        "adapter_type": "contract_fixture",
    }
