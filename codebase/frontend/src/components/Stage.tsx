import { Scene } from '@/lib/types';
import { SlideScene } from '@/components/scenes/SlideScene';
import { CodeScene } from '@/components/scenes/CodeScene';
import { DashboardScene } from '@/components/scenes/DashboardScene';
import { MindmapScene } from '@/components/scenes/MindmapScene';
import { QuizScene } from '@/components/scenes/QuizScene';
import { GameScene } from '@/components/scenes/GameScene';

export function SceneBody({ scene }: { scene: Scene }) {
  switch (scene.type) {
    case 'slide':
      return <SlideScene scene={scene} />;
    case 'code':
      return <CodeScene />;
    case 'dashboard':
      return <DashboardScene />;
    case 'mindmap':
      return <MindmapScene key={scene.id} />;
    case 'quiz':
      return <QuizScene key={scene.id} />;
    case 'game':
      return <GameScene key={scene.id} title={scene.title} />;
    default:
      return <h1>{scene.title}</h1>;
  }
}

interface StageProps {
  scene: Scene;
  onPrev: () => void;
  onNext: () => void;
}

export function Stage({ scene, onPrev, onNext }: StageProps) {
  return (
    <div id="stage-wrap">
      <div className="stage-side-arrow left" onClick={onPrev}>
        ‹
      </div>
      <div id="stage">
        <SceneBody scene={scene} />
      </div>
      <div className="stage-side-arrow right" onClick={onNext}>
        ›
      </div>
    </div>
  );
}
