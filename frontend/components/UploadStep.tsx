import React, { useEffect, useRef, useState } from 'react';
import { uploadKnowledge } from '../api/client';
import { useSession } from '../context/SessionContext';
import ProgressLoader from './shared/ProgressLoader';

const AI_STEPS = ['Classifying transcript (teaching vs. noise)', 'Extracting section outline', 'Generating your 20-question quiz'];
const AUTO_START_DELAY_MS = 1200;

export default function UploadStep() {
  const { dispatch } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoStartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSlides = files.some((file) => file.name.toLowerCase().endsWith('.pdf'));
  const hasTranscript = files.some((file) => {
    const name = file.name.toLowerCase();
    return name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.vtt') || name.endsWith('.srt');
  });
  const readyToGenerate = hasSlides && hasTranscript;

  // Auto-trigger: once files are added, processing starts on its own after a
  // short debounce (so adding several files doesn't fire the pipeline early).
  // No "Generate" button to click — matches "bỏ trigger thủ công" feedback.
  useEffect(() => {
    if (autoStartTimer.current) clearTimeout(autoStartTimer.current);
    if (!readyToGenerate || loading) {
      setCountdown(null);
      return;
    }
    setCountdown(AUTO_START_DELAY_MS / 1000);
    const tick = setInterval(() => setCountdown((c) => (c && c > 0 ? c - 1 : c)), 1000);
    autoStartTimer.current = setTimeout(() => {
      clearInterval(tick);
      handleGenerate();
    }, AUTO_START_DELAY_MS);
    return () => {
      clearInterval(tick);
      if (autoStartTimer.current) clearTimeout(autoStartTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, readyToGenerate, loading]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  }

  async function handleGenerate() {
    if (!readyToGenerate) return;
    setLoading(true);
    setError(null);
    setActiveStep(0);
    const t1 = setTimeout(() => setActiveStep(1), 500);
    const t2 = setTimeout(() => setActiveStep(2), 900);
    try {
      const kp = await uploadKnowledge(files);
      clearTimeout(t1);
      clearTimeout(t2);
      dispatch({ type: 'SET_KNOWLEDGE_PACKAGE', payload: kp });
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Could not process the uploaded materials.');
    }
  }

  if (loading) {
    return <ProgressLoader label="Turning your lecture into a Knowledge Package…" steps={AI_STEPS} activeStep={activeStep} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <h2 className="font-display" style={{ fontSize: 26, marginTop: 0 }}>
            Bring your lecture to life 🎓
          </h2>
          <p className="text-soft" style={{ marginTop: 6, fontSize: 15 }}>
            Drop in your slides and the class transcript — I'll start turning them into a study package automatically.
          </p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className="clay-card clay-card--sunken"
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            padding: '40px 20px',
            border: `3px dashed ${dragOver ? 'var(--clay-purple)' : 'transparent'}`,
            transition: 'border-color .15s ease',
          }}
        >
          <div style={{ fontSize: 40 }}>📎</div>
          <p style={{ fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: 8 }}>
            Drop PDF slides + transcript here
          </p>
          <p className="text-soft" style={{ fontSize: 13, marginTop: 4 }}>
            or click to browse — .pdf, .md, .txt, .vtt, .srt
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => addFiles(e.target.files)}
            accept=".pdf,.md,.txt,.vtt,.srt"
          />
        </div>

        {files.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {files.map((f, i) => (
              <span key={i} className="clay-chip">
                📄 {f.name}
                <button
                  aria-label={`Remove ${f.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles((prev) => prev.filter((_, idx) => idx !== i));
                  }}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800, color: 'var(--ink-soft)' }}
                >
                  ✕
                </button>
              </span>
            ))}
            {countdown !== null && (
              <span className="clay-badge clay-badge--mint">⚡ Auto-processing in {countdown}s…</span>
            )}
            {!readyToGenerate && (
              <span className="clay-badge" style={{ color: 'var(--clay-orange-dark)' }}>
                Import đủ 1 file slide (.pdf) và 1 file transcript (.md, .txt, .vtt hoặc .srt) để Generate MCQ.
              </span>
            )}
          </div>
        )}
        {error && (
          <div className="clay-panel" style={{ color: 'var(--clay-orange-dark)', fontSize: 13 }}>
            <strong>Processing failed.</strong> {error}
            <p style={{ marginTop: 5 }}>Check that the backend is running and the transcript is Markdown with lecture segment markers such as [T01-001].</p>
          </div>
        )}
      </div>
    </div>
  );
}
