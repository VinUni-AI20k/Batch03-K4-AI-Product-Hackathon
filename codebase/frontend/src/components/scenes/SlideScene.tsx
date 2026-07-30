import { Scene } from '@/lib/types';

export function SlideScene({ scene }: { scene: Scene }) {
  if (scene.id === 's0') {
    return (
      <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
        <div className="slide-index">01</div>
        <h1>Welcome to Python</h1>
        <div className="slide-underline"></div>
        <div className="card-row">
          <div className="info-card">
            <h3>What is Python?</h3>
            <p>High-level, general-purpose language focused on readability</p>
          </div>
          <div className="info-card">
            <h3>Why Learn It?</h3>
            <p>Simple syntax, huge library, used in AI and Data Science</p>
          </div>
          <div className="info-card">
            <h3>How It Works</h3>
            <p>Interpreted language: executes code line-by-line</p>
          </div>
        </div>
        <div className="exec-label">Execution Logic:</div>
        <div className="exec-row">
          <div className="exec-box gray">Compiled (Source → Machine)</div>
          <div className="exec-arrow"></div>
          <div className="exec-box green">Interpreted (Line by Line)</div>
        </div>
      </div>
    );
  }
  return (
    <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
      <div className="slide-index">04</div>
      <h1>Control Flow Basics</h1>
      <div className="slide-underline"></div>
      <div className="card-row">
        <div className="info-card">
          <h3>if / else</h3>
          <p>Rẽ nhánh dựa trên điều kiện đúng/sai</p>
        </div>
        <div className="info-card">
          <h3>for loop</h3>
          <p>Lặp qua từng phần tử của một tập hợp</p>
        </div>
        <div className="info-card">
          <h3>while loop</h3>
          <p>Lặp lại khi điều kiện còn đúng</p>
        </div>
      </div>
      <p style={{ fontSize: '14px', color: '#42465a' }}>
        Control flow quyết định thứ tự thực thi của các câu lệnh trong chương trình.
      </p>
    </div>
  );
}

export function SlideSceneMini({ scene }: { scene: Scene }) {
  return (
    <div style={{ padding: '34px 40px' }}>
      <div className="slide-index" style={{ fontSize: '40px', color: '#eef0f6' }}>
        {scene.id === 's0' ? '01' : '04'}
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px', color: '#181b2e' }}>
        {scene.id === 's0' ? 'Welcome to Python' : 'Control Flow Basics'}
      </h1>
      <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
      <div className="card-row" style={{ gap: '10px' }}>
        <div className="info-card" style={{ padding: '10px 8px' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 4px' }}>
            {scene.id === 's0' ? 'What is Python?' : 'if / else'}
          </h3>
          <p style={{ fontSize: '10px', lineHeight: '1.3' }}>
            {scene.id === 's0' ? 'High-level, general-purpose language' : 'Rẽ nhánh dựa trên điều kiện đúng/sai'}
          </p>
        </div>
        <div className="info-card" style={{ padding: '10px 8px' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 4px' }}>
            {scene.id === 's0' ? 'Why Learn It?' : 'for loop'}
          </h3>
          <p style={{ fontSize: '10px', lineHeight: '1.3' }}>
            {scene.id === 's0' ? 'Simple syntax, huge library' : 'Lặp qua từng phần tử của một tập hợp'}
          </p>
        </div>
        <div className="info-card" style={{ padding: '10px 8px' }}>
          <h3 style={{ fontSize: '12px', margin: '0 0 4px' }}>
            {scene.id === 's0' ? 'How It Works' : 'while loop'}
          </h3>
          <p style={{ fontSize: '10px', lineHeight: '1.3' }}>
            {scene.id === 's0' ? 'Interpreted language line-by-line' : 'Lặp lại khi điều kiện còn đúng'}
          </p>
        </div>
      </div>
    </div>
  );
}
