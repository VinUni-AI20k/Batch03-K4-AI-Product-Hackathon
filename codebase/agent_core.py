"""Grounded study-agent pipeline shared by the web app and the eval runner."""

from __future__ import annotations

import base64
import hashlib
import json
import os
import re
import time
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

import requests
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
SLIDE_DIR = ROOT / "data" / "vlearn-pack" / "slides"
TRACE_PATH = ROOT / "eval" / "agent_traces.jsonl"
DOCUMENTS = {
    "d1-slide-hackathon.pdf": SLIDE_DIR / "d1-slide-hackathon.pdf",
    "d2-slide-hackathon.pdf": SLIDE_DIR / "d2-slide-hackathon.pdf",
}

OUT_OF_SCOPE = re.compile(
    r"deadline|hạn nộp|link nộp|lịch thi|điểm số|flappy|pygame|viết (?:hộ )?code game",
    re.IGNORECASE,
)
VISUAL_REFERENCE = re.compile(
    r"hình này|sơ đồ này|biểu đồ này|bảng này|phần (?:được )?khoanh|vùng (?:vừa )?chọn",
    re.IGNORECASE,
)
SUMMARY = re.compile(r"tóm tắt|tóm gọn|tổng hợp|khái quát|đầu mục|ý chính", re.IGNORECASE)


class AgentError(RuntimeError):
    """A safe error that can be shown to the prototype user."""


def load_env_files() -> None:
    """Load local development env files without overriding exported variables."""
    for path in (ROOT / ".env", ROOT / "codebase" / ".env"):
        if not path.exists():
            continue
        for raw in path.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


@lru_cache(maxsize=4)
def document_pages(document: str) -> Tuple[str, ...]:
    path = DOCUMENTS.get(document)
    if not path or not path.exists():
        raise AgentError(f"Không tìm thấy tài liệu {document}.")
    reader = PdfReader(str(path))
    return tuple(" ".join((page.extract_text() or "").split()) for page in reader.pages)


def health() -> Dict[str, Any]:
    load_env_files()
    text_key = os.getenv("AI_API_KEY") or os.getenv("DEEPSEEK_API_KEY")
    vision_key = (
        os.getenv("VISION_API_KEY")
        or os.getenv("OPENROUTER_API_KEY")
        or os.getenv("OPENAI_API_KEY")
    )
    return {
        "status": "ok",
        "ai_configured": bool(text_key),
        "vision_configured": bool(vision_key and os.getenv("VISION_MODEL")),
        "model": os.getenv("AI_MODEL", "deepseek-v4-flash"),
        "documents": {name: len(document_pages(name)) for name in DOCUMENTS},
    }


def classify(payload: Dict[str, Any]) -> str:
    question = str(payload.get("question", "")).strip()
    selected = str(payload.get("selected_text", "")).strip()
    image = payload.get("image_data_url")
    region = payload.get("region") or {}
    if OUT_OF_SCOPE.search(question):
        return "refuse"
    if image:
        width = int(region.get("w") or 0)
        height = int(region.get("h") or 0)
        return "clarify" if width < 40 or height < 40 else "image"
    if selected:
        return "selection"
    if VISUAL_REFERENCE.search(question):
        return "clarify"
    return "summary" if SUMMARY.search(question) else "question"


def _tokens(text: str) -> set:
    return {w for w in re.findall(r"[\wÀ-ỹ]+", text.lower()) if len(w) >= 4}


def _rank_pages(pages: Iterable[str], query: str, limit: int = 5) -> List[int]:
    query_tokens = _tokens(query)
    scored = []
    for idx, text in enumerate(pages, 1):
        overlap = len(query_tokens & _tokens(text))
        if overlap:
            scored.append((overlap, idx))
    return [idx for _, idx in sorted(scored, reverse=True)[:limit]]


def gather_evidence(payload: Dict[str, Any], intent: str) -> Tuple[str, List[int]]:
    document = str(payload.get("document") or "d2-slide-hackathon.pdf")
    pages = document_pages(document)
    page = int(payload.get("page") or 1)
    if page < 1 or page > len(pages):
        raise AgentError(
            f"Trang {page} không tồn tại trong {document}; tài liệu có {len(pages)} trang."
        )

    question = str(payload.get("question", ""))
    selected = str(payload.get("selected_text", "")).strip()
    if intent == "summary":
        # The two hackathon decks are small enough to ground a full-document summary.
        # Put query-matching pages first for focused-summary requests, while still
        # including the whole deck so "tóm tắt toàn bộ" remains source-complete.
        is_focused = bool(re.search(r"\b(tập trung|chỉ tập trung|riêng về)\b", question, re.IGNORECASE))
        priority_pages = _rank_pages(pages, question, limit=8) if is_focused else []
        priority = [f"[PRIORITY PAGE {idx}] {pages[idx - 1]}" for idx in priority_pages]
        chunks = [f"[PAGE {idx}] {text}" for idx, text in enumerate(pages, 1)]
        return "\n\n".join([*priority, *chunks])[:90000], list(range(1, len(pages) + 1))

    candidate_pages = [page]
    for idx in _rank_pages(pages, question + " " + selected):
        if idx not in candidate_pages:
            candidate_pages.append(idx)
    candidate_pages = candidate_pages[:5]
    context = "\n\n".join(f"[PAGE {idx}] {pages[idx - 1]}" for idx in candidate_pages)
    if selected:
        context = f"[SELECTED TEXT ON PAGE {page}] {selected}\n\n{context}"
    return context[:30000], candidate_pages


def _provider_config(intent: str) -> Tuple[str, str, str]:
    load_env_files()
    if intent == "image":
        key = (
            os.getenv("VISION_API_KEY")
            or os.getenv("OPENROUTER_API_KEY")
            or os.getenv("OPENAI_API_KEY")
        )
        model = os.getenv("VISION_MODEL")
        base_url = os.getenv("VISION_BASE_URL", "https://api.openai.com/v1")
        if not key or not model:
            raise AgentError(
                "Luồng chụp ảnh cần model vision. Hãy cấu hình VISION_API_KEY hoặc "
                "OPENROUTER_API_KEY, cùng với VISION_MODEL ở server."
            )
        return key, base_url.rstrip("/"), model

    key = os.getenv("AI_API_KEY") or os.getenv("DEEPSEEK_API_KEY")
    if not key:
        raise AgentError("Server chưa được cấu hình AI_API_KEY hoặc DEEPSEEK_API_KEY.")
    return (
        key,
        os.getenv("AI_BASE_URL", "https://api.deepseek.com").rstrip("/"),
        os.getenv("AI_MODEL", "deepseek-v4-flash"),
    )


def _json_from_text(text: str) -> Dict[str, Any]:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        # Some OpenAI-compatible providers occasionally return literal newlines
        # inside JSON strings. Python can safely recover these with strict=False.
        value = json.loads(cleaned, strict=False)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if not match:
            raise AgentError("Model không trả về JSON hợp lệ.")
        try:
            value = json.loads(match.group(0), strict=False)
        except json.JSONDecodeError as exc:
            raise AgentError(f"Model trả JSON lỗi: {exc.msg}.") from exc
    if not isinstance(value, dict):
        raise AgentError("Model trả về sai cấu trúc dữ liệu.")
    return value


def _call_model(payload: Dict[str, Any], intent: str, evidence: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    key, base_url, model = _provider_config(intent)
    system = """Bạn là trợ lý học tập chỉ được dùng EVIDENCE được cung cấp.
Không dùng kiến thức bên ngoài, không bịa citation. Nếu evidence không đủ, trả kind=clarify và nói rõ cần gì.
Đáp ứng đúng nhu cầu về độ dài, đối tượng đọc và định dạng trong câu hỏi.
Mọi ý kiến thức phải có citation [trang N] với N xuất hiện trong EVIDENCE.
Giữ nguyên ít nhất một lần các thuật ngữ/nhãn tiếng Anh liên quan có trong EVIDENCE,
đặc biệt: LLM, token, attention, context, compute, metric, Automate, Augment, Rule,
Workflow, Agent, MoE, precision, recall, False Positive, False Negative, Go, Not Yet, No-Go.
Có thể giải thích bằng tiếng Việt nhưng không thay hoàn toàn nhãn gốc bằng từ đồng nghĩa.
Nếu EVIDENCE không chứa nội dung được hỏi, dùng cách nói rõ ràng: "Tài liệu được cung cấp không có...".
Với tóm tắt toàn bộ tài liệu, phải bao phủ các chủ đề chính ở đầu, giữa và cuối deck;
không dùng nhiều ý cho cùng một chủ đề rồi bỏ sót phần còn lại.
Trả JSON thuần theo schema:
{"conf": 0-100, "kind": "answered|clarify|refuse", "body": ["..."], "sources": [{"page": 1, "text": "trích ngắn từ evidence"}]}"""
    question = str(payload.get("question", "")).strip()
    user_text = f"Câu hỏi: {question}\n\nEVIDENCE:\n{evidence}"
    if intent == "image":
        content: Any = [
            {"type": "text", "text": user_text},
            {"type": "image_url", "image_url": {"url": payload["image_data_url"]}},
        ]
    else:
        content = user_text

    request_payload = {
        "model": model,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": content}],
        "temperature": 0.1,
        # Full-deck summaries need enough room for both provider reasoning and
        # the final JSON envelope; too small a cap can truncate otherwise valid JSON.
        "max_tokens": 3000 if intent == "summary" else 2000,
        "response_format": {"type": "json_object"},
    }
    def post(body: Dict[str, Any]) -> Tuple[Dict[str, Any], str, int, requests.Response]:
        started = time.monotonic()
        response = requests.post(
            f"{base_url}/chat/completions",
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json=body,
            timeout=90,
        )
        latency = round((time.monotonic() - started) * 1000)
        if not response.ok:
            detail = response.text[:300].replace(key, "<redacted>")
            raise AgentError(f"API trả lỗi {response.status_code}: {detail}")
        raw_response = response.json()
        try:
            response_text = raw_response["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError) as exc:
            raise AgentError("API trả về cấu trúc không hợp lệ.") from exc
        return raw_response, response_text, latency, response

    raw, text, latency_ms, response = post(request_payload)
    initial_usage = raw.get("usage", {})
    repaired = False
    def parse_and_validate(response_text: str) -> Dict[str, Any]:
        candidate = _json_from_text(response_text)
        candidate_body = candidate.get("body")
        if isinstance(candidate_body, str):
            has_body = bool(candidate_body.strip())
        else:
            has_body = isinstance(candidate_body, list) and any(
                str(item).strip() for item in candidate_body
            )
        if not has_body:
            raise AgentError("Model không trả nội dung trả lời.")
        return candidate

    try:
        parsed = parse_and_validate(text)
    except AgentError:
        # One bounded self-repair makes malformed provider JSON recoverable while
        # retaining the original prompt and model. The retry is exposed in trace.
        repair_payload = {**request_payload}
        repair_payload["messages"] = [
            *request_payload["messages"],
            {"role": "assistant", "content": text},
            {
                "role": "user",
                "content": (
                    "JSON trên không parse được. Chỉ trả lại cùng nội dung dưới dạng JSON hợp lệ "
                    "đúng schema; escape mọi xuống dòng và dấu ngoặc kép trong chuỗi."
                ),
            },
        ]
        raw, text, repair_latency, response = post(repair_payload)
        latency_ms += repair_latency
        parsed = parse_and_validate(text)
        repaired = True
    meta = {
        "model": raw.get("model", model),
        "request_id": raw.get("id") or response.headers.get("x-request-id"),
        "latency_ms": latency_ms,
        "usage": (
            {"initial": initial_usage, "repair": raw.get("usage", {})}
            if repaired
            else initial_usage
        ),
        "json_repair_retry": repaired,
    }
    return parsed, meta


def _normalize_answer(
    answer: Dict[str, Any],
    allowed_pages: List[int],
    pages: Tuple[str, ...],
    body_limit: int = 8,
) -> Dict[str, Any]:
    body = answer.get("body")
    if isinstance(body, str):
        body = [body]
    if not isinstance(body, list) or not body:
        raise AgentError("Model không trả nội dung trả lời.")
    body = [str(item) for item in body[:body_limit]]
    sources = []
    for source in answer.get("sources") or []:
        try:
            page = int(source.get("page"))
        except (AttributeError, TypeError, ValueError):
            continue
        if page not in allowed_pages or page < 1 or page > len(pages):
            continue
        excerpt = str(source.get("text") or "").strip()
        # Never display a model-invented quote: fall back to extracted source text.
        if not excerpt or excerpt.lower() not in pages[page - 1].lower():
            excerpt = pages[page - 1][:220]
        sources.append({"page": page, "text": excerpt})
        if len(sources) >= 8:
            break

    kind = str(answer.get("kind") or "answered")
    if kind not in {"answered", "clarify", "refuse"}:
        kind = "answered"
    conf = max(0, min(100, int(answer.get("conf") or 0)))
    if kind == "answered" and not sources:
        conf = min(conf, 49)
        body.append("Mình chưa xác minh được citation cho câu trả lời này; hãy kiểm tra lại trong tài liệu.")
    return {"conf": conf, "kind": kind, "body": body, "sources": sources}


def _trace(event: Dict[str, Any], trace_path: Path = TRACE_PATH) -> None:
    trace_path.parent.mkdir(parents=True, exist_ok=True)
    with trace_path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(event, ensure_ascii=False) + "\n")


def run_agent(payload: Dict[str, Any], trace_path: Optional[Path] = None) -> Dict[str, Any]:
    question = str(payload.get("question", "")).strip()
    if not question:
        raise AgentError("Câu hỏi không được để trống.")
    document = str(payload.get("document") or "d2-slide-hackathon.pdf")
    pages = document_pages(document)
    intent = classify(payload)
    steps = [{"tool": "classify_intent", "result": intent}]

    requested_page = int(payload.get("page") or 1)
    if requested_page < 1 or requested_page > len(pages):
        intent = "clarify"
        steps.append({"tool": "validate_page", "result": "not_found", "page_count": len(pages)})
        answer = {
            "conf": 100,
            "kind": "clarify",
            "body": [f"Trang {requested_page} không tồn tại trong {document}; tài liệu này có {len(pages)} trang."],
            "sources": [],
        }
        meta = {"model": None, "request_id": None, "latency_ms": 0, "usage": {}}
        allowed_pages: List[int] = []
    elif intent == "refuse":
        answer = {
            "conf": 100,
            "kind": "refuse",
            "body": ["Yêu cầu này nằm ngoài phạm vi học liệu. Với deadline hoặc link nộp, hãy kiểm tra LMS/Discord chính thức; mình sẽ không đoán."],
            "sources": [],
        }
        meta = {"model": None, "request_id": None, "latency_ms": 0, "usage": {}}
        allowed_pages: List[int] = []
    elif intent == "clarify":
        answer = {
            "conf": 100,
            "kind": "clarify",
            "body": ["Mình chưa nhìn thấy vùng cần giải thích, hoặc vùng chọn quá nhỏ. Hãy chụp lại vùng rộng hơn và gồm cả tiêu đề/chú thích."],
            "sources": [],
        }
        meta = {"model": None, "request_id": None, "latency_ms": 0, "usage": {}}
        allowed_pages = []
    else:
        evidence, allowed_pages = gather_evidence(payload, intent)
        steps.append({"tool": "retrieve_lesson_evidence", "pages": allowed_pages})
        try:
            answer, meta = _call_model(payload, intent, evidence)
            body_limit = 8
            if intent == "summary":
                requested_count = re.search(
                    r"(?:tối đa|max|đúng|chỉ)\s*(\d+)\s*(?:gạch|ý|mục|bullet)?",
                    question,
                    re.IGNORECASE,
                )
                body_limit = min(8, int(requested_count.group(1))) if requested_count else 5
            answer = _normalize_answer(answer, allowed_pages, pages, body_limit=body_limit)
        except AgentError as exc:
            try:
                failed_model = _provider_config(intent)[2]
            except AgentError:
                failed_model = None
            _trace({
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "intent": intent,
                "document": document,
                "page": payload.get("page"),
                "input_sha256": hashlib.sha256(question.encode("utf-8")).hexdigest(),
                "steps": steps,
                "result_kind": "error",
                "error": str(exc),
                "model": failed_model,
                "request_id": None,
            }, trace_path or TRACE_PATH)
            raise
        steps.append({"tool": "verify_citations", "valid_sources": len(answer["sources"])})

    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "intent": intent,
        "document": document,
        "page": payload.get("page"),
        "input_sha256": hashlib.sha256(question.encode("utf-8")).hexdigest(),
        "steps": steps,
        "result_kind": answer["kind"],
        "model": meta.get("model"),
        "request_id": meta.get("request_id"),
        "latency_ms": meta.get("latency_ms"),
        "usage": meta.get("usage"),
        "json_repair_retry": meta.get("json_repair_retry", False),
    }
    _trace(event, trace_path or TRACE_PATH)
    return {**answer, "trace": {"request_id": meta.get("request_id"), "model": meta.get("model")}}


def image_file_to_data_url(path: Path) -> str:
    mime = "image/png" if path.suffix.lower() == ".png" else "image/jpeg"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"
