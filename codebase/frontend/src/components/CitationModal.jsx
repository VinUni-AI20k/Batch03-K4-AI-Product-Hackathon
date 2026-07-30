import React from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function CitationModal({ citation, onClose }) {
  if (!citation) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📄 Trích dẫn: {citation.title}</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: '8px' }}>
            <strong>Nguồn URL/File: </strong>
            <a
              href={citation.url || '#'}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--primary-cyan)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              {citation.url || 'Internal VLearn / FB Group Reference'}
              <ExternalLink size={14} />
            </a>
          </p>

          <p style={{ marginBottom: '14px' }}>
            <strong>Loại tài liệu: </strong>
            <span style={{ color: '#00E676', fontWeight: 600 }}>
              {citation.type === 'fb_group'
                ? 'Facebook Group Scraped Q&A (verified by TA)'
                : 'VLearn Lecture Transcript / Slide'}
            </span>
          </p>

          <hr style={{ border: 0, borderTop: '1px solid rgba(255,255,255,0.1)', margin: '14px 0' }} />

          <p style={{ whiteSpace: 'pre-line', background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '10px', color: '#E2E8F0' }}>
            {citation.snippet}
          </p>
        </div>
      </div>
    </div>
  );
}
