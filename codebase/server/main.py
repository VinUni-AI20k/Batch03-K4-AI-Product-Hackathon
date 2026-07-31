from __future__ import annotations

import json
import os
import re
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
    # HC (y tế) thêm vào đây theo eval/run-01.md case L08 — trước đó 10 đề tài y tế
    # rủi ro cao không bao giờ lọt candidate list dù hồ sơ có kỹ năng y tế. Không
    # thêm interest "healthcare" riêng vào UI (post-CP4 không thêm feature mới) —
    # "Vận hành" là lựa chọn gần nhất user y tế có thể tự chọn.
    "operations": {"blockTokens": ["MFG", "SC", "VHR", "RET", "RAV", "O2O", "HC"], "label": "Vận hành"},
    "security": {"blockTokens": ["VSOC", "ITOPS", "AIP"], "label": "An ninh & hệ thống"},
}

# eval/run-02.md regression: hồ sơ "Network, Log analysis, Linux" (interest=security)
# bị hạ nhầm confidence vì các từ này không xuất hiện nguyên văn trong tech_stack
# tiếng Việt. Bảng đồng nghĩa tối thiểu Anh-Việt cho các domain đã có trong INTEREST_RULES
# — chỉ những cụm cụ thể đã thấy gây false-negative qua eval, không suy rộng thêm.
SKILL_SYNONYMS: dict[str, list[str]] = {
    "security": ["mạng", "an ninh", "bảo mật", "log", "cảnh báo", "sự cố", "xâm nhập", "danh tính"],
    "data": ["dữ liệu", "mô hình", "pipeline", "phân loại"],
    "operations": ["vận hành", "quy trình", "điều phối"],
}

# eval/run-01.md failure mode "confidence lạc quan giả": model tự báo confidence="high"
# ngay cả khi hồ sơ không khớp field nào của top candidate. Ép lại ở tầng code thay vì
# chỉ tin instruction trong SYSTEM_PROMPT — xem spec.md §7 hướng sửa #1.
# Chỉ đếm skill khớp thật vào nội dung đề tài — KHÔNG đếm team_size, vì hầu hết
# candidate đều có max_team>=team_size (gần như luôn true, không phải tín hiệu thật).
MIN_SKILL_MATCHES_FOR_HIGH_CONFIDENCE = 1


def _profile_skill_match_count(payload: "RecommendRequest", candidate: dict[str, Any]) -> int:
    corpus = " ".join(
        str(candidate.get(field, "") or "")
        for field in ("ten_de_tai", "pain_point", "mo_ta_bai_toan", "tech_stack", "job_executor")
    ).lower()
    corpus_words = set(re.findall(r"[\w]+", corpus, re.UNICODE))
    synonyms = SKILL_SYNONYMS.get(payload.interest, [])
    matches = 0
    for skill in payload.skills:
        tokens = [t for t in skill.lower().split() if len(t) > 2]
        # Word-boundary match, not substring — "ảnh" (from "Chụp ảnh") is a
        # substring of "cảnh báo" and would otherwise false-positive (found
        # live via eval case L03 sau khi fix #1: VSOC-002 vẫn báo high sai).
        direct_hit = any(token in corpus_words for token in tokens)
        # eval/run-02.md case G02: kỹ năng tiếng Anh (Network/Log analysis) không
        # khớp token literal tiếng Việt dù đúng domain — coi khớp qua từ đồng nghĩa
        # của interest đã chọn như một tín hiệu tương đương (không thay thế
        # direct_hit, chỉ cộng thêm đường lui khi domain rõ ràng đúng hướng).
        synonym_hit = any(word in corpus_words for word in synonyms) if synonyms else False
        if direct_hit or synonym_hit:
            matches += 1
    return matches


# eval/run-02.md L04: team_size vượt hẳn max_team quan sát được trong dữ liệu (chưa
# thấy đề tài nào >5 người) không được cảnh báo. Kiểm tra thô ở code, không phụ
# thuộc model tự nhận ra.
MAX_OBSERVED_TEAM_SIZE = 5


def _reasons_reference_real_fields(payload: "RecommendRequest", reasons: list[str]) -> bool:
    """eval/run-02.md L01: model có thể bịa hẳn kỹ năng không có trong hồ sơ (vd
    reasons nói "có kỹ năng Python" khi payload.skills chỉ có "PMP, quản lý cấp
    cao") — bịa VỀ HỒ SƠ, không phải về đề tài, nên phải so với payload.skills
    chứ không phải corpus của candidate (corpus luôn overlap vì reasons hay lặp
    lại từ trong tech_stack, khiến check cũ pass nhầm dù model bịa skill giả)."""
    if not payload.skills:
        return True  # không có skill nào để đối chiếu — không thể kết luận là bịa
    skill_words: set[str] = set()
    for skill in payload.skills:
        skill_words |= set(re.findall(r"[\w]{3,}", skill.lower(), re.UNICODE))
    for reason in reasons:
        reason_words = set(re.findall(r"[\w]{3,}", reason.lower(), re.UNICODE))
        if skill_words & reason_words:
            return True
    return not reasons

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
    candidates_by_code = {c["ma_de"]: c for c in candidates}
    valid_selections = [s for s in parsed.get("selections", []) if s.get("ma_de") in candidate_codes]
    if len(valid_selections) < len(parsed.get("selections", [])):
        parsed["confidence"] = "low"
        parsed["overall_note"] = (parsed.get("overall_note", "") + " [Đã loại đề tài không có trong danh sách ứng viên do model trả sai mã.]").strip()
    parsed["selections"] = valid_selections

    # Downgrade an unearned "high": if NO selection has real overlap with the
    # profile (skills, kể cả qua đồng nghĩa interest), model đang đoán bất kể
    # nó tự báo gì — eval/run-01.md case R01/L03/R03, eval/run-02.md case G02.
    if parsed.get("confidence") == "high" and valid_selections:
        best_match = max(
            (_profile_skill_match_count(payload, candidates_by_code[s["ma_de"]]) for s in valid_selections),
            default=0,
        )
        if best_match < MIN_SKILL_MATCHES_FOR_HIGH_CONFIDENCE:
            parsed["confidence"] = "low"
            parsed["overall_note"] = (
                parsed.get("overall_note", "")
                + " [Hạ xuống 'low' tự động: không có đề tài nào khớp rõ kỹ năng/quy mô nhóm trong hồ sơ.]"
            ).strip()

    # eval/run-02.md L04: team_size vượt hẳn phạm vi dữ liệu quan sát được.
    if payload.team_size > MAX_OBSERVED_TEAM_SIZE:
        parsed["confidence"] = "low"
        parsed["overall_note"] = (
            parsed.get("overall_note", "")
            + f" [Cảnh báo: quy mô nhóm {payload.team_size} vượt phạm vi dữ liệu quan sát được (tối đa {MAX_OBSERVED_TEAM_SIZE} người) — đề tài đề xuất có thể không tính đến quy mô lớn hơn.]"
        ).strip()

    # L01 (eval/run-02.md): thử chặn reasons bịa hồ sơ bằng so khớp từ (tương tự
    # _reasons_reference_real_fields), nhưng heuristic này xung đột trực tiếp với
    # fix G02 — reasons diễn giải ĐÚNG bằng từ khác (vd "phân tích mạng và log"
    # cho skill "Network"/"Log analysis") bị hiểu nhầm là bịa, y hệt lỗi vừa sửa
    # ở G02 nhưng theo chiều ngược lại. Không tìm được ngưỡng tách được "diễn giải
    # đúng bằng từ khác" khỏi "bịa khác nghĩa" bằng so khớp từ đơn giản — cần
    # LLM-judge độc lập chấm lại reasons, không phải regex. Bỏ check này, giữ L01
    # là FAIL đã biết — xem eval/run-03.md và spec.md §7.
    _ = _reasons_reference_real_fields  # giữ hàm lại cho lượt sau, không xoá logic đã viết

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
