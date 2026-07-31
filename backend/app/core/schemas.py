"""
Pydantic schemas dung chung toan bo pipeline + API layer.
Quy uoc: transcript segment_id dang "T01-001", slide segment_id dang
"P01-S01", section_id dang "S1" - PHAI nhat quan xuyen suot
tu classify.py -> outline.py -> quiz_bank.py -> weakness.py -> align.py -> rewrite.py.

Neu doi field/shape o day, phai bao ca 4 nguoi truoc khi sua.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Annotated, List, Literal, Optional, Union

from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# Dropdown-only inputs (KHONG dung AI) - routes_session.py nhan truc tiep
# ---------------------------------------------------------------------------

class Level(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class Style(str, Enum):
    INTUITIVE = "intuitive"
    MATHEMATICAL = "mathematical"
    BOTH = "both"


# ---------------------------------------------------------------------------
# classify.py
# ---------------------------------------------------------------------------

class TranscriptSegment(BaseModel):
    """Input tho: 1 doan transcript user upload, chua qua AI."""
    segment_id: str = Field(..., pattern=r"^T\d{2}-\d{3}$")
    text: str
    # Optional because legacy transcript files are not aligned to a slide.
    slide_id: Optional[str] = Field(default=None, pattern=r"^P\d{2}$")


class Slide(BaseModel):
    """A PDF page and its extracted text before it is converted to an outline."""
    slide_id: str = Field(..., pattern=r"^P\d{2}$")
    page_number: int = Field(..., gt=0)
    title: str = Field(..., min_length=1)
    text: str = Field(..., min_length=1)
    segment_ids: List[str] = Field(default_factory=list)


class Citation(BaseModel):
    """A source marker and the result of validating it against section context."""
    id: str = Field(..., min_length=1)
    type: Literal["slide", "transcript"]
    valid: bool
    section_id: Optional[str] = None


class SegmentLabel(str, Enum):
    TEACHING_CONTENT = "TEACHING_CONTENT"
    CLASSROOM_ACTIVITY = "CLASSROOM_ACTIVITY"
    OFF_TOPIC = "OFF_TOPIC"


class ClassifiedSegment(BaseModel):
    """Output classify.py - gan label cho MOI doan (chua loc)."""
    segment_id: str
    text: str
    label: SegmentLabel


# ---------------------------------------------------------------------------
# outline.py
# ---------------------------------------------------------------------------

class OutlineSection(BaseModel):
    section_id: str = Field(..., pattern=r"^S\d+$")
    title: str
    key_points: List[str] = Field(..., min_length=1)
    slide_ids: List[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# quiz_bank.py + quiz_selector.py
# ---------------------------------------------------------------------------

class MCQItem(BaseModel):
    q_id: str
    question: str
    options: List[str] = Field(..., min_length=2, max_length=4)
    correct_index: int = Field(..., ge=0)
    section_id: str
    misconception_tag: Optional[str] = None


class RetestQuestion(MCQItem):
    """Retest-only question metadata; MCQItem remains unchanged for Step 3."""
    q_id: str = Field(..., alias="id")
    section_id: str = Field(..., alias="outline_section_id")
    explanation: str = ""
    source_refs: List[str] = Field(default_factory=list)
    slide_ref: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class RetestSelectedScope(BaseModel):
    mode: Literal["selected"]
    section_ids: List[str] = Field(..., min_length=1, alias="sectionIds")

    model_config = ConfigDict(populate_by_name=True)


class RetestWholeScope(BaseModel):
    mode: Literal["whole"]


RetestScope = Annotated[
    Union[RetestSelectedScope, RetestWholeScope],
    Field(discriminator="mode"),
]


class OpenQuestion(BaseModel):
    q_id: str
    question: str


class QuizBank(BaseModel):
    """Output quiz_bank.py - pool day du cau hoi, generate 1 lan/buoi hoc."""
    mcq: List[MCQItem]
    open_question: OpenQuestion


class QuizKind(str, Enum):
    INITIAL = "initial"
    RETEST = "retest"


class Quiz(BaseModel):
    """Output quiz_selector.py - tap con duoc chon cho 1 luot lam bai
    (dung chung cho quiz dau va quiz retest, phan biet bang field `kind`)."""
    mcq: List[MCQItem]
    open_question: Optional[OpenQuestion] = None
    kind: QuizKind = QuizKind.INITIAL


# ---------------------------------------------------------------------------
# grading.py - RULE-BASED, khong goi AI
# ---------------------------------------------------------------------------

class QuizAnswer(BaseModel):
    """Input tu FE: cau tra loi tho cua user."""
    q_id: str
    selected_index: int


class QuizResultItem(BaseModel):
    q_id: str
    selected_index: int
    correct: bool
    section_id: str


class GradingResult(BaseModel):
    items: List[QuizResultItem]
    score: float = Field(..., ge=0, le=1)


# ---------------------------------------------------------------------------
# weakness.py
# ---------------------------------------------------------------------------

class WeakSection(BaseModel):
    section_id: str
    weak_score: float = Field(..., ge=0, le=1)
    reason: str


class WeaknessAnalysis(BaseModel):
    quiz_result: List[QuizResultItem]
    open_answer_text: str
    weakness_ranking: List[WeakSection]
    sections_to_reteach: List[str] = Field(..., min_length=1, max_length=3)


# ---------------------------------------------------------------------------
# align.py
# ---------------------------------------------------------------------------

class AlignmentItem(BaseModel):
    section_id: str
    related_segment_ids: List[str]
    matches: List[dict] = Field(default_factory=list)
    matched: bool = False
    method: str = "tfidf_cosine+token_overlap"


# ---------------------------------------------------------------------------
# active_mode - server-side self-check contracts
# ---------------------------------------------------------------------------

@dataclass
class RubricPoint:
    point: str
    citation: str | None


@dataclass
class CheckQuestion:
    section_id: str
    question: str
    # Deliberately not part of StudyNoteSection/API serialization.
    rubric_points: list[RubricPoint]


@dataclass
class CheckJudgement:
    section_id: str
    verdict: str
    feedback_markdown: str
    missed_points: list[RubricPoint]


class JudgeAnswerRequest(BaseModel):
    """Payload for grading a server-retained active-mode check."""
    session_id: str = Field(..., min_length=1)
    section_id: str = Field(..., min_length=1)
    learner_answer: str = Field(..., min_length=1, max_length=4000)


class MissedRubricPoint(BaseModel):
    point: str
    citation: str | None = None


class CheckJudgementResponse(BaseModel):
    """Public representation of a grounded active-mode judgement."""
    section_id: str
    verdict: Literal["correct", "partial", "incorrect"]
    feedback_markdown: str
    missed_points: List[MissedRubricPoint] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# rewrite.py
# ---------------------------------------------------------------------------

class StudyNoteSection(BaseModel):
    section_id: str
    title: str
    content_md: str
    citations: List[Citation] = Field(default_factory=list)
    check_question: str | None = None


class StudyNote(BaseModel):
    """The complete grounded study note produced for a learning session."""
    sections: List[StudyNoteSection] = Field(default_factory=list)


class SectionContextSlide(BaseModel):
    """The minimal slide representation exposed to the rewrite prompt."""
    id: str
    page: int
    text: str


class SectionContextTranscript(BaseModel):
    """The minimal transcript representation exposed to the rewrite prompt."""
    id: str
    text: str


class SectionContext(BaseModel):
    """Grounded source bundle used to write one study-note section."""
    title: str
    section_id: Optional[str] = None
    slides: List[SectionContextSlide] = Field(default_factory=list)
    transcript: List[SectionContextTranscript] = Field(default_factory=list)
    weak_reason: Optional[str] = None
    source_thin: bool = False


class PersistedRubricPoint(BaseModel):
    point: str
    citation: str | None = None


class ActiveModeCheck(BaseModel):
    """Rubric and grounded context retained for active-mode grading."""
    question: str
    rubric: List[PersistedRubricPoint] = Field(default_factory=list)
    context: SectionContext


class SelfCheckGradeRequest(BaseModel):
    """A learner's free-text response to the end-of-section active check."""
    section_id: str = Field(..., pattern=r"^[sS]\d+$")
    question: str = Field(..., min_length=3)
    learner_answer: str = Field(..., min_length=1, max_length=4000)
    source_context: str = Field(..., min_length=10, max_length=12000)


class SelfCheckGrade(BaseModel):
    score: int = Field(..., ge=0, le=100)
    feedback: str = Field(..., min_length=1)
    next_step: str = Field(..., min_length=1)


class ReteachRequest(BaseModel):
    """Parameters for deterministic, single-stream adaptive re-teaching."""
    level: Level = Level.INTERMEDIATE
    style: Style = Style.BOTH
    time_available_minutes: int = Field(default=15, gt=0)
    sections: List[str] = Field(..., min_length=1)
    transcript_file: str = "transcript-01-clean.md"


class ReteachContent(BaseModel):
    markdown: str = Field(..., min_length=1)
    citations: List[Citation] = Field(default_factory=list)
    level: Level
    style: Style
    time_available_minutes: int


# ---------------------------------------------------------------------------
# chat.py - P1, grounded Q&A cho free-form question
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    session_id: str
    question: str


class ChatResponse(BaseModel):
    answer: str


# ---------------------------------------------------------------------------
# retest - tai su dung grading.py, them citation cho cau sai
# ---------------------------------------------------------------------------

class RetestResultItem(BaseModel):
    q_id: str
    selected_index: int
    correct: bool
    section_id: str
    source_segment_ids: Optional[List[str]] = None  # chi co khi correct=False


class RetestResult(BaseModel):
    items: List[RetestResultItem]
    score: float = Field(..., ge=0, le=1)
    previous_score: Optional[float] = None  # de hien thi before/after


class RetestGradeResultItem(BaseModel):
    question_id: str
    outline_section_id: str
    correct: bool
    user_answer_text: str = Field(..., alias="userAnswerText")
    correct_answer_text: str = Field(..., alias="correctAnswerText")
    source_refs: List[str] = Field(default_factory=list)
    slide_ref: Optional[str] = None
    study_note_section_id: Optional[str] = Field(default=None, alias="studyNoteSectionId")

    model_config = {"populate_by_name": True}


class RetestGradeResult(BaseModel):
    score: float = Field(..., ge=0, le=1)
    total_questions: int = Field(..., ge=0, alias="totalQuestions")
    results: List[RetestGradeResultItem]

    model_config = {"populate_by_name": True}


class SavedRetestQuiz(BaseModel):
    saved_quiz_id: str
    session_id: Optional[str] = None
    scope: RetestScope
    num_questions: int = Field(..., ge=1, alias="numQuestions")
    questions: List[RetestQuestion]
    created_at: str

    model_config = {"populate_by_name": True}


# ---------------------------------------------------------------------------
# session_store.py - state tong cua 1 phien hoc
# ---------------------------------------------------------------------------

class SessionState(BaseModel):
    session_id: str
    level: Optional[Level] = None
    style: Optional[Style] = None
    time_available_minutes: Optional[int] = None

    raw_transcript: Optional[List[TranscriptSegment]] = None
    classified_transcript: Optional[List[ClassifiedSegment]] = None
    outline: Optional[List[OutlineSection]] = None
    slides: Optional[List[Slide]] = None
    source: Optional[str] = None
    quiz_bank: Optional[QuizBank] = None

    initial_quiz: Optional[Quiz] = None
    initial_grading: Optional[GradingResult] = None
    weakness: Optional[WeaknessAnalysis] = None

    alignment: Optional[List[AlignmentItem]] = None
    study_note: Optional[StudyNote] = None
    active_mode_checks: dict[str, ActiveModeCheck] = Field(default_factory=dict)

    retest_quiz: Optional[Quiz] = None
    retest_result: Optional[RetestResult] = None
