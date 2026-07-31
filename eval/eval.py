from __future__ import annotations

import re
from typing import Any


def extract_text(data: dict[str, Any]) -> str:
    return (
        data.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "")
    )


def has_citation(text: str, citation: str) -> bool:
    if not citation or citation.lower() in {"preset default", "warning g10", "refused g10", "guided g1"}:
        return True
    return citation.lower() in text.lower()


def evaluate_case(case: dict[str, Any], response_text: str) -> tuple[str, str]:
    text = response_text.strip()
    if not text:
        return "FAIL", "AI returned empty response"

    cid = case["id"]
    citation = case.get("citation", "")

    # Baseline checks based on the existing VLearn Golden Set semantics.
    if cid in {"TC-01", "TC-02", "TC-07", "TC-08", "TC-09", "TC-10",
               "TC-11", "TC-12", "TC-13", "TC-14", "TC-15", "TC-16",
               "TC-17", "TC-18", "TC-19"}:
        if has_citation(text, citation):
            return "PASS", f"Expected citation/topic evidence found: {citation}"
        return "FAIL", f"Expected citation/topic evidence not found: {citation}"

    if cid == "TC-03":
        warning_words = ["không có", "không đủ", "thiếu", "chưa có", "không tìm thấy", "không được cung cấp"]
        if any(w in text.lower() for w in warning_words):
            return "PASS", "AI acknowledged missing/insufficient information"
        return "FAIL", "AI did not clearly acknowledge missing information"

    if cid == "TC-04":
        if len(text) > 10:
            return "PASS", "AI handled the short request with a non-empty response"
        return "FAIL", "AI response is too short"

    if cid == "TC-05":
        refusal_words = ["không thể", "không được", "không hỗ trợ", "không cung cấp", "từ chối"]
        if any(w in text.lower() for w in refusal_words):
            return "PASS", "AI refused/redirected the out-of-scope request"
        return "FAIL", "AI did not show an out-of-scope refusal"

    if cid == "TC-06":
        if len(text) > 20:
            return "PASS", "AI returned a guided response"
        return "FAIL", "AI response is empty/too short"

    if cid == "TC-20":
        # Existing UI requirement: generate flashcards from a default preset.
        return ("PASS", "AI returned a response for the default flashcard request"
                if len(text) > 10 else "FAIL")

    return "PASS", "Non-empty response"


def score(results: list[dict[str, str]]) -> dict[str, float | int]:
    total = len(results)
    passed = sum(x["result"] == "PASS" for x in results)
    failed = total - passed
    return {
        "total": total,
        "passed": passed,
        "failed": failed,
        "score": round(passed / total * 100, 2) if total else 0.0,
    }