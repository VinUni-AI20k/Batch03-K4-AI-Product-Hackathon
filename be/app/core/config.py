import os
from dataclasses import dataclass, field


@dataclass(frozen=True)
class Settings:
    app_name: str = "VLearn Context Tutor"
    environment: str = os.getenv("APP_ENV", "development")
    llm_provider: str = os.getenv("LLM_PROVIDER", "mock")
    context_token_budget: int = int(os.getenv("CONTEXT_TOKEN_BUDGET", "6000"))
    retrieval_top_k: int = int(os.getenv("RETRIEVAL_TOP_K", "5"))
    cors_origins: list[str] = field(
        default_factory=lambda: [
            origin.strip()
            for origin in os.getenv(
                "CORS_ORIGINS",
                "http://localhost:3000,http://localhost:3001",
            ).split(",")
            if origin.strip()
        ]
    )


settings = Settings()
