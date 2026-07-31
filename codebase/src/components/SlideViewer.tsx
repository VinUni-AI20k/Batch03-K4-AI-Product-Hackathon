'use client';

import React, { useRef, useEffect, useState } from 'react';
import { SlideItem } from '../data/slidesData';
import { ToolMode } from './PdfToolbar';
import { FileText, Layers, ExternalLink } from 'lucide-react';

interface SlideViewerProps {
  slides: SlideItem[];
  docKey: 'd1' | 'd2';
  docName: string;
  citationPrefix: string;
  toolMode: ToolMode;
  drawColor: string;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  slides,
  docKey,
  docName,
  citationPrefix,
  toolMode,
  drawColor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'interactive' | 'pdf'>('interactive');

  const pdfUrl = docKey === 'd1'
    ? '/slides/d1-slide-hackathon.pdf'
    : '/slides/d2-slide-hackathon.pdf';

  // Initialize Canvas Drawing on each slide frame
  useEffect(() => {
    if (!containerRef.current || viewMode !== 'interactive') return;

    const frames = containerRef.current.querySelectorAll<HTMLDivElement>('.slide-frame');
    frames.forEach(frame => {
      const canvas = frame.querySelector<HTMLCanvasElement>('.draw-canvas');
      if (!canvas) return;

      canvas.width = frame.offsetWidth || 820;
      canvas.height = frame.offsetHeight || 480;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;

      const getPos = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };
      };

      const startDraw = (e: MouseEvent | TouchEvent) => {
        if (toolMode !== 'pen') return;
        isDrawing = true;
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
      };

      const draw = (e: MouseEvent | TouchEvent) => {
        if (!isDrawing || toolMode !== 'pen') return;
        e.preventDefault();
        const pos = getPos(e);

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();

        lastX = pos.x;
        lastY = pos.y;
      };

      const stopDraw = () => {
        isDrawing = false;
      };

      canvas.onmousedown = startDraw;
      canvas.onmousemove = draw;
      canvas.onmouseup = stopDraw;
      canvas.onmouseleave = stopDraw;

      canvas.ontouchstart = startDraw;
      canvas.ontouchmove = draw;
      canvas.ontouchend = stopDraw;
    });
  }, [toolMode, drawColor, viewMode]);

  // Handle Text Selection Highlighting
  useEffect(() => {
    if (viewMode !== 'interactive') return;

    const handleMouseUp = () => {
      if (toolMode !== 'highlight') return;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      const mark = document.createElement('mark');
      mark.className = 'custom-text-highlight';

      const bgMap: { [key: string]: string } = {
        '#f43f5e': 'rgba(253, 164, 175, 0.7)',
        '#2563eb': 'rgba(147, 197, 253, 0.7)',
        '#f59e0b': 'rgba(253, 224, 71, 0.8)',
        '#10b981': 'rgba(110, 231, 183, 0.7)',
      };
      mark.style.backgroundColor = bgMap[drawColor] || 'rgba(253, 224, 71, 0.8)';
      mark.style.color = '#0f172a';
      mark.style.padding = '2px 4px';
      mark.style.borderRadius = '4px';

      try {
        range.surroundContents(mark);
      } catch {
        const fragment = range.extractContents();
        mark.appendChild(fragment);
        range.insertNode(mark);
      }

      // Add badge controls
      const badge = document.createElement('span');
      badge.className = 'hl-actions-badge';
      badge.innerHTML = `
        <span class="hl-color-btn" style="background: #f59e0b;" title="Vàng"></span>
        <span class="hl-color-btn" style="background: #f43f5e;" title="Đỏ"></span>
        <span class="hl-color-btn" style="background: #2563eb;" title="Xanh"></span>
        <span class="hl-color-btn" style="background: #10b981;" title="Lục"></span>
        <span class="hl-delete-btn" title="Xóa Highlight">✕</span>
      `;

      // Event handlers for color change and delete
      const colorBtns = badge.querySelectorAll('.hl-color-btn');
      colorBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetColor = (btn as HTMLElement).style.backgroundColor;
          mark.style.backgroundColor = targetColor;
        });
      });

      const deleteBtn = badge.querySelector('.hl-delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          badge.remove();
          const parent = mark.parentNode;
          if (parent) {
            while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
            parent.removeChild(mark);
          }
        });
      }

      mark.appendChild(badge);
      selection.removeAllRanges();
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [toolMode, drawColor, viewMode]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-6 py-6 w-full">
      {/* MODE SWITCHER BANNER */}
      <div className="w-[820px] bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span className="text-slate-400">Chế độ hiển thị slide:</span>
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold font-mono">
            {docName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('interactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'interactive'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>📝 Card Slide Tương Tác</span>
          </button>

          <button
            onClick={() => setViewMode('pdf')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'pdf'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📄 Trình Xem PDF Gốc</span>
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-blue-600 transition"
            title="Mở PDF ở tab mới"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* VIEW MODE 1: ORIGINAL EMBEDDED PDF VIEWER */}
      {viewMode === 'pdf' ? (
        <div className="w-[820px] h-[780px] bg-white border border-slate-300 rounded-2xl shadow-lg overflow-hidden relative">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            className="w-full h-full border-none"
            title={`PDF Viewer - ${docName}`}
          />
        </div>
      ) : (
        /* VIEW MODE 2: INTERACTIVE SLIDE CARDS (WITH CANVAS, HIGHLIGHTS, QUIZ) */
        slides.map((s, idx) => {
          const page = idx + 1;
          const citation = `${citationPrefix}-${String(page).padStart(3, '0')}`;
          const slideId = `${docKey}-slide-${page}`;

          return (
            <div
              key={slideId}
              id={slideId}
              className="slide-frame w-[820px] min-h-[480px] bg-[#fffdf9] border border-[#f1e9db] rounded-2xl shadow-md p-10 flex flex-col justify-between relative transition-shadow hover:shadow-lg"
            >
              <canvas
                className="draw-canvas absolute top-0 left-0 w-full h-full rounded-2xl z-0"
                style={{ pointerEvents: toolMode === 'pen' ? 'auto' : 'none' }}
              />

              <div className="watermark absolute top-4 right-6 text-[11px] font-mono text-slate-300 pointer-events-none select-none">
                {docName}
              </div>

              <div className="relative z-10">
                <div className="text-xs text-slate-400 font-medium mb-3 flex items-center justify-between">
                  <span>Trang {page} / {slides.length}</span>
                  <a
                    href={`${pdfUrl}#page=${page}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Mở PDF trang này</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h3 className="text-[26px] font-extrabold text-slate-900 leading-snug">
                  {s.heading}
                </h3>

                {s.subheading && (
                  <div className="text-base text-blue-600 font-semibold mt-1.5">
                    {s.subheading}
                  </div>
                )}

                {s.body && s.body.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 mt-5 text-sm leading-relaxed text-slate-700 shadow-2xs">
                    <ul className="list-disc pl-5 space-y-2">
                      {s.body.map((item, bIdx) => (
                        <li key={bIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {s.heading.toLowerCase().includes('attention') && (
                  <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 mt-4 text-xs text-slate-800">
                    <div className="font-semibold text-slate-900">
                      Minh họa Khái niệm: <em>&quot;Lan bỏ quyển sách vào túi vì <strong className="text-rose-600 font-bold">nó</strong> quá dày&quot;</em>
                    </div>
                    <div className="flex gap-2 justify-center mt-3 flex-wrap font-mono">
                      <span className="bg-white border border-slate-200 px-2.5 py-1 rounded text-slate-700">Lan</span>
                      <span className="bg-white border border-slate-200 px-2.5 py-1 rounded text-slate-700">bỏ</span>
                      <span className="bg-blue-100 text-blue-800 font-bold border border-blue-300 px-2.5 py-1 rounded">quyển (0.28)</span>
                      <span className="bg-blue-100 text-blue-800 font-bold border border-blue-300 px-2.5 py-1 rounded">sách (0.32)</span>
                      <span className="bg-white border border-slate-200 px-2.5 py-1 rounded text-slate-700">vào</span>
                      <span className="bg-white border border-slate-200 px-2.5 py-1 rounded text-slate-700">túi (0.09)</span>
                      <span className="bg-white border border-slate-200 px-2.5 py-1 rounded text-slate-700">vì</span>
                      <span className="bg-rose-100 text-rose-800 font-bold border border-rose-300 px-2.5 py-1 rounded">nó</span>
                      <span className="bg-white border border-slate-200 px-2.5 py-1 rounded text-slate-700">quá</span>
                      <span className="bg-white border border-slate-200 px-2.5 py-1 rounded text-slate-700">dày</span>
                    </div>
                    <div className="text-[11px] text-sky-800 font-medium text-center mt-2.5">
                      👉 Trọng số Attention mạnh nhất hướng về <strong>&quot;quyển sách&quot;</strong> (0.32) thay vì &quot;cái túi&quot; (0.09).
                    </div>
                  </div>
                )}

                {s.takeaway && (
                  <div className="bg-blue-50 border-l-4 border-blue-600 text-blue-800 font-semibold text-xs p-3.5 rounded-r-lg mt-4 leading-relaxed">
                    💡 Takeaway: {s.takeaway}
                  </div>
                )}

                {s.source && (
                  <div className="text-[11px] text-slate-400 italic mt-2.5">
                    Nguồn: {s.source}
                  </div>
                )}
              </div>

              <div className="relative z-10 text-[11px] text-slate-400 font-mono mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span>Mã đoạn trích dẫn: <strong className="text-slate-600">[{citation}]</strong></span>
                <span className="text-[10px] text-slate-300">VLearn Active Recall Engine</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
