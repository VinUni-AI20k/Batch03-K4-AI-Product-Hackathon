import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Icon } from "./Icons";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function ToolButton({ children, title, onClick, disabled = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] px-2.5 text-[11px] font-medium text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
    >
      {children}
    </button>
  );
}

export default function SlideViewer({
  deck,
  decks,
  pageNumber,
  totalPages,
  onDeckChange,
  onPageChange,
  onDocumentLoad,
  onPageText,
  onUpload,
  isUploading,
  uploadError,
  onAskSelection
}) {
  const contentRef = useRef(null);
  const uploadInputRef = useRef(null);
  const pageRefs = useRef(new Map());
  const pageTexts = useRef(new Map());
  const intersectionRatios = useRef(new Map());
  const lastObservedPage = useRef(1);
  const [selection, setSelection] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(820);
  const [documentPages, setDocumentPages] = useState(totalPages);
  const [pdfError, setPdfError] = useState("");

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return undefined;

    const updateWidth = () => {
      setViewportWidth(Math.max(520, Math.min(container.clientWidth - 72, 980)));
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setSelection(null);
    setPdfError("");
    setDocumentPages(totalPages);
    setRotation(0);
    pageRefs.current.clear();
    pageTexts.current.clear();
    intersectionRatios.current.clear();
    lastObservedPage.current = 1;
    window.getSelection()?.removeAllRanges();
  }, [deck.id, totalPages]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root || documentPages < 1) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const page = Number(entry.target.dataset.pdfPage);
          intersectionRatios.current.set(
            page,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        });

        const visible = [...intersectionRatios.current.entries()].sort(
          (a, b) => b[1] - a[1]
        )[0];
        if (!visible || visible[1] < 0.12) return;

        const visiblePage = visible[0];
        if (lastObservedPage.current !== visiblePage) {
          lastObservedPage.current = visiblePage;
          onPageChange(visiblePage);
          onPageText(pageTexts.current.get(visiblePage) || "");
        }
      },
      {
        root,
        rootMargin: "-12% 0px -52% 0px",
        threshold: [0.12, 0.3, 0.55, 0.8]
      }
    );

    pageRefs.current.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [deck.id, documentPages, onPageChange, onPageText]);

  useEffect(() => {
    if (lastObservedPage.current === pageNumber) return;
    const pageElement = pageRefs.current.get(pageNumber);
    if (pageElement) {
      lastObservedPage.current = pageNumber;
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      onPageText(pageTexts.current.get(pageNumber) || "");
    }
  }, [pageNumber, onPageText]);

  function handleDocumentLoad({ numPages }) {
    setDocumentPages(numPages);
    onDocumentLoad(numPages);
  }

  async function handlePageLoad(page, loadedPageNumber) {
    try {
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      pageTexts.current.set(loadedPageNumber, text);
      if (loadedPageNumber === lastObservedPage.current) {
        onPageText(text);
      }
    } catch {
      pageTexts.current.set(loadedPageNumber, "");
    }
  }

  function handleSelection() {
    const selected = window.getSelection();
    const text = selected?.toString().replace(/\s+/g, " ").trim();
    if (!text || !selected.rangeCount || !contentRef.current) {
      setSelection(null);
      return;
    }

    const range = selected.getRangeAt(0);
    if (!contentRef.current.contains(range.commonAncestorContainer)) {
      setSelection(null);
      return;
    }

    const rect = range.getBoundingClientRect();
    const parentRect = contentRef.current.getBoundingClientRect();
    setSelection({
      text: text.slice(0, 1200),
      left: Math.min(
        Math.max(rect.left - parentRect.left + rect.width / 2, 105),
        parentRect.width - 105
      ),
      top: rect.top - parentRect.top + contentRef.current.scrollTop - 52
    });
  }

  function jumpToPage(value) {
    const target = Math.min(
      documentPages,
      Math.max(1, Number.parseInt(value, 10) || 1)
    );
    onPageChange(target);
    const element = pageRefs.current.get(target);
    if (element) {
      lastObservedPage.current = target;
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      onPageText(pageTexts.current.get(target) || "");
    }
  }

  function requestFullscreen() {
    contentRef.current?.requestFullscreen?.();
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-[#0B0F1A] p-5">
      <div className="mb-3 flex min-h-11 items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#111722] px-3 py-2 shadow-lg shadow-black/10">
        <div className="flex min-w-0 items-center gap-2">
          <select
            value={deck.id}
            onChange={(event) => onDeckChange(event.target.value)}
            className="h-8 max-w-[220px] rounded-lg border border-white/10 bg-[#171E2C] px-3 text-xs font-semibold text-slate-200 outline-none focus:border-blue-500/45"
            aria-label="Chọn tài liệu PDF"
          >
            {decks.map((item) => (
              <option key={item.id} value={item.id}>
                {item.uploaded ? "Đã tải lên · " : ""}
                {item.shortTitle}
              </option>
            ))}
          </select>

          <input
            ref={uploadInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUpload(file);
              event.target.value = "";
            }}
          />
          <ToolButton
            title="Tải tài liệu PDF lên"
            disabled={isUploading}
            onClick={() => uploadInputRef.current?.click()}
          >
            {isUploading ? "Đang tải…" : "＋ Tải PDF"}
          </ToolButton>

          <span className="hidden truncate text-[11px] text-slate-500 2xl:inline">
            {deck.title}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <label className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.025] px-2 text-[11px] text-slate-500">
            Trang
            <input
              key={`${deck.id}-${pageNumber}`}
              type="number"
              min="1"
              max={documentPages}
              defaultValue={pageNumber}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  jumpToPage(event.currentTarget.value);
                  event.currentTarget.blur();
                }
              }}
              onBlur={(event) => jumpToPage(event.currentTarget.value)}
              className="w-10 bg-transparent text-center font-semibold text-slate-200 outline-none"
            />
            <span>/ {documentPages}</span>
          </label>

          <ToolButton
            title="Thu nhỏ"
            onClick={() => setZoom((value) => Math.max(60, value - 10))}
          >
            <Icon name="zoomOut" className="h-4 w-4" />
          </ToolButton>
          <button
            type="button"
            title="Đặt lại mức thu phóng"
            onClick={() => setZoom(100)}
            className="h-8 min-w-12 rounded-lg text-[11px] font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            {zoom}%
          </button>
          <ToolButton
            title="Phóng to"
            onClick={() => setZoom((value) => Math.min(180, value + 10))}
          >
            <Icon name="zoomIn" className="h-4 w-4" />
          </ToolButton>
          <ToolButton title="Vừa chiều rộng" onClick={() => setZoom(100)}>
            Vừa trang
          </ToolButton>
          <ToolButton
            title="Xoay tài liệu"
            onClick={() => setRotation((value) => (value + 90) % 360)}
          >
            Xoay
          </ToolButton>
          <a
            href={deck.pdfUrl}
            download
            title="Tải PDF xuống"
            className="flex h-8 items-center rounded-lg border border-white/[0.08] bg-white/[0.025] px-2.5 text-[11px] font-medium text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white"
          >
            Tải xuống
          </a>
          <ToolButton title="Toàn màn hình" onClick={requestFullscreen}>
            Toàn màn hình
          </ToolButton>
        </div>
      </div>

      {uploadError && (
        <div className="mb-3 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {uploadError}
        </div>
      )}

      <div
        ref={contentRef}
        onMouseUp={handleSelection}
        className="slide-selection relative min-h-0 flex-1 overflow-auto rounded-2xl border border-white/[0.075] bg-[#121824] shadow-panel"
      >
        {selection && (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onAskSelection(selection.text);
              setSelection(null);
              window.getSelection()?.removeAllRanges();
            }}
            className="absolute z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-3.5 py-2 text-xs font-semibold text-white shadow-xl shadow-fuchsia-950/40 transition hover:scale-[1.03]"
            style={{ left: selection.left, top: Math.max(selection.top, 10) }}
          >
            <Icon name="sparkles" className="h-4 w-4" />
            Hỏi AI Tutor
          </button>
        )}

        <Document
          key={deck.id}
          file={deck.pdfUrl}
          onLoadSuccess={handleDocumentLoad}
          loading={
            <div className="grid min-h-[560px] place-items-center text-sm text-slate-500">
              Đang mở {deck.shortTitle}…
            </div>
          }
          error={
            <div className="grid min-h-[560px] place-items-center text-sm text-red-300">
              {pdfError || "Không thể hiển thị tài liệu PDF."}
            </div>
          }
          onLoadError={(error) => setPdfError(error.message)}
          className="flex min-w-max flex-col items-center gap-6 px-8 py-7"
        >
          {Array.from({ length: documentPages }, (_, index) => {
            const page = index + 1;
            return (
              <section
                key={`${deck.id}-${page}`}
                ref={(element) => {
                  if (element) pageRefs.current.set(page, element);
                  else pageRefs.current.delete(page);
                }}
                data-pdf-page={page}
                className="scroll-mt-5"
              >
                <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                  {deck.shortTitle} · Trang {page}
                </p>
                <Page
                  pageNumber={page}
                  width={viewportWidth * (zoom / 100)}
                  rotate={rotation}
                  renderTextLayer
                  renderAnnotationLayer
                  onLoadSuccess={(pdfPage) => handlePageLoad(pdfPage, page)}
                  loading={
                    <div
                      className="grid place-items-center rounded-md bg-white/5 text-xs text-slate-500"
                      style={{
                        width: viewportWidth,
                        minHeight: Math.round(viewportWidth * 0.56)
                      }}
                    >
                      Đang tải trang {page}…
                    </div>
                  }
                  className="overflow-hidden rounded-md bg-white shadow-2xl shadow-black/45"
                />
              </section>
            );
          })}
        </Document>
      </div>

      <p className="pt-3 text-center text-[11px] text-slate-500">
        Cuộn xuống để xem các trang tiếp theo · Bôi đen nội dung để hỏi AI Tutor
      </p>
    </main>
  );
}
