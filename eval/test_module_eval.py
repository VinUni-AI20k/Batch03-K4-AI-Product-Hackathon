from __future__ import annotations

import unittest
from pathlib import Path

from eval.metrics import bleu, keyword_recall, rouge_l, set_scores
from eval.adapters import faulty_vlearn_adapter, mock_vlearn_adapter
from eval.run_module_eval import load_cases, score_case, summarize


class MetricTests(unittest.TestCase):
    def test_keyword_recall_is_fractional(self) -> None:
        self.assertEqual(keyword_recall("AI dùng dữ liệu", ["AI", "dữ liệu"]), 1.0)
        self.assertEqual(keyword_recall("AI", ["AI", "dữ liệu"]), 0.5)

    def test_set_scores_penalize_extra_tools(self) -> None:
        scores = set_scores(["retrieve"], ["retrieve", "unsafe_tool"])
        self.assertEqual(scores["recall"], 1.0)
        self.assertEqual(scores["precision"], 0.5)

    def test_text_metrics_are_bounded(self) -> None:
        for value in (bleu("một hai ba", "một hai"), rouge_l("một hai ba", "một hai")):
            self.assertGreaterEqual(value, 0)
            self.assertLessEqual(value, 1)

    def test_rouge_with_no_overlap_is_zero(self) -> None:
        self.assertEqual(rouge_l("alpha beta", "gamma delta"), 0.0)


class ScoringTests(unittest.TestCase):
    def test_contract_fixture_passes_every_golden_case(self) -> None:
        cases = load_cases(Path(__file__).with_name("cases"), selected_suites=None)
        rows = [
            score_case(case, mock_vlearn_adapter.run_case(case), latency_ms=0, error=None)
            for case in cases
        ]
        self.assertEqual(len(rows), 20)
        self.assertTrue(all(row["passed"] for row in rows))

    def test_faulty_fixture_is_rejected(self) -> None:
        case = {
            "id": "qa_broken",
            "suite": "lesson_qa",
            "input": "x",
            "expected": {"keywords": ["đúng"]},
            "expected_citations": ["T1"],
            "expected_tool_calls": ["retrieve"],
        }
        row = score_case(case, faulty_vlearn_adapter.run_case(case), latency_ms=0, error=None)
        self.assertFalse(row["passed"])
        self.assertFalse(row["required_checks"]["citation_recall"])
        self.assertFalse(row["required_checks"]["tool_call_precision"])

    def test_tool_and_citation_are_required(self) -> None:
        case = {
            "id": "qa_1",
            "suite": "lesson_qa",
            "input": "x",
            "expected": {"keywords": ["đúng"]},
            "expected_citations": ["T1"],
            "expected_tool_calls": ["retrieve"],
        }
        row = score_case(
            case,
            {"answer": "đúng", "citations": [], "tool_calls": ["retrieve"]},
            latency_ms=10,
            error=None,
        )
        self.assertFalse(row["passed"])
        self.assertFalse(row["required_checks"]["citation_recall"])

    def test_exception_always_fails(self) -> None:
        case = {
            "id": "x",
            "suite": "validator_guardrails",
            "input": "x",
            "expected": {"keywords": ["x"]},
        }
        row = score_case(case, {"answer": "x"}, 1, "RuntimeError: boom")
        self.assertFalse(row["passed"])

    def test_summary_is_grouped_by_suite(self) -> None:
        base = {
            "tags": [],
            "expected": {},
            "result": {},
            "latency_ms": 5,
            "error": None,
            "metrics": {"keyword_recall": 1.0},
            "required_checks": {"keyword_recall": True},
            "passed": True,
        }
        rows = [
            {**base, "case_id": "a", "suite": "qa", "input": "a"},
            {**base, "case_id": "b", "suite": "quiz", "input": "b", "passed": False},
        ]
        summary = summarize(rows, 0.8, "test.adapter")
        self.assertEqual(summary["total_cases"], 2)
        self.assertEqual(summary["pass_rate"], 0.5)
        self.assertEqual(set(summary["by_suite"]), {"qa", "quiz"})


if __name__ == "__main__":
    unittest.main()
