import React from 'react';
import { useSession } from '../../context/SessionContext';

interface LearningProgressCardProps {
  currentIndex: number;
}

export default function LearningProgressCard({ currentIndex }: LearningProgressCardProps) {
  const { state } = useSession();
  const items = state.roadmap?.items ?? [];
  const current = currentIndex + 1;

  return (
    <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <span className="clay-badge clay-badge--purple">YOUR REVIEW PLAN</span>
        <h3 className="font-display" style={{ fontSize: 19, marginTop: 10 }}>One step at a time</h3>
        <p className="text-soft" style={{ fontSize: 13, marginTop: 4 }}>
          Review the sections marked as weak, then take a fresh retest.
        </p>
      </div>
      <div className="clay-progress-track">
        <div className="clay-progress-fill" style={{ width: `${items.length ? (current / items.length) * 100 : 0}%` }} />
      </div>
      <p style={{ fontSize: 13, fontWeight: 800 }}>{current} of {items.length} sections started</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, index) => (
          <div key={item.sectionId} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 700 }}>
            <span
              style={{
                color:
                  index < currentIndex
                    ? 'var(--clay-mint-dark)'
                    : index === currentIndex
                      ? 'var(--clay-purple)'
                      : 'var(--ink-faint)',
              }}
            >
              {index < currentIndex ? '✓' : index === currentIndex ? '●' : '○'}
            </span>
            <span
              style={{
                color: index <= currentIndex ? 'var(--ink)' : 'var(--ink-soft)',
                fontWeight: index === currentIndex ? 800 : 700,
              }}
            >
              {item.sectionTitle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
