import type { Section, SelfCheckGrade, StudyContent } from "../api/client";

type Props = {
  content: StudyContent[];
  activeMode: boolean;
  onGradeSelfCheck: (input: {
    section: Section;
    question: string;
    answer: string;
    sourceContext: string;
  }) => Promise<SelfCheckGrade>;
  onFinish: () => void;
};

/** Render adaptive re-teaching as one static markdown stream, not summary cards. */
export default function RoadmapView({ content, onFinish }: Props) {
  return (
    <div className="roadmap-view">
      <p className="eyebrow">Phase 3 — Adaptive Re-teaching</p>
      <h2>Bài ôn tập cá nhân hoá</h2>
      <article className="markdown-stream">
        {content.map((item) => (
          <section key={item.section}>
            <pre>{item.markdown}</pre>
          </section>
        ))}
      </article>
      <button className="primary-button roadmap-finish" onClick={onFinish}>
        Tôi đã học xong — Kiểm tra lại
      </button>
    </div>
  );
}
