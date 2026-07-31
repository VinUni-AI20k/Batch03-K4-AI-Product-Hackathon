"""Thin wrapper around the OpenAI Chat Completions API — the one real AI call
this prototype makes (quyết định AI trung tâm: sinh MCQ)."""
import json
import threading

from openai import APIConnectionError, APIStatusError, APITimeoutError, OpenAI, RateLimitError

from app.core.config import QUIZ_MODEL, openai_api_keys, openai_base_urls

_clients: list[OpenAI] = []
_next_client = 0
_client_lock = threading.Lock()


def get_client() -> OpenAI:
    """Return the next configured client (legacy helper, now round-robin)."""
    clients = _get_clients()
    global _next_client
    with _client_lock:
        client = clients[_next_client % len(clients)]
        _next_client = (_next_client + 1) % len(clients)
    return client


def _get_clients() -> list[OpenAI]:
    global _clients
    if not _clients:
        keys = openai_api_keys()
        base_urls = openai_base_urls()
        if not keys:
            raise RuntimeError("No OpenAI API key configured; set OPENAI_API_KEY(S) in .env")
        _clients = [
            OpenAI(api_key=key, base_url=base_urls[index] if index < len(base_urls) else None)
            for index, key in enumerate(keys)
        ]
    return _clients


def _is_retryable(exc: Exception) -> bool:
    """Quota, rate-limit, provider outage and network errors may use another key."""
    if isinstance(exc, (RateLimitError, APIConnectionError, APITimeoutError)):
        return True
    return isinstance(exc, APIStatusError) and (exc.status_code == 429 or exc.status_code >= 500)


def call_json(
    system_prompt: str,
    user_prompt: str,
    model: str | None = None,
    *,
    max_tokens: int = 1000,
    api_keys: list[str] | None = None,
    base_urls: list[str] | None = None,
) -> dict:
    """Call the model and parse a JSON object response. Raises on malformed output —
    callers should catch and treat as a hard failure (no silent fallback to fake data)."""
    global _next_client
    if api_keys is None and base_urls is None:
        clients = _get_clients()
    else:
        keys = api_keys if api_keys is not None else openai_api_keys()
        urls = base_urls if base_urls is not None else openai_base_urls()
        if not keys:
            raise RuntimeError("No API key configured for the OpenAI-compatible provider")
        clients = [
            OpenAI(api_key=key, base_url=urls[index] if index < len(urls) else None)
            for index, key in enumerate(keys)
        ]
    errors: list[str] = []
    # Start from the rotating cursor, then try each key at most once.
    with _client_lock:
        start = _next_client % len(clients)
        _next_client = (start + 1) % len(clients)
    for offset in range(len(clients)):
        client = clients[(start + offset) % len(clients)]
        try:
            response = client.chat.completions.create(
                model=model or QUIZ_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
                max_tokens=max_tokens,
                temperature=0.3,
            )
            return json.loads(response.choices[0].message.content)
        except Exception as exc:  # noqa: BLE001 - preserve provider error after trying fallbacks
            if not _is_retryable(exc) or offset == len(clients) - 1:
                if errors:
                    errors.append(f"final: {type(exc).__name__}")
                    raise RuntimeError(f"All configured OpenAI keys failed ({'; '.join(errors)})") from exc
                raise
            errors.append(type(exc).__name__)
    raise RuntimeError("No OpenAI client available")


def call_text(
    prompt: str,
    *,
    model: str | None = None,
    max_tokens: int = 1000,
    temperature: float = 0.2,
) -> str:
    """Call the configured model for a plain-text response with key failover.

    This intentionally does not request JSON mode: callers such as the rewrite
    pipeline need the model's Markdown response verbatim.
    """
    global _next_client
    clients = _get_clients()
    errors: list[str] = []
    with _client_lock:
        start = _next_client % len(clients)
        _next_client = (start + 1) % len(clients)
    for offset in range(len(clients)):
        client = clients[(start + offset) % len(clients)]
        try:
            response = client.chat.completions.create(
                model=model or QUIZ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature,
            )
            content = response.choices[0].message.content
            if not isinstance(content, str) or not content.strip():
                raise RuntimeError("Model returned an empty text response")
            return content
        except Exception as exc:  # noqa: BLE001 - preserve provider error after trying fallbacks
            if not _is_retryable(exc) or offset == len(clients) - 1:
                if errors:
                    errors.append(f"final: {type(exc).__name__}")
                    raise RuntimeError(f"All configured OpenAI keys failed ({'; '.join(errors)})") from exc
                raise
            errors.append(type(exc).__name__)
    raise RuntimeError("No OpenAI client available")


def call_chat(
    system_prompt: str,
    user_prompt: str,
    *,
    model: str | None = None,
    max_tokens: int = 1000,
    temperature: float = 0.2,
    api_keys: list[str] | None = None,
    base_urls: list[str] | None = None,
) -> str:
    """Call an OpenAI-compatible chat provider with explicit system/user turns."""
    keys = api_keys if api_keys is not None else openai_api_keys()
    urls = base_urls if base_urls is not None else openai_base_urls()
    if not keys:
        raise RuntimeError("No API key configured for the OpenAI-compatible provider")
    clients = [
        OpenAI(api_key=key, base_url=urls[index] if index < len(urls) else None)
        for index, key in enumerate(keys)
    ]
    errors: list[str] = []
    for client in clients:
        try:
            response = client.chat.completions.create(
                model=model or QUIZ_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                max_tokens=max_tokens,
                temperature=temperature,
            )
            content = response.choices[0].message.content
            if not isinstance(content, str) or not content.strip():
                raise RuntimeError("Model returned an empty response")
            return content.strip()
        except Exception as exc:  # noqa: BLE001
            errors.append(type(exc).__name__)
            if not _is_retryable(exc):
                break
    raise RuntimeError(f"LLM provider failed ({', '.join(errors)})")
