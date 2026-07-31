"""Template for connecting the evaluator to the team's real agents.

Copy this file, replace the imports and routing below, then run:
python eval/run_eval.py --adapter eval.adapters.project_adapter
"""
from __future__ import annotations


def run_case(case: dict) -> dict:
    suite = case["suite"]
    prompt = case["input"]

    # Replace each branch with a call to the corresponding real agent.
    if suite == "lesson_qa":
        raise NotImplementedError("Call Lesson QA agent and return answer/citations/tool_calls")
    if suite == "quiz_generation":
        raise NotImplementedError("Call Quiz agent and return answer/citations/tool_calls")
    if suite == "socratic_agent":
        raise NotImplementedError("Call Socratic agent and return answer/tool_calls")
    if suite == "validator_guardrails":
        raise NotImplementedError("Call Validator and return validator_blocked/tool_calls")
    if suite == "delta_credit_and_quota":
        raise NotImplementedError("Call credit service and return quota_delta")
    if suite == "quiz_integrity":
        raise NotImplementedError("Call integrity policy and return integrity_ok")
    raise ValueError(f"Unknown suite: {suite}")
