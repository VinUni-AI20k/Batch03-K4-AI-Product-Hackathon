from __future__ import annotations

import argparse
import json
import os
import re
import urllib.error
import urllib.request
from pathlib import Path

from eval import evaluate_case, score

ROOT = Path(__file__).resolve().parent.parent
GOLDEN = Path(__file__).resolve().parent / "golden_set.json"


def load_env() -> None:
    for env_path in [ROOT / ".env", ROOT / "codebase" / ".env"]:
        if not env_path.exists():
            continue
        for raw in env_path.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key.strip(), value)


def call_gemini(api_key: str, model: str, prompt: str) -> str:
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={api_key}"
    )

    body = {
        "contents": [{
            "parts": [{
                "text": (
                    "Bạn là VLearn AI Tutor. Trả lời dựa trên context của VLearn. "
                    "Không bịa nguồn. Nếu thiếu thông tin, nói rõ thiếu thông tin. "
                    "Giữ câu trả lời ngắn gọn nhưng đủ để đánh giá test.\n\n"
                    f"USER TEST:\n{prompt}"
                )
            }]
        }]
    }

    request = urllib.request.Request(
        url,
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=60) as response:
        data = json.loads(response.read().decode("utf-8"))

    return (
        data.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "")
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default=None)
    parser.add_argument("--case", default=None)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    load_env()

    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    model = args.model or os.getenv("GEMINI_MODEL", "").strip()

    if not api_key:
        print("ERROR: GEMINI_API_KEY not found.")
        print("Set it in the root .env file.")
        return 1

    if not model:
        print("ERROR: GEMINI_MODEL not found.")
        print("Set GEMINI_MODEL in .env, matching the model used by VLearn.")
        return 1

    cases = json.loads(GOLDEN.read_text(encoding="utf-8"))
    if args.case:
        cases = [c for c in cases if c["id"] == args.case]
        if not cases:
            print(f"ERROR: Case {args.case} not found.")
            return 1

    results = []

    for i, case in enumerate(cases, 1):
        print(f"Running {case['id']} ({i}/{len(cases)})...", end=" ", flush=True)
        try:
            response = call_gemini(api_key, model, case["input"])
            result, reason = evaluate_case(case, response)
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            result, reason = "FAIL", f"HTTP {e.code}: {body[:300]}"
            response = ""
        except Exception as e:
            result, reason = "FAIL", str(e)
            response = ""

        results.append({
            "id": case["id"],
            "type": case["type"],
            "result": result,
            "reason": reason,
            "response": response,
        })
        print(result)

    summary = score(results)
    report = {
        "model": model,
        "summary": summary,
        "cases": results,
    }

    Path(__file__).resolve().parent.joinpath("results.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 0

    print("\n" + "=" * 72)
    print("VLEARN LIVE GOLDEN SET EVALUATION")
    print("=" * 72)
    print(f"Model : {model}")
    for r in results:
        print(f"{r['id']:6} {r['result']:4} | {r['reason']}")
    print("-" * 72)
    print(
        f"TOTAL={summary['total']} | PASS={summary['passed']} | "
        f"FAIL={summary['failed']} | SCORE={summary['score']}%"
    )
    print("=" * 72)
    print(f"Saved: eval/results.json")

    return 0 if summary["failed"] == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())