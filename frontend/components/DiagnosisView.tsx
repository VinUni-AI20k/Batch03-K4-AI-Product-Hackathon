import React, { useState } from 'react';
import { generateRetest } from '../api/client';
import { useSession } from '../context/SessionContext';
import ProgressLoader from './shared/ProgressLoader';

export default function DiagnosisView() {
  const { state, dispatch } = useSession();
  const diagnosis = state.diagnosis;
  const [loadingRetest, setLoadingRetest] = useState(false);

  if (!diagnosis) return null;

  async function startRetest() {
    setLoadingRetest(true);
    const focusSections = diagnosis.weakSections.length
      ? diagnosis.weakSections
      : Array.from(
          new Map(
            (state.knowledgePackage?.quiz ?? []).map((question) => [question.sectionId, {
              sectionId: question.sectionId,
              sectionTitle: question.sectionTitle,
              accuracy: 1,
            }]),
          ).values(),
        ).slice(0, 3);
    const retestQuiz = await generateRetest(focusSections);
    dispatch({ type: 'SET_RETEST_QUIZ', payload: retestQuiz });
  }

  if (loadingRetest) {
    return <ProgressLoader label="Preparing your confirmation retest…" steps={['Selecting focus areas', 'Generating focused questions']} activeStep={1} />;
  }

  const hasWeaknesses = diagnosis.weakSections.length > 0;

  return (
    <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <span className="clay-badge clay-badge--pink">PHASE 2 · DIAGNOSIS</span>
        <h2 className="font-display" style={{ fontSize: 27, marginTop: 10 }}>
          Here’s your learning snapshot
        </h2>
        <p className="text-soft" style={{ marginTop: 6, fontSize: 15 }}>
          We checked your answers by section to decide what to review next.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <div className="clay-panel" style={{ flex: '1 1 150px' }}>
          <p className="text-faint" style={{ fontSize: 12, fontWeight: 800 }}>QUIZ SCORE</p>
          <p className="font-display" style={{ fontSize: 34, color: 'var(--clay-purple)' }}>{diagnosis.score}%</p>
          <p className="text-soft" style={{ fontSize: 13 }}>{diagnosis.correctCount}/{diagnosis.totalQuestions} correct</p>
        </div>
        <div className="clay-panel" style={{ flex: '1 1 150px' }}>
          <p className="text-faint" style={{ fontSize: 12, fontWeight: 800 }}>NEXT STEP</p>
          <p className="font-display" style={{ fontSize: 20, marginTop: 8 }}>
            {hasWeaknesses ? 'Re-teach weak sections' : 'Confirm mastery'}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-display" style={{ fontSize: 19 }}>What needs attention?</h3>
        {hasWeaknesses ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            {diagnosis.weakSections.map((section) => (
              <div key={section.sectionId} className="clay-panel" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                <span style={{ fontWeight: 800 }}>{section.sectionTitle}</span>
                <span className="clay-badge clay-badge--yellow">{Math.round(section.accuracy * 100)}% accuracy</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="clay-panel" style={{ marginTop: 12 }}>
            <p style={{ fontWeight: 800 }}>Great work — no weak section was detected.</p>
            <p className="text-soft" style={{ fontSize: 13, marginTop: 5 }}>Take a short retest to confirm the result.</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
        {hasWeaknesses ? (
          <button className="clay-btn clay-btn--mint" onClick={() => dispatch({ type: 'GO_TO', phase: 'style-time' })}>
            Build my personalized review →
          </button>
        ) : (
          <button className="clay-btn clay-btn--mint" onClick={startRetest}>
            Start confirmation retest →
          </button>
        )}
      </div>
    </div>
  );
}
