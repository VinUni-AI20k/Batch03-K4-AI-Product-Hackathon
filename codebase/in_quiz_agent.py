"""In-quiz Socratic Agent with Guardrails (Validator) to prevent answer leakage."""

import json
from datetime import UTC, datetime
from pathlib import Path
from llm import call_openai_api
from prompts import get_in_quiz_socratic_prompt, get_validator_prompt

def validate_response(quiz_question: str, options: list[str], correct_idx: int, user_message: str, agent_response: str) -> bool:
    """Returns True if the response is SAFE (does not leak answer). False if it leaks."""
    correct_option = options[correct_idx]
    prompt = get_validator_prompt(quiz_question, options, correct_option, user_message, agent_response)
    text, _ = call_openai_api(prompt, timeout=20)
    return "SAFE" in text.upper()

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
    
    prompt = get_in_quiz_socratic_prompt(q_text, opts, user_message)
    
    started = datetime.now(UTC)
    agent_reply, _ = call_openai_api(prompt, timeout=30)
    
    # Run validator
    is_safe = True
    if correct_idx >= 0 and correct_idx < len(opts):
        is_safe = validate_response(q_text, opts, correct_idx, user_message, agent_reply)
        if not is_safe:
            agent_reply = "Xin lỗi, câu hỏi này nằm ngoài khả năng của mình. Bạn hãy tự suy luận dựa trên kiến thức đã học nhé!"
            
    trace = {
        "timestamp_utc": started.isoformat(),
        "mode": "in_quiz_socratic_agent",
        "question_context": question_context,
        "user_message": user_message,
        "agent_reply": agent_reply,
        "is_safe": is_safe,
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
        "trace_id": f"quizqa-{trace_id}",
        "ai_generated": True,
    }
