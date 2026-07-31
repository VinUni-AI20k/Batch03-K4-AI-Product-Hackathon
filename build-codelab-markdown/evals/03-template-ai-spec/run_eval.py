#!/usr/bin/env python3
"""Run both 03-template-ai-spec benchmark cases without network access."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


HERE = Path(__file__).resolve().parent
EVALUATOR = HERE / "evaluate_output.py"
REPO_ROOT = HERE.parents[2]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--day3-output", type=Path)
    parser.add_argument("--day4-output", type=Path)
    args = parser.parse_args(argv)
    if bool(args.day3_output) != bool(args.day4_output):
        parser.error("pass both --day3-output and --day4-output, or neither")

    command_results = []
    for case_id, output in (("day3", args.day3_output), ("day4", args.day4_output)):
        command = [sys.executable, str(EVALUATOR), "--case", case_id]
        if output is None:
            command.append("--source-only")
        else:
            command.extend(["--output", str(output)])
        result = subprocess.run(command, cwd=REPO_ROOT, check=False)
        command_results.append(result.returncode)
    return 1 if any(command_results) else 0


if __name__ == "__main__":
    sys.exit(main())
