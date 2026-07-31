#!/usr/bin/env python3
"""Semantic benchmark for the 03-template-ai-spec codelab cases.

The script deliberately uses only the Python standard library. It validates
source-grounding expectations first, then checks a generated Markdown output
for required facts and paths. It does not call an LLM or any external API.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
CASE_DIR = Path(__file__).resolve().parent / "cases"
PROGRAM_RUBRIC_PATH = Path(__file__).resolve().parent / "program_rubric.json"


@dataclass
class Finding:
    level: str
    message: str


def load_case(case_id: str) -> dict:
    path = CASE_DIR / f"{case_id}.json"
    if not path.is_file():
        raise FileNotFoundError(f"Unknown case: {case_id}")
    return json.loads(path.read_text(encoding="utf-8"))


def program_rubric_findings() -> list[Finding]:
    if not PROGRAM_RUBRIC_PATH.is_file():
        return [Finding("ERROR", f"program rubric manifest missing: {PROGRAM_RUBRIC_PATH}")]
    data = json.loads(PROGRAM_RUBRIC_PATH.read_text(encoding="utf-8"))
    findings: list[Finding] = []
    checkpoint_points = sum(item["points"] for item in data["checkpoint_submission"])
    rubric_points = sum(item["points"] for item in data["rubric"])
    rubric_ids = [item["id"] for item in data["rubric"]]
    checkpoint_ids = [item["id"] for item in data["checkpoint_submission"]]
    if checkpoint_points != 25:
        findings.append(Finding("ERROR", f"checkpoint points must total 25, got {checkpoint_points}"))
    if rubric_points != 75:
        findings.append(Finding("ERROR", f"R1-R7 points must total 75, got {rubric_points}"))
    if rubric_ids != ["R1", "R2", "R3", "R4", "R5", "R6", "R7"]:
        findings.append(Finding("ERROR", f"rubric IDs are not R1-R7: {rubric_ids}"))
    if checkpoint_ids != ["CP1", "CP2", "CP3", "CP4", "CP5"]:
        findings.append(Finding("ERROR", f"checkpoint IDs are not CP1-CP5: {checkpoint_ids}"))
    if data.get("total_points") != checkpoint_points + rubric_points:
        findings.append(Finding("ERROR", "program total_points does not match checkpoint + rubric points"))
    limitations = {item["id"]: item for item in data.get("evaluation_limitations", [])}
    golden_limit = limitations.get("R4-golden-set-20")
    if not golden_limit or golden_limit.get("status") != "not_executed":
        findings.append(Finding("ERROR", "R4 20-case limitation must be marked not_executed"))
    if not findings:
        findings.append(Finding("PASS", "program rubric manifest matches 25 + 75 = 100 points"))
    return findings


def read_case_source(case: dict, repo_root: Path) -> list[Finding]:
    findings: list[Finding] = []
    fixture_root = repo_root / case["fixture_root"]
    source_file = case.get("source_file")
    for check in case["source_checks"]:
        relative = Path(check["path"])
        path = fixture_root / relative
        if not path.is_file():
            findings.append(Finding("ERROR", f"source file missing: {path}"))
            continue
        text = path.read_text(encoding="utf-8")
        for needle in check["contains"]:
            if needle not in text:
                findings.append(Finding("ERROR", f"source evidence missing: {relative}: {needle}"))
    if source_file and not (fixture_root / source_file).is_file():
        findings.append(Finding("ERROR", f"declared source_file missing: {fixture_root / source_file}"))
    if not findings:
        findings.append(Finding("PASS", f"source contract verified for {case['title']}"))
    return findings


def normalized(text: str) -> str:
    return re.sub(r"\s+", " ", text).casefold()


def output_findings(case: dict, output_path: Path) -> list[Finding]:
    if not output_path.is_file():
        return [Finding("ERROR", f"output file missing: {output_path}")]
    return output_findings_text(case, output_path.read_text(encoding="utf-8"), str(output_path))


def output_findings_text(case: dict, text: str, output_label: str = "<memory>") -> list[Finding]:
    findings: list[Finding] = []
    compact = normalized(text)
    for term in case["required_output_terms"]:
        if normalized(term) not in compact:
            findings.append(Finding("ERROR", f"required output term missing: {term}"))
    for path in case["required_paths"]:
        if path.casefold() not in compact:
            findings.append(Finding("ERROR", f"required output path missing: {path}"))
    for term in case.get("forbidden_output_terms", []):
        if normalized(term) in compact:
            findings.append(Finding("ERROR", f"forbidden output claim found: {term}"))
    for path in case.get("expected_new_paths", []):
        path_pattern = re.compile(rf"(?:FILE\s*MỚI|NEW\s*FILE).{{0,100}}{re.escape(path)}|{re.escape(path)}.{{0,100}}(?:FILE\s*MỚI|NEW\s*FILE)", re.I | re.S)
        if not path_pattern.search(text):
            findings.append(Finding("ERROR", f"new path is not marked FILE MỚI/NEW FILE: {path}"))
    for path in case.get("expected_local_only_paths", []):
        path_pattern = re.compile(rf"{re.escape(path)}.{{0,100}}(?:KHÔNG\s*COMMIT|DO\s*NOT\s*COMMIT)|(?:KHÔNG\s*COMMIT|DO\s*NOT\s*COMMIT).{{0,100}}{re.escape(path)}", re.I | re.S)
        if not path_pattern.search(text):
            findings.append(Finding("ERROR", f"local-only path is not marked KHÔNG COMMIT/DO NOT COMMIT: {path}"))
    if not findings:
        findings.append(Finding("PASS", f"semantic output contract verified for {case['title']}"))
    return findings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--case", choices=("day3", "day4"), required=True)
    parser.add_argument("--output", type=Path, help="Generated CODELAB.md to evaluate")
    parser.add_argument("--repo-root", type=Path, default=ROOT)
    parser.add_argument("--source-only", action="store_true", help="Skip generated-output checks")
    args = parser.parse_args(argv)

    case = load_case(args.case)
    findings = program_rubric_findings()
    findings.extend(read_case_source(case, args.repo_root.resolve()))
    if not args.source_only:
        if args.output is None:
            parser.error("--output is required unless --source-only is used")
        findings.extend(output_findings(case, args.output.resolve()))

    errors = [f for f in findings if f.level == "ERROR"]
    for finding in findings:
        print(f"[{finding.level}] {finding.message}")
    if errors:
        print(f"FAIL: {len(errors)} expectation(s) failed")
        return 1
    print(f"PASS: {case['id']} benchmark")
    return 0


if __name__ == "__main__":
    sys.exit(main())
