from collections import defaultdict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.session_store import get_session
from app.core.llm_provider import LLMProviderError, generate_text
from app.pipeline.align import retrieve_relevant_sources

router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatAskRequest(BaseModel):
    session_id: str = Field(..., min_length=1)
    question: str = Field(..., min_length=1)


class ChatAskResponse(BaseModel):
    answer: str
    cited_segment_ids: list[str] = Field(default_factory=list)
    retrieved_segments: list[dict[str, object]] = Field(default_factory=list)
    retrieved_sources: list[dict[str, object]] = Field(default_factory=list)


@router.post("/ask", response_model=ChatAskResponse)
def ask_chat(payload: ChatAskRequest) -> ChatAskResponse:
    session = get_session(payload.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    transcript_segments = [
        segment for segment in (session.raw_transcript or [])
    ]
    sources: list[dict[str, object]] = []
    for segment in transcript_segments:
        sources.append({
            "kind": "transcript",
            "source_id": segment.segment_id,
            "citation": f"[{segment.segment_id}]",
            "text": segment.text,
        })
    for slide in (session.slides or []):
        sources.append({
            "kind": "slide",
            "source_id": slide.slide_id,
            "citation": f"[{slide.slide_id}]",
            "text": f"{slide.title}\n{slide.text}",
        })
    for note in (session.study_note.sections if session.study_note else []):
        sources.append({
            "kind": "study_note",
            "source_id": note.section_id,
            "citation": f"[N-{note.section_id}]",
            "text": f"{note.title}\n{note.content_md}",
        })

    query = payload.question
    ranked = retrieve_relevant_sources(query, sources, top_k=18)
    selected_by_kind: dict[str, list[dict[str, object]]] = defaultdict(list)
    for source in ranked:
        selected_by_kind[str(source["kind"])].append(source)
    selected: list[dict[str, object]] = []
    # Keep each source family represented in the context.
    for kind, limit in (("study_note", 2), ("transcript", 5), ("slide", 5)):
        selected.extend(selected_by_kind[kind][:limit])
    selected.sort(key=lambda item: float(item.get("score", 0)), reverse=True)
    excerpts = "\n".join(
        f"{source['citation']} ({source['kind']}): {source['text']}"
        for source in selected
    ) or "(No matching source excerpt was found.)"
    system_prompt = (
        "You are a grounded study assistant. The learner is asking while reading a study note. "
        "Use the study note only to understand the learner's context. Every factual claim must "
        "be supported by a transcript or slide source, cited with its exact marker such as "
        "[T01-001] or [P01]. Do not cite [N-S1] as the sole support for a factual claim. "
        "If the primary sources do not contain the answer, say that clearly. Never invent facts. "
        "Answer in Vietnamese."
    )
    user_prompt = (
        f"Learner question:\n{payload.question}\n\n"
        f"Hybrid retrieved context:\n{excerpts}"
    )
    try:
        answer = generate_text(system_prompt, user_prompt, max_tokens=700, temperature=0.2)
    except LLMProviderError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    transcript_ids = [
        str(source["source_id"])
        for source in selected
        if source["kind"] == "transcript"
    ]
    return ChatAskResponse(
        answer=answer,
        cited_segment_ids=transcript_ids,
        retrieved_segments=[
            {"segment_id": source["source_id"], "text": source["text"]}
            for source in selected
            if source["kind"] == "transcript"
        ],
        retrieved_sources=selected,
    )
