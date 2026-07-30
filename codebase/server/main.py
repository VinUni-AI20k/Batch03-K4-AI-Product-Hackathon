from __future__ import annotations

import json
import os
import time
import uuid
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).parent / ".env")

DATA_PATH = Path(__file__).resolve().parent.parent.parent / "mock-data.json"
LOG_PATH = Path(__file__).resolve().parent / "logs" / "recommend_calls.jsonl"
LOG_PATH.parent.mkdir(parents=True, exist_ok=True)

SYSTEM_PROMPT = """Bạn là bộ xếp hạng đề tài capstone cho học viên. Bạn nhận một hồ sơ học viên và một danh sách ứng viên đề tài (đã được lọc thô theo lĩnh vực quan tâm). Việc của bạn:

1. Chọn ĐÚNG 3 đề tài phù hợp nhất từ danh sách ứng viên — KHÔNG bịa đề tài ngoài danh sách, không đổi mã đề (ma_de).
2. Với mỗi đề tài chọn, viết `reasons` (tối đa 3 câu ngắn) giải thích vì sao phù hợp — PHẢI gắn cụ thể vào hồ sơ (kỹ năng, lĩnh vực, quy mô nhóm, mức độ khó) và vào nội dung đề tài (pain_point, tech_stack, rui_ro_domain). Không viết câu chung chung kiểu "phù hợp với bạn".
3. Với mỗi đề tài chọn, viết `risk_note` một câu dựa trên field `rui_ro_domain`/`gioi_han_tham_quyen`/`hitl` của chính đề tài đó — nói rõ có gì cần cẩn trọng khi làm đề tài này, không tự thêm rủi ro không có trong dữ liệu.
4. Trả `confidence` là "high" hoặc "low" cho TOÀN BỘ kết quả. Trả "low" nếu: hồ sơ không cung cấp đủ tín hiệu để phân biệt giữa các ứng viên (ví dụ kỹ năng liệt kê không khớp field nào của đề tài, hoặc danh sách ứng viên sau lọc có ít hơn 3), hoặc bạn phải đoán thay vì suy luận từ dữ liệu đã cho.
5. Nếu danh sách ứng viên rỗng hoặc không đủ 3 đề tài có liên quan thật sự đến hồ sơ, trả về ít hơn 3 đề tài trong `selections` (không độn đại cho đủ 3) và đặt `confidence` = "low".
6. KHÔNG suy luận thông tin nằm ngoài các field được cung cấp. KHÔNG đưa ra lời khuyên nghề nghiệp, tài chính hay pháp lý.

Chỉ trả JSON đúng schema đã cho, không kèm giải thích ngoài JSON."""

RESPONSE_SCHEMA = {
    "type": "object",
    "required": ["selections", "confidence", "overall_note"],
    "additionalProperties": False,
    "properties": {
        "selections": {
            "type": "array",
            "maxItems": 3,
            "items": {
                "type": "object",
                "required": ["ma_de", "reasons", "risk_note"],
                "additionalProperties": False,
                "properties": {
                    "ma_de": {"type": "string"},
                    "reasons": {"type": "array", "items": {"type": "string"}, "maxItems": 3},
                    "risk_note": {"type": "string"},
                },
            },
        },
        "confidence": {"type": "string", "enum": ["high", "low"]},
        "overall_note": {"type": "string"},
    },
}

INTEREST_RULES: dict[str, dict[str, Any]] = {
    "data": {"blockTokens": ["DATA", "AIP", "ITOPS", "DEV"], "label": "Dữ liệu & AI"},
    "product": {"blockTokens": ["O2O", "RET", "VFO", "EDU"], "label": "Web / Product"},
    "education": {"blockTokens": ["EDU"], "label": "Giáo dục"},
    "finance": {"blockTokens": ["FIN", "BO"], "label": "Tài chính"},
    "operations": {"blockTokens": ["MFG", "SC", "VHR", "RET", "RAV", "O2O"], "label": "Vận hành"},
    "security": {"blockTokens": ["VSOC", "ITOPS", "AIP"], "label": "An ninh & hệ thống"},
}

PROJECT_FIELDS_FOR_MODEL = [
    "ma_de", "ten_de_tai", "khoi", "job_executor", "pain_point", "mo_ta_bai_toan",
    "tech_stack", "max_team", "rui_ro_domain", "hitl", "gioi_han_tham_quyen",
]

app = FastAPI(title="DeTai+ Recommend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:8000")],
    allow_methods=["POST"],
    allow_headers=["*"],
)


class RecommendRequest(BaseModel):
    interest: str
    skills: list[str] = Field(default_factory=list)
    team_size: int = 4
    difficulty: str = "balanced"
    profile_major: str | None = None


class Selection(BaseModel):
    ma_de: str
    reasons: list[str]
    risk_note: str


class RecommendResponse(BaseModel):
    selections: list[Selection]
    confidence: str
    overall_note: str
    trace_id: str


def _load_projects() -> list[dict[str, Any]]:
    with DATA_PATH.open(encoding="utf-8") as fh:
        data = json.load(fh)
    return [p for p in data if p.get("ma_de") and p.get("ten_de_tai")]


def _prefilter(projects: list[dict[str, Any]], interest: str, limit: int = 15) -> list[dict[str, Any]]:
    rule = INTEREST_RULES.get(interest, INTEREST_RULES["data"])
    tokens = tuple(rule["blockTokens"])
    matched = [p for p in projects if str(p.get("khoi", "")).split(" ")[0] in tokens]
    if len(matched) < 3:
        matched = projects
    return matched[:limit]


def _project_for_model(project: dict[str, Any]) -> dict[str, Any]:
    return {k: project.get(k) for k in PROJECT_FIELDS_FOR_MODEL}


def _client() -> OpenAI:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Missing OPENROUTER_API_KEY on server")
    return OpenAI(api_key=api_key, base_url=os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"))


def _log(trace_id: str, request: RecommendRequest, candidates: list[dict[str, Any]], raw_response: str, parsed: dict[str, Any], latency_ms: int, error: str | None = None) -> None:
    entry = {
        "trace_id": trace_id,
        "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "request": request.model_dump(),
        "candidate_codes": [c["ma_de"] for c in candidates],
        "raw_response": raw_response,
        "parsed": parsed,
        "latency_ms": latency_ms,
        "error": error,
    }
    with LOG_PATH.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(entry, ensure_ascii=False) + "\n")


@app.post("/recommend", response_model=RecommendResponse)
def recommend(payload: RecommendRequest) -> RecommendResponse:
    trace_id = uuid.uuid4().hex[:12]
    projects = _load_projects()
    candidates = [_project_for_model(p) for p in _prefilter(projects, payload.interest)]

    user_prompt = json.dumps(
        {
            "profile": {
                "interest": payload.interest,
                "skills": payload.skills,
                "team_size": payload.team_size,
                "difficulty": payload.difficulty,
                "profile_major": payload.profile_major,
            },
            "candidates": candidates,
        },
        ensure_ascii=False,
    )

    client = _client()
    started = time.monotonic()
    try:
        completion = client.chat.completions.create(
            model=os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
            temperature=0.2,
            max_tokens=1200,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {"name": "recommendation", "strict": True, "schema": RESPONSE_SCHEMA},
            },
        )
    except Exception as exc:  # noqa: BLE001 — surfaced to client as 502, logged for evidence
        latency_ms = int((time.monotonic() - started) * 1000)
        _log(trace_id, payload, candidates, "", {}, latency_ms, error=str(exc))
        raise HTTPException(status_code=502, detail=f"Model call failed: {exc}") from exc

    latency_ms = int((time.monotonic() - started) * 1000)
    raw_text = completion.choices[0].message.content or "{}"
    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        _log(trace_id, payload, candidates, raw_text, {}, latency_ms, error=f"invalid_json: {exc}")
        raise HTTPException(status_code=502, detail="Model returned invalid JSON") from exc

    candidate_codes = {c["ma_de"] for c in candidates}
    valid_selections = [s for s in parsed.get("selections", []) if s.get("ma_de") in candidate_codes]
    if len(valid_selections) < len(parsed.get("selections", [])):
        parsed["confidence"] = "low"
        parsed["overall_note"] = (parsed.get("overall_note", "") + " [Đã loại đề tài không có trong danh sách ứng viên do model trả sai mã.]").strip()
    parsed["selections"] = valid_selections

    _log(trace_id, payload, candidates, raw_text, parsed, latency_ms)

    return RecommendResponse(
        selections=[Selection(**s) for s in parsed["selections"]],
        confidence=parsed.get("confidence", "low"),
        overall_note=parsed.get("overall_note", ""),
        trace_id=trace_id,
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
