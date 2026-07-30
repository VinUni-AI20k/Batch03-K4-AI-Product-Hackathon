import { useState } from "react";

type Props = {
  onSubmit: (timeframe: string, topic: string) => void;
};

const topics = ["Khái niệm chính", "Mẹo nhớ nhanh", "Điểm cần cải thiện"];
const timeframes = ["15 phút", "30 phút", "45 phút"];

export default function StyleTimeSelect({ onSubmit }: Props) {
  const [topic, setTopic] = useState(topics[0]);
  const [timeframe, setTimeframe] = useState(timeframes[1]);

  return (
    <div className="style-time-select">
      <div>
        <label>
          <span>Chủ đề ôn tập</span>
          <select value={topic} onChange={(event) => setTopic(event.target.value)}>
            {topics.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
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
      </div>
      <button className="primary-button" onClick={() => onSubmit(timeframe, topic)}>
        Tạo prompt ôn lại
      </button>
    </div>
  );
}
