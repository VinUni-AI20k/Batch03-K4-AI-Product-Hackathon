'use client';

import React from 'react';
import { Eye, Edit3, Highlighter, Trash2, HelpCircle } from 'lucide-react';

export type ToolMode = 'read' | 'pen' | 'highlight';

interface PdfToolbarProps {
  toolMode: ToolMode;
  setToolMode: (mode: ToolMode) => void;
  drawColor: string;
  setDrawColor: (color: string) => void;
  onClearAll: () => void;
  onScrollToQuiz: () => void;
  totalPages: number;
}

export const PdfToolbar: React.FC<PdfToolbarProps> = ({
  toolMode,
  setToolMode,
  drawColor,
  setDrawColor,
  onClearAll,
  onScrollToQuiz,
  totalPages,
}) => {
  const colors = [
    { hex: '#f43f5e', label: 'Đỏ' },
    { hex: '#2563eb', label: 'Xanh' },
    { hex: '#f59e0b', label: 'Vàng' },
    { hex: '#10b981', label: 'Lục' },
  ];

  return (
    <div className="h-12 bg-white border-b border-vlearn-border flex justify-between items-center px-6 shadow-xs z-10">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setToolMode('read')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
            toolMode === 'read'
              ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-2xs'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Đọc</span>
        </button>

        <button
          onClick={() => setToolMode('pen')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
            toolMode === 'pen'
              ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-2xs'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Bút vẽ Slide</span>
        </button>

        <button
          onClick={() => setToolMode('highlight')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
            toolMode === 'highlight'
              ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-2xs'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Highlighter className="w-3.5 h-3.5" />
          <span>Highlight Văn bản</span>
        </button>

        {toolMode !== 'read' && (
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 ml-2">
            {colors.map(c => (
              <span
                key={c.hex}
                onClick={() => setDrawColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-4 h-4 rounded-full cursor-pointer transition-transform hover:scale-125 ${
                  drawColor === c.hex ? 'ring-2 ring-slate-800 scale-110' : ''
                }`}
                title={`Màu ${c.label}`}
              />
            ))}
          </div>
        )}

        <button
          onClick={onClearAll}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition flex items-center gap-1 ml-2"
          title="Xóa tất cả nét vẽ & Highlight"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-vlearn-muted font-medium">
          Tổng số: <strong className="text-slate-800">{totalPages} trang</strong>
        </span>

        <button
          onClick={onScrollToQuiz}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg hover:brightness-110 transition flex items-center gap-1.5 shadow-xs"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Làm Quiz Active Recall 🚀</span>
        </button>
      </div>
    </div>
  );
};
