import React, { useState } from 'react';
import { generateRoadmap } from '../api/client';
import { useSession } from '../context/SessionContext';
import ProgressLoader from './shared/ProgressLoader';

const STYLES: { id: 'intuitive' | 'mathematical' | 'both'; label: string; emoji: string }[] = [
  { id: 'intuitive', label: 'Intuitive', emoji: '🖼️' },
  { id: 'mathematical', label: 'Mathematical', emoji: '📐' },
  { id: 'both', label: 'Both', emoji: '🧩' },
];

const TIME_GROUPS: { id: string; label: string; sub: string; minutes: number }[] = [
  { id: 'quick', label: 'Quick', sub: '10–30 phút', minutes: 20 },
  { id: 'deep', label: 'Deep', sub: '1–2 giờ', minutes: 90 },
];

export default function StyleTimeSelect() {
  const { state, dispatch } = useSession();
  const diagnosis = state.diagnosis!;
  const [style, setStyle] = useState<'intuitive' | 'mathematical' | 'both' | null>(state.style);
  const [timeGroup, setTimeGroup] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState(false);
  const [building, setBuilding] = useState(false);
  const minutes = TIME_GROUPS.find((g) => g.id === timeGroup)?.minutes ?? null;

  async function handleBuildRoadmap() {
    if (!style || !minutes) return;
    dispatch({ type: 'SET_STYLE_TIME', style, minutesPerDay: minutes });
    setBuilding(true);
    const roadmap = await generateRoadmap(
      state.knowledgePackage!.sessionId,
      diagnosis.weakSections,
      style,
      minutes,
      diagnosis.score,
      activeMode,
    );
    dispatch({ type: 'SET_ROADMAP', payload: roadmap });
  }

  if (building) {
    return (
      <ProgressLoader
        label="Aligning weak sections with your transcript…"
        steps={['Matching sections to source material', 'Building your learning roadmap']}
        activeStep={1}
      />
    );
  }

  return (
    <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <span className="clay-badge clay-badge--pink">DIAGNOSIS</span>
        <h2 className="font-display" style={{ fontSize: 24, marginTop: 10 }}>
          Let’s build your personalized review
        </h2>
        <p className="text-soft" style={{ marginTop: 6, fontSize: 15 }}>
          Your score is {diagnosis.score}% ({diagnosis.correctCount} of {diagnosis.totalQuestions}). Choose how you want to revisit the weak sections.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {diagnosis.weakSections.map((s) => (
          <span key={s.sectionId} className="clay-chip" style={{ cursor: 'default' }}>
            {s.sectionTitle}
          </span>
        ))}
        {diagnosis.weakSections.length === 0 && (
          <span className="clay-chip clay-chip--selected" style={{ cursor: 'default' }}>
            🏆 No weak spots found!
          </span>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '2px dashed var(--ink-faint)', opacity: 0.4 }} />

      <div>
        <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>Learning style</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {STYLES.map((s) => (
            <button
              key={s.id}
              className={`clay-chip ${style === s.id ? 'clay-chip--selected' : ''}`}
              onClick={() => setStyle(s.id)}
              style={{ border: 'none' }}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>Bạn có bao nhiêu thời gian?</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {TIME_GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setTimeGroup(g.id);
                setActiveMode(g.id === 'deep');
              }}
              className="clay-panel"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                border: 'none',
                minWidth: 150,
                background: timeGroup === g.id ? 'linear-gradient(150deg, var(--clay-purple), var(--clay-purple-dark))' : 'var(--clay-surface-alt)',
                color: timeGroup === g.id ? '#fff' : 'var(--ink)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>
                {g.id === 'quick' ? '⚡' : '🌊'} {g.label}
              </p>
              <p style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{g.sub}</p>
            </button>
          ))}
        </div>

        {timeGroup && (
          <label
            className="clay-chip"
            style={{ marginTop: 12, cursor: 'pointer', border: 'none', display: 'inline-flex' }}
          >
            <input type="checkbox" checked={activeMode} onChange={(e) => setActiveMode(e.target.checked)} style={{ marginRight: 4 }} />
            💡 Active mode — chèn câu hỏi gợi mở trong lúc học
          </label>
        )}
      </div>

      <button className="clay-btn" disabled={!style || !timeGroup} onClick={handleBuildRoadmap} style={{ alignSelf: 'flex-start' }}>
        Build my review plan →
      </button>
    </div>
  );
}
