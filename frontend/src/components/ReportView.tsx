type Props = {
  beforeAccuracy: number;
  afterAccuracy: number;
  masteredTitles: string[];
  onReset: () => void;
};

export default function ReportView({ beforeAccuracy, afterAccuracy, masteredTitles, onReset }: Props) {
  return (
    <div className="report-view">
      <p className="eyebrow">Phase 4 — Learning Validation</p>
      <h2>🎉 Đạt mức hiểu vững (Mastery)</h2>
      <div className="score-compare">
        <div className="score-box">
          <div className="score-num">{Math.round(beforeAccuracy * 100)}%</div>
          <div className="score-label">Trước (Quiz ban đầu)</div>
        </div>
        <div className="score-box">
          <div className="score-num">{Math.round(afterAccuracy * 100)}%</div>
          <div className="score-label">Sau (Retest)</div>
        </div>
      </div>
      <div className="result-block good">
        <h3>Phần đã xác nhận vững</h3>
        <div className="tag-list">
          {masteredTitles.map((title) => (
            <span key={title} className="tag tag-good">
              {title}
            </span>
          ))}
        </div>
      </div>
      <button className="secondary-button" onClick={onReset}>
        Làm lại từ đầu
      </button>
    </div>
  );
}
