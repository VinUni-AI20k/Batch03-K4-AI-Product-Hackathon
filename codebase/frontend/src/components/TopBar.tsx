import { Scene } from '@/lib/types';
import { SCENE_TYPES } from '@/lib/constants';

export function TopBar({ scene, onBack }: { scene: Scene; onBack: () => void }) {
  return (
    <div id="topbar">
      <div className="left">
        <div className="back-btn" onClick={onBack}>
          ←
        </div>
        <div>
          <div className="scene-label">{SCENE_TYPES[scene.type]?.label || 'Scene'}</div>
          <div className="scene-title">{scene.title}</div>
        </div>
      </div>
      <div className="right">
        <div className="lang-pill">EN</div>
        <div className="icon-btn">🌙</div>
        <div className="icon-btn">⚙</div>
        <div className="icon-btn">⬇</div>
      </div>
    </div>
  );
}
