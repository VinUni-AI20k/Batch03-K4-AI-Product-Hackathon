import { useCallback, useEffect, useRef, useState } from 'react'
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import 'pdfjs-dist/web/pdf_viewer.css'

import type { Highlight, NormalizedRect } from '../types'
import { Icon } from './Icon'
import { PdfPage } from './PdfPage'

GlobalWorkerOptions.workerSrc = workerUrl

const ZOOM_STEPS = [0.5, 0.6, 0.75, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2, 2.5]
const DEFAULT_SIZE = { width: 612, height: 792 }

interface Props {
  fileUrl: string
  pageCount: number
  page: number
  onPageChange: (page: number) => void
  highlights: Highlight[]
  onAddHighlight: (page: number, text: string, rects: NormalizedRect[]) => void
  onAddScreenshot: (page: number, dataUrl: string) => void
}

export function PdfViewer({
  fileUrl,
  pageCount,
  page,
  onPageChange,
  highlights,
  onAddHighlight,
  onAddScreenshot,
}: Props) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [scale, setScale] = useState(1)
  const [baseSize, setBaseSize] = useState(DEFAULT_SIZE)
  const [error, setError] = useState<string | null>(null)
  const [cropMode, setCropMode] = useState(false)
  const [pageInput, setPageInput] = useState(String(page))

  const scrollRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  // Set while we scroll programmatically, so the scroll handler does not fight
  // the jump it just triggered.
  const suppressScrollSync = useRef(false)
  const reportedPage = useRef(page)

  useEffect(() => setPageInput(String(page)), [page])

  /* --- load the document ------------------------------------------- */
  useEffect(() => {
    let disposed = false
    setPdf(null)
    setError(null)

    const task = getDocument({ url: fileUrl })
    task.promise.then(
      async (loaded) => {
        if (disposed) {
          loaded.destroy()
          return
        }
        // One page is enough to size every placeholder; each page corrects
        // itself once it actually renders.
        try {
          const first = await loaded.getPage(1)
          const viewport = first.getViewport({ scale: 1 })
          if (!disposed) setBaseSize({ width: viewport.width, height: viewport.height })

          // Fit the page to the available width on open.
          const available = (scrollRef.current?.clientWidth ?? 0) - 48
          if (available > 100) {
            const fitted = Math.min(1.75, Math.max(0.5, available / viewport.width))
            const nearest = ZOOM_STEPS.reduce((best, step) =>
              Math.abs(step - fitted) < Math.abs(best - fitted) ? step : best,
            )
            if (!disposed) setScale(nearest)
          }
        } catch {
          /* fall back to the default placeholder size */
        }
        if (!disposed) setPdf(loaded)
      },
      (err: Error) => {
        if (!disposed) setError(`Could not open the PDF: ${err.message}`)
      },
    )
    return () => {
      disposed = true
      task.destroy().catch(() => undefined)
    }
  }, [fileUrl])

  const registerPage = useCallback((pageNumber: number, element: HTMLDivElement | null) => {
    if (element) pageRefs.current.set(pageNumber, element)
    else pageRefs.current.delete(pageNumber)
  }, [])

  /* --- scroll position -> current page ------------------------------ */
  const handleScroll = useCallback(() => {
    if (suppressScrollSync.current) return
    const container = scrollRef.current
    if (!container) return

    // The page occupying the upper third of the viewport is "current".
    const marker = container.scrollTop + container.clientHeight * 0.3
    let current = 1
    for (const [pageNumber, element] of pageRefs.current) {
      if (element.offsetTop <= marker && pageNumber > current) current = pageNumber
    }
    if (current !== reportedPage.current) {
      reportedPage.current = current
      onPageChange(current)
    }
  }, [onPageChange])

  /* --- current page -> scroll position (citations, page box) -------- */
  const scrollToPage = useCallback((target: number) => {
    const container = scrollRef.current
    const element = pageRefs.current.get(target)
    if (!container || !element) return
    suppressScrollSync.current = true
    reportedPage.current = target
    container.scrollTo({ top: element.offsetTop - 16, behavior: 'smooth' })
    window.setTimeout(() => {
      suppressScrollSync.current = false
    }, 700)
  }, [])

  useEffect(() => {
    if (page !== reportedPage.current) scrollToPage(page)
  }, [page, scrollToPage])

  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(1, next), pageCount)
    reportedPage.current = clamped
    onPageChange(clamped)
    scrollToPage(clamped)
  }

  const zoomBy = (direction: 1 | -1) => {
    const index = ZOOM_STEPS.indexOf(scale)
    const nearest = index >= 0 ? index : ZOOM_STEPS.findIndex((step) => step >= scale)
    const next = Math.min(Math.max(0, nearest + direction), ZOOM_STEPS.length - 1)
    setScale(ZOOM_STEPS[next])
  }

  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <section className="viewer">
      <div className="viewer-toolbar">
        <div className="toolbar-group">
          <button className="btn-icon" onClick={() => goTo(page - 1)} disabled={page <= 1} title="Previous page">
            <Icon name="chevron-left" />
          </button>
          <input
            className="page-input"
            value={pageInput}
            onChange={(event) => setPageInput(event.target.value.replace(/\D/g, ''))}
            onBlur={() => goTo(Number(pageInput) || page)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') (event.target as HTMLInputElement).blur()
            }}
            aria-label="Page number"
          />
          <span className="page-total">/ {pageCount}</span>
          <button
            className="btn-icon"
            onClick={() => goTo(page + 1)}
            disabled={page >= pageCount}
            title="Next page"
          >
            <Icon name="chevron-right" />
          </button>
        </div>

        <div className="toolbar-sep" />

        <div className="toolbar-group">
          <button className="btn-icon" onClick={() => zoomBy(-1)} disabled={scale <= ZOOM_STEPS[0]} title="Zoom out">
            <Icon name="minus" />
          </button>
          <span className="zoom-label">{Math.round(scale * 100)}%</span>
          <button
            className="btn-icon"
            onClick={() => zoomBy(1)}
            disabled={scale >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
            title="Zoom in"
          >
            <Icon name="plus" />
          </button>
        </div>

        <div className="toolbar-sep" />

        <button
          className={`btn ${cropMode ? 'btn-primary' : ''}`}
          onClick={() => setCropMode((on) => !on)}
          title="Drag a box on any page to capture it"
        >
          <Icon name="crop" />
          {cropMode ? 'Done capturing' : 'Capture area'}
        </button>

        <span className="toolbar-hint">
          {cropMode ? 'Drag a box over any page' : 'Select text to add it to your question'}
        </span>
      </div>

      {error && <div className="banner banner-error">{error}</div>}

      <div className="viewer-scroll" ref={scrollRef} onScroll={handleScroll}>
        <div className="pages-column">
          {pdf ? (
            pageNumbers.map((pageNumber) => (
              <PdfPage
                key={pageNumber}
                pdf={pdf}
                pageNumber={pageNumber}
                scale={scale}
                fallbackSize={baseSize}
                cropMode={cropMode}
                highlights={highlights.filter((highlight) => highlight.page === pageNumber)}
                onAddHighlight={onAddHighlight}
                onAddScreenshot={onAddScreenshot}
                onRegister={registerPage}
              />
            ))
          ) : (
            !error && (
              <div className="page-slot">
                <div
                  className="page-stage"
                  style={{ width: baseSize.width * scale, height: baseSize.height * scale }}
                >
                  <div className="page-loading">
                    <div className="spinner" />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
