interface BottomBarProps {
  current: number;
  total: number;
  muted: boolean;
  playSpeed: number;
  playing: boolean;
  loopEnabled: boolean;
  annotating: boolean;
  onToggleMute: () => void;
  onCycleSpeed: () => void;
  onPrev: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onToggleLoop: () => void;
  onToggleAnnotate: () => void;
  onToggleFullscreen: () => void;
  onToggleChat: () => void;
}

export function BottomBar({
  current,
  total,
  muted,
  playSpeed,
  playing,
  loopEnabled,
  annotating,
  onToggleMute,
  onCycleSpeed,
  onPrev,
  onTogglePlay,
  onNext,
  onToggleLoop,
  onToggleAnnotate,
  onToggleFullscreen,
  onToggleChat,
}: BottomBarProps) {
  return (
    <div id="transport">
      <div className="t-left">
        <button className="t-btn" title="Danh sách slide">
          ☰
        </button>
        <span id="slideCounter">
          {current + 1} / {total}
        </span>
      </div>
      <div className="t-center">
        <button className="t-btn" title="Âm thanh" onClick={onToggleMute}>
          {muted ? '🔇' : '🔊'}
        </button>
        <span onClick={onCycleSpeed} style={{ cursor: 'pointer', fontWeight: 600 }}>
          {playSpeed}x
        </span>
        <div className="divider"></div>
        <button className="t-btn" onClick={onPrev}>
          ◀
        </button>
        <button className="t-btn play-main" onClick={onTogglePlay}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className="t-btn" onClick={onNext}>
          ▶
        </button>
        <div className="divider"></div>
        <button className="t-btn" title="Lặp lại" onClick={onToggleLoop} style={{ color: loopEnabled ? 'var(--accent)' : 'var(--ink-dim)' }}>
          🔁
        </button>
        <button
          className="t-btn"
          title="Ghi chú / vẽ"
          onClick={onToggleAnnotate}
          style={{ background: annotating ? 'var(--accent)' : 'transparent', color: annotating ? '#fff' : 'var(--ink-dim)' }}
        >
          ✏️
        </button>
      </div>
      <div className="t-right">
        <button className="t-btn" title="Toàn màn hình" onClick={onToggleFullscreen}>
          ⛶
        </button>
        <button className="t-btn" title="Ẩn/hiện chat" onClick={onToggleChat}>
          💬
        </button>
      </div>
    </div>
  );
}
