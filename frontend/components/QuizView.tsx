import React, { useState } from 'react';
import { submitQuiz } from '../api/client';
import { useSession } from '../context/SessionContext';
import ProgressLoader from './shared/ProgressLoader';

export default function QuizView() {
  const { state, dispatch } = useSession();
  const quiz = state.knowledgePackage?.quiz ?? [];
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [grading, setGrading] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const q = quiz[current];

  async function handleSubmit() {
    setGrading(true);
    const diagnosis = await submitQuiz(quiz, answers);
    dispatch({ type: 'SET_DIAGNOSIS', payload: diagnosis });
  }

  if (grading) {
    return (
      <ProgressLoader
        label="Grading your quiz…"
        steps={['Rule-based grading', 'Diagnosing weak sections']}
        activeStep={1}
      />
    );
  }

  if (!q) return null;

  return (
    <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="clay-badge clay-badge--purple">PHASE 2</span>
        <span className="text-soft" style={{ fontWeight: 800, fontSize: 13 }}>
          Question {current + 1} / {quiz.length}
        </span>
      </div>

      <div className="clay-progress-track">
        <div className="clay-progress-fill" style={{ width: `${(answeredCount / quiz.length) * 100}%` }} />
      </div>

      <div key={q.id} style={{ animation: 'clay-pop .25s ease' }}>
        <span className="clay-badge clay-badge--yellow" style={{ marginBottom: 10 }}>
          {q.sectionTitle}
        </span>
        <h3 className="font-display" style={{ fontSize: 20, marginTop: 10 }}>
          {q.prompt}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
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
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <button
          className="clay-btn clay-btn--ghost"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        >
          ← Back
        </button>
        {current < quiz.length - 1 ? (
          <button className="clay-btn" onClick={() => setCurrent((c) => Math.min(quiz.length - 1, c + 1))}>
            Next →
          </button>
        ) : (
          <button className="clay-btn clay-btn--mint" disabled={answeredCount < quiz.length} onClick={handleSubmit}>
            Submit quiz 🎉
          </button>
        )}
      </div>
    </div>
  );
}
