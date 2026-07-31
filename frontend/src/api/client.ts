import type {
  GradeResult,
  CheckJudgement,
  McqQuestion,
  OutlineSection,
  QuizPayload,
  Section,
  SectionStat,
  SelfCheckGrade,
} from "../../../shared/types";

export type {
  GradeResult,
  CheckJudgement,
  McqQuestion,
  OutlineSection,
  QuizPayload,
  Section,
  SectionStat,
  SelfCheckGrade,
} from "../../../shared/types";

const BACKEND_URL = "http://127.0.0.1:8000";

export const MASTERY_THRESHOLD = 0.8;

export async function gradeSelfCheck(payload: {
  section_id: string;
  question: string;
  learner_answer: string;
  source_context: string;
}): Promise<SelfCheckGrade> {
  const response = await fetch(`${BACKEND_URL}/api/reteach/self-check/grade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Self-check grading unavailable");
  return response.json();
}

export async function judgeActiveModeAnswer(payload: {
  session_id: string;
  section_id: string;
  learner_answer: string;
}): Promise<CheckJudgement> {
  const response = await fetch(`${BACKEND_URL}/api/reteach/self-check/judge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Active-mode judging unavailable");
  return response.json();
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock — upload chỉ xác nhận file, nội dung dùng để sinh MCQ luôn lấy từ transcript
// thật đã bundle sẵn ở backend (transcript-01-clean.md). PDF->text thật là việc còn
// thiếu, ghi rõ trong docs/product-overview.md.
export async function uploadSlide(
  file: File,
): Promise<{ textContent: string; outline: OutlineSection[] }> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${BACKEND_URL}/api/outline/pdf`, {
    method: "POST",
    body: form,
  });
  if (!response.ok)
    throw new Error("Không thể trích xuất outline từ PDF slide");
  const data = await response.json();
  return {
    textContent: `Đã trích xuất ${file.name} từ slide PDF.`,
    outline: data.outline,
  };
}

type RawBackendQuestion = {
  question: string;
  options: string[];
  correct_index: number;
  misconception_tag?: string;
  section_id: string;
  segment_id: string;
  explanation: string;
};
type GenerateQuizResponse = {
  outline: OutlineSection[];
  questions: RawBackendQuestion[];
};

/** Convert the backend's generated MCQ into the single payload shape used by UI and diagnosis. */
function normalizeQuizPayload(data: GenerateQuizResponse): QuizPayload {
  return {
    outline: data.outline,
    questions: data.questions.map((question, index) => ({
      id: `${question.section_id}-${index}`,
      section_id: question.section_id,
      question: question.question,
      options: question.options.map((text, optionIndex) => ({
        text,
        misconception_tag:
          optionIndex === question.correct_index
            ? undefined
            : question.misconception_tag,
      })),
      correct_index: question.correct_index,
      explanation: question.explanation,
      segment_id: question.segment_id,
    })),
  };
}

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
  return normalizeQuizPayload(data);
}

export async function generateQuizFromPdf(file: File): Promise<{
  outline: OutlineSection[];
  questions: McqQuestion[];
}> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(
    `${BACKEND_URL}/api/quiz/generate/pdf?n_questions=20`,
    {
      method: "POST",
      body: form,
    },
  );
  if (!response.ok) throw new Error("Không thể sinh quiz từ slide PDF");
  const data: GenerateQuizResponse = await response.json();
  return normalizeQuizPayload(data);
}

export async function gradeQuiz(
  questions: McqQuestion[],
  answers: number[],
): Promise<GradeResult> {
  await delay(200);
  const bySectionMap = new Map<Section, SectionStat>();
  questions.forEach((q, i) => {
    const stat = bySectionMap.get(q.section_id) ?? {
      section: q.section_id,
      correct: 0,
      total: 0,
    };
    stat.total += 1;
    if (answers[i] === q.correct_index) stat.correct += 1;
    bySectionMap.set(q.section_id, stat);
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
  markdown: string;
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
  level = "intermediate",
  style = "both",
  timeAvailableMinutes = 15,
): Promise<StudyContent[]> {
  await delay(400);
  return sections.map((sectionId) => {
    const outlineSection = outline.find((o) => o.section_id === sectionId);
    const poolQuestion = questionPool.find((q) => q.section_id === sectionId);
    const summary =
      outlineSection?.key_points.join(" ") ?? "(chưa có nội dung)";
    const citations = questionPool
      .filter((q) => q.section_id === sectionId && q.segment_id)
      .map((q) => q.segment_id as string)
      .filter((id, index, all) => all.indexOf(id) === index);
    const markdown = [
      `## ${outlineSection?.title ?? sectionId}`,
      "",
      `**Mức độ:** ${level} · **Phong cách:** ${style} · **Thời gian:** ${timeAvailableMinutes} phút`,
      "",
      summary,
      "",
      `**Citation:** ${citations.length ? citations.map((id) => `[${id}]`).join(", ") : "chưa có"}`,
    ].join("\n");
    return {
      section: sectionId,
      title: outlineSection?.title ?? sectionId,
      markdown,
      summary: outlineSection?.key_points.join(" ") ?? "(chưa có tóm tắt)",
      example:
        "(Mock — bước sinh ví dụ thực tế bằng AI chưa build, xem docs/product-overview.md)",
      practice: poolQuestion
        ? {
            question: poolQuestion.question,
            options: poolQuestion.options.map((option) => option.text),
            answer:
              poolQuestion.options[poolQuestion.correct_index]?.text ?? "",
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
      .filter((q) => q.section_id === s)
      .slice(0, perSection)
      .map((q) => ({
        ...q,
        id: `${q.id}-retest`,
        question: `Ôn lại: ${q.question}`,
      })),
  );
}
