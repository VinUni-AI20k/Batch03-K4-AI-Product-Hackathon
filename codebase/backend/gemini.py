"""Gemini Flash client wrapper.

Everything the app asks of the model is a structured-output call, so the API
layer never has to parse prose. Transient failures are retried here so callers
never have to think about them.
"""

import base64
import binascii
import json
import logging
import random
import re
import time
from typing import List, Optional, Sequence

from google import genai
from google.genai import types
from pydantic import BaseModel, Field

import config

log = logging.getLogger(__name__)

_DATA_URL = re.compile(r"^data:(?P<mime>image/[a-zA-Z0-9.+-]+);base64,(?P<data>.+)$", re.DOTALL)

# Errors that a second attempt can plausibly fix: rate limits, overloaded or
# flaky backends, timeouts. Anything else (bad key, unknown model, malformed
# request) fails the same way every time, so retrying only wastes the user's
# time.
_RETRYABLE_MARKERS = (
    "429",
    "500",
    "502",
    "503",
    "504",
    "RESOURCE_EXHAUSTED",
    "UNAVAILABLE",
    "INTERNAL",
    "DEADLINE_EXCEEDED",
    "ABORTED",
    "timeout",
    "timed out",
    "connection",
    "temporarily",
)


class GeminiError(RuntimeError):
    """Raised for a missing key or a failed generation, surfaced as HTTP 502/503."""


class _BadOutput(GeminiError):
    """The call succeeded but the model returned nothing usable — worth a retry."""


def _is_retryable(exc: Exception) -> bool:
    text = str(exc).lower()
    return any(marker.lower() in text for marker in _RETRYABLE_MARKERS)


def _rejects_thinking(exc: Exception) -> bool:
    return "INVALID_ARGUMENT" in str(exc)


# --- structured output schemas -------------------------------------------------
class _Citation(BaseModel):
    page: int = Field(description="Page number the quote comes from")
    quote: str = Field(description="Short verbatim quote copied from that page")


class _ChatAnswer(BaseModel):
    answer: str
    grounded: bool = Field(description="False when the document does not contain the answer")
    citations: List[_Citation] = Field(default_factory=list)
    suggested_followups: List[str] = Field(default_factory=list)


class _QuizItem(BaseModel):
    question: str
    options: List[str] = Field(description="Exactly four answer options")
    correct_index: int = Field(description="0-based index of the single correct option")
    explanation: str
    source_page: int
    evidence_quote: str


class _QuizSet(BaseModel):
    questions: List[_QuizItem]


_client: Optional[genai.Client] = None


def get_client() -> genai.Client:
    global _client
    if not config.GEMINI_API_KEY:
        raise GeminiError(
            "GEMINI_API_KEY is not set. Add it to codebase/backend/.env and restart the server."
        )
    if _client is None:
        _client = genai.Client(api_key=config.GEMINI_API_KEY)
    return _client


def decode_data_url(data_url: str) -> types.Part:
    match = _DATA_URL.match(data_url.strip())
    if not match:
        raise GeminiError("Screenshot must be a data URL of the form data:image/<type>;base64,<data>")
    try:
        raw = base64.b64decode(match.group("data"), validate=True)
    except (binascii.Error, ValueError) as exc:
        raise GeminiError(f"Screenshot is not valid base64: {exc}") from exc
    return types.Part.from_bytes(data=raw, mime_type=match.group("mime"))


def _parse(response, schema):
    parsed = getattr(response, "parsed", None)
    if parsed is not None:
        return parsed

    text = (getattr(response, "text", None) or "").strip()
    if not text:
        raise _BadOutput("Gemini returned an empty response (possibly blocked or truncated).")
    try:
        return schema.model_validate(json.loads(text))
    except Exception as exc:
        raise _BadOutput(f"Gemini returned malformed JSON: {exc}") from exc


def _generate(contents, system_instruction: str, schema, temperature: float, thinking_budget: int):
    """Call the model, retrying transient failures up to GEMINI_MAX_ATTEMPTS times."""
    client = get_client()

    def build_config(thinking: types.ThinkingConfig | None) -> types.GenerateContentConfig:
        return types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=temperature,
            response_mime_type="application/json",
            response_schema=schema,
            thinking_config=thinking,
        )

    thinking: types.ThinkingConfig | None = types.ThinkingConfig(thinking_budget=thinking_budget)
    attempts_left = max(1, config.GEMINI_MAX_ATTEMPTS)
    delay = config.GEMINI_RETRY_BASE_DELAY
    last_error: Exception | None = None

    while attempts_left > 0:
        try:
            response = client.models.generate_content(
                model=config.GEMINI_MODEL,
                contents=contents,
                config=build_config(thinking),
            )
            return _parse(response, schema)

        except _BadOutput as exc:
            # The call went through but produced nothing usable. A fresh sample
            # usually fixes it, so this counts as a normal retryable attempt.
            last_error = exc

        except Exception as exc:
            # Model families differ on thinking controls — Gemini 3.x rejects an
            # explicit budget of 0. Correcting the request is not a failed try,
            # so it does not consume an attempt.
            if thinking is not None and _rejects_thinking(exc):
                log.info("Model rejected the thinking budget; retrying with the model default.")
                thinking = None
                continue

            last_error = exc
            if not _is_retryable(exc):
                break  # a key, model or request problem — retrying cannot help

        attempts_left -= 1
        if attempts_left <= 0:
            break

        pause = delay + random.uniform(0, delay * 0.25)  # jitter avoids sync'd retries
        log.warning(
            "Gemini call failed (%s). Retrying in %.1fs, %d attempt(s) left.",
            last_error,
            pause,
            attempts_left,
        )
        time.sleep(pause)
        delay *= 2

    used = max(1, config.GEMINI_MAX_ATTEMPTS) - attempts_left
    suffix = f" after {used} attempts" if used > 1 else ""
    raise GeminiError(f"Gemini request failed{suffix}: {last_error}") from last_error


def ask(
    system_instruction: str,
    user_prompt: str,
    history: Sequence[dict],
    screenshots: Sequence[tuple[int, str]] = (),
) -> _ChatAnswer:
    """One grounded chat turn.

    `history` is [{role, text}] oldest-first. `screenshots` is [(page, data_url)];
    each crop is labelled with its page so the model can tie it to the right slide.
    """
    contents: List[types.Content] = []
    for turn in history:
        role = "user" if turn["role"] == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part.from_text(text=turn["text"])]))

    parts: List[types.Part] = [types.Part.from_text(text=user_prompt)]
    for index, (page, data_url) in enumerate(screenshots, start=1):
        parts.append(
            types.Part.from_text(
                text=(
                    f"Crop {index} of {len(screenshots)} — cut out of page {page}. "
                    f"The full text of page {page} is in <slide_in_focus page=\"{page}\"> above; "
                    "explain this crop in the context of that whole slide."
                )
            )
        )
        parts.append(decode_data_url(data_url))
    contents.append(types.Content(role="user", parts=parts))

    return _generate(contents, system_instruction, _ChatAnswer, temperature=0.2, thinking_budget=0)


def quiz(system_instruction: str, user_prompt: str) -> _QuizSet:
    return _generate(user_prompt, system_instruction, _QuizSet, temperature=0.6, thinking_budget=2048)
