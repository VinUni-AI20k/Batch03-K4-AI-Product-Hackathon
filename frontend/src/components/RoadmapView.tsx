import { useState } from "react";
import type { Section, SelfCheckGrade, StudyContent } from "../api/client";

type Props = {
  content: StudyContent[];
  activeMode: boolean;
  onGradeSelfCheck: (input: {
    section: Section;
    question: string;
    answer: string;
    sourceContext: string;
  }) => Promise<SelfCheckGrade>;
  onFinish: () => void;
};

export default function RoadmapView({
  content,
  activeMode,
  onGradeSelfCheck,
  onFinish,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selfCheckAnswer, setSelfCheckAnswer] = useState("");
  const [practicePick, setPracticePick] = useState<string | null>(null);
  const [selfCheckGrades, setSelfCheckGrades] = useState<
    Record<string, SelfCheckGrade>
  >({});
  const [isGrading, setIsGrading] = useState(false);
  const [gradeError, setGradeError] = useState("");
  const active = content[activeIndex];

  const selectTab = (index: number) => {
    setActiveIndex(index);
    setSelfCheckAnswer("");
    setGradeError("");
  };

  const submitSelfCheck = async () => {
    if (!selfCheckAnswer.trim()) return;
    setIsGrading(true);
    setGradeError("");
    try {
      const practice = active.practice;
      if (!practice) return;
      const grade = await onGradeSelfCheck({
        section: active.section,
        question: practice.question,
        answer: selfCheckAnswer.trim(),
        sourceContext: `${active.summary}\n${active.example}`,
      });
      setSelfCheckGrades((current) => ({
        ...current,
        [active.section]: grade,
      }));
    } catch (error) {
      setGradeError(
        error instanceof Error
          ? error.message
          : "Unable to grade the self-check.",
      );
    } finally {
      setIsGrading(false);
    }
  };

  const allSelfChecksCompleted = content.every((item) =>
    Boolean(selfCheckGrades[item.section]),
  );

  return (
    <div className="roadmap-view">
      <p className="eyebrow">Phase 3 — Adaptive Re-teaching</p>
      <h2>Lộ trình ôn tập của bạn</h2>
      <div className="tab-list">
        {content.map((item, index) => (
          <button
            key={item.section}
            className={index === activeIndex ? "tab active" : "tab"}
            onClick={() => selectTab(index)}
            disabled={
              activeMode &&
              index > 0 &&
              !selfCheckGrades[content[index - 1].section]
            }
          >
            {index + 1}. {item.title}
          </button>
        ))}
      </div>

      <div className="mini-card">
        <div className="mini-card-label">Summary Card</div>
        <p>
          {active.summary}{" "}
          <span className="citation">nguồn: {active.citation}</span>
        </p>
      </div>
      <div className="mini-card">
        <div className="mini-card-label">Real-world Example</div>
        <p>{active.example}</p>
      </div>
      {active.practice && (
        <div className="mini-card">
          <div className="mini-card-label">Mini Practice Question</div>
          <p>{active.practice.question}</p>
          <div className="practice-options">
            {active.practice.options.map((option) => {
              let cls = "practice-option";
              if (practicePick) {
                if (option === active.practice!.answer) cls += " correct";
                else if (option === practicePick) cls += " wrong";
              }
              return (
                <button
                  key={option}
                  className={cls}
                  onClick={() => setPracticePick(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        className="primary-button roadmap-finish"
        onClick={onFinish}
        disabled={activeMode && !allSelfChecksCompleted}
      >
        Tôi đã học xong — Kiểm tra lại
      </button>
      {activeMode && !allSelfChecksCompleted && (
        <p className="hint">
          Hoàn thành self-check ở từng phần để mở bài kiểm tra lại.
        </p>
      )}
    </div>
  );
}
