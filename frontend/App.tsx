import React from 'react';
import ChatPanel from './components/ChatPanel';
import JourneyPath from './components/shared/JourneyPath';
import QuizView from './components/QuizView';
import RetestResultView from './components/RetestResultView';
import StyleTimeSelect from './components/StyleTimeSelect';
import UploadStep from './components/UploadStep';
import AskPanel from './components/AskPanel';
import headerIcon from './assets/DrawKit Vector Illustration Team Work (6).png';
import { useSession } from './context/SessionContext';

function ReportScreen() {
  const { state, dispatch } = useSession();
  const before = state.diagnosis?.score ?? 0;
  const after = state.retestResult?.afterScore ?? before;
  const skipped = !state.diagnosis?.needsReteaching;

  return (
    <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: 22, textAlign: 'center' }}>
      <div style={{ fontSize: 56 }}>🎉</div>
      <h2 className="font-display" style={{ fontSize: 28 }}>
        {skipped ? 'Nice, you nailed it on the first try!' : 'Mastery achieved!'}
      </h2>
      <p className="text-soft" style={{ fontSize: 15 }}>
        {skipped
          ? `You scored ${before}% with no weak sections — no re-teaching needed.`
          : `You went from ${before}% to ${after}% after your personalized re-teaching session.`}
      </p>

      {!skipped && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          <div className="clay-panel" style={{ minWidth: 120 }}>
            <p className="text-faint" style={{ fontSize: 12, fontWeight: 800 }}>
              BEFORE
            </p>
            <p className="font-display" style={{ fontSize: 30, color: 'var(--clay-orange-dark)' }}>
              {before}%
            </p>
          </div>
          <div className="clay-panel" style={{ minWidth: 120 }}>
            <p className="text-faint" style={{ fontSize: 12, fontWeight: 800 }}>
              AFTER
            </p>
            <p className="font-display" style={{ fontSize: 30, color: 'var(--clay-mint-dark)' }}>
              {after}%
            </p>
          </div>
        </div>
      )}

      <button className="clay-btn clay-btn--purple" style={{ alignSelf: 'center' }} onClick={() => dispatch({ type: 'RESET' })}>
        Start a new lecture 🔁
      </button>
    </div>
  );
}

export default function App() {
  const { state } = useSession();

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 60px' }}>
      <header style={{ textAlign: 'center', marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <img src={headerIcon} alt="logo" style={{ width: 88, height: 88, borderRadius: 12 }} />
        <h1 className="font-display" style={{ fontSize: 32, margin: 0 }}>
          IllumiMATE
        </h1>
        <p className="text-soft" style={{ fontSize: 14, marginTop: 4 }}>
          your buddy-helf learning assistant
        </p>
      </header>

      <div className="clay-panel" style={{ marginBottom: 24 }}>
        <JourneyPath currentPhase={state.phase} />
      </div>

      {state.phase === 'upload' && (
        <section className="flat-section flat-section--pink" style={{ borderRadius: 24, position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="flat-card">
              <UploadStep />
            </div>

            <div className="flat-card">
              <AskPanel />
            </div>
          </div>

          {/* decorative corner image removed per request; header now shows the app icon */}
        </section>
      )}
      {state.phase === 'quiz' && <QuizView />}
      {(state.phase === 'diagnosis' || state.phase === 'style-time') && <StyleTimeSelect />}
      {state.phase === 'reteach' && <ChatPanel />}
      {state.phase === 'retest' && <RetestResultView />}
      {state.phase === 'report' && <ReportScreen />}
    </div>
  );
}
