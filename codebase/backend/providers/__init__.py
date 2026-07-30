from __future__ import annotations

from .base import ModelResponse, Provider, ToolCall
from .openai_provider import OpenAIProvider

_PROVIDERS = {
    "openai": OpenAIProvider,
}


def make_provider(name: str, **kwargs: object) -> Provider:
    try:
        provider_cls = _PROVIDERS[name]
    except KeyError as exc:
        available = ", ".join(sorted(_PROVIDERS))
        raise ValueError(f"Unknown provider '{name}'. Available: {available}") from exc
    return provider_cls(**kwargs)


__all__ = ["ModelResponse", "Provider", "ToolCall", "make_provider"]
