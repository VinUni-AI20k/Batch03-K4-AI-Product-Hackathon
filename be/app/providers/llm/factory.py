from app.core.config import settings
from app.providers.llm.base import LLMProvider
from app.providers.llm.mock import MockLLMProvider


def create_llm_provider() -> LLMProvider:
    if settings.llm_provider == "mock":
        return MockLLMProvider()
    raise ValueError(f"Unsupported LLM_PROVIDER: {settings.llm_provider}")
