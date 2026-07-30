import { useState } from 'react';
import { GAME_CHIPS } from '@/lib/constants';

export function GameScene({ title }: { title: string }) {
  const [gameOrder, setGameOrder] = useState<number[]>([]);
  const [gameResult, setGameResult] = useState('');
  const [gameResultClass, setGameResultClass] = useState('');

  const pickChip = (i: number) => {
    if (gameOrder.includes(i)) return;
    setGameOrder((prev) => [...prev, i]);
  };

  const checkGame = () => {
    const correct = gameOrder.length === GAME_CHIPS.length && gameOrder.every((v, i) => v === i);
    if (correct) {
      setGameResult('✓ Chính xác! for i in range(5): print(i)');
      setGameResultClass('game-result ok');
    } else {
      setGameResult('✗ Chưa đúng thứ tự, thử lại nhé (bấm lại từ đầu).');
      setGameResultClass('game-result no');
      setGameOrder([]);
    }
  };

  return (
    <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
      <div className="slide-index" style={{ color: '#3a4152' }}>G</div>
      <div className="game-slide" style={{ position: 'absolute', inset: 0, padding: '36px 48px' }}>
        <h1>{title}</h1>
        <div className="slide-underline" style={{ background: 'linear-gradient(90deg,#5b7cfa,#8a5cf6)' }}></div>
        <p style={{ fontSize: '13px', color: '#8b96b5', marginBottom: '6px' }}>
          Bấm các khối lệnh vào đúng thứ tự để tạo một vòng lặp for hợp lệ:
        </p>
        <div className="game-area">
          <div className={`drop-zone ${gameOrder.length > 0 ? 'filled' : ''}`}>
            {gameOrder.length > 0 ? (
              gameOrder.map((i) => <span key={i}>{GAME_CHIPS[i]}</span>)
            ) : (
              <span style={{ color: '#5a6588' }}>Bấm vào các khối bên dưới để thêm vào đây theo thứ tự…</span>
            )}
          </div>
          <div className="chip-pool">
            {GAME_CHIPS.map((c, i) => {
              const used = gameOrder.includes(i);
              return (
                <div
                  key={i}
                  className={`drag-chip ${used ? 'used' : ''}`}
                  onClick={() => pickChip(i)}
                  style={{ pointerEvents: used ? 'none' : 'auto' }}
                >
                  {c}
                </div>
              );
            })}
          </div>
        </div>
        <button className="game-check-btn" onClick={checkGame}>
          Kiểm tra
        </button>
        {gameResult && <div className={gameResultClass}>{gameResult}</div>}
      </div>
    </div>
  );
}

export function GameSceneMini({ title }: { title: string }) {
  return (
    <div className="game-slide" style={{ padding: '34px 40px', position: 'absolute', inset: 0 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px', color: '#fff' }}>{title}</h1>
      <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
      <div className="game-area" style={{ padding: '10px', minHeight: '60px' }}>
        <div className="chip-pool" style={{ gap: '6px' }}>
          {GAME_CHIPS.map((c, ci) => (
            <div key={ci} className="drag-chip" style={{ padding: '4px 8px', fontSize: '11px' }}>
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
