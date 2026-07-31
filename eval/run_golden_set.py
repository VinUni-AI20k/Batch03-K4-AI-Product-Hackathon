"""Run eval/golden-set.json against the live /recommend API and write eval/run-03.md.

Usage: python3 eval/run_golden_set.py [--api http://localhost:8001] [--out eval/run-03.md]

Only cases without a POST-able profile (currently R04 failure simulation) are marked
SKIPPED. Extra test metadata inside `input` is removed before calling the API; system
checks still require manual scoring using `what_it_tests`.
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STANDARD_KEYS = {
    "interest",
    "skills",
    "team_size",
    "difficulty",
    "profile_major",
    "experience_level",
    "profile_projects",
    "user_query",
    "conversation_context",
}


def call_api(base_url: str, payload: dict) -> tuple[int, dict | str]:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{base_url}/recommend", data=body, method="POST",
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read().decode("utf-8", errors="replace")
    except urllib.error.URLError as exc:
        return 0, str(exc.reason)


def is_postable(case: dict) -> bool:
    input_ = case["input"]
    return bool(STANDARD_KEYS & set(input_.keys())) and "simulate" not in input_


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--api", default="http://localhost:8001")
    parser.add_argument("--out", default=str(ROOT / "eval" / "run-03.md"))
    args = parser.parse_args()

    golden = json.loads((ROOT / "eval" / "golden-set.json").read_text(encoding="utf-8"))
    cases = golden["cases"]

    lines = [
        "# Eval run — lượt 3",
        "",
        f"API: `{args.api}` · Cases: {len(cases)} · Model: xem `codebase/server/.env` (`OPENROUTER_MODEL`).",
        "",
        "| Case | Layer | Status | ma_de trả về | confidence | Ghi chú tay cần điền |",
        "|---|---|---|---|---|---|",
    ]

    passed_auto = 0
    total_postable = 0

    for case in cases:
        case_id = case["id"]
        layer = case["layer"]
        input_ = case["input"]

        if not is_postable(case):
            lines.append(f"| {case_id} | {layer} | SKIPPED (chấm tay) | — | — | Xem `what_it_tests`: {case['what_it_tests'][:80]}... |")
            continue

        total_postable += 1
        payload = {k: v for k, v in input_.items() if k in STANDARD_KEYS}
        status, data = call_api(args.api, payload)

        if status != 200:
            lines.append(f"| {case_id} | {layer} | ERROR {status} | — | — | {str(data)[:100]} |")
            continue

        codes = [s["ma_de"] for s in data.get("selections", [])]
        confidence = data.get("confidence", "?")
        lines.append(f"| {case_id} | {layer} | RAN | {', '.join(codes) or '(rỗng)'} | {confidence} | Đối chiếu `expected` trong golden-set.json, ghi đạt/fail vào đây |")
        passed_auto += 1

    lines += [
        "",
        f"**Chạy được tự động: {passed_auto}/{total_postable} case gọi API thành công (không phải % đạt chất lượng).**",
        "",
        "## Cách chấm",
        "",
        "1. Với mỗi dòng RAN: mở `trace_id` tương ứng trong `codebase/server/logs/recommend_calls.jsonl`, đối chiếu `reasons`/`risk_note`/`confidence` với cột `expected` trong `golden-set.json`.",
        "2. Điền cột cuối: `pass` / `fail` + 1 câu lý do.",
        "3. L02/L06 vẫn gọi API nhưng có điều kiện hệ thống phải chấm tay qua log để xác nhận không có `ma_de` lạ; R04 là case SKIPPED, cần tắt server hoặc set sai `OPENROUTER_API_KEY` rồi thử trên UI.",
        f"4. Tính % = số case pass / {len(cases)} (tổng golden set hiện tại, kể cả SKIPPED sau khi chấm tay) — không chia trên số case RAN.",
    ]

    out_path = Path(args.out)
    out_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {out_path} — {passed_auto}/{total_postable} postable cases returned 200.")


if __name__ == "__main__":
    sys.exit(main())
