"""Thin wrapper around the OpenAI Chat Completions API — the one real AI call
this prototype makes (quyết định AI trung tâm: sinh MCQ)."""
import json

from openai import OpenAI

from app.core.config import OPENAI_API_KEY, QUIZ_MODEL

_client: OpenAI | None = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        if not OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY is not set — check backend/.env")
        _client = OpenAI(api_key=OPENAI_API_KEY)
    return _client


def call_json(system_prompt: str, user_prompt: str, model: str | None = None) -> dict:
    """Call the model and parse a JSON object response. Raises on malformed output —
    callers should catch and treat as a hard failure (no silent fallback to fake data)."""
    client = get_client()
    response = client.chat.completions.create(
        model=model or QUIZ_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    content = response.choices[0].message.content
    return json.loads(content)
