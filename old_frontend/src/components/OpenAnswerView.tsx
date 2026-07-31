type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function OpenAnswerView({ value, onChange, onSubmit }: Props) {
  return (
    <div className="open-answer-view">
      <p className="eyebrow">Phase 2 — Learning Diagnosis</p>
      <h2>Bạn muốn tập trung học phần nào?</h2>
      <p className="hint">
        Hãy chia sẻ phần của bài giảng bạn muốn hiểu rõ hơn để AI kết hợp với
        kết quả quiz khi chẩn đoán. Bạn có thể bỏ qua câu hỏi này.
      </p>
      <label className="open-answer-label" htmlFor="learning-focus">
        Phần nào trong bài bạn muốn tập trung học nhất? Vì sao?
      </label>
      <textarea
        id="learning-focus"
        className="open-answer-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ví dụ: Mình muốn tập trung vào LEFT JOIN vì chưa hiểu khi nào kết quả có NULL."
        rows={5}
      />
      <button
        className="primary-button"
        onClick={onSubmit}
      >
        {value.trim() ? "Xem kết quả chẩn đoán" : "Bỏ qua và xem kết quả"}
      </button>
    </div>
  );
}
