import type { McqQuestion, RetestQuestion, StudyContent } from "../api/client";

type WrongItem = { question: McqQuestion; userAnswer: number };

type Props = {
  wrongItems: WrongItem[];
  studyContentBySection: Record<string, StudyContent>;
  onLoop: () => void;
};

export default function ReviewList({ wrongItems, studyContentBySection, onLoop }: Props) {
  return (
    <div className="review-view">
      <p className="eyebrow">Phase 4 — Learning Validation</p>
      <h2>Chưa đạt mức hiểu vững</h2>
      <p className="hint">Xem lại câu sai kèm nguồn tham chiếu:</p>
      <div className="review-list">
        {wrongItems.map((item) => (
          <div key={item.question.id} className="review-item">
            <p className="review-question">{item.question.question}</p>
            <p className="review-wrong">
              Bạn chọn: {item.question.options[item.userAnswer]?.text ?? "Chưa có đáp án"}
            </p>
            <p className="review-correct">
              Đáp án đúng: {item.question.options[item.question.correct_index]?.text}{" "}
              <span className="citation">
                nguồn: {studyContentBySection[item.question.section_id]?.citation ?? item.question.segment_id ?? "chưa có"}
              </span>
            </p>
            {item.question.explanation && (
              <p className="review-explanation">
                <strong>Giải thích:</strong> {item.question.explanation}
              </p>
            )}
            {(() => {
              const retestQuestion = item.question as Partial<RetestQuestion>;
              const refs = retestQuestion.source_refs ?? [];
              const slideRef = retestQuestion.slide_ref;
              if (!refs.length && !slideRef) return null;
              return (
                <p className="review-grounding">
                  <strong>Căn cứ:</strong>{" "}
                  {refs.length ? `Transcript: ${refs.join(", ")}` : `Slide: ${slideRef}`}
                  {refs.length && slideRef ? ` · Slide: ${slideRef}` : ""}
                </p>
              );
            })()}
          </div>
        ))}
      </div>
      <button className="primary-button" onClick={onLoop}>
        Ôn tập lại phần chưa vững
      </button>
    </div>
  );
}
