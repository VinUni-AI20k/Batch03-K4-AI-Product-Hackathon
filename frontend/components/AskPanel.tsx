import React, { useState } from 'react';
import { askKnowledgeBase, type AgentStep, type AskAnswer } from '../api/client';
import { useSession } from '../context/SessionContext';
import AgentStatusTrail from './shared/AgentStatusTrail';
import MarkdownWithCitations from './shared/MarkdownWithCitations';

export default function AskPanel() {
  const { state } = useSession();
  const hasKnowledgePackage = !!state.knowledgePackage;
  const [question, setQuestion] = useState('');
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<AskAnswer | null>(null);

  async function handleAsk() {
    if (!question.trim()) return;
    setAsking(true);
    setResult(null);
    setSteps([]);
    const res = await askKnowledgeBase(question, hasKnowledgePackage, (step) => {
      setSteps((prev) => [...prev, step]);
    });
    setResult(res);
    setAsking(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <h3 className="font-display" style={{ fontSize: 26, marginTop: 8 }}>
          Not ready for the quiz? Ask directly 💬
        </h3>
        <p className="text-soft" style={{ fontSize: 13, marginTop: 4 }}>
          {hasKnowledgePackage
            ? 'I will prefer answers from the materials you uploaded — otherwise I search the web.'
            : "You can ask even if you haven't uploaded materials — I'll search the web for you."}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          className="clay-input"
          placeholder="e.g. Why is spaced repetition effective?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
        />
        <button className="clay-btn clay-btn--mint" disabled={!question.trim() || asking} onClick={handleAsk} style={{ color: 'var(--flat-ink)' }}>
          Ask
        </button>
      </div>

      {(asking || steps.length > 0) && (
        <div className="clay-panel">
          <AgentStatusTrail steps={steps} done={!asking} />
        </div>
      )}

      {result && (
        <div className="clay-panel" style={{ animation: 'clay-pop .25s ease' }}>
          <MarkdownWithCitations
            content={result.answer}
            sourceRef={result.sourceType === 'doc' ? `📄 ${result.sourceRef}` : `🌐 ${result.sourceRef}`}
          />
        </div>
      )}
    </div>
  );
}
