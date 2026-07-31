import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function PdfSlideCanvas({ pdfPath, targetPageNum, zoomLevel = 100, onPageChange }) {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pdfDoc, setPdfDoc] = useState(null);

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    const loadPdf = async () => {
      try {
        if (!window.pdfjsLib) {
          await new Promise(r => setTimeout(r, 200));
        }

        if (!window.pdfjsLib) {
          setLoading(false);
          return;
        }

        const pdf = await window.pdfjsLib.getDocument(pdfPath).promise;
        if (isCancelled) return;

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch (err) {
        console.warn('Lỗi tải PDF:', err);
        if (!isCancelled) setLoading(false);
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfPath]);

  // Scroll to target page when targetPageNum changes (e.g. clicking [slide 13])
  useEffect(() => {
    const pageNum = typeof targetPageNum === 'object' ? targetPageNum?.page : targetPageNum;
    if (pageNum && containerRef.current) {
      const pageEl = document.getElementById(`slide-page-${pageNum}`);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [targetPageNum, numPages]);

  return (
    <div className="w-full h-full bg-white relative flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      {loading && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center text-indigo-700 font-bold text-xs gap-2 z-30">
          <Loader2 className="animate-spin text-indigo-600" size={22} />
          <span>Đang nạp toàn bộ Slide bài giảng (Nền trắng tinh 100%)...</span>
        </div>
      )}

      {/* Continuous Vertical Scroll Container */}
      <div 
        ref={containerRef}
        className="flex-1 w-full h-full overflow-y-auto p-4 space-y-5 bg-white flex flex-col items-center custom-scrollbar"
        style={{ backgroundColor: '#ffffff' }}
      >
        {pdfDoc && Array.from({ length: numPages }, (_, i) => i + 1).map((pageNo) => (
          <PdfPageItem 
            key={`${pdfPath}-p${pageNo}`}
            pdfDoc={pdfDoc}
            pageNo={pageNo}
            zoomLevel={zoomLevel}
          />
        ))}
      </div>
    </div>
  );
}

// Single Page Canvas Component rendered smoothly as you scroll
function PdfPageItem({ pdfDoc, pageNo, zoomLevel }) {
  const canvasRef = useRef(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNo);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        const scale = (zoomLevel / 100) * 1.4;
        const viewport = page.getViewport({ scale });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;
        if (!isCancelled) {
          setRendered(true);
        }
      } catch (err) {
        console.warn(`Lỗi render trang ${pageNo}:`, err);
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, pageNo, zoomLevel]);

  return (
    <div 
      id={`slide-page-${pageNo}`}
      className="flex flex-col items-center space-y-1 bg-white p-2 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="text-[10px] font-bold text-slate-400 self-start px-1 uppercase tracking-wider">
        Trang {pageNo}
      </div>
      <canvas 
        ref={canvasRef} 
        className="max-w-full rounded-lg bg-white border border-slate-100"
        style={{ backgroundColor: '#ffffff' }}
      />
    </div>
  );
}
