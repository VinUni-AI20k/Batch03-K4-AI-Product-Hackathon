import React, { useState } from 'react';
import { askKnowledgeBase, type AgentStep, type AskAnswer } from '../api/client';
import { useSession } from '../context/SessionContext';
import AgentStatusTrail from './shared/AgentStatusTrail';
import MarkdownWithCitations from './shared/MarkdownWithCitations';

export default function AskPanel() {
  const { state } = useSession();
  const sessionId = state.knowledgePackage?.sessionId ?? null;
  const [question, setQuestion] = useState('');
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<AskAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk() {
    if (!question.trim()) return;
    setAsking(true);
    setError(null);
    setResult(null);
    setSteps([]);
    try {
      const res = await askKnowledgeBase(question, sessionId, (step) => {
        setSteps((prev) => [...prev, step]);
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not get an answer.');
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <h3 className="font-display" style={{ fontSize: 18, marginTop: 0 }}>
          Hỏi thêm khi đang ôn tập 💬
        </h3>
        <p className="text-soft" style={{ fontSize: 13, marginTop: 4 }}>
          {sessionId
            ? "Mình chỉ trả lời dựa trên slide + transcript buổi học bạn đã tải lên — không phải kiến thức chung."
            : 'Upload slide/transcript trước để mình có nội dung trả lời có căn cứ.'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          className="clay-input"
          placeholder="vd: Product manager khác project manager ở điểm nào?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          disabled={asking}
        />
        <button
          className="clay-btn clay-btn--mint"
          disabled={!question.trim() || asking}
          onClick={handleAsk}
          style={{ color: 'var(--flat-ink)' }}
        >
          Hỏi
        </button>
      </div>

      {(asking || steps.length > 0) && (
        <div className="clay-panel">
          <AgentStatusTrail steps={steps} done={!asking} />
        </div>
      )}

      {result && (
        <div className="clay-panel" style={{ animation: 'clay-pop .25s ease' }}>
          <MarkdownWithCitations content={result.answer} sourceRef={`📄 ${result.sourceRef}`} />
        </div>
      )}

      {error && (
        <div className="clay-panel" style={{ color: 'var(--clay-orange-dark)', fontSize: 13 }}>
          <strong>Không trả lời được.</strong> {error}
        </div>
      )}
    </div>
  );
}
