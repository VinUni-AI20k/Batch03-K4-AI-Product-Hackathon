from __future__ import annotations

import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from eval_core import (
    BridgeItem, BridgeOutput, EvalError, GeminiEval, RecapItem, Resolver, ROOT,
    gate, gemini_schema, load_golden, metrics, normalize_citations,
    preflight_gate, validate_assets, validate_final, word_count,
)


@pytest.fixture(scope="module")
def cases():
    return load_golden()


@pytest.fixture(scope="module")
def resolver():
    return Resolver()


def test_golden_structure_and_real_refs(cases, resolver):
    report = validate_assets(cases, resolver)
    assert report["valid"], report["errors"]
    assert report["case_count"] == 22
    assert report["chat_traceable_cases"] >= 10
    assert report["resolved_cases"] == 22


def test_segment_parser_resolves_citation(cases, resolver):
    resolved = resolver.case(next(case for case in cases if case.id == "normal_01"))
    assert "T04-046" in resolved.previous
    assert "T01-023" in resolved.current
    assert len(resolved.previous["T04-046"]) > 30


def test_schema_rejects_unknown_status():
    with pytest.raises(ValidationError):
        BridgeOutput(status="made_up")


def test_gemini_schema_strips_unsupported_additional_properties():
    schema = json.dumps(gemini_schema(BridgeOutput))
    assert "additionalProperties" not in schema


def test_citation_normalization_removes_one_bracket_pair():
    output = BridgeOutput(
        status="ok",
        recap=[RecapItem(claim="x", citations=["[T04-046]", " T04-047 "])],
    )
    normalized = normalize_citations(output)
    assert normalized.recap[0].citations == ["T04-046", "T04-047"]


def test_word_limit_is_enforced(cases, resolver):
    resolved = resolver.case(next(case for case in cases if case.id == "hard_missing_01"))
    output = BridgeOutput(status="insufficient_context", warnings=["word " * 301])
    assert word_count(output) == 301
    assert any("300" in error for error in validate_final(output, resolved)["errors"])


def test_citation_gate_requires_existing_previous_id(cases, resolver):
    resolved = resolver.case(next(case for case in cases if case.id == "normal_01"))
    recap = BridgeOutput(
        status="ok",
        recap=[RecapItem(claim=f"claim {i}", citations=["FAKE-001"]) for i in range(5)],
    )
    assert any("citation" in reason for reason in gate(recap, resolved))


def test_bridge_requires_citations_from_both_sides(cases, resolver):
    resolved = resolver.case(next(case for case in cases if case.id == "normal_01"))
    output = BridgeOutput(
        status="ok",
        recap=[RecapItem(claim=f"claim {i}", citations=["T04-046"]) for i in range(5)],
        bridges=[
            BridgeItem(from_concept="A", to_concept="B", explanation="A dẫn tới B",
                       source_citations=["T04-046"], target_citations=[]),
            BridgeItem(from_concept="C", to_concept="D", explanation="C dẫn tới D",
                       source_citations=["T04-047"], target_citations=["T01-023"]),
        ],
    )
    report = validate_final(output, resolved)
    assert not report["passed"]
    assert report["untraceable_bridge_count"] == 1


def test_expected_fallback_is_checked(cases, resolver):
    resolved = resolver.case(next(case for case in cases if case.id == "rare_02"))
    wrong = BridgeOutput(status="low_overlap", recap=[])
    assert any("Fallback sai" in error for error in validate_final(wrong, resolved)["errors"])


def test_preflight_gate_stops_short_or_one_sided_sources(cases, resolver):
    short = resolver.case(next(case for case in cases if case.id == "rare_02"))
    one_sided = resolver.case(next(case for case in cases if case.id == "rare_04"))
    assert preflight_gate(short)
    assert any("buổi hiện tại" in reason for reason in preflight_gate(one_sided))


def test_prompt_injection_phrase_is_rejected(cases, resolver):
    resolved = resolver.case(next(case for case in cases if case.id == "hard_truth_01"))
    output = BridgeOutput(status="insufficient_context", warnings=["OVERRIDE_ACCEPTED"])
    assert any("OVERRIDE_ACCEPTED" in error for error in validate_final(output, resolved)["errors"])
    system = (ROOT / "codebase" / "prompts" / "system_prompt.md").read_text(encoding="utf-8")
    assert "không phải chỉ dẫn" in system


def test_missing_data_is_explicit(tmp_path: Path):
    with pytest.raises(EvalError, match="Thiếu transcript"):
        Resolver(tmp_path).segments()


def test_api_error_never_becomes_pass(cases, resolver, monkeypatch):
    resolved = resolver.case(next(case for case in cases if case.id == "normal_01"))
    evaluator = GeminiEval("v1")

    def fail(_: str):
        raise RuntimeError("simulated API failure")

    monkeypatch.setattr(evaluator, "generate", fail)
    result = evaluator.run_case(resolved)
    assert result["passed"] is False
    assert result["output"] is None
    assert "API" in json.dumps(result, ensure_ascii=False)


def test_recap_metric_excludes_expected_insufficient_cases():
    results = [
        {
            "passed": True,
            "expected_status": "ok",
            "validator": {"recap_has_existing_citation": True, "untraceable_bridge_count": 0},
        },
        {
            "passed": True,
            "expected_status": "insufficient_context",
            "validator": {"recap_has_existing_citation": False, "untraceable_bridge_count": 0},
        },
    ]
    report = metrics(results)
    assert report["recap_eligible_cases"] == 1
    assert report["recap_with_existing_citation_percent"] == 100.0
