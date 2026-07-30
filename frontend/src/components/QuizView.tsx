import type { McqQuestion } from "../api/client";

type Props = {
  question: McqQuestion;
  index: number;
  total: number;
  selected: string;
  onSelectAnswer: (answer: string) => void;
  onNext: () => void;
};

export default function QuizView({ question, index, total, selected, onSelectAnswer, onNext }: Props) {
  return (
    <div className="quiz-view">
      <div className="quiz-header">
        <div>
          <p className="eyebrow">Bài quiz trắc nghiệm</p>
          <h2>Câu hỏi {index} trên {total}</h2>
        </div>
        <div className="quiz-status">{selected ? "Đã chọn đáp án" : "Chưa chọn đáp án"}</div>
      </div>

      <p className="quiz-question">{question.question}</p>

      <div className="options-grid">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            className={option === selected ? "option-button selected" : "option-button"}
            onClick={() => onSelectAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <button className="primary-button quiz-next" onClick={onNext} disabled={!selected}>
        {index === total ? "Hoàn thành" : "Câu tiếp theo"}
      </button>
    </div>
  );
}
