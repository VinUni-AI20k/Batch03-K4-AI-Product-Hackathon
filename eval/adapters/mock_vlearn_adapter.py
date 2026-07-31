"""Deterministic smoke-test adapter.

This module validates the eval pipeline only. It is deliberately imperfect and
MUST NOT be presented as evidence of real-agent quality.
"""
from __future__ import annotations


def run_case(case: dict) -> dict:
    suite = case["suite"]
    prompt = case["input"]

    if suite == "lesson_qa":
        return {
            "answer": f"Trả lời có căn cứ từ transcript cho câu hỏi: {prompt}",
            "citations": [],
            "tool_calls": ["retrieve_transcript"],
        }
    if suite == "quiz_generation":
        return {
            "answer": "Câu hỏi trắc nghiệm dựa trên học liệu, gồm 4 lựa chọn và giải thích.",
            "citations": [],
            "tool_calls": ["retrieve_transcript", "generate_quiz"],
        }
    if suite == "socratic_agent":
        return {
            "answer": "Em thử nêu một ví dụ và cho biết em đang nghĩ quy luật nào phù hợp?",
            "tool_calls": ["retrieve_transcript", "socratic_reply"],
        }
    if suite == "validator_guardrails":
        blocked = "bỏ qua" in prompt.lower() or "tiết lộ" in prompt.lower()
        return {
            "answer": (
                "Mình không thể làm vậy; hãy quay lại phạm vi transcript và tự làm quiz."
                if blocked
                else "Yêu cầu Day 1 hợp lệ, tiếp tục truy xuất transcript."
            ),
            "validator_blocked": blocked,
            "tool_calls": ["validate_request"] + ([] if blocked else ["retrieve_transcript"]),
        }
    if suite == "quiz_integrity":
        allowed = "đồng ý fullscreen" in prompt.lower()
        return {
            "answer": "Cho phép vào quiz." if allowed else "Không thể tiếp tục quiz; cần fullscreen.",
            "integrity_ok": allowed,
        }
    if suite == "delta_credit_and_quota":
        delta = 2 if "đạt yêu cầu" in prompt.lower() else 0
        return {
            "answer": "Credit luyện tập tuân theo trần tối đa 20; trượt thì không cộng.",
            "quota_delta": delta,
        }
    raise ValueError(f"Unsupported suite: {suite}")
