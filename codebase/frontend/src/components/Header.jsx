import React from 'react';
import { Zap } from 'lucide-react';

export default function Header({ kbStatusText }) {
  return (
    <header className="glass-header">
      <div className="brand">
        <div className="logo-badge">
          <Zap className="logo-icon" size={26} />
        </div>
        <div className="brand-text">
          <h1>AI AGENT QA</h1>
          <p>Cộng đồng AI Thực Chiến Vingroup - VinUni</p>
        </div>
      </div>

      <div className="status-pill">
        <span className="pulse-dot"></span>
        <span>{kbStatusText}</span>
      </div>
    </header>
  );
}
