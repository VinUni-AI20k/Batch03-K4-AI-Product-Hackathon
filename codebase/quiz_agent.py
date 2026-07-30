"""LangGraph workflow that grounds one quiz in retrieved lesson transcripts."""
from __future__ import annotations

from typing import Callable, TypedDict

from langchain.tools import tool
from langgraph.graph import END, START, StateGraph


class QuizState(TypedDict, total=False):
    lesson_title: str
    source_ids: list[str]
    chunks: list[dict[str, str]]
    raw_quiz: dict
    quiz: dict
    trace: dict
    attempt: int
    generation_error: str
    validation_error: str


def build_quiz_graph(
    load_chunks: Callable[[list[str]], list[dict[str, str]]],
    generate: Callable[[str, list[dict[str, str]], str], tuple[dict, dict]],
    validate: Callable[[dict, set[str]], dict],
):
    """Build retrieve transcript → generate → validate → retry (once) graph."""

    @tool
    def retrieve_transcript_chunks(source_ids: list[str]) -> list[dict[str, str]]:
        """Load the selected transcript chunks that are the sole source for this quiz."""
        return load_chunks(source_ids)

    def retrieve_node(state: QuizState):
        try:
            chunks = retrieve_transcript_chunks.invoke({"source_ids": state["source_ids"]})
            return {"chunks": chunks, "generation_error": ""}
        except Exception as exc:
            return {
                "generation_error": f"Không truy xuất được transcript: {exc}",
                "attempt": state.get("attempt", 0) + 1,
            }

    def generate_node(state: QuizState):
        if state.get("generation_error") and not state.get("chunks"):
            return {}
        try:
            raw_quiz, trace = generate(
                state["lesson_title"],
                state["chunks"],
                state.get("validation_error", ""),
            )
            return {
                "raw_quiz": raw_quiz,
                "trace": trace,
                "generation_error": "",
                "validation_error": "",
            }
        except Exception as exc:
            return {
                "generation_error": f"Không tạo được quiz: {exc}",
                "attempt": state.get("attempt", 0) + 1,
            }

    def validate_node(state: QuizState):
        if state.get("generation_error"):
            return {}
        try:
            quiz = validate(state["raw_quiz"], {chunk["id"] for chunk in state["chunks"]})
            return {"quiz": quiz}
        except Exception as exc:
            return {
                "validation_error": str(exc),
                "attempt": state.get("attempt", 0) + 1,
            }

    def route_after_validation(state: QuizState):
        failed = state.get("generation_error") or state.get("validation_error")
        if failed and state.get("attempt", 0) < 2:
            return "retry"
        return "finish"

    builder = StateGraph(QuizState)
    builder.add_node("retrieve_transcript", retrieve_node)
    builder.add_node("generate_quiz", generate_node)
    builder.add_node("validate_quiz", validate_node)
    builder.add_edge(START, "retrieve_transcript")
    builder.add_edge("retrieve_transcript", "generate_quiz")
    builder.add_edge("generate_quiz", "validate_quiz")
    builder.add_conditional_edges(
        "validate_quiz",
        route_after_validation,
        {"retry": "generate_quiz", "finish": END},
    )
    return builder.compile()


def run_quiz_agent(
    lesson_title: str,
    source_ids: list[str],
    load_chunks: Callable[[list[str]], list[dict[str, str]]],
    generate: Callable[[str, list[dict[str, str]], str], tuple[dict, dict]],
    validate: Callable[[dict, set[str]], dict],
) -> tuple[dict, dict]:
    """Run one traceable LangGraph quiz workflow and return a validated result."""
    graph = build_quiz_graph(load_chunks, generate, validate)
    result = graph.invoke(
        {"lesson_title": lesson_title, "source_ids": source_ids, "attempt": 0},
        config={"recursion_limit": 8},
    )
    if "quiz" not in result:
        error = result.get("validation_error") or result.get("generation_error") or "Lỗi không xác định"
        raise RuntimeError(f"Quiz agent dừng sau {result.get('attempt', 0)} lần thử: {error}")
    trace = result.get("trace", {})
    trace["output"] = result["quiz"]
    trace["langgraph"] = {
        "workflow": "retrieve_transcript → generate_quiz → validate_quiz",
        "source_ids": source_ids,
        "attempts": result.get("attempt", 0) + 1,
    }
    return result["quiz"], trace
