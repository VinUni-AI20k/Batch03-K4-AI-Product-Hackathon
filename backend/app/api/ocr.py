from __future__ import annotations

import asyncio
from functools import lru_cache
from typing import Any

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.config import get_settings
from app.schemas.profile import OcrParseResponse
from app.services.ocr.errors import OcrPipelineError
from app.services.ocr.pipeline import OcrPipeline


router = APIRouter(prefix="/api/ocr", tags=["ocr"])


@lru_cache(maxsize=1)
def get_pipeline() -> OcrPipeline:
    return OcrPipeline(get_settings())


@router.post("/parse", response_model=OcrParseResponse)
async def parse_profile(
    file: UploadFile = File(...),
    use_llm: bool = Form(False),
    language_hint: str | None = Form(None),
    consent_external_processing: bool = Form(False),
) -> OcrParseResponse:
    settings = get_settings()
    try:
        data = await file.read(settings.max_upload_bytes + 1)
        return await asyncio.to_thread(
            get_pipeline().parse,
            data,
            filename=file.filename or "",
            declared_mime=file.content_type,
            use_llm=use_llm,
            language_hint=language_hint,
            consent_external_processing=consent_external_processing,
        )
    except OcrPipelineError as exc:
        raise HTTPException(
            status_code=exc.status_code,
            detail={
                "code": exc.code,
                "message": exc.safe_message,
                "run_id": getattr(exc, "run_id", None),
                "report_id": getattr(exc, "report_id", None),
            },
        ) from None
    finally:
        await file.close()


@router.get("/runs/{run_id}")
async def get_run(run_id: str) -> dict[str, Any]:
    record = get_pipeline().get_run(run_id)
    if record is None:
        raise HTTPException(status_code=404, detail={"code": "RUN_NOT_FOUND", "message": "Run not found."})
    return record


@router.delete("/runs/{run_id}")
async def delete_run(run_id: str) -> dict[str, Any]:
    result = get_pipeline().delete_run(run_id)
    if result is None:
        raise HTTPException(status_code=404, detail={"code": "RUN_NOT_FOUND", "message": "Run not found."})
    return result
