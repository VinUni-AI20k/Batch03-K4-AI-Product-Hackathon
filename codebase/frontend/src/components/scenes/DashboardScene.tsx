import { useState } from 'react';

export function DashboardScene() {
  const [dashAge, setDashAge] = useState(25);
  const [dashScore, setDashScore] = useState(80);
  const [dashLevel, setDashLevel] = useState(3);

  return (
    <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
      <div className="slide-index">03</div>
      <div className="dash-slide">
        <h1>Variables as Containers</h1>
        <div className="slide-underline"></div>
        <p style={{ fontSize: '13.5px', color: '#42465a', maxWidth: '640px', lineHeight: 1.6, marginBottom: '14px' }}>
          Một biến giống như một chiếc hộp có nhãn dùng để lưu dữ liệu. Thử chỉnh các giá trị bên dưới và xem kết quả thay đổi trực tiếp.
        </p>
        <div className="dash-grid">
          <div className="dash-panel">
            <h4>Điều chỉnh biến</h4>
            <div className="dash-row">
              <label>age =</label>
              <input
                type="range"
                className="dash-slider"
                min="1"
                max="100"
                value={dashAge}
                onChange={(e) => setDashAge(Number(e.target.value))}
              />
              <span className="dash-val">{dashAge}</span>
            </div>
            <div className="dash-row">
              <label>score =</label>
              <input
                type="range"
                className="dash-slider"
                min="0"
                max="100"
                value={dashScore}
                onChange={(e) => setDashScore(Number(e.target.value))}
              />
              <span className="dash-val">{dashScore}</span>
            </div>
            <div className="dash-row">
              <label>level =</label>
              <input
                type="range"
                className="dash-slider"
                min="1"
                max="10"
                value={dashLevel}
                onChange={(e) => setDashLevel(Number(e.target.value))}
              />
              <span className="dash-val">{dashLevel}</span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#2b2f3d',
                background: '#fff',
                borderRadius: '8px',
                padding: '10px',
                marginTop: '8px',
              }}
            >
              age = {dashAge}
              <br />
              score = {dashScore}
              <br />
              level = {dashLevel}
            </p>
          </div>
          <div className="dash-panel">
            <h4>Trực quan hoá</h4>
            <div className="dash-bars">
              <div className="dash-bar" style={{ height: `${dashAge}%` }}>
                <span>age</span>
              </div>
              <div className="dash-bar" style={{ height: `${dashScore}%` }}>
                <span>score</span>
              </div>
              <div className="dash-bar" style={{ height: `${dashLevel * 10}%` }}>
                <span>level</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSceneMini() {
  return (
    <div style={{ padding: '34px 40px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px', color: '#181b2e' }}>
        Variables as Containers
      </h1>
      <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
      <div className="dash-grid" style={{ gap: '10px' }}>
        <div className="dash-panel" style={{ padding: '10px' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '11px' }}>Điều chỉnh biến</h4>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>
            age = 25
            <br />
            score = 80
            <br />
            level = 3
          </div>
        </div>
        <div className="dash-panel" style={{ padding: '10px' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '11px' }}>Trực quan hoá</h4>
          <div className="dash-bars" style={{ height: '50px', gap: '6px' }}>
            <div className="dash-bar" style={{ height: '25%' }}></div>
            <div className="dash-bar" style={{ height: '80%' }}></div>
            <div className="dash-bar" style={{ height: '30%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
