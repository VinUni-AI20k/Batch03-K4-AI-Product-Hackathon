import React from 'react';

interface ProgressLoaderProps {
  label: string;
  steps?: string[];
  activeStep?: number;
}

/**
 * A soft clay "blob" spinner paired with a step checklist — used for the
 * multi-step AI jobs in Phase 1 (classify → extract → generate) and
 * Phase 2/4 (grade → diagnose).
 */
export default function ProgressLoader({ label, steps, activeStep = 0 }: ProgressLoaderProps) {
  return (
    <div
      className="clay-card clay-card--sunken"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: 32 }}
    >
      <div
        aria-hidden
        style={{
          width: 64,
          height: 64,
          borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
          background: 'linear-gradient(145deg, var(--clay-purple), var(--clay-pink))',
          boxShadow: '6px 6px 16px rgba(91,61,224,0.35), -4px -4px 12px rgba(255,255,255,0.6)',
          animation: 'clay-bounce 1.1s ease-in-out infinite',
        }}
      />
      <p className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>
        {label}
      </p>

      {steps && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          {steps.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                style={{
                  width: 22,
                  height: 22,
                  flexShrink: 0,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#fff',
                  background:
                    i < activeStep
                      ? 'var(--clay-mint)'
                      : i === activeStep
                      ? 'var(--clay-orange)'
                      : 'var(--ink-faint)',
                }}
              >
                {i < activeStep ? <span style={{ color: 'var(--clay-purple)', fontWeight: 900 }}>✓</span> : i + 1}
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: i === activeStep ? 800 : 600,
                  color: i <= activeStep ? 'var(--ink)' : 'var(--ink-faint)',
                }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
