#!/usr/bin/env python3
"""Kiểm tra schema và độ phủ theo yêu cầu của golden set."""

import json
import sys
from collections import Counter
from pathlib import Path


DATASET = Path(__file__).with_name("golden_set.jsonl")
GROUP_TARGETS = {"normal": (8, 10), "risk": (8, None), "rare": (2, 4)}
RISK_CLASSES = {"source_truth", "ambiguity", "scope", "domain"}
ACTIONS = {"answer", "clarify", "refuse"}


def fail(message):
    print(f"LỖI: {message}", file=sys.stderr)
    return 1


def main():
    errors = 0
    cases = []
    with DATASET.open(encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, 1):
            try:
                case = json.loads(line)
            except json.JSONDecodeError as exc:
                errors += fail(f"dòng {line_number}: JSON không hợp lệ: {exc}")
                continue
            cases.append(case)

    ids = [case.get("id") for case in cases]
    duplicates = [case_id for case_id, count in Counter(ids).items() if count > 1]
    if duplicates:
        errors += fail(f"ID bị trùng: {', '.join(duplicates)}")

    required_top = {
        "id", "group", "risk_class", "rare", "critical", "source", "input",
        "expected", "reference_segments",
    }
    required_expected = {
        "action", "must_include", "must_not", "citation_required",
        "allowed_pages", "uncertainty_rule", "next_step",
    }
    for case in cases:
        case_id = case.get("id", "<missing>")
        missing = required_top - case.keys()
        if missing:
            errors += fail(f"{case_id}: thiếu field {sorted(missing)}")
            continue
        if required_expected - case["expected"].keys():
            errors += fail(f"{case_id}: block expected chưa đầy đủ")
        if case["expected"].get("action") not in ACTIONS:
            errors += fail(f"{case_id}: action không hợp lệ")
        if not case["expected"].get("must_include"):
            errors += fail(f"{case_id}: must_include không được rỗng")
        if not case["expected"].get("must_not"):
            errors += fail(f"{case_id}: must_not không được rỗng")
        if case["expected"].get("citation_required") and not case["expected"].get("allowed_pages"):
            errors += fail(f"{case_id}: yêu cầu citation nhưng không có trang được phép")
        if case["source"].get("type") == "chatlog" and not case["source"].get("turn_id"):
            errors += fail(f"{case_id}: nguồn chatlog thiếu turn_id")

    groups = Counter(case["group"] for case in cases)
    for group, (minimum, maximum) in GROUP_TARGETS.items():
        count = groups[group]
        if count < minimum or (maximum is not None and count > maximum):
            errors += fail(f"nhóm {group}: có {count}, cần {minimum}..{maximum or 'vô hạn'}")

    risk_counts = Counter(
        case["risk_class"] for case in cases if case["group"] == "risk"
    )
    for risk_class in RISK_CLASSES:
        if risk_counts[risk_class] < 2:
            errors += fail(f"lớp rủi ro {risk_class}: cần >=2, hiện có {risk_counts[risk_class]}")

    real_count = sum(case["source"].get("type") == "chatlog" for case in cases)
    if real_count < 10:
        errors += fail(f"cần >=10 case từ chatlog, hiện có {real_count}")
    if len(cases) < 20:
        errors += fail(f"cần tổng >=20 case, hiện có {len(cases)}")

    if errors:
        return 1
    print(f"OK: {len(cases)} case; nhóm={dict(groups)}; từ chatlog={real_count}")
    print(f"OK: độ phủ rủi ro={dict(sorted(risk_counts.items()))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
