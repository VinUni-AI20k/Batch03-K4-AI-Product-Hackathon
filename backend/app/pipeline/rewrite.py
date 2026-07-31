"""Build grounded source bundles for the section-rewrite prompt."""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from concurrent.futures import ThreadPoolExecutor
import logging
import re
from typing import Any

from app.core.llm_client_openai import call_text
from app.core.schemas import (
    Citation,
    Level,
    OutlineSection,
    SectionContext,
    SectionContextSlide,
    SectionContextTranscript,
    Slide,
    Style,
    StudyNote,
    StudyNoteSection,
    TranscriptSegment,
    WeakSection,
)

SOURCE_THIN_CHARACTER_LIMIT = 200
MINUTES_PER_SECTION = 2
GROUNDING_LOGGER = logging.getLogger("illumimate.grounding")
_CITATION_MARKER_RE = re.compile(r"\[(?P<marker_type>S|T)-(?P<source_id>[\w-]+)\]")
_SENTENCE_RE = re.compile(r"(?<=[.!?])\s+|\n+")
_WORD_RE = re.compile(r"\b[\wÀ-ỹ-]+\b", re.UNICODE)
_GUIDING_SENTENCE_PREFIXES = (
    "hãy cùng xem xét",
    "hãy cùng",
    "cùng xem xét",
    "trong phần này",
)

THIN_SOURCE_INSTRUCTION = """LƯU Ý: Nguồn cho phần này khá mỏng. Hãy viết ngắn gọn, KHÔNG cố kéo dài bằng cách thêm
chi tiết không có trong nguồn. Thà ngắn và chính xác còn hơn dài và bịa."""


def _field(value: object, name: str, default: Any = None) -> Any:
    """Read a field from a Pydantic model, regular object, or mapping."""
    if isinstance(value, Mapping):
        return value.get(name, default)
    return getattr(value, name, default)


def _weak_reason(weak_info: WeakSection | Mapping[str, Any] | Iterable[object] | None, section_id: str) -> str | None:
    if weak_info is None:
        return None
    if isinstance(weak_info, (WeakSection, Mapping)):
        candidates = [weak_info]
    elif isinstance(weak_info, Iterable) and not isinstance(weak_info, (str, bytes)):
        candidates = weak_info
    else:
        candidates = [weak_info]
    for candidate in candidates:
        candidate_section_id = _field(candidate, "section_id")
        if candidate_section_id in (None, section_id):
            reason = _field(candidate, "reason")
            return str(reason) if reason else None
    return None


def build_section_context(
    section: OutlineSection,
    outline: Iterable[OutlineSection],
    slides: Iterable[Slide],
    transcript_segments: Iterable[TranscriptSegment],
    weak_info: WeakSection | Mapping[str, Any] | Iterable[object] | None,
) -> SectionContext:
    """Collect all slide-aligned sources needed to rewrite one section.

    ``outline`` resolves a section that may have been supplied as a partial
    object; source extraction always follows the canonical section's
    ``slide_ids``. The result remains usable when source text is sparse so the
    caller can switch to its conservative/source-thin prompt.
    """
    canonical_section = next(
        (item for item in outline if item.section_id == section.section_id), section
    )
    slide_ids = set(canonical_section.slide_ids)
    selected_slides = [slide for slide in slides if slide.slide_id in slide_ids]
    selected_transcript = [
        segment
        for segment in transcript_segments
        if segment.slide_id is not None and segment.slide_id in slide_ids
    ]
    source_characters = sum(len(slide.text) for slide in selected_slides) + sum(
        len(segment.text) for segment in selected_transcript
    )
    return SectionContext(
        title=canonical_section.title,
        section_id=canonical_section.section_id,
        slides=[
            SectionContextSlide(id=slide.slide_id, page=slide.page_number, text=slide.text)
            for slide in selected_slides
        ],
        transcript=[
            SectionContextTranscript(id=segment.segment_id, text=segment.text)
            for segment in selected_transcript
        ],
        weak_reason=_weak_reason(weak_info, canonical_section.section_id),
        source_thin=source_characters < SOURCE_THIN_CHARACTER_LIMIT,
    )


def render_rewrite_prompt(
    context: SectionContext,
    level: Level | str,
    style: Style | str,
    time_budget_minutes: int,
) -> str:
    """Render the grounded rewrite prompt without adding or transforming source text."""
    level_value = level.value if isinstance(level, Level) else level
    style_value = style.value if isinstance(style, Style) else style
    thin_source_instruction = THIN_SOURCE_INSTRUCTION if context.source_thin else ""
    weak_reason = context.weak_reason or "(không có lý do cụ thể được cung cấp)"
    slide_content = "\n".join(
        f"[S-{slide.id}] (trang {slide.page}): {slide.text}" for slide in context.slides
    )
    transcript_content = "\n".join(
        f"[T-{segment.id}]: {segment.text}" for segment in context.transcript
    )

    return f'''Bạn là trợ giảng cá nhân hóa. Nhiệm vụ: VIẾT LẠI phần bài giảng "{context.title}" để giúp học viên
hiểu rõ phần họ đang yếu — level={level_value}, style={style_value}.

QUY TẮC BẮT BUỘC:
1. CHỈ dùng thông tin trong SOURCE bên dưới. Không thêm kiến thức ngoài, không bịa ví dụ,
   không bịa số liệu, không suy diễn ngoài những gì slide/transcript nói.
2. Mọi câu chứa thông tin thực chất phải có trích dẫn ngay sau nó, dùng đúng định dạng
   [S-slide_id] cho slide hoặc [T-transcript_id] cho transcript. Có thể trích nhiều nguồn
   trong 1 câu: "...ví dụ như X [S-03][T-045]."
3. Nếu SOURCE không đủ để giải thích rõ một điểm, hãy nói thẳng ("Bài giảng gốc không đề cập
   chi tiết về...") thay vì tự bịa thêm.
4. Điều chỉnh độ sâu theo level:
   - beginner: giải thích từ đầu, ưu tiên ví dụ đơn giản có trong nguồn, hạn chế thuật ngữ
     không cần thiết.
   - intermediate: giả định đã nắm khái niệm nền, đi thẳng vào phần khó/hay nhầm lẫn.
   - advanced: ngắn gọn, tập trung edge case / độ chính xác kỹ thuật có trong nguồn.
5. Điều chỉnh style:
   - intuitive: ưu tiên phần transcript giảng viên giải thích bằng ví dụ/ẩn dụ đời thường.
   - mathematical: ưu tiên phần slide có định nghĩa/công thức formal.
   - both: cân bằng cả hai, đối chiếu ẩn dụ với định nghĩa formal.
6. TUYỆT ĐỐI không dùng ngôn ngữ overclaim ("đảm bảo bạn sẽ hiểu 100%", "chắc chắn đúng").
   Dùng ngôn ngữ điềm tĩnh, factual, có thể dùng "mức độ tự tin" thay vì cam kết tuyệt đối.
7. Format: Markdown thuần, đoạn ngắn, dùng bullet nếu slide gốc cũng dùng bullet.
8. Độ dài: vừa đủ đọc trong khoảng {time_budget_minutes} phút.
{thin_source_instruction}

LÝ DO SECTION NÀY ĐƯỢC CHỌN ĐỂ DẠY LẠI:
{weak_reason}

--- SLIDE CONTENT ---
{slide_content}

--- TRANSCRIPT LIÊN QUAN ---
{transcript_content}

Viết lại phần "{context.title}" theo đúng yêu cầu trên.'''


def call_rewrite_llm(prompt: str) -> str:
    """Generate one rewritten section as raw Markdown using the shared LLM client."""
    return call_text(prompt, max_tokens=1000, temperature=0.2)


def _is_substantive_sentence(sentence: str) -> bool:
    normalized = sentence.strip().lower()
    if not normalized or normalized.startswith(_GUIDING_SENTENCE_PREFIXES):
        return False
    return len(_WORD_RE.findall(_CITATION_MARKER_RE.sub("", sentence))) > 6


def validate_citations(content_markdown: str, context: SectionContext) -> list[Citation]:
    """Validate every source marker and log the section-level grounding proxy.

    A substantive sentence has more than six words after citation markers are
    removed. A guiding sentence (for example, ``Hãy cùng xem xét...``) is
    excluded from the denominator. The function deliberately does not change
    the Markdown: callers decide whether invalid citations require a retry.
    """
    valid_slide_ids = {slide.id for slide in context.slides}
    valid_transcript_ids = {segment.id for segment in context.transcript}
    citations: list[Citation] = []
    for match in _CITATION_MARKER_RE.finditer(content_markdown):
        source_id = match.group("source_id")
        marker_type = match.group("marker_type")
        citation_type = "slide" if marker_type == "S" else "transcript"
        valid_ids = valid_slide_ids if citation_type == "slide" else valid_transcript_ids
        citations.append(
            Citation(
                id=source_id,
                type=citation_type,
                valid=source_id in valid_ids,
                section_id=context.section_id,
            )
        )

    substantive_sentences = [
        sentence for sentence in _SENTENCE_RE.split(content_markdown) if _is_substantive_sentence(sentence)
    ]
    grounded_sentences = sum(
        any(
            match.group("source_id")
            in (valid_slide_ids if match.group("marker_type") == "S" else valid_transcript_ids)
            for match in _CITATION_MARKER_RE.finditer(sentence)
        )
        for sentence in substantive_sentences
    )
    grounding_ratio = (
        grounded_sentences / len(substantive_sentences) if substantive_sentences else 0.0
    )
    GROUNDING_LOGGER.info(
        "grounding_ratio=%.3f grounded_sentences=%d substantive_sentences=%d",
        grounding_ratio,
        grounded_sentences,
        len(substantive_sentences),
    )
    return citations


def postprocess(content_markdown: str, citations: Iterable[Citation]) -> str:
    """Hide hallucinated source IDs before Markdown is shown to a learner.

    Invalid citations are deliberately replaced rather than removed so a
    reviewer can see that the generated claim did not have a known source.
    """
    sanitized_content = content_markdown
    handled_markers: set[tuple[str, str]] = set()
    for citation in citations:
        if citation.valid:
            continue
        marker_kind = "S" if citation.type == "slide" else "T"
        marker_key = (marker_kind, citation.id)
        if marker_key in handled_markers:
            continue
        handled_markers.add(marker_key)
        marker = f"[{marker_kind}-{citation.id}]"
        sanitized_content = sanitized_content.replace(marker, "[nguồn không xác định]")
        GROUNDING_LOGGER.warning(
            "invalid_citation section_id=%s marker=%s",
            citation.section_id or "unknown",
            marker,
        )
    return sanitized_content


def _generate_study_note_section(
    weak_section: WeakSection,
    outline: list[OutlineSection],
    slides: list[Slide],
    transcript_segments: list[TranscriptSegment],
    level: Level | str,
    style: Style | str,
    time_budget_minutes: int,
) -> StudyNoteSection:
    section = next(
        (item for item in outline if item.section_id == weak_section.section_id), None
    )
    if section is None:
        raise ValueError(f"Weak section is missing from outline: {weak_section.section_id}")
    context = build_section_context(
        section,
        outline,
        slides,
        transcript_segments,
        weak_section,
    )
    prompt = render_rewrite_prompt(context, level, style, time_budget_minutes)
    generated_markdown = call_rewrite_llm(prompt)
    citations = validate_citations(generated_markdown, context)
    return StudyNoteSection(
        section_id=section.section_id,
        title=section.title,
        content_md=postprocess(generated_markdown, citations),
        citations=citations,
    )


def generate_study_note(
    weak_sections: Iterable[WeakSection],
    outline: Iterable[OutlineSection],
    slides: Iterable[Slide],
    transcript_segments: Iterable[TranscriptSegment],
    level: Level | str,
    style: Style | str,
    time_budget_minutes: int,
) -> StudyNote:
    """Generate grounded study notes concurrently, preserving weakness priority.

    The supplied weakness order is the ranking from analysis and is never
    changed here. A section is budgeted at roughly two minutes; a short total
    budget therefore limits work to its leading sections rather than producing
    rushed notes for every section.
    """
    ordered_weak_sections = list(weak_sections)
    max_sections = max(1, time_budget_minutes // MINUTES_PER_SECTION)
    selected_weak_sections = ordered_weak_sections[:max_sections]
    if not selected_weak_sections:
        return StudyNote()

    outline_list = list(outline)
    slides_list = list(slides)
    transcript_list = list(transcript_segments)
    per_section_minutes = max(1, time_budget_minutes // len(selected_weak_sections))
    with ThreadPoolExecutor(max_workers=len(selected_weak_sections)) as executor:
        sections = list(
            executor.map(
                lambda weak_section: _generate_study_note_section(
                    weak_section,
                    outline_list,
                    slides_list,
                    transcript_list,
                    level,
                    style,
                    per_section_minutes,
                ),
                selected_weak_sections,
            )
        )
    return StudyNote(sections=sections)
