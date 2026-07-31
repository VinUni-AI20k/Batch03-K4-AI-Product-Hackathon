#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone

from pydantic import ValidationError

from eval_core import (
    ROOT, EvalError, GeminiEval, Resolver, load_golden, metrics, summarize_completed,
    validate_assets, write_json,
)


def validate_command(_: argparse.Namespace) -> int:
    report = validate_assets(load_golden(), Resolver())
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["valid"] else 1


def smoke_command(args: argparse.Namespace) -> int:
    cases = load_golden()
    case = next((case for case in cases if case.id == args.case), None)
    if case is None:
        raise EvalError(f"Không có case {args.case}")
    evaluator = GeminiEval(args.prompt_version)
    evaluator.ready()
    result = evaluator.run_case(Resolver().case(case))
    path = ROOT / "eval" / "results" / f"smoke_{case.id}.json"
    write_json(path, result)
    print(f"Ghi {path}; passed={result['passed']}")
    return 0 if result["passed"] else 1


def run_command(args: argparse.Namespace) -> int:
    cases, resolver = load_golden(), Resolver()
    validation = validate_assets(cases, resolver)
    if not validation["valid"]:
        print(json.dumps(validation, ensure_ascii=False, indent=2), file=sys.stderr)
        return 1
    evaluator = GeminiEval(args.prompt_version)
    evaluator.ready()  # Không key: dừng trước khi tạo artifact.
    path = ROOT / "eval" / "results" / f"round_{args.round}.json"
    results_by_id = {}
    if args.resume:
        if not path.exists():
            raise EvalError(f"Không thể resume vì chưa có {path}")
        previous = json.loads(path.read_text(encoding="utf-8"))
        if previous.get("prompt_version") != args.prompt_version:
            raise EvalError("Prompt version của round cũ không khớp")
        if any(item.get("model") != evaluator.model for item in previous.get("results", [])):
            raise EvalError("Model của round cũ không khớp model hiện tại")
        results_by_id = {item["case_id"]: item for item in previous["results"]}
        targets = [case for case in cases if not results_by_id.get(case.id, {}).get("passed")]
    else:
        targets = cases

    for index, case in enumerate(targets, 1):
        print(f"[{index:02d}/{len(targets):02d}] {case.id}", flush=True)
        results_by_id[case.id] = evaluator.run_case(resolver.case(case))
        if args.resume:
            ordered = [results_by_id[case.id] for case in cases]
            checkpoint = {
                "round": args.round,
                "created_at_utc": datetime.now(timezone.utc).isoformat(),
                "prompt_version": args.prompt_version,
                "results": ordered,
                "metrics": metrics(ordered),
            }
            write_json(path, checkpoint)

    results = [results_by_id[case.id] for case in cases]
    payload = {
        "round": args.round,
        "created_at_utc": datetime.now(timezone.utc).isoformat(),
        "prompt_version": args.prompt_version,
        "results": results,
        "metrics": metrics(results),
    }
    write_json(path, payload)
    print(json.dumps(payload["metrics"], ensure_ascii=False, indent=2))
    return 0 if all(item["passed"] for item in results) else 1


def summarize_command(_: argparse.Namespace) -> int:
    summary = summarize_completed()
    write_json(ROOT / "eval" / "results" / "summary.json", summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(description="Eval độc lập cho recap + bridge")
    commands = root.add_subparsers(required=True)
    validate = commands.add_parser("validate", help="Validate asset, không gọi API")
    validate.set_defaults(function=validate_command)
    smoke = commands.add_parser("smoke", help="Chạy một case thật")
    smoke.add_argument("--case", default="normal_01")
    smoke.add_argument("--prompt-version", choices=("v1", "v2"), default="v1")
    smoke.set_defaults(function=smoke_command)
    run = commands.add_parser("run", help="Chạy đủ 22 case")
    run.add_argument("--round", choices=(1, 2), type=int, required=True)
    run.add_argument("--prompt-version", choices=("v1", "v2"), required=True)
    run.add_argument("--resume", action="store_true", help="Chỉ chạy lại case fail của round hiện có")
    run.set_defaults(function=run_command)
    summarize = commands.add_parser("summarize", help="Tổng hợp sau hai round và hai review")
    summarize.set_defaults(function=summarize_command)
    return root


def main() -> int:
    args = parser().parse_args()
    try:
        return args.function(args)
    except (EvalError, FileNotFoundError, ValidationError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
