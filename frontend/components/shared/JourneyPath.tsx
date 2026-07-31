import React from 'react';
import type { Phase } from '../../context/SessionContext';

const STONES: { phases: Phase[]; label: string; emoji: string }[] = [
  { phases: ['upload'], label: 'Prep', emoji: '📚' },
  { phases: ['quiz', 'diagnosis'], label: 'Diagnose', emoji: '🧭' },
  { phases: ['style-time', 'reteach'], label: 'Re-teach', emoji: '🌱' },
  { phases: ['retest'], label: 'Retest', emoji: '🏁' },
  { phases: ['report'], label: 'Report', emoji: '🏆' },
];

export default function JourneyPath({ currentPhase }: { currentPhase: Phase }) {
  const currentIndex = STONES.findIndex((s) => s.phases.includes(currentPhase));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 6,
        padding: '18px 24px',
      }}
    >
      {STONES.map((stone, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'locked';
        return (
          <React.Fragment key={stone.label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ position: 'relative' }}>
                {state === 'active' && (
                  <span
                    aria-hidden
                    style={{ position: 'absolute', inset: -6, animation: 'clay-bounce 1s ease-in-out infinite' }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: -22,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 20,
                      }}
                    >
                      ⭐
                    </span>
                  </span>
                )}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    background:
                      state === 'locked'
                        ? 'var(--clay-surface)'
                        : state === 'done'
                        ? 'linear-gradient(150deg, var(--clay-mint), var(--clay-mint-dark))'
                        : 'linear-gradient(150deg, var(--clay-orange), var(--clay-orange-dark))',
                    boxShadow:
                      state === 'locked'
                        ? 'inset 3px 3px 8px var(--shadow-dark), inset -3px -3px 8px var(--shadow-light)'
                        : '6px 6px 14px var(--shadow-dark), -4px -4px 10px var(--shadow-light)',
                    opacity: state === 'locked' ? 0.55 : 1,
                    transition: 'all .25s ease',
                  }}
                >
                  {state === 'done' ? <span style={{ color: 'var(--clay-purple)', fontWeight: 900 }}>✓</span> : stone.emoji}
                </div>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  fontWeight: state === 'active' ? 800 : 600,
                  color: state === 'locked' ? 'var(--ink-faint)' : 'var(--ink)',
                }}
              >
                {stone.label}
              </span>
            </div>
            {i < STONES.length - 1 && (
              <div
                aria-hidden
                style={{
                  flex: 0.6,
                  height: 4,
                  marginTop: 26,
                  borderRadius: 999,
                  background: i < currentIndex ? 'var(--clay-mint)' : 'var(--ink-faint)',
                  opacity: i < currentIndex ? 1 : 0.35,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
