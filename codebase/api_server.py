"""Local VLearn prototype server for quiz generation and grounded slide Q&A."""

from __future__ import annotations

import json
import os
import re
import shutil
import sys
from datetime import UTC, datetime
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

from in_quiz_agent import ask_in_quiz
from lesson_agent import answer_question
from quiz_agent import run_quiz_agent
from llm import call_openai_api
from prompts import get_quiz_generation_prompt
from config import (
    STATIC_DIR,
    TRANSCRIPT,
    TRACE_DIR,
    DEFAULT_SOURCE_IDS,
    SLIDE_STORE,
    SLIDE_FILES,
    get_openai_api_key,
    get_openai_model
)


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
        return {
            "status": payload["status"],
            "questions": [],
            "message": payload.get("message", "Chưa đủ học liệu để tạo quiz tin cậy."),
        }
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


def generate_quiz_call(
    lesson_title: str,
    chunks: list[dict[str, str]],
    validation_feedback: str = "",
    question_count: int = 15,
    focus_topics: list[str] | None = None,
    focus_source_ids: list[str] | None = None,
) -> tuple[dict, dict]:
    prompt = get_quiz_generation_prompt(
        lesson_title, chunks, validation_feedback, question_count, focus_topics, focus_source_ids
    )
    started = datetime.now(UTC)
    text, raw = call_openai_api(prompt)
    
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text)
    quiz = json.loads(text)
    
    trace = {
        "timestamp_utc": started.isoformat(),
        "model": get_openai_model(),
        "lesson_title": lesson_title,
        "source_ids": [c["id"] for c in chunks],
        "usage": raw.get("usage", raw.get("usageMetadata", {})),
    }
    return quiz, trace


def save_trace(trace: dict) -> str:
    TRACE_DIR.mkdir(parents=True, exist_ok=True)
    trace_id = datetime.now(UTC).strftime("%Y%m%dT%H%M%S%fZ")
    (TRACE_DIR / f"{trace_id}.json").write_text(
        json.dumps(trace, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return trace_id


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_POST(self):
        if self.path not in {"/api/generate-quiz", "/api/ask", "/api/ask-quiz"}:
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
            if self.path == "/api/ask-quiz":
                question_context = request_data.get("question_context", {})
                question_text = request_data.get("question", "")
                payload = ask_in_quiz(question_context, question_text, TRACE_DIR)
                self.respond(payload)
                return
            if request_data.get("purpose", "practice") != "practice":
                self.respond(
                    {
                        "status": "OUT_OF_SCOPE",
                        "message": "Quiz và practice credits chỉ dùng cho ôn tập, không dùng trong đánh giá chính thức.",
                        "ai_generated": False,
                    }
                )
                return
            source_ids = request_data.get("source_ids") or DEFAULT_SOURCE_IDS
            question_count = int(request_data.get("question_count", 15))
            if question_count < 3 or question_count > 15:
                raise ValueError("question_count phải trong khoảng 3–15")
            focus_topics = request_data.get("focus_topics") or []
            focus_source_ids = request_data.get("focus_source_ids") or []

            def generate(title: str, chunks: list[dict[str, str]], feedback: str):
                return generate_quiz_call(
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
            self.respond(
                {
                    **quiz,
                    "trace_id": trace_id,
                    "ai_generated": True,
                    "agent": "langgraph_transcript_quiz",
                    "quiz_kind": "reinforcement" if focus_topics else "teacher_release_draft",
                }
            )
        except Exception as exc:  # noqa: BLE001 - convert expected API/runtime errors to JSON
            self.respond(
                {"status": "ERROR", "message": str(exc), "ai_generated": False},
                HTTPStatus.BAD_REQUEST,
            )

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
    try:
        get_openai_api_key()
        ai_enabled = True
    except RuntimeError:
        ai_enabled = False
    print("AI mode:", "enabled" if ai_enabled else "disabled (missing API key)")
    try:
        ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)
