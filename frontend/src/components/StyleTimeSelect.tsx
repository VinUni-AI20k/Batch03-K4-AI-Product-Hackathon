import { useState } from "react";

type Props = {
  weakTitles: string[];
  onSubmit: (style: string, timeframe: string, activeMode: boolean) => void;
};

const styles = [
  { value: "intuitive", label: "Trực quan — ví dụ thực tế, ít công thức" },
  { value: "mathematical", label: "Toán học — đi sâu công thức, chứng minh" },
  { value: "both", label: "Cả hai" },
];
const timeframes = ["5 phút", "15 phút", "30 phút"];

export default function StyleTimeSelect({ weakTitles, onSubmit }: Props) {
  const [style, setStyle] = useState(styles[2].value);
  const [timeframe, setTimeframe] = useState(timeframes[1]);
  const [activeMode, setActiveMode] = useState(true);

  return (
    <div className="style-time-select-wrap">
      <p className="hint">
        Áp dụng cho: <strong>{weakTitles.join(", ")}</strong>
      </p>
      <div className="style-time-select">
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
          <input type="checkbox" checked={activeMode} onChange={(event) => setActiveMode(event.target.checked)} />
          <span>
            <strong>Active Mode</strong>
            <small>Self-check at the end of every section, graded by AI</small>
          </span>
        </label>
        <button className="primary-button" onClick={() => onSubmit(style, timeframe, activeMode)}>
          Tạo lộ trình ôn tập
        </button>
      </div>
    </div>
  );
}
