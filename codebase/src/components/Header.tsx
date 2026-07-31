'use client';

import React from 'react';
import { ArrowLeft, BookOpen, Bot, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentDoc: 'd1' | 'd2';
  onToggleChat: () => void;
  isChatOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentDoc, onToggleChat, isChatOpen }) => {
  return (
    <header className="h-[56px] bg-white border-b border-vlearn-border px-5 flex justify-between items-center z-[100] shadow-sm">
      <div className="flex items-center gap-4">
        <button className="w-8 h-8 rounded-full border border-vlearn-border bg-white flex items-center justify-center text-vlearn-muted hover:bg-slate-50 transition">
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 font-extrabold text-xl tracking-tight">
          <span className="text-red-600">V</span>
          <span className="text-blue-600">Learn</span>
        </div>

        <div className="flex items-center gap-3 border-l border-vlearn-border pl-4">
          <div>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span>{currentDoc === 'd1' ? 'd1-slide-hackathon.pdf' : 'd2-slide-hackathon.pdf'}</span>
              <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full border border-blue-200 font-semibold">
                Active Recall Mode
              </span>
            </div>
            <div className="text-[11px] text-vlearn-muted">
              {currentDoc === 'd1'
                ? 'AI IN ACTION · Day 1 — AI & LLM Foundation'
                : 'AI IN ACTION · Day 2 — Xác định bài toán cho AI'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleChat}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
            isChatOpen
              ? 'bg-blue-600 text-white shadow-blue-200'
              : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Hỏi đáp AI Slide</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        </button>
      </div>
    </header>
  );
};
