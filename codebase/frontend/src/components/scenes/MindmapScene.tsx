import { useEffect, useRef } from 'react';
import { MINDMAP_DATA } from '@/lib/constants';

function paintMindmap(canvas: HTMLDivElement) {
  canvas.innerHTML = '';
  const w = canvas.clientWidth || 880;
  const h = canvas.clientHeight || 380;
  const cx = w / 2;
  const cy = h / 2;

  const addNode = (text: string, x: number, y: number, cls: string) => {
    const el = document.createElement('div');
    el.className = 'mm-node ' + cls;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.textContent = text;
    canvas.appendChild(el);
  };

  const addLine = (x1: number, y1: number, x2: number, y2: number, color: string) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const el = document.createElement('div');
    el.className = 'mm-line';
    el.style.left = x1 + 'px';
    el.style.top = y1 + 'px';
    el.style.width = len + 'px';
    el.style.background = color;
    el.style.transform = `rotate(${angle}deg)`;
    canvas.appendChild(el);
  };

  addNode(MINDMAP_DATA.root, cx, cy, 'root');

  const branchR = Math.min(w, h) * 0.32;
  MINDMAP_DATA.branches.forEach((b) => {
    const rad = (b.angle * Math.PI) / 180;
    const bx = cx + Math.cos(rad) * branchR * 1.3;
    const by = cy + Math.sin(rad) * branchR * 0.62 + 40;
    addLine(cx, cy, bx, by, '#a9b8ea');
    addNode(b.name, bx, by, 'branch');

    const leafR = 130;
    b.leaves.forEach((leaf, li) => {
      const leafAngle = rad + (li === 0 ? -0.42 : 0.42);
      const lx = bx + Math.cos(leafAngle) * leafR;
      const ly = by + Math.sin(leafAngle) * leafR * 0.75 + 46;
      addLine(bx, by, lx, ly, '#dbe0f2');
      addNode(leaf, lx, ly, 'leaf');
    });
  });
}

export function MindmapScene() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (canvasRef.current) paintMindmap(canvasRef.current);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)', overflow: 'hidden' }}>
      <div className="mindmap-slide" style={{ position: 'absolute', inset: 0, padding: '36px 44px' }}>
        <h1 style={{ fontSize: '26px' }}>The Logic Flowchart</h1>
        <div className="slide-underline" style={{ margin: '10px 0 6px' }}></div>
        <div className="mindmap-canvas" ref={canvasRef}></div>
      </div>
    </div>
  );
}

export function MindmapSceneMini() {
  return (
    <div style={{ padding: '28px 34px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px', color: '#181b2e' }}>
        {MINDMAP_DATA.root} Map
      </h1>
      <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
        {MINDMAP_DATA.branches.map((b, bi) => (
          <div
            key={bi}
            className="mm-node branch"
            style={{ position: 'static', transform: 'none', fontSize: '11px', padding: '6px 10px' }}
          >
            {b.name}
          </div>
        ))}
      </div>
    </div>
  );
}
