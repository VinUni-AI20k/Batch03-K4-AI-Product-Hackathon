import { useEffect } from 'react';
import { Scene } from '@/lib/types';
import { SCENE_TYPES } from '@/lib/constants';
import { SceneThumbnailBody } from '@/components/SceneThumbnail';

interface SidebarProps {
  courseName: string;
  scenes: Scene[];
  current: number;
  onGoTo: (i: number) => void;
  genMindmapLoading: boolean;
  genQuizLoading: boolean;
  onRequestGenerate: (kind: 'mindmap' | 'quiz') => void;
}

export function Sidebar({
  courseName,
  scenes,
  current,
  onGoTo,
  genMindmapLoading,
  genQuizLoading,
  onRequestGenerate,
}: SidebarProps) {
  const progressPct = Math.round(((current + 1) / scenes.length) * 100);

  // Scale each 1000x625 thumbnail render to fit its sidebar card width
  useEffect(() => {
    scenes.forEach((s) => {
      const holder = document.getElementById('thumb-' + s.id);
      if (!holder) return;
      holder.style.width = '1000px';
      holder.style.height = '625px';
      holder.style.transformOrigin = 'top left';
      const parent = holder.parentElement;
      if (parent) {
        const scale = parent.clientWidth / 1000;
        holder.style.transform = `scale(${scale})`;
      }
    });
  }, [scenes, current]);

  return (
    <div id="sidebar">
      <div className="brand">
        <span className="logo">◆</span> OpenMAIC
        <span className="collapse-btn" title="Thu gọn">
          ⟨⟩
        </span>
      </div>
      <div className="scene-list" id="sceneList">
        <div className="course-meta">
          <div className="name">{courseName}</div>
          <div className="course-progress-bar">
            <div className="course-progress-fill" style={{ width: `${progressPct}%` }}></div>
          </div>
          <div className="pct">{progressPct}% hoàn thành</div>
        </div>
        <div id="sceneEntries">
          {scenes.map((s, i) => {
            const meta = SCENE_TYPES[s.type] || { label: 'Scene', icon: '•' };
            const isActive = i === current;
            const isDone = i < current;
            return (
              <div
                key={s.id}
                className={`scene-entry ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => onGoTo(i)}
              >
                <div className="scene-entry-head">
                  <div className="scene-num">{i + 1}</div>
                  <span className="scene-type-icon">{meta.icon}</span>
                  <div className="scene-name">{s.title}</div>
                </div>
                <div className="scene-thumb">
                  <div className="scene-thumb-inner" id={`thumb-${s.id}`}>
                    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#fff' }}>
                      <SceneThumbnailBody scene={s} />
                    </div>
                  </div>
                  <div className="scene-thumb-badge">{meta.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="sidebar-actions">
        <button className={`gen-more-btn ${genMindmapLoading ? 'loading' : ''}`} onClick={() => onRequestGenerate('mindmap')}>
          <span className="gm-icon">🧠</span>
          <span className="spin-mini"></span>
          <span>AI tạo thêm sơ đồ tư duy</span>
        </button>
        <button className={`gen-more-btn ${genQuizLoading ? 'loading' : ''}`} onClick={() => onRequestGenerate('quiz')}>
          <span className="gm-icon">📝</span>
          <span className="spin-mini"></span>
          <span>AI tạo thêm bài tập</span>
        </button>
      </div>
    </div>
  );
}
