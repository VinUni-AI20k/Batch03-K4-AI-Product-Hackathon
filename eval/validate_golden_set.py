#!/usr/bin/env python3
"""Validate the Lab Guide golden set without calling an AI provider."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from urllib.parse import urlparse


EXPECTED_FILES = [
    "01_happy_path.json",
    "02_missing_information.json",
    "03_source_of_truth.json",
    "04_out_of_scope.json",
    "05_domain_edge_cases.json",
]
REQUIRED_FIELDS = {
    "id",
    "category",
    "rarity",
    "input",
    "repository_url",
    "expected_behavior",
    "quality_dimensions",
    "pass_criteria",
    "source_reference",
}


def main() -> int:
    root = Path(__file__).parent
    errors: list[str] = []
    case_ids: set[str] = set()
    total_cases = 0

    expected = set(EXPECTED_FILES)
    for path in root.glob("*.json"):
        if path.name not in expected:
            errors.append(f"Unexpected case file: {path.name}")

    for filename in EXPECTED_FILES:
        path = root / filename
        if not path.exists():
            errors.append(f"Missing required file: {filename}")
            continue
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f"Invalid JSON in {filename}: {exc.msg}")
            continue

        cases = data.get("cases")
        if not isinstance(cases, list) or len(cases) != 4:
            errors.append(f"{filename} must contain exactly 4 cases")
            continue
        total_cases += len(cases)

        for index, case in enumerate(cases, start=1):
            location = f"{filename} case {index}"
            if not isinstance(case, dict):
                errors.append(f"{location} must be an object")
                continue
            missing = REQUIRED_FIELDS - case.keys()
            if missing:
                errors.append(f"{location} is missing: {', '.join(sorted(missing))}")
                continue
            case_id = case["id"]
            if not isinstance(case_id, str) or not case_id:
                errors.append(f"{location} has an invalid id")
            elif case_id in case_ids:
                errors.append(f"Duplicate case id: {case_id}")
            else:
                case_ids.add(case_id)
            for field in ("expected_behavior", "quality_dimensions", "pass_criteria"):
                if not isinstance(case[field], list) or not case[field]:
                    errors.append(f"{location} field {field} must be a non-empty list")
            url = case["repository_url"]
            if url is not None:
                parsed = urlparse(url) if isinstance(url, str) else None
                if not parsed or parsed.scheme != "https" or not parsed.netloc:
                    errors.append(f"{location} repository_url must be an HTTPS URL or null")

    if total_cases != 20:
        errors.append(f"Golden set must contain 20 cases; found {total_cases}")
    if errors:
        print("VALIDATION FAILED")
        print(*[f"- {error}" for error in errors], sep="\n")
        return 1
    print(f"VALIDATION PASSED: {len(EXPECTED_FILES)} files, {total_cases} cases, {len(case_ids)} unique ids")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
