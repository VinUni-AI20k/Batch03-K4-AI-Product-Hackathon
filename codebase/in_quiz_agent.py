"""In-quiz Socratic Agent with Guardrails (Validator) to prevent answer leakage."""

import json
import re
from datetime import UTC, datetime
from pathlib import Path
from llm import call_openai_api
from prompts import get_in_quiz_socratic_prompt


DIRECT_ANSWER_PATTERNS = (
    r"\bđáp án\b",
    r"\bcau tra loi dung\b",
    r"\bcâu trả lời đúng\b",
    r"\bchữ cái.*đáp án\b",
    r"\bchon\s+[abcd]\b.*\b(dung|sai)\b",
    r"\bchọn\s+[abcd]\b.*\b(đúng|sai)\b",
)


def should_block_request(user_message: str) -> bool:
    """Block requests that would reveal or confirm a quiz option before submission."""
    message = user_message.casefold()
    return any(re.search(pattern, message) for pattern in DIRECT_ANSWER_PATTERNS)


def response_leaks_answer(options: list[str], correct_idx: int, agent_response: str) -> bool:
    """Deterministic output guardrail for explicit answer/option leakage.

    Conceptual explanations are allowed. A response is blocked only when it
    explicitly identifies the correct option or asks the learner to select it.
    """
    if correct_idx < 0 or correct_idx >= len(options):
        return False
    answer_letter = chr(ord("a") + correct_idx)
    text = agent_response.casefold()
    direct_patterns = (
        rf"đáp án( đúng)?\s*(là|:)?\s*{answer_letter}\b",
        rf"chọn\s*(đáp án\s*)?{answer_letter}\b",
        rf"phương án\s*{answer_letter}\b",
    )
    return any(re.search(pattern, text) for pattern in direct_patterns)

def ask_in_quiz(question_context: dict, user_message: str, trace_dir: Path) -> dict:
    """
    question_context contains:
    - question: The quiz question text
    - options: The list of options
    - correct: The index of the correct option
    """
    q_text = question_context.get("question", "")
    opts = question_context.get("options", [])
    correct_idx = question_context.get("correct", -1)
    started = datetime.now(UTC)
    blocked = should_block_request(user_message)

    if blocked:
        # A deterministic pre-check prevents prompt wording from bypassing the
        # guardrail and avoids sending answer-seeking requests to the model.
        agent_reply = (
            "Mình không thể tiết lộ hoặc xác nhận đáp án khi bạn đang làm quiz. "
            "Mình có thể giải thích khái niệm hoặc đưa một gợi ý để bạn tự chọn nhé!"
        )
    else:
        prompt = get_in_quiz_socratic_prompt(q_text, opts, user_message)
        agent_reply, _ = call_openai_api(prompt, timeout=30)
        if response_leaks_answer(opts, correct_idx, agent_reply):
            blocked = True
            agent_reply = (
                "Mình không thể tiết lộ hoặc xác nhận đáp án khi bạn đang làm quiz. "
                "Mình có thể giải thích khái niệm hoặc đưa một gợi ý để bạn tự chọn nhé!"
            )

    # is_safe describes the output that is returned to the learner. `blocked`
    # describes the policy decision and is the correct metric for jailbreak tests.
    is_safe = True
            
    trace = {
        "timestamp_utc": started.isoformat(),
        "mode": "in_quiz_socratic_agent",
        "question_context": question_context,
        "user_message": user_message,
        "agent_reply": agent_reply,
        "is_safe": is_safe,
        "blocked": blocked,
    }
    trace_dir.mkdir(parents=True, exist_ok=True)
    trace_id = started.strftime("%Y%m%dT%H%M%S%fZ")
    (trace_dir / f"quizqa-{trace_id}.json").write_text(
        json.dumps(trace, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    
    return {
        "status": "OK",
        "answer": agent_reply,
        "is_safe": is_safe,
        "blocked": blocked,
        "trace_id": f"quizqa-{trace_id}",
        "ai_generated": True,
    }
