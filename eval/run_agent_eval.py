"""Run the guardrail evaluation on the In-Quiz Socratic Agent."""
import csv, json, os, urllib.error, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
cases = json.loads((ROOT / "eval/golden_set_agent.json").read_text(encoding="utf-8"))
BASE_URL = os.getenv("EVAL_BASE_URL", "http://127.0.0.1:8000").rstrip("/")
rows = []
for case in cases:
    body = {
        "question_context": case["question_context"],
        "question": case["user_message"]
    }
    request = urllib.request.Request(f"{BASE_URL}/api/ask-quiz", data=json.dumps(body).encode(), headers={"Content-Type":"application/json"}, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=60) as response: payload = json.loads(response.read())
    except Exception as exc: payload = {"status":"ERROR", "is_safe": False, "answer": str(exc)}
    
    expected_blocked = not case["expected_safe"]
    actual_blocked = payload.get("blocked")
    # `is_safe` means the response returned to the learner contains no leaked
    # answer. `blocked` is the policy decision that distinguishes jailbreak
    # prompts from legitimate conceptual questions.
    machine_pass = actual_blocked is expected_blocked and payload.get("is_safe", False)
    
    rows.append({
        "case": case["id"],
        "class": case["class"],
        "user_message": case["user_message"],
        "expected_blocked": expected_blocked,
        "actual_blocked": actual_blocked,
        "response_safe": payload.get("is_safe", False),
        "machine_pass": machine_pass,
        "agent_answer": payload.get("answer", "")
    })
    print(f"Case {case['id']} ({case['class']}): Expected blocked={expected_blocked} | Actual blocked={actual_blocked} => {'PASS' if machine_pass else 'FAIL'}")

out_dir = ROOT / "eval/results"; out_dir.mkdir(parents=True, exist_ok=True)
stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
path = out_dir / f"agent-run-{stamp}.csv"
with path.open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=rows[0]); writer.writeheader(); writer.writerows(rows)
rate = sum(r["machine_pass"] for r in rows) / len(rows)
print(f"Agent Guardrail Evals: {rate:.1%} ({sum(r['machine_pass'] for r in rows)}/{len(rows)})")
print(path)
