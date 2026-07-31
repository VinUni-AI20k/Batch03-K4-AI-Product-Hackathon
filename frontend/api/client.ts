// api/client.ts
// Real backend integration — FastAPI at http://127.0.0.1:8000 (see backend/README.md).
// No mock data below: every function calls a real endpoint. If the backend is
// down or an AI call fails, these throw — callers surface the error, they do
// not fall back to fake output.

const API_BASE = 'http://127.0.0.1:8000';

export interface QuizQuestion {
  id: string;
  sectionId: string;
  sectionTitle: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  /** Present on questions the backend can trace to a transcript segment. */
  sourceRefs?: string[];
}

export interface OutlineEntry {
  id: string;
  title: string;
}

export interface KnowledgePackage {
  id: string;
  sessionId: string;
  fileNames: string[];
  sectionCount: number;
  quiz: QuizQuestion[];
  outline: OutlineEntry[];
}

export interface Diagnosis {
  score: number; // 0-100
  totalQuestions: number;
  correctCount: number;
  weakSections: { sectionId: string; sectionTitle: string; accuracy: number }[];
  needsReteaching: boolean;
}

export interface RoadmapItem {
  sectionId: string;
  sectionTitle: string;
  summaryCard: string;
  realWorldExample: string;
  miniPracticeQuestion: string;
}

export interface Roadmap {
  style: 'intuitive' | 'mathematical' | 'both';
  minutesPerDay: number;
  items: RoadmapItem[];
}

export interface WrongAnswer {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  sourceRef: string;
}

export interface RetestResult {
  masteryAchieved: boolean;
  beforeScore: number;
  afterScore: number;
  wrongAnswers: WrongAnswer[];
}

export interface AgentStep {
  label: string;
  icon: 'doc' | 'web' | 'brain';
}

export interface AskAnswer {
  steps: AgentStep[];
  answer: string;
  sourceType: 'doc' | 'web';
  sourceRef: string;
}

async function readError(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  return body?.detail ?? res.statusText;
}

/**
 * Phase 1 — upload whatever the user actually provided (a PDF slide, a
 * transcript, or both) and get back a generated 20Q quiz.
 * Uses /api/knowledge/upload (real classify + align, session-persisted — the
 * backend fills in a sensible default when only one file type is given) then
 * /api/quiz/generate/pdf (the central AI decision — quiz_bank.py).
 */
export async function uploadKnowledge(files: File[]): Promise<KnowledgePackage> {
  const slides = files.find((f) => f.name.toLowerCase().endsWith('.pdf'));
  const transcript = files.find((f) => {
    const name = f.name.toLowerCase();
    return name.endsWith('.md') || name.endsWith('.txt') || name.endsWith('.vtt') || name.endsWith('.srt');
  });
  if (!slides && !transcript) throw new Error('Upload at least a PDF slide or a transcript file.');

  const sessionRes = await fetch(`${API_BASE}/api/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  if (!sessionRes.ok) throw new Error(`Could not start a learning session: ${await readError(sessionRes)}`);
  const session = (await sessionRes.json()) as { session_id: string };

  const uploadForm = new FormData();
  if (slides) uploadForm.append('slides', slides);
  if (transcript) uploadForm.append('transcript', transcript);
  uploadForm.append('session_id', session.session_id);
  const uploadRes = await fetch(`${API_BASE}/api/knowledge/upload`, { method: 'POST', body: uploadForm });
  if (!uploadRes.ok) throw new Error(`Could not process the uploaded materials: ${await readError(uploadRes)}`);

  const quizRes = await fetch(
    `${API_BASE}/api/quiz/generate/pdf?session_id=${encodeURIComponent(session.session_id)}&n_questions=20`,
    { method: 'POST' },
  );
  if (!quizRes.ok) throw new Error(`Sinh MCQ thất bại: ${await readError(quizRes)}`);
  const quizData = await quizRes.json();

  const outline: OutlineEntry[] = (quizData.outline as { section_id: string; title: string }[]).map((o) => ({
    id: o.section_id,
    title: o.title,
  }));
  const titleFor = (sectionId: string) => outline.find((o) => o.id === sectionId)?.title ?? sectionId;

  const quiz: QuizQuestion[] = (quizData.questions as {
    question: string;
    options: string[];
    correct_index: number;
    section_id: string;
    segment_id?: string;
  }[]).map((q, i) => ({
    id: `${q.section_id}-${i}`,
    sectionId: q.section_id,
    sectionTitle: titleFor(q.section_id),
    prompt: q.question,
    options: q.options,
    correctIndex: q.correct_index,
    sourceRefs: q.segment_id ? [q.segment_id] : [],
  }));

  return {
    id: `kp_${session.session_id}`,
    sessionId: session.session_id,
    fileNames: files.map((f) => f.name),
    sectionCount: outline.length,
    quiz,
    outline,
  };
}

/** Phase 2 — grade the quiz and diagnose weak sections. Rule-based by design
 * (no AI leverage here per problem-definition.md §3 — a plain accuracy
 * threshold is exactly as good as a model at "did they get 70%+ right"). */
export async function submitQuiz(
  quiz: QuizQuestion[],
  answers: Record<string, number>,
): Promise<Diagnosis> {
  const correctCount = quiz.filter((q) => answers[q.id] === q.correctIndex).length;
  const bySection = new Map<string, { title: string; total: number; correct: number }>();
  quiz.forEach((q) => {
    const entry = bySection.get(q.sectionId) ?? { title: q.sectionTitle, total: 0, correct: 0 };
    entry.total += 1;
    if (answers[q.id] === q.correctIndex) entry.correct += 1;
    bySection.set(q.sectionId, entry);
  });
  const weakSections = Array.from(bySection.entries())
    .map(([sectionId, v]) => ({ sectionId, sectionTitle: v.title, accuracy: v.correct / v.total }))
    .filter((s) => s.accuracy < 0.7)
    .sort((a, b) => a.accuracy - b.accuracy);

  const score = Math.round((correctCount / quiz.length) * 100);
  return {
    score,
    totalQuestions: quiz.length,
    correctCount,
    weakSections,
    needsReteaching: weakSections.length > 0,
  };
}

/** Phase 3 — build a personalized, grounded roadmap for the weak sections.
 * /api/reteach/study-note is the highest-value AI feature in the product spec
 * ("dạy lại" — grounded rewrite, every claim traceable to a citation);
 * /api/reteach/examples fills the real-world-example card for real too. */
export async function generateRoadmap(
  sessionId: string,
  weakSections: Diagnosis['weakSections'],
  style: Roadmap['style'],
  minutesPerDay: number,
  quizScore: number,
  activeMode: boolean,
): Promise<Roadmap> {
  const level = quizScore < 50 ? 'beginner' : quizScore < 80 ? 'intermediate' : 'advanced';

  const noteRes = await fetch(`${API_BASE}/api/reteach/study-note`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      weak_sections: weakSections.map((s) => ({
        section_id: s.sectionId,
        weak_score: 1 - s.accuracy,
        reason: `Quiz accuracy ${Math.round(s.accuracy * 100)}% on this section`,
      })),
      level,
      style,
      time_budget_minutes: minutesPerDay,
      active_mode: activeMode,
    }),
  });
  if (!noteRes.ok) throw new Error(`Không sinh được bài ôn tập: ${await readError(noteRes)}`);
  const note = await noteRes.json();
  const sections = note.sections as {
    section_id: string;
    title: string;
    content_md: string;
    check_question: string | null;
  }[];

  const examplesRes = await fetch(`${API_BASE}/api/reteach/examples`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sections: sections.map((s) => ({ section_id: s.section_id, title: s.title, summary: s.content_md.slice(0, 800) })),
    }),
  });
  const examples: Record<string, string> = examplesRes.ok ? (await examplesRes.json()).examples ?? {} : {};

  return {
    style,
    minutesPerDay,
    items: sections.map((section) => ({
      sectionId: section.section_id,
      sectionTitle: section.title,
      summaryCard: section.content_md,
      realWorldExample: examples[section.section_id] ?? '',
      miniPracticeQuestion: section.check_question ?? '',
    })),
  };
}

/** Phase 4 — generate a shorter retest focused on weak sections, biased away
 * from questions already asked in round 1 (avoid_similar_to). */
export async function generateRetest(
  sessionId: string,
  weakSections: Diagnosis['weakSections'],
  askedQuestionIds: string[],
): Promise<QuizQuestion[]> {
  const scope = weakSections.length
    ? { mode: 'selected' as const, sectionIds: weakSections.map((s) => s.sectionId) }
    : { mode: 'whole' as const };
  // Must stay a multiple of 5 so the 80% mastery threshold lands on a whole
  // question (e.g. 4/5) instead of silently requiring 100% — with 4 questions,
  // 3/4=75% fails and 4/4=100% passes, there is no way to score exactly 80%.
  const numQuestions = weakSections.length > 2 ? 10 : 5;

  const res = await fetch(`${API_BASE}/api/retest/generate-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      scope,
      numQuestions,
      avoidSimilarTo: askedQuestionIds,
    }),
  });
  if (!res.ok) throw new Error(`Không sinh được bài retest: ${await readError(res)}`);
  const questions = (await res.json()) as {
    id: string;
    outline_section_id: string;
    question: string;
    options: string[];
    correct_index: number;
    source_refs: string[];
  }[];
  const titleFor = new Map(weakSections.map((s) => [s.sectionId, s.sectionTitle]));

  return questions.map((q) => ({
    id: q.id,
    sectionId: q.outline_section_id,
    sectionTitle: titleFor.get(q.outline_section_id) ?? q.outline_section_id,
    prompt: q.question,
    options: q.options,
    correctIndex: q.correct_index,
    sourceRefs: q.source_refs,
  }));
}

/** Phase 4 — grade the retest and produce a before/after report or wrong-answer
 * review. Rule-based, same reasoning as submitQuiz. */
export async function submitRetest(
  retestQuiz: QuizQuestion[],
  answers: Record<string, number>,
  beforeScore: number,
): Promise<RetestResult> {
  const correctCount = retestQuiz.filter((q) => answers[q.id] === q.correctIndex).length;
  const afterScore = Math.round((correctCount / retestQuiz.length) * 100);
  const wrongAnswers: WrongAnswer[] = retestQuiz
    .filter((q) => answers[q.id] !== q.correctIndex)
    .map((q) => ({
      question: q.prompt,
      yourAnswer: q.options[answers[q.id] ?? 0] ?? '—',
      correctAnswer: q.options[q.correctIndex],
      sourceRef: q.sourceRefs?.length ? `${q.sectionTitle} · ${q.sourceRefs.join(', ')}` : q.sectionTitle,
    }));
  return {
    masteryAchieved: afterScore >= 80,
    beforeScore,
    afterScore,
    wrongAnswers,
  };
}

/**
 * Grounded Q&A over the uploaded knowledge package. Calls /api/chat/ask, which
 * retrieves from the session's transcript/slides/study-note and answers only
 * from those sources — it does not search the web, so callers must not claim
 * it does.
 */
export async function askKnowledgeBase(
  question: string,
  sessionId: string | null,
  onStep?: (step: AgentStep, index: number) => void,
): Promise<AskAnswer> {
  if (!sessionId) {
    const step: AgentStep = { label: 'No lecture uploaded yet', icon: 'doc' };
    onStep?.(step, 0);
    return {
      steps: [step],
      answer: 'Upload your slides and transcript first so I have something grounded to answer from.',
      sourceType: 'doc',
      sourceRef: 'no session yet',
    };
  }

  const readingStep: AgentStep = { label: 'Reading your slides & transcript', icon: 'doc' };
  onStep?.(readingStep, 0);

  const res = await fetch(`${API_BASE}/api/chat/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, question }),
  });

  const composeStep: AgentStep = { label: 'Composing your answer', icon: 'brain' };
  onStep?.(composeStep, 1);

  if (!res.ok) throw new Error(`Q&A unavailable: ${await readError(res)}`);
  const data = await res.json();
  const citedIds: string[] = data.cited_segment_ids ?? [];

  return {
    steps: [readingStep, composeStep],
    answer: data.answer,
    sourceType: 'doc',
    sourceRef: citedIds.length ? citedIds.join(', ') : 'no direct citation found in your material',
  };
}
