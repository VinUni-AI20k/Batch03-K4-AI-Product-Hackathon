type Props = {
  good: string;
  improve: string;
  onContinue: () => void;
  onRetry: () => void;
};

export default function RetestResultView({ good, improve, onContinue, onRetry }: Props) {
  return (
    <div className="result-view">
      <div className="result-card-inner">
        <div>
          <p className="eyebrow">Kết quả học tập</p>
          <h2>Bạn đã học được gì và cần cải thiện</h2>
        </div>
        <div className="result-details">
          <div className="result-block good">
            <h3>Bạn đã tốt những gì</h3>
            <p>{good}</p>
          </div>
          <div className="result-block improve">
            <h3>Bạn cần cải thiện</h3>
            <p>{improve}</p>
          </div>
        </div>
      </div>
      <div className="result-actions">
        <button className="secondary-button" onClick={onRetry}>
          Tạo MCQ khác
        </button>
        <button className="primary-button" onClick={onContinue}>
          Bắt đầu ôn lại
        </button>
      </div>
    </div>
  );
}
