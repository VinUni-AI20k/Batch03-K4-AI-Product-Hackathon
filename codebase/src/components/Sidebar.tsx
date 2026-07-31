'use client';

import React from 'react';
import { BookOpen, ChevronRight, FileText } from 'lucide-react';

interface SidebarProps {
  currentDoc: 'd1' | 'd2';
  onSwitchDoc: (doc: 'd1' | 'd2') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentDoc, onSwitchDoc }) => {
  return (
    <aside className="w-[300px] bg-slate-50 border-r border-vlearn-border flex flex-col p-4 gap-4 overflow-y-auto flex-shrink-0">
      <div>
        <h2 className="text-sm font-bold text-slate-800">Tài liệu bài giảng</h2>
        <p className="text-[11px] text-vlearn-muted mt-0.5">Khóa học AI Thực Chiến — VLearn</p>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">Khóa AI Thực Chiến</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
        </div>

        <div className="p-2 flex flex-col gap-1.5">
          <button
            onClick={() => onSwitchDoc('d1')}
            className={`w-full p-2.5 rounded-lg text-xs flex items-center justify-between transition text-left ${
              currentDoc === 'd1'
                ? 'bg-blue-50 border border-blue-200 text-blue-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 shrink-0 text-blue-500" />
              <span className="truncate">Day 01 — AI & LLM Foundation</span>
            </div>
            {currentDoc === 'd1' && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                Đang học
              </span>
            )}
          </button>

          <button
            onClick={() => onSwitchDoc('d2')}
            className={`w-full p-2.5 rounded-lg text-xs flex items-center justify-between transition text-left ${
              currentDoc === 'd2'
                ? 'bg-blue-50 border border-blue-200 text-blue-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 shrink-0 text-indigo-500" />
              <span className="truncate">Day 02 — Bài toán cho AI</span>
            </div>
            {currentDoc === 'd2' && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                Đang học
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
