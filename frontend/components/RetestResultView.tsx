import React, { useState } from 'react';
import { submitRetest } from '../api/client';
import { useSession } from '../context/SessionContext';
import MarkdownWithCitations from './shared/MarkdownWithCitations';
import ProgressLoader from './shared/ProgressLoader';

function MasteryGauge({ score, achieved }: { score: number; achieved: boolean }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div style={{ position: 'relative', width: 132, height: 132 }}>
      <svg width={132} height={132} viewBox="0 0 132 132">
        <circle cx={66} cy={66} r={54} fill="none" stroke="var(--clay-bg-1)" strokeWidth={14} />
        <circle
          cx={66}
          cy={66}
          r={54}
          fill="none"
          stroke={achieved ? 'var(--clay-mint)' : 'var(--clay-orange)'}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 66 66)"
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="font-display" style={{ fontSize: 26, fontWeight: 800 }}>
          {score}%
        </span>
        <span style={{ fontSize: 20 }}>{achieved ? '🏆' : '🌱'}</span>
      </div>
    </div>
  );
}

export default function RetestResultView() {
  const { state, dispatch } = useSession();
  const quiz = state.retestQuiz ?? [];
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const result = state.retestResult;
  const q = quiz[current];
  const answeredCount = Object.keys(answers).length;

  async function handleSubmit() {
    setGrading(true);
    setError(null);
    try {
      const res = await submitRetest(quiz, answers, state.diagnosis?.score ?? 0);
      dispatch({ type: 'SET_RETEST_RESULT', payload: res });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not grade the retest.');
    } finally {
      // Result is now in context, but this component stays mounted (phase no
      // longer auto-changes) — without this the loader would stay stuck
      // forever even though grading already finished.
      setGrading(false);
    }
  }

  if (grading) {
    return <ProgressLoader label="Grading your retest…" steps={['Rule-based retest grading', 'Checking for mastery']} activeStep={1} />;
  }

  // ---- result view: always shown after grading, learner chooses what's next ----
  if (result) {
    const achieved = result.masteryAchieved;
    return (
      <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <span className="clay-badge clay-badge--pink">PHASE 4 · KẾT QUẢ RETEST</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <MasteryGauge score={result.afterScore} achieved={achieved} />
          <div>
            <h2 className="font-display" style={{ fontSize: 22 }}>
              {achieved ? 'Đạt mức hiểu vững!' : 'Chưa đạt ngưỡng — vẫn có thể xem Report'}
            </h2>
            <p className="text-soft" style={{ marginTop: 6, fontSize: 14 }}>
              Trước: {result.beforeScore}% → Sau: {result.afterScore}%.
              {!achieved && ' Đây là những câu bạn nên xem lại nếu muốn ôn tiếp:'}
            </p>
          </div>
        </div>

        {!achieved && result.wrongAnswers.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {result.wrongAnswers.map((w, i) => (
              <div key={i} className="clay-panel">
                <p style={{ fontWeight: 800, fontSize: 14 }}>{w.question}</p>
                <p style={{ fontSize: 13, color: 'var(--clay-orange-dark)', marginTop: 6 }}>Bạn chọn: {w.yourAnswer}</p>
                <p style={{ fontSize: 13, color: 'var(--clay-mint-dark)', marginTop: 2 }}>Đáp án đúng: {w.correctAnswer}</p>
                <MarkdownWithCitations content="" sourceRef={w.sourceRef} />
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            className="clay-btn clay-btn--ghost"
            onClick={() => dispatch({ type: 'GO_TO', phase: 'style-time' })}
          >
            🔁 Ôn tập lại phần chưa vững
          </button>
          <button
            className="clay-btn clay-btn--mint"
            onClick={() => dispatch({ type: 'GO_TO', phase: 'report' })}
          >
            📊 Xem Report ngay
          </button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  // ---- taking the retest ----
  return (
    <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="clay-badge clay-badge--purple">PHASE 4 · RETEST</span>
        <span className="text-soft" style={{ fontWeight: 800, fontSize: 13 }}>
          {current + 1} / {quiz.length}
        </span>
      </div>

      <div className="clay-progress-track">
        <div className="clay-progress-fill" style={{ width: `${(answeredCount / quiz.length) * 100}%` }} />
      </div>

      <span className="clay-badge clay-badge--yellow" style={{ alignSelf: 'flex-start' }}>
        {q.sectionTitle}
      </span>
      <h3 className="font-display" style={{ fontSize: 20 }}>
        {q.prompt}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
            className="clay-panel"
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: answers[q.id] === i ? 800 : 600,
              color: answers[q.id] === i ? '#fff' : 'var(--ink)',
              background:
                answers[q.id] === i
                  ? 'linear-gradient(150deg, var(--clay-purple), var(--clay-purple-dark))'
                  : 'var(--clay-surface-alt)',
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="clay-btn clay-btn--ghost" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          ← Back
        </button>
        {current < quiz.length - 1 ? (
          <button className="clay-btn" onClick={() => setCurrent((c) => c + 1)}>
            Next →
          </button>
        ) : (
          <button className="clay-btn clay-btn--mint" disabled={answeredCount < quiz.length} onClick={handleSubmit}>
            Submit retest 🎯
          </button>
        )}
      </div>

      {error && (
        <div className="clay-panel" style={{ color: 'var(--clay-orange-dark)', fontSize: 13 }}>
          <strong>Chấm bài thất bại.</strong> {error}
        </div>
      )}
    </div>
  );
}
