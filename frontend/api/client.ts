// api/client.ts
// Talks to the "Knowledge Coach" backend. Swap the mock bodies below for real
// fetch() calls against your FastAPI/Express endpoints — the shapes are the contract.

export interface QuizQuestion {
  id: string;
  sectionId: string;
  sectionTitle: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface KnowledgePackage {
  id: string;
  fileNames: string[];
  sectionCount: number;
  quiz: QuizQuestion[];
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
  style: 'visual' | 'reading' | 'practice';
  minutesPerDay: number;
  items: RoadmapItem[];
}

export interface WrongAnswer {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  sourceRef: string; // e.g. "Slide 12 · 04:32"
}

export interface RetestResult {
  masteryAchieved: boolean;
  beforeScore: number;
  afterScore: number;
  wrongAnswers: WrongAnswer[];
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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

/**
 * NotebookLM-style Q&A over the uploaded knowledge package. Always checks the
 * documents first; only falls back to web search when the docs don't cover it.
 * onStep fires as each trace step starts, so the UI can show a live agent
 * status ("Reading your slides…", "Searching the web…") instead of a blank spinner.
 */
export async function askKnowledgeBase(
  question: string,
  hasKnowledgePackage: boolean,
  onStep?: (step: AgentStep, index: number) => void
): Promise<AskAnswer> {
  const steps: AgentStep[] = [{ label: 'Reading your slides & transcript', icon: 'doc' }];
  onStep?.(steps[0], 0);
  await delay(700);

  // Mock heuristic: short/very specific-sounding questions "miss" the docs and fall back to web.
  const foundInDocs = hasKnowledgePackage && question.length > 25;

  if (!foundInDocs) {
    const webStep: AgentStep = { label: "Not in your docs — searching the web", icon: 'web' };
    steps.push(webStep);
    onStep?.(webStep, 1);
    await delay(900);
  }

  const composeStep: AgentStep = { label: 'Composing your answer', icon: 'brain' };
  steps.push(composeStep);
  onStep?.(composeStep, steps.length - 1);
  await delay(600);

  return {
    steps,
    answer: foundInDocs
      ? `Based on your uploaded material: **${question}** is covered directly in your slides — here's the short version, restated simply from your own lecture.`
      : `Your slides don't cover this directly, so here's what I found on the web about **${question}** — worth double-checking against your course's own definitions.`,
    sourceType: foundInDocs ? 'doc' : 'web',
    sourceRef: foundInDocs ? `Slide ${Math.ceil(Math.random() * 20)}` : 'web search result',
  };
}

/** Phase 1 — upload slides + transcript, get back a generated 20Q quiz */
export async function uploadKnowledge(files: File[]): Promise<KnowledgePackage> {
  await delay(1200);
  const sections = ['Intro & Motivation', 'Core Mechanism', 'Worked Example', 'Edge Cases', 'Summary'];
  return {
    id: 'kp_' + Date.now(),
    fileNames: files.map((f) => f.name),
    sectionCount: sections.length,
    quiz: Array.from({ length: 20 }).map((_, i) => {
      const section = sections[i % sections.length];
      return {
        id: `q${i + 1}`,
        sectionId: section.toLowerCase().replace(/\s+/g, '-'),
        sectionTitle: section,
        prompt: `Question ${i + 1}: which statement best matches "${section}"?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: i % 4,
      };
    }),
  };
}

/** Phase 2 — grade the quiz and diagnose weak sections */
export async function submitQuiz(
  quiz: QuizQuestion[],
  answers: Record<string, number>
): Promise<Diagnosis> {
  await delay(900);
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

/** Phase 3 — build a personalized roadmap for the weak sections */
export async function generateRoadmap(
  weakSections: Diagnosis['weakSections'],
  style: Roadmap['style'],
  minutesPerDay: number
): Promise<Roadmap> {
  await delay(1100);
  return {
    style,
    minutesPerDay,
    items: weakSections.map((s) => ({
      sectionId: s.sectionId,
      sectionTitle: s.sectionTitle,
      summaryCard: `Here's the short version of "${s.sectionTitle}": the key idea, restated simply, with the one detail most people miss.`,
      realWorldExample: `Picture "${s.sectionTitle}" showing up in a everyday situation — that's the same pattern at work.`,
      miniPracticeQuestion: `Quick check: can you explain "${s.sectionTitle}" in one sentence to a friend?`,
    })),
  };
}

/** Phase 4 — generate a shorter retest focused on weak sections */
export async function generateRetest(weakSections: Diagnosis['weakSections']): Promise<QuizQuestion[]> {
  await delay(900);
  return weakSections.map((s, i) => ({
    id: `retest_${i + 1}`,
    sectionId: s.sectionId,
    sectionTitle: s.sectionTitle,
    prompt: `Retest: which statement best matches "${s.sectionTitle}"?`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: i % 4,
  }));
}

/** Phase 4 — grade the retest and produce a before/after report or wrong-answer review */
export async function submitRetest(
  retestQuiz: QuizQuestion[],
  answers: Record<string, number>,
  beforeScore: number
): Promise<RetestResult> {
  await delay(900);
  const correctCount = retestQuiz.filter((q) => answers[q.id] === q.correctIndex).length;
  const afterScore = Math.round((correctCount / retestQuiz.length) * 100);
  const wrongAnswers: WrongAnswer[] = retestQuiz
    .filter((q) => answers[q.id] !== q.correctIndex)
    .map((q) => ({
      question: q.prompt,
      yourAnswer: q.options[answers[q.id] ?? 0] ?? '—',
      correctAnswer: q.options[q.correctIndex],
      sourceRef: `${q.sectionTitle} · Slide ${Math.ceil(Math.random() * 20)}`,
    }));
  return {
    masteryAchieved: afterScore >= 80,
    beforeScore,
    afterScore,
    wrongAnswers,
  };
}
