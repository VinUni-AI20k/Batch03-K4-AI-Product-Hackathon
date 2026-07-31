"""Run the complete golden set against the local API and write an honest result table."""
import csv, json, urllib.error, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
cases = json.loads((ROOT / "eval/golden_set.json").read_text())
rows = []
for case in cases:
    body = {"lesson_title": f"Golden case {case['id']}", "source_ids": case.get("source_ids", []), "purpose": case.get("purpose", "practice")}
    request = urllib.request.Request("http://127.0.0.1:8000/api/generate-quiz", data=json.dumps(body).encode(), headers={"Content-Type":"application/json"}, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=90) as response: payload = json.loads(response.read())
    except urllib.error.HTTPError as exc: payload = json.loads(exc.read())
    except Exception as exc: payload = {"status":"CLIENT_ERROR", "message":str(exc)}
    status = payload.get("status", "UNKNOWN")
    machine_pass = status in case["expected"]
    rows.append({"case":case["id"],"class":case["class"],"origin":case["origin"],"reference":case["reference"],"status":status,"machine_pass":machine_pass,"trace_id":payload.get("trace_id", ""),"manual_grounded":"PENDING","manual_relevance":"PENDING","notes":payload.get("message", "")})
    print(case["id"], status, "PASS" if machine_pass else "FAIL")

out_dir = ROOT / "eval/results"; out_dir.mkdir(parents=True, exist_ok=True)
stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
path = out_dir / f"run-{stamp}.csv"
with path.open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=rows[0]); writer.writeheader(); writer.writerows(rows)
rate = sum(r["machine_pass"] for r in rows) / len(rows)
print(f"Machine checks: {rate:.1%} ({sum(r['machine_pass'] for r in rows)}/{len(rows)})")
print("Manual groundedness/relevance remain PENDING and must be scored by two people.")
print(path)
