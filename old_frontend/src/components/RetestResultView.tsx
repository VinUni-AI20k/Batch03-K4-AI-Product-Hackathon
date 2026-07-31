type Props = {
  goodTitles: string[];
  weakTitles: string[];
  ctaLabel: string;
  onContinue: () => void;
};

export default function RetestResultView({ goodTitles, weakTitles, ctaLabel, onContinue }: Props) {
  return (
    <div className="result-view">
      <div className="result-card-inner">
        <div>
          <p className="eyebrow">Phase 2 — Learning Diagnosis</p>
          <h2>Kết quả chẩn đoán</h2>
        </div>
        <div className="result-details">
          <div className="result-block good">
            <h3>✅ Bạn đã tốt phần nào</h3>
            <div className="tag-list">
              {goodTitles.length ? (
                goodTitles.map((title) => (
                  <span key={title} className="tag tag-good">
                    {title}
                  </span>
                ))
              ) : (
                <span className="tag tag-bad">Chưa có phần nào đạt 100%</span>
              )}
            </div>
          </div>
          <div className="result-block improve">
            <h3>⚠️ Bạn cần cải thiện phần nào</h3>
            <div className="tag-list">
              {weakTitles.length ? (
                weakTitles.map((title) => (
                  <span key={title} className="tag tag-bad">
                    {title}
                  </span>
                ))
              ) : (
                <span className="tag tag-good">Không có — bạn làm đúng hết!</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="result-actions single">
        <button className="primary-button" onClick={onContinue}>
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
