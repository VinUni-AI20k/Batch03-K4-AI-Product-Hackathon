/**
 * Cross-layer API shapes.
 *
 * The backend mirrors these with Pydantic models in app/core/schemas.py;
 * keeping this file free of UI-only fields makes it safe to use from any
 * frontend pipeline/API client.
 */
export type Section = string;
export type SegmentId = string;

export type Level = "beginner" | "intermediate" | "advanced";
export type Style = "intuitive" | "mathematical" | "both";

/** A raw, citable instructor-transcript segment (for example `T01-001`). */
export type TranscriptSegment = {
  segment_id: SegmentId;
  text: string;
  slide_id?: string;
};

/** One PDF page before it is converted into outline sections. */
export type Slide = {
  slide_id: string;
  page_number: number;
  title: string;
  text: string;
  segment_ids: SegmentId[];
};

/** A reference to one source segment: transcript (`T01-001`) or slide (`P01-S01`). */
export type Citation = {
  id: SegmentId;
  type: "slide" | "transcript";
  valid: boolean;
  section_id?: Section;
};

export type OutlineSection = {
  section_id: Section;
  title: string;
  key_points: string[];
  slide_ids: string[];
};

export type WeakSection = {
  section_id: Section;
  weak_score: number;
  reason: string;
};

export type StudyNoteSection = {
  section_id: Section;
  title: string;
  content_md: string;
  citations: Citation[];
};

export type StudyNote = {
  sections: StudyNoteSection[];
};

export type SectionContextSlide = { id: string; page: number; text: string };

export type SectionContextTranscript = { id: SegmentId; text: string };

export type SectionContext = {
  title: string;
  section_id?: Section;
  slides: SectionContextSlide[];
  transcript: SectionContextTranscript[];
  weak_reason?: string;
  source_thin: boolean;
};

export type QuizOption = {
  text: string;
  /** The misconception exposed when this incorrect option is selected. */
  misconception_tag?: string;
};

/**
 * Canonical quiz question exchanged between the API client, UI, grading and
 * diagnosis. Answers are always represented by an option index.
 */
export type McqQuestion = {
  id: string;
  section_id: Section;
  question: string;
  options: QuizOption[];
  correct_index: number;
  explanation: string;
  segment_id?: string;
};

export type QuizAnswer = {
  question_id: string;
  selected_index: number;
};

export type QuizPayload = {
  outline: OutlineSection[];
  questions: McqQuestion[];
};

export type SectionStat = { section: Section; correct: number; total: number };

export type GradeResult = {
  correctCount: number;
  total: number;
  accuracy: number;
  bySection: SectionStat[];
  weakSections: Section[];
  goodSections: Section[];
};

export type SelfCheckGrade = {
  score: number;
  feedback: string;
  next_step: string;
};

export type ReteachRequest = {
  level: Level;
  style: Style;
  time_available_minutes: number;
  sections: Section[];
  transcript_file?: string;
};

export type ReteachContent = {
  markdown: string;
  citations: Citation[];
  level: Level;
  style: Style;
  time_available_minutes: number;
};
