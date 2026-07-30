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

    // Calculate scale to fit within container width
    const containerWidth = slideFrame.clientWidth;
    const containerHeight = slideFrame.clientHeight;
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

    // --- Text Layer (for selection / bôi đen) ---
    textLayerDiv.innerHTML = '';
    textLayerDiv.style.width = viewport.width + 'px';
    textLayerDiv.style.height = viewport.height + 'px';

    const textContent = await page.getTextContent();
    
    // Store raw text for AI Tutor context
    currentPageTextContent = textContent.items.map(item => item.str).join(' ');

    // Render text layer using PDF.js TextLayer API
    const textLayer = new pdfjsLib.TextLayer({
      textContentSource: textContent,
      container: textLayerDiv,
      viewport: viewport,
    });
    await textLayer.render();

    pageRendering = false;
    showLoading(false);

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
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    pdfDoc = await loadingTask.promise;
    totalPages = pdfDoc.numPages;

    // Update total pages in all UI elements
    document.querySelectorAll('.total-pages-count').forEach(el => el.textContent = totalPages);

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
// Page Navigation
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

function updatePageUI() {
  const curPgEl = document.getElementById('current-page-num');
  if (curPgEl) curPgEl.textContent = currentPage;

  const chipPgEl = document.getElementById('current-page-chip');
  if (chipPgEl) chipPgEl.textContent = currentPage;

  const tutorSlideEl = document.getElementById('tutor-slide-num');
  if (tutorSlideEl) tutorSlideEl.textContent = currentPage;
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

// ============================================
// Initial Load
// ============================================

loadPdfDocument(currentPdfPath);
