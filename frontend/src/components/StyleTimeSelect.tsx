import { useState } from "react";

type Props = {
  weakTitles: string[];
  onSubmit: (style: string, timeframe: string) => void;
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
        <button className="primary-button" onClick={() => onSubmit(style, timeframe)}>
          Tạo lộ trình ôn tập
        </button>
      </div>
    </div>
  );
}
