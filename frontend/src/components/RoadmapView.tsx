import { useState } from "react";
import type { StudyContent } from "../api/client";

type Props = {
  content: StudyContent[];
  onFinish: () => void;
};

export default function RoadmapView({ content, onFinish }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [practicePick, setPracticePick] = useState<string | null>(null);
  const active = content[activeIndex];

  const selectTab = (index: number) => {
    setActiveIndex(index);
    setPracticePick(null);
  };

  return (
    <div className="roadmap-view">
      <p className="eyebrow">Phase 3 — Adaptive Re-teaching</p>
      <h2>Lộ trình ôn tập của bạn</h2>
      <div className="tab-list">
        {content.map((item, index) => (
          <button
            key={item.section}
            className={index === activeIndex ? "tab active" : "tab"}
            onClick={() => selectTab(index)}
          >
            {index + 1}. {item.title}
          </button>
        ))}
      </div>

      <div className="mini-card">
        <div className="mini-card-label">Summary Card</div>
        <p>
          {active.summary} <span className="citation">nguồn: {active.citation}</span>
        </p>
      </div>
      <div className="mini-card">
        <div className="mini-card-label">Real-world Example</div>
        <p>{active.example}</p>
      </div>
      <div className="mini-card">
        <div className="mini-card-label">Mini Practice Question</div>
        <p>{active.practice.question}</p>
        <div className="practice-options">
          {active.practice.options.map((option) => {
            let cls = "practice-option";
            if (practicePick) {
              if (option === active.practice.answer) cls += " correct";
              else if (option === practicePick) cls += " wrong";
            }
            return (
              <button key={option} className={cls} onClick={() => setPracticePick(option)}>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <button className="primary-button roadmap-finish" onClick={onFinish}>
        Tôi đã học xong — Kiểm tra lại
      </button>
    </div>
  );
}
