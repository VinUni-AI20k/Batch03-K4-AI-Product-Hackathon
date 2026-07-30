// ============================================
// VLearn Slide Viewer — PDF.js Integration
// Renders PDF to <canvas> with selectable text layer
// ============================================

// --- PDF.js Setup ---
const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

// --- State ---
let currentPage = 1;
let totalPages = 83;
let currentZoom = 100;
let currentPdfPath = '../data/vlearn-pack/slides/d1-slide-hackathon.pdf';
let pdfDoc = null;        // PDF.js document instance
let pageRendering = false;
let pageNumPending = null;
let currentPageTextContent = ''; // Extracted text of current page

// --- DOM References ---
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const textLayerDiv = document.getElementById('text-layer');
const loadingEl = document.getElementById('pdf-loading');
const slideFrame = document.getElementById('slide-aspect-frame');

// ============================================
// PDF.js Core Rendering
// ============================================

/**
 * Render a specific page of the loaded PDF onto the canvas
 * and create a text layer overlay for selection.
 */
async function renderPage(num) {
  pageRendering = true;
  showLoading(true);

  try {
    const page = await pdfDoc.getPage(num);

    // Calculate scale to fit within container width/height
    const containerWidth = slideFrame.clientWidth || 800;
    const containerHeight = slideFrame.clientHeight || 600;
    const unscaledViewport = page.getViewport({ scale: 1 });

    // Fit to container while respecting zoom
    const baseScale = Math.min(
      containerWidth / unscaledViewport.width,
      containerHeight / unscaledViewport.height
    );
    const scale = baseScale * (currentZoom / 100);
    const viewport = page.getViewport({ scale });

    // Set canvas dimensions (use devicePixelRatio for sharpness)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    canvas.style.width = viewport.width + 'px';
    canvas.style.height = viewport.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Render PDF page to canvas
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

    // --- Hide loading spinner IMMEDIATELY after canvas is ready ---
    pageRendering = false;
    showLoading(false);

    // --- Render Text Layer asynchronously in background ---
    setTimeout(async () => {
      try {
        textLayerDiv.innerHTML = '';
        textLayerDiv.style.width = viewport.width + 'px';
        textLayerDiv.style.height = viewport.height + 'px';

        const textContent = await page.getTextContent();
        currentPageTextContent = textContent.items.map(item => item.str).join(' ');

        if (pdfjsLib.TextLayer) {
          const textLayer = new pdfjsLib.TextLayer({
            textContentSource: textContent,
            container: textLayerDiv,
            viewport: viewport,
          });
          await textLayer.render();
        }
      } catch (tErr) {
        // Non-blocking text layer error
      }
    }, 20);

    // If another page was requested while rendering, render it now
    if (pageNumPending !== null) {
      const pendingPage = pageNumPending;
      pageNumPending = null;
      renderPage(pendingPage);
    }
  } catch (err) {
    console.error('Error rendering page:', err);
    pageRendering = false;
    showLoading(false);
  }
}

/**
 * Queue a page render (prevents overlapping renders)
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Load a PDF document from the given path
 */
async function loadPdfDocument(pdfPath) {
  showLoading(true);
  try {
    const loadingTask = pdfjsLib.getDocument({
      url: pdfPath,
      rangeChunkSize: 65536,
      disableAutoFetch: false,
      disableStream: false,
    });
    pdfDoc = await loadingTask.promise;
    totalPages = pdfDoc.numPages;

    // Update total pages in all UI elements
    document.querySelectorAll('.total-pages-count').forEach(el => el.textContent = totalPages);

    // Render thumbnail filmstrip track
    renderThumbnailsTrack(totalPages);

    // Render the first (or current) page
    queueRenderPage(currentPage);
  } catch (err) {
    console.error('Error loading PDF:', err);
    showLoading(false);
  }
}

function showLoading(show) {
  if (loadingEl) {
    loadingEl.style.display = show ? 'flex' : 'none';
  }
}

// ============================================
// Page Navigation & Thumbnails Logic
// ============================================

function prevSlidePage() {
  if (currentPage > 1) {
    currentPage--;
    updatePageUI();
    queueRenderPage(currentPage);
  }
}

function nextSlidePage() {
  if (currentPage < totalPages) {
    currentPage++;
    updatePageUI();
    queueRenderPage(currentPage);
  }
}

function goToSlidePage(num) {
  if (num >= 1 && num <= totalPages && num !== currentPage) {
    currentPage = num;
    updatePageUI();
    queueRenderPage(currentPage);
  }
}

function updatePageUI() {
  const curPgEl = document.getElementById('current-page-num');
  if (curPgEl) curPgEl.textContent = currentPage;

  const chipPgEl = document.getElementById('current-page-chip');
  if (chipPgEl) chipPgEl.textContent = currentPage;

  const tutorSlideEl = document.getElementById('tutor-slide-num');
  if (tutorSlideEl) tutorSlideEl.textContent = currentPage;

  const notesIndEl = document.getElementById('page-notes-indicator');
  if (notesIndEl) {
    const strokeCount = (pageDrawStrokes[currentPage] && pageDrawStrokes[currentPage].length > 0) ? pageDrawStrokes[currentPage].length : 0;
    notesIndEl.textContent = `Trang ${currentPage} · ${strokeCount} note`;
  }

  updateActiveThumbnail(currentPage);
  resizeDrawCanvas();
  updateNotesPanelUI();
}

// ============================================
// Left Sidebar Tabs & Personal Notes Engine
// ============================================

const pageTextNotes = {
  1: "Khái niệm nền tảng AI & LLM, mô hình tạo sinh GenAI."
};

function switchSidebarTab(tabName) {
  document.querySelectorAll('.sidebar-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.sidebar-panel').forEach(panel => panel.classList.remove('active'));

  const targetBtn = document.getElementById(`tab-btn-${tabName}`);
  const targetPanel = document.getElementById(`panel-${tabName}`);

  if (targetBtn) targetBtn.classList.add('active');
  if (targetPanel) targetPanel.classList.add('active');

  if (tabName === 'notes') {
    updateNotesPanelUI();
  }
}

function updateNotesPanelUI() {
  const pageNumEl = document.getElementById('note-editor-page-num');
  if (pageNumEl) pageNumEl.textContent = currentPage;

  const textareaInput = document.getElementById('note-textarea-input');
  if (textareaInput && document.activeElement !== textareaInput) {
    textareaInput.value = pageTextNotes[currentPage] || '';
  }

  renderSavedNotesList();
}

function autoSaveCurrentNote() {
  const textareaInput = document.getElementById('note-textarea-input');
  if (!textareaInput) return;

  const text = textareaInput.value.trim();
  if (text) {
    pageTextNotes[currentPage] = text;
  } else {
    delete pageTextNotes[currentPage];
  }

  const statusEl = document.getElementById('note-saved-status');
  if (statusEl) {
    statusEl.textContent = 'Đã lưu';
    setTimeout(() => {
      statusEl.textContent = 'Đã tự động lưu';
    }, 1200);
  }

  renderSavedNotesList();
}

function clearCurrentPageNote() {
  delete pageTextNotes[currentPage];
  const textareaInput = document.getElementById('note-textarea-input');
  if (textareaInput) textareaInput.value = '';
  renderSavedNotesList();
}

function renderSavedNotesList() {
  const container = document.getElementById('saved-notes-list');
  const counterEl = document.getElementById('saved-notes-counter');
  const badgeEl = document.getElementById('sidebar-notes-badge');
  if (!container) return;

  const pageKeys = Object.keys(pageTextNotes).map(Number).sort((a, b) => a - b);
  if (counterEl) counterEl.textContent = pageKeys.length;
  if (badgeEl) badgeEl.textContent = pageKeys.length;

  if (pageKeys.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:24px 12px;color:#94a3b8;font-size:0.75rem;">
        Chưa có ghi chú nào.<br>Hãy viết ghi chú ở trên để lưu lại!
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  pageKeys.forEach(pg => {
    const card = document.createElement('div');
    card.className = `saved-note-card ${pg === currentPage ? 'active' : ''}`;
    card.onclick = () => {
      goToSlidePage(pg);
    };
    card.innerHTML = `
      <div class="saved-note-card-title">📝 Slide Trang ${pg}</div>
      <div class="saved-note-card-text">${escapeHtml(pageTextNotes[pg])}</div>
    `;
    container.appendChild(card);
  });
}

function askTutorAboutNote() {
  const noteText = pageTextNotes[currentPage];
  if (!noteText) {
    alert('Hãy nhập nội dung ghi chú cho trang này trước khi hỏi AI!');
    return;
  }
  sendTutorMsgWithText(`Giải thích và tư vấn thêm dựa trên Ghi chú của tôi ở trang ${currentPage}: "${noteText}"`);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================
// Slide Tools (Đọc, Bút, Highlight, Tẩy & Đổi màu) & Freehand Drawing Engine
// ============================================

let currentSlideTool = 'read';
let currentPenColor = '#ef4444';
const pageDrawStrokes = {}; // Saves array of strokes per page
let isDrawing = false;
let currentStroke = null;

function setPenColor(color) {
  currentPenColor = color;
  document.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('active'));
  
  const dots = document.querySelectorAll('.color-dot');
  dots.forEach(dot => {
    if (dot.getAttribute('onclick') && dot.getAttribute('onclick').includes(color)) {
      dot.classList.add('active');
    }
  });

  if (currentSlideTool === 'read' || currentSlideTool === 'eraser') {
    setSlideTool('pen');
  }
}

function getDrawCanvas() {
  const dc = document.getElementById('draw-canvas');
  if (dc && dc.dataset.bound !== 'true') {
    dc.dataset.bound = 'true';
    dc.addEventListener('mousedown', startDrawing);
    dc.addEventListener('mousemove', drawMove);
    dc.addEventListener('mouseup', stopDrawing);
    dc.addEventListener('mouseleave', stopDrawing);

    dc.addEventListener('touchstart', startDrawing, { passive: false });
    dc.addEventListener('touchmove', drawMove, { passive: false });
    dc.addEventListener('touchend', stopDrawing);
  }
  return dc;
}

function setSlideTool(tool) {
  currentSlideTool = tool;
  
  // Toggle toolbar button active states
  document.querySelectorAll('.canvas-toolbar .tool-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-tool-${tool}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Toggle tool class on slide frame
  if (slideFrame) {
    slideFrame.classList.remove('tool-read', 'tool-pen', 'tool-highlight', 'tool-eraser');
    slideFrame.classList.add(`tool-${tool}`);
  }
  
  resizeDrawCanvas();
}

function resizeDrawCanvas() {
  const drawCanvas = getDrawCanvas();
  if (!drawCanvas || !canvas) return;
  drawCanvas.width = canvas.width;
  drawCanvas.height = canvas.height;
  drawCanvas.style.width = canvas.style.width;
  drawCanvas.style.height = canvas.style.height;
  redrawPageStrokes(currentPage);
}

function eraseStrokesAt(x, y) {
  const strokes = pageDrawStrokes[currentPage];
  if (!strokes || strokes.length === 0) return;

  const eraserRadius = 30;
  const initialCount = strokes.length;
  
  pageDrawStrokes[currentPage] = strokes.filter(stroke => {
    return !stroke.points.some(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      return (dx * dx + dy * dy) < (eraserRadius * eraserRadius);
    });
  });

  if (pageDrawStrokes[currentPage].length !== initialCount) {
    const notesIndEl = document.getElementById('page-notes-indicator');
    if (notesIndEl) {
      notesIndEl.textContent = `Trang ${currentPage} · ${pageDrawStrokes[currentPage].length} note`;
    }
    redrawPageStrokes(currentPage);
  }
}

function startDrawing(e) {
  if (currentSlideTool === 'read') return;
  const drawCanvas = getDrawCanvas();
  if (!drawCanvas) return;
  const drawCtx = drawCanvas.getContext('2d');
  if (!drawCtx) return;

  const rect = drawCanvas.getBoundingClientRect();
  const scaleX = drawCanvas.width / rect.width;
  const scaleY = drawCanvas.height / rect.height;
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  if (currentSlideTool === 'eraser') {
    isDrawing = true;
    eraseStrokesAt(x, y);
    return;
  }

  isDrawing = true;
  currentStroke = {
    tool: currentSlideTool,
    color: currentSlideTool === 'pen' ? currentPenColor : (currentPenColor + '66'),
    lineWidth: currentSlideTool === 'pen' ? 4 : 18,
    points: [{ x, y }]
  };
  
  if (!pageDrawStrokes[currentPage]) {
    pageDrawStrokes[currentPage] = [];
  }
  pageDrawStrokes[currentPage].push(currentStroke);
  
  const notesIndEl = document.getElementById('page-notes-indicator');
  if (notesIndEl) {
    notesIndEl.textContent = `Trang ${currentPage} · ${pageDrawStrokes[currentPage].length} note`;
  }

  drawCtx.beginPath();
  drawCtx.moveTo(x, y);
}

function drawMove(e) {
  if (!isDrawing) return;
  const drawCanvas = getDrawCanvas();
  if (!drawCanvas) return;
  
  e.preventDefault();
  
  const rect = drawCanvas.getBoundingClientRect();
  const scaleX = drawCanvas.width / rect.width;
  const scaleY = drawCanvas.height / rect.height;
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  if (currentSlideTool === 'eraser') {
    eraseStrokesAt(x, y);
    return;
  }
  
  if (currentStroke) {
    currentStroke.points.push({ x, y });
    redrawPageStrokes(currentPage);
  }
}

function stopDrawing() {
  isDrawing = false;
  currentStroke = null;
}

function redrawPageStrokes(pageNum) {
  const drawCanvas = getDrawCanvas();
  if (!drawCanvas) return;
  const drawCtx = drawCanvas.getContext('2d');
  if (!drawCtx) return;

  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  
  const strokes = pageDrawStrokes[pageNum] || [];
  strokes.forEach(stroke => {
    if (!stroke.points || stroke.points.length === 0) return;
    
    drawCtx.save();
    drawCtx.strokeStyle = stroke.color;
    drawCtx.lineWidth = stroke.lineWidth;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    
    drawCtx.beginPath();
    drawCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      drawCtx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    drawCtx.stroke();
    drawCtx.restore();
  });
}

function renderThumbnailsTrack(total) {
  const thumbTrack = document.getElementById('thumb-track');
  if (!thumbTrack) return;
  thumbTrack.innerHTML = '';

  for (let i = 1; i <= total; i++) {
    const card = document.createElement('div');
    card.className = `thumb-card ${i === currentPage ? 'active' : ''}`;
    card.id = `thumb-card-${i}`;
    card.setAttribute('onclick', `goToSlidePage(${i})`);
    card.innerHTML = `
      <canvas id="thumb-canvas-${i}" class="thumb-canvas"></canvas>
      <span class="thumb-badge">${i}</span>
    `;
    thumbTrack.appendChild(card);
  }

  // Asynchronously render real visual slide thumbnails on canvas
  setTimeout(() => {
    renderThumbnailPreviews();
  }, 100);
}

let renderingThumbs = false;
async function renderThumbnailPreviews() {
  if (!pdfDoc || renderingThumbs) return;
  renderingThumbs = true;

  try {
    const total = pdfDoc.numPages;
    for (let i = 1; i <= total; i++) {
      const c = document.getElementById(`thumb-canvas-${i}`);
      if (!c || c.dataset.rendered === 'true') continue;

      try {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.25 });
        
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        c.width = viewport.width * dpr;
        c.height = viewport.height * dpr;
        
        const ctx2d = c.getContext('2d');
        ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

        await page.render({
          canvasContext: ctx2d,
          viewport: viewport,
        }).promise;

        c.dataset.rendered = 'true';
      } catch (pErr) {
        // Individual page render catch
      }
    }
  } catch (err) {
    // Non-blocking thumbnail preview error
  } finally {
    renderingThumbs = false;
  }
}

function updateActiveThumbnail(pageNum) {
  document.querySelectorAll('.thumb-card').forEach(el => el.classList.remove('active'));
  const currentCard = document.getElementById(`thumb-card-${pageNum}`);
  const currentNumBadge = document.getElementById('thumb-current-num');
  if (currentNumBadge) currentNumBadge.textContent = pageNum;

  if (currentCard) {
    currentCard.classList.add('active');
    currentCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function toggleThumbnailsBar() {
  const thumbBar = document.getElementById('slide-thumbnails-bar');
  if (thumbBar) {
    thumbBar.classList.toggle('collapsed');
  }
}

// ============================================
// Zoom
// ============================================

function zoomSlide(delta) {
  currentZoom = Math.min(200, Math.max(50, currentZoom + delta));
  const zoomEl = document.getElementById('zoom-value');
  if (zoomEl) zoomEl.textContent = currentZoom + '%';
  queueRenderPage(currentPage);
}

// ============================================
// Load another PDF (sidebar click)
// ============================================

function loadPdf(pdfPath, docName, totalPgs) {
  currentPdfPath = pdfPath;
  currentPage = 1;

  const docTitleEl = document.getElementById('current-doc-title');
  if (docTitleEl) docTitleEl.textContent = docName;

  const docWatermarkEl = document.getElementById('doc-watermark-id');
  if (docWatermarkEl) docWatermarkEl.textContent = docName;

  updatePageUI();

  // Update active doc state in sidebar
  document.querySelectorAll('.doc-item').forEach(item => item.classList.remove('active'));
  if (typeof event !== 'undefined' && event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }

  loadPdfDocument(pdfPath);
}

// ============================================
// Download PDF
// ============================================

function downloadPdf() {
  const a = document.createElement('a');
  a.href = currentPdfPath;
  const docTitleEl = document.getElementById('current-doc-title');
  a.download = docTitleEl ? docTitleEl.textContent : 'slide.pdf';
  a.click();
}

// ============================================
// VLearn Tutor AI Panel (Toggle)
// ============================================

function toggleTutorPanel() {
  const panel = document.querySelector('.tutor-panel');
  const btn = document.getElementById('btn-toggle-tutor');
  const layout = document.querySelector('.viewer-layout');
  if (panel) {
    const isCollapsed = panel.classList.toggle('collapsed');
    if (layout) {
      if (isCollapsed) layout.classList.add('slide-layout-expanded');
      else layout.classList.remove('slide-layout-expanded');
    }
    if (btn) {
      if (isCollapsed) {
        btn.classList.remove('active');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.96 9.96 0 0 1-4.587-1.112l-3.826 1.07a1 1 0 0 1-1.235-1.236l1.07-3.825A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2z"/></svg> <span>Mở VLearn Tutor</span>';
        btn.setAttribute('title', 'Mở cửa sổ VLearn Tutor AI');
      } else {
        btn.classList.add('active');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.96 9.96 0 0 1-4.587-1.112l-3.826 1.07a1 1 0 0 1-1.235-1.236l1.07-3.825A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2z"/></svg> <span>VLearn Tutor</span>';
        btn.setAttribute('title', 'Đóng cửa sổ VLearn Tutor AI');
      }
    }
    // Re-render after layout shift to fit new container width
    setTimeout(() => queueRenderPage(currentPage), 350);
  }
}

// ============================================
// Chat / Tutor Messages
// ============================================

function sendTutorMsg(e) {
  e.preventDefault();
  const input = document.getElementById('tutor-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const chatBody = document.getElementById('tutor-chat-body');
  if (!chatBody) return;

  // Append context tag
  const userTag = document.createElement('div');
  userTag.className = 'chat-context-tag';
  userTag.textContent = `Ngữ cảnh: Slide trang ${currentPage}`;
  chatBody.appendChild(userTag);

  // Append user message
  const userMsg = document.createElement('div');
  userMsg.className = 'tutor-msg user';
  userMsg.textContent = text;
  chatBody.appendChild(userMsg);

  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // Simulate Tutor response with extracted page content
  setTimeout(() => {
    const contextTag = document.createElement('div');
    contextTag.className = 'chat-context-tag';
    contextTag.textContent = `Ngữ cảnh: Slide trang ${currentPage}`;
    chatBody.appendChild(contextTag);

    const botMsg = document.createElement('div');
    botMsg.className = 'tutor-msg assistant';

    // Use extracted page text for smarter mock response
    const pagePreview = currentPageTextContent.substring(0, 200);
    botMsg.innerHTML = `<strong>📄 Dựa trên nội dung trang ${currentPage}:</strong><br><br>` +
      `<em>"${pagePreview}..."</em><br><br>` +
      `VLearn Tutor đã nhận được câu hỏi: "<strong>${text}</strong>". ` +
      `Nội dung trang này đã được trích xuất thành công qua PDF.js và sẵn sàng để AI phân tích chi tiết.`;

    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 800);
}

function sendTutorMsgWithText(text) {
  const panel = document.querySelector('.tutor-panel');
  if (panel && panel.classList.contains('collapsed')) {
    toggleTutorPanel();
  }
  const input = document.getElementById('tutor-input');
  if (input) {
    input.value = text;
    const form = document.getElementById('tutor-form');
    if (form) {
      const event = new Event('submit', { cancelable: true });
      form.dispatchEvent(event);
    }
  }
}

function askTutorAboutCurrentSlide() {
  sendTutorMsgWithText(`Tóm tắt nội dung slide trang ${currentPage} cho tôi`);
}

// ============================================
// Text Selection on Slide → Floating Tooltip
// ============================================

const selectionTooltip = document.getElementById('selection-tooltip');
let selectedText = '';

document.addEventListener('mouseup', (e) => {
  // Only handle selections within the text layer
  const sel = window.getSelection();
  const text = sel ? sel.toString().trim() : '';

  if (text.length > 2 && textLayerDiv.contains(sel.anchorNode)) {
    selectedText = text;

    // Position the tooltip near the selection
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    selectionTooltip.style.top = (rect.top - 48 + window.scrollY) + 'px';
    selectionTooltip.style.left = (rect.left + rect.width / 2) + 'px';
    selectionTooltip.classList.add('visible');
  } else {
    // If click is outside tooltip, hide it
    if (!selectionTooltip.contains(e.target)) {
      selectionTooltip.classList.remove('visible');
      selectedText = '';
    }
  }
});

// Tooltip button handlers
document.getElementById('btn-ask-selection').addEventListener('click', () => {
  if (selectedText) {
    sendTutorMsgWithText(`Hỏi về đoạn này (trang ${currentPage}): "${selectedText}"`);
    selectionTooltip.classList.remove('visible');
    window.getSelection().removeAllRanges();
  }
});

document.getElementById('btn-explain-selection').addEventListener('click', () => {
  if (selectedText) {
    sendTutorMsgWithText(`Giải thích chi tiết đoạn sau (trang ${currentPage}): "${selectedText}"`);
    selectionTooltip.classList.remove('visible');
    window.getSelection().removeAllRanges();
  }
});

document.getElementById('btn-summarize-selection').addEventListener('click', () => {
  if (selectedText) {
    sendTutorMsgWithText(`Tóm tắt đoạn sau (trang ${currentPage}): "${selectedText}"`);
    selectionTooltip.classList.remove('visible');
    window.getSelection().removeAllRanges();
  }
});

// ============================================
// Keyboard Navigation
// ============================================

document.addEventListener('keydown', (e) => {
  // Don't intercept if user is typing in input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    prevSlidePage();
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    nextSlidePage();
  }
});

// ============================================
// Window Resize → Re-render
// ============================================

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (pdfDoc) queueRenderPage(currentPage);
  }, 250);
});

// ============================================
// Expose functions to global scope (for onclick in HTML)
// ============================================

window.toggleTutorPanel = toggleTutorPanel;
window.prevSlidePage = prevSlidePage;
window.nextSlidePage = nextSlidePage;
window.zoomSlide = zoomSlide;
window.downloadPdf = downloadPdf;
window.loadPdf = loadPdf;
window.sendTutorMsg = sendTutorMsg;
window.askTutorAboutCurrentSlide = askTutorAboutCurrentSlide;
window.toggleThumbnailsBar = toggleThumbnailsBar;
window.goToSlidePage = goToSlidePage;
window.setSlideTool = setSlideTool;
window.setPenColor = setPenColor;
window.switchSidebarTab = switchSidebarTab;
window.autoSaveCurrentNote = autoSaveCurrentNote;
window.clearCurrentPageNote = clearCurrentPageNote;
window.askTutorAboutNote = askTutorAboutNote;

// ============================================
// Initial Load
// ============================================

loadPdfDocument(currentPdfPath);
