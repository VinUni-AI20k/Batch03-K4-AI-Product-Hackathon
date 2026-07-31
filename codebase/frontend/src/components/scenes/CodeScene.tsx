import { useState } from 'react';

export function CodeScene() {
  const [consoleText, setConsoleText] = useState('Nhấn Run Code để chạy thử...');

  return (
    <div
      className="code-slide active"
      style={{ position: 'absolute', inset: 0, padding: '44px 56px', pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}
    >
      <div className="slide-index" style={{ color: '#eef0f6' }}>02</div>
      <h1>Your First Line of Code</h1>
      <div className="slide-underline" style={{ background: 'linear-gradient(90deg,#5b7cfa,#8a5cf6)' }}></div>
      <div className="code-editor">
        <span className="f">print</span>(<span className="s">&quot;Hello, World!&quot;</span>)
      </div>
      <button className="try-btn" onClick={() => setConsoleText('>>> Hello, World!')}>
        ▶ Run Code
      </button>
      <div className="console" id="consoleOut">
        {consoleText}
      </div>
    </div>
  );
}

export function CodeSceneMini() {
  return (
    <div className="code-slide" style={{ position: 'absolute', inset: 0, padding: '34px 40px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px', color: '#fff' }}>
        Your First Line of Code
      </h1>
      <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
      <div className="code-editor" style={{ padding: '10px 14px', fontSize: '12px' }}>
        <span className="f">print</span>(<span className="s">&quot;Hello, World!&quot;</span>)
      </div>
    </div>
  );
}
