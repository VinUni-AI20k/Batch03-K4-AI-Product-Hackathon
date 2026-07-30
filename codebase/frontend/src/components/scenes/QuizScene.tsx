import { useState } from 'react';
import { QUIZ_BANK } from '@/lib/constants';

export function QuizScene() {
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelection, setQuizSelection] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [quizFeedbackClass, setQuizFeedbackClass] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);

  const answerQuiz = (i: number) => {
    if (quizAnswered) return;
    setQuizAnswered(true);
    setQuizSelection(i);
    const item = QUIZ_BANK[quizIdx];
    if (i === item.correct) {
      setQuizScore((prev) => prev + 1);
      setQuizFeedback('✓ Chính xác! Làm tốt lắm.');
      setQuizFeedbackClass('quiz-feedback show ok');
    } else {
      setQuizFeedback('✗ Chưa đúng. Đáp án đúng đã được tô xanh.');
      setQuizFeedbackClass('quiz-feedback show no');
    }
  };

  const nextQuiz = () => {
    if (quizIdx < QUIZ_BANK.length - 1) {
      setQuizIdx((prev) => prev + 1);
      setQuizAnswered(false);
      setQuizSelection(null);
      setQuizFeedback('');
      setQuizFeedbackClass('');
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setQuizIdx(0);
    setQuizAnswered(false);
    setQuizScore(0);
    setQuizSelection(null);
    setQuizFeedback('');
    setQuizCompleted(false);
  };

  return (
    <div className="slide active" style={{ pointerEvents: 'auto', opacity: 1, transform: 'translateX(0px)' }}>
      <div className="slide-index">Q</div>
      <div className="quiz-slide">
        <h1>Conditional Coding Challenge</h1>
        <div className="slide-underline"></div>
        <div className="quiz-progress">
          {QUIZ_BANK.map((_, i) => {
            let cls = 'qp-dot';
            if (i === quizIdx) cls += ' qp-current';
            else if (i < quizIdx) cls += ' qp-answered';
            return <div key={i} className={cls}></div>;
          })}
        </div>

        {!quizCompleted ? (
          <div>
            <p style={{ fontSize: '15px', color: '#42465a', marginBottom: '16px' }}>
              Câu {quizIdx + 1}/{QUIZ_BANK.length}: {QUIZ_BANK[quizIdx].q}
            </p>
            {QUIZ_BANK[quizIdx].opts.map((o, i) => {
              let optClass = 'quiz-opt';
              if (quizAnswered) {
                if (i === QUIZ_BANK[quizIdx].correct) optClass += ' correct';
                else if (i === quizSelection) optClass += ' wrong';
              }
              return (
                <button
                  key={i}
                  className={optClass}
                  onClick={() => answerQuiz(i)}
                  style={{ pointerEvents: quizAnswered ? 'none' : 'auto' }}
                >
                  {o}
                </button>
              );
            })}
            {quizFeedback && <div className={quizFeedbackClass}>{quizFeedback}</div>}
            {quizAnswered && (
              <button className="quiz-next-btn show" onClick={nextQuiz}>
                {quizIdx < QUIZ_BANK.length - 1 ? 'Câu tiếp theo →' : `Xem kết quả (${quizScore}/${QUIZ_BANK.length}) ✓`}
              </button>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎉</div>
            <h3 style={{ margin: '0 0 6px' }}>Hoàn thành!</h3>
            <p style={{ color: '#42465a' }}>
              Bạn trả lời đúng {quizScore}/{QUIZ_BANK.length} câu.
            </p>
            <button className="try-btn" onClick={restartQuiz}>
              Làm lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function QuizSceneMini({ title }: { title: string }) {
  return (
    <div className="quiz-slide" style={{ padding: '34px 40px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 4px', color: '#181b2e' }}>
        {title}
      </h1>
      <div className="slide-underline" style={{ width: '60px', height: '3px', margin: '8px 0 16px' }}></div>
      <p style={{ fontSize: '12px', color: '#42465a', margin: 0 }}>{QUIZ_BANK[0].q}</p>
      <div className="quiz-opt" style={{ pointerEvents: 'none', padding: '6px 10px', fontSize: '11px', margin: '6px 0 0' }}>
        {QUIZ_BANK[0].opts[1]}
      </div>
    </div>
  );
}
