from fastapi import APIRouter

from app.core.llm_provider import provider_status

router = APIRouter(prefix="/api/llm", tags=["llm"])


@router.get("/status")
def get_llm_status() -> dict[str, object]:
    """Expose safe provider metadata; never expose API keys."""
    return provider_status()
