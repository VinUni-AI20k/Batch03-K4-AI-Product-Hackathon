const BACKEND_URL = "http://127.0.0.1:8000";

export type Section = string;

export type OutlineSection = {
  section_id: Section;
  title: string;
  key_points: string[];
};

export type McqQuestion = {
  id: string;
  section: Section;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  segment_id?: string;
};

export type SectionStat = { section: Section; correct: number; total: number };
export type SectionStat = { section: Section; correct: number; total: number };

export type GradeResult = {
  correctCount: number;
  total: number;
  accuracy: number;
  bySection: SectionStat[];
  weakSections: Section[];
  goodSections: Section[];
};

export const MASTERY_THRESHOLD = 0.8;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock — upload chỉ xác nhận file, nội dung dùng để sinh MCQ luôn lấy từ transcript
// thật đã bundle sẵn ở backend (transcript-01-clean.md). PDF->text thật là việc còn
// thiếu, ghi rõ trong docs/product-overview.md.
export async function uploadSlide(
  file: File,
): Promise<{ textContent: string }> {
  await delay(400);
  return {
    textContent: `Đã nhận ${file.name}. Demo dùng transcript thật: "Xác định bài toán kinh doanh cho AI" (Day 2 sáng, data pack).`,
  };
}

type RawBackendQuestion = {
  question: string;
  options: string[];
  correct_index: number;
  section_id: string;
  segment_id: string;
  explanation: string;
};
type GenerateQuizResponse = {
  outline: OutlineSection[];
  questions: RawBackendQuestion[];
};

// ---- QUYẾT ĐỊNH AI TRUNG TÂM: gọi backend thật (OpenAI), không hardcode ----
export async function generateQuiz(): Promise<{
  outline: OutlineSection[];
  questions: McqQuestion[];
}> {
  const res = await fetch(`${BACKEND_URL}/api/quiz/generate?n_questions=20`, {
    method: "POST",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(`Sinh MCQ thất bại: ${body.detail ?? res.statusText}`);
  }
  const data: GenerateQuizResponse = await res.json();
  const questions: McqQuestion[] = data.questions.map((q, i) => ({
    id: `${q.section_id}-${i}`,
    section: q.section_id,
    question: q.question,
    options: q.options,
    answer: q.options[q.correct_index],
    explanation: q.explanation,
    segment_id: q.segment_id,
  }));
  return { outline: data.outline, questions };
}

export async function gradeQuiz(
  questions: McqQuestion[],
  answers: string[],
): Promise<GradeResult> {
  await delay(200);
  const bySectionMap = new Map<Section, SectionStat>();
  questions.forEach((q, i) => {
    const stat = bySectionMap.get(q.section) ?? {
      section: q.section,
      correct: 0,
      total: 0,
    };
    stat.total += 1;
    if (answers[i] === q.answer) stat.correct += 1;
    bySectionMap.set(q.section, stat);
  });
  const bySection = Array.from(bySectionMap.values());
  const weakSections = bySection
    .filter((s) => s.correct < s.total)
    .map((s) => s.section);
  const goodSections = bySection
    .filter((s) => s.correct === s.total)
    .map((s) => s.section);
  const correctCount = bySection.reduce((sum, s) => sum + s.correct, 0);
  return {
    correctCount,
    total: questions.length,
    accuracy: questions.length ? correctCount / questions.length : 0,
    bySection,
    weakSections,
    goodSections,
  };
}

export type StudyContent = {
  section: Section;
  title: string;
  summary: string;
  example: string;
  practice: { question: string; options: string[]; answer: string } | null;
  citation: string;
};

// Mock nhẹ (KHÔNG phải quyết định AI trung tâm): "summary" dùng trực tiếp
// key_points thật (trích xuất từ transcript thật, không phải AI sinh), "example"
// là placeholder, "practice" tái dùng 1 câu MCQ thật đã sinh cho section đó.
export async function getStudyContent(
  sections: Section[],
  outline: OutlineSection[],
  questionPool: McqQuestion[],
): Promise<StudyContent[]> {
  await delay(400);
  return sections.map((sectionId) => {
    const outlineSection = outline.find((o) => o.section_id === sectionId);
    const poolQuestion = questionPool.find((q) => q.section === sectionId);
    return {
      section: sectionId,
      title: outlineSection?.title ?? sectionId,
      summary: outlineSection?.key_points.join(" ") ?? "(chưa có tóm tắt)",
      example:
        "(Mock — bước sinh ví dụ thực tế bằng AI chưa build, xem docs/product-overview.md)",
      practice: poolQuestion
        ? {
            question: poolQuestion.question,
            options: poolQuestion.options,
            answer: poolQuestion.answer,
          }
        : null,
      citation: poolQuestion?.segment_id ?? "(không có)",
    };
  });
}

// Mock nhẹ (KHÔNG phải quyết định AI trung tâm): tái dùng câu hỏi thật đã sinh ở
// round 1 cho đúng section cần ôn, không tự bịa câu mới. Việc "sinh câu MỚI, chưa
// từng hỏi" thật sự cần một lời gọi AI riêng — chưa build, ghi trong docs.
export async function generateRetest(
  sections: Section[],
  perSection: number,
  questionPool: McqQuestion[],
): Promise<McqQuestion[]> {
  await delay(300);
  return sections.flatMap((s) =>
    questionPool
      .filter((q) => q.section === s)
      .slice(0, perSection)
      .map((q) => ({
        ...q,
        id: `${q.id}-retest`,
        question: `Ôn lại: ${q.question}`,
      })),
  );
}
