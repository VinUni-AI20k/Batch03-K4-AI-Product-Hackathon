import React from 'react';
import type { AgentStep } from '../../api/client';

const ICONS: Record<AgentStep['icon'], string> = { doc: '📄', web: '🌐', brain: '🧠' };

export default function AgentStatusTrail({ steps, done }: { steps: AgentStep[]; done: boolean }) {
  if (steps.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const isActive = isLast && !done;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                flexShrink: 0,
                background: isActive ? 'var(--clay-orange)' : 'var(--clay-mint)',
                color: '#fff',
                animation: isActive ? 'clay-bounce 0.9s ease-in-out infinite' : 'none',
              }}
            >
              {isActive ? ICONS[step.icon] : <span style={{ color: 'var(--clay-purple)', fontWeight: 900 }}>✓</span>}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
                color: isActive ? 'var(--ink)' : 'var(--ink-soft)',
              }}
            >
              {step.label}
              {isActive ? '…' : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
