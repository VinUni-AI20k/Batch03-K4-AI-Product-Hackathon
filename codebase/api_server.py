"""Local VLearn prototype server for quiz generation and grounded slide Q&A."""
from __future__ import annotations

import json
import os
import re
import shutil
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from lesson_agent import answer_question
from quiz_agent import run_quiz_agent
from slide_store import SlideStore

ROOT = Path(__file__).resolve().parents[1]
STATIC_DIR = ROOT / "codebase"
TRANSCRIPT = ROOT / "data/vlearn-pack/transcript/transcript-03-clean.md"
TRACE_DIR = ROOT / "eval/traces"
DEFAULT_SOURCE_IDS = [f"T03-{number:03d}" for number in range(24, 39)]
SLIDE_STORE = SlideStore(ROOT / "slide")
SLIDE_FILES = {
    lesson["id"]: ROOT / "slide" / lesson["filename"]
    for lesson in SLIDE_STORE.list_lessons()
    if lesson["available"]
}


def load_env_file() -> None:
    path = ROOT / ".env"
    if not path.exists(): return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line: continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file()


def load_chunks(source_ids: list[str]) -> list[dict[str, str]]:
    text = TRANSCRIPT.read_text(encoding="utf-8")
    chunks = []
    for source_id in source_ids:
        pattern = rf"\*\*\[{re.escape(source_id)}\]\*\*\s*(.*?)(?=\n\n\*\*\[T|\n##|\Z)"
        match = re.search(pattern, text, flags=re.DOTALL)
        if not match:
            raise ValueError(f"Không tìm thấy source ID: {source_id}")
        chunks.append({"id": source_id, "text": " ".join(match.group(1).split())})
    return chunks


def validate_quiz(payload: dict, allowed_ids: set[str], question_count: int = 15) -> dict:
    if payload.get("status") not in {"OK", "INSUFFICIENT_EVIDENCE"}:
        raise ValueError("status không hợp lệ")
    if payload["status"] == "INSUFFICIENT_EVIDENCE":
        return {"status": payload["status"], "questions": [], "message": payload.get("message", "Chưa đủ học liệu để tạo quiz tin cậy.")}
    questions = payload.get("questions")
    if not isinstance(questions, list) or len(questions) != question_count:
        raise ValueError(f"Quiz phải có đúng {question_count} câu")
    for index, item in enumerate(questions, 1):
        if not isinstance(item.get("question"), str) or not item["question"].strip():
            raise ValueError(f"Câu {index} thiếu nội dung")
        if not isinstance(item.get("options"), list) or len(item["options"]) != 4:
            raise ValueError(f"Câu {index} phải có 4 lựa chọn")
        if item.get("correct") not in range(4):
            raise ValueError(f"Câu {index} có đáp án không hợp lệ")
        source_ids = item.get("source_ids")
        if not source_ids or not set(source_ids).issubset(allowed_ids):
            raise ValueError(f"Câu {index} có source ID rỗng/không hợp lệ")
        if not isinstance(item.get("explanation"), str) or not item["explanation"].strip():
            raise ValueError(f"Câu {index} thiếu giải thích")
    return payload


def call_openai(
    lesson_title: str,
    chunks: list[dict[str, str]],
    validation_feedback: str = "",
    question_count: int = 15,
    focus_topics: list[str] | None = None,
    focus_source_ids: list[str] | None = None,
) -> tuple[dict, dict]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("Thiếu OPENAI_API_KEY trong .env")
    model = os.getenv("OPENAI_MODEL", "gpt-5.6-luna")
    focus_instruction = ""
    if focus_topics:
        focus_instruction = f"""
Đây là QUIZ CỦNG CỐ cá nhân hoá. Chỉ kiểm tra các nội dung cần củng cố: {", ".join(focus_topics)}.
Ưu tiên source_ids: {", ".join(focus_source_ids or [])}. Nếu nguồn ưu tiên không đủ để tạo câu công bằng, trả INSUFFICIENT_EVIDENCE.
"""
    prompt = f"""Bạn là người thiết kế quiz củng cố cuối buổi cho học viên.
Chỉ dùng SOURCE_CHUNKS bên dưới. Tạo đúng {question_count} câu MCQ, mỗi câu 4 lựa chọn, một đáp án đúng.
Không hỏi trivia, không đánh đố, không đưa kiến thức ngoài nguồn.
Mỗi câu phải có explanation ngắn và source_ids hỗ trợ trực tiếp cả câu hỏi lẫn đáp án.
Nếu học liệu không đủ để tạo {question_count} câu công bằng, trả status INSUFFICIENT_EVIDENCE và questions rỗng.
{f"Lần trước output bị từ chối vì: {validation_feedback}. Hãy sửa đúng lỗi này." if validation_feedback else ""}
{focus_instruction}
Trả về JSON thuần, không markdown, theo schema:
{{"status":"OK|INSUFFICIENT_EVIDENCE","message":"...","questions":[{{"question":"...","options":["...","...","...","..."],"correct":0,"explanation":"...","source_ids":["Txx-NNN"]}}]}}

LESSON_TITLE: {lesson_title}
SOURCE_CHUNKS:
{json.dumps(chunks, ensure_ascii=False)}"""
    body = {"model": model, "input": prompt, "reasoning": {"effort": "low"}, "text": {"verbosity": "low"}}
    request = urllib.request.Request("https://api.openai.com/v1/responses", data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"}, method="POST")
    started = datetime.now(timezone.utc)
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            raw = json.loads(response.read())
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode(errors="replace")[:500]
        raise RuntimeError(f"OpenAI HTTP {exc.code}: {detail}") from exc
    text = raw.get("output_text") or "".join(part.get("text", "") for item in raw.get("output", []) for part in item.get("content", []))
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text)
    quiz = json.loads(text)
    trace = {
        "timestamp_utc": started.isoformat(),
        "model": model,
        "lesson_title": lesson_title,
        "source_ids": [c["id"] for c in chunks],
        "usage": raw.get("usage", raw.get("usageMetadata", {})),
    }
    return quiz, trace


def save_trace(trace: dict) -> str:
    TRACE_DIR.mkdir(parents=True, exist_ok=True)
    trace_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    (TRACE_DIR / f"{trace_id}.json").write_text(json.dumps(trace, ensure_ascii=False, indent=2), encoding="utf-8")
    return trace_id


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_POST(self):
        if self.path not in {"/api/generate-quiz", "/api/ask"}:
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            request_data = json.loads(self.rfile.read(length) or b"{}")
            if self.path == "/api/ask":
                payload = answer_question(
                    store=SLIDE_STORE,
                    lesson_id=request_data.get("lesson_id", "day03"),
                    question=request_data.get("question", ""),
                    trace_dir=TRACE_DIR,
                )
                self.respond(payload)
                return
            if request_data.get("purpose", "practice") != "practice":
                self.respond({"status": "OUT_OF_SCOPE", "message": "Quiz và practice credits chỉ dùng cho ôn tập, không dùng trong đánh giá chính thức.", "ai_generated": False})
                return
            source_ids = request_data.get("source_ids") or DEFAULT_SOURCE_IDS
            question_count = int(request_data.get("question_count", 15))
            if question_count < 3 or question_count > 15:
                raise ValueError("question_count phải trong khoảng 3–15")
            focus_topics = request_data.get("focus_topics") or []
            focus_source_ids = request_data.get("focus_source_ids") or []

            def generate(title: str, chunks: list[dict[str, str]], feedback: str):
                return call_openai(
                    title,
                    chunks,
                    feedback,
                    question_count=question_count,
                    focus_topics=focus_topics,
                    focus_source_ids=focus_source_ids,
                )

            quiz, trace = run_quiz_agent(
                lesson_title=request_data.get("lesson_title", "Day03 — Agentic AI"),
                source_ids=source_ids,
                load_chunks=load_chunks,
                generate=generate,
                validate=lambda payload, ids: validate_quiz(payload, ids, question_count),
            )
            trace_id = save_trace(trace)
            self.respond({
                **quiz,
                "trace_id": trace_id,
                "ai_generated": True,
                "agent": "langgraph_transcript_quiz",
                "quiz_kind": "reinforcement" if focus_topics else "teacher_release_draft",
            })
        except Exception as exc:
            self.respond({"status": "ERROR", "message": str(exc), "ai_generated": False}, HTTPStatus.BAD_REQUEST)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/lessons":
            self.respond({"status": "OK", "lessons": SLIDE_STORE.list_lessons()})
            return
        if path.startswith("/slides/"):
            lesson_id = path.removeprefix("/slides/")
            slide_path = SLIDE_FILES.get(lesson_id)
            if slide_path is None:
                self.send_error(HTTPStatus.NOT_FOUND, "Slide not found")
                return
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/pdf")
            self.send_header("Content-Length", str(slide_path.stat().st_size))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            with slide_path.open("rb") as file:
                shutil.copyfileobj(file, self.wfile)
            return
        super().do_GET()

    def respond(self, payload: dict, status=HTTPStatus.OK):
        data = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    print(f"VLearn prototype: http://127.0.0.1:{port}")
    print("AI mode:", "enabled" if os.getenv("OPENAI_API_KEY") else "disabled (missing API key)")
    try:
        ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)
