import csv
import json
import requests
import time

def run_tests():
    results = []
    with open("test_cases.tsv", "r", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="\t")
        for idx, row in enumerate(reader):
            if len(row) < 6:
                continue
            tc_id = row[0].strip()
            if tc_id.lower().startswith("file test"): continue
            
            question = row[3]
            expected_routing = row[4]
            expected_quality = row[5]
            
            print(f"Testing {tc_id}: {question}")
            try:
                res = requests.post("http://localhost:8000/api/chat", json={"message": question}, timeout=60)
                if res.status_code == 200:
                    data = res.json()
                    results.append({
                        "tc_id": tc_id,
                        "question": question,
                        "expected_routing": expected_routing,
                        "expected_quality": expected_quality,
                        "actual_answer": data.get("answer", ""),
                        "guardrails": data.get("guardrails_triggered", []),
                        "tool_calls": [t.get("tool") for t in data.get("tool_calls", [])]
                    })
                else:
                    print(f"Failed {tc_id}: HTTP {res.status_code}")
                    results.append({"tc_id": tc_id, "error": f"HTTP {res.status_code}"})
            except Exception as e:
                print(f"Failed {tc_id}: {str(e)}")
                results.append({"tc_id": tc_id, "error": str(e)})
                
            time.sleep(1)

    with open("test_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("Done! Saved to test_results.json")

if __name__ == "__main__":
    run_tests()
