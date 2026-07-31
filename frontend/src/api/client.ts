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
export type SlideRange = {
  title: string;
  start_page: number;
  end_page: number;
};

export type LearningUnit = {
  unit: string;
  slides: number[];
};

export async function uploadSlide(
  file: File,
): Promise<{ textContent: string; ranges?: SlideRange[]; learningUnits?: LearningUnit[] }> {
  const mockFallback = `Đã nhận ${file.name}. Demo dùng transcript thật: "Xác định bài toán kinh doanh cho AI" (Day 2 sáng, data pack).`;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BACKEND_URL}/api/upload/pdf`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      textContent: `✅ Upload thành công: ${file.name}`,
      ranges: data.ranges,
      learningUnits: data.learning_units,
    };
  } catch (err) {
    console.error("PDF upload failed, falling back to mock:", err);
    await delay(400);
    return {
      textContent: mockFallback,
      ranges: [
        { title: "Bài toán kinh doanh & Tiêu chí đo lường AI", start_page: 1, end_page: 8 },
        { title: "Thu thập & Chuẩn bị dữ liệu", start_page: 9, end_page: 15 },
        { title: "Lựa chọn & Huấn luyện mô hình", start_page: 16, end_page: 25 },
        { title: "Đánh giá & Triển khai", start_page: 26, end_page: 35 },
      ],
      learningUnits: [
        { unit: "Khái quát & Định nghĩa bài toán", slides: [1] },
        { unit: "Chuẩn bị & Xử lý dữ liệu", slides: [2] },
        { unit: "Xây dựng & Huấn luyện mô hình", slides: [3] },
        { unit: "Đánh giá & Triển khai ứng dụng", slides: [4] }
      ]
    };
  }
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

  const examplesRequest = sections.map((sectionId) => {
    const o = outline.find((os) => os.section_id === sectionId);
    return {
      section_id: sectionId,
      title: o?.title ?? sectionId,
      summary: o?.key_points.join(" ") ?? "",
    };
  });

  let examplesMap: Record<string, string> = {};
  try {
    const res = await fetch(`${BACKEND_URL}/api/reteach/examples`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections: examplesRequest }),
    });
    if (res.ok) {
      const data = await res.json();
      examplesMap = data.examples;
    }
  } catch (e) {
    console.error("Failed to fetch examples:", e);
  }

  return sections.map((sectionId) => {
    const outlineSection = outline.find((o) => o.section_id === sectionId);
    const poolQuestion = questionPool.find((q) => q.section === sectionId);
    return {
      section: sectionId,
      title: outlineSection?.title ?? sectionId,
      summary: outlineSection?.key_points.join(" ") ?? "(chưa có tóm tắt)",
      example: examplesMap[sectionId] ?? "(Không có ví dụ thực tế cho phần này)",
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

export type SelfCheckGrade = {
  score: number;
  feedback: string;
  next_step: string;
};

export async function gradeSelfCheck(
  params: {
    section_id: Section;
    question: string;
    learner_answer: string;
    source_context: string;
  },
): Promise<SelfCheckGrade> {
  const res = await fetch(`${BACKEND_URL}/api/reteach/self-check/grade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(`Grading failed: ${body.detail ?? res.statusText}`);
  }
  return res.json();
}

export async function enrichKnowledge(weakSections: string[], pdfFilename: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/upload/enrich`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weak_sections: weakSections, pdf_filename: pdfFilename }),
  });
  if (!res.ok) {
    console.error("Knowledge enrichment failed:", res.statusText);
  }
}
export async function checkEnrichmentStatus(): Promise<{ is_running: boolean }> {
  const res = await fetch(`${BACKEND_URL}/api/upload/enrich-status`);
  if (!res.ok) {
    throw new Error("Failed to check enrichment status");
  }
  return res.json();
}

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
