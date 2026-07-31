"""Intentionally faulty fixture used to verify that the evaluator catches bugs.

Never use this adapter as product-quality evidence.
"""
from __future__ import annotations


def run_case(case: dict) -> dict:
    return {
        "answer": "Câu trả lời thiếu căn cứ và không khớp với hợp đồng.",
        "citations": [],
        "tool_calls": ["unapproved_tool"],
        "validator_blocked": False,
        "integrity_ok": False,
        "quota_delta": 999,
        "adapter_type": "intentionally_faulty_fixture",
    }
