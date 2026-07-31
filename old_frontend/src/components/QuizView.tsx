import type { McqQuestion } from "../api/client";

type Props = {
  question: McqQuestion;
  index: number;
  total: number;
  selected: number | undefined;
  modeLabel: string;
  onSelectAnswer: (answerIndex: number) => void;
  onNext: () => void;
};

export default function QuizView({
  question,
  index,
  total,
  selected,
  modeLabel,
  onSelectAnswer,
  onNext,
}: Props) {
  return (
    <div className="quiz-view">
      <div className="quiz-header">
        <div>
          <p className="eyebrow">{modeLabel}</p>
          <h2>Câu hỏi {index} trên {total}</h2>
        </div>
        <div className="quiz-status">
          {selected !== undefined ? "Đã chọn đáp án" : "Chưa chọn đáp án"}
        </div>
      </div>

      <p className="quiz-question">{question.question}</p>

      <div className="options-grid">
        {question.options.map((option, optionIndex) => (
          <button
            key={`${question.id}-${optionIndex}`}
            type="button"
            className={optionIndex === selected ? "option-button selected" : "option-button"}
            onClick={() => onSelectAnswer(optionIndex)}
          >
            {option.text}
          </button>
        ))}
      </div>

      <button
        className="primary-button quiz-next"
        onClick={onNext}
        disabled={selected === undefined}
      >
        {index === total ? "Hoàn thành" : "Câu tiếp theo"}
      </button>
    </div>
  );
}
