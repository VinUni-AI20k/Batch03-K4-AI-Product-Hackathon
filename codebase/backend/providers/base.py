from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Protocol, TypeVar

from pydantic import BaseModel

ResponseModel = TypeVar("ResponseModel", bound=BaseModel)


@dataclass
class ToolCall:
    name: str
    args: dict[str, Any]


@dataclass
class ModelResponse:
    text: str | None = None
    tool_calls: list[ToolCall] = field(default_factory=list)
    raw: Any | None = None


class Provider(Protocol):
    def complete(
        self,
        messages: list[dict[str, str]],
        tools: list[dict[str, Any]] | None = None,
        *,
        model: str | None = None,
        temperature: float = 0.0,
        tool_choice: Any | None = None,
    ) -> ModelResponse:
        """Return normalized text/tool calls regardless of vendor API shape."""

    def parse(
        self,
        messages: list[dict[str, str]],
        response_format: type[ResponseModel],
        *,
        model: str | None = None,
        temperature: float = 0.0,
    ) -> ResponseModel:
        """Return one instance of `response_format`, populated by the model's
        structured-output mode. Used by studypulse/ nodes in place of
        LangChain's `.with_structured_output()`, so those nodes stay on the
        same provider (and vendor) as the rest of the agent."""

    def embed(self, texts: list[str], *, model: str | None = None) -> list[list[float]]:
        """Return one embedding vector per input text, same order."""
