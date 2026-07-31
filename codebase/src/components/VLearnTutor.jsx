import React, { useState, useEffect, useRef } from 'react';
import { Send, ThumbsUp, ThumbsDown, Bot, Sparkles, HelpCircle, BookOpen, RefreshCw, CheckCircle2, RotateCcw, ExternalLink, Check } from 'lucide-react';
import { llmService } from '../services/llmService';

export default function VLearnTutor({ currentDay, onJumpToSlide }) {
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackState, setFeedbackState] = useState({}); // { [msgId]: 'up' | 'down' }

  const chatBottomRef = useRef(null);

  // Parse text for headings, [slide X] citations, **bold** syntax to make answers rich and readable!
  const renderFormattedText = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      const trimmed = line.trim();

      // Horizontal rule ---
      if (trimmed === '---') {
        return <hr key={lIdx} className="my-2.5 border-slate-200" />;
      }

      // H3 Heading ###
      if (trimmed.startsWith('### ')) {
        const titleContent = trimmed.substring(4);
        return (
          <h3 key={lIdx} className="text-[14px] font-extrabold text-indigo-950 mt-2 mb-1 border-b border-indigo-100 pb-1">
            {renderLineInlineParts(titleContent, text)}
          </h3>
        );
      }

      // H4 Heading ####
      if (trimmed.startsWith('#### ')) {
        const titleContent = trimmed.substring(5);
        return (
          <h4 key={lIdx} className="text-[13px] font-bold text-slate-900 mt-2 mb-0.5">
            {renderLineInlineParts(titleContent, text)}
          </h4>
        );
      }

      return (
        <React.Fragment key={lIdx}>
          {renderLineInlineParts(line, text)}
          {lIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const renderLineInlineParts = (line, fullText) => {
    const parts = line.split(/(\*\*.*?\*\*|\[slide\s*\d+(?:-\d+)?\])/gi);

    return parts.map((part, pIdx) => {
      // Match **bold**
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-bold text-indigo-950">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Match [slide XX] or [slide XX-YY]
      const slideMatch = part.match(/\[slide\s*(\d+)(?:-\d+)?\]/i);
      if (slideMatch && onJumpToSlide) {
        const pageNum = slideMatch[1];
        const dayMatch = (typeof line === 'string' && line.match(/(Day\s*\d{1,2})/i)) || fullText.match(/(Day\s*\d{1,2})/i);
        const dayCode = dayMatch ? dayMatch[1] : null;

        return (
          <button
            key={pIdx}
            onClick={() => onJumpToSlide(pageNum, dayCode)}
            className="text-indigo-600 hover:text-indigo-900 hover:underline font-bold text-[10px] bg-indigo-50 hover:bg-indigo-100/80 px-1 py-0.2 mx-0.5 rounded border border-indigo-200/50 transition-all cursor-pointer"
            title={`Click để tự động chuyển sang ${dayCode || currentDay.code} và mở Slide trang ${pageNum}`}
          >
            [slide {pageNum}]
          </button>
        );
      }

      return part;
    });
  };

  // Initialize welcome message whenever currentDay changes
  useEffect(() => {
    const exampleQs = (currentDay.keyConcepts || [])
      .slice(0, 3)
      .map((c) => `💬 "${c.name} là gì?"`)
      .join('\n');

    setMessages([
      {
        id: `welcome-${currentDay.id}`,
        sender: 'tutor',
        text: `Xin chào! Mình là **VLearn Tutor AI** 🎓 — trợ lý học tập cá nhân hóa của bạn.\n\nMình đã phân tích toàn bộ **${currentDay.pageCount} trang slide** của **${currentDay.code}: ${currentDay.title}**.\n\n**Ví dụ câu hỏi bạn có thể hỏi:**\n${exampleQs}\n💬 "So sánh Augment và Automate?"\n💬 "Slide nào giảng về Hallucination?"\n\nHãy đặt câu hỏi bất kỳ — mình sẽ trích dẫn chính xác slide nguồn! 📌`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: 0.99,
        citations: []
      }
    ]);
  }, [currentDay]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : inputQuestion.trim();
    if (!query) return;

    // User message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsTyping(true);

    try {
      // Call LLM Service for grounded response with Auto-Correct Typos
      const response = await llmService.answerTutorQuestion({
        day: currentDay,
        question: query
      });

      const tutorMsg = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: response.confidence || 0.92,
        citations: response.citations || [currentDay.slideFile],
        typoCorrection: response.typoCorrection || null
      };

      setMessages(prev => [...prev, tutorMsg]);
    } catch (err) {
      console.error('Lỗi VLearn Tutor:', err);
      setMessages(prev => [...prev, {
        id: `tutor-err-${Date.now()}`,
        sender: 'tutor',
        text: `Nội dung bạn đang hỏi liên quan trực tiếp tới bài học **${currentDay.code}: ${currentDay.title}**.\n\n- ${currentDay.summaryContent}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: 0.88,
        citations: [currentDay.slideFile]
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleFeedback = (msgId, type) => {
    setFeedbackState(prev => ({
      ...prev,
      [msgId]: prev[msgId] === type ? null : type
    }));
  };

  const handleResetChat = () => {
    const exampleQs = (currentDay.keyConcepts || [])
      .slice(0, 2)
      .map((c) => `💬 "${c.name} là gì?"`)
      .join('\n');

    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        sender: 'tutor',
        text: `Đã làm mới cuộc hội thoại! 🔄\n\nMình vẫn sẵn sàng hỗ trợ bạn về **${currentDay.code}: ${currentDay.title}**.\n\n**Thử hỏi:**\n${exampleQs}\n💬 "Giải thích slide ${currentDay.keyConcepts?.[0]?.citation || '10'} chi tiết hơn"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: 0.99,
        citations: []
      }
    ]);
  };

  // Extract page number from citation text if available
  const extractSlidePage = (citationText) => {
    const match = citationText.match(/slide\s*(\d+)/i);
    return match ? match[1] : null;
  };

  return (
    <div className="flex flex-col h-full space-y-2 text-[11px] justify-between">
      
      {/* Sleek Context Badge Bar */}
      <div className="flex items-center justify-between bg-indigo-50/70 border border-indigo-100 px-2.5 py-1.5 rounded-lg shrink-0">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <BookOpen size={13} className="text-indigo-600 shrink-0" />
          <span className="truncate font-semibold text-indigo-900 text-[11px]">
            {currentDay.code} • {currentDay.slideFile}
          </span>
        </div>
        <button 
          onClick={handleResetChat}
          className="px-1.5 py-0.5 rounded-md hover:bg-indigo-100 text-indigo-700 transition-colors flex items-center gap-1 text-[10px] font-semibold shrink-0"
          title="Làm mới cuộc trò chuyện"
        >
          <RotateCcw size={10} /> Reset
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 my-0.5">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-0.5`}>
            
            {/* Sender Label */}
            <span className="text-[9px] text-slate-400 font-semibold px-1">
              {msg.sender === 'user' ? 'Bạn' : 'VLearn Tutor AI'} • {msg.timestamp}
            </span>

            {/* Bubble */}
            {msg.sender === 'user' ? (
              <div className="bg-[#0f2b5c] text-white py-1.5 px-2.5 rounded-xl rounded-tr-none text-[11px] max-w-[88%] shadow-3xs font-medium leading-normal">
                {msg.text}
              </div>
            ) : (
              <div className="w-full vlearn-card p-2.5 space-y-2 rounded-xl border border-slate-200 bg-white shadow-3xs">
                
                {/* 💡 THẺ THÔNG BÁO TỰ ĐỘNG SỬA CHÍNH TẢ / GÕ NHẦM */}
                {msg.typoCorrection && (
                  <div className="text-[9px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/90 px-2 py-0.5 rounded-md flex items-center gap-1 animate-fade-in">
                    <span className="shrink-0 font-bold">💡 Đã sửa:</span>
                    <span className="line-through text-slate-400">"{msg.typoCorrection.originalText}"</span>
                    <span>➔</span>
                    <span className="font-extrabold text-amber-900 bg-amber-100 px-1 py-0.2 rounded">"{msg.typoCorrection.correctedText}"</span>
                  </div>
                )}

                {/* Parsed Markdown & Clickable [slide X] Formatted Content */}
                <div className="text-[11px] text-slate-800 leading-normal font-normal">
                  {renderFormattedText(msg.text)}
                </div>

                {/* Citations Badges */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {msg.citations.map((c, idx) => {
                      const pageMatch = c.match(/slide\s*(\d+)/i);
                      const dayMatch = c.match(/(Day\s*\d{1,2})/i);
                      const pageNum = pageMatch ? pageMatch[1] : null;
                      const dayCode = dayMatch ? dayMatch[1] : null;

                      return pageNum && onJumpToSlide ? (
                        <button
                          key={idx}
                          onClick={() => onJumpToSlide(pageNum, dayCode)}
                          className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-800 text-[9px] font-bold border border-indigo-200/50 flex items-center gap-0.5 transition-all cursor-pointer shadow-3xs"
                          title={`Click để tự động chuyển sang ${dayCode || currentDay.code} và mở Slide trang ${pageNum}`}
                        >
                          📍 {c} <ExternalLink size={8} />
                        </button>
                      ) : (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[9px] font-semibold border border-indigo-100/50 flex items-center gap-0.5">
                          📍 {c}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Utility Footer Bar */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    {msg.isFallback ? (
                      <>
                        <div className="w-8 h-1.5 bg-amber-300 rounded-full" />
                        <span className="font-semibold text-amber-600 text-[9px]">⚠️ Không tìm thấy</span>
                      </>
                    ) : (msg.confidenceScore || 0) >= 0.85 ? (
                      <>
                        <div className="w-8 h-1.5 bg-emerald-400 rounded-full" />
                        <span className="font-semibold text-emerald-600 text-[9px]">{Math.round((msg.confidenceScore || 0.95) * 100)}% • Độ tin cậy cao</span>
                      </>
                    ) : (msg.confidenceScore || 0) >= 0.6 ? (
                      <>
                        <div className="w-8 h-1.5 bg-sky-400 rounded-full" />
                        <span className="font-semibold text-sky-600 text-[9px]">{Math.round((msg.confidenceScore || 0.75) * 100)}% • Slide nội bộ</span>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-1.5 bg-slate-300 rounded-full" />
                        <span className="font-semibold text-slate-500 text-[9px]">{Math.round((msg.confidenceScore || 0.5) * 100)}% • Tham khảo</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-slate-400">Hữu ích?</span>
                    <button 
                      onClick={() => toggleFeedback(msg.id, 'up')}
                      className={`p-0.5 rounded border transition-colors ${
                        feedbackState[msg.id] === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                      title="Hữu ích"
                    >
                      <ThumbsUp size={10} />
                    </button>
                    <button 
                      onClick={() => toggleFeedback(msg.id, 'down')}
                      className={`p-0.5 rounded border transition-colors ${
                        feedbackState[msg.id] === 'down' ? 'bg-rose-50 text-rose-600 border-rose-300' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                      title="Chưa hữu ích"
                    >
                      <ThumbsDown size={10} />
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-[10px] text-indigo-600 font-semibold p-2 bg-indigo-50/60 rounded-lg animate-pulse">
            <Bot size={14} />
            <span>VLearn Tutor đang trích dẫn tài liệu...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <div className="pt-1.5 relative shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
          <input 
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder={`Hỏi VLearn Tutor về ${currentDay.code}...`}
            className="w-full py-1.5 pl-3 pr-8 rounded-full border border-slate-300 text-[11px] placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 bg-white shadow-3xs font-medium"
          />
          <button 
            type="submit"
            disabled={!inputQuestion.trim() || isTyping}
            className="absolute right-1 top-2.5 w-5.5 h-5.5 rounded-full bg-[#0f2b5c] text-white flex items-center justify-center hover:bg-[#1b365d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Gửi câu hỏi"
          >
            <Send size={11} className="ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
