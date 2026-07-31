import React, { useState } from 'react';
import { generateRetest } from '../api/client';
import { useSession } from '../context/SessionContext';
import MarkdownWithCitations from './shared/MarkdownWithCitations';
import ProgressLoader from './shared/ProgressLoader';
import AskPanel from './AskPanel';

function TutorBubble({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div
        style={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          background: 'linear-gradient(150deg, var(--clay-purple), var(--clay-pink))',
          boxShadow: '4px 4px 10px var(--shadow-dark), -3px -3px 8px var(--shadow-light)',
        }}
      >
        {emoji}
      </div>
      <div className="clay-panel" style={{ flex: 1, borderTopLeftRadius: 6 }}>
        <p style={{ fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: 14, marginBottom: 6 }}>{title}</p>
        {children}
      </div>
    </div>
  );
}

export default function ChatPanel() {
  const { state, dispatch } = useSession();
  const roadmap = state.roadmap!;
  const [sectionIndex, setSectionIndex] = useState(0);
  const [loadingRetest, setLoadingRetest] = useState(false);

  const item = roadmap.items[sectionIndex];
  const isLast = sectionIndex === roadmap.items.length - 1;

  async function handleFinish() {
    setLoadingRetest(true);
    const retestQuiz = await generateRetest(state.diagnosis!.weakSections);
    dispatch({ type: 'SET_RETEST_QUIZ', payload: retestQuiz });
  }

  if (loadingRetest) {
    return <ProgressLoader label="Building your retest…" steps={['Generating focused questions']} activeStep={1} />;
  }

  return (
    <div className="clay-card" style={{ display: 'flex', gap: 20 }}>
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="clay-badge clay-badge--purple">PHASE 3 · RE-TEACHING</span>
          <span className="text-soft" style={{ fontWeight: 800, fontSize: 13 }}>
            Section {sectionIndex + 1} / {roadmap.items.length}
          </span>
        </div>

        <span className="clay-badge clay-badge--yellow" style={{ alignSelf: 'flex-start' }}>
          {item.sectionTitle}
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="flat-card">
            <h3 className="flat-heading" style={{ fontSize: 18, marginBottom: 8 }}>Summary</h3>
            <MarkdownWithCitations content={item.summaryCard} sourceRef={`${item.sectionTitle} · Slide deck`} />
          </div>

          <div className="flat-card">
            <h3 className="flat-heading" style={{ fontSize: 18, marginBottom: 8 }}>Real-world example</h3>
            <MarkdownWithCitations content={item.realWorldExample} />
          </div>

          <div className="flat-card">
            <h3 className="flat-heading" style={{ fontSize: 18, marginBottom: 8 }}>Mini practice question</h3>
            <MarkdownWithCitations content={item.miniPracticeQuestion} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <button
            className="clay-btn clay-btn--ghost"
            disabled={sectionIndex === 0}
            onClick={() => setSectionIndex((i) => Math.max(0, i - 1))}
          >
            ← Back
          </button>
          {!isLast ? (
            <button className="clay-btn" onClick={() => setSectionIndex((i) => Math.min(roadmap.items.length - 1, i + 1))}>
              Next section →
            </button>
          ) : (
            <button className="clay-btn clay-btn--mint" onClick={handleFinish}>
              I'm done learning — retest me 🚀
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="flat-card" style={{ flex: 1 }}>
          <AskPanel />
        </div>
      </div>
    </div>
  );
}
