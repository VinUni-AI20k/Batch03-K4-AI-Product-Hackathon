# STANDALONE TEST — all dependencies use the Python standard library. No project installation required.

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).parents[1]
SCRIPT = ROOT / "eval" / "validate_golden_set.py"
FILENAMES = [
    "01_happy_path.json",
    "02_missing_information.json",
    "03_source_of_truth.json",
    "04_out_of_scope.json",
    "05_domain_edge_cases.json",
]


def make_case(case_id: str, url: str | None = None) -> dict[str, object]:
    return {
        "id": case_id,
        "category": "test",
        "rarity": "normal",
        "input": "input",
        "repository_url": url,
        "expected_behavior": ["behavior"],
        "quality_dimensions": ["grounding"],
        "pass_criteria": ["criterion"],
        "source_reference": "synthetic:test",
    }


def run_validator(case_factory) -> subprocess.CompletedProcess[str]:
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        shutil.copy(SCRIPT, root / SCRIPT.name)
        index = 0
        for filename in FILENAMES:
            cases = []
            for _ in range(4):
                index += 1
                cases.append(case_factory(index))
            (root / filename).write_text(json.dumps({"cases": cases}), encoding="utf-8")
        return subprocess.run(
            [sys.executable, str(root / SCRIPT.name)],
            cwd=root,
            text=True,
            capture_output=True,
            check=False,
        )


def test_validator_when_valid_golden_set_passes() -> None:
    # Arrange
    result = run_validator(lambda index: make_case(f"C{index:02d}"))

    # Act
    output = result.stdout

    # Assert
    assert result.returncode == 0 and "VALIDATION PASSED: 5 files, 20 cases, 20 unique ids" in output


def test_validator_when_duplicate_ids_fails() -> None:
    # Arrange
    result = run_validator(lambda _: make_case("DUPLICATE"))

    # Act
    output = result.stdout

    # Assert
    assert result.returncode == 1 and "Duplicate case id: DUPLICATE" in output


def test_validator_when_repository_url_is_not_https_fails() -> None:
    # Arrange
    result = run_validator(lambda index: make_case(f"C{index:02d}", "http://example.com/repo"))

    # Act
    output = result.stdout

    # Assert
    assert result.returncode == 1 and "repository_url must be an HTTPS URL or null" in output


def test_validator_when_extra_case_file_exists_fails() -> None:
    # Arrange
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        shutil.copy(SCRIPT, root / SCRIPT.name)
        index = 0
        for filename in FILENAMES:
            cases = []
            for _ in range(4):
                index += 1
                cases.append(make_case(f"C{index:02d}"))
            (root / filename).write_text(json.dumps({"cases": cases}), encoding="utf-8")
        (root / "06_unexpected.json").write_text(json.dumps({"cases": []}), encoding="utf-8")

        result = subprocess.run(
            [sys.executable, str(root / SCRIPT.name)],
            cwd=root,
            text=True,
            capture_output=True,
            check=False,
        )

    # Act
    output = result.stdout

    # Assert
    assert result.returncode == 1 and "Unexpected case file: 06_unexpected.json" in output


if __name__ == "__main__":
    tests = [
        test_validator_when_valid_golden_set_passes,
        test_validator_when_duplicate_ids_fails,
        test_validator_when_repository_url_is_not_https_fails,
        test_validator_when_extra_case_file_exists_fails,
    ]
    for test in tests:
        test()
        print(f"PASS {test.__name__}")
