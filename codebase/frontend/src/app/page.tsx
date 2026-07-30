'use client';

import { useEffect, useRef, useState } from 'react';
import { Scene } from '@/lib/types';
import { INITIAL_SCENES, NARRATIONS } from '@/lib/constants';
import { StartScreen } from '@/components/StartScreen';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { Stage } from '@/components/Stage';
import { BottomBar } from '@/components/BottomBar';
import { AgentRow } from '@/components/AgentRow';

type Phase = 'start' | 'loading' | 'app';

export default function Home() {
  const [phase, setPhase] = useState<Phase>('start');
  const [startScreenHidden, setStartScreenHidden] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [courseName, setCourseName] = useState('Khóa học: Nhập môn Python');

  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [annotating, setAnnotating] = useState(false);

  const [genMindmapLoading, setGenMindmapLoading] = useState(false);
  const [genQuizLoading, setGenQuizLoading] = useState(false);

  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = (i: number) => {
    if (loopEnabled) {
      const idx = ((i % scenes.length) + scenes.length) % scenes.length;
      setCurrent(idx);
    } else {
      const idx = Math.max(0, Math.min(scenes.length - 1, i));
      setCurrent(idx);
      if (idx === scenes.length - 1 && i >= scenes.length && playing) {
        setPlaying(false);
      }
    }
  };

  const nextSlide = () => goTo(current + 1);
  const prevSlide = () => goTo(current - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'app') return;
      if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, current, scenes.length, loopEnabled, playing]);

  // Auto-play
  useEffect(() => {
    if (playTimerRef.current) clearInterval(playTimerRef.current);
    if (playing) {
      playTimerRef.current = setInterval(nextSlide, 3000 / playSpeed);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, current, playSpeed, scenes.length]);

  const handleStart = (file: File | null) => {
    setSelectedFile(file);
    setStartScreenHidden(true);
    setTimeout(() => setPhase('loading'), 350);
  };

  const handleLoadingComplete = () => {
    setPhase('app');
    if (selectedFile) {
      setCourseName('Khóa học: ' + selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('stage-wrap');
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const nextIdx = (speeds.indexOf(playSpeed) + 1) % speeds.length;
    setPlaySpeed(speeds[nextIdx]);
  };

  // AI request generation (Mindmap or Quiz) — currently a scripted stand-in,
  // no real AI call wired up yet.
  const requestGenerate = (kind: 'mindmap' | 'quiz') => {
    const setLoading = kind === 'mindmap' ? setGenMindmapLoading : setGenQuizLoading;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const n = scenes.filter((s) => s.type === kind).length + 1;
      const newSceneId = `${kind}_extra_${Date.now()}`;
      const title = kind === 'mindmap' ? `Sơ đồ tư duy bổ sung #${n}` : `Bài tập bổ sung #${n}`;
      NARRATIONS[newSceneId] =
        kind === 'mindmap'
          ? 'Đây là sơ đồ tư duy bổ sung do AI Teacher vừa tạo thêm cho bạn.'
          : 'AI Teacher vừa tạo thêm một bộ bài tập mới để bạn luyện tập thêm.';
      const newScenes: Scene[] = [...scenes, { id: newSceneId, type: kind, title }];
      setScenes(newScenes);
      setCurrent(newScenes.length - 1);
    }, 1400);
  };

  return (
    <>
      {phase === 'start' && <StartScreen hidden={startScreenHidden} onStart={handleStart} />}

      {phase === 'loading' && <LoadingScreen onComplete={handleLoadingComplete} />}

      {phase === 'app' && (
        <div id="app" className="visible">
          <Sidebar
            courseName={courseName}
            scenes={scenes}
            current={current}
            onGoTo={goTo}
            genMindmapLoading={genMindmapLoading}
            genQuizLoading={genQuizLoading}
            onRequestGenerate={requestGenerate}
          />

          <div id="main">
            <TopBar scene={scenes[current]} onBack={() => goTo(0)} />
            <Stage scene={scenes[current]} onPrev={prevSlide} onNext={nextSlide} />

            <div id="bottombar">
              <BottomBar
                current={current}
                total={scenes.length}
                muted={muted}
                playSpeed={playSpeed}
                playing={playing}
                loopEnabled={loopEnabled}
                annotating={annotating}
                onToggleMute={() => setMuted(!muted)}
                onCycleSpeed={cycleSpeed}
                onPrev={prevSlide}
                onTogglePlay={() => setPlaying(!playing)}
                onNext={nextSlide}
                onToggleLoop={() => setLoopEnabled(!loopEnabled)}
                onToggleAnnotate={() => setAnnotating(!annotating)}
                onToggleFullscreen={toggleFullscreen}
                onToggleChat={() => {}}
              />
              <AgentRow scene={scenes[current]} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
