'use client';

import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { PdfToolbar, ToolMode } from '@/components/PdfToolbar';
import { SlideViewer } from '@/components/SlideViewer';
import { ActiveRecallQuiz } from '@/components/ActiveRecallQuiz';
import { TraceModal } from '@/components/TraceModal';
import { TaModal } from '@/components/TaModal';
import { AiChatPanel } from '@/components/AiChatPanel';
import { d1Slides, d2Slides } from '@/data/slidesData';

export default function Home() {
  const [currentDoc, setCurrentDoc] = useState<'d1' | 'd2'>('d1');
  const [toolMode, setToolMode] = useState<ToolMode>('read');
  const [drawColor, setDrawColor] = useState<string>('#f43f5e');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Trace Modal state
  const [traceState, setTraceState] = useState<{
    isOpen: boolean;
    qNum: number;
    selectedOptionText: string;
    evalStatus: string;
    citation: string;
  }>({
    isOpen: false,
    qNum: 1,
    selectedOptionText: '',
    evalStatus: '',
    citation: '',
  });

  // TA Modal state
  const [taModalState, setTaModalState] = useState<{
    isOpen: boolean;
    citation: string;
  }>({
    isOpen: false,
    citation: '',
  });

  const scrollViewerRef = useRef<HTMLDivElement>(null);

  const slides = currentDoc === 'd1' ? d1Slides : d2Slides;
  const citationPrefix = currentDoc === 'd1' ? 'T01' : 'T02';
  const docName = currentDoc === 'd1' ? 'd1-slide-hackathon.pdf' : 'd2-slide-hackathon.pdf';

  const handleSwitchDoc = (doc: 'd1' | 'd2') => {
    setCurrentDoc(doc);
    if (scrollViewerRef.current) {
      scrollViewerRef.current.scrollTop = 0;
    }
  };

  const handleScrollToQuiz = () => {
    const el = document.getElementById('activeRecallQuiz');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearAll = () => {
    if (!scrollViewerRef.current) return;
    // Clear canvas drawings
    const canvases = scrollViewerRef.current.querySelectorAll<HTMLCanvasElement>('.draw-canvas');
    canvases.forEach(c => {
      const ctx = c.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, c.width, c.height);
    });

    // Clear highlights
    const highlights = scrollViewerRef.current.querySelectorAll<HTMLElement>('.custom-text-highlight');
    highlights.forEach(mark => {
      mark.querySelector('.hl-actions-badge')?.remove();
      const parent = mark.parentNode;
      if (parent) {
        while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
        parent.removeChild(mark);
      }
    });
  };

  const handleJumpToCitation = (doc: 'd1' | 'd2', page: number) => {
    if (currentDoc !== doc) {
      setCurrentDoc(doc);
    }
    setTimeout(() => {
      const slideId = `${doc}-slide-${page}`;
      const el = document.getElementById(slideId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-blue-500', 'ring-offset-4');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-blue-500', 'ring-offset-4');
        }, 1600);
      }
    }, 150);
  };

  const handleOpenTrace = (qNum: number, selectedOptText: string, evalStatus: string) => {
    const citations: { [key: number]: string } = { 1: '[T01-022]', 2: '[T01-023]', 3: '[T02-014]' };
    setTraceState({
      isOpen: true,
      qNum,
      selectedOptionText: selectedOptText,
      evalStatus,
      citation: citations[qNum] || '[T01-001]',
    });
  };

  const handleOpenTaModal = (citation: string) => {
    setTaModalState({
      isOpen: true,
      citation,
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">
      <Header
        currentDoc={currentDoc}
        onToggleChat={() => setIsChatOpen(prev => !prev)}
        isChatOpen={isChatOpen}
      />

      <div className="flex flex-1 h-[calc(100vh-56px)] relative overflow-hidden">
        <Sidebar currentDoc={currentDoc} onSwitchDoc={handleSwitchDoc} />

        <main className="flex-1 flex flex-col bg-slate-200/60 overflow-hidden relative">
          <PdfToolbar
            toolMode={toolMode}
            setToolMode={setToolMode}
            drawColor={drawColor}
            setDrawColor={setDrawColor}
            onClearAll={handleClearAll}
            onScrollToQuiz={handleScrollToQuiz}
            totalPages={slides.length}
          />

          <div
            ref={scrollViewerRef}
            className="flex-1 overflow-y-auto p-8 flex flex-col items-center gap-8 scroll-smooth"
          >
            <SlideViewer
              slides={slides}
              docKey={currentDoc}
              docName={docName}
              citationPrefix={citationPrefix}
              toolMode={toolMode}
              drawColor={drawColor}
            />

            <ActiveRecallQuiz
              onOpenTrace={handleOpenTrace}
              onOpenTaModal={handleOpenTaModal}
            />
          </div>
        </main>

        <AiChatPanel
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onJumpToCitation={handleJumpToCitation}
          onOpenTaModal={handleOpenTaModal}
        />
      </div>

      <TraceModal
        isOpen={traceState.isOpen}
        onClose={() => setTraceState(prev => ({ ...prev, isOpen: false }))}
        qNum={traceState.qNum}
        selectedOptionText={traceState.selectedOptionText}
        evalStatus={traceState.evalStatus}
        citation={traceState.citation}
      />

      <TaModal
        isOpen={taModalState.isOpen}
        onClose={() => setTaModalState(prev => ({ ...prev, isOpen: false }))}
        citation={taModalState.citation}
      />
    </div>
  );
}
