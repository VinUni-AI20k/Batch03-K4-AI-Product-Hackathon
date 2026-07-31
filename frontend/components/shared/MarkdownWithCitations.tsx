import React from 'react';

interface MarkdownWithCitationsProps {
  content: string;
  /** Optional explicit source reference shown as a chip at the end, e.g. "Slide 12 · 04:32" */
  sourceRef?: string;
}

// Very small markdown subset: **bold** and *italic*. Enough for AI-generated
// summary cards / examples without pulling in a full markdown dependency.
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export default function MarkdownWithCitations({ content, sourceRef }: MarkdownWithCitationsProps) {
  const paragraphs = content.split(/\n{2,}/);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {paragraphs.map((p, i) => (
        <p key={i} style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink)' }}>
          {renderInline(p)}
        </p>
      ))}
      {sourceRef && (
        <span
          className="clay-badge clay-badge--purple"
          style={{ alignSelf: 'flex-start', marginTop: 2 }}
          title="Where this came from in your slides/transcript"
        >
          📎 {sourceRef}
        </span>
      )}
    </div>
  );
}
