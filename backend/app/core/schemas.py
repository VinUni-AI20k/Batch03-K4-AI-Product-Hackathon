"""
Pydantic schemas dung chung toan bo pipeline + API layer.
Quy uoc: segment_id dang "T-001", section_id dang "s1" - PHAI nhat quan xuyen suot
tu classify.py -> outline.py -> quiz_bank.py -> weakness.py -> align.py -> rewrite.py.

Neu doi field/shape o day, phai bao ca 4 nguoi truoc khi sua.
"""

from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


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
    segment_id: str = Field(..., pattern=r"^T-\d+$")
    text: str


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
    section_id: str = Field(..., pattern=r"^s\d+$")
    title: str
    key_points: List[str] = Field(..., min_length=1)


# ---------------------------------------------------------------------------
# quiz_bank.py + quiz_selector.py
# ---------------------------------------------------------------------------

class MCQItem(BaseModel):
    q_id: str
    question: str
    options: List[str] = Field(..., min_length=2, max_length=4)
    correct_index: int = Field(..., ge=0)
    section_id: str


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

class WeaknessRankingItem(BaseModel):
    section_id: str
    weak_score: float = Field(..., ge=0, le=1)
    reason: str


class WeaknessAnalysis(BaseModel):
    quiz_result: List[QuizResultItem]
    open_answer_text: str
    weakness_ranking: List[WeaknessRankingItem]
    sections_to_reteach: List[str] = Field(..., min_length=1, max_length=3)


# ---------------------------------------------------------------------------
# align.py
# ---------------------------------------------------------------------------

class AlignmentItem(BaseModel):
    section_id: str
    related_segment_ids: List[str]


# ---------------------------------------------------------------------------
# rewrite.py
# ---------------------------------------------------------------------------

class StudyNoteSection(BaseModel):
    section_id: str
    title: str
    content_md: str
    cited_segment_ids: List[str] = Field(..., min_length=1)


# ---------------------------------------------------------------------------
# chat.py - P1, grounded Q&A cho highlight-to-ask
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    session_id: str
    highlighted_text: Optional[str] = None
    question: str


class ChatResponse(BaseModel):
    answer: str
    cited_segment_ids: List[str] = Field(default_factory=list)


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
    quiz_bank: Optional[QuizBank] = None

    initial_quiz: Optional[Quiz] = None
    initial_grading: Optional[GradingResult] = None
    weakness: Optional[WeaknessAnalysis] = None

    alignment: Optional[List[AlignmentItem]] = None
    study_note: Optional[List[StudyNoteSection]] = None

    retest_quiz: Optional[Quiz] = None
    retest_result: Optional[RetestResult] = None