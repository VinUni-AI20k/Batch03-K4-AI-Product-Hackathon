import type { McqQuestion, OutlineSection } from "../../shared/types";

export type { OutlineSection } from "../../shared/types";

export type SectionSignal = {
  outlineSectionId: string;
  wrongCount: number;
  totalCount: number;
  wrongRate: number;
  misconceptionTags: string[];
};

export type WeaknessResult = {
  outline_section_id: string;
  confidence: number;
  reasoning: string;
};

export type OpenQuestionAnswer = {
  answer: string;
};

/**
 * Aggregates incorrect answers and their misconception tags by outline section.
 * `quiz` and `userAnswers` are positional pairs and must have equal lengths.
 */
export function computeQuizSignal(
  quiz: McqQuestion[],
  userAnswers: number[],
): Map<string, SectionSignal> {
  if (quiz.length !== userAnswers.length) {
    throw new Error(
      `Quiz and userAnswers must have the same length (received ${quiz.length} questions and ${userAnswers.length} answers).`,
    );
  }

  const signals = new Map<string, SectionSignal>();

  quiz.forEach((question, index) => {
    const sectionId = question.section_id;
    const signal = signals.get(sectionId) ?? {
      outlineSectionId: sectionId,
      wrongCount: 0,
      totalCount: 0,
      wrongRate: 0,
      misconceptionTags: [],
    };

    signal.totalCount += 1;

    const selectedIndex = userAnswers[index];
    if (selectedIndex !== question.correct_index) {
      signal.wrongCount += 1;
      const misconceptionTag = question.options[selectedIndex]?.misconception_tag;
      if (misconceptionTag) {
        signal.misconceptionTags.push(misconceptionTag);
      }
    }

    signals.set(sectionId, signal);
  });

  signals.forEach((signal) => {
    signal.wrongRate = signal.wrongCount / signal.totalCount;
  });

  return signals;
}

export function rankSectionsByRuleBased(
  signal: Map<string, SectionSignal>,
  maxResults: number = 3,
): WeaknessResult[] {
  return [...signal.values()]
    .filter((section) => section.wrongRate > 0)
    .sort(
      (left, right) =>
        right.wrongRate - left.wrongRate || right.wrongCount - left.wrongCount,
    )
    .slice(0, maxResults)
    .map((section) => {
      const tagCounts = new Map<string, number>();
      section.misconceptionTags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      });
      const repeatedTag = section.misconceptionTags.find(
        (tag) => (tagCounts.get(tag) ?? 0) >= 2,
      );
      const reasoning = `Rule-based: ${section.wrongCount}/${section.totalCount} câu sai${
        repeatedTag ? `, lặp lại kiểu nhầm lẫn: ${repeatedTag}` : ""
      }`;

      return {
        outline_section_id: section.outlineSectionId,
        confidence: section.wrongRate,
        reasoning,
      };
    });
}

export function needsAIRefinement(
  signal: Map<string, SectionSignal>,
  openAnswer: string,
): boolean {
  const wrongRates = [...signal.values()]
    .filter((section) => section.wrongRate > 0)
    .map((section) => section.wrongRate)
    .sort((left, right) => right - left);

  const noWrongAnswerAtAll = wrongRates.length === 0;
  const topGapUnclear =
    wrongRates.length >= 2 &&
    wrongRates[0] - wrongRates[Math.min(2, wrongRates.length - 1)] < 0.15;
  const openAnswerSubstantive = openAnswer.trim().length > 15;

  return topGapUnclear || openAnswerSubstantive || noWrongAnswerAtAll;
}

export async function analyzeWeakness(
  quiz: McqQuestion[],
  userAnswers: number[],
  openAnswer: OpenQuestionAnswer,
  outline: OutlineSection[],
): Promise<WeaknessResult[]> {
  if (outline.length === 0) {
    throw new Error("analyzeWeakness requires at least one outline section");
  }

  const signal = computeQuizSignal(quiz, userAnswers);
  if (!needsAIRefinement(signal, openAnswer.answer)) {
    console.debug("[weakness] rule-based path, no API call");
    return rankSectionsByRuleBased(signal, 3);
  }

  const quizSignal = [...signal.values()]
    .filter((section) => section.wrongRate > 0)
    .map(({ outlineSectionId, wrongRate, misconceptionTags }) => ({
      outline_section_id: outlineSectionId,
      wrongRate,
      misconceptionTags,
    }));
  const compactOutline = outline.map((section) => ({
    id: section.section_id,
    title: section.title,
    summary: section.key_points.join(" "),
  }));
  const response = await fetch("http://127.0.0.1:8001/api/diagnosis/weaknesses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quiz_signal: quizSignal,
      outline: compactOutline,
      open_answer: openAnswer.answer,
    }),
  });
  if (!response.ok) {
    throw new Error("AI weakness refinement unavailable");
  }

  const data: { weaknesses: WeaknessResult[] } = await response.json();
  const outlineSectionIds = new Set(outline.map((section) => section.section_id));
  const validationErrors: string[] = [];
  const validWeaknesses = data.weaknesses.filter((weakness) => {
    if (outlineSectionIds.has(weakness.outline_section_id)) {
      return true;
    }
    validationErrors.push(
      `Unknown outline_section_id returned by AI: ${weakness.outline_section_id}`,
    );
    return false;
  });
  validationErrors.forEach((error) => console.warn(`[weakness] ${error}`));

  if (validWeaknesses.length > 0) {
    return validWeaknesses;
  }

  const ruleBasedFallback = rankSectionsByRuleBased(signal, 3);
  if (ruleBasedFallback.length > 0) {
    return ruleBasedFallback;
  }

  return [
    {
      outline_section_id: outline[0].section_id,
      confidence: 0.3,
      reasoning: "không phát hiện lỗ hổng rõ ràng, chọn mặc định để demo flow",
    },
  ];
}
