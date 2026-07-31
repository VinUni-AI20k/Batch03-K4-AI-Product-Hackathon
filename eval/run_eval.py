"""Offline runner/validator for eval/eval_suite.md.

This runner does not invent model outputs or claim pass/fail without an output
to grade. It validates the suite contract and writes a 25-case execution
manifest so the suite cannot silently regress to the old 22-case MCQ set.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path


REQUIRED_FIELDS = (
    "id",
    "category",
    "source",
    "source_detail",
    "input",
    "required_output",
    "forbidden_output",
    "severity",
)
CASE_HEADING = re.compile(r"^### (R[1-4]-\d+)$")
FIELD_LINE = re.compile(r"^- ([a-z_]+): (.*)$")


def parse_cases(path: Path) -> list[dict[str, str]]:
    cases: list[dict[str, str]] = []
    current: dict[str, str] | None = None

    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        heading = CASE_HEADING.match(line)
        if heading:
            if current is not None:
                current["_line"] = str(current_line)
                cases.append(current)
            current = {"id": heading.group(1)}
            current_line = line_number
            continue

        if current is not None:
            field = FIELD_LINE.match(line)
            if field:
                key, value = field.groups()
                current[key] = value.strip()

    if current is not None:
        current["_line"] = str(current_line)
        cases.append(current)
    return cases


def validate_cases(cases: list[dict[str, str]]) -> list[str]:
    errors: list[str] = []
    ids = [case.get("id", "") for case in cases]
    if len(cases) != 25:
        errors.append(f"expected 25 cases, found {len(cases)}")
    if len(set(ids)) != len(ids):
        errors.append("duplicate case id detected")

    expected_ids = [f"R{category}-{index:02d}" for category in range(1, 5) for index in range(1, 10)]
    # The suite has category-specific sequence lengths, so compare against the
    # actual declared IDs' shape and enforce the four category prefixes below.
    if any(not CASE_HEADING.match(f"### {case.get('id', '')}") for case in cases):
        errors.append("one or more case IDs do not match R<category>-<sequence>")

    for case in cases:
        case_id = case.get("id", "<missing>")
        missing = [field for field in REQUIRED_FIELDS if not case.get(field, "").strip()]
        if missing:
            errors.append(f"{case_id}: missing fields: {', '.join(missing)}")

        if case.get("category") not in {"1", "2", "3", "4"}:
            errors.append(f"{case_id}: category must be 1, 2, 3, or 4")
        if case.get("source") not in {"real_observed", "synthetic"}:
            errors.append(f"{case_id}: invalid source")
        if case.get("severity") not in {"critical", "major"}:
            errors.append(f"{case_id}: invalid severity")
        if case.get("source") == "real_observed" and not (
            "NEEDS_TEAM_INPUT" in case.get("source_detail", "")
            or "Respondent ID" in case.get("source_detail", "")
        ):
            errors.append(f"{case_id}: real_observed source_detail lacks respondent or NEEDS_TEAM_INPUT")
        if case.get("source") == "synthetic" and "NEEDS_TEAM_INPUT" in case.get("source_detail", ""):
            errors.append(f"{case_id}: synthetic case cannot contain NEEDS_TEAM_INPUT")

    return errors


def build_manifest(cases: list[dict[str, str]], errors: list[str]) -> dict:
    rows = []
    for case in cases:
        needs_input = "NEEDS_TEAM_INPUT" in case.get("source_detail", "")
        rows.append(
            {
                "id": case.get("id"),
                "category": int(case["category"]) if case.get("category", "").isdigit() else None,
                "source": case.get("source"),
                "severity": case.get("severity"),
                "status": "blocked_needs_team_input" if needs_input else "ready_for_manual_model_run",
                "evaluated": False,
                "pass": None,
            }
        )

    source_counts = Counter(case.get("source") for case in cases)
    category_counts = Counter(case.get("category") for case in cases)
    status_counts = Counter(row["status"] for row in rows)
    return {
        "suite": "In-Action Learning Buddy — Grounding eval suite",
        "runner": "eval/run_eval.py",
        "mode": "offline_contract_validation",
        "model_outputs_graded": False,
        "errors": errors,
        "summary": {
            "total_cases": len(cases),
            "real_observed": source_counts.get("real_observed", 0),
            "synthetic": source_counts.get("synthetic", 0),
            "needs_team_input": status_counts.get("blocked_needs_team_input", 0),
            "ready_for_manual_model_run": status_counts.get("ready_for_manual_model_run", 0),
            "evaluated": 0,
            "passed": None,
        },
        "cases": rows,
    }


def write_markdown(path: Path, manifest: dict) -> None:
    summary = manifest["summary"]
    lines = [
        "# Kết quả round 1 — kiểm tra suite grounding",
        "",
        f"**Tổng: {summary['total_cases']} case · Đã chấm output AI: 0**",
        "",
        "Runner này chỉ kiểm tra cấu trúc và khả năng chạy của suite offline; chưa có model output nên không gắn nhãn đạt/trượt.",
        "",
        "| Case | Category | Source | Severity | Trạng thái |",
        "|---|---:|---|---|---|",
    ]
    for case in manifest["cases"]:
        lines.append(
            f"| {case['id']} | {case['category']} | {case['source']} | {case['severity']} | {case['status']} |"
        )
    lines.extend(
        [
            "",
            "## Tóm tắt",
            "",
            f"- `real_observed`: {summary['real_observed']}",
            f"- `synthetic`: {summary['synthetic']}",
            f"- `NEEDS_TEAM_INPUT`: {summary['needs_team_input']}",
            f"- Sẵn sàng cho manual model run: {summary['ready_for_manual_model_run']}",
            "- Kết luận pass/fail: chưa chạy vì runner không được phép tự bịa output AI.",
        ]
    )
    if manifest["errors"]:
        lines.extend(["", "## Lỗi cấu trúc", ""])
        lines.extend(f"- {error}" for error in manifest["errors"])
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--suite", type=Path, default=Path(__file__).with_name("eval_suite.md"))
    parser.add_argument("--json", type=Path, default=Path(__file__).with_name("results-round1.json"))
    parser.add_argument("--markdown", type=Path, default=Path(__file__).with_name("results-round1.md"))
    args = parser.parse_args()

    cases = parse_cases(args.suite)
    errors = validate_cases(cases)
    manifest = build_manifest(cases, errors)
    args.json.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(args.markdown, manifest)

    print(
        f"Validated {manifest['summary']['total_cases']} cases; "
        f"{manifest['summary']['ready_for_manual_model_run']} ready, "
        f"{manifest['summary']['needs_team_input']} blocked, "
        f"{len(errors)} structural errors."
    )
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
