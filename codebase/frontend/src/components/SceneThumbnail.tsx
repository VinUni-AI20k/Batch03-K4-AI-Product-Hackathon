import { Scene } from '@/lib/types';
import { SlideSceneMini } from '@/components/scenes/SlideScene';
import { CodeSceneMini } from '@/components/scenes/CodeScene';
import { DashboardSceneMini } from '@/components/scenes/DashboardScene';
import { MindmapSceneMini } from '@/components/scenes/MindmapScene';
import { QuizSceneMini } from '@/components/scenes/QuizScene';
import { GameSceneMini } from '@/components/scenes/GameScene';

export function SceneThumbnailBody({ scene }: { scene: Scene }) {
  switch (scene.type) {
    case 'slide':
      return <SlideSceneMini scene={scene} />;
    case 'code':
      return <CodeSceneMini />;
    case 'dashboard':
      return <DashboardSceneMini />;
    case 'mindmap':
      return <MindmapSceneMini />;
    case 'quiz':
      return <QuizSceneMini title={scene.title} />;
    case 'game':
      return <GameSceneMini title={scene.title} />;
    default:
      return <h1>{scene.title}</h1>;
  }
}
