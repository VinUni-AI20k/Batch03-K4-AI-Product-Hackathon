"""Chạy golden set qua quyết định AI trung tâm (sinh MCQ) thật — 1 lượt,
ghi kết quả (kể cả case fail) ra eval/results-round1.md. Không hardcode, không
fallback giả — nếu OPENAI_API_KEY thiếu, script sẽ lỗi rõ ràng thay vì giả kết quả.
"""
import json
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from app.pipeline.quiz_bank import generate_quiz_with_diagnostics  # noqa: E402
from cases import CASES  # noqa: E402

GROUNDING_REASONS = {"hallucinated_section", "hallucinated_citation"}
FORMAT_REASONS = {"malformed_options", "invalid_correct_index"}


def reason_kind(reason: str) -> str:
    key = reason.split("(")[0].split(":")[0]
    return key


def evaluate_case(case: dict) -> dict:
    result = generate_quiz_with_diagnostics(case["sections"], n_questions=case["n_questions"])
    reasons = result["drop_reasons"]
    grounding_drops = [r for r in reasons if reason_kind(r) in GROUNDING_REASONS]
    format_drops = [r for r in reasons if reason_kind(r) in FORMAT_REASONS]

    grounding_ok = len(grounding_drops) == 0
    format_ok = len(format_drops) == 0
    no_crash = True  # generate_quiz_with_diagnostics never raises; error field used instead

    # case-nhóm "chỗ khó" và "hiếm" có kỳ vọng riêng, tự động hoá phần đếm được:
    note = ""
    manual_review = False
    if case["id"] == "C1-empty-input":
        auto_pass = result["error"] == "no_sections_provided" and not result["valid"]
    elif case["id"] in ("C2-single-thin-segment", "C4-section-no-segments"):
        auto_pass = len(result["valid"]) <= 2
    elif case["id"] in ("C3-thin-section-overask", "C6-overask-forces-outside-knowledge"):
        auto_pass = len(result["valid"]) < case["n_questions"] and grounding_ok
    elif case["id"] == "R3-min-boundary-n1":
        auto_pass = len(result["valid"]) == 1
    elif case["id"] == "R2-student-speech-excluded":
        auto_pass = all(q.get("segment_id") != "T01-009" for q in result["valid"])
    elif case["id"] in ("C5-offtopic-content", "C7-factual-statistic", "C8-named-framework", "R1-multi-section-combined"):
        auto_pass = grounding_ok and format_ok and len(result["valid"]) > 0
        manual_review = True  # nội dung/ngữ nghĩa cần người đọc xác nhận thêm
    else:
        auto_pass = grounding_ok and format_ok and len(result["valid"]) > 0

    passed = auto_pass and no_crash
    return {
        "case": case,
        "result": result,
        "grounding_ok": grounding_ok,
        "format_ok": format_ok,
        "passed": passed,
        "manual_review": manual_review,
        "note": note,
    }


def main():
    rows = [evaluate_case(c) for c in CASES]

    total = len(rows)
    passed = sum(1 for r in rows if r["passed"])
    pct = round(100 * passed / total, 1) if total else 0.0

    lines = []
    lines.append("# Golden set — kết quả lượt 1 (quyết định AI trung tâm: sinh MCQ)\n")
    lines.append(f"**Tổng: {total} case · Đạt: {passed} · Tỷ lệ: {pct}%**\n")
    lines.append(f"**Quality bar đã chốt:** >= 85% case đạt, và 0 case ở lớp ①③ (nguồn sự thật / ngoài phạm vi) được phép fail vì hallucination (grounding_ok phải luôn True cho các case chỗ khó/hiếm liên quan trực tiếp tới grounding).\n")
    lines.append("| Case | Nhóm | Lớp | Đạt? | valid/raw | grounding_ok | format_ok | Cần chấm tay | Kỳ vọng |")
    lines.append("|---|---|---|---|---|---|---|---|---|")
    for r in rows:
        c = r["case"]
        res = r["result"]
        lines.append(
            f"| {c['id']} | {c['group']} | {c['class'] or '-'} | "
            f"{'✅' if r['passed'] else '❌'} | {len(res['valid'])}/{len(res['raw'])} | "
            f"{'✅' if r['grounding_ok'] else '❌'} | {'✅' if r['format_ok'] else '❌'} | "
            f"{'👀' if r['manual_review'] else '-'} | {c['expected']} |"
        )

    lines.append("\n## Case fail — chi tiết + nguyên nhân\n")
    fails = [r for r in rows if not r["passed"]]
    if not fails:
        lines.append("(Không có case fail ở lượt này.)\n")
    for r in fails:
        c, res = r["case"], r["result"]
        lines.append(f"### {c['id']}")
        lines.append(f"- Lỗi: `{res['error']}`")
        lines.append(f"- Drop reasons: {res['drop_reasons'] or '(không có)'}")
        lines.append(f"- Số câu hợp lệ: {len(res['valid'])} / raw {len(res['raw'])}\n")

    lines.append("\n## Case cần chấm tay (nội dung/ngữ nghĩa) — chi tiết output để người đọc xác nhận\n")
    for r in rows:
        if not r["manual_review"]:
            continue
        c, res = r["case"], r["result"]
        lines.append(f"### {c['id']}")
        for q in res["valid"]:
            lines.append(f"- [{q['section_id']}/{q['segment_id']}] {q['question']}")
            lines.append(f"  - Đáp án đúng: {q['options'][q['correct_index']]}")
        lines.append("")

    out_path = Path(__file__).resolve().parent / "results-round1.md"
    out_path.write_text("\n".join(lines), encoding="utf-8")

    # also dump raw JSON for auditability
    raw_dump = [
        {
            "id": r["case"]["id"],
            "n_questions_requested": r["case"]["n_questions"],
            "error": r["result"]["error"],
            "raw_count": len(r["result"]["raw"]),
            "valid_count": len(r["result"]["valid"]),
            "drop_reasons": r["result"]["drop_reasons"],
            "valid_questions": r["result"]["valid"],
        }
        for r in rows
    ]
    (Path(__file__).resolve().parent / "results-round1.json").write_text(
        json.dumps(raw_dump, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"Done. {passed}/{total} passed ({pct}%). See eval/results-round1.md")


if __name__ == "__main__":
    main()
