"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { explainSelection } from "../services/mockApi";
import type { Lecture, TutorAnswer } from "../types";
import { slideContent } from "../data/mockData";
import SelectionTutorPopup from "./SelectionTutorPopup";
import SlideToolbar from "./SlideToolbar";

interface TextItemLike {
  str: string;
  transform: number[];
  width: number;
  fontName: string;
}

export default function SlideViewer({ lecture, page, showDefault, onPageChange, onDocumentLoaded, onDocumentError }: {
  lecture?: Lecture;
  page: number;
  showDefault: boolean;
  onPageChange: (page: number) => void;
  onDocumentLoaded: (id: string, pageCount: number) => void;
  onDocumentError: (id: string) => void;
}) {
  const [zoom, setZoom] = useState(100);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy>();
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfError, setPdfError] = useState<string>();
  const [renderVersion, setRenderVersion] = useState(0);
  const [selection, setSelection] = useState<{ answer?: TutorAnswer; loading: boolean; position: { x: number; y: number } } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const total = lecture?.pageCount ?? pdfDocument?.numPages ?? (showDefault ? 5 : 1);
  const content = slideContent[(page - 1) % slideContent.length];

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => setRenderVersion((version) => version + 1));
    observer.observe(stage);
    return () => observer.disconnect();
  }, [lecture?.id]);

  useEffect(() => {
    if (!lecture?.fileUrl || lecture.fileType !== "pdf" || lecture.status === "uploading" || lecture.status === "error") {
      return;
    }

    let disposed = false;
    let loadedDocument: PDFDocumentProxy | undefined;
    void import("pdfjs-dist").then(async (pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const task = pdfjs.getDocument({ url: lecture.fileUrl });
      task.onProgress = ({ loaded, total: bytesTotal }) => {
        if (!disposed && bytesTotal > 0) setPdfProgress(Math.round((loaded / bytesTotal) * 100));
      };
      try {
        loadedDocument = await task.promise;
        if (disposed) return;
        setPdfDocument(loadedDocument);
        onDocumentLoaded(lecture.id, loadedDocument.numPages);
      } catch {
        if (disposed) return;
        setPdfError("PDF không đọc được. File có thể bị hỏng hoặc được bảo vệ bằng mật khẩu.");
        onDocumentError(lecture.id);
      }
    });

    return () => {
      disposed = true;
      void loadedDocument?.destroy();
    };
  }, [lecture?.fileUrl, lecture?.fileType, lecture?.id, lecture?.status, onDocumentError, onDocumentLoaded]);

  useEffect(() => {
    if (!pdfDocument || !canvasRef.current || !stageRef.current || !textLayerRef.current) return;
    let cancelled = false;
    let renderTask: RenderTask | undefined;

    const renderPage = async () => {
      const pdfPage = await pdfDocument.getPage(page);
      if (cancelled || !canvasRef.current || !stageRef.current || !textLayerRef.current) return;
      const baseViewport = pdfPage.getViewport({ scale: 1 });
      const stageBounds = stageRef.current.getBoundingClientRect();
      const fitScale = Math.min((stageBounds.width - 72) / baseViewport.width, (stageBounds.height - 72) / baseViewport.height);
      const viewport = pdfPage.getViewport({ scale: Math.max(0.25, fitScale) * (zoom / 100) });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      renderTask = pdfPage.render({ canvasContext: context, viewport, transform: pixelRatio === 1 ? undefined : [pixelRatio, 0, 0, pixelRatio, 0, 0] });
      await renderTask.promise;
      if (cancelled) return;

      const textContent = await pdfPage.getTextContent();
      const textLayer = textLayerRef.current;
      textLayer.replaceChildren();
      textLayer.style.width = `${viewport.width}px`;
      textLayer.style.height = `${viewport.height}px`;
      const pdfjs = await import("pdfjs-dist");
      textContent.items.forEach((rawItem) => {
        if (!("str" in rawItem) || !rawItem.str) return;
        const item = rawItem as TextItemLike;
        const transform = pdfjs.Util.transform(viewport.transform, item.transform);
        const fontHeight = Math.hypot(transform[2], transform[3]);
        const angle = Math.atan2(transform[1], transform[0]);
        const span = document.createElement("span");
        span.textContent = item.str;
        span.style.left = `${transform[4]}px`;
        span.style.top = `${transform[5] - fontHeight}px`;
        span.style.fontSize = `${fontHeight}px`;
        span.style.fontFamily = textContent.styles[item.fontName]?.fontFamily ?? "sans-serif";
        span.style.transform = angle ? `rotate(${angle}rad)` : "none";
        textLayer.appendChild(span);
      });
    };

    void renderPage().catch((error: unknown) => {
      if (!cancelled && error instanceof Error && error.name !== "RenderingCancelledException") {
        setPdfError("Không thể hiển thị trang PDF này.");
      }
    });
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdfDocument, page, zoom, renderVersion]);

  const handleSelection = async () => {
    const selectedText = window.getSelection()?.toString().trim() ?? "";
    if (selectedText.length < 3 || !stageRef.current) return;
    const range = window.getSelection()?.rangeCount ? window.getSelection()?.getRangeAt(0) : null;
    const rect = range?.getBoundingClientRect();
    const stageRect = stageRef.current.getBoundingClientRect();
    const position = {
      x: Math.max(16, Math.min((rect?.left ?? stageRect.left) - stageRect.left, stageRect.width - 350)),
      y: Math.max(16, (rect?.bottom ?? stageRect.top) - stageRect.top + 10),
    };
    setSelection({ loading: true, position });
    const answer = await explainSelection(selectedText, page);
    setSelection({ loading: false, answer, position });
  };

  const header = lecture ? (
    <header className="viewer-header"><div><span className="breadcrumb">Bài giảng <b>/</b> {lecture.name}</span><strong>{lecture.name.replace(/\.(pdf|pptx)$/i, "")}</strong></div></header>
  ) : (
    <header className="viewer-header"><div><span className="breadcrumb">Không gian học tập</span><strong>{showDefault ? "Bài giảng mẫu" : "Chưa chọn tài liệu"}</strong></div></header>
  );

  if (!lecture && !showDefault) return <main className="viewer">{header}<div className="empty-viewer"><div><span>▱</span><h2>Chưa có tài liệu đang mở</h2><p>Upload hoặc chọn một tài liệu từ danh sách để bắt đầu.</p></div></div></main>;

  const isPptx = lecture?.fileType === "pptx";
  const isUploading = lecture?.status === "uploading";
  const hasError = lecture?.status === "error" || Boolean(pdfError);
  const isRealPdf = lecture?.fileType === "pdf" && Boolean(lecture.fileUrl);

  return (
    <main className="viewer">
      {header}
      {isPptx ? (
        <div className="conversion-state"><div className="conversion-visual"><span>↻</span></div><h2>PPTX cần được chuyển đổi sang PDF để xem trước</h2><p>File vẫn được giữ trong danh sách. Hãy chuyển đổi sang PDF để đọc trực tiếp trong Slide Viewer.</p></div>
      ) : isUploading || (isRealPdf && !pdfDocument && !pdfError) ? (
        <div className="conversion-state pdf-loading"><div className="conversion-visual"><span>↻</span></div><h2>Đang tải PDF</h2><p>Slide Viewer đang đọc tài liệu và xác định tổng số trang.</p><div className="progress-track"><i style={{ width: `${Math.max(12, pdfProgress)}%` }} /></div><small>{pdfProgress ? `${pdfProgress}%` : "Đang chuẩn bị…"}</small></div>
      ) : hasError ? (
        <div className="conversion-state error-view"><div className="conversion-visual">!</div><h2>Không thể mở PDF</h2><p>{pdfError ?? "PDF không đọc được. File có thể bị hỏng hoặc được bảo vệ bằng mật khẩu."}</p></div>
      ) : (
        <>
          <div className={`slide-stage ${isRealPdf ? "pdf-stage" : ""}`} ref={stageRef} onMouseUp={handleSelection}>
            {isRealPdf ? (
              <div className="pdf-page" style={{ transform: `scale(1)` }}>
                <canvas ref={canvasRef} aria-label={`Trang ${page} của ${lecture?.name}`} />
                <div className="pdf-text-layer" ref={textLayerRef} />
              </div>
            ) : (
              <div className="slide-paper" style={{ transform: `scale(${zoom / 100})` }}>
                <div className="slide-accent" /><div className="slide-number">{String(page).padStart(2, "0")}</div>
                <span className="slide-eyebrow">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.body}</p>
                <div className="slide-note"><span>✦</span>{content.note}</div><footer><strong>VLearn</strong><span>AI Thực Chiến</span></footer>
              </div>
            )}
            {selection && <SelectionTutorPopup {...selection} onNavigate={(targetPage) => { onPageChange(Math.max(1, Math.min(total, targetPage))); setSelection(null); }} onClose={() => setSelection(null)} />}
          </div>
          <SlideToolbar page={page} total={total} zoom={zoom} onPageChange={(nextPage) => onPageChange(Math.max(1, Math.min(total, nextPage || 1)))} onZoomChange={(nextZoom) => setZoom(Math.max(70, Math.min(130, nextZoom)))} />
        </>
      )}
    </main>
  );
}
