"""Provider selection shared by chat, rewrite and future AI features."""

from __future__ import annotations

import json
import re
from dataclasses import asdict, dataclass

from app.core.config import (
    CHAT_MODEL,
    GEMINI_MODEL,
    GROQ_API_KEY,
    GROQ_BASE_URL,
    GROQ_MODEL,
    LLM_PROVIDER,
    openai_api_keys,
)
from app.core.llm_client_openai import call_chat, call_json


class LLMProviderError(RuntimeError):
    pass


@dataclass(frozen=True)
class ProviderStatus:
    provider: str
    model: str
    configured: bool
    capabilities: tuple[str, ...]


def _provider_name() -> str:
    if LLM_PROVIDER == "auto":
        if openai_api_keys():
            return "openai"
        if GROQ_API_KEY:
            return "groq"
        return "gemini"
    return LLM_PROVIDER


def provider_status() -> dict[str, object]:
    provider = _provider_name()
    if provider == "openai":
        configured, model = bool(openai_api_keys()), CHAT_MODEL
    elif provider == "groq":
        configured, model = bool(GROQ_API_KEY), GROQ_MODEL
    elif provider == "gemini":
        from os import environ
        configured, model = bool(environ.get("GOOGLE_API_KEY", "").strip()), GEMINI_MODEL
    else:
        configured, model = False, "unknown"
    status = ProviderStatus(
        provider=provider,
        model=model,
        configured=configured,
        capabilities=("chat", "json", "grounded_rewrite") if configured else (),
    )
    return asdict(status)


def generate_text(
    system_prompt: str,
    user_prompt: str,
    *,
    model: str | None = None,
    max_tokens: int = 1000,
    temperature: float = 0.2,
) -> str:
    status = provider_status()
    if not status["configured"]:
        raise LLMProviderError(
            f"LLM provider {status['provider']} is not configured; set the matching API key"
        )
    try:
        if status["provider"] == "openai":
            return call_chat(
                system_prompt,
                user_prompt,
                model=model or CHAT_MODEL,
                max_tokens=max_tokens,
                temperature=temperature,
            )
        if status["provider"] == "groq":
            return call_chat(
                system_prompt,
                user_prompt,
                model=model or GROQ_MODEL,
                max_tokens=max_tokens,
                temperature=temperature,
                api_keys=[GROQ_API_KEY],
                base_urls=[GROQ_BASE_URL],
            )
        if status["provider"] == "gemini":
            from app.core.llm_client import LLMClient
            return LLMClient(model_name=model or GEMINI_MODEL).generate_text(
                f"SYSTEM INSTRUCTIONS:\n{system_prompt}\n\nUSER REQUEST:\n{user_prompt}",
                temperature=temperature,
            )
        raise LLMProviderError(f"Unsupported LLM_PROVIDER={status['provider']}")
    except Exception as error:  # noqa: BLE001
        if isinstance(error, LLMProviderError):
            raise
        raise LLMProviderError(str(error)) from error


def generate_json(
    system_prompt: str,
    user_prompt: str,
    *,
    model: str | None = None,
    max_tokens: int = 1000,
    temperature: float = 0.2,
) -> dict:
    """Generate one JSON object through the configured provider."""
    status = provider_status()
    if not status["configured"]:
        raise LLMProviderError(
            f"LLM provider {status['provider']} is not configured; set the matching API key"
        )
    try:
        if status["provider"] == "openai":
            return call_json(
                system_prompt,
                user_prompt,
                model=model or CHAT_MODEL,
                max_tokens=max_tokens,
            )
        if status["provider"] == "groq":
            return call_json(
                system_prompt,
                user_prompt,
                model=model or GROQ_MODEL,
                max_tokens=max_tokens,
                api_keys=[GROQ_API_KEY],
                base_urls=[GROQ_BASE_URL],
            )
        if status["provider"] == "gemini":
            raw = generate_text(
                system_prompt,
                user_prompt,
                model=model or GEMINI_MODEL,
                max_tokens=max_tokens,
                temperature=temperature,
            )
            match = re.search(r"\{.*\}", raw, re.DOTALL)
            if not match:
                raise ValueError("Model did not return a JSON object")
            result = json.loads(match.group())
            if not isinstance(result, dict):
                raise ValueError("Model JSON response must be an object")
            return result
        raise LLMProviderError(f"Unsupported LLM_PROVIDER={status['provider']}")
    except Exception as error:  # noqa: BLE001
        if isinstance(error, LLMProviderError):
            raise
        raise LLMProviderError(str(error)) from error
