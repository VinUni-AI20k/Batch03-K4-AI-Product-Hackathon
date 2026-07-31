from __future__ import annotations

import argparse
import importlib
import json
import sys
import time
import traceback
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from statistics import mean
from typing import Any

ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))
CODEBASE = PROJECT_ROOT / "codebase"
if str(CODEBASE) not in sys.path:
    sys.path.insert(0, str(CODEBASE))
    
from llm import call_openai_api

from eval.metrics import bleu, exact_match, json_serializable, keyword_recall, percentile, rouge_l, set_scores

DEFAULT_CASES_DIR = ROOT / "cases"
DEFAULT_RESULTS_DIR = ROOT / "results"
DEFAULT_THRESHOLDS = {
    "keyword_recall": 1.0,
    "rouge_l": 0.25,
    "citation_recall": 1.0,
    "tool_call_recall": 1.0,
    "tool_call_precision": 1.0,
}


def load_cases(cases_dir: Path, selected_suites: set[str] | None) -> list[dict[str, Any]]:
    cases: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    for path in sorted(cases_dir.glob("*.json")):
        if path.name == "manifest.json" or (selected_suites and path.stem not in selected_suites):
            continue
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            raise ValueError(f"{path}: root must be a JSON array")
        for position, raw_case in enumerate(payload, start=1):
            if not isinstance(raw_case, dict) or not raw_case.get("id") or "input" not in raw_case:
                raise ValueError(f"{path}:{position}: case requires id and input")
            if raw_case["id"] in seen_ids:
                raise ValueError(f"Duplicate case id: {raw_case['id']}")
            seen_ids.add(raw_case["id"])
            case = dict(raw_case)
            case["suite"] = path.stem
            cases.append(case)
    return cases


def _boolean_check(result: dict[str, Any], key: str, expected: bool) -> float:
    return float(bool(result.get(key)) is bool(expected))


def llm_judge(prompt: str, answer: str, rubric: str) -> float:
    sys_prompt = (
        "Bạn là giám khảo AI. Hãy đánh giá xem 'Câu trả lời của Agent' có đáp ứng được 'Tiêu chí chấm (Rubric)' "
        "dựa trên 'Yêu cầu của User' hay không.\n"
        "Chỉ trả về ĐÚNG 1 KÝ TỰ SỐ: '1' nếu đạt, '0' nếu không đạt."
    )
    user_prompt = (
        f"Yêu cầu của User:\n{prompt}\n\n"
        f"Tiêu chí chấm (Rubric):\n{rubric}\n\n"
        f"Câu trả lời của Agent:\n{answer}\n\n"
        f"Đánh giá của bạn (1/0):"
    )
    try:
        score_text, _ = call_openai_api(f"{sys_prompt}\n\n{user_prompt}")
        if "1" in score_text:
            return 1.0
        return 0.0
    except Exception as e:
        print(f"LLM Judge error: {e}")
        return 0.0


def score_case(case: dict[str, Any], result: dict[str, Any], latency_ms: float, error: str | None) -> dict[str, Any]:
    expected = case.get("expected", {})
    answer = str(result.get("answer", ""))
    metrics: dict[str, float] = {}
    thresholds = {**DEFAULT_THRESHOLDS, **case.get("thresholds", {})}
    required: list[str] = []

    if "exact" in expected:
        metrics["exact_match"] = exact_match(str(expected["exact"]), answer)
        required.append("exact_match")
        thresholds.setdefault("exact_match", 1.0)
        
    is_generative = case.get("suite") in ("quiz_generation", "lesson_qa", "socratic_agent")
    
    if expected.get("keywords") is not None:
        metrics["keyword_recall"] = round(keyword_recall(answer, expected["keywords"]), 4)
        if not is_generative:
            required.append("keyword_recall")
            
    if expected.get("reference_answer"):
        reference = str(expected["reference_answer"])
        metrics["bleu"] = bleu(reference, answer)
        metrics["rouge_l"] = rouge_l(reference, answer)
        if is_generative:
            metrics["llm_judge"] = llm_judge(case.get("input", ""), answer, reference)
            required.append("llm_judge")
            thresholds.setdefault("llm_judge", 1.0)
    if "expected_citations" in case:
        citation = set_scores(case["expected_citations"], result.get("citations", []))
        metrics.update({f"citation_{key}": value for key, value in citation.items()})
        required.append("citation_recall")
    if "expected_tool_calls" in case:
        tool = set_scores(case["expected_tool_calls"], result.get("tool_calls", []))
        metrics.update({f"tool_call_{key}": value for key, value in tool.items()})
        required.extend(["tool_call_recall", "tool_call_precision"])
    for case_key, result_key, metric_name in (
        ("validator_should_block", "validator_blocked", "validator_pass"),
        ("integrity_should_pass", "integrity_ok", "integrity_pass"),
    ):
        if case_key in case:
            metrics[metric_name] = _boolean_check(result, result_key, bool(case[case_key]))
            thresholds.setdefault(metric_name, 1.0)
            required.append(metric_name)
    if "expected_quota_delta" in case:
        try:
            metrics["quota_pass"] = float(
                int(result.get("quota_delta")) == int(case["expected_quota_delta"])
            )
        except (TypeError, ValueError):
            metrics["quota_pass"] = 0.0
        thresholds.setdefault("quota_pass", 1.0)
        required.append("quota_pass")

    required.extend(case.get("required_metrics", []))
    required = list(dict.fromkeys(required))
    checks = {
        metric: metrics.get(metric, 0.0) >= float(thresholds.get(metric, 1.0))
        for metric in required
    }
    passed = error is None and bool(required) and all(checks.values())

    safe_result = result if json_serializable(result) else {"serialization_error": repr(result)}
    return {
        "case_id": case["id"],
        "suite": case["suite"],
        "tags": case.get("tags", []),
        "input": case["input"],
        "expected": expected,
        "result": safe_result,
        "latency_ms": round(latency_ms, 2),
        "error": error,
        "metrics": metrics,
        "required_checks": checks,
        "passed": passed,
    }


def run_one(adapter: Any, case: dict[str, Any]) -> tuple[dict[str, Any], float, str | None]:
    started = time.perf_counter()
    try:
        raw = adapter.run_case(dict(case))
        if not isinstance(raw, dict):
            raise TypeError(f"run_case must return dict, got {type(raw).__name__}")
        return raw, (time.perf_counter() - started) * 1000, None
    except Exception as exc:  # keep all failures in the evidence log
        error = f"{type(exc).__name__}: {exc}"
        return {
            "answer": "",
            "exception_trace": traceback.format_exc(limit=8),
        }, (time.perf_counter() - started) * 1000, error


def _metric_averages(rows: list[dict[str, Any]]) -> dict[str, float]:
    buckets: dict[str, list[float]] = defaultdict(list)
    for row in rows:
        for name, value in row["metrics"].items():
            if isinstance(value, (int, float)):
                buckets[name].append(float(value))
    return {name: round(mean(values), 4) for name, values in sorted(buckets.items())}


def summarize(rows: list[dict[str, Any]], quality_bar: float, adapter_name: str) -> dict[str, Any]:
    by_suite: dict[str, dict[str, Any]] = {}
    for suite in sorted({row["suite"] for row in rows}):
        suite_rows = [row for row in rows if row["suite"] == suite]
        passed = sum(row["passed"] for row in suite_rows)
        by_suite[suite] = {
            "total": len(suite_rows),
            "passed": passed,
            "pass_rate": round(passed / len(suite_rows), 4),
            "metrics": _metric_averages(suite_rows),
            "latency_p50_ms": percentile([row["latency_ms"] for row in suite_rows], 0.5),
            "latency_p95_ms": percentile([row["latency_ms"] for row in suite_rows], 0.95),
        }

    passed = sum(row["passed"] for row in rows)
    pass_rate = round(passed / len(rows), 4) if rows else 0.0
    latencies = [row["latency_ms"] for row in rows]
    return {
        "schema_version": "2.0",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "adapter": adapter_name,
        "total_cases": len(rows),
        "passed": passed,
        "failed": len(rows) - passed,
        "errors": sum(row["error"] is not None for row in rows),
        "pass_rate": pass_rate,
        "quality_bar": quality_bar,
        "meets_quality_bar": pass_rate >= quality_bar,
        "latency": {
            "mean_ms": round(mean(latencies), 2) if latencies else None,
            "p50_ms": percentile(latencies, 0.5),
            "p95_ms": percentile(latencies, 0.95),
            "max_ms": round(max(latencies), 2) if latencies else None,
        },
        "metrics": _metric_averages(rows),
        "by_suite": by_suite,
        "failed_cases": [
            {
                "case_id": row["case_id"],
                "suite": row["suite"],
                "error": row["error"],
                "failed_checks": [key for key, ok in row["required_checks"].items() if not ok],
            }
            for row in rows
            if not row["passed"]
        ],
    }


def write_markdown(path: Path, summary: dict[str, Any]) -> None:
    lines = [
        "# Agent Evaluation Report",
        "",
        f"- Adapter: `{summary['adapter']}`",
        f"- Cases: **{summary['passed']}/{summary['total_cases']} passed** ({summary['pass_rate']:.1%})",
        f"- Quality bar: **{summary['quality_bar']:.0%}** — {'PASS' if summary['meets_quality_bar'] else 'FAIL'}",
        f"- Runtime errors: **{summary['errors']}**",
        f"- Latency p50 / p95: **{summary['latency']['p50_ms']} / {summary['latency']['p95_ms']} ms**",
        "",
        "## Performance by agent/module",
        "",
        "| Suite | Passed | Pass rate | p50 ms | p95 ms |",
        "|---|---:|---:|---:|---:|",
    ]
    for suite, stats in summary["by_suite"].items():
        lines.append(
            f"| {suite} | {stats['passed']}/{stats['total']} | "
            f"{stats['pass_rate']:.1%} | {stats['latency_p50_ms']} | {stats['latency_p95_ms']} |"
        )
    lines.extend(["", "## Aggregate metrics", ""])
    for name, value in summary["metrics"].items():
        lines.append(f"- {name}: {value:.4f}")
    lines.extend(["", "## Failed cases", ""])
    if not summary["failed_cases"]:
        lines.append("- None")
    for failure in summary["failed_cases"]:
        reason = ", ".join(failure["failed_checks"]) or failure["error"] or "unknown"
        lines.append(f"- `{failure['suite']}::{failure['case_id']}` — {reason}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Evaluate all VLearn modules with auditable JSON cases."
    )
    parser.add_argument("--adapter", required=True, help="Module exporting run_case(case) -> dict")
    parser.add_argument("--suite", action="append", help="Suite filename stem; repeat to select several")
    parser.add_argument("--cases-dir", type=Path, default=DEFAULT_CASES_DIR)
    parser.add_argument("--results-dir", type=Path, default=DEFAULT_RESULTS_DIR)
    parser.add_argument("--run-name", help="Stable output folder name; default is UTC timestamp")
    parser.add_argument("--quality-bar", type=float, default=0.8)
    parser.add_argument("--fail-under", action="store_true", help="Exit 1 if quality bar is not met")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not 0 <= args.quality_bar <= 1:
        raise SystemExit("--quality-bar must be between 0 and 1")
    adapter = importlib.import_module(args.adapter)
    if not callable(getattr(adapter, "run_case", None)):
        raise SystemExit(f"{args.adapter} does not export callable run_case(case)")

    cases = load_cases(args.cases_dir, set(args.suite) if args.suite else None)
    if not cases:
        raise SystemExit("No cases found")

    rows = []
    for case in cases:
        result, latency_ms, error = run_one(adapter, case)
        rows.append(score_case(case, result, latency_ms, error))

    run_name = args.run_name or datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    output_dir = args.results_dir / run_name
    output_dir.mkdir(parents=True, exist_ok=False)
    summary = summarize(rows, args.quality_bar, args.adapter)
    (output_dir / "case_logs.json").write_text(
        json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (output_dir / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    write_markdown(output_dir / "summary.md", summary)
    print(json.dumps({"results_dir": str(output_dir), "summary": summary}, ensure_ascii=False, indent=2))
    return 1 if args.fail_under and not summary["meets_quality_bar"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
