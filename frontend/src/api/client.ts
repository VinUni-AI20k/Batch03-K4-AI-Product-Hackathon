import type {
  AlignmentItem,
  CheckJudgement,
  GradeResult,
  McqQuestion,
  OutlineSection,
  QuizPayload,
  RetestGradeResult,
  RetestQuestion,
  RetestScope,
  SavedRetestQuiz,
  Section,
  SectionStat,
  SelfCheckGrade,
} from "../../../shared/types";

export type {
  AlignmentItem, CheckJudgement, GradeResult, McqQuestion, OutlineSection, QuizPayload,
  RetestGradeResult, RetestQuestion, RetestScope, SavedRetestQuiz, Section,
  SectionStat, SelfCheckGrade,
} from "../../../shared/types";

const BACKEND_URL = "http://127.0.0.1:8001";
export const MASTERY_THRESHOLD = 0.8;

export async function createSession(): Promise<{ session_id: string }> {
  const response = await fetch(`${BACKEND_URL}/api/sessions`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
  });
  if (!response.ok) throw new Error("Could not create learning session");
  return response.json();
}

async function jsonRequest<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`${path} unavailable`);
  return response.json();
}

export function gradeSelfCheck(payload: {
  section_id: string; question: string; learner_answer: string; source_context: string;
}): Promise<SelfCheckGrade> {
  return jsonRequest("/api/reteach/self-check/grade", payload);
}

export function judgeActiveModeAnswer(payload: {
  session_id: string; section_id: string; learner_answer: string;
}): Promise<CheckJudgement> {
  return jsonRequest("/api/reteach/self-check/judge", payload);
}

export type ChatAnswer = {
  answer: string;
  cited_segment_ids: string[];
  retrieved_segments?: Array<{ segment_id: string; text: string }>;
};
export function askChat(payload: {
  session_id: string;
  question: string;
}): Promise<ChatAnswer> {
  return jsonRequest("/api/chat/ask", payload);
}

export type LLMStatus = {
  provider: string;
  model: string;
  configured: boolean;
  capabilities: string[];
};

export function getLLMStatus(): Promise<LLMStatus> {
  return fetch(`${BACKEND_URL}/api/llm/status`).then(async (response) => {
    if (!response.ok) throw new Error("LLM status unavailable");
    return response.json();
  });
}

export async function uploadSlide(file: File, sessionId: string): Promise<{
  textContent: string;
  outline: OutlineSection[];
  alignment: AlignmentItem[];
  slides: Array<{ id: string; title: string; text: string }>;
}> {
  const form = new FormData();
  form.append("file", file);
  form.append("session_id", sessionId);
  const response = await fetch(`${BACKEND_URL}/api/outline/pdf`, { method: "POST", body: form });
  if (!response.ok) throw new Error("Could not extract outline from PDF");
  const data = await response.json();
  return {
    textContent: `Extracted ${file.name} from slide PDF.`,
    outline: data.outline,
    alignment: data.alignment ?? [],
    slides: (data.slides ?? []).map((slide: { slide_id: string; title: string; text: string }) => ({
      id: slide.slide_id, title: slide.title, text: slide.text,
    })),
  };
}

type RawQuestion = {
  question: string; options: string[]; correct_index: number;
  misconception_tag?: string; section_id: string; segment_id?: string; explanation: string;
};
type GenerateQuizResponse = { outline: OutlineSection[]; questions: RawQuestion[]; alignment?: AlignmentItem[] };

function normalizeQuizPayload(data: GenerateQuizResponse): QuizPayload {
  return {
    outline: data.outline,
    questions: data.questions.map((question, index) => ({
      id: `${question.section_id}-${index}`,
      section_id: question.section_id,
      question: question.question,
      options: question.options.map((text, optionIndex) => ({
        text,
        misconception_tag: optionIndex === question.correct_index ? undefined : question.misconception_tag,
      })),
      correct_index: question.correct_index,
      explanation: question.explanation,
      segment_id: question.segment_id,
    })),
  };
}

export async function generateQuiz(sessionId: string): Promise<{ outline: OutlineSection[]; questions: McqQuestion[]; alignment?: AlignmentItem[] }> {
  const response = await fetch(`${BACKEND_URL}/api/quiz/generate?session_id=${encodeURIComponent(sessionId)}&n_questions=20`, { method: "POST" });
  if (!response.ok) throw new Error("Quiz generation failed");
  const data: GenerateQuizResponse = await response.json();
  return { ...normalizeQuizPayload(data), alignment: data.alignment };
}

export async function generateQuizFromPdf(sessionId: string): Promise<{
  outline: OutlineSection[]; questions: McqQuestion[]; alignment?: AlignmentItem[];
}> {
  const response = await fetch(`${BACKEND_URL}/api/quiz/generate/pdf?session_id=${encodeURIComponent(sessionId)}&n_questions=20`, { method: "POST" });
  if (!response.ok) throw new Error("Quiz generation from PDF failed");
  const data: GenerateQuizResponse = await response.json();
  return { ...normalizeQuizPayload(data), alignment: data.alignment };
}

type RawRetestQuestion = {
  id: string; question: string; options: string[]; correct_index: number;
  outline_section_id: string; explanation?: string; source_refs: string[]; slide_ref?: string | null;
};

export async function generateRetestQuiz(
  sessionId: string, scope: RetestScope, numQuestions: number,
  _filteredTranscript: Array<{ id: string; text: string }> = [], avoidSimilarTo: string[] = [],
): Promise<RetestQuestion[]> {
  const questions: RawRetestQuestion[] = await jsonRequest("/api/retest/generate-quiz", {
    session_id: sessionId,
    scope, numQuestions,
    avoidSimilarTo,
  });
  return questions.map((question) => ({
    id: question.id,
    section_id: question.outline_section_id,
    question: question.question,
    options: question.options.map((text) => ({ text })),
    correct_index: question.correct_index,
    explanation: question.explanation ?? "",
    source_refs: question.source_refs,
    slide_ref: question.slide_ref ?? undefined,
  }));
}

export async function saveRetestQuiz(
  questions: RetestQuestion[], scope: RetestScope, sessionId?: string,
): Promise<SavedRetestQuiz> {
  return jsonRequest("/api/retest/saved", {
    questions: questions.map((question) => ({
      id: question.id, question: question.question,
      options: question.options.map((option) => option.text),
      correct_index: question.correct_index, outline_section_id: question.section_id,
      explanation: question.explanation, source_refs: question.source_refs,
      slide_ref: question.slide_ref ?? null,
    })),
    scope, numQuestions: questions.length, session_id: sessionId,
  });
}

export async function gradeQuiz(questions: McqQuestion[], answers: number[]): Promise<GradeResult> {
  const bySectionMap = new Map<Section, SectionStat>();
  questions.forEach((question, index) => {
    const stat = bySectionMap.get(question.section_id) ?? { section: question.section_id, correct: 0, total: 0 };
    stat.total += 1;
    if (answers[index] === question.correct_index) stat.correct += 1;
    bySectionMap.set(question.section_id, stat);
  });
  const bySection = Array.from(bySectionMap.values());
  const correctCount = bySection.reduce((sum, section) => sum + section.correct, 0);
  return {
    correctCount, total: questions.length,
    accuracy: questions.length ? correctCount / questions.length : 0,
    bySection,
    weakSections: bySection.filter((section) => section.correct < section.total).map((section) => section.section),
    goodSections: bySection.filter((section) => section.correct === section.total).map((section) => section.section),
  };
}

export type StudyContent = {
  section: Section; title: string; markdown: string; summary: string; example: string;
  practice: { question: string; options: string[]; answer: string } | null; citation: string;
  checkQuestion: string | null;
};

type StudyNoteResponse = {
  sections: Array<{ section_id: string; title: string; content_md: string;
    citations: Array<{ id: string }>; check_question: string | null }>;
};

export async function getStudyContent(
  sections: Section[], _outline: OutlineSection[], _questionPool: McqQuestion[],
  level = "intermediate", style = "both", timeAvailableMinutes = 15, _sourceFile?: File | null,
  activeMode = false, sessionId = "",
): Promise<StudyContent[]> {
  const payload = {
    weak_sections: sections.map((section_id) => ({ section_id, weak_score: 0.5, reason: "Diagnostic quiz weakness" })),
    level, style, time_budget_minutes: timeAvailableMinutes, active_mode: activeMode,
    session_id: sessionId,
  };
  try {
    const response = await fetch(`${BACKEND_URL}/api/reteach/study-note`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Grounded study note unavailable");
    const data: StudyNoteResponse = await response.json();
    return data.sections.map((item) => ({
      section: item.section_id, title: item.title, markdown: item.content_md,
      summary: item.content_md, example: item.check_question ?? "", practice: null,
      citation: item.citations[0]?.id ?? "(none)",
      checkQuestion: item.check_question,
    }));
  } catch (error) {
    // TODO-DEMO: local fallback keeps the demo usable without an LLM provider.
    console.warn("Falling back to local study-note demo", error);
  }
  return sections.map((sectionId) => {
    const outlineSection = _outline.find((section) => section.section_id === sectionId);
    const poolQuestion = _questionPool.find((question) => question.section_id === sectionId);
    const summary = outlineSection?.key_points.join(" ") ?? "(no content)";
    const citation = poolQuestion?.segment_id ?? "(none)";
    return {
      section: sectionId, title: outlineSection?.title ?? sectionId,
      markdown: `## ${outlineSection?.title ?? sectionId}\n\n${summary}\n\nCitation: [${citation}]`,
      summary, example: "# TODO-DEMO: grounded example requires the rewrite provider",
      practice: poolQuestion ? {
        question: poolQuestion.question,
        options: poolQuestion.options.map((option) => option.text),
        answer: poolQuestion.options[poolQuestion.correct_index]?.text ?? "",
      } : null,
      citation,
      checkQuestion: null,
    };
  });
}
