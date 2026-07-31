import React, { useRef, useState } from 'react';
import { uploadKnowledge } from '../api/client';
import { useSession } from '../context/SessionContext';
import ProgressLoader from './shared/ProgressLoader';

const AI_STEPS = ['Classifying transcript (teaching vs. noise)', 'Extracting section outline', 'Generating your 10-question quiz'];

export default function UploadStep() {
  const { dispatch } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasSlides = files.some((file) => file.name.toLowerCase().endsWith('.pdf'));
  const hasTranscript = files.some((file) => {
    const name = file.name.toLowerCase();
    return name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.vtt') || name.endsWith('.srt');
  });
  const readyToGenerate = hasSlides || hasTranscript;

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  }

  async function handleGenerate() {
    if (!readyToGenerate) return;
    setLoading(true);
    setError(null);
    setActiveStep(0);
    // Cosmetic pacing only — the real work is one combined backend round trip
    // (classify + align + quiz generation) with no incremental progress events.
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
    return <ProgressLoader label="Turning your lecture into a Knowledge Package… (thường mất 1-2 phút cho slide + transcript đầy đủ, đừng tải lại trang)" steps={AI_STEPS} activeStep={activeStep} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <h2 className="font-display" style={{ fontSize: 26, marginTop: 0 }}>
            Bring your lecture to life 🎓
          </h2>
          <p className="text-soft" style={{ marginTop: 6, fontSize: 15 }}>
            Drop in your slides and/or the class transcript, then press Generate when you're ready.
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
            Drop PDF slides and/or transcript here
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
            {!readyToGenerate && (
              <span className="clay-badge" style={{ color: 'var(--clay-orange-dark)' }}>
                Import ít nhất 1 file slide (.pdf) hoặc 1 file transcript (.md, .txt, .vtt, .srt) để Generate MCQ.
              </span>
            )}
          </div>
        )}

        <button
          className="clay-btn clay-btn--mint"
          disabled={!readyToGenerate}
          onClick={handleGenerate}
          style={{ alignSelf: 'flex-start' }}
        >
          Generate MCQ →
        </button>

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
