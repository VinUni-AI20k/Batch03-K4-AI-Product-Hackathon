import { useMemo, useState } from "react";
import type { McqQuestion, OutlineSection, Section } from "../api/client";

export type RetestScope = "whole" | "sections";

type Props = {
  outline: OutlineSection[];
  questionPool: McqQuestion[];
  initialSections: Section[];
  onStart: (questionCount: number, scope: RetestScope, sections: Section[], saveQuiz: boolean) => void;
};

export default function RetestConfigView({
  outline,
  questionPool,
  initialSections,
  onStart,
}: Props) {
  const [scope, setScope] = useState<RetestScope>("whole");
  const [selectedSections, setSelectedSections] = useState<Section[]>(initialSections);
  const [questionCount, setQuestionCount] = useState(Math.min(10, questionPool.length));
  const [saveQuiz, setSaveQuiz] = useState(false);

  const availableQuestions = useMemo(() => {
    if (scope === "whole") return questionPool.length;
    return questionPool.filter((question) => selectedSections.includes(question.section_id)).length;
  }, [questionPool, scope, selectedSections]);

  const toggleSection = (section: Section) => {
    setSelectedSections((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section],
    );
  };

  const changeScope = (nextScope: RetestScope) => {
    setScope(nextScope);
    const nextAvailable = nextScope === "whole"
      ? questionPool.length
      : questionPool.filter((question) => selectedSections.includes(question.section_id)).length;
    setQuestionCount((current) => Math.min(current, Math.max(1, nextAvailable)));
  };

  const handleCountChange = (value: number) => {
    setQuestionCount(Math.max(1, Math.min(value || 1, Math.max(1, availableQuestions))));
  };

  const canStart = availableQuestions > 0 && (scope === "whole" || selectedSections.length > 0);

  return (
    <div className="retest-config">
      <p className="eyebrow">Phase 4 — Learning Validation</p>
      <h2>Thiết lập bài kiểm tra lại</h2>

      <label className="retest-count">
        <span>Số câu hỏi</span>
        <input
          type="number"
          min={1}
          max={Math.max(1, availableQuestions)}
          value={questionCount}
          onChange={(event) => handleCountChange(Number(event.target.value))}
        />
        <small>Có {availableQuestions} câu trong phạm vi đã chọn.</small>
      </label>

      <fieldset className="retest-scope">
        <legend>Phạm vi kiến thức</legend>
        <label>
          <input
            type="radio"
            checked={scope === "whole"}
            onChange={() => changeScope("whole")}
          />
          Toàn bộ slide và transcript gốc
        </label>
        <label>
          <input
            type="radio"
            checked={scope === "sections"}
            onChange={() => changeScope("sections")}
          />
          Chọn theo section trong outline
        </label>
      </fieldset>

      {scope === "sections" && (
        <div className="retest-sections">
          {outline.map((section) => (
            <label key={section.section_id}>
              <input
                type="checkbox"
                checked={selectedSections.includes(section.section_id)}
                onChange={() => toggleSection(section.section_id)}
              />
              {section.title}
              <small>
                {questionPool.filter((question) => question.section_id === section.section_id).length} câu
              </small>
            </label>
          ))}
        </div>
      )}

      <button
        className="primary-button"
        disabled={!canStart}
        onClick={() => onStart(questionCount, scope, selectedSections, saveQuiz)}
      >
        Bắt đầu retest
      </button>
      <label className="retest-save-choice">
        <input
          type="checkbox"
          checked={saveQuiz}
          onChange={(event) => setSaveQuiz(event.target.checked)}
        />
        Lưu lại bài retest này để xem lại sau
      </label>
      {!canStart && <p className="hint">Phạm vi này chưa có câu hỏi trong quiz bank vòng 1.</p>}
    </div>
  );
}
