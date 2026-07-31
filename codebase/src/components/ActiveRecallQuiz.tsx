'use client';

import React, { useState } from 'react';
import { quizQuestions, QuizQuestion } from '../data/quizData';
import { Brain, CheckCircle2, AlertTriangle, Lock, Send, Terminal, HelpCircle } from 'lucide-react';

interface ActiveRecallQuizProps {
  onOpenTrace: (qNum: number, selectedOptText: string, evalStatus: string) => void;
  onOpenTaModal: (citation: string) => void;
}

export const ActiveRecallQuiz: React.FC<ActiveRecallQuizProps> = ({
  onOpenTrace,
  onOpenTaModal,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: string }>({});
  const [lastSubmittedOption, setLastSubmittedOption] = useState<{ [qId: number]: string }>({});
  const [wrongAttempts, setWrongAttempts] = useState<{ [qId: number]: number }>({ 1: 0, 2: 0, 3: 0 });
  const [isPassed, setIsPassed] = useState<{ [qId: number]: boolean }>({});
  const [results, setResults] = useState<{ [qId: number]: 'correct' | 'wrong1' | 'wrong2' | null }>({});

  const handleSelectOption = (qId: number, optKey: string) => {
    if (isPassed[qId] || (wrongAttempts[qId] || 0) >= 2) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optKey }));
  };

  const handleSubmit = (q: QuizQuestion) => {
    const qId = q.id;
    const selected = selectedAnswers[qId];

    if (!selected) {
      alert("⚠️ Vui lòng chọn một đáp án trắc nghiệm trước khi bấm Nộp!");
      return;
    }

    if (selected === q.correctOption) {
      setIsPassed(prev => ({ ...prev, [qId]: true }));
      setResults(prev => ({ ...prev, [qId]: 'correct' }));
      return;
    }

    // Wrong answer
    const currentAttempts = (wrongAttempts[qId] || 0) + 1;
    setWrongAttempts(prev => ({ ...prev, [qId]: currentAttempts }));
    setLastSubmittedOption(prev => ({ ...prev, [qId]: selected }));

    if (currentAttempts < 2) {
      setResults(prev => ({ ...prev, [qId]: 'wrong1' }));
    } else {
      setResults(prev => ({ ...prev, [qId]: 'wrong2' }));
    }
  };

  return (
    <div id="activeRecallQuiz" className="w-[820px] bg-gradient-to-b from-white to-slate-50 border-2 border-blue-500 rounded-2xl shadow-xl p-10 flex flex-col gap-7 my-10">
      <div className="flex items-start gap-4 border-b-2 border-blue-50 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
          <Brain className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            VLearn Active Recall & Misconception Diagnosis Engine
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            AI tự động đánh giá câu trả lời, chỉ ra điểm nhầm lẫn khái niệm (Misconception) và dẫn nguồn slide chính xác <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono text-[11px]">[Txx-xxx]</code>.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {quizQuestions.map(q => {
          const qId = q.id;
          const selected = selectedAnswers[qId];
          const attempts = wrongAttempts[qId] || 0;
          const passed = isPassed[qId];
          const resultState = results[qId];
          const isLocked = passed || attempts >= 2;
          const isSubmitDisabled = !selected || selected === lastSubmittedOption[qId] || isLocked;

          return (
            <div key={qId} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4 shadow-xs">
              <div className="text-[15px] font-bold text-slate-900 leading-snug">
                {q.title}
              </div>

              <div className={`flex flex-col gap-2.5 transition-opacity ${isLocked ? 'opacity-85 pointer-events-none' : ''}`}>
                {Object.entries(q.options).map(([optKey, optText]) => {
                  const isSelected = selected === optKey;
                  return (
                    <label
                      key={optKey}
                      onClick={() => handleSelectOption(qId, optKey)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 font-medium'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`quiz-${qId}`}
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 text-blue-600 accent-blue-600"
                      />
                      <span className="text-xs text-slate-700 leading-relaxed">{optText}</span>
                    </label>
                  );
                })}
              </div>

              {!isLocked && (
                <button
                  disabled={isSubmitDisabled}
                  onClick={() => handleSubmit(q)}
                  className={`self-start px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                    isSubmitDisabled
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {selected && selected === lastSubmittedOption[qId]
                      ? '⚠️ Vui lòng chọn đáp án khác trước khi nộp lại'
                      : 'Nộp đáp án & AI Phân tích Hiểu lầm 🚀'}
                  </span>
                </button>
              )}

              {/* RESULT DISPLAY BOX */}
              {resultState === 'correct' && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-4 flex flex-col gap-2 animate-fadeIn">
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>🟢 CHÍNH XÁC! BẠN ĐÃ NẮM VỮNG KIẾN THỨC CỐT LÕI</span>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <strong>🟢 Correct Concept:</strong><br />
                    {q.correctExplanation}
                  </div>
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-[11px] bg-white border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                      📌 Trích dẫn: {q.citation}
                    </span>
                    <button
                      onClick={() => onOpenTrace(qId, `Option ${selected}`, 'PASS')}
                      className="bg-sky-400 text-slate-900 border-none px-2.5 py-1 rounded text-[11px] font-bold hover:bg-sky-300 transition flex items-center gap-1"
                    >
                      <Terminal className="w-3 h-3" />
                      <span>Xem AI Trace Log</span>
                    </button>
                  </div>
                </div>
              )}

              {resultState === 'wrong1' && (
                <div className="bg-rose-50 border-l-4 border-rose-500 rounded-r-xl p-4 flex flex-col gap-3 animate-fadeIn">
                  <div className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>🔴 LẦN THỬ 1/2 SAI — PHÁT HIỆN LỖI NHẦM LẪN (MISCONCEPTION DIAGNOSIS)</span>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-rose-800">❌ Đáp án đã chọn (Option {selected}):</strong> {q.options[selected]}<br />
                    <strong className="text-slate-900">👉 Phân tích lỗi sai:</strong> {q.misconceptionExplanations[selected] || 'Bạn đang hiểu sai bản chất khái niệm.'}
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-rose-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] bg-white border border-rose-200 text-rose-800 px-2 py-0.5 rounded font-semibold">
                        📌 Trích dẫn: {q.citation}
                      </span>
                      <button
                        onClick={() => onOpenTrace(qId, `Option ${selected}`, 'MISCONCEPTION_ATTEMPT_1')}
                        className="bg-sky-400 text-slate-900 border-none px-2.5 py-1 rounded text-[11px] font-bold hover:bg-sky-300 transition flex items-center gap-1"
                      >
                        <Terminal className="w-3 h-3" />
                        <span>Xem AI Trace Log</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenTaModal(q.citation)}
                      className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-orange-100 transition flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Chuyển vùng slide {q.citation} cho TA hỗ trợ</span>
                    </button>
                  </div>
                </div>
              )}

              {resultState === 'wrong2' && (
                <div className="bg-red-50 border-l-4 border-red-600 rounded-r-xl p-4 flex flex-col gap-3 animate-fadeIn">
                  <div className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-red-600" />
                    <span>🔒 ĐÃ HẾT 2 LẦN THỬ — BẢNG PHÂN TÍCH SO SÁNH ĐÁP ÁN ĐÚNG & SAI</span>
                  </div>

                  <div className="bg-rose-100/70 border border-rose-200 rounded-lg p-3 text-xs">
                    <div className="font-bold text-rose-900">❌ Đáp án bạn đã chọn (Option {selected} — SAI):</div>
                    <div className="text-slate-800 mt-1">{q.options[selected]}</div>
                    <div className="text-rose-800 mt-1.5 italic font-medium">
                      👉 Nguyên nhân hiểu sai: {q.misconceptionExplanations[selected] || 'Lỗi nhầm lẫn khái niệm.'}
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs">
                    <div className="font-bold text-emerald-900">✅ Đáp án đúng (Option {q.correctOption} — CHÍNH XÁC):</div>
                    <div className="text-emerald-950 font-semibold mt-1">{q.options[q.correctOption]}</div>
                    <div className="text-emerald-800 mt-1.5">
                      👉 Bản chất kiến thức đúng: {q.correctExplanation}
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-red-200">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] bg-white border border-red-200 text-red-900 px-2 py-0.5 rounded font-semibold">
                        📌 Trích dẫn: {q.citation}
                      </span>
                      <button
                        onClick={() => onOpenTrace(qId, `Option ${selected}`, 'FAILED_MAX_ATTEMPTS')}
                        className="bg-sky-400 text-slate-900 border-none px-2.5 py-1 rounded text-[11px] font-bold hover:bg-sky-300 transition flex items-center gap-1"
                      >
                        <Terminal className="w-3 h-3" />
                        <span>Xem AI Trace Log</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenTaModal(q.citation)}
                      className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-orange-100 transition flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Chuyển vùng slide {q.citation} cho TA hỗ trợ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
