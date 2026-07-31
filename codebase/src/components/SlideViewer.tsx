'use client';

import React, { useRef, useEffect } from 'react';
import { SlideItem } from '../data/slidesData';
import { ToolMode } from './PdfToolbar';

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

  // Initialize Canvas Drawing on each slide frame
  useEffect(() => {
    if (!containerRef.current) return;

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
  }, [slides, toolMode, drawColor]);

  // Initialize Text Highlight on mouseup
  useEffect(() => {
    const handleMouseUp = () => {
      if (toolMode !== 'highlight') return;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

      const selectedText = selection.toString().trim();
      if (selectedText.length === 0) return;

      const range = selection.getRangeAt(0);
      let ancestor: Node | null = range.commonAncestorContainer;
      if (ancestor && ancestor.nodeType === 3) ancestor = ancestor.parentNode;

      const slideFrame = (ancestor as HTMLElement)?.closest?.('.slide-frame');
      if (!slideFrame) return;

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
  }, [toolMode, drawColor]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-7 py-8">
      {slides.map((s, idx) => {
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
              <div className="text-xs text-slate-400 font-medium mb-3">
                Trang {page} / {slides.length}
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
      })}
    </div>
  );
};
