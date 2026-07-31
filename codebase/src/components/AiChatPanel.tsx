'use client';

import React, { useState, useRef, useEffect } from 'react';
import { searchSlides, SlideSearchResult } from '../lib/ragEngine';
import { Bot, Send, X, Sparkles, MapPin, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  match?: SlideSearchResult | null;
}

interface AiChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToCitation: (doc: 'd1' | 'd2', page: number) => void;
  onOpenTaModal: (citation: string) => void;
}

export const AiChatPanel: React.FC<AiChatPanelProps> = ({
  isOpen,
  onClose,
  onJumpToCitation,
  onOpenTaModal,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'ai',
      text: 'Chào bạn! Mình là Trợ lý AI VLearn. Bạn có thắc mắc gì về bài giảng Day 01 (Foundation) hoặc Day 02 (Problem Statement)? Bạn có thể đặt câu hỏi để mình tìm chính xác slide trích dẫn nhé!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const match = searchSlides(text);
      let aiMsg: Message;

      if (match) {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: match.takeaway || match.bodyText || match.heading,
          match,
        };
      } else {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: 'Mình chưa tìm thấy nội dung liên quan trực tiếp trong slide Day 01 & Day 02. Bạn có muốn chuyển câu hỏi này cho TA trực ban hỗ trợ không?',
          match: null,
        };
      }

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`fixed top-[56px] right-0 bottom-0 w-[380px] max-w-[92vw] bg-white border-l border-vlearn-border shadow-2xl flex flex-col transition-transform duration-300 z-[200] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-vlearn-border flex justify-between items-center bg-slate-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>Trợ lý AI Slide VLearn</span>
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
            </h3>
            <p className="text-[10px] text-vlearn-muted">Grounding 100% tài liệu Day 1 & Day 2</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested chips */}
      <div className="p-3 bg-blue-50/50 border-b border-blue-100 flex gap-2 overflow-x-auto text-[11px]">
        <button
          onClick={() => {
            setInput('Attention là gì?');
          }}
          className="bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-blue-50 transition shrink-0 font-medium"
        >
          💡 Attention là gì?
        </button>
        <button
          onClick={() => {
            setInput('Kiến trúc MoE vs Dense khác nhau thế nào?');
          }}
          className="bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-blue-50 transition shrink-0 font-medium"
        >
          💡 MoE vs Dense
        </button>
        <button
          onClick={() => {
            setInput('PAIR Automate hay Augment?');
          }}
          className="bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-blue-50 transition shrink-0 font-medium"
        >
          💡 PAIR Automate/Augment
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
              }`}
            >
              {m.match && (
                <div className="font-bold text-blue-700 mb-1 border-b border-blue-100 pb-1">
                  {m.match.heading}
                </div>
              )}
              <div>{m.text}</div>

              {m.match && (
                <button
                  onClick={() => onJumpToCitation(m.match!.doc, m.match!.page)}
                  className="mt-2.5 w-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>📌 [{m.match.citation}] — Nhảy tới slide</span>
                </button>
              )}

              {m.role === 'ai' && !m.match && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">Cần giúp đỡ thêm?</span>
                  <button
                    onClick={() => onOpenTaModal(m.text.slice(0, 30) + '...')}
                    className="bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded text-[11px] font-bold hover:bg-orange-100 transition flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3 text-orange-600" />
                    <span>📩 Chuyển cho TA</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-3 bg-white border border-slate-200 rounded-2xl w-fit text-slate-400">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 border-t border-vlearn-border bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hỏi về nội dung slide..."
          className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition shrink-0 shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
