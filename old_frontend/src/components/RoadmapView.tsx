import { useState } from "react";
import type { CheckJudgement, StudyContent } from "../api/client";

type Props = {
  content: StudyContent[];
  activeMode: boolean;
  sessionId: string;
  onJudgeSelfCheck: (input: { sectionId: string; answer: string }) => Promise<CheckJudgement>;
  onFinish: () => void;
};

/** Render adaptive re-teaching as one static markdown stream, not summary cards. */
export default function RoadmapView({ content, activeMode, sessionId, onJudgeSelfCheck, onFinish }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [judgements, setJudgements] = useState<Record<string, CheckJudgement>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitCheck = async (sectionId: string) => {
    const answer = answers[sectionId]?.trim() ?? "";
    if (!answer) return;
    setSubmitting(sectionId);
    setErrors((current) => ({ ...current, [sectionId]: "" }));
    try {
      const result = await onJudgeSelfCheck({ sectionId, answer });
      setJudgements((current) => ({ ...current, [sectionId]: result }));
    } catch (error) {
      setErrors((current) => ({
        ...current,
        [sectionId]: error instanceof Error ? error.message : "Không thể chấm self-check.",
      }));
    } finally {
      setSubmitting(null);
    }
  };

  const checks = activeMode ? content.filter((item) => item.checkQuestion) : [];
  const allChecksDone = checks.every((item) => judgements[item.section]);
  return (
    <div className="roadmap-view">
      <p className="eyebrow">Phase 3 — Adaptive Re-teaching</p>
      <h2>Bài ôn tập cá nhân hoá</h2>
      <article className="markdown-stream">
        {content.map((item) => (
          <section key={item.section}>
            <pre>{item.markdown}</pre>
            {activeMode && item.checkQuestion && (
              <div className="self-check-card">
                <h3>Tự kiểm tra</h3>
                <p>{item.checkQuestion}</p>
                <textarea
                  value={answers[item.section] ?? ""}
                  disabled={Boolean(judgements[item.section]) || submitting === item.section}
                  onChange={(event) => setAnswers((current) => ({ ...current, [item.section]: event.target.value }))}
                  placeholder="Viết câu trả lời của bạn..."
                />
                {!judgements[item.section] && (
                  <button
                    className="secondary-button"
                    disabled={!answers[item.section]?.trim() || submitting === item.section || !sessionId}
                    onClick={() => void submitCheck(item.section)}
                  >
                    {submitting === item.section ? "Đang chấm..." : "Nộp câu trả lời"}
                  </button>
                )}
                {errors[item.section] && <p className="self-check-error">{errors[item.section]}</p>}
                {judgements[item.section] && (
                  <div className="self-check-feedback">
                    <strong>Kết quả: {judgements[item.section].verdict}</strong>
                    <p>{judgements[item.section].feedback_markdown}</p>
                    {judgements[item.section].missed_points.length > 0 && (
                      <ul>
                        {judgements[item.section].missed_points.map((point) => (
                          <li key={point.point}>{point.point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        ))}
      </article>
      <button className="primary-button roadmap-finish" disabled={activeMode && !allChecksDone} onClick={onFinish}>
        Tôi đã học xong — Kiểm tra lại
      </button>
    </div>
  );
}
