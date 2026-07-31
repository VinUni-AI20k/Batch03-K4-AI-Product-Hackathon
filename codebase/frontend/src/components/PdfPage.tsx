import { useCallback, useEffect, useRef, useState } from 'react'
import { TextLayer, type PDFDocumentProxy, type RenderTask } from 'pdfjs-dist'

import type { Highlight, NormalizedRect } from '../types'

const CROP_MAX_WIDTH = 1400

/** Render pages a screenful or two ahead of the viewport, not the whole file. */
const PRERENDER_MARGIN = '1200px 0px'

interface Size {
  width: number
  height: number
}

interface DragBox {
  x0: number
  y0: number
  x1: number
  y1: number
}

interface Props {
  pdf: PDFDocumentProxy
  pageNumber: number
  scale: number
  /** Unscaled size used for the placeholder before this page has rendered. */
  fallbackSize: Size
  cropMode: boolean
  highlights: Highlight[]
  onAddHighlight: (page: number, text: string, rects: NormalizedRect[]) => void
  onAddScreenshot: (page: number, dataUrl: string) => void
  onRegister: (page: number, element: HTMLDivElement | null) => void
}

export function PdfPage({
  pdf,
  pageNumber,
  scale,
  fallbackSize,
  cropMode,
  highlights,
  onAddHighlight,
  onAddScreenshot,
  onRegister,
}: Props) {
  const [visible, setVisible] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [size, setSize] = useState<Size>(fallbackSize)
  const [drag, setDrag] = useState<DragBox | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textLayerRef = useRef<HTMLDivElement>(null)
  const renderTaskRef = useRef<RenderTask | null>(null)

  useEffect(() => {
    onRegister(pageNumber, wrapperRef.current)
    return () => onRegister(pageNumber, null)
  }, [pageNumber, onRegister])

  // Only pages near the viewport get rendered; the rest hold their space.
  useEffect(() => {
    const element = wrapperRef.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setVisible(true)
      },
      { root: element.closest('.viewer-scroll'), rootMargin: PRERENDER_MARGIN },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    let disposed = false
    let textLayer: TextLayer | null = null
    setRendered(false)

    ;(async () => {
      try {
        // A previous render must be fully unwound before the next one touches
        // the same canvas, or pdf.js rejects it.
        const previous = renderTaskRef.current
        if (previous) {
          previous.cancel()
          await previous.promise.catch(() => undefined)
          renderTaskRef.current = null
        }

        const page = await pdf.getPage(pageNumber)
        if (disposed) return

        const canvas = canvasRef.current
        const stage = stageRef.current
        const textContainer = textLayerRef.current
        if (!canvas || !stage || !textContainer) return

        // Render at device resolution, lay out at CSS resolution — otherwise
        // text is blurry on high-DPI screens and crops come out soft.
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const viewport = page.getViewport({ scale })
        const renderViewport = page.getViewport({ scale: scale * dpr })

        const unscaled = { width: viewport.width / scale, height: viewport.height / scale }
        setSize((previousSize) =>
          previousSize.width === unscaled.width && previousSize.height === unscaled.height
            ? previousSize
            : unscaled,
        )

        canvas.width = Math.floor(renderViewport.width)
        canvas.height = Math.floor(renderViewport.height)
        canvas.style.width = `${Math.floor(viewport.width)}px`
        canvas.style.height = `${Math.floor(viewport.height)}px`
        stage.style.setProperty('--total-scale-factor', String(scale))
        stage.style.setProperty('--scale-round-x', '1px')
        stage.style.setProperty('--scale-round-y', '1px')

        const renderTask = page.render({ canvas, viewport: renderViewport })
        renderTaskRef.current = renderTask
        await renderTask.promise
        if (disposed) return

        textContainer.replaceChildren()
        textLayer = new TextLayer({
          textContentSource: page.streamTextContent(),
          container: textContainer,
          viewport,
        })
        await textLayer.render()
        if (!disposed) setRendered(true)
      } catch (error) {
        // A cancelled render is the normal result of scrolling or zooming fast.
        if ((error as Error)?.name !== 'RenderingCancelledException') {
          console.error(`Page ${pageNumber} failed to render`, error)
        }
      }
    })()

    return () => {
      disposed = true
      renderTaskRef.current?.cancel()
      textLayer?.cancel()
    }
  }, [pdf, pageNumber, scale, visible])

  const captureSelection = useCallback(() => {
    if (cropMode) return
    const selection = window.getSelection()
    const stage = stageRef.current
    if (!selection || selection.isCollapsed || !stage) return

    const text = selection.toString().trim()
    if (text.length < 2) return
    // Ignore selections that started or ended on a different page.
    if (!stage.contains(selection.anchorNode) || !stage.contains(selection.focusNode)) return

    const stageBox = stage.getBoundingClientRect()
    const rects: NormalizedRect[] = []
    for (let i = 0; i < selection.rangeCount; i += 1) {
      for (const rect of Array.from(selection.getRangeAt(i).getClientRects())) {
        if (rect.width < 1 || rect.height < 1) continue
        rects.push({
          x: (rect.left - stageBox.left) / stageBox.width,
          y: (rect.top - stageBox.top) / stageBox.height,
          w: rect.width / stageBox.width,
          h: rect.height / stageBox.height,
        })
      }
    }

    onAddHighlight(pageNumber, text, rects)
    selection.removeAllRanges()
  }, [cropMode, onAddHighlight, pageNumber])

  const pointToStage = (event: React.MouseEvent) => {
    const box = stageRef.current!.getBoundingClientRect()
    return {
      x: Math.min(Math.max(0, (event.clientX - box.left) / box.width), 1),
      y: Math.min(Math.max(0, (event.clientY - box.top) / box.height), 1),
    }
  }

  const handleCropStart = (event: React.MouseEvent) => {
    if (event.button !== 0) return
    const point = pointToStage(event)
    setDrag({ x0: point.x, y0: point.y, x1: point.x, y1: point.y })
  }

  const handleCropMove = (event: React.MouseEvent) => {
    if (!drag) return
    const point = pointToStage(event)
    setDrag({ ...drag, x1: point.x, y1: point.y })
  }

  const handleCropEnd = () => {
    const canvas = canvasRef.current
    if (!drag || !canvas) {
      setDrag(null)
      return
    }

    const x = Math.min(drag.x0, drag.x1) * canvas.width
    const y = Math.min(drag.y0, drag.y1) * canvas.height
    const w = Math.abs(drag.x1 - drag.x0) * canvas.width
    const h = Math.abs(drag.y1 - drag.y0) * canvas.height
    setDrag(null)

    if (w < 12 || h < 12) return // an accidental click, not a crop

    const ratio = Math.min(1, CROP_MAX_WIDTH / w)
    const out = document.createElement('canvas')
    out.width = Math.round(w * ratio)
    out.height = Math.round(h * ratio)
    const context = out.getContext('2d')
    if (!context) return
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, out.width, out.height)
    context.drawImage(canvas, x, y, w, h, 0, 0, out.width, out.height)

    onAddScreenshot(pageNumber, out.toDataURL('image/jpeg', 0.9))
  }

  const dragBox = drag
    ? {
        left: `${Math.min(drag.x0, drag.x1) * 100}%`,
        top: `${Math.min(drag.y0, drag.y1) * 100}%`,
        width: `${Math.abs(drag.x1 - drag.x0) * 100}%`,
        height: `${Math.abs(drag.y1 - drag.y0) * 100}%`,
      }
    : null

  return (
    <div className="page-slot" ref={wrapperRef} data-page={pageNumber}>
      <div
        className="page-stage"
        ref={stageRef}
        style={{ width: size.width * scale, height: size.height * scale }}
      >
        <canvas ref={canvasRef} />

        <div className="highlight-layer">
          {highlights.map((highlight) =>
            highlight.rects.map((rect, index) => (
              <div
                key={`${highlight.id}-${index}`}
                className="highlight-rect"
                style={{
                  left: `${rect.x * 100}%`,
                  top: `${rect.y * 100}%`,
                  width: `${rect.w * 100}%`,
                  height: `${rect.h * 100}%`,
                }}
              />
            )),
          )}
        </div>

        <div className="textLayer" ref={textLayerRef} onMouseUp={captureSelection} />

        {cropMode && (
          <div
            className="crop-layer"
            onMouseDown={handleCropStart}
            onMouseMove={handleCropMove}
            onMouseUp={handleCropEnd}
            onMouseLeave={() => setDrag(null)}
          >
            {dragBox && <div className="crop-rect" style={dragBox} />}
          </div>
        )}

        {!rendered && (
          <div className="page-loading">
            <div className="spinner" />
          </div>
        )}
      </div>
      <span className="page-label">{pageNumber}</span>
    </div>
  )
}
