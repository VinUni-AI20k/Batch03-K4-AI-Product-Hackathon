import React, { useState } from 'react';
import { 
  BookOpen, Link2, CheckSquare, Sparkles, AlertTriangle, 
  HelpCircle, ThumbsDown, FileText, ArrowRight, XCircle, 
  Terminal, ShieldAlert, ExternalLink, Zap
} from 'lucide-react';
import KnowledgeMap from './KnowledgeMap';
import FeedbackModal from './FeedbackModal';
import { logger } from '../services/logger';

export default function LearningBridge({ 
  bridgeData, 
  fromDay, 
  toDay, 
  onRefreshLLM, 
  loading, 
  onSkipBridge,
  onJumpToSlide
}) {
  const [activeTab, setActiveTab] = useState('recap'); // 'recap' | 'bridge' | 'map' | 'checklist' | 'trace'
  const [quizAnswers, setQuizAnswers] = useState({});
  const [checklistState, setChecklistState] = useState({});
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  if (!bridgeData) return null;

  const handleQuizSelect = (qId, optionIdx) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const toggleChecklist = (ckId) => {
    setChecklistState(prev => ({ ...prev, [ckId]: !prev[ckId] }));
  };

  const handleOpenFeedback = (item, section) => {
    setFeedbackTarget({ ...item, section });
    setIsFeedbackOpen(true);
  };

  // Helper function to extract slide page number and day code from citation string
  const extractSlidePageAndDay = (citationText) => {
    if (!citationText) return { pageNum: null, dayCode: null };
    const pageMatch = citationText.match(/slide\s*(\d+)/i);
    const dayMatch = citationText.match(/(Day\s*\d{1,2})/i);
    return {
      pageNum: pageMatch ? pageMatch[1] : null,
      dayCode: dayMatch ? dayMatch[1] : null
    };
  };

  // Rút gọn tên Path Mode ngắn gọn không rườm rà
  const getShortPathName = (name) => {
    if (!name) return 'Happy Path';
    if (name.includes('Out of Scope') || name.includes('Boundary')) return 'Out-of-Scope';
    if (name.includes('Low-Confidence')) return 'Low-Confidence';
    if (name.includes('Failure')) return 'Failure';
    return 'Happy Path';
  };

  const logs = logger.getLogs();

  return (
    <div className="flex flex-col space-y-3 text-[14px] w-full animate-fade-in">
      
      {/* 🔴 HERO HEADER SECTION (TỐI GIẢN - CỰC GỌN GÀNG) */}
      <div className="vlearn-card p-3 space-y-2 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
        
        {/* Top Badges Bar */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1 whitespace-nowrap">
              <Sparkles size={11} className="text-indigo-600 shrink-0" /> AI Bridge
            </span>
            <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 whitespace-nowrap">
              {getShortPathName(bridgeData.pathName)}
            </span>
          </div>

          {bridgeData.isRealAPI && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0 whitespace-nowrap">
              🟢 Live API
            </span>
          )}
        </div>

        {/* HERO BRIDGE BANNER */}
        <div className="bg-gradient-to-r from-indigo-50/70 via-slate-50 to-rose-50/70 border border-slate-200/80 p-2.5 rounded-lg flex items-center justify-between shadow-2xs gap-2">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">CẦU NỐI TRI THỨC</div>
            <div className="text-[14px] font-bold text-slate-800 leading-snug whitespace-nowrap">Chuyển tiếp kiến thức</div>
          </div>

          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-slate-200/90 shadow-2xs shrink-0 whitespace-nowrap">
            <span className="text-[14px] font-extrabold text-[#0f2b5c]">{fromDay.code}</span>
            <ArrowRight size={13} className="text-indigo-500 shrink-0" />
            <span className="text-[14px] font-extrabold text-rose-600">{toDay.code}</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button 
            onClick={onSkipBridge}
            className="btn btn-navy text-[14px] py-1.5 px-3 font-bold flex items-center justify-center gap-1.5 w-full shadow-2xs rounded-lg whitespace-nowrap"
            title="Bỏ qua phần tổng quan để bắt đầu bài học"
          >
            <span>Học ngay</span>
            <ArrowRight size={14} className="shrink-0" />
          </button>

          <button 
            onClick={onRefreshLLM} 
            disabled={loading}
            className="px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 text-indigo-800 text-[14px] font-semibold hover:bg-indigo-100 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
            title="Tái tạo lại cây tri thức bằng AI"
          >
            <Sparkles size={13} className={loading ? 'animate-spin text-indigo-600 shrink-0' : 'text-indigo-600 shrink-0'} />
            <span>{loading ? 'Đang tạo...' : 'Tạo lại AI'}</span>
          </button>
        </div>
      </div>

      {/* 🟢 5 TAB PILL NAVIGATION */}
      <div className="bg-slate-100 p-1 rounded-lg grid grid-cols-5 gap-1 text-[14px] shrink-0">
        <button 
          onClick={() => setActiveTab('recap')}
          className={`py-1.5 rounded-md font-bold text-[13px] text-center whitespace-nowrap transition-all ${
            activeTab === 'recap' ? 'bg-[#0f2b5c] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Recap
        </button>
        
        <button 
          onClick={() => setActiveTab('bridge')}
          className={`py-1.5 rounded-md font-bold text-[13px] text-center whitespace-nowrap transition-all ${
            activeTab === 'bridge' ? 'bg-[#0f2b5c] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bridge
        </button>

        <button 
          onClick={() => setActiveTab('map')}
          className={`py-1.5 rounded-md font-bold text-[13px] text-center whitespace-nowrap transition-all ${
            activeTab === 'map' ? 'bg-[#0f2b5c] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sơ đồ
        </button>

        <button 
          onClick={() => setActiveTab('checklist')}
          className={`py-1.5 rounded-md font-bold text-[13px] text-center whitespace-nowrap transition-all ${
            activeTab === 'checklist' ? 'bg-[#0f2b5c] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Quiz
        </button>

        <button 
          onClick={() => setActiveTab('trace')}
          className={`py-1.5 rounded-lg font-bold text-[13px] text-center whitespace-nowrap transition-all ${
            activeTab === 'trace' ? 'bg-slate-800 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Trace
        </button>
      </div>

      {/* 📄 TAB 1: RECAP POINTS */}
      {activeTab === 'recap' && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-[12px] text-slate-500 px-0.5">
            <span>{bridgeData.recap?.length || 0} ý cốt lõi có trích dẫn</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /> Grounded G2
            </span>
          </div>

          {bridgeData.recap && bridgeData.recap.length > 0 ? (
            <div className="grid gap-2 max-h-[420px] overflow-y-auto pr-1">
              {bridgeData.recap.map((item) => {
                const { pageNum, dayCode } = extractSlidePageAndDay(item.citation);
                return (
                  <div 
                    key={item.id}
                    className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-2"
                  >
                    <p className="text-[14px] text-slate-800 font-medium leading-relaxed break-words">
                      {item.text}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      {pageNum && onJumpToSlide ? (
                        <button
                          onClick={() => onJumpToSlide(pageNum, dayCode)}
                          className="px-2.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-800 font-bold text-[12px] border border-indigo-200/80 flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                          title={`Click để chuyển sang ${dayCode || fromDay.code} và mở Slide trang ${pageNum}`}
                        >
                          <FileText size={11} className="shrink-0" /> {item.citation} <ExternalLink size={10} className="shrink-0" />
                        </button>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[12px] border border-indigo-100 flex items-center gap-1 whitespace-nowrap">
                          <FileText size={11} className="shrink-0" /> {item.citation}
                        </span>
                      )}

                      <button 
                        onClick={() => handleOpenFeedback(item, 'recap')}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors shrink-0"
                        title="Báo lỗi trích dẫn này"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <ThumbsDown size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400 text-[14px] italic">
              Không có nội dung recap nào cho kịch bản này.
            </div>
          )}
        </div>
      )}

      {/* 🔗 TAB 2: BRIDGE MAP */}
      {activeTab === 'bridge' && (
        <div className="space-y-2 animate-fade-in">
          {bridgeData.bridgeLinks && bridgeData.bridgeLinks.length > 0 ? (
            <div className="grid gap-2 max-h-[420px] overflow-y-auto pr-1">
              {bridgeData.bridgeLinks.map((link) => {
                const srcPage = extractSlidePage(link.sourceRef);
                const targetPage = extractSlidePage(link.targetRef);

                return (
                  <div 
                    key={link.id}
                    className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2"
                  >
                    <div className="flex flex-wrap items-center gap-1 text-[13px] font-bold">
                      {srcPage && onJumpToSlide ? (
                        <button 
                          onClick={() => onJumpToSlide(srcPage)}
                          className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-900 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1 truncate max-w-[140px]"
                          title={`Bấm để mở Slide trang ${srcPage}`}
                        >
                          <span className="truncate">{link.sourceConcept}</span> ({link.sourceRef}) <ExternalLink size={10} className="shrink-0" />
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-100 truncate max-w-[140px]">
                          <span className="truncate">{link.sourceConcept}</span> ({link.sourceRef})
                        </span>
                      )}

                      <ArrowRight size={12} className="text-slate-400 shrink-0" />

                      {targetPage && onJumpToSlide ? (
                        <button 
                          onClick={() => onJumpToSlide(targetPage)}
                          className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-900 border border-emerald-200 transition-all cursor-pointer flex items-center gap-1 truncate max-w-[140px]"
                          title={`Bấm để mở Slide trang ${targetPage}`}
                        >
                          <span className="truncate">{link.targetConcept}</span> ({link.targetRef}) <ExternalLink size={10} className="shrink-0" />
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-100 truncate max-w-[140px]">
                          <span className="truncate">{link.targetConcept}</span> ({link.targetRef})
                        </span>
                      )}
                    </div>

                    <p className="text-[14px] text-slate-700 leading-relaxed pt-1 border-t border-slate-100 break-words">
                      {link.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400 text-[14px] italic">
              Không có liên kết nào (0% hallucination).
            </div>
          )}
        </div>
      )}

      {/* 🗺️ TAB 3: KNOWLEDGE MAP */}
      {activeTab === 'map' && (
        <KnowledgeMap 
          bridgeLinks={bridgeData.bridgeLinks} 
          fromDayCode={fromDay.code} 
          toDayCode={toDay.code} 
        />
      )}

      {/* ✅ TAB 4: CHECKLIST & QUIZ */}
      {activeTab === 'checklist' && (
        <div className="space-y-3 animate-fade-in max-h-[420px] overflow-y-auto pr-1">
          <div>
            <h3 className="text-[14px] font-bold text-slate-900 mb-1.5 flex items-center gap-1 px-0.5">
              <CheckSquare size={14} className="text-indigo-700 shrink-0" /> Checklist Chuẩn bị
            </h3>
            <div className="space-y-1.5">
              {bridgeData.checklist && bridgeData.checklist.map((ck) => (
                <label 
                  key={ck.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <input 
                    type="checkbox" 
                    checked={!!checklistState[ck.id]}
                    onChange={() => toggleChecklist(ck.id)}
                    className="w-4 h-4 rounded text-indigo-600 shrink-0" 
                  />
                  <span className={`text-[14px] leading-relaxed ${checklistState[ck.id] ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {ck.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {bridgeData.quiz && bridgeData.quiz.length > 0 && (
            <div>
              <h3 className="text-[14px] font-bold text-slate-900 mb-1.5 flex items-center gap-1 px-0.5">
                <HelpCircle size={14} className="text-emerald-700 shrink-0" /> Quiz Nhanh
              </h3>
              <div className="space-y-2">
                {bridgeData.quiz.map((q) => (
                  <div key={q.id} className="p-3 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                    <p className="text-[14px] font-bold text-slate-900 leading-relaxed">{q.question}</p>
                    <div className="grid gap-1.5">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = quizAnswers[q.id] === oIdx;
                        const isCorrect = oIdx === q.correctAnswer;
                        const showResult = quizAnswers[q.id] !== undefined;

                        let btnStyle = { backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a' };
                        if (showResult) {
                          if (isCorrect) btnStyle = { backgroundColor: '#ecfdf5', border: '1px solid #10b981', color: '#065f46' };
                          else if (isSelected) btnStyle = { backgroundColor: '#fff1f2', border: '1px solid #f43f5e', color: '#9f1239' };
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleQuizSelect(q.id, oIdx)}
                            className="text-left text-[14px] p-2 rounded-lg transition-all font-medium leading-relaxed"
                            style={btnStyle}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizAnswers[q.id] !== undefined && (
                      <p className="text-[14px] text-indigo-700 pt-0.5 font-medium leading-relaxed">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🔍 TAB 5: AI TRACE LOGS */}
      {activeTab === 'trace' && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-[12px] text-slate-500 px-0.5">
            <span>Trace log vết gọi AI:</span>
            <button 
              onClick={() => { logger.clearLogs(); window.location.reload(); }}
              className="text-rose-600 font-semibold hover:underline text-[12px]"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Xóa log
            </button>
          </div>

          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {logs.length > 0 ? (
              logs.map((logItem) => (
                <div 
                  key={logItem.id}
                  className="p-2.5 rounded-xl bg-slate-900 font-mono text-[11px] text-slate-200 space-y-1 overflow-hidden shadow-2xs"
                >
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-0.5">
                    <span className="text-indigo-400 font-bold">[{logItem.type}]</span>
                    <span>{new Date(logItem.timestamp).toLocaleTimeString()} ({logItem.executionTimeMs}ms)</span>
                  </div>

                  {logItem.type === 'LLM_CALL' && (
                    <>
                      <div className="text-slate-300 truncate">PROMPT: {logItem.prompt}</div>
                      <div className="flex items-center justify-between text-slate-400 pt-0.5">
                        <span>API Thật: <strong className={logItem.isRealAPI ? 'text-emerald-400' : 'text-amber-400'}>{logItem.isRealAPI ? 'YES' : 'NO'}</strong></span>
                        <span>Mode: <span className="text-cyan-400">{logItem.pathMode}</span></span>
                      </div>
                    </>
                  )}

                  {logItem.type === 'USER_FEEDBACK' && (
                    <div>
                      <span className="text-rose-400 font-bold">FEEDBACK:</span> {logItem.comment}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 text-[14px] italic">Chưa có log. Bấm "Tạo lại AI" để sinh trace!</div>
            )}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        targetItem={feedbackTarget} 
      />
    </div>
  );
}
