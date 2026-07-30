import { useEffect, useState } from 'react';
import { LOADING_STEPS } from '@/lib/constants';

type StepStatus = 'pending' | 'active' | 'done';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [opacity, setOpacity] = useState(false);
  const [sub, setSub] = useState(LOADING_STEPS[0].label);
  const [pct, setPct] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(new Array(LOADING_STEPS.length).fill('pending'));

  useEffect(() => {
    const fadeInTimer = setTimeout(() => setOpacity(true), 50);

    let stepIdx = 0;
    let progress = 0;
    let tick: NodeJS.Timeout;
    let stepTimeout: NodeJS.Timeout;

    const runStep = () => {
      if (stepIdx >= LOADING_STEPS.length) {
        stepTimeout = setTimeout(() => {
          setOpacity(false);
          stepTimeout = setTimeout(onComplete, 400);
        }, 400);
        return;
      }

      const step = LOADING_STEPS[stepIdx];
      setSub(step.label);
      setStepStatuses((prev) => {
        const next = [...prev];
        next[stepIdx] = 'active';
        return next;
      });

      tick = setInterval(() => {
        progress += (step.to - step.from) / 14;
        if (progress >= step.to) {
          progress = step.to;
          clearInterval(tick);
          setStepStatuses((prev) => {
            const next = [...prev];
            next[stepIdx] = 'done';
            return next;
          });
          stepIdx++;
          stepTimeout = setTimeout(runStep, 220);
        }
        setPct(Math.round(progress));
      }, 90);
    };

    runStep();

    return () => {
      clearTimeout(fadeInTimer);
      clearInterval(tick);
      clearTimeout(stepTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="loadingScreen" className={`visible ${opacity ? 'show-opacity' : ''}`}>
      <div className="loading-card">
        <div className="loading-spinner">
          <div className="spin-ring"></div>
          <span className="spin-icon">🤖</span>
        </div>
        <h2 className="loading-title">AI Teacher đang chuẩn bị bài học...</h2>
        <p className="loading-sub">{sub}</p>

        <div className="loading-steps">
          {LOADING_STEPS.map((st, i) => {
            let stepClass = 'lstep';
            let statusText = '○';
            if (stepStatuses[i] === 'active') stepClass += ' active';
            else if (stepStatuses[i] === 'done') {
              stepClass += ' done';
              statusText = '✓';
            }
            return (
              <div key={i} className={stepClass}>
                <span className="lstep-icon">•</span>
                <span className="lstep-label">{st.label}</span>
                <span className="lstep-status">{statusText}</span>
              </div>
            );
          })}
        </div>

        <div className="loading-progress">
          <div className="loading-progress-fill" style={{ width: `${pct}%` }}></div>
        </div>
        <div className="loading-pct">{pct}%</div>
      </div>
    </div>
  );
}
