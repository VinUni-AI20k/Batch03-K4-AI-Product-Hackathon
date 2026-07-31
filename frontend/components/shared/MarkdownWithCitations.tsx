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
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key}`} style={{ margin: '0 0 12px 20px', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(index);
      return;
    }

    // Check headers
    if (trimmed.startsWith('# ')) {
      flushList(index);
      elements.push(
        <h3 key={index} className="font-display" style={{ fontSize: 20, fontWeight: 800, marginTop: 16, marginBottom: 8, color: 'var(--ink)' }}>
          {renderInline(trimmed.slice(2))}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList(index);
      elements.push(
        <h4 key={index} className="font-display" style={{ fontSize: 17, fontWeight: 700, marginTop: 14, marginBottom: 6, color: 'var(--ink)' }}>
          {renderInline(trimmed.slice(3))}
        </h4>
      );
    } else if (trimmed.startsWith('### ')) {
      flushList(index);
      elements.push(
        <h5 key={index} className="font-display" style={{ fontSize: 15, fontWeight: 700, marginTop: 12, marginBottom: 4, color: 'var(--ink)' }}>
          {renderInline(trimmed.slice(4))}
        </h5>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const bulletContent = trimmed.replace(/^[-*•]\s+/, '');
      currentList.push(
        <li key={index} style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink)' }}>
          {renderInline(bulletContent)}
        </li>
      );
    } else {
      flushList(index);
      elements.push(
        <p key={index} style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink)', margin: '0 0 10px 0' }}>
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  flushList(lines.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {elements}
      {sourceRef && (
        <span
          className="clay-badge clay-badge--purple"
          style={{ alignSelf: 'flex-start', marginTop: 8 }}
          title="Where this came from in your slides/transcript"
        >
          📎 {sourceRef}
        </span>
      )}
    </div>
  );
}
