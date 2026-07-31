import { useState } from "react";

type Props = {
  weakTitles: string[];
  activeMode: boolean;
  onActiveModeChange: (enabled: boolean) => void;
  onSubmit: (level: string, style: string, timeframe: string) => void;
};

const levels = ["beginner", "intermediate", "advanced"];

const styles = [
  { value: "intuitive", label: "Trực quan — ví dụ thực tế, ít công thức" },
  { value: "mathematical", label: "Toán học — đi sâu công thức, chứng minh" },
  { value: "both", label: "Cả hai" },
];
const timeframes = ["5 phút", "15 phút", "30 phút"];

export default function StyleTimeSelect({ weakTitles, activeMode, onActiveModeChange, onSubmit }: Props) {
  const [level, setLevel] = useState(levels[1]);
  const [style, setStyle] = useState(styles[2].value);
  const [timeframe, setTimeframe] = useState(timeframes[1]);

  return (
    <div className="style-time-select-wrap">
      <p className="hint">
        Áp dụng cho: <strong>{weakTitles.join(", ")}</strong>
      </p>
      <div className="style-time-select">
        <label>
          <span>Mức độ</span>
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            {levels.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Cách học</span>
          <select value={style} onChange={(event) => setStyle(event.target.value)}>
            {styles.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Thời gian</span>
          <select value={timeframe} onChange={(event) => setTimeframe(event.target.value)}>
            {timeframes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="active-mode-toggle">
          <span>
            <input
              type="checkbox"
              checked={activeMode}
              onChange={(event) => onActiveModeChange(event.target.checked)}
            />
            Bật tự kiểm tra chủ động
          </span>
          <small>Trả lời câu hỏi cuối mỗi phần và nhận phản hồi grounded.</small>
        </label>
        <button className="primary-button" onClick={() => onSubmit(level, style, timeframe)}>
          Tạo lộ trình ôn tập
        </button>
      </div>
    </div>
  );
}
