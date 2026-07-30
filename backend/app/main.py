from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ocr import router as ocr_router
from app.config import get_settings


settings = get_settings()
app = FastAPI(
    title="ĐềTài+ Profile Reader API",
    description="Isolated local-first OCR and evidence-backed profile extraction.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)
app.include_router(ocr_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "profile-reader"}
